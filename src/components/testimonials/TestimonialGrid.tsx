import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPublished } from "@/lib/cms-public";
import { testimonialsFull as fallbackTestimonials } from "@/data/content";
import { Star, BadgeCheck, MapPin, ChevronDown, Quote } from "lucide-react";
import { StoryMedia, hasStoryMedia } from "@/components/shared/StoryMedia";
import * as Collapsible from "@radix-ui/react-collapsible";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FilterBar } from "@/components/shared/FilterBar";
import { CurveDivider } from "@/components/shared/CurveDivider";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

/*
 * Kept in step with the programme names on the treatments page and in the
 * admin's category picker. They had drifted: the filter still offered
 * "PCOS & Hormonal" and "Thyroid & Metabolic" after the programmes were
 * renamed, so a visitor filtering by the condition they had just read about
 * got an empty grid.
 */
const CATEGORIES = [
  "All",
  "Gut & Digestion",
  "Acid Reflux & GERD",
  "PCOS & PCOD",
  "Pregnancy",
  "Diabetes & Metabolic",
  "Weight Loss",
];

interface Testimonial {
  id: string;
  name: string;
  initials: string;
  location: string;
  condition: string;
  category: string;
  duration: string;
  rating: number;
  quote: string;
  fullStory?: string;
  before?: string[];
  after?: string[];
  featured?: boolean;
  /** Attached in the admin panel — see StoryMedia. */
  photoUrl?: string;
  videoUrl?: string;
}

export function TestimonialGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);
  const [data, setData] = useState(fallbackTestimonials);

  useEffect(() => {
    fetchPublished("testimonials", fallbackTestimonials).then((res) => setData(res));
  }, []);

  const filtered = useMemo(() => {
    return activeCategory === "All" ? data : data.filter((t) => t.category === activeCategory);
  }, [activeCategory, data]);

  const shownItems = filtered.slice(0, visibleCount);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: data.length };
    CATEGORIES.slice(1).forEach((cat) => {
      c[cat] = data.filter((t) => t.category === cat).length;
    });
    return c;
  }, [data]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  return (
    <>
      <CurveDivider fill="alt" />
      <SectionWrapper id="stories" bg="alt" labelledBy="stories-heading">
        <div
          className="absolute -bottom-[150px] -left-[150px] h-[540px] w-[540px] rounded-full bg-accent/4 blur-[150px]"
          aria-hidden="true"
        />

        <SectionHeading
          align="center"
          eyebrow="EVERY STORY"
          title="Filter by what *you're* dealing with."
          subtitle="Most useful when you read the story of someone whose symptoms matched yours."
          className="mb-12"
        />

        <FilterBar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={(cat) => {
            setActiveCategory(cat);
            setVisibleCount(9);
          }}
          counts={counts}
        />

        <div
          className="columns-1 sm:columns-2 lg:columns-3 gap-5 lg:gap-6 max-w-[560px] sm:max-w-none mx-auto"
          aria-live="polite"
        >
          {shownItems.map((testimonial, index) => (
            <div key={testimonial.id} className="break-inside-avoid mb-5 lg:mb-6">
              <Reveal delay={(index % 3) * 0.1}>
                <TestimonialCard testimonial={testimonial} />
              </Reveal>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          {visibleCount < filtered.length ? (
            <button
              onClick={handleLoadMore}
              className="h-[52px] px-8 rounded-full border-[1.5px] border-primary text-primary font-semibold transition-all hover:bg-primary-strong hover:text-on-primary"
            >
              Load More Stories
            </button>
          ) : (
            <p className="text-[14px] text-text-muted">That's all {filtered.length} stories.</p>
          )}
          <p className="text-[13px] text-text-muted">
            Showing {shownItems.length} of {filtered.length}
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 380);
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative block w-full overflow-hidden rounded-[22px] border border-border bg-surface p-[24px_22px] sm:p-[30px_28px] transition-all duration-300",
        !isOpen &&
          "hover:-translate-y-[3px] hover:border-primary/30 hover:shadow-[0_14px_36px_rgba(var(--primary-rgb), 0.08)]",
      )}
    >
      {!hasStoryMedia(testimonial) ? (
        <Quote
          aria-hidden="true"
          className="absolute right-[22px] top-[18px] z-0 h-16 w-16 text-primary opacity-[0.07]"
        />
      ) : (
        <StoryMedia
          photoUrl={testimonial.photoUrl}
          videoUrl={testimonial.videoUrl}
          alt={`${testimonial.name}'s story`}
          className="relative z-10 mb-6"
        />
      )}

      <div className="relative z-10 flex items-start justify-between gap-[14px] mb-5">
        <div className="flex gap-[3px]" aria-label={`Rated ${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              aria-hidden="true"
              className={cn(
                "w-[15px] h-[15px]",
                i < testimonial.rating ? "fill-accent text-accent" : "text-border",
              )}
            />
          ))}
        </div>
        <div className="inline-flex items-center gap-[5px] rounded-full bg-primary-soft px-[10px] py-[5px] text-[12px] font-semibold text-primary">
          <BadgeCheck aria-hidden="true" className="w-3 h-3" />
          Verified
        </div>
      </div>

      <blockquote className="relative z-10 m-0 mb-6 text-[15px] sm:text-[15.5px] leading-[1.72] text-text">
        {testimonial.quote}
      </blockquote>

      {testimonial.before && testimonial.after && (
        <div className="relative z-10 rounded-[14px] border border-border bg-surface-alt p-[16px_18px] mb-[22px]">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-text-muted mb-1.5">
                BEFORE
              </p>
              <p className="text-[13.5px] leading-[1.5] text-text-muted italic">
                {testimonial.before.join(" · ")}
              </p>
            </div>
            <div className="flex justify-center">
              <span className="text-accent opacity-70">
                <ChevronDown className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-primary mb-1.5">
                AFTER
              </p>
              <p className="text-[13.5px] leading-[1.5] text-text font-medium">
                {testimonial.after.join(" · ")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 h-px w-full bg-border mb-[18px]" />

      <div className="relative z-10 flex items-center gap-[13px]">
        <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-primary-soft ring-[1.5px] ring-border">
          <span className="font-fraunces text-[15px] font-medium text-primary">
            {testimonial.initials}
          </span>
        </div>
        <div className="min-w-0 flex-grow">
          <cite className="block not-italic text-[15px] font-semibold leading-[1.3] text-text">
            {testimonial.name}
          </cite>
          <p className="mt-1 text-[12.5px] text-text-muted truncate">
            {testimonial.condition} · {testimonial.duration}
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] text-text-muted">
            <MapPin aria-hidden="true" className="w-3 h-3 shrink-0" />
            <span>{testimonial.location}</span>
          </p>
        </div>
      </div>

      {testimonial.fullStory && (
        <Collapsible.Root open={isOpen} onOpenChange={setIsOpen} className="relative z-10 mt-5">
          <Collapsible.Trigger
            onClick={handleToggle}
            aria-label={`Read ${testimonial.name}'s full story`}
            className="group/btn inline-flex items-center gap-[7px] text-[14px] font-semibold text-primary"
          >
            <span>{isOpen ? "Show less" : "Read the full story"}</span>
            <ChevronDown
              className={cn(
                "w-[15px] h-[15px] transition-transform duration-300",
                isOpen && "rotate-180",
              )}
            />
            <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-accent transition-all duration-300 group-hover/btn:w-full" />
          </Collapsible.Trigger>
          <Collapsible.Content className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="pt-4 mt-4 border-t border-border">
              <div className="text-[14.5px] leading-[1.75] text-text-muted space-y-4">
                {testimonial.fullStory.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </div>
  );
}

// PLACEHOLDER TESTIMONIALS — replace with the client's real, consented client feedback before launch. Written consent is required for health testimonials.
