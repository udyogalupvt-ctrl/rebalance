import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin, Rocket, Video } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { MetaChip } from "@/components/shared/MetaChip";
import { Reveal } from "@/components/shared/Reveal";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { ClinicLocationsFull } from "@/components/contact/ClinicLocationsFull";
import { BriefFaq } from "@/components/home/BriefFaq";
import { FinalCta } from "@/components/home/FinalCta";
import { brand, briefBrand, contactCopy } from "@/data/content";
import { PAGE_BACKDROPS, PAGE_PANELS } from "@/data/images";

/** The questions people ask before they get in touch. */
const CONTACT_FAQ_IDS = ["online", "after-assessment", "whatsapp", "who-can-join", "medical"];

/**
 * Contact — set to the practice's contact reference: the direct channels, a
 * direct message, and a way straight into the consultation form for anybody
 * who already knows they want to begin. The map of Kakinada follows.
 */
const Contact = () => {
  return (
    <>
      <Header overHero={false} />
      <main className="relative">
        <PageHero
          variant="image"
          align="left"
          backdrop={PAGE_BACKDROPS.contact}
          eyebrow="GET IN TOUCH"
          title={contactCopy.title}
          subtitle={contactCopy.subtitle}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Contact", href: "/contact" },
          ]}
          image={{ ...PAGE_PANELS.contact, width: 1200, height: 900 }}
        >
          <MetaChip icon={Video} label="1-on-1 Online Consultations" />
          <MetaChip icon={MapPin} label="Kakinada, Andhra Pradesh" />
          <MetaChip icon={Clock} label={brand.hours} />
        </PageHero>

        <EnquiryForm />

        {/* ---- straight to the form ---- */}
        <section aria-labelledby="start-now-heading" className="bg-bg">
          <div className="container-x py-14 sm:py-16">
            <Reveal>
              <div className="relative mx-auto flex max-w-[980px] flex-col items-start gap-6 overflow-hidden rounded-[28px] bg-[var(--dark-surface)] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
                <div
                  aria-hidden="true"
                  className="orb orb--accent pointer-events-none absolute -right-20 -top-24 h-64 w-64"
                />
                <div className="relative flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-on-dark-glass text-on-dark-accent"
                  >
                    <Rocket className="h-[22px] w-[22px]" />
                  </span>
                  <div>
                    <h2
                      id="start-now-heading"
                      className="font-fraunces text-[clamp(1.2rem,2.2vw,1.55rem)] font-medium leading-snug text-on-dark"
                    >
                      {contactCopy.ctaTitle}
                    </h2>
                    <p className="mt-1.5 font-jakarta text-[14.5px] text-on-dark-muted">
                      {contactCopy.ctaLink}.
                    </p>
                  </div>
                </div>
                <Link
                  to="/assessment"
                  className="press group relative inline-flex h-[52px] w-full shrink-0 items-center justify-center gap-2 rounded-pill bg-accent-strong px-7 font-semibold text-on-accent sm:w-auto"
                >
                  {briefBrand.primaryCta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <ClinicLocationsFull />

        <BriefFaq ids={CONTACT_FAQ_IDS} bg="alt" />

        <FinalCta />
      </main>
      <Footer />
    </>
  );
};

export default Contact;
