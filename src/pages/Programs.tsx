import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, Layers, Sparkles, UserCheck, Video } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { MetaChip } from "@/components/shared/MetaChip";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CardRail } from "@/components/shared/CardRail";
import { AreasOfFocus } from "@/components/home/AreasOfFocus";
import { BriefFaq } from "@/components/home/BriefFaq";
import { FinalCta } from "@/components/home/FinalCta";
import {
  programDetails,
  programsCopy,
  programsPageCopy,
  clientJourney,
  clientJourneyCopy,
  briefBrand,
} from "@/data/content";
import { PAGE_BACKDROPS, PAGE_PANELS } from "@/data/images";
import { cn } from "@/lib/utils";

/** The FAQs that are about choosing and running a program. */
const PROGRAM_FAQ_IDS = ["which-program", "blood-tests", "supplements", "online", "whatsapp"];

/**
 * Programs — the one page for everything the practice offers.
 *
 * There used to be two: this one, and a "Treatments" page that listed medical
 * conditions as things treated. The practice asked for a single page and for
 * no "treatment" wording at all, so the conditions now appear the way the
 * rest of the site describes them — as areas the practice provides nutrition
 * support in — underneath the four programs, and /treatments forwards here.
 *
 * The four programs lead, each in full, each with its own address
 * (/programs#single, #gut-reset, #rebalance-3, #rebalance-6) so the cards on
 * the home page and the links in the footer land on the right one. They stay
 * a vertical list on every screen: they are the choice being made, and a
 * choice has to be compared, not swiped past.
 *
 * No prices, anywhere on the page.
 */
export default function Programs() {
  return (
    <>
      <Header overHero={false} />
      <main>
        <PageHero
          variant="image"
          align="left"
          backdrop={PAGE_BACKDROPS.programs}
          eyebrow={programsPageCopy.eyebrow}
          title={programsPageCopy.title}
          subtitle={programsPageCopy.subtitle}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Programs", href: "/programs" },
          ]}
          image={{ ...PAGE_PANELS.programs, width: 1200, height: 900 }}
        >
          <MetaChip icon={Layers} label="Four Levels of Support" />
          <MetaChip icon={UserCheck} label="Personalised, Never Templated" />
          <MetaChip icon={Video} label="1-on-1 Online Consultations" />
        </PageHero>

        {/* ---- the four programs ---- */}
        <SectionWrapper id="programs" bg="base" labelledBy="programs-heading" arc="left">
          <SectionHeading
            id="programs-heading"
            align="center"
            eyebrow={programsCopy.eyebrow}
            title={programsCopy.title}
          />

          {/* Jump links — four programs of this length are several screens,
              and most visitors arrive wanting one of them. */}
          <Reveal delay={0.06}>
            <nav
              aria-label="Jump to a program"
              /* One scrollable line on a phone, wrapped and centred from sm
                 up. The four program names are long enough that wrapping put
                 each on its own row — 152px of jump links above the content
                 they jump to, on the page where the reader is closest to
                 choosing. */
              className="no-scrollbar -mx-5 mt-9 flex max-w-[900px] items-center gap-2.5 overflow-x-auto px-5 pb-1 sm:mx-auto sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
            >
              {programDetails.map((program) => (
                <a
                  key={program.id}
                  href={`#${program.id}`}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-pill border px-4 font-jakarta text-[13.5px] font-semibold transition-colors",
                    program.signature
                      ? "border-[rgba(var(--accent-rgb),0.45)] bg-accent-soft text-accent-contrast hover:bg-[rgba(var(--accent-rgb),0.18)]"
                      : "border-border bg-surface text-text hover:border-primary/40 hover:bg-primary-soft",
                  )}
                >
                  {program.title}
                </a>
              ))}
            </nav>
          </Reveal>

          <ol className="m-0 mt-12 flex list-none flex-col gap-7 p-0 lg:gap-8">
            {programDetails.map((program, index) => (
              <li key={program.id} id={program.id} className="scroll-mt-[112px]">
                <Reveal>
                  <article
                    aria-labelledby={`${program.id}-title`}
                    className={cn(
                      "relative grid gap-8 overflow-hidden rounded-[28px] border bg-surface p-7 sm:p-9 lg:grid-cols-[5fr_6fr] lg:gap-12 lg:p-11 surface-raise",
                      program.signature
                        ? "border-[rgba(var(--accent-rgb),0.45)] shadow-[0_20px_56px_rgba(var(--accent-rgb),0.14)]"
                        : "border-border",
                    )}
                  >
                    {program.signature && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.14),transparent_68%)]"
                      />
                    )}

                    {/* ---- summary ---- */}
                    <div className="relative flex flex-col">
                      <div className="mb-5 flex flex-wrap items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className="font-fraunces text-[15px] font-medium tabular-nums text-text-muted"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-pill bg-primary-soft px-3 py-1 font-jakarta text-[12px] font-semibold uppercase tracking-[0.08em] text-primary-contrast">
                          <Clock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                          {program.duration}
                        </span>
                        {program.signature && (
                          <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-strong px-3 py-1 font-jakarta text-[11.5px] font-semibold uppercase tracking-[0.1em] text-on-accent">
                            <Sparkles aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                            Signature Program
                          </span>
                        )}
                      </div>

                      <h2
                        id={`${program.id}-title`}
                        className="mb-4 font-fraunces text-[clamp(1.45rem,2.6vw,2rem)] font-medium leading-[1.2] text-text"
                      >
                        {program.title}
                      </h2>

                      <p className="mb-6 font-jakarta text-[15px] leading-[1.72] text-text-muted">
                        {program.intro}
                      </p>

                      {program.bestFor && (
                        <div className="mb-6 rounded-[16px] border border-border bg-surface-alt p-[14px_16px]">
                          <p className="font-jakarta text-[13.5px] leading-[1.6] text-text-muted">
                            <span className="font-semibold text-text">Best suited for: </span>
                            {program.bestFor}
                          </p>
                        </div>
                      )}

                      {program.note && (
                        <p className="mb-6 font-fraunces text-[16px] font-medium italic text-primary-contrast">
                          {program.note}
                        </p>
                      )}

                      <Link
                        to="/assessment"
                        className={cn(
                          "press group mt-auto inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-pill px-7 text-[14.5px] font-semibold transition-colors sm:w-auto sm:self-start",
                          program.signature
                            ? "bg-accent-strong text-on-accent shadow-[0_10px_26px_rgba(var(--accent-rgb),0.24)]"
                            : "border border-[rgba(var(--primary-rgb),0.32)] text-primary-contrast hover:bg-primary-soft",
                        )}
                      >
                        {briefBrand.primaryCta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                    {/* ---- inclusions ---- */}
                    <div className="relative rounded-[22px] border border-border bg-bg p-6 sm:p-7">
                      <p className="fs-eyebrow mb-5 text-primary-contrast">What&rsquo;s included</p>
                      <ul className="m-0 grid list-none gap-x-6 gap-y-3.5 p-0 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {program.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <span
                              aria-hidden="true"
                              className="mt-[2px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-primary-soft"
                            >
                              <Check className="h-3 w-3 text-primary" />
                            </span>
                            <span className="font-jakarta text-[14px] leading-[1.55] text-text">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </SectionWrapper>

        {/* ---- the areas of support (formerly a separate page) ---- */}
        <AreasOfFocus />

        {/* ---- how to begin ---- */}
        <SectionWrapper id="how-to-begin" bg="base" labelledBy="begin-heading" texture="contour">
          <SectionHeading
            id="begin-heading"
            align="center"
            eyebrow={clientJourneyCopy.eyebrow}
            title={clientJourneyCopy.title}
            subtitle={clientJourneyCopy.subtitle}
          />

          <CardRail
            ordered
            count={clientJourney.length}
            label="How to begin"
            wrapperClassName="mt-12"
            className="md:grid md:grid-cols-3 md:gap-5 lg:gap-6"
          >
            <Reveal stagger={0.07} childAs="li">
              {clientJourney.map((stage) => (
                <div
                  key={stage.step}
                  className="flex flex-col rounded-[24px] border border-border bg-surface p-7"
                >
                  <span
                    aria-hidden="true"
                    className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[rgba(var(--primary-rgb),0.28)] bg-primary-soft font-fraunces text-[18px] font-medium text-primary-contrast"
                  >
                    {stage.step}
                  </span>
                  <h3 className="fs-h4 mb-2.5 text-text">{stage.title}</h3>
                  <p className="font-jakarta text-[14.5px] leading-[1.68] text-text-muted">
                    {stage.body}
                  </p>
                </div>
              ))}
            </Reveal>
          </CardRail>

          <Reveal delay={0.12}>
            <div className="mt-10 flex justify-center">
              <Link
                to="/assessment"
                className="press group inline-flex h-14 items-center justify-center gap-2 rounded-pill bg-accent-strong px-8 font-semibold text-on-accent shadow-[0_10px_28px_rgba(var(--accent-rgb),0.26)]"
              >
                {briefBrand.primaryCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </SectionWrapper>

        <BriefFaq ids={PROGRAM_FAQ_IDS} bg="alt" />

        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
