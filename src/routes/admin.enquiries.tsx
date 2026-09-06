import { createFileRoute } from "@tanstack/react-router";
import EnquiriesManager from "@/pages/admin/Enquiries";

export const Route = createFileRoute("/admin/enquiries")({
  component: EnquiriesManager,
});
