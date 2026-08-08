# WCB Who Owns Manufacturing Refresh Batch W

This record covers priorities 26–28, the final release in the 28-page sitewide manufacturing-answer refresh.

## Authorization and scope

- Denny instructed the next batch to continue automatically through production.
- Work is isolated in `codex/wcb-who-owns-manufacturing-batch-w-20260809` from current `origin/main` at `268afe8fafdfbc92232b3232b22afbdfd2aa6ee1`.
- All three established pages are updated in place. Titles, slugs, canonicals, original publication dates, `publishedAt`, `sortDate` and visual packages remain unchanged.
- Batch V is mechanically synchronized to `published_verified`; the Batch W rows remain `local_verified` until production verification passes.

| Order | Updated page | Existing slug | Main update | Status |
|---:|---|---|---|---|
| 1 | Who Owns Triton Tools? Timbecon Acquisition, Manufacturing and Brand History Explained | `who-owns-triton-tools-timbecon` | Direct first-screen answer separating Timbecon's brand, product and supply role from exact-model legal manufacturer, factory and origin | `local_verified` |
| 2 | Who Owns RIDGID Wet/Dry Vacuums? Emerson, Home Depot and Brand Licensing Explained | `who-owns-ridgid-wet-dry-vacuums-emerson` | Direct first-screen answer and explicit manufacturing heading separating Emerson Tool Company from the exact assembly plant and origin | `local_verified` |
| 3 | Who Owns Shop-Vac? GreatStar, Manufacturing and Wet/Dry Vacuum Strategy Explained | `who-owns-shop-vac-greatstar-manufacturing` | Direct first-screen answer and explicit manufacturing heading separating GreatStar's group network, Shop-Vac USA and exact-SKU factory evidence | `local_verified` |

## Search and collision decision

- The order follows priorities 26–28 in the confirmed refresh queue.
- Repository checks found exactly one managed page for each target slug and no competing `Who Makes` or `Who Manufactures` route for the same intent.
- RIDGID and Shop-Vac are mutually linked because they answer different brand and ownership questions; no canonical or primary-keyword conflict exists. Decision: update all three established pages in place and create no new URL.

## Current primary-source lock

| Topic | Locked conclusion | Current primary evidence |
|---|---|---|
| Triton manufacturing | Timbecon owns and manages Triton; Timbecon Global supplies Triton Tools globally; current public sources do not name one physical manufacturer or factory for the full range | Current Triton ownership announcement and Timbecon Global privacy notice, checked August 9, 2026 |
| RIDGID wet/dry-vac manufacturing | Emerson Tool Company is the current Emerson manufacturer organization tied to listed RIDGID wet/dry-vac models and the manufacturer-warranty path; exact plant and origin remain model-specific | Current RIDGID legal and warranty pages, Emerson fiscal 2025 subsidiary exhibit and January 2026 Emerson Tool Company patent marking, checked August 9, 2026 |
| Shop-Vac manufacturing | Shop-Vac sits inside GreatStar; the 2020 acquisition included US real estate, machinery and equipment, while GreatStar's 2025 interim report describes 23 group production bases; neither record assigns every current Shop-Vac SKU to one factory | Current Shop-Vac operator and warranty pages, GreatStar 2020 acquisition announcement and 2025 interim report, checked August 9, 2026 |

## Visual decision

- The refreshed evidence does not change the ownership, operating-entity, supply-network or model-verification relationships shown in the existing visuals.
- The three pages retain five unique 1600 x 900 article visuals: three for Triton, one for RIDGID and one for Shop-Vac. No image file or image reference is changed.
- Separate visual review fallback: `PASS`. All three covers remain relevant non-documentary concept scenes; Triton's two deterministic maps remain inside the current evidence lock and readable at mobile article width; every visual scored at least 8/10 for impact or information value.

## Release gates

- Fresh post-edit checks passed content classification, 15 insight tests, 103 brand tests and 24 equipment tests.
- The production build passed and generated 593 pages, including all three unchanged target routes.
- Six local page combinations (desktop 1440 x 1100 and mobile 390 x 844 for every page) returned HTTP 200 and passed title, one-H1, description, canonical, BlogPosting schema, direct manufacturing-answer and horizontal-overflow checks.
- All five unique 1600 x 900 article-image URLs and all nine unique internal links passed. Triton, RIDGID and Shop-Vac were discoverable on Ownership Guide pages 5, 7 and 7 respectively and all three appeared in the sitemap.
- Six full-page screenshots were inspected separately with no clipping, horizontal overflow, broken article image or unsupported visual claim. Browser-console review found only the expected local `/_vercel/insights/script.js` 404.
- Separate read-only fallback review of scope, invariant dates, source boundaries, image reuse, links and whitespace: `PASS`; the change set is limited to the three established articles, Batch V evidence, the master refresh queue and this Batch W record.

## Production evidence

Add PR, merge commit, Git-linked Vercel production deployment and three-page live verification after production passes. Once those checks pass, priorities 26–28 and the complete 28-page program are `published_verified`.
