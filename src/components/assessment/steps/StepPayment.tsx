import { useCallback, useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  X,
  Check,
  Copy,
  Info,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { uploadToCloudinary, UploadError, type CloudinaryResult } from "@/lib/cloudinary";
import { useAssessment } from "@/context/AssessmentContext";
import { FormField, TextInput } from "@/components/assessment/fields";

/* ─── Placeholder QR image (data URI for a simple QR-shaped placeholder) ─── */
// PAYMENT QR — replace with the client's UPI QR code image
const QR_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'%3E%3Crect width='220' height='220' fill='%23f5f5f5'/%3E%3Crect x='20' y='20' width='60' height='60' rx='4' fill='%23222'/%3E%3Crect x='30' y='30' width='40' height='40' rx='2' fill='%23f5f5f5'/%3E%3Crect x='38' y='38' width='24' height='24' rx='1' fill='%23222'/%3E%3Crect x='140' y='20' width='60' height='60' rx='4' fill='%23222'/%3E%3Crect x='150' y='30' width='40' height='40' rx='2' fill='%23f5f5f5'/%3E%3Crect x='158' y='38' width='24' height='24' rx='1' fill='%23222'/%3E%3Crect x='20' y='140' width='60' height='60' rx='4' fill='%23222'/%3E%3Crect x='30' y='150' width='40' height='40' rx='2' fill='%23f5f5f5'/%3E%3Crect x='38' y='158' width='24' height='24' rx='1' fill='%23222'/%3E%3Crect x='90' y='20' width='10' height='10' fill='%23222'/%3E%3Crect x='110' y='20' width='10' height='10' fill='%23222'/%3E%3Crect x='90' y='40' width='10' height='10' fill='%23222'/%3E%3Crect x='90' y='60' width='10' height='10' fill='%23222'/%3E%3Crect x='110' y='60' width='10' height='10' fill='%23222'/%3E%3Crect x='90' y='90' width='10' height='10' fill='%23222'/%3E%3Crect x='110' y='90' width='10' height='10' fill='%23222'/%3E%3Crect x='90' y='110' width='10' height='10' fill='%23222'/%3E%3Crect x='140' y='100' width='10' height='10' fill='%23222'/%3E%3Crect x='160' y='100' width='10' height='10' fill='%23222'/%3E%3Crect x='180' y='100' width='10' height='10' fill='%23222'/%3E%3Crect x='140' y='120' width='10' height='10' fill='%23222'/%3E%3Crect x='160' y='140' width='10' height='10' fill='%23222'/%3E%3Crect x='180' y='140' width='10' height='10' fill='%23222'/%3E%3Crect x='140' y='160' width='10' height='10' fill='%23222'/%3E%3Crect x='160' y='160' width='10' height='10' fill='%23222'/%3E%3Crect x='180' y='180' width='10' height='10' fill='%23222'/%3E%3Crect x='140' y='180' width='10' height='10' fill='%23222'/%3E%3Crect x='20' y='110' width='10' height='10' fill='%23222'/%3E%3Crect x='40' y='110' width='10' height='10' fill='%23222'/%3E%3Crect x='60' y='110' width='10' height='10' fill='%23222'/%3E%3Crect x='110' y='110' width='10' height='10' fill='%23222'/%3E%3Ctext x='110' y='215' font-size='10' text-anchor='middle' fill='%23999' font-family='sans-serif'%3EReplace with QR%3C/text%3E%3C/svg%3E";

// UPI ID — replace with the client's actual UPI ID
const UPI_ID = "example@upi";

// CONSULTATION FEE — replace with the client's confirmed amount
const CONSULTATION_FEE = "₹ —";

/* ─── Helpers ─── */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const INSTRUCTIONS = [
  "Open any UPI app — GPay, PhonePe, Paytm or your bank app.",
  "Scan the QR code, or pay directly to the UPI ID above.",
  "Take a screenshot of the successful payment.",
  "Upload it below and continue to the health assessment.",
];

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; file: File; preview: string; percent: number }
  | {
      status: "success";
      url: string;
      publicId: string;
      fileName: string;
      fileSize: number;
      uploadedAt: string;
    }
  | { status: "error"; message: string };

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export default function StepPayment() {
  const { data, updateSection, markStepComplete, goToStep } = useAssessment();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* ─── Upload state ─── */
  const [upload, setUpload] = useState<UploadState>(() => {
    // Restore from context if already uploaded
    if (data.payment.screenshotUrl && data.payment.screenshotPublicId) {
      return {
        status: "success",
        url: data.payment.screenshotUrl as string,
        publicId: data.payment.screenshotPublicId as string,
        fileName: "Payment screenshot",
        fileSize: 0,
        uploadedAt: (data.payment.uploadedAt as string) ?? new Date().toISOString(),
      };
    }
    return { status: "idle" };
  });

  /* ─── Copy UPI ─── */
  const [copied, setCopied] = useState(false);
  const copyUpi = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, []);

  /* ─── Lightbox ─── */
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  /* ─── Transaction ref ─── */
  const [transactionRef, setTransactionRef] = useState(
    (data.payment.transactionRef as string) ?? "",
  );

  /* ─── Drag state ─── */
  const [isDragOver, setIsDragOver] = useState(false);

  /* ─── Upload logic ─── */
  const handleFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUpload({
          status: "error",
          message: "Only JPG, PNG or WEBP files are accepted.",
        });
        return;
      }

      const preview = URL.createObjectURL(file);
      setUpload({ status: "uploading", file, preview, percent: 0 });

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const result: CloudinaryResult = await uploadToCloudinary(file, {
          onProgress: (percent) => {
            setUpload((prev) => (prev.status === "uploading" ? { ...prev, percent } : prev));
          },
          signal: controller.signal,
        });

        const uploadedAt = new Date().toISOString();
        setUpload({
          status: "success",
          url: result.secure_url,
          publicId: result.public_id,
          fileName: file.name,
          fileSize: result.bytes,
          uploadedAt,
        });

        // Persist to context
        updateSection("payment", {
          screenshotUrl: result.secure_url,
          screenshotPublicId: result.public_id,
          uploadedAt,
        });
      } catch (err) {
        // Don't show error if it was a user abort
        if (err instanceof UploadError && err.message === "Upload was cancelled.") {
          setUpload({ status: "idle" });
          return;
        }
        setUpload({
          status: "error",
          message:
            err instanceof UploadError ? err.message : "Something went wrong. Please try again.",
        });
      } finally {
        URL.revokeObjectURL(preview);
        abortRef.current = null;
      }
    },
    [updateSection],
  );

  const cancelUpload = useCallback(() => {
    abortRef.current?.abort();
    setUpload({ status: "idle" });
  }, []);

  const clearUpload = useCallback(() => {
    setUpload({ status: "idle" });
    // Don't clear from context — let the user re-upload
  }, []);

  /* ─── File input handler ─── */
  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset so re-selecting the same file works
      e.target.value = "";
    },
    [handleFile],
  );

  /* ─── Drag & drop ─── */
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  /* ─── Paste from clipboard ─── */
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.kind === "file" && ACCEPTED_TYPES.includes(item.type)) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            handleFile(file);
            return;
          }
        }
      }
    };
    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, [handleFile]);

  /* ─── Submit ─── */
  const isUploadComplete = upload.status === "success";

  const handleContinue = useCallback(async () => {
    if (!isUploadComplete) return;

    updateSection("payment", {
      transactionRef: transactionRef.trim() || undefined,
      verificationStatus: "pending",
    });

    await markStepComplete("payment");
    goToStep("health");
  }, [isUploadComplete, transactionRef, updateSection, markStepComplete, goToStep]);

  const handleBack = useCallback(() => {
    goToStep("details");
  }, [goToStep]);

  return (
    <>
      {/* ─── Heading block ─── */}
      <div className="af-heading-block">
        {/* The step counter lives in <StepProgress> now — it was
            printing "Step 2 of 4" twice on phones, once in the progress bar
            and once here. */}
        <span className="sr-only">Step 2 of 4</span>
        <h2 className="af-title">Confirm your consultation.</h2>
        <p className="af-subtitle">
          Scan the QR code to pay the consultation fee, then upload the payment screenshot. You'll
          move straight on to the health assessment — verification happens on our side.
        </p>
      </div>

      {/* ═══ Card 1 — Payment ═══ */}
      <div className="af-form-card">
        <div className="af-pay-grid">
          {/* ── Left: QR block ── */}
          <div className="af-qr-block">
            <div className="af-qr-panel">
              <img
                src={QR_IMAGE}
                alt="UPI QR code for consultation payment"
                className="af-qr-image"
              />
            </div>

            <div className="af-upi-row">
              <span className="af-upi-id">{UPI_ID}</span>
              <button
                type="button"
                className="af-copy-btn"
                onClick={copyUpi}
                aria-label={copied ? "Copied" : "Copy UPI ID"}
              >
                {copied ? (
                  <>
                    <Check aria-hidden="true" /> Copied
                  </>
                ) : (
                  <>
                    <Copy aria-hidden="true" /> Copy
                  </>
                )}
              </button>
            </div>

            <p className="af-amount">{CONSULTATION_FEE}</p>
          </div>

          {/* ── Right: Instructions ── */}
          <div>
            <p className="af-instructions-label">How to pay</p>
            <ol className="af-steps-list">
              {INSTRUCTIONS.map((text, i) => (
                <li key={i} className="af-step-item">
                  <span className="af-step-num">{i + 1}</span>
                  <span className="af-step-text">{text}</span>
                </li>
              ))}
            </ol>

            <div className="af-info-note">
              <Info aria-hidden="true" />
              <p>
                You can continue to the next step as soon as your screenshot is uploaded. We'll
                verify the payment separately and confirm your consultation within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Card 2 — Upload ═══ */}
      <div className="af-form-card">
        <p className="af-upload-label">
          Payment screenshot{" "}
          <span className="af-label__required" aria-hidden="true">
            *
          </span>
        </p>

        {/* Error banner */}
        {upload.status === "error" && (
          <div className="af-upload-error" role="alert">
            <AlertTriangle aria-hidden="true" />
            <div className="af-upload-error__content">
              <p className="af-upload-error__message">{upload.message}</p>
              <button
                type="button"
                className="af-upload-error__retry"
                onClick={() => {
                  setUpload({ status: "idle" });
                  fileInputRef.current?.click();
                }}
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Dropzone (empty / error) */}
        {(upload.status === "idle" || upload.status === "error") && (
          <div
            className={`af-dropzone${isDragOver ? " af-dropzone--dragover" : ""}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload payment screenshot"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <div className="af-dropzone__icon-circle">
              <UploadCloud aria-hidden="true" />
            </div>
            <p className="af-dropzone__title">Drop your screenshot here, or tap to browse</p>
            <p className="af-dropzone__hint">JPG, PNG or WEBP · up to 5 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileChange}
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Uploading state */}
        {upload.status === "uploading" && (
          <div className="af-uploading">
            <img src={upload.preview} alt="Upload preview" className="af-uploading__thumb" />
            <div className="af-uploading__info">
              <p className="af-uploading__name">{upload.file.name}</p>
              <p className="af-uploading__size">{formatBytes(upload.file.size)}</p>
              <div className="af-uploading__track">
                <div
                  className="af-uploading__fill"
                  style={{ transform: `scaleX(${upload.percent / 100})` }}
                />
              </div>
              <p className="af-uploading__percent">{upload.percent}%</p>
            </div>
            <button
              type="button"
              className="af-uploading__cancel"
              onClick={cancelUpload}
              aria-label="Cancel upload"
            >
              <X aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Success state */}
        {upload.status === "success" && (
          <div className="af-upload-success">
            <img
              src={upload.url}
              alt="Uploaded payment screenshot"
              className="af-upload-success__thumb"
              onClick={() => setLightboxUrl(upload.url)}
            />
            <div className="af-upload-success__info">
              <div className="af-upload-success__chip">
                <Check aria-hidden="true" /> Uploaded
              </div>
              <p className="af-upload-success__name">{upload.fileName}</p>
              <p className="af-upload-success__meta">
                {upload.fileSize > 0 && <>{formatBytes(upload.fileSize)} · </>}
                {formatTime(upload.uploadedAt)}
              </p>
            </div>
            <button type="button" className="af-upload-success__replace" onClick={clearUpload}>
              Replace
            </button>
          </div>
        )}

        {/* Transaction ref field */}
        <div style={{ marginTop: 24 }}>
          <FormField
            label="Transaction reference (optional)"
            htmlFor="transactionRef"
            helper="Helps us match your payment faster, but isn't required."
            helperId="transactionRef-helper"
          >
            <TextInput
              id="transactionRef"
              placeholder="UPI transaction ID"
              autoComplete="off"
              enterKeyHint="done"
              maxLength={60}
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              describedBy="transactionRef-helper"
            />
          </FormField>
        </div>

        {/* ─── Footer ─── */}
        <div className="af-pay-footer">
          <div className="af-pay-footer__row">
            <button type="button" className="af-back-btn" onClick={handleBack}>
              <ArrowLeft aria-hidden="true" />
              Back
            </button>

            <div className="af-tooltip-wrapper">
              {!isUploadComplete && (
                <span className="af-tooltip">Upload your payment screenshot to continue.</span>
              )}
              <button
                type="button"
                className="af-submit-btn"
                disabled={!isUploadComplete}
                onClick={handleContinue}
              >
                Continue to Health Assessment
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>

          <p className="af-privacy-note" style={{ marginTop: 16 }}>
            <ShieldCheck aria-hidden="true" />
            Your screenshot is stored securely and used only to confirm your payment.
          </p>
        </div>
      </div>

      {/* ─── Lightbox ─── */}
      {lightboxUrl && (
        <div
          className="af-lightbox"
          onClick={() => setLightboxUrl(null)}
          role="dialog"
          aria-label="Screenshot preview"
        >
          <button
            type="button"
            className="af-lightbox__close"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxUrl(null);
            }}
            aria-label="Close preview"
          >
            <X aria-hidden="true" />
          </button>
          <img src={lightboxUrl} alt="Payment screenshot full preview" />
        </div>
      )}
    </>
  );
}
