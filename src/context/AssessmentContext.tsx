import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  detailsSchema,
  paymentSchema,
  healthSchema,
  lifestyleSchema,
  nutritionSchema,
  type Details,
  type Payment,
  type Health,
  type Lifestyle,
  type Nutrition,
} from "@/schemas/assessment";

/* ─── Types ─── */
export type AssessmentStep =
  "details" | "health" | "lifestyle" | "nutrition" | "payment" | "review" | "complete";

export type AssessmentData = {
  details: Partial<Details>;
  health: Partial<Health>;
  lifestyle: Partial<Lifestyle>;
  nutrition: Partial<Nutrition>;
  payment: Partial<Payment>;
};

export type AssessmentState = {
  currentStep: AssessmentStep;
  completedSteps: AssessmentStep[];
  data: AssessmentData;
  draftId: string;
  direction: "forward" | "back";
  lastSavedAt: string | null;
  /**
   * The id of the assessment just submitted, so the completion screen can show
   * the real reference. It previously read `window._submissionId`, which
   * nothing ever assigned, so every patient was shown the same made-up
   * reference ("SUBMITTE", the first eight characters of the literal fallback
   * string "SUBMITTED") -- and that reference is what they need in order to
   * track the application afterwards.
   */
  lastSubmissionId: string | null;
};

type AssessmentContextValue = AssessmentState & {
  goToStep: (step: AssessmentStep) => void;
  next: () => Promise<boolean>;
  back: () => void;
  updateSection: <K extends keyof AssessmentData>(
    section: K,
    data: Partial<AssessmentData[K]>,
  ) => void;
  markStepComplete: (step?: AssessmentStep) => Promise<void>;
  resetAssessment: () => void;
  submitFinal: (consent: {
    accurateInfo: true;
    contactConsent: true;
    dataConsent: true;
  }) => Promise<void>;
};

/* ─── Constants ─── */
/*
 * v2: the steps were reordered (payment moved to the end, lifestyle added).
 * A v1 draft is still read once, for its answers — see restoreDraft().
 */
const STORAGE_KEY = "gr_assessment_draft_v2";
const LEGACY_STORAGE_KEY = "gr_assessment_draft_v1";
const DRAFT_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const DEBOUNCE_MS = 600;

/**
 * Every step, in order.
 *
 * "review" belongs here even though it has no schema of its own. goToStep
 * derives its guard from indexOf(), so while "review" was missing, indexOf
 * returned -1 for it and the guard `targetIdx <= currentIdx + 1` became
 * `targetIdx <= 0` -- which blocked EVERY navigation off the review screen:
 * the back button and all of its Edit links silently did nothing.
 */
/*
 * The order follows the practice's own intake form — about you, health,
 * lifestyle and symptoms, a day of eating — and payment comes LAST, framed as
 * the fee for the Discovery Call. Somebody is far more willing to pay once
 * they have seen what the practice asks and why; asking for money on the
 * second screen, before a single health question, is what the practice
 * asked to change.
 */
const STEPS: AssessmentStep[] = [
  "details",
  "health",
  "lifestyle",
  "nutrition",
  "payment",
  "review",
  "complete",
];

const STEP_SCHEMAS = {
  details: detailsSchema,
  health: healthSchema,
  lifestyle: lifestyleSchema,
  nutrition: nutritionSchema,
  payment: paymentSchema,
} as const;

const emptyData: AssessmentData = {
  details: {},
  health: {},
  lifestyle: {},
  nutrition: {},
  payment: {},
};

const makeId = () => crypto.randomUUID();

/** How long a submission waits for Firestore before it reports a failure. */
const SUBMIT_TIMEOUT_MS = 20000;

/**
 * Reject if a write has not been acknowledged in time.
 *
 * Firestore never rejects an undeliverable write — it queues it and leaves
 * the promise pending — so without this a submission on a dead connection
 * spins forever instead of offering the person a retry.
 */
function withTimeout<T>(work: Promise<T>): Promise<T> {
  return Promise.race([
    work,
    new Promise<T>((_resolve, reject) =>
      setTimeout(
        () => reject(new Error("The submission timed out. Please check your connection.")),
        SUBMIT_TIMEOUT_MS,
      ),
    ),
  ]);
}

const initialState = (): AssessmentState => ({
  currentStep: "details",
  completedSteps: [],
  data: emptyData,
  draftId: makeId(),
  direction: "forward",
  lastSavedAt: null,
  lastSubmissionId: null,
});

/**
 * Restore a saved draft, if there is a recent one.
 *
 * A draft saved under the old step order keeps its answers but restarts at
 * the first step: its "completed" list describes an order that no longer
 * exists, and resuming it mid-way could skip the new lifestyle section.
 */
function restoreDraft(): AssessmentState | null {
  const fresh = (savedAt: unknown) =>
    typeof savedAt === "string" && Date.now() - Date.parse(savedAt) <= DRAFT_MAX_AGE_MS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && fresh(saved.savedAt)) {
        return {
          ...initialState(),
          ...saved,
          data: { ...emptyData, ...(saved.data ?? {}) },
          lastSavedAt: saved.savedAt,
        };
      }
      localStorage.removeItem(STORAGE_KEY);
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      const saved = JSON.parse(legacy);
      if (saved && fresh(saved.savedAt)) {
        return {
          ...initialState(),
          draftId: typeof saved.draftId === "string" ? saved.draftId : makeId(),
          data: { ...emptyData, ...(saved.data ?? {}) },
          lastSavedAt: saved.savedAt,
        };
      }
    }
  } catch {
    /* offline or corrupt draft */
  }
  return null;
}

/* ─── Context ─── */
const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssessmentState>(() => {
    const restored = restoreDraft();
    if (restored) return restored;

    // Pre-populate from URL params or local symptom selection
    const params = new URLSearchParams(window.location.search);
    let selectedSymptoms: unknown = null;
    try {
      selectedSymptoms = JSON.parse(localStorage.getItem("gr_selected_symptoms") || "null");
    } catch {
      /* ignore */
    }

    return {
      ...initialState(),
      data: {
        ...emptyData,
        details: {
          selectedSymptoms: Array.isArray(selectedSymptoms) ? selectedSymptoms : undefined,
          programInterest: params.get("program") || undefined,
        },
      },
    };
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /* ─── updateSection (debounced persist) ─── */
  const updateSection = useCallback(
    <K extends keyof AssessmentData>(section: K, data: Partial<AssessmentData[K]>) => {
      setState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [section]: { ...prev.data[section], ...data },
        },
      }));

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setState((prev) => {
          const savedAt = new Date().toISOString();
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prev, savedAt }));
          return { ...prev, lastSavedAt: savedAt };
        });
      }, DEBOUNCE_MS);
    },
    [],
  );

  /* ─── goToStep (no skipping forward) ─── */
  const goToStep = useCallback(
    (step: AssessmentStep) =>
      setState((s) => {
        const targetIdx = STEPS.indexOf(step);
        const currentIdx = STEPS.indexOf(s.currentStep);
        const previousStep = STEPS[targetIdx - 1];

        // Allow navigating to completed steps or the immediate next step
        const canNavigate =
          targetIdx <= currentIdx + 1 &&
          (targetIdx <= currentIdx ||
            (previousStep !== undefined && s.completedSteps.includes(previousStep)));

        if (!canNavigate) return s;

        return {
          ...s,
          currentStep: step,
          direction: targetIdx >= currentIdx ? "forward" : "back",
        };
      }),
    [],
  );

  /* ─── markStepComplete ─── */
  const markStepComplete = useCallback(
    async (step = state.currentStep) => {
      if (step === "complete") return;

      const completedSteps = state.completedSteps.includes(step)
        ? state.completedSteps
        : [...state.completedSteps, step];

      setState((s) => ({ ...s, completedSteps }));

      /*
       * The draft mirror is sent, never waited for.
       *
       * A Firestore write does not reject when the server cannot be reached —
       * it is queued locally and its promise stays pending until the server
       * acknowledges it, which may be never. Every step's Continue button
       * awaited this call before navigating, so on a flaky connection (or
       * anywhere Firestore is blocked) the form simply stopped: the button
       * spun and the next step never arrived. The answers are already saved
       * to localStorage on every keystroke, so nothing is lost by letting
       * this one catch up in its own time.
       */
      void setDoc(
        doc(db, "assessmentDrafts", state.draftId),
        {
          ...state,
          completedSteps,
          updatedAt: Timestamp.now(),
          createdAt: Timestamp.now(),
          status: "draft",
        },
        { merge: true },
      ).catch(() => {
        /* offline, blocked, or rejected — the local draft still stands */
      });
    },
    [state],
  );

  /* ─── next (validates then advances) ─── */
  const next = useCallback(async () => {
    const stepKey = state.currentStep as keyof typeof STEP_SCHEMAS;
    const schema = STEP_SCHEMAS[stepKey];
    const currentIdx = STEPS.indexOf(state.currentStep);
    const target = STEPS[currentIdx + 1];

    if (!schema || !target) return false;

    const result = schema.safeParse(state.data[state.currentStep as keyof AssessmentData]);
    if (!result.success) return false;

    await markStepComplete();
    goToStep(target);
    return true;
  }, [state, markStepComplete, goToStep]);

  /* ─── back ─── */
  const back = useCallback(() => {
    const idx = STEPS.indexOf(state.currentStep);
    const target = STEPS[Math.max(0, idx - 1)];
    if (target) goToStep(target);
  }, [state.currentStep, goToStep]);

  /* ─── reset ─── */
  const resetAssessment = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState());
  }, []);

  /* ─── submitFinal ─── */
  const submitFinal = useCallback(
    async (consent: { accurateInfo: true; contactConsent: true; dataConsent: true }) => {
      /*
       * The draft's own id IS the submission id.
       *
       * It used to be a fresh UUID per attempt, so a submission that timed
       * out and was retried wrote a SECOND assessment document — the practice
       * would see the same person twice and not know which to work from. The
       * draft id is already unique per person per form, so a retry now
       * overwrites the same document.
       */
      const submissionId = state.draftId;
      const payload = {
        submissionId,
        draftId: state.draftId,
        submittedAt: serverTimestamp(),
        details: state.data.details,
        health: state.data.health,
        lifestyle: state.data.lifestyle,
        nutrition: state.data.nutrition,
        payment: state.data.payment,
        consent,
        status: "new",
        verificationStatus: state.data.payment.verificationStatus || "pending",
        reviewedBy: null,
        reviewedAt: null,
        adminNotes: "",
        source: "web",
        userAgent: navigator.userAgent,
        submittedFrom: document.referrer || "",
      };

      /*
       * A submission must either land or say so.
       *
       * Firestore queues a write it cannot deliver and leaves the promise
       * pending indefinitely, which on the review screen reads as a spinner
       * that never stops — the one moment in the form where the person needs
       * to know what happened. The race turns that silence into the retry
       * message they can act on.
       */
      await withTimeout(setDoc(doc(db, "assessments", submissionId), payload));

      /*
       * Mirror a MINIMAL public status record.
       *
       * The tracking page has to be readable by someone who is not signed in,
       * and an assessment document holds a name, address, phone, medical
       * history and a payment screenshot. None of that may be exposed to an
       * anonymous reader, so tracking reads this instead: no medical data, no
       * address, no email, and only the last four digits of the phone -- which
       * is used to confirm the person asking is the person who submitted, not
       * to look them up.
       *
       * Keyed by the submission id, so a reader needs the reference from their
       * confirmation screen; the collection is not listable (see
       * firestore.rules), which is what stops it being enumerated.
       */
      const phone = String(state.data.details?.phone ?? "");
      const fullName = String(state.data.details?.fullName ?? "").trim();
      await withTimeout(
        setDoc(doc(db, "assessmentStatus", submissionId), {
          submissionId,
          firstName: fullName.split(/\s+/)[0] ?? "",
          phoneLast4: phone.slice(-4),
          status: "new",
          verificationStatus: state.data.payment.verificationStatus || "pending",
          submittedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }),
      );

      // Clean up. The reference is kept so the tracking page can pre-fill it
      // on this device -- losing it should not mean losing access to status.
      localStorage.removeItem(STORAGE_KEY);
      try {
        localStorage.setItem("gr_last_reference", submissionId);
      } catch {
        /* private mode */
      }
      // Fire and forget: the draft copy is housekeeping, and the person is
      // already on the confirmation screen.
      void deleteDoc(doc(db, "assessmentDrafts", state.draftId)).catch(() => {
        /* ignore cleanup failure */
      });

      setState((s) => ({ ...s, currentStep: "complete", lastSubmissionId: submissionId }));
    },
    [state],
  );

  /* ─── Memoised context value ─── */
  const value = useMemo(
    () => ({
      ...state,
      goToStep,
      next,
      back,
      updateSection,
      markStepComplete,
      resetAssessment,
      submitFinal,
    }),
    [state, goToStep, next, back, updateSection, markStepComplete, resetAssessment, submitFinal],
  );

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used inside AssessmentProvider");
  }
  return context;
};
