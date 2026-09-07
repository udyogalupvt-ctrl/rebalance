import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { FirestoreDate } from "@/types/admin";
import type { LeadDoc } from "./leads";

/**
 * Reusable WhatsApp follow-up messages.
 *
 * The practice sends the same handful of messages over and over — a first
 * hello, a nudge after no reply, a payment link, a reschedule. Retyping them
 * is where personalisation errors creep in (the wrong name, the wrong
 * condition), so templates carry placeholders that are filled from the lead's
 * own record at send time.
 *
 * Templates live in Firestore rather than in this file so the practice can
 * add their own without a deploy. The built-ins below are the starting set
 * and are merged in at read time; they cannot be deleted, only ignored.
 */

export type MessageTemplate = {
  id: string;
  title: string;
  body: string;
  order?: number;
  /** True for the shipped defaults, which are not stored in Firestore. */
  builtIn?: boolean;
  createdAt?: FirestoreDate;
  updatedAt?: FirestoreDate;
};

/** The placeholders a template may use, and what each one means. */
export const PLACEHOLDERS: { token: string; label: string }[] = [
  { token: "{name}", label: "Their first name" },
  { token: "{fullName}", label: "Their full name" },
  { token: "{concern}", label: "The health concern they gave" },
  { token: "{practitioner}", label: "Dt. N. Sai Sowjanya" },
  { token: "{clinic}", label: "GoRebalance" },
];

export const BUILT_IN_TEMPLATES: MessageTemplate[] = [
  {
    id: "builtin-first-contact",
    title: "First contact",
    builtIn: true,
    body: "Hi {name}, this is {clinic} — thank you for reaching out about {concern}. {practitioner} has your request. When would be a good time for a short call this week?",
  },
  {
    id: "builtin-no-answer",
    title: "Tried to call, no answer",
    builtIn: true,
    body: "Hi {name}, we tried calling you just now about your consultation with {practitioner}. Could you let us know a time that suits you better? Happy to work around your schedule.",
  },
  {
    id: "builtin-abandoned-form",
    title: "Started the form, didn't finish",
    builtIn: true,
    body: "Hi {name}, we noticed you started booking a consultation with {clinic} but didn't finish. No pressure at all — if you have any questions about how the programme works for {concern}, just reply here and we'll answer them.",
  },
  {
    id: "builtin-booking-confirm",
    title: "Consultation confirmed",
    builtIn: true,
    body: "Hi {name}, your consultation with {practitioner} is confirmed. Please keep any recent reports handy, and note down what you've eaten for the last two days — it makes the first session far more useful.",
  },
  {
    id: "builtin-assessment-nudge",
    title: "Please complete the assessment",
    builtIn: true,
    body: "Hi {name}, before your consultation could you fill in the GoRebalance assessment? It takes about 10 minutes and lets {practitioner} come to the call already understanding your history: https://gorebalance.in/assessment",
  },
  {
    id: "builtin-check-in",
    title: "Checking in",
    builtIn: true,
    body: "Hi {name}, just checking in from {clinic}. Are you still looking for help with {concern}? We're here whenever you're ready.",
  },
];

/** Fill a template's placeholders from a lead. */
export function renderTemplate(
  body: string,
  lead: Pick<LeadDoc, "name" | "concern">,
  practitioner: string,
  clinic: string,
): string {
  const full = (lead.name ?? "").trim();
  const first = full.split(/\s+/)[0] ?? "";
  return body
    .replaceAll("{name}", first || "there")
    .replaceAll("{fullName}", full || "there")
    .replaceAll("{concern}", (lead.concern ?? "").trim() || "your health")
    .replaceAll("{practitioner}", practitioner)
    .replaceAll("{clinic}", clinic);
}

/** Live list of templates: the built-ins first, then the practice's own. */
export function subscribeToTemplates(
  onData: (templates: MessageTemplate[]) => void,
  onError?: (err: unknown) => void,
) {
  // Show the built-ins immediately; Firestore may be slow or unreachable.
  onData([...BUILT_IN_TEMPLATES]);

  return onSnapshot(
    query(collection(db, "messageTemplates"), orderBy("order", "asc")),
    (snap) => {
      const saved = snap.docs.map((d) => ({ ...d.data(), id: d.id }) as MessageTemplate);
      onData([...BUILT_IN_TEMPLATES, ...saved]);
    },
    (err) => {
      // A missing composite index or an offline client must not empty the
      // list — the built-ins are still perfectly usable.
      onData([...BUILT_IN_TEMPLATES]);
      onError?.(err);
    },
  );
}

export async function saveTemplate(
  template: Pick<MessageTemplate, "title" | "body"> & { id?: string; order?: number },
): Promise<string> {
  const id = template.id || `tpl_${Date.now()}`;
  await setDoc(
    doc(db, "messageTemplates", id),
    {
      id,
      title: template.title.trim(),
      body: template.body.trim(),
      order: template.order ?? Date.now(),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
  return id;
}

export async function deleteTemplate(id: string): Promise<void> {
  await deleteDoc(doc(db, "messageTemplates", id));
}

/** wa.me deep link with the message pre-filled. */
export function whatsAppLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  return `tel:+${withCountry}`;
}
