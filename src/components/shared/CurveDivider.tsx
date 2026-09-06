import * as React from "react";
import { cn } from "@/lib/utils";

interface CurveDividerProps {
  fill: "base" | "alt" | "surface" | "custom";
  flip?: boolean;
  className?: string;
}

export function CurveDivider({ fill, flip = false, className }: CurveDividerProps) {
  const fillClass = {
    base: "fill-bg",
    alt: "fill-surface-alt",
    surface: "fill-surface",
    custom: "",
  }[fill];

  return (
    <div
      className={cn(
        "w-full leading-[0] z-10 pointer-events-none",
        flip ? "rotate-180" : "",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[48px] md:h-[80px]">
        <path
          d="M0,80 C240,0 480,0 720,40 C960,80 1200,80 1440,0 L1440,80 L0,80 Z"
          className={cn(fillClass, fill === "custom" && "fill-current")}
        />
      </svg>
    </div>
  );
}
