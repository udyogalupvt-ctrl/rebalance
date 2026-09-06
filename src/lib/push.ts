import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { app, db } from "@/lib/firebase";
import { getRegistration, notify } from "@/lib/pwa";

/*
 * Firebase Cloud Messaging for the admin panel.
 *
 * The VAPID public key is exactly that -- public. It identifies this app to
 * the browser's push service and ships in the bundle by design; it grants no
 * ability to send anything. Sending requires the private half, which lives
 * with the Firebase project and must only ever be used server-side.
 */
const VAPID_KEY = import.meta.env["VITE_FIREBASE_VAPID_KEY"] as string | undefined;

/** Where a device's push token is stored so a server can reach it later. */
const TOKENS = "adminPushTokens";

export function pushConfigured(): boolean {
  return typeof VAPID_KEY === "string" && VAPID_KEY.length > 20;
}

/**
 * Registers this device for push and records the token against the signed-in
 * admin. Safe to call repeatedly: FCM returns the same token for a device
 * until it is invalidated, and the write is idempotent.
 *
 * Returns the token, or null when push is unavailable (unsupported browser,
 * permission not granted, or no VAPID key configured).
 */
export async function registerForPush(uid: string): Promise<string | null> {
  if (!pushConfigured()) return null;
  if (typeof window === "undefined" || !("Notification" in window)) return null;
  if (Notification.permission !== "granted") return null;

  try {
    if (!(await isSupported())) return null;
    const registration = await getRegistration();
    if (!registration) return null;

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY as string,
      serviceWorkerRegistration: registration,
    });
    if (!token) return null;

    // Keyed by the token so re-registering the same device overwrites rather
    // than piling up duplicates that would each get a copy of every push.
    await setDoc(
      doc(db, TOKENS, token),
      {
        token,
        uid,
        userAgent: navigator.userAgent.slice(0, 300),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    // Messages that arrive while a tab is focused do not reach the service
    // worker, so surface them here or they would be silently dropped.
    onMessage(messaging, (payload) => {
      const n = payload.notification;
      void notify({
        title: n?.title ?? "GoRebalance",
        body: n?.body ?? "",
        url: (payload.data?.["url"] as string) ?? "/admin",
        tag: (payload.data?.["tag"] as string) ?? "fcm",
      });
    });

    return token;
  } catch (err) {
    console.error("Could not register for push:", err);
    return null;
  }
}

/** Removes this device's token, e.g. on sign-out from a shared machine. */
export async function unregisterPush(token: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TOKENS, token));
  } catch (err) {
    console.error("Could not remove push token:", err);
  }
}

/* ─── patient side ──────────────────────────────────────────────────────── */

/** One document per application, keyed by its submission id. */
const PATIENT_TOKENS = "patientPushTokens";

/**
 * Registers the patient's device against their application, so a status
 * change can reach them after they close the tracking page.
 *
 * Keyed by submission id rather than by token: a patient has exactly one
 * application open at a time, and the reference is the thing they already
 * hold. Delivery when the page is closed still requires the Cloud Function in
 * functions/ to be deployed; while the page IS open, the tracking page's own
 * listener raises the notification with no server involved.
 */
export async function registerPatientForPush(submissionId: string): Promise<string | null> {
  if (!pushConfigured() || !submissionId) return null;
  if (typeof window === "undefined" || !("Notification" in window)) return null;
  if (Notification.permission !== "granted") return null;

  try {
    if (!(await isSupported())) return null;
    const registration = await getRegistration();
    if (!registration) return null;

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY as string,
      serviceWorkerRegistration: registration,
    });
    if (!token) return null;

    await setDoc(
      doc(db, PATIENT_TOKENS, submissionId),
      { token, submissionId, updatedAt: serverTimestamp() },
      { merge: true },
    );

    onMessage(messaging, (payload) => {
      const n = payload.notification;
      void notify({
        title: n?.title ?? "GoRebalance",
        body: n?.body ?? "",
        url: (payload.data?.["url"] as string) ?? "/track",
        tag: (payload.data?.["tag"] as string) ?? "status",
      });
    });

    return token;
  } catch (err) {
    console.error("Could not register for status updates:", err);
    return null;
  }
}
