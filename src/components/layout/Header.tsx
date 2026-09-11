import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, Sun, Moon, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useTheme } from "@/components/shared/ThemeProvider";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { DUR, EASE_SETTLE } from "@/lib/motion";
import { setScrollLocked } from "@/components/shared/SmoothScroll";
import { useScrolledPast } from "@/hooks/use-scrolled-past";

/**
 * The header's own copy of the navigation.
 *
 * Seven entries is too many for the bar at every width, so the desktop row
 * carries the five a visitor decides with and the rest live in the mobile
 * panel and the footer, which is where a longer list belongs.
 */
const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Treatments", href: "/treatments" },
  { name: "Gallery", href: "/gallery" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Contact", href: "/contact" },
];

/** The five the desktop bar shows. The mobile panel shows all of them. */
const DESKTOP_NAV = new Set(["Home", "About", "Programs", "Treatments", "Contact"]);

interface HeaderProps {
  /**
   * Whether this page opens with a dark hero behind the bar.
   *
   * Defaults to true because every marketing page does. Pages that start on
   * the light page background must pass false: the transparent-over-hero
   * styling puts --on-dark text on a scrim that assumes dark imagery beneath
   * it, and on a light page the logo measured 2.47:1 against 3.0 required.
   */
  overHero?: boolean;
}

export function Header({ overHero = true }: HeaderProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const reduce = useReducedMotion();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  /*
   * Nothing runs on scroll here. See use-scrolled-past: a sentinel parked 60px
   * down the document tells an IntersectionObserver when the bar should
   * collapse into its pill, so crossing that line costs two callbacks for the
   * whole visit rather than a layout read on every scrolled frame.
   */
  const isScrolled = useScrolledPast(60);

  // Lock the page behind the mobile menu.
  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // `overflow: hidden` alone does not stop Lenis — it drives the scroll
    // offset itself, so the page kept moving behind the open panel.
    setScrollLocked(true);
    // The floating WhatsApp / back-to-top buttons sit above the menu and
    // overlapped its contact details.
    document.body.dataset["menuOpen"] = "true";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      setScrollLocked(false);
      delete document.body.dataset["menuOpen"];
      window.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // "/" must match exactly; every other route also matches its sub-paths.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  // Over the hero the bar is transparent and the content is on-dark. Once the
  // pill has a --surface fill, content switches to the normal text colours.
  //
  // The open mobile menu is a dark panel, so the bar has to use the on-dark
  // treatment there too regardless of scroll -- otherwise the logo and the
  // close button disappear into it.
  const onDark = isMenuOpen || (overHero && !isScrolled);

  return (
    <header className="fixed top-0 left-0 z-50 w-full pointer-events-none">
      {/* Scrim: keeps the nav legible over light hero imagery. Fades out once
          the pill has its own background. */}
      <div
        aria-hidden="true"
        data-visible={onDark ? "true" : "false"}
        className="header-scrim absolute inset-x-0 top-0 h-[168px] pointer-events-none"
      />

      <div className="relative flex justify-center">
        {/*
         * The pill's whole geometry lives in .header-bar in styles.css.
         *
         * It was a framer-motion spring over width, padding, margin and
         * border-radius. Every one of those is a layout property, so each
         * frame of the spring forced a re-layout on the main thread — and it
         * was driven by React state that changes during a scroll, which is
         * precisely when there is no budget for it. The same movement as a
         * CSS transition costs no JavaScript at all, and the gutters can then
         * track .container-x through media queries so the lockup lines up
         * with the content below it.
         */}
        <div
          data-scrolled={isScrolled ? "true" : "false"}
          data-menu-open={isMenuOpen ? "true" : "false"}
          className="header-bar pointer-events-auto flex items-center justify-between"
        >
          <Link to="/" aria-label="GoRebalance — home" className="shrink-0">
            <Logo tone={onDark ? "light" : "dark"} size={44} shrinkOnNarrow />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
            {navLinks
              .filter((link) => DESKTOP_NAV.has(link.name))
              .map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative group whitespace-nowrap font-jakarta text-[14.5px] transition-colors py-2 xl:text-[15px]",
                      active ? "font-semibold" : "font-medium",
                      onDark
                        ? active
                          ? "text-on-dark"
                          : "text-on-dark-muted hover:text-on-dark"
                        : active
                          ? "text-primary-contrast"
                          : "text-text-muted hover:text-text",
                    )}
                  >
                    {link.name}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-[2px] rounded-full transition-all duration-300",
                        active ? "w-full" : "w-0 group-hover:w-full",
                        onDark ? "bg-on-dark-accent" : "bg-accent",
                      )}
                    />
                  </Link>
                );
              })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className={cn(
                "grid place-items-center w-11 h-11 rounded-full transition-colors",
                onDark ? "hover:bg-white/12" : "hover:bg-primary-soft",
              )}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="relative block w-5 h-5">
                <motion.span
                  className="absolute inset-0 grid place-items-center"
                  animate={{
                    rotate: theme === "dark" ? 0 : 90,
                    opacity: theme === "dark" ? 1 : 0,
                    scale: theme === "dark" ? 1 : 0.4,
                  }}
                  transition={{ duration: reduce ? 0 : 0.35 }}
                >
                  <Moon className={cn("w-5 h-5", onDark ? "text-on-dark" : "text-text")} />
                </motion.span>
                <motion.span
                  className="absolute inset-0 grid place-items-center"
                  animate={{
                    rotate: theme === "dark" ? -90 : 0,
                    opacity: theme === "dark" ? 0 : 1,
                    scale: theme === "dark" ? 0.4 : 1,
                  }}
                  transition={{ duration: reduce ? 0 : 0.35 }}
                >
                  <Sun className={cn("w-5 h-5", onDark ? "text-on-dark" : "text-text")} />
                </motion.span>
              </span>
            </button>

            <Link
              to="/assessment"
              className="hidden sm:inline-flex shrink-0 items-center gap-2 h-11 whitespace-nowrap rounded-pill bg-accent-strong px-5 font-jakarta text-[14px] font-semibold text-on-accent press group xl:px-6"
            >
              Start Your Assessment
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className={cn(
                "lg:hidden grid place-items-center w-11 h-11 rounded-full transition-colors",
                onDark ? "hover:bg-white/12" : "hover:bg-primary-soft",
              )}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-on-dark" />
              ) : (
                <Menu className={cn("w-6 h-6", onDark ? "text-on-dark" : "text-text")} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu.
          Rendered BEFORE the bar in paint order via a negative-priority
          stacking context so the logo and close button stay visible and
          clickable on top of it. */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="fixed inset-0 -z-10 lg:hidden bg-[var(--dark-surface)] flex flex-col overflow-y-auto pointer-events-auto"
            style={{ paddingTop: "calc(var(--header-h) + 40px)" }}
          >
            {/* Brand light, so the panel has depth rather than being a flat
                fill — the same wash used behind the marketing sections. */}
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              aria-hidden="true"
            >
              <div className="orb orb--strong absolute -left-1/3 -top-1/4 h-[560px] w-[560px]" />
              <div className="orb orb--accent absolute -right-1/4 top-1/3 h-[420px] w-[420px]" />
              {/* The mark itself, held large and faint at the foot of the
                  panel. It is the brand, so it earns the space. */}
              <img
                src="/brand-mark-light.png"
                alt=""
                className="absolute -bottom-16 -right-12 w-[300px] opacity-[0.06]"
              />
            </div>

            <nav className="relative z-10 flex flex-col px-7" aria-label="Main">
              {navLinks.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduce ? 0 : 0.06 + i * 0.055,
                      duration: reduce ? 0 : DUR.md,
                      ease: EASE_SETTLE,
                    }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-baseline gap-4 border-b border-on-dark-border/40 py-4",
                        "transition-colors duration-300",
                      )}
                    >
                      {/* An index, so the list reads as a considered set
                          rather than an undifferentiated stack of words. */}
                      <span
                        className={cn(
                          "font-jakarta text-[12px] font-semibold tabular-nums tracking-[0.14em] transition-colors",
                          active ? "text-on-dark-accent" : "text-on-dark-faint",
                        )}
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-fraunces text-[clamp(1.75rem,8vw,2.25rem)] font-medium leading-tight transition-transform duration-300 group-hover:translate-x-1",
                          active ? "text-on-dark" : "text-on-dark-muted",
                        )}
                      >
                        {link.name}
                      </span>
                      {active && (
                        <span
                          className="ml-auto h-1.5 w-1.5 shrink-0 self-center rounded-full bg-accent"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduce ? 0 : 0.06 + navLinks.length * 0.055,
                duration: reduce ? 0 : DUR.md,
                ease: EASE_SETTLE,
              }}
              className="relative z-10 mt-auto flex flex-col gap-7 px-7 pb-12 pt-10"
            >
              <Link
                to="/assessment"
                onClick={() => setIsMenuOpen(false)}
                className="press flex h-14 w-full items-center justify-center gap-2 rounded-pill bg-accent-strong font-jakarta text-[16px] font-semibold text-on-accent"
              >
                Start Your Assessment
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="flex flex-col gap-1">
                <p className="fs-eyebrow text-on-dark-faint">Questions? Call us</p>
                <a
                  href="tel:+919390414536"
                  className="font-fraunces text-2xl text-on-dark transition-colors hover:text-on-dark-accent"
                >
                  +91 93904 14536
                </a>
                <p className="fs-micro text-on-dark-faint">Kakinada, Andhra Pradesh</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
