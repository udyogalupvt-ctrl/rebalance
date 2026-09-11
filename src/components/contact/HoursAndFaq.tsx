import React, { useMemo, useEffect, useState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CurveDivider } from "@/components/shared/CurveDivider";
import { Info, Plus } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

const getISTTime = () => {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

const HoursCard = () => {
  const [currentTime, setCurrentTime] = useState(getISTTime());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getISTTime()), 60000);
    return () => clearInterval(timer);
  }, []);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayIndex = currentTime.getDay();
  const currentDayName = days[currentDayIndex];

  const clinicHours = useMemo(
    () => [
      { day: "Monday", time: "10:00 AM – 7:00 PM" },
      { day: "Tuesday", time: "10:00 AM – 7:00 PM" },
      { day: "Wednesday", time: "10:00 AM – 7:00 PM" },
      { day: "Thursday", time: "10:00 AM – 7:00 PM" },
      { day: "Friday", time: "10:00 AM – 7:00 PM" },
      { day: "Saturday", time: "10:00 AM – 7:00 PM" },
      { day: "Sunday", time: "Closed" },
    ],
    [],
  );

  const status = useMemo(() => {
    const hour = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const timeVal = hour * 100 + minutes;

    const isSunday = currentDayIndex === 0;
    const isOpen = !isSunday && timeVal >= 1000 && timeVal < 1900;

    if (isOpen) {
      return {
        isOpen: true,
        text: "Open now · Closes at 7:00 PM",
        ariaText: "Clinic is currently open, closing at 7 PM",
      };
    } else {
      let nextOpen = "Monday at 10:00 AM";
      if (!isSunday && timeVal < 1000) {
        nextOpen = "today at 10:00 AM";
      } else if (currentDayIndex >= 1 && currentDayIndex < 6 && timeVal >= 1900) {
        nextOpen = "tomorrow at 10:00 AM";
      }
      return {
        isOpen: false,
        text: `Closed · Opens ${nextOpen}`,
        ariaText: `Clinic is currently closed, opening ${nextOpen}`,
      };
    }
  }, [currentTime, currentDayIndex]);

  return (
    <div className="relative overflow-hidden bg-surface border border-border rounded-[24px] p-[26px_22px] md:p-[32px_30px]">
      <div
        className="orb absolute top-0 right-0 w-[320px] h-[320px] translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />

      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-muted mb-2 block">
        CONSULTATION HOURS
      </span>
      <h3 className="font-fraunces text-[clamp(1.25rem,2vw,1.5rem)] font-medium text-text mb-6">
        When we're available.
      </h3>

      <dl className="flex flex-col">
        {clinicHours.map((item) => {
          const isToday = item.day === currentDayName;
          return (
            <div
              key={item.day}
              className={`flex justify-between items-center py-[13px] border-b border-border last:border-0 transition-all duration-300
                ${isToday ? "bg-primary-soft -mx-3 px-3 rounded-[10px]" : ""}`}
            >
              <dt
                className={`text-[14.5px] ${isToday ? "text-primary font-semibold" : "text-text font-medium"}`}
              >
                {item.day}
                {isToday && (
                  <span className="ml-2 text-[12px] font-semibold text-primary bg-surface py-[3px] px-[8px] rounded-full uppercase tracking-wider">
                    TODAY
                  </span>
                )}
              </dt>
              {/* "Closed" was set at text-text-muted/65 to play it down. At 65%
                  alpha it measured 2.94:1 on white against a required 4.5 (and
                  about 4.1:1 in dark), so the one line telling a visitor the
                  clinic is shut was the hardest line in the table to read.
                  It keeps the muted tone -- already a step below the day names,
                  which are text-text -- just at full strength. */}
              <dd className="text-[14.5px] tabular-nums text-text-muted">{item.time}</dd>
            </div>
          );
        })}
      </dl>

      <div
        className={`mt-[22px] inline-flex items-center gap-2 py-[9px] px-[15px] rounded-full text-[13.5px] font-semibold transition-colors duration-500
          ${status.isOpen ? "bg-green-500/10 text-[var(--success)] dark:text-[var(--success)]" : "bg-surface-alt text-text-muted"}`}
        aria-live="polite"
      >
        <span
          className={`w-[7px] h-[7px] rounded-full ${status.isOpen ? "bg-current animate-pulse" : "bg-current"}`}
        />
        {status.text}
      </div>

      <div className="mt-[22px] flex gap-2 text-[13px] text-text-muted leading-[1.6]">
        <Info className="w-[14px] h-[14px] shrink-0 mt-[2px]" />
        <p>
          Consultations are by appointment. Walk-ins can't be accommodated during booked sessions.
        </p>
      </div>
    </div>
  );
};

const FaqAccordion = () => {
  const faqItems = [
    {
      q: "How do I book a consultation?",
      a: "Complete the assessment form — it's the booking step. Once it's reviewed, you'll be contacted within 24 hours to confirm a slot at either clinic or online.",
    },
    {
      q: "What are the consultation fees?",
      a: "Fees depend on whether you're booking a single consultation or a full program, and are confirmed before anything is scheduled. Nothing is charged until you know exactly what your plan involves.",
    },
    {
      q: "Do you consult in languages other than English?",
      a: "Yes — consultations are conducted in English, Telugu and Hindi. Mention your preference in the assessment and it'll be arranged.",
    },
    {
      q: "Can I consult for a family member who isn't present?",
      a: "An initial discussion is fine, but the person being treated needs to attend their own consultation. Symptoms, history and food habits can't be accurately relayed second-hand.",
    },
    {
      q: "How quickly can I get an appointment?",
      a: "Usually within three to five working days, sometimes sooner. Urgent cases are accommodated where possible — mention it in your assessment.",
    },
  ];

  return (
    <div>
      <div className="mb-7">
        <Reveal>
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-muted">
            QUICK ANSWERS
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-fraunces text-[clamp(1.375rem,2.2vw,1.75rem)] font-medium text-text mt-3">
            Before you get in *touch*.
          </h2>
        </Reveal>
      </div>

      <Accordion.Root type="single" collapsible className="flex flex-col gap-[10px]">
        {faqItems.map((item, i) => (
          <Accordion.Item
            key={i}
            value={`item-${i}`}
            className="bg-surface border border-border rounded-[16px] overflow-hidden transition-all duration-300"
          >
            <Accordion.Header>
              <Accordion.Trigger className="w-full text-left p-[18px_22px] md:p-[16px_18px] flex justify-between items-center group">
                <span className="text-[15px] font-semibold text-text group-hover:text-primary transition-colors">
                  {item.q}
                </span>
                <div className="w-[28px] h-[28px] rounded-full bg-primary-soft flex items-center justify-center transition-transform duration-300 group-data-[state=open]:rotate-[135deg]">
                  <Plus className="w-[17px] h-[17px] text-primary" />
                </div>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
              <div className="px-[22px] pb-[20px]">
                <div className="pt-[16px] border-t border-border text-[14.5px] leading-[1.7] text-text-muted">
                  {item.a}
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        })}
      </script>
    </div>
  );
};

export const HoursAndFaq = () => {
  return (
    <>
      <CurveDivider fill="alt" />
      <SectionWrapper id="hours" bg="alt" labelledBy="hours-heading">
        <div className="grid lg:grid-cols-[4fr_6fr] gap-[56px] md:gap-[40px] items-start">
          <Reveal>
            <HoursCard />
          </Reveal>
          <Reveal delay={0.12}>
            <FaqAccordion />
          </Reveal>
        </div>
      </SectionWrapper>
    </>
  );
};
