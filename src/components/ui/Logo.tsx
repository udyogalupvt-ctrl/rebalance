import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
  /** Render the mark only, without the wordmark. */
  hideText?: boolean;
  /**
   * Drop the wordmark on the narrowest phones.
   *
   * At 320px the header pill has to hold the mark, the wordmark, the theme
   * toggle and the menu button. The wordmark is the only one of those that is
   * not a control, and it is the one that pushed the menu button hard against
   * the screen edge. Below 400px the mark carries the brand on its own — it
   * is distinctive enough to, which is the point of having a mark.
   */
  collapseTextOnNarrow?: boolean;
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
 * Optical centring nudge for the wordmark, expressed in em of the wordmark.
 *
 * Measured, not guessed, and re-measured after the wordmark was enlarged.
 *
 * The artwork is 320x320 with the ink occupying y 22..296. Aligning the two
 * BOUNDING BOXES centres the wordmark against y=159 — which looks wrong,
 * because the box is not where the eye finds the middle. Almost all of the
 * mark's mass is in the round body at the bottom; the leaf reaching up to
 * y=22 is a thin flick that contributes very little ink. The alpha-weighted
 * centroid lands at y=175.7, i.e. 0.0491 of the artwork's height BELOW the
 * geometric centre. That is why the wordmark read as sitting too high.
 *
 *   nudge_px = 0.0491 * markSize
 *   nudge_em = nudge_px / (WORDMARK_RATIO * markSize) = 0.0491 / 0.56 = 0.088
 *
 * The size cancels out, so one em value holds at every size the logo is used
 * at. Re-measure the centroid if the artwork is ever redrawn.
 */
const WORDMARK_NUDGE = "0.088em";

/**
 * Wordmark size as a fraction of the mark's height.
 *
 * Raised from 0.5. At half the mark height the word was optically subordinate
 * to a mark whose ink only fills two thirds of its own box, so the lockup read
 * as a large symbol with a caption rather than as one unit.
 */
const WORDMARK_RATIO = 0.56;

/**
 * The GoRebalance brand lockup: the mark, with the wordmark set as live text.
 *
 * The supplied artwork is a *vertical* lockup — mark stacked above the
 * wordmark — which is wrong for a header bar: constraining it to bar height
 * shrinks the wordmark to a few illegible pixels. So the mark is used as an
 * image and the wordmark is typeset beside it in Fraunces, which also lets it
 * take the surrounding colour and stay crisp at any size.
 */
export function Logo({
  className,
  style,
  hideText,
  collapseTextOnNarrow,
  tone = "dark",
  size = 44,
}: LogoProps) {
  const dimensions = { width: size, height: size };

  /*
   * Which artwork, and why there are two <img> tags.
   *
   * `tone="light"` means "I am on one of the permanently-dark bands" — the
   * footer, the CTA — and always takes the light mark.
   *
   * `tone="dark"` means "I am on the page surface", and that surface flips
   * with the theme. The dark-green mark on the dark theme's plum surface
   * measured barely 2:1, so it has to flip too. That cannot be decided in JS
   * without the component subscribing to the theme, so both files are in the
   * markup and CSS picks one — which also means the correct mark is painted
   * on the very first frame, before any theme hook has run.
   */
  const markClass = "block shrink-0 object-contain";

  return (
    <span className={cn("inline-flex items-center", className)} style={style}>
      {tone === "light" ? (
        <img
          src="/brand-mark-light.png"
          alt=""
          {...dimensions}
          decoding="async"
          fetchPriority="high"
          className={markClass}
          style={dimensions}
          aria-hidden="true"
        />
      ) : (
        <>
          <img
            src="/brand-mark.png"
            alt=""
            {...dimensions}
            decoding="async"
            fetchPriority="high"
            className={cn(markClass, "dark:hidden")}
            style={dimensions}
            aria-hidden="true"
          />
          <img
            src="/brand-mark-light.png"
            alt=""
            {...dimensions}
            decoding="async"
            className={cn(markClass, "hidden dark:block")}
            style={dimensions}
            aria-hidden="true"
          />
        </>
      )}
      {!hideText && (
        <span
          className={cn(
            "font-fraunces font-semibold leading-none tracking-[-0.015em]",
            tone === "light" ? "text-on-dark" : "text-text",
            collapseTextOnNarrow && "hidden min-[400px]:inline-block",
          )}
          style={{
            fontSize: Math.round(size * WORDMARK_RATIO),
            transform: `translateY(${WORDMARK_NUDGE})`,
            /* The mark's own ink centroid sits 6.6/320 to the RIGHT of its box
               centre, so a symmetric gap looks tight on this side. Measured in
               the same units as the nudge so it scales with the lockup. */
            marginLeft: Math.round(size * 0.13),
          }}
        >
          GoRebalance
        </span>
      )}
    </span>
  );
}
