import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  counts?: Record<string, number>;
  className?: string;
  stickyOffset?: string; // e.g. "top-[calc(var(--header-h,72px)+16px)]"
}

export function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  counts,
  className,
  stickyOffset = "top-[calc(var(--header-h,72px)+16px)]",
}: FilterBarProps) {
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsStuck(!entry.isIntersecting);
        }
      },
      { threshold: [1], rootMargin: "-84px 0px 0px 0px" }, // 84px matches --header-h
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full" />
      <div
        className={cn(
          "sticky z-20 w-full mb-10 transition-all duration-300",
          stickyOffset,
          isStuck &&
            "bg-bg/82 backdrop-blur-xl border-b border-border py-4 -mx-[max(24px,calc((100vw-1280px)/2))] px-[max(24px,calc((100vw-1280px)/2))] w-[100vw]",
          className,
        )}
      >
        <div
          className="flex gap-2.5 overflow-x-auto no-scrollbar md:justify-center md:flex-wrap px-5 md:px-0 relative"
          role="tablist"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "h-11 px-[18px] rounded-full text-sm font-medium transition-all duration-250 whitespace-nowrap flex-shrink-0 border flex items-center gap-1.5",
                activeCategory === cat
                  ? "bg-primary-strong text-on-primary border-primary font-semibold"
                  : "bg-surface text-text-muted border-border hover:bg-primary-soft hover:text-primary hover:border-primary/30",
              )}
            >
              {cat}
              {counts && counts[cat] !== undefined && (
                <span
                  className={cn(
                    "text-[12px] transition-opacity",
                    activeCategory === cat ? "opacity-90" : "opacity-65",
                  )}
                >
                  {counts[cat]}
                </span>
              )}
            </button>
          ))}

          {/* Edge fades for mobile scroll */}
          <div className="md:hidden absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg to-transparent pointer-events-none opacity-0 group-scroll-left:opacity-100" />
          <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg to-transparent pointer-events-none" />
        </div>
      </div>
    </>
  );
}
