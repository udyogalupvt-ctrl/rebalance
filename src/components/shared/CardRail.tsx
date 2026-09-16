import * as React from "react";
import { cn } from "@/lib/utils";

interface CardRailProps {
  children: React.ReactNode;
  /** How many cards the rail holds — sizes the position dots. */
  count: number;
  /**
   * The list's layout from md upwards (e.g. "md:grid md:grid-cols-3 md:gap-6").
   * Below md the list is always a swipeable row, whatever these say.
   */
  className?: string;
  /** Rendered as an ordered list when the cards are a sequence. */
  ordered?: boolean;
  /** Names the rail for screen readers, e.g. "Areas of focus". */
  label?: string;
  /** Extra classes on the outer wrapper. */
  wrapperClassName?: string;
}

/**
 * A list of cards that is a grid on a wide screen and a swipeable row on a
 * phone, with a row of position dots under it.
 *
 * The dots are not decoration. A horizontal row hides everything past the
 * second card, and the peeking edge says "there is more" without saying how
 * much; the dots say how many and where the reader is. They are buttons, so
 * the row can also be moved without swiping.
 *
 * Put a `<Reveal stagger childAs="li">` (or plain `<li>`s) inside it, exactly
 * as you would inside a `<ul>`.
 */
export function CardRail({
  children,
  count,
  className,
  ordered = false,
  label,
  wrapperClassName,
}: CardRailProps) {
  const listRef = React.useRef<HTMLOListElement & HTMLUListElement>(null);
  const [active, setActive] = React.useState(0);
  const List = ordered ? "ol" : "ul";

  /** The cards themselves, in order, whether or not Reveal wraps them. */
  const items = React.useCallback((): HTMLElement[] => {
    const list = listRef.current;
    if (!list) return [];
    return Array.from(list.querySelectorAll<HTMLElement>(":scope > li, :scope > .contents > li"));
  }, []);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      // Only meaningful while the list is actually a row.
      if (list.scrollWidth <= list.clientWidth + 1) {
        setActive(0);
        return;
      }
      const cards = items();
      if (!cards.length) return;
      const edge = list.getBoundingClientRect().left;
      const gutter = parseFloat(getComputedStyle(list).scrollPaddingLeft) || 0;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.getBoundingClientRect().left - edge - gutter);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      // At the very end of the row the last card cannot reach the gutter, so
      // the nearest-card test would never select it.
      if (list.scrollLeft + list.clientWidth >= list.scrollWidth - 2) best = cards.length - 1;
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    list.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      list.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  const goTo = (i: number) => {
    const list = listRef.current;
    const card = items()[i];
    if (!list || !card) return;
    const gutter = parseFloat(getComputedStyle(list).scrollPaddingLeft) || 0;
    const delta = card.getBoundingClientRect().left - list.getBoundingClientRect().left - gutter;
    list.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", wrapperClassName)}>
      <List
        ref={listRef}
        aria-label={label}
        className={cn("card-rail m-0 list-none p-0", className)}
      >
        {children}
      </List>

      {count > 1 && (
        <div className="-mt-2 flex items-center justify-center gap-1.5 md:hidden">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show card ${i + 1} of ${count}`}
              aria-current={i === active ? "true" : undefined}
              className="group grid h-8 min-w-6 place-items-center"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "block h-[6px] rounded-full transition-[width,background-color] duration-300",
                  i === active ? "w-5 bg-primary" : "w-[6px] bg-[rgba(var(--primary-rgb),0.26)]",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
