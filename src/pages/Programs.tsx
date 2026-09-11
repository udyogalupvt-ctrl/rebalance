import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Info } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { MetaChip } from "@/components/shared/MetaChip";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { FinalCta } from "@/components/home/FinalCta";
import {
  programDetails,
  programsPageCopy,
  clientJourney,
  clientJourneyCopy,
  briefBrand,
} from "@/data/content";
import { PAGE_BACKDROPS, PAGE_PANELS } from "@/data/images";
import { Layers, UserCheck, Video } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The Programs page.
 *
 * This replaces a "Treatments" page that listed seven medical conditions as
 * things the practice treats. A nutrition practice does not treat conditions,
 * and the brief's boundaries say so plainly: no diagnosing, no treating, no
 * curing. What it offers is four levels of nutrition support, which is what
 * this page now describes.
 *
 * There are no prices, and that is the brief's instruction rather than an
 * omission. So the page answers the question a missing price creates: the
 * journey section below spells out that cost is discussed on a call, after
 * somebody understands what you need. A page that hides a number reads as
 * evasive; a page that explains when the number arrives does not.
 */
export default function Programs() {
  return (
    <>
      <Header overHero={false} />
      <main>
        <PageHero
          variant="image"
          align="left"
          backdrop={PAGE_BACKDROPS.treatments}
          eyebrow={programsPageCopy.eyebrow}
          title={programsPageCopy.title}
          subtitle={programsPageCopy.subtitle}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Programs", href: "/programs" },
          ]}
          image={{ ...PAGE_PANELS.treatments, width: 1200, height: 900 }}
        >
          <MetaChip icon={Layers} label="Four Levels of Support" />
          <MetaChip icon={UserCheck} label="Personalised, Never Templated" />
          <MetaChip icon={Video} label="Online Consultations" />
        </PageHero>

        {/* ---- the four programs ---- */}
        <SectionWrapper id="programs" bg="base" labelledBy="programs-heading" arc="left">
          <SectionHeading
            id="programs-heading"
            align="center"
            eyebrow="THE PROGRAMS"
            title="Choose the Level of *Guidance* That Fits"
            subtitle="Every program starts from the same place: understanding you. What changes is how much support follows, and for how long."
          />

          <ul className="m-0 mt-14 grid list-none grid-cols-1 items-stretch gap-5 p-0 lg:grid-cols-2 lg:gap-6">
            <Reveal stagger={0.08} childAs="li" childClassName="h-full">
              {programDetails.map((program) => (
                <article
                  key={program.id}
                  className={cn(
                    "relative flex h-full flex-col rounded-[26px] border bg-surface p-[30px_26px] sm:p-[36px_34px] surface-raise",
                    program.signature
                      ? "border-[rgba(var(--accent-rgb),0.45)] shadow-[0_16px_44px_rgba(var(--accent-rgb),0.12)]"
                      : "border-border",
                  )}
                >
                  {program.signature && (
                    <span className="absolute -top-3 left-7 rounded-full bg-accent-strong px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-on-accent">
                      Signature Program
                    </span>
                  )}

                  <h3 className="mb-3 font-fraunces text-[clamp(1.25rem,2vw,1.55rem)] font-medium leading-[1.28] text-text">
                    {program.title}
                  </h3>

                  <p className="mb-7 font-jakarta text-[14.5px] leading-[1.7] text-text-muted">
                    {program.intro}
                  </p>

                  <p className="fs-eyebrow mb-4 text-primary-contrast">Includes</p>
                  <ul className="m-0 mb-7 flex list-none flex-col gap-2.5 p-0">
                    {program.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check
                          aria-hidden="true"
                          className="mt-[3px] h-[15px] w-[15px] shrink-0 text-primary"
                        />
                        <span className="font-jakarta text-[14px] leading-[1.55] text-text">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {program.bestFor && (
                    <div className="mb-6 rounded-[16px] border border-border bg-surface-alt p-[14px_16px]">
                      <p className="font-jakarta text-[13.5px] leading-[1.6] text-text-muted">
                        <span className="font-semibold text-text">Best suited for: </span>
                        {program.bestFor}
                      </p>
                    </div>
                  )}

                  {program.note && (
                    <p className="mb-6 font-fraunces text-[15px] font-medium italic text-primary-contrast">
                      {program.note}
                    </p>
                  )}

                  <Link
                    to="/assessment"
                    className={cn(
                      "press group mt-auto inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-pill text-[14.5px] font-semibold transition-colors",
                      program.signature
                        ? "bg-accent-strong text-on-accent"
                        : "border border-[rgba(var(--primary-rgb),0.32)] text-primary-contrast hover:bg-primary-soft",
                    )}
                  >
                    {briefBrand.primaryCta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              ))}
            </Reveal>
          </ul>

          {/* The one thing a visitor cannot work out from the cards. */}
          <Reveal delay={0.12}>
            <div className="mx-auto mt-12 flex max-w-[720px] items-start gap-3.5 rounded-[18px] border border-[rgba(var(--primary-rgb),0.22)] bg-primary-soft p-[18px_22px]">
              <Info
                aria-hidden="true"
                className="mt-[2px] h-[18px] w-[18px] shrink-0 text-primary"
              />
              <p className="font-jakarta text-[14.5px] leading-[1.65] text-primary-contrast">
                You don&apos;t have to pick one. We consider your goals, symptoms and initial
                assessment to help work out which level of support suits you best.
              </p>
            </div>
          </Reveal>
        </SectionWrapper>

        {/* ---- what happens next ---- */}
        <SectionWrapper id="journey" bg="alt" labelledBy="journey-heading" texture="contour">
          <SectionHeading
            id="journey-heading"
            align="center"
            eyebrow={clientJourneyCopy.eyebrow}
            title={clientJourneyCopy.title}
            subtitle={clientJourneyCopy.subtitle}
          />

          <ol className="m-0 mt-14 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            <Reveal stagger={0.07} childAs="li">
              {clientJourney.map((stage) => (
                <div key={stage.step}>
                  <span
                    aria-hidden="true"
                    className="mb-5 flex h-[48px] w-[48px] items-center justify-center rounded-full border border-[rgba(var(--primary-rgb),0.28)] bg-bg font-fraunces text-[16px] font-medium text-primary-contrast"
                  >
                    {stage.step}
                  </span>
                  <h3 className="fs-h4 mb-2.5 text-text">{stage.title}</h3>
                  <p className="max-w-[38ch] font-jakarta text-[14.5px] leading-[1.68] text-text-muted">
                    {stage.body}
                  </p>
                </div>
              ))}
            </Reveal>
          </ol>
        </SectionWrapper>

        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
