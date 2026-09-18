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
  /**
   * The signature arc behind the content.
   *
   * Taken from the logo mark — a circle with an inner curve — rather than the
   * floating leaves every other nutrition site uses. One per section, very
   * large and almost invisible, so it reads as depth rather than decoration.
   *
   * "none" for sections that already carry their own imagery.
   */
  arc?: "none" | "left" | "right" | "center";
  /**
   * Background texture: fine contour lines, a linen weave, or a technical
   * grid. Abstract on purpose — an earlier version drew literal leaves and
   * seeds from the logo and read as clip-art rather than as a surface.
   *
   * Kept at a few percent opacity so it registers as the section having a
   * grain, never as pattern competing with the copy.
   */
  texture?: "none" | "contour" | "weave" | "grid";
  /**
   * Set when anything inside uses `position: sticky`.
   *
   * This section normally clips with `overflow: hidden`, to keep the arc glow
   * and texture from spilling. But an `overflow: hidden` box IS a scroll
   * container, and a sticky element resolves against its nearest scroll
   * container rather than the viewport — so every sticky descendant silently
   * stops sticking and behaves as though it were `position: relative`.
   *
   * `overflow-x: clip` cuts the same horizontal spill without creating a
   * scroll container, and leaves the vertical axis visible, which is what
   * sticky needs. It is not the default only because `hidden` is the safer
   * blanket clip for sections that have no sticky content.
   */
  sticky?: boolean;
}

export function SectionWrapper({
  id,
  bg = "base",
  labelledBy,
  children,
  className,
  size = "default",
  arc = "none",
  texture = "none",
  sticky = false,
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
        "relative",
        sticky ? "overflow-x-clip" : "overflow-hidden",
        // Skips layout and paint entirely while the section is off screen.
        // See .render-on-approach in styles.css.
        //
        // Not for sticky sections: content-visibility guesses the section's
        // height while it is off screen, and a section holding a sticky stack
        // is far taller than the guess — so the page height changes as it
        // resolves and the scroll position jumps under the reader.
        !sticky && "render-on-approach",
        bgClass,
        className,
      )}
    >
      {texture !== "none" && (
        <div className={cn("texture texture--fade", `texture--${texture}`)} aria-hidden="true" />
      )}

      {arc !== "none" && (
        <div className="arc-field" aria-hidden="true">
          {/* The wash: brand light in the room, so the section is not a flat fill. */}
          <div
            className={cn(
              "arc-glow arc--drift",
              arc === "left" && "-left-[30%] -top-[45%]",
              arc === "right" && "-right-[30%] -bottom-[45%] arc-glow--accent",
              arc === "center" && "left-1/2 -top-[55%] -translate-x-1/2",
            )}
          />
          {/* No outline. A hairline circle large enough to feel gentle also
              runs diagonally through the copy, and a stray line across text
              reads as a rendering fault rather than a motif. The wash alone
              gives the depth; restraint is what makes it look deliberate. */}
        </div>
      )}

      <div className="container-x relative z-10">{children}</div>
    </section>
  );
}
