import * as React from "react";
import Lenis from "lenis";

/**
 * Site-wide inertial scrolling.
 *
 * `scroll-behavior: smooth` only smooths *programmatic* jumps — anchor links
 * and scrollTo. A mouse wheel still moves the page in hard 100px steps, which
 * is what made the site feel like a document rather than a product.
 *
 * Lenis replaces the wheel handler with a damped animation towards a target
 * offset, so a flick decelerates instead of stopping dead. It drives the real
 * scroll position (not a transform), so `position: fixed`, IntersectionObserver
 * and framer-motion's useScroll all keep working untouched.
 *
 * Deliberately NOT applied to touch: iOS and Android already have excellent
 * momentum scrolling, and overriding it costs a frame budget on exactly the
 * devices that can least afford one.
 */

/** The live instance, so imperative code (menus, modals) can pause scrolling. */
let instance: Lenis | null = null;

/** Freeze/unfreeze the page. Used by the mobile menu and any modal. */
export function setScrollLocked(locked: boolean) {
  if (!instance) return;
  if (locked) instance.stop();
  else instance.start();
}

/** Scroll to an element or offset through the same easing as the wheel. */
export function smoothScrollTo(target: string | HTMLElement | number, offset = 0) {
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.1 });
    return;
  }
  // Reduced motion, or before mount: fall back to the platform.
  const el =
    typeof target === "string"
      ? document.querySelector(target)
      : typeof target === "number"
        ? null
        : target;
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else if (typeof target === "number")
    window.scrollTo({ top: target + offset, behavior: "smooth" });
}

export function SmoothScroll() {
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) return;

    const lenis = new Lenis({
      // 1.05s to settle. Long enough to read as weight, short enough that a
      // deliberate scroll to a section does not feel like waiting.
      duration: 1.05,
      // Exponential ease-out: fast take-off, long tail. This is the curve that
      // reads as "momentum" rather than "animation".
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Native momentum on touch is better than anything we can synthesise.
      syncTouch: false,
      smoothWheel: true,
      // Anchor links and :target land through the same easing.
      anchors: { offset: -100 },
      autoRaf: true,
    });

    instance = lenis;

    return () => {
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
