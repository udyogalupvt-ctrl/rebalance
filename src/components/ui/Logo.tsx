import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
  /** Render the mark only, without the wordmark. */
  hideText?: boolean;
  /** Draw the mark on mount. Used by the preloader; off everywhere else. */
  animate?: boolean;
}

/**
 * Brand lockup. Both the mark and the wordmark inherit `currentColor`, so the
 * caller controls the colour with a single text-* class. (The wordmark used to
 * hardcode text-text, which made it invisible on the dark footer.)
 */
export function Logo({ className, style, hideText, animate = false }: LogoProps) {
  const reduce = useReducedMotion();
  const shouldDraw = animate && !reduce;

  return (
    <div className={cn("flex items-center gap-3 text-text", className)} style={style}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <motion.path
          d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 15 32 10 28 8C26 7 24 7 22 8L20 10C18 12 18 15 20 17C22 19 25 19 27 17C29 15 30 12 28 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={shouldDraw ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
        <motion.path
          d="M20 5C22 3 25 3 27 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={shouldDraw ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.85 }}
        />
      </svg>
      {!hideText && (
        <span className="font-fraunces text-2xl font-semibold tracking-tight">GoRebalance</span>
      )}
    </div>
  );
}
