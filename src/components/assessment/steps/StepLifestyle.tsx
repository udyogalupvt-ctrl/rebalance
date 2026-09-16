import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Activity,
  Info,
  Loader2,
  Moon,
  Soup,
  Stethoscope,
} from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import {
  lifestyleSchema,
  GENERAL_SYMPTOMS,
  DIGESTIVE_SYMPTOMS,
  type Lifestyle,
} from "@/schemas/assessment";
import {
  CheckboxGrid,
  FormField,
  RadioPills,
  TextArea,
  TextInput,
} from "@/components/assessment/fields";

/**
 * Step 3 — Lifestyle & symptoms.
 *
 * Sections 6 to 9 of the practice's own intake form, in its order: lifestyle
 * and food habits (current and history), the two symptom checklists, and the
 * menstrual cycle. The form the practice sends by hand leaves a blank line
 * after each heading; here the questions that have a small set of honest
 * answers become choices (diet, stress, stool type, cravings, cycle) and the
 * rest stay free text, so nobody is forced to squeeze their life into a
 * dropdown.
 */

type LifestyleFormValues = {
  diet?: Lifestyle["diet"] | undefined;
  foodHabits: string;
  foodAllergies: string;
  teaCoffee: string;
  stress?: Lifestyle["stress"] | undefined;
  exercise: string;
  bowelType?: Lifestyle["bowelType"] | undefined;
  bowelNote: string;
  alcoholSmoking: string;
  screenTime: string;
  sleep: string;
  profession: string;
  intolerances: string;
  sweetCravings?: Lifestyle["sweetCravings"] | undefined;
  generalSymptoms: string[];
  generalSymptomsNote: string;
  digestiveSymptoms: string[];
  digestiveNote: string;
  menstrualCycle?: Lifestyle["menstrualCycle"] | undefined;
  menstrualNote: string;
};

const DIET_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "eggetarian", label: "Eggetarian" },
  { value: "non_vegetarian", label: "Non-vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "jain", label: "Jain" },
  { value: "other", label: "Other" },
];

const STRESS_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
];

/** The Bristol stool scale, in plain words. */
const BRISTOL_OPTIONS = [
  { value: "1", label: "Type 1 · Hard lumps" },
  { value: "2", label: "Type 2 · Lumpy, sausage-shaped" },
  { value: "3", label: "Type 3 · Sausage with cracks" },
  { value: "4", label: "Type 4 · Smooth and soft" },
  { value: "5", label: "Type 5 · Soft blobs" },
  { value: "6", label: "Type 6 · Mushy, fluffy pieces" },
  { value: "7", label: "Type 7 · Watery" },
  { value: "unsure", label: "Not sure" },
];

const CRAVING_OPTIONS = [
  { value: "no", label: "No" },
  { value: "sometimes", label: "Sometimes" },
  { value: "often", label: "Often" },
];

const CYCLE_OPTIONS = [
  { value: "regular", label: "Regular" },
  { value: "irregular", label: "Irregular" },
  { value: "not_applicable", label: "Not applicable" },
];

const toOptions = (list: readonly string[]) => list.map((v) => ({ value: v, label: v }));

/** Human names for the error summary, so it never shows a field key. */
const FIELD_LABELS: Partial<Record<keyof LifestyleFormValues, string>> = {
  diet: "Diet",
  foodHabits: "Food habits",
  foodAllergies: "Food allergies",
  stress: "Stress",
  exercise: "Movement & exercise",
  bowelType: "Bowel movement",
  sleep: "Sleep",
  profession: "Profession",
};

export default function StepLifestyle() {
  const { data, updateSection, markStepComplete, goToStep } = useAssessment();
  const formRef = useRef<HTMLFormElement>(null);
  const errorAnnouncerRef = useRef<HTMLDivElement>(null);
  const saved = data.lifestyle;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<LifestyleFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(lifestyleSchema) as any,
    mode: "onBlur",
    defaultValues: {
      diet: saved.diet,
      foodHabits: saved.foodHabits ?? "",
      foodAllergies: saved.foodAllergies ?? "",
      teaCoffee: saved.teaCoffee ?? "",
      stress: saved.stress,
      exercise: saved.exercise ?? "",
      bowelType: saved.bowelType,
      bowelNote: saved.bowelNote ?? "",
      alcoholSmoking: saved.alcoholSmoking ?? "",
      screenTime: saved.screenTime ?? "",
      sleep: saved.sleep ?? "",
      profession: saved.profession ?? "",
      intolerances: saved.intolerances ?? "",
      sweetCravings: saved.sweetCravings,
      generalSymptoms: saved.generalSymptoms ?? [],
      generalSymptomsNote: saved.generalSymptomsNote ?? "",
      digestiveSymptoms: saved.digestiveSymptoms ?? [],
      digestiveNote: saved.digestiveNote ?? "",
      menstrualCycle: saved.menstrualCycle,
      menstrualNote: saved.menstrualNote ?? "",
    },
  });

  // The cycle question is not asked of somebody who has told us they are male.
  const askCycle = data.details.gender !== "male";

  /* ─── Autosave ─── */
  const [isSaving, setIsSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const subscription = watch((val) => {
      setIsSaving(true);
      setSavedFlash(false);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        // Only defined, non-empty answers go into the draft, so a half-typed
        // form never overwrites a saved answer with an empty string.
        const payload: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(val)) {
          if (value === undefined || value === "") continue;
          payload[key] = Array.isArray(value) ? value.filter(Boolean) : value;
        }
        updateSection("lifestyle", payload as Partial<Lifestyle>);
        setIsSaving(false);
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 2000);
      }, 800);
    });
    return () => {
      subscription.unsubscribe();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [watch, updateSection]);

  /* ─── Submit ─── */
  const onSubmit = useCallback(
    async (values: LifestyleFormValues) => {
      updateSection("lifestyle", values as unknown as Partial<Lifestyle>);
      await markStepComplete("lifestyle");
      goToStep("nutrition");
    },
    [updateSection, markStepComplete, goToStep],
  );

  const focusField = useCallback(
    (key: keyof LifestyleFormValues) => {
      try {
        setFocus(key);
      } catch {
        /* radio groups are not focusable through setFocus */
      }
      const el = formRef.current?.querySelector(`[name="${key}"]`) as HTMLElement | null;
      (el?.closest(".af-field") as HTMLElement | null)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
    [setFocus],
  );

  const onError = useCallback(
    (fieldErrors: FieldErrors<LifestyleFormValues>) => {
      const keys = Object.keys(fieldErrors) as (keyof LifestyleFormValues)[];
      if (!keys[0]) return;
      focusField(keys[0]);
      if (errorAnnouncerRef.current) {
        errorAnnouncerRef.current.textContent = `${keys.length} ${
          keys.length === 1 ? "field needs" : "fields need"
        } your attention.`;
      }
    },
    [focusField],
  );

  const errorKeys = Object.keys(errors) as (keyof LifestyleFormValues)[];

  return (
    <>
      <div className="af-sr-only" aria-live="assertive" ref={errorAnnouncerRef} />

      <div className="af-heading-block" style={{ position: "relative" }}>
        <span className="sr-only">Step 3 of 5</span>
        <h2 className="af-title">Your lifestyle and food habits.</h2>
        <p className="af-subtitle">
          How you eat, sleep, move and feel day to day — now, and in the past if it was different.
          Short answers are fine.
        </p>

        <div style={{ position: "absolute", top: 0, right: 0 }}>
          {isSaving && (
            <span className="af-autosave">
              <Loader2 className="af-autosave-anim-spin" /> Saving…
            </span>
          )}
          {!isSaving && savedFlash && (
            <span className="af-autosave af-autosave--saved">
              <Check /> Saved
            </span>
          )}
        </div>
      </div>

      <div className="af-hint-row">
        <Clock /> About 4 minutes. Your answers save automatically as you type.
      </div>

      <form ref={formRef} onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        {errorKeys.length > 0 && (
          <div className="af-error-summary" role="alert">
            <div className="af-error-summary__title">
              <AlertTriangle />
              {errorKeys.length} {errorKeys.length === 1 ? "field needs" : "fields need"} your
              attention
            </div>
            <div className="af-error-summary__list">
              {errorKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  className="af-error-summary__btn"
                  onClick={() => focusField(key)}
                >
                  {FIELD_LABELS[key] ?? key}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Food ═══ */}
        <div className="af-section-card">
          <h3 className="af-card-heading">
            <Soup aria-hidden="true" />
            Food
          </h3>

          <div className="af-field" style={{ marginBottom: 24 }}>
            <FormField label="Diet" htmlFor="diet" required error={errors.diet?.message}>
              <Controller
                name="diet"
                control={control}
                render={({ field }) => (
                  <RadioPills
                    name={field.name}
                    options={DIET_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    hasError={!!errors.diet}
                  />
                )}
              />
            </FormField>
          </div>

          <div className="af-field" style={{ marginBottom: 24 }}>
            <FormField
              label="Food habits"
              htmlFor="foodHabits"
              required
              error={errors.foodHabits?.message}
              helper="Home-cooked or outside food, meal timings, skipped meals — now, and before if it was different."
              helperId="foodHabits-helper"
            >
              <TextArea
                id="foodHabits"
                placeholder="For example: mostly home-cooked, I skip breakfast on weekdays, eat out twice a week."
                hasError={!!errors.foodHabits}
                describedBy="foodHabits-helper"
                style={{ minHeight: 100 }}
                maxLength={1000}
                {...register("foodHabits")}
              />
            </FormField>
          </div>

          <div className="af-row" style={{ marginBottom: 24 }}>
            <FormField
              label="Food allergies"
              htmlFor="foodAllergies"
              required
              error={errors.foodAllergies?.message}
            >
              <TextInput
                id="foodAllergies"
                placeholder="e.g. peanuts — or 'none'"
                hasError={!!errors.foodAllergies}
                maxLength={400}
                {...register("foodAllergies")}
              />
            </FormField>

            <FormField label="Tea / Coffee" htmlFor="teaCoffee" error={errors.teaCoffee?.message}>
              <TextInput
                id="teaCoffee"
                placeholder="e.g. 2 cups of tea a day, with sugar"
                hasError={!!errors.teaCoffee}
                maxLength={300}
                {...register("teaCoffee")}
              />
            </FormField>
          </div>

          <div className="af-field" style={{ marginBottom: 24 }}>
            <FormField
              label="Known intolerances, or foods you avoid — and why?"
              htmlFor="intolerances"
              error={errors.intolerances?.message}
            >
              <TextArea
                id="intolerances"
                placeholder="e.g. milk makes me bloated, so I avoid it."
                hasError={!!errors.intolerances}
                style={{ minHeight: 90 }}
                maxLength={800}
                {...register("intolerances")}
              />
            </FormField>
          </div>

          <div className="af-field">
            <FormField
              label="Any sweet cravings?"
              htmlFor="sweetCravings"
              error={errors.sweetCravings?.message}
            >
              <Controller
                name="sweetCravings"
                control={control}
                render={({ field }) => (
                  <RadioPills
                    name={field.name}
                    options={CRAVING_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </FormField>
          </div>
        </div>

        {/* ═══ Day to day ═══ */}
        <div className="af-section-card">
          <h3 className="af-card-heading">
            <Moon aria-hidden="true" />
            Day to day
          </h3>

          <div className="af-field" style={{ marginBottom: 24 }}>
            <FormField label="Stress" htmlFor="stress" required error={errors.stress?.message}>
              <Controller
                name="stress"
                control={control}
                render={({ field }) => (
                  <RadioPills
                    name={field.name}
                    options={STRESS_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    hasError={!!errors.stress}
                  />
                )}
              />
            </FormField>
          </div>

          <div className="af-row" style={{ marginBottom: 24 }}>
            <FormField label="Sleep" htmlFor="sleep" required error={errors.sleep?.message}>
              <TextInput
                id="sleep"
                placeholder="e.g. 11 pm to 6 am, wake up tired"
                hasError={!!errors.sleep}
                maxLength={400}
                {...register("sleep")}
              />
            </FormField>

            <FormField
              label="Profession"
              htmlFor="profession"
              required
              error={errors.profession?.message}
            >
              <TextInput
                id="profession"
                placeholder="e.g. software engineer, student"
                hasError={!!errors.profession}
                maxLength={120}
                {...register("profession")}
              />
            </FormField>
          </div>

          <div className="af-field" style={{ marginBottom: 24 }}>
            <FormField
              label="Movement & exercise"
              htmlFor="exercise"
              required
              error={errors.exercise?.message}
            >
              <TextArea
                id="exercise"
                placeholder="What you do, how often, and for how long — or 'none'."
                hasError={!!errors.exercise}
                style={{ minHeight: 90 }}
                maxLength={600}
                {...register("exercise")}
              />
            </FormField>
          </div>

          <div className="af-row">
            <FormField
              label="Alcohol / smoking / recreational drugs"
              htmlFor="alcoholSmoking"
              error={errors.alcoholSmoking?.message}
            >
              <TextInput
                id="alcoholSmoking"
                placeholder="e.g. none, or occasionally"
                hasError={!!errors.alcoholSmoking}
                maxLength={300}
                {...register("alcoholSmoking")}
              />
            </FormField>

            <FormField
              label="Screen time / digital exposure"
              htmlFor="screenTime"
              error={errors.screenTime?.message}
            >
              <TextInput
                id="screenTime"
                placeholder="e.g. 8 hours a day, mostly work"
                hasError={!!errors.screenTime}
                maxLength={300}
                {...register("screenTime")}
              />
            </FormField>
          </div>
        </div>

        {/* ═══ Digestion ═══ */}
        <div className="af-section-card">
          <h3 className="af-card-heading">
            <Activity aria-hidden="true" />
            Digestion
          </h3>

          <div className="af-field" style={{ marginBottom: 24 }}>
            <FormField
              label="Bowel movement — which type is closest?"
              htmlFor="bowelType"
              required
              error={errors.bowelType?.message}
              helper="From the Bristol stool scale. Choose the type you see most often."
              helperId="bowelType-helper"
            >
              <Controller
                name="bowelType"
                control={control}
                render={({ field }) => (
                  <RadioPills
                    name={field.name}
                    options={BRISTOL_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    hasError={!!errors.bowelType}
                    describedBy="bowelType-helper"
                  />
                )}
              />
            </FormField>
          </div>

          <div className="af-field" style={{ marginBottom: 24 }}>
            <FormField
              label="How often, and anything else about it"
              htmlFor="bowelNote"
              error={errors.bowelNote?.message}
            >
              <TextInput
                id="bowelNote"
                placeholder="e.g. once a day, sometimes constipated"
                hasError={!!errors.bowelNote}
                maxLength={400}
                {...register("bowelNote")}
              />
            </FormField>
          </div>

          <div className="af-field">
            <FormField
              label="Do you have any of these?"
              htmlFor="digestiveSymptoms"
              helper="Tick any that apply. Leave them all clear if none do."
              helperId="digestive-helper"
            >
              <Controller
                name="digestiveSymptoms"
                control={control}
                render={({ field }) => (
                  <CheckboxGrid
                    options={toOptions(DIGESTIVE_SYMPTOMS)}
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                )}
              />
            </FormField>
            {(watch("digestiveSymptoms") ?? []).length > 0 && (
              <div style={{ marginTop: 16 }}>
                <FormField
                  label="Tell us a little more"
                  htmlFor="digestiveNote"
                  error={errors.digestiveNote?.message}
                >
                  <TextInput
                    id="digestiveNote"
                    placeholder="How often, and after which meals or foods?"
                    hasError={!!errors.digestiveNote}
                    maxLength={600}
                    {...register("digestiveNote")}
                  />
                </FormField>
              </div>
            )}
          </div>
        </div>

        {/* ═══ Other symptoms ═══ */}
        <div className="af-section-card">
          <h3 className="af-card-heading">
            <Stethoscope aria-hidden="true" />
            Other symptoms
          </h3>

          <div className="af-field">
            <FormField
              label="Have you had any of the following?"
              htmlFor="generalSymptoms"
              helper="Tick any that apply. Leave them all clear if none do."
              helperId="general-helper"
            >
              <Controller
                name="generalSymptoms"
                control={control}
                render={({ field }) => (
                  <CheckboxGrid
                    options={toOptions(GENERAL_SYMPTOMS)}
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                )}
              />
            </FormField>
            {(watch("generalSymptoms") ?? []).length > 0 && (
              <div style={{ marginTop: 16 }}>
                <FormField
                  label="Anything to add?"
                  htmlFor="generalSymptomsNote"
                  error={errors.generalSymptomsNote?.message}
                >
                  <TextInput
                    id="generalSymptomsNote"
                    placeholder="How long, how often, anything that makes it better or worse."
                    hasError={!!errors.generalSymptomsNote}
                    maxLength={600}
                    {...register("generalSymptomsNote")}
                  />
                </FormField>
              </div>
            )}
          </div>

          {askCycle && (
            <div className="af-field" style={{ marginTop: 26 }}>
              <FormField
                label="Is your menstrual cycle regular or irregular?"
                htmlFor="menstrualCycle"
                error={errors.menstrualCycle?.message}
              >
                <Controller
                  name="menstrualCycle"
                  control={control}
                  render={({ field }) => (
                    <RadioPills
                      name={field.name}
                      options={CYCLE_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </FormField>
              {watch("menstrualCycle") === "irregular" && (
                <div style={{ marginTop: 16 }}>
                  <FormField
                    label="Anything to add?"
                    htmlFor="menstrualNote"
                    error={errors.menstrualNote?.message}
                  >
                    <TextInput
                      id="menstrualNote"
                      placeholder="e.g. every 40–45 days, sometimes skipped"
                      hasError={!!errors.menstrualNote}
                      maxLength={400}
                      {...register("menstrualNote")}
                    />
                  </FormField>
                </div>
              )}
            </div>
          )}

          <div className="af-info-note">
            <Info aria-hidden="true" />
            <p>
              None of this is used to diagnose anything. It helps us see the whole picture before we
              speak with you.
            </p>
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className="af-pay-footer">
          <div className="af-pay-footer__row">
            <button type="button" className="af-back-btn" onClick={() => goToStep("health")}>
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
