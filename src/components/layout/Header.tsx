import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useReducedMotion } from "framer-motion";
import { Menu, X, Sun, Moon, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useTheme } from "@/components/shared/ThemeProvider";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { DUR, EASE_SETTLE } from "@/lib/motion";
import { setScrollLocked } from "@/components/shared/SmoothScroll";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Treatments", href: "/treatments" },
  { name: "Gallery", href: "/gallery" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Contact", href: "/contact" },
];

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const unsub = scrollY.on("change", (latest) => setIsScrolled(latest > 60));
    setIsScrolled(scrollY.get() > 60);
    return unsub;
  }, [scrollY]);

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

  const spring = reduce
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 260, damping: 30, mass: 0.9 } as const);

  return (
    <header className="fixed top-0 left-0 z-50 w-full pointer-events-none">
      {/* Scrim: keeps the nav legible over light hero imagery. Fades out once
          the pill has its own background. */}
      <motion.div
        aria-hidden="true"
        className="header-scrim absolute inset-x-0 top-0 h-[168px] pointer-events-none"
        animate={{ opacity: onDark ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
      />

      <div className="relative flex justify-center">
        <motion.div
          animate={{
            width: isScrolled ? "min(1180px, calc(100% - 32px))" : "100%",
            paddingTop: isScrolled ? 12 : 26,
            paddingBottom: isScrolled ? 12 : 26,
            paddingLeft: isScrolled ? 22 : 40,
            paddingRight: isScrolled ? 22 : 40,
            marginTop: isScrolled ? 16 : 0,
            borderRadius: isScrolled ? 999 : 0,
          }}
          transition={spring}
          style={{ borderWidth: 1, borderStyle: "solid", maxWidth: "100%" }}
          /*
           * Geometry is animated by the spring above; COLOUR is animated by
           * CSS below.
           *
           * They used to share the spring, with values like
           * `rgba(var(--surface-rgb), 0)`. Motion cannot interpolate a colour
           * expressed through a CSS variable — it logged
           * "is not an animatable color" on every page load and simply
           * snapped between the two states, so the bar's fill appeared
           * instantly while its shape was still easing. A plain CSS
           * transition handles var() fine, and runs off the main thread.
           */
          className={cn(
            "pointer-events-auto flex items-center justify-between",
            "[transition:background-color_var(--dur-3)_var(--ease-glide),border-color_var(--dur-3)_var(--ease-glide),box-shadow_var(--dur-3)_var(--ease-glide)]",
            isScrolled && !isMenuOpen
              ? "border-[var(--border)] bg-[rgba(var(--surface-rgb),0.72)] shadow-[0_8px_32px_rgba(var(--text-rgb),0.10),0_2px_8px_rgba(var(--text-rgb),0.05)] backdrop-blur-[20px]"
              : "border-transparent bg-transparent shadow-none",
          )}
        >
          <Link to="/" aria-label="GoRebalance — home" className="shrink-0">
            <Logo tone={onDark ? "light" : "dark"} size={44} shrinkOnNarrow />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative group font-jakarta text-[15px] transition-colors py-2",
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
              className="hidden sm:inline-flex items-center gap-2 h-11 px-6 bg-accent-strong text-on-accent rounded-pill font-jakarta text-[14px] font-semibold press group"
            >
              Start My Assessment
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
        </motion.div>
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
              <div className="absolute -left-1/3 -top-1/4 h-[560px] w-[560px] rounded-full bg-primary/20 blur-[120px]" />
              <div className="absolute -right-1/4 top-1/3 h-[420px] w-[420px] rounded-full bg-accent/12 blur-[110px]" />
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
                Start My Assessment
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
