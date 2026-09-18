import * as React from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRange } from "./range";

/*
 * PINNED STAGE — the primitive every scroll-driven set-piece is built on.
 *
 * The shape is always the same: a tall outer section that supplies the scroll
 * distance, and inside it one sticky "stage" exactly one viewport tall that
 * stays put while that distance is consumed. The section's scroll progress,
 * 0 at the moment the stage locks and 1 at the moment it releases, is handed
 * to the children as a MotionValue.
 *
 * Three things here are not obvious and all three are load-bearing.
 *
 * 1. `overflow-x: clip`, never `overflow: hidden`.
 *    An `overflow: hidden` ancestor becomes a scroll container, and a sticky
 *    element positions itself against the nearest scroll container rather
 *    than the viewport — which is the single most common reason a sticky
 *    element silently refuses to stick. `clip` cuts the same overflow without
 *    creating a scrollport. SectionWrapper uses `overflow-hidden`, so pinned
 *    sections deliberately do not go through it.
 *
 * 2. No `render-on-approach`.
 *    That utility sets `content-visibility: auto` with a 1200px intrinsic-size
 *    guess. A pinned section is three to five viewports tall, so the guess is
 *    wrong by thousands of pixels; the page height changes the moment the
 *    section resolves and the scroll position jumps under the reader. Pinned
 *    sections must paint normally.
 *
 * 3. `svh`, not `vh`.
 *    On a phone `100vh` is the viewport with the browser toolbars *hidden*,
 *    so a `100vh` stage is taller than what is actually on screen until the
 *    user scrolls enough to collapse them — the bottom of every stage would
 *    sit under the address bar. `svh` is the small viewport, which is the one
 *    that is always visible.
 */

/**
 * The fixed chrome a stage must not sit underneath.
 *
 * The header at the top on every screen, and below `sm` the booking bar at the
 * bottom. The bar's height comes from --bar-h, which carries the iOS
 * safe-area inset — on a notched iPhone the home indicator adds 34px that a
 * hardcoded padding would not know about, and the bottom line of every pinned
 * stage would sit under it.
 */
const STAGE_FRAME = "pt-[var(--header-h)] pb-[calc(var(--bar-h)+8px)] sm:pb-8";

export interface StageRenderProps {
  /** 0 when the stage locks, 1 when it releases. */
  progress: MotionValue<number>;
  /** True once the stage has been scrolled into. */
  active: boolean;
}

interface PinnedStageProps {
  /**
   * How much scroll the pin lasts, in viewports. `length={3}` means the reader
   * scrolls three screens' worth while the stage holds still.
   *
   * Keep it proportional to how much there is to read: a stage that moves five
   * cards past wants more distance than one that swaps two images, and a pin
   * that outlasts its content is the thing that makes people feel stuck.
   */
  length: number;
  children: (props: StageRenderProps) => React.ReactNode;
  /**
   * What to render instead when motion is reduced. Pinning IS the animation
   * here — there is no degraded version of it — so this is a real, separate
   * rendering of the same content in ordinary page flow, never an empty box.
   */
  fallback: React.ReactNode;
  className?: string;
  /** Classes on the sticky stage itself. */
  stageClassName?: string;
}

/*
 * This renders a plain <div>, not a <section>, on purpose.
 *
 * The pin has to begin at the very top of the element whose scroll it is
 * measuring — "start start" means "this element's top met the viewport's top".
 * If a heading sat inside it above the stage, progress would already be
 * running while the reader was still reading the heading, and the stage would
 * lock a beat late and release early.
 *
 * So the heading lives in the consumer's own <section>, outside this box, and
 * this box holds nothing but the scroll distance and the stage.
 */
export function PinnedStage({
  length,
  children,
  fallback,
  className,
  stageClassName,
}: PinnedStageProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  /*
   * "start start" → "end end" is what makes progress line up with the pin
   * exactly. Progress hits 0 when the section's top meets the viewport top
   * (the frame the stage sticks on) and 1 when its bottom meets the viewport
   * bottom (the frame the stage lets go). Any other offset pair leaves the
   * animation still running after the stage has unstuck, or finishing early
   * while it is still held.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [active, setActive] = React.useState(false);
  React.useEffect(() => {
    if (reduce) return;
    return scrollYProgress.on("change", (v) => {
      setActive((was) => {
        const now = v > 0.001 && v < 0.999;
        return was === now ? was : now;
      });
    });
  }, [scrollYProgress, reduce]);

  /*
   * The ref stays attached in the reduced-motion path too.
   *
   * useScroll has already been given this ref, and it warns on every page load
   * if the element it is told to measure never appears ("Target ref is defined
   * but not hydrated"). Keeping the same box mounted — just without the height
   * and the sticky stage — costs nothing and keeps the console clean, which
   * matters because a warning that fires on every load is a warning nobody
   * reads.
   */
  if (reduce) {
    return (
      <div ref={ref} className={cn("relative w-full", className)}>
        {fallback}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      // overflow-x-clip: see note 1 above. Tailwind's `overflow-x-clip` maps to
      // `overflow-x: clip`, which does not create a scrollport.
      className={cn("relative w-full overflow-x-clip", className)}
      style={{ height: `${(length + 1) * 100}svh` }}
    >
      <div
        className={cn(
          "sticky top-0 flex h-[100svh] w-full flex-col justify-center overflow-x-clip",
          STAGE_FRAME,
          stageClassName,
        )}
      >
        {children({ progress: scrollYProgress, active })}
      </div>
    </div>
  );
}

/**
 * A thin progress bar for a pinned stage.
 *
 * Not decoration: a stage that holds still while the page scrolls removes the
 * reader's usual signal that anything is happening, and "where am I and how
 * much is left" is the first question a pin raises. This answers it.
 */
export function StageProgress({
  progress,
  count,
  active,
  className,
  label,
}: {
  progress: MotionValue<number>;
  count: number;
  active: number;
  className?: string;
  label?: string;
}) {
  const scaleX = useRange(progress, [0, 1], [0, 1]);

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <p className="shrink-0 font-jakarta text-[12px] font-semibold tabular-nums tracking-[0.12em] text-text-muted">
        <span className="text-primary-contrast">{String(active + 1).padStart(2, "0")}</span>
        <span aria-hidden="true"> / {String(count).padStart(2, "0")}</span>
        {label && <span className="sr-only"> — {label}</span>}
      </p>
      <div
        aria-hidden="true"
        className="h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-[rgba(var(--primary-rgb),0.16)]"
      >
        <motion.div
          className="h-full w-full origin-left rounded-full bg-primary"
          style={{ scaleX }}
        />
      </div>
    </div>
  );
}
