import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { brand } from "@/data/content";
import { toDate } from "@/lib/runtime";
import { format } from "date-fns";
import {
  notify,
  notificationState,
  requestNotificationPermission,
  registerServiceWorker,
  type NotificationState,
} from "@/lib/pwa";
import { registerPatientForPush } from "@/lib/push";
import {
  Bell,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

type StatusDoc = {
  submissionId: string;
  firstName?: string;
  phoneLast4?: string;
  status?: "new" | "in_review" | "completed";
  verificationStatus?: "pending" | "verified" | "not_verified";
  submittedAt?: unknown;
  updatedAt?: unknown;
};

type Result =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "found"; doc: StatusDoc }
  | { kind: "notfound" }
  | { kind: "mismatch" }
  | { kind: "error" };

/** Digits only, last ten — matches how the assessment schema stores a phone. */
const normalisePhone = (v: string) => v.replace(/\D/g, "").slice(-10);

/** References are shown to patients as the first 8 characters, uppercased. */
const normaliseRef = (v: string) => v.trim().toLowerCase();

const STEPS = [
  {
    key: "received",
    title: "Application received",
    body: "Your assessment is with the clinic.",
  },
  {
    key: "payment",
    title: "Payment verified",
    body: "We check your screenshot against our records.",
  },
  {
    key: "review",
    title: "Under review",
    body: "Dt. Sai Sowjanya reads your history and nutrition log in full.",
  },
  {
    key: "done",
    title: "Consultation scheduled",
    body: "We contact you on the number you gave us to book a time.",
  },
] as const;

export default function TrackPage({ initialRef = "" }: { initialRef?: string }) {
  const [phone, setPhone] = useState("");
  const [reference, setReference] = useState(initialRef);
  const [result, setResult] = useState<Result>({ kind: "idle" });

  // Remember the reference from this device's own submission, so someone
  // coming back later does not have to find it again.
  useEffect(() => {
    if (initialRef) {
      setReference(initialRef);
      return;
    }
    try {
      const saved = localStorage.getItem("gr_last_reference");
      if (saved) setReference(saved);
    } catch {
      /* private mode */
    }
  }, [initialRef]);

  const lookup = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const p = normalisePhone(phone);
      const r = normaliseRef(reference);
      if (p.length !== 10 || r.length < 6) return;

      setResult({ kind: "loading" });
      try {
        /*
         * Read the minimal public status record, never the assessment itself.
         * The assessment holds medical history, an address and a payment
         * screenshot, none of which may reach an anonymous reader.
         *
         * The document id is the reference, so this is a direct get -- the
         * collection is not listable, which is what prevents someone walking
         * it to discover who has booked.
         */
        const snap = await getDoc(doc(db, "assessmentStatus", r));
        if (!snap.exists()) {
          setResult({ kind: "notfound" });
          return;
        }
        const data = snap.data() as StatusDoc;
        // The phone is a check, not a key: it confirms the person asking is
        // the person who submitted.
        if ((data.phoneLast4 ?? "") !== p.slice(-4)) {
          setResult({ kind: "mismatch" });
          return;
        }
        setResult({ kind: "found", doc: data });
        setWatching(r);
      } catch {
        setResult({ kind: "error" });
      }
    },
    [phone, reference],
  );

  /*
   * Watch the record after a successful lookup.
   *
   * Two things depend on this: the page updates itself the moment the practice
   * verifies a payment or moves the application on, and -- if the patient has
   * allowed notifications -- they are told about it without refreshing.
   *
   * Delivery when this page is CLOSED needs the Cloud Function in functions/
   * to be deployed; this covers the page being open or backgrounded.
   */
  const [watching, setWatching] = useState<string | null>(null);
  const lastSeen = useRef<{ status?: string; verificationStatus?: string } | null>(null);

  useEffect(() => {
    if (!watching) return;
    return onSnapshot(
      doc(db, "assessmentStatus", watching),
      (snap) => {
        if (!snap.exists()) return;
        const next = snap.data() as StatusDoc;
        setResult((prev) => (prev.kind === "found" ? { kind: "found", doc: next } : prev));

        const before = lastSeen.current;
        lastSeen.current = {
          ...(next.status !== undefined && { status: next.status }),
          ...(next.verificationStatus !== undefined && {
            verificationStatus: next.verificationStatus,
          }),
        };
        if (!before) return; // first snapshot is the current state, not a change

        if (before.verificationStatus !== next.verificationStatus) {
          void notify({
            title:
              next.verificationStatus === "verified"
                ? "Payment verified"
                : next.verificationStatus === "not_verified"
                  ? "Payment needs attention"
                  : "Payment status updated",
            body:
              next.verificationStatus === "verified"
                ? "Your payment has been confirmed. Your assessment is with the clinic."
                : next.verificationStatus === "not_verified"
                  ? "We couldn't match your payment. Message the clinic and we'll sort it out."
                  : "The status of your payment has changed.",
            url: `/track?ref=${watching}`,
            tag: `status-${watching}`,
          });
        } else if (before.status !== next.status) {
          void notify({
            title:
              next.status === "completed"
                ? "Consultation scheduled"
                : "Your assessment is in review",
            body:
              next.status === "completed"
                ? "The clinic has been in touch to book your consultation."
                : "Dt. Sai Sowjanya is reviewing your assessment.",
            url: `/track?ref=${watching}`,
            tag: `status-${watching}`,
          });
        }
      },
      (err) => console.error("Status updates stopped:", err),
    );
  }, [watching]);

  /** Ask for permission, then register this device against the application. */
  const [alertState, setAlertState] = useState<NotificationState>("default");
  useEffect(() => setAlertState(notificationState()), []);

  const enableAlerts = useCallback(async () => {
    await registerServiceWorker();
    const granted = await requestNotificationPermission();
    setAlertState(granted);
    if (granted === "granted" && watching) {
      await registerPatientForPush(watching);
    }
  }, [watching]);

  // Auto-run when arriving with a reference AND a remembered phone is typed.
  const canSubmit = normalisePhone(phone).length === 10 && normaliseRef(reference).length >= 6;

  const stageOf = (d: StatusDoc) => {
    if (d.status === "completed") return 3;
    if (d.status === "in_review") return 2;
    if (d.verificationStatus === "verified") return 1;
    return 0;
  };

  return (
    <div className="af-track-page">
      <div className="container-narrow">
        <p className="fs-eyebrow af-track-eyebrow">Application status</p>
        <h1 className="fs-h2 af-track-title">Track your assessment.</h1>
        <p className="fs-sub af-track-lede">
          Enter the phone number you applied with and the reference from your confirmation screen.
        </p>

        <form className="af-track-form" onSubmit={lookup} noValidate>
          <div className="af-track-field">
            <label htmlFor="track-phone">Phone number</label>
            <input
              id="track-phone"
              className="af-control"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="af-track-field">
            <label htmlFor="track-ref">Reference</label>
            <input
              id="track-ref"
              className="af-control"
              type="text"
              autoCapitalize="characters"
              placeholder="e.g. FC941565"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <button type="submit" className="af-track-submit" disabled={!canSubmit}>
            {result.kind === "loading" ? (
              <>
                <Loader2 size={17} className="af-autosave-anim-spin" />
                Checking…
              </>
            ) : (
              <>
                <Search size={17} />
                Check status
              </>
            )}
          </button>
        </form>

        {result.kind === "notfound" && (
          <div className="af-track-msg af-track-msg--warn" role="status">
            <AlertCircle size={17} />
            <div>
              We couldn't find an application with that reference. Check it against your
              confirmation screen — it's the eight characters shown after you submitted.
            </div>
          </div>
        )}

        {result.kind === "mismatch" && (
          <div className="af-track-msg af-track-msg--warn" role="status">
            <AlertCircle size={17} />
            <div>
              That reference exists, but the phone number doesn't match the one on the application.
              Please use the number you applied with.
            </div>
          </div>
        )}

        {result.kind === "error" && (
          <div className="af-track-msg af-track-msg--warn" role="status">
            <AlertCircle size={17} />
            <div>Something went wrong checking your status. Please try again in a moment.</div>
          </div>
        )}

        {result.kind === "found" && (
          <div className="af-track-result">
            <div className="af-track-result-head">
              <div>
                <p className="af-track-result-name">
                  {result.doc.firstName ? `Hello, ${result.doc.firstName}.` : "Your application"}
                </p>
                <p className="af-track-result-meta">
                  Reference {result.doc.submissionId.slice(0, 8).toUpperCase()}
                  {(() => {
                    const dt = toDate(result.doc.submittedAt as never);
                    return dt && !Number.isNaN(dt.getTime())
                      ? ` · submitted ${format(dt, "d MMM yyyy")}`
                      : "";
                  })()}
                </p>
              </div>
              {result.doc.verificationStatus === "not_verified" ? (
                <span className="af-pay-chip af-pay-chip--unverified">
                  <XCircle size={13} /> Payment needs attention
                </span>
              ) : result.doc.verificationStatus === "verified" ? (
                <span className="af-pay-chip af-pay-chip--verified">
                  <CheckCircle2 size={13} /> Payment verified
                </span>
              ) : (
                <span className="af-pay-chip af-pay-chip--pending">
                  <Clock size={13} /> Payment pending
                </span>
              )}
            </div>

            {result.doc.verificationStatus === "not_verified" && (
              <div className="af-track-msg af-track-msg--warn" style={{ marginTop: 18 }}>
                <AlertCircle size={17} />
                <div>
                  We couldn't match your payment screenshot to a payment. Message us and we'll sort
                  it out — your assessment is safe.
                </div>
              </div>
            )}

            <ol className="af-track-steps">
              {STEPS.map((s, i) => {
                const stage = stageOf(result.doc);
                const state = i < stage ? "done" : i === stage ? "current" : "todo";
                return (
                  <li key={s.key} className={`af-track-step af-track-step--${state}`}>
                    <span className="af-track-step-dot" aria-hidden="true">
                      {state === "done" ? <CheckCircle2 size={16} /> : <span />}
                    </span>
                    <div>
                      <p className="af-track-step-title">{s.title}</p>
                      <p className="af-track-step-body">{s.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Alerts. Hidden once granted — there is nothing left to offer. */}
            {alertState !== "granted" && alertState !== "unsupported" && (
              <button
                type="button"
                className="af-track-alerts"
                onClick={enableAlerts}
                disabled={alertState === "denied"}
              >
                <Bell size={16} />
                {alertState === "denied"
                  ? "Notifications are blocked in your browser"
                  : "Notify me when this changes"}
              </button>
            )}

            <div className="af-track-actions">
              <a
                href={`https://wa.me/${brand.phoneRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="af-track-wa"
              >
                <MessageCircle size={17} />
                Message the clinic
              </a>
              <Link to="/" className="af-track-home">
                Back to home
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}

        <p className="af-track-help">
          Lost your reference? Message us on{" "}
          <a href={`https://wa.me/${brand.phoneRaw}`} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>{" "}
          and we'll look it up for you.
        </p>
      </div>
    </div>
  );
}
