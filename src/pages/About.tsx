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
    src: "https://images.unsplash.com/photo-1606787364406-a3cdf06c6d0c?auto=format&fit=crop&q=80&w=2000",
    alt: "Professional and warm consultation room with natural light",
    width: 2000,
    height: 1200,
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
