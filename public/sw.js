/*
 * GoRebalance service worker.
 *
 * Three jobs:
 *   1. make the admin installable (a fetch handler is required for that),
 *   2. keep it usable on a flaky connection,
 *   3. show notifications, whether raised locally by the open app or pushed
 *      from a server later.
 *
 * Caching is deliberately NETWORK-FIRST. A clinic panel showing yesterday's
 * assessments because a cache-first worker served a stale bundle would be
 * worse than it simply not loading, so the network always wins and the cache
 * is only a fallback for when there is no network.
 */

/* Bumped with the code-splitting rework: every asset filename changed, so
   the old cache holds nothing a returning visitor can still use. Bump this
   whenever a release invalidates the shell. */
const VERSION = "gorebalance-v2";
const SHELL = ["/", "/admin", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((c) => c.addAll(SHELL).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** Never touch anything that is not a plain same-origin GET. */
function cacheable(request) {
  if (request.method !== "GET") return false;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  // Vite's dev endpoints and source modules must always hit the network, or
  // hot reload breaks while developing against the worker.
  if (url.pathname.startsWith("/@") || url.pathname.startsWith("/src/")) return false;
  if (url.pathname.startsWith("/node_modules/")) return false;
  return true;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (!cacheable(request)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(VERSION).then((c) => c.put(request, copy).catch(() => undefined));
        }
        return response;
      })
      .catch(async () => {
        const hit = await caches.match(request);
        if (hit) return hit;
        // A navigation with nothing cached: fall back to the app shell so the
        // SPA can at least boot and show its own offline state.
        if (request.mode === "navigate") {
          const shell = await caches.match("/admin");
          if (shell) return shell;
        }
        return Response.error();
      }),
  );
});

/* ─── notifications ─────────────────────────────────────────────────────── */

/**
 * Raised either by a server push or by the open app posting a message.
 * Both funnel through here so a notification looks the same either way.
 */
function show(data) {
  const title = data.title || "GoRebalance";
  return self.registration.showNotification(title, {
    body: data.body || "",
    icon: "/icon-192.png",
    badge: "/icon-maskable-192.png",
    tag: data.tag || "gorebalance",
    renotify: Boolean(data.tag),
    data: { url: data.url || "/admin" },
    requireInteraction: false,
  });
}

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  // FCM nests the human-readable part under `notification`.
  const payload = data.notification || data.data || data;
  event.waitUntil(show(payload));
});

self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "SHOW_NOTIFICATION") {
    event.waitUntil(show(msg.payload || {}));
  }
  if (msg.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/admin";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      // Focus an existing admin window rather than opening a second one.
      for (const client of list) {
        if (client.url.includes("/admin") && "focus" in client) {
          client.navigate(target).catch(() => undefined);
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    }),
  );
});
