import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  GraduationCap,
  Microscope,
  Stethoscope,
  Video,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { MetaChip } from "@/components/shared/MetaChip";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CardRail } from "@/components/shared/CardRail";
import { Credentials } from "@/components/home/Credentials";
import { FinalCta } from "@/components/home/FinalCta";
import {
  aboutHero,
  aboutProfile,
  aboutCredentialsCopy,
  aboutCta,
  myStory,
  meetSai,
  whyGoRebalance,
  whyGoRebalanceCopy,
  briefBrand,
} from "@/data/content";
import { PAGE_BACKDROPS } from "@/data/images";

const HIGHLIGHT_ICONS = [Stethoscope, GraduationCap, Microscope];

function renderTitle(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} className="italic text-accent-contrast">
        {part.slice(1, -1)}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

/**
 * About — the founder's story, in her own words, from the practice's About
 * reference.
 *
 * The profile card holds its place beside the story on a wide screen, so her
 * face and the way to work with her stay in view for the length of a long
 * read. On a phone it comes first, then the story.
 *
 * The practice asked for this page not to describe a one-practitioner
 * practice, so nothing here does: it introduces the founder and practice
 * lead, and the practice is Go Rebalance.
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
          eyebrow={aboutHero.eyebrow}
          title={aboutHero.title}
          subtitle={aboutHero.subtitle}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
          ]}
        >
          <MetaChip icon={Stethoscope} label="Clinical Dietetics Training" />
          <MetaChip icon={Microscope} label="Advanced Gut Health (IIN)" />
          <MetaChip icon={Video} label="1-on-1 Online Consultations" />
        </PageHero>

        {/* ---- profile + story ---- */}
        <SectionWrapper id="story" bg="base" labelledBy="story-heading">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5 lg:sticky lg:top-[112px] lg:self-start">
              <aside
                aria-label={`About ${aboutProfile.name}`}
                className="mx-auto max-w-[440px] overflow-hidden rounded-[30px] border border-[rgba(var(--primary-rgb),0.16)] bg-surface shadow-[0_28px_70px_rgba(var(--shadow-rgb),0.14)] lg:mx-0 lg:max-w-none"
              >
                <div className="relative bg-surface-alt">
                  <img
                    src={meetSai.image}
                    srcSet="/founder-sm.jpg 640w, /founder.jpg 1086w"
                    sizes="(min-width: 1024px) 440px, (min-width: 640px) 440px, 90vw"
                    width={1086}
                    height={1448}
                    alt={`${aboutProfile.name}, ${briefBrand.founderRole}`}
                    fetchPriority="high"
                    decoding="async"
                    className="block aspect-[4/4.4] w-full object-cover object-[50%_14%] lg:aspect-auto lg:h-[300px] xl:h-[330px]"
                  />
                  <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-pill bg-surface px-3.5 py-1.5 font-jakarta text-[12.5px] font-semibold text-primary-contrast shadow-[0_8px_20px_rgba(var(--shadow-rgb),0.14)]">
                    <BadgeCheck aria-hidden="true" className="h-4 w-4 text-primary" />
                    {meetSai.badge}
                  </span>
                </div>

                <div className="p-7">
                  <p className="font-fraunces text-[22px] font-medium leading-tight text-text">
                    {aboutProfile.name}
                  </p>
                  <p className="mt-1.5 font-jakarta text-[14px] font-medium text-accent-contrast">
                    {aboutProfile.role}
                  </p>
                  <p className="mt-0.5 font-jakarta text-[13.5px] text-text-muted">
                    {briefBrand.founderRole}
                  </p>

                  <ul className="m-0 mt-6 flex list-none flex-col gap-3 border-t border-border p-0 pt-6">
                    {aboutProfile.highlights.map((item, i) => {
                      const Icon = HIGHLIGHT_ICONS[i] ?? GraduationCap;
                      return (
                        <li key={item} className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-primary-soft"
                          >
                            <Icon className="h-[17px] w-[17px] text-primary" />
                          </span>
                          <span className="font-jakarta text-[14.5px] font-medium text-text">
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <Link
                    to="/assessment"
                    className="press group mt-7 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-pill bg-accent-strong px-7 font-semibold text-on-accent shadow-[0_10px_26px_rgba(var(--accent-rgb),0.24)]"
                  >
                    {aboutProfile.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </aside>
            </Reveal>

            <div className="lg:col-span-7">
              <Reveal>
                <p className="fs-eyebrow mb-5 text-primary-contrast">{myStory.eyebrow}</p>
                <h2 id="story-heading" className="fs-h2 mb-8 text-text">
                  {renderTitle(myStory.title)}
                </h2>
              </Reveal>

              {myStory.paragraphs.map((para, i) => (
                <Reveal key={i} delay={0.05 + Math.min(i, 5) * 0.04}>
                  <p
                    className={
                      i === 0
                        ? "mb-6 max-w-[60ch] font-fraunces text-[clamp(1.1rem,1.8vw,1.3rem)] leading-[1.6] text-text"
                        : "fs-body mb-5 max-w-[62ch] text-text-muted"
                    }
                  >
                    {para}
                  </p>
                </Reveal>
              ))}

              <Reveal delay={0.3}>
                <blockquote className="m-0 mt-9 rounded-[22px] border border-[rgba(var(--accent-rgb),0.3)] bg-accent-soft p-7">
                  <p className="font-fraunces text-[clamp(1.15rem,2.2vw,1.45rem)] font-medium italic leading-[1.45] text-text">
                    {myStory.closing}
                  </p>
                  <footer className="mt-4 font-jakarta text-[14px] font-semibold text-accent-contrast">
                    — {aboutProfile.name}
                  </footer>
                </blockquote>
              </Reveal>
            </div>
          </div>
        </SectionWrapper>

        <Credentials
          id="about-credentials"
          bg="alt"
          eyebrow={aboutCredentialsCopy.eyebrow}
          title={aboutCredentialsCopy.title}
          subtitle={aboutCredentialsCopy.subtitle}
        />

        {/* ---- how the practice works ---- */}
        <SectionWrapper id="how-we-work" bg="base" labelledBy="how-heading" texture="contour">
          <SectionHeading
            id="how-heading"
            align="center"
            eyebrow={whyGoRebalanceCopy.eyebrow}
            title={whyGoRebalanceCopy.title}
            subtitle={whyGoRebalanceCopy.subtitle}
          />

          <CardRail
            count={whyGoRebalance.length}
            label="How Go Rebalance works"
            wrapperClassName="mt-12"
            className="md:grid md:grid-cols-2 md:gap-5 xl:grid-cols-4 xl:gap-6"
          >
            <Reveal stagger={0.07} childAs="li">
              {whyGoRebalance.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex flex-col rounded-[24px] border border-border bg-surface p-7 surface-raise"
                  >
                    <span
                      aria-hidden="true"
                      className="mb-6 flex h-[48px] w-[48px] items-center justify-center rounded-[15px] bg-primary-soft"
                    >
                      <Icon size={20} className="text-primary" />
                    </span>
                    <h3 className="mb-2.5 font-fraunces text-[17.5px] font-medium leading-snug text-text">
                      {item.title}
                    </h3>
                    <p className="font-jakarta text-[14.5px] leading-[1.65] text-text-muted">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </Reveal>
          </CardRail>
        </SectionWrapper>

        <FinalCta title={aboutCta.title} body={aboutCta.body} />
      </main>
      <Footer />
    </>
  );
}
