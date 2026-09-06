import * as React from "react";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { type GalleryItem } from "@/data/content";

interface LightboxProps {
  items: GalleryItem[];
  selectedIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({ items, selectedIndex, isOpen, onClose, onNext, onPrev }: LightboxProps) {
  const currentItem = items[selectedIndex] || items[0];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!currentItem) return null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-[var(--dark-surface)]/88 backdrop-blur-md animate-in fade-in" />
        <DialogPrimitive.Content className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 animate-in zoom-in-95 duration-300 outline-none">
          <button
            onClick={onClose}
            className="fixed top-6 right-6 z-[101] w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            aria-label="Close gallery"
          >
            <X size={20} />
          </button>

          <div className="relative w-full max-w-[1100px] max-h-[88vh] flex items-center justify-center">
            <img
              src={currentItem.src}
              alt={currentItem.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />

            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all hidden md:flex"
              aria-label="Previous image"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all hidden md:flex"
              aria-label="Next image"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="mt-6 w-full max-w-[1100px] flex flex-wrap justify-between items-center text-white/90 gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-[12px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                {currentItem.category}
              </span>
              <span className="text-sm font-medium">{currentItem.caption}</span>
            </div>
            <span className="text-sm font-medium opacity-70">
              {selectedIndex + 1} / {items.length}
            </span>
          </div>

          <div className="md:hidden flex gap-4 mt-6">
            <button
              onClick={onPrev}
              className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={onNext}
              className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center"
            >
              <ChevronRight />
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
