import type { FirestoreDate } from "@/types/admin";

/**
 * Firebase is loaded on demand.
 *
 * The booking dialog is mounted on every marketing page (one instance, from
 * BookingProvider), so a static import here would put the 145 kB gzipped
 * Firebase SDK back on the critical path of the home page — which is exactly
 * what cms-public.ts was split out to avoid. Nothing here runs until somebody
 * has typed a name and a phone number, by which point a background fetch has
 * had plenty of time.
 */
async function firestore() {
  const [fs, { db }] = await Promise.all([import("firebase/firestore"), import("./firebase")]);
  return { ...fs, db };
}

/**
 * Consultation leads, with partial capture.
 *
 * The problem this solves: someone types their name and their phone number
 * into the booking form, then hesitates and closes the tab. Under a
 * submit-only model that person is invisible — and they are precisely the
 * person worth calling, because they were one field away from booking.
 *
 * So the document is written as soon as there is something worth calling
 * back (a name plus a plausible phone number), and updated in place as the
 * rest of the form is filled in. `status` records how far they got:
 *
 *   "partial"   started, never pressed submit — follow up manually
 *   "new"       submitted, not yet actioned by the practice
 *
 * One document per form session, keyed by a client-generated id held in
 * component state, so typing more never creates duplicates.
 */

export type LeadStatus = "partial" | "new";

/** Where the practice is with this person. Drives the admin pipeline. */
export type FollowUpStatus =
  | "new"
  | "attempted"
  | "contacted"
  | "consultation_booked"
  | "converted"
  | "not_interested"
  | "no_response";

export const FOLLOW_UP_STATUSES: {
  value: FollowUpStatus;
  label: string;
  /** Token name for the pill colour. */
  tone: "neutral" | "amber" | "blue" | "violet" | "green" | "red";
}[] = [
  { value: "new", label: "New", tone: "blue" },
  { value: "attempted", label: "Tried to reach", tone: "amber" },
  { value: "contacted", label: "Spoke to them", tone: "violet" },
  { value: "consultation_booked", label: "Consultation booked", tone: "green" },
  { value: "converted", label: "Converted", tone: "green" },
  { value: "no_response", label: "No response", tone: "neutral" },
  { value: "not_interested", label: "Not interested", tone: "red" },
];

export type LeadNote = {
  id: string;
  text: string;
  at: string;
  by: string;
};

export type ContactLogEntry = {
  id: string;
  channel: "call" | "whatsapp";
  at: string;
  by: string;
  /** For WhatsApp, the message that was opened. */
  detail?: string;
};

export type LeadDoc = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  gender?: string;
  concern?: string;
  source?: string;
  status?: LeadStatus;
  createdAt?: FirestoreDate;
  updatedAt?: FirestoreDate;
  submittedAt?: FirestoreDate | null;
  followUpStatus?: FollowUpStatus;
  notes?: LeadNote[];
  contactLog?: ContactLogEntry[];
  lastContactAt?: FirestoreDate | null;
  /** Free-text summary the practice keeps at the top of the record. */
  summary?: string;
  userAgent?: string;
  /** Which fields the visitor had filled when they abandoned. */
  furthestField?: string;
};

export type LeadDraft = {
  name?: string;
  phone?: string;
  email?: string;
  gender?: string;
  concern?: string;
};

/** Indian mobile numbers are ten digits; accept a leading 0 or +91. */
export function normalisePhone(raw: string): string {
  return raw.replace(/[^\d]/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
}

export function isUsablePhone(raw: string | undefined): boolean {
  if (!raw) return false;
  return /^[6-9]\d{9}$/.test(normalisePhone(raw));
}

/** Enough to be worth a callback: a name we can greet and a number to ring. */
export function isWorthCapturing(draft: LeadDraft): boolean {
  return (draft.name ?? "").trim().length >= 2 && isUsablePhone(draft.phone);
}

function clean(draft: LeadDraft) {
  return {
    name: (draft.name ?? "").trim(),
    phone: normalisePhone(draft.phone ?? ""),
    email: (draft.email ?? "").trim(),
    gender: draft.gender ?? "",
    concern: (draft.concern ?? "").trim(),
  };
}

/**
 * Write (or refresh) the partial record.
 *
 * Never rejects: a lead we could not save must not stop the visitor from
 * finishing the form, and it must not surface a scary error either.
 */
export async function savePartialLead(
  leadId: string,
  draft: LeadDraft,
  source: string,
  furthestField: string,
): Promise<void> {
  try {
    const { doc, setDoc, serverTimestamp, db } = await firestore();
    await setDoc(
      doc(db, "leads", leadId),
      {
        ...clean(draft),
        id: leadId,
        source,
        status: "partial" as LeadStatus,
        furthestField,
        followUpStatus: "new" as FollowUpStatus,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch {
    /* Offline, blocked, or rules changed. The form carries on regardless. */
  }
}

/**
 * How long to wait for Firestore to acknowledge the submission.
 *
 * `setDoc` resolves only when the BACKEND has committed the write. On a weak
 * mobile connection — which is most of this practice's traffic — that promise
 * can stay pending for minutes while the SDK retries in the background, and
 * the visitor sits watching a spinner on a form they have already filled in.
 *
 * After this long we stop waiting and move on. The write is not abandoned:
 * the SDK keeps retrying it for the life of the page, and the visitor is
 * handed straight to WhatsApp, which is the channel the practice actually
 * replies on. Both paths lead to the same conversation.
 */
const SUBMIT_TIMEOUT_MS = 8000;

/**
 * Promote the record to a real submission.
 *
 * Rejects only on a genuine failure (rules, malformed data). A slow network
 * resolves rather than rejecting — see SUBMIT_TIMEOUT_MS.
 */
export async function submitLead(leadId: string, draft: LeadDraft, source: string): Promise<void> {
  const { doc, setDoc, serverTimestamp, db } = await firestore();

  const write = setDoc(
    doc(db, "leads", leadId),
    {
      ...clean(draft),
      id: leadId,
      source,
      status: "new" as LeadStatus,
      furthestField: "submitted",
      followUpStatus: "new" as FollowUpStatus,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      submittedAt: serverTimestamp(),
    },
    { merge: true },
  );

  // Swallow a late rejection so it cannot surface as an unhandled rejection
  // after we have already resolved on the timeout.
  write.catch(() => {});

  await Promise.race([
    write,
    new Promise<void>((resolve) => setTimeout(resolve, SUBMIT_TIMEOUT_MS)),
  ]);
}

/** Build the wa.me deep link the visitor is handed after submitting. */
export function buildWhatsAppHandoff(draft: LeadDraft, practiceNumber: string): string {
  const bits = [
    `Hi GoRebalance, I'd like to book a consultation.`,
    draft.name ? `Name: ${draft.name.trim()}` : "",
    draft.concern ? `Main concern: ${draft.concern.trim()}` : "",
  ].filter(Boolean);
  return `https://wa.me/${practiceNumber}?text=${encodeURIComponent(bits.join("\n"))}`;
}
