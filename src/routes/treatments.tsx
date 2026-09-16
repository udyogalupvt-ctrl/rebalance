import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * /treatments no longer exists as a page.
 *
 * The practice asked for one page for everything it offers, named Programs,
 * and for no "treatment" wording on the site. Old links — bookmarks, shared
 * messages, search results — still arrive here, so the route stays and
 * forwards them rather than showing a 404.
 */
export const Route = createFileRoute("/treatments")({
  beforeLoad: () => {
    throw redirect({ to: "/programs", replace: true });
  },
});
