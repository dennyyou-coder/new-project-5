# WCB Who Owns Manufacturing Refresh Batch N

This record covers the first three traffic-led updates in the sitewide manufacturing-answer refresh.

## Authorization and scope

- Denny confirmed the sitewide update program and the first batch.
- Work is isolated in `codex/wcb-who-owns-manufacturing-batch-n-20260808` from `origin/main` at `757af59c839078fe36f88150d8215370293668aa`.
- All three pages are updated in place. Slugs, canonicals, original publication dates, sort dates and visual packages remain unchanged.

| Order | Updated page | Existing slug | Main update | Status |
|---:|---|---|---|---|
| 1 | Who Owns Dyson? James Dyson, Private Status and Origin | `who-owns-dyson-james-dyson-singapore-manufacturing` | Direct first-screen answer covering own motor plants, external manufacturers and the model-level boundary | `published_verified` |
| 2 | Who Owns Kärcher? Family Ownership, Origin and Factories | `who-owns-karcher-family-professional-cleaning-network` | Direct first-screen answer and an explicit Who Makes section heading | `published_verified` |
| 3 | Who Owns Eureka? Midea, Brand Origin & Where Vacuums Are Made | `who-owns-eureka-midea-electrolux-manufacturing` | Direct Midea Group versus Midea Robozone model-specific manufacturing answer | `published_verified` |

## Search and collision decision

- Fresh GSC window: 2026-07-09 through 2026-08-05.
- Dyson baseline: 13 clicks, 1,609 impressions, 0.81% CTR and average position 15.75.
- Kärcher baseline: 6 clicks, 1,453 impressions, 0.41% CTR and average position 10.34.
- Eureka baseline: 2 clicks, 488 impressions, 0.41% CTR and average position 8.90.
- Repository and production audits found one established page for each combined owner, maker and origin intent. Decision: update in place and create no competing URL.

## Current primary-source lock

| Topic | Locked conclusion | Current primary evidence |
|---|---|---|
| Dyson manufacturing | Dyson operates advanced motor manufacturing in Singapore and the Philippines and also uses external manufacturers and suppliers; complete-product responsibility remains model-specific | Current Dyson Philippines location and Dyson disclosures already cited in the article |
| Kärcher manufacturing | Kärcher manufactures through production sites in Germany and a wider international network; its current site directory does not allocate every model to one factory | Current Kärcher sustainability site directory and supply-chain disclosures |
| Eureka manufacturing | Midea Group owns Eureka, while Midea Robozone is named for specific multi-brand robot-vacuum platforms; the wider Eureka range remains model-specific | Current official Midea V12 manual and declaration plus Electrolux transaction record already cited in the article |

## Visual decision

- Ownership and manufacturing conclusions did not change.
- The six current 1600x900 WebP visuals remain the approved and factually aligned visual packages.
- No image file or image reference is changed in this batch.

## Release gates

- Local gate: content classification, insight tests, brand tests, production build, image decode, metadata and schema review, desktop 1440px and mobile 390px rendering.
- Review gate: a final read-only release review with recorded findings.
- Production gate: all three unchanged URLs must return HTTP 200 with the expected title, H1, description, canonical and BlogPosting schema; visuals, guide discovery, sitemap, layout and browser console must also pass.

## Local release evidence

- Content classification passed.
- All 15 insight tests and all 103 brand tests passed on the release base.
- The production build completed successfully and generated 582 pages, including all three unchanged article routes.
- All six reused article visuals decode as 1600x900 WebP files.
- Desktop 1440px and mobile 390px checks passed for HTTP status, expected title, H1, description, production canonical, BlogPosting schema, the direct manufacturing answer and zero horizontal overflow.
- Both 1600x900 article visuals loaded completely on every route. The deferred author portrait below the viewport was not counted as an article visual.
- The only local browser error was the expected unavailable `/_vercel/insights/script.js` outside Vercel.
- All nine unique article-level internal-link checks passed: four on Dyson, two on Kärcher and three on Eureka.
- Ownership-guide discovery passed on page 10 for Dyson and Eureka and page 9 for Kärcher. All three sitemap entries passed.
- A final read-only release review confirmed unchanged slug/date fields, intent alignment, primary-source boundaries, visual reuse and a clean diff with no release blocker.

## Production evidence

- Ready PR: #69.
- Squash merge on `main`: `ff484c3e70a4a297d28c90bd7f0f1a433ff81371`.
- Git-linked Vercel production deployment: `dpl_BnXfNQDUyMJuhrnsH4fEhBVSmkdY`, status `READY`.
- Live verification passed for Dyson, Kärcher and Eureka: HTTP 200, expected title, H1, description, canonical, BlogPosting schema, direct manufacturing answer and complete article visuals.
- Desktop 1440px and mobile 390px rendering passed with zero horizontal overflow and no production console errors.
- All nine article-level internal links, ownership-guide discovery and sitemap entries passed.
