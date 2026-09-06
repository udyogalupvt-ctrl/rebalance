import { useEffect, useRef } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notify, notificationState } from "@/lib/pwa";

/**
 * Raises a notification when a new assessment or enquiry arrives while the
 * admin is open -- including in a background tab or the installed app.
 *
 * This is what makes alerts work today, with no server involved. Push that
 * reaches a fully closed app needs a Cloud Function holding the service
 * account; until that exists, this covers the realistic case of the panel
 * being left open on a phone or a second monitor.
 *
 * The first snapshot is deliberately ignored. Firestore reports every existing
 * document as an "added" change on the initial load, so notifying on it would
 * fire one alert per record every time the panel opened.
 */
export function useAdminAlerts(enabled: boolean) {
  const seeded = useRef({ assessments: false, enquiries: false });

  useEffect(() => {
    if (!enabled) return;
    if (notificationState() !== "granted") return;

    const unsubs: Array<() => void> = [];

    unsubs.push(
      onSnapshot(
        query(collection(db, "assessments"), orderBy("submittedAt", "desc"), limit(20)),
        (snap) => {
          if (!seeded.current.assessments) {
            seeded.current.assessments = true;
            return;
          }
          snap.docChanges().forEach((change) => {
            if (change.type !== "added") return;
            const d = change.doc.data() as {
              details?: { fullName?: string; city?: string };
            };
            const who = d.details?.fullName ?? "Someone";
            void notify({
              title: "New assessment",
              body: `${who} submitted an assessment.`,
              url: `/admin/assessments/${change.doc.id}`,
              tag: `assessment-${change.doc.id}`,
            });
          });
        },
        (err) => console.error("Assessment alerts stopped:", err),
      ),
    );

    unsubs.push(
      onSnapshot(
        collection(db, "enquiries"),
        (snap) => {
          if (!seeded.current.enquiries) {
            seeded.current.enquiries = true;
            return;
          }
          snap.docChanges().forEach((change) => {
            if (change.type !== "added") return;
            const d = change.doc.data() as { name?: string; topic?: string };
            void notify({
              title: "New enquiry",
              body: `${d.name ?? "Someone"} sent a message${d.topic ? ` about ${d.topic}` : ""}.`,
              url: "/admin/enquiries",
              tag: `enquiry-${change.doc.id}`,
            });
          });
        },
        (err) => console.error("Enquiry alerts stopped:", err),
      ),
    );

    return () => unsubs.forEach((u) => u());
  }, [enabled]);
}
