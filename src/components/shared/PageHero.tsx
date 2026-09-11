import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  HeroBackdrop,
  HeroBackdropDots,
  type BackdropSlide,
} from "@/components/shared/HeroBackdrop";
import { useBackdropCarousel } from "@/hooks/use-backdrop-carousel";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  breadcrumb: BreadcrumbItem[];
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    /** object-position, e.g. "50% 35%". Defaults to centre. */
    position?: string;
    /** Frame aspect ratio. Portrait sources need "3/4" or they get beheaded. */
    ratio?: string;
  };
  align?: "left" | "center";
  variant?: "image" | "plain";
  /**
   * The photographs behind the band.
   *
   * Every marketing page passes a set related to what it is about. Without
   * one the hero falls back to gradients, which is what all of them used to
   * be — and why five of the six pages opened on flat colour.
   */
  backdrop?: readonly BackdropSlide[];
  children?: React.ReactNode;
}

/**
 * Splits a title into animatable word spans while keeping trailing punctuation
 * attached to its word. The previous implementation split on spaces only, so
 * `Inside the *practice*.` rendered the "." as its own word with a 0.2em left
 * margin — producing a visible gap: "practice ."
 */
function useTitleWords(title: string) {
  return React.useMemo(() => {
    const segments = title.split(/(\*[^*]+\*)/g).filter(Boolean);
    const words: { text: string; accent: boolean }[] = [];

    segments.forEach((seg) => {
      const accent = seg.startsWith("*") && seg.endsWith("*");
      const text = accent ? seg.slice(1, -1) : seg;

      text.split(/\s+/).forEach((w) => {
        if (!w) return;
        if (accent) {
          words.push({ text: w, accent: true });
        } else if (words.length && /^[.,!?;:]+$/.test(w)) {
          // bare punctuation — glue it to the previous word
          const prev = words[words.length - 1]!;
          words[words.length - 1] = { text: prev.text + w, accent: prev.accent };
        } else {
          words.push({ text: w, accent: false });
        }
      });
    });

    return words;
  }, [title]);
}

/**
 * The opening band on every page except the home page.
 *
 * REBUILT, for the same reason as the home hero. This used to be a full-bleed
 * photograph under a scrim running from 94% to 58% opacity. At that strength
 * the photograph contributes nothing you can identify — it is a dark
 * rectangle with a faint texture — while still costing a full-width image
 * download and a permanently-running 16-second scale animation on every page
 * load. The practice's summary of the whole site was that the colours were
 * too dark, and five of the six pages opened with this.
 *
 * It is now light: the same porcelain-and-blush ground as the home hero, with
 * the photograph moved into a framed panel on the right where it is small
 * enough to be sharp and large enough to be legible. Copy sits on the page
 * background, so it is read at 15:1 rather than through a scrim.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  image,
  align = "left",
  variant = "image",
  backdrop,
  children,
}: PageHeroProps) {
  const reduce = useReducedMotion();

  const hasImage = variant === "image" && !!image;
  const isCenter = align === "center" || !hasImage;
  const words = useTitleWords(title);
  const slides = backdrop ?? [];
  const carousel = useBackdropCarousel(slides.length, 7000);

  return (
    <section
      className="relative isolate w-full overflow-hidden bg-bg"
      style={{
        paddingTop: "calc(var(--header-h) + clamp(56px, 7vw, 88px))",
        paddingBottom: "clamp(56px, 7vw, 88px)",
      }}
    >
      {/*
        Ground: a photographic carousel under the brand wash.

        z-0 rather than -z-10. A negatively-stacked child only paints in front
        of its parent's own background when the parent establishes a stacking
        context, and the route transition wrapper above this one does — which
        is the bug that hid the home hero's photographs for so long. `isolate`
        on the section settles it either way, and z-0 leaves nothing to
        depend on.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {slides.length > 0 && (
          <>
            <HeroBackdrop slides={slides} index={carousel.index} className="hero-backdrop--page" />
            <div
              className={cn(
                "hero-veil hero-veil--page absolute inset-0",
                isCenter && "hero-veil--centred",
              )}
            />
          </>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_110%_90%_at_82%_10%,rgba(var(--accent-rgb),0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_2%_88%,rgba(var(--primary-rgb),0.12),transparent_58%)]" />
        <div className="absolute -right-[16%] -top-[30%] hidden aspect-square w-[46vw] rounded-full border border-[rgba(var(--primary-rgb),0.14)] lg:block" />
      </div>

      <div className="container-x relative z-10">
        <div className={cn("grid items-center gap-10", hasImage && "lg:grid-cols-12 lg:gap-12")}>
          <div
            className={cn(
              "min-w-0",
              hasImage ? "lg:col-span-7" : "mx-auto max-w-[780px] text-center",
            )}
          >
            <motion.nav
              aria-label="Breadcrumb"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.45 }}
              className={cn("mb-6 flex", isCenter && !hasImage && "justify-center")}
            >
              <ol className="m-0 flex list-none flex-wrap items-center gap-2.5 p-0">
                {breadcrumb.map((item, index) => {
                  const isLast = index === breadcrumb.length - 1;
                  return (
                    <React.Fragment key={item.label}>
                      <li>
                        {isLast ? (
                          <span aria-current="page" className="text-[13px] font-medium text-text">
                            {item.label}
                          </span>
                        ) : (
                          <Link
                            to={item.href}
                            className="inline-flex min-h-[36px] items-center text-[13px] text-text-muted transition-colors hover:text-text hover:underline"
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                      {!isLast && (
                        <ChevronRight
                          size={14}
                          aria-hidden="true"
                          className="text-text-muted opacity-60"
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </ol>
            </motion.nav>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.06 }}
              className={cn(
                "mb-6 inline-flex items-center gap-2 rounded-pill border border-[rgba(var(--primary-rgb),0.22)] bg-primary-soft px-4 py-2",
              )}
            >
              <span
                className="h-[5px] w-[5px] shrink-0 rounded-full bg-accent"
                aria-hidden="true"
              />
              <span className="fs-eyebrow text-primary-contrast">{eyebrow}</span>
            </motion.div>

            {/* The literal {" "} carries the word space. A margin between
                inline-blocks is invisible to screen readers and to the
                clipboard — see the note in Hero.tsx. */}
            <h1 className="fs-display mb-5 text-text">
              {words.map((w, i) => (
                <React.Fragment key={i}>
                  <span className="inline-block overflow-hidden align-bottom">
                    <motion.span
                      initial={reduce ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.12 + i * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={cn("inline-block", w.accent && "italic text-accent-contrast")}
                    >
                      {w.text}
                    </motion.span>
                  </span>
                  {i < words.length - 1 ? " " : null}
                </React.Fragment>
              ))}
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.2 }}
              className={cn("fs-sub max-w-[620px]", !hasImage && "mx-auto")}
            >
              {subtitle}
            </motion.p>

            {children && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.28 }}
                className={cn("mt-8 flex flex-wrap gap-3", !hasImage && "justify-center")}
              >
                {children}
              </motion.div>
            )}

            {/* The carousel's controls, in the copy column with everything
                else rather than floated over the photograph. */}
            {slides.length > 1 && (
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.4 }}
                className={cn("mt-7 -ml-2", isCenter && "flex justify-center")}
              >
                <HeroBackdropDots
                  slides={slides}
                  index={carousel.index}
                  onSelect={carousel.select}
                />
              </motion.div>
            )}
          </div>

          {hasImage && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduce ? 0 : 0.75,
                delay: reduce ? 0 : 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative mx-auto hidden w-full max-w-[420px] lg:col-span-5 lg:block lg:max-w-none"
            >
              <div className="overflow-hidden rounded-[26px] border border-[rgba(var(--primary-rgb),0.14)] bg-surface-alt shadow-[0_30px_70px_rgba(var(--shadow-rgb),0.2),0_6px_18px_rgba(var(--shadow-rgb),0.1)]">
                <img
                  src={image!.src}
                  alt={image!.alt}
                  width={image!.width ?? 1200}
                  height={image!.height ?? 900}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="block w-full object-cover"
                  style={{
                    aspectRatio: image!.ratio ?? "4 / 3",
                    objectPosition: image!.position ?? "50% 50%",
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
