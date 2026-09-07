import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, Clock, Phone, Navigation, Video, CalendarCheck } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CurveDivider } from "@/components/shared/CurveDivider";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { locations, brand } from "@/data/content";
import { Link } from "@tanstack/react-router";
import type { Location } from "@/types/content";

const MapPanel = ({ location, index }: { location: Location; index: number }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden border border-border bg-surface-alt transition-all duration-500
        ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}
        aspect-[16/11] lg:aspect-auto h-full rounded-[24px] md:rounded-[18px]`}
    >
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <motion.button
            key="poster"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLoaded(true)}
            /* The dark ground lives on the button itself rather than on the
               decorative layer inside it, so the element that owns the text
               also owns its background. Anything auditing contrast by walking
               up the tree — including a browser devtools check — then reads
               the real backdrop instead of the light card behind. */
            className="group relative h-full w-full cursor-pointer bg-[var(--dark-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            aria-label={`Load the interactive map for the ${location.city} clinic`}
          >
            {/*
              A drawn panel, not a photograph.

              The poster used to be a stock photograph of food carrying
              alt="Map view of Kakinada" — a description of something that was
              not in the picture, which is worse than no alt text at all for
              anyone relying on it. It also cost a full-width image download
              to sit under a 66% scrim.

              This is the brand's own surface with a faint grid, which reads
              as "map" without pretending to be one, and paints instantly.
            */}
            <div aria-hidden="true" className="absolute inset-0 transition-colors">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_40%,rgba(var(--primary-rgb),0.30),transparent_65%)]" />
              <div
                className="absolute inset-0 opacity-[0.14]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(var(--on-dark-rgb),0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--on-dark-rgb),0.5) 1px, transparent 1px)",
                  backgroundSize: "42px 42px",
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_20%,rgba(var(--dark-surface-rgb),0.75)_75%)] transition-opacity group-hover:opacity-80" />
            </div>

            {/* CONTENT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <div className="w-[62px] h-[62px] rounded-full bg-surface/94 backdrop-blur-md flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <MapPin className="w-[26px] h-[26px] text-primary" />
              </div>
              <p className="mt-4 text-[15px] font-semibold text-on-dark">
                View {location.city} on the map
              </p>
              <p className="mt-1 text-[12.5px] text-on-dark-muted">Loads Google Maps</p>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            <iframe
              src={location.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map showing the GoRebalance ${location.city} clinic`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ClinicCard = ({ location, index }: { location: Location; index: number }) => {
  return (
    <div
      className={`flex flex-col h-full bg-surface border border-border rounded-[24px] p-[26px_22px] md:p-[34px_32px]
      ${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}
    >
      <div className="flex items-center gap-14 mb-2">
        <div className="w-[46px] h-[46px] rounded-[13px] bg-primary-soft flex items-center justify-center shrink-0">
          <Building2 className="w-[21px] h-[21px] text-primary" />
        </div>
        <h3 className="font-fraunces text-[clamp(1.375rem,2.2vw,1.75rem)] font-medium text-text leading-tight">
          {location.city}
        </h3>
      </div>

      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accent-contrast mb-6">
        {location.state}
      </p>

      <div className="flex flex-col gap-[18px] flex-grow">
        {/* Address */}
        <div className="flex gap-[13px]">
          <MapPin className="w-[18px] h-[18px] text-primary shrink-0 mt-[2px]" />
          <div className="flex flex-col text-[14.5px] leading-[1.65] text-text-muted">
            {location.addressLines.map((line: string, i: number) => (
              <span key={i}>{line}</span>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div className="flex gap-[13px]">
          <Clock className="w-[18px] h-[18px] text-primary shrink-0 mt-[2px]" />
          <div className="flex flex-col">
            <span className="text-[14.5px] text-text-muted">{location.hours[0]}</span>
            <span className="text-[13.5px] text-text-muted/75">{location.hours[1]}</span>
          </div>
        </div>

        {/* Phone */}
        <div className="flex gap-[13px]">
          <Phone className="w-[18px] h-[18px] text-primary shrink-0 mt-[2px]" />
          <a
            href={`tel:${brand.phoneRaw}`}
            className="text-[15px] font-semibold text-text hover:text-accent-contrast transition-colors"
            aria-label={`Call ${brand.phone}`}
          >
            {brand.phone}
          </a>
        </div>

        {/* Note */}
        <div className="flex gap-[13px]">
          <CalendarCheck className="w-[18px] h-[18px] text-primary shrink-0 mt-[2px]" />
          <p className="text-[14.5px] text-text-muted">
            By appointment only — please book before visiting.
          </p>
        </div>
      </div>

      <div className="mt-7 pt-6 border-t border-border flex flex-col sm:flex-row gap-[10px]">
        <Link
          to="/assessment"
          className="flex-grow h-[50px] inline-flex items-center justify-center rounded-full bg-accent-strong text-on-accent text-[14.5px] font-semibold transition-all hover:translate-y-[-2px] hover:shadow-lg active:scale-95"
        >
          Book a Consultation →
        </Link>
        <a
          href={location.mapDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-[50px] px-5 inline-flex items-center justify-center rounded-full border-1.5 border-border text-text text-[14.5px] font-semibold transition-all hover:bg-surface-alt active:scale-95"
          aria-label={`Get directions to the ${location.city} clinic (opens in a new tab)`}
        >
          <Navigation className="w-[16px] h-[16px] mr-2" />
          Directions
        </a>
      </div>
    </div>
  );
};

export const ClinicLocationsFull = () => {
  return (
    <>
      <CurveDivider fill="base" flip />
      <SectionWrapper id="clinics" bg="base" labelledBy="clinics-heading">
        <div
          className="absolute bottom-0 left-0 w-[580px] h-[580px] bg-primary/4 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />

        {/* Uses the shared heading rather than a hand-rolled one. The local
            copy printed its own accent markup as literal asterisks — the page
            read "One clinic, one *standard of care*." — and its type classes
            did not exist, so it rendered in the body face while every other
            section heading on the site was in Fraunces. */}
        <SectionHeading
          id="clinics-heading"
          align="center"
          eyebrow="Visit us"
          title="One clinic, one *standard of care*."
          subtitle="In-person consultations in Kakinada. Online consultations follow exactly the same protocol, wherever you are in India."
        />

        <div className="flex flex-col gap-[56px] md:gap-[40px]">
          {locations.map((location, index) => (
            <Reveal key={location.id} delay={index * 0.15}>
              <div className="grid lg:grid-cols-[6fr_5fr] gap-12 md:gap-6 items-stretch min-h-[500px] md:min-h-0">
                <MapPanel location={location} index={index} />
                <ClinicCard location={location} index={index} />
              </div>
            </Reveal>
          ))}
        </div>

        {/* ONLINE CONSULTATION STRIP */}
        <Reveal delay={0.4}>
          <div className="mt-[36px] md:mt-[48px] bg-surface-alt border border-border rounded-[24px] p-[26px_22px] md:p-[32px_36px] flex flex-col md:flex-row md:justify-between items-center gap-6 md:gap-7 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-7 text-center md:text-left">
              <div className="w-[56px] h-[56px] rounded-full bg-primary-soft flex items-center justify-center shrink-0">
                <Video className="w-[25px] h-[25px] text-primary" />
              </div>
              <div>
                <h3 className="font-fraunces text-[clamp(1.125rem,1.8vw,1.375rem)] font-medium text-text">
                  Not near either clinic?
                </h3>
                <p className="mt-2 text-[14.5px] text-text-muted max-w-[56ch]">
                  Online consultations run across India — the same assessment, the same plan, the
                  same follow-ups. Nothing is abbreviated.
                </p>
              </div>
            </div>
            <Link
              to="/assessment"
              className="h-[52px] w-full md:w-auto px-[28px] shrink-0 inline-flex items-center justify-center rounded-full border-[1.5px] border-primary text-primary-contrast text-[15px] font-semibold transition-all hover:bg-primary-strong hover:text-on-primary active:scale-95 whitespace-nowrap"
            >
              Start Online →
            </Link>
          </div>
        </Reveal>
      </SectionWrapper>
    </>
  );
};
