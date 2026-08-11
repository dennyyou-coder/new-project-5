# WCB Homepage PageSpeed Optimization Design

**Date:** 2026-08-11

**Target:** `https://worldcleanbiz.com/`

**Baseline:** production merge `46c02c5e25d2e0cd404561d3d9745c17cfd3df32`

## Goal

Improve homepage mobile PageSpeed without changing copy, SEO metadata, page order,
conversion behavior, article content, or unrelated routes.

The current three-run local Lighthouse medians are:

- Mobile performance: 67; FCP about 3.19 s; LCP about 7.02 s; CLS 0.
- Desktop performance: 97; FCP about 0.58 s; LCP about 1.20 s; CLS 0.

Google PageSpeed Insights did not return a completed official run during the
baseline test, so these values are controlled Lighthouse lab results, not field
Core Web Vitals.

## Confirmed findings

1. Homepage images are generally served at their full source dimensions even
   when displayed as small cards or 54–68 px avatars. Lighthouse estimates about
   605 KiB of mobile and 1,585 KiB of desktop image-delivery savings.
2. The latest founder-series cover is 1600×900 / 189,016 bytes and has no mobile
   variant in the article-image runtime index. It is also discovered as a lazy
   image on desktop, where it becomes the LCP element.
3. The product-director testimonial avatar is a 500×500 PNG weighing 328,828
   bytes while displayed at 54–68 px.
4. The mobile LCP element is the text H1. Total blocking time and CLS are already
   effectively zero, so speculative JavaScript or layout rewrites are not
   justified. Reducing render-blocking CSS and competing image transfer is the
   safer path.
5. `app/globals.css` retains roughly 14.5 KB of obsolete Home V4 rules. Only the
   old `home-v4-email-form` class remains referenced by the current homepage.

## Options considered

### Option A — Compress the existing originals only

This is low risk but still sends one fixed file to every viewport. It cannot
eliminate most of Lighthouse's correctly-sized-image findings and creates a new
manual compression step whenever homepage imagery changes.

### Option B — Commit a separate set of handcrafted mobile and desktop files

This gives complete byte-level control, but it duplicates the article-image
pipeline and requires ongoing manual mapping for every homepage visual. The
latest founder-series episode changes over time, making this especially brittle.

### Option C — Use the existing Next.js image optimizer for homepage consumers

This supplies intrinsic dimensions, viewport-aware `srcset`, modern encoding,
and cacheable right-sized variants without changing the source assets. The
project already uses this optimizer on other routes, so it introduces no new
service dependency.

**Decision:** use Option C for homepage display, with one small exception: create
a compact WebP replacement for the unusually heavy testimonial PNG because the
image is always rendered at avatar size and does not need a broad responsive
ladder.

## Proposed implementation

### 1. Homepage image component contract

Convert homepage-owned visual consumers from raw `<img>` or CSS background
images to `next/image` with explicit dimensions and accurate `sizes` values.

The conversion covers:

- six category images;
- WCB Expo campaign image;
- three pathway images;
- three trust-gallery images;
- three testimonial avatars;
- the latest founder-series card.

Brand wordmarks and editorial article cards will retain their established
rendering systems unless measurement proves that a safe, local change is needed:

- brand wordmarks are small, contained assets with mixed formats;
- editorial cards already use the audited article-image runtime helper.

The homepage series card may consume an article-owned source through
`next/image`, but this changes only the homepage presentation. The original
article URL, manifest, article page, social image, and image pipeline remain
unchanged.

### 2. Loading and priority policy

- The founder-series image remains the only above-fold image candidate.
- Do not set unconditional high priority until a mobile test proves it does not
  compete with the text H1. Start with responsive delivery and retain lazy
  loading; add a desktop-only preload only if the post-change desktop trace still
  identifies late discovery as material.
- All below-fold images remain lazy and asynchronously decoded.
- No homepage image may introduce a second eager/high-priority request on mobile.

This prioritizes the mobile regression risk over chasing a desktop score already
near 100.

### 3. Testimonial avatar correction

Generate a visually equivalent small WebP from the 500×500 product-director PNG.
Keep the source file untouched for rollback and provenance. Render all three
avatars as semantic image elements with fixed intrinsic dimensions, circular
cropping, lazy loading, and current accessible labels.

The optimized avatar must be inspected at original zoom and at its rendered
mobile size before acceptance.

### 4. CSS cleanup and H1 render path

- Rename the current form wrapper to a Home V9 class and copy only the small set
  of rules it actually needs into route-scoped `app/styles/home.css`.
- Remove the now-unreferenced Home V4 block from `app/globals.css`.
- Move the homepage-only WCB Expo campaign rules from `globals.css` into
  `home.css`, preserving their declarations and responsive behavior.
- Do not change H1 text, hierarchy, font, hero geometry, analytics, or lead-form
  behavior. The H1 improvement is expected to come from smaller render-blocking
  CSS and reduced image competition, not from speculative DOM changes.

Before deleting legacy CSS, a test must prove that no production component
references the removed class family.

### 5. JavaScript scope

The baseline mobile TBT is only 8 ms median. The reported unused JavaScript is
therefore not the main PageSpeed bottleneck. Tally already loads its remote widget
only after interaction. No interaction or analytics rewrite is included in this
change.

If the final bundle report reveals a new homepage-only, unused module that can be
removed without changing behavior, it may be addressed with its own failing test;
otherwise JavaScript cleanup is explicitly deferred.

## Verification

Implementation must be test-driven and pass the following gates:

1. Focused source tests confirm:
   - each targeted image has intrinsic dimensions and an accurate `sizes` value;
   - below-fold images remain lazy;
   - the series image priority policy has exactly the intended behavior;
   - removed Home V4 selectors have no live production references;
   - the form and Expo styles remain in the homepage route style graph.
2. Homepage and adjacent regression tests pass.
3. The repository's full Node test suite passes once after final integration.
4. Production build passes, including existing source and built article-image
   gates.
5. Browser QA at desktop and 390 px confirms:
   - HTTP 200;
   - one H1 and one main landmark;
   - no horizontal overflow or visible layout/crop regressions;
   - canonical and OpenGraph metadata unchanged;
   - intended responsive candidates are selected;
   - CLS remains 0 in the observed run.
6. Run three comparable Lighthouse passes per viewport and report medians.

Acceptance targets:

- mobile performance median at least 80, with a preferred LCP below 4.5 s;
- desktop performance median at least 95;
- CLS remains 0 and TBT does not materially regress;
- homepage image transfer falls by at least 30% in the controlled lab run;
- no content, SEO, conversion, or unrelated-route change.

If mobile remains below 80, stop and report the remaining trace evidence rather
than broadening the change into shared infrastructure without approval.

## Release boundary

This design authorizes local implementation and verification only. It does not
authorize a production release. After the verified diff is ready, it will be
presented for review before any GitHub merge or production deployment.
