import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import * as React from "react";
import { RouteFallback } from "@/components/shared/lazyRoute";

/* Track reads Firestore directly; nobody browsing the site needs that code. */
const TrackPage = React.lazy(() => import("@/pages/Track"));

type TrackSearch = { ref?: string };

export const Route = createFileRoute("/track")({
  // The reference is carried in the URL so the confirmation screen can link
  // straight here. Validated rather than trusted: anything unexpected is
  // dropped and the field simply starts empty.
  validateSearch: (search: Record<string, unknown>): TrackSearch => {
    const raw = search["ref"];
    if (typeof raw !== "string") return {};
    const cleaned = raw.trim().slice(0, 64);
    return /^[A-Za-z0-9-]{6,64}$/.test(cleaned) ? { ref: cleaned } : {};
  },
  head: () => ({
    title: "Track your assessment | GoRebalance",
    meta: [
      {
        name: "description",
        content:
          "Check the status of your GoRebalance assessment using your phone number and reference.",
      },
      // A personal status lookup has no business in search results.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TrackRoute,
});

function TrackRoute() {
  const { ref } = Route.useSearch();
  return (
    <>
      {/* This page opens on the light page background, not a dark hero. */}
      <Header overHero={false} />
      <main>
        <React.Suspense fallback={<RouteFallback />}>
          <TrackPage initialRef={ref ?? ""} />
        </React.Suspense>
      </main>
      <Footer />
    </>
  );
}
