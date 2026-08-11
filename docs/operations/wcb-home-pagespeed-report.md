# WCB Homepage PageSpeed Verification Report

**Date:** 2026-08-12

**Target:** `https://worldcleanbiz.com/`

**Baseline production merge:** `46c02c5e25d2e0cd404561d3d9745c17cfd3df32`

**Verified homepage implementation tree:** `5996ea2` plus its two preceding scoped commits

**Final upstream integration:** `0f14b4f` (documentation update followed only to record final gate counts)

## Outcome

The homepage optimization meets every agreed performance target without changing
homepage copy, section order, canonical or OpenGraph metadata, analytics,
conversion behavior, article content, article image URLs, or the article image
manifest/runtime.

- Mobile Lighthouse median: **67 -> 95** (target: at least 80).
- Desktop Lighthouse median: **97 -> 100** (target: at least 95).
- Mobile LCP median: **7.02 s -> 2.86 s** (preferred target: below 4.5 s).
- Mobile image transfer: **1,149,080 -> 104,128 bytes**, a **90.9% reduction**.
- Desktop image transfer: **1,932,215 -> 200,060 bytes**, an **89.6% reduction**.
- CLS remained **0** and median TBT remained effectively zero.

The strongest causal evidence is the transferred-image reduction and the removal
of the image-delivery opportunity on mobile. Timing and score deltas should be
read with the environment note below: the baseline was captured against the live
production origin, while the final branch was tested from a local production-mode
server with the same Lighthouse version and simulated-throttling profile.

## Lighthouse 13.4.1 results

All values are from three independent runs per viewport. Durations are
milliseconds and bytes are transferred bytes reported by Lighthouse.

### Mobile

| Tree | Run | Score | FCP | LCP | TBT | CLS | Speed Index | Total bytes | Image bytes | Requests |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Baseline production | 1 | 66 | 3,239 | 7,047 | 0 | 0 | 5,503 | 1,534,637 | 1,149,156 | 32 |
| Baseline production | 2 | 68 | 3,118 | 7,024 | 8 | 0 | 4,966 | 1,534,591 | 1,149,045 | 32 |
| Baseline production | 3 | 67 | 3,193 | 6,988 | 24 | 0 | 4,955 | 1,534,644 | 1,149,080 | 32 |
| **Baseline median** |  | **67** | **3,193** | **7,024** | **8** | **0** | **4,966** | **1,534,637** | **1,149,080** | **32** |
| Final local production build | 1 | 99 | 1,058 | 2,234 | 10 | 0 | 1,058 | 487,646 | 104,136 | 28 |
| Final local production build | 2 | 95 | 1,581 | 2,857 | 0 | 0 | 1,581 | 487,623 | 104,128 | 28 |
| Final local production build | 3 | 95 | 1,581 | 2,858 | 5 | 0 | 1,581 | 487,623 | 104,128 | 28 |
| **Final median** |  | **95** | **1,581** | **2,857** | **5** | **0** | **1,581** | **487,623** | **104,128** | **28** |

The mobile LCP element remained the H1, as intended. The image-delivery audit
changed from an estimated 605 KiB saving opportunity to no listed items.

### Desktop

| Tree | Run | Score | FCP | LCP | TBT | CLS | Speed Index | Total bytes | Image bytes | Requests |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Baseline production | 1 | 87 | 1,006 | 2,186 | 0 | 0 | 1,030 | 2,434,215 | 1,932,215 | 64 |
| Baseline production | 2 | 98 | 447 | 1,078 | 0 | 0 | 677 | 2,434,867 | 1,932,064 | 64 |
| Baseline production | 3 | 97 | 580 | 1,203 | 0 | 0 | 723 | 2,435,069 | 1,932,222 | 65 |
| **Baseline median** |  | **97** | **580** | **1,203** | **0** | **0** | **723** | **2,434,867** | **1,932,215** | **64** |
| Final local production build | 1 | 100 | 286 | 820 | 0 | 0 | 286 | 700,964 | 200,084 | 61 |
| Final local production build | 2 | 100 | 285 | 801 | 0 | 0 | 285 | 700,233 | 200,060 | 61 |
| Final local production build | 3 | 100 | 285 | 732 | 0 | 0 | 285 | 700,218 | 200,060 | 61 |
| **Final median** |  | **100** | **285** | **801** | **0** | **0** | **285** | **700,233** | **200,060** | **61** |

The desktop founder-series cover remained the LCP element. It now uses a
right-sized Next.js optimizer candidate instead of transferring the 1600x900
original. Lighthouse still suggests about 75 KiB of optional savings, primarily
from brand wordmarks and further compression of one pathway image; these are not
score-blocking and were outside the approved wordmark exception.

## Implemented changes

1. Converted homepage category, Expo, pathway, trust, testimonial, and
   founder-series imagery to responsive `next/image` consumers with exact
   intrinsic dimensions and viewport-specific `sizes`.
2. Kept all below-fold images lazy and asynchronously decoded. No unconditional
   high-priority image request was added.
3. Added a visually equivalent 160x160 WebP testimonial avatar at 1,972 bytes,
   retaining the 328,828-byte source PNG for provenance and rollback.
4. Removed the obsolete Home V4 CSS family and moved the live Home V9 Expo/form
   rules into route-scoped homepage CSS.
5. Reduced `app/globals.css` from 130,984 to 113,933 bytes; total homepage/global
   source CSS fell by about 14,815 bytes after route-scoping.

## Browser verification

The production build was tested at 1440x1100 and 390x844.

- HTTP 200, exactly one H1 and one main landmark at both viewports.
- Canonical remained `https://worldcleanbiz.com/`; OpenGraph image was unchanged.
- No horizontal overflow and observed CLS was 0.
- Series, Expo, category, pathway, trust, and avatar images selected optimizer
  candidates rather than their full originals.
- At 390 px, testimonial avatars selected 64 px candidates and rendered at
  54x54; the series image selected a 384 px candidate; below-fold images remained
  lazy/async.
- Visual inspection found no crop, framing, typography, form, or responsive
  layout regression.
- The only browser error was the expected local absence of Vercel Analytics at
  `/_vercel/insights/script.js`; it is supplied by Vercel in deployed builds.

## Automated gates

- Focused homepage and adjacent tests: **55/55 passed**.
- Full repository Node suite before upstream integration: **532/532 passed**.
- Final release-integration suite after merging the latest `origin/main`:
  **534/534 passed**.
- Production build: **passed**, including prebuild article-source verification,
  **652/652** generated pages, and postbuild article-image verification.
- Product-director avatar inspection: original zoom and rendered-size checks
  passed.

## Remaining limitations and release boundary

Google PageSpeed Insights did not complete through either the official API or
web UI during the baseline session. The results above are Lighthouse lab results,
not Chrome UX Report field data. After this branch is deployed through the normal
GitHub-to-Vercel flow, production should be retested on the public origin and
field Core Web Vitals should be watched over the following 28-day reporting
window.

This verification did not push, merge, or deploy the branch. Production release
still requires the separate release authorization defined by the repository
policy.
