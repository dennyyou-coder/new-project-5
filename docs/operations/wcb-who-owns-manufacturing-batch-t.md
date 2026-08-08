# WCB Who Owns Manufacturing Refresh Batch T

This record covers the seventh three-page release in the sitewide manufacturing-answer refresh.

## Authorization and scope

- Denny instructed the next batch to continue automatically through production.
- Work is isolated in `codex/wcb-who-owns-manufacturing-batch-t-20260808` from current `origin/main` at `7cc96bb147d7bd5d7c2dde43c390b9ff6abaf0f7`.
- All three established pages are updated in place. Slugs, canonicals, original publication dates, sort dates and visual packages remain unchanged.
- Batch S is mechanically synchronized to `published_verified`; the new Batch T rows remain `local_verified` until production verification passes.

| Order | Updated page | Existing slug | Main update | Status |
|---:|---|---|---|---|
| 1 | Who Owns De’Longhi? Appliance Group Brands, Shareholders and Manufacturing Explained | `who-owns-delonghi-appliance-group-brands` | Direct first-screen answer separating the group’s six household plants and OEM network from exact-model factory, legal-manufacturer and origin evidence | `local_verified` |
| 2 | Who Owns Braun Appliances? De’Longhi, P&G and the Household Brand License Explained | `who-owns-braun-appliances-delonghi-pg-license` | Direct first-screen answer separating P&G trademark ownership from De’Longhi’s licensed household manufacturing operation and exact-model origin | `local_verified` |
| 3 | Who Owns Breville and Sage? Regional Brand Rights Explained | `who-owns-breville-sage-regional-brand-rights` | Direct first-screen answer separating Breville Group product development and external manufacturing partners from exact-model factory evidence | `local_verified` |

## Search and collision decision

- The order follows priorities 19–21 in the confirmed refresh queue.
- Repository checks found exactly one managed page for each target slug and no competing `Who Makes` or `Who Manufactures` route for the same intent.
- The separate De’Longhi company-history article covers chronology and acquisitions rather than the current ownership/manufacturing query and remains intentionally interlinked. Decision: update all three established pages in place and create no new URL.

## Current primary-source lock

| Topic | Locked conclusion | Current primary evidence |
|---|---|---|
| De’Longhi manufacturing | De’Longhi Group combines six Household division plants in Italy, Romania and China with qualified OEM partners; group-level disclosures do not assign every model to one site | De’Longhi Group Annual Report 2025 and current corporate manufacturing disclosures, checked August 8, 2026 |
| Braun Household manufacturing | P&G owns the Braun trademark while De’Longhi holds the perpetual household-appliance licence and operates manufacturing through its plant and OEM network; personal care is outside this scope | Current De’Longhi annual report, Braun portfolio disclosure and perpetual-licence announcement, checked August 8, 2026 |
| Breville and Sage manufacturing | Breville Group designs and develops the regional Breville/Sage range and works with external manufacturing partners; public reporting does not provide a complete model-to-factory map | Breville Group Annual Report 2025 and current regional brand disclosures, checked August 8, 2026 |

## Visual decision

- The refreshed evidence does not change the ownership, licence, regional-brand or manufacturing-verification relationships shown in the current diagrams.
- Each article retains one cover and two body diagrams, for nine article visuals in total.
- All nine visuals remain factually aligned; no image file or image reference is changed.
- Separate visual review fallback: `PASS`. The visuals preserve the group-versus-model and licensor-versus-operator boundaries and contain no unsupported new fact.

## Release gates

- Baseline passed content classification, 15 insight tests, 103 brand tests and 19 equipment tests on the production base.
- Local gate: classification, insight tests, brand tests, equipment tests, production build, image decode, metadata/schema review and desktop 1440px plus mobile 390px rendering.
- Review gate: final separate read-only release review with recorded findings.
- Production gate: all three unchanged URLs must return HTTP 200 with expected title, H1, description, canonical, BlogPosting schema, direct manufacturing answer, complete visuals, Guide discovery and sitemap entry.
- Threshold gate: after this release, run the five-page production quality gate for refresh priorities 16–20 before a later batch continues.

## Local release evidence

- Fresh post-edit checks passed content classification, 15 insight tests, 103 brand tests and 19 equipment tests.
- The production build passed and generated 587 pages, including all three unchanged target routes.
- All nine reused article visuals decoded at 1600 x 900; the three author images decoded at 1600 x 1200. Six desktop/mobile page screenshots and all six body-diagram screenshots were inspected separately with no clipping, overlap or unsupported visual claim.
- Six local page combinations (desktop 1440 x 1100 and mobile 390 x 844 for every page) returned HTTP 200 and passed title, H1, description, canonical, BlogPosting schema, direct manufacturing-answer and horizontal-overflow checks.
- All eight unique internal links passed. All three pages were discoverable on Ownership Guide page 2 and present in the sitemap.
- Browser console review found only the expected local `/_vercel/insights/script.js` 404; no page-specific runtime error remained.
- Final read-only scope, invariant and whitespace review: `PASS`; the change set is limited to the three established articles, Batch S evidence, the master refresh queue and this Batch T record.

## Production evidence

- GitHub PR: `#77`.
- Squash-merge commit: `1dc2c974f0b4d91812090a9acf235195be012c52`.
- Git-linked Vercel production deployment: `dpl_7skbuKKZ6wUmvBX9Ecu2vKGLnwDE`, status `READY` with the `worldcleanbiz.com` and `www.worldcleanbiz.com` aliases and no alias error.
- The live De’Longhi, Braun Household and Breville/Sage routes each returned HTTP 200 and passed desktop 1440px plus mobile 390px checks for title, H1, description, canonical, BlogPosting schema, direct manufacturing answer and zero horizontal overflow.
- All nine target article visuals and the shared author asset were available. All eight unique target-page internal links, Ownership Guide page 2 discovery, sitemap entries and browser-console checks passed.
- The priorities 16–20 production quality gate passed across Einhell, Metabo/Metabo HPT, AEG Power Tools, De’Longhi and Braun Household: ten desktop/mobile combinations, image availability, internal links, Guide discovery, sitemap and console review were clean, and ten top-of-page screenshots had no clipping or overflow.
