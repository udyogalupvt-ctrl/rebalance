import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_SETTLE, DUR, RISE } from "@/lib/motion";

/*
 * Motion comes from the shared system, not from numbers invented here.
 *
 * The old values (a generic 0.22/1/0.36/1 over 0.55s) were the same ones used
 * in a dozen other places with a dozen other durations, which is why nothing
 * on the site felt like it shared an author. EASE_SETTLE is the signature:
 * decelerate hard, then rest -- weight coming to balance.
 */
const EASE = EASE_SETTLE;
const DURATION = DUR.lg;
const DISTANCE = RISE;

/*
 * There is no blur in the entrance, and that is a performance decision.
 *
 * The reveal used to animate `filter: blur(5px)` to `blur(0px)`. Two costs
 * came with it. During the animation a filter forces a main-thread repaint of
 * the whole element every frame, and a section that reveals six cards at once
 * does that six times per frame -- while the page is scrolling. Afterwards
 * the element keeps `filter: blur(0px)`, which is not a no-op: it holds a
 * filter pass open forever. Fifty-four elements on the home page were doing
 * exactly that, measured in the browser.
 *
 * Opacity and transform are the two properties the compositor can animate on
 * its own, so the entrance now costs the main thread nothing at all.
 */

/**
 * How far outside the viewport an element starts revealing.
 *
 * A positive bottom margin grows the observer's root downwards, so content
 * begins its entrance just before it is scrolled into view and has settled by
 * the time it is properly on screen.
 */
const REVEAL_MARGIN = "0px 0px 10% 0px";

/*
 * ONE observer for the whole document, not one per element.
 *
 * Every section on the site reveals through this component, which put 43
 * separate `window` scroll listeners on the home page -- each one calling
 * getBoundingClientRect() inside its own rAF, so a single scroll frame paid
 * for 43 layout reads. It was the largest scripting cost in a scroll profile.
 *
 * A shared IntersectionObserver does the same job off the main thread and
 * reads no layout at all: the browser hands us the element's box in the
 * entry.
 */
type RevealCallback = () => void;

const pending = new Map<Element, RevealCallback>();
let observer: IntersectionObserver | null = null;

/** Fire and retire one element. */
function settle(el: Element) {
  const cb = pending.get(el);
  if (!cb) return;
  pending.delete(el);
  observer?.unobserve(el);
  cb();
}

/**
 * True when the element is at or above the fold — either intersecting now, or
 * already scrolled past.
 *
 * The second case is the one an observer alone misses. A restored scroll
 * position, a jump to an anchor or a hard flick can carry an element from
 * below the viewport to above it without it ever being seen as intersecting,
 * and content must never be left invisible. `boundingClientRect` comes from
 * the entry, so this test costs no layout.
 */
function hasArrived(entry: IntersectionObserverEntry): boolean {
  if (entry.isIntersecting) return true;
  const foldBottom = entry.rootBounds?.bottom ?? window.innerHeight;
  return entry.boundingClientRect.top < foldBottom;
}

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (hasArrived(entry)) settle(entry.target);
      }
    },
    { rootMargin: REVEAL_MARGIN },
  );
  return observer;
}

/*
 * The safety net, kept but made cheap.
 *
 * An observer only delivers an entry when an element's intersection state
 * CHANGES. Something that is below the fold on one frame and above it on the
 * next may never produce one. So a single shared listener sweeps whatever is
 * still pending — one listener for the page rather than one per element, and
 * throttled to 250ms rather than run every frame, because the observer is
 * already handling every ordinary case and this only has to catch the rare
 * one before anybody notices.
 */
const SWEEP_MS = 250;
let sweepTimer: ReturnType<typeof setTimeout> | null = null;
let sweepBound = false;

function sweep() {
  sweepTimer = null;
  if (!pending.size) return;
  const fold = window.innerHeight * 1.1;
  // Read every box first, then act. Interleaving reads and writes here would
  // be the layout thrash this rewrite exists to remove.
  const arrived: Element[] = [];
  pending.forEach((_cb, el) => {
    if (el.getBoundingClientRect().top < fold) arrived.push(el);
  });
  arrived.forEach(settle);
}

function requestSweep() {
  if (sweepTimer || !pending.size) return;
  sweepTimer = setTimeout(sweep, SWEEP_MS);
}

function bindSweep() {
  if (sweepBound || typeof window === "undefined") return;
  sweepBound = true;
  window.addEventListener("scroll", requestSweep, { passive: true });
  window.addEventListener("resize", requestSweep, { passive: true });
}

/** Reveal `el` once it reaches the fold. Returns an unsubscribe function. */
function watch(el: Element, cb: RevealCallback): () => void {
  pending.set(el, cb);
  const io = getObserver();
  if (io) io.observe(el);
  bindSweep();
  // Catch anything already on screen at mount without waiting for a scroll.
  requestSweep();
  return () => {
    pending.delete(el);
    io?.unobserve(el);
  };
}

/** Subscribes one element to the shared reveal machinery. */
function useReveal(ref: React.RefObject<HTMLElement | null>): boolean {
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;
    return watch(el, () => setShown(true));
  }, [ref, shown]);

  return shown;
}

interface RevealProps {
  children: React.ReactNode;
  /** Delay before this element animates, in seconds. */
  delay?: number;
  /** Element rendered as the wrapper. */
  as?: React.ElementType;
  /**
   * When set, each direct child animates in sequence this many seconds apart.
   * Children keep their own grid/flex participation — the wrapper is display:
   * contents, the animated boxes are the children themselves.
   */
  stagger?: number;
  className?: string;
  /**
   * Element used for each animated child in stagger mode. Set to "li" when the
   * wrapper sits inside a <ul>/<ol> so the markup stays valid.
   */
  childAs?: "div" | "li";
  /** Extra classes applied to each animated child box in stagger mode. */
  childClassName?: string;
}

/**
 * The single scroll-reveal primitive. Every section uses this so entrances are
 * identical site-wide.
 *
 * Note: an element with `display: contents` generates no box, so opacity and
 * transform are ignored on it. The animated element must therefore always be a
 * real box. In stagger mode we animate the children directly and let the
 * wrapper be the contents-only element, so grid/flex layout is preserved.
 */
export function Reveal({
  children,
  delay = 0,
  as: Component = "div",
  stagger,
  className,
  childAs = "div",
  childClassName,
}: RevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useReveal(ref);
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Component ref={ref} className={className}>
        {children}
      </Component>
    );
  }

  if (stagger !== undefined) {
    const Item = childAs === "li" ? motion.li : motion.div;
    return (
      // NOTE: this wrapper is `display: contents` so the children remain direct
      // grid/flex items. A contents box is not observable, so the in-view ref
      // goes on the first animated child, not here.
      <Component className={cn("contents", className)}>
        {React.Children.map(children, (child, i) => {
          if (!React.isValidElement(child)) return child;
          return (
            <Item
              key={child.key ?? i}
              {...(i === 0 ? { ref: ref as never } : {})}
              // The animated box IS the grid/flex item, so it stretches to the
              // row height. It is itself a grid so its single child stretches
              // to fill it — without this, content that sizes to itself (a
              // <button>, an inline <a>) collapses to its text width now that
              // it is no longer the grid item directly.
              className={cn("grid h-full min-w-0", childClassName)}
              initial={{ opacity: 0, y: DISTANCE }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: DISTANCE }}
              transition={{
                duration: DURATION,
                delay: delay + i * stagger,
                ease: EASE,
              }}
            >
              {child}
            </Item>
          );
        })}
      </Component>
    );
  }

  return (
    <Component ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: DISTANCE }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: DISTANCE }}
        transition={{ duration: DURATION, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </Component>
  );
}
