import * as React from "react";
import { ArrowRight, MessageCircleQuestion, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { Reveal } from "@/components/shared/Reveal";
import { briefFaqs, briefFaqCopy, briefBrand } from "@/data/content";
import { HOME_SECTION_IMAGES } from "@/data/images";

/**
 * Section 12 — Frequently Asked Questions.
 *
 * An accordion, because the brief asks for one and because ten open answers
 * would add roughly two screens to a page that is already long. Closed, the
 * ten questions are a scannable list of exactly the things people want to
 * know before they commit.
 *
 * The answers are the brief's own words. Several of them exist specifically
 * to set a limit — what happens if a concern needs a doctor, whether
 * supplements are automatic, whether results are guaranteed — and softening
 * any of those to sound more encouraging would undo the point of including
 * them.
 */
interface BriefFaqProps {
  /** Show only these questions, in this order. Defaults to all of them. */
  ids?: string[];
  bg?: "base" | "alt" | "surface";
}

export function BriefFaq({ ids, bg = "base" }: BriefFaqProps = {}) {
  const items = ids ? ids.flatMap((id) => briefFaqs.filter((faq) => faq.id === id)) : briefFaqs;
  const image = HOME_SECTION_IMAGES.faq;

  return (
    <SectionWrapper id="faq" bg={bg} labelledBy="faq-heading" texture="weave" sticky>
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16 xl:gap-20">
        {/* ---- heading column ---- */}
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <Reveal>
            <p className="fs-eyebrow mb-5 text-primary-contrast">{briefFaqCopy.eyebrow}</p>
            <h2 id="faq-heading" className="fs-h2 mb-5 text-text">
              {briefFaqCopy.title.split(/(\*[^*]+\*)/g).map((part, i) =>
                part.startsWith("*") && part.endsWith("*") ? (
                  <span key={i} className="italic text-accent-contrast">
                    {part.slice(1, -1)}
                  </span>
                ) : (
                  <React.Fragment key={i}>{part}</React.Fragment>
                ),
              )}
            </h2>
            <p className="fs-sub max-w-[42ch]">{briefFaqCopy.subtitle}</p>
          </Reveal>

          {/* The column runs short against ten accordion rows, so it carries a
              picture of the thing most of these questions are actually about:
              ordinary cooking, in an ordinary kitchen. */}
          <Reveal delay={0.1}>
            <figure className="mt-10 hidden max-w-[420px] overflow-hidden rounded-[24px] border border-border bg-surface-alt shadow-[0_18px_44px_rgba(var(--shadow-rgb),0.1)] lg:block">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                width={900}
                height={585}
                className="block aspect-[4/2.6] w-full object-cover"
              />
            </figure>
          </Reveal>
        </div>

        {/* ---- accordion ---- */}
        <div className="min-w-0">
          <AccordionPrimitive.Root type="single" collapsible className="w-full">
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              <Reveal stagger={0.05} childAs="li">
                {items.map((faq) => (
                  <AccordionPrimitive.Item
                    key={faq.id}
                    value={faq.id}
                    className="group overflow-hidden rounded-[20px] border border-border bg-surface transition-colors duration-300 data-[state=open]:border-primary/35"
                  >
                    <AccordionPrimitive.Header className="m-0">
                      <AccordionPrimitive.Trigger className="flex w-full items-center justify-between gap-5 p-[20px_22px] text-left transition-colors duration-200 hover:bg-surface-alt/60 sm:p-[22px_26px]">
                        <span className="font-jakarta text-[15px] font-semibold leading-[1.45] text-text sm:text-[15.5px]">
                          {faq.question}
                        </span>
                        <span
                          aria-hidden="true"
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-primary transition-transform duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:border-primary/40"
                        >
                          <Plus className="h-[15px] w-[15px]" />
                        </span>
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>

                    <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                      <p className="m-0 max-w-[62ch] p-[0_22px_22px] font-jakarta text-[14.5px] leading-[1.7] text-text-muted sm:p-[0_26px_26px]">
                        {faq.answer}
                      </p>
                    </AccordionPrimitive.Content>
                  </AccordionPrimitive.Item>
                ))}
              </Reveal>
            </ul>
          </AccordionPrimitive.Root>

          <Reveal delay={0.1}>
            <div className="mt-6 flex flex-col gap-5 rounded-[22px] border border-[rgba(var(--primary-rgb),0.22)] bg-primary-soft p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-surface"
                >
                  <MessageCircleQuestion className="h-5 w-5 text-primary" />
                </span>
                <div className="min-w-0">
                  <p className="font-fraunces text-[17px] font-medium text-text">
                    {briefFaqCopy.helpTitle}
                  </p>
                  <p className="mt-1 font-jakarta text-[14px] leading-[1.6] text-primary-contrast">
                    {briefFaqCopy.helpBody}
                  </p>
                </div>
              </div>
              <Link
                to="/assessment"
                className="press group inline-flex h-[48px] shrink-0 items-center justify-center gap-2 rounded-pill bg-accent-strong px-6 text-[14px] font-semibold text-on-accent"
              >
                {briefBrand.primaryCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
