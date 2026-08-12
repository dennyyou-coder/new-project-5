# WCB Homepage CSS PageSpeed Optimization Report

**Date:** 2026-08-12

**Target:** `https://worldcleanbiz.com/`

**Production baseline:** `436e40e1be8dd48ff437cf68269981a4902dd06f`

## Outcome

The phase-two CSS ownership split passed every local release gate without
changing page content, DOM behavior, images, metadata, forms, analytics, or the
article image pipeline.

- `app/globals.css`: **113,933 -> 28,314 bytes** (`-75.1%`).
- Built homepage render-blocking CSS: **9,191 gzip bytes** across two files,
  below the 13 KB budget.
- Local mobile Lighthouse median: **98**; LCP **2,481 ms**; TBT **4 ms**;
  CLS **0**.
- Local desktop Lighthouse median: **100**; LCP **718 ms**; TBT **0**;
  CLS **0**.
- Mobile image transfer remained **104,128 bytes**, below the 120 KB budget.

The authoritative public-origin baseline after phase one remains mobile 75 and
desktop 99. Local results show the production-build ceiling; the public-origin
target of mobile 80 or higher must be confirmed after the normal GitHub-to-Vercel
release.

## Scope and implementation

Route-exclusive declarations were moved out of the root stylesheet and into the
stylesheets already owned by their consumers:

- WCB Expo -> `app/styles/wcb-expo.css`
- Reports -> `app/styles/reports.css`
- Blog, Archive, Guides, and article additions ->
  `app/styles/content-directories.css`
- Sourcing -> `app/styles/sourcing.css`
- Contact/trust alignment -> `app/styles/trust.css`
- About alignment -> `app/styles/about.css`
- Homepage alignment -> `app/styles/home.css`

Mixed selector lists were split by route. Shared footer and form primitives
remain global. A semantic CSS audit compared selector/declaration facts before
and after the move: all retained facts kept their values, and the only removed
facts were 70 source-unreferenced legacy Expo/Reports responsive facts.

The new ownership regression test prevents `.wcb-expo-*`, Blog, Sourcing,
Reports, and Contact route families from returning to the root stylesheet while
checking that each owning route still imports its stylesheet.

## Lighthouse 13.4.1

Three independent runs per viewport used the production build and Lighthouse's
simulated throttling. Timings are milliseconds; bytes are transferred bytes.

### Mobile

| Run | Score | FCP | LCP | TBT | CLS | Speed Index | Total bytes | Image bytes | CSS bytes | Requests |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 99 | 1,062 | 2,085 | 2 | 0 | 1,062 | 480,683 | 104,136 | 43,145 | 28 |
| 2 | 98 | 1,054 | 2,481 | 5 | 0 | 1,054 | 480,617 | 104,128 | 43,145 | 28 |
| 3 | 95 | 1,505 | 2,931 | 4 | 0 | 1,505 | 480,615 | 104,128 | 43,145 | 28 |
| **Median** | **98** | **1,062** | **2,481** | **4** | **0** | **1,062** | **480,617** | **104,128** | **43,145** | **28** |

### Desktop

| Run | Score | FCP | LCP | TBT | CLS | Speed Index | Total bytes | Image bytes | CSS bytes | Requests |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 100 | 285 | 718 | 0 | 0 | 285 | 702,522 | 200,060 | 71,610 | 63 |
| 2 | 100 | 284 | 698 | 0 | 0 | 284 | 702,518 | 200,056 | 71,610 | 63 |
| 3 | 100 | 367 | 802 | 0 | 0 | 367 | 702,530 | 200,068 | 71,610 | 63 |
| **Median** | **100** | **285** | **718** | **0** | **0** | **285** | **702,522** | **200,060** | **71,610** | **63** |

The total stylesheet transfer includes Next.js link-prefetched route CSS loaded
after the homepage becomes usable. Only the two homepage CSS files are
render-blocking: 23,110 and 19,750 uncompressed bytes, or 5,087 and 4,104 gzip
bytes. Lighthouse reported no remaining render-blocking savings opportunity.

## Verification

- CSS ownership and adjacent focused tests: passed.
- Final repository Node suite: **538/538 passed**.
- Production build: **655/655 pages generated**.
- Prebuild source-image verification: **438 articles / 1,770 primary / 1,210
  mobile assets**, passed.
- Postbuild HTML-image verification: **438 articles / 1,771 rendered images /
  1,211 responsive sets**, passed.
- Desktop and 390 px browser QA covered `/`, `/wcb-expo`, `/blog`, one article,
  `/reports`, and `/sourcing`: every route returned 200, had one H1 and one main,
  showed no horizontal overflow, and observed CLS 0.
- Homepage desktop and mobile screenshots showed no visible layout, crop,
  typography, form, navigation, or content regression.
- The only browser error was the expected local absence of Vercel Analytics at
  `/_vercel/insights/script.js`; Vercel supplies it after deployment.

## Release boundary

This report records local production-mode evidence only. After Preview passes,
the branch requires one production authorization. Production must be deployed
by merging GitHub `main` and allowing the existing Vercel Git integration to run;
direct `vercel --prod` is not permitted.
