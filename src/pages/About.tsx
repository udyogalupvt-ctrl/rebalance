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
  image: {
    src: "/founder.jpg",
    alt: "Dt. N. Sai Sowjanya at the GoRebalance clinic in Kakinada",
    width: 1086,
    height: 1448,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
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
