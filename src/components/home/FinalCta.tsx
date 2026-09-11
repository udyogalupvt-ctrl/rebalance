import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
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
 */
export function FinalCta() {
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
            <h2 id="final-cta-heading" className="fs-h2 mb-6 text-on-dark">
              {finalCta.title.split(/(\*[^*]+\*)/g).map((part, i) =>
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
              {finalCta.body}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <Link
              to="/assessment"
              className="press group inline-flex h-[58px] items-center justify-center gap-2.5 rounded-pill bg-accent-strong px-9 font-semibold text-on-accent shadow-[0_12px_32px_rgba(var(--accent-rgb),0.32)]"
            >
              {finalCta.cta}
              <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          {/* What happens next, in three steps. No prices, and no payment —
              the brief routes cost through the discovery call. */}
          <Reveal delay={0.28}>
            <ol className="m-0 mt-12 flex list-none flex-col items-center justify-center gap-3 p-0 sm:flex-row sm:gap-0">
              {finalCta.steps.map((step, i) => (
                <li key={step} className="flex items-center gap-3 sm:gap-0">
                  <span className="rounded-pill border border-on-dark-border bg-on-dark-glass px-4 py-2 font-jakarta text-[13px] font-medium text-on-dark backdrop-blur-xl">
                    {step}
                  </span>
                  {i < finalCta.steps.length - 1 && (
                    <ArrowRight
                      aria-hidden="true"
                      className="mx-2 hidden h-[15px] w-[15px] shrink-0 text-on-dark-faint sm:block"
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
