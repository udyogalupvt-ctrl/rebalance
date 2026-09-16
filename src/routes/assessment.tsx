import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    title: "Book Consultation | Go Rebalance",
    meta: [
      {
        name: "description",
        content:
          "Book a consultation with Go Rebalance: a guided form covering your health, lifestyle and food habits, followed by your Discovery Call.",
      },
    ],
  }),
  component: lazyRoute(() => import("@/pages/Assessment")),
});
