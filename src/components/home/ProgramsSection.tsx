import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { programs, programsCopy } from "@/data/content";
import { cn } from "@/lib/utils";

/**
 * Section 6 — Programs.
 *
 * Two rules from the brief shape this section, and both of them are about
 * what is NOT here.
 *
 * No prices. Not a "from", not a range, not a struck-through anchor. The
 * practice discusses cost privately after a discovery call, so every card
 * ends in "Explore", never "Buy" or "Enrol" — a price on this page would
 * commit the practice to a number before it knows who it is talking to.
 *
 * No long inclusion lists. Three points per card, because the brief puts the
 * detail on the program pages and a homepage card that tries to carry
 * everything ends up carrying nothing.
 *
 * The 3-Month Rebalance is the signature program and the brief asks for it to
 * be visually identifiable. It gets the accent border and the badge — not a
 * bigger cell, which would break the grid and make the other three look like
 * afterthoughts.
 */
export function ProgramsSection() {
  return (
    <SectionWrapper id="programs" bg="alt" labelledBy="programs-heading" arc="left">
      <SectionHeading
        id="programs-heading"
        align="center"
        eyebrow={programsCopy.eyebrow}
        title={programsCopy.title}
        subtitle={programsCopy.subtitle}
      />

      {/*
        The grid lives on the list; Reveal only staggers what is inside it.

        Reveal's stagger mode puts `display: contents` on its own wrapper so
        the animated boxes become the grid items directly — which means any
        grid classes handed to Reveal itself are cancelled by that `contents`.
        Passing the layout to a real <ul> and letting Reveal sit inside it
        keeps both: the list is the grid, and each card still rises on its own
        beat.
      */}
      <ul className="m-0 mt-14 grid list-none grid-cols-1 items-stretch gap-5 p-0 md:grid-cols-2 lg:gap-6">
        <Reveal stagger={0.08} childAs="li" childClassName="h-full">
          {programs.map((program) => (
            <article
              key={program.id}
              className={cn(
                "group relative flex h-full flex-col rounded-[26px] border bg-surface p-[30px_26px] transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[5px] sm:p-[34px_32px] surface-raise",
                program.signature
                  ? "border-[rgba(var(--accent-rgb),0.45)] shadow-[0_16px_44px_rgba(var(--accent-rgb),0.12)]"
                  : "border-border hover:border-primary/35",
              )}
            >
              {program.signature && (
                <span className="absolute -top-3 left-7 rounded-full bg-accent-strong px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-on-accent">
                  Signature Program
                </span>
              )}

              <h3 className="mb-3 font-fraunces text-[clamp(1.2rem,1.9vw,1.45rem)] font-medium leading-[1.3] text-text">
                {program.title}
              </h3>

              <p className="mb-6 font-jakarta text-[14.5px] leading-[1.7] text-text-muted">
                {program.summary}
              </p>

              <ul className="m-0 mb-7 flex list-none flex-col gap-2.5 p-0">
                {program.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <Check
                      aria-hidden="true"
                      className="mt-[3px] h-[15px] w-[15px] shrink-0 text-primary"
                    />
                    <span className="font-jakarta text-[14px] leading-[1.55] text-text">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              {program.note && (
                <p className="mb-6 font-fraunces text-[15px] font-medium italic text-primary-contrast">
                  {program.note}
                </p>
              )}

              {/* mt-auto so every card's action sits on the same line however
                  long the copy above it runs. */}
              <Link
                to="/assessment"
                className={cn(
                  "press mt-auto inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-pill text-[14.5px] font-semibold transition-colors",
                  program.signature
                    ? "bg-accent-strong text-on-accent"
                    : "border border-[rgba(var(--primary-rgb),0.32)] bg-transparent text-primary-contrast hover:bg-primary-soft",
                )}
              >
                {program.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </Reveal>
      </ul>
    </SectionWrapper>
  );
}
