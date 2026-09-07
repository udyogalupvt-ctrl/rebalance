import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Wind,
  Flame,
  Timer,
  BatteryLow,
  Scale,
  Sparkles,
  CalendarHeart,
  Candy,
  Check,
  ArrowRight,
  Lock,
  Clock,
  UserCheck,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { symptoms } from "@/data/content";
import { Link, useNavigate } from "@tanstack/react-router";

const STORAGE_KEY = "gr_selected_symptoms";

/**
 * The gut-symptom checklist.
 *
 * Rebuilt from a wall of eight small photo cards. Three problems with that
 * version, in order of severity:
 *
 *   1. Each card carried a stock photograph of food chosen at random — a
 *      plate of roast vegetables illustrating "irregular bowels", a market
 *      stall illustrating "brain fog". They carried no meaning and, at 76px
 *      tall inside a 4-up grid, no detail either.
 *   2. Squeezing an image, an icon, a heading, a paragraph and a checkbox
 *      into a quarter-width card left every element at its minimum size. The
 *      cards read as small because they *were* small.
 *   3. The same 90 lines of card markup existed twice — once inside an
 *      auto-scrolling rail for phones, once in a grid — so the two drifted.
 *
 * It is now one wide, horizontal tile in a two-column grid: circular icon,
 * then the symptom and its description, then the state. That is the shape of
 * a checklist, which is what this is, and it gives the type room to breathe.
 * One implementation, one set of behaviour, at every width.
 */
export function SymptomChecker() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Read after mount rather than in the initialiser: touching localStorage
  // during render is a side effect, and it makes the first paint depend on
  // storage that may be unavailable in private mode.
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setSelectedIds(parsed.filter((v) => typeof v === "string"));
      }
    } catch {
      /* private mode or corrupt value */
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    } catch {
      /* private mode */
    }
  }, [selectedIds]);

  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const clearAll = () => setSelectedIds([]);

  const n = selectedIds.length;

  const verdict =
    n === 0
      ? null
      : n <= 2
        ? {
            headline: `${n} early signal${n === 1 ? "" : "s"}.`,
            body: "Caught this early, these are very reversible with the right nutrition plan.",
          }
        : n <= 4
          ? {
              headline: `${n} signs — that's a pattern, not a coincidence.`,
              body: "These symptoms are usually connected. A root-cause assessment will show you how.",
            }
          : {
              headline: `${n} signs. Your gut has been asking for help for a while.`,
              body: "This is exactly what the GoRebalance protocol is built to unwind.",
            };

  return (
    <SectionWrapper
      texture="contour"
      arc="left"
      id="symptoms"
      bg="base"
      labelledBy="symptoms-heading"
    >
      <div className="relative z-10">
        <SectionHeading
          id="symptoms-heading"
          eyebrow="Signs your gut needs help"
          title="Bloated, tired, and told everything is *normal*?"
          subtitle="Tick everything you recognise. Most people live with these every day and assume it's stress, age or 'just how my body is'. It usually isn't."
          align="center"
        />

        {/* A live count, so the list reads as an instrument being used rather
            than a static grid of cards. */}
        <Reveal>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-[13px] font-semibold transition-colors duration-300",
                n > 0
                  ? "border-[rgba(var(--primary-rgb),0.32)] bg-primary-soft text-primary-contrast"
                  : "border-border bg-surface text-text-muted",
              )}
              aria-hidden="true"
            >
              <span className="tabular-nums">{n}</span> of {symptoms.length} selected
            </span>
            <AnimatePresence>
              {n > 0 && (
                <motion.button
                  type="button"
                  onClick={clearAll}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted underline-offset-4 hover:text-text hover:underline"
                >
                  <RotateCcw className="h-[13px] w-[13px]" aria-hidden="true" />
                  Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <div
          role="group"
          aria-labelledby="symptoms-heading"
          className="mx-auto grid max-w-[1000px] grid-cols-1 gap-3 md:grid-cols-2 md:gap-3.5"
        >
          <Reveal stagger={0.05}>
            {symptoms.map((symptom) => (
              <SymptomTile
                key={symptom.id}
                id={symptom.id}
                icon={symptom.icon as LucideIcon}
                label={symptom.label}
                detail={symptom.detail}
                selected={selectedIds.includes(symptom.id)}
                onToggle={() => toggle(symptom.id)}
                reduce={!!reduce}
              />
            ))}
          </Reveal>
        </div>

        {/* ---- outcome ---- */}
        <div className="mx-auto mt-8 max-w-[1000px] md:mt-10">
          <AnimatePresence initial={false} mode="wait">
            {verdict ? (
              <motion.div
                key="result"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: reduce ? 0.01 : 0.36, ease: [0.16, 0.84, 0.24, 1] }}
                className="overflow-hidden rounded-[22px] border border-[rgba(var(--primary-rgb),0.22)] bg-surface p-6 shadow-[0_14px_40px_rgba(var(--shadow-rgb),0.08)] md:p-7"
              >
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
                  <div className="min-w-0">
                    <p className="font-fraunces text-[19px] font-medium leading-snug text-text md:text-[21px]">
                      {verdict.headline}
                    </p>
                    <p className="mt-1.5 max-w-[54ch] text-[14.5px] leading-relaxed text-text-muted">
                      {verdict.body}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      navigate({ to: "/assessment", search: { symptoms: selectedIds.join(",") } })
                    }
                    className="press group inline-flex h-[54px] w-full shrink-0 items-center justify-center gap-2 rounded-pill bg-accent-strong px-8 text-[15.5px] font-semibold text-on-accent shadow-[0_10px_28px_rgba(var(--accent-rgb),0.28)] md:w-auto"
                  >
                    See What's Causing This
                    <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.01 : 0.3 }}
                className="flex flex-col items-center"
              >
                <p className="mb-4 text-[14px] text-text-muted">
                  Tick the ones you recognise — or skip straight ahead.
                </p>
                <Link
                  to="/assessment"
                  className="press group inline-flex h-[56px] items-center justify-center gap-2 rounded-pill bg-accent-strong px-9 text-[16px] font-semibold text-on-accent shadow-[0_10px_28px_rgba(var(--accent-rgb),0.28)]"
                >
                  Get My Personalised Assessment
                  <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ul className="mx-auto mt-9 flex max-w-[1000px] list-none flex-wrap justify-center gap-x-8 gap-y-3 p-0 text-[13px] text-text-muted">
          {[
            { icon: Lock, label: "100% confidential" },
            { icon: Clock, label: "Takes ~10 minutes" },
            { icon: UserCheck, label: "Reviewed personally by Dt. Sai Sowjanya" },
          ].map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="h-[14px] w-[14px] shrink-0 text-primary" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <div className="sr-only" aria-live="polite">
          {n} of {symptoms.length} symptoms selected.
        </div>
      </div>
    </SectionWrapper>
  );
}

function SymptomTile({
  id,
  icon: Icon,
  label,
  detail,
  selected,
  onToggle,
  reduce,
}: {
  id: string;
  icon: LucideIcon;
  label: string;
  detail: string;
  selected: boolean;
  onToggle: () => void;
  reduce: boolean;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      aria-describedby={`symptom-detail-${id}`}
      onClick={onToggle}
      className={cn(
        "group relative flex h-full w-full items-start gap-4 overflow-hidden rounded-[18px] border p-4 text-left",
        "transition-[background-color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,0.84,0.24,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "sm:gap-[18px] sm:p-[18px_20px]",
        selected
          ? "border-[rgba(var(--primary-rgb),0.5)] bg-primary-soft shadow-[0_10px_28px_rgba(var(--primary-rgb),0.14)]"
          : "border-border bg-surface hover:border-[rgba(var(--primary-rgb),0.3)] hover:shadow-[0_10px_28px_rgba(var(--shadow-rgb),0.07)] md:hover:-translate-y-[3px]",
      )}
    >
      {/* Selected state gets a solid brand edge, so a scan down the column
          shows what has been ticked without reading a word. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 w-[3px] origin-top bg-primary transition-transform duration-300",
          selected ? "scale-y-100" : "scale-y-0",
        )}
      />

      <span
        aria-hidden="true"
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-300 sm:h-12 sm:w-12",
          selected ? "bg-primary-strong" : "bg-primary-soft",
        )}
      >
        <Icon
          className={cn(
            "h-[21px] w-[21px] transition-transform duration-300",
            selected ? "text-on-primary" : "text-primary group-hover:scale-110",
          )}
          strokeWidth={1.75}
        />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block font-jakarta text-[15.5px] font-semibold leading-snug transition-colors duration-300 sm:text-[16.5px]",
            selected ? "text-primary-contrast" : "text-text",
          )}
        >
          {label}
        </span>
        <span
          id={`symptom-detail-${id}`}
          className="mt-1 block text-[13.5px] leading-relaxed text-text-muted"
        >
          {detail}
        </span>
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-300",
          selected
            ? "border-primary-strong bg-primary-strong"
            : "border-border-strong bg-transparent group-hover:border-primary",
        )}
      >
        <motion.span
          initial={false}
          animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 20 }}
          className="grid place-items-center"
        >
          <Check className="h-[13px] w-[13px] text-on-primary" strokeWidth={3} />
        </motion.span>
      </span>
    </button>
  );
}
