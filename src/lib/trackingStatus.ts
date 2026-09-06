import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type TrackingStatus = "new" | "in_review" | "completed";
export type TrackingVerification = "pending" | "verified" | "not_verified";

export type TrackingPatch = {
  status?: TrackingStatus;
  verificationStatus?: TrackingVerification;
};

/**
 * Keeps the public `assessmentStatus` record in step with an admin change.
 *
 * That collection is the ONLY thing an unauthenticated visitor can read when
 * tracking an application: it holds a first name, the last four digits of the
 * phone and two status fields, and nothing else. The assessment document
 * itself stays admin-only, because it contains medical history, an address and
 * a payment screenshot.
 *
 * Written with merge so a patch never clobbers the fields set at submission
 * time (phoneLast4, firstName, submittedAt).
 *
 * A failure here is logged rather than thrown: the mirror is a convenience for
 * the patient, and it must never fail the admin action that triggered it.
 */
export async function mirrorStatus(submissionId: string, patch: TrackingPatch): Promise<void> {
  if (!submissionId) return;
  try {
    await setDoc(
      doc(db, "assessmentStatus", submissionId),
      { ...patch, updatedAt: serverTimestamp() },
      { merge: true },
    );
  } catch (err) {
    console.error("Couldn't mirror tracking status for", submissionId, err);
  }
}

/**
 * Removes the public tracking record when its assessment is deleted, so a
 * status page can never outlive the record it describes.
 */
export async function removeStatus(submissionId: string): Promise<void> {
  if (!submissionId) return;
  try {
    await deleteDoc(doc(db, "assessmentStatus", submissionId));
  } catch (err) {
    console.error("Couldn't remove tracking status for", submissionId, err);
  }
}
