import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, MessageCircle, HeartPulse, FileText, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { contactMethods } from "@/data/content";
import { AutoScroller } from "@/components/shared/AutoScroller";

export const ContactMethods = () => {
  return (
    <SectionWrapper id="contact-methods" bg="base" className="pb-contact relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[560px] h-[560px] bg-primary/4 blur-[150px] -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <SectionHeading
        eyebrow="REACH US"
        title="Pick whichever is *easiest*."
        subtitle="All three reach the same clinic. WhatsApp is usually fastest."
        align="center"
        className="mb-12 md:mb-10"
      />

      <div className="md:hidden -mx-5 px-5">
        <AutoScroller
          label="Ways to reach the clinic"
          speed={22}
          gap="14px"
          itemWidth="min(78vw, 320px)"
        >
          {contactMethods.map((method) => (
            <a
              key={method.id}
              href={method.href}
              target={method.id === "whatsapp" ? "_blank" : undefined}
              rel={method.id === "whatsapp" ? "noopener noreferrer" : undefined}
              className="group relative flex flex-col items-center text-center p-8 md:p-[26px_22px] lg:p-[32px_28px] bg-surface border border-border rounded-[22px] transition-all duration-300 hover:-translate-y-[5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-[3px] overflow-hidden"
              style={
                {
                  "--method-color": method.color,
                } as React.CSSProperties
              }
              aria-label={`${method.type}: ${method.value}`}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 w-full h-[3px] bg-[var(--method-color)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{ borderRadius: "22px 22px 0 0" }}
              />

              {/* Icon Square */}
              <div className="w-[58px] h-[58px] rounded-[17px] grid place-items-center mb-[22px] transition-colors duration-300 bg-primary-soft group-hover:bg-[var(--method-color)]">
                <method.icon className="w-[26px] h-[26px] transition-colors duration-300 text-primary group-hover:text-white" />
              </div>

              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-2.5">
                {method.label}
              </span>

              <span className="font-fraunces font-medium text-[clamp(1.0625rem,1.5vw,1.1875rem)] text-text leading-[1.35] mb-2.5 break-words w-full">
                {method.value}
              </span>

              <p className="text-[13.5px] text-text-muted leading-[1.55] flex-grow">
                {method.subLine}
              </p>

              <div
                className="mt-5 inline-flex items-center justify-center gap-[7px] text-sm font-semibold transition-colors duration-300 text-primary group-hover:text-accent"
                style={{ color: method.id === "whatsapp" ? "var(--whatsapp)" : undefined }}
              >
                {method.action}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>

              <style>{`
              .group:hover {
                border-color: color-mix(in srgb, var(--method-color), transparent 65%) !important;
                box-shadow: 0 16px 40px rgba(var(--primary-rgb), 0.10);
              }
            `}</style>
            </a>
          ))}
        </AutoScroller>
      </div>

      <div className="hidden md:grid md:grid-cols-3 md:gap-[18px] lg:gap-6 items-stretch">
        {contactMethods.map((method) => (
          <a
            key={method.id}
            href={method.href}
            target={method.id === "whatsapp" ? "_blank" : undefined}
            rel={method.id === "whatsapp" ? "noopener noreferrer" : undefined}
            className="group relative flex flex-col items-center text-center p-8 md:p-[26px_22px] lg:p-[32px_28px] bg-surface border border-border rounded-[22px] transition-all duration-300 hover:-translate-y-[5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-[3px] overflow-hidden"
            style={
              {
                "--method-color": method.color,
              } as React.CSSProperties
            }
            aria-label={`${method.type}: ${method.value}`}
          >
            {/* Top accent bar */}
            <div
              className="absolute top-0 left-0 w-full h-[3px] bg-[var(--method-color)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
              style={{ borderRadius: "22px 22px 0 0" }}
            />

            {/* Icon Square */}
            <div className="w-[58px] h-[58px] rounded-[17px] grid place-items-center mb-[22px] transition-colors duration-300 bg-primary-soft group-hover:bg-[var(--method-color)]">
              <method.icon className="w-[26px] h-[26px] transition-colors duration-300 text-primary group-hover:text-white" />
            </div>

            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-2.5">
              {method.label}
            </span>

            <span className="font-fraunces font-medium text-[clamp(1.0625rem,1.5vw,1.1875rem)] text-text leading-[1.35] mb-2.5 break-words w-full">
              {method.value}
            </span>

            <p className="text-[13.5px] text-text-muted leading-[1.55] flex-grow">
              {method.subLine}
            </p>

            <div
              className="mt-5 inline-flex items-center justify-center gap-[7px] text-sm font-semibold transition-colors duration-300 text-primary group-hover:text-accent"
              style={{ color: method.id === "whatsapp" ? "var(--whatsapp)" : undefined }}
            >
              {method.action}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>

            <style>{`
              .group:hover {
                border-color: color-mix(in srgb, var(--method-color), transparent 65%) !important;
                box-shadow: 0 16px 40px rgba(var(--primary-rgb), 0.10);
              }
            `}</style>
          </a>
        ))}
      </div>

      {/* Glass Strip CTA */}
      <div className="mt-8 mx-auto max-w-[720px]">
        <div className="bg-surface/70 backdrop-blur-[16px] border border-border rounded-[18px] p-[18px_24px] flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-[14px]">
          <Zap className="w-5 h-5 text-accent shrink-0" />
          <p className="text-sm text-text-muted">
            Already decided to begin? Skip the enquiry and go straight to the assessment.{" "}
            <Link
              to="/assessment"
              className="font-semibold text-primary hover:text-accent transition-colors relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-accent after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
            >
              Start assessment &rarr;
            </Link>
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
};
