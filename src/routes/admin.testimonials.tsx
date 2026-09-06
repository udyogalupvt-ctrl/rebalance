import { createFileRoute } from "@tanstack/react-router";
import TestimonialsManager from "@/pages/admin/Testimonials";

export const Route = createFileRoute("/admin/testimonials")({
  component: TestimonialsManager,
});
