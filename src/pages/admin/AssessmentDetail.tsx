import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { DeleteDialog } from "@/components/admin/shared/DeleteDialog";
import { mirrorStatus, removeStatus } from "@/lib/trackingStatus";
import { doc, onSnapshot, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type { AssessmentDocument, AssessmentStatus } from "@/types/admin";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Copy,
  User,
  Ruler,
  Target,
  Stethoscope,
  UtensilsCrossed,
  Receipt,
  Check,
  X,
  NotebookPen,
  Phone,
  MessageCircle,
  Mail,
  Download,
  Printer,
  Trash2,
  FileQuestion,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { SelectField } from "@/components/assessment/fields";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { logActivity } from "@/lib/activityLog";
import { toDate } from "@/lib/runtime";
import type { Details, Health, Nutrition, Payment, Consent } from "@/schemas/assessment";

export default function AssessmentDetail() {
  const { id } = useParams({ strict: false }); // We'll grab id manually or via props
  const { user } = useAuth();

  const [data, setData] = useState<AssessmentDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Delete. The button existed with no handler at all, so a destructive
  // action silently did nothing when clicked.
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "assessments", id as string));
      await removeStatus(id as string);
      setDeleteOpen(false);
      navigate({ to: "/admin/assessments", replace: true });
    } catch (err) {
      console.error("Failed to delete assessment:", err);
      setIsDeleting(false);
      setDeleteOpen(false);
      alert("Couldn't delete this assessment. Please try again.");
    }
  };

  // Note autosave ref
  const notesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) return;

    // submitFinal writes with setDoc(doc(db, "assessments", submissionId)), so
    // the document id and the submissionId are the same value and a direct doc
    // read is correct. (A second query by submissionId was being built here and
    // then never used.)
    const docRef = doc(db, "assessments", id as string);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const docData = { id: docSnap.id, ...docSnap.data() } as unknown as AssessmentDocument;
          setData(docData);
          setNotes(docData.adminNotes || "");
        } else {
          setNotFound(true);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [id]);

  const handleNotesChange = (val: string) => {
    setNotes(val);
    setSavingNotes(true);

    if (notesTimeoutRef.current) clearTimeout(notesTimeoutRef.current);
    notesTimeoutRef.current = setTimeout(async () => {
      try {
        if (id) {
          await updateDoc(doc(db, "assessments", id as string), { adminNotes: val });
        }
      } catch (err) {
        alert("Failed to save notes.");
      }
      setSavingNotes(false);
    }, 900);
  };

  const handleStatusChange = async (newStatus: AssessmentStatus) => {
    try {
      await updateDoc(doc(db, "assessments", id as string), {
        status: newStatus,
        reviewedBy: user?.email || "admin",
        reviewedAt: serverTimestamp(),
      });
      await mirrorStatus(id as string, { status: newStatus });
      logActivity(
        `Status changed to ${newStatus} for ${data?.details?.fullName || "client"}`,
        "assessment",
        id as string,
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handlePaymentVerify = async (status: "pending" | "verified" | "not_verified") => {
    try {
      await updateDoc(doc(db, "assessments", id as string), {
        verificationStatus: status,
        verifiedBy: user?.email || "admin",
        verifiedAt: serverTimestamp(),
      });
      await mirrorStatus(id as string, { verificationStatus: status });
      logActivity(
        `Payment verification set to ${status} for ${data?.details?.fullName || "client"}`,
        "payment",
        id as string,
      );
    } catch (err) {
      alert("Failed to update payment status.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // basic toast feedback here
  };

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
    );
  if (error)
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--accent-contrast)" }}>
        Error loading assessment.
      </div>
    );
  if (notFound || !data)
    return (
      <div style={{ padding: "64px 20px", textAlign: "center" }}>
        <FileQuestion size={32} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
        <h2
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)",
            marginBottom: 8,
          }}
        >
          Assessment not found
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
          It may have been deleted, or the link is incorrect.
        </p>
        <Link
          to="/admin/assessments"
          style={{
            padding: "10px 24px",
            borderRadius: 999,
            border: "1.5px solid var(--border)",
            background: "transparent",
            color: "var(--text)",
            textDecoration: "none",
            display: "inline-block",
            fontWeight: 600,
          }}
        >
          Back to assessments
        </Link>
      </div>
    );

  const d: Partial<Details> = data.details ?? {};
  const h: Partial<Health> = data.health ?? {};
  const n: Partial<Nutrition> = data.nutrition ?? {};
  const p: Partial<Payment> = data.payment ?? {};
  const c: Partial<Consent> = data.consent ?? {};

  const refId = (data.submissionId || id || "").slice(0, 8).toUpperCase();
  const dateObj = toDate(data.submittedAt);
  const bmi =
    h.weightKg && h.heightCm ? (h.weightKg / Math.pow(h.heightCm / 100, 2)).toFixed(1) : null;
  const bmiLabel = bmi
    ? Number(bmi) < 18.5
      ? "Underweight"
      : Number(bmi) < 25
        ? "Normal"
        : Number(bmi) < 30
          ? "Overweight"
          : "Obese"
    : null;

  return (
    <>
      <div className="af-detail-sticky-header">
        <div className="af-admin-content-max af-detail-header-inner" style={{ padding: "0 24px" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Link
              to="/admin/assessments"
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 12,
                color: "var(--text)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={17} />
            </Link>
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontWeight: 500,
                  fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
                  color: "var(--text)",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {d.fullName || "Unnamed Client"}
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12.5,
                  color: "var(--text-muted)",
                  marginTop: 4,
                }}
              >
                <span style={{ fontFamily: "monospace" }}>{refId}</span>
                <button
                  onClick={() => copyToClipboard(refId)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "inherit",
                    display: "flex",
                    padding: 0,
                  }}
                  aria-label="Copy reference"
                >
                  <Copy size={12} />
                </button>
                <span>·</span>
                <span>{format(dateObj, "d MMM yyyy, h:mm a")}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              className={`af-status-chip ${data.status === "new" ? "af-status-chip--new" : data.status === "in_review" ? "af-status-chip--review" : "af-status-chip--completed"}`}
            >
              {data.status === "new"
                ? "New"
                : data.status === "in_review"
                  ? "In review"
                  : "Completed"}
            </span>
            <SelectField
              value={data.status}
              onChange={(e) => handleStatusChange(e.target.value as AssessmentStatus)}
              options={[
                { value: "new", label: "New" },
                { value: "in_review", label: "In review" },
                { value: "completed", label: "Completed" },
              ]}
              // Width lives in admin-assessments.css so the narrow-screen
              // media query can override it -- an inline width would win over
              // the stylesheet and keep forcing 150px onto a 360px row.
              // paddingBlock: .af-control's 14px block padding plus a 21px
              // line needs 49px, so this 40px control was clipping "New" into
              // something that read as "Now".
              style={{ height: 40, borderRadius: 10, paddingBlock: 0 }}
            />
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  style={{
                    height: 40,
                    padding: "0 20px",
                    borderRadius: 999,
                    background: "var(--primary-strong)",
                    color: "var(--on-primary)",
                    border: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  Contact client <ChevronDown size={14} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 6,
                    boxShadow: "0 10px 30px rgba(var(--shadow-rgb), 0.1)",
                    minWidth: 180,
                    zIndex: 50,
                  }}
                >
                  <DropdownMenu.Item asChild>
                    <a
                      href={`tel:${d.phone || ""}`}
                      style={{
                        padding: "8px 12px",
                        fontSize: 13.5,
                        cursor: "pointer",
                        outline: "none",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "var(--text)",
                        textDecoration: "none",
                      }}
                    >
                      <Phone size={15} style={{ color: "var(--text-muted)" }} /> Call{" "}
                      {d.phone || ""}
                    </a>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <a
                      href={`https://wa.me/${(d.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${d.fullName?.split(" ")[0] || ""}, this is GoRebalance regarding your assessment.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "8px 12px",
                        fontSize: 13.5,
                        cursor: "pointer",
                        outline: "none",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "var(--text)",
                        textDecoration: "none",
                      }}
                    >
                      <MessageCircle size={15} style={{ color: "var(--text-muted)" }} /> WhatsApp
                    </a>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <a
                      href={`mailto:${d.email || ""}?subject=${encodeURIComponent("Your GoRebalance assessment")}`}
                      style={{
                        padding: "8px 12px",
                        fontSize: 13.5,
                        cursor: "pointer",
                        outline: "none",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "var(--text)",
                        textDecoration: "none",
                      }}
                    >
                      <Mail size={15} style={{ color: "var(--text-muted)" }} /> Email
                    </a>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>

      <div className="af-detail-layout" style={{ padding: "0 24px 64px" }}>
        {/* MAIN COLUMN */}
        <div>
          {/* CARD 1: Client Details */}
          <div className="af-detail-card">
            <h2 className="af-detail-card-heading">
              <User size={20} style={{ color: "var(--primary)" }} /> Client details
            </h2>
            <div className="af-field-grid af-field-grid--2col">
              <div>
                <div className="af-field-label">Full name</div>
                <div className="af-field-value">
                  {d.fullName || <span className="af-field-value--empty">—</span>}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <div className="af-field-label">Age</div>
                  <div className="af-field-value">
                    {d.age || <span className="af-field-value--empty">—</span>}
                  </div>
                </div>
                <div>
                  <div className="af-field-label">Gender</div>
                  <div className="af-field-value" style={{ textTransform: "capitalize" }}>
                    {d.gender?.replace(/_/g, " ") || (
                      <span className="af-field-value--empty">—</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="af-field-label">Phone</div>
                <div className="af-field-value">
                  {d.phone ? (
                    <a
                      href={`tel:${d.phone}`}
                      style={{ color: "var(--primary)", textDecoration: "none" }}
                    >
                      {d.phone}
                    </a>
                  ) : (
                    <span className="af-field-value--empty">—</span>
                  )}
                </div>
              </div>
              <div>
                <div className="af-field-label">Email</div>
                <div className="af-field-value">
                  {d.email ? (
                    <a
                      href={`mailto:${d.email}`}
                      style={{ color: "var(--primary)", textDecoration: "none" }}
                    >
                      {d.email}
                    </a>
                  ) : (
                    <span className="af-field-value--empty">—</span>
                  )}
                </div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="af-field-label">Address</div>
                <div className="af-field-value">
                  {d.addressLine || <span className="af-field-value--empty">—</span>}
                </div>
              </div>
              <div>
                <div className="af-field-label">City</div>
                <div className="af-field-value">
                  {d.city || <span className="af-field-value--empty">—</span>}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <div className="af-field-label">State</div>
                  <div className="af-field-value">
                    {d.state || <span className="af-field-value--empty">—</span>}
                  </div>
                </div>
                <div>
                  <div className="af-field-label">Pincode</div>
                  <div className="af-field-value">
                    {d.pincode || <span className="af-field-value--empty">—</span>}
                  </div>
                </div>
              </div>
              <div>
                <div className="af-field-label">Consultation mode</div>
                <div className="af-field-value" style={{ marginTop: 4 }}>
                  {d.preferredMode ? (
                    <span
                      className={`af-mode-chip ${d.preferredMode === "online" ? "af-mode-chip--muted" : "af-mode-chip--primary"}`}
                    >
                      {d.preferredMode === "online"
                        ? "Online"
                        : d.preferredMode === "in_clinic_kakinada"
                          ? "In Clinic (Kakinada)"
                          : "Online"}
                    </span>
                  ) : (
                    <span className="af-field-value--empty">—</span>
                  )}
                </div>
              </div>
              <div>
                <div className="af-field-label">Referral source</div>
                <div className="af-field-value">
                  {d.referralSource || <span className="af-field-value--empty">—</span>}
                </div>
              </div>

              {d.programInterest && (
                <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
                  <div className="af-field-label">Program interest</div>
                  <div className="af-field-value" style={{ marginTop: 4 }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        background: "var(--surface-alt)",
                        borderRadius: 999,
                        fontSize: 13,
                      }}
                    >
                      {d.programInterest}
                    </span>
                  </div>
                </div>
              )}
              {d.selectedSymptoms && d.selectedSymptoms.length > 0 && (
                <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
                  <div className="af-field-label">Symptoms flagged on the site</div>
                  <div
                    className="af-field-value"
                    style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}
                  >
                    {d.selectedSymptoms.map((s: string) => (
                      <span
                        key={s}
                        style={{
                          padding: "4px 12px",
                          background: "var(--primary-soft)",
                          color: "var(--primary)",
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CARD 2: Measurements */}
          <div className="af-detail-card">
            <h2 className="af-detail-card-heading">
              <Ruler size={20} style={{ color: "var(--primary)" }} /> Measurements
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: 24,
                marginBottom: 32,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontWeight: 500,
                    fontSize: "clamp(1.375rem, 2.2vw, 1.75rem)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 4,
                  }}
                >
                  {h.weightKg || "—"}{" "}
                  <span
                    style={{
                      fontSize: 14,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-jakarta)",
                      fontWeight: 400,
                    }}
                  >
                    kg
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4 }}>
                  Weight
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontWeight: 500,
                    fontSize: "clamp(1.375rem, 2.2vw, 1.75rem)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 4,
                  }}
                >
                  {h.heightCm || "—"}{" "}
                  <span
                    style={{
                      fontSize: 14,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-jakarta)",
                      fontWeight: 400,
                    }}
                  >
                    cm
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4 }}>
                  Height
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontWeight: 500,
                    fontSize: "clamp(1.375rem, 2.2vw, 1.75rem)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {bmi || "—"}
                  {bmiLabel && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        background: "var(--surface-alt)",
                        color: "var(--text-muted)",
                        borderRadius: 999,
                        fontFamily: "var(--font-jakarta)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {bmiLabel}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4 }}>BMI</div>
              </div>
            </div>
            <div>
              <div className="af-field-label">Weight change (Last 6 months)</div>
              <div className="af-field-value" style={{ textTransform: "capitalize" }}>
                {h.weightChange6m || <span className="af-field-value--empty">—</span>}
                {h.weightChangeAmountKg ? ` (${h.weightChangeAmountKg} kg)` : ""}
              </div>
            </div>
          </div>

          {/* CARD 3: Goals and history */}
          <div className="af-detail-card">
            <h2 className="af-detail-card-heading">
              <Target size={20} style={{ color: "var(--primary)" }} /> Goals and history
            </h2>
            <div className="af-field-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div>
                <div className="af-field-label">Goals</div>
                <div className="af-field-value">
                  {h.goals || <span className="af-field-value--empty">—</span>}
                </div>
              </div>
              <div>
                <div className="af-field-label">Past Medical History</div>
                <div className="af-field-value">
                  {h.pastMedicalHistory || <span className="af-field-value--empty">—</span>}
                </div>
              </div>
              <div>
                <div className="af-field-label">Current Symptoms</div>
                <div className="af-field-value">
                  {h.currentSymptoms || <span className="af-field-value--empty">—</span>}
                </div>
              </div>
              <div>
                <div className="af-field-label">Supplement History</div>
                <div className="af-field-value">
                  {h.supplementHistory || <span className="af-field-value--empty">—</span>}
                </div>
              </div>
              <div>
                <div className="af-field-label">Current Medications</div>
                <div className="af-field-value">
                  {h.currentMedications || <span className="af-field-value--empty">—</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition log */}
          <div className="af-detail-card">
            <h2 className="af-detail-card-heading">
              <UtensilsCrossed size={20} style={{ color: "var(--primary)" }} /> Nutrition log
              (Yesterday)
            </h2>

            <div className="af-timeline">
              {[
                { key: "breakfast", label: "Breakfast" },
                { key: "morningSnack", label: "Morning Snack" },
                { key: "lunch", label: "Lunch" },
                { key: "teaTime", label: "Tea Time" },
                { key: "dinner", label: "Dinner" },
                { key: "bedtimeSnack", label: "Bedtime Snack" },
              ].map((mealDef) => {
                const mealData = n.meals?.[mealDef.key as keyof typeof n.meals];
                const isEmpty = !mealData?.items;
                return (
                  <div
                    key={mealDef.key}
                    className="af-timeline-item"
                    style={{ opacity: isEmpty ? 0.45 : 1 }}
                  >
                    <div className="af-timeline-dot">
                      <UtensilsCrossed size={18} />
                    </div>
                    <div className="af-timeline-content">
                      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                        <span style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)" }}>
                          {mealDef.label}
                        </span>
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: "var(--primary)",
                            opacity: mealData?.time ? 1 : 0.55,
                          }}
                        >
                          {mealData?.time || "no time given"}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          lineHeight: 1.7,
                          color: isEmpty ? "var(--text-muted)" : "var(--text)",
                          marginTop: 4,
                          whiteSpace: "pre-wrap",
                          fontStyle: isEmpty ? "italic" : "normal",
                        }}
                      >
                        {mealData?.items || "Not filled in"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
              <div className="af-field-grid af-field-grid--2col">
                <div>
                  <div className="af-field-label">Was yesterday typical?</div>
                  <div className="af-field-value" style={{ marginTop: 4 }}>
                    {n.atypicalDay ? (
                      <span
                        className="af-mode-chip af-mode-chip--muted"
                        style={{ textTransform: "capitalize" }}
                      >
                        {n.atypicalDay}
                      </span>
                    ) : (
                      <span className="af-field-value--empty">—</span>
                    )}
                  </div>
                </div>
                {n.atypicalDay === "no" && (
                  <div>
                    <div className="af-field-label">Atypical Note</div>
                    <div className="af-field-value">
                      {n.atypicalNote || <span className="af-field-value--empty">—</span>}
                    </div>
                  </div>
                )}
                <div>
                  <div className="af-field-label">Water Intake</div>
                  <div className="af-field-value">
                    {n.waterIntake || <span className="af-field-value--empty">—</span>}
                  </div>
                </div>
                {n.additionalNotes && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div className="af-field-label">Additional Notes</div>
                    <div className="af-field-value">{n.additionalNotes}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR COLUMN */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* PANEL 1: Payment */}
          <div className="af-sidebar-panel">
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
                margin: "0 0 16px",
              }}
            >
              <Receipt size={18} style={{ color: "var(--text-muted)" }} /> Payment
            </h3>
            {p.screenshotUrl ? (
              <>
                <img
                  src={p.screenshotUrl}
                  alt="Payment screenshot"
                  onClick={() => setLightboxOpen(true)}
                  style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                    cursor: "zoom-in",
                    background: "var(--surface-alt)",
                  }}
                />
                <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 12 }}>
                  Uploaded{" "}
                  {formatDistanceToNow(p.uploadedAt ? new Date(p.uploadedAt) : new Date(), {
                    addSuffix: true,
                  })}
                </div>
                {p.transactionRef && (
                  <div
                    style={{
                      fontSize: 13,
                      fontFamily: "monospace",
                      color: "var(--text)",
                      marginTop: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    Ref: {p.transactionRef}
                    <button
                      onClick={() => copyToClipboard(p.transactionRef || "")}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        display: "flex",
                        padding: 0,
                      }}
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                )}

                <div style={{ marginTop: 20 }}>
                  <div
                    style={{
                      height: 40,
                      background:
                        data.verificationStatus === "verified"
                          ? "rgba(var(--success-rgb), 0.12)"
                          : data.verificationStatus === "not_verified"
                            ? "rgba(var(--danger-rgb), 0.1)"
                            : "var(--surface-alt)",
                      color:
                        data.verificationStatus === "verified"
                          ? "var(--success)"
                          : data.verificationStatus === "not_verified"
                            ? "var(--danger)"
                            : "var(--text-muted)",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 600,
                      gap: 8,
                    }}
                  >
                    {data.verificationStatus === "verified" && <CheckCircle2 size={16} />}
                    {data.verificationStatus === "not_verified" && <XCircle size={16} />}
                    {data.verificationStatus === "pending" && <Clock size={16} />}
                    {data.verificationStatus === "verified"
                      ? "Verified"
                      : data.verificationStatus === "not_verified"
                        ? "Not verified"
                        : "Pending verification"}
                  </div>

                  {data.verificationStatus === "pending" ? (
                    <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                      <button
                        onClick={() => handlePaymentVerify("verified")}
                        style={{
                          flex: 1,
                          height: 44,
                          background: "var(--success)",
                          color: "var(--on-primary)",
                          borderRadius: 12,
                          border: "none",
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        <Check size={16} /> Verify
                      </button>
                      <button
                        onClick={() => handlePaymentVerify("not_verified")}
                        style={{
                          flex: 1,
                          height: 44,
                          background: "rgba(var(--danger-rgb), 0.1)",
                          color: "var(--danger)",
                          borderRadius: 12,
                          border: "1px solid rgba(var(--danger-rgb), 0.32)",
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        <X size={16} /> Reject
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: 14,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
                        By {data.reviewedBy || "admin"}
                      </span>
                      <button
                        onClick={() => handlePaymentVerify("pending")}
                        style={{
                          background: "transparent",
                          border: "none",
                          fontSize: 12.5,
                          color: "var(--text)",
                          fontWeight: 500,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div
                style={{
                  padding: "32px 16px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: 13,
                }}
              >
                No payment attached
              </div>
            )}
          </div>

          {/* PANEL 2: Admin Notes */}
          <div className="af-sidebar-panel">
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
                margin: "0 0 16px",
              }}
            >
              <NotebookPen size={18} style={{ color: "var(--text-muted)" }} /> Internal notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Notes for this client — visible only to the practice."
              style={{
                width: "100%",
                minHeight: 140,
                background: "var(--surface-alt)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 14,
                color: "var(--text)",
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 150ms ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginTop: 8,
                textAlign: "right",
                minHeight: 18,
              }}
            >
              {savingNotes ? "Saving…" : notes !== (data.adminNotes || "") ? "" : "Saved"}
            </div>
          </div>

          {/* PANEL 3: Quick Actions */}
          <div className="af-sidebar-panel">
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <a
                href={`tel:${d.phone || ""}`}
                className="af-action-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 44,
                  padding: "0 12px",
                  borderRadius: 12,
                  color: "var(--text)",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <Phone size={18} style={{ color: "var(--text-muted)" }} /> Call {d.phone || ""}
              </a>
              <a
                href={`https://wa.me/${(d.phone || "").replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="af-action-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 44,
                  padding: "0 12px",
                  borderRadius: 12,
                  color: "var(--text)",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <MessageCircle size={18} style={{ color: "var(--text-muted)" }} /> Open WhatsApp
              </a>
              <a
                href={`mailto:${d.email || ""}`}
                className="af-action-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 44,
                  padding: "0 12px",
                  borderRadius: 12,
                  color: "var(--text)",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <Mail size={18} style={{ color: "var(--text-muted)" }} /> Send email
              </a>
              <button
                onClick={() => window.print()}
                className="af-action-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 44,
                  padding: "0 12px",
                  borderRadius: 12,
                  color: "var(--text)",
                  background: "transparent",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <Download size={18} style={{ color: "var(--text-muted)" }} /> Export as PDF
              </button>
              <button
                onClick={() => window.print()}
                className="af-action-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 44,
                  padding: "0 12px",
                  borderRadius: 12,
                  color: "var(--text)",
                  background: "transparent",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <Printer size={18} style={{ color: "var(--text-muted)" }} /> Print
              </button>
              <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
              <button
                className="af-action-row"
                onClick={() => setDeleteOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 44,
                  padding: "0 12px",
                  borderRadius: 12,
                  // A destructive action should read as one. --accent is the
                  // decorative orange and was also below contrast here.
                  color: "var(--danger)",
                  background: "transparent",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <Trash2 size={18} style={{ color: "var(--danger)" }} /> Delete assessment
              </button>
            </div>
          </div>

          {/* PANEL 4: Meta */}
          <div className="af-sidebar-panel af-sidebar-panel--alt">
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span style={{ color: "var(--text-muted)" }}>Reference</span>
                <span style={{ color: "var(--text)", fontFamily: "monospace" }}>{refId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span style={{ color: "var(--text-muted)" }}>Submitted</span>
                <span style={{ color: "var(--text)" }}>{format(dateObj, "d MMM yy, HH:mm")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span style={{ color: "var(--text-muted)" }}>Status</span>
                <span style={{ color: "var(--text)", textTransform: "capitalize" }}>
                  {data.status.replace("_", " ")}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span style={{ color: "var(--text-muted)" }}>Reviewed by</span>
                <span style={{ color: "var(--text)" }}>{data.reviewedBy || "—"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span style={{ color: "var(--text-muted)" }}>Source</span>
                <span style={{ color: "var(--text)" }}>Website</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(var(--shadow-rgb), 0.85)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <img
            src={p.screenshotUrl}
            alt="Payment screenshot full"
            style={{ maxHeight: "90vh", maxWidth: "90vw", objectFit: "contain", borderRadius: 8 }}
          />
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              width: 44,
              height: 44,
              background: "rgba(var(--on-dark-rgb), 0.1)",
              color: "var(--on-primary)",
              border: "none",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={24} />
          </button>
        </div>
      )}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this assessment?"
        itemName={d.fullName || "this assessment"}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <style>{`
        .af-action-row:hover {
          background: var(--surface-alt) !important;
        }
      `}</style>
    </>
  );
}
