import * as React from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Drives a hero's photographic carousel.
 *
 * The frames and the dots that step through them live at opposite ends of the
 * layout — the images are the section's ground, the dots sit inside the copy
 * column — so the index they share is held here rather than inside either of
 * them.
 */
export function useBackdropCarousel(count: number, intervalMs = 6000) {
  const reduce = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  // Bumped when somebody picks a frame, so the dwell restarts from their
  // choice instead of moving on a moment later.
  const [restart, setRestart] = React.useState(0);

  React.useEffect(() => {
    // Under reduced motion the first frame simply stays.
    if (reduce || count < 2) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      timer ??= setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    // A hidden tab should not be cycling photographs nobody is looking at.
    const onVisibility = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce, count, intervalMs, restart]);

  const select = React.useCallback((i: number) => {
    setIndex(i);
    setRestart((n) => n + 1);
  }, []);

  return { index, select };
}
