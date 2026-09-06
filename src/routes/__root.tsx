import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import * as React from "react";
import { useEffect, type ReactNode } from "react";
import { WhatsAppButton, BackToTop } from "@/components/shared/FloatingElements";
import { Scripts } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { DUR, EASE_SETTLE } from "@/lib/motion";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="max-w-md text-center">
        <h1 className="fs-h1 text-text">404</h1>
        <h2 className="mt-4 fs-h4 text-text">Page not found</h2>
        <p className="mt-2 fs-micro text-text-muted">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary-strong px-5 py-2.5 text-sm font-medium text-on-primary transition-colors hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="max-w-md text-center">
        <h1 className="fs-h4 text-text">This page didn't load</h1>
        <p className="mt-2 fs-micro text-text-muted">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary-strong px-5 py-2.5 text-sm font-medium text-on-primary transition-colors hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border-input bg-surface px-5 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-alt"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GoRebalance" },
      { name: "description", content: "Clinical Nutrition & Gut Health Specialist" },
      { name: "author", content: "GoRebalance" },
      { property: "og:title", content: "GoRebalance | Clinical Nutrition & Gut Health" },
      {
        property: "og:description",
        content:
          "Root-cause nutrition and gut health care by Dt. N. Sai Sowjanya. Kakinada, Andhra Pradesh.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon-32.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Single grain overlay for the whole app. Previously every
          SectionWrapper rendered its own fixed, full-viewport feTurbulence
          filter (8 on the home page alone), which pinned the main thread and
          made scrolling stutter. */}
      <div className="grain-overlay" aria-hidden="true" />
      {children}
      <Scripts />
    </>
  );
}

/**
 * A short rise-and-settle on every route change.
 *
 * Keyed on the pathname so it replays per page. There is deliberately no exit
 * animation: AnimatePresence with mode="wait" would hold the old page on
 * screen for the length of its exit before the new one begins, which reads as
 * lag. Incoming-only keeps navigation instant but no longer abrupt.
 */
function PageTransition({ pathname, children }: { pathname: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.md, ease: EASE_SETTLE }}
    >
      {children}
    </motion.div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { pathname } = useRouterState({ select: (s) => s.location });

  // The consumer WhatsApp CTA and back-to-top belong on the marketing site
  // only - not over the admin console or the assessment form.
  const isAppRoute = pathname.startsWith("/admin") || pathname.startsWith("/assessment");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PageTransition pathname={pathname}>
          <Outlet />
        </PageTransition>
        {!isAppRoute && (
          <>
            <WhatsAppButton />
            <BackToTop />
          </>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
