import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, MessageCircle, MessageCircleQuestion } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CurveDivider } from "@/components/shared/CurveDivider";
import { Reveal } from "@/components/shared/Reveal";
import { brand, treatmentsFaqs, treatmentsFaqCopy } from "@/data/content";

export function TreatmentsFaq() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: treatmentsFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <CurveDivider fill="alt" />
      <SectionWrapper
        texture="contour"
        arc="right"
        id="treatments-faq"
        bg="alt"
        labelledBy="treatments-faq-heading"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <div
          className="absolute left-0 top-0 w-[520px] h-[520px] rounded-full bg-accent/[0.04] blur-[140px] -translate-x-1/3 -translate-y-1/3 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-[860px] mx-auto">
          <SectionHeading
            align="center"
            eyebrow={treatmentsFaqCopy.eyebrow}
            title={treatmentsFaqCopy.title}
            subtitle={treatmentsFaqCopy.subtitle}
            className="mb-11 md:mb-14"
          />

          <AccordionPrimitive.Root type="single" collapsible className="w-full">
            {treatmentsFaqs.map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.05}>
                <AccordionPrimitive.Item
                  value={faq.id}
                  className="group mb-3 overflow-hidden rounded-[18px] border border-border bg-surface transition-[background-color,border-color,box-shadow] duration-[250ms] hover:bg-primary-soft/45 data-[state=open]:bg-surface data-[state=open]:border-primary/35 data-[state=open]:shadow-[0_8px_26px_rgba(var(--primary-rgb), 0.07)] dark:data-[state=open]:shadow-[0_8px_26px_rgba(var(--shadow-rgb), 0.28)] motion-reduce:transition-none"
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="flex flex-1 items-center gap-4 text-left rounded-[18px] px-4 py-[18px] sm:px-5 sm:py-5 md:px-[26px] md:py-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-[3px] focus-visible:ring-offset-surface-alt">
                      <span
                        aria-hidden="true"
                        className="grid place-items-center w-[30px] h-[30px] shrink-0 rounded-full bg-primary-soft font-fraunces font-medium text-[13px] text-primary transition-colors duration-[250ms] group-hover:bg-primary-strong group-hover:text-on-primary group-data-[state=open]:bg-primary-strong group-data-[state=open]:text-on-primary motion-reduce:transition-none"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-[15px] sm:text-[15.5px] lg:text-[16px] font-semibold leading-[1.45] text-text transition-colors duration-[250ms] group-hover:text-primary motion-reduce:transition-none">
                        {faq.question}
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className="w-[18px] h-[18px] shrink-0 text-text-muted transition-transform duration-[350ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:rotate-180 motion-reduce:transition-none"
                      />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>

                  {/* Answer indent aligns with the question text: 26px padding + 30px circle + 16px gap = 72px */}
                  <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none">
                    <div className="pl-4 pr-4 pb-5 sm:pl-[71px] sm:pr-5 md:pl-[72px] md:pr-[26px] md:pb-6">
                      <div className="h-px w-full bg-border mb-[18px]" />
                      <p className="text-[14.5px] sm:text-[15px] leading-[1.75] text-text-muted max-w-[62ch] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1.5 motion-safe:duration-300 motion-safe:delay-[60ms] motion-safe:fill-mode-both">
                        {faq.answer}
                      </p>
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              </Reveal>
            ))}
          </AccordionPrimitive.Root>

          <Reveal delay={0.15}>
            <div className="mt-9 md:mt-11 rounded-[20px] border border-border bg-surface/70 backdrop-blur-[16px] px-5 py-[22px] md:px-[30px] md:py-[26px] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <span
                  aria-hidden="true"
                  className="grid place-items-center w-[46px] h-[46px] shrink-0 rounded-full bg-primary-soft"
                >
                  <MessageCircleQuestion className="w-[21px] h-[21px] text-primary" />
                </span>
                <div>
                  <h3 className="font-fraunces font-medium text-[clamp(1.0625rem,1.5vw,1.1875rem)] text-text">
                    {treatmentsFaqCopy.strip.title}
                  </h3>
                  <p className="text-[14px] text-text-muted mt-1.5">
                    {treatmentsFaqCopy.strip.body}
                  </p>
                </div>
              </div>

              {/* var(--whatsapp) used instead of var(--whatsapp) so white text passes contrast */}
              <a
                href={brand.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto h-[50px] px-[26px] rounded-full bg-[var(--whatsapp)] text-[var(--on-whatsapp)] text-[15px] font-semibold inline-flex items-center justify-center gap-[9px] transition-all duration-[250ms] hover:brightness-[1.06] hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(var(--whatsapp-rgb), 0.28)] motion-reduce:transition-none motion-reduce:transform-none"
              >
                <MessageCircle className="w-[18px] h-[18px]" aria-hidden="true" />
                {treatmentsFaqCopy.strip.ctaLabel}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </Reveal>
        </div>
      </SectionWrapper>
    </>
  );
}
