# Plan: GoRebalance Contact Page Implementation

Build the initial Contact page featuring a hero, contact methods, and an enquiry form integrated with Firebase.

## User Review Required

> [!IMPORTANT]
> - **Firebase Configuration:** The plan includes setting up Firebase. I will need the Firebase project configuration (API Key, Auth Domain, Project ID, etc.) to make the form functional. I will use placeholder environment variable names in `src/lib/firebase.ts`.
> - **WhatsApp Integration:** The contact methods include a WhatsApp link. I will use the existing `brand.whatsapp` and `brand.phoneRaw` from `src/data/content.ts`.

## Proposed Changes

### 1. Data & Infrastructure
- **`src/data/content.ts`**: Add `contactMethods` array with data for WhatsApp, Phone, and Email.
- **`src/lib/firebase.ts`**: Initialize Firebase and export `db` (Firestore) and `storage`. Use `import.meta.env.VITE_FIREBASE_*` for configuration.

### 2. Components
- **`src/components/contact/ContactMethods.tsx`**: 
  - Grid of 3 cards (WhatsApp, Phone, Email).
  - Hover effects, method-specific accent colors, and custom top bars.
  - "Skip to assessment" glass strip below the grid.
- **`src/components/contact/EnquiryForm.tsx`**:
  - Two-column layout (Info column + Form panel).
  - Sticky info column with "What Happens Next" and privacy notice.
  - Form built with `react-hook-form` + `zod` validation.
  - Custom UI: shadcn Select, custom selectable pills for contact preference, custom checkbox.
  - Form fields: Name, Phone (Indian format validation), Email (optional), City, Topic (Select), Message (with char counter), Contact Method, Consent.
  - Firebase integration for submission.
  - Success and Error states with animations.
  - Session-based rate limiting (30s).

### 3. Page Assembly
- **`src/pages/Contact.tsx`**: 
  - Assemble `PageHero`, `ContactMethods`, and `EnquiryForm`.
  - Implement vertical rhythm with `CurveDivider` and alternating background colors (Base -> Alt -> Dark).
- **`src/routes/contact.tsx`**: Update to import and render `ContactPage` from `src/pages/Contact.tsx`.

## Technical Details
- **Form Validation:** Use `zod` for Indian mobile number validation (`/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/`).
- **Firebase Collection:** `enquiries` (fields: name, phone, email, city, topic, message, preferredContact, consent, createdAt, status: "new", source: "contact_page").
- **Styling:** Tailwind CSS with project-specific tokens.
- **Motion:** `framer-motion` for reveal staggers and form state transitions.
- **Accessibility:** Semantic HTML, ARIA labels, focus management on submit failure, and `aria-live` regions.

## Required Environment Variables
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
