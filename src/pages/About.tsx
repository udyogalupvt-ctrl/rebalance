import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { MetaChip } from "@/components/shared/MetaChip";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { FinalCta } from "@/components/home/FinalCta";
import {
  myStory,
  credentials,
  credentialsCopy,
  meetSai,
  whyGoRebalance,
  whyGoRebalanceCopy,
  briefBrand,
} from "@/data/content";
import { PAGE_BACKDROPS } from "@/data/images";
import { Stethoscope, Sprout, Video } from "lucide-react";

/**
 * The About page.
 *
 * Rebuilt around the story the practice actually wrote, which the brief
 * supplies in the founder's own first person. The version this replaces was
 * written in the third person on her behalf and carried three things she never
 * claimed: eight years of practice, five hundred clients, and an approach
 * described as finding the "root cause" of disease.
 *
 * The story is long, and it is left long. It is the one place on the site
 * where length is the point — somebody reading this far is deciding whether to
 * trust a person with their health, and the brief's whole positioning is
 * founder-led rather than corporate.
 */
export default function AboutPage() {
  return (
    <>
      <Header overHero={false} />
      <main>
        <PageHero
          variant="plain"
          align="center"
          backdrop={PAGE_BACKDROPS.about}
          eyebrow="ABOUT GO REBALANCE"
          title="Personalised Nutrition, From *One Practitioner*."
          subtitle={`Go Rebalance is the practice of ${briefBrand.founder}, ${briefBrand.founderRole}. Gut health is a core lens of the approach, but the support is not limited to gut concerns.`}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
          ]}
        >
          <MetaChip icon={Sprout} label="Founder-Led Practice" />
          <MetaChip icon={Stethoscope} label="Alongside Your Medical Care" />
          <MetaChip icon={Video} label="Online Consultations" />
        </PageHero>

        {/* ---- my story ---- */}
        <SectionWrapper id="story" bg="base" labelledBy="story-heading">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* The portrait holds its position while the story scrolls past
                it: on a page this long, losing her face after the first
                screen would undo the point of a founder-led page. */}
            <Reveal className="lg:col-span-5 lg:sticky lg:top-[120px] lg:self-start">
              <figure className="relative m-0 mx-auto max-w-[400px] lg:mx-0 lg:max-w-none">
                <div className="overflow-hidden rounded-[200px_200px_28px_28px] border border-[rgba(var(--primary-rgb),0.16)] bg-surface-alt shadow-[0_28px_70px_rgba(var(--shadow-rgb),0.16)]">
                  <img
                    src={meetSai.image}
                    srcSet="/founder-sm.jpg 640w, /founder.jpg 1086w"
                    sizes="(min-width: 1024px) 420px, (min-width: 640px) 400px, 88vw"
                    width={1086}
                    height={1448}
                    alt={`${meetSai.name}, ${meetSai.role}`}
                    fetchPriority="high"
                    decoding="async"
                    className="block aspect-[3/4] w-full object-cover object-[50%_16%]"
                  />
                </div>
                <figcaption className="mt-5 text-center lg:text-left">
                  <p className="font-fraunces text-[19px] font-medium text-text">{meetSai.name}</p>
                  <p className="mt-1 font-jakarta text-[14px] text-accent-contrast">
                    {meetSai.role}
                  </p>
                </figcaption>
              </figure>
            </Reveal>

            <div className="lg:col-span-7">
              <Reveal>
                <p className="fs-eyebrow mb-5 text-primary-contrast">{myStory.eyebrow}</p>
                <h2 id="story-heading" className="fs-h2 mb-8 text-text">
                  {myStory.title.split(/(\*[^*]+\*)/g).map((part, i) =>
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

              {myStory.paragraphs.map((para, i) => (
                <Reveal key={i} delay={0.05 + Math.min(i, 5) * 0.04}>
                  <p className="fs-body mb-5 max-w-[62ch] text-text-muted">{para}</p>
                </Reveal>
              ))}

              <Reveal delay={0.3}>
                <blockquote className="m-0 mt-9 border-l-2 border-accent pl-6">
                  <p className="font-fraunces text-[clamp(1.15rem,2.2vw,1.45rem)] font-medium italic leading-[1.45] text-text">
                    {myStory.closing}
                  </p>
                </blockquote>
              </Reveal>

              {/* ---- credentials ---- */}
              <div className="mt-14 border-t border-border pt-10">
                <Reveal>
                  <p className="fs-eyebrow mb-6 flex items-center gap-2.5 text-primary-contrast">
                    <GraduationCap aria-hidden="true" className="h-[17px] w-[17px]" />
                    {credentialsCopy.eyebrow}
                  </p>
                </Reveal>

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

              <Reveal delay={0.2}>
                <Link
                  to="/programs"
                  className="press group mt-11 inline-flex h-[52px] items-center justify-center gap-2 rounded-pill border border-[rgba(var(--primary-rgb),0.34)] bg-surface px-7 font-semibold text-primary-contrast transition-colors hover:bg-primary-soft"
                >
                  {briefBrand.secondaryCta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
          </div>
        </SectionWrapper>

        {/* ---- how the practice works ---- */}
        <SectionWrapper id="how-we-work" bg="alt" labelledBy="how-heading" arc="right">
          <SectionHeading
            id="how-heading"
            align="center"
            eyebrow={whyGoRebalanceCopy.eyebrow}
            title="How This *Practice* Works"
          />

          <ul className="m-0 mt-14 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <Reveal stagger={0.07} childAs="li" childClassName="h-full">
              {whyGoRebalance.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex h-full flex-col rounded-[22px] border border-border bg-surface p-[26px_24px] surface-raise"
                  >
                    <span
                      aria-hidden="true"
                      className="mb-5 flex h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-primary-soft"
                    >
                      <Icon size={20} className="text-primary" />
                    </span>
                    <h3 className="mb-2.5 font-fraunces text-[17px] font-medium leading-snug text-text">
                      {item.title}
                    </h3>
                    <p className="font-jakarta text-[14.5px] leading-[1.65] text-text-muted">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </Reveal>
          </ul>

          <Reveal delay={0.14}>
            <blockquote className="mx-auto mt-12 max-w-[56ch] border-l-2 border-accent pl-6">
              <p className="font-fraunces text-[clamp(1.05rem,1.9vw,1.25rem)] font-medium italic leading-[1.5] text-text">
                {whyGoRebalanceCopy.pull}
              </p>
            </blockquote>
          </Reveal>
        </SectionWrapper>

        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
