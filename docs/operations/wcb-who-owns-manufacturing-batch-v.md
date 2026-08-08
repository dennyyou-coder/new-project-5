# WCB Who Owns Manufacturing Refresh Batch V

This record covers priority 25 and the priorities 21–25 production quality gate in the sitewide manufacturing-answer refresh.

## Authorization and scope

- Denny instructed the next batch to continue automatically through production.
- Work is isolated in `codex/wcb-who-owns-manufacturing-batch-v-20260809` from current `origin/main` at `44b029e03944b65c384a796c40a53d59e1e2ed8b`.
- The established Mac Tools page is updated in place. Its title, slug, canonical, original publication date, sort date and visual package remain unchanged.
- Batch U is mechanically synchronized to `published_verified`; the Mac Tools refresh remains `local_verified` until production verification passes.

| Order | Updated page | Existing slug | Main update | Status |
|---:|---|---|---|---|
| 1 | Who Owns Mac Tools? Stanley Black & Decker, Manufacturing and Franchise Distribution Explained | `who-owns-mac-tools-stanley-black-decker` | Direct first-screen answer separating Mac-manufactured products from licensed and supplier-made products, exact-SKU legal manufacturer, factory and origin | `local_verified` |

## Search and collision decision

- The page is priority 25 in the confirmed traffic-first refresh queue.
- Repository checks found exactly one managed page for the target slug and no competing `Who Makes` or `Who Manufactures` route for the same intent.
- The existing ownership guide already contains the full ownership, franchise, manufacturing, origin, battery and warranty analysis. Decision: update the established page in place and create no new URL.

## Current primary-source lock

- Stanley Black & Decker's current tool-brand portfolio includes Mac Tools.
- Current Mac Tools franchise material identifies Mac Tools as part of Stanley Black & Decker and describes an extensive supplier network supporting franchisees.
- Current Mac Tools terms say the catalogue may include licensed products from third-party manufacturing or distribution partners.
- Current Mac Tools warranty policy distinguishes Mac-manufactured products from products not manufactured by Mac, whose warranties come from the manufacturing supplier.
- These disclosures support a mixed manufacturing answer but do not identify the legal manufacturer, factory or country of origin for every SKU. Exact-model evidence remains required.

## Visual decision

- The refreshed evidence does not change the ownership, franchise, manufacturing or warranty relationships shown in the existing package.
- The page retains three article visuals: one 1600 x 900 cover and two deterministic SVG body maps. No image file or reference is changed.
- Separate visual review fallback: `PASS`. The cover remains a relevant non-documentary mobile-distribution scene, the two body maps stay within the current evidence lock, and their rendered mobile text remains readable.

## Release gates

- Baseline and fresh post-edit checks passed content classification, 15 insight tests, 103 brand tests and 24 equipment tests.
- The production build passed and generated 593 pages, including the unchanged Mac Tools route.
- The local Mac Tools page returned HTTP 200 at desktop 1440 x 1100 and mobile 390 x 844 and passed title, one-H1, description, canonical, BlogPosting schema, direct manufacturing-answer and horizontal-overflow checks.
- All three 1600 x 900 article visuals and the shared author asset returned HTTP 200. All five unique internal links passed, the page appeared on Ownership Guide page 4 and its canonical URL appeared in the sitemap.
- Desktop and mobile screenshots were inspected separately with no clipping, overflow or unsupported visual claim. Browser-console review found only the expected local `/_vercel/insights/script.js` 404.
- After Mac Tools is live, run the five-page production quality gate for priorities 21–25: Breville/Sage, GARDENA, Hayward, Nilfisk and Mac Tools.
- Priorities 26–28 remain blocked from release until that gate passes.

## Production evidence

Add PR, merge commit, Git-linked Vercel production deployment, Mac Tools live verification and the priorities 21–25 quality-gate result after production passes.
