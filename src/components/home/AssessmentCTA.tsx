import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Clock, UserCheck, Lock, ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/Reveal";
import { brand } from "@/data/content";

interface AssessmentCTAProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AssessmentCTA({ title, subtitle, className }: AssessmentCTAProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const onDarkText = "var(--on-dark)";
  const onDarkMuted = "var(--on-dark-muted)"; // Increased opacity for better light mode visibility
  const onDarkBorder = "var(--on-dark-border)"; // Increased opacity for better light mode visibility
  const onDarkGlass = "var(--on-dark-glass)"; // Increased opacity for better light mode visibility

  // Hand-drawn underline component
  const HandDrawnUnderline = () => (
    <svg
      className="absolute -bottom-2 left-0 w-full h-3 overflow-visible pointer-events-none text-accent/70"
      viewBox="0 0 200 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M2 10C30 8.5 60 7.5 198 9.5"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.7,
          delay: 0.8,
          ease: "easeOut",
        }}
      />
    </svg>
  );

  return (
    <section
      id="assessment-cta"
      ref={containerRef}
      aria-labelledby="assessment-cta-heading"
      className={cn(
        "relative w-full overflow-hidden isolate",
        "bg-[var(--dark-surface)]", // Forced forest green background for all modes
        "border-y border-white/10",
        className,
      )}
      style={{
        paddingBlock: "clamp(88px, 11vw, 160px)",
      }}
    >
      {/* Background Stack */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ y: shouldReduceMotion ? 0 : backgroundY }}
      >
        {/* Layer 1: Radial accent glow */}
        <div className="absolute top-[20%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-accent/18 dark:bg-accent/12 rounded-full blur-[160px]" />

        {/* Layer 2: Lighter green glow */}
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-[var(--primary)]/12 rounded-full blur-[140px]" />

        {/* Layer 3: Organic blobs */}
        <motion.div
          animate={{
            translateY: [0, -30, 0],
            translateX: [0, 20, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] right-[5%] w-[480px] h-[480px] bg-white/4 rounded-[42%_58%_70%_30%_/_45%_45%_55%_55%] blur-[60px]"
        />
        <motion.div
          animate={{
            translateY: [0, 30, 0],
            translateX: [0, -20, 0],
          }}
          transition={{
            duration: 34,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[10%] left-[5%] w-[360px] h-[360px] bg-white/4 rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] blur-[60px]"
        />

        {/* Layer 4: Grain overlay */}
        <div className="absolute inset-0 mix-blend-overlay opacity-[0.06]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <filter id="noiseFilterCTA">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilterCTA)" />
          </svg>
        </div>

        {/* Layer 5: Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(var(--shadow-rgb), 0.08)_100%)]" />
      </motion.div>

      <div className="container-x relative z-10 text-center max-w-[820px] mx-auto">
        {/* 1. Eyebrow Chip */}
        <Reveal delay={0.05}>
          <div
            className="inline-flex items-center gap-2 px-4 py-[7px] rounded-full backdrop-blur-xl mb-6"
            style={{ backgroundColor: onDarkGlass, border: `1px solid ${onDarkBorder}` }}
          >
            <div className="relative w-[6px] h-[6px] bg-accent rounded-full">
              <div className="absolute inset-0 bg-accent rounded-full animate-[ping_2.4s_infinite] opacity-75" />
            </div>
            <span
              className="text-[12px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: onDarkText }}
            >
              YOUR FIRST STEP
            </span>
          </div>
        </Reveal>

        {/* 2. H2 */}
        <Reveal delay={0.1}>
          <h2
            id="assessment-cta-heading"
            className="fs-h2 mb-6 text-on-dark"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}
          >
            {title ? (
              title.split(/(\*.*?\*)/g).map((part, i) =>
                part.startsWith("*") && part.endsWith("*") ? (
                  <span key={i} className="relative inline-block italic text-accent">
                    {part.slice(1, -1)}
                    <HandDrawnUnderline />
                  </span>
                ) : (
                  part
                ),
              )
            ) : (
              <>
                Stop guessing. Start{" "}
                <span className="relative inline-block italic text-accent">
                  rebalancing
                  <HandDrawnUnderline />
                </span>
                .
              </>
            )}
          </h2>
        </Reveal>

        {/* 3. Sub-line */}
        <Reveal delay={0.15}>
          <p
            className="fs-sub max-w-[660px] mx-auto mb-10 text-on-dark-muted"
            style={{ fontSize: "clamp(1.0625rem, 1.5vw, 1.1875rem)" }}
          >
            {subtitle ||
              "Take the GoRebalance assessment — a guided two-stage form covering your symptoms, medical history, lifestyle and food habits. Dt. Sai Sowjanya reviews every submission personally and responds within 24 hours."}
          </p>
        </Reveal>

        {/* 4. Reassurance Row */}
        <Reveal delay={0.2}>
          <div className="flex justify-center items-center flex-wrap mb-10">
            <div className="flex flex-col sm:flex-row items-center sm:gap-0 gap-[14px] sm:items-center">
              {[
                { icon: Clock, label: "Takes about 10 minutes" },
                { icon: UserCheck, label: "Reviewed personally" },
                { icon: Lock, label: "100% confidential" },
              ].map((item, i, arr) => (
                <React.Fragment key={i}>
                  <div className="inline-flex items-center gap-2">
                    <item.icon size={16} className="text-accent" />
                    <span className="text-[14px] font-medium" style={{ color: onDarkMuted }}>
                      {item.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      className="hidden sm:block w-[1px] h-4 mx-6"
                      style={{ backgroundColor: onDarkBorder }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Reveal>

        {/* 5. Primary CTA */}
        <Reveal delay={0.25}>
          <motion.a
            href="/assessment"
            className="group relative inline-flex items-center justify-center gap-[10px] h-[56px] sm:h-[60px] px-10 rounded-full font-semibold tracking-[0.01em] transition-all duration-300 overflow-hidden"
            style={{
              backgroundColor: "var(--accent-strong)",
              color: "var(--on-accent)",
              fontSize: "16.5px",
              boxShadow: "0 12px 32px rgba(var(--accent-rgb), 0.32)",
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty("--x", `${x}px`);
              e.currentTarget.style.setProperty("--y", `${y}px`);
            }}
            whileHover={{
              y: -3,
              boxShadow: "0 18px 44px rgba(var(--accent-rgb), 0.42)",
            }}
            whileTap={{ y: -1 }}
            initial={{ scale: 1 }}
            animate={(() => {
              if (typeof window !== "undefined" && !sessionStorage.getItem("cta-pulsed")) {
                sessionStorage.setItem("cta-pulsed", "true");
                return { scale: [1, 1.03, 1] };
              }
              return { scale: 1 };
            })()}
            transition={{
              scale: { delay: 0.85, duration: 0.6, times: [0, 0.5, 1] },
            }}
          >
            {/* Hover radial fill */}
            <span
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"
              style={{
                background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(var(--shadow-rgb), 0.15) 0%, transparent 100%)`,
                transform: "scale(0)",
              }}
            />
            {/* The requirement says: a radial fill in a deeper shade expands from the cursor position (animate from 0 to 250% over 500ms) */}
            {/* Refined implementation with pseudo-element style expansion */}
            <span className="absolute inset-0 pointer-events-none z-0">
              <span
                className="absolute block w-1 h-1 rounded-full bg-black/10 transition-transform duration-500 ease-out group-hover:scale-[250]"
                style={{
                  left: "var(--x, 50%)",
                  top: "var(--y, 50%)",
                  transform: "translate(-50%, -50%) scale(0)",
                }}
              />
            </span>

            <span className="relative z-10">Begin My Assessment</span>
            <ArrowRight
              size={18}
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-[5px]"
            />
          </motion.a>
        </Reveal>

        {/* 6. Secondary Link */}
        <Reveal delay={0.3}>
          <div className="mt-5 mb-9">
            <a
              href={brand.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 min-h-[44px] text-[15px] font-medium transition-colors duration-300 relative"
              style={{ color: onDarkMuted }}
            >
              <MessageCircle size={17} />
              <span className="group-hover:text-[var(--on-dark)] transition-colors">
                Or message us on WhatsApp
              </span>
              <span
                className="absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: onDarkBorder }}
              />
            </a>
          </div>
        </Reveal>

        {/* 7. Micro Footnote */}
        <Reveal delay={0.35}>
          <p
            className="text-[13px] leading-[1.5] max-w-[500px] mx-auto"
            style={{ color: "var(--on-dark-faint)" }}
          >
            Consultation fee applies · Secure payment · Clinic in Kakinada · Online across India
          </p>
        </Reveal>
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.75; }
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
