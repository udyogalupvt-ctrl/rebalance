import React from "react";
import * as Switch from "@radix-ui/react-switch";

interface PublishToggleProps {
  published: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}

export function PublishToggle({ published, onChange, disabled }: PublishToggleProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: published ? "var(--text)" : "var(--text-muted)",
          width: 64,
          textAlign: "right",
        }}
      >
        {published ? "Published" : "Draft"}
      </span>
      <Switch.Root
        checked={published}
        onCheckedChange={onChange}
        disabled={disabled}
        style={{
          width: 42,
          height: 24,
          background: published ? "var(--primary-strong)" : "var(--border-input)",
          borderRadius: 999,
          position: "relative",
          cursor: disabled ? "not-allowed" : "pointer",
          border: "none",
          outline: "none",
          transition: "background 150ms ease",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Switch.Thumb
          style={{
            display: "block",
            width: 20,
            height: 20,
            background: "var(--surface)",
            borderRadius: "50%",
            transition: "transform 150ms cubic-bezier(0.22, 1, 0.36, 1)",
            transform: `translateX(${published ? 20 : 2}px)`,
            willChange: "transform",
            boxShadow: "0 2px 4px rgba(var(--shadow-rgb), 0.25)",
            border: "1px solid var(--border)",
          }}
        />
      </Switch.Root>
    </div>
  );
}
