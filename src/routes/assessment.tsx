import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    title: "Start Your Assessment | Go Rebalance",
    meta: [
      {
        name: "description",
        content:
          "A ten-minute assessment covering your symptoms, history, lifestyle and food habits, reviewed personally before your consultation.",
      },
    ],
  }),
  component: lazyRoute(() => import("@/pages/Assessment")),
});
