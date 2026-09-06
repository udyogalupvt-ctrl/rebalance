import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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

/** A whisper of blur, resolving as the element settles. */
const BLUR_FROM = "blur(5px)";
const BLUR_TO = "blur(0px)";

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
  const observed = useInView(ref, { once: true, margin: "0px 0px 10% 0px" });
  const reduce = useReducedMotion();

  // Safety net. IntersectionObserver callbacks are coalesced, so a fast scroll
  // (a jump to an anchor, a restored scroll position, a flick on a phone) can
  // carry an element past the viewport without ever firing. Content must never
  // be left invisible, so we also reveal anything whose top has reached the
  // viewport, checked on scroll and once after mount.
  const [passed, setPassed] = React.useState(false);
  React.useEffect(() => {
    if (passed) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.1) setPassed(true);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [passed]);

  const isInView = observed || passed;

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
              initial={{ opacity: 0, y: DISTANCE, filter: BLUR_FROM }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, filter: BLUR_TO }
                  : { opacity: 0, y: DISTANCE, filter: BLUR_FROM }
              }
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
        initial={{ opacity: 0, y: DISTANCE, filter: BLUR_FROM }}
        animate={
          isInView
            ? { opacity: 1, y: 0, filter: BLUR_TO }
            : { opacity: 0, y: DISTANCE, filter: BLUR_FROM }
        }
        transition={{ duration: DURATION, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </Component>
  );
}
