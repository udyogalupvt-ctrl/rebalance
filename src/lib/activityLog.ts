import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { Timestamp } from "firebase/firestore";

export type ActivityType = "assessment" | "payment" | "content";

export interface ActivityLogEntry {
  description: string;
  type: ActivityType;
  referenceId?: string;
  createdAt: Timestamp;
}

export function logActivity(description: string, type: ActivityType, referenceId?: string) {
  // Fire and forget, don't block
  addDoc(collection(db, "activityLog"), {
    description,
    type,
    referenceId: referenceId || null,
    createdAt: serverTimestamp(),
  }).catch((err) => {
    console.error("Failed to log activity:", err);
  });
}
