import * as React from "react";
import { Info } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { Reveal } from "@/components/shared/Reveal";
import { whoWeWorkWith } from "@/data/content";
import { HOME_SECTION_IMAGES } from "@/data/images";

/**
 * Section 3 — Who We Work With.
 *
 * A statement, not a card grid. The page already has cards above and below
 * it, and this section is one fact — who the practice is currently for —
 * which a grid would only dilute.
 *
 * The guardian note is set apart rather than buried in the paragraph. The
 * brief asks for it to be visible but not repeated across the site, so it
 * appears here, on the assessment, and in the FAQs. Three times, deliberately,
 * and nowhere else.
 */
export function WhoWeWorkWith() {
  const image = HOME_SECTION_IMAGES.whoWeWorkWith;

  return (
    <SectionWrapper id="who-we-work-with" bg="base" labelledBy="who-heading">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="fs-eyebrow mb-5 text-primary-contrast">{whoWeWorkWith.eyebrow}</p>
            <h2 id="who-heading" className="fs-h2 mb-6 text-text">
              {whoWeWorkWith.title.split(/(\*[^*]+\*)/g).map((part, i) =>
                part.startsWith("*") && part.endsWith("*") ? (
                  <span key={i} className="italic text-accent-contrast">
                    {part.slice(1, -1)}
                  </span>
                ) : (
                  <React.Fragment key={i}>{part}</React.Fragment>
                ),
              )}
            </h2>
          </Reveal>

          {whoWeWorkWith.body.map((para, i) => (
            <Reveal key={i} delay={0.08 + i * 0.06}>
              <p className="fs-body mb-4 max-w-[58ch] text-text-muted">{para}</p>
            </Reveal>
          ))}

          <Reveal delay={0.24}>
            <div className="mt-7 flex max-w-[58ch] items-start gap-3.5 rounded-[18px] border border-[rgba(var(--primary-rgb),0.22)] bg-primary-soft p-[18px_20px]">
              <Info
                aria-hidden="true"
                className="mt-[2px] h-[18px] w-[18px] shrink-0 text-primary"
              />
              <p className="font-jakarta text-[14.5px] leading-[1.6] text-primary-contrast">
                {whoWeWorkWith.guardianNote}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.14} className="lg:col-span-6">
          <figure className="relative m-0 overflow-hidden rounded-[28px] border border-border bg-surface-alt shadow-[0_24px_60px_rgba(var(--shadow-rgb),0.14)]">
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              width={1200}
              height={900}
              className="block aspect-[4/3] w-full object-cover"
            />
          </figure>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
