import { Link, useSearch } from "@tanstack/react-router";
import * as React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Collapsible from "@radix-ui/react-collapsible";
import { CheckCircle2, Plus, Clock, Video, Dot, ArrowRight } from "lucide-react";
import { treatments as fallbackTreatments } from "@/data/content";
import { fetchPublished } from "@/lib/cms-public";
import { toIconComponent } from "@/lib/icons";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

import { FilterBar } from "@/components/shared/FilterBar";
import type { Treatment } from "@/types/content";

const CATEGORIES = [
  "All Programs",
  "Gut & Digestion",
  "Hormonal",
  "Metabolic",
  "Skin & Immunity",
  "Preventive",
];

export function ProgramsGrid() {
  const [activeTab, setActiveTab] = useState("All Programs");
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  /*
   * Read the programs the practice has published, falling back to the static
   * copy. Testimonials and the gallery already did this; treatments did not,
   * so anything edited, reordered or unpublished in the admin never reached
   * this page -- the manager appeared to work and changed nothing.
   */
  const [treatments, setTreatments] = useState<Treatment[]>([...fallbackTreatments]);
  useEffect(() => {
    let live = true;
    void fetchPublished<Treatment>("treatments", fallbackTreatments).then((rows) => {
      if (live && rows.length) setTreatments(rows);
    });
    return () => {
      live = false;
    };
  }, []);

  const filteredPrograms = useMemo(() => {
    if (activeTab === "All Programs") return treatments;
    return treatments.filter((t) => t.category === activeTab);
  }, [activeTab, treatments]);

  /*
   * Open the card named by ?program=<slug> and bring it into view. This is
   * where the home-page cards and the footer's Programs links now point;
   * they previously pointed at /treatments/<slug>, which 404'd.
   */
  const { program: requested } = useSearch({ from: "/treatments" });
  const handledRequest = useRef<string | null>(null);
  useEffect(() => {
    if (!requested || handledRequest.current === requested) return;
    const match = treatments.find((t) => t.slug === requested);
    if (!match) return;
    handledRequest.current = requested;
    setOpenCardId(match.id);
    // Wait a frame for the card to expand before scrolling to it.
    const timer = setTimeout(() => {
      document
        .getElementById(`program-${match.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 260);
    return () => clearTimeout(timer);
  }, [requested, treatments]);

  return (
    <SectionWrapper
      texture="contour"
      arc="left"
      id="programs"
      bg="base"
      labelledBy="programs-heading"
    >
      {/* Decorative Glow */}
      <div
        className="absolute left-0 top-0 w-[620px] h-[620px] bg-primary/4 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      />

      <div className="mb-16 lg:mb-12">
        <SectionHeading
          align="center"
          eyebrow="WHAT WE TREAT"
          title="Find where your symptoms *actually* start."
          subtitle="Expand any program to see the conditions it covers, what the plan involves and a realistic timeline. If more than one sounds like you, that's common — the assessment will identify the primary driver."
        />
      </div>

      <FilterBar
        categories={CATEGORIES}
        activeCategory={activeTab}
        onCategoryChange={setActiveTab}
      />

      {/*
        One stacked column on phones, two from lg.

        This used to be an auto-scrolling rail on phones and a grid above it —
        two separate trees rendering the same card. The rail was the problem:
        these cards EXPAND, so the thing a visitor is reading would slide out
        from under their thumb, and a card only ever showed at 84vw meaning
        the one either side was always half-cut. Stacking them costs vertical
        space and gains a list you can actually read.
      */}
      <div
        role="tabpanel"
        aria-live="polite"
        className="mt-8 grid grid-cols-1 items-stretch gap-4 sm:gap-5 lg:mt-10 lg:grid-cols-2 lg:gap-6 xl:gap-7"
      >
        <AnimatePresence mode="popLayout">
          {filteredPrograms.map((program, idx) => (
            <Reveal key={program.id} delay={idx * 0.08}>
              <ProgramCard
                program={program}
                isOpen={openCardId === program.id}
                onToggle={() => setOpenCardId(openCardId === program.id ? null : program.id)}
              />
            </Reveal>
          ))}
        </AnimatePresence>
      </div>

      <div className="sr-only">{filteredPrograms.length} programs shown</div>
    </SectionWrapper>
  );
}

function ProgramCard({
  program,
  isOpen,
  onToggle,
}: {
  program: Treatment;
  isOpen: boolean;
  onToggle: () => void;
}) {
  // The static fallback carries the component itself; a record loaded from
  // Firestore carries its name, because a function cannot be stored.
  const Icon = toIconComponent(program.icon);

  return (
    <Collapsible.Root
      id={`program-${program.id}`}
      open={isOpen}
      onOpenChange={onToggle}
      className={cn(
        "group relative flex flex-col bg-surface border border-border rounded-[26px] overflow-hidden transition-all duration-350",
        !isOpen && "surface-raise hover:border-primary/35",
      )}
    >
      {/* Accent Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] bg-accent origin-left transition-transform duration-350 z-10"
        style={{
          transform: isOpen ? "scaleX(1)" : "scaleX(0)",
          borderTopLeftRadius: "26px",
          borderTopRightRadius: "26px",
        }}
      />
      {!isOpen && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-350 z-10" />
      )}

      {/* Collapsed View */}
      <div className="p-[28px_24px] sm:p-[34px_32px] flex flex-col h-full">
        <div className="flex justify-between items-start gap-4 mb-6">
          <div
            className={cn(
              "w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-[17px] bg-primary-soft flex items-center justify-center transition-colors duration-350",
              !isOpen && "group-hover:bg-primary",
            )}
          >
            <Icon
              className={cn(
                "w-6 h-6 sm:w-[26px] sm:h-[26px] text-primary transition-colors duration-350",
                !isOpen && "group-hover:text-white",
              )}
            />
          </div>
          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-primary bg-primary-soft px-2.5 py-1 rounded-full">
            {program.category}
          </span>
        </div>

        <h3 className="font-fraunces font-medium text-[clamp(1.25rem,1.9vw,1.5rem)] text-text leading-[1.3] mb-3">
          {program.title}
        </h3>

        <p className="text-[15px] leading-[1.7] text-text-muted mb-5.5">{program.summary}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {program.tags.slice(0, 4).map((tag: string) => (
            <span
              key={tag}
              className="text-[12.5px] font-medium text-text-muted bg-surface-alt border border-border px-3 py-1.5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {program.tags.length > 4 && (
            <span className="text-[12.5px] font-medium text-accent-contrast bg-surface-alt border border-border px-3 py-1.5 rounded-full">
              +{program.tags.length - 4} more
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-5 pt-5 border-t border-border mt-auto">
          <div className="inline-flex items-center gap-1.75 text-[13px] text-text-muted">
            <Clock className="w-[15px] h-[15px] text-accent" />
            {program.timeline.split(".")[0]}
          </div>
          <div className="inline-flex items-center gap-1.75 text-[13px] text-text-muted">
            <Video className="w-[15px] h-[15px] text-accent" />
            In-clinic & online
          </div>
        </div>

        <Collapsible.Trigger asChild>
          <button
            className={cn(
              "mt-[22px] w-full h-12 rounded-full font-semibold text-[14.5px] inline-flex items-center justify-center gap-2 transition-all duration-300",
              isOpen
                ? "bg-primary-strong text-on-primary"
                : "bg-primary-soft text-primary hover:bg-primary-strong hover:text-on-primary",
            )}
            aria-expanded={isOpen}
            aria-controls={`content-${program.id}`}
          >
            {isOpen ? "Show less" : "See what's included"}
            <Plus
              className={cn(
                "w-[17px] h-[17px] transition-transform duration-350",
                isOpen && "rotate-[135deg]",
              )}
            />
          </button>
        </Collapsible.Trigger>
      </div>

      {/* Expanded Content */}
      <Collapsible.Content
        id={`content-${program.id}`}
        className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up"
      >
        <div className="px-6 pb-7 sm:px-8 sm:pb-8 pt-0">
          <div className="w-full h-px bg-border mb-6.5" />

          <div className="flex flex-col gap-6.5">
            {/* Conditions */}
            <div>
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-muted mb-3.5">
                CONDITIONS COVERED
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 list-none p-0 m-0">
                {program.conditions.map((item: string) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-[15px] h-[15px] text-primary mt-0.75 flex-shrink-0" />
                    <span className="text-[14.5px] text-text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Involves */}
            <div>
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-muted mb-3.5">
                WHAT THE PLAN INVOLVES
              </h4>
              <div className="flex flex-col gap-2.5">
                {program.involves.map((item: string) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <ArrowRight className="w-[14px] h-[14px] text-accent mt-1 flex-shrink-0" />
                    <span className="text-[14.5px] leading-[1.65] text-text-muted">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-muted mb-3.5">
                REALISTIC TIMELINE
              </h4>
              <div className="bg-surface-alt border border-border rounded-2xl p-[16px_18px] flex items-start gap-3">
                <Clock className="w-4 h-4 text-accent mt-0.75 flex-shrink-0" />
                <p className="text-[14.5px] leading-[1.65] text-text-muted">{program.timeline}</p>
              </div>
            </div>

            <div className="mt-1">
              <Link
                to={`/assessment?program=${program.slug}`}
                className="w-full sm:max-w-[300px] h-[50px] rounded-full bg-accent-strong text-on-accent font-semibold text-[14.5px] inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(var(--accent-rgb), 0.3)]"
              >
                Start With This Program
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
