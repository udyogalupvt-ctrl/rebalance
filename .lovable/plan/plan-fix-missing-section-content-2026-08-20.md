# Plan - Fix Missing Section Content

The Symptom Checker section was not visible despite being in the DOM. This was caused by two main issues:
1. **Hydration Conflict:** The `RootShell` component was incorrectly wrapping the entire page in `<html>` and `<body>` tags, which are already provided by `index.html`. This caused a React hydration error that potentially blocked the rendering of components below the initial view.
2. **Hero Layout:** The Hero section used a fixed `h-[100svh]`, which on some viewports might have caused layout issues with subsequent relative sections.

## Proposed Changes

### 1. Fix Root Component Structure
- Update `src/routes/__root.tsx` to remove redundant `<html>`, `<head>`, and `<body>` tags. 
- Use a React Fragment to wrap the root content.

### 2. Update Shared Components
- Review `Reveal.tsx` and `SectionWrapper.tsx` to ensure they don't have CSS properties that hide content (like `overflow: hidden` combined with `height: 0` or incorrect animation initial states).
- Verified that `SectionWrapper` is using the correct background tokens and its inner container has proper padding.

### 3. Verify Layout
- Ensure the Hero section allows content to flow naturally after it.
- Force a re-render of the application to clear any state issues.

## Technical Details
- Hydration fix: Move `<HeadContent />` and `<Scripts />` to be handled correctly by the framework without wrapping in extra tags.
- Animation fix: Ensure `Reveal` components have a safe fallback if animations fail to trigger.

## Verification
- Capture screenshots of the Symptom Checker section directly.
- Verify visibility via Playwright `element.is_visible()`.
- Check for console errors related to hydration.
