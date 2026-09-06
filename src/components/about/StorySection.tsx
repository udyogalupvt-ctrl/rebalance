import { Link } from "@tanstack/react-router";
import * as React from "react";
import { motion, useScroll, useTransform, useInView, useReducedMotion } from "framer-motion";
import {
  Camera,
  Quote,
  Ear,
  Utensils,
  Microscope,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { practitionerStory } from "@/data/content";

const iconMap: Record<string, React.ElementType> = {
  Ear,
  Utensils,
  Microscope,
  HeartHandshake,
};

function Portrait() {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <Reveal className="mb-[56px] md:mb-[72px]">
      <figure className="m-0 mx-auto w-full max-w-[420px] md:max-w-[520px]">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-[20px] md:rounded-[28px] aspect-[4/5] md:aspect-square"
        >
          <motion.img
            src={practitionerStory.portrait.src}
            alt={practitionerStory.portrait.alt}
            width={1040}
            height={1300}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 25%",
              scale: reduce ? 1 : 1.06,
              y: reduce ? 0 : y,
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(var(--dark-surface-rgb), 0.35)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[20px] md:rounded-[28px] ring-1 ring-inset ring-border pointer-events-none"
          />
        </div>
        <figcaption className="mt-[14px] flex items-center justify-center gap-2 text-[13px] text-text-muted">
          <Camera size={14} className="opacity-60 shrink-0" aria-hidden="true" />
          {practitionerStory.portrait.caption}
        </figcaption>
      </figure>
    </Reveal>
  );
}

function PullQuote() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  return (
    <figure
      ref={ref}
      className="relative m-0 my-[44px] lg:my-[56px] w-full lg:max-w-[900px] lg:mx-auto"
      style={{ zIndex: 0 }}
    >
      <Quote
        size={96}
        aria-hidden="true"
        className="absolute -top-5 left-3 text-primary opacity-[0.07] pointer-events-none"
        style={{ zIndex: -1 }}
      />
      <div className="relative flex">
        <motion.span
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-[4px] rounded-pill bg-accent origin-top"
          initial={reduce ? false : { scaleY: 0 }}
          animate={reduce || inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="pl-6 md:pl-8"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <blockquote className="m-0">
            <p
              className="font-fraunces italic font-normal text-text m-0"
              style={{
                fontSize: "clamp(1.375rem, 2.6vw, 1.875rem)",
                lineHeight: 1.4,
                letterSpacing: "-0.015em",
              }}
            >
              {practitionerStory.pullQuote.text}
            </p>
          </blockquote>
          <figcaption className="mt-5">
            <span className="block w-6 h-[2px] bg-accent mb-3" aria-hidden="true" />
            <cite className="not-italic text-[14px] font-medium text-text-muted">
              {practitionerStory.pullQuote.attribution}
            </cite>
          </figcaption>
        </motion.div>
      </div>
    </figure>
  );
}

export function StorySection() {
  const [p1, p2, p3] = practitionerStory.paragraphs;

  return (
    <SectionWrapper id="story" bg="base" labelledBy="story-heading">
      <style>{`
        .story-lead::first-letter { font-size: 1em; }
        @media (min-width: 480px) {
          .story-lead::first-letter {
            font-family: var(--font-fraunces);
            font-weight: 500;
            float: left;
            font-size: 4.2em;
            line-height: 0.82;
            margin: 6px 14px 0 0;
            color: var(--accent);
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 w-[620px] h-[620px] rounded-full bg-primary opacity-[0.04] blur-[150px] pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <div className="relative" style={{ zIndex: 1 }}>
        <Portrait />

        <div className="max-w-[720px] mx-auto">
          <SectionHeading
            align="left"
            eyebrow="HER STORY"
            title="Eight years of asking a better *question*."
            className="!mb-8"
          />

          <Reveal>
            <p
              className="story-lead text-text font-normal mb-9"
              style={{ fontSize: "clamp(1.125rem, 1.6vw, 1.3125rem)", lineHeight: 1.6 }}
            >
              {practitionerStory.intro}
            </p>
          </Reveal>

          <Reveal>
            <p className="fs-body text-text-muted" style={{ lineHeight: 1.8 }}>
              {p1}
            </p>
          </Reveal>
          <Reveal delay={0.07}>
            <p className="fs-body text-text-muted mt-6" style={{ lineHeight: 1.8 }}>
              {p2}
            </p>
          </Reveal>
        </div>

        <PullQuote />

        <div className="max-w-[720px] mx-auto">
          <Reveal>
            <p className="fs-body text-text-muted" style={{ lineHeight: 1.8 }}>
              {p3}
            </p>
          </Reveal>

          {/* Pillars */}
          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-7">
            {practitionerStory.pillars.map((pillar, i) => {
              const Icon = iconMap[pillar.icon] ?? Ear;
              return (
                <Reveal key={pillar.title} delay={i * 0.07}>
                  <div className="w-10 h-10 rounded-[12px] bg-primary-soft flex items-center justify-center mb-4">
                    <Icon size={19} className="text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-fraunces font-medium text-[17px] text-text mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-[14.5px] text-text-muted" style={{ lineHeight: 1.65 }}>
                    {pillar.body}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Credentials */}
        <Reveal className="mt-[56px] md:mt-[72px] w-full max-w-[720px] lg:max-w-[900px] mx-auto">
          <div className="bg-surface-alt border border-border rounded-[24px] px-[22px] py-[26px] md:px-9 md:py-8">
            <h3 className="fs-eyebrow text-text-muted mb-[22px] tracking-[0.14em]">
              QUALIFICATIONS &amp; FOCUS AREAS
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-[14px] gap-x-8 list-none p-0 m-0">
              {practitionerStory.credentials.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2
                    size={16}
                    className="text-primary shrink-0 mt-[3px]"
                    aria-hidden="true"
                  />
                  <span className="text-[14.5px] text-text-muted" style={{ lineHeight: 1.6 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Inline CTA */}
        <Reveal className="mt-[44px] md:mt-[56px] max-w-[720px] mx-auto">
          <div className="text-center">
            <p
              className="font-fraunces font-medium text-text mb-[18px]"
              style={{ fontSize: "clamp(1.0625rem, 1.6vw, 1.25rem)" }}
            >
              Curious whether this approach fits what you&rsquo;re dealing with?
            </p>
            <Link
              to="/assessment"
              className="group inline-flex items-center gap-2 h-[52px] px-[30px] rounded-pill border-[1.5px] border-primary text-primary text-[15px] font-semibold transition-all duration-300 hover:bg-primary-soft hover:-translate-y-0.5"
            >
              Take the Assessment
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
