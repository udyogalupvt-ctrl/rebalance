import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { TrendingUp, MapPin, Star } from "lucide-react";
import { fetchPublished } from "@/lib/cms-public";
import { testimonialsFull as fallbackTestimonials } from "@/data/content";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CurveDivider } from "@/components/shared/CurveDivider";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";
import { StoryMedia, hasStoryMedia } from "@/components/shared/StoryMedia";
import type { Testimonial } from "@/types/content";

export function FeaturedStories() {
  const [data, setData] = useState(fallbackTestimonials);

  useEffect(() => {
    fetchPublished("testimonials", fallbackTestimonials).then((res) => setData(res));
  }, []);

  const featured = useMemo(() => {
    return data.filter((t) => t.featured).slice(0, 3);
  }, [data]);

  return (
    <>
      <CurveDivider fill="base" flip />
      <SectionWrapper id="featured-stories" bg="base" labelledBy="featured-heading">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[30%] pointer-events-none opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, var(--primary) 3px, transparent 3px)`,
            backgroundSize: "26px 26px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />

        <SectionHeading
          align="center"
          eyebrow="IN DEPTH"
          title="Three stories, told *properly*."
          subtitle="Longer accounts from clients who agreed to share the full arc — what they arrived with, what the process involved, and where they landed."
          className="mb-[56px] md:mb-[72px]"
        />

        <div className="flex flex-col gap-[56px] md:gap-[88px]">
          {featured.map((item, index) => (
            <SpotlightBlock key={item.id} item={item} index={index} />
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}

function SpotlightBlock({ item, index }: { item: Testimonial; index: number }) {
  const isEven = index % 2 === 1;
  const containerRef = React.useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  /*
   * The story's own media, when the practice has attached any.
   *
   * These fall back to stand-in photography, and the fallbacks are food, not
   * faces: a stock portrait next to a named client's quote implies it is a
   * photograph OF that client, which would be a fabrication. Real client
   * photographs are uploaded per story in the admin panel, and only with the
   * written consent the editor requires before it will save.
   */
  const media = hasStoryMedia(item);
  const standIns = [
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=75&w=1000",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=75&w=1000",
    "https://images.unsplash.com/photo-1602881916963-5daf2d97c06e?auto=format&fit=crop&q=75&w=1000",
  ];

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-[36px] lg:gap-[64px] items-center max-w-[680px] lg:max-w-none mx-auto w-full",
        isEven && "lg:grid-cols-[7fr_5fr]",
      )}
    >
      {/* IMAGE SIDE */}
      <div
        className={cn(
          "relative w-full aspect-[4/5] max-w-[440px] mx-auto",
          isEven ? "lg:order-2" : "lg:order-1",
        )}
      >
        <Reveal className="h-full">
          {/* Back layer offset block */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-[22px_-22px_-22px_22px] bg-primary-soft rounded-[26px]",
              isEven ? "inset-[22px_22px_-22px_-22px] rotate(3deg)" : "rotate(-3deg)",
            )}
          />

          {/* Photo or video container */}
          {media ? (
            <StoryMedia
              photoUrl={item.photoUrl}
              videoUrl={item.videoUrl}
              alt={`${item.name}'s story`}
              ratio="4/5"
              rounded="rounded-[26px]"
              className="h-full border border-white/10 ring-1 ring-inset ring-black/5"
            />
          ) : (
            <div className="relative h-full w-full overflow-hidden rounded-[26px] border border-white/10 ring-1 ring-inset ring-black/5">
              <motion.img
                src={standIns[index % standIns.length]}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-full w-full scale-[1.08] object-cover"
                style={{ y: shouldReduceMotion ? 0 : imageY }}
              />
            </div>
          )}

          {/* Floating Result Card */}
          <Reveal
            delay={0.32}
            className={cn(
              "absolute -bottom-[24px] z-20 w-[calc(100%-32px)] lg:w-[280px] left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0",
              isEven ? "lg:left-[-24px]" : "lg:right-[-24px]",
            )}
          >
            <motion.div
              initial={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, rotate: isEven ? 3 : -3 }
              }
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.32 }}
              className="bg-surface/90 backdrop-blur-[16px] border border-border rounded-[18px] p-[16px_20px] shadow-[0_16px_40px_rgba(var(--shadow-rgb), 0.12)] flex items-center gap-4"
            >
              <div className="w-[40px] h-[40px] shrink-0 rounded-[10px] bg-primary flex items-center justify-center">
                <TrendingUp className="text-white w-[18px] h-[18px]" />
              </div>
              <div className="min-w-0">
                {/* Taken from the story's own "after" list. It used to be
                    chosen by array position, so reordering the stories in the
                    admin panel relabelled them with someone else's result. */}
                <p className="truncate text-[14.5px] font-semibold leading-tight text-text">
                  {item.after?.length ? item.after.join(" · ") : item.condition}
                </p>
                <p className="text-[12.5px] text-text-muted mt-0.5">
                  {item.duration} program · {item.location.split(",")[0]}
                </p>
              </div>
            </motion.div>
          </Reveal>
        </Reveal>
      </div>

      {/* CONTENT SIDE */}
      <div className={cn("w-full", isEven ? "lg:order-1" : "lg:order-2")}>
        <Reveal stagger={0.08}>
          {/* Condition Chip */}
          <div className="inline-flex px-[13px] py-[6px] rounded-full bg-primary-soft text-primary text-[12px] font-semibold uppercase tracking-[0.1em] mb-5">
            {item.condition}
          </div>

          {/* Pull Quote */}
          <blockquote className="relative mb-[26px] pl-[26px]">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-0 top-0 w-[3px] h-full bg-accent rounded-full origin-top"
            />
            <p
              className="font-fraunces italic font-normal text-text leading-[1.45] tracking-[-0.015em]"
              style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.625rem)" }}
            >
              "{item.quote}"
            </p>
          </blockquote>

          {/* Full Story */}
          <div className="flex flex-col gap-4 mb-7 max-w-[58ch]">
            {item.fullStory?.split("\n\n").map((p: string, i: number) => (
              <p key={i} className="text-[15px] leading-[1.75] text-text-muted">
                {p}
              </p>
            ))}
          </div>

          {/* Attribution Row */}
          <div className="pt-[22px] border-t border-border flex items-center gap-[14px]">
            <div className="w-[48px] h-[48px] shrink-0 rounded-full bg-primary-soft ring-[1.5px] ring-border flex items-center justify-center">
              <span className="font-fraunces text-[16px] font-medium text-primary">
                {item.initials}
              </span>
            </div>
            <figcaption className="min-w-0">
              <cite className="block not-italic text-[15.5px] font-semibold text-text leading-tight">
                {item.name}
              </cite>
              <div className="mt-1 flex flex-col gap-0.5">
                <span className="text-[13px] text-text-muted">
                  {item.condition} · {item.duration}
                </span>
                <span className="text-[12.5px] text-text-muted flex items-center gap-1">
                  <MapPin className="w-[13px] h-[13px]" />
                  {item.location}
                </span>
              </div>
            </figcaption>
            <div
              className="ml-auto hidden min-[480px]:flex gap-[3px]"
              aria-label={`Rated ${item.rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  className={cn(
                    "w-[15px] h-[15px]",
                    i < item.rating ? "fill-accent text-accent" : "text-border",
                  )}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
