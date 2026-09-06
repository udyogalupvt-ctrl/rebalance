import * as React from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  /** Decimal places to render. */
  decimals?: number;
  /** Thousands separator, e.g. "," — omitted by default. */
  separator?: string;
}

/**
 * Counts from 0 to `value` when scrolled into view.
 *
 * The previous implementation started a bare requestAnimationFrame loop with
 * no cancellation. Under React's development double-invoke two loops ran
 * against the same state, and whichever frame landed last won — which left
 * some counters stranded at 0 while others finished. This version keeps a
 * single cancellable frame, and always writes the exact target on the final
 * frame so the number can never end up short.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1.6,
  decimals = 0,
  separator = "",
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px 10% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;

    if (reduce || duration <= 0) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let startedAt: number | null = null;
    const ms = duration * 1000;

    const step = (now: number) => {
      if (startedAt === null) startedAt = now;
      const progress = Math.min((now - startedAt) / ms, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      if (progress >= 1) {
        setDisplay(value); // land exactly on the target
        return;
      }

      setDisplay(eased * value);
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, duration, reduce]);

  let shown = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();
  if (separator) {
    const [whole, frac] = shown.split(".");
    const grouped = (whole ?? "").replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    shown = frac ? `${grouped}.${frac}` : grouped;
  }

  return (
    <span ref={ref}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}

export default CountUp;
