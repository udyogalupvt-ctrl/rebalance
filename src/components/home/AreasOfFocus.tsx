import * as React from "react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { areasOfFocus, areasOfFocusCopy } from "@/data/content";
import { AREA_IMAGES } from "@/data/images";

/**
 * Section 2 — How Can We Support You?
 *
 * Five areas, and five is an awkward number for a grid: in three columns the
 * second row is two cards adrift on the left, which reads as a mistake rather
 * than a set. So the row is five slim columns from lg, and two from sm. Each
 * card is deliberately compact — a heading and the conditions underneath it —
 * because this section's job is recognition, not explanation. Whoever is
 * looking for "PCOS" needs to find the word, not read a paragraph.
 *
 * Nothing here claims to treat any of these. They are the areas the practice
 * provides nutrition support in, which is what the brief's language allows.
 */
export function AreasOfFocus() {
  return (
    <SectionWrapper id="focus" bg="alt" labelledBy="focus-heading" arc="right">
      <SectionHeading
        id="focus-heading"
        align="center"
        eyebrow={areasOfFocusCopy.eyebrow}
        title={areasOfFocusCopy.title}
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
      <ul className="m-0 mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 md:gap-5 lg:grid-cols-5">
        <Reveal stagger={0.06} childAs="li" childClassName="h-full">
          {areasOfFocus.map((area) => {
            const Icon = area.icon;
            const image = AREA_IMAGES[area.id];
            return (
              <div
                key={area.id}
                className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-border bg-surface transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[5px] hover:border-primary/35 surface-raise"
              >
                {/* The food each area is worked on through. There is no honest
                    photograph of a condition, and a stock shot of somebody
                    clutching their stomach would be worse than none. */}
                {image && (
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-surface-alt">
                    <img
                      src={image.src}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={480}
                      className="h-full w-full object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.16,0.84,0.24,1)] group-hover:scale-[1.05]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(var(--surface-rgb),0.6),transparent_58%)]"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <span
                    aria-hidden="true"
                    className="relative z-10 -mt-[44px] mb-4 flex h-[46px] w-[46px] items-center justify-center rounded-[14px] border border-border bg-surface shadow-[0_8px_20px_rgba(var(--shadow-rgb),0.14)] transition-colors duration-300 group-hover:border-primary group-hover:bg-primary"
                  >
                    <Icon
                      size={21}
                      className="text-primary transition-colors duration-300 group-hover:text-white"
                    />
                  </span>

                  <h3 className="mb-3 font-fraunces text-[17px] font-medium leading-snug text-text">
                    {area.title}
                  </h3>

                  {area.note ? (
                    <p className="font-jakarta text-[14px] leading-[1.6] text-text-muted">
                      {area.note}
                    </p>
                  ) : (
                    <ul className="m-0 flex list-none flex-wrap gap-x-2 gap-y-1.5 p-0">
                      {area.items.map((item, i) => (
                        <li
                          key={item}
                          className="font-jakarta text-[13.5px] leading-[1.5] text-text-muted"
                        >
                          {item}
                          {/* Between items, not after every one: the trailing
                            dot on the last entry read as a typo. */}
                          {i < area.items.length - 1 && (
                            <span aria-hidden="true" className="ml-2 text-border">
                              ·
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </Reveal>
      </ul>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-11 max-w-[46ch] text-center font-fraunces text-[clamp(1.05rem,1.9vw,1.3rem)] font-medium italic leading-snug text-primary-contrast">
          {areasOfFocusCopy.closing}
        </p>
      </Reveal>
    </SectionWrapper>
  );
}
