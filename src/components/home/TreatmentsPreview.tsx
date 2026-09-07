import * as React from "react";
import { ArrowRight, HelpCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { AutoScroller } from "@/components/shared/AutoScroller";
import { treatments as fallbackTreatments } from "@/data/content";
import { fetchPublished } from "@/lib/cms-public";
import { toIconComponent } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { Treatment } from "@/types/content";
import { treatmentImage } from "@/data/images";

export function TreatmentsPreview() {
  const shouldReduceMotion = useReducedMotion();

  // Same as the treatments page: show what the practice has published, with
  // the static list as the fallback.
  const [treatments, setTreatments] = React.useState<Treatment[]>([...fallbackTreatments]);
  React.useEffect(() => {
    let live = true;
    void fetchPublished<Treatment>("treatments", fallbackTreatments).then((rows) => {
      if (live && rows.length) setTreatments(rows);
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <SectionWrapper
      texture="grid"
      arc="right"
      id="treatments"
      bg="alt"
      labelledBy="treatments-heading"
    >
      {/* Decorative Glow */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10 translate-x-[-20%] translate-y-[-20%]"
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Heading Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-12 lg:mb-[72px]">
          <SectionHeading
            align="left"
            eyebrow="WHAT WE TREAT"
            title="Programs built for *your* condition, not a category."
            subtitle="Every program starts from the same place — your gut — but no two plans look alike. Here's where most clients begin."
            className="mb-0 max-w-[700px]"
          />

          <Link
            to="/treatments"
            className="group relative inline-flex items-center gap-2 min-h-[44px] text-[15px] font-semibold text-primary-contrast hover:text-accent-contrast transition-colors duration-300 md:mb-1.5"
          >
            <span>View All Treatments</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-[5px]"
            />
            <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </Link>
        </div>

        {/* Auto-scrolling rail on phones, grid from md up. */}
        <div className="md:hidden -mx-5 px-5">
          <AutoScroller
            label="Treatment programs"
            speed={24}
            gap="14px"
            itemWidth="min(80vw, 340px)"
            autoScroll={false}
          >
            {treatments.map((treatment) => (
              <TreatmentCard
                key={treatment.id}
                treatment={treatment}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </AutoScroller>
        </div>

        <ul className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 xl:gap-8 list-none p-0 m-0 items-stretch">
          <Reveal stagger={0.07} childAs="li">
            {treatments.map((treatment) => (
              <TreatmentCard
                key={treatment.id}
                treatment={treatment}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </Reveal>
        </ul>

        {/* Bottom CTA Strip */}
        <Reveal delay={0.2}>
          <div className="mt-16 md:mt-[64px] bg-surface/70 backdrop-blur-[16px] border border-border rounded-[24px] p-7 md:p-[28px_36px] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 md:gap-6 text-center md:text-left flex-col md:flex-row">
              <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
                <HelpCircle size={22} className="text-primary" />
              </div>
              <div>
                <h4 className="font-fraunces font-medium text-[clamp(1.0625rem,1.6vw,1.25rem)] text-text leading-tight">
                  Not sure which program fits you?
                </h4>
                <p className="text-sm text-text-muted mt-1.5">
                  The assessment identifies your root cause and the right starting point.
                </p>
              </div>
            </div>

            <Link
              to="/assessment"
              className="group h-[52px] px-7 rounded-full bg-accent-strong text-on-accent font-semibold text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(var(--accent-rgb), 0.15)] hover:shadow-[0_8px_30px_rgba(var(--accent-rgb), 0.25)] press w-full md:w-auto"
            >
              <span>Take the Assessment</span>
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}

function TreatmentCard({
  treatment,
  shouldReduceMotion,
}: {
  treatment: Treatment;
  shouldReduceMotion: boolean | null;
}) {
  // Firestore stores the icon name; the static fallback holds the component.
  const Icon = toIconComponent(treatment.icon);

  return (
    <Link
      // /treatments/<slug> has no route; this opens the matching card instead.
      to="/treatments"
      search={{ program: treatment.slug }}
      aria-label={`${treatment.title} — view program details`}
      className={cn(
        "group relative flex flex-col h-full bg-surface border border-border rounded-[24px] overflow-hidden transition-all duration-300",
        "surface-raise hover:border-primary/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-[3px] focus-visible:rounded-[24px]",
      )}
    >
      {/* Top Accent Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 z-20 rounded-t-[24px]"
        aria-hidden="true"
      />

      {/* Image Strip (Issue 4) */}
      <div className="relative w-full h-[160px] overflow-hidden shrink-0 z-0">
        <img
          src={treatmentImage(treatment.slug)}
          alt={`Image representing ${treatment.title}`}
          className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.06]"
          loading="lazy"
          width={400}
          height={160}
        />
        {/* Subtle bottom gradient scrim */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col flex-grow p-8 lg:p-[28px_28px] xl:p-[28px_28px] relative z-10 bg-surface">
        {/* Icon */}
        <div className="w-14 h-14 md:w-14 md:h-14 min-[480px]:w-[56px] min-[480px]:h-[56px] rounded-[16px] bg-primary-soft group-hover:bg-primary flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-105">
          <Icon
            size={24}
            strokeWidth={1.75}
            className="text-primary group-hover:text-white transition-all duration-300 group-hover:rotate-6"
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <h3 className="font-fraunces font-medium text-[clamp(1.125rem,1.5vw,1.375rem)] text-text group-hover:text-primary transition-colors duration-300 leading-tight mb-3">
          {treatment.title}
        </h3>

        {/* Description */}
        <p className="text-[15px] sm:text-sm min-[480px]:text-[15px] leading-relaxed text-text-muted mb-6 flex-grow">
          {treatment.description}
        </p>

        <div className="relative h-[34px] overflow-hidden">
          {/* Layer 1: Tags (Shown by default) */}
          <div
            className={cn(
              "absolute inset-0 flex items-center gap-2 flex-nowrap overflow-hidden transition-all duration-300",
              !shouldReduceMotion && "group-hover:-translate-y-3",
              "group-hover:opacity-0 md:group-hover:opacity-0",
            )}
          >
            {/* The row is a fixed-height, no-wrap strip, so a fourth tag was
                sliced mid-word on narrow cards. Show what fits and count the
                rest, matching the "+N more" pattern on the treatments page. */}
            {treatment.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="text-[12px] font-medium text-text-muted bg-surface-alt dark:bg-primary-soft border border-border px-2.5 py-1 rounded-full whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
            {treatment.tags.length > 3 && (
              <span className="text-[12px] font-medium text-accent-contrast whitespace-nowrap">
                +{treatment.tags.length - 3}
              </span>
            )}
          </div>

          {/* Layer 2: Learn More (Shown on hover) */}
          <div
            className={cn(
              "hidden md:flex absolute inset-0 items-center gap-2 text-[14px] font-semibold text-accent-contrast opacity-0 transition-all duration-300 delay-[40ms]",
              !shouldReduceMotion && "translate-y-3 group-hover:translate-y-0",
              "group-hover:opacity-100",
            )}
          >
            <span>Learn more</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
