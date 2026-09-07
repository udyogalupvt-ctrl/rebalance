import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sunrise,
  Coffee,
  UtensilsCrossed,
  CupSoda,
  Moon,
  Cookie,
  Lightbulb,
  ClipboardList,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import { nutritionSchema, type Nutrition } from "@/schemas/assessment";
import { FormField, TextInput, TextArea, RadioPills } from "@/components/assessment/fields";

type MealFormValue = {
  time?: string | undefined;
  items?: string | undefined;
};

type NutritionFormValues = {
  meals: {
    breakfast: MealFormValue;
    morningSnack: MealFormValue;
    lunch: MealFormValue;
    teaTime: MealFormValue;
    dinner: MealFormValue;
    bedtimeSnack: MealFormValue;
  };
  atypicalDay?: "yes" | "no" | undefined;
  atypicalNote?: string;
  waterIntake?: string;
  additionalNotes?: string;
};

const MEAL_CONFIG = [
  {
    key: "breakfast" as const,
    icon: Sunrise,
    title: "Breakfast",
    hint: "typically 7-9 AM",
    placeholder:
      "For example: 2 idlis with sambar and coconut chutney, one cup filter coffee with sugar.",
  },
  {
    key: "morningSnack" as const,
    icon: Coffee,
    title: "Morning snack",
    hint: "typically 10-11 AM",
    placeholder: "For example: a banana and a handful of peanuts. Or nothing.",
  },
  {
    key: "lunch" as const,
    icon: UtensilsCrossed,
    title: "Lunch",
    hint: "typically 1-2 PM",
    placeholder: "For example: 2 cups rice, dal, one sabzi, curd, a small piece of pickle.",
  },
  {
    key: "teaTime" as const,
    icon: CupSoda,
    title: "Tea time",
    hint: "typically 4-6 PM",
    placeholder: "For example: tea with sugar and two Marie biscuits.",
  },
  {
    key: "dinner" as const,
    icon: Moon,
    title: "Dinner",
    hint: "typically 8-9 PM",
    placeholder: "For example: 3 chapatis with paneer curry and salad.",
  },
  {
    key: "bedtimeSnack" as const,
    icon: Cookie,
    title: "Bedtime snack or dessert",
    hint: "typically after 10 PM",
    placeholder:
      "For example: a glass of milk, or two pieces of chocolate. Write 'none' if you don't eat after dinner.",
  },
];

const ATYPICAL_OPTIONS = [
  { value: "yes", label: "Yes, typical" },
  { value: "no", label: "No, unusual" },
];

export default function StepNutrition() {
  const { data, updateSection, markStepComplete, goToStep } = useAssessment();
  const formRef = useRef<HTMLFormElement>(null);
  const errorAnnouncerRef = useRef<HTMLDivElement>(null);

  const defaultMeals = (data.nutrition.meals || {}) as Partial<Nutrition["meals"]>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<NutritionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(nutritionSchema) as any,
    mode: "onBlur",
    defaultValues: {
      meals: {
        breakfast: defaultMeals.breakfast || { time: "", items: "" },
        morningSnack: defaultMeals.morningSnack || { time: "", items: "" },
        lunch: defaultMeals.lunch || { time: "", items: "" },
        teaTime: defaultMeals.teaTime || { time: "", items: "" },
        dinner: defaultMeals.dinner || { time: "", items: "" },
        bedtimeSnack: defaultMeals.bedtimeSnack || { time: "", items: "" },
      },
      atypicalDay: data.nutrition.atypicalDay,
      atypicalNote: data.nutrition.atypicalNote ?? "",
      waterIntake: data.nutrition.waterIntake ?? "",
      additionalNotes: data.nutrition.additionalNotes ?? "",
    },
  });

  const mealsWatch = watch("meals");
  const atypicalDayWatch = watch("atypicalDay");
  const atypicalNoteWatch = watch("atypicalNote");
  const waterWatch = watch("waterIntake");
  const notesWatch = watch("additionalNotes");

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
        const payload: Partial<Nutrition> = {};
        if (val.meals) payload.meals = val.meals as Nutrition["meals"];
        if (val.atypicalDay) payload.atypicalDay = val.atypicalDay as Nutrition["atypicalDay"];
        if (val.atypicalNote) payload.atypicalNote = val.atypicalNote;
        if (val.waterIntake) payload.waterIntake = val.waterIntake;
        if (val.additionalNotes) payload.additionalNotes = val.additionalNotes;

        updateSection("nutrition", payload);
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }, 800);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateSection]);

  /* ─── Derived state for UI ─── */
  const filledMeals = Object.values(mealsWatch).filter((m) => m?.items && m.items.length > 0);
  const filledCount = filledMeals.length;
  const isReady = filledCount >= 3;
  const isReviewReady = isReady && !!atypicalDayWatch;

  /* ─── Handlers ─── */
  const onSubmit = useCallback(async () => {
    await markStepComplete("nutrition");
    // Advance to review screen
    goToStep("review");
  }, [markStepComplete, goToStep]);

  const onError = useCallback(
    (fieldErrors: FieldErrors<NutritionFormValues>) => {
      // Find the first error to focus
      let firstErrorPath: string | null = null;

      if (fieldErrors.meals) {
        for (const key of MEAL_CONFIG.map((c) => c.key)) {
          if (fieldErrors.meals[key]) {
            firstErrorPath = `meals.${key}.items`;
            break;
          }
        }
      }
      if (!firstErrorPath && fieldErrors.atypicalDay) firstErrorPath = "atypicalDay";
      if (!firstErrorPath && fieldErrors.atypicalNote) firstErrorPath = "atypicalNote";

      const errorCount =
        Object.keys(fieldErrors).length +
        (fieldErrors.meals ? Object.keys(fieldErrors.meals).length : 0);

      if (firstErrorPath) {
        try {
          // @ts-expect-error - firstErrorPath is a runtime-derived string,
          // not a literal union member of the form schema.
          setFocus(firstErrorPath);
        } catch {
          const el = formRef.current?.querySelector(
            `[name="${firstErrorPath}"]`,
          ) as HTMLElement | null;
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 140;
            window.scrollTo({ top: y, behavior: "smooth" });
            el.focus();
          }
        }
      }

      if (errorAnnouncerRef.current) {
        errorAnnouncerRef.current.textContent = `There are validation errors.`;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setFocus],
  );

  return (
    <>
      <div className="af-sr-only" aria-live="assertive" ref={errorAnnouncerRef} />

      {/* ─── Heading block ─── */}
      <div className="af-heading-block" style={{ position: "relative" }}>
        {/* The step counter lives in <StepProgress> now — it was
            printing "Step 4 of 4" twice on phones, once in the progress bar
            and once here. */}
        <span className="sr-only">Step 4 of 4</span>
        <h2 className="af-title">What did you eat yesterday?</h2>
        <p className="af-subtitle">
          A single honest day tells us more than a week of what you think you should have eaten.
          Include portion sizes and times where you can — and don't clean it up.
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

      <div className="af-guidance-panel">
        <Lightbulb className="af-guidance-panel__icon" />
        <div>
          <div className="af-guidance-panel__title">Write it exactly as it happened.</div>
          <div className="af-guidance-panel__body">
            Two biscuits with tea counts. So does skipping lunch. If yesterday was unusual, say so
            at the bottom and describe a normal day instead.
          </div>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        {Object.keys(errors).length > 0 && (
          <div className="af-error-summary" role="alert">
            <div className="af-error-summary__title">
              <AlertTriangle />
              Please review the highlighted fields below
            </div>
          </div>
        )}

        {/* ─── Sticky Progress Indicator ─── */}
        <div className="af-sticky-progress">
          <div className="af-progress-dots">
            {MEAL_CONFIG.map((conf, i) => {
              const isFilled = (mealsWatch[conf.key]?.items || "").length > 0;
              return (
                <div
                  key={i}
                  className={`af-progress-dot ${isFilled ? "af-progress-dot--filled" : ""}`}
                />
              );
            })}
          </div>
          <div className="af-progress-divider" />
          <div
            className={`af-progress-text ${isReady ? "af-progress-status--ready" : "af-progress-status--warning"}`}
          >
            {filledCount} of 6 filled
            {isReady ? " · ready to continue" : " · at least 3 needed"}
          </div>
        </div>

        {/* ─── Meal Cards ─── */}
        {MEAL_CONFIG.map((meal) => {
          const Icon = meal.icon;
          const itemsValue = mealsWatch[meal.key]?.items || "";
          const isFilled = itemsValue.length > 0;
          const itemError = errors.meals?.[meal.key]?.items?.message;

          return (
            <div
              key={meal.key}
              className={`af-meal-card ${isFilled ? "af-meal-card--filled" : ""}`}
            >
              <div className="af-meal-header">
                <div className="af-meal-header-left">
                  <div className="af-meal-icon-box">
                    <Icon />
                  </div>
                  <div>
                    <div className="af-meal-title">{meal.title}</div>
                    <div className="af-meal-hint">{meal.hint}</div>
                  </div>
                </div>

                <div className="af-time-input-wrap">
                  <label htmlFor={`meals.${meal.key}.time`} className="af-sr-only">
                    {meal.title} time
                  </label>
                  <TextInput
                    id={`meals.${meal.key}.time`}
                    type="time"
                    placeholder="--:--"
                    {...register(`meals.${meal.key}.time`)}
                  />
                </div>
              </div>

              <div className="af-field">
                <label htmlFor={`meals.${meal.key}.items`} className="af-sr-only">
                  {meal.title} items
                </label>
                <TextArea
                  id={`meals.${meal.key}.items`}
                  placeholder={meal.placeholder}
                  hasError={!!itemError}
                  style={{ minHeight: 90 }}
                  maxLength={600}
                  {...register(`meals.${meal.key}.items`)}
                />

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <div className="af-field-error" style={{ minHeight: 18 }}>
                    {itemError}
                  </div>
                  <div className="af-char-counter" style={{ marginTop: 0 }}>
                    {itemsValue.length} / 600
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {errors.meals?.root && (
          <div className="af-field-error" style={{ margin: "8px 0 24px" }}>
            {errors.meals.root.message}
          </div>
        )}

        {/* ─── Card 7 — Anything Else ─── */}
        <div className="af-section-card" style={{ marginTop: 22, padding: "26px 24px" }}>
          <h3 className="af-card-heading">
            <ClipboardList aria-hidden="true" />
            Anything else
          </h3>

          <div style={{ marginBottom: 24 }}>
            <FormField
              label="Was yesterday a typical day of eating?"
              htmlFor="atypicalDay"
              required
              error={errors.atypicalDay?.message}
            >
              <Controller
                name="atypicalDay"
                control={control}
                render={({ field }) => (
                  <RadioPills
                    name={field.name}
                    options={ATYPICAL_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    hasError={!!errors.atypicalDay}
                  />
                )}
              />
            </FormField>
          </div>

          {atypicalDayWatch === "no" && (
            <div className="af-conditional-field" style={{ marginBottom: 24 }}>
              <FormField
                label="What does a normal day look like instead?"
                htmlFor="atypicalNote"
                required
                error={errors.atypicalNote?.message}
              >
                <TextArea
                  id="atypicalNote"
                  hasError={!!errors.atypicalNote}
                  style={{ minHeight: 100 }}
                  maxLength={400}
                  {...register("atypicalNote")}
                />
                <div className="af-char-counter">{(atypicalNoteWatch || "").length} / 400</div>
              </FormField>
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <FormField
              label="Water intake (optional)"
              htmlFor="waterIntake"
              error={errors.waterIntake?.message}
            >
              <TextInput
                id="waterIntake"
                placeholder="Roughly how many glasses or litres a day"
                hasError={!!errors.waterIntake}
                maxLength={200}
                {...register("waterIntake")}
              />
            </FormField>
          </div>

          <div>
            <FormField
              label="Anything else you'd like us to know? (optional)"
              htmlFor="additionalNotes"
              error={errors.additionalNotes?.message}
            >
              <TextArea
                id="additionalNotes"
                placeholder="Anything that didn't fit the earlier questions — context, concerns, or something you want to make sure we know."
                hasError={!!errors.additionalNotes}
                style={{ minHeight: 110 }}
                maxLength={1000}
                {...register("additionalNotes")}
              />
              <div className="af-char-counter">{(notesWatch || "").length} / 1000</div>
            </FormField>
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className="af-pay-footer">
          <div className="af-pay-footer__row">
            <button type="button" className="af-back-btn" onClick={() => goToStep("health")}>
              <ArrowLeft aria-hidden="true" />
              Back
            </button>

            <button
              type="submit"
              className="af-submit-btn"
              disabled={!isReviewReady}
              title={
                !isReviewReady
                  ? "Fill in at least three meals and answer if it was a typical day to continue."
                  : ""
              }
              style={{
                opacity: isReviewReady ? 1 : 0.45,
                cursor: isReviewReady ? "pointer" : "not-allowed",
              }}
            >
              Review My Answers
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
