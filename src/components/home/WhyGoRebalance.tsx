import * as React from "react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { Reveal } from "@/components/shared/Reveal";
import { whyGoRebalance, whyGoRebalanceCopy } from "@/data/content";

/**
 * Section 7 — Why Go Rebalance?
 *
 * Five points again, and again a grid would strand two of them on a second
 * row. Here they are a list instead: a heading that holds its position on the
 * left while the five reasons pass on the right. That solves the count, and
 * it changes the page's rhythm at the point where three card grids in a row
 * would otherwise start to feel like a template.
 *
 * The closing line is the founder speaking in the first person, which is why
 * it is attributed and set apart. It is also the most honest sentence on the
 * page — that guidance only goes so far — and burying it in a card would
 * waste it.
 */
export function WhyGoRebalance() {
  return (
    <SectionWrapper id="why" bg="base" labelledBy="why-heading">
      <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20 xl:gap-24">
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <Reveal>
            <p className="fs-eyebrow mb-5 text-primary-contrast">{whyGoRebalanceCopy.eyebrow}</p>
            <h2 id="why-heading" className="fs-h2 mb-7 text-text">
              {whyGoRebalanceCopy.title.split(/(\*[^*]+\*)/g).map((part, i) =>
                part.startsWith("*") && part.endsWith("*") ? (
                  <span key={i} className="italic text-accent-contrast">
                    {part.slice(1, -1)}
                  </span>
                ) : (
                  <React.Fragment key={i}>{part}</React.Fragment>
                ),
              )}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <blockquote className="m-0 max-w-[46ch] border-l-2 border-accent pl-5">
              <p className="font-fraunces text-[clamp(1.05rem,1.7vw,1.2rem)] font-medium italic leading-[1.55] text-text">
                {whyGoRebalanceCopy.pull}
              </p>
            </blockquote>
          </Reveal>
        </div>

        {/* A hairline between entries rather than five separate card boxes:
            the point is that these five belong together. The rule sits on the
            animated <li> itself, so `first:` means the first reason rather
            than the first child of some wrapper. */}
        <ul className="m-0 flex list-none flex-col gap-0 p-0">
          <Reveal
            stagger={0.07}
            childAs="li"
            childClassName="border-t border-border py-7 first:border-t-0 first:pt-0"
          >
            {whyGoRebalance.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-5">
                  <span
                    aria-hidden="true"
                    className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[13px] bg-primary-soft"
                  >
                    <Icon size={19} className="text-primary" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="mb-2 font-fraunces text-[clamp(1.05rem,1.6vw,1.2rem)] font-medium leading-snug text-text">
                      {item.title}
                    </h3>
                    <p className="max-w-[56ch] font-jakarta text-[14.5px] leading-[1.68] text-text-muted">
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </ul>
      </div>
    </SectionWrapper>
  );
}
