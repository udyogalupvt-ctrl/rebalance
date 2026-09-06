import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "default" | "onDark";
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "default",
  className,
  id,
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isOnDark = tone === "onDark";

  // *word* renders italic + accent. Uses --accent-contrast rather than
  // --accent so it still clears 3:1 at display size on light surfaces.
  const renderTitle = (text: string) =>
    text.split(/(\*[^*]+\*)/g).map((part, i) =>
      part.startsWith("*") && part.endsWith("*") ? (
        <span
          key={i}
          className={cn("italic", isOnDark ? "text-on-dark-accent" : "text-accent-contrast")}
        >
          {part.slice(1, -1)}
        </span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    );

  return (
    <Reveal
      className={cn(
        "flex flex-col stack-heading",
        isCenter ? "items-center text-center mx-auto max-w-[720px]" : "items-start text-left",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-pill max-w-full",
          isOnDark ? "glass-on-dark" : "bg-primary-soft",
        )}
      >
        <span className="w-[5px] h-[5px] bg-accent rounded-full shrink-0" aria-hidden="true" />
        <span
          className={cn(
            "fs-eyebrow break-words",
            isOnDark ? "text-on-dark" : "text-primary-contrast",
          )}
        >
          {eyebrow}
        </span>
      </span>

      <h2 id={id} className={cn("fs-h2 mb-5", isOnDark ? "text-on-dark" : "text-text")}>
        {renderTitle(title)}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "fs-sub max-w-[620px]",
            isOnDark ? "text-on-dark-muted" : "text-text-muted",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
