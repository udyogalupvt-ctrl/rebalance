import * as React from "react";
import { Quote } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CardRail } from "@/components/shared/CardRail";
import { approachSteps, approachCopy } from "@/data/content";
import { PROCESS_STEP_IMAGES } from "@/data/images";

/**
 * Not Just a Diet Plan — the four steps of the approach, and the conviction
 * behind them.
 *
 * The one thing this section has to get across is ORDER: these happen one
 * after another. Each card therefore carries its place twice over — "Step 2 of
 * 4" in words, and a four-segment meter filled to that point — so a reader
 * swiping the row on a phone, who only ever sees one or two cards at once,
 * still knows where in the sequence they are.
 *
 * The photographs run from the market to a meal being cooked at home, so the
 * four read as one story before a word of them is read.
 */
export function ApproachSteps() {
  const total = approachSteps.length;

  return (
    <SectionWrapper id="approach" bg="base" labelledBy="approach-heading" texture="contour">
      <SectionHeading
        id="approach-heading"
        align="center"
        eyebrow={approachCopy.eyebrow}
        title={approachCopy.title}
        subtitle={approachCopy.subtitle}
      />

      <CardRail
        ordered
        count={total}
        label="The four steps of the approach"
        wrapperClassName="mt-14"
        className="md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6"
      >
        <Reveal stagger={0.08} childAs="li">
          {approachSteps.map((step, index) => {
            const Icon = step.icon;
            const image = PROCESS_STEP_IMAGES[step.number];
            return (
              <article
                key={step.number}
                aria-labelledby={`approach-${step.number}`}
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
                      className="h-full w-full object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.16,0.84,0.24,1)] group-hover:scale-[1.04]"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(var(--surface-rgb),0.7),transparent_60%)]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 left-5 font-fraunces text-[44px] font-medium leading-none text-primary-contrast"
                  >
                    {step.number}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 pt-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="font-jakarta text-[12px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                      Step {index + 1} of {total}
                    </p>
                    <span aria-hidden="true" className="flex gap-1">
                      {Array.from({ length: total }, (_, i) => (
                        <span
                          key={i}
                          className={
                            i <= index
                              ? "h-[4px] w-4 rounded-full bg-primary"
                              : "h-[4px] w-4 rounded-full bg-[rgba(var(--primary-rgb),0.18)]"
                          }
                        />
                      ))}
                    </span>
                  </div>

                  <div className="mb-2.5 flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-primary-soft"
                    >
                      <Icon className="h-[17px] w-[17px] text-primary" />
                    </span>
                    <h3 id={`approach-${step.number}`} className="fs-h4 text-text">
                      {step.title}
                    </h3>
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

      {/* ---- core conviction ---- */}
      <Reveal delay={0.12}>
        <figure className="relative mx-auto mt-12 max-w-[980px] overflow-hidden rounded-[28px] border border-[rgba(var(--primary-rgb),0.2)] bg-primary-soft px-6 py-9 sm:px-12 sm:py-11">
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
    </SectionWrapper>
  );
}
