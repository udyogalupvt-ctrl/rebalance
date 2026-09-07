import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    title: "Privacy Policy | GoRebalance",
    meta: [
      {
        name: "description",
        content:
          "What GoRebalance collects through the assessment and contact forms, where it is stored, and how to have it removed.",
      },
    ],
  }),
  component: lazyRoute(() => import("@/pages/PrivacyPage")),
});
