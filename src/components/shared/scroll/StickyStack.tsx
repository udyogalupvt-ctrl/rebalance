import * as React from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useRange } from "./range";

/*
 * STICKY STACK — cards that pile up instead of queueing.
 *
 * Every card is an ordinary sibling in normal flow with `position: sticky` and
 * a top offset a little lower than the one before it. Scrolling brings each
 * card up over the last and parks it, so the set ends as a deck with every
 * card's top edge showing rather than as a column the reader has to travel.
 *
 * Why this and not a horizontal rail for the same content: these cards are a
 * COMPARISON. A rail shows one at a time and makes the reader hold the last
 * one in their head; a deck leaves every previous card's heading on screen, so
 * the choice stays visible while it is being made.
 *
 * And why it stops at the wide breakpoint: with room for four cards across,
 * the comparison is better served by seeing all four at once than by stacking
 * them. That is the difference between responsive behaviour and responsive
 * dimensions — the same content, a different interaction, chosen per screen.
 *
 * The sticking itself is pure CSS and costs nothing. The only scripted part is
 * the slight scale-down of covered cards, which is what turns a flat overlap
 * into depth, and it is one scroll subscription for the whole set.
 */

/** Below this, cards stack. At or above it, the wide layout takes over. */
const STACK_QUERY = "(max-width: 1023.98px)";

interface StickyStackProps {
  children: React.ReactNode;
  /**
   * Space between each card's resting position, in px.
   *
   * This is not a cosmetic gap: it is exactly how much of every covered card
   * stays on screen, so it should be set to show whatever makes the cards
   * comparable — a duration, a price, a name. Too small and the deck is a
   * stack of anonymous edges and the comparison the pattern exists for is
   * lost.
   */
  step?: number;
  /** Distance from the top of the viewport the first card rests at. */
  top?: string;
  className?: string;
  /** Rendered as <ol> when the cards are a sequence. */
  ordered?: boolean;
  label?: string;
  /**
   * Layout classes for the wide screen, applied from `lg` upward — normally a
   * grid. Stacking is switched off at the same breakpoint.
   */
  wideClassName?: string;
}

export function StickyStack({
  children,
  step = 40,
  top = "calc(var(--header-h) + 18px)",
  className,
  ordered = false,
  label,
  wideClassName,
}: StickyStackProps) {
  const ref = React.useRef<HTMLOListElement & HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const narrow = useMediaQuery(STACK_QUERY);
  const List = ordered ? "ol" : "ul";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const items = React.Children.toArray(children).filter(React.isValidElement);
  const count = items.length;

  // Stacking is a narrow-screen behaviour, and it IS the animation — so when
  // motion is reduced the set becomes a plain column, not a faster stack.
  const stacking = narrow && !reduce;

  return (
    <List
      ref={ref}
      aria-label={label}
      className={cn(
        "m-0 list-none p-0",
        stacking ? "stack-cards" : "stack-cards--flat",
        className,
        wideClassName,
      )}
    >
      {items.map((child, i) => (
        <StackItem
          key={(child as React.ReactElement).key ?? i}
          index={i}
          count={count}
          step={step}
          top={top}
          progress={scrollYProgress}
          stacking={stacking}
        >
          {child}
        </StackItem>
      ))}
    </List>
  );
}

function StackItem({
  children,
  index,
  count,
  step,
  top,
  progress,
  stacking,
}: {
  children: React.ReactNode;
  index: number;
  count: number;
  step: number;
  top: string;
  progress: MotionValue<number>;
  stacking: boolean;
}) {
  /*
   * The window during which this card is being covered by the next one.
   *
   * Progress runs 0→1 across the whole stack, so card i is overtaken between
   * i/count and (i+1)/count. Past that window it holds its reduced size — it
   * stays covered — which is why the range is clamped rather than looping back.
   *
   * The hooks are called unconditionally even when stacking is off. A hook
   * behind an `if` is the fastest way to break a component the moment the
   * viewport crosses the breakpoint; the MotionValues simply go unused.
   */
  const last = index === count - 1;
  const from = count > 1 ? index / count : 0;
  const to = count > 1 ? (index + 1) / count : 1;

  /*
   * Scale is the ONLY thing that animates here, and that is a correction.
   *
   * Covered cards used to fade to 72% opacity as well, for depth. But these
   * cards physically overlap, and a translucent card shows whatever is behind
   * it — which is the card it is sitting on. Three cards at 72% meant three
   * headings and three paragraphs printed through each other; the section was
   * genuinely unreadable on a phone. Depth on a stack has to come from size
   * and shadow, never from transparency.
   *
   * The last card is excluded entirely: nothing is ever going to cover it, so
   * shrinking it would just make the card the reader ends on the smallest one
   * on screen.
   */
  const scale = useRange(progress, [from, to], [1, last ? 1 : 0.94]);

  if (!stacking) {
    return <li className="grid min-w-0">{children}</li>;
  }

  return (
    <li
      className="stack-cards__item"
      style={{
        top: `calc(${top} + ${index * step}px)`,
        // Later cards paint over earlier ones. Without this the paint order is
        // document order, so a card would slide UNDER the one it is covering.
        zIndex: index + 1,
      }}
    >
      <motion.div style={{ scale, transformOrigin: "50% 0%" }} className="h-full">
        {children}
      </motion.div>
    </li>
  );
}
