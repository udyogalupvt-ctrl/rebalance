import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";
import { safeRedirect } from "@/lib/utils";

export const Route = createFileRoute("/admin/login")({
  // Declaring the schema here means Login.tsx can call useSearch()
  // unconditionally instead of guarding it with a try/catch, which broke the
  // rules of hooks. The redirect target is also validated at this boundary, so
  // an unsafe value never reaches the component.
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    const raw = search["redirect"];
    if (typeof raw !== "string" || raw.length === 0) return {};
    const safe = safeRedirect(raw, "");
    return safe ? { redirect: safe } : {};
  },
  component: lazyRoute(() => import("@/pages/admin/Login")),
});
