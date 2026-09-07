import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";
export const Route = createFileRoute("/gallery")({
  component: lazyRoute(() => import("@/pages/Gallery")),
});
