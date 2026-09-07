import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ClipboardList, CreditCard, HeartPulse, Salad } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssessmentStep } from "@/context/AssessmentContext";

/**
 * The four numbered stages, in order.
 *
 * "review" and "complete" are deliberately absent: they are not stages a
 * visitor fills in, and counting them would make the form look longer than it
 * is at exactly the moment someone is deciding whether to start it. They match
 * the "Step N of 4" eyebrows the step components already print.
 */
const STAGES: { key: AssessmentStep; label: string; hint: string; icon: LucideIcon }[] = [
  {
    key: "details",
    label: "About you",
    hint: "Name, age and how to reach you",
    icon: ClipboardList,
  },
  { key: "payment", label: "Consultation", hint: "Choose a plan and confirm", icon: CreditCard },
  {
    key: "health",
    label: "Your health",
    hint: "History, symptoms and medication",
    icon: HeartPulse,
  },
  { key: "nutrition", label: "Your food", hint: "A day of eating, habits and sleep", icon: Salad },
];

type State = "done" | "current" | "todo";

function stateOf(index: number, currentIndex: number, completed: AssessmentStep[]): State {
  if (index === currentIndex) return "current";
  if (completed.includes(STAGES[index]!.key)) return "done";
  return index < currentIndex ? "done" : "todo";
}

/**
 * Where you are in the assessment.
 *
 * The form previously said "Step 1 of 4" in small caps and nothing else. That
 * is information, but it is not reassurance: someone halfway through a
 * clinical form wants to see how much is left and that what they have already
 * done is banked.
 *
 * Two presentations of the same state, because the shape of the answer
 * depends on the room:
 *
 *   - From lg the desktop layout has a wide empty left margin, so the stepper
 *     is VERTICAL and sticky there — four named stages with a connector that
 *     fills as you go. It costs no content width at all.
 *   - Below lg there is no such margin, so it collapses to a single row of
 *     segments above the form.
 */
export function StepProgress({
  currentStep,
  completedSteps,
  onJump,
  className,
}: {
  currentStep: AssessmentStep;
  completedSteps: AssessmentStep[];
  /** Go back to an earlier stage. Forward jumps are refused by the context. */
  onJump?: (step: AssessmentStep) => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const currentIndex = STAGES.findIndex((s) => s.key === currentStep);

  // "review" and "complete" sit past the last numbered stage.
  const effectiveIndex = currentIndex === -1 ? STAGES.length : currentIndex;
  const doneCount = STAGES.filter((s, i) =>
    i === effectiveIndex ? false : completedSteps.includes(s.key) || i < effectiveIndex,
  ).length;
  const progress = Math.min(1, doneCount / (STAGES.length - 1 || 1));

  return (
    <>
      {/* ---------- vertical, from lg ---------- */}
      <nav
        aria-label="Assessment progress"
        className={cn("hidden lg:block", className)}
        data-testid="step-progress-vertical"
      >
        <p className="fs-eyebrow mb-6 text-text-muted">Your assessment</p>

        <ol className="relative m-0 list-none p-0">
          {/* The rail, and the part of it already travelled. */}
          <span
            aria-hidden="true"
            className="absolute left-[19px] top-[19px] w-[2px] rounded-full bg-border"
            style={{ height: `calc(100% - 38px)` }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute left-[19px] top-[19px] w-[2px] origin-top rounded-full bg-primary"
            style={{ height: `calc(100% - 38px)` }}
            initial={reduce ? false : { scaleY: 0 }}
            animate={{ scaleY: progress }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 0.84, 0.24, 1] }}
          />

          {STAGES.map((stage, i) => {
            const state = stateOf(i, effectiveIndex, completedSteps);
            const Icon = stage.icon;
            const reachable = state === "done" && onJump;
            const Row = reachable ? "button" : "div";

            return (
              <li key={stage.key} className="relative pb-7 last:pb-0">
                <Row
                  {...(reachable
                    ? { type: "button" as const, onClick: () => onJump(stage.key) }
                    : {})}
                  aria-current={state === "current" ? "step" : undefined}
                  className={cn(
                    "flex w-full items-start gap-4 text-left",
                    reachable && "group cursor-pointer",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition-colors duration-300",
                      state === "done" && "border-primary bg-primary text-on-primary",
                      state === "current" && "border-primary bg-surface text-primary-contrast",
                      state === "todo" && "border-border bg-surface text-text-muted",
                    )}
                  >
                    {state === "done" ? (
                      <Check className="h-[18px] w-[18px]" strokeWidth={3} />
                    ) : (
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                    )}
                  </span>

                  <span className="min-w-0 pt-1.5">
                    <span
                      className={cn(
                        "block text-[11px] font-semibold uppercase tracking-[0.12em]",
                        state === "current" ? "text-accent-contrast" : "text-text-muted",
                      )}
                    >
                      Step {i + 1}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 block font-jakarta text-[15px] font-semibold leading-snug transition-colors",
                        state === "todo" ? "text-text-muted" : "text-text",
                        reachable && "group-hover:text-primary-contrast",
                      )}
                    >
                      {stage.label}
                    </span>
                    {state === "current" && (
                      <span className="mt-1 block text-[12.5px] leading-snug text-text-muted">
                        {stage.hint}
                      </span>
                    )}
                  </span>
                </Row>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ---------- compact, below lg ---------- */}
      <div className={cn("lg:hidden", className)} data-testid="step-progress-compact">
        <div className="mb-2.5 flex items-baseline justify-between gap-3">
          <p className="fs-eyebrow text-accent-contrast">
            Step {Math.min(effectiveIndex + 1, STAGES.length)} of {STAGES.length}
          </p>
          <p className="text-[12.5px] font-medium text-text-muted">
            {STAGES[Math.min(effectiveIndex, STAGES.length - 1)]?.label}
          </p>
        </div>
        <ol
          className="m-0 flex list-none gap-1.5 p-0"
          aria-label={`Step ${effectiveIndex + 1} of ${STAGES.length}`}
        >
          {STAGES.map((stage, i) => {
            const state = stateOf(i, effectiveIndex, completedSteps);
            return (
              <li key={stage.key} className="h-[5px] flex-1 overflow-hidden rounded-full bg-border">
                <motion.span
                  className="block h-full rounded-full bg-primary"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: state === "todo" ? 0 : 1 }}
                  style={{ originX: 0 }}
                  transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 0.84, 0.24, 1] }}
                />
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
