import React, { useCallback, useState } from "react";
import { uploadToCloudinary, CloudinaryResult, UploadError } from "@/lib/cloudinary";
import { ImagePlus, X, Loader2, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  value?: CloudinaryResult | null;
  onChange: (result: CloudinaryResult | null) => void;
  folder: string;
  maxFiles?: number;
}

export function ImageUploader({ value, onChange, folder }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsUploading(true);
      setProgress(0);

      try {
        const result = await uploadToCloudinary(file, {
          folder,
          onProgress: (p) => setProgress(p),
        });
        onChange(result);
      } catch (err) {
        if (err instanceof UploadError) {
          setError(err.message);
        } else {
          setError("Failed to upload image. Please try again.");
        }
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onChange],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) handleFile(picked);
  };

  // Handle paste events globally if this component is focused or hovered, but easiest is just on a wrapper
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) handleFile(file);
          break;
        }
      }
    },
    [handleFile],
  );

  return (
    <div
      className="af-image-uploader"
      onPaste={handlePaste}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      {value ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid var(--border)",
            background: "var(--surface-alt)",
            aspectRatio: value.width && value.height ? `${value.width}/${value.height}` : "16/9",
            maxHeight: 400,
          }}
        >
          <img
            src={value.secure_url}
            alt="Uploaded"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 36,
              height: 36,
              background: "rgba(var(--shadow-rgb), 0.6)",
              color: "var(--on-primary)",
              border: "none",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
            }}
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <label
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: 200,
            padding: 32,
            textAlign: "center",
            border: `2px dashed ${isDragging ? "var(--primary)" : "var(--border)"}`,
            borderRadius: 16,
            background: isDragging ? "var(--primary-soft)" : "var(--surface)",
            cursor: isUploading ? "not-allowed" : "pointer",
            transition: "all 200ms ease",
            position: "relative",
          }}
        >
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={onFileChange}
            disabled={isUploading}
            style={{ display: "none" }}
          />

          {isUploading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                width: "100%",
                maxWidth: 240,
              }}
            >
              <Loader2
                size={32}
                style={{ color: "var(--primary)", animation: "af-spin 1s linear infinite" }}
              />
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                Uploading... {progress}%
              </div>
              <div
                style={{
                  width: "100%",
                  height: 6,
                  background: "var(--surface-alt)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "var(--primary-strong)",
                    width: `${progress}%`,
                    transition: "width 200ms ease",
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--surface-alt)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  marginBottom: 16,
                }}
              >
                <ImagePlus size={24} />
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)" }}>
                Click to upload, or drag and drop
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
                JPG, PNG or WEBP up to 5MB
              </div>
              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--danger)",
                    fontSize: 13,
                    marginTop: 16,
                    background: "rgba(var(--danger-rgb), 0.1)",
                    padding: "8px 12px",
                    borderRadius: 8,
                  }}
                >
                  <AlertCircle size={14} /> {error}
                </div>
              )}
            </>
          )}
        </label>
      )}
    </div>
  );
}
