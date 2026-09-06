import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, MapPin, Quote, Star } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { AutoScroller } from "@/components/shared/AutoScroller";
import { useState, useEffect } from "react";
import { fetchPublished } from "@/lib/cms";
import { testimonials as fallbackTestimonials } from "@/data/content";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type Testimonial = (typeof fallbackTestimonials)[number];

export function Testimonials() {
  const reduceMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);

  useEffect(() => {
    fetchPublished("testimonials", fallbackTestimonials).then(setTestimonials);
  }, []);

  return (
    <SectionWrapper arc="left" id="testimonials" bg="base" labelledBy="testimonials-heading">
      <div ref={containerRef}>
        <SectionHeading
          align="center"
          eyebrow="CLIENT STORIES"
          title="Real people. Real *rebalancing*."
          subtitle="These are clients who arrived after years of being told their reports were normal. Here's what changed once we treated the cause."
        />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={inView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* A continuously moving rail. The previous version used slide-by-
              slide autoplay, which paused between every card — the "gaps".
              This scrolls without stopping, pauses while hovered or touched,
              and stays swipeable. */}
          <AutoScroller
            label="Client testimonials"
            speed={26}
            gap="16px"
            itemWidth="min(86vw, 400px)"
            className="py-1"
          >
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </AutoScroller>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={inView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mt-9 flex flex-col items-center gap-4 md:mt-11 md:flex-row md:justify-between"
        >
          <p className="fs-micro text-center md:text-left">
            {testimonials.length} verified stories · hover or hold to pause
          </p>

          <Link
            to="/testimonials"
            className="group relative inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-primary-contrast transition-colors duration-300 hover:text-accent-contrast"
          >
            <span className="relative">
              Read all stories
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

function TestimonialCard({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    <article className="relative flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-border bg-surface p-[28px_22px] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-[3px] hover:border-primary/30 surface-raise sm:p-[32px_28px]">
      <Quote
        aria-hidden="true"
        className="pointer-events-none absolute right-[24px] top-[20px] z-0 h-[72px] w-[72px] text-primary opacity-[0.08]"
      />

      <div className="relative z-10 mb-5 flex gap-[3px]">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star
            key={s}
            aria-hidden="true"
            className={cn("h-4 w-4", s < t.rating ? "fill-accent text-accent" : "text-border")}
          />
        ))}
        <span className="sr-only">{t.rating} out of 5 stars</span>
      </div>

      <blockquote className="relative z-10 m-0 mb-[28px] flex-grow text-[15px] font-normal leading-[1.7] text-text">
        {t.quote}
      </blockquote>

      <div className="relative z-10 mb-5 h-px w-full bg-border" />

      <div className="relative z-10">
        <div className="mb-3 flex">
          <VerifiedChip />
        </div>
        <div className="flex items-center gap-[14px]">
          <div className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-primary-soft ring-[1.5px] ring-border">
            <span className="font-fraunces text-[15px] font-medium text-primary">{t.initials}</span>
          </div>
          <footer className="min-w-0 flex-grow">
            <cite className="block text-[15px] font-semibold not-italic leading-[1.3] text-text">
              {t.name}
            </cite>
            <p className="mt-1 text-[12.5px] leading-[1.4] text-text-muted">
              {t.condition} · {t.duration}
            </p>
            <p className="mt-1 flex items-start gap-1 text-[12px] leading-[1.4] text-text-muted">
              <MapPin aria-hidden="true" className="mt-[2px] h-3 w-3 shrink-0" />
              <span>{t.location}</span>
            </p>
          </footer>
        </div>
      </div>
    </article>
  );
}

function VerifiedChip() {
  return (
    <span className="inline-flex items-center gap-[5px] rounded-pill bg-primary-soft px-[10px] py-[5px] text-[12px] font-semibold text-primary-contrast">
      <BadgeCheck aria-hidden="true" className="h-3 w-3" />
      Verified client
    </span>
  );
}
