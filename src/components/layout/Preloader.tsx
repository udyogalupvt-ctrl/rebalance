import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

const WORDMARK = "GoRebalance";
const TAGLINE = "Gut Health · Nutrition · Balance";
const SESSION_KEY = "gr_preloaded";

/*
 * Timing.
 *
 * This used to be a flat 1,500ms hold plus a 700ms exit — 2.2 seconds of
 * curtain on every first visit, whether or not the page behind it was ready.
 * After the code-splitting work the home page paints in well under 200ms, so
 * that curtain had become the single slowest thing about the site: the
 * practice asked for it to load faster, and this was most of the wait.
 *
 * It is now bounded rather than fixed. MIN_MS is long enough for the mark and
 * wordmark to actually be read; beyond that the curtain lifts as soon as the
 * page reports itself loaded. MAX_MS is the backstop for a slow connection,
 * so a visitor is never held behind it waiting for a straggling image.
 */
const MIN_MS = 600;
const MAX_MS = 1100;
const EXIT_S = 0.55;

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
    if (reduce) {
      const t = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(t);
    }

    const startedAt = Date.now();
    let minTimer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const dismiss = () => {
      if (cancelled) return;
      const elapsed = Date.now() - startedAt;
      minTimer = setTimeout(() => setIsVisible(false), Math.max(0, MIN_MS - elapsed));
    };

    /*
     * The signal is FONTS, not `window.load`.
     *
     * `load` waits for every image on the page, including the lazy ones far
     * below the fold, so keying on it held the curtain for the full backstop
     * on a page that had actually been ready for a second. Fonts are the
     * right signal: the headline is set in Fraunces, and lifting the curtain
     * before it arrives means the first thing a visitor sees is the fallback
     * face, then a reflow.
     */
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) void fonts.ready.then(dismiss);
    else dismiss();

    const backstop = setTimeout(() => setIsVisible(false), MAX_MS);

    return () => {
      cancelled = true;
      clearTimeout(minTimer);
      clearTimeout(backstop);
    };
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
            <Logo hideText size={72} className="mb-6" />

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
              /* The bar fills across the backstop window. It is a progress
                 hint, not a promise — the curtain usually lifts before it
                 reaches the end, which is the right way round. */
              transition={{ duration: (reduce ? 200 : MAX_MS) / 1000, ease: "linear" }}
              className="h-full bg-accent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
