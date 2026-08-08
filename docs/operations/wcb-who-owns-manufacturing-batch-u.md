# WCB Who Owns Manufacturing Refresh Batch U

This record covers the eighth three-page release in the sitewide manufacturing-answer refresh.

## Authorization and scope

- Denny instructed the next batch to continue automatically through production.
- Work is isolated in `codex/wcb-who-owns-manufacturing-batch-u-20260809` from current `origin/main` at `24b8e879273dc2fa397775a03c1e2292d9a169c9`.
- All three established pages are updated in place. Slugs, canonicals, original publication dates, sort dates and visual packages remain unchanged.
- Batch T is mechanically synchronized to `published_verified`; the new Batch U rows remain `local_verified` until production verification passes.

| Order | Updated page | Existing slug | Main update | Status |
|---:|---|---|---|---|
| 1 | Who Owns GARDENA? Husqvarna Group, SILENO Robot Mowers and Manufacturing Explained | `who-owns-gardena-husqvarna-sileno-manufacturing` | Direct first-screen answer separating GARDENA’s factory network, other Husqvarna plants and suppliers from exact-model legal manufacturer and origin | `local_verified` |
| 2 | Who Owns Hayward Pool Products? Public Ownership, Manufacturing and Distribution Explained | `who-owns-hayward-pool-products` | Direct first-screen answer separating Hayward’s seven disclosed facilities from exact-SKU legal manufacturer, factory and origin | `local_verified` |
| 3 | Who Owns Nilfisk? Freudenberg, Manufacturing and Professional Cleaning Brands Explained | `who-owns-nilfisk-freudenberg-manufacturing` | Direct first-screen answer separating Nilfisk’s five main production sites from model-level plant, supplier and technology-partner evidence | `local_verified` |

## Search and collision decision

- The order follows priorities 22–24 in the confirmed refresh queue.
- Repository checks found exactly one managed page for each target slug and no competing `Who Makes` or `Who Manufactures` route for the same intent.
- Hayward comparison pages cover product and competitive comparisons rather than the parent/manufacturing query and already point to the ownership guide. Decision: update all three established pages in place and create no new URL.

## Current primary-source lock

| Topic | Locked conclusion | Current primary evidence |
|---|---|---|
| GARDENA manufacturing | Most products and spare parts come from GARDENA’s German and Czech plant network; other products and components come from Husqvarna Group plants in Sweden, England and the US and from global suppliers; exact model origin remains separate | Current GARDENA manufacturing-origin help page, company history and legal disclosures, checked August 9, 2026 |
| Hayward manufacturing | Hayward Holdings describes the consolidated group as a global designer and manufacturer and reported seven facilities at December 31, 2025: four in the US, two in Spain and one in China; the filing does not assign every SKU to one legal manufacturer or factory | Hayward Holdings 2025 Form 10-K filed with the SEC and current company disclosures, checked August 9, 2026 |
| Nilfisk manufacturing | Nilfisk is now part of Freudenberg Home and Cleaning Solutions and currently reports five main production sites in the US, Mexico, Hungary, Italy and China; model-level factory, components and technology partners remain separate | Nilfisk’s April 15, 2026 takeover-completion release and current company disclosures, checked August 9, 2026 |

## Visual decision

- The refreshed evidence does not change the ownership, factory-network, operating-entity or model-verification relationships shown in the existing visuals.
- The three pages retain eight unique article visuals: three for GARDENA, two for Hayward and three for Nilfisk. No image file or image reference is changed.
- Separate visual review fallback: `PASS`. All cover-impact and body-information checks scored at least 8/10; all factual labels remain inside the current evidence lock and the rendered mobile images remain readable.

## Release gates

- Baseline and fresh post-edit checks passed content classification, 15 insight tests, 103 brand tests and 22 equipment tests.
- The production build passed and generated 590 pages, including all three unchanged target routes.
- Six local page combinations (desktop 1440 x 1100 and mobile 390 x 844 for every page) returned HTTP 200 and passed title, H1, description, canonical, BlogPosting schema, direct manufacturing-answer and horizontal-overflow checks.
- Nine unique image URLs (eight article visuals plus the shared author asset) and all 12 unique internal links passed direct browser requests. GARDENA, Hayward and Nilfisk were discoverable on Ownership Guide pages 2, 7 and 3 respectively and all three appeared in the sitemap.
- Six top-of-page screenshots and all nine article-image placements were inspected separately with no clipping, overflow or unsupported visual claim.
- Browser console review found only the expected local `/_vercel/insights/script.js` 404 plus a sitemap favicon request; no article-specific runtime error remained.
- Final separate read-only scope, invariant, source-boundary and whitespace review: `PASS`; the change set is limited to the three established articles, Batch T evidence, the master refresh queue and this Batch U record.
- After priority 25 is published, run the next five-page production quality gate for priorities 21–25 before priorities 26–28 continue.

## Production evidence

- GitHub PR: `#79`.
- Squash-merge commit: `44da1a4a7db978cb318df6fecca34df31ec092d0`.
- Git-linked Vercel production deployment: `dpl_E8KAEHn1kXgMZDDzBxHH1RFgkH7Z`, status `READY` with the `worldcleanbiz.com` and `www.worldcleanbiz.com` aliases and no alias error.
- The live GARDENA, Hayward and Nilfisk routes each returned HTTP 200 and passed desktop 1440px plus mobile 390px checks for title, H1, description, canonical, BlogPosting schema, direct manufacturing answer and zero horizontal overflow.
- All nine unique target-page image URLs, all 12 unique internal links, Ownership Guide pages 2, 7 and 3, sitemap entries and browser-console checks passed.
