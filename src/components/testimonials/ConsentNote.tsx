import * as React from "react";
import { PillRail } from "@/components/shared/AutoScroller";
import { ShieldCheck, FileCheck, UserCheck, Ban } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CurveDivider } from "@/components/shared/CurveDivider";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

export function ConsentNote() {
  return (
    <>
      <CurveDivider fill="alt" />
      <SectionWrapper id="consent" bg="alt">
        <div className="max-w-[860px] mx-auto">
          <Reveal>
            <div className="bg-surface border border-border rounded-[24px] p-[28px_24px] sm:p-[36px_40px]">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                {/* Icon Square */}
                <div className="w-[56px] h-[56px] shrink-0 rounded-[16px] bg-primary-soft flex items-center justify-center">
                  <ShieldCheck className="w-[26px] h-[26px] text-primary" />
                </div>

                {/* Text Content.

                    `w-full` is the load-bearing one. The parent is
                    `flex-col items-center` on a phone, and centring along the
                    cross axis means children size to fit-content rather than
                    stretching to the container. Once this column held a
                    horizontally scrolling chip rail, fit-content was the full
                    unwrapped width of that rail: the column grew to 499px
                    inside a 300px card and took the heading and both
                    paragraphs off the edge of the screen with it.

                    A definite width takes the decision away from content
                    measurement. `min-w-0` is kept for the sm:flex-row case,
                    where this is a real flex item that must be able to shrink
                    below its min-content. */}
                <div className="w-full min-w-0 flex-1">
                  <h2
                    className="font-fraunces font-medium text-text mb-3"
                    style={{ fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)" }}
                  >
                    Every story here is real, and shared with permission.
                  </h2>

                  <div className="flex flex-col gap-[14px]">
                    <p className="text-[14.5px] leading-[1.72] text-text-muted max-w-[62ch] mx-auto sm:mx-0">
                      Each testimonial on this page comes from a client who completed a program and
                      gave written consent for their words to be published. Names may be shortened
                      and photographs are used only where explicitly permitted. Nothing here is
                      scripted, incentivised or written on a client's behalf.
                    </p>
                    <p className="text-[14.5px] leading-[1.72] text-text-muted max-w-[62ch] mx-auto sm:mx-0">
                      Results described are individual. Nutrition outcomes depend on your condition,
                      medical history, medications and adherence — and no program can promise the
                      same timeline for everyone. What can be promised is an honest assessment of
                      what nutrition can and cannot address in your case.
                    </p>
                  </div>

                  {/* Trust Markers */}
                  {/* Three short assurances that wrapped to three rows at
                      360px. One drifting line says the same thing in a third
                      of the height. */}
                  <div className="mt-[22px]">
                    <PillRail
                      label="How these stories are collected"
                      className="justify-center sm:justify-start"
                    >
                      {[
                        { icon: FileCheck, label: "Written consent on file" },
                        { icon: UserCheck, label: "Verified clients" },
                        { icon: Ban, label: "No incentivised reviews" },
                      ].map((marker, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-[6px] whitespace-nowrap rounded-full border border-border bg-surface-alt px-[13px] py-[6px] text-[12.5px] font-medium text-text-muted"
                        >
                          <marker.icon className="h-[14px] w-[14px] text-primary" />
                          <span>{marker.label}</span>
                        </span>
                      ))}
                    </PillRail>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        {/* Confirm with the client that written consent has been obtained for every published testimonial before launch. This is both an ethical and a regulatory requirement in health advertising. */}
      </SectionWrapper>
    </>
  );
}
