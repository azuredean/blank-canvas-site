# Plan: Simple white placeholder page

## Goal
Replace the current placeholder home page with a minimal, empty white page so the project builds and previews cleanly. The real website assets will be pulled from GitHub later.

## What will change
- `src/routes/index.tsx`: remove the placeholder image and `data-lovable-blank-page-placeholder` attribute, render a plain white full-screen page with no content or a single subtle centered line.
- Keep the root layout, router, and styling system untouched.

## Out of scope
- No navigation, sections, images, animations, backend, or auth.
- No design-direction exploration; the brief is explicitly "white and nothing needed."

## Verification
- Run a typecheck/build to confirm the page compiles.
- Open the preview to confirm it shows a clean white screen.
