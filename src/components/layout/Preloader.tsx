import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

const WORDMARK = "GoRebalance";
const TAGLINE = "Gut Health · Nutrition · Balance";
const SESSION_KEY = "gr_preloaded";

/** Total on-screen budget, including the exit. */
const HOLD_MS = 1500;
const EXIT_S = 0.7;

export function Preloader() {
  const reduce = useReducedMotion();
  // First load only. Checked lazily so we never flash on a repeat visit.
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) !== "1";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!isVisible) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* private mode — show it, just don't remember */
    }
    const t = setTimeout(() => setIsVisible(false), reduce ? 300 : HOLD_MS);
    return () => clearTimeout(t);
  }, [isVisible, reduce]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{
            clipPath: "inset(0% 0% 100% 0% round 0% 0% 42% 42%)",
            transition: { duration: reduce ? 0.01 : EXIT_S, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg"
        >
          <div className="flex flex-col items-center px-6 text-center">
            {/* Mark only — the wordmark below is the single instance of the
                brand name. Previously <Logo> rendered it too, so it appeared
                twice. */}
            <Logo hideText animate className="mb-6 scale-125 text-primary" />

            <div className="flex overflow-hidden" aria-label={WORDMARK}>
              {WORDMARK.split("").map((char, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  initial={reduce ? false : { y: 36, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.028, ease: "easeOut" }}
                  className="font-fraunces text-3xl font-semibold text-text"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <motion.span
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-2 fs-eyebrow text-text-muted"
            >
              {TAGLINE}
            </motion.span>
          </div>

          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-border">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: (reduce ? 300 : HOLD_MS) / 1000, ease: "linear" }}
              className="h-full bg-accent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
