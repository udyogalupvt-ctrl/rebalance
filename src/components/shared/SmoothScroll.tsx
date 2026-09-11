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
      /*
       * 0.85s to settle, down from 1.05.
       *
       * The long tail was the thing that read as "sticking". Lenis drives the
       * real scroll offset towards a target, so a longer duration means the
       * page carries on moving for longer after the wheel stops — and a
       * second flick during that tail lands on a page that is still resolving
       * the first, which feels like drag rather than momentum. It is also the
       * largest scripting cost left in a scroll profile, at roughly a tenth
       * of the frame, because every one of those frames is a scrollTo.
       *
       * 0.85s keeps the weight and gets the page under the reader's hand
       * again sooner.
       */
      duration: 0.85,
      // Exponential ease-out: fast take-off, short tail. This is the curve
      // that reads as "momentum" rather than "animation".
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

    /*
     * Hand the page back to the browser while the tab is hidden.
     *
     * Lenis keeps a requestAnimationFrame loop running for as long as it is
     * alive. A backgrounded tab does not need it, and coming back from one
     * with a stale timestamp is what produces the single long jump some
     * people see on returning to a page.
     */
    const onVisibility = () => {
      if (document.hidden) lenis.stop();
      else lenis.start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    instance = lenis;

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
