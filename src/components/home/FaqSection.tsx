import * as React from "react";
import { Plus, MessageCircle, MessageCircleQuestion, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { faqs, brand } from "@/data/content";
import { cn } from "@/lib/utils";

export function FaqSection() {
  // Generate JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <SectionWrapper arc="right" id="faq" bg="base" labelledBy="faq-heading" className="relative">
      {/* Decorative Glow */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[560px] h-[560px] bg-primary/4 rounded-full blur-[140px] -z-10 pointer-events-none"
      />

      <div className="container-x relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 xl:gap-24 items-start">
          {/* Left Column: Sticky Heading Block */}
          <div className="lg:sticky lg:top-[120px] lg:self-start">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="COMMON QUESTIONS"
                title="Everything you're *wondering*."
                subtitle="The questions clients ask before they begin — answered plainly, with no sales pitch attached."
                className="mb-0"
              />
            </Reveal>

            {/* Help Card */}
            <Reveal delay={0.1}>
              <div className="mt-10 p-[28px_26px] lg:p-[28px_26px] p-[24px_22px] bg-surface border border-border rounded-[24px] max-w-[420px]">
                <div className="w-[48px] h-[48px] rounded-[14px] bg-primary-soft flex items-center justify-center mb-5">
                  <MessageCircleQuestion className="w-[22px] h-[22px] text-primary" />
                </div>

                <h3 className="font-fraunces font-medium text-[clamp(1.0625rem,1.4vw,1.1875rem)] text-text mb-2">
                  Still have a question?
                </h3>

                <p className="text-[14px] leading-[1.6] text-text-muted mb-6">
                  Message us directly. You'll get a real answer from the clinic, not an automated
                  reply.
                </p>

                <a
                  href={brand.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-[10px] w-full h-[50px] rounded-full bg-[var(--whatsapp)] text-[var(--on-whatsapp)] text-[15px] font-semibold transition-all duration-300 hover:brightness-105 hover:-translate-y-[2px] hover:shadow-[0_10px_26px_rgba(var(--whatsapp-rgb), 0.28)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-[3px]"
                >
                  <MessageCircle className="w-[18px] h-[18px]" />
                  Chat on WhatsApp
                </a>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-[12.5px] text-text-muted">
                  <Clock className="w-[13px] h-[13px]" />
                  Typically replies within a few hours
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Accordion */}
          <div className="w-full">
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-[14px] sm:space-y-[14px] space-y-[12px]"
            >
              {faqs.map((faq, index) => (
                <Reveal key={faq.id} delay={index * 0.06}>
                  <AccordionItem
                    value={faq.id}
                    className="group border border-border bg-surface rounded-[20px] overflow-hidden transition-all duration-300 data-[state=open]:border-primary/35 data-[state=open]:shadow-[0_8px_28px_rgba(var(--primary-rgb), 0.07)] dark:data-[state=open]:shadow-[0_8px_28px_rgba(var(--shadow-rgb), 0.28)] relative"
                    style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                  >
                    {/* Left Accent Bar */}
                    <div
                      className="absolute top-0 bottom-0 left-0 w-[3px] bg-accent origin-top scale-y-0 transition-transform duration-[350ms] group-data-[state=open]:scale-y-100 z-20 pointer-events-none rounded-l-[20px]"
                      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                    />

                    <AccordionTrigger className="w-full p-[22px_26px] sm:p-[20px_20px] p-[18px_16px] hover:no-underline hover:bg-surface-alt/60 transition-colors duration-[250ms] flex items-center justify-between gap-5 text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-[3px] focus-visible:rounded-[20px]">
                      <span className="text-[15px] sm:text-[15.5px] lg:text-[16px] font-semibold text-text leading-[1.45] font-jakarta group-hover:text-primary transition-colors">
                        {faq.question}
                      </span>

                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center transition-all duration-[350ms] group-data-[state=open]:bg-primary group-data-[state=open]:rotate-[135deg] group-hover:bg-primary-soft/80"
                        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                      >
                        <Plus
                          className="w-4 h-4 text-primary transition-colors duration-[350ms] group-data-[state=open]:text-white"
                          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                        />
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="p-[0_26px_24px_26px] sm:p-[0_20px_22px_20px] p-[0_16px_20px_16px]">
                      {/* Divider */}
                      <div className="h-[1px] bg-border w-full mb-[18px]" />

                      <div className="text-[14.5px] sm:text-[15px] leading-[1.75] text-text-muted max-w-[62ch] animate-in fade-in slide-in-from-top-1 duration-300 delay-75">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Reveal>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </SectionWrapper>
  );
}
