import * as React from "react";
import { MinusCircle, ShieldCheck } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { Reveal } from "@/components/shared/Reveal";
import { whatToExpect, whatToExpectCopy } from "@/data/content";

/**
 * What the practice will and will not claim.
 *
 * This section used to be four large numbers: "500+ clients rebalanced since
 * 2018", "5 average client rating", "87% report symptom improvement by month
 * three", "6 average months to stable results", under a heading that called
 * them "measured honestly". Not one of them came from the practice. They were
 * invented, and on a page about client outcomes an invented outcome is not a
 * placeholder — it is the single most damaging thing a health practice can
 * publish.
 *
 * The practice's own brief forbids exactly this: no guaranteed outcomes, no
 * invented client results, and "individual results may vary" as the preferred
 * language. So the numbers are gone and what stands in their place is the
 * thing a visitor actually needs before reading anybody's story — a plain
 * statement of what is and is not being promised.
 */
export function ResultsStats() {
  return (
    <SectionWrapper id="results" bg="base" labelledBy="results-heading" size="sm">
      <div className="mx-auto max-w-[820px]">
        <Reveal>
          <p className="fs-eyebrow mb-5 text-center text-primary-contrast">
            {whatToExpectCopy.eyebrow}
          </p>
          <h2 id="results-heading" className="fs-h3 mb-10 text-center text-text">
            {whatToExpectCopy.title.split(/(\*[^*]+\*)/g).map((part, i) =>
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

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          <Reveal stagger={0.07} childAs="li" childClassName="h-full">
            {whatToExpect.map((item) => (
              <div
                key={item.title}
                className="flex h-full items-start gap-3.5 rounded-[20px] border border-border bg-surface p-[22px_20px]"
              >
                <MinusCircle
                  aria-hidden="true"
                  className="mt-[3px] h-[18px] w-[18px] shrink-0 text-accent"
                />
                <div className="min-w-0">
                  <h3 className="mb-1.5 font-fraunces text-[16px] font-medium leading-snug text-text">
                    {item.title}
                  </h3>
                  <p className="font-jakarta text-[14px] leading-[1.6] text-text-muted">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </ul>

        <Reveal delay={0.14}>
          <div className="mt-9 flex items-start gap-3.5 rounded-[20px] border border-[rgba(var(--primary-rgb),0.22)] bg-primary-soft p-[20px_22px]">
            <ShieldCheck
              aria-hidden="true"
              className="mt-[2px] h-[19px] w-[19px] shrink-0 text-primary"
            />
            <p className="font-jakarta text-[14.5px] leading-[1.68] text-primary-contrast">
              {whatToExpectCopy.promise}
            </p>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
