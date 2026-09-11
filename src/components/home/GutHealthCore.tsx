import * as React from "react";
import { Reveal } from "@/components/shared/Reveal";
import { Info } from "lucide-react";
import { gutHealthCore } from "@/data/content";
import { HOME_SECTION_IMAGES } from "@/data/images";

/**
 * Section 4 — Why Gut Health Is at the Core.
 *
 * The brief's note on this one is "keep this section short. It should explain
 * the philosophy without implying that every health condition is caused by
 * the gut." So it is a single paragraph and a single line, on a quiet band of
 * its own, with nothing else competing for attention.
 *
 * It is also the section where a nutrition site is most likely to overclaim,
 * which is why the copy says gut health is considered "as part of the wider
 * nutritional picture" rather than as the cause of anything.
 */
export function GutHealthCore() {
  return (
    <section
      id="gut-health"
      aria-labelledby="gut-health-heading"
      className="render-on-approach relative isolate w-full overflow-hidden bg-surface-alt section-y"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb orb--faint absolute -left-[10%] top-1/2 h-[520px] w-[520px] -translate-y-1/2" />
        <div className="orb orb--accent orb--faint absolute -right-[8%] top-1/3 h-[420px] w-[420px]" />
      </div>

      <div className="container-x relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ---- the photograph ----
              A market table of whole ingredients. The section is about looking
              at the whole picture rather than one part of it, and a frame full
              of many things standing together says that before a word is
              read. */}
          <Reveal className="lg:col-span-5">
            <figure className="relative m-0">
              <div className="overflow-hidden rounded-[26px] border border-border bg-surface-alt shadow-[0_26px_64px_rgba(var(--shadow-rgb),0.16)]">
                <img
                  src={HOME_SECTION_IMAGES.gutHealth.src}
                  alt={HOME_SECTION_IMAGES.gutHealth.alt}
                  loading="lazy"
                  decoding="async"
                  width={1400}
                  height={1050}
                  className="block aspect-[4/3] w-full object-cover"
                />
              </div>

              {/* The line the section exists to land, lifted onto the corner
                  of the picture so the two read as one statement. */}
              <figcaption className="absolute -bottom-7 -right-4 max-w-[74%] rounded-[20px] border border-border bg-surface p-[18px_22px] shadow-[0_18px_46px_rgba(var(--shadow-rgb),0.18)] sm:-right-7 sm:p-[22px_26px]">
                <p className="font-fraunces text-[clamp(1rem,1.7vw,1.2rem)] font-medium leading-[1.4] text-text">
                  {gutHealthCore.pull}
                </p>
              </figcaption>
            </figure>
          </Reveal>

          {/* ---- the copy ---- */}
          <div className="lg:col-span-7 lg:pl-4">
            <Reveal>
              <p className="fs-eyebrow mb-5 text-primary-contrast">{gutHealthCore.eyebrow}</p>
              <h2 id="gut-health-heading" className="fs-h2 mb-7 text-text">
                {gutHealthCore.title.split(/(\*[^*]+\*)/g).map((part, i) =>
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

            <Reveal delay={0.08}>
              <p className="fs-sub mb-8 max-w-[56ch]">{gutHealthCore.body}</p>
            </Reveal>

            {/* The boundary this section could otherwise be read as crossing.
                The brief's copy note asks for the philosophy WITHOUT implying
                every condition starts in the gut, so it is said outright. */}
            <Reveal delay={0.16}>
              <div className="flex max-w-[56ch] items-start gap-3.5 rounded-[18px] border border-[rgba(var(--primary-rgb),0.22)] bg-primary-soft p-[18px_20px]">
                <Info
                  aria-hidden="true"
                  className="mt-[2px] h-[18px] w-[18px] shrink-0 text-primary"
                />
                <p className="font-jakarta text-[14.5px] leading-[1.65] text-primary-contrast">
                  Gut health is one lens, not the whole answer. Not every concern begins there, and
                  nutrition support works alongside your medical care rather than in place of it.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
