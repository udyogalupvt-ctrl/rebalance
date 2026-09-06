import * as React from "react";
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

                {/* Text Content */}
                <div className="flex-1">
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
                  <div className="mt-[22px] flex flex-wrap justify-center sm:justify-start gap-[10px]">
                    {[
                      { icon: FileCheck, label: "Written consent on file" },
                      { icon: UserCheck, label: "Verified clients" },
                      { icon: Ban, label: "No incentivised reviews" },
                    ].map((marker, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-[6px] px-[13px] py-[6px] rounded-full bg-surface-alt border border-border text-[12.5px] font-medium text-text-muted"
                      >
                        <marker.icon className="w-[14px] h-[14px] text-primary" />
                        <span>{marker.label}</span>
                      </div>
                    ))}
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
