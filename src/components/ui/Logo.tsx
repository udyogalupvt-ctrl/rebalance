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
 * The GoRebalance brand lockup: the mark, with the wordmark set as live text.
 *
 * The supplied artwork is a *vertical* lockup — mark stacked above the
 * wordmark — which is wrong for a header bar: constraining it to bar height
 * shrinks the wordmark to a few illegible pixels. So the mark is used as an
 * image and the wordmark is typeset beside it in Fraunces, which also lets it
 * take the surrounding colour and stay crisp at any size.
 */
export function Logo({ className, style, hideText, tone = "dark", size = 36 }: LogoProps) {
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
          style={{ fontSize: Math.round(size * 0.62) }}
        >
          GoRebalance
        </span>
      )}
    </span>
  );
}
