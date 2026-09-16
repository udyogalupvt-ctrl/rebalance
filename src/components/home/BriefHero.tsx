import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, CircleCheck, Leaf, ShieldCheck, Soup, Video } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { briefHero, briefBrand, heroPracticeCard } from "@/data/content";
import { HOME_HERO_SLIDES, OWN } from "@/data/images";
import { HeroBackdrop, HeroBackdropDots } from "@/components/shared/HeroBackdrop";
import { useBackdropCarousel } from "@/hooks/use-backdrop-carousel";

/**
 * The opening frame, set to the practice's own reference page.
 *
 * Copy on the left — the line, what it means for the reader, the call to
 * book — and on the right a card introducing the person behind the practice,
 * with the principle she works to. The photograph carousel runs behind both:
 * held back under the copy so every word reads on clean ground, and left at
 * near full strength on the right, where the card brings its own surface.
 *
 * Nothing here is a number somebody would have to take on faith. The three
 * chips under the buttons are the three things the practice says about how it
 * works, in its own words.
 */
const TRUST_ICONS = [ShieldCheck, Video, Soup];

/** "Rebalance From Within." — the last word set in the accent italic. */
function Headline({ text }: { text: string }) {
  const cut = text.trimEnd().lastIndexOf(" ");
  if (cut < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, cut)}{" "}
      <span className="italic text-accent-contrast">{text.slice(cut + 1)}</span>
    </>
  );
}

export function BriefHero() {
  const reduce = useReducedMotion();
  const backdrop = useBackdropCarousel(HOME_HERO_SLIDES.length, 6500);

  const rise = (delay: number, y = 12) => ({
    initial: reduce ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 0.6,
      delay: reduce ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  });

  return (
    <section
      id="hero"
      className="relative isolate flex w-full flex-col justify-center overflow-hidden bg-bg pb-20 pt-[calc(var(--header-h)+48px)] sm:pb-24 lg:min-h-[92svh] lg:pb-28 lg:pt-[calc(var(--header-h)+56px)]"
    >
      {/* ---- ground ---- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <HeroBackdrop
          slides={HOME_HERO_SLIDES}
          index={backdrop.index}
          className="hero-backdrop--brief"
        />
        <div className="hero-veil hero-veil--split absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="container-x relative z-10 w-full">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          {/* ---- copy ---- */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            <motion.p
              {...rise(0)}
              className="mb-7 inline-flex max-w-full items-center gap-2 rounded-pill border border-[rgba(var(--primary-rgb),0.22)] bg-[rgba(var(--surface-rgb),0.9)] px-4 py-2 font-jakarta text-[12.5px] font-semibold tracking-[0.01em] text-primary-contrast sm:text-[13px]"
            >
              <Leaf aria-hidden="true" className="h-[14px] w-[14px] shrink-0 text-primary" />
              <span className="min-w-0">{briefHero.badge}</span>
            </motion.p>

            <motion.h1 {...rise(0.06, 16)} className="fs-display mb-6 text-balance text-text">
              <Headline text={briefHero.headline} />
            </motion.h1>

            <motion.p
              {...rise(0.16)}
              className="fs-sub mb-10 max-w-[46ch] text-balance text-text-muted"
            >
              {briefHero.supporting}
            </motion.p>

            <motion.div
              {...rise(0.26)}
              className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3.5"
            >
              <Link
                to="/assessment"
                className="press group inline-flex h-14 items-center justify-center gap-2 rounded-pill bg-accent-strong px-8 font-semibold text-on-accent shadow-[0_10px_28px_rgba(var(--accent-rgb),0.26)]"
              >
                {briefBrand.primaryCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/programs"
                className="press inline-flex h-14 items-center justify-center gap-2 rounded-pill border border-[rgba(var(--primary-rgb),0.34)] bg-surface px-8 font-semibold text-primary-contrast shadow-[0_2px_10px_rgba(var(--shadow-rgb),0.05)] transition-colors hover:bg-primary-soft"
              >
                {briefBrand.secondaryCta}
              </Link>
            </motion.div>

            <motion.ul
              {...rise(0.36, 10)}
              className="mt-10 flex list-none flex-wrap items-center justify-center gap-2.5 p-0 lg:justify-start"
            >
              {briefHero.trust.map((label, i) => {
                const Icon = TRUST_ICONS[i] ?? CircleCheck;
                return (
                  <li key={label}>
                    <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-[rgba(var(--surface-rgb),0.9)] px-3.5 py-2 font-jakarta text-[13px] text-text-muted">
                      <Icon
                        className="h-[15px] w-[15px] shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      {label}
                    </span>
                  </li>
                );
              })}
            </motion.ul>

            <motion.div {...rise(0.46, 0)} className="mt-9">
              <HeroBackdropDots
                slides={HOME_HERO_SLIDES}
                index={backdrop.index}
                onSelect={backdrop.select}
              />
            </motion.div>
          </div>

          {/* ---- practice lead ---- */}
          <motion.aside
            {...rise(0.3, 20)}
            aria-labelledby="practice-lead-name"
            className="mx-auto w-full max-w-[460px] lg:col-span-5 lg:mr-0 lg:max-w-[440px]"
          >
            <div className="relative overflow-hidden rounded-[28px] border border-[rgba(var(--primary-rgb),0.16)] bg-[rgba(var(--surface-rgb),0.97)] p-6 shadow-[0_30px_80px_rgba(var(--shadow-rgb),0.18)] sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.16),transparent_68%)]"
              />

              <div className="relative flex items-center gap-4">
                <img
                  src={OWN.practitionerSmall}
                  width={640}
                  height={853}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  fetchPriority="high"
                  className="h-[84px] w-[68px] shrink-0 rounded-[34px_34px_14px_14px] border border-[rgba(var(--primary-rgb),0.18)] object-cover object-[50%_14%]"
                />
                <div className="min-w-0">
                  <p className="fs-eyebrow mb-1.5 text-primary-contrast">
                    {heroPracticeCard.eyebrow}
                  </p>
                  <p
                    id="practice-lead-name"
                    className="font-fraunces text-[19px] font-medium leading-tight text-text"
                  >
                    {heroPracticeCard.name}
                  </p>
                  <p className="mt-1 font-jakarta text-[13px] leading-snug text-accent-contrast">
                    {heroPracticeCard.role}
                  </p>
                </div>
              </div>

              <div className="relative mt-6 rounded-[20px] bg-primary-soft p-5">
                <p className="fs-eyebrow mb-2.5 text-primary-contrast">
                  {heroPracticeCard.principleLabel}
                </p>
                <p className="font-fraunces text-[16.5px] font-medium italic leading-[1.5] text-text">
                  “{heroPracticeCard.principle}”
                </p>
              </div>

              <ul className="relative m-0 mt-5 flex list-none flex-col gap-2.5 p-0">
                {heroPracticeCard.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 font-jakarta text-[14.5px] text-text"
                  >
                    <CircleCheck
                      aria-hidden="true"
                      className="h-[18px] w-[18px] shrink-0 text-primary"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="relative mt-5 border-t border-border pt-4">
                <Link
                  to="/about"
                  className="group inline-flex min-h-11 items-center gap-1.5 font-jakarta text-[14px] font-semibold text-accent-contrast"
                >
                  {heroPracticeCard.link}
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      <motion.a
        href="#focus"
        aria-label="Skip to how we can support you"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.9 }}
        className="absolute bottom-7 left-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-border bg-[rgba(var(--surface-rgb),0.7)] text-text-muted backdrop-blur-md transition-colors hover:text-text lg:grid"
      >
        <ChevronDown className="h-[18px] w-[18px] animate-bounce" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
