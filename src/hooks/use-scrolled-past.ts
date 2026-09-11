import * as React from "react";

/**
 * Whether the page has scrolled past `offset` pixels — without listening to
 * scroll.
 *
 * The obvious version reads `window.scrollY` in a scroll handler. That read
 * is a layout query, and it lands in the middle of the frame the browser is
 * already busy scrolling: in a throttled profile of the home page it was the
 * single most expensive script on the main thread during a scroll, ahead of
 * every animation on the site.
 *
 * So nothing here runs on scroll at all. A one-pixel sentinel is parked in
 * the document at exactly `offset` from the top, and an IntersectionObserver
 * reports when it leaves the viewport. The browser computes that off the main
 * thread as part of work it is doing anyway, and this hook is woken twice per
 * page — once crossing the threshold going down, once coming back up.
 *
 * The sentinel is `position: absolute` with no positioned ancestor, so it is
 * placed against the document origin and scrolls with the page. It is
 * `visibility: hidden` rather than `display: none`, because an element with
 * no box generates no intersections.
 */
export function useScrolledPast(offset = 60): boolean {
  const [past, setPast] = React.useState(false);

  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      // Older browsers keep the straightforward behaviour.
      const onScroll = () => setPast(window.scrollY > offset);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = `position:absolute;top:${offset}px;left:0;width:1px;height:1px;visibility:hidden;pointer-events:none;`;
    document.body.appendChild(sentinel);

    const io = new IntersectionObserver(([entry]) => setPast(!entry?.isIntersecting), {
      threshold: 0,
    });
    io.observe(sentinel);

    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, [offset]);

  return past;
}
