# GoRebalance

Clinical nutrition and gut health practice site for **Dt. N. Sai Sowjanya**,
Kakinada, Andhra Pradesh — with a patient assessment funnel, an application
tracking page, and an installable admin panel.

Designed and developed by [Dream Team Services](https://thedreamteamservices.com).

---

## Stack

- React 19 + TypeScript, Vite
- TanStack Router (file-based routes in `src/routes`)
- Tailwind CSS v4, with the colour system in `src/styles/tokens.css`
- Firebase — Auth, Firestore, Cloud Messaging
- Cloudinary for payment screenshot uploads

## Development

Requires Node.js 20+.

```sh
npm install
npm run dev          # http://localhost:8080
```

Copy `.env.example` to `.env` and fill in the Firebase and Cloudinary values
before running. The app will not connect to anything without them.

```sh
npm run build        # production build to dist/
npm run preview      # serve the built output
npx tsc --noEmit     # typecheck
npx eslint .         # lint
```

## Structure

| Path | Contents |
| --- | --- |
| `src/routes` | File-based routes. `admin.*` are the panel; the rest are public. |
| `src/pages` | Page components the routes render. |
| `src/components` | Shared and per-section components. |
| `src/data/content.ts` | Site copy, programs, testimonials, contact details. |
| `src/styles/tokens.css` | The single source of colour truth. Read the header before changing a colour. |
| `src/lib` | Firebase, CMS helpers, CSV export, PWA and push. |
| `functions/` | Cloud Functions for push notifications. Not deployed. |
| `firestore.rules` | Security rules. **Not deployed** — see the checklist. |

## Admin panel

Lives at `/admin`. Access is granted by hand:

1. Firebase Console → Authentication → add the user.
2. Copy their UID.
3. Firestore → `config` → `admins` → `uids` array → add the UID.

The application only ever *reads* that document, and the rules deny writes to
`config/**` for everyone — so a stolen admin session cannot grant itself a
second account.

The panel is installable as an app (Chrome, Edge, Android; iOS via Share → Add
to Home Screen) and raises notifications for new assessments and enquiries.

## Before launch

See **[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)** — it lists the content still
needed and the one deployment step that matters most.
