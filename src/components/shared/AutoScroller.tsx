import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AutoScrollerProps {
  children: React.ReactNode;
  /** Pixels per second. Lower is calmer. */
  speed?: number | undefined;
  /**
   * Width of each item in the track. Pass "auto" for content-sized items —
   * the right choice for pills and chips, whose whole point is that they are
   * as wide as their label.
   */
  itemWidth?: string | undefined;
  /** Gap between items. */
  gap?: string | undefined;
  className?: string | undefined;
  /** Accessible label for the scroll region. */
  label?: string | undefined;
  /**
   * Set false to hold the rail still while keeping it swipeable. Used where the
   * cards are controls rather than content — once someone starts selecting,
   * moving the targets under their thumb is hostile.
   */
  autoScroll?: boolean | undefined;
}

/**
 * A continuously auto-scrolling horizontal rail.
 *
 * Built on a real scroll container rather than a CSS marquee, so the content
 * stays swipeable and keyboard-reachable while it moves. The children are
 * rendered twice; when the scroll position passes the halfway mark it is
 * rewound by exactly one copy, which makes the loop seamless with no pause or
 * gap at the join.
 *
 * Motion stops while the user is hovering, touching, dragging or focused
 * inside the rail, and resumes when they let go. Under
 * prefers-reduced-motion it never auto-scrolls — it stays a plain, manually
 * scrollable rail.
 */
export function AutoScroller({
  children,
  speed = 28,
  itemWidth = "78vw",
  gap = "14px",
  className,
  label = "Scrollable items",
  autoScroll = true,
}: AutoScrollerProps) {
  const reduce = useReducedMotion();
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [paused, setPaused] = React.useState(false);

  const items = React.Children.toArray(children);

  /*
   * Does one copy of the content actually overflow its container?
   *
   * This matters because the loop works by rendering the children TWICE and
   * rewinding by exactly one copy. When the content already fits — three short
   * chips on a wide phone, say — there is nothing to scroll, so the second
   * copy does not sit off-screen waiting its turn: it sits right there next to
   * the first, and every chip is visibly duplicated.
   *
   * So the second pass is only rendered once overflow is measured. Starting
   * false is also the correct server-render: one copy, no animation, no
   * duplicate content if JavaScript never arrives.
   */
  const [overflows, setOverflows] = React.useState(false);

  // The authoritative position is kept here as a float. Reading it back from
  // scrollLeft each frame does not work: the browser rounds the value, so a
  // sub-pixel per-frame delta is discarded and the rail never moves.
  const posRef = React.useRef(0);

  /*
   * Whether the rail is actually on screen.
   *
   * The animation loop used to run from mount until unmount, on every rail on
   * the page, whether or not any of them were in view — and every frame it
   * wrote scrollLeft, which is a layout write. On a page with three rails
   * that is three forced layouts per frame being spent on content nobody can
   * see. An observer costs nothing while the rail is away.
   */
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      // With the duplicate rendered, one copy is half the scroll width; without
      // it, the whole. Compare like with like, and keep a small tolerance so a
      // sub-pixel rounding difference cannot flip the state on every resize.
      const single = overflows ? el.scrollWidth / 2 : el.scrollWidth;
      const next = single > el.clientWidth + 4;
      setOverflows((prev) => (prev === next ? prev : next));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    // Fonts change chip widths, and chips are exactly what this is used for.
    document.fonts?.ready.then(schedule).catch(() => {});
    schedule();
    return () => {
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [overflows, items.length]);

  const [onScreen, setOnScreen] = React.useState(false);
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setOnScreen(!!entry?.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (reduce || paused || !autoScroll || !onScreen || !overflows) return;
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    let last = performance.now();
    posRef.current = el.scrollLeft;

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); // clamp after a tab switch
      last = now;

      // One copy of the content is exactly half the scrollable width.
      const half = el.scrollWidth / 2;
      if (half > 0) {
        posRef.current += speed * dt;
        // Rewind by one full copy so the join is invisible.
        if (posRef.current >= half) posRef.current -= half;
        el.scrollLeft = posRef.current;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    // A background tab still fires rAF in some browsers, and always resumes
    // with a long first delta. Dropping the loop while hidden avoids both.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce, paused, speed, autoScroll, onScreen, overflows]);

  // Resume shortly after the user stops interacting, so a swipe doesn't
  // immediately fight the animation.
  const resumeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hold = React.useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setPaused(true);
  }, []);
  const release = React.useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 900);
  }, []);

  React.useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  return (
    <div
      ref={scrollerRef}
      role="region"
      aria-label={label}
      tabIndex={0}
      onMouseEnter={hold}
      onMouseLeave={release}
      onPointerDown={hold}
      onPointerUp={release}
      onPointerCancel={release}
      onTouchStart={hold}
      onTouchEnd={release}
      onFocusCapture={hold}
      onBlurCapture={release}
      className={cn(
        /*
         * `w-full min-w-0` is load-bearing, not tidiness.
         *
         * Without it this scroller reports its full content width as its
         * preferred size, and an `auto` grid track or a `flex-col` parent
         * happily grows to match it. In the hero that took the copy column to
         * 643px on a 390px phone: the headline, both buttons and the practice
         * card were all dragged off the right edge, and `overflow-x: clip` on
         * <body> hid the damage from every scrollWidth check while leaving the
         * content genuinely unreachable.
         *
         * Pinning the width to the parent and allowing it to shrink below its
         * content is what makes a scroll container actually scroll instead of
         * expand.
         */
        "no-scrollbar flex w-full min-w-0 overflow-x-auto overscroll-x-contain",
        "[scroll-behavior:auto] [-webkit-overflow-scrolling:touch]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4",
        className,
      )}
      style={{ gap }}
    >
      {/* One pass, or two once the content is known to overflow. The second is
          the loop tail and is hidden from assistive tech so nothing is
          announced twice. */}
      {(overflows ? [0, 1] : [0]).map((pass) =>
        items.map((child, i) => (
          <div
            key={`${pass}-${i}`}
            className="shrink-0"
            style={{ width: itemWidth }}
            {...(pass === 1 ? { "aria-hidden": true } : {})}
          >
            {child}
          </div>
        )),
      )}
    </div>
  );
}

/**
 * Renders an auto-scrolling rail on small screens and its children untouched
 * (i.e. the normal grid) from `breakpoint` up.
 */
export function MobileRail({
  children,
  className,
  railClassName,
  itemWidth = "78vw",
  gap = "14px",
  speed = 28,
  label,
}: {
  children: React.ReactNode;
  /** Classes for the desktop grid wrapper. */
  className?: string | undefined;
  railClassName?: string | undefined;
  itemWidth?: string | undefined;
  gap?: string | undefined;
  speed?: number | undefined;
  label?: string | undefined;
}) {
  return (
    <>
      <div className="md:hidden -mx-5 px-5">
        <AutoScroller
          itemWidth={itemWidth}
          gap={gap}
          speed={speed}
          className={railClassName}
          {...(label ? { label } : {})}
        >
          {children}
        </AutoScroller>
      </div>
      <div className={cn("hidden md:grid", className)}>{children}</div>
    </>
  );
}

/**
 * A row of pills that becomes a slow marquee when it will not fit.
 *
 * Chips like "Evidence-conscious care / 1-on-1 online consultations /
 * Personalised food strategies" are short enough to sit on one line on a
 * laptop and far too long to on a phone, where `flex-wrap` turned them into a
 * three-row tower — roughly 130px of height spent on three words of
 * reassurance, pushing the hero's buttons off the first screen.
 *
 * One line that drifts costs a single row's height whatever the content, and
 * the movement is itself the signal that there is more to the right. Above the
 * phone breakpoint they simply wrap, because there they fit.
 *
 * The mask is not decoration: a marquee whose items are cut dead at the
 * container edge reads as clipped content. Fading the last few pixels reads as
 * content continuing past the edge, which is what is actually happening.
 *
 * ONE TRAP, worth knowing before you drop this into a layout.
 *
 * A scroll container's max-content size is still the full width of everything
 * inside it — `overflow: auto` lets it SCROLL, it does not make it narrow. So
 * any ancestor that sizes itself to fit-content rather than stretching will
 * grow to the full unwrapped width of these pills and take the rest of the
 * page off the edge of the screen with it.
 *
 * Two layouts do exactly that, and both were hit while this was being added:
 *   - a grid item with `mx-auto` (auto margins make `width: auto` fit-content)
 *   - a child of a `flex-col` container with `items-center` (centring on the
 *     cross axis sizes children to their content)
 *
 * The fix in both cases is to give that ancestor a definite width — `w-full`
 * — so its size stops depending on what is measured inside it. `min-w-0`
 * alone does not help: it governs the minimum, and this is the maximum.
 */
export function PillRail({
  children,
  label,
  className,
  speed = 20,
  gap = "10px",
}: {
  children: React.ReactNode;
  label: string;
  /** Classes for the wrapped row shown from `sm` up. */
  className?: string | undefined;
  speed?: number | undefined;
  gap?: string | undefined;
}) {
  const items = React.Children.toArray(children);

  return (
    <>
      <div
        className="w-full min-w-0 sm:hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
        }}
      >
        <AutoScroller itemWidth="auto" gap={gap} speed={speed} label={label}>
          {items}
        </AutoScroller>
      </div>

      <ul
        aria-label={label}
        className={cn("m-0 hidden list-none flex-wrap items-center p-0 sm:flex", className)}
        style={{ gap }}
      >
        {items.map((child, i) => (
          <li key={i}>{child}</li>
        ))}
      </ul>
    </>
  );
}
