import * as React from "react";
import { cn } from "@/lib/utils";

interface CurveDividerProps {
  fill: "base" | "alt" | "surface" | "custom";
  flip?: boolean;
  className?: string;
  /**
   * Blend into a permanently-dark band (the footer, the CTA).
   *
   * A light-to-dark join is the one case where a curve alone is not enough:
   * see the note on GEOMETRY below.
   */
  toDark?: boolean;
}

/**
 * The join between two sections.
 *
 * GEOMETRY. The old path was `M0,80 C240,0 480,0 720,40 C960,80 1200,80
 * 1440,0` — an asymmetric double wave that rose on the left, dipped in the
 * middle and fell off the right edge. Between two light sections it read as a
 * gentle ripple and was fine. Against the footer it was not: a cream section
 * meeting a dark band along a lopsided wave has nothing to read as except a
 * shape, and a shape with no symmetry and no relationship to the logo reads
 * as an accident. The practice's note — that it "looks not good, different in
 * light and dark mode, mainly the white in light mode" — is exactly this.
 *
 * It is now ONE symmetric arc: a very wide, very shallow ellipse, centred, so
 * it echoes the round brand mark rather than resembling a wave. Symmetry is
 * what makes it look chosen.
 *
 * THE LIGHT-MODE PROBLEM. Geometry alone did not fix it. In light mode the
 * section above the footer is near-white and the footer is near-black, so
 * whatever the curve's shape, the eye lands on a hard 15:1 edge cutting
 * across the full width of the page — a seam, not a transition. In dark mode
 * the same edge is only ~1.4:1 and effectively invisible, which is why the
 * two modes looked like different designs.
 *
 * `toDark` adds a gradient ramp ABOVE the arc, running from transparent to a
 * tint of the dark band. The light section now dims into the footer over
 * ~90px before the arc is reached, so the edge carries a fraction of the
 * contrast it used to and the two themes finally read the same way.
 */
export function CurveDivider({ fill, flip = false, className, toDark = false }: CurveDividerProps) {
  const fillClass = {
    base: "fill-bg",
    alt: "fill-surface-alt",
    surface: "fill-surface",
    custom: "",
  }[fill];

  return (
    <div
      className={cn("relative w-full leading-[0] z-10 pointer-events-none", className)}
      aria-hidden="true"
    >
      {toDark && (
        <div className="absolute inset-x-0 bottom-0 h-[90px] bg-[linear-gradient(to_bottom,transparent,rgba(var(--dark-surface-rgb),0.16))] md:h-[130px]" />
      )}
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className={cn("relative block w-full h-[52px] md:h-[90px]", flip && "rotate-180")}
      >
        {/* One arc. Control points are mirrored about x=720, so the curve is
            symmetric by construction and cannot drift out of true if the
            viewBox changes. */}
        <path
          d="M0,90 L0,58 C360,-14 1080,-14 1440,58 L1440,90 Z"
          className={cn(fillClass, fill === "custom" && "fill-current")}
        />
      </svg>
    </div>
  );
}
