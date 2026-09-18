import * as React from "react";
import { Link } from "@tanstack/react-router";
import type { MotionValue } from "framer-motion";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CardRail } from "@/components/shared/CardRail";
import { PinnedStage, StageProgress } from "@/components/shared/scroll/PinnedStage";
import { ScrollRail, RailHint } from "@/components/shared/scroll/ScrollRail";
import { journeySteps, journeyCopy, finalCta } from "@/data/content";
import { cn } from "@/lib/utils";

/**
 * Your Journey With Go Rebalance — the practice's eleven-step service flow.
 *
 * INTERACTION: a pinned track. Vertical scroll walks the reader along a path,
 * and a line fills behind them as they go.
 *
 * Eleven steps is the longest list on the site and it was also the least
 * rewarding to read: as a grid it was four rows of small cards, and on a phone
 * it was eleven cards to swipe through with no sense of how far along you
 * were. Either way it read as a specification rather than as a journey.
 *
 * A path is what the content actually is, so the section draws one. The line
 * running through every card is continuous, it fills only as far as the reader
 * has come, and the twelfth card at the end of it is the invitation to take
 * the first step — so the track closes on the action rather than on a gap.
 *
 * The note about clinical integrity stays in ordinary flow underneath, because
 * it answers the question the list raises — why the detailed plan comes so
 * late — and that answer should not slide away while it is being read.
 */

/*
 * How many viewports of scroll the pin lasts.
 *
 * This number is a budget, not a taste decision. A pinned stage spends real
 * scroll distance: the reader pays one whole viewport just to hold the stage,
 * plus `length` viewports of travel on top. Measured on a 390x844 phone, the
 * first draft of this page ran to 31 screens against the previous version's
 * 20 — the set-pieces were better but the page had become a hike, and on a
 * clinic site whose one job is to get somebody to the assessment form, that
 * is a straight loss.
 *
 * So each pin is cut to the least travel that still lets its content be read,
 * and no more. If a stage ever feels rushed, add content-specific dwell inside
 * it before reaching for this number.
 */
/* Twelve short cards on a continuously moving track. They are scanned rather
   than studied — the detail that matters is on the program pages — so this is
   the tightest pin on the page. */
const PIN_LENGTH = 1.9;

/*
 * Where the path meets a card, measured rather than eyeballed.
 *
 * The card has 20px of padding and its badge is 44px across, so the badge's
 * centre line sits 20 + 22 = 42px below the card's top edge. Both halves are
 * named so that changing the card's padding or its badge size cannot quietly
 * leave the connectors floating above or below the circles they join.
 */
const PATH_TOP = 20;
const BADGE_RADIUS = 22;

/*
 * Memoised because the whole stage re-renders every time the active card
 * changes, and only two of the twelve cards actually differ on that render —
 * the one gaining focus and the one losing it. Without this, twelve cards are
 * reconciled a dozen times across the pin for two visible changes.
 *
 * The active-card cue animates OPACITY ONLY, and that is a performance fix.
 *
 * It used to transition border-colour and box-shadow as well. Both repaint:
 * a box-shadow transition re-rasterises the element every frame it runs, and
 * twelve cards change state together every time the active card moves. On a
 * 4x-throttled CPU — roughly a mid-range Android, which is most of this
 * audience — that put 24.5% of frames in this section below 30fps, against
 * 3.4% for the rest of the page.
 *
 * Opacity is one of the two properties the compositor can animate by itself,
 * so the same cue now costs the main thread nothing. The border and shadow
 * still differ between states; they just arrive with the opacity instead of
 * being interpolated.
 */
const StepCard = React.memo(function StepCard({
  step,
  index,
  current,
}: {
  step: (typeof journeySteps)[number];
  index: number;
  current: boolean;
}) {
  return (
    <article
      aria-current={current ? "true" : undefined}
      className={cn(
        "flex h-full flex-col rounded-[22px] border bg-surface p-5",
        "transition-opacity duration-300 ease-[var(--ease-settle)]",
        current
          ? "border-[rgba(var(--primary-rgb),0.4)] opacity-100"
          : "border-border opacity-[0.62]",
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <span
          aria-hidden="true"
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-fraunces text-[16px] font-medium tabular-nums",
            current
              ? "border-primary bg-primary text-on-primary"
              : "border-[rgba(var(--primary-rgb),0.28)] bg-primary-soft text-primary-contrast",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {"badge" in step && step.badge && (
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-soft px-2.5 py-1 font-jakarta text-[12px] font-semibold text-accent-contrast">
            <Clock aria-hidden="true" className="h-3.5 w-3.5" />
            {step.badge}
          </span>
        )}
      </div>
      <h3 className="mb-2 font-fraunces text-[17px] font-medium leading-snug text-text">
        <span className="sr-only">Step {index + 1}: </span>
        {step.title}
      </h3>
      <p className="font-jakarta text-[13.5px] leading-[1.6] text-text-muted">{step.body}</p>
    </article>
  );
});

/**
 * The last card on the track: the first step the reader can actually take.
 *
 * Its link is removed from the tab order while the card is parked off-stage.
 *
 * A scroll-driven rail moves its cards with a transform, so a card waiting its
 * turn is sitting thousands of pixels to the right of the viewport while still
 * being a perfectly ordinary focusable link. Tabbing into it put the focus
 * ring on something invisible, and because the rail is driven by page scroll
 * rather than by its own scrollLeft, the browser could not bring it into view
 * either — measured at left: 3362px on a 390px screen.
 *
 * `tabIndex={-1}` rather than `inert` or `hidden`, deliberately: those would
 * also drop the card out of the accessibility tree, and a screen-reader user
 * should still be able to read every step of the journey in document order.
 * This removes only the tab stop. Scrolling the section — which the keyboard
 * does perfectly well with the space bar or arrow keys — brings the card to
 * the front and hands its link back.
 */
function BeginCard({ current }: { current: boolean }) {
  return (
    <div
      data-dark-band=""
      className={cn(
        "relative flex h-full flex-col justify-between overflow-hidden rounded-[22px] bg-[var(--dark-surface)] p-5 transition-opacity duration-300",
        current ? "opacity-100" : "opacity-[0.6]",
      )}
    >
      <div
        aria-hidden="true"
        className="orb orb--accent orb--strong pointer-events-none absolute -right-16 -top-16 h-48 w-48"
      />
      <p className="relative font-fraunces text-[18px] font-medium leading-snug text-on-dark">
        {finalCta.lead}
      </p>
      <Link
        to="/assessment"
        tabIndex={current ? 0 : -1}
        className="press group relative mt-5 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-pill bg-accent-strong px-4 py-3 text-center text-[13.5px] font-semibold leading-snug text-on-accent"
      >
        {journeyCopy.cta}
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

/**
 * One segment of the path, drawn in the gap BETWEEN two cards.
 *
 * The path used to be a single line running the whole width of the track,
 * behind the cards. That looked right only while the cards were opaque. The
 * cards are deliberately dimmed to 62% when they are not the active one — that
 * dimming is what makes the current card read as current — and a translucent
 * card shows whatever is behind it, so the line was plainly visible straight
 * through eleven of the twelve cards, cutting across the copy like a strike.
 *
 * Drawing only the gaps fixes it at the source rather than by fighting it with
 * z-index or an opaque backing: there is simply never any line behind a card.
 * The badges still read as threaded together, because the segment meets each
 * badge at exactly its centre line, and the eye completes the rest.
 *
 * `left-full` plus a width equal to the track gap means the segment always
 * spans precisely the space between two cards, whatever the breakpoint does to
 * the gap — no second place to keep in step.
 */
function PathSegment({ filled }: { filled: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-full h-[2px] w-4 transition-colors duration-300",
        filled ? "bg-primary" : "bg-[rgba(var(--primary-rgb),0.2)]",
      )}
      style={{ top: PATH_TOP + BADGE_RADIUS }}
    />
  );
}

function JourneyStage({ progress }: { progress: MotionValue<number> }) {
  const total = journeySteps.length + 1;
  // Reported by the rail from its measured position, not derived from
  // progress — see the note on ScrollRail's onActiveChange.
  const [active, setActive] = React.useState(0);

  return (
    <>
      <div className="container-x w-full">
        <StageProgress
          progress={progress}
          count={total}
          active={active}
          label={journeySteps[active]?.title ?? journeyCopy.cta}
          className="mx-auto max-w-[560px]"
        />
      </div>

      <ScrollRail
        progress={progress}
        onActiveChange={setActive}
        trackClassName="rail-lead relative gap-4 pt-5"
      >
        {journeySteps.map((step, i) => (
          <div
            key={step.title}
            data-rail-item=""
            className="relative z-10 w-[74vw] max-w-[286px] shrink-0 sm:w-[300px] sm:max-w-none"
          >
            <StepCard step={step} index={i} current={i === active} />
            {/* The reader has come this far, so the run behind them is lit. */}
            <PathSegment filled={i < active} />
          </div>
        ))}
        <div
          data-rail-item=""
          className="relative z-10 w-[74vw] max-w-[286px] shrink-0 sm:w-[300px] sm:max-w-none"
        >
          <BeginCard current={active === total - 1} />
        </div>
      </ScrollRail>

      <div className="container-x w-full">
        <RailHint progress={progress} label="Scroll along the path" />
      </div>
    </>
  );
}

/** The unpinned rendering: the twelve as a grid. */
function JourneyFallback() {
  return (
    <div className="container-x pb-4">
      <CardRail
        ordered
        count={journeySteps.length + 1}
        label="The eleven steps of your journey"
        wrapperClassName="mt-12"
        className="md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4"
      >
        <Reveal stagger={0.04} childAs="li">
          {[
            ...journeySteps.map((step, index) => (
              <StepCard key={step.title} step={step} index={index} current />
            )),
            <BeginCard key="begin" current />,
          ]}
        </Reveal>
      </CardRail>
    </div>
  );
}

export function JourneySection() {
  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="relative w-full overflow-x-clip bg-surface-alt"
    >
      <div aria-hidden="true" className="arc-field">
        <div className="arc-glow arc--drift -left-[30%] -top-[45%]" />
      </div>

      <div className="container-x relative z-10 pt-[72px] md:pt-[96px] lg:pt-[116px]">
        <SectionHeading
          id="journey-heading"
          align="center"
          eyebrow={journeyCopy.eyebrow}
          title={journeyCopy.title}
          subtitle={journeyCopy.subtitle}
        />
      </div>

      <PinnedStage
        length={PIN_LENGTH}
        className="relative z-10"
        stageClassName="gap-5"
        fallback={<JourneyFallback />}
      >
        {({ progress }) => <JourneyStage progress={progress} />}
      </PinnedStage>

      <div className="container-x relative z-10 pb-[72px] md:pb-[96px] lg:pb-[116px]">
        <Reveal delay={0.1}>
          <p className="mx-auto flex max-w-[820px] items-start gap-3 rounded-[18px] border border-[rgba(var(--primary-rgb),0.22)] bg-primary-soft px-5 py-4 font-jakarta text-[14px] leading-[1.65] text-primary-contrast">
            <ShieldCheck
              aria-hidden="true"
              className="mt-[3px] h-[18px] w-[18px] shrink-0 text-primary"
            />
            <span>
              <strong className="font-semibold">{journeyCopy.integrityLabel}</strong>{" "}
              {journeyCopy.integrity}
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
