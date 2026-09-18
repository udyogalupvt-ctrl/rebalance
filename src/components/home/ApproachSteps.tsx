import * as React from "react";
import { motion } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CardRail } from "@/components/shared/CardRail";
import { PinnedStage } from "@/components/shared/scroll/PinnedStage";
import { useActiveIndex } from "@/components/shared/scroll/useActiveIndex";
import { useRange } from "@/components/shared/scroll/range";
import { approachSteps, approachCopy } from "@/data/content";
import { PROCESS_STEP_IMAGES } from "@/data/images";
import { cn } from "@/lib/utils";

/**
 * Not Just a Diet Plan — the four steps of the approach.
 *
 * INTERACTION: a pinned stage holding one frame, with the work moving through
 * it. The photograph and the copy change; the frame, the meter and the heading
 * do not.
 *
 * The one thing this section has to get across is ORDER — that these happen
 * one after another. As four cards side by side it never really did: four
 * cards are a set, and a set has no direction. Read as a row on a phone it was
 * worse, because only one card was ever on screen and nothing on it said what
 * came before.
 *
 * Holding one frame still and changing what is inside it says "sequence"
 * without a word, because that is what a sequence looks like. The meter under
 * the frame is filled to the current step throughout, so the answer to "where
 * am I in this" is always on screen rather than inferred from a card's
 * position in a row that has scrolled away.
 *
 * The photographs run from the market to a meal being cooked at home, so the
 * four read as one story before a word of them is read.
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
/* Four discrete steps. Each one has to be readable while it holds the frame,
   so this gets more travel per item than the rails do. */
const PIN_LENGTH = 1.8;

/**
 * Opacity for the step that owns this slice of the pin.
 *
 * A plateau with a ramp either side, rather than a straight crossfade: with a
 * straight fade the two layers sit at half strength across the whole handover
 * and the frame turns to mush in the middle. Here each step holds full
 * strength for most of its window and the exchange happens at the boundary.
 *
 * Text and photographs need different handovers, which is why `hold` is a
 * parameter. Two photographs dissolving through each other reads as one scene
 * changing and can be generous. Two PARAGRAPHS dissolving through each other
 * is just two paragraphs on top of each other — unreadable, and the reader's
 * eye goes to the collision rather than the words. So the copy swaps over a
 * window roughly a third as long as the image's.
 *
 * The first and last steps extend past their edge of the pin — the opening
 * frame must already be solid when the stage locks, and the closing one must
 * still be solid when it releases.
 */
function useStepOpacity(
  progress: MotionValue<number>,
  index: number,
  count: number,
  hold: number,
  ramp: number,
) {
  const width = 1 / count;
  const centre = (index + 0.5) * width;

  const first = index === 0;
  const last = index === count - 1;

  return useRange(
    progress,
    [
      first ? -1 : centre - width * ramp,
      first ? -1 : centre - width * hold,
      last ? 2 : centre + width * hold,
      last ? 2 : centre + width * ramp,
    ],
    [0, 1, 1, 0],
  );
}

function StepLayer({
  progress,
  index,
  count,
  children,
  className,
  /** Distance the layer travels as it arrives, in px. */
  rise = 0,
  /** "soft" for photographs, "sharp" for copy. See useStepOpacity. */
  handover = "soft",
}: {
  progress: MotionValue<number>;
  index: number;
  count: number;
  children: React.ReactNode;
  className?: string;
  rise?: number;
  handover?: "soft" | "sharp";
}) {
  const sharp = handover === "sharp";
  const opacity = useStepOpacity(progress, index, count, sharp ? 0.42 : 0.3, sharp ? 0.54 : 0.62);
  const width = 1 / count;
  const centre = (index + 0.5) * width;

  // A short travel through the handover, in the direction of reading. Enough
  // that the exchange reads as one thing replacing another rather than as a
  // dissolve, without the copy ever visibly sliding while it is being read.
  const travel = sharp ? 0.54 : 0.62;
  const y = useRange(
    progress,
    [centre - width * travel, centre, centre + width * travel],
    [rise, 0, -rise],
  );

  return (
    <motion.div style={{ opacity, y }} className={className} aria-hidden={undefined}>
      {children}
    </motion.div>
  );
}

function ApproachStage({ progress }: { progress: MotionValue<number> }) {
  const total = approachSteps.length;
  const active = useActiveIndex(progress, total);

  return (
    <div className="container-x grid w-full items-center gap-5 sm:gap-6 lg:grid-cols-12 lg:gap-14">
      {/* ---- the frame: one window, four photographs ---- */}
      <div className="relative lg:col-span-6">
        <div className="relative w-full overflow-hidden rounded-[24px] border border-border bg-surface-alt shadow-[0_26px_64px_rgba(var(--shadow-rgb),0.16)] h-[clamp(168px,30svh,300px)] lg:h-[clamp(320px,52svh,520px)]">
          {approachSteps.map((step, i) => {
            const image = PROCESS_STEP_IMAGES[step.number];
            if (!image) return null;
            return (
              <StepLayer
                key={step.number}
                progress={progress}
                index={i}
                count={total}
                className="absolute inset-0"
              >
                <img
                  src={image.src}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </StepLayer>
            );
          })}

          {/* The step number, held in the corner of the frame. It is the one
              element that stays put while everything behind it changes, which
              is what makes the frame read as a single place. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-[linear-gradient(to_top,rgba(var(--surface-rgb),0.92),transparent)] p-4 sm:p-5">
            <span
              aria-hidden="true"
              className="font-fraunces text-[38px] font-medium leading-none text-primary-contrast sm:text-[46px]"
            >
              {approachSteps[active]?.number}
            </span>
            {/* Hidden from lg up, where the copy column names the step in
                full. Two labels saying the same thing on one screen is just
                noise. */}
            <span className="font-jakarta text-[12px] font-semibold uppercase tracking-[0.12em] text-text-muted lg:hidden">
              Step {active + 1} of {total}
            </span>
          </div>
        </div>

        {/* ---- the meter ---- */}
        <ol
          aria-label="Progress through the four steps"
          className="m-0 mt-4 flex list-none gap-1.5 p-0"
        >
          {approachSteps.map((step, i) => (
            <li key={step.number} className="min-w-0 flex-1">
              <span className="sr-only">
                {step.title}
                {i === active ? " (current)" : ""}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "block h-[4px] rounded-full transition-colors duration-[420ms] ease-[var(--ease-settle)]",
                  i <= active ? "bg-primary" : "bg-[rgba(var(--primary-rgb),0.18)]",
                )}
              />
            </li>
          ))}
        </ol>
      </div>

      {/* ---- the copy: one block, four texts ----
          Every layer is absolutely positioned and the box carries a fixed
          minimum height, so a longer body replacing a shorter one cannot
          change the layout. Nothing in a pinned stage may resize, or the
          whole stage twitches on each handover — including the photograph
          above it, which is the one thing that must look nailed down. */}
      <div className="relative min-h-[164px] sm:min-h-[140px] lg:col-span-6 lg:min-h-[320px]">
        {approachSteps.map((step, i) => {
          const Icon = step.icon;
          return (
            <StepLayer
              key={step.number}
              progress={progress}
              index={i}
              count={total}
              rise={18}
              handover="sharp"
              className="absolute inset-0 flex flex-col justify-center"
            >
              {/* On a wide screen the step is named in words here, where
                  there is room for it. On a phone that label lives in the
                  corner of the photograph instead, so this column can give
                  all its height to the sentence. */}
              <p className="mb-3 hidden font-jakarta text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted lg:block">
                Step {step.number} of {String(total).padStart(2, "0")}
              </p>
              <div className="mb-3 flex items-center gap-2.5 lg:mb-4">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-primary-soft lg:h-11 lg:w-11 lg:rounded-[14px]"
                >
                  <Icon className="h-[17px] w-[17px] text-primary lg:h-[21px] lg:w-[21px]" />
                </span>
                <h3 className="fs-h4 text-text lg:text-[clamp(1.5rem,2.3vw,2rem)]">{step.title}</h3>
              </div>
              <p className="max-w-[46ch] font-jakarta text-[15px] leading-[1.68] text-text-muted lg:text-[17.5px] lg:leading-[1.7]">
                {step.body}
              </p>
            </StepLayer>
          );
        })}
      </div>
    </div>
  );
}

/** The unpinned rendering: the four as a row of cards. */
function ApproachFallback() {
  const total = approachSteps.length;
  return (
    <div className="container-x pb-4">
      <CardRail
        ordered
        count={total}
        label="The four steps of the approach"
        wrapperClassName="mt-12"
        className="md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6"
      >
        <Reveal stagger={0.08} childAs="li">
          {approachSteps.map((step, index) => {
            const Icon = step.icon;
            const image = PROCESS_STEP_IMAGES[step.number];
            return (
              <article
                key={step.number}
                className="group flex flex-col overflow-hidden rounded-[24px] border border-border bg-surface surface-raise"
              >
                <div className="relative h-40 w-full shrink-0 overflow-hidden bg-surface-alt">
                  {image && (
                    <img
                      src={image.src}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 left-5 font-fraunces text-[44px] font-medium leading-none text-primary-contrast"
                  >
                    {step.number}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 pt-5">
                  <p className="mb-4 font-jakarta text-[12px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                    Step {index + 1} of {total}
                  </p>
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-primary-soft"
                    >
                      <Icon className="h-[17px] w-[17px] text-primary" />
                    </span>
                    <h3 className="fs-h4 text-text">{step.title}</h3>
                  </div>
                  <p className="font-jakarta text-[14.5px] leading-[1.68] text-text-muted">
                    {step.body}
                  </p>
                </div>
              </article>
            );
          })}
        </Reveal>
      </CardRail>
    </div>
  );
}

export function ApproachSteps() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="relative w-full overflow-x-clip bg-bg"
    >
      <div className="texture texture--fade texture--contour" aria-hidden="true" />

      <div className="container-x relative z-10 pt-[72px] md:pt-[96px] lg:pt-[116px]">
        <SectionHeading
          id="approach-heading"
          align="center"
          eyebrow={approachCopy.eyebrow}
          title={approachCopy.title}
          subtitle={approachCopy.subtitle}
        />
      </div>

      <PinnedStage length={PIN_LENGTH} className="relative z-10" fallback={<ApproachFallback />}>
        {({ progress }) => <ApproachStage progress={progress} />}
      </PinnedStage>

      {/* ---- core conviction ----
          Deliberately outside the pin, in ordinary flow. It is the section's
          closing statement and it should arrive when the reader has finished
          the four steps, at their own pace — not as a fifth thing competing
          for the same frame. */}
      <div className="container-x relative z-10 pb-[72px] md:pb-[96px] lg:pb-[116px]">
        <Reveal delay={0.12}>
          <figure className="relative mx-auto mt-4 max-w-[980px] overflow-hidden rounded-[28px] border border-[rgba(var(--primary-rgb),0.2)] bg-primary-soft px-6 py-9 sm:px-12 sm:py-11">
            <Quote
              aria-hidden="true"
              className="absolute right-6 top-6 h-16 w-16 text-[rgba(var(--primary-rgb),0.12)] sm:right-10 sm:top-8 sm:h-20 sm:w-20"
            />
            <p className="fs-eyebrow mb-4 text-primary-contrast">{approachCopy.convictionLabel}</p>
            <blockquote className="m-0">
              <p className="max-w-[40ch] font-fraunces text-[clamp(1.25rem,2.4vw,1.7rem)] font-medium italic leading-[1.4] text-text">
                {approachCopy.conviction}
              </p>
            </blockquote>
            <figcaption className="mt-5 max-w-[60ch] font-jakarta text-[15px] leading-[1.65] text-text-muted">
              {approachCopy.convictionSub}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
