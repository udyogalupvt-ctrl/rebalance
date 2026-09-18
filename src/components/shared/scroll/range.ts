import { useTransform, transform } from "framer-motion";
import type { MotionValue } from "framer-motion";

/*
 * ============================================================================
 * READ THIS BEFORE WRITING useTransform(value, inputRange, outputRange).
 * ============================================================================
 *
 * In this project (framer-motion 13.1.1) that overload is only correct when
 * the INPUT range is exactly [0, 1]. Give it any other input range and it
 * returns a wrong number — silently. Nothing throws and nothing logs; the only
 * symptom is an animation that runs backwards or never reaches its end state.
 *
 * Measured in Chromium, reading the computed style of a live element while
 * scrolling, with `p` the scroll progress:
 *
 *   useTransform(p, [0, 1],    [-24, 24])  correct    (-24 rising to 24)
 *   useTransform(p, [0, 0.08], [1, 0])     returns  (p - 0.08) / 0.92
 *                                          expected 1 falling to 0 by p = 0.08
 *   useTransform(p, [0, 0.08], [0, 1])     returns  1 - (p - 0.08) / 0.92
 *                                          expected 0 rising to 1 by p = 0.08
 *
 * So a fade-out written over a partial range fades IN instead — which is
 * exactly how this was found. A "scroll to explore" hint that should vanish
 * once the reader starts scrolling grew steadily brighter the further they
 * went, reaching full opacity at the end of the section.
 *
 * Partial input ranges are the normal case in scroll work: almost every beat
 * of a pinned stage happens over a slice of the pin, not across all of it. So
 * the broken form is the one this code needs most.
 *
 * The pure `transform(value, inputRange, outputRange)` function from the same
 * package is correct at every input tested, and the callback form of
 * `useTransform` is correct. This helper composes the two: the callback form
 * for the subscription, the pure function for the arithmetic.
 *
 * Use `useRange` for every scroll-driven mapping in this directory. It is not
 * a style preference — the plain overload produces wrong output.
 */

/**
 * Maps a MotionValue through an input range onto an output range, clamped at
 * both ends.
 *
 * `transform` clamps by default, which is what scroll work almost always
 * wants: past the end of its window a value should hold its final state, not
 * carry on extrapolating into a scale of 4 or a negative opacity.
 */
export function useRange(
  value: MotionValue<number>,
  inputRange: number[],
  outputRange: number[],
): MotionValue<number> {
  return useTransform(value, (v) => transform(v, inputRange, outputRange));
}

/**
 * The 0→1 progress of one slice of a larger progress value.
 *
 * Set-pieces are nearly always "hold, then move, then hold" — a card should be
 * settled before the next begins, not sliding for the whole pin. This lets
 * each beat be written in its own terms.
 */
export function useSlice(
  value: MotionValue<number>,
  from: number,
  to: number,
): MotionValue<number> {
  return useRange(value, [from, to], [0, 1]);
}
