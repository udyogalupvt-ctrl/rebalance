import * as React from "react";
import { Link } from "@tanstack/react-router";
import type { MotionValue } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CardRail } from "@/components/shared/CardRail";
import { PinnedStage, StageProgress } from "@/components/shared/scroll/PinnedStage";
import { ScrollRail, RailHint } from "@/components/shared/scroll/ScrollRail";
import { areasOfFocus, areasOfFocusCopy } from "@/data/content";
import { AREA_IMAGES } from "@/data/images";
import { cn } from "@/lib/utils";

/**
 * How Can We Support You? — the five areas of focus.
 *
 * INTERACTION: a pinned stage where the reader's ordinary downward scroll
 * carries the five cards sideways.
 *
 * The five used to be a bento grid on a wide screen and a swipeable row on a
 * phone. The grid was fine; the phone was the problem. Five cards each with a
 * photograph, a paragraph and a row of chips is close to four screens of
 * thumb-work for a set the reader is only scanning to find themselves in —
 * and the swipe was a second, different gesture layered on top of the scroll
 * they were already doing.
 *
 * Turning the vertical scroll sideways fixes both at once. The set occupies
 * one screen instead of four, nothing new has to be learned, and because the
 * cards are moving under a scroll the reader controls, they can go back as
 * easily as forward. The counter and the filling bar answer the question a
 * pinned section always raises: how much of this is left.
 *
 * Nothing here claims to treat any of these. They are the areas the practice
 * provides nutrition support in, and the clinical note under the set says so
 * in the practice's own words.
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
/* Five cards, moving continuously — a rail can be read while it travels, so
   it needs less dwell than a stage that swaps discrete panels. */
const PIN_LENGTH = 1.4;

function FocusCard({
  area,
  index,
  compact = false,
  current = false,
}: {
  area: (typeof areasOfFocus)[number];
  index: number;
  /** The pinned-rail form: shorter, and sized to fit a phone screen whole. */
  compact?: boolean;
  current?: boolean;
}) {
  const Icon = area.icon;
  const image = AREA_IMAGES[area.id];

  return (
    <article
      aria-labelledby={`focus-${area.id}`}
      aria-current={compact && current ? "true" : undefined}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[24px] border bg-surface",
        compact
          ? // In the rail the active card is the one lit; its neighbours sit
            // back. This is the only cue that says which card the counter is
            // talking about, so it is a border and a shadow, not just opacity.
            [
              // Opacity only — see the note in JourneySection. Transitioning
              // box-shadow repaints the card on every frame of the change.
              "shadow-[0_18px_48px_rgba(var(--shadow-rgb),0.14)]",
              "transition-opacity duration-300 ease-[var(--ease-settle)]",
              current
                ? "border-[rgba(var(--primary-rgb),0.4)] opacity-100"
                : "border-border opacity-[0.55]",
            ]
          : "border-border surface-raise hover:border-primary/35",
      )}
    >
      <div
        className={cn(
          "relative w-full shrink-0 overflow-hidden bg-surface-alt",
          compact ? "h-[128px] sm:h-[150px] lg:h-[168px]" : "h-44 sm:h-48",
        )}
      >
        {image && (
          <img
            src={image.src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            width={640}
            height={400}
            className="h-full w-full object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.16,0.84,0.24,1)] group-hover:scale-[1.04]"
          />
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(var(--surface-rgb),0.55),transparent_55%)]"
        />
        <span
          aria-hidden="true"
          className="absolute left-4 top-4 rounded-pill bg-[rgba(var(--surface-rgb),0.92)] px-3 py-1 font-jakarta text-[12px] font-semibold tabular-nums tracking-[0.08em] text-primary-contrast"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "p-5" : "p-6")}>
        <span
          aria-hidden="true"
          className={cn(
            "relative z-10 mb-4 flex items-center justify-center rounded-[15px] border border-border bg-surface shadow-[0_8px_20px_rgba(var(--shadow-rgb),0.14)] transition-colors duration-300 group-hover:border-primary group-hover:bg-primary",
            compact ? "-mt-[44px] h-[42px] w-[42px]" : "-mt-[50px] h-[48px] w-[48px]",
          )}
        >
          <Icon
            size={compact ? 19 : 21}
            className="text-primary transition-colors duration-300 group-hover:text-white"
          />
        </span>

        <h3
          id={`focus-${area.id}`}
          className={cn(
            "mb-2.5 font-fraunces font-medium leading-snug text-text",
            compact ? "text-[17.5px]" : "text-[19px]",
          )}
        >
          {area.title}
        </h3>

        <p
          className={cn(
            "font-jakarta leading-[1.6] text-text-muted",
            compact ? "mb-4 text-[14px]" : "mb-5 text-[14.5px]",
          )}
        >
          {area.body}
        </p>

        <ul
          aria-label={`${area.title} includes`}
          className={cn("m-0 flex list-none flex-wrap gap-2 p-0", compact ? "mt-auto" : "mb-6")}
        >
          {area.items.map((item) => (
            <li
              key={item}
              className="rounded-pill border border-[rgba(var(--primary-rgb),0.18)] bg-primary-soft px-3 py-1 font-jakarta text-[12.5px] font-medium leading-[1.5] text-primary-contrast"
            >
              {item}
            </li>
          ))}
        </ul>

        {/* The per-card link is only in the flowing form. In the rail the
            action belongs to the section, under the whole set — five identical
            links travelling past is noise, and a link that slides away under
            the reader's thumb is a link they cannot press. */}
        {!compact && (
          <Link
            to="/assessment"
            className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start font-jakarta text-[14px] font-semibold text-accent-contrast"
          >
            {areasOfFocusCopy.cardLink}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        )}
      </div>
    </article>
  );
}

/** The unpinned rendering: the bento grid, kept for reduced motion. */
function FocusFallback() {
  return (
    <div className="container-x pb-20">
      <CardRail
        count={areasOfFocus.length}
        label={areasOfFocusCopy.eyebrow}
        wrapperClassName="mt-12"
        className="md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-6 lg:gap-6"
      >
        <Reveal
          stagger={0.06}
          childAs="li"
          childClassName="md:[&:nth-child(5)]:col-span-2 lg:[&:nth-child(-n+2)]:col-span-3 lg:[&:nth-child(n+3)]:col-span-2"
        >
          {areasOfFocus.map((area, index) => (
            <FocusCard key={area.id} area={area} index={index} />
          ))}
        </Reveal>
      </CardRail>
    </div>
  );
}

export function AreasOfFocus() {
  return (
    <section
      id="focus"
      aria-labelledby="focus-heading"
      // overflow-x-clip, not hidden: `hidden` would make this a scroll
      // container and the stage inside would stop sticking entirely.
      className="relative w-full overflow-x-clip bg-surface-alt"
    >
      <div aria-hidden="true" className="arc-field">
        <div className="arc-glow arc-glow--accent arc--drift -bottom-[45%] -right-[30%]" />
      </div>

      <div className="container-x relative z-10 pt-[72px] md:pt-[96px] lg:pt-[116px]">
        <SectionHeading
          id="focus-heading"
          align="center"
          eyebrow={areasOfFocusCopy.eyebrow}
          title={areasOfFocusCopy.title}
          subtitle={areasOfFocusCopy.subtitle}
        />
      </div>

      <PinnedStage
        length={PIN_LENGTH}
        className="relative z-10"
        stageClassName="gap-5"
        fallback={<FocusFallback />}
      >
        {({ progress }) => <FocusStage progress={progress} />}
      </PinnedStage>

      <div className="container-x relative z-10 pb-[72px] md:pb-[96px] lg:pb-[116px]">
        <Reveal>
          <p className="mx-auto max-w-[46ch] text-center font-fraunces text-[clamp(1.05rem,1.9vw,1.3rem)] font-medium italic leading-snug text-primary-contrast">
            {areasOfFocusCopy.closing}
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mx-auto mt-7 flex max-w-[760px] items-start gap-3 rounded-[18px] border border-border bg-surface px-5 py-4 font-jakarta text-[13.5px] leading-[1.65] text-text-muted">
            <Info aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="font-semibold text-text">
                {areasOfFocusCopy.clinicalNoteLabel}
              </strong>{" "}
              {areasOfFocusCopy.clinicalNote}
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * The pinned rail itself, split out so the MotionValue hooks live below the
 * PinnedStage render-prop boundary rather than running on every page.
 */
function FocusStage({ progress }: { progress: MotionValue<number> }) {
  // Reported by the rail from its measured position, not derived from
  // progress — see the note on ScrollRail's onActiveChange.
  const [active, setActive] = React.useState(0);

  return (
    <>
      <div className="container-x w-full">
        <StageProgress
          progress={progress}
          count={areasOfFocus.length}
          active={active}
          label={`${areasOfFocus[active]?.title ?? ""}`}
          className="mx-auto max-w-[560px]"
        />
      </div>

      <ScrollRail
        progress={progress}
        onActiveChange={setActive}
        trackClassName="rail-lead gap-4 sm:gap-5"
      >
        {areasOfFocus.map((area, index) => (
          <div
            key={area.id}
            data-rail-item=""
            className="w-[78vw] max-w-[320px] shrink-0 sm:w-[340px] sm:max-w-none lg:w-[384px]"
          >
            <FocusCard area={area} index={index} compact current={index === active} />
          </div>
        ))}
      </ScrollRail>

      <div className="container-x flex w-full flex-col items-center gap-1">
        <RailHint progress={progress} label="Scroll to explore" />
        {/* The section's single action, held still under the moving set. */}
        <Link
          to="/assessment"
          className="press group mt-1 inline-flex min-h-11 items-center gap-1.5 font-jakarta text-[14px] font-semibold text-accent-contrast"
        >
          {areasOfFocusCopy.cardLink}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </>
  );
}
