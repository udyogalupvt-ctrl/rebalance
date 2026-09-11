import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";

export const Route = createFileRoute("/programs")({
  head: () => ({
    title: "Programs | Go Rebalance",
    meta: [
      {
        name: "description",
        content:
          "Four levels of personalised nutrition support, from a single consultation to six months of continuity. Pricing is discussed on your discovery call.",
      },
    ],
  }),
  component: lazyRoute(() => import("@/pages/Programs")),
});
