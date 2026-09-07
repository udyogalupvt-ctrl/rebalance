import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";

export const Route = createFileRoute("/admin/enquiries")({
  component: lazyRoute(() => import("@/pages/admin/Enquiries")),
});
