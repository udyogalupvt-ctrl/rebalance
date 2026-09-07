import { createFileRoute } from "@tanstack/react-router";
import { lazyRoute } from "@/components/shared/lazyRoute";

/*
 * The entire admin console is loaded on demand.
 *
 * Route MODULES are all pulled into the initial graph by the generated route
 * tree, so making a route's *component* lazy does nothing for anything the
 * route file imports at the top level. This file used to import AuthProvider,
 * AdminLayout and 60 kB of console stylesheet directly — which meant Vite
 * emitted a <link rel="modulepreload"> for all 680 kB of Firebase on the home
 * page of a site whose visitors will never sign in to anything.
 *
 * Everything now lives behind this single dynamic import. See AdminShell for
 * why the stylesheets are imported there rather than here.
 */
export const Route = createFileRoute("/admin")({
  component: lazyRoute(() => import("@/pages/admin/AdminShell")),
});
