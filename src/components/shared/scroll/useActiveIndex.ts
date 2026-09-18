import * as React from "react";
import { useMotionValueEvent } from "framer-motion";
import type { MotionValue } from "framer-motion";

/**
 * Which item of `count` the stage is currently showing, derived linearly from
 * progress.
 *
 * ONLY for stages whose beats really are evenly spread across the pin — the
 * four-step approach stage, where each step owns exactly a quarter of the
 * travel by construction.
 *
 * NOT for a ScrollRail. A rail's travel is `scrollWidth - viewportWidth`,
 * which is shorter than the cards' combined width, so the linear mapping runs
 * ahead of where the rail has actually reached: with twelve cards the counter
 * read "07" while card 06 was the one on screen. A rail reports its own index
 * from its measured position — see ScrollRail's `onActiveChange`.
 *
 * Kept in React state rather than read from the MotionValue on every frame,
 * because it drives real DOM (the counter, `aria-current`, the dots) and that
 * must change once per card, not sixty times a second. The value only ever
 * enters state when the rounded index actually changes.
 */
export function useActiveIndex(progress: MotionValue<number>, count: number): number {
  const [index, setIndex] = React.useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    if (count <= 1) return;
    const next = Math.min(count - 1, Math.max(0, Math.round(v * (count - 1))));
    setIndex((prev) => (prev === next ? prev : next));
  });

  return index;
}
