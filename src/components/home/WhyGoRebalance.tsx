import * as React from "react";
import { Quote } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { Reveal } from "@/components/shared/Reveal";
import { CardRail } from "@/components/shared/CardRail";
import { whyGoRebalance, whyGoRebalanceCopy } from "@/data/content";
import { OWN } from "@/data/images";

/**
 * Why Go Rebalance? — four reasons, and the founder's own words.
 *
 * The heading and the quote hold their place on the left while the reasons
 * sit in a two-by-two on the right; on a phone the four become a swipeable
 * row and the quote follows them. The quote is attributed and set on its own
 * card because it is the most honest sentence on the page — that guidance
 * only goes so far, and the change is the client's own — and burying it
 * inside a list would waste it.
 */
function renderTitle(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} className="italic text-accent-contrast">
        {part.slice(1, -1)}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

function FounderQuote({ className }: { className?: string }) {
  return (
    <figure
      className={`relative m-0 overflow-hidden rounded-[26px] border border-[rgba(var(--accent-rgb),0.3)] bg-surface p-7 shadow-[0_18px_48px_rgba(var(--shadow-rgb),0.1)] ${className ?? ""}`}
    >
      <Quote aria-hidden="true" className="mb-4 h-8 w-8 text-accent" />
      <blockquote className="m-0">
        <p className="font-fraunces text-[clamp(1.05rem,1.7vw,1.2rem)] font-medium italic leading-[1.55] text-text">
          {whyGoRebalanceCopy.pull}
        </p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3.5 border-t border-border pt-5">
        <img
          src={OWN.practitionerSmall}
          width={640}
          height={853}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-12 w-12 shrink-0 rounded-full border border-border object-cover object-[50%_14%]"
        />
        <span className="min-w-0">
          <span className="block font-jakarta text-[14.5px] font-semibold text-text">
            {whyGoRebalanceCopy.pullName}
          </span>
          <span className="block font-jakarta text-[13px] text-text-muted">
            {whyGoRebalanceCopy.pullRole}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function WhyGoRebalance() {
  return (
    <SectionWrapper id="why" bg="base" labelledBy="why-heading">
      <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16 xl:gap-20">
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <Reveal>
            <p className="fs-eyebrow mb-5 text-primary-contrast">{whyGoRebalanceCopy.eyebrow}</p>
            <h2 id="why-heading" className="fs-h2 mb-5 text-text">
              {renderTitle(whyGoRebalanceCopy.title)}
            </h2>
            <p className="fs-sub max-w-[46ch] text-text-muted">{whyGoRebalanceCopy.subtitle}</p>
          </Reveal>

          {/* On a wide screen the quote sits under the heading. */}
          <Reveal delay={0.1} className="mt-9 hidden lg:block">
            <FounderQuote />
          </Reveal>
        </div>

        <div className="min-w-0">
          <CardRail
            count={whyGoRebalance.length}
            label="Why Go Rebalance"
            className="md:grid md:grid-cols-2 md:gap-5"
          >
            <Reveal stagger={0.07} childAs="li">
              {whyGoRebalance.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="relative flex flex-col overflow-hidden rounded-[24px] border border-border bg-surface p-7 surface-raise"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute right-6 top-5 font-fraunces text-[40px] font-medium leading-none text-[rgba(var(--primary-rgb),0.12)]"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mb-6 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[15px] bg-primary-soft"
                    >
                      <Icon size={20} className="text-primary" />
                    </span>
                    <h3 className="mb-2.5 font-fraunces text-[clamp(1.05rem,1.6vw,1.2rem)] font-medium leading-snug text-text">
                      {item.title}
                    </h3>
                    <p className="font-jakarta text-[14.5px] leading-[1.68] text-text-muted">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </Reveal>
          </CardRail>

          {/* Below lg the quote follows the reasons. */}
          <Reveal delay={0.1} className="mt-8 lg:hidden">
            <FounderQuote />
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
