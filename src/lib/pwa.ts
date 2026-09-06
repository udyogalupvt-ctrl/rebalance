/*
 * PWA registration, install prompt and notifications.
 *
 * What works without any backend:
 *   - installing the admin as an app on a phone or laptop,
 *   - notifications raised by the panel itself when a new assessment or
 *     enquiry arrives while it is open (including in a background tab, and in
 *     the installed app).
 *
 * What needs a server: delivering a push when the app is fully closed. That
 * requires something holding the Firebase service account to call FCM. The
 * token plumbing below is in place for it, so once that function exists this
 * side needs no changes.
 */

const SW_URL = "/sw.js";

let registration: ServiceWorkerRegistration | null = null;

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari does not implement display-mode, and types it loosely.
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  if (registration) return registration;
  try {
    registration = await navigator.serviceWorker.register(SW_URL, { scope: "/" });
    return registration;
  } catch (err) {
    console.error("Service worker registration failed:", err);
    return null;
  }
}

export async function getRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (registration) return registration;
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    return (await navigator.serviceWorker.ready) ?? null;
  } catch {
    return null;
  }
}

/* ─── install prompt ────────────────────────────────────────────────────── */

export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: InstallPromptEvent | null = null;
const installListeners = new Set<(available: boolean) => void>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    // Chrome and Edge fire this when the app qualifies. Preventing the default
    // suppresses the browser's own mini-infobar so the panel can offer install
    // at a moment that makes sense instead.
    e.preventDefault();
    deferredPrompt = e as InstallPromptEvent;
    installListeners.forEach((fn) => fn(true));
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    installListeners.forEach((fn) => fn(false));
  });
}

export function canInstall(): boolean {
  return deferredPrompt !== null;
}

export function onInstallAvailabilityChange(fn: (available: boolean) => void): () => void {
  installListeners.add(fn);
  return () => installListeners.delete(fn);
}

export async function promptInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  if (!deferredPrompt) return "unavailable";
  const evt = deferredPrompt;
  // A prompt can only be used once; drop it before awaiting so a double click
  // cannot fire it twice.
  deferredPrompt = null;
  installListeners.forEach((f) => f(false));
  try {
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    return outcome;
  } catch {
    return "dismissed";
  }
}

/* ─── notifications ─────────────────────────────────────────────────────── */

export type NotificationState = "unsupported" | "default" | "granted" | "denied";

export function notificationState(): NotificationState {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission as NotificationState;
}

export async function requestNotificationPermission(): Promise<NotificationState> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  try {
    const result = await Notification.requestPermission();
    return result as NotificationState;
  } catch {
    return "denied";
  }
}

/**
 * Shows a notification through the service worker.
 *
 * Going via the worker rather than `new Notification()` matters: the
 * constructor is unavailable on Android Chrome, and only worker notifications
 * survive the tab being backgrounded or the installed app being minimised.
 */
export async function notify(payload: {
  title: string;
  body?: string;
  url?: string;
  tag?: string;
}): Promise<boolean> {
  if (notificationState() !== "granted") return false;
  const reg = await getRegistration();
  if (!reg) return false;
  try {
    await reg.showNotification(payload.title, {
      body: payload.body ?? "",
      icon: "/icon-192.png",
      badge: "/icon-maskable-192.png",
      tag: payload.tag ?? "gorebalance",
      data: { url: payload.url ?? "/admin" },
    });
    return true;
  } catch (err) {
    console.error("Could not show notification:", err);
    return false;
  }
}
