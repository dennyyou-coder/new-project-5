# WCB Homepage CSS PageSpeed Optimization Design

**Date:** 2026-08-12

**Target:** `https://worldcleanbiz.com/`

**Production baseline:** `436e40e1be8dd48ff437cf68269981a4902dd06f`

## Goal

Continue the homepage PageSpeed work by reducing render-blocking CSS without
changing visible design, content, SEO metadata, conversion behavior, forms,
analytics, article content, or article images.

The authoritative post-production three-run Lighthouse medians are:

- Mobile performance: 75; FCP 3.16 s; LCP 4.52 s; TBT 9 ms; CLS 0.
- Desktop performance: 99; FCP 0.44 s; LCP 1.00 s; TBT 0; CLS 0.
- Mobile image transfer: about 102 KB; desktop image transfer: about 196 KB.

The phase-one image work is successful and must not be disturbed. This phase is
accepted when the public-origin mobile Lighthouse median reaches at least 80,
desktop remains at least 95, CLS remains 0, and mobile image transfer remains at
or below 120 KB.

## Confirmed cause

The homepage receives the root-layout stylesheet on every visit. Its source file,
`app/globals.css`, is 113,933 bytes and contains large groups that are not part of
the homepage:

- WCB Expo visitor campaign: 13,400 bytes.
- Reports and sourcing page families: 23,540 bytes.
- Blog/content experience: 5,158 bytes.
- Mixed phase-two alignment: 2,730 bytes, containing both homepage and
  non-homepage selectors.

The live mobile trace reports roughly 18.5 KB transferred for the main CSS chunk,
about 94% unused on the tested homepage, and a render-blocking opportunity of up
to about 300 ms. The mobile LCP is still the H1 and its dominant remaining phase
is element render delay. Image delivery, font display, CLS, and main-thread
blocking are no longer the primary opportunities.

## Options considered

### Option A — Route-scope existing CSS declarations

Move route-exclusive declarations from the root stylesheet into files imported
only by their owning pages or layouts. Preserve declaration values and ordering
within each route. Split mixed selector lists so the homepage keeps only its own
rules and genuinely shared rules remain global.

This directly removes unused homepage CSS while retaining normal Next.js CSS
loading, caching, and navigation behavior.

### Option B — Inline critical homepage CSS and defer the rest

This could eliminate more render blocking, but it introduces a second loading
system, risks flash-of-unstyled-content during navigation, and complicates cache
behavior. It is not justified before completing the safer ownership split.

### Option C — Delay analytics

The trace shows low analytics main-thread cost. Changing load timing could damage
measurement completeness for little proven benefit. Analytics is outside this
phase.

**Decision:** implement Option A only.

## Architecture

### Root stylesheet contract

`app/globals.css` will retain only rules that are genuinely required by the root
layout or intentionally shared across unrelated routes:

- design tokens and reset;
- accessibility and focus behavior;
- root shell, header, navigation, and footer;
- shared button, form, modal, and lead-state primitives;
- small generic layout primitives whose production use spans route families.

Route-branded blocks such as `.wcb-expo-*`, `.reports-library-*`,
`.sourcing-*`, `.blog-*`, and `.insights-*` must not remain in the homepage root
style graph unless a selector is proved to be a shared primitive.

### Route ownership

- WCB Expo campaign rules move to an Expo-owned stylesheet imported by the WCB
  Expo page.
- Blog, archive, and article additions move to the existing Blog route style
  graph (`content-directories.css` and `article.css`) according to consumer.
- Reports library rules move to a Reports-owned stylesheet imported by the
  Reports page.
- Sourcing rules move to `sourcing.css`, already loaded by the Sourcing layout.
- About/contact or other route-specific alignment rules move to their existing
  route stylesheets.
- Homepage-specific declarations found in mixed lists move to `home.css`.

The change is a relocation and selector-list split. Property values, responsive
breakpoints, images, copy, DOM, forms, analytics, and metadata remain unchanged.

### Dead CSS

A selector family may be deleted only when an automated source scan proves that
no production component or page references it. Ambiguous or dynamically composed
selectors are retained in the appropriate route stylesheet.

### Regression contract

A source-level style-ownership test will build the CSS import graph from root,
page, and layout imports. It will assert that:

- the homepage graph contains the shared root stylesheet and `home.css`;
- route-exclusive prefixes are absent from the homepage graph;
- WCB Expo, Blog, Reports, and Sourcing graphs contain their required selectors;
- homepage selectors used in mixed alignment lists remain available;
- global CSS source size and built homepage CSS stay within explicit budgets.

The test is intended to prevent future route CSS from silently returning to the
root layout.

## Implementation boundaries

Allowed changes:

- `app/globals.css`;
- route-owned CSS under `app/styles/`;
- CSS imports in the owning pages/layouts;
- focused source tests and PageSpeed verification documentation.

Not allowed:

- homepage text, hierarchy, sections, DOM behavior, or images;
- article content, article image URLs, manifests, or image preparation;
- canonical, OpenGraph, JSON-LD, sitemap, or other SEO behavior;
- lead-form logic, Tally behavior, GA4, Vercel Analytics, or consent behavior;
- dependencies, Next.js configuration, hosting, or deployment configuration.

## Verification

Implementation is test-driven and must pass these gates:

1. A failing ownership/budget test demonstrates the current route leakage before
   CSS is moved.
2. Focused homepage, content experience, and new style-ownership tests pass.
3. Source-size measurement proves the root stylesheet and homepage CSS graph
   shrink without duplicating the moved blocks.
4. The full repository Node suite passes once after final upstream integration.
5. One production build passes, including existing prebuild and postbuild gates.
6. Production-mode browser QA at desktop and 390 px verifies homepage, WCB Expo,
   Blog, one Blog article, Reports, and Sourcing:
   - HTTP 200;
   - one H1 and one main landmark where applicable;
   - no horizontal overflow or visible styling regression;
   - homepage canonical and OpenGraph metadata unchanged;
   - observed CLS remains 0.
7. Three comparable Lighthouse runs per viewport report medians.

Pre-release budgets:

- main homepage CSS transfer at or below 13 KB in the comparable Lighthouse run;
- desktop performance at least 95;
- CLS 0 and mobile TBT at or below 25 ms;
- mobile image transfer at or below 120 KB.

The public-origin mobile target of at least 80 is verified only after the normal
GitHub-to-Vercel release. If the CSS split does not reach it, stop and report the
new trace evidence rather than modifying analytics or introducing critical-CSS
loading without a new design decision.

## Release boundary

Work proceeds in an isolated branch. After local and Preview gates pass, the user
receives one production release request. Production must be GitHub `main` through
the existing Vercel Git integration; direct `vercel --prod` is prohibited.
