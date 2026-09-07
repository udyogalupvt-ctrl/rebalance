import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";

export const Route = createFileRoute("/terms")({
  head: () => ({
    title: "Terms of Service | GoRebalance",
    meta: [
      {
        name: "description",
        content: "The terms that apply when you book a consultation with GoRebalance.",
      },
    ],
  }),
  component: lazyRoute(() => import("@/pages/TermsPage")),
});
