import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Sun, Moon, LogOut, Phone, MapPin, Info } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { useTheme } from "@/components/shared/ThemeProvider";
import { brand, locations } from "@/data/content";

/**
 * Minimal chrome for the assessment flow.
 *
 * The form previously rendered with no header and no footer at all, so it read
 * as an unrelated product. This carries the same logo, wordmark, theme toggle,
 * tokens and type scale as the marketing site — just stripped down, because
 * the form is a focused task.
 */
export function AssessmentHeader({ onSaveExit }: { onSaveExit?: () => void }) {
  const { theme, setTheme } = useTheme();
  const reduce = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[rgba(var(--surface-rgb),0.86)] backdrop-blur-[20px]">
      <div className="container-x flex items-center justify-between h-[var(--header-h)]">
        <Link
          to="/"
          aria-label="GoRebalance — back to the main site"
          className="inline-flex items-center min-h-[44px] shrink-0 transition-opacity hover:opacity-85"
        >
          <Logo size={34} />
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="grid place-items-center w-11 h-11 rounded-full transition-colors hover:bg-primary-soft"
          >
            <span className="relative block w-5 h-5">
              <motion.span
                className="absolute inset-0 grid place-items-center"
                animate={{
                  rotate: theme === "dark" ? 0 : 90,
                  opacity: theme === "dark" ? 1 : 0,
                  scale: theme === "dark" ? 1 : 0.4,
                }}
                transition={{ duration: reduce ? 0 : 0.35 }}
              >
                <Moon className="w-5 h-5 text-text" />
              </motion.span>
              <motion.span
                className="absolute inset-0 grid place-items-center"
                animate={{
                  rotate: theme === "dark" ? -90 : 0,
                  opacity: theme === "dark" ? 0 : 1,
                  scale: theme === "dark" ? 0.4 : 1,
                }}
                transition={{ duration: reduce ? 0 : 0.35 }}
              >
                <Sun className="w-5 h-5 text-text" />
              </motion.span>
            </span>
          </button>

          <button
            type="button"
            onClick={onSaveExit}
            className="inline-flex items-center gap-2 h-11 px-4 sm:px-5 rounded-pill border border-border-input text-[14px] font-semibold text-text transition-colors hover:bg-surface-alt"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Save &amp; exit</span>
            <span className="sm:hidden">Save</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function AssessmentFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface-alt">
      <div className="container-x py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[36ch]">
            <p className="font-fraunces text-[17px] font-semibold text-text">{brand.name}</p>
            <p className="fs-micro mt-1">Clinical Nutrition &amp; Gut Health</p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={`tel:${brand.phoneRaw}`}
              className="inline-flex items-center gap-2.5 min-h-[44px] text-[15px] font-semibold text-text transition-colors hover:text-accent-contrast"
            >
              <Phone className="w-4 h-4 text-accent-contrast shrink-0" aria-hidden="true" />
              {brand.phone}
            </a>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-accent-contrast shrink-0 mt-1" aria-hidden="true" />
              <ul className="list-none p-0 m-0 flex flex-col gap-1">
                {locations.map((loc) => (
                  <li key={loc.label} className="fs-micro">
                    {loc.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
          <Info className="w-4 h-4 text-text-muted shrink-0 mt-0.5" aria-hidden="true" />
          <p className="fs-micro max-w-[92ch]">
            Nutrition and lifestyle guidance provided by GoRebalance is intended to support, not
            replace, medical care. It is not a diagnosis or a prescription. Always consult your
            physician regarding medical conditions, medications and before making changes to
            prescribed treatment.
          </p>
        </div>
      </div>
    </footer>
  );
}
