# Article Share Icon Design

## Goal

Replace the temporary text marks in article sharing controls with recognizable platform and action icons so readers can scan the controls faster on desktop and mobile.

## Approved Approach

Use `react-icons` as the icon source. It provides maintained LinkedIn, X, Facebook, WhatsApp, copy, and generic share icons while allowing the existing buttons to keep their current color, hover, focus, and responsive behavior.

## Visual Behavior

- Desktop share rail remains icon-only inside the existing 44 by 44 pixel circular controls.
- Mobile controls use the same icons followed by their existing text labels.
- LinkedIn uses the LinkedIn brand mark.
- X uses the X brand mark.
- Facebook uses the Facebook brand mark.
- WhatsApp uses the WhatsApp brand mark.
- Copy uses a standard copy icon.
- Native system share uses a generic share icon.
- Icon size is visually consistent across brands and remains centered at every breakpoint.
- Existing blue hover, high-contrast focus ring, spacing, and reduced-motion behavior remain unchanged.

## Accessibility

- Existing link and button accessible names remain authoritative.
- Decorative icon SVGs are hidden from assistive technology and cannot receive focus.
- Mobile text labels remain visible so the controls do not rely on icon recognition alone.
- Touch targets remain at least 44 by 44 pixels.

## Implementation Scope

Allowed changes:

- `components/ArticleShareActions.tsx`
- `lib/articleShareIcons.ts` as the typed, independently testable icon registry
- `app/styles/article.css` only if icon sizing needs an explicit rule
- `tests/articleSharing.test.mjs`
- `package.json` and `package-lock.json` for `react-icons`

No article content, recommendation logic, navigation, homepage, CTA, image, analytics, deployment configuration, or unrelated component changes are included.

## Verification

- A failing test first requires a real, typed icon registry that does not yet exist.
- The passing test renders all six registered icons to static SVG markup and verifies the complete action mapping.
- TypeScript validation and the production build must pass.
- Browser QA covers one article at 1440 pixels and 390 pixels, checking icon visibility, centering, 44 pixel controls, wrapping, focus visibility, and horizontal overflow.
- The established GitHub PR to Vercel Preview to `main` release path is used after validation.
