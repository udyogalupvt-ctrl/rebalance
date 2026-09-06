# Plan - Fix Assessment CTA & Add FAQ Section

Implement the FAQ section below the Assessment CTA and fix the Assessment CTA's visibility in light mode.

## Proposed Changes

### 1. Fix Assessment CTA
- Update `src/components/home/AssessmentCTA.tsx` to use a dark background in both themes to ensure the "on-dark" text remains readable.
- Set background to `bg-[#1F4D3D]` (primary dark green) explicitly in light mode to maintain contrast, or just ensure it stays dark.

### 2. Add FAQ Data
- Update `src/data/content.ts` to include the `faqs` array with the 6 items provided.

### 3. Create FAQ Component
- Create `src/components/home/FaqSection.tsx`.
- Use `SectionWrapper`, `SectionHeading`, and `Reveal`.
- Implement a 2-column grid layout for desktop (5fr 7fr).
- Left column: Sticky heading block with a "Help Card" containing a WhatsApp link.
- Right column: shadcn Accordion with custom item styling (rounded cards, plus-to-cross icon rotation, left accent bar on open).
- Include JSON-LD `FAQPage` schema.

### 4. Integration
- Update `src/routes/index.tsx` to include `FaqSection` below `AssessmentCTA`.

## Technical Details

### Accordion Styling
- **Trigger**: Flex row with 600 weight text and a 32px circular icon containing a rotating Plus icon.
- **Icon Animation**: 135deg rotation and background color change on open.
- **Item**: Rounded card with 20px radius, soft shadow, and a 3px left accent bar (vertical) when open.
- **Content**: Separated from the question by a 1px border rule.
- **Transitions**: 350ms cubic-bezier for expanding/collapsing and icon rotation.

### Sticky Heading
- `position: sticky; top: 120px;` (to clear the 96px header + 24px breathing room).
- Only active on desktop (≥1024px).

### Accessibility & SEO
- Radix Accordion provides base ARIA.
- Ensure 4.5:1 contrast for all text.
- WhatsApp button uses #25D366 (or darker #1EBE5D if needed).
- JSON-LD script for FAQ structured data.

### Responsive Adjustments
- Mobile (<1024px): Single column, static heading.
- Tablet/Mobile: Adjusted paddings and font sizes for accordion items.
