import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    title: "Gut Health Assessment | GoRebalance",
    meta: [
      {
        name: "description",
        content:
          "A ten-minute root-cause assessment covering your symptoms, history, lifestyle and food habits — reviewed personally by Dt. N. Sai Sowjanya.",
      },
    ],
  }),
  component: lazyRoute(() => import("@/pages/Assessment")),
});
