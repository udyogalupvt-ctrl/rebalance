import React, { useCallback, useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";

interface EditorDrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  saveLabel?: string;
  /** Read-only drawers (e.g. the enquiry viewer) hide the save action. */
  hideSave?: boolean;
  children: React.ReactNode;
}

export function EditorDrawer({
  open,
  title,
  onClose,
  onSave,
  hideSave = false,
  isSaving,
  hasUnsavedChanges,
  saveLabel = "Save changes",
  children,
}: EditorDrawerProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setShowConfirm(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleCloseRequest = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  // Escape closes the drawer. handleCloseRequest is a dependency so the
  // listener never closes over a stale hasUnsavedChanges.
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseRequest();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, handleCloseRequest]);

  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCloseRequest}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "rgba(var(--dark-surface-rgb), 0.45)",
          backdropFilter: "blur(4px)",
          animation: "af-fade-in 320ms ease-[cubic-bezier(0.22,1,0.36,1)]",
        }}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 101,
          width: "100%",
          maxWidth: 560,
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "-10px 0 40px rgba(var(--shadow-rgb), 0.1)",
          display: "flex",
          flexDirection: "column",
          animation: "af-slide-in 320ms ease-[cubic-bezier(0.22,1,0.36,1)]",
          willChange: "transform",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 26px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
            zIndex: 2,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-fraunces)",
              fontWeight: 500,
              fontSize: "clamp(1.25rem, 1.8vw, 1.375rem)",
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={handleCloseRequest}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--surface-alt)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "28px 26px" }}>
          {children}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px 26px",
            borderTop: "1px solid var(--border)",
            background: "var(--surface)",
            zIndex: 2,
            display: "flex",
            gap: 12,
          }}
        >
          <button
            onClick={handleCloseRequest}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 999,
              background: "transparent",
              border: "1.5px solid var(--border-input)",
              fontWeight: 600,
              fontSize: 14.5,
              color: "var(--text)",
              cursor: "pointer",
            }}
          >
            {hideSave ? "Close" : "Cancel"}
          </button>
          {!hideSave && (
            <button
              onClick={onSave}
              disabled={isSaving}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 999,
                background: "var(--primary-strong)",
                border: "none",
                fontWeight: 600,
                fontSize: 14.5,
                color: "var(--on-primary)",
                cursor: isSaving ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: isSaving ? 0.8 : 1,
              }}
            >
              {isSaving && (
                <Loader2 size={18} style={{ animation: "af-spin 1s linear infinite" }} />
              )}
              {saveLabel}
            </button>
          )}
        </div>
      </div>

      {/* Unsaved Changes Confirm Dialog */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={() => setShowConfirm(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(var(--dark-surface-rgb), 0.45)",
            }}
          />
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 20,
              padding: 28,
              maxWidth: 400,
              width: "100%",
              position: "relative",
              zIndex: 1,
              boxShadow: "0 20px 40px rgba(var(--shadow-rgb), 0.15)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: "1.25rem",
                margin: "0 0 12px",
              }}
            >
              Discard changes?
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14.5, margin: "0 0 24px" }}>
              You have unsaved changes. Are you sure you want to discard them?
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 999,
                  background: "transparent",
                  border: "1.5px solid var(--border)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Keep editing
              </button>
              <button
                onClick={handleConfirmClose}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 999,
                  background: "rgba(var(--danger-rgb), 0.1)",
                  border: "1px solid rgba(var(--danger-rgb), 0.2)",
                  color: "var(--danger)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes af-slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes af-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes af-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
