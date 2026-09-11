import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Users, Video, UserCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { briefHero, briefBrand } from "@/data/content";
import { HOME_HERO_SLIDES } from "@/data/images";
import { HeroBackdrop, HeroBackdropDots } from "@/components/shared/HeroBackdrop";
import { useBackdropCarousel } from "@/hooks/use-backdrop-carousel";

/**
 * The opening frame.
 *
 * The brief asks for this to be "clean and confident", and it names the three
 * lines it wants: the practice, what the practice is, and what that means for
 * the person reading. So the hero carries those three and nothing else —
 * no statistics, no client counts, no claims about what nutrition will do.
 * Everything the old hero leaned on for weight was either invented or a
 * medical promise, and both are out of bounds.
 *
 * The layout is centred rather than split. The founder's portrait is the
 * single strongest thing this practice has, and it appears once, in Meet Sai,
 * where the story that goes with it starts — framing it twice within one
 * screen is what made the page read as padded rather than considered.
 *
 * THE TAGLINE IS UNDER REVIEW. It is one line from one constant, set on its
 * own, so a replacement of any length drops straight in. Nothing below it is
 * positioned relative to it.
 */
/**
 * The three proofs under the buttons.
 *
 * Each is a plain fact from the practice's own brief: who it is for, how
 * consultations happen, and that guidance comes from one person rather than a
 * coaching team. Nothing here is a number somebody would have to take on
 * faith.
 */
const TRUST = [
  { icon: Users, label: "Personalised support, ages 15–50" },
  { icon: Video, label: "One-to-one online consultations" },
  { icon: UserCheck, label: "Founder-led, never templated" },
];

export function BriefHero() {
  const reduce = useReducedMotion();
  const backdrop = useBackdropCarousel(HOME_HERO_SLIDES.length, 6500);

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[92svh] w-full flex-col items-center justify-center overflow-hidden bg-bg pb-24 pt-[calc(var(--header-h)+64px)] sm:pb-28 lg:pb-32 lg:pt-[calc(var(--header-h)+80px)]"
    >
      {/* ---- ground ----
          A slow carousel of the practice's subject matter, held well back.
          The brief wants generous white space and a natural palette, so the
          photographs are ground rather than picture: the copy sits on clean
          porcelain and the imagery breathes around it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <HeroBackdrop
          slides={HOME_HERO_SLIDES}
          index={backdrop.index}
          className="hero-backdrop--brief"
        />
        <div className="hero-veil hero-veil--brief absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(var(--primary-rgb),0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="container-x relative z-10 w-full">
        <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.5 }}
            className="fs-eyebrow mb-7 text-primary-contrast"
          >
            {briefBrand.founderRole}
          </motion.p>

          {/* The practice's name, set as the page's one h1. */}
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="fs-display mb-6 text-text"
          >
            {briefHero.headline}
          </motion.h1>

          {/* The positioning line — under review, and deliberately alone. */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.16 }}
            className="mb-5 max-w-[34ch] text-balance font-fraunces text-[clamp(1.3rem,2.6vw,1.85rem)] font-medium italic leading-[1.35] text-accent-contrast"
          >
            {briefHero.positioning}
          </motion.p>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.26 }}
            className="fs-sub mb-10 max-w-[52ch] text-balance"
          >
            {briefHero.supporting}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.36 }}
            className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3.5"
          >
            <Link
              to="/assessment"
              className="press group inline-flex h-14 items-center justify-center gap-2 rounded-pill bg-accent-strong px-8 font-semibold text-on-accent shadow-[0_10px_28px_rgba(var(--accent-rgb),0.26)]"
            >
              {briefBrand.primaryCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#programs"
              className="press inline-flex h-14 items-center justify-center gap-2 rounded-pill border border-[rgba(var(--primary-rgb),0.34)] bg-surface px-8 font-semibold text-primary-contrast shadow-[0_2px_10px_rgba(var(--shadow-rgb),0.05)] transition-colors hover:bg-primary-soft"
            >
              {briefBrand.secondaryCta}
            </a>
          </motion.div>

          {/*
            Three short proofs, every one of them something the practice
            actually says about itself in its own brief. No client counts, no
            years, no ratings — the page earns trust by being specific rather
            than by being impressive.
          */}
          <motion.ul
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.46 }}
            className="mt-12 flex list-none flex-wrap items-center justify-center gap-2.5 p-0"
          >
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label}>
                {/* Each proof carries its own surface.
                    The row is wider than the veil's readable ellipse, so its
                    outer two items sat directly on the photograph. A chip
                    brings its own ground with it and reads as deliberate
                    rather than as text that escaped the safe zone. */}
                <span className="inline-flex items-center gap-2.5 rounded-pill border border-border bg-[rgba(var(--surface-rgb),0.82)] px-4 py-2.5 font-jakarta text-[13px] text-text-muted backdrop-blur-md">
                  <Icon className="h-[15px] w-[15px] shrink-0 text-primary" aria-hidden="true" />
                  {label}
                </span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.56 }}
            className="mt-10"
          >
            <HeroBackdropDots
              slides={HOME_HERO_SLIDES}
              index={backdrop.index}
              onSelect={backdrop.select}
            />
          </motion.div>
        </div>
      </div>

      {/* A quiet cue that the page continues. The hero fills the screen now,
          and a full-height opening with no edge visible is the one layout
          that genuinely leaves people unsure there is anything below it. */}
      <motion.a
        href="#focus"
        aria-label="Skip to what we support"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.9 }}
        className="absolute bottom-8 left-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-border bg-[rgba(var(--surface-rgb),0.7)] text-text-muted backdrop-blur-md transition-colors hover:text-text lg:grid"
      >
        <ChevronDown className="h-[18px] w-[18px] animate-bounce" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
