import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  body: string;
  /** Optional route to offer instead, so the section is never a dead end. */
  action?: { label: string; to: string };
  className?: string;
}

/**
 * What a section shows before the practice has published anything into it.
 *
 * The testimonials and gallery pages used to be filled with stand-in content:
 * fifteen invented client stories and a set of stock photographs captioned as
 * though they were the clinic. The brief rules both out, and rightly — an
 * invented client result on a health practice's site is not a placeholder, it
 * is a false claim.
 *
 * Deleting the pages would have been the wrong answer too, because the
 * practice does want them. So the pages stay and say honestly that there is
 * nothing here yet. The moment a real story or photograph is published through
 * the admin panel it replaces this, with no code change.
 *
 * It always offers somewhere to go. A visitor who reached this page was
 * looking for reassurance, and an empty room with no door is worse than no
 * room at all.
 */
export function EmptyState({ icon: Icon, title, body, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-[560px] flex-col items-center rounded-[26px] border border-dashed border-[rgba(var(--primary-rgb),0.3)] bg-surface px-7 py-12 text-center sm:px-10 sm:py-14",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="mb-6 grid h-[62px] w-[62px] place-items-center rounded-full bg-primary-soft"
      >
        <Icon className="h-[26px] w-[26px] text-primary" />
      </span>

      <h3 className="mb-3 font-fraunces text-[clamp(1.15rem,2.2vw,1.4rem)] font-medium leading-snug text-text">
        {title}
      </h3>

      <p className="max-w-[44ch] font-jakarta text-[14.5px] leading-[1.7] text-text-muted">
        {body}
      </p>

      {action && (
        <Link
          to={action.to}
          className="press group mt-8 inline-flex h-[50px] items-center justify-center gap-2 rounded-pill border border-[rgba(var(--primary-rgb),0.34)] bg-surface px-7 text-[14.5px] font-semibold text-primary-contrast transition-colors hover:bg-primary-soft"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
