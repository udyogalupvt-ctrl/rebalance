import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Check, Loader2, ShieldCheck, Clock, PhoneCall, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/data/content";
import { setScrollLocked } from "@/components/shared/SmoothScroll";
import {
  buildWhatsAppHandoff,
  isUsablePhone,
  isWorthCapturing,
  normalisePhone,
  savePartialLead,
  submitLead,
  type LeadDraft,
} from "@/lib/leads";
import { errorMessage } from "@/lib/runtime";

const GENDERS = ["Female", "Male", "Other"] as const;

const EMPTY: LeadDraft = { name: "", gender: "", phone: "", email: "", concern: "" };

type Errors = Partial<Record<keyof LeadDraft, string>>;

/**
 * "Book your free consultation".
 *
 * Two behaviours that are easy to miss from the outside:
 *
 * 1. PARTIAL CAPTURE. As soon as there is a name and a real phone number the
 *    record is written to Firestore, and refreshed as more is typed. Someone
 *    who fills in half the form and closes the tab still reaches the practice
 *    as a "started, didn't finish" lead — see src/lib/leads.ts.
 *
 * 2. WHATSAPP HANDOFF. On success we open wa.me in a new tab, pre-filled.
 *    That happens inside the click handler's own task and NOT after an await,
 *    because a popup opened after an await has lost its user-gesture and is
 *    blocked. The window is opened first and its location set once the write
 *    resolves.
 */
export function BookingDialog({
  open,
  onOpenChange,
  source = "hero-booking",
  /** Pre-fill the concern, e.g. when opened from a treatment card. */
  presetConcern,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
  presetConcern?: string;
}) {
  const reduce = useReducedMotion();
  const [draft, setDraft] = React.useState<LeadDraft>(() => ({
    ...EMPTY,
    concern: presetConcern ?? "",
  }));
  const [errors, setErrors] = React.useState<Errors>({});
  const [phase, setPhase] = React.useState<"form" | "saving" | "done">("form");
  const [submitError, setSubmitError] = React.useState("");

  // One id per dialog session, so repeated keystrokes update one document
  // instead of littering the collection.
  const leadIdRef = React.useRef<string>("");
  if (!leadIdRef.current && typeof crypto !== "undefined") {
    leadIdRef.current = crypto.randomUUID();
  }
  const capturedRef = React.useRef(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Radix locks the body, but Lenis drives the scroll offset itself and would
  // keep the page moving behind the panel.
  React.useEffect(() => {
    setScrollLocked(open);
    return () => setScrollLocked(false);
  }, [open]);

  React.useEffect(() => {
    if (open) return;
    // Reset only after the exit animation, so the panel does not visibly
    // empty itself on the way out.
    const t = setTimeout(() => {
      setDraft({ ...EMPTY, concern: presetConcern ?? "" });
      setErrors({});
      setPhase("form");
      setSubmitError("");
      capturedRef.current = false;
      leadIdRef.current = typeof crypto !== "undefined" ? crypto.randomUUID() : "";
    }, 350);
    return () => clearTimeout(t);
  }, [open, presetConcern]);

  React.useEffect(() => () => void (timerRef.current && clearTimeout(timerRef.current)), []);

  /** Debounced partial write. */
  const scheduleCapture = React.useCallback(
    (next: LeadDraft, field: string) => {
      if (!isWorthCapturing(next)) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        capturedRef.current = true;
        void savePartialLead(leadIdRef.current, next, source, field);
      }, 700);
    },
    [source],
  );

  const set = (field: keyof LeadDraft) => (value: string) => {
    setDraft((prev) => {
      const next = { ...prev, [field]: value };
      scheduleCapture(next, field);
      return next;
    });
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if ((draft.name ?? "").trim().length < 2) next.name = "Please tell us your name.";
    if (!draft.gender) next.gender = "Please choose one.";
    if (!isUsablePhone(draft.phone))
      next.phone = "Enter a 10-digit Indian mobile number we can reach on WhatsApp.";
    if ((draft.email ?? "").trim() && !/^\S+@\S+\.\S+$/.test((draft.email ?? "").trim()))
      next.email = "That email doesn't look right.";
    if ((draft.concern ?? "").trim().length < 2)
      next.concern = "A word or two is enough — it helps us prepare.";
    return next;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (phase === "saving") return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstKey = Object.keys(found)[0];
      document.getElementById(`booking-${firstKey}`)?.focus();
      return;
    }

    // Claim the popup while we still hold the user gesture.
    const handoff = window.open("", "_blank");
    setPhase("saving");
    setSubmitError("");

    submitLead(leadIdRef.current, draft, source)
      .then(() => {
        setPhase("done");
        const url = buildWhatsAppHandoff(draft, brand.phoneRaw);
        if (handoff && !handoff.closed) handoff.location.href = url;
      })
      .catch((err) => {
        handoff?.close();
        setPhase("form");
        setSubmitError(
          errorMessage(err, "We couldn't save that. Please try again, or call us directly."),
        );
      });
  };

  const panel = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 },
    transition: { duration: reduce ? 0.01 : 0.42, ease: [0.16, 0.84, 0.24, 1] as const },
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.01 : 0.3 }}
                className="fixed inset-0 z-[100] bg-[rgba(var(--dark-surface-rgb),0.62)] backdrop-blur-[6px]"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild aria-describedby="booking-intro">
              <motion.div
                {...panel}
                className="fixed inset-x-0 bottom-0 z-[101] mx-auto flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[26px] border border-border bg-surface shadow-[0_-8px_48px_rgba(var(--shadow-rgb),0.22)] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[88dvh] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[26px] sm:shadow-[0_32px_80px_rgba(var(--shadow-rgb),0.28)]"
              >
                {/* ---- header ---- */}
                <div className="relative shrink-0 border-b border-border bg-surface-alt px-6 pb-5 pt-6 sm:px-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-accent/12 blur-[60px]"
                  />
                  <Dialog.Close
                    className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-text-muted transition-colors hover:bg-[rgba(var(--text-rgb),0.06)] hover:text-text"
                    aria-label="Close"
                  >
                    <X className="h-[18px] w-[18px]" />
                  </Dialog.Close>

                  <span className="fs-eyebrow text-accent-contrast">Free · No obligation</span>
                  <Dialog.Title className="fs-h3 mt-1.5 text-text">
                    {phase === "done" ? "Request received" : "Book your free consultation"}
                  </Dialog.Title>
                  <p id="booking-intro" className="fs-micro mt-1.5 max-w-[42ch]">
                    {phase === "done"
                      ? `${brand.practitioner} reviews every request personally.`
                      : `A short call with ${brand.practitioner} to understand what's going on — and whether we can help.`}
                  </p>
                </div>

                {/* ---- body ---- */}
                {phase === "done" ? (
                  <DoneState draft={draft} onClose={() => onOpenChange(false)} />
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-6 py-6 sm:px-8"
                    data-lenis-prevent
                  >
                    <div className="flex flex-col gap-[18px]">
                      <Field
                        id="booking-name"
                        label="Name"
                        error={errors.name}
                        control={
                          <input
                            id="booking-name"
                            className="field-control"
                            placeholder="Your full name"
                            autoComplete="name"
                            value={draft.name}
                            aria-invalid={!!errors.name}
                            onChange={(e) => set("name")(e.target.value)}
                          />
                        }
                      />

                      <div className="field-group">
                        <span className="field-label" id="booking-gender-label">
                          Gender
                        </span>
                        <div
                          className="field-segment"
                          role="radiogroup"
                          aria-labelledby="booking-gender-label"
                        >
                          {GENDERS.map((g) => (
                            <label
                              key={g}
                              className="field-segment__option"
                              data-selected={draft.gender === g}
                            >
                              <input
                                type="radio"
                                name="booking-gender"
                                id={g === GENDERS[0] ? "booking-gender" : undefined}
                                value={g}
                                checked={draft.gender === g}
                                onChange={() => set("gender")(g)}
                              />
                              {g}
                            </label>
                          ))}
                        </div>
                        {errors.gender && <p className="field-error">{errors.gender}</p>}
                      </div>

                      <Field
                        id="booking-phone"
                        label="Phone number"
                        error={errors.phone}
                        control={
                          <div className="relative">
                            <span className="pointer-events-none absolute left-[15px] top-1/2 -translate-y-1/2 font-jakarta text-[15.5px] text-text-muted">
                              +91
                            </span>
                            <input
                              id="booking-phone"
                              className="field-control pl-[54px]"
                              placeholder="WhatsApp number"
                              inputMode="numeric"
                              autoComplete="tel"
                              maxLength={14}
                              value={draft.phone}
                              aria-invalid={!!errors.phone}
                              onChange={(e) =>
                                set("phone")(normalisePhone(e.target.value).slice(0, 10))
                              }
                            />
                          </div>
                        }
                      />

                      <Field
                        id="booking-email"
                        label="Email"
                        optional
                        error={errors.email}
                        control={
                          <input
                            id="booking-email"
                            className="field-control"
                            placeholder="you@example.com (optional)"
                            type="email"
                            autoComplete="email"
                            value={draft.email}
                            aria-invalid={!!errors.email}
                            onChange={(e) => set("email")(e.target.value)}
                          />
                        }
                      />

                      <Field
                        id="booking-concern"
                        label="Main health concern"
                        error={errors.concern}
                        control={
                          <input
                            id="booking-concern"
                            className="field-control"
                            placeholder="e.g. PCOS, thyroid, weight, fertility"
                            value={draft.concern}
                            aria-invalid={!!errors.concern}
                            onChange={(e) => set("concern")(e.target.value)}
                          />
                        }
                      />
                    </div>

                    {submitError && (
                      <p
                        role="alert"
                        className="mt-4 rounded-[12px] border border-[var(--danger)] bg-[rgba(var(--danger-rgb),0.08)] px-4 py-3 text-[13.5px] text-[var(--danger-contrast)]"
                      >
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={phase === "saving"}
                      className="press mt-6 inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-pill bg-accent-strong font-jakarta text-[16px] font-semibold text-on-accent shadow-[0_10px_28px_rgba(var(--accent-rgb),0.28)] disabled:cursor-progress disabled:opacity-80"
                    >
                      {phase === "saving" ? (
                        <>
                          <Loader2 className="h-[18px] w-[18px] animate-spin" />
                          Saving your request…
                        </>
                      ) : (
                        <>
                          Book My Free Consultation
                          <ArrowRight className="h-[18px] w-[18px]" />
                        </>
                      )}
                    </button>

                    <p className="fs-micro mt-3.5 text-center">
                      We'll save your request and open WhatsApp so our team can reply faster.
                    </p>

                    <ul className="mt-5 flex list-none flex-wrap justify-center gap-x-5 gap-y-2 border-t border-border p-0 pt-5 text-[12.5px] text-text-muted">
                      {[
                        { icon: ShieldCheck, label: "100% confidential" },
                        { icon: Clock, label: "Reply within 24 hours" },
                        { icon: PhoneCall, label: "No payment to book" },
                      ].map(({ icon: Icon, label }) => (
                        <li key={label} className="flex items-center gap-1.5">
                          <Icon className="h-[13px] w-[13px] text-primary" aria-hidden="true" />
                          {label}
                        </li>
                      ))}
                    </ul>
                  </form>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function Field({
  id,
  label,
  optional,
  error,
  control,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string | undefined;
  control: React.ReactNode;
}) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>
        {label}
        {optional && <span className="field-label__optional"> · optional</span>}
      </label>
      {control}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function DoneState({ draft, onClose }: { draft: LeadDraft; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-9 text-center sm:px-8">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-soft">
        <Check className="h-7 w-7 text-primary-contrast" strokeWidth={2.5} />
      </span>
      <h3 className="fs-h4 mt-5 text-text">
        Thank you{draft.name ? `, ${draft.name.trim().split(/\s+/)[0]}` : ""}.
      </h3>
      <p className="fs-body mt-2 max-w-[36ch] text-text-muted">
        Your request is with us. We've opened WhatsApp in a new tab so you can send us anything else
        you'd like us to know before the call.
      </p>

      <a
        href={buildWhatsAppHandoff(draft, brand.phoneRaw)}
        target="_blank"
        rel="noopener noreferrer"
        className="press mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-pill bg-[var(--whatsapp)] font-jakarta text-[15.5px] font-semibold text-[var(--on-whatsapp)]"
      >
        Open WhatsApp again
      </a>
      <button
        type="button"
        onClick={onClose}
        className={cn(
          "mt-3 inline-flex h-[46px] w-full items-center justify-center rounded-pill",
          "border border-border-input font-jakarta text-[15px] font-medium text-text",
          "transition-colors hover:bg-surface-alt",
        )}
      >
        Back to the site
      </button>
    </div>
  );
}
