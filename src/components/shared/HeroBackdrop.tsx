import * as React from "react";
import { cn } from "@/lib/utils";

export interface BackdropSlide {
  src: string;
  alt: string;
}

interface HeroBackdropProps {
  slides: readonly BackdropSlide[];
  /** Active frame, from `useBackdropCarousel`. */
  index: number;
  /** Variant class carrying the mask and opacity — see styles.css. */
  className?: string;
}

/**
 * The photographic ground behind a hero.
 *
 * Two things keep this from reading as a stock backdrop. The frames cross-fade
 * over more than a second rather than cutting, and each one drifts very
 * slightly larger while it is on screen. Both are opacity and transform, so
 * the compositor does all of it and the main thread stays free for scrolling.
 *
 * Every frame is in the DOM from the start and only its opacity changes, so a
 * transition costs no layout and there is nothing to decode mid-animation.
 * How much of the photograph actually shows is decided in CSS, because it
 * depends on the breakpoint and on which hero this is.
 */
export function HeroBackdrop({ slides, index, className }: HeroBackdropProps) {
  return (
    <div className={cn("hero-backdrop absolute inset-0 overflow-hidden", className)}>
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt=""
          /* Ground, not content. The section's own copy says everything these
             say, and announcing four food photographs on entering a page is
             noise. The dots below carry the descriptions for anyone who wants
             to step through them. */
          aria-hidden="true"
          decoding="async"
          {...(i === 0 ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
          data-active={i === index ? "true" : "false"}
          className="hero-backdrop__frame"
        />
      ))}
    </div>
  );
}

interface HeroBackdropDotsProps {
  slides: readonly BackdropSlide[];
  index: number;
  onSelect: (i: number) => void;
  className?: string;
  /** Set on a permanently dark band so the dots invert. */
  tone?: "light" | "dark";
}

/** The control strip for a `HeroBackdrop`. */
export function HeroBackdropDots({
  slides,
  index,
  onSelect,
  className,
  tone = "light",
}: HeroBackdropDotsProps) {
  if (slides.length < 2) return null;

  return (
    <div
      role="group"
      aria-label="Background photograph"
      className={cn("flex items-center", className)}
    >
      {slides.map((slide, i) => (
        <button
          key={slide.src}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Show photograph ${i + 1} of ${slides.length}: ${slide.alt}`}
          {...(i === index ? { "aria-current": "true" as const } : {})}
          /*
             A 36x40 hit area around a 7px dot.
             
             28px square was the first attempt and measured too small on a
             phone. The dot itself stays 7px — a bigger one would read as a
             button and pull attention away from the copy it sits under — so
             the target grows around it instead. Not a 44px square: at this
             pitch neighbouring targets would overlap and a tap near the edge
             would select the wrong frame.
          */
          className="group grid h-10 w-9 place-items-center rounded-full"
        >
          <span
            className={cn(
              "block h-[7px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,0.84,0.24,1)]",
              i === index
                ? "w-[26px] bg-accent-strong"
                : tone === "dark"
                  ? "w-[7px] bg-[rgba(var(--on-dark-rgb),0.34)] group-hover:bg-[rgba(var(--on-dark-rgb),0.6)]"
                  : "w-[7px] bg-[rgba(var(--text-rgb),0.22)] group-hover:bg-[rgba(var(--text-rgb),0.48)]",
            )}
          />
        </button>
      ))}
    </div>
  );
}
