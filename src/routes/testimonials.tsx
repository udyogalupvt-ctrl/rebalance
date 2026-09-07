import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";

export const Route = createFileRoute("/testimonials")({
  component: lazyRoute(() => import("@/pages/TestimonialsPage")),
});
