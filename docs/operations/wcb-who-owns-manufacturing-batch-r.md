# WCB Who Owns Manufacturing Refresh Batch R

This record covers the fifth three-page release in the sitewide manufacturing-answer refresh.

## Authorization and scope

- Denny instructed the next batch to continue automatically through production.
- Work is isolated in `codex/wcb-who-owns-manufacturing-batch-r-20260808` from current `origin/main` at `222abf4723fcfe36ac679ddcea879dd9756f80c3`.
- All three established pages are updated in place. Slugs, canonicals, original publication dates, sort dates and visual packages remain unchanged.
- Batch Q is mechanically synchronized to `published_verified`; the new Batch R rows remain `local_verified` until production verification passes.

| Order | Updated page | Existing slug | Main update | Status |
|---:|---|---|---|---|
| 1 | Who Owns Bosch Appliances? BSH, Siemens Licensing and the Brand Portfolio Explained | `who-owns-bosch-appliances-bsh-siemens-brands` | Direct first-screen BSH manufacturing answer and an explicit manufacturing heading, with a model-level factory boundary | `local_verified` |
| 2 | Who Owns SKIL Tools? Chervon, Bosch History and Manufacturing Explained | `who-owns-skil-tools-chervon` | Direct first-screen Chervon manufacturing and two-site production-network answer, separated from exact-SKU evidence | `local_verified` |
| 3 | Who Owns STIHL? Family Ownership, Manufacturing and Battery Strategy Explained | `who-owns-stihl-family-manufacturing` | Direct first-screen eight-country production-network answer, separated from exact manufacturer, plant and origin evidence | `local_verified` |

## Search and collision decision

- The order follows the confirmed brand-search opportunity queue after completion of the traffic-led pages.
- Repository and established route checks found one page for each combined owner and manufacturing intent. Decision: update in place and create no competing URL.

## Current primary-source lock

| Topic | Locked conclusion | Current primary evidence |
|---|---|---|
| Bosch appliance manufacturing | BSH is the operating manufacturer behind Bosch home appliances and reports 37 factories on four continents; the factory, legal manufacturer and origin for a specific model still require product-level evidence | Current BSH worldwide and legal-notice disclosures, checked August 8, 2026 |
| SKIL manufacturing | Chervon is both the owner and an integrated power-tool manufacturer with current production facilities in Nanjing and Ho Chi Minh City; no current disclosure assigns every SKIL SKU to one plant | Current Chervon Power Tools Business Unit and SKIL brand disclosures, checked August 8, 2026 |
| STIHL manufacturing | STIHL manufactures many tools and components through its own eight-country, four-continent network; components can move between specialized sites and exact model origin remains product-specific | Current STIHL production-network and company disclosures, checked August 8, 2026 |

## Visual decision

- The ownership and manufacturing relationships did not change, and the existing diagrams already preserve model-level and factory-level boundaries.
- Bosch and SKIL each retain one cover and one body diagram. STIHL retains one cover and two body diagrams.
- No image file or image reference is changed in this batch.

## Release gates

- Baseline passed content classification, 15 insight tests and 103 brand tests on the production base.
- The scheduled ten-page production quality gate passed 20 desktop/mobile viewport combinations before Batch R edits proceeded, with 34/34 article-area images, 92 internal links, Guide discovery and sitemap inclusion also passing.
- Local gate: classification, insight tests, brand tests, production build, image decode, metadata/schema review and desktop 1440px plus mobile 390px rendering.
- Review gate: final separate read-only release review with recorded findings.
- Production gate: all three unchanged URLs must return HTTP 200 with expected title, H1, description, canonical, BlogPosting schema, direct manufacturing answer, complete visuals, guide discovery and sitemap entry.

## Local release evidence

- Content classification passed.
- All 15 insight tests, all 103 brand tests and all 17 equipment tests passed after updating to the current production base.
- The production build completed successfully and generated 584 pages, including all three unchanged article routes and the newly integrated equipment routes from the current base.
- All seven reused article visuals retained 1600x900 canvases and loaded completely; the three author-card images also loaded at 1600x1200.
- Desktop 1440px and mobile 390px checks passed for HTTP status, title, H1, description, production canonical, BlogPosting schema, direct manufacturing answer and zero horizontal overflow.
- Bosch and SKIL each loaded two complete article visuals; STIHL loaded three. The only local browser errors were the expected unavailable Vercel Insights requests outside Vercel.
- All 27 unique WCB internal links passed. Ownership Guide discovery passed on page 9 for Bosch, page 6 for SKIL and page 5 for STIHL. All three sitemap entries passed.
- Visual inspection of all six viewport screenshots confirmed stable desktop and mobile article headers, readable metadata and no clipping or overlap.
- Final read-only release review returned `PASS`: the exact scope is three established articles plus the Batch Q production record, refresh queue and this Batch R record; titles, slugs, original publication dates, sort dates and image references are unchanged; each new answer remains inside the refreshed primary-source lock and preserves the model-level manufacturer, factory and origin boundary; `git diff --check` is clean.

## Production evidence

Add PR, merge commit, Git-linked Vercel production deployment and live verification after the production gate passes.
