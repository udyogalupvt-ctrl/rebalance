import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CredibilityMarquee } from "@/components/home/CredibilityMarquee";
import { AssessmentCTA } from "@/components/home/AssessmentCTA";
import { SymptomChecker } from "@/components/home/SymptomChecker";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { TreatmentsPreview } from "@/components/home/TreatmentsPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { GalleryStrip } from "@/components/home/GalleryStrip";
import { FaqSection } from "@/components/home/FaqSection";
import { CurveDivider } from "@/components/shared/CurveDivider";
import { Preloader } from "@/components/layout/Preloader";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "GoRebalance | Clinical Nutrition & Gut Health Specialist",
    meta: [
      {
        name: "description",
        content:
          "Heal the gut. Rebalance the whole you. Personalised root-cause nutrition programs by Dt. N. Sai Sowjanya in Kakinada.",
      },
      { property: "og:title", content: "GoRebalance | Gut Health Specialist" },
      {
        property: "og:description",
        content:
          "Evidence-based clinical nutrition and gut health programs by Dt. N. Sai Sowjanya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <CredibilityMarquee />
        <SymptomChecker />
        <AboutPreview />
        <CurveDivider fill="base" flip />
        <ProcessSteps />
        <CurveDivider fill="alt" />
        <TreatmentsPreview />
        <CurveDivider fill="base" flip />
        <Testimonials />
        <CurveDivider fill="alt" />
        <GalleryStrip />
        <AssessmentCTA />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
