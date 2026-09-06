import { z } from "zod";

/* ─── helpers ─── */
const indianPhoneRegex = /^(?:\+?91[\s-]?)?(?:0[\s-]?)?[6789]\d{9}$/;
const pincodeRegex = /^\d{6}$/;
const isoDate = z.string().datetime({ offset: true });

/* ─── Step 1 — Details ─── */
export const detailsSchema = z.object({
  fullName: z
    .string({ error: "Please enter your name." })
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "Name can be at most 80 characters."),

  age: z.coerce
    .number({ error: "Please enter an age between 1 and 120." })
    .int("Please enter an age between 1 and 120.")
    .min(1, "Please enter an age between 1 and 120.")
    .max(120, "Please enter an age between 1 and 120."),

  gender: z.enum(["female", "male", "other", "prefer_not_to_say"], {
    error: "Please choose an option.",
  }),

  email: z
    .string({ error: "That email doesn't look right — check for a typo." })
    .trim()
    .email("That email doesn't look right — check for a typo.")
    .transform((v) => v.toLowerCase()),

  phone: z
    .string({ error: "Please enter a valid 10-digit Indian mobile number." })
    .trim()
    .regex(indianPhoneRegex, "Please enter a valid 10-digit Indian mobile number.")
    .transform((v) => {
      const digits = v.replace(/\D/g, "");
      return digits.slice(-10);
    }),

  addressLine: z
    .string({ error: "Please enter your address." })
    .trim()
    .min(5, "Please enter your address.")
    .max(200, "Address can be at most 200 characters."),

  city: z
    .string({ error: "Please enter your city." })
    .trim()
    .min(2, "Please enter your city.")
    .max(60, "City can be at most 60 characters."),

  state: z
    .string({ error: "Please enter your state." })
    .trim()
    .min(2, "Please enter your state.")
    .max(60, "State can be at most 60 characters."),

  pincode: z
    .string({ error: "Pincode should be 6 digits." })
    .regex(pincodeRegex, "Pincode should be 6 digits."),

  preferredMode: z.enum(["in_clinic_kakinada", "online"], {
    error: "Please choose how you'd like to consult.",
  }),

  referralSource: z.string().trim().max(100).optional(),
  selectedSymptoms: z.array(z.string()).optional(),
  programInterest: z.string().optional(),
});

/* ─── Step 2 — Payment ─── */
export const paymentSchema = z.object({
  screenshotUrl: z
    .string({ error: "Please upload your payment screenshot." })
    .url("Please upload your payment screenshot.")
    .refine((v) => v.startsWith("https://"), "Must be an HTTPS URL"),
  screenshotPublicId: z.string({ error: "Upload is incomplete." }),
  uploadedAt: isoDate,
  transactionRef: z
    .string()
    .trim()
    .max(60, "Transaction reference can be at most 60 characters.")
    .optional(),
  verificationStatus: z.enum(["pending", "verified", "not_verified"]).default("pending"),
  verifiedAt: isoDate.nullable().default(null),
  verifiedBy: z.string().nullable().default(null),
});

/* ─── Step 3 — Health ─── */
export const healthSchema = z
  .object({
    weightKg: z.coerce
      .number({ error: "Please enter your weight in kg." })
      .min(20, "Please enter your weight in kg.")
      .max(300, "Please enter your weight in kg."),
    heightCm: z.coerce
      .number({ error: "Please enter your height in cm." })
      .min(80, "Please enter your height in cm.")
      .max(250, "Please enter your height in cm."),
    weightChange6m: z.enum(["gained", "lost", "stable", "unsure"], {
      error: "Please choose an option.",
    }),
    weightChangeAmountKg: z
      .union([z.number(), z.string()])
      .optional()
      .transform((val) => (val === "" || val === undefined ? undefined : Number(val))),
    goals: z
      .string({ error: "Please tell us a little about your goals — a sentence or two is enough." })
      .trim()
      .min(10, "Please tell us a little about your goals — a sentence or two is enough.")
      .max(1500, "Goals can be at most 1500 characters."),
    pastMedicalHistory: z
      .string()
      .trim()
      .max(2000, "Maximum 2000 characters allowed.")
      .min(1, "Please enter your medical history (or 'none')."),
    currentSymptoms: z
      .string()
      .trim()
      .max(2000, "Maximum 2000 characters allowed.")
      .min(1, "Please enter your current symptoms (or 'none')."),
    supplementHistory: z
      .string()
      .trim()
      .max(1500, "Maximum 1500 characters allowed.")
      .min(1, "Please enter your supplement history (or 'none')."),
    currentMedications: z
      .string()
      .trim()
      .max(1500, "Maximum 1500 characters allowed.")
      .min(1, "Please enter your current medications (or 'none')."),
  })
  .superRefine((data, ctx) => {
    if (data.weightChange6m === "gained" || data.weightChange6m === "lost") {
      if (
        data.weightChangeAmountKg === undefined ||
        isNaN(data.weightChangeAmountKg) ||
        data.weightChangeAmountKg < 0 ||
        data.weightChangeAmountKg > 100
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["weightChangeAmountKg"],
          message: "Please enter a valid amount (0-100).",
        });
      }
    }
  });

/* ─── Step 4 — Nutrition ─── */
const mealSchema = z.object({
  time: z.string().trim().optional(),
  items: z.string().trim().max(600, "Maximum 600 characters.").optional(),
});

export const nutritionSchema = z
  .object({
    meals: z.object({
      breakfast: mealSchema,
      morningSnack: mealSchema,
      lunch: mealSchema,
      teaTime: mealSchema,
      dinner: mealSchema,
      bedtimeSnack: mealSchema,
    }),
    atypicalDay: z.enum(["yes", "no"], {
      error: "Please let us know if yesterday was a typical day.",
    }),
    atypicalNote: z.string().trim().max(400, "Maximum 400 characters.").optional(),
    waterIntake: z.string().trim().max(200, "Maximum 200 characters.").optional(),
    additionalNotes: z.string().trim().max(1000, "Maximum 1000 characters.").optional(),
  })
  .superRefine((data, ctx) => {
    // Check that at least 3 meals have items filled
    const mealValues = Object.values(data.meals);
    const filledMealsCount = mealValues.filter((m) => m.items && m.items.length > 0).length;

    if (filledMealsCount < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["meals"], // attach to meals root for general form errors if needed
        message: "Please fill in at least three meals so we can see your pattern.",
      });
    }

    // Check that no meal has a time but no items
    Object.entries(data.meals).forEach(([key, meal]) => {
      if (meal.time && (!meal.items || meal.items.length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["meals", key, "items"],
          message: "Add what you ate, or clear the time.",
        });
      }
    });

    // Check that if atypicalDay is "no" (unusual), the note is required
    if (data.atypicalDay === "no" && (!data.atypicalNote || data.atypicalNote.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["atypicalNote"],
        message: "Please describe what a normal day looks like.",
      });
    }
  });

/* ─── Consent ─── */
export const consentSchema = z.object({
  accurateInfo: z.literal(true),
  contactConsent: z.literal(true),
  dataConsent: z.literal(true),
});

/* ─── Full assessment ─── */
export const fullAssessmentSchema = z.object({
  details: detailsSchema,
  payment: paymentSchema,
  health: healthSchema,
  nutrition: nutritionSchema,
  consent: consentSchema,
});

/* ─── Inferred types ─── */
export type Details = z.infer<typeof detailsSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type Consent = z.infer<typeof consentSchema>;
export type Health = z.infer<typeof healthSchema>;
export type Nutrition = z.infer<typeof nutritionSchema>;
export type FullAssessment = z.infer<typeof fullAssessmentSchema>;
