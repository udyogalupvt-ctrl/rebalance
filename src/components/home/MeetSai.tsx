import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { Reveal } from "@/components/shared/Reveal";
import { Parallax, WordReveal } from "@/components/shared/scroll/effects";
import { meetSai } from "@/data/content";

/**
 * Meet Sowjanya — the person behind the practice.
 *
 * The credentials follow directly underneath as their own section, so the
 * qualifications are read straight after the person holding them.
 *
 * The portrait is the practice's single strongest asset and it appears here
 * once, at full size, where the story that goes with it starts. The brief
 * asks for a clear place for a professional portrait; this is it.
 *
 * The credentials are the five the practice supplied and nothing else. No
 * years of experience, no client numbers, no honorifics, no awards. Every one
 * of those was on the previous version of this site and not one of them came
 * from the practice.
 *
 * INTERACTION: subtle, and human rather than mechanical.
 *
 * The portrait drifts slowly against the scroll, which separates it from the
 * text beside it and gives the one photograph of a person on this page a
 * little presence. And the sentence where she says why she started the
 * practice gathers itself word by word as the reader comes to it — the only
 * place on the site that treatment is used, because it is the only sentence
 * that is her speaking in the first person.
 */
export function MeetSai() {
  return (
    <SectionWrapper id="meet-sai" bg="base" labelledBy="meet-sai-heading">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ---- portrait ---- */}
        <Parallax distance={40} className="lg:col-span-5">
          <figure className="relative m-0 mx-auto max-w-[420px] lg:mx-0 lg:max-w-none">
            {/* The arch echoes the round brand mark, and is the one silhouette
                a stock template will not be using. */}
            <span className="absolute bottom-6 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-pill border border-[rgba(var(--primary-rgb),0.2)] bg-surface px-4 py-2 font-jakarta text-[13px] font-semibold text-primary-contrast shadow-[0_10px_26px_rgba(var(--shadow-rgb),0.16)]">
              <BadgeCheck aria-hidden="true" className="h-4 w-4 text-primary" />
              {meetSai.badge}
            </span>
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
        </Parallax>

        {/* ---- story ---- */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="fs-eyebrow mb-5 text-primary-contrast">{meetSai.eyebrow}</p>
            <h2 id="meet-sai-heading" className="fs-h2 mb-3 text-text">
              {meetSai.title}
            </h2>
            <p className="mb-5 font-jakarta text-[15px] font-medium text-accent-contrast">
              {meetSai.name} · {meetSai.role}
            </p>
            <ul aria-label="Background" className="m-0 mb-7 flex list-none flex-wrap gap-2 p-0">
              {meetSai.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-pill border border-border bg-surface px-3.5 py-1.5 font-jakarta text-[13px] font-medium text-text"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </Reveal>

          {meetSai.body.map((para, i) =>
            /* The last paragraph is the one in her own voice — why the
               practice exists. It gets the word-by-word treatment; the
               paragraph of background before it does not, because a
               qualifications list read one word at a time is an irritation,
               not a moment. */
            i === meetSai.body.length - 1 ? (
              <WordReveal
                key={i}
                text={para}
                className="fs-body mb-5 max-w-[60ch] text-text-muted"
              />
            ) : (
              <Reveal key={i} delay={0.08 + i * 0.06}>
                <p className="fs-body mb-5 max-w-[60ch] text-text-muted">{para}</p>
              </Reveal>
            ),
          )}

          <Reveal delay={0.24}>
            <Link
              to="/about"
              className="press group mt-3 inline-flex h-[52px] items-center justify-center gap-2 rounded-pill border border-[rgba(var(--primary-rgb),0.34)] bg-surface px-7 font-semibold text-primary-contrast transition-colors hover:bg-primary-soft"
            >
              {meetSai.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
