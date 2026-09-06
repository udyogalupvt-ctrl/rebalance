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
  nutritionSchema,
  type Details,
  type Payment,
  type Health,
  type Nutrition,
} from "@/schemas/assessment";

/* ─── Types ─── */
export type AssessmentStep = "details" | "payment" | "health" | "nutrition" | "review" | "complete";

export type AssessmentData = {
  details: Partial<Details>;
  payment: Partial<Payment>;
  health: Partial<Health>;
  nutrition: Partial<Nutrition>;
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
const STORAGE_KEY = "gr_assessment_draft_v1";
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
const STEPS: AssessmentStep[] = ["details", "payment", "health", "nutrition", "review", "complete"];

const STEP_SCHEMAS = {
  details: detailsSchema,
  payment: paymentSchema,
  health: healthSchema,
  nutrition: nutritionSchema,
} as const;

const emptyData: AssessmentData = {
  details: {},
  payment: {},
  health: {},
  nutrition: {},
};

const makeId = () => crypto.randomUUID();

const initialState = (): AssessmentState => ({
  currentStep: "details",
  completedSteps: [],
  data: emptyData,
  draftId: makeId(),
  direction: "forward",
  lastSavedAt: null,
  lastSubmissionId: null,
});

/* ─── Context ─── */
const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssessmentState>(() => {
    // Try to restore from localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.savedAt && Date.now() - Date.parse(saved.savedAt) <= DRAFT_MAX_AGE_MS) {
          return { ...initialState(), ...saved, lastSavedAt: saved.savedAt };
        }
        // Draft too old — discard
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* offline or corrupt draft */
    }

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

      try {
        await setDoc(
          doc(db, "assessmentDrafts", state.draftId),
          {
            ...state,
            completedSteps,
            updatedAt: Timestamp.now(),
            createdAt: Timestamp.now(),
            status: "draft",
          },
          { merge: true },
        );
      } catch {
        /* Firestore must never block offline flow */
      }
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
      const submissionId = crypto.randomUUID();
      const payload = {
        submissionId,
        draftId: state.draftId,
        submittedAt: serverTimestamp(),
        details: state.data.details,
        payment: state.data.payment,
        health: state.data.health,
        nutrition: state.data.nutrition,
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

      await setDoc(doc(db, "assessments", submissionId), payload);

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
      await setDoc(doc(db, "assessmentStatus", submissionId), {
        submissionId,
        firstName: fullName.split(/\s+/)[0] ?? "",
        phoneLast4: phone.slice(-4),
        status: "new",
        verificationStatus: state.data.payment.verificationStatus || "pending",
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Clean up. The reference is kept so the tracking page can pre-fill it
      // on this device -- losing it should not mean losing access to status.
      localStorage.removeItem(STORAGE_KEY);
      try {
        localStorage.setItem("gr_last_reference", submissionId);
      } catch {
        /* private mode */
      }
      try {
        await deleteDoc(doc(db, "assessmentDrafts", state.draftId));
      } catch {
        /* ignore cleanup failure */
      }

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
