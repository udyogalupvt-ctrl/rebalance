import { Link } from "@tanstack/react-router";
import * as React from "react";
import { CheckCircle2, MinusCircle, Info } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CurveDivider } from "@/components/shared/CurveDivider";
import { programInclusions, consultationTiers } from "@/data/content";
import { cn } from "@/lib/utils";
import { AutoScroller } from "@/components/shared/AutoScroller";

export function WhatsIncluded() {
  return (
    <>
      <CurveDivider fill="alt" />
      <SectionWrapper arc="left" id="whats-included" bg="alt" labelledBy="included-heading">
        {/* Decorative Glow */}
        <div
          className="absolute right-0 bottom-0 w-[560px] h-[560px] bg-primary/4 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />

        <div className="mb-16 lg:mb-12">
          <SectionHeading
            align="center"

            eyebrow="WHAT YOU GET"
            title="Every program includes the *same* foundation."
            subtitle="The protocol changes with your condition. What doesn't change is how thoroughly it's built and how closely it's followed."
          />
        </div>

        {/* Inclusions Grid */}
        <div className="md:hidden -mx-5 px-5">
          <AutoScroller
            label="What every program includes"
            speed={22}
            gap="14px"
            itemWidth="min(78vw, 320px)"
          >
            {programInclusions.map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="group h-full bg-surface border border-border rounded-[20px] p-[22px_20px] sm:p-[26px_24px] flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_30px_rgba(var(--primary-rgb), 0.08)]">
                  <div className="w-11 h-11 rounded-[13px] bg-primary-soft flex items-center justify-center mb-[18px] transition-colors duration-300 group-hover:bg-primary">
                    <item.icon className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="font-fraunces font-medium text-[17px] text-text mb-[9px]">
                    {item.title}
                  </h3>
                  <p className="text-[14.5px] leading-[1.65] text-text-muted flex-grow">
                    {item.description}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </AutoScroller>
        </div>

        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-[22px] xl:gap-6 items-stretch">
          {programInclusions.map((item, idx) => (
            <Reveal key={idx} delay={idx * 0.07}>
              <div className="group h-full bg-surface border border-border rounded-[20px] p-[22px_20px] sm:p-[26px_24px] flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_30px_rgba(var(--primary-rgb), 0.08)]">
                <div className="w-11 h-11 rounded-[13px] bg-primary-soft flex items-center justify-center mb-[18px] transition-colors duration-300 group-hover:bg-primary">
                  <item.icon className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-white" />
                </div>
                <h3 className="font-fraunces font-medium text-[17px] text-text mb-[9px]">
                  {item.title}
                </h3>
                <p className="text-[14.5px] leading-[1.65] text-text-muted flex-grow">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Consultation Tiers */}
        <div className="mt-[72px] lg:mt-[56px]">
          <div className="text-center mb-10">
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              CONSULTATION OPTIONS
            </span>
            <h3 className="font-fraunces font-medium text-[clamp(1.375rem,2.4vw,1.875rem)] text-text mt-3">
              Start with one consultation, or commit to the full program.
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[18px] lg:gap-6 items-stretch max-w-[520px] lg:max-w-none mx-auto lg:mx-0 pt-3">
            <Reveal stagger={0.09}>
              {consultationTiers.map((tier) => (
                <TierCard key={tier.id} tier={tier} />
              ))}
            </Reveal>
          </div>

          <div className="mt-[26px] text-center max-w-[640px] mx-auto">
            <div className="inline-flex items-center gap-2 text-[13.5px] text-text-muted leading-relaxed">
              <Info className="w-[15px] h-[15px] text-accent flex-shrink-0" />
              <p>
                Program duration and fees vary by condition and are confirmed after your assessment
                is reviewed. Nothing is charged before you know exactly what your plan involves.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}

function TierCard({ tier }: { tier: (typeof consultationTiers)[number] }) {
  return (
    <div
      className={cn(
        "relative flex flex-col bg-surface border rounded-[24px] p-[26px_22px] sm:p-[32px_28px] h-full transition-transform duration-500",
        tier.isFeatured
          ? "border-primary border-[1.5px] bg-gradient-to-b from-primary-soft/40 to-surface z-10"
          : "border-border",
      )}
    >
      {tier.isFeatured && (
        <div className="absolute top-[-13px] left-1/2 -translate-x-1/2 bg-accent-strong text-on-accent text-[12px] font-semibold uppercase tracking-[0.1em] px-4 py-1.5 rounded-full shadow-[0_6px_18px_rgba(var(--accent-rgb), 0.3)] whitespace-nowrap z-20">
          MOST CHOSEN
        </div>
      )}

      <h3 className="font-fraunces font-medium text-[clamp(1.125rem,1.6vw,1.3125rem)] text-text mb-2">
        {tier.name}
      </h3>
      <p className="text-[14px] leading-[1.55] text-text-muted mb-[22px] min-h-[44px]">
        {tier.description}
      </p>

      <div className="mb-6">
        <div className="font-fraunces font-medium text-[clamp(1.75rem,3vw,2.25rem)] text-primary leading-none mb-1">
          {tier.price}
        </div>
        <div className="text-[13px] text-text-muted">{tier.priceSubtitle}</div>
      </div>

      <div className="w-full h-px bg-border mb-6" />

      <ul className="flex flex-col gap-3 flex-grow list-none p-0 m-0">
        {tier.included.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-[11px]">
            <CheckCircle2 className="w-[17px] h-[17px] text-primary mt-0.5 flex-shrink-0" />
            <span className="text-[14.5px] leading-[1.6] text-text-muted">{feature}</span>
          </li>
        ))}
        {tier.excluded.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-[11px]">
            <MinusCircle className="w-[17px] h-[17px] text-text-muted mt-0.5 flex-shrink-0 opacity-60" />
            <span className="text-[14.5px] leading-[1.6] text-text-muted line-through decoration-border">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link
        to="/assessment"
        className={cn(
          "mt-7 w-full h-[52px] rounded-full font-semibold text-[15px] inline-flex items-center justify-center transition-all duration-300",
          tier.isFeatured
            ? "bg-accent-strong text-on-accent shadow-[0_8px_20px_rgba(var(--accent-rgb), 0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(var(--accent-rgb), 0.4)]"
            : "border-[1.5px] border-primary text-primary hover:bg-primary-soft",
        )}
        aria-label={tier.cta}
      >
        Get Started
      </Link>
    </div>
  );
}
