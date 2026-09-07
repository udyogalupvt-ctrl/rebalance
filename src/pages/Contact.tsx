import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { MetaChip } from "@/components/shared/MetaChip";
import { ContactMethods } from "@/components/contact/ContactMethods";
import { Clock, MapPin, Video } from "lucide-react";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { AssessmentCTA } from "@/components/home/AssessmentCTA";
import { ClinicLocationsFull } from "@/components/contact/ClinicLocationsFull";
import { HoursAndFaq } from "@/components/contact/HoursAndFaq";

const Contact = () => {
  return (
    <>
      <Header overHero={false} />
      <main className="relative">
        <PageHero
          variant="image"
          align="left"
          eyebrow="GET IN TOUCH"
          title="Ask first. Decide *after*."
          subtitle="Questions about a condition, the programs, timelines or fees — message the clinic directly. You'll get a real answer from Dt. Sai Sowjanya's practice, not an automated reply."
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Contact", href: "/contact" },
          ]}
          image={{
            src: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=75&w=1200",
            alt: "A woman preparing food in a bright kitchen",
            width: 1200,
            height: 900,
          }}
        >
          <MetaChip icon={Clock} label="Replies within 24 hours" />
          <MetaChip icon={MapPin} label="Kakinada, Andhra Pradesh" />
          <MetaChip icon={Video} label="Online consultations" />
        </PageHero>

        <ContactMethods />

        <EnquiryForm />

        <ClinicLocationsFull />

        <HoursAndFaq />

        <AssessmentCTA
          title="Skip the back-and-forth. Start the *assessment*."
          subtitle="It's the booking step and the first consultation rolled into one — your symptoms, history, lifestyle and food habits, reviewed personally before you're contacted."
        />
      </main>
      <Footer />
    </>
  );
};

export default Contact;
