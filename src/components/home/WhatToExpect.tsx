import * as React from "react";
import { MinusCircle, Stethoscope } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { whatToExpect, whatToExpectCopy, beyondNutrition } from "@/data/content";

/**
 * Sections 8 and 9 — What You Can Expect, and When Nutrition Isn't Enough.
 *
 * These two run together because they are the same argument. Four things the
 * practice will not claim, then the line about when to look past nutrition
 * altogether.
 *
 * This is the section most practices leave out, and leaving it out is what
 * makes the rest of a health site read as sales copy. A page that says
 * plainly "no guaranteed outcomes" and "this does not replace medical care"
 * earns the right to be believed everywhere else, so it is set as prominently
 * here as the programs are — not shrunk into a disclaimer.
 *
 * The boundary note is small but visible, exactly as the brief asks: its own
 * bordered band under the four, not a footnote.
 */
export function WhatToExpect() {
  return (
    <SectionWrapper id="expectations" bg="alt" labelledBy="expectations-heading" arc="center">
      <SectionHeading
        id="expectations-heading"
        align="center"
        eyebrow={whatToExpectCopy.eyebrow}
        title={whatToExpectCopy.title}
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
      <ul className="m-0 mt-14 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:gap-6">
        <Reveal stagger={0.07} childAs="li" childClassName="h-full">
          {whatToExpect.map((item) => (
            <div
              key={item.title}
              className="flex h-full items-start gap-4 rounded-[22px] border border-border bg-surface p-[26px_24px]"
            >
              <MinusCircle
                aria-hidden="true"
                className="mt-[3px] h-[19px] w-[19px] shrink-0 text-accent"
              />
              <div className="min-w-0">
                <h3 className="mb-2 font-fraunces text-[17px] font-medium leading-snug text-text">
                  {item.title}
                </h3>
                <p className="font-jakarta text-[14.5px] leading-[1.65] text-text-muted">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </ul>

      <Reveal delay={0.12}>
        <p className="mx-auto mt-12 max-w-[62ch] text-balance text-center font-fraunces text-[clamp(1.1rem,2vw,1.35rem)] font-medium leading-[1.45] text-text">
          {whatToExpectCopy.promise}
        </p>
      </Reveal>

      {/* Section 9 — small, but visible. */}
      <Reveal delay={0.18}>
        <div className="mx-auto mt-14 flex max-w-[760px] flex-col items-start gap-4 rounded-[22px] border border-[rgba(var(--primary-rgb),0.24)] bg-primary-soft p-[24px_26px] sm:flex-row sm:items-center sm:gap-6">
          <span
            aria-hidden="true"
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px] bg-surface"
          >
            <Stethoscope size={20} className="text-primary" />
          </span>
          <div className="min-w-0">
            <h3 className="mb-1.5 font-fraunces text-[17px] font-medium leading-snug text-text">
              {beyondNutrition.title.split(/(\*[^*]+\*)/g).map((part, i) =>
                part.startsWith("*") && part.endsWith("*") ? (
                  <span key={i} className="italic text-accent-contrast">
                    {part.slice(1, -1)}
                  </span>
                ) : (
                  <React.Fragment key={i}>{part}</React.Fragment>
                ),
              )}
            </h3>
            <p className="font-jakarta text-[14.5px] leading-[1.65] text-primary-contrast">
              {beyondNutrition.body}
            </p>
          </div>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
