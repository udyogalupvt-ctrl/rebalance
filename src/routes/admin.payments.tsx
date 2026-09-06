import { createFileRoute } from "@tanstack/react-router";
import PaymentsPage from "@/pages/admin/Payments";

export const Route = createFileRoute("/admin/payments")({
  component: PaymentsPage,
});
