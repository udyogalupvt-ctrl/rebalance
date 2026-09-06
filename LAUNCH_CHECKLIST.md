# GoRebalance — launch checklist

Status as of 6 September 2026.

The **application is functionally complete and verified**. What stands between
it and a client demo is real content and one deployment step. Everything below
is something only you or the client can supply or decide.

---

## 1. Blockers — the site does not work correctly without these

### 1.1 Deploy the Firestore security rules ⚠️ MOST IMPORTANT

```bash
firebase deploy --only firestore:rules
```

Until this runs, the database is open to the world. Verified against the live
project: an unauthenticated caller can read and write `assessments`,
`enquiries`, `treatments` and `config`. That means:

- every patient's name, phone, address, medical history and payment
  screenshot is publicly readable;
- anyone can add their own UID to `config/admins` and become an admin.

`firestore.rules` is written and covers every collection, including the
tracking mirror and push tokens. It has **not** been deployed.

### 1.2 Real payment details

`src/components/assessment/steps/StepPayment.tsx`

| Constant | Current value | Needs |
| --- | --- | --- |
| `UPI_ID` | `"example@upi"` | The clinic's real UPI ID |
| `CONSULTATION_FEE` | `"₹ —"` | The confirmed fee |

Patients currently reach the payment step, see a fake UPI ID and no amount,
and cannot pay. This blocks every booking.

### 1.3 Consultation prices

`src/data/content.ts` — all three tiers in `consultationTiers` are `"₹ —"`.

---

## 2. Content the client must provide

| Item | Where | Count |
| --- | --- | --- |
| Photography | 10 files | 38 stock Unsplash images |
| Videos | `VideoHighlights.tsx`, `content.ts` | placeholder posters and URLs |
| Testimonials | `TestimonialGrid.tsx`, `content.ts` | 16 placeholder quotes |

**Testimonials need written consent.** These are health claims from named
individuals; do not publish any without explicit written permission.

Also confirm with the client:

- the "500+ Lives Rebalanced" figure in the hero and the stats row;
- the footer sentence "so the results hold without the plan" — it reads as an
  error, since the practice sells plans.

---

## 3. Legal — needs professional review

`/privacy`, `/terms` and `/disclaimer` now exist and describe what the
application genuinely does (the exact fields collected, Firestore, Cloudinary,
the minimal tracking record).

**They have not been reviewed by a lawyer.** Each page says so at the foot.
Have them checked against the Digital Personal Data Protection Act, 2023
before launch.

---

## 4. Security

### 4.1 The service account key

`rebalance-9ae91-firebase-adminsdk-*.json` was sitting unignored in the
project root. It grants **full admin access and bypasses every security rule**.

- It is now in `.gitignore`.
- It must never go in the website: anything the browser can read ships in the
  JavaScript bundle.
- It is inside a OneDrive-synced folder. If that folder is shared with anyone,
  treat the key as compromised and rotate it:
  Firebase Console → Project settings → Service accounts.
- The Cloud Functions in `functions/` do **not** need it — a deployed function
  already runs as the project.

### 4.2 Admin access

Admins are granted by hand: Firestore → `config` → `admins` → `uids` array.
The application only ever reads that document; `firestore.rules` denies writes
to `config/**` for everyone, so a stolen admin session cannot add a second
account.

---

## 5. Data hygiene before the demo

Firestore currently holds a mix of QA records and at least one genuine
submission (from "Udyogalu", with a real payment screenshot). Nothing has been
deleted.

Decide what to keep, then remove the rest via the admin panel — assessments
support bulk select and delete, which also removes the tracking record.

---

## 6. Notifications — what works now, and what needs a deploy

**Working today, no server required:**

| Event | Who is told | When |
| --- | --- | --- |
| Patient submits an assessment | Admin | While the panel is open (incl. a background tab or the installed app) |
| Patient sends an enquiry | Admin | Same |
| Admin verifies / rejects a payment | Patient | While their tracking page is open |
| Admin moves an assessment on | Patient | Same |

The patient enables this with "Notify me when this changes" on the tracking
page. Their tracking page also updates live without a refresh.

**Needs a deploy — notifications when the app is fully closed:**

```bash
cd functions && npm install
firebase deploy --only functions
```

Requires the Blaze (pay-as-you-go) plan. Cost at this volume is effectively
zero, but the plan change is required. Both directions are already written and
the client side is wired: admin devices register in `adminPushTokens`, patient
devices in `patientPushTokens`.

Browsers only allow notifications on **HTTPS** (localhost excepted), so this
must be tested on the deployed site, not a LAN IP.

---

## 7. Version control

The repository's `.git` directory disappeared mid-session and the history is
gone. Nothing is committed.

- All work is on disk.
- A copy is at `scratchpad/BACKUP-gorebalance`, outside OneDrive.
- Check the OneDrive online recycle bin (onedrive.com → Recycle bin, and
  Settings → Restore your OneDrive) — deleted folders are kept 30 days.
- Consider moving the project **out of OneDrive**; syncing clients are a known
  cause of this failure.

---

## What has been verified

Measured in a real browser, not read from source.

| Area | Result |
| --- | --- |
| Public site responsiveness | 0 overflow, 0 console errors — 11 routes × 6 widths (360–1920) × 2 themes, full-page scroll |
| Admin responsiveness | 0 overflow, 0 console errors — 7 routes × 6 widths × 2 themes |
| Contrast | No real failures. ~40 audit flags were all traced to the tool being unable to see through the header's gradient scrim; pixel sampling shows them passing (some at 12:1) |
| Internal links | 17 unique links, **0 broken** |
| Production build | 14/14 — every route renders, service worker activates, admin signs in, zero console errors |
| Assessment submission | End to end: form → Firestore → admin, with the correct document shape |
| Application tracking | 16/16, including proof that no medical data, address, email or screenshot reaches the public page |
| Payments admin | 10/10 — verify/reject round trip, filters, lightbox, CSV |
| Enquiries | 6/6 — arrival → unread badge → drawer → marked read |
| Content managers | Treatments round trip verified: admin edit appears on the public page |
| PWA | 14/14 — manifest, icons, service worker, install prompt |
| Notifications | Verified live: a public enquiry raised a real notification in the open admin |
| Gates | TypeScript, ESLint and production build all clean |
