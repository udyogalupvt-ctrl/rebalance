import type { Timestamp } from "firebase/firestore";
import type { FullAssessment } from "@/schemas/assessment";

/**
 * A date field as it can actually arrive from Firestore.
 *
 * Live snapshots give a Timestamp, but the same documents are also read back
 * from cached/serialised JSON where the value is a string or a number. Every
 * call site already guards with `?.toDate ? … : new Date(…)`, so the type
 * reflects that rather than pretending it is always a Timestamp.
 */
export type FirestoreDate = Timestamp | Date | string | number;

export type AssessmentStatus = "new" | "in_review" | "completed";

export type AssessmentDocument = Partial<FullAssessment> & {
  id: string;
  submissionId: string;
  draftId: string;
  submittedAt: FirestoreDate;
  status: AssessmentStatus;
  reviewedBy: string | null;
  reviewedAt: FirestoreDate | null;
  adminNotes: string;
  source: string;
  verificationStatus: "pending" | "verified" | "not_verified";
};

/** A contact-form enquiry as stored in the `enquiries` collection. */
export type EnquiryDoc = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  topic?: string;
  message?: string;
  status?: string;
  preferredContact?: "whatsapp" | "phone" | "email";
  adminNotes?: string;
  readAt?: FirestoreDate | null;
  createdAt?: FirestoreDate;
};
