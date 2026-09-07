import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Clock,
  Ruler,
  Target,
  FileHeart,
  Info,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import { healthSchema, type Health } from "@/schemas/assessment";
import { FormField, NumberInput, TextArea, RadioPills } from "@/components/assessment/fields";

type HealthFormValues = {
  weightKg?: string | number | undefined;
  heightCm?: string | number | undefined;
  weightChange6m?: "gained" | "lost" | "stable" | "unsure" | undefined;
  weightChangeAmountKg?: string | number | undefined;
  goals: string;
  pastMedicalHistory: string;
  currentSymptoms: string;
  supplementHistory: string;
  currentMedications: string;
};

const WEIGHT_CHANGE_OPTIONS = [
  { value: "gained", label: "Gained" },
  { value: "lost", label: "Lost" },
  { value: "stable", label: "Stayed about the same" },
  { value: "unsure", label: "Not sure" },
];

export default function StepHealth() {
  const { data, updateSection, markStepComplete, goToStep } = useAssessment();
  const formRef = useRef<HTMLFormElement>(null);
  const errorAnnouncerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<HealthFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(healthSchema) as any,
    mode: "onBlur",
    defaultValues: {
      weightKg: data.health.weightKg ?? "",
      heightCm: data.health.heightCm ?? "",
      weightChange6m: data.health.weightChange6m,
      weightChangeAmountKg: data.health.weightChangeAmountKg ?? "",
      goals: data.health.goals ?? "",
      pastMedicalHistory: data.health.pastMedicalHistory ?? "",
      currentSymptoms: data.health.currentSymptoms ?? "",
      supplementHistory: data.health.supplementHistory ?? "",
      currentMedications: data.health.currentMedications ?? "",
    },
  });

  const weight = watch("weightKg");
  const height = watch("heightCm");
  const weightChange = watch("weightChange6m");
  const goals = watch("goals");
  const pmh = watch("pastMedicalHistory");
  const sx = watch("currentSymptoms");
  const supps = watch("supplementHistory");
  const meds = watch("currentMedications");

  /* ─── Autosave ─── */
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const subscription = watch((val) => {
      setIsSaving(true);
      setSaved(false);

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(() => {
        const payload: Partial<Health> = {};
        if (val.weightKg !== "" && val.weightKg !== undefined && !isNaN(Number(val.weightKg)))
          payload.weightKg = Number(val.weightKg);
        if (val.heightCm !== "" && val.heightCm !== undefined && !isNaN(Number(val.heightCm)))
          payload.heightCm = Number(val.heightCm);
        if (val.weightChange6m)
          payload.weightChange6m = val.weightChange6m as Health["weightChange6m"];
        if (
          val.weightChangeAmountKg !== "" &&
          val.weightChangeAmountKg !== undefined &&
          !isNaN(Number(val.weightChangeAmountKg))
        )
          payload.weightChangeAmountKg = Number(val.weightChangeAmountKg);
        if (val.goals) payload.goals = val.goals;
        if (val.pastMedicalHistory) payload.pastMedicalHistory = val.pastMedicalHistory;
        if (val.currentSymptoms) payload.currentSymptoms = val.currentSymptoms;
        if (val.supplementHistory) payload.supplementHistory = val.supplementHistory;
        if (val.currentMedications) payload.currentMedications = val.currentMedications;

        updateSection("health", payload);
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }, 800);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateSection]);

  /* ─── BMI Calculation ─── */
  const w = Number(weight);
  const h = Number(height);
  const bmi = w > 0 && h > 0 ? w / ((h / 100) * (h / 100)) : null;

  let bmiCategory = "";
  if (bmi) {
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 25) bmiCategory = "Healthy";
    else if (bmi < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";
  }

  /* ─── Submit handler ─── */
  const onSubmit = useCallback(async () => {
    await markStepComplete("health");
    goToStep("nutrition");
  }, [markStepComplete, goToStep]);

  /* ─── Error handler ─── */
  const onError = useCallback(
    (fieldErrors: FieldErrors<HealthFormValues>) => {
      const errorKeys = Object.keys(fieldErrors) as (keyof HealthFormValues)[];
      const errorCount = errorKeys.length;

      if (errorCount > 0 && errorKeys[0]) {
        try {
          setFocus(errorKeys[0]);
        } catch {
          const el = formRef.current?.querySelector(
            `[name="${errorKeys[0]}"]`,
          ) as HTMLElement | null;
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 140;
            window.scrollTo({ top: y, behavior: "smooth" });
            el.focus();
          }
        }

        if (errorAnnouncerRef.current) {
          errorAnnouncerRef.current.textContent = `There are ${errorCount} errors in the form.`;
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [setFocus],
  );

  return (
    <>
      <div className="af-sr-only" aria-live="assertive" ref={errorAnnouncerRef} />

      {/* ─── Heading block ─── */}
      <div className="af-heading-block" style={{ position: "relative" }}>
        {/* The step counter lives in <StepProgress> now — it was
            printing "Step 3 of 4" twice on phones, once in the progress bar
            and once here. */}
        <span className="sr-only">Step 3 of 4</span>
        <h2 className="af-title">Tell us what's been going on.</h2>
        <p className="af-subtitle">
          The more detail you give here, the more precise your plan will be. Write in your own words
          — there are no wrong answers, and nothing here is judged.
        </p>

        <div style={{ position: "absolute", top: 0, right: 0 }}>
          {isSaving && (
            <span className="af-autosave">
              <Loader2 className="af-autosave-anim-spin" /> Saving…
            </span>
          )}
          {!isSaving && saved && (
            <span className="af-autosave af-autosave--saved">
              <Check /> Saved
            </span>
          )}
        </div>
      </div>

      <div className="af-hint-row">
        <Clock /> About 6-8 minutes. Your answers save automatically as you type.
      </div>

      <form ref={formRef} onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        {Object.keys(errors).length > 0 && (
          <div className="af-error-summary" role="alert">
            <div className="af-error-summary__title">
              <AlertTriangle />
              {Object.keys(errors).length} fields need your attention
            </div>
            <div className="af-error-summary__list">
              {Object.keys(errors).map((key) => (
                <button
                  key={key}
                  type="button"
                  className="af-error-summary__btn"
                  onClick={() => {
                    try {
                      setFocus(key as keyof HealthFormValues);
                    } catch {
                      const el = formRef.current?.querySelector(`[name="${key}"]`) as HTMLElement;
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 140;
                        window.scrollTo({ top: y, behavior: "smooth" });
                        el.focus();
                      }
                    }
                  }}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Card 1 — Your Measurements ═══ */}
        <div className="af-section-card">
          <h3 className="af-card-heading">
            <Ruler aria-hidden="true" />
            Your measurements
          </h3>

          <div className="af-row" style={{ marginBottom: 24 }}>
            <FormField label="Weight" htmlFor="weightKg" required error={errors.weightKg?.message}>
              <div className="af-input-with-suffix">
                <NumberInput
                  id="weightKg"
                  placeholder="65"
                  hasError={!!errors.weightKg}
                  {...register("weightKg")}
                />
                <span className="af-suffix">kg</span>
              </div>
            </FormField>

            <FormField label="Height" htmlFor="heightCm" required error={errors.heightCm?.message}>
              <div className="af-input-with-suffix">
                <NumberInput
                  id="heightCm"
                  placeholder="165"
                  hasError={!!errors.heightCm}
                  {...register("heightCm")}
                />
                <span className="af-suffix">cm</span>
              </div>
            </FormField>
          </div>

          {bmi !== null && bmi > 0 && (
            <div className="af-bmi-panel">
              <span className="af-bmi-value">BMI: {bmi.toFixed(1)}</span>
              <span className="af-bmi-category">({bmiCategory})</span>
              <p className="af-bmi-note">
                BMI is a rough indicator only — it doesn't account for muscle mass or body
                composition, and we'll assess you properly in consultation.
              </p>
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <FormField
              label="Weight change in the last 6 months"
              htmlFor="weightChange6m"
              required
              error={errors.weightChange6m?.message}
            >
              <Controller
                name="weightChange6m"
                control={control}
                render={({ field }) => (
                  <RadioPills
                    name={field.name}
                    options={WEIGHT_CHANGE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    hasError={!!errors.weightChange6m}
                  />
                )}
              />
            </FormField>
          </div>

          {(weightChange === "gained" || weightChange === "lost") && (
            <div className="af-conditional-field">
              <div style={{ width: "100%", maxWidth: 300 }}>
                <FormField
                  label="Roughly how much?"
                  htmlFor="weightChangeAmountKg"
                  required
                  error={errors.weightChangeAmountKg?.message}
                >
                  <div className="af-input-with-suffix">
                    <NumberInput
                      id="weightChangeAmountKg"
                      placeholder="e.g. 5"
                      hasError={!!errors.weightChangeAmountKg}
                      {...register("weightChangeAmountKg")}
                    />
                    <span className="af-suffix">kg</span>
                  </div>
                </FormField>
              </div>
            </div>
          )}
        </div>

        {/* ═══ Card 2 — What you want ═══ */}
        <div className="af-section-card">
          <h3 className="af-card-heading">
            <Target aria-hidden="true" />
            Your goals
          </h3>

          <FormField
            label="What would you like to get out of this program?"
            htmlFor="goals"
            required
            error={errors.goals?.message}
            helper="Be as specific as you can — this shapes everything we build."
            helperId="goals-helper"
          >
            <TextArea
              id="goals"
              placeholder="For example: stop the bloating after meals, get my cycles regular, have energy through the afternoon, understand what's actually causing my symptoms."
              hasError={!!errors.goals}
              describedBy="goals-helper"
              style={{ minHeight: 130 }}
              maxLength={1500}
              {...register("goals")}
            />
            <div className="af-char-counter">{(goals || "").length} / 1500</div>
          </FormField>
        </div>

        {/* ═══ Card 3 — Medical Background ═══ */}
        <div className="af-section-card">
          <h3 className="af-card-heading">
            <FileHeart aria-hidden="true" />
            Medical history
          </h3>

          <div className="af-field" style={{ marginBottom: 26 }}>
            <FormField
              label="Past medical history and symptoms"
              htmlFor="pastMedicalHistory"
              required
              error={errors.pastMedicalHistory?.message}
              helper="Include anything even if it seems unrelated. Patterns often connect."
              helperId="pmh-helper"
            >
              <TextArea
                id="pastMedicalHistory"
                placeholder="Any diagnosed conditions, surgeries, hospitalisations, or long-standing issues — and roughly when."
                hasError={!!errors.pastMedicalHistory}
                describedBy="pmh-helper"
                style={{ minHeight: 110 }}
                maxLength={2000}
                {...register("pastMedicalHistory")}
              />
              <div className="af-char-counter">{(pmh || "").length} / 2000</div>
            </FormField>
          </div>

          <div className="af-field" style={{ marginBottom: 26 }}>
            <FormField
              label="Current symptoms"
              htmlFor="currentSymptoms"
              required
              error={errors.currentSymptoms?.message}
            >
              <TextArea
                id="currentSymptoms"
                placeholder="What you're experiencing now, how long it's been going on, and how often."
                hasError={!!errors.currentSymptoms}
                style={{ minHeight: 110 }}
                maxLength={2000}
                {...register("currentSymptoms")}
              />
              <div className="af-char-counter">{(sx || "").length} / 2000</div>
            </FormField>
          </div>

          <div className="af-field" style={{ marginBottom: 26 }}>
            <FormField
              label="Supplements and medicines you've taken before"
              htmlFor="supplementHistory"
              required
              error={errors.supplementHistory?.message}
            >
              <TextArea
                id="supplementHistory"
                placeholder="Anything you've tried in the past, including what helped and what didn't."
                hasError={!!errors.supplementHistory}
                style={{ minHeight: 110 }}
                maxLength={1500}
                {...register("supplementHistory")}
              />
              <div className="af-char-counter">{(supps || "").length} / 1500</div>
            </FormField>
          </div>

          <div className="af-field">
            <FormField
              label="Current medications and supplements"
              htmlFor="currentMedications"
              required
              error={errors.currentMedications?.message}
              helper="Nothing here will be stopped or changed without your doctor. We just need the full picture."
              helperId="meds-helper"
            >
              <TextArea
                id="currentMedications"
                placeholder="What you take now, the dose if you know it, and what it's for."
                hasError={!!errors.currentMedications}
                describedBy="meds-helper"
                style={{ minHeight: 110 }}
                maxLength={1500}
                {...register("currentMedications")}
              />
              <div className="af-char-counter">{(meds || "").length} / 1500</div>
            </FormField>
          </div>

          <div className="af-info-note">
            <Info aria-hidden="true" />
            <p>
              If a field doesn't apply to you, write 'none' rather than leaving it blank — it tells
              us you've considered it.
            </p>
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className="af-pay-footer">
          <div className="af-pay-footer__row">
            <button type="button" className="af-back-btn" onClick={() => goToStep("payment")}>
              <ArrowLeft aria-hidden="true" />
              Back
            </button>

            <button type="submit" className="af-submit-btn">
              Continue
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
