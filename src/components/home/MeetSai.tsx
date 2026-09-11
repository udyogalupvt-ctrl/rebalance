import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { Reveal } from "@/components/shared/Reveal";
import { meetSai, credentials, credentialsCopy } from "@/data/content";

/**
 * Sections 10 and 11 — Meet Sai, and Education & Credentials.
 *
 * Kept together, because a credential list is only worth reading once you
 * know whose it is. Splitting them put a wall of qualifications between the
 * reader and the person holding them.
 *
 * The portrait is the practice's single strongest asset and it appears here
 * once, at full size, where the story that goes with it starts. The brief
 * asks for a clear place for a professional portrait; this is it.
 *
 * The credentials are the five the practice supplied and nothing else. No
 * years of experience, no client numbers, no honorifics, no awards. Every one
 * of those was on the previous version of this site and not one of them came
 * from the practice.
 */
export function MeetSai() {
  return (
    <SectionWrapper id="meet-sai" bg="base" labelledBy="meet-sai-heading">
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ---- portrait ---- */}
        <Reveal className="lg:col-span-5">
          <figure className="relative m-0 mx-auto max-w-[420px] lg:mx-0 lg:max-w-none">
            {/* The arch echoes the round brand mark, and is the one silhouette
                a stock template will not be using. */}
            <div className="overflow-hidden rounded-[200px_200px_28px_28px] border border-[rgba(var(--primary-rgb),0.16)] bg-surface-alt shadow-[0_28px_70px_rgba(var(--shadow-rgb),0.16)]">
              <img
                src={meetSai.image}
                srcSet="/founder-sm.jpg 640w, /founder.jpg 1086w"
                sizes="(min-width: 1024px) 440px, (min-width: 640px) 420px, 88vw"
                width={1086}
                height={1448}
                alt={`${meetSai.name}, ${meetSai.role}`}
                loading="lazy"
                decoding="async"
                className="block aspect-[3/4] w-full object-cover object-[50%_16%]"
              />
            </div>
          </figure>
        </Reveal>

        {/* ---- story ---- */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="fs-eyebrow mb-5 text-primary-contrast">{meetSai.eyebrow}</p>
            <h2 id="meet-sai-heading" className="fs-h2 mb-2 text-text">
              {meetSai.name}
            </h2>
            <p className="mb-7 font-jakarta text-[15px] font-medium text-accent-contrast">
              {meetSai.role}
            </p>
          </Reveal>

          {meetSai.body.map((para, i) => (
            <Reveal key={i} delay={0.08 + i * 0.06}>
              <p className="fs-body mb-5 max-w-[60ch] text-text-muted">{para}</p>
            </Reveal>
          ))}

          <Reveal delay={0.24}>
            <Link
              to="/about"
              className="press group mt-3 inline-flex h-[52px] items-center justify-center gap-2 rounded-pill border border-[rgba(var(--primary-rgb),0.34)] bg-surface px-7 font-semibold text-primary-contrast transition-colors hover:bg-primary-soft"
            >
              {meetSai.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          {/* ---- credentials ---- */}
          <div className="mt-14 border-t border-border pt-10">
            <Reveal>
              <p className="fs-eyebrow mb-6 flex items-center gap-2.5 text-primary-contrast">
                <GraduationCap aria-hidden="true" className="h-[17px] w-[17px]" />
                {credentialsCopy.eyebrow}
              </p>
            </Reveal>

            {/* A plain list, not cards. A credential dressed up in a box
                starts to look like a badge somebody bought. The rule sits above
                every entry except the ones that open a row — the first in one
                column, the first two in two. */}
            <ul className="m-0 grid list-none gap-0 p-0 sm:grid-cols-2">
              <Reveal
                stagger={0.06}
                childAs="li"
                childClassName="border-t border-border py-4 first:border-t-0 sm:pr-8 sm:[&:nth-child(2)]:border-t-0"
              >
                {credentials.map((item) => (
                  <div key={item.title}>
                    <p className="font-jakarta text-[14.5px] font-semibold leading-snug text-text">
                      {item.title}
                    </p>
                    {item.detail && (
                      <p className="mt-1 font-jakarta text-[13.5px] leading-[1.55] text-text-muted">
                        {item.detail}
                      </p>
                    )}
                  </div>
                ))}
              </Reveal>
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
