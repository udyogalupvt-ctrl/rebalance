import { createFileRoute } from "@tanstack/react-router";
import TreatmentsPage from "@/pages/Treatments";

export const Route = createFileRoute("/treatments")({
  component: TreatmentsPage,
});
