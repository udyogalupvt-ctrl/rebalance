import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id?: string;
  bg?: "base" | "alt" | "surface";
  labelledBy?: string;
  children: React.ReactNode;
  className?: string;
  /** Use the tighter vertical rhythm (for short, secondary sections). */
  size?: "default" | "sm";
}

export function SectionWrapper({
  id,
  bg = "base",
  labelledBy,
  children,
  className,
  size = "default",
}: SectionWrapperProps) {
  const bgClass = {
    base: "bg-bg",
    alt: "bg-surface-alt",
    surface: "bg-surface",
  }[bg];

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        size === "sm" ? "section-y-sm" : "section-y",
        "relative overflow-hidden",
        bgClass,
        className,
      )}
    >
      <div className="container-x relative z-10">{children}</div>
    </section>
  );
}
