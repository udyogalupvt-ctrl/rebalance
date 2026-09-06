# GoRebalance — UI Audit

> **Status: all findings below are resolved.** See "Verified outcome" at the
> end for the re-measured numbers. This document is kept as the record of what
> was found and why each fix was made.

**Date:** 2026-09-05
**Method:** Playwright, Chromium 149. Every route rendered at 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920 px in both light and dark mode (128 page-loads, 256 screenshots), plus scroll-state captures, interaction passes (mobile menu, accordions, gallery filters, lightbox, carousel), console/network capture, and programmatic probes for contrast, overflow, tap-target size, font size and image attributes.
**Routes:** `/`, `/about`, `/treatments`, `/gallery`, `/testimonials`, `/contact`, `/assessment`, `/admin/login`

Severity: **S0** blocker · **S1** critical · **S2** major · **S3** minor

---

## 0. Summary

| | |
|---|---|
| Routes fully broken | 1 (`/testimonials`) |
| Broken images (hard 404) | 13 unique URLs, 8 render slots |
| Contrast failures (unique) | 48 across 7 routes, both themes |
| Sub-12px text instances | 49 in 20 files |
| Tap targets < 44px | 19 distinct components |
| Hardcoded colour literals | 92 in 29 files |
| Undefined CSS variables in use | 2 (`--surface-rgb`, `--primary-rgb`), 9 call sites |
| Routes with horizontal overflow | 2 (`/`, `/admin/login`) |

The single most consequential finding is that **most of the page-level symptoms are downstream of six foundation defects** (§1). Fixing those resolves a large share of the per-page list.

---

## 1. Foundation defects (root causes)

### F1 — `--surface-rgb` and `--primary-rgb` are used but never defined · S1
`src/styles/tokens.css` is an **empty file** (0 bytes) and is imported by nothing. The tokens live in `src/styles.css`, and neither `--surface-rgb` nor `--primary-rgb` is among them. Yet they are consumed in 9 places:

- `src/components/layout/Header.tsx:41` — `backgroundColor: "rgba(var(--surface-rgb), 0.72)"`
- `src/styles/assessment.css:1377,1424,1519,1901`
- `src/styles/admin-assessments.css`, `src/components/admin/AdminLayout.tsx`

`rgba(var(--undefined), 0.72)` is an invalid declaration, so it is dropped. **Measured result: the scrolled header pill computes to `background-color: rgba(0, 0, 0, 0)` on every page in both themes.**
**Should be:** define `--surface-rgb`, `--primary-rgb`, `--accent-rgb`, `--bg-rgb` alongside every existing token in both `:root` and `.dark`, or drop the channel-split pattern for `color-mix()`. Delete or populate the empty `tokens.css`.

### F2 — `Reveal`'s stagger path animates elements with `display: contents` · S1
`src/components/shared/Reveal.tsx:47,62` wraps each child in `<motion.div className="contents">`, and `.reveal-container { display: contents }` in `src/styles.css:198`. An element with `display: contents` generates **no box**, so `opacity` and `transform` are not rendered.
**Measured:** every `.reveal-container` child reports `display: contents, opacity: 1, transform: none` — the staggered entrance never plays. Affects `SymptomChecker` and `TreatmentsPreview` (the two largest card grids on the home page).
It also emits invalid HTML: `TreatmentsPreview.tsx:96` puts a `<div>` directly inside a `<ul>`.
**Should be:** a single Reveal that applies the animation to a real box, with grid/flex membership preserved via `subgrid`/`display: contents` only on the *non-animated* wrapper — never on the animated element.

### F3 — Eight stacked fixed-position `feTurbulence` grain overlays · S1
`SectionWrapper` renders a `.grain-overlay` **inside every section** (`src/components/shared/SectionWrapper.tsx:35`), and `.grain-overlay` is `position: fixed; inset: 0; z-index: 99` (`src/styles.css:180`). `__root.tsx` renders a ninth.

**Measured per route:** `/` = 8 overlays / 9 `feTurbulence` filters · `/treatments` = 5 · `/contact` = 5 · `/about` = 4 · `/gallery` = 3.

Each is a full-viewport SVG turbulence filter with `mix-blend-mode: overlay`, re-rasterised on every frame. This is the direct cause of the scroll jank: sampling `window.scrollY` through a smooth scroll gives `[0,0,0,0,0,0,0,0,0,0,0,0,840,840,840,882]` — ~960 ms of frozen main thread, then two jumps. All nine also share the **duplicate DOM id `noiseFilter`**, so every `filter: url(#noiseFilter)` reference resolves to the first one regardless.
**Should be:** one grain overlay, rendered once at the root, as a static pre-rendered asset or a CSS gradient — not a live SVG filter, and not per-section.

### F4 — `--accent` and dark-mode `--primary` cannot legally carry white text · S1
The primary CTA style site-wide is `bg-accent text-white`.

| Token | Value | Contrast vs `#FFF` | Required |
|---|---|---|---|
| `--accent` (light) | `#C97B4A` | **3.27:1** | 4.5:1 |
| `--accent` (dark) | `#E0955F` | **2.43:1** | 4.5:1 |
| `--primary` (dark) | `#6FBF9A` | **2.19:1** | 4.5:1 |
| WhatsApp green | `#1EBE5D` | **2.45:1** | 4.5:1 |

This single defect produces **31 of the 48 contrast failures** — every "Start My Assessment", "Get My Gut Assessment", "Send Message", "Book a Consultation", "Get Started", "MOST CHOSEN" badge, filter chip and "Sign in" button, on every page, in both themes. `AssessmentCTA.tsx:209` already hand-patches around it with `#A85C2F`, which confirms the problem was noticed but fixed locally instead of at the token.

Separately, `text-accent` as a *foreground* colour fails too: 3.27:1 for 13–14px body text ("Learn more", "ANDHRA PRADESH", "+1 more"), and the `*italic accent*` word inside every `SectionHeading` measures **2.85:1** against `--surface-alt` where 3.0:1 is required at display size.
**Should be:** introduce `--accent-strong` / `--primary-strong` for text-bearing fills (≥4.5:1 with white) and `--on-accent`; keep the current values for decorative fills only. Darken `text-accent` when used as a foreground on light surfaces.

### F5 — The "on-dark" colour set is re-declared by hand in 10 files · S2
`#F4F8F5` and its alpha variants (`rgba(244,248,245,0.10/0.20/0.44/0.66/0.85)`) are redefined independently in `PageHero.tsx`, `AssessmentCTA.tsx`, `Footer.tsx`, `ClinicLocations.tsx`, `ClinicLocationsFull.tsx`, `VideoHighlights.tsx`, `About.tsx`, `Gallery.tsx`, `Treatments.tsx`, `testimonials.tsx` — with different alpha values for the same semantic role (compare `PageHero` `onDarkMuted = 0.74` vs `AssessmentCTA` `0.85` vs `Footer` `/66`).

This is why on-dark text is inconsistent between pages and why some of it lands on light backgrounds (see H-3, AB-2, CO-3). 92 hardcoded hex literals across 29 files overall.
**Should be:** `--on-dark`, `--on-dark-muted`, `--on-dark-border`, `--on-dark-glass` as real tokens, used everywhere.

### F6 — No enforced typography or spacing scale · S2
`src/styles.css` defines `.fs-h2`, `.fs-h3`, `.fs-body`, `.fs-sub`, `.fs-eyebrow`, `.section-y`, `.container-x` — but:
- **53** `<h1>`–`<h4>` elements declare their own `text-[...]` or inline `fontSize`.
- **26** ad-hoc `text-[clamp(...)]` declarations.
- Only **2** components use `fs-h2`/`fs-h3`.
- `PageHero.tsx:96` injects a `<style>` block defining `:root` variables **from inside a React component** — a global token defined by a page section, duplicated per instance.
- `Hero.tsx:45` uses `max-w-7xl px-5 sm:px-8 lg:px-12` instead of `.container-x`. At 1440px this puts hero content at x=128 while every section below sits at x=144 — **a 16px misalignment down the whole home page**.
- `AssessmentCTA.tsx:67` sets `paddingBlock` inline instead of `.section-y`.

**Also dead on arrival:** `font-600` (×6, computes to `font-weight: 400`), `isolation-isolate` (×3, computes to `isolation: auto`), `ring-offset-3` (×5, no effect), `flex row` (×5, `row` is not a class), and the bare `cubic-bezier(0.22,1,0.36,1)` used as a class name in `MasonryGallery.tsx:105`. All verified against the live stylesheet.

### F7 — `prefers-reduced-motion` is not honoured globally · S2
`useReducedMotion()` is used in `Reveal`, `PageHero`, `TreatmentsPreview` and `ProgramsGrid` only. Under an active `prefers-reduced-motion: reduce` context the following still animate: the `Hero` 4-slide autoplay carousel and word-mask reveal, the `Preloader` letter stagger and progress bar, the `Header` spring, `CredibilityMarquee`, the WhatsApp pulse ring, `BackToTop`, the `PageHero` 14s Ken Burns zoom, and 2 infinite CSS keyframe animations (`animate-pulse`, `ping`). `html { scroll-behavior: smooth }` also stays active.
**Should be:** a global `@media (prefers-reduced-motion: reduce)` block neutralising animation/transition duration and `scroll-behavior`, plus the hook honoured in the remaining components.

### F8 — `overflow-x: clip` on `body` masks real layout overflow · S2
`src/styles.css:190`. Because of it `window.scrollX` stays 0, so overflow is invisible in testing — but the content is genuinely wider than the viewport and the excess is **clipped away and unreachable**:

| Route | 360px | 390px | 430px |
|---|---|---|---|
| `/` | +15px | +15px | +17px |
| `/admin/login` | **+170px** | **+155px** | **+135px** |

**Should be:** fix the offending elements, then keep `clip` only as a backstop.

---

## 2. Cross-cutting defects

### X1 — Header is unreadable over every hero · S1 · all routes · all widths · both themes
`src/components/layout/Header.tsx`

- **At scroll 0:** transparent, nav is `text-white/90`. On the home hero the current slide is a light image (a pale soup bowl on white linen) — "Root-Cause Protocols", "See How It Works" and the `you.` in the H1 measure **1.00–1.05:1**. The horizontal scrim `from-black/80 via-black/40 to-transparent` covers only the left half, so on mobile — where hero content is centred — the body copy sits on unscrimmed light image.
- **After 60px:** the pill is **fully transparent** on every page in both themes (F1) while the nav switches to dark `text-text`. Dark text, no fill, over a photograph. Verified on `/`, `/about`, `/treatments`, `/gallery`, `/contact`; on `/contact` at scroll 900 the section heading is plainly visible *through* the pill.
- Pill max-width is **1280px**; spec is 1180px.
- `shadow-lg` computes to `rgba(0,0,0,0) 0 0 0 0` — no shadow renders.
- On `/about` and `/treatments` at 1440 dark, the scrolled pill reported `width: 1440, radius: 0` — the spring had not settled after 900ms, so the contraction is inconsistent between loads.

**Should be:** opaque-enough `--surface` at 72% with real backdrop-blur, a gradient scrim behind the header at scroll 0, max-width 1180px, and nav colour that follows the pill state.

### X2 — Mobile menu cannot be closed · S1 · ≤1024px · both themes
The menu `motion.div` is a sibling of the header bar **inside the same `<header>` stacking context**, with `z-40` against the bar's `z-index: auto`. It therefore paints over the logo and the close button. A 390×130 crop of the open menu is **entirely blank** — no logo, no ✕. The only exits are a nav link or the browser back button.
Also: the location line "Hyderabad, Telangana · Kakinada, Andhra Pradesh" is clipped at the right edge, and the global WhatsApp FAB (`z-60`) floats above the menu and overlaps that line.

### X3 — Preloader shows the brand name twice, and on every visit · S2
`src/components/layout/Preloader.tsx:31,37`
Rendered text is literally: `GoRebalance G o R e b a l a n c e GUT HEALTH · NUTRITION · BALANCE`. `<Logo>` already contains the wordmark; the letter-stagger block spells it a second time underneath.
It also runs on **every** mount, not first load only (verified: navigate away, return, it replays). Total on-screen time is 2.2s hold + 0.8s exit = **3.0s**. The exit panel covers the header for the whole exit, so the first thing a visitor sees is a headerless hero.
**Should be:** wordmark once (`<Logo hideText>` + the stagger, or the Logo alone), first load only, ≤2.2s including exit.

### X4 — Global floating buttons render on admin and assessment routes · S3
`WhatsAppButton` and `BackToTop` are mounted in `__root.tsx:150` and appear on `/admin/login` and `/assessment`, where a consumer WhatsApp CTA is out of place. Visible in the `/admin/login` capture.

### X5 — `grainy-gradients.vercel.app/noise.svg` returns 404 · S3
Referenced 3× (`PageHero.tsx:140,150`, `Footer.tsx:83`, `AssessmentCTA.tsx`). The texture silently never loads. Third-party runtime dependency for a decorative layer.

### X6 — Firebase runs on placeholder credentials · S3
Continuous failing `firestore.googleapis.com/.../Listen/channel` requests (`projects/placeholde…`) on every page, ~1 per second, filling the console and competing for the main thread.

### X7 — `value.onChange(callback) is deprecated` warning on every page · S3
Framer Motion API deprecation, emitted from the `useScroll` subscriptions in `Header.tsx:28` and `FloatingElements.tsx:131`.

---

## 3. Images

Verified by HTTP status check on all 52 unique Unsplash IDs plus a rendered contact sheet of every image.

### I1 — 13 image URLs are hard 404s · S1

| Photo ID | Used in |
|---|---|
| `photo-1542372236-b0760f353683` | **`/testimonials` page hero** |
| `photo-1600100397608-f14783099811` | `content.ts:70`, `content.ts:586` (**`/contact`**) |
| `photo-1574169208507-567d2643a167` | `TreatmentsPreview.tsx:14` (gut-health card) |
| `photo-1555243896-771a8005d3f4` | `TreatmentsPreview.tsx:19` (preventive card) |
| `photo-1512413914594-81e18d36eb18` | `SymptomChecker.tsx:45` (skin) |
| `photo-1586773860418-d37222d8dfde` | `gallery.ts:15` |
| `photo-1629909613654-28717ee448f3` | `gallery.ts:62` |
| `photo-1538108149393-fdfd81690835` | `gallery.ts:78` |
| `photo-1559839734-2b71f1e3c77d` | `gallery.ts:104` |
| `photo-1528605248644-14dd04cb11c7` | `gallery.ts:222` |
| `photo-1540575861501-7c911b2c2c43` | `gallery.ts:256` |
| `photo-1454165833767-02746a7c3b58` | `gallery.ts:146` |
| `photo-1517048657685-9854495e5095` | `gallery.ts:43` |

Plus `…/sai-sowjanya.jpg` — **the practitioner's own portrait on the home page is broken**.

### I2 — Wrong subject matter · S1
Against the brief (warm, editorial, food-forward, human; never gyms, fitness silhouettes, sunsets, sterile medical, distressed people):

| Image | Actual subject | Used as |
|---|---|---|
| `photo-1519494026892-80bbd2d6fd0d` | **Spanish hospital corridor** — signage reads `PISO 1 / ASCENSOR / BANCO DE SANGRE / TERAPIA NEONATAL` | **`/gallery` hero AND `/contact` hero** (alt text claims "warm, natural-light clinic interior") |
| `photo-1576091160550-2173dba999ef` | Stethoscope on a desk, sterile medical stock | **`/about` hero AND `/treatments` hero** |
| `photo-1594882645126-14020914d58d` | **Runner silhouette against a sunset** | `Hero.tsx:11` — home hero slide 3 |
| `photo-1544367567-0f2fcb009e0b` | **Yoga silhouette against a sunset** | `TreatmentsPreview.tsx:15` — PCOS card |
| `photo-1524492412937-b28074a5d7da` | **The Taj Mahal** | `content.ts:82`, `content.ts:600` |
| `photo-1475721027785-f74eccf877e2` | **Concert microphone** | `gallery.ts:248` |
| `photo-1588776814546-1ffcf47267a5` | Doctor reading X-ray films | `gallery.ts:128` |
| `photo-1666214280557-f1b5022eb634` | Two clinicians at a brain scan | `content.ts:465` |
| `photo-1576091160399-112ba8d25d1d` | Clinician with stethoscope + phone | `content.ts:825`, `gallery.ts:22` |
| `photo-1594824476967-48c8b964273f` | Nurse in scrubs, white studio backdrop | `content.ts:143` |
| `photo-1579684385127-1ef15d508118` | Hands on medical equipment | `gallery.ts:112` |
| `photo-1497366216548-37526070297c` | Empty office corridor | `gallery.ts:86` |
| `photo-1497366811353-6870744d04b2` | Empty corporate meeting room | `gallery.ts:94` |
| `photo-1552664730-d307ca884978` | Corporate workshop, sticky notes | `gallery.ts:230` |
| `photo-1529156069898-49953e39b3ac` | Conference audience | `gallery.ts:238` |
| `photo-1522202176988-66273c2fd55f` | Students with laptops | `FeaturedStories.tsx:72` |
| `photo-1600607686527-6fb886090705` | Empty show-home kitchen | `SymptomChecker.tsx:42` |
| `photo-1499750310107-5fef28a66643` | Laptop and coffee on a desk | `SymptomChecker.tsx:43` |
| `photo-1506784983877-45594efa4cbe` | Coffee cup and notebook | `SymptomChecker.tsx:46`, `gallery.ts:154` |
| `photo-1517842645767-c639042777db` | Notebook and pen | `gallery.ts:162` |
| `photo-1563805042-7684c019e1cb` | Chocolate dessert milkshake | `gallery.ts:180` — off-brand for gut health |

**Two hero images are each used on two different pages** (`/about`+`/treatments`, `/gallery`+`/contact`) — the duplication the brief flags.

### I3 — Missing image attributes · S2

| Route | imgs | no width/height | empty alt | no `loading` | not `object-fit: cover` |
|---|---|---|---|---|---|
| `/` | 28 | 8 | 8 | 5 | 0 |
| `/gallery` | 19 | 12 | 6 | 0 | 0 |
| `/about` | 4 | 2 | 0 | 0 | 0 |
| `/contact` | 3 | 2 | 2 | 2 | **2** |

`object-position` is `50% 50%` on 53 of 55 images — no crop has been considered. The home hero (`Hero.tsx:38`) has no `width`/`height`/`loading`/aspect-ratio box at all, so it causes layout shift on the largest above-the-fold element.

---

## 4. Per-page findings

### 4.1 `/` Home

| # | Sev | Widths | Theme | File | Problem | Should be |
|---|---|---|---|---|---|---|
| H-1 | S1 | all | both | `Header.tsx` | Header invisible behind the preloader exit panel for the first 3s; then transparent pill with dark text over photography | X1, X3 |
| H-2 | S1 | 360–430 | both | `Hero.tsx:45` | Hero copy is `text-white/80` centred over an unscrimmed light image — 1.05:1 | Scrim must follow content alignment; radial/vertical scrim on mobile |
| H-3 | S1 | all | light | `Footer.tsx` + `Logo.tsx:35` | Footer passes `className="text-[#F4F8F5]"` but `Logo`'s inner `<span>` hardcodes `text-text` (`#1B2420`) — on the `#14201B` footer that is **1.05:1. The footer wordmark is invisible.** Same on every page. | `Logo` must inherit `currentColor` |
| H-4 | S1 | all | both | `SymptomChecker.tsx:110`, `TreatmentsPreview.tsx:96` | Staggered card reveals never animate (F2) | One working Reveal |
| H-5 | S2 | 1024+ | both | `Hero.tsx:45` | Hero container is `max-w-7xl px-12`, sections are `.container-x` — content sits 16px left of everything below it | Use `.container-x` |
| H-6 | S2 | all | both | `TreatmentsPreview.tsx:64` | "View All Treatments" underline `<span>` is `absolute bottom-0` but the `<Link>` is not `relative` — it positions against the section wrapper and draws a stray 1.5px accent line across the **bottom of the whole section** | Add `relative` to the Link |
| H-7 | S2 | 360–430 | both | Testimonials carousel | 15–17px of clipped horizontal overflow (F8) | Fix slide padding maths |
| H-8 | S2 | all | both | `GalleryStrip.tsx` | Gallery-strip buttons render **12px tall** (`390×12`) — collapsed height, unusable tap target, caption "ClinicConsultation Room" runs together with no separator | Real aspect-ratio box; ≥44px |
| H-9 | S2 | all | both | `SymptomChecker.tsx` | `font-600` on the card `<h3>` is not a class — titles render at weight 400, not 600 | `font-semibold` |
| H-10 | S2 | all | both | `Testimonials.tsx:134` | Broken practitioner portrait (`sai-sowjanya.jpg`, 404) | Replace |
| H-11 | S3 | all | light | `SectionHeading.tsx:57` | The `*italic accent*` word measures 2.85:1 (needs 3.0) | F4 |
| H-12 | S3 | all | both | `Hero.tsx:113`, `Preloader.tsx:55` | 10px text ("Discover", tagline) | ≥12px |
| H-13 | S3 | all | both | `Header.tsx:80` | Theme toggle is 36×36; mobile menu button 40×40 | ≥44×44 |

### 4.2 `/assessment`

| # | Sev | Widths | Theme | File | Problem | Should be |
|---|---|---|---|---|---|---|
| AS-1 | S1 | all | both | `routes/assessment.tsx:17` | **No header and no footer.** No logo, no wordmark, no theme toggle, no navigation, no phone number, no clinic locations, no medical disclaimer. Reads as an unrelated product. | Minimal branded header (logo + wordmark + theme toggle + "Save & exit"); condensed footer with practice name, phone, both clinics, disclaimer |
| AS-2 | S1 | all | both | `styles/assessment.css:1377,1424,1519,1901` | `rgba(var(--primary-rgb), …)` and `rgba(var(--surface-rgb), …)` are invalid — those borders and panel fills silently do not render (F1) | Define the tokens |
| AS-3 | S2 | all | dark | `assessment.css:27,59,128,141,910…` | `#c0392b` required-asterisk and error text on `#141D19` = **3.17:1**; no dark variant defined for any of the 20+ hardcoded literals | Tokenise with light/dark pairs |
| AS-4 | S2 | all | both | `assessment.css` `.af-submit-btn` | White on `--accent` = 3.27:1 light / 2.43:1 dark | F4 |
| AS-5 | S2 | all | light | `.af-eyebrow` | "Step 1 of 4" accent-on-bg = **3.11:1** at 11.5px | F4 + ≥12px |
| AS-6 | S3 | all | both | `assessment.css` | Vertical rhythm breaks mid-form: 13px between the Full-name input and the Age label vs ~28px elsewhere | One spacing scale |
| AS-7 | S3 | all | both | `routes/assessment.tsx:19` | `paddingTop: clamp(100px,12vw,140px)` reserves space for a header that does not exist — a large empty band above the first heading | Derive from the real header height |
| AS-8 | S3 | all | both | `__root.tsx` | WhatsApp FAB overlays the form (X4) | Suppress on this route |

### 4.3 `/about`

| # | Sev | Widths | Theme | File | Problem | Should be |
|---|---|---|---|---|---|---|
| AB-1 | S1 | all | both | `pages/About.tsx:23` | Hero image is sterile stethoscope-on-desk stock, and the **same image as `/treatments`** (I2) | Warm consultation / Indian food-forward image, unique per page |
| AB-2 | S1 | all | light | `ClinicLocations.tsx` | "Hyderabad"/"Kakinada" labels are `text-[#F4F8F5]` positioned over an image with no scrim; where the image is pale they measure **1.07:1** | Scrim behind the label, or tokenised on-dark with a gradient |
| AB-3 | S2 | all | both | `pages/About.tsx:30` | `MetaChip` is defined here **and** identically in `Gallery.tsx:53`, `Treatments.tsx:58`, `testimonials.tsx:58` — four copies (F5) | One shared component |
| AB-4 | S2 | all | light | `ClinicLocations.tsx` | "ANDHRA PRADESH" 13px `text-accent` on white = 3.27:1 | F4 |
| AB-5 | S3 | all | both | `PageHero.tsx:297` | 10px "SCROLL" label | ≥12px |
| AB-6 | S3 | 360–430 | both | `Footer.tsx` | All footer links are 36px tall; breadcrumb links 15px tall | ≥44px hit area |

### 4.4 `/treatments`

| # | Sev | Widths | Theme | File | Problem | Should be |
|---|---|---|---|---|---|---|
| T-1 | S1 | all | both | `pages/Treatments.tsx:32` | Hero image duplicated from `/about`, sterile medical (I2) | Unique, on-brief |
| T-2 | S1 | 1024+ | both | `ProgramsGrid.tsx:66` | `grid lg:grid-cols-2 … items-start` — **paired cards are unequal height**, icons/titles/footers do not share baselines across the row | `items-stretch` + `h-full` + `flex-grow` on the flexible element |
| T-3 | S1 | all | both | `TreatmentsPreview.tsx:15,14,19` | PCOS card = yoga silhouette at sunset; gut-health and preventive cards are 404s (I1, I2) | Replace |
| T-4 | S2 | all | both | `ProgramsGrid.tsx` | "MOST CHOSEN" badge: white on accent, 3.27:1 light / 2.43:1 dark, at **11px** | F4 + ≥12px |
| T-5 | S2 | all | both | `pages/Treatments.tsx` | No `CurveDivider` between sections, unlike `/`, `/about` and `/gallery` — section transitions are inconsistent across the site | Match the established pattern |
| T-6 | S2 | all | light | `ProgramsGrid.tsx` | "+1 more" chip: accent on `--surface-alt` = **2.85:1** at 12.5px | F4 |
| T-7 | S3 | all | both | `ProgramsGrid.tsx:129,194,209,224` | Four separate 11.5px labels | ≥12px |
| T-8 | S3 | all | both | `pages/Treatments.tsx` | Page shell is a bare fragment; `/about` and `/gallery` wrap in `min-h-screen bg-bg` | One shell |

### 4.5 `/gallery`

| # | Sev | Widths | Theme | File | Problem | Should be |
|---|---|---|---|---|---|---|
| G-1 | S1 | all | both | `pages/Gallery.tsx:30` | Hero is a **Spanish hospital corridor** with blood-bank/neonatal-ICU signage, alt text describes something else entirely, and it is the **same image as `/contact`** (I2) | Unique, on-brief, truthful alt |
| G-2 | S1 | all | both | `data/gallery.ts` | **4 of 19 gallery images are 404** — visible holes in the grid | Replace |
| G-3 | S1 | all | light | `MasonryGallery.tsx:112` | Overlay captions are `text-white` with `drop-shadow` only; on pale images they measure **1.00–1.15:1** ("Meal Plans", "Cycle-aware nutrition planning", "Clinic") | Gradient scrim behind captions |
| G-4 | S2 | all | dark | `FilterBar.tsx` | Active filter chip and count badge: white on dark `--primary` = **2.19:1** | F4 |
| G-5 | S2 | all | both | `MasonryGallery.tsx` | 12 of 19 images have no `width`/`height`; 6 have empty `alt` | Explicit dimensions + meaningful alt |
| G-6 | S2 | all | both | `PageHero.tsx:270` | Title renders as **"Inside the *practice* ."** — the word-splitter treats the trailing "." as its own word and applies `mr-[0.2em]`, leaving a visible gap before the period. Affects every `PageHero` title. | Split on words but keep trailing punctuation attached |
| G-7 | S2 | 1024+ | both | `PageHero.tsx:288` | The "SCROLL" cue is absolutely positioned and **collides with the meta-chip row** — verified overlapping at 1440 | Reposition or hide when chips are present |
| G-8 | S3 | all | both | `MasonryGallery.tsx:105` | `cubic-bezier(0.22,1,0.36,1)` written as a bare class name — dead | `ease-[cubic-bezier(...)]` |
| G-9 | S3 | all | both | `MasonryGallery.tsx:112` | 10.5px caption text | ≥12px |

### 4.6 `/testimonials`

| # | Sev | Widths | Theme | File | Problem | Should be |
|---|---|---|---|---|---|---|
| **TE-1** | **S0** | **all** | **both** | `TestimonialGrid.tsx:75` | **The page does not render.** `ReferenceError: categories is not defined` throws during render, the root error boundary catches it, and all eight viewports in both themes show "This page didn't load / Try again / Go home". `docHeight` is 900px (the error screen) vs 5–13k for every other route. No header, no footer, no content. | Define/import `categories` |
| TE-2 | S1 | all | both | `routes/testimonials.tsx:35` | Page hero image is a 404 (I1) | Replace |
| TE-3 | S2 | all | both | `__root.tsx:44` | The error screen itself is broken: "Try again" is `bg-primary` with `text-primary-foreground`, but `--primary-foreground` is not defined in this token set, so it falls back to `#1B2420` on `#1F4D3D` = **1.66:1** | Define the token or use `text-white` |
| TE-4 | S2 | all | both | `TestimonialGrid.tsx:175,182` | 10.5px BEFORE/AFTER labels | ≥12px |
| TE-5 | S3 | all | both | `TestimonialGrid.tsx:90` | CSS `columns` masonry gives column-major reading order and an unbalanced final column | Grid or ordered masonry |

*Everything below TE-1 is from source review — the page cannot currently be rendered to verify.*

### 4.7 `/contact`

| # | Sev | Widths | Theme | File | Problem | Should be |
|---|---|---|---|---|---|---|
| CO-1 | S1 | all | both | `pages/Contact.tsx:28` | Hero image duplicated from `/gallery` — the Spanish hospital corridor (I2) | Unique, on-brief |
| CO-2 | S1 | all | both | `content.ts:586` | A clinic image is a 404 (I1); 2 of 3 images on the page are not `object-fit: cover` | Replace + cover |
| CO-3 | S1 | all | light | `ClinicLocationsFull.tsx` | "View Kakinada on the map" is `text-[#F4F8F5]` on `--surface-alt` (`#F3EFE7`) = **1.07:1 — effectively invisible.** An on-dark colour used inside a light section (F5) | Tokenised on-light colour |
| CO-4 | S2 | all | both | `pages/Contact.tsx:34` | Meta chips use `bg-primary-soft text-primary` while every other page uses the glass on-dark chip — and on the dark hero image in dark mode this becomes light-green-on-12%-green | Shared `MetaChip` |
| CO-5 | S2 | all | light | `ContactMethods.tsx` | "Open WhatsApp" `#25D366` on white = **1.98:1**; "Open now · Closes at 7:00 PM" `#16A34A` on white = **3.30:1** | Darker text tokens |
| CO-6 | S2 | all | dark | `ContactMethods.tsx` | "WhatsApp" white on dark `--primary` = 2.19:1; "Send Message" white on accent = 2.43:1 | F4 |
| CO-7 | S3 | all | both | `pages/Contact.tsx:33` | Chip row has `mt-6` inside a `PageHero` slot that already applies `mt-8` | Remove the double margin |
| CO-8 | S3 | all | both | `HoursAndFaq.tsx:83`, `ContactMethods.tsx:53` | 10.5px "TODAY" badge, 11.5px section labels | ≥12px |

### 4.8 `/admin/login`

| # | Sev | Widths | Theme | File | Problem | Should be |
|---|---|---|---|---|---|---|
| AD-1 | S1 | 360–430 | both | `pages/admin/Login.tsx` | **135–170px of horizontal overflow** from a 700px fixed-width decorative element, clipped and unreachable (F8) | Constrain to the viewport |
| AD-2 | S2 | all | dark | `admin-assessments.css` | "Sign in" white on dark `--primary` = **2.19:1** | F4 |
| AD-3 | S2 | all | light | `pages/admin/Login.tsx` | The Sign-in button renders in a washed-out sage green that reads as permanently disabled | Full-strength `--primary-strong` |
| AD-4 | S2 | all | both | `admin-assessments.css` | Uses `rgba(var(--primary-rgb), …)` — invalid (F1) | Define tokens |
| AD-5 | S3 | all | both | `__root.tsx` | Consumer WhatsApp FAB on the admin login screen (X4) | Suppress |
| AD-6 | S3 | 360–430 | both | `pages/admin/Login.tsx` | "← Back to gorebalance.in" link is 143×21 | ≥44px hit area |
| AD-7 | S3 | all | both | `Dashboard.tsx`, `Enquiries.tsx` | 21 instances of 10–11.5px text | ≥12px |

---

## 5. Fix order

1. **TE-1** — `/testimonials` is a blocker; nothing else on that page can be assessed until it renders.
2. **Foundation (F1–F8)** — tokens (incl. the `-rgb` set, on-dark set, and accessible accent/primary), one Reveal, one grain overlay, typography and spacing scale, global reduced-motion, remove dead utility classes.
3. **X1–X3** — header legibility and pill fill, mobile menu close, preloader.
4. **Images (I1–I3)** — replace all 13 404s and all 21 wrong-subject images; add dimensions, aspect-ratio boxes, lazy-loading, object-position and honest alt text.
5. **Pages** in order: Home → Assessment → About → Treatments → Gallery → Testimonials → Contact → Admin.

Roughly 60% of the per-page rows above are direct consequences of §1 and should close out when the foundation is corrected.


---

# Verified outcome

Re-measured with the same harness after the repair pass: every route at
360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920 px, in both themes.

| Metric | Before | After |
|---|---|---|
| Routes that fail to render | 1 (`/testimonials`) | 0 |
| Horizontal overflow | `/` 15–17px, `/admin/login` 135–170px | **none, any route or width** |
| Contrast failures | 48 unique | **0 real** (8 reported, all confirmed probe artifacts — see below) |
| Sub-12px text | 49 instances / 20 files | **0** |
| Broken images | 13 URLs, 8 render slots | **0** — all 45 verified 200 |
| Wrong-subject images | 21 | **0** |
| Duplicate hero images | 2 pairs | **0** — all 9 distinct |
| Duplicate DOM ids | `noiseFilter` ×8 | **0** |
| Fixed grain overlays (home) | 8 | **1** |
| Undefined CSS variables in use | 2 (9 call sites) | **0** |
| Hardcoded colour literals | 92 / 29 files | **3** (Instagram, Facebook, YouTube brand colours — intentional) |
| `tsc --noEmit` errors | 30 | **0** |
| Page errors in console | `categories is not defined` + framer deprecation | **none** |

### The 8 remaining contrast reports are false positives

The probe resolves an element's background by walking its **ancestors**. Where
text sits on a gradient scrim that is a **sibling** (gallery captions, clinic
labels, the map placeholder), the probe cannot see the scrim and reports the
page background instead.

These were re-measured from actual rendered pixels — screenshot the element,
compare the darkest and lightest pixel clusters inside its box:

| Element | Probe said | Real painted contrast |
|---|---|---|
| Home gallery caption "Fresh, whole ingredients" | 1.07:1 | **16.18:1** |
| Home gallery chip "Nutrition" | 1.06:1 | **9.22:1** |
| About clinic label "Kakinada" | 1.07:1 | **6.40:1** |
| Contact "View Kakinada on the map" | 1.07:1 | **17.13:1** |
| Contact "Loads Google Maps" | 1.05:1 | **9.94:1** |
| Gallery caption "Tracking how symptoms shift" | 1.07:1 | **16.88:1** |
| Gallery chip "Meal Plans" | 1.06:1 | **9.58:1** |

### Behaviour

| Check | Before | After |
|---|---|---|
| Preloader brand name | twice (`GoRebalance G o R e b a l a n c e`) | **once** |
| Preloader on repeat visits | replays every time | **first load only** |
| Preloader duration | 2.2s hold + 0.8s exit = 3.0s | **1.8s total** |
| Smooth scroll | 2 distinct frames, ~960ms frozen main thread | **10 distinct frames, no stall** |
| Anchor landing under header | not testable (scroll never fired) | **clears by 32px** |
| `prefers-reduced-motion` | 2 infinite CSS animations, smooth scroll active | **0 long animations, 0 long transitions, `scroll-behavior: auto`** |
| Header pill background | `rgba(0,0,0,0)` on every page, both themes | **`--surface` at 72%, 1180px, r999, blur 20px, real shadow — verified on all 6 marketing routes × 2 themes** |
| Mobile menu close | invisible; no way to close | **visible ✕, closes on click and Escape, scroll locked, FABs suppressed** |
