import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    title: "Medical Disclaimer | GoRebalance",
    meta: [
      {
        name: "description",
        content:
          "Nutrition guidance from GoRebalance supports medical care and does not replace diagnosis or treatment from a physician.",
      },
    ],
  }),
  component: lazyRoute(() => import("@/pages/DisclaimerPage")),
});
