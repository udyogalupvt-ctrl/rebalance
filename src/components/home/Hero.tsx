import * as React from "react";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CountUp } from "@/components/shared/CountUp";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1786640442878-0c216561af21?auto=format&fit=crop&q=80&w=2000",
    alt: "Hands pressing fresh roti onto a hot tawa in a home kitchen",
    position: "50% 45%",
  },
  {
    src: "https://images.unsplash.com/photo-1783245255807-cdc7ccb20942?auto=format&fit=crop&q=80&w=2000",
    alt: "Two women rolling dough and cooking flatbreads together on a griddle",
    position: "50% 40%",
  },
  {
    src: "https://images.unsplash.com/photo-1767114915936-745dd372f1d8?auto=format&fit=crop&q=80&w=2000",
    alt: "A home-cooked meal of spinach curry served with warm flatbread",
    position: "50% 50%",
  },
  {
    src: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=2000",
    alt: "A market stall stacked with fresh seasonal fruit and vegetables",
    position: "50% 50%",
  },
] as const;

const HEADLINE = "Heal the gut. Rebalance the whole you.";

/** Autoplay dwell per slide. The indicator fill is driven from the same value. */
const SLIDE_MS = 6000;

const TRUST = ["Online & In-Clinic · Kakinada", "500+ Lives Rebalanced", "Root-Cause Protocols"];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return; // no autoplay under reduced motion
    const timer = setInterval(() => setCurrent((p) => (p + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(timer);
  }, [reduce]);

  const words = HEADLINE.split(" ");

  return (
    <section
      id="hero"
      /* Bottom-weighted on phones so the headline sits over the photograph
         rather than floating in the middle of it; optically centred from lg
         where there is room for the two-column layout. */
      className="relative min-h-[100svh] w-full overflow-hidden flex items-end lg:items-center bg-dark-surface"
    >
      {/* Slideshow */}
      {SLIDES.map((slide, i) => (
        <motion.div
          key={i}
          aria-hidden={i !== current}
          initial={{ opacity: i === 0 ? 1 : 0 }}
          animate={{
            opacity: i === current ? 1 : 0,
            scale: reduce ? 1 : i === current ? 1.08 : 1,
          }}
          transition={{ duration: reduce ? 0 : 1.6, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slide.src}
            alt={i === 0 ? slide.alt : ""}
            width={2000}
            height={1333}
            loading={i === 0 ? "eager" : "lazy"}
            {...(i === 0 ? { fetchPriority: "high" as const } : {})}
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: slide.position }}
          />
        </motion.div>
      ))}

      {/* Scrim.
          Content is left-aligned at every width now, so the phone scrim is
          weighted to the bottom (where the copy sits) and the desktop one
          stays directional, leaving the right of the frame open for the
          photograph and the credential card. */}
      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(var(--dark-surface-rgb),0.55)_0%,rgba(var(--dark-surface-rgb),0.78)_45%,rgba(var(--dark-surface-rgb),0.94)_100%)] lg:bg-[linear-gradient(100deg,rgba(var(--dark-surface-rgb),0.95)_0%,rgba(var(--dark-surface-rgb),0.84)_46%,rgba(var(--dark-surface-rgb),0.55)_100%)]"
        aria-hidden="true"
      />
      {/* Blend into the section below. Kept shallow: at h-40 this washed the
          bottom of the frame to near-page-background, and the slide indicators
          — which now sit in the content flow at the bottom — lost their
          contrast against it. */}
      <div
        className="absolute inset-x-0 bottom-0 z-[1] h-20 bg-gradient-to-t from-bg to-transparent lg:h-32"
        aria-hidden="true"
      />

      <div className="container-x relative z-10 w-full pt-32 pb-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ---- Copy column ---- */}
          <div className="flex flex-col items-start text-left lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.5 }}
              className="mb-6 max-w-full rounded-pill glass-on-dark inline-flex items-center gap-2 px-4 py-2"
            >
              <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
              {/* Kept short deliberately: at 360px a longer eyebrow stretches
                  the pill from gutter to gutter and stops reading as a pill.
                  "Nutrition" is already carried by the subhead below. */}
              <span className="fs-eyebrow text-on-dark text-balance">Gut Health · Kakinada</span>
            </motion.div>

            <h1 className="fs-h1 text-on-dark max-w-[14ch] mb-6">
              {words.map((word, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom mr-[0.24em] last:mr-0"
                >
                  <motion.span
                    initial={reduce ? false : { y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.85, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className={i === words.length - 1 ? "inline-block italic" : "inline-block"}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Trimmed from a 45-word paragraph. The symptoms and the
                practitioner's name are the parts that do real work here; the
                rest repeated what the sections below already say. */}
            <p className="fs-sub text-on-dark-muted max-w-[44ch] mb-9">
              Root-cause nutrition for bloating, acidity, hormones and low energy — by Dt. N. Sai
              Sowjanya.
            </p>

            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <Link
                to="/assessment"
                className="group h-14 px-9 bg-accent-strong text-on-accent rounded-pill font-semibold inline-flex items-center justify-center gap-2 press"
              >
                Get My Gut Assessment
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={() =>
                  document.getElementById("symptoms")?.scrollIntoView({ behavior: "smooth" })
                }
                className="h-14 px-9 glass-on-dark text-on-dark rounded-pill font-semibold inline-flex items-center justify-center transition-colors hover:bg-white/20"
              >
                See How It Works
              </button>
            </div>

            <ul className="mt-11 flex w-full max-w-[620px] list-none flex-wrap gap-x-7 gap-y-2.5 border-t border-on-dark-border p-0 pt-6 text-[13px] text-on-dark-muted sm:text-sm">
              {TRUST.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            {/* Slide indicators. These sit in the content flow rather than
                floating over the frame: bottom-anchored copy on phones would
                otherwise collide with an absolutely positioned control. The
                active bar fills across the dwell time so the carousel's
                progress is visible instead of implied. */}
            <div className="mt-9 flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Show slide ${i + 1} of ${SLIDES.length}`}
                  aria-current={i === current}
                  className="group grid h-11 place-items-center"
                >
                  <span
                    className={
                      "block h-[3px] overflow-hidden rounded-full transition-all duration-500 " +
                      (i === current
                        ? "w-12 bg-on-dark/25"
                        : "w-5 bg-on-dark/30 group-hover:bg-on-dark/55")
                    }
                  >
                    {i === current && (
                      <motion.span
                        key={reduce ? "static" : current}
                        className="block h-full w-full origin-left rounded-full bg-on-dark"
                        initial={reduce ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: reduce ? 0 : SLIDE_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ---- Credential card ----
              The right of the frame was empty at lg+ — the directional scrim
              clears it deliberately, but nothing occupied it. This anchors that
              space with the two things a first-time visitor actually weighs:
              volume of work, and who is doing it. Its own dark fill means it
              stays legible over whichever photograph is showing. */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.7,
              delay: reduce ? 0 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="hidden lg:col-span-4 lg:col-start-9 lg:block"
          >
            <div
              className="rounded-[26px] border border-on-dark-border p-8 backdrop-blur-xl"
              style={{ background: "rgba(var(--dark-surface-rgb), 0.78)" }}
            >
              <p className="fs-display leading-none text-on-dark">
                <CountUp value={500} suffix="+" />
              </p>
              <p className="fs-label mt-2 text-on-dark-muted">Lives rebalanced</p>

              <hr className="my-7 border-0 border-t border-on-dark-border" />

              <p className="fs-h4 text-on-dark">Dt. N. Sai Sowjanya</p>
              <p className="fs-micro mt-1.5 text-on-dark-faint">Clinical Nutritionist · Kakinada</p>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* Scroll cue. Desktop only — the phone layout already runs to the
          bottom edge, so there is no room for one and no doubt that the page
          continues. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-7 z-10 hidden justify-center lg:flex"
        aria-hidden="true"
      >
        <motion.span
          className="block h-10 w-px origin-top bg-gradient-to-b from-on-dark/60 to-transparent"
          initial={reduce ? false : { scaleY: 0.3, opacity: 0.3 }}
          animate={reduce ? {} : { scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
