import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

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
  };
  align?: "left" | "center";
  variant?: "image" | "plain";
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

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  image,
  align = "left",
  variant = "image",
  children,
}: PageHeroProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.45]);

  const isImage = variant === "image" && !!image;
  const isCenter = align === "center";
  const words = useTitleWords(title);

  const fg = isImage ? "var(--on-dark)" : "var(--text)";
  const fgMuted = isImage ? "var(--on-dark-muted)" : "var(--text-muted)";
  const fgBorder = isImage ? "var(--on-dark-border)" : "var(--border)";

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden isolate",
        isImage ? "bg-dark-surface" : "bg-surface-alt",
      )}
      style={{
        // Clears the fixed header, then adds the hero's own breathing room.
        paddingTop: "calc(var(--header-h) + clamp(72px, 9vw, 112px))",
        paddingBottom: "clamp(72px, 9vw, 112px)",
        minHeight: "clamp(340px, 46vw, 460px)",
      }}
    >
      {/* Background stack */}
      {isImage ? (
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <motion.div
            className="absolute inset-0 motion-parallax"
            style={{ y: reduce ? 0 : imageY }}
          >
            <motion.img
              src={image!.src}
              alt=""
              width={image!.width ?? 1920}
              height={image!.height ?? 1080}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
              style={{ objectPosition: image!.position ?? "50% 50%" }}
              initial={{ scale: 1.06 }}
              animate={reduce ? { scale: 1.06 } : { scale: [1.06, 1.12] }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 16, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
              }
            />
          </motion.div>

          {/* Scrim — strong enough that --on-dark text clears 4.5:1 over any
              part of the photograph, including its lightest areas. */}
          <div
            className={cn(
              "absolute inset-0 z-10",
              isCenter
                ? "bg-[linear-gradient(to_bottom,rgba(var(--dark-surface-rgb),0.88)_0%,rgba(var(--dark-surface-rgb),0.72)_50%,rgba(var(--dark-surface-rgb),0.88)_100%)]"
                : "bg-[linear-gradient(100deg,rgba(var(--dark-surface-rgb),0.94)_0%,rgba(var(--dark-surface-rgb),0.84)_46%,rgba(var(--dark-surface-rgb),0.58)_100%)]",
            )}
          />
          {/* Bottom melt into the page background */}
          <div className="absolute bottom-0 inset-x-0 h-[140px] z-20 bg-gradient-to-t from-bg to-transparent" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-primary/12 rounded-full blur-[150px] z-20" />
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-primary/10 rounded-full blur-[150px]" />
        </div>
      )}

      {/* Content */}
      <div className={cn("container-x relative z-30", isCenter && "text-center")}>
        <motion.div
          style={{ y: reduce ? 0 : contentY, opacity: contentOpacity }}
          className={cn("max-w-[780px]", isCenter && "mx-auto")}
        >
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.5 }}
            className={cn("flex mb-7", isCenter && "justify-center")}
          >
            <ol className="flex items-center gap-2.5 list-none p-0 m-0 flex-wrap">
              {breadcrumb.map((item, index) => {
                const isLast = index === breadcrumb.length - 1;
                return (
                  <React.Fragment key={item.label}>
                    <li>
                      {isLast ? (
                        <span
                          aria-current="page"
                          className="text-[13px] font-medium"
                          style={{ color: fg }}
                        >
                          {item.label}
                        </span>
                      ) : (
                        <Link
                          to={item.href}
                          className="inline-flex items-center text-[13px] min-h-[44px] transition-colors hover:underline"
                          style={{ color: fgMuted }}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                    {!isLast && (
                      <ChevronRight
                        size={14}
                        aria-hidden="true"
                        style={{ color: fgMuted, opacity: 0.6 }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </ol>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.08 }}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6",
              isImage ? "glass-on-dark" : "bg-surface border border-border",
            )}
          >
            <span className="w-[5px] h-[5px] rounded-full bg-accent shrink-0" aria-hidden="true" />
            <span className="fs-eyebrow" style={{ color: fg }}>
              {eyebrow}
            </span>
          </motion.div>

          <h1 className="fs-display mb-6" style={{ color: fg }}>
            {words.map((w, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden align-bottom mr-[0.24em] last:mr-0"
              >
                <motion.span
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.16 + i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                  className={cn("inline-block", w.accent && "italic")}
                  style={{
                    color: w.accent
                      ? isImage
                        ? "var(--on-dark-accent)"
                        : "var(--accent-contrast)"
                      : "inherit",
                  }}
                >
                  {w.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.24 }}
            className={cn("fs-sub max-w-[620px]", isCenter && "mx-auto")}
            style={{ color: fgMuted }}
          >
            {subtitle}
          </motion.p>

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.32 }}
              className={cn("mt-8 flex flex-wrap gap-3", isCenter && "justify-center")}
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll cue. Only shown when there is no meta-chip row to collide with,
          and only on viewports wide enough for it to sit clear of the content. */}
      {!reduce && !children && (
        <div
          className="hidden xl:block absolute z-30 pointer-events-none left-10"
          style={{ bottom: "calc(clamp(72px, 9vw, 112px) + 24px)" }}
          aria-hidden="true"
        >
          <div className="w-px h-10 mb-2.5 relative" style={{ backgroundColor: fgBorder }}>
            <motion.div
              animate={{ y: [0, 36, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 -left-[1.5px] w-1 h-1 bg-accent rounded-full"
            />
          </div>
          <span className="fs-eyebrow" style={{ color: fgMuted }}>
            Scroll
          </span>
        </div>
      )}
    </section>
  );
}
