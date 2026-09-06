/*
 * Push notifications for the GoRebalance admin.
 *
 * NOT DEPLOYED. This is the piece that delivers a notification when the admin
 * app is fully closed. The app already registers each device's FCM token in
 * `adminPushTokens`; this reads those tokens and sends to them when a new
 * assessment or enquiry arrives.
 *
 * Deploy with:
 *   cd functions && npm install
 *   firebase deploy --only functions
 *
 * Requires the Blaze (pay-as-you-go) plan -- Cloud Functions are not available
 * on Spark. At this volume the cost is effectively zero, but the plan change
 * is required.
 *
 * IMPORTANT: do NOT add the service account JSON here. A deployed function
 * runs as the project's own service account, so initializeApp() with no
 * arguments already has full admin access. Shipping a key file would put a
 * long-lived private credential in your source tree for no benefit.
 */

const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();
const db = getFirestore();

/** Sends to every registered admin device, pruning tokens FCM rejects. */
async function pushToAdmins(notification, data) {
  const snap = await db.collection("adminPushTokens").get();
  const tokens = snap.docs.map((d) => d.id).filter(Boolean);
  if (!tokens.length) return;

  const response = await getMessaging().sendEachForMulticast({
    tokens,
    notification,
    data,
    webpush: {
      fcmOptions: { link: data.url || "/admin" },
      notification: {
        icon: "/icon-192.png",
        badge: "/icon-maskable-192.png",
tag: data.tag || "gorebalance",
      },
    },
  });

  // A token goes stale when the browser is uninstalled or its data cleared.
  // Leaving them would mean sending to dead devices forever.
  const dead = [];
  response.responses.forEach((r, i) => {
    if (r.success) return;
    const code = r.error && r.error.code;
    if (
      code === "messaging/registration-token-not-registered" ||
      code === "messaging/invalid-registration-token"
    ) {
      dead.push(tokens[i]);
    }
  });
  await Promise.all(dead.map((t) => db.collection("adminPushTokens").doc(t).delete()));
}

exports.onNewAssessment = onDocumentCreated("assessments/{id}", async (event) => {
  const d = event.data && event.data.data();
  if (!d) return;
  const name = (d.details && d.details.fullName) || "Someone";
  await pushToAdmins(
    { title: "New assessment", body: `${name} submitted an assessment.` },
    { url: `/admin/assessments/${event.params.id}`, tag: `assessment-${event.params.id}` },
  );
});

exports.onNewEnquiry = onDocumentCreated("enquiries/{id}", async (event) => {
  const d = event.data && event.data.data();
  if (!d) return;
  await pushToAdmins(
    {
      title: "New enquiry",
      body: `${d.name || "Someone"} sent a message${d.topic ? ` about ${d.topic}` : ""}.`,
    },
    { url: "/admin/enquiries", tag: `enquiry-${event.params.id}` },
  );
});

/* ─── patient side ───────────────────────────────────────────────────────── */

/** Sends to the one device registered against an application, if any. */
async function pushToPatient(submissionId, notification, data) {
  const snap = await db.collection("patientPushTokens").doc(submissionId).get();
  const token = snap.exists ? snap.get("token") : null;
  if (!token) return;

  try {
    await getMessaging().send({
      token,
      notification,
      data,
      webpush: {
        fcmOptions: { link: data.url || "/track" },
        notification: { icon: "/icon-192.png", badge: "/icon-maskable-192.png" },
      },
    });
  } catch (err) {
    const code = err && err.code;
    if (
      code === "messaging/registration-token-not-registered" ||
      code === "messaging/invalid-registration-token"
    ) {
      await db.collection("patientPushTokens").doc(submissionId).delete();
    } else {
      console.error("Patient push failed for", submissionId, err);
    }
  }
}

/**
 * Tells the patient when the practice verifies or rejects their payment, or
 * moves their assessment on.
 *
 * Fires on the assessment rather than the public status mirror so it cannot be
 * triggered by anything a visitor is able to write.
 */
exports.onAssessmentStatusChange = onDocumentUpdated("assessments/{id}", async (event) => {
  const before = event.data && event.data.before.data();
  const after = event.data && event.data.after.data();
  if (!before || !after) return;

  const id = event.params.id;
  const url = `/track?ref=${id}`;

  if (before.verificationStatus !== after.verificationStatus) {
    const v = after.verificationStatus;
    await pushToPatient(
      id,
      {
        title:
          v === "verified"
            ? "Payment verified"
            : v === "not_verified"
              ? "Payment needs attention"
              : "Payment status updated",
        body:
          v === "verified"
            ? "Your payment has been confirmed. Your assessment is with the clinic."
            : v === "not_verified"
              ? "We couldn't match your payment. Message the clinic and we'll sort it out."
              : "The status of your payment has changed.",
      },
      { url, tag: `status-${id}` },
    );
    return;
  }

  if (before.status !== after.status) {
    await pushToPatient(
      id,
      {
        title:
          after.status === "completed" ? "Consultation scheduled" : "Your assessment is in review",
        body:
          after.status === "completed"
            ? "The clinic has been in touch to book your consultation."
            : "Dt. Sai Sowjanya is reviewing your assessment.",
      },
      { url, tag: `status-${id}` },
    );
  }
});
