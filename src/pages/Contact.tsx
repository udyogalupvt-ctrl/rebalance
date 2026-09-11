import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { MetaChip } from "@/components/shared/MetaChip";
import { ContactMethods } from "@/components/contact/ContactMethods";
import { Clock, MapPin, Video } from "lucide-react";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { FinalCta } from "@/components/home/FinalCta";
import { ClinicLocationsFull } from "@/components/contact/ClinicLocationsFull";
import { HoursAndFaq } from "@/components/contact/HoursAndFaq";
import { PAGE_BACKDROPS, PAGE_PANELS } from "@/data/images";

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
          title="Ask first. Decide *after*."
          subtitle="Questions about the programs, what is involved or whether this is right for you — message the practice directly. You'll get a real answer, not an automated reply."
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Contact", href: "/contact" },
          ]}
          image={{ ...PAGE_PANELS.contact, width: 1200, height: 900 }}
        >
          <MetaChip icon={Clock} label="Replies within 24 hours" />
          <MetaChip icon={MapPin} label="Kakinada, Andhra Pradesh" />
          <MetaChip icon={Video} label="Online consultations" />
        </PageHero>

        <ContactMethods />

        <EnquiryForm />

        <ClinicLocationsFull />

        <HoursAndFaq />

        <FinalCta />
      </main>
      <Footer />
    </>
  );
};

export default Contact;
