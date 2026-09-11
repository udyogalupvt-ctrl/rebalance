import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Clock, UserCheck, Lock, ArrowRight, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/Reveal";
import { useBooking } from "@/context/BookingContext";

interface AssessmentCTAProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const REASSURANCE = [
  { icon: Clock, label: "Takes about 10 minutes" },
  { icon: UserCheck, label: "Reviewed personally" },
  { icon: Lock, label: "100% confidential" },
];

/**
 * The closing band.
 *
 * Three things were wrong with the previous version and all three were
 * visible from across the room:
 *
 *   - The primary action was a plain `<a href="/assessment">`, which throws
 *     away the SPA and reloads the entire application — the slowest click on
 *     the whole site, on the one button that matters most.
 *   - It carried two competing hover effects (a radial gradient AND a scaling
 *     dot) plus a one-shot scale pulse, layered over each other with a
 *     comment quoting the spec that asked for them. That is the texture that
 *     makes a page read as generated rather than designed.
 *   - The band met the page on a 1px white border, and the eyebrow's dot
 *     pinged forever.
 *
 * The band now dims into the page at both edges (see the ramps below), the
 * dot holds still, and there is one hover behaviour: the button lifts.
 */
export function AssessmentCTA({ title, subtitle, className }: AssessmentCTAProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { openBooking } = useBooking();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  /** *word* renders italic, in the on-dark accent, with a drawn underline. */
  const renderTitle = (text: string) =>
    text.split(/(\*[^*]+\*)/g).map((part, i) =>
      part.startsWith("*") && part.endsWith("*") ? (
        <span key={i} className="relative inline-block italic text-on-dark-accent">
          {part.slice(1, -1)}
          <HandDrawnUnderline reduce={!!reduce} />
        </span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    );

  return (
    <section
      id="assessment-cta"
      ref={containerRef}
      aria-labelledby="assessment-cta-heading"
      /* Marks this as one of the permanently-dark bands. The footer reads it
         to decide whether its curve would land between two dark surfaces —
         see the note in Footer.tsx. */
      data-dark-band=""
      className={cn("relative isolate w-full overflow-hidden bg-[var(--dark-surface)]", className)}
      style={{ paddingBlock: "clamp(80px, 9.5vw, 132px)" }}
    >
      {/* Edge ramps.
          A full-bleed dark band meeting a porcelain page along a 1px border
          is a seam. These lift the band's colour towards the page over ~72px
          at both edges, so the page dims into it instead of stopping at it —
          the same device the footer curve uses, and the reason the two themes
          now read alike. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[72px] bg-[linear-gradient(to_bottom,rgba(var(--bg-rgb),0.28),transparent)] md:h-[96px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[72px] bg-[linear-gradient(to_top,rgba(var(--bg-rgb),0.28),transparent)] md:h-[96px]"
      />

      {/* Atmosphere. Gradients only — the old version stacked two 900px
          blurred circles, two animated blobs and a live feTurbulence filter,
          which is a lot of compositing for a band of colour. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ y: reduce ? 0 : backgroundY }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_22%_18%,rgba(var(--accent-rgb),0.22),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_88%_92%,rgba(var(--primary-rgb),0.20),transparent_62%)]" />
      </motion.div>

      <div className="container-x relative z-10 mx-auto max-w-[820px] text-center">
        <Reveal delay={0.05}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-pill border border-on-dark-border bg-on-dark-glass px-4 py-[7px] backdrop-blur-xl">
            <span className="h-[6px] w-[6px] rounded-full bg-accent" aria-hidden="true" />
            <span className="fs-eyebrow text-on-dark">Your first step</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 id="assessment-cta-heading" className="fs-h2 mb-6 text-on-dark">
            {title ? (
              renderTitle(title)
            ) : (
              <>
                Stop guessing. Start{" "}
                <span className="relative inline-block italic text-on-dark-accent">
                  rebalancing
                  <HandDrawnUnderline reduce={!!reduce} />
                </span>
                .
              </>
            )}
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="fs-sub mx-auto mb-9 max-w-[640px] text-on-dark-muted">
            {subtitle ||
              "Take the Go Rebalance assessment — a guided form covering your symptoms, history, lifestyle and food habits. Every submission is reviewed personally before you are contacted."}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="mb-9 flex list-none flex-wrap items-center justify-center gap-x-7 gap-y-3 p-0">
            {REASSURANCE.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon size={16} className="text-on-dark-accent" aria-hidden="true" />
                <span className="text-[14px] font-medium text-on-dark-muted">{label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-3.5">
            <Link
              to="/assessment"
              className="press group inline-flex h-[58px] items-center justify-center gap-2.5 rounded-pill bg-accent-strong px-9 text-[16.5px] font-semibold text-on-accent shadow-[0_12px_32px_rgba(var(--accent-rgb),0.32)]"
            >
              Begin My Assessment
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={() => openBooking({ source: "cta-band" })}
              className="press inline-flex h-[58px] items-center justify-center gap-2.5 rounded-pill border border-on-dark-border bg-on-dark-glass px-9 text-[16px] font-semibold text-on-dark backdrop-blur-xl transition-colors hover:bg-[rgba(var(--on-dark-rgb),0.2)]"
            >
              <CalendarCheck size={18} aria-hidden="true" />
              Book Consultation
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mx-auto mt-8 max-w-[520px] text-[13px] leading-[1.5] text-on-dark-faint">
            Consultation fee applies · Secure payment · Clinic in Kakinada · Online across India
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function HandDrawnUnderline({ reduce }: { reduce: boolean }) {
  return (
    <svg
      className="pointer-events-none absolute -bottom-2 left-0 h-3 w-full overflow-visible text-accent/75"
      viewBox="0 0 200 12"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d="M2 10C30 8.5 60 7.5 198 9.5"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.7, ease: "easeOut" }}
      />
    </svg>
  );
}
