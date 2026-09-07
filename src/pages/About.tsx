import * as React from "react";
import { MetaChip } from "@/components/shared/MetaChip";
import { PageHero } from "@/components/shared/PageHero";
import { StorySection } from "@/components/about/StorySection";
import { WhoWeHelp } from "@/components/about/WhoWeHelp";
import { ClinicLocations } from "@/components/about/ClinicLocations";
import { AssessmentCTA } from "@/components/home/AssessmentCTA";
import { CurveDivider } from "@/components/shared/CurveDivider";
import { aboutCtaCopy } from "@/data/content";
import { Award, Users, MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const aboutHeroProps = {
  eyebrow: "ABOUT GOREBALANCE",
  title: "The nutritionist who asks *why* first.",
  subtitle:
    "Dt. N. Sai Sowjanya has spent eight years treating the cause behind bloating, hormonal imbalance and fatigue — not the symptom sheet. This is how that practice works, and why it starts with your story.",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ],
  /*
   * No hero image, deliberately.
   *
   * There is exactly one photograph of the practitioner, and StorySection
   * opens with it about 200px below the fold. Framing the same picture twice
   * within one screen made the page read as padded rather than considered.
   * The hero is a centred statement instead, and her portrait lands once,
   * where the story that goes with it starts.
   */
  variant: "plain" as const,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header overHero={false} />
      <main>
        <PageHero {...aboutHeroProps}>
          <MetaChip icon={Award} label="8+ Years of Practice" />
          <MetaChip icon={Users} label="500+ Clients" />
          <MetaChip icon={MapPin} label="Kakinada, Andhra Pradesh" />
        </PageHero>
        <StorySection />
        <CurveDivider fill="alt" />
        <WhoWeHelp />
        <CurveDivider fill="base" flip />
        <ClinicLocations />
        <AssessmentCTA title={aboutCtaCopy.title} subtitle={aboutCtaCopy.subtitle} />
      </main>
      <Footer />
    </div>
  );
}
