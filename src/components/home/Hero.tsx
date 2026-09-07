import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarCheck, MapPin, Microscope } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CountUp } from "@/components/shared/CountUp";
import { useBooking } from "@/context/BookingContext";
import { brand } from "@/data/content";
import { HERO_BACKDROP, HERO_CHIPS } from "@/data/images";

const HEADLINE = "Heal the gut. Rebalance the whole you.";

const TRUST = [
  { icon: MapPin, label: "Online & in-clinic · Kakinada" },
  { icon: Microscope, label: "Root-cause protocols" },
  { icon: CalendarCheck, label: "Replies in 24 hours" },
];

/**
 * The opening frame.
 *
 * This used to be a four-slide photographic carousel of stock kitchen shots
 * behind a near-opaque dark scrim. Three things were wrong with it: the
 * photographs were generic and dim, none of them showed the practice or the
 * practitioner, and the scrim needed to be so heavy to keep the headline
 * legible that the imagery was reduced to texture anyway — 2 MB of downloads
 * to produce a dark rectangle.
 *
 * It is now light, and the only photograph is the real one: the practitioner
 * at her own desk. A person you can see is the single strongest trust signal
 * a small clinical practice has, and it is the thing no competitor can copy.
 * The ground is a brand-tinted gradient, which costs nothing to load and
 * paints on the first frame.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const { openBooking } = useBooking();
  const words = HEADLINE.split(" ");

  return (
    <section
      id="hero"
      className="relative isolate w-full overflow-hidden bg-bg pt-[calc(var(--header-h)+40px)] pb-16 sm:pb-20 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-24 lg:pt-[calc(var(--header-h)+56px)]"
    >
      {/* ---- ground ---------------------------------------------------------
          A warm blush wash, a related photograph, and two rings taken from the
          round brand mark.

          The photograph is deliberately handled as GROUND, not as a picture:
          it is confined to the right of the frame, softly masked at every
          edge, and held at a low opacity over the wash. That is what keeps it
          from becoming the dark full-bleed hero the practice rejected — the
          headline still sits on clean porcelain and measures 15:1, while the
          frame as a whole reads as fresh produce and a clinic rather than as
          an empty gradient. */}
      {/*
        z-0, not -z-10.

        A negative z-index child only paints in front of its parent's
        background when the parent establishes a stacking context. #hero does
        not — and the route transition wrapper above it does — so this whole
        layer was being painted BEHIND the section's own `bg-bg` fill and was
        invisible. Which is why raising the photograph's opacity three times
        changed nothing.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {/*
          Two masks, intersected.

          A single radial mask put the visible core of the photograph at 76%
          across and 45% down — which is precisely where the portrait card
          sits, so the image was fully hidden behind it and the hero looked
          exactly as it had before. The horizontal mask reveals the right of
          the frame; the vertical one keeps the top clear so the nav never
          sits on texture, and fades the foot into the page.
        */}
        <img
          src={HERO_BACKDROP.src}
          alt=""
          decoding="async"
          fetchPriority="low"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.26] dark:opacity-[0.16]"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 40%, black 76%), linear-gradient(to bottom, transparent 150px, black 300px, black 72%, transparent 97%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 40%, black 76%), linear-gradient(to bottom, transparent 150px, black 300px, black 72%, transparent 97%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_78%_18%,rgba(var(--accent-rgb),0.16),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_6%_92%,rgba(var(--primary-rgb),0.13),transparent_60%)]" />
        {/* Keeps the copy column on flat page colour whatever the photograph
            is doing behind it. */}
        <div className="absolute inset-y-0 left-0 w-[62%] bg-[linear-gradient(to_right,rgba(var(--bg-rgb),0.99)_0%,rgba(var(--bg-rgb),0.95)_62%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
        {/* Two quiet rings, echoing the round mark. Behind the portrait. */}
        <div className="absolute -right-[14%] top-[6%] hidden aspect-square w-[52vw] rounded-full border border-[rgba(var(--primary-rgb),0.16)] lg:block" />
        <div className="absolute -right-[6%] top-[20%] hidden aspect-square w-[34vw] rounded-full border border-[rgba(var(--accent-rgb),0.14)] lg:block" />
      </div>

      <div className="container-x relative z-10 w-full">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* ================= copy ================= */}
          <div className="flex flex-col items-start text-left lg:col-span-6 xl:col-span-6">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.5 }}
              className="mb-6 inline-flex max-w-full items-center gap-2 rounded-pill border border-[rgba(var(--primary-rgb),0.22)] bg-primary-soft px-4 py-2"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span className="fs-eyebrow text-balance text-primary-contrast">
                Gut Health · Kakinada
              </span>
            </motion.div>

            {/*
              Each word is its own overflow-hidden box so it can rise into
              place. The literal {" "} between them is not decoration: without
              it the spans are inline-blocks separated only by a margin, which
              is invisible to the accessibility tree and to the clipboard — the
              headline was being announced, and copied, as
              "Healthegut.Rebalancethewholeyou."
            */}
            <h1 className="fs-h1 mb-6 max-w-[13ch] text-text">
              {words.map((word, i) => (
                <React.Fragment key={i}>
                  <span className="inline-block overflow-hidden align-bottom">
                    <motion.span
                      initial={reduce ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.85, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className={
                        i === words.length - 1
                          ? "inline-block italic text-accent-contrast"
                          : "inline-block"
                      }
                    >
                      {word}
                    </motion.span>
                  </span>
                  {i < words.length - 1 ? " " : null}
                </React.Fragment>
              ))}
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.25 }}
              className="fs-sub mb-9 max-w-[46ch]"
            >
              Root-cause nutrition for bloating, IBS, acidity, PCOS, thyroid and stubborn weight —
              by {brand.practitioner}.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.34 }}
              className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3.5"
            >
              <Link
                to="/assessment"
                className="press group inline-flex h-14 items-center justify-center gap-2 rounded-pill bg-accent-strong px-8 font-semibold text-on-accent shadow-[0_10px_28px_rgba(var(--accent-rgb),0.28)]"
              >
                Get My Gut Assessment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={() => openBooking({ source: "hero-booking" })}
                className="press inline-flex h-14 items-center justify-center gap-2 rounded-pill border border-[rgba(var(--primary-rgb),0.34)] bg-surface px-8 font-semibold text-primary-contrast shadow-[0_2px_10px_rgba(var(--shadow-rgb),0.05)] transition-colors hover:bg-primary-soft"
              >
                <CalendarCheck className="h-[18px] w-[18px]" aria-hidden="true" />
                Book Consultation
              </button>
            </motion.div>

            <motion.ul
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.5 }}
              /* Sits on one line from lg: three short proofs read as a set,
                three wrapped onto two lines read as an afterthought. The
                labels are sized to fit the six-column track at 1280px. */
              className="mt-10 flex w-full list-none flex-wrap gap-x-5 gap-y-3 border-t border-border p-0 pt-6 text-[13px] text-text-muted sm:text-[13.5px] lg:max-w-none lg:flex-nowrap lg:gap-x-6 lg:whitespace-nowrap xl:gap-x-7"
            >
              {TRUST.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="h-[15px] w-[15px] shrink-0 text-primary" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* ================= portrait ================= */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.85,
              delay: reduce ? 0 : 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto w-full max-w-[420px] lg:col-span-6 lg:col-start-7 lg:mx-0 lg:ml-auto lg:max-w-[460px] xl:max-w-[500px]"
          >
            {/* The arch is the signature: it echoes the round mark, and it is
                the one silhouette a stock template will not be using. */}
            <div className="relative overflow-hidden rounded-[200px_200px_28px_28px] border border-[rgba(var(--primary-rgb),0.16)] bg-surface-alt shadow-[0_28px_70px_rgba(var(--shadow-rgb),0.14)]">
              <img
                src="/founder.jpg"
                srcSet="/founder-sm.jpg 640w, /founder.jpg 1086w"
                sizes="(min-width: 1280px) 500px, (min-width: 1024px) 460px, (min-width: 640px) 420px, 88vw"
                width={1086}
                height={1448}
                alt={`${brand.practitioner}, ${brand.credential}, at her clinic in Kakinada`}
                fetchPriority="high"
                decoding="async"
                className="block aspect-[3/4] w-full object-cover object-[50%_16%]"
              />
              {/* A whisper of warmth over the lower third, so the caption
                  plate below sits on tone rather than on a hard edge. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgba(var(--dark-surface-rgb),0.42)] to-transparent"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-[16px] border border-white/14 bg-[rgba(var(--dark-surface-rgb),0.52)] px-4 py-3 backdrop-blur-lg">
                <span className="h-9 w-[3px] shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate font-fraunces text-[16.5px] font-medium leading-tight text-on-dark">
                    {brand.practitioner}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] leading-tight text-on-dark-faint">
                    Clinical Nutritionist · Kakinada
                  </span>
                </span>
              </div>
            </div>

            {/* A detail from the work itself, tucked into the arch's top
                corner. Small and specific: it says "fresh food" in a way the
                portrait cannot, without competing with her. Hidden below sm,
                where there is no room to place it clear of the frame. */}
            <motion.figure
              initial={reduce ? false : { opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: reduce ? 0 : 0.6,
                delay: reduce ? 0 : 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute -right-4 top-[18%] m-0 hidden overflow-hidden rounded-[16px] border border-border bg-surface p-1.5 shadow-[0_14px_36px_rgba(var(--shadow-rgb),0.16)] sm:block lg:-right-7"
            >
              <img
                src={HERO_CHIPS[0]!.src}
                alt={HERO_CHIPS[0]!.alt}
                loading="lazy"
                decoding="async"
                width={320}
                height={320}
                className="block h-[74px] w-[74px] rounded-[11px] object-cover lg:h-[88px] lg:w-[88px]"
              />
            </motion.figure>

            {/* Floating proof. Anchored to the frame's edge so it reads as
                belonging to the portrait rather than drifting near it. */}
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{
                duration: reduce ? 0 : 0.6,
                delay: reduce ? 0 : 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute bottom-[26%] left-3 rounded-[18px] border border-border bg-surface px-5 py-3.5 shadow-[0_16px_44px_rgba(var(--shadow-rgb),0.18)] sm:-left-8 lg:-left-10"
            >
              <p className="font-fraunces text-[26px] font-medium leading-none text-primary-contrast">
                <CountUp value={500} suffix="+" />
              </p>
              <p className="mt-1.5 text-[12px] font-medium uppercase tracking-[0.1em] text-text-muted">
                Lives rebalanced
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
