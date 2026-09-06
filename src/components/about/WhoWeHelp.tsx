import * as React from "react";
import * as Icons from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { whoWeHelp, whoWeHelpCopy } from "@/data/content";
import { resolveIcon } from "@/lib/icons";
import { AutoScroller } from "@/components/shared/AutoScroller";

export function WhoWeHelp() {
  return (
    <SectionWrapper id="who-we-help" bg="alt" labelledBy="who-we-help-heading">
      {/* Decorative accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-accent opacity-[0.04] blur-[140px]"
      />

      <SectionHeading
        align="center"
        eyebrow={whoWeHelpCopy.eyebrow}
        title={whoWeHelpCopy.title}
        subtitle={whoWeHelpCopy.subtitle}
      />

      <div className="sm:hidden -mx-5 px-5">
        <AutoScroller label="Who we help" speed={22} gap="14px" itemWidth="min(78vw, 320px)">
          {whoWeHelp.map((item) => {
            const Icon = resolveIcon(item.icon);
            return (
              <li key={item.title} className="h-full">
                <div className="group h-full flex flex-col bg-surface border border-border rounded-[22px] p-5 sm:p-[30px_26px] transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[5px] hover:border-primary/35 hover:shadow-[0_14px_36px_rgba(var(--primary-rgb), 0.09)]">
                  <div
                    aria-hidden="true"
                    className="w-[52px] h-[52px] rounded-[15px] bg-primary-soft flex items-center justify-center mb-[22px] transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-primary group-hover:rotate-[6deg]"
                  >
                    <Icon
                      size={22}
                      className="text-primary transition-colors duration-300 group-hover:text-white"
                    />
                  </div>
                  <h3
                    className="font-fraunces font-medium text-text mb-[10px] leading-snug"
                    style={{ fontSize: "clamp(1.0625rem, 1.4vw, 1.1875rem)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="font-jakarta text-[14.5px] leading-[1.65] text-text-muted flex-grow">
                    {item.body}
                  </p>
                </div>
              </li>
            );
          })}
        </AutoScroller>
      </div>

      <Reveal
        as="ul"
        stagger={0.07}
        className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 items-stretch list-none p-0 m-0"
      >
        {whoWeHelp.map((item) => {
          const Icon = resolveIcon(item.icon);
          return (
            <li key={item.title} className="h-full">
              <div className="group h-full flex flex-col bg-surface border border-border rounded-[22px] p-5 sm:p-[30px_26px] transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[5px] hover:border-primary/35 hover:shadow-[0_14px_36px_rgba(var(--primary-rgb), 0.09)]">
                <div
                  aria-hidden="true"
                  className="w-[52px] h-[52px] rounded-[15px] bg-primary-soft flex items-center justify-center mb-[22px] transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-primary group-hover:rotate-[6deg]"
                >
                  <Icon
                    size={22}
                    className="text-primary transition-colors duration-300 group-hover:text-white"
                  />
                </div>
                <h3
                  className="font-fraunces font-medium text-text mb-[10px] leading-snug"
                  style={{ fontSize: "clamp(1.0625rem, 1.4vw, 1.1875rem)" }}
                >
                  {item.title}
                </h3>
                <p className="font-jakarta text-[14.5px] leading-[1.65] text-text-muted flex-grow">
                  {item.body}
                </p>
              </div>
            </li>
          );
        })}
      </Reveal>

      <Reveal>
        <p className="mt-11 text-center text-[15px] leading-[1.65] text-text-muted max-w-[620px] mx-auto">
          {whoWeHelpCopy.closing}
        </p>
      </Reveal>
    </SectionWrapper>
  );
}
