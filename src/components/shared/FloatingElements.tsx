import * as React from "react";
import { useState, useEffect } from "react";
import { motion, useScroll, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Custom WhatsApp icon SVG to match brand style precisely.
 */
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function WhatsAppButton() {
  const reduce = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="floating-action fixed bottom-6 right-6 z-[60] flex items-center justify-end gap-3 sm:bottom-8 sm:right-8 transition-opacity duration-200">
      <motion.a
        href="https://wa.me/919390414536?text=Hi%20GoRebalance%2C%20I%27d%20like%20to%20know%20more%20about%20your%20gut%20health%20programs."
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="group relative flex items-center rounded-pill bg-[var(--whatsapp)] text-[var(--on-whatsapp)] shadow-[0_8px_24px_rgba(var(--shadow-rgb),0.22)] h-14 sm:h-[58px]"
        initial={{ width: 56 }}
        animate={{ width: isExpanded ? "auto" : 56 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with GoRebalance on WhatsApp"
      >
        <span className="relative grid place-items-center w-14 h-14 sm:w-[58px] sm:h-[58px] flex-shrink-0">
          {!reduce && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-[var(--whatsapp)]"
              animate={{ scale: [1, 1.45], opacity: [0.45, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <WhatsAppIcon className="relative z-10 w-7 h-7 sm:w-[30px] sm:h-[30px]" />
        </span>
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="pr-6 font-semibold whitespace-nowrap text-[15px]"
            >
              Chat with us
            </motion.span>
          )}
        </AnimatePresence>
      </motion.a>
    </div>
  );
}

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress, scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsVisible(latest > 400);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={scrollToTop}
          className="floating-action fixed bottom-[88px] right-6 z-[60] w-12 h-12 sm:bottom-[104px] sm:right-8 sm:w-14 sm:h-14 flex items-center justify-center glass rounded-full shadow-lg text-primary group transition-opacity duration-200"
          aria-label="Back to top"
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="289"
              style={{ pathLength: scrollYProgress }}
              className="opacity-20"
            />
          </svg>
          <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
