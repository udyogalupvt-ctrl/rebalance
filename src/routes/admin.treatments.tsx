import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";

export const Route = createFileRoute("/admin/treatments")({
  component: lazyRoute(() => import("@/pages/admin/Treatments")),
});
