import * as React from "react";
import { cn } from "@/lib/utils";

interface MetaChipProps {
  icon: React.ElementType;
  label: string;
  /**
   * "onDark" for chips sitting on the dark CTA band, "default" for chips on a
   * normal page surface.
   *
   * The default flipped when the page heroes went light. Every caller relied
   * on the old default of "onDark", so the chips were rendering --on-dark
   * text (near-white) on a porcelain background — measured 1.2:1, effectively
   * invisible. Nobody passes a tone, so the default is the whole contract.
   */
  tone?: "onDark" | "default";
  className?: string;
}

/**
 * The hero meta chip. Previously copy-pasted into About, Gallery, Treatments
 * and Testimonials with slightly different colours each time; Contact used a
 * third variant that broke in dark mode.
 */
export function MetaChip({ icon: Icon, label, tone = "default", className }: MetaChipProps) {
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
