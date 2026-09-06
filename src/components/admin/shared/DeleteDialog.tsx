import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  itemName: string;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteDialog({
  open,
  onOpenChange,
  title,
  itemName,
  onConfirm,
  isDeleting,
}: DeleteDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(var(--dark-surface-rgb), 0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 300,
            animation: "af-fade-in 150ms ease",
          }}
        />
        <AlertDialog.Content
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "var(--surface)",
            borderRadius: 20,
            padding: 28,
            width: "90%",
            maxWidth: 440,
            boxShadow: "0 20px 40px rgba(var(--shadow-rgb), 0.15)",
            zIndex: 301,
            animation: "af-fade-in 150ms ease", // Could add slight scale up
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(var(--danger-rgb), 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--danger)",
              marginBottom: 20,
            }}
          >
            <AlertTriangle size={24} />
          </div>

          <AlertDialog.Title
            style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.375rem", margin: "0 0 12px" }}
          >
            {title}
          </AlertDialog.Title>

          <AlertDialog.Description
            style={{
              color: "var(--text-muted)",
              fontSize: 14.5,
              lineHeight: 1.6,
              margin: "0 0 32px",
            }}
          >
            Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be
            undone and it will be immediately removed from the live site if published.
          </AlertDialog.Description>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <AlertDialog.Cancel asChild>
              <button
                disabled={isDeleting}
                style={{
                  height: 44,
                  padding: "0 20px",
                  borderRadius: 999,
                  background: "transparent",
                  border: "1.5px solid var(--border)",
                  fontWeight: 600,
                  color: "var(--text)",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
            </AlertDialog.Cancel>
            <button
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              disabled={isDeleting}
              style={{
                height: 44,
                padding: "0 20px",
                borderRadius: 999,
                background: "var(--danger)",
                border: "none",
                fontWeight: 600,
                color: "var(--on-primary)",
                cursor: isDeleting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: isDeleting ? 0.8 : 1,
              }}
            >
              {isDeleting && (
                <Loader2 size={16} style={{ animation: "af-spin 1s linear infinite" }} />
              )}
              Delete
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
