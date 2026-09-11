import * as React from "react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { approachSteps, approachCopy } from "@/data/content";

/**
 * Section 5 — The Go Rebalance Approach.
 *
 * Four steps, so this one can be an honest row: a single line from lg with a
 * hairline running through the numerals, stacked on a phone. The rule behind
 * the numbers is what makes it read as a sequence rather than four unrelated
 * cards — it is the one piece of ornament here, and it is doing a job.
 *
 * Deliberately no photography. The steps are a process, and the page already
 * carries pictures directly above and below this band; a fifth set of food
 * photographs here would be decoration for its own sake.
 */
export function ApproachSteps() {
  return (
    <SectionWrapper id="approach" bg="base" labelledBy="approach-heading" texture="contour">
      <SectionHeading
        id="approach-heading"
        align="center"
        eyebrow={approachCopy.eyebrow}
        title={approachCopy.title}
      />

      {/*
        A ladder, not a row of four boxes.
        
        The first version was four equal cards under a hairline, which read as
        a feature grid rather than as a sequence — the one thing this section
        has to communicate is that these happen IN ORDER. Numbered plates on a
        spine, each step indented from the last, makes the order the shape of
        the section instead of something the numerals have to assert.
      */}
      <div className="relative mx-auto mt-16 max-w-[880px]">
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-[27px] top-6 w-px bg-[linear-gradient(to_bottom,transparent,var(--border)_12%,var(--border)_88%,transparent)] sm:left-[31px]"
        />

        <ol className="relative m-0 flex list-none flex-col gap-10 p-0 sm:gap-12">
          <Reveal stagger={0.09} childAs="li">
            {approachSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex items-start gap-6 sm:gap-8">
                  <span
                    aria-hidden="true"
                    className="relative z-10 flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full border border-[rgba(var(--primary-rgb),0.28)] bg-bg font-fraunces text-[18px] font-medium text-primary-contrast shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.08)] sm:h-[64px] sm:w-[64px] sm:text-[20px]"
                  >
                    {step.number}
                  </span>

                  <div className="min-w-0 pt-2">
                    <div className="mb-2.5 flex items-center gap-2.5">
                      <Icon aria-hidden="true" className="h-[17px] w-[17px] shrink-0 text-accent" />
                      <h3 className="fs-h4 text-text">{step.title}</h3>
                    </div>
                    <p className="max-w-[56ch] font-jakarta text-[15px] leading-[1.7] text-text-muted">
                      {step.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </ol>
      </div>

      <Reveal delay={0.14}>
        <p className="mx-auto mt-16 max-w-[52ch] text-balance text-center font-fraunces text-[clamp(1.1rem,2vw,1.4rem)] font-medium italic leading-snug text-primary-contrast">
          {approachCopy.closing}
        </p>
      </Reveal>
    </SectionWrapper>
  );
}
