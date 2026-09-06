import { createFileRoute } from "@tanstack/react-router";
import AssessmentDetail from "@/pages/admin/AssessmentDetail";

export const Route = createFileRoute("/admin/assessments/$id")({
  component: AssessmentDetail,
});
