import { createFileRoute } from "@tanstack/react-router";
import AssessmentsList from "@/pages/admin/Assessments";

export const Route = createFileRoute("/admin/assessments/")({
  component: AssessmentsList,
});
