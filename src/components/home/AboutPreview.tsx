import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Award, Star, MapPin, ArrowRight, Quote } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CountUp } from "@/components/shared/CountUp";
import { CurveDivider } from "@/components/shared/CurveDivider";
import { stats, brand, locations } from "@/data/content";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export function AboutPreview() {
  const containerRef = React.useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [-3, -1.5]);
  const imageY = useTransform(scrollYProgress, [0, 1], [24, -24]);

  const locationString = locations.map((l) => l.label).join(" · ");

  return (
    <>
      <CurveDivider fill="alt" />
      <SectionWrapper
        texture="weave"
        arc="right"
        id="about"
        bg="alt"
        labelledBy="about-heading"
        className="overflow-x-clip overflow-y-visible"
      >
        {/* Decorative Glow */}
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/4 rounded-full blur-[140px] pointer-events-none -z-10 -translate-x-1/4 translate-y-1/4"
          aria-hidden="true"
        />

        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-[48px] lg:gap-[56px] xl:gap-[64px] 2xl:gap-[72px] items-center"
        >
          {/* Left Column: Portrait Composition */}
          <Reveal className="relative w-full max-w-[480px] lg:max-w-none mx-auto">
            <div className="relative aspect-[4/5] w-full max-w-[420px] mx-auto">
              {/* Layer 1: Back Accent Block */}
              <motion.div
                style={{ rotate: shouldReduceMotion ? -3 : rotate }}
                className="absolute inset-[-24px_-24px_24px_24px] bg-primary-soft rounded-[28px] -z-20"
                aria-hidden="true"
              />

              {/* Layer 3: Dot Grid */}
              <div
                className="absolute -top-5 -left-5 z-[-15] opacity-30 text-accent"
                aria-hidden="true"
              >
                <svg width="70" height="70" viewBox="0 0 70 70" fill="currentColor">
                  {[...Array(5)].map((_, r) =>
                    [...Array(5)].map((_, c) => (
                      <circle key={`${r}-${c}`} cx={4 + c * 14} cy={4 + r * 14} r="2" />
                    )),
                  )}
                </svg>
              </div>

              {/* Layer 2: The Photo */}
              <div className="relative h-full w-full rounded-[28px] overflow-hidden border border-border z-0">
                <motion.img
                  style={{
                    y: shouldReduceMotion ? 0 : imageY,
                    scale: shouldReduceMotion ? 1 : 1.08,
                  }}
                  src="/founder.jpg"
                  alt="Dt. N. Sai Sowjanya, clinical nutritionist and gut health specialist"
                  width={1086}
                  height={1448}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-[center_top]"
                  // Served from /public now. The old source was an asset-host
                  // URL that never resolved, so every visitor actually saw the
                  // stock fallback rather than the practitioner.
                  srcSet="/founder-sm.jpg 640w, /founder.jpg 1086w"
                  sizes="(max-width: 640px) 90vw, 420px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-surface)]/28 to-transparent pointer-events-none" />
              </div>

              {/* Layer 4: Floating Credential Card */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotate: -4 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.35 }}
                className={cn(
                  // No `glass` here. It sets background-color: rgba(surface, .72),
                  // which competes with bg-surface/88 below and wins -- so the card
                  // rendered at 72% and the founder photo tinted it, dropping the
                  // muted second line to 4.28:1 against a required 4.5. At the 88%
                  // that was actually intended the worst case is 4.93:1 even over
                  // pure black. The border colour comes from the base layer and the
                  // blur is already declared, so `glass` was adding nothing else.
                  "absolute z-10 p-[18px_22px] rounded-[20px] border shadow-[0_16px_40px_rgba(var(--shadow-rgb), 0.12)] bg-surface/88 backdrop-blur-[16px]",
                  "bottom-[-20px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] md:w-auto md:bottom-[-28px] md:left-[-28px] md:translate-x-0",
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-strong flex items-center justify-center shrink-0">
                    <Award size={20} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-text leading-tight">
                      8+ Years · 500+ Clients
                    </span>
                    <span className="text-[13px] text-text-muted">Rebalanced from the root</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </Reveal>

          {/* Right Column: Content */}
          <div className="flex flex-col">
            <Reveal delay={0.15}>
              <SectionHeading
                eyebrow="MEET YOUR NUTRITIONIST"
                title="Care that begins with *listening*, not prescribing."
                align="left"
                className="mb-0 text-left"
              />

              <div className="mt-[24px] mb-[24px] p-6 bg-primary-soft/50 border-l-4 border-accent rounded-r-2xl italic text-primary/90 relative overflow-hidden group">
                <Quote
                  size={40}
                  className="absolute -right-2 -bottom-2 text-accent/10 rotate-12 transition-transform group-hover:scale-110"
                />
                <p className="fs-body font-fraunces text-lg leading-relaxed relative z-10">
                  "Nutrition isn't about restriction. It's about giving your body the right
                  environment to heal itself."
                </p>
              </div>
            </Reveal>

            <div className="space-y-[18px] max-w-[62ch]">
              <Reveal delay={0.23}>
                <p className="fs-body text-text-muted">
                  I'm Dt. N. Sai Sowjanya, a clinical nutritionist specialising in gut health,
                  digestive disorders and hormonal balance. I consult from my clinic in Kakinada,
                  Andhra Pradesh — and online with clients across India.
                </p>
              </Reveal>
              <Reveal delay={0.31}>
                <p className="fs-body text-text-muted">
                  My approach is simple:{" "}
                  {/* A real text-decoration, not an absolutely positioned bar
                      on an inline-block. The old markup could not wrap: an
                      inline-block is atomic, so on a narrow screen the phrase
                      dropped onto its own lines, pushed the following full stop
                      to a line of its own, and drew one full-width rule across
                      the whole box instead of under each line. */}
                  <span className="text-text font-medium underline decoration-accent/40 decoration-2 underline-offset-4">
                    symptoms are messages, not problems to be silenced
                  </span>
                  . Before I build a single meal plan, I want to understand your digestion, your
                  sleep, your stress, your cycle and what your day actually looks like. That's where
                  the real answers live.
                </p>
              </Reveal>
              <Reveal delay={0.39}>
                <p className="fs-body text-text-muted">
                  Every plan I create is built around real Indian food — your kitchen, your family's
                  meals, your schedule and your budget. No exotic ingredients, no crash diets, no
                  protocols you'll abandon in three weeks.
                </p>
              </Reveal>
            </div>

            {/* Stats Row */}
            <Reveal delay={0.47} className="mt-[36px] pt-[28px] border-t border-border">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="fs-h2 text-primary leading-none">
                        {stat.label === "Client Rating" ? (
                          <div className="flex items-center gap-1.5">
                            <span>4.9</span>
                            <Star size={18} fill="currentColor" className="text-accent shrink-0" />
                          </div>
                        ) : (
                          <div className="flex items-baseline">
                            <CountUp value={Number(stat.value.replace(/\+/g, ""))} duration={1.6} />
                            {stat.value.includes("+") && <span>+</span>}
                          </div>
                        )}
                      </span>
                    </div>
                    <span className="text-[13px] text-text-muted tracking-[0.02em] mt-1.5 leading-tight">
                      {stat.label}
                    </span>
                    <span className="sr-only">
                      {stat.value} {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Signature + CTA */}
            <Reveal
              delay={0.55}
              className="mt-[32px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-7 sm:gap-6"
            >
              <div className="flex flex-col">
                <span className="font-fraunces italic text-[1.25rem] lg:text-[1.5rem] text-text leading-tight">
                  {brand.practitioner}
                </span>
                <span className="text-[13px] text-text-muted mt-1">{brand.credential}</span>
                <div className="flex items-center gap-1.5 text-[13px] text-text-muted mt-1">
                  <MapPin size={14} className="text-primary shrink-0" />
                  <span>{locationString}</span>
                </div>
              </div>

              <Link
                to="/about"
                className="group h-[52px] px-7 rounded-pill border-[1.5px] border-primary text-primary font-semibold text-[15px] flex items-center gap-2 hover:bg-primary-soft press"
              >
                Read My Full Story
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
