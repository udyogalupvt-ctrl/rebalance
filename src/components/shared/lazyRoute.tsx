import * as React from "react";

/**
 * A route component that is fetched on demand.
 *
 * Why this exists: the whole application built to a SINGLE 2.5 MB JavaScript
 * chunk. Someone landing on the home page to read about bloating downloaded
 * the entire admin console — every manager page, the sortable drag-and-drop
 * layer, the activity log — plus the five-step assessment form, before the
 * first section could render. On the 4G connections most of this practice's
 * visitors are on, that is several seconds of blank page.
 *
 * Wrapping a route's component in a dynamic import gives Rollup a split
 * point, so each of those areas becomes its own chunk that is fetched only
 * when somebody actually navigates to it.
 */
export function lazyRoute(load: () => Promise<{ default: React.ComponentType }>) {
  const Component = React.lazy(load);
  return function LazyRouteComponent() {
    return (
      <React.Suspense fallback={<RouteFallback />}>
        <Component />
      </React.Suspense>
    );
  };
}

/**
 * Shown while a route chunk is in flight.
 *
 * Deliberately quiet: a spinner that appears for 80ms on a fast connection is
 * more distracting than nothing at all, so this is a bare tinted panel at the
 * page background colour. It holds the viewport height so the header does not
 * jump while the chunk arrives.
 */
export function RouteFallback() {
  return (
    <div
      className="min-h-screen w-full bg-bg"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    />
  );
}
