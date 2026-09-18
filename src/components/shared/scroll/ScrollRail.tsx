import * as React from "react";
import { motion, useSpring, useMotionValueEvent } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRange } from "./range";

/*
 * SCROLL RAIL — vertical scroll moved sideways.
 *
 * Inside a PinnedStage, the reader's ordinary downward scroll drives a track
 * of cards horizontally. It is the one pattern that genuinely earns its keep
 * on a phone: five cards that would be five screens of thumb-work become one
 * screen the reader moves through at their own pace, and because the input is
 * still a plain vertical scroll there is no gesture to learn and nothing to
 * fight with the page.
 *
 * The distance is measured, never assumed. Card widths here are in `vw` and
 * the copy inside them wraps differently at every breakpoint, so a hardcoded
 * translate would either stop short of the last card or run past it into
 * empty space. A ResizeObserver keeps the measurement honest through font
 * loading, orientation changes and the phone's collapsing toolbar.
 */

interface ScrollRailProps {
  /** Stage progress, 0→1, from PinnedStage. */
  progress: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
  /** Classes for the moving track (gap, padding, alignment). */
  trackClassName?: string;
  /**
   * Called with the index of the card the reader is currently on.
   *
   * Each card in `children` must carry `data-rail-item` for this to work; the
   * rail uses that to tell cards from decoration in the same track.
   *
   * The rail reports this itself rather than letting the caller derive it from
   * progress, because those two are NOT the same mapping and assuming they are
   * is a bug that looks like an off-by-one.
   *
   * Progress is linear over the pin. The rail's travel is linear over
   * `scrollWidth - viewportWidth` — the distance needed to bring the LAST
   * card flush with the right edge — and that distance is shorter than the
   * full width of the cards. So at half the progress the rail is not showing
   * the middle card; with twelve cards on a phone it was showing the sixth
   * while the counter read "07", and the lit card was the one half off the
   * right edge rather than the one being read.
   *
   * Measuring instead makes the counter, the highlight and the card on screen
   * agree by construction.
   */
  onActiveChange?: (index: number) => void;
}

export function ScrollRail({
  progress,
  children,
  className,
  trackClassName,
  onActiveChange,
}: ScrollRailProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [distance, setDistance] = React.useState(0);
  /* Each card's left edge within the track, measured on layout rather than
     read per frame — a getBoundingClientRect on every card on every frame is
     exactly the layout thrash this whole directory exists to avoid. */
  const offsets = React.useRef<number[]>([]);
  const activeRef = React.useRef(-1);

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      // scrollWidth of the track against the clientWidth of what shows it.
      // Never below zero: if everything already fits, the rail must not move.
      const next = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setDistance((prev) => (Math.abs(prev - next) < 1 ? prev : next));

      /*
       * Only the cards, found by their marker attribute.
       *
       * A track can hold more than cards — the journey rail draws a connecting
       * path as an absolutely positioned child spanning the full width. Taking
       * every element child counted that path as item 0 and shifted every
       * index by one, so the counter read "04" while card 03 sat under the
       * reader's eye. Marking the real items is the only reliable way to tell
       * a card from decoration.
       */
      const trackLeft = track.getBoundingClientRect().left;
      const cards = track.querySelectorAll<HTMLElement>(":scope > [data-rail-item]");
      offsets.current = Array.from(cards).map((c) => c.getBoundingClientRect().left - trackLeft);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const ro = new ResizeObserver(schedule);
    ro.observe(viewport);
    ro.observe(track);
    // Fonts change card heights and, through wrapping, their widths.
    document.fonts?.ready.then(schedule).catch(() => {});
    schedule();

    return () => {
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /*
   * A beat of stillness at each end.
   *
   * A strictly linear map means the first card is already sliding on the very
   * first pixel of the pin and the last one is still settling as the stage
   * releases — both read as the section being snatched away. Holding the ends
   * for 6% of the distance lets the set arrive and depart at rest.
   */
  const rawX = useRange(progress, [0, 0.06, 0.94, 1], [0, 0, -distance, -distance]);

  /*
   * A light spring on top of the scroll value.
   *
   * Lenis already damps the wheel, but a horizontal translate driven straight
   * off scroll still telegraphs every small correction of a trackpad. The
   * spring is stiff enough to stay under the reader's hand — this is not a
   * lag — and just soft enough that the row reads as having weight.
   */
  const x = useSpring(rawX, { stiffness: 220, damping: 40, mass: 0.6 });

  /*
   * The card the reader is on: the one whose left edge sits nearest a point a
   * third of the way across the viewport. Not the leftmost card, which for
   * most of the rail's travel is half cut off by the left edge, and not the
   * centred one, because the first and last cards can never reach the centre.
   */
  useMotionValueEvent(x, "change", (latest) => {
    if (!onActiveChange) return;
    const list = offsets.current;
    const viewport = viewportRef.current;
    if (!list.length || !viewport) return;

    const anchor = viewport.clientWidth * 0.33;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < list.length; i++) {
      const d = Math.abs((list[i] ?? 0) + latest - anchor);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    if (best !== activeRef.current) {
      activeRef.current = best;
      onActiveChange(best);
    }
  });

  return (
    <div ref={viewportRef} className={cn("w-full overflow-x-clip", className)}>
      <motion.div
        ref={trackRef}
        style={{ x }}
        className={cn("flex w-max items-stretch will-change-transform", trackClassName)}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * The "there is more this way" affordance.
 *
 * A pinned stage gives no scrollbar and no peeking card edge on the right at
 * the moment it locks, so without this the reader has no way to know the row
 * is about to move. It fades out once they have started, having done its job.
 */
export function RailHint({
  progress,
  label = "Keep scrolling",
}: {
  progress: MotionValue<number>;
  label?: string;
}) {
  const opacity = useRange(progress, [0, 0.1], [1, 0]);

  return (
    <motion.p
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none mt-4 flex items-center justify-center gap-2 font-jakarta text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted"
    >
      {label}
      <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border border-border">
        <svg viewBox="0 0 12 12" className="h-[9px] w-[9px]" fill="none" aria-hidden="true">
          <path
            d="M2 4.5 6 8l4-3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </motion.p>
  );
}
