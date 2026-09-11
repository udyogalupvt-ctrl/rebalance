import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AutoScrollerProps {
  children: React.ReactNode;
  /** Pixels per second. Lower is calmer. */
  speed?: number | undefined;
  /** Width of each item in the scrolling track. */
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
    if (reduce || paused || !autoScroll || !onScreen) return;
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
  }, [reduce, paused, speed, autoScroll, onScreen]);

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
        "no-scrollbar flex overflow-x-auto overscroll-x-contain",
        "[scroll-behavior:auto] [-webkit-overflow-scrolling:touch]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4",
        className,
      )}
      style={{ gap }}
    >
      {/* Two passes of the same content: the second is the loop tail and is
          hidden from assistive tech so nothing is announced twice. */}
      {[0, 1].map((pass) =>
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
