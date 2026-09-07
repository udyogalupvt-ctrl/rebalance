import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
  /** Render the mark only, without the wordmark. */
  hideText?: boolean;
  /**
   * Scale the whole lockup down on the narrowest phones.
   *
   * At 360px the header pill has to hold the mark, the wordmark, the theme
   * toggle and the menu button. At full size the wordmark alone is about
   * 180px wide, which leaves the two 44px controls fighting for what is left
   * and pushes the menu button against the screen edge.
   *
   * The first attempt hid the wordmark below 400px. That was wrong: without
   * it nothing on screen says what the practice is CALLED, and a mark alone
   * only works for a brand people already recognise. So the lockup shrinks
   * instead — mark and wordmark together, in proportion — and the name stays
   * readable at every width. See .logo-lockup in styles.css.
   */
  shrinkOnNarrow?: boolean;
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
  /** Height of the mark in pixels, at full size. */
  size?: number;
}

/**
 * Optical centring nudge for the wordmark, expressed in em of the wordmark.
 *
 * Measured, not guessed.
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
 *   nudge_em = nudge_px / (0.52 * markSize) = 0.094
 *
 * The mark size cancels out, so one em value holds at every size the logo is
 * used at. Re-measure the centroid if the artwork is ever redrawn.
 */
const WORDMARK_NUDGE = "0.094em";

/**
 * How far the lockup shrinks below 400px, as a fraction of its full size.
 *
 * 0.70 rather than something gentler because the constraint is real: at 360px
 * the row has ~324px of usable width, the two controls take 96px of it, and
 * the lockup has to fit in what remains with air to spare.
 */
const NARROW_SCALE = 0.7;

/**
 * The GoRebalance brand lockup: the mark, with the wordmark set as live text.
 *
 * The supplied artwork is a *vertical* lockup — mark stacked above the
 * wordmark — which is wrong for a header bar: constraining it to bar height
 * shrinks the wordmark to a few illegible pixels. So the mark is used as an
 * image and the wordmark is typeset beside it in Fraunces, which also lets it
 * take the surrounding colour and stay crisp at any size.
 *
 * The RENDERED size comes from the --logo-h custom property, not from
 * JavaScript, so a media query can scale the mark and the wordmark together.
 */
export function Logo({
  className,
  style,
  hideText,
  shrinkOnNarrow,
  tone = "dark",
  size = 44,
}: LogoProps) {
  // Intrinsic size for the <img>, so the browser reserves the right box before
  // the file arrives. The painted size comes from --logo-h.
  const intrinsic = { width: size, height: size };
  const markClass = "logo-lockup__mark block shrink-0 object-contain";

  return (
    <span
      className={cn(
        "logo-lockup inline-flex items-center",
        shrinkOnNarrow && "logo-lockup--responsive",
        className,
      )}
      style={
        {
          "--logo-h": `${size}px`,
          "--logo-h-narrow": `${Math.round(size * NARROW_SCALE)}px`,
          ...style,
        } as React.CSSProperties
      }
    >
      {/*
       * Which artwork, and why there are two <img> tags.
       *
       * `tone="light"` means "I am on one of the permanently-dark bands" — the
       * footer, the CTA — and always takes the light mark.
       *
       * `tone="dark"` means "I am on the page surface", and that surface flips
       * with the theme. The dark-green mark on the dark theme's plum surface
       * measured barely 2:1, so it has to flip too. That cannot be decided in
       * JS without the component subscribing to the theme, so both files are
       * in the markup and CSS picks one — which also means the correct mark is
       * painted on the very first frame, before any theme hook has run.
       */}
      {tone === "light" ? (
        <img
          src="/brand-mark-light.png"
          alt=""
          {...intrinsic}
          decoding="async"
          fetchPriority="high"
          className={markClass}
          aria-hidden="true"
        />
      ) : (
        <>
          <img
            src="/brand-mark.png"
            alt=""
            {...intrinsic}
            decoding="async"
            fetchPriority="high"
            className={cn(markClass, "dark:hidden")}
            aria-hidden="true"
          />
          <img
            src="/brand-mark-light.png"
            alt=""
            {...intrinsic}
            decoding="async"
            className={cn(markClass, "hidden dark:block")}
            aria-hidden="true"
          />
        </>
      )}

      {!hideText && (
        <span
          className={cn(
            "logo-lockup__word font-fraunces font-semibold leading-none tracking-[-0.015em]",
            tone === "light" ? "text-on-dark" : "text-text",
          )}
          style={{ transform: `translateY(${WORDMARK_NUDGE})` }}
        >
          GoRebalance
        </span>
      )}
    </span>
  );
}
