import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
  /** Render the mark only, without the wordmark. */
  hideText?: boolean;
  /**
   * Which artwork to use.
   *
   * The real mark is full-colour — dark green with a sage interior — so unlike
   * the old hand-drawn SVG it cannot inherit `currentColor`. On a dark surface
   * it would all but vanish, so there is a second file whose lightness is
   * inverted with hue and saturation preserved: still the brand green, not a
   * white silhouette.
   */
  tone?: "dark" | "light";
  /** Height of the mark in pixels. */
  size?: number;
}

/**
 * Optical centring nudge for the wordmark, in em.
 *
 * Zero, and measured rather than assumed. I first pushed the text down by
 * 0.055em on the theory that a descender-free word rides high in its em box.
 * Rendering the header at 4x and finding the actual ink extents showed the
 * opposite: with the nudge the wordmark's ink centre sat 1.33px BELOW the
 * mark's. Fraunces already places its caps close to the centre of the em box,
 * so `align-items: center` on the boxes is correct on its own.
 *
 * Kept as a named constant because the right value is a property of the
 * typeface: if the wordmark font ever changes, re-measure rather than guess.
 */
const WORDMARK_NUDGE = "0em";

/**
 * The GoRebalance brand lockup: the mark, with the wordmark set as live text.
 *
 * The supplied artwork is a *vertical* lockup — mark stacked above the
 * wordmark — which is wrong for a header bar: constraining it to bar height
 * shrinks the wordmark to a few illegible pixels. So the mark is used as an
 * image and the wordmark is typeset beside it in Fraunces, which also lets it
 * take the surrounding colour and stay crisp at any size.
 */
export function Logo({ className, style, hideText, tone = "dark", size = 44 }: LogoProps) {
  const src = tone === "light" ? "/brand-mark-light.png" : "/brand-mark.png";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} style={style}>
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        decoding="async"
        className="block shrink-0 object-contain"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {!hideText && (
        <span
          className={cn(
            "font-fraunces font-semibold tracking-tight leading-none",
            tone === "light" ? "text-on-dark" : "text-text",
          )}
          style={{
            // 0.5 rather than 0.62: the mark should lead the lockup, and the
            // wordmark was previously out-weighing it.
            fontSize: Math.round(size * 0.5),
            transform: `translateY(${WORDMARK_NUDGE})`,
          }}
        >
          GoRebalance
        </span>
      )}
    </span>
  );
}
