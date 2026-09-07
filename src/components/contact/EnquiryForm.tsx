import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Lock,
  MessageSquare,
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CurveDivider } from "@/components/shared/CurveDivider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

// Form Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^(\+91[\s-]?)?[0]?(91)?[6789]\d{9}$/, "Please enter a valid Indian mobile number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  city: z.string().min(1, "Please enter your city"),
  topic: z.string().min(1, "Please choose a topic"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message too long"),
  preferredContact: z.string(),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to continue",
  }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const EnquiryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      preferredContact: "WhatsApp",
      consent: false,
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Rate guard
    const lastSubmit = sessionStorage.getItem("last_contact_submit");
    if (lastSubmit && Date.now() - parseInt(lastSubmit) < 30000) {
      setError("Please wait 30 seconds before sending another message.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Normalise phone number
      const normalizedPhone = data.phone.replace(/[\s-]/g, "");

      await addDoc(collection(db, "enquiries"), {
        ...data,
        phone: normalizedPhone,
        createdAt: serverTimestamp(),
        status: "new",
        // Explicit null so the admin unread badge can query on it —
        // Firestore cannot filter on a missing field.
        readAt: null,
        source: "contact_page",
      });

      sessionStorage.setItem("last_contact_submit", Date.now().toString());
      setIsSuccess(true);
      reset();
    } catch (err: unknown) {
      console.error("Firebase Error:", err);
      setError(
        "Something went wrong sending your message. Please try again, or reach us on WhatsApp.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageValue = watch("message", "");
  React.useEffect(() => {
    setCharCount(messageValue.length);
  }, [messageValue]);

  const firstName = watch("name")?.split(" ")[0] || "there";

  return (
    <SectionWrapper id="enquiry" bg="alt" labelledBy="enquiry-heading">
      <CurveDivider fill="alt" />

      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-11 lg:gap-[72px] items-start">
        {/* Left Column - Info */}
        <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)] self-start">
          <SectionHeading
            eyebrow="SEND A MESSAGE"
            title="Tell us what you're *dealing with*."
            subtitle="A short message is enough. You don't need to explain everything here — that's what the assessment is for."
            className="mb-9"
          />

          <div className="mt-9 space-y-9">
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground block mb-5">
                WHAT HAPPENS NEXT
              </span>
              <div className="space-y-[18px]">
                {[
                  {
                    title: "We read it personally",
                    body: "Every message reaches the clinic directly. Nothing is filtered through a bot.",
                  },
                  {
                    title: "You get a real reply",
                    body: "Usually within 24 hours on working days, answering what you actually asked.",
                  },
                  {
                    title: "You decide from there",
                    body: "If an assessment makes sense, we'll say so. If it doesn't, we'll say that too.",
                  },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-3.5">
                    <div className="w-8 h-8 shrink-0 bg-primary-soft rounded-full grid place-items-center">
                      <span className="font-fraunces font-medium text-[13px] text-primary">
                        {idx + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-[14.5px] font-semibold text-foreground">{step.title}</h4>
                      <p className="text-[13.5px] text-muted-foreground leading-relaxed mt-1">
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-[18px] p-5 lg:p-[20px_22px] flex gap-3.5">
              <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                Anything you share here is confidential and used only to respond to your enquiry. It
                isn't added to a mailing list.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="bg-surface border border-border rounded-[26px] p-10 md:p-[40px_38px] sm:p-[30px_24px] p-[26px_20px]"
              >
                <form
                  onSubmit={handleSubmit((data) => onSubmit(data))}
                  noValidate
                  className="space-y-[22px]"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[13.5px] font-semibold">
                        Your name{" "}
                        <span className="text-danger" aria-hidden="true">
                          *
                        </span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Full name"
                        {...register("name")}
                        className={cn(
                          "h-[50px] bg-background border-[1.5px] rounded-[14px] px-4 text-[15px] focus-visible:ring-primary-soft focus-visible:border-primary",
                          errors.name &&
                            "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive",
                        )}
                      />
                      {errors.name && (
                        <span className="text-[12.5px] text-destructive flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                          <AlertCircle className="w-[13px] h-[13px]" />
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[13.5px] font-semibold">
                        Phone number{" "}
                        <span className="text-danger" aria-hidden="true">
                          *
                        </span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 00000 00000"
                        {...register("phone")}
                        className={cn(
                          "h-[50px] bg-background border-[1.5px] rounded-[14px] px-4 text-[15px] focus-visible:ring-primary-soft focus-visible:border-primary",
                          errors.phone &&
                            "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive",
                        )}
                      />
                      {errors.phone && (
                        <span className="text-[12.5px] text-destructive flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                          <AlertCircle className="w-[13px] h-[13px]" />
                          {errors.phone.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[13.5px] font-semibold">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      className={cn(
                        "h-[50px] bg-background border-[1.5px] rounded-[14px] px-4 text-[15px] focus-visible:ring-primary-soft focus-visible:border-primary",
                        errors.email &&
                          "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive",
                      )}
                    />
                    <p className="text-[12.5px] text-muted-foreground">
                      Optional — only if you'd prefer a written reply.
                    </p>
                    {errors.email && (
                      <span className="text-[12.5px] text-destructive flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="w-[13px] h-[13px]" />
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-[13.5px] font-semibold">
                      City{" "}
                      <span className="text-danger" aria-hidden="true">
                        *
                      </span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="e.g. Kakinada"
                      {...register("city")}
                      className={cn(
                        "h-[50px] bg-background border-[1.5px] rounded-[14px] px-4 text-[15px] focus-visible:ring-primary-soft focus-visible:border-primary",
                        errors.city &&
                          "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive",
                      )}
                    />
                    {errors.city && (
                      <span className="text-[12.5px] text-destructive flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="w-[13px] h-[13px]" />
                        {errors.city.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[13.5px] font-semibold">
                      What's this regarding?{" "}
                      <span className="text-danger" aria-hidden="true">
                        *
                      </span>
                    </Label>
                    <Select
                      onValueChange={(val) => setValue("topic", val, { shouldValidate: true })}
                    >
                      <SelectTrigger
                        className={cn(
                          "h-[50px] bg-background border-[1.5px] rounded-[14px] px-4 text-[15px] focus:ring-primary-soft focus:border-primary",
                          errors.topic && "border-destructive ring-destructive/10",
                        )}
                      >
                        <SelectValue placeholder="Choose a topic" />
                      </SelectTrigger>
                      <SelectContent className="rounded-[14px] border-border bg-surface">
                        <SelectItem value="Gut health & digestion">
                          Gut health & digestion
                        </SelectItem>
                        <SelectItem value="PCOS & hormonal">PCOS & hormonal</SelectItem>
                        <SelectItem value="Weight management">Weight management</SelectItem>
                        <SelectItem value="Thyroid & metabolic">Thyroid & metabolic</SelectItem>
                        <SelectItem value="Skin, hair & immunity">Skin, hair & immunity</SelectItem>
                        <SelectItem value="Preventive & family nutrition">
                          Preventive & family nutrition
                        </SelectItem>
                        <SelectItem value="Fees & program details">
                          Fees & program details
                        </SelectItem>
                        <SelectItem value="Something else">Something else</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.topic && (
                      <span className="text-[12.5px] text-destructive flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="w-[13px] h-[13px]" />
                        {errors.topic.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="message" className="text-[13.5px] font-semibold">
                      Your message{" "}
                      <span className="text-danger" aria-hidden="true">
                        *
                      </span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Briefly, what's been going on? Symptoms, how long, anything you've already tried."
                      {...register("message")}
                      className={cn(
                        "min-height-[140px] resize-y bg-background border-[1.5px] rounded-[14px] p-[14px_16px] text-[15px] focus-visible:ring-primary-soft focus-visible:border-primary",
                        errors.message &&
                          "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive",
                      )}
                    />
                    <div
                      className={cn(
                        "absolute bottom-3 right-3 text-[12px]",
                        charCount > 1000
                          ? "text-danger"
                          : charCount > 900
                            ? "text-accent-contrast"
                            : "text-muted-foreground",
                      )}
                      aria-live="polite"
                    >
                      {charCount}/1000
                    </div>
                    {errors.message && (
                      <span className="text-[12.5px] text-destructive flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="w-[13px] h-[13px]" />
                        {errors.message.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[13.5px] font-semibold">Preferred contact method</Label>
                    <RadioGroup
                      defaultValue="WhatsApp"
                      onValueChange={(val) => setValue("preferredContact", val)}
                      className="flex flex-wrap gap-2.5"
                    >
                      {["WhatsApp", "Phone call", "Email"].map((method) => {
                        const isSelected = watch("preferredContact") === method;
                        return (
                          <Label
                            key={method}
                            className={cn(
                              "cursor-pointer flex-1 min-w-[100px] h-[44px] grid place-items-center text-sm font-medium rounded-full border transition-all duration-200",
                              isSelected
                                ? "bg-primary-strong text-on-primary border-primary"
                                : "bg-surface text-muted-foreground border-border hover:border-primary/30",
                            )}
                          >
                            <RadioGroupItem value={method} className="sr-only" />
                            {method}
                          </Label>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-3 mt-4">
                      <Checkbox
                        id="consent"
                        onCheckedChange={(checked) =>
                          setValue("consent", checked === true, {
                            shouldValidate: true,
                          })
                        }
                        className="w-[18px] h-[18px] rounded-[6px] border-[1.5px] data-[state=checked]:bg-primary transition-transform data-[state=checked]:scale-110"
                      />
                      <Label
                        htmlFor="consent"
                        className="text-[13.5px] leading-relaxed text-muted-foreground cursor-pointer"
                      >
                        I consent to GoRebalance contacting me regarding this enquiry.{" "}
                        <span className="text-danger">*</span>
                      </Label>
                    </div>
                    {errors.consent && (
                      <span className="text-[12.5px] text-destructive flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="w-[13px] h-[13px]" />
                        {errors.consent.message}
                      </span>
                    )}
                  </div>

                  {error && (
                    <div className="bg-destructive/8 border border-destructive/30 rounded-[14px] p-[14px_16px] text-sm text-destructive flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <p>
                        {error}
                        {error.includes("WhatsApp") && (
                          <a
                            href="https://wa.me/919390414536"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline ml-1 font-semibold"
                          >
                            WhatsApp
                          </a>
                        )}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-full bg-accent-strong hover:bg-accent-strong/90 text-on-accent font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(var(--accent-rgb), 0.32)] gap-2.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-[18px] h-[18px] animate-spin" />
                        <span>Sending…</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-[18px] h-[18px]" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-[12.5px] text-muted-foreground">
                    <Clock className="w-[13px] h-[13px]" />
                    <span>We reply within 24 hours on working days.</span>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, type: "spring", damping: 20 }}
                className="bg-surface border border-border rounded-[26px] p-12 sm:p-[48px_32px] text-center flex flex-col items-center justify-center min-h-[600px]"
              >
                <div className="w-[72px] h-[72px] bg-primary-soft rounded-full grid place-items-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-[34px] h-[34px] text-primary" />
                  </motion.div>
                </div>

                <h3 className="font-fraunces font-medium text-[clamp(1.25rem,2vw,1.5rem)] text-foreground mb-3">
                  Message received.
                </h3>

                <p className="text-[15px] leading-[1.7] text-muted-foreground max-w-[46ch] mx-auto mb-7">
                  Thanks, {firstName}. We've got your message and you'll hear from us within 24
                  hours on working days.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[400px]">
                  <Button
                    asChild
                    className="flex-1 bg-accent-strong hover:bg-accent-strong/90 text-white rounded-full"
                  >
                    <Link to="/assessment">Take the Assessment &rarr;</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsSuccess(false)}
                    className="flex-1 rounded-full border-border bg-transparent"
                  >
                    Send another message
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  );
};
