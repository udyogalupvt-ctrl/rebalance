import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";

export const Route = createFileRoute("/programs")({
  head: () => ({
    title: "Programs | Go Rebalance",
    meta: [
      {
        name: "description",
        content:
          "Four levels of personalised nutrition support, from a Single Consultation to the 6-Month Rebalance Program — and the areas of nutrition support Go Rebalance works in.",
      },
    ],
  }),
  component: lazyRoute(() => import("@/pages/Programs")),
});
