import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { Magnetic } from "@/components/shared/scroll/effects";
import { finalCta } from "@/data/content";

/**
 * Section 13 — the closing call to action.
 *
 * The brief's own framing does the work here: "You don't need to know which
 * program is right for you." That sentence removes the one decision that
 * stops people filling in a form on a site with four programs and no prices,
 * so it is set as the lead rather than buried under the heading.
 *
 * The three-step flow underneath is a promise about what happens next, and it
 * matters because the assessment is a form asking for health information. A
 * visitor is far more likely to complete it when they can see it leads to a
 * conversation rather than straight to a payment screen.
 *
 * INTERACTION: one button that leans towards the cursor, and nothing else.
 *
 * This is the page's conversion moment and the last thing between the reader
 * and the form, so it gets the least movement of any section on the site. The
 * reader has just come through two pinned set-pieces; what they need here is
 * a target that holds still. The magnetic pull is only a few pixels, only on
 * a mouse, and it never moves the button out from under the pointer — it is
 * there to make the control feel answerable, not to be noticed.
 */
interface FinalCtaProps {
  /** Override the heading, e.g. the About page's "Ready to Begin Your Rebalance?". */
  title?: string;
  body?: string;
}

export function FinalCta({ title = finalCta.title, body = finalCta.body }: FinalCtaProps = {}) {
  return (
    <section
      id="start"
      aria-labelledby="final-cta-heading"
      data-dark-band=""
      className="render-on-approach relative isolate w-full overflow-hidden bg-[var(--dark-surface)]"
      style={{ paddingBlock: "clamp(80px, 9.5vw, 128px)" }}
    >
      {/* Edge ramps: a full-bleed dark band meeting porcelain along a 1px
          border is a seam. These lift the band's colour towards the page over
          ~72px at both edges so the page dims into it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[72px] bg-[linear-gradient(to_bottom,rgba(var(--bg-rgb),0.28),transparent)] md:h-[96px]"
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb orb--strong absolute -left-[15%] -top-[30%] h-[620px] w-[620px]" />
        <div className="orb orb--accent absolute -right-[10%] bottom-[-25%] h-[520px] w-[520px]" />
      </div>

      <div className="container-x relative z-10">
        <div className="mx-auto max-w-[760px] text-center">
          <Reveal>
            <p className="fs-eyebrow mb-5 text-on-dark-accent">{finalCta.eyebrow}</p>
            <h2 id="final-cta-heading" className="fs-h2 mb-6 text-on-dark">
              {title.split(/(\*[^*]+\*)/g).map((part, i) =>
                part.startsWith("*") && part.endsWith("*") ? (
                  <span key={i} className="italic text-on-dark-accent">
                    {part.slice(1, -1)}
                  </span>
                ) : (
                  <React.Fragment key={i}>{part}</React.Fragment>
                ),
              )}
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mx-auto mb-4 max-w-[42ch] text-balance font-fraunces text-[clamp(1.1rem,2vw,1.35rem)] font-medium italic text-on-dark">
              {finalCta.lead}
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mx-auto mb-10 max-w-[56ch] text-balance font-jakarta text-[15.5px] leading-[1.7] text-on-dark-muted">
              {body}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <Magnetic strength={7}>
              <Link
                to="/assessment"
                className="press group inline-flex h-[58px] items-center justify-center gap-2.5 rounded-pill bg-accent-strong px-9 font-semibold text-on-accent shadow-[0_12px_32px_rgba(var(--accent-rgb),0.32)]"
              >
                {finalCta.cta}
                <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </Reveal>

          {/* What happens next, in three steps. No prices, and no payment —
              the brief routes cost through the discovery call. */}
          <Reveal delay={0.28}>
            <p className="mt-12 font-jakarta text-[11.5px] font-semibold uppercase tracking-[0.14em] text-on-dark-faint">
              {finalCta.flowLabel}
            </p>
            {/*
              One horizontal line on every screen, scrollable on a phone.

              These three used to stack into a column below sm, which cost
              about 120px of height at the very bottom of the page to say
              something the reader mostly skims. Laid end to end they are wider
              than a 390px screen, so the row scrolls — but it does NOT
              auto-loop like the hero's chips do. This is a sequence with a
              first step and a last one, and a sequence that quietly cycles
              back to the beginning tells the reader something untrue about
              the process. The arrows stay for the same reason.
            */}
            <ol className="no-scrollbar -mx-5 mt-4 flex list-none items-center gap-0 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
              {finalCta.steps.map((step, i) => (
                <li key={step} className="flex shrink-0 items-center">
                  <span className="whitespace-nowrap rounded-pill border border-on-dark-border bg-on-dark-glass px-4 py-2 font-jakarta text-[13px] font-medium text-on-dark">
                    {step}
                  </span>
                  {i < finalCta.steps.length - 1 && (
                    <ArrowRight
                      aria-hidden="true"
                      className="mx-2 h-[15px] w-[15px] shrink-0 text-on-dark-faint"
                    />
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
