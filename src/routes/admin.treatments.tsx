import { createFileRoute } from "@tanstack/react-router";
import TreatmentsManager from "@/pages/admin/Treatments";

export const Route = createFileRoute("/admin/treatments")({
  component: TreatmentsManager,
});
