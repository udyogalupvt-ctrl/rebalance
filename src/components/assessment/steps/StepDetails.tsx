import { useCallback, useEffect, useRef } from "react";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Video, ArrowRight, Lock } from "lucide-react";
import { detailsSchema, type Details } from "@/schemas/assessment";
import { useAssessment } from "@/context/AssessmentContext";
import {
  FormField,
  TextInput,
  NumberInput,
  TextArea,
  PhoneInput,
  SelectField,
  RadioCards,
  type RadioCardOption,
} from "@/components/assessment/fields";

/**
 * Form values type — mirrors the schema fields but uses
 * raw input types (string for age) since react-hook-form
 * operates on input values, not Zod-transformed output.
 */
interface DetailsFormValues {
  fullName: string;
  age: number;
  gender: "female" | "male" | "other" | "prefer_not_to_say";
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  preferredMode: "in_clinic_kakinada" | "online";
  referralSource?: string | undefined;
  selectedSymptoms?: string[] | undefined;
  programInterest?: string | undefined;
}

/* ─── Options ─── */
const GENDER_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const CONSULTATION_OPTIONS: RadioCardOption[] = [
  {
    value: "in_clinic_kakinada",
    title: "In-clinic, Kakinada",
    description: "Consultation at the Kakinada, Andhra Pradesh clinic",
    icon: Building2,
  },
  {
    value: "online",
    title: "Online consultation",
    description: "Video consultation, anywhere in India",
    icon: Video,
  },
];

const REFERRAL_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "google_search", label: "Google search" },
  { value: "referred_friend_family", label: "Referred by a friend or family" },
  { value: "referred_doctor", label: "Referred by a doctor" },
  { value: "youtube", label: "YouTube" },
  { value: "other", label: "Other" },
];

/* ─── Title-case helper ─── */
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s|-)\S/g, (match) => match.toUpperCase());
}

/* ─── Component ─── */
export default function StepDetails() {
  const { data, updateSection, markStepComplete, goToStep } = useAssessment();
  const formRef = useRef<HTMLFormElement>(null);
  const errorAnnouncerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setFocus,
    getValues,
    trigger,
  } = useForm<DetailsFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(detailsSchema) as any,
    mode: "onBlur",
    defaultValues: {
      fullName: (data.details.fullName as string) ?? "",
      age: (data.details.age as number | undefined) ?? (undefined as unknown as number),
      gender:
        (data.details.gender as DetailsFormValues["gender"] | undefined) ??
        (undefined as unknown as DetailsFormValues["gender"]),
      email: (data.details.email as string) ?? "",
      phone: (data.details.phone as string) ?? "",
      addressLine: (data.details.addressLine as string) ?? "",
      city: (data.details.city as string) ?? "",
      state: (data.details.state as string) ?? "",
      pincode: (data.details.pincode as string) ?? "",
      preferredMode:
        (data.details.preferredMode as DetailsFormValues["preferredMode"] | undefined) ??
        (undefined as unknown as DetailsFormValues["preferredMode"]),
      referralSource: (data.details.referralSource as string) ?? "",
    },
  });

  /* ─── On-blur normalisations ─── */
  const normaliseFullName = useCallback(() => {
    const val = getValues("fullName");
    if (val) setValue("fullName", toTitleCase(val.trim()));
  }, [getValues, setValue]);

  const normaliseEmail = useCallback(() => {
    const val = getValues("email");
    if (val) setValue("email", val.trim().toLowerCase());
  }, [getValues, setValue]);

  const normalisePhone = useCallback(() => {
    const val = getValues("phone");
    if (val) {
      const digits = val.replace(/\D/g, "");
      setValue("phone", digits.slice(-10));
    }
  }, [getValues, setValue]);

  const normalisePincode = useCallback(() => {
    const val = getValues("pincode");
    if (val) setValue("pincode", val.replace(/\D/g, ""));
  }, [getValues, setValue]);

  /* ─── Submit handler ─── */
  const onSubmit = useCallback(
    async (formData: DetailsFormValues) => {
      updateSection("details", formData as unknown as Partial<Details>);
      await markStepComplete("details");
      goToStep("payment");
    },
    [updateSection, markStepComplete, goToStep],
  );

  /* ─── Error handler (focus first invalid field) ─── */
  const onError = useCallback(
    (fieldErrors: FieldErrors<DetailsFormValues>) => {
      const errorKeys = Object.keys(fieldErrors) as (keyof DetailsFormValues)[];
      const errorCount = errorKeys.length;

      if (errorCount > 0 && errorKeys[0]) {
        // Focus the first errored field
        try {
          setFocus(errorKeys[0]);
        } catch {
          // Some fields (like radio) may not be focusable via setFocus
          const el = formRef.current?.querySelector(
            `[name="${errorKeys[0]}"]`,
          ) as HTMLElement | null;
          el?.focus();
        }

        // Scroll into view with offset
        const fieldEl = formRef.current?.querySelector(
          `[name="${errorKeys[0]}"]`,
        ) as HTMLElement | null;
        if (fieldEl) {
          const wrapper = fieldEl.closest(".af-field") as HTMLElement | null;
          (wrapper ?? fieldEl).scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }

        // Announce error count
        if (errorAnnouncerRef.current) {
          errorAnnouncerRef.current.textContent = `${errorCount} ${errorCount === 1 ? "field has" : "fields have"} errors. Please review and correct them.`;
        }
      }
    },
    [setFocus],
  );

  /* ─── Registration helpers with blur normalisers ─── */
  const fullNameReg = register("fullName", { onBlur: normaliseFullName });
  const emailReg = register("email", { onBlur: normaliseEmail });
  const phoneReg = register("phone", { onBlur: normalisePhone });
  const pincodeReg = register("pincode", { onBlur: normalisePincode });

  return (
    <>
      {/* ─── Heading block ─── */}
      <div className="af-heading-block">
        {/* The step counter lives in <StepProgress> now — it was
            printing "Step 1 of 4" twice on phones, once in the progress bar
            and once here. */}
        <span className="sr-only">Step 1 of 4</span>
        <h2 className="af-title">Let's start with you.</h2>
        <p className="af-subtitle">
          Basic details so we know who we're speaking with and how to reach you. This takes about
          two minutes.
        </p>
      </div>

      {/* ─── Form card ─── */}
      <form
        ref={formRef}
        className="af-form-card"
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
      >
        {/* ── About you ── */}
        <h3 className="af-group-heading">About you</h3>

        <FormField
          label="Full name"
          htmlFor="fullName"
          required
          error={errors.fullName?.message}
          errorId="fullName-error"
        >
          <TextInput
            id="fullName"
            placeholder="Your full name"
            autoComplete="name"
            enterKeyHint="next"
            hasError={!!errors.fullName}
            describedBy={errors.fullName ? "fullName-error" : undefined}
            {...fullNameReg}
          />
        </FormField>

        <div className="af-row">
          <FormField
            label="Age"
            htmlFor="age"
            required
            error={errors.age?.message}
            errorId="age-error"
          >
            <NumberInput
              id="age"
              placeholder="e.g. 32"
              autoComplete="off"
              enterKeyHint="next"
              min={1}
              max={120}
              hasError={!!errors.age}
              describedBy={errors.age ? "age-error" : undefined}
              {...register("age", { valueAsNumber: true })}
            />
          </FormField>

          <FormField
            label="Gender"
            htmlFor="gender"
            required
            error={errors.gender?.message}
            errorId="gender-error"
          >
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <SelectField
                  id="gender"
                  placeholder="Select gender"
                  options={GENDER_OPTIONS}
                  hasError={!!errors.gender}
                  describedBy={errors.gender ? "gender-error" : undefined}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormField>
        </div>

        {/* ── How we reach you ── */}
        <h3 className="af-group-heading">How we reach you</h3>

        <FormField
          label="Phone"
          htmlFor="phone"
          required
          helper="We'll confirm your consultation on this number."
          error={errors.phone?.message}
          errorId="phone-error"
          helperId="phone-helper"
        >
          <PhoneInput
            id="phone"
            placeholder="98765 43210"
            autoComplete="tel-national"
            enterKeyHint="next"
            hasError={!!errors.phone}
            describedBy={errors.phone ? "phone-error" : "phone-helper"}
            {...phoneReg}
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="email"
          required
          helper="Your plan and follow-ups are sent here."
          error={errors.email?.message}
          errorId="email-error"
          helperId="email-helper"
        >
          <TextInput
            id="email"
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            autoComplete="email"
            enterKeyHint="next"
            hasError={!!errors.email}
            describedBy={errors.email ? "email-error" : "email-helper"}
            {...emailReg}
          />
        </FormField>

        {/* ── Where you are ── */}
        <h3 className="af-group-heading">Where you are</h3>

        <FormField
          label="Address"
          htmlFor="addressLine"
          required
          error={errors.addressLine?.message}
          errorId="addressLine-error"
        >
          <TextArea
            id="addressLine"
            placeholder="Street address, area or locality"
            autoComplete="street-address"
            enterKeyHint="next"
            short
            hasError={!!errors.addressLine}
            describedBy={errors.addressLine ? "addressLine-error" : undefined}
            {...register("addressLine")}
          />
        </FormField>

        <div className="af-row">
          <FormField
            label="City"
            htmlFor="city"
            required
            error={errors.city?.message}
            errorId="city-error"
          >
            <TextInput
              id="city"
              placeholder="e.g. Kakinada"
              autoComplete="address-level2"
              enterKeyHint="next"
              hasError={!!errors.city}
              describedBy={errors.city ? "city-error" : undefined}
              {...register("city")}
            />
          </FormField>

          <FormField
            label="State"
            htmlFor="state"
            required
            error={errors.state?.message}
            errorId="state-error"
          >
            <TextInput
              id="state"
              placeholder="e.g. Andhra Pradesh"
              autoComplete="address-level1"
              enterKeyHint="next"
              hasError={!!errors.state}
              describedBy={errors.state ? "state-error" : undefined}
              {...register("state")}
            />
          </FormField>
        </div>

        <div className="af-half">
          <FormField
            label="Pincode"
            htmlFor="pincode"
            required
            error={errors.pincode?.message}
            errorId="pincode-error"
          >
            <TextInput
              id="pincode"
              inputMode="numeric"
              placeholder="500001"
              autoComplete="postal-code"
              enterKeyHint="next"
              maxLength={6}
              hasError={!!errors.pincode}
              describedBy={errors.pincode ? "pincode-error" : undefined}
              {...pincodeReg}
            />
          </FormField>
        </div>

        {/* ── Your consultation ── */}
        <h3 className="af-group-heading">Your consultation</h3>

        <FormField
          label="Preferred mode of consultation"
          htmlFor="preferredMode"
          required
          error={errors.preferredMode?.message}
          errorId="preferredMode-error"
        >
          <Controller
            name="preferredMode"
            control={control}
            render={({ field }) => (
              <RadioCards
                name="preferredMode"
                options={CONSULTATION_OPTIONS}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  // Trigger validation after selection
                  trigger("preferredMode");
                }}
                hasError={!!errors.preferredMode}
                describedBy={errors.preferredMode ? "preferredMode-error" : undefined}
              />
            )}
          />
        </FormField>

        <FormField label="How did you hear about us?" htmlFor="referralSource">
          <Controller
            name="referralSource"
            control={control}
            render={({ field }) => {
              // "Other" is stored as `other:<free text>` so the select keeps a
              // stable value while the typed detail travels with it.
              const isOther = (field.value ?? "").startsWith("other");
              const otherText = isOther ? (field.value ?? "").replace(/^other:?/, "") : "";

              return (
                <>
                  <SelectField
                    id="referralSource"
                    placeholder="Select an option"
                    options={REFERRAL_OPTIONS}
                    value={isOther ? "other" : (field.value ?? "")}
                    onChange={(e) =>
                      field.onChange(e.target.value === "other" ? "other:" : e.target.value)
                    }
                    onBlur={field.onBlur}
                    enterKeyHint="done"
                  />

                  {isOther && (
                    <div className="af-referral-other">
                      <label className="af-label" htmlFor="referralSourceOther">
                        Tell us where you heard about us
                      </label>
                      <TextInput
                        id="referralSourceOther"
                        autoFocus
                        maxLength={80}
                        placeholder="e.g. a podcast, a health camp, a colleague"
                        value={otherText}
                        onChange={(e) => field.onChange(`other:${e.target.value}`)}
                        onBlur={field.onBlur}
                        enterKeyHint="done"
                      />
                    </div>
                  )}
                </>
              );
            }}
          />
        </FormField>

        {/* ── Footer ── */}
        <div className="af-footer">
          <button type="submit" className="af-submit-btn">
            Continue to Payment
            <ArrowRight aria-hidden="true" />
          </button>
          <p className="af-privacy-note">
            <Lock aria-hidden="true" />
            Your details are confidential and used only for your consultation.
          </p>
        </div>
      </form>

      {/* ─── Error announcer (a11y) ─── */}
      <div
        ref={errorAnnouncerRef}
        className="af-sr-only"
        aria-live="assertive"
        aria-atomic="true"
      />
    </>
  );
}
