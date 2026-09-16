import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CardRail } from "@/components/shared/CardRail";
import { journeySteps, journeyCopy, finalCta } from "@/data/content";

/**
 * Your Journey With Go Rebalance — the practice's eleven-step service flow.
 *
 * Eleven steps stacked on a phone is five screens of scrolling, so below md
 * they are a swipeable row with position dots. On a wide screen they fill a
 * four-column grid, and the twelfth cell — the one eleven would leave empty —
 * is the invitation to take step one, so the grid closes on the action rather
 * than on a gap.
 *
 * The note about clinical integrity is the practice's own, and it sits
 * directly under the steps because it answers the question the list raises:
 * why the detailed plan comes so late.
 */
export function JourneySection() {
  return (
    <SectionWrapper id="journey" bg="alt" labelledBy="journey-heading" arc="left">
      <SectionHeading
        id="journey-heading"
        align="center"
        eyebrow={journeyCopy.eyebrow}
        title={journeyCopy.title}
        subtitle={journeyCopy.subtitle}
      />

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
              <article
                key={step.title}
                className="relative flex flex-col rounded-[22px] border border-border bg-surface p-6"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(var(--primary-rgb),0.28)] bg-primary-soft font-fraunces text-[16px] font-medium tabular-nums text-primary-contrast"
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
                <p className="font-jakarta text-[14px] leading-[1.62] text-text-muted">
                  {step.body}
                </p>
              </article>
            )),
            <div
              key="begin"
              className="relative flex flex-col justify-between overflow-hidden rounded-[22px] bg-[var(--dark-surface)] p-6"
              data-dark-band=""
            >
              <div
                aria-hidden="true"
                className="orb orb--accent pointer-events-none absolute -right-16 -top-16 h-48 w-48"
              />
              <p className="relative font-fraunces text-[19px] font-medium leading-snug text-on-dark">
                {finalCta.lead}
              </p>
              <Link
                to="/assessment"
                className="press group relative mt-6 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-pill bg-accent-strong px-5 py-3 text-center text-[14px] font-semibold leading-snug text-on-accent"
              >
                {journeyCopy.cta}
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>,
          ]}
        </Reveal>
      </CardRail>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-10 flex max-w-[820px] items-start gap-3 rounded-[18px] border border-[rgba(var(--primary-rgb),0.22)] bg-primary-soft px-5 py-4 font-jakarta text-[14px] leading-[1.65] text-primary-contrast">
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
    </SectionWrapper>
  );
}
