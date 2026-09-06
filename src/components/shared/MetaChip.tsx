import * as React from "react";
import { cn } from "@/lib/utils";

interface MetaChipProps {
  icon: React.ElementType;
  label: string;
  /**
   * "onDark" for chips sitting on an image hero or the dark CTA band,
   * "default" for chips on a normal page surface.
   */
  tone?: "onDark" | "default";
  className?: string;
}

/**
 * The hero meta chip. Previously copy-pasted into About, Gallery, Treatments
 * and Testimonials with slightly different colours each time; Contact used a
 * third variant that broke in dark mode.
 */
export function MetaChip({ icon: Icon, label, tone = "onDark", className }: MetaChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] font-medium",
        tone === "onDark"
          ? "glass-on-dark text-on-dark"
          : "bg-surface border border-border text-text",
        className,
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 shrink-0",
          tone === "onDark" ? "text-on-dark-accent" : "text-accent-contrast",
        )}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
