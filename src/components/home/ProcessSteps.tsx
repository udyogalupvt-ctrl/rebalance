import { Link } from "@tanstack/react-router";
import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { SectionWrapper } from "../shared/SectionWrapper";
import { SectionHeading } from "../shared/SectionHeading";
import { Reveal } from "../shared/Reveal";
import { processSteps } from "../../data/content";
import type { MotionValue } from "framer-motion";

export const ProcessSteps: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "center 0.4"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
  });

  const leadingPathLength = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
  });

  return (
    <SectionWrapper
      arc="left"
      id="method"
      bg="base"
      labelledBy="method-heading"
      className="relative"
    >
      {/* Decorative Dot Grid */}
      <div
        className="absolute top-0 left-0 w-full h-[40%] pointer-events-none opacity-6 z-0"
        style={{
          backgroundImage: `radial-gradient(var(--primary) 1.5px, transparent 1.5px)`,
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-1">
        <SectionHeading
          align="center"
          eyebrow="HOW IT WORKS"
          title="Four steps to a gut that finally *works with you*."
          subtitle="No generic diet charts. No one-size protocol. Just a clear, guided path from where you are now to a body that stops fighting you."
        />

        <div className="mt-[56px] lg:mt-[72px]" ref={containerRef}>
          {/* Desktop Layout (Horizontal) */}
          <div className="hidden lg:block relative">
            {/* The Line */}
            <svg
              className="absolute w-full overflow-visible z-0 pointer-events-none"
              style={{ top: "32px" }}
              viewBox="0 0 1200 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Base Line */}
              <path
                d="M 0,20 C 200,4 400,36 600,20 S 1000,4 1200,20"
                className="stroke-primary/25 fill-none"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Drawing Line */}
              <motion.path
                d="M 0,20 C 200,4 400,36 600,20 S 1000,4 1200,20"
                className="stroke-primary fill-none"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ pathLength }}
              />
              {/* Leading Highlight Line */}
              <motion.path
                d="M 0,20 C 200,4 400,36 600,20 S 1000,4 1200,20"
                className="stroke-accent/60 fill-none"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ pathLength: leadingPathLength }}
              />
            </svg>

            {/* Steps Row */}
            <ol className="grid grid-cols-4 gap-8 xl:gap-10 relative z-1 list-none p-0 m-0">
              {processSteps.map((step, idx) => (
                <StepItem
                  key={step.number}
                  step={step}
                  index={idx}
                  total={processSteps.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </ol>
          </div>

          {/* Mobile/Tablet Layout (Vertical) */}
          <div className="lg:hidden relative">
            <div
              className="absolute left-[31px] sm:left-[27px] top-7 bottom-7 w-[2px] bg-primary/20 z-0"
              aria-hidden="true"
            >
              <motion.div
                className="w-full bg-primary origin-top"
                style={{ scaleY: scrollYProgress }}
              />
            </div>

            <ol className="flex flex-col gap-12 sm:gap-10 relative z-1 list-none p-0 m-0">
              {processSteps.map((step, idx) => (
                <MobileStepItem
                  key={step.number}
                  step={step}
                  index={idx}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </ol>
          </div>
        </div>

        {/* Closing CTA Strip */}
        <Reveal delay={0.2}>
          <div className="mt-20 sm:mt-14 bg-surface border border-border rounded-[24px] p-8 sm:p-5 flex flex-col md:flex-row md:justify-between items-center gap-6 text-center md:text-left">
            <div className="space-y-1.5">
              <h4 className="text-[clamp(1.125rem,1.8vw,1.375rem)] font-fraunces font-medium text-text leading-tight">
                Ready to find your root cause?
              </h4>
              <p className="text-sm text-text-muted">Step one takes about ten minutes.</p>
            </div>
            <Link
              to="/assessment"
              className="group inline-flex items-center justify-center bg-accent-strong text-on-accent font-semibold text-[15px] h-[54px] px-[30px] rounded-full shadow-lg shadow-accent/10 transition-transform active:scale-95 w-full md:w-auto"
            >
              <span>Start Step One</span>
              <motion.span
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </Link>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
};

interface StepItemProps {
  step: (typeof processSteps)[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

const StepItem: React.FC<StepItemProps> = ({ step, index, total, scrollYProgress }) => {
  const threshold = (index + 0.5) / total;
  const isActive = useTransform(scrollYProgress, (val: number) => val >= threshold - 0.15);
  const [active, setActive] = React.useState(() => Boolean(isActive.get()));

  React.useEffect(() => {
    setActive(Boolean(isActive.get()));
    return isActive.on("change", (v) => setActive(Boolean(v)));
  }, [isActive]);

  const Icon = step.icon;

  return (
    <li className="relative">
      <div className="flex flex-col items-start pt-0">
        {/* Node */}
        <div className="h-[64px] flex items-center justify-start mb-6">
          <motion.div
            className={`
              relative z-10 w-16 h-16 rounded-full border-2 grid place-items-center
              ${active ? "border-primary" : "border-primary/30"}
            `}
            initial={{ scale: 0.6 }}
            animate={{ scale: active ? 1 : 0.6 }}
            style={{ backgroundColor: active ? "var(--primary-strong)" : "var(--surface)" }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
          >
            {active && (
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/8"
                initial={{ scale: 1 }}
                animate={{ scale: 1.25 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              />
            )}
            <span
              className={`font-fraunces text-xl ${active ? "text-on-primary" : "text-primary-contrast"}`}
            >
              {step.number}
            </span>
          </motion.div>
        </div>

        {/* Content */}
        <motion.div
          className="transition-all duration-500"
          initial={{ opacity: 0.85, y: 12 }}
          animate={{
            opacity: active ? 1 : 0.85,
            y: active ? 0 : 12,
          }}
          whileHover={{ y: active ? -4 : 0 }}
        >
          <div className="space-y-4">
            <div className="flex flex-col items-start gap-3">
              <Icon
                className={`w-5 h-5 transition-transform duration-300 ${active ? "text-accent group-hover:rotate-8 group-hover:scale-110" : "text-accent-contrast"}`}
                strokeWidth={1.75}
              />
              <h3 className="fs-h4 text-text">{step.title}</h3>
            </div>
            <p className="text-[15px] leading-relaxed text-text-muted max-w-[34ch]">
              {step.description}
            </p>
            <div className="inline-flex text-[12px] font-medium text-primary-contrast bg-primary-soft px-3 py-1.5 rounded-full">
              {step.meta}
            </div>
          </div>
        </motion.div>
      </div>
    </li>
  );
};

interface MobileStepItemProps {
  step: (typeof processSteps)[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}

const MobileStepItem: React.FC<MobileStepItemProps> = ({ step, index, scrollYProgress }) => {
  const threshold = index / 4;
  const isActive = useTransform(scrollYProgress, (val: number) => val >= threshold);
  const [active, setActive] = React.useState(() => Boolean(isActive.get()));

  React.useEffect(() => {
    setActive(Boolean(isActive.get()));
    return isActive.on("change", (v) => setActive(Boolean(v)));
  }, [isActive]);

  const Icon = step.icon;

  return (
    <li className="grid grid-cols-[64px_1fr] sm:grid-cols-[56px_1fr] gap-5 sm:gap-4 relative">
      {/* Node Container */}
      <div className="relative z-10 flex justify-center">
        <motion.div
          className={`
            w-14 h-14 sm:w-12 sm:h-12 rounded-full border-2 grid place-items-center
            ${active ? "border-primary" : "border-primary/30"}
          `}
          initial={{ scale: 0.8 }}
          animate={{ scale: active ? 1 : 0.8 }}
          style={{ backgroundColor: active ? "var(--primary-strong)" : "var(--surface)" }}
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
        >
          <span
            className={`font-fraunces text-lg sm:text-base ${active ? "text-on-primary" : "text-primary-contrast"}`}
          >
            {step.number}
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        className="pb-8 space-y-4"
        initial={{ opacity: 0.85, y: 12 }}
        animate={{
          opacity: active ? 1 : 0.85,
          y: active ? 0 : 12,
        }}
      >
        <div className="space-y-3">
          <div className="flex flex-col items-start gap-2">
            <Icon className="w-5 h-5 text-accent" strokeWidth={1.75} />
            <h3 className="fs-h4 text-text">{step.title}</h3>
          </div>
          <p className="text-sm leading-relaxed text-text-muted">{step.description}</p>
          <div className="inline-flex text-[12px] font-medium text-primary-contrast bg-primary-soft px-3 py-1.5 rounded-full">
            {step.meta}
          </div>
        </div>
      </motion.div>
    </li>
  );
};
