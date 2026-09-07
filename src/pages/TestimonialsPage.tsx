import * as React from "react";
import { MetaChip } from "@/components/shared/MetaChip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { ResultsStats } from "@/components/testimonials/ResultsStats";
import { TestimonialGrid } from "@/components/testimonials/TestimonialGrid";
import { FeaturedStories } from "@/components/testimonials/FeaturedStories";
import { ConsentNote } from "@/components/testimonials/ConsentNote";
import { AssessmentCTA } from "@/components/home/AssessmentCTA";
import { Users, Star, Repeat } from "lucide-react";

export default function TestimonialsPage() {
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Testimonials", href: "/testimonials" },
  ];

  return (
    <>
      <Header overHero={false} />
      <main>
        <PageHero
          variant="image"
          align="left"
          eyebrow="CLIENT STORIES"
          title="What changed, in their *own words*."
          subtitle="Clients who arrived after years of normal reports and unresolved symptoms. These are their accounts of what the process was actually like — including how long it took."
          breadcrumb={breadcrumb}
          image={{
            src: "https://images.unsplash.com/photo-1644704170910-a0cdf183649b?auto=format&fit=crop&q=75&w=1200",
            alt: "Hands holding a bowl of grains and roasted vegetables",
            width: 1200,
            height: 900,
          }}
        >
          <MetaChip icon={Users} label="500+ Clients" />
          <MetaChip icon={Star} label="4.9 Average Rating" />
          <MetaChip icon={Repeat} label="Most Refer Someone" />
        </PageHero>

        <ResultsStats />
        <TestimonialGrid />
        <FeaturedStories />
        <ConsentNote />
        <AssessmentCTA
          title="Their story started with one *form*."
          subtitle="Ten minutes covering your symptoms, history, lifestyle and food habits — reviewed personally by Dt. Sai Sowjanya, with a response within 24 hours."
        />
      </main>
      <Footer />
    </>
  );
}
