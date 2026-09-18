import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { StickyStack } from "@/components/shared/scroll/StickyStack";
import { programs, programsCopy, briefBrand } from "@/data/content";
import { cn } from "@/lib/utils";

/**
 * Section 6 — Programs.
 *
 * INTERACTION: a deck on a phone, a grid on a wide screen. This is the one
 * section where the two are genuinely different interactions rather than one
 * layout at two sizes, and the reason is what the reader is doing here.
 *
 * They are comparing. Four programs is a decision, and a decision needs the
 * options held in view together — which a wide screen can do in one row and a
 * phone cannot do at all. Stacking is the phone's version of that: each card
 * rises over the last and parks a little lower, so by the fourth every
 * previous card's title strip is still on screen. The reader can see all four
 * at once, in a column, without four screens of scrolling.
 *
 * Two rules from the brief shape the content, and both are about what is NOT
 * here. No prices — not a "from", not a range, not a struck-through anchor;
 * every card ends in "Explore", never "Buy" or "Enrol". And no long inclusion
 * lists: three points per card, because the detail lives on the program pages
 * and a homepage card that tries to carry everything carries nothing.
 *
 * The 3-Month Rebalance is the signature program and the brief asks for it to
 * be visually identifiable. It gets the accent border and the badge — and in
 * the deck it lands last, on top, which is where the eye finishes.
 */
export function ProgramsSection() {
  return (
    <SectionWrapper id="programs" bg="alt" labelledBy="programs-heading" arc="left" sticky>
      <SectionHeading
        id="programs-heading"
        align="center"
        eyebrow={programsCopy.eyebrow}
        title={programsCopy.title}
        subtitle={programsCopy.subtitle}
      />

      <StickyStack
        label={programsCopy.eyebrow}
        className="mt-14"
        wideClassName="lg:grid-cols-2 xl:grid-cols-4 lg:gap-6 xl:gap-5"
        /* 40px is what it takes to keep each covered card's duration chip on
           screen — "One-time session", "21 days", "12 weeks", "24 weeks". That
           chip is the ladder of commitment the four programs are arranged on,
           so it is the one thing worth holding in view while the reader
           decides. */
        step={40}
      >
        {programs.map((program) => (
          <article
            key={program.id}
            id={`home-${program.id}`}
            className={cn(
              "group relative flex h-full flex-col rounded-[26px] border p-[26px_22px] sm:p-[34px_32px] xl:p-[30px_22px]",
              // A solid surface, not a translucent one. These cards physically
              // overlap in the deck, and anything see-through would show the
              // card underneath reading through the copy.
              "bg-surface",
              program.signature
                ? "border-[rgba(var(--accent-rgb),0.45)] shadow-[0_16px_44px_rgba(var(--accent-rgb),0.12)]"
                : "border-border shadow-[0_10px_30px_rgba(var(--shadow-rgb),0.08)] hover:border-primary/35",
            )}
          >
            {program.signature && (
              /* Right-aligned, because in the deck this badge sits above the
                 card's own top edge and therefore over the strip of the card
                 behind it. The duration chips it would otherwise cover are
                 left-aligned, and those chips are the whole point of the
                 strip. */
              <span className="absolute -top-3 right-6 rounded-full bg-accent-strong px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-on-accent">
                Signature Program
              </span>
            )}

            <p className="mb-4 inline-flex items-center gap-1.5 self-start rounded-pill bg-primary-soft px-3 py-1 font-jakarta text-[12px] font-semibold uppercase tracking-[0.08em] text-primary-contrast">
              <Clock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              {program.duration}
            </p>

            <h3 className="mb-3 font-fraunces text-[clamp(1.2rem,1.9vw,1.4rem)] font-medium leading-[1.3] text-text">
              {program.title}
            </h3>

            <p className="mb-5 font-jakarta text-[14.5px] leading-[1.7] text-text-muted">
              {program.summary}
            </p>

            <p className="mb-3 font-jakarta text-[11.5px] font-semibold uppercase tracking-[0.12em] text-text-muted">
              {programsCopy.pointsLabel}
            </p>
            <ul className="m-0 mb-6 flex list-none flex-col gap-2.5 p-0">
              {program.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <Check
                    aria-hidden="true"
                    className="mt-[3px] h-[15px] w-[15px] shrink-0 text-primary"
                  />
                  <span className="font-jakarta text-[14px] leading-[1.55] text-text">{point}</span>
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
              to="/programs"
              hash={program.id}
              className={cn(
                "press mt-auto inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-pill px-4 py-2 text-center text-[14.5px] font-semibold leading-snug transition-colors xl:text-[14px]",
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
      </StickyStack>

      {/* The one decision that stops people booking is choosing a program
          first. The practice's own answer to that question closes the set. */}
      <Reveal delay={0.12}>
        <div className="mx-auto mt-12 flex max-w-[760px] flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
          <p className="font-fraunces text-[clamp(1.05rem,1.8vw,1.25rem)] font-medium italic text-text">
            You don&rsquo;t have to decide on your own.
          </p>
          <Link
            to="/assessment"
            className="press group inline-flex h-[50px] shrink-0 items-center justify-center gap-2 rounded-pill bg-accent-strong px-7 text-[14.5px] font-semibold text-on-accent shadow-[0_10px_26px_rgba(var(--accent-rgb),0.22)]"
          >
            {briefBrand.primaryCta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
