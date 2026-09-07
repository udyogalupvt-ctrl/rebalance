import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";

export const Route = createFileRoute("/about")({
  component: lazyRoute(() => import("@/pages/About")),
});
