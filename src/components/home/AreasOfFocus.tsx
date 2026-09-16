import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Info } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CardRail } from "@/components/shared/CardRail";
import { areasOfFocus, areasOfFocusCopy } from "@/data/content";
import { AREA_IMAGES } from "@/data/images";

/**
 * How Can We Support You? — the five areas of focus.
 *
 * Five is an awkward number for a grid: in three columns the second row is two
 * cards adrift on the left, and in five slim columns the descriptions the
 * practice wrote for each area become a narrow tower of words. So the wide
 * layout is a six-column bento — the two most common reasons people get in
 * touch take half a row each, the other three a third — and every card keeps a
 * comfortable line length. On a phone the set is a swipeable row.
 *
 * Nothing here claims to treat any of these. They are the areas the practice
 * provides nutrition support in, and the clinical note under the set says so
 * in the practice's own words.
 */
export function AreasOfFocus() {
  return (
    <SectionWrapper id="focus" bg="alt" labelledBy="focus-heading" arc="right">
      <SectionHeading
        id="focus-heading"
        align="center"
        eyebrow={areasOfFocusCopy.eyebrow}
        title={areasOfFocusCopy.title}
        subtitle={areasOfFocusCopy.subtitle}
      />

      <CardRail
        count={areasOfFocus.length}
        label={areasOfFocusCopy.eyebrow}
        wrapperClassName="mt-12"
        className="md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-6 lg:gap-6"
      >
        <Reveal
          stagger={0.06}
          childAs="li"
          childClassName="md:[&:nth-child(5)]:col-span-2 lg:[&:nth-child(-n+2)]:col-span-3 lg:[&:nth-child(n+3)]:col-span-2"
        >
          {areasOfFocus.map((area, index) => {
            const Icon = area.icon;
            const image = AREA_IMAGES[area.id];
            return (
              <article
                key={area.id}
                aria-labelledby={`focus-${area.id}`}
                className="group flex flex-col overflow-hidden rounded-[24px] border border-border bg-surface transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[4px] hover:border-primary/35 surface-raise"
              >
                {/* The food each area is worked on through. There is no honest
                    photograph of a condition. A fixed height rather than an
                    aspect ratio, so the half-row cards do not grow a picture
                    twice as tall as their neighbours'. */}
                <div className="relative h-44 w-full shrink-0 overflow-hidden bg-surface-alt sm:h-48">
                  {image && (
                    <img
                      src={image.src}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.16,0.84,0.24,1)] group-hover:scale-[1.04]"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(var(--surface-rgb),0.55),transparent_55%)]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-4 top-4 rounded-pill bg-[rgba(var(--surface-rgb),0.92)] px-3 py-1 font-jakarta text-[12px] font-semibold tabular-nums tracking-[0.08em] text-primary-contrast"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <span
                    aria-hidden="true"
                    className="relative z-10 -mt-[50px] mb-4 flex h-[48px] w-[48px] items-center justify-center rounded-[15px] border border-border bg-surface shadow-[0_8px_20px_rgba(var(--shadow-rgb),0.14)] transition-colors duration-300 group-hover:border-primary group-hover:bg-primary"
                  >
                    <Icon
                      size={21}
                      className="text-primary transition-colors duration-300 group-hover:text-white"
                    />
                  </span>

                  <h3
                    id={`focus-${area.id}`}
                    className="mb-2.5 font-fraunces text-[19px] font-medium leading-snug text-text"
                  >
                    {area.title}
                  </h3>

                  <p className="mb-5 font-jakarta text-[14.5px] leading-[1.65] text-text-muted">
                    {area.body}
                  </p>

                  <ul
                    aria-label={`${area.title} includes`}
                    className="m-0 mb-6 flex list-none flex-wrap gap-2 p-0"
                  >
                    {area.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-pill border border-[rgba(var(--primary-rgb),0.18)] bg-primary-soft px-3 py-1 font-jakarta text-[12.5px] font-medium leading-[1.5] text-primary-contrast"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/assessment"
                    className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start font-jakarta text-[14px] font-semibold text-accent-contrast"
                  >
                    {areasOfFocusCopy.cardLink}
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </Reveal>
      </CardRail>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-11 max-w-[46ch] text-center font-fraunces text-[clamp(1.05rem,1.9vw,1.3rem)] font-medium italic leading-snug text-primary-contrast">
          {areasOfFocusCopy.closing}
        </p>
      </Reveal>

      <Reveal delay={0.14}>
        <p className="mx-auto mt-7 flex max-w-[760px] items-start gap-3 rounded-[18px] border border-border bg-surface px-5 py-4 font-jakarta text-[13.5px] leading-[1.65] text-text-muted">
          <Info aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0 text-primary" />
          <span>
            <strong className="font-semibold text-text">
              {areasOfFocusCopy.clinicalNoteLabel}
            </strong>{" "}
            {areasOfFocusCopy.clinicalNote}
          </span>
        </p>
      </Reveal>
    </SectionWrapper>
  );
}
