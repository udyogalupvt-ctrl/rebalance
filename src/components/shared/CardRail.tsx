import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardRailProps {
  children: React.ReactNode;
  /** How many cards the rail holds — sizes the position dots. */
  count: number;
  /**
   * The list's layout from md upwards (e.g. "md:grid md:grid-cols-3 md:gap-6").
   * Below md the list is always a swipeable row, whatever these say.
   */
  className?: string;
  /** Rendered as an ordered list when the cards are a sequence. */
  ordered?: boolean;
  /** Names the rail for screen readers, e.g. "Areas of focus". */
  label?: string;
  /** Extra classes on the outer wrapper. */
  wrapperClassName?: string;
  /**
   * Advance the row on its own while it is on screen, looping back to the
   * first card at the end.
   *
   * Card by card, NOT a continuous drift. A marquee that never stops is right
   * for chips — three words the eye catches in passing — and wrong for cards
   * carrying a paragraph, because text that is always moving is text you have
   * to chase to read. Stepping and then resting gives every card a still
   * moment, keeps scroll-snap working, and keeps the position dots honest.
   *
   * Only for rows of content. Leave it off where the cards are choices with
   * their own buttons: moving a target out from under a thumb that is already
   * reaching for it is the most annoying thing an interface can do.
   */
  autoPlay?: boolean;
  /** Milliseconds each card holds before the row advances. */
  interval?: number;
}

/**
 * A list of cards that is a grid on a wide screen and a swipeable row on a
 * phone, with a row of position dots under it.
 *
 * The dots are not decoration. A horizontal row hides everything past the
 * second card, and the peeking edge says "there is more" without saying how
 * much; the dots say how many and where the reader is. They are buttons, so
 * the row can also be moved without swiping.
 *
 * Put a `<Reveal stagger childAs="li">` (or plain `<li>`s) inside it, exactly
 * as you would inside a `<ul>`.
 */
export function CardRail({
  children,
  count,
  className,
  ordered = false,
  label,
  wrapperClassName,
  autoPlay = false,
  interval = 4200,
}: CardRailProps) {
  const listRef = React.useRef<HTMLOListElement & HTMLUListElement>(null);
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [onScreen, setOnScreen] = React.useState(false);
  const reduce = useReducedMotion();
  const List = ordered ? "ol" : "ul";

  /** The cards themselves, in order, whether or not Reveal wraps them. */
  const items = React.useCallback((): HTMLElement[] => {
    const list = listRef.current;
    if (!list) return [];
    return Array.from(list.querySelectorAll<HTMLElement>(":scope > li, :scope > .contents > li"));
  }, []);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      // Only meaningful while the list is actually a row.
      if (list.scrollWidth <= list.clientWidth + 1) {
        setActive(0);
        return;
      }
      const cards = items();
      if (!cards.length) return;
      const edge = list.getBoundingClientRect().left;
      const gutter = parseFloat(getComputedStyle(list).scrollPaddingLeft) || 0;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.getBoundingClientRect().left - edge - gutter);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      // At the very end of the row the last card cannot reach the gutter, so
      // the nearest-card test would never select it.
      if (list.scrollLeft + list.clientWidth >= list.scrollWidth - 2) best = cards.length - 1;
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    list.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      list.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  /* Stable identity: the autoplay effect depends on this, and a function
     rebuilt on every render would tear down and restart the interval on every
     render — the rail would never actually reach the end of a beat. */
  const goTo = React.useCallback(
    (i: number) => {
      const list = listRef.current;
      const card = items()[i];
      if (!list || !card) return;
      const gutter = parseFloat(getComputedStyle(list).scrollPaddingLeft) || 0;
      const delta = card.getBoundingClientRect().left - list.getBoundingClientRect().left - gutter;
      list.scrollBy({ left: delta, behavior: "smooth" });
    },
    [items],
  );

  /*
   * Only run while the rail is actually on screen.
   *
   * Autoplay writes scrollLeft, which is a layout write, and a page can hold
   * several of these rows. Stepping rows nobody is looking at spends frames on
   * nothing and quietly moves content out from under a reader who scrolls back
   * up to it.
   */
  React.useEffect(() => {
    const el = listRef.current;
    if (!el || !autoPlay || typeof IntersectionObserver === "undefined") {
      setOnScreen(!!autoPlay);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setOnScreen(!!entry?.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [autoPlay]);

  React.useEffect(() => {
    if (!autoPlay || reduce || paused || !onScreen) return;
    const el = listRef.current;
    if (!el) return;

    const tick = () => {
      const list = listRef.current;
      if (!list) return;
      // Only meaningful while the list is a row. From md up it is a grid and
      // there is nothing to advance.
      if (list.scrollWidth <= list.clientWidth + 1) return;
      const cards = items();
      if (!cards.length) return;

      const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 2;
      if (atEnd) {
        // Back to the start, and deliberately not through goTo(0): a smooth
        // scroll across the whole row reads as a rewind rather than a jump,
        // which is what tells the reader the set has looped rather than that
        // they have lost their place.
        list.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      const next = Math.min(cards.length - 1, active + 1);
      goTo(next);
    };

    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [autoPlay, reduce, paused, onScreen, interval, active, items, goTo]);

  /*
   * Hold while the reader is touching, hovering or tabbing inside the row, and
   * wait a beat after they let go. Resuming the instant a thumb lifts feels
   * like the rail is fighting them for control.
   */
  const resumeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hold = React.useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setPaused(true);
  }, []);
  const release = React.useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 2600);
  }, []);
  React.useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    [],
  );

  // A tab in the background still fires timers; stepping a rail nobody can see
  // means returning to a row that has silently wandered.
  React.useEffect(() => {
    if (!autoPlay) return;
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [autoPlay]);

  const holdProps = autoPlay
    ? {
        onPointerDown: hold,
        onPointerUp: release,
        onPointerCancel: release,
        onMouseEnter: hold,
        onMouseLeave: release,
        onTouchStart: hold,
        onTouchEnd: release,
        onFocusCapture: hold,
        onBlurCapture: release,
      }
    : {};

  return (
    <div className={cn("relative", wrapperClassName)}>
      <List
        ref={listRef}
        aria-label={label}
        {...holdProps}
        className={cn("card-rail m-0 list-none p-0", className)}
      >
        {children}
      </List>

      {count > 1 && (
        <div className="-mt-2 flex items-center justify-center gap-1.5 md:hidden">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show card ${i + 1} of ${count}`}
              aria-current={i === active ? "true" : undefined}
              /* 44px tall, though the dot inside stays 6px. The visible mark
                 should be small; the thing a thumb has to hit should not. */
              className="group grid h-11 min-w-[26px] place-items-center"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "block h-[6px] rounded-full transition-[width,background-color] duration-300",
                  i === active ? "w-5 bg-primary" : "w-[6px] bg-[rgba(var(--primary-rgb),0.26)]",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
