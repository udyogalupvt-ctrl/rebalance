import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  User,
  Receipt,
  HeartPulse,
  UtensilsCrossed,
  Pencil,
  ChevronDown,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Send,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import { format } from "date-fns";
import { type AssessmentStep } from "@/context/AssessmentContext";

function ReviewRow({
  label,
  value,
  isLong = false,
}: {
  label: string;
  value?: string | number | null | undefined;
  isLong?: boolean | undefined;
}) {
  return (
    <div style={{ gridColumn: isLong ? "1 / -1" : "auto" }}>
      <div className="af-dt">{label}</div>
      {value ? <div className="af-dd">{value}</div> : <div className="af-dd af-dd--empty">—</div>}
    </div>
  );
}

export default function StepReview() {
  const { data, goToStep, submitFinal } = useAssessment();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const [consent, setConsent] = useState({
    accurateInfo: false,
    contactConsent: false,
    dataConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (e: React.MouseEvent, step: AssessmentStep) => {
    e.stopPropagation();
    goToStep(step);
  };

  const canSubmit = consent.accurateInfo && consent.contactConsent && consent.dataConsent;

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setError(false);

    try {
      await submitFinal({
        accurateInfo: true,
        contactConsent: true,
        dataConsent: true,
      });
      // Will navigate automatically via context state change
    } catch (err) {
      // Never swallow this. The patient sees a generic "try again", but the
      // cause has to reach somewhere a developer can read it -- otherwise a
      // failing submit is undiagnosable from the outside.
      console.error("Assessment submit failed:", err);
      setError(true);
      setIsSubmitting(false);
    }
  };

  // ─── Helpers to calculate summaries ───
  const filledHealthCount = Object.values(data.health).filter(
    (v) => v !== undefined && v !== "",
  ).length;
  const filledMealsCount = data.nutrition.meals
    ? Object.values(data.nutrition.meals).filter((m) => m.items && m.items.length > 0).length
    : 0;

  return (
    <div className={isSubmitting ? "af-form--submitting" : ""}>
      <div className="af-heading-block">
        <p className="af-eyebrow">Almost Done</p>
        <h2 className="af-title">Check everything before you send.</h2>
        <p className="af-subtitle">
          Nothing has been submitted yet. Review your answers, edit anything that needs correcting,
          then send it through.
        </p>
      </div>

      <div className="af-review-sections">
        {/* ─── Details ─── */}
        <Collapsible.Root
          className="af-review-card"
          open={!!openSections["details"]}
          onOpenChange={() => toggleSection("details")}
        >
          <Collapsible.Trigger asChild>
            <div className="af-review-header">
              <div className="af-review-header-left">
                <div className="af-review-icon-box">
                  <User />
                </div>
                <div>
                  <div className="af-review-title">Your Details</div>
                  <div className="af-review-summary">
                    {data.details.fullName} &middot; {data.details.age} &middot; {data.details.city}
                  </div>
                </div>
              </div>
              <div className="af-review-header-right">
                <button
                  type="button"
                  className="af-review-edit-btn"
                  onClick={(e) => handleEdit(e, "details")}
                >
                  <Pencil /> Edit
                </button>
                <div
                  className={`af-review-chevron-box ${openSections["details"] ? "af-review-chevron-box--open" : ""}`}
                >
                  <ChevronDown />
                </div>
              </div>
            </div>
          </Collapsible.Trigger>
          <Collapsible.Content
            className="af-review-content"
            style={{ overflow: "hidden", transition: "height 340ms ease" }}
          >
            <div className="af-review-content-inner">
              <div className="af-review-divider" />
              <div className="af-dl-two-col">
                <ReviewRow label="Full Name" value={data.details.fullName} />
                <ReviewRow label="Age" value={data.details.age} />
                <ReviewRow label="Gender" value={data.details.gender} />
                <ReviewRow label="Phone" value={data.details.phone} />
                <ReviewRow label="Email" value={data.details.email} />
                <ReviewRow label="Address" value={data.details.addressLine} isLong />
                <ReviewRow label="City" value={data.details.city} />
                <ReviewRow label="State" value={data.details.state} />
                <ReviewRow label="Pincode" value={data.details.pincode} />
                <ReviewRow
                  label="Preferred Mode"
                  value={data.details.preferredMode?.replace(/_/g, " ")}
                />
                <ReviewRow label="Referral" value={data.details.referralSource} />
              </div>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>

        {/* ─── Payment ─── */}
        <Collapsible.Root
          className="af-review-card"
          open={!!openSections["payment"]}
          onOpenChange={() => toggleSection("payment")}
        >
          <Collapsible.Trigger asChild>
            <div className="af-review-header">
              <div className="af-review-header-left">
                <div className="af-review-icon-box">
                  <Receipt />
                </div>
                <div>
                  <div className="af-review-title">Payment</div>
                  <div className="af-review-summary">Screenshot uploaded</div>
                </div>
              </div>
              <div className="af-review-header-right">
                <button
                  type="button"
                  className="af-review-edit-btn"
                  onClick={(e) => handleEdit(e, "payment")}
                >
                  <Pencil /> Edit
                </button>
                <div
                  className={`af-review-chevron-box ${openSections["payment"] ? "af-review-chevron-box--open" : ""}`}
                >
                  <ChevronDown />
                </div>
              </div>
            </div>
          </Collapsible.Trigger>
          <Collapsible.Content
            className="af-review-content"
            style={{ overflow: "hidden", transition: "height 340ms ease" }}
          >
            <div className="af-review-content-inner">
              <div className="af-review-divider" />
              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                {data.payment.screenshotUrl && (
                  <img
                    src={data.payment.screenshotUrl}
                    alt="Payment screenshot"
                    className="af-review-payment-thumb"
                    onClick={() => window.open(data.payment.screenshotUrl, "_blank")}
                  />
                )}
                <div className="af-dl">
                  <div>
                    <div className="af-dt">Upload Time</div>
                    <div className="af-dd">
                      {data.payment.uploadedAt
                        ? format(new Date(data.payment.uploadedAt), "PPP p")
                        : "Unknown"}
                    </div>
                  </div>
                  <div>
                    <div className="af-dt">Status</div>
                    <div className="af-review-payment-chip">Pending verification</div>
                  </div>
                  {data.payment.transactionRef && (
                    <div>
                      <div className="af-dt">Transaction Ref</div>
                      <div className="af-dd">{data.payment.transactionRef}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>

        {/* ─── Health & Lifestyle ─── */}
        <Collapsible.Root
          className="af-review-card"
          open={!!openSections["health"]}
          onOpenChange={() => toggleSection("health")}
        >
          <Collapsible.Trigger asChild>
            <div className="af-review-header">
              <div className="af-review-header-left">
                <div className="af-review-icon-box">
                  <HeartPulse />
                </div>
                <div>
                  <div className="af-review-title">Health & Lifestyle</div>
                  <div className="af-review-summary">{filledHealthCount} fields completed</div>
                </div>
              </div>
              <div className="af-review-header-right">
                <button
                  type="button"
                  className="af-review-edit-btn"
                  onClick={(e) => handleEdit(e, "health")}
                >
                  <Pencil /> Edit
                </button>
                <div
                  className={`af-review-chevron-box ${openSections["health"] ? "af-review-chevron-box--open" : ""}`}
                >
                  <ChevronDown />
                </div>
              </div>
            </div>
          </Collapsible.Trigger>
          <Collapsible.Content
            className="af-review-content"
            style={{ overflow: "hidden", transition: "height 340ms ease" }}
          >
            <div className="af-review-content-inner">
              <div className="af-review-divider" />
              <div className="af-dl-two-col">
                <ReviewRow
                  label="Weight"
                  value={data.health.weightKg ? `${data.health.weightKg} kg` : null}
                />
                <ReviewRow
                  label="Height"
                  value={data.health.heightCm ? `${data.health.heightCm} cm` : null}
                />
                <ReviewRow label="Weight Change (6mo)" value={data.health.weightChange6m} />
                {data.health.weightChangeAmountKg && (
                  <ReviewRow
                    label="Amount Changed"
                    value={`${data.health.weightChangeAmountKg} kg`}
                  />
                )}

                <ReviewRow label="Goals" value={data.health.goals} isLong />
                <ReviewRow
                  label="Past Medical History"
                  value={data.health.pastMedicalHistory}
                  isLong
                />
                <ReviewRow label="Current Symptoms" value={data.health.currentSymptoms} isLong />
                <ReviewRow label="Supplements" value={data.health.supplementHistory} isLong />
                <ReviewRow label="Medications" value={data.health.currentMedications} isLong />
              </div>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>

        {/* ─── Nutrition Log ─── */}
        <Collapsible.Root
          className="af-review-card"
          open={!!openSections["nutrition"]}
          onOpenChange={() => toggleSection("nutrition")}
        >
          <Collapsible.Trigger asChild>
            <div className="af-review-header">
              <div className="af-review-header-left">
                <div className="af-review-icon-box">
                  <UtensilsCrossed />
                </div>
                <div>
                  <div className="af-review-title">Nutrition Log</div>
                  <div className="af-review-summary">{filledMealsCount} meals logged</div>
                </div>
              </div>
              <div className="af-review-header-right">
                <button
                  type="button"
                  className="af-review-edit-btn"
                  onClick={(e) => handleEdit(e, "nutrition")}
                >
                  <Pencil /> Edit
                </button>
                <div
                  className={`af-review-chevron-box ${openSections["nutrition"] ? "af-review-chevron-box--open" : ""}`}
                >
                  <ChevronDown />
                </div>
              </div>
            </div>
          </Collapsible.Trigger>
          <Collapsible.Content
            className="af-review-content"
            style={{ overflow: "hidden", transition: "height 340ms ease" }}
          >
            <div className="af-review-content-inner">
              <div className="af-review-divider" />
              <div className="af-dl-two-col">
                <ReviewRow
                  label="Typical Day?"
                  value={data.nutrition.atypicalDay === "yes" ? "Yes" : "No, unusual"}
                />
                {data.nutrition.atypicalNote && (
                  <ReviewRow
                    label="Normal Day Description"
                    value={data.nutrition.atypicalNote}
                    isLong
                  />
                )}
                <ReviewRow label="Water Intake" value={data.nutrition.waterIntake} />
                <ReviewRow label="Additional Notes" value={data.nutrition.additionalNotes} isLong />

                <div style={{ gridColumn: "1 / -1", marginTop: "12px" }}>
                  <div className="af-dt" style={{ marginBottom: "16px" }}>
                    Meals Logged
                  </div>
                  <div className="af-dl">
                    {data.nutrition.meals &&
                      Object.entries(data.nutrition.meals).map(([key, meal]) => {
                        if (!meal.items) return null;
                        const titleMap: Record<string, string> = {
                          breakfast: "Breakfast",
                          morningSnack: "Morning Snack",
                          lunch: "Lunch",
                          teaTime: "Tea Time",
                          dinner: "Dinner",
                          bedtimeSnack: "Bedtime Snack",
                        };
                        return (
                          <div key={key} style={{ display: "flex", gap: "16px" }}>
                            <div
                              style={{
                                width: "60px",
                                flexShrink: 0,
                                fontSize: "13.5px",
                                color: "var(--text-muted)",
                                marginTop: "2px",
                              }}
                            >
                              {meal.time || "--:--"}
                            </div>
                            <div>
                              <div
                                style={{ fontWeight: 600, fontSize: "14.5px", marginBottom: "4px" }}
                              >
                                {titleMap[key] || key}
                              </div>
                              <div className="af-dd">{meal.items}</div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>

      {/* ─── Consent Card ─── */}
      <div className="af-consent-card">
        <h3 className="af-card-heading">
          <ShieldCheck className="af-primary-icon" />
          Before you submit
        </h3>

        <div style={{ marginTop: 24 }}>
          <label className="af-consent-checkbox-row">
            <input
              type="checkbox"
              className="af-sr-only"
              checked={consent.accurateInfo}
              onChange={(e) => setConsent((prev) => ({ ...prev, accurateInfo: e.target.checked }))}
            />
            <div className="af-consent-box">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="af-consent-label">
              The information I've given is accurate to the best of my knowledge.
            </div>
          </label>

          <label className="af-consent-checkbox-row">
            <input
              type="checkbox"
              className="af-sr-only"
              checked={consent.contactConsent}
              onChange={(e) =>
                setConsent((prev) => ({ ...prev, contactConsent: e.target.checked }))
              }
            />
            <div className="af-consent-box">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="af-consent-label">
              I consent to GoRebalance contacting me about my consultation and plan.
            </div>
          </label>

          <label className="af-consent-checkbox-row">
            <input
              type="checkbox"
              className="af-sr-only"
              checked={consent.dataConsent}
              onChange={(e) => setConsent((prev) => ({ ...prev, dataConsent: e.target.checked }))}
            />
            <div className="af-consent-box">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="af-consent-label">
              I understand this assessment is for nutrition guidance and does not replace medical
              diagnosis or treatment from a physician.
            </div>
          </label>
        </div>

        <div
          style={{
            background: "var(--surface-alt)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "16px 18px",
            marginTop: 22,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <Lock
            style={{ width: 16, height: 16, color: "var(--primary)", marginTop: 2, flexShrink: 0 }}
          />
          <div style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--text-muted)" }}>
            Your assessment is confidential. It's read only by Dt. Sai Sowjanya's practice and used
            solely to build your plan.
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(var(--danger-rgb), 0.08)",
            border: "1px solid rgba(var(--danger-rgb), 0.32)",
            borderRadius: 14,
            padding: 16,
            marginTop: 24,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            color: "var(--danger)",
          }}
        >
          <AlertTriangle style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: "14px", lineHeight: 1.5, flex: 1 }}>
            We couldn't submit your assessment. Your answers are safe — please try again.
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
            }}
          >
            Try again
          </button>
        </div>
      )}

      {/* ─── Footer ─── */}
      <div className="af-pay-footer">
        <div className="af-pay-footer__row">
          <button
            type="button"
            className="af-back-btn"
            onClick={() => goToStep("nutrition")}
            disabled={isSubmitting}
          >
            <ArrowLeft aria-hidden="true" />
            Back to nutrition log
          </button>

          <button
            type="button"
            className="af-submit-btn"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            title={!canSubmit ? "Please confirm the three statements above." : ""}
            style={{
              height: 60,
              padding: "0 38px",
              borderRadius: 999,
              fontSize: "16.5px",
              opacity: canSubmit && !isSubmitting ? 1 : 0.45,
              cursor: canSubmit && !isSubmitting ? "pointer" : "not-allowed",
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2
                  className="af-autosave-anim-spin"
                  style={{ width: 18, height: 18, marginRight: 8 }}
                />
                Submitting...
              </>
            ) : (
              <>
                Submit My Assessment
                <Send aria-hidden="true" style={{ width: 18, height: 18, marginLeft: 8 }} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
