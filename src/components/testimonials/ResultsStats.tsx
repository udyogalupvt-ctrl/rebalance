import * as React from "react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CountUp } from "@/components/shared/CountUp";
import { Star, Info } from "lucide-react";

export function ResultsStats() {
  return (
    <SectionWrapper id="results" bg="base" className="py-[clamp(56px,7vw,88px)]">
      <div className="relative overflow-hidden rounded-[28px] border border-border bg-surface px-6 py-8 md:px-10 md:py-11">
        <div
          className="absolute -right-[120px] -top-[120px] h-[480px] w-[480px] rounded-full bg-primary/5 blur-[140px]"
          aria-hidden="true"
        />

        <div className="relative z-10 text-center mb-9">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            BY THE NUMBERS
          </p>
          <h2 className="font-fraunces font-medium text-[clamp(1.375rem,2.4vw,1.875rem)] text-text mt-3">
            Eight years of practice, measured honestly.
          </h2>
        </div>

        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6">
          {[
            { value: 500, suffix: "+", label: "Clients rebalanced since 2018" },
            { value: 4.9, label: "Average client rating", isStar: true },
            { value: 87, suffix: "%", label: "Report symptom improvement by month three" },
            { value: 6, label: "Average months to stable results" },
          ].map((stat, i) => (
            <div key={i} className="relative flex flex-col items-center">
              <div className="font-fraunces font-medium text-[clamp(2rem,4vw,3rem)] text-primary leading-none flex items-center">
                <CountUp value={stat.value} suffix={stat.suffix || ""} />
                {stat.isStar && <Star className="w-4 h-4 ml-1 fill-accent text-accent" />}
              </div>
              <p className="text-[13.5px] text-text-muted mt-2 max-w-[20ch] leading-[1.45]">
                {stat.label}
              </p>
              {i < 3 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block h-12 w-px bg-border" />
              )}
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-8 flex justify-center items-center gap-2 text-[13px] text-text-muted max-w-[640px] mx-auto text-center">
          <Info className="w-4 h-4 opacity-60 shrink-0" />
          <p>
            Figures reflect clients who completed a full program. Individual results vary with
            condition, adherence and medical history.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
// VERIFY THESE FIGURES with the client before launch. Health-sector claims must be accurate and substantiable.
