import { Link } from "@tanstack/react-router";
import * as React from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion, useInView } from "framer-motion";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CurveDivider } from "@/components/shared/CurveDivider";
import { programJourney } from "@/data/content";
import { cn } from "@/lib/utils";
import type { JourneyPhase } from "@/types/content";

export function ProgramJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.55"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
  });

  return (
    <>
      <CurveDivider fill="base" flip />
      <SectionWrapper id="journey" bg="base" labelledBy="journey-heading">
        {/* Decorative Dot Grid */}
        <div
          className="absolute inset-0 h-[35%] w-full opacity-5 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle, var(--primary) 3px, transparent 3px)`,
            backgroundSize: "26px 26px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />

        <div className="mb-16 lg:mb-12 relative z-10">
          <SectionHeading
            align="center"
            eyebrow="THE PROGRAM JOURNEY"
            title="What the first six months actually *look like*."
            subtitle="This is the shape of a typical program. Yours will move faster or slower depending on what we find — but nothing here is skipped."
          />
        </div>

        <div ref={containerRef} className="relative max-w-[860px] mx-auto mt-16 lg:mt-[72px]">
          {/* Timeline Spine */}
          <div
            aria-hidden="true"
            className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[2px] bg-border -translate-x-1/2"
          >
            {!isReducedMotion && (
              <motion.div className="absolute inset-0 bg-primary origin-top" style={{ scaleY }} />
            )}
            {isReducedMotion && <div className="absolute inset-0 bg-primary" />}
          </div>

          {/* Phases */}
          <ol className="relative flex flex-col gap-10 md:gap-14 p-0 m-0 list-none">
            {programJourney.map((phase, idx) => (
              <TimelineEntry key={phase.title} phase={phase} index={idx} />
            ))}
          </ol>

          {/* Closing CTA */}
          <div className="mt-16 lg:mt-[64px] text-center relative z-10">
            <h4 className="fs-h4 text-text mb-5">Phase zero takes about ten minutes.</h4>
            <Link
              to="/assessment"
              className="h-[54px] px-8 rounded-full bg-accent-strong text-on-accent font-semibold text-[15px] inline-flex items-center justify-center transition-all hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(var(--accent-rgb), 0.3)] hover:shadow-[0_12px_24px_rgba(var(--accent-rgb), 0.4)]"
            >
              Begin My Assessment →
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}

function TimelineEntry({ phase, index }: { phase: JourneyPhase; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLLIElement>(null);
  // Scroll-progress thresholds meant later phases often never activated on
  // short viewports, and inactive entries dropped to 0.4 opacity, which put
  // their body copy well under 4.5:1. Per-entry in-view activation is reliable
  // at any viewport height and any number of phases.
  const inView = useInView(ref, { once: true, margin: "-96px 0px -96px 0px" });
  const isRight = index % 2 === 1;

  return (
    <li ref={ref} className="relative grid grid-cols-1 md:grid-cols-2 md:items-center">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "pl-[72px] md:pl-0",
          isRight ? "md:order-2 md:pl-14" : "md:order-1 md:pr-14 md:text-right",
        )}
      >
        <div
          className={cn(
            "group inline-block w-full bg-surface border border-border rounded-[22px] p-[22px_20px] sm:p-[26px_24px]",
            "transition-all duration-300 hover:border-primary/30 hover:-translate-y-[3px]",
            "hover:shadow-[0_12px_30px_rgba(var(--primary-rgb),0.08)]",
          )}
        >
          <span className="fs-eyebrow text-accent-contrast block mb-2.5">{phase.phase}</span>
          <h3 className="fs-h4 text-text mb-2.5">{phase.title}</h3>
          <p className="text-[14.5px] leading-[1.68] text-text-muted">{phase.description}</p>

          {phase.chips && (
            <div className={cn("flex flex-wrap gap-2 mt-4", !isRight && "md:justify-end")}>
              {phase.chips.map((chip: string) => (
                <span
                  key={chip}
                  className="text-[12px] font-medium text-text-muted bg-surface-alt border border-border px-[11px] py-[5px] rounded-full"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Node — sits on the spine: hard left on mobile, centred from md up. */}
      <div className="absolute left-[30px] md:left-1/2 top-7 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-10">
        <motion.div
          initial={reduce ? false : { scale: 0.6 }}
          animate={inView ? { scale: 1 } : { scale: 0.6 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className={cn(
            "grid place-items-center w-11 h-11 md:w-[52px] md:h-[52px] rounded-full border-2 font-fraunces font-medium text-[17px] transition-colors duration-300",
            inView
              ? "bg-primary-strong border-primary-strong text-on-primary shadow-[0_0_0_8px_rgba(var(--primary-rgb),0.10)]"
              : "bg-surface border-border-input text-primary-contrast",
          )}
        >
          {index + 1}
        </motion.div>
      </div>

      {/* Reserves the opposite column from md up */}
      <div className={cn("hidden md:block", isRight ? "order-1" : "order-2")} aria-hidden="true" />
    </li>
  );
}
