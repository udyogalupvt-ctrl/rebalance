import * as React from "react";
import { MetaChip } from "@/components/shared/MetaChip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { MasonryGallery } from "@/components/gallery/MasonryGallery";
import { VideoHighlights } from "@/components/gallery/VideoHighlights";
import { AssessmentCTA } from "@/components/home/AssessmentCTA";
import { CurveDivider } from "@/components/shared/CurveDivider";
import { galleryCtaCopy } from "@/data/content";
import { Images, MapPin, Camera } from "lucide-react";

export default function Gallery() {
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/gallery" },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <Header overHero={false} />
      <main>
        <PageHero
          variant="image"
          align="left"
          eyebrow="GALLERY"
          title="Inside the *practice*."
          subtitle="The clinics, the consultations, the plans and the food that goes into them — at our Kakinada clinic."
          breadcrumb={breadcrumb}
          image={{
            src: "https://images.unsplash.com/photo-1556912999-8cd7c2582a5e?auto=format&fit=crop&q=75&w=1200",
            alt: "A woman cooking at the stove in a bright, natural-light kitchen",
            width: 1200,
            height: 900,
          }}
        >
          <div className="flex flex-wrap gap-3">
            <MetaChip icon={Images} label="40+ Moments" />
            <MetaChip icon={MapPin} label="Kakinada Clinic" />
            <MetaChip icon={Camera} label="Clinic & Community" />
          </div>
        </PageHero>

        <MasonryGallery />

        <CurveDivider fill="alt" />
        <VideoHighlights />

        <AssessmentCTA title={galleryCtaCopy.title} subtitle={galleryCtaCopy.subtitle} />
      </main>
      <Footer />
    </div>
  );
}
