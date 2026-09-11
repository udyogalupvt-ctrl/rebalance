import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { CurveDivider } from "@/components/shared/CurveDivider";

import { BriefHero } from "@/components/home/BriefHero";
import { AreasOfFocus } from "@/components/home/AreasOfFocus";
import { WhoWeWorkWith } from "@/components/home/WhoWeWorkWith";
import { GutHealthCore } from "@/components/home/GutHealthCore";
import { ApproachSteps } from "@/components/home/ApproachSteps";
import { ProgramsSection } from "@/components/home/ProgramsSection";
import { WhyGoRebalance } from "@/components/home/WhyGoRebalance";
import { WhatToExpect } from "@/components/home/WhatToExpect";
import { MeetSai } from "@/components/home/MeetSai";
import { BriefFaq } from "@/components/home/BriefFaq";
import { FinalCta } from "@/components/home/FinalCta";

/**
 * The homepage, rebuilt to the practice's content brief.
 *
 * The order below is the brief's, not an arrangement of convenience, and the
 * sequence is an argument: say what this is, let the reader find themselves in
 * it, explain the thinking, show the process, show the options, say why this
 * practice, then say plainly what it will NOT do — and only then introduce
 * the person and ask for the form. Trust is built before anything is asked
 * for.
 *
 * Four things that used to be on this page are deliberately gone, because the
 * brief forbids every one of them: client testimonials, headline statistics
 * ("500+ clients", "8+ years", "4.9 rating"), any claim about healing or root
 * causes, and prices. None of them came from the practice.
 */
export const Route = createFileRoute("/")({
  head: () => ({
    title: "Go Rebalance | Personalised Nutrition. Gut Health at the Core.",
    meta: [
      {
        name: "description",
        content:
          "Personalised nutrition guidance designed around your body, your lifestyle and your needs, from dietitian Sai Sowjanya Nallimpalli.",
      },
      { property: "og:title", content: "Go Rebalance | Personalised Nutrition" },
      {
        property: "og:description",
        content:
          "Personalised nutrition guidance designed around your body, your lifestyle and your needs.",
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
      <Header overHero={false} />
      <main>
        {/* 01 */} <BriefHero />
        {/* 02 */} <AreasOfFocus />
        {/* 03 */} <WhoWeWorkWith />
        {/* 04 */} <GutHealthCore />
        {/* 05 */} <ApproachSteps />
        <CurveDivider fill="alt" />
        {/* 06 */} <ProgramsSection />
        <CurveDivider fill="base" flip />
        {/* 07 */} <WhyGoRebalance />
        {/* 08 + 09 */} <WhatToExpect />
        <CurveDivider fill="base" flip />
        {/* 10 + 11 */} <MeetSai />
        {/* 12 */} <BriefFaq />
        {/* 13 */} <FinalCta />
      </main>
      <Footer />
    </>
  );
}
