import * as React from "react";
import { Award, BadgeCheck, GraduationCap, Microscope, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CardRail } from "@/components/shared/CardRail";
import { credentials, credentialsCopy } from "@/data/content";

const KIND_ICONS: Record<string, LucideIcon> = {
  degree: GraduationCap,
  certificate: Award,
  clinical: Stethoscope,
  specialism: Microscope,
};

interface CredentialsProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  bg?: "base" | "alt" | "surface";
  id?: string;
}

/**
 * Education & Credentials — the five qualifications, exactly as the practice
 * supplied them, each with its own one-line description.
 *
 * Five again, so the wide layout is three over two on a six-column grid rather
 * than a row of five slivers; on a phone it is a swipeable row. Shared by the
 * home page and the About page, which only change the heading.
 *
 * Nothing added: no years of experience, no client numbers, no awards.
 */
export function Credentials({
  eyebrow = credentialsCopy.eyebrow,
  title = credentialsCopy.title,
  subtitle = credentialsCopy.subtitle,
  bg = "alt",
  id = "credentials",
}: CredentialsProps) {
  return (
    <SectionWrapper id={id} bg={bg} labelledBy={`${id}-heading`}>
      <SectionHeading
        id={`${id}-heading`}
        align="center"
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
      />

      <CardRail
        count={credentials.length}
        label={eyebrow}
        wrapperClassName="mt-12"
        className="md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-6 lg:gap-6"
      >
        <Reveal
          stagger={0.06}
          childAs="li"
          childClassName="md:[&:nth-child(5)]:col-span-2 lg:[&:nth-child(-n+3)]:col-span-2 lg:[&:nth-child(n+4)]:col-span-3"
        >
          {credentials.map((item) => {
            const Icon = KIND_ICONS[item.kind] ?? GraduationCap;
            return (
              <article
                key={item.title}
                className="relative flex flex-col rounded-[24px] border border-border bg-surface p-7 surface-raise"
              >
                <div className="mb-6 flex items-start justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[15px] bg-primary-soft"
                  >
                    <Icon className="h-[22px] w-[22px] text-primary" />
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-pill border border-[rgba(var(--primary-rgb),0.2)] px-2.5 py-1 font-jakarta text-[11.5px] font-semibold text-primary-contrast">
                    <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {credentialsCopy.chip}
                  </span>
                </div>

                <h3 className="font-fraunces text-[18px] font-medium leading-snug text-text">
                  {item.title}
                </h3>
                {item.detail && (
                  <p className="mt-1.5 font-jakarta text-[13.5px] font-medium text-accent-contrast">
                    {item.detail}
                  </p>
                )}
                <p className="mt-3.5 font-jakarta text-[14.5px] leading-[1.65] text-text-muted">
                  {item.description}
                </p>
              </article>
            );
          })}
        </Reveal>
      </CardRail>
    </SectionWrapper>
  );
}
