import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useScrolledPast } from "@/hooks/use-scrolled-past";
import { briefBrand } from "@/data/content";

/**
 * The assessment, kept within reach on a phone.
 *
 * The header's Start Your Assessment button is `hidden sm:inline-flex`, so
 * below 640px the site's single most important action was not in the chrome
 * at all — it existed only where a section happened to place it, and a visitor
 * halfway down the page had nothing to press without scrolling to find one.
 * On the page that matters most, on the devices most people use, the primary
 * call to action was effectively missing.
 *
 * So this is a compact bar that appears once the hero is behind you and stays
 * until you reach the page's own closing call to action. It is deliberately
 * one line: a phone has very little vertical room and a banner that eats a
 * fifth of it to advertise a button is worse than no banner.
 *
 * It hides in three places where it would be wrong: on the assessment itself,
 * behind the open mobile menu, and on the admin console.
 */
export function MobileAssessmentBar() {
  const reduce = useReducedMotion();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // Far enough that the hero's own button has left the screen.
  const pastHero = useScrolledPast(620);

  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    // The header sets this on <body> while the panel is open.
    const read = () => setMenuOpen(document.body.dataset["menuOpen"] === "true");
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-menu-open"] });
    return () => observer.disconnect();
  }, []);

  const suppressed =
    pathname.startsWith("/assessment") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/track");

  const show = pastHero && !menuOpen && !suppressed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduce ? false : { y: "120%" }}
          animate={{ y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "120%" }}
          transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          /* Clear of the floating buttons on the right, and of the phone's
             own home indicator underneath. */
          className="fixed inset-x-0 bottom-0 z-[55] border-t border-border bg-[rgba(var(--surface-rgb),0.92)] px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 backdrop-blur-xl sm:hidden"
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-jakarta text-[13px] font-semibold leading-tight text-text">
                Not sure which program fits?
              </p>
              <p className="truncate font-jakarta text-[12px] leading-tight text-text-muted">
                Start with the assessment. It takes a few minutes.
              </p>
            </div>

            <Link
              to="/assessment"
              className="press inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-pill bg-accent-strong px-5 font-jakarta text-[13.5px] font-semibold text-on-accent"
            >
              {/* "Start" on its own here. The full label wraps at 320px and
                  pushes the copy beside it into two truncated lines. */}
              Start
              <ArrowRight className="h-[15px] w-[15px]" aria-hidden="true" />
              <span className="sr-only">{briefBrand.primaryCta}</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
