import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// REQUIRED ENVIRONMENT VARIABLES:
// VITE_FIREBASE_API_KEY
// VITE_FIREBASE_AUTH_DOMAIN
// VITE_FIREBASE_PROJECT_ID
// VITE_FIREBASE_STORAGE_BUCKET
// VITE_FIREBASE_MESSAGING_SENDER_ID
// VITE_FIREBASE_APP_ID

const env = import.meta.env;

const firebaseConfig = {
  apiKey: env["VITE_FIREBASE_API_KEY"] || "placeholder-api-key",
  authDomain: env["VITE_FIREBASE_AUTH_DOMAIN"] || "placeholder-auth-domain",
  projectId: env["VITE_FIREBASE_PROJECT_ID"] || "placeholder-project-id",
  storageBucket: env["VITE_FIREBASE_STORAGE_BUCKET"] || "placeholder-storage-bucket",
  messagingSenderId: env["VITE_FIREBASE_MESSAGING_SENDER_ID"] || "placeholder-messaging-sender-id",
  appId: env["VITE_FIREBASE_APP_ID"] || "placeholder-app-id",
};

const app = initializeApp(firebaseConfig);

/*
 * ignoreUndefinedProperties is required, not a preference.
 *
 * The assessment schema marks ~10 fields optional across every section, and
 * one (weightChangeAmountKg) transforms an empty input to `undefined`
 * outright. Firestore rejects undefined by default, so a patient who left any
 * optional question blank hit:
 *
 *   FirebaseError: Function setDoc() called with invalid data.
 *   Unsupported field value: undefined (found in field details.selectedSymptoms)
 *
 * ...and the submit failed with a generic "please try again" they could never
 * get past. Dropping undefined is also the semantics we want: a question that
 * was not answered simply is not stored.
 */
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });
export const storage = getStorage(app);
export const auth = getAuth(app);

// Persist session across refreshes for the admin panel
setPersistence(auth, browserLocalPersistence).catch(console.error);
