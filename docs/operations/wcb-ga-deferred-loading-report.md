# WCB Deferred GA4 Loading Report

**Date:** 2026-08-12

**Target:** `https://worldcleanbiz.com/`

**Production baseline:** `0f59c54dc2cfd5fb6a44a856ba6dc7701f626ad9`

## Outcome

The GA4 library is no longer part of the initial Next.js script graph. A small
inline bootstrap still creates `dataLayer` and `gtag` immediately, queues the
initial `js` and `config` commands, and retains early lead events. The external
`gtag.js` library is injected once after the first pointer, keyboard, or touch
interaction, when the page becomes hidden, or after a 3,500 ms maximum delay.

The change preserves the existing production-host, automation, and internal
traffic policies. Vercel Analytics, content, styles, images, forms, routes, SEO,
dependencies, and deployment configuration are unchanged.

## Root-cause evidence

Public production Lighthouse testing before implementation isolated the GA4
network request as the material mobile bottleneck:

- Current production mobile median: **76**, LCP **4,498 ms**.
- Blocking only Vercel Analytics: median **76**, LCP **4,418 ms**.
- Blocking GA4: three runs scored **90**, median LCP **2,978 ms**.
- Blocking both analytics libraries produced the same median **90** and LCP
  **2,974 ms** as blocking GA4 alone.
- TBT remained near zero, so the regression was network contention from the
  approximately 170 KB high-priority GA library, not JavaScript execution.

The previous CSS phase had already reduced render-blocking homepage CSS to about
10.4 KB transferred and found only about 150 ms of remaining CSS opportunity.
That made further CSS changes a lower-value path than deferring GA4.

## Reliability contract

The generated bootstrap was executed as real JavaScript in a controlled VM, not
mocked. RED tests first proved the existing code had no deferred triggers. GREEN
tests now prove:

- allowed production visits immediately queue `js` then `config`;
- no external GA script exists before an approved trigger;
- pointer, keyboard, touch, hidden-page, and 3,500 ms triggers load exactly once;
- a bootstrap that starts in an already-hidden page loads immediately instead
  of relying on a background-throttled timer;
- trigger cleanup removes all listeners and the pending timer;
- an early lead event remains ordered in the queue before library injection;
- Preview, automation, and internal-browser visits never queue or schedule GA;
- the inline bootstrap and external library use distinct DOM IDs, so the
  bootstrap cannot be mistaken for an already-loaded library.

A browser run mapped the local production build to `worldcleanbiz.com` with
automation disabled. Before interaction it exposed `window.gtag`, queued
`js`, `config`, and the site's early event, and had no library element. The
first real pointer interaction created exactly one
`wcb-google-analytics-library` element with measurement ID `G-6RW65B9CD0`.

## Lighthouse 13.4.1

Three independent runs per viewport used the production build and Lighthouse's
simulated throttling. Timings are milliseconds and bytes are transferred bytes.
Localhost is intentionally excluded by the production-host analytics policy;
the production-host browser simulation above verifies the production-only
queue and trigger behavior.

### Mobile

| Run | Score | FCP | LCP | TBT | CLS | Speed Index | Total bytes | Image bytes | CSS bytes | Requests |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 94 | 1,517 | 3,026 | 0 | 0 | 2,008 | 310,783 | 104,136 | 43,145 | 27 |
| 2 | 98 | 1,055 | 2,482 | 0 | 0 | 1,055 | 310,775 | 104,128 | 43,145 | 27 |
| 3 | 98 | 1,054 | 2,482 | 0 | 0 | 1,054 | 310,775 | 104,128 | 43,145 | 27 |
| **Median** | **98** | **1,055** | **2,482** | **0** | **0** | **1,055** | **310,775** | **104,128** | **43,145** | **27** |

### Desktop

| Run | Score | FCP | LCP | TBT | CLS | Speed Index | Total bytes | Image bytes | CSS bytes | Requests |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 99 | 285 | 849 | 0 | 0 | 285 | 535,396 | 200,060 | 71,610 | 62 |
| 2 | 100 | 284 | 516 | 0 | 0 | 284 | 535,392 | 200,056 | 71,610 | 62 |
| 3 | 100 | 285 | 719 | 0 | 0 | 285 | 535,416 | 200,080 | 71,610 | 62 |
| **Median** | **100** | **285** | **719** | **0** | **0** | **285** | **535,396** | **200,060** | **71,610** | **62** |

Compared with the immediately preceding local CSS-phase medians, mobile transfer
fell from 480,617 to 310,775 bytes and desktop transfer fell from 702,522 to
535,396 bytes. Mobile images and CSS stayed byte-identical at 104,128 and 43,145
bytes, respectively. This isolates the improvement to removing the initial GA
library request rather than changing visual assets or styles.

## Automated and browser gates

- Focused GA and lead tracking tests: **30/30 passed**.
- Final repository Node suite: **544/544 passed**.
- Production build: **655/655 pages generated**.
- Prebuild source-image verification: **438 articles / 1,770 primary / 1,210
  mobile assets**, passed.
- Postbuild HTML-image verification: **438 articles / 1,771 rendered images /
  1,211 responsive sets**, passed.
- Desktop browser QA covered `/`, `/sourcing`, and Episode 04. Mobile QA covered
  `/` and `/sourcing` at 390 px. Every route had one H1 and one main landmark,
  the correct canonical, and no horizontal overflow. The article retained one
  eager cover and 15 lazy body images.
- The only local browser error was the expected absence of Vercel Analytics at
  `/_vercel/insights/script.js`; Vercel supplies it after deployment.

The final read-only review found one Important background-tab edge case. A RED
test reproduced that an already-hidden page waited for a timer that browsers may
throttle. The bootstrap now checks the initial visibility state immediately;
the new test and the complete final gates above passed after that repair. The
visible-page Lighthouse path is unchanged, so the previously recorded six lab
runs were not repeated.

## Release boundary

The authoritative public-origin performance comparison remains a post-production
gate because Preview and localhost are intentionally excluded from GA. After the
Git-triggered Preview is READY, one production authorization is required. The
approved branch must then merge to GitHub `main` and deploy through Vercel's Git
integration; direct `vercel --prod` is not permitted. After production becomes
READY, repeat the three-run public mobile and desktop comparison and confirm the
live GA queue, delayed library, deployed commit, target routes, and recent
runtime health.
