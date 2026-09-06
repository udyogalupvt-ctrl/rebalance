import type { Transition, Variants } from "framer-motion";

/*
 * The JS half of the motion system.
 *
 * These numbers are the same curves and durations as `src/styles/motion.css`.
 * They are duplicated because Framer Motion needs arrays and seconds while CSS
 * needs cubic-bezier() and ms — but they must stay in step, or a card animated
 * in JS will feel different from the button inside it, which is exactly the
 * inconsistency that made the site feel assembled rather than designed.
 */

/** Signature: decelerates hard, then rests. Anything arriving uses this. */
export const EASE_SETTLE = [0.16, 0.84, 0.24, 1] as const;

/** A whisper of overshoot, like a scale tipping level. Use sparingly. */
export const EASE_BALANCE = [0.34, 1.32, 0.44, 1] as const;

/** The mirror of settle: leaves quickly, without lingering. */
export const EASE_EXIT = [0.4, 0, 0.9, 0.35] as const;

export const DUR = {
  /** colour, opacity, tiny state changes */
  xs: 0.16,
  /** buttons, chips, hovers */
  sm: 0.26,
  /** cards, panels, drawers */
  md: 0.42,
  /** section reveals */
  lg: 0.68,
  /** hero, deliberate set-pieces */
  xl: 1.1,
} as const;

/** Distance a revealing element travels. Small: the eye should barely catch it. */
export const RISE = 22;

export const settle = (duration: number = DUR.lg, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE_SETTLE,
});

/**
 * The standard reveal: rise and settle.
 *
 * Also eases a slight blur away. Focus arriving with the movement is what
 * separates a considered entrance from a plain fade, and it costs nothing on
 * the compositor at this radius.
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: RISE, filter: "blur(6px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: settle(),
  },
};

/** Same, without the blur — for text that must stay crisp on low-end devices. */
export const riseVariants: Variants = {
  hidden: { opacity: 0, y: RISE },
  shown: { opacity: 1, y: 0, transition: settle() },
};

/**
 * Container that releases its children in sequence.
 *
 * 70ms is deliberate: fast enough that a grid does not feel like it is being
 * dealt out one card at a time, slow enough to read as intentional.
 */
export const staggerParent = (stagger = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  shown: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** For a panel or drawer arriving from an edge. */
export const slideIn = (from: "left" | "right" | "bottom", distance = 32): Variants => ({
  hidden: {
    opacity: 0,
    x: from === "left" ? -distance : from === "right" ? distance : 0,
    y: from === "bottom" ? distance : 0,
  },
  shown: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: settle(DUR.md),
  },
});
