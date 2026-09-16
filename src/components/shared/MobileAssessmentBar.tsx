import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/FloatingElements";
import { useScrolledPast } from "@/hooks/use-scrolled-past";
import { brand, briefBrand } from "@/data/content";

/**
 * The assessment, kept within reach on a phone.
 *
 * The header's Book Consultation button is `hidden sm:inline-flex`, so
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

  /*
   * Out of the way once the page's own closing call to action — or the
   * footer, which carries the same button — is on screen. Two identical
   * buttons stacked a few centimetres apart is clutter, and on an iPhone the
   * bottom edge is already busy with Safari's own toolbar.
   */
  const [endInView, setEndInView] = React.useState(false);
  React.useEffect(() => {
    const targets = [document.getElementById("start"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => !!el,
    );
    if (!targets.length || typeof IntersectionObserver === "undefined") return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setEndInView(visible.size > 0);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const suppressed =
    pathname.startsWith("/assessment") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/track");

  const show = pastHero && !menuOpen && !suppressed && !endInView;

  /*
   * While the bar is up it carries WhatsApp itself, so the floating WhatsApp
   * and back-to-top buttons step aside (see styles.css). Otherwise the bottom
   * right of a phone held three stacked controls over whatever card was
   * underneath them.
   */
  React.useEffect(() => {
    if (show) document.body.dataset["bookingBar"] = "true";
    else delete document.body.dataset["bookingBar"];
    return () => {
      delete document.body.dataset["bookingBar"];
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduce ? false : { y: "120%" }}
          animate={{ y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "120%" }}
          transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          /* A solid surface, not a frosted one. A backdrop-filter on a fixed
             bar makes iOS Safari re-sample everything scrolling under it on
             every frame — while its own toolbar is animating at the same edge
             — which is the heaviest thing a page can ask of it. The bottom
             padding clears the home indicator. */
          className="fixed inset-x-0 bottom-0 z-[55] border-t border-border bg-surface px-4 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-2.5 shadow-[0_-8px_24px_rgba(var(--shadow-rgb),0.08)] sm:hidden"
        >
          <div className="flex items-center gap-2.5">
            <a
              href={brand.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message Go Rebalance on WhatsApp"
              className="press grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--whatsapp)] text-[var(--on-whatsapp)]"
            >
              <WhatsAppIcon className="h-[22px] w-[22px]" />
            </a>

            <Link
              to="/assessment"
              className="press inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-pill bg-accent-strong px-5 font-jakarta text-[15px] font-semibold text-on-accent shadow-[0_8px_20px_rgba(var(--accent-rgb),0.24)]"
            >
              {briefBrand.primaryCta}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
