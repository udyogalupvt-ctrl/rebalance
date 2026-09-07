import * as React from "react";
import { credibilityItems } from "@/data/content";
import { Reveal } from "@/components/shared/Reveal";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function CredibilityMarquee() {
  const shouldReduceMotion = useReducedMotion();

  const MarqueeItem = ({ icon: Icon, label }: { icon: LucideIcon; label: string }) => {
    return (
      <div className="inline-flex items-center gap-[10px] whitespace-nowrap group transition-colors duration-300">
        {Icon && (
          <Icon
            size={18}
            strokeWidth={1.75}
            className="text-primary group-hover:text-accent transition-colors duration-300"
          />
        )}
        <span className="text-[13px] md:text-[14px] font-medium tracking-[0.01em] text-text-muted">
          {label}
        </span>
      </div>
    );
  };

  const Separator = () => (
    <div
      className="flex-shrink-0 w-1 h-1 rounded-full bg-accent opacity-45 mx-[24px] md:mx-[32px]"
      aria-hidden="true"
    />
  );

  if (shouldReduceMotion) {
    return (
      <Reveal delay={0.15} className="w-full bg-surface border-y border-border">
        <section
          aria-label="What we specialise in"
          className="h-[64px] md:h-[72px] lg:h-[80px] flex items-center justify-center px-6"
        >
          <div className="flex flex-wrap justify-center gap-[24px]">
            {credibilityItems.map((item, i) => (
              <MarqueeItem key={i} {...item} />
            ))}
          </div>
        </section>
      </Reveal>
    );
  }

  return (
    <Reveal delay={0.15} className="w-full bg-surface border-y border-border overflow-hidden">
      <section
        aria-label="What we specialise in"
        className="relative h-[64px] md:h-[72px] lg:h-[80px] flex items-center bg-surface border-y border-border"
      >
        {/* Edge Fades */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
          }}
        >
          {/* Desktop Mask Override */}
          <div
            className="hidden md:block absolute inset-0"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%)",
            }}
          />
        </div>

        {/* Marquee Track */}
        <div className="flex items-center animate-marquee-mobile md:animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] will-change-transform">
          {/* Primary Set */}
          <div className="flex items-center flex-shrink-0">
            {credibilityItems.map((item, i) => (
              <React.Fragment key={`p-${i}`}>
                <MarqueeItem {...item} />
                <Separator />
              </React.Fragment>
            ))}
          </div>

          {/* Duplicate Set */}
          <div className="flex items-center flex-shrink-0" aria-hidden="true">
            {credibilityItems.map((item, i) => (
              <React.Fragment key={`d-${i}`}>
                <MarqueeItem {...item} />
                <Separator />
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
