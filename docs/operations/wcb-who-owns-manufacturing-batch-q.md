# WCB Who Owns Manufacturing Refresh Batch Q

This record covers the fourth three-page release in the sitewide manufacturing-answer refresh.

## Authorization and scope

- Denny instructed the next batch to continue automatically through production.
- Work is isolated in `codex/wcb-who-owns-manufacturing-batch-q-20260808` from `origin/main` at `8bd412c30218819f3e808edddc4218c3470eabb8`.
- All three established pages are updated in place. Slugs, canonicals, original publication dates, sort dates and visual packages remain unchanged.
- Existing live-page publish fields are mechanically synchronized to `published_verified` where needed; the new Batch Q edits remain `local_verified` in the program queue until production verification passes.

| Order | Updated page | Existing slug | Main update | Status |
|---:|---|---|---|---|
| 1 | Who Owns Beko Appliances? Beko Group, Beko Europe and the Whirlpool Transaction Explained | `who-owns-beko-appliances-beko-europe` | Direct first-screen Beko/Arçelik and Beko Europe manufacturing answer with a model-level factory boundary | `local_verified` |
| 2 | Who Owns Tineco? Inside Ecovacs Group's Two-Brand Cleaning Strategy | `who-owns-tineco-ecovacs-group` | Direct first-screen group manufacturing-capacity answer separated from specific-model evidence | `local_verified` |
| 3 | Who Owns Eufy? How Anker Built a Smart-Home Brand Beyond Robot Vacuums | `who-owns-eufy-anker-smart-home` | Direct first-screen Anker-managed supplier-network answer separated from legal manufacturer and origin | `local_verified` |

## Search and collision decision

- Fresh GSC window: 2026-07-09 through 2026-08-05.
- The pages were published after or near the end of the export window and did not have enough comparable page-level data to justify inventing traffic differences; their order follows the confirmed brand-search opportunity queue.
- Repository and established route checks found one page for each combined owner and manufacturing intent. Decision: update in place and create no competing URL.

## Current primary-source lock

| Topic | Locked conclusion | Current primary evidence |
|---|---|---|
| Beko manufacturing | Beko/Arçelik operates a multinational industrial network; Beko Europe currently operates 11 production sites, but group plants, joint ventures and approved suppliers prevent a universal factory answer | Current Beko Europe company and business disclosures, current Beko corporate materials and June 2026 KAP disclosure |
| Tineco manufacturing | Ecovacs Group's Tineco structure includes a principal R&D and manufacturing entity and substantial factory capacity; a group-level relationship does not identify the factory for every model | Ecovacs Robotics 2025 annual report and sustainability report, plus Tineco's current official history |
| Eufy manufacturing | Anker Innovations controls eufy product development and a formal supplier network; suppliers may provide finished products, so exact manufacturer, assembly location and origin remain model-specific | Anker Innovations 2025 annual report, current Supplier Code of Conduct and current sustainable-supply-chain disclosure |

## Visual decision

- Ownership and manufacturing conclusions did not change, and none of the existing diagrams names a universal model-level factory, so all seven current article visuals remain factually aligned.
- Beko retains one cover and two body diagrams. Tineco and Eufy each retain one cover and one body diagram.
- No image file or image reference is changed in this batch.

## Release gates

- Baseline passed content classification, 15 insight tests and 103 brand tests on the production base.
- Local gate: classification, insight tests, brand tests, production build, image decode, metadata/schema review and desktop 1440px plus mobile 390px rendering.
- Review gate: final separate read-only release review with recorded findings.
- Production gate: all three unchanged URLs must return HTTP 200 with expected title, H1, description, canonical, BlogPosting schema, direct manufacturing answer, complete visuals, guide discovery and sitemap entry.

## Local release evidence

- Content classification passed.
- All 15 insight tests and all 103 brand tests passed after the final edits.
- The production build completed successfully and generated 582 pages, including all three unchanged article routes.
- All seven reused article visuals loaded completely at 1600x900. The five WebP files decoded at 1600x900, and both Beko SVG files declare 1600x900 canvases and rendered at those dimensions.
- Desktop 1440px and mobile 390px checks passed for HTTP status, title, H1, description, production canonical, BlogPosting schema, the direct manufacturing answer and zero horizontal overflow.
- Beko loaded three complete article visuals; Tineco and Eufy each loaded two complete article visuals.
- The only local browser errors were the expected unavailable `/_vercel/insights/script.js` requests outside Vercel.
- All 12 unique WCB internal links passed: five on Beko, four on Tineco and three on Eufy.
- Ownership Guide discovery passed on page 3 for Beko and page 11 for Tineco and Eufy. All three sitemap entries passed.
- Visual inspection of all six viewport screenshots confirmed stable desktop and mobile article headers, readable metadata and no clipping or overlap.
- Final separate read-only release review returned `PASS`: the exact scope is three established articles plus the Batch P production record, refresh queue and this Batch Q record; titles, slugs, original publication dates, sort dates and image references are unchanged; every new manufacturing statement remains inside the refreshed primary-source lock and preserves the model-level factory boundary; `git diff --check` is clean.

## Production evidence

- GitHub PR: `#73`.
- Squash-merge commit: `94777cac106e1f5f8a97a537544497c2bf4801ed`.
- Git-linked Vercel production deployment: `dpl_BtmPvmtiaRNidVuRYPY5QBDU9d5q`, status `READY`.
- The live Beko, Tineco and Eufy routes each returned HTTP 200 and passed desktop 1440px plus mobile 390px checks for title, H1, description, canonical, BlogPosting schema, direct manufacturing answer and zero horizontal overflow.
- All seven live article visuals loaded completely. All 12 unique WCB internal links, Ownership Guide discovery and sitemap inclusion passed; no unexpected browser-console error remained.
- The scheduled quality gate covering the first ten refreshed pages also passed: 20 desktop/mobile viewport combinations generated complete screenshots and retained the expected metadata, manufacturing answer, schema, canonical and responsive layout. A dedicated lazy-loading pass confirmed 34/34 article-area images, including author cards, loaded completely; all 92 checked internal links passed. Ownership Guide discovery passed on pages 1, 3, 9 and 10 as applicable, and all ten sitemap entries passed.
