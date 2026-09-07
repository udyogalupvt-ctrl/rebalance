import * as React from "react";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Maximize2, Plus } from "lucide-react";
import { fetchPublished } from "@/lib/cms-public";
import { galleryFull as fallbackGallery } from "@/data/content";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { FilterBar } from "@/components/shared/FilterBar";
import { Lightbox } from "@/components/shared/Lightbox";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/data/gallery";

/** Chip ground that stays legible over any photograph. */
const CHIP_BG = "bg-dark-surface/85 backdrop-blur-md border border-on-dark-border";
const CATEGORIES = ["All", "Clinic", "Consultations", "Meal Plans", "Nutrition", "Community"];
export function MasonryGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [itemsToShow, setItemsToShow] = useState(12);
  const [data, setData] = useState(fallbackGallery);
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    index: 0,
  });
  const prefersReducedMotion = useReducedMotion();
  useEffect(() => {
    fetchPublished("galleryItems", fallbackGallery).then((res) => setData(res));
  }, []);
  const { filteredItems, counts } = useMemo(() => {
    const c: Record<string, number> = { All: data.length };
    data.forEach((item) => {
      c[item.category] = (c[item.category] || 0) + 1;
    });
    let filtered = data;
    if (activeCategory !== "All") {
      filtered = data.filter((item) => item.category === activeCategory);
    }
    return { filteredItems: filtered, counts: c };
  }, [activeCategory, data]);
  const visibleItems = filteredItems.slice(0, itemsToShow);
  const handleLoadMore = () => {
    setItemsToShow((prev) => prev + 12);
  };
  const openLightbox = (index: number) => {
    setLightboxState({ isOpen: true, index });
  };
  const closeLightbox = () => {
    setLightboxState({ ...lightboxState, isOpen: false });
  };
  const navigateLightbox = (direction: number) => {
    setLightboxState((prev) => ({
      ...prev,
      index: (prev.index + direction + filteredItems.length) % filteredItems.length,
    }));
  };
  return (
    <SectionWrapper id="gallery-grid" bg="base" labelledBy="gallery-grid-heading">
      <div className="mb-12 lg:mb-10">
        <SectionHeading
          align="center"
          eyebrow="BROWSE"
          title="A look at how the work *happens*."
          subtitle="Filter by what you'd like to see, or scroll through everything."
        />
      </div>

      <FilterBar
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setItemsToShow(12);
        }}
        counts={counts}
      />

      <div role="tabpanel" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.ul
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="columns-2 md:columns-2 lg:columns-3 xl:columns-4 gap-[14px] md:gap-[16px] lg:gap-[20px] list-none p-0 m-0"
          >
            {visibleItems.map((item, index) => (
              <li
                key={item.id}
                className="break-inside-avoid mb-[14px] md:mb-[16px] lg:mb-[20px] block w-full"
              >
                <Reveal delay={prefersReducedMotion ? 0 : (index % 4) * 0.05}>
                  <GalleryTile
                    item={item}
                    onClick={() => openLightbox(index)}
                    isEager={index < 8}
                  />
                </Reveal>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>

        <div className="mt-12 md:mt-10 flex flex-col items-center gap-3">
          {itemsToShow < filteredItems.length ? (
            <button
              onClick={handleLoadMore}
              className="h-[52px] px-8 rounded-full border-[1.5px] border-primary text-primary font-semibold text-[15px] inline-flex items-center gap-2 transition-all hover:bg-primary-soft hover:-translate-y-0.5"
              aria-label="Load more images"
            >
              Load More
              <Plus className="w-[17px] h-[17px]" />
            </button>
          ) : (
            <p className="text-sm text-text-muted font-medium">
              That's everything — {filteredItems.length} images.
            </p>
          )}
          <p className="text-[13px] text-text-muted">
            Showing {Math.min(itemsToShow, filteredItems.length)} of {filteredItems.length}
          </p>
        </div>
      </div>

      <Lightbox
        items={filteredItems}
        selectedIndex={lightboxState.index}
        isOpen={lightboxState.isOpen}
        onClose={closeLightbox}
        onNext={() => navigateLightbox(1)}
        onPrev={() => navigateLightbox(-1)}
      />
    </SectionWrapper>
  );
}
function GalleryTile({
  item,
  onClick,
  isEager,
}: {
  item: GalleryItem;
  onClick: () => void;
  isEager: boolean;
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const aspectRatios: Record<string, string> = {
    portrait: "3/4",
    landscape: "4/3",
    square: "1/1",
    tall: "2/3",
  };
  const ratio = aspectRatios[item.orientation ?? "square"] || "1/1";
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block w-full p-0 border-none bg-surface rounded-[14px] md:rounded-[18px] overflow-hidden cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-[3px] transition-all"
      aria-label={`${item.caption} — open larger image`}
      style={{ aspectRatio: ratio }}
    >
      {/* Placeholder / Shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-surface-alt animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.6s_infinite]" />
        </div>
      )}

      <img
        src={item.src}
        alt={item.alt}
        loading={isEager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isLoaded ? "opacity-100" : "opacity-0",
          "group-hover:scale-[1.06]",
        )}
      />

      {/* Scrim */}
      <div
        aria-hidden="true"
        className="image-scrim absolute inset-0 transition-opacity duration-300 opacity-90 group-hover:opacity-100"
      />

      {/* Caption Block */}
      <div className="absolute bottom-0 left-0 right-0 p-[13px] md:p-[18px] text-left">
        {item.category && ratio !== "2/3" && (
          // Same dark ground as the video chips. This one sits on the strong
          // end of the scrim and measured 4.63-4.76:1 -- passing, but only
          // just, and the margin depends on which photo is behind it.
          <span
            className={
              "inline-block fs-eyebrow text-on-dark px-[9px] py-1 rounded-full mb-1.5 " + CHIP_BG
            }
          >
            {item.category}
          </span>
        )}
        <p className="text-[12.5px] md:text-sm font-semibold text-on-dark leading-[1.35]">
          {item.caption}
        </p>
      </div>

      {/* Expand Affordance */}
      <div
        className={cn(
          "absolute top-3 right-3 w-8 h-8 rounded-full glass-on-dark flex items-center justify-center transition-all duration-300",
          "opacity-0 scale-[0.85] group-hover:opacity-100 group-hover:scale-100",
          "hidden md:flex",
        )}
      >
        <Maximize2 className="w-[15px] h-[15px] text-on-dark" />
      </div>

      {/* Inset Accent Ring on Hover */}
      <div className="absolute inset-0 border-[1.5px] border-accent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[14px] md:rounded-[18px]" />
    </button>
  );
}
