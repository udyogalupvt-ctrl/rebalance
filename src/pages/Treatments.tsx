import * as React from "react";
import { MetaChip } from "@/components/shared/MetaChip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { ProgramsGrid } from "@/components/treatments/ProgramsGrid";
import { WhatsIncluded } from "@/components/treatments/WhatsIncluded";
import { ProgramJourney } from "@/components/treatments/ProgramJourney";
import { TreatmentsFaq } from "@/components/treatments/TreatmentsFaq";
import { AssessmentCTA } from "@/components/home/AssessmentCTA";
import { treatmentsCtaCopy } from "@/data/content";

import { Layers, UserCheck, Video } from "lucide-react";

export default function Treatments() {
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Treatments", href: "/treatments" },
  ];

  return (
    <>
      <Header overHero={false} />
      <main>
        <PageHero
          variant="image"
          align="left"
          eyebrow="OUR PROGRAMS"
          title="Nutrition built around your *condition*."
          subtitle="Seven focused areas of nutrition support, all starting from the same place: your gut, your history and your daily life. Many people begin with one and find the others ease alongside it."
          breadcrumb={breadcrumb}
          image={{
            src: "https://images.unsplash.com/photo-1591586116988-62fe65164f8d?auto=format&fit=crop&q=75&w=1200",
            alt: "Cauliflower, broccoli, radishes and carrots on a market table",
            width: 1200,
            height: 900,
          }}
        >
          <div className="flex flex-wrap gap-3">
            <MetaChip icon={Layers} label="7 Focused Programs" />
            <MetaChip icon={UserCheck} label="Personalised, Never Templated" />
            <MetaChip icon={Video} label="In-Clinic & Online" />
          </div>
        </PageHero>

        <ProgramsGrid />
        <WhatsIncluded />
        <ProgramJourney />
        <TreatmentsFaq />
        <AssessmentCTA title={treatmentsCtaCopy.title} subtitle={treatmentsCtaCopy.subtitle} />
      </main>

      <Footer />
    </>
  );
}
