import * as React from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_SETTLE, DUR } from "@/lib/motion";
import { useRange } from "./range";

/*
 * The quieter half of the scroll system.
 *
 * Everything here is a small, self-contained effect that attaches to content
 * already in ordinary page flow — no pinning, no layout of its own. These are
 * what the calm sections get, and they are the reason the loud sections read
 * as loud: a page where every section is a set-piece has no set-pieces.
 *
 * All of them degrade to nothing under `prefers-reduced-motion`. Not to a
 * shorter version — to the plain content, rendered exactly where it belongs.
 */

/* ========================================================================== */
/*  PARALLAX                                                                  */
/* ========================================================================== */

/**
 * Moves an element against the page as it passes through the viewport.
 *
 * `distance` is the total travel in px, split either side of centre, and it is
 * deliberately small. Large parallax reads as the layout being broken — the
 * element visibly drifts away from the text it belongs with — and on a phone,
 * where the viewport is short, the same offset is a far larger share of the
 * screen. Twenty to forty pixels is the range that registers as depth rather
 * than as movement.
 */
export function Parallax({
  children,
  distance = 32,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useRange(scrollYProgress, [0, 1], [distance / 2, -distance / 2]);
  const y = useSpring(raw, { stiffness: 260, damping: 42, mass: 0.5 });

  // Ref stays attached under reduced motion: useScroll warns for the life of
  // the page if the target it was handed never mounts.
  if (reduce)
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/* ========================================================================== */
/*  MASK REVEAL                                                               */
/* ========================================================================== */

/**
 * Wipes an image into view behind a moving edge.
 *
 * A one-shot, not a scroll-linked effect: a photograph that keeps re-wiping
 * every time it crosses the fold is a distraction, and the point here is the
 * single moment of arrival. `clip-path` is composited, so the wipe costs no
 * more than a fade.
 *
 * The inner scale is what stops it reading as a blind coming down: the image
 * settles from 1.06 to 1 over the same beat, so the frame reveals a picture
 * that is itself coming to rest.
 */
export function MaskReveal({
  children,
  className,
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const hidden =
    direction === "up" ? "inset(100% 0% 0% 0% round 26px)" : "inset(0% 100% 0% 0% round 26px)";

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: hidden }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 26px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: DUR.xl, delay, ease: EASE_SETTLE }}
    >
      <motion.div
        initial={{ scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ duration: 1.4, delay, ease: EASE_SETTLE }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ========================================================================== */
/*  WORD REVEAL                                                               */
/* ========================================================================== */

/**
 * Brings a sentence up word by word as it is scrolled through.
 *
 * Reserved for the one line in a section that carries its argument — used on
 * more than that it becomes a tic, and a reader who has to scroll to finish
 * reading a sentence will not thank you twice on one page.
 *
 * Two deliberate limits. Words never go below 22% opacity, so the sentence is
 * legible the instant it appears rather than being withheld until the reader
 * has scrolled it out — motion must not gate access to information. And the
 * whole line finishes by 80% of its travel, so it is fully readable well
 * before it leaves.
 */
export function WordReveal({
  text,
  className,
  as: Component = "p",
}: {
  text: string;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = React.useMemo(() => text.split(" "), [text]);

  // As above: the scroll target must exist even when nothing is animated.
  if (reduce)
    return (
      <Component ref={ref} className={className}>
        {text}
      </Component>
    );

  return (
    <Component ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={`${word}-${i}`} progress={scrollYProgress} index={i} total={words.length}>
          {word}
        </Word>
      ))}
    </Component>
  );
}

function Word({
  children,
  progress,
  index,
  total,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  // Each word owns a slice of the first 80% of travel, and the slices overlap
  // by design — a strict hand-off makes the line read one word at a time, like
  // a teleprompter, instead of as a sentence gathering itself.
  const span = 0.8 / total;
  const start = index * span;
  const end = start + span * 2.2;

  const opacity = useRange(progress, [start, end], [0.22, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
      {/* A real space, not a margin: a margin would not collapse at a line
          break and would leave the last word of every line hanging. */}
      &nbsp;
    </motion.span>
  );
}

/* ========================================================================== */
/*  MAGNETIC                                                                  */
/* ========================================================================== */

/**
 * A control that leans towards the cursor.
 *
 * Desktop only, and gated on a fine pointer rather than on width — a touch
 * device has no hover to lean towards, and a laptop with a touchscreen has
 * both. The pull is a few pixels: enough that the button feels alive under the
 * hand, small enough that the target never moves out from under the click.
 */
export function Magnetic({
  children,
  className,
  strength = 6,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = React.useState(false);

  /*
   * Read the pointer capability after mount, not during render.
   *
   * matchMedia during render is a server/client mismatch waiting to happen —
   * this app renders on the server, where there is no window at all — and it
   * would also make the very first paint disagree with the second.
   */
  React.useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [reduce]);

  const x = useSpring(0, { stiffness: 260, damping: 22, mass: 0.4 });
  const y = useSpring(0, { stiffness: 260, damping: 22, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * strength);
    y.set(Math.max(-1, Math.min(1, dy)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (!enabled) return <div className={cn("inline-block", className)}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
