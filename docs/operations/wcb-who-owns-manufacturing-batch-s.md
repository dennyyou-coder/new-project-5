# WCB Who Owns Manufacturing Refresh Batch S

This record covers the sixth three-page release in the sitewide manufacturing-answer refresh.

## Authorization and scope

- Denny instructed the next batch to continue automatically through production.
- Work is isolated in `codex/wcb-who-owns-manufacturing-batch-s-20260808` from current `origin/main` at `81a6f96198b61d9a3380675b7f119c2615b3b82b`.
- All three established pages are updated in place. Slugs, canonicals, original publication dates, sort dates and visual packages remain unchanged.
- Batch R is mechanically synchronized to `published_verified`; the new Batch S rows remain `local_verified` until production verification passes.

| Order | Updated page | Existing slug | Main update | Status |
|---:|---|---|---|---|
| 1 | Who Owns Einhell? Public Company, Power X-Change and Manufacturing Explained | `who-owns-einhell-power-x-change` | Direct first-screen supplier-production and group battery-factory answer, with exact-model legal-manufacturer and origin boundaries | `local_verified` |
| 2 | Who Owns Metabo and Metabo HPT? Koki Holdings, HiKOKI and Brand Names Explained | `who-owns-metabo-metabo-hpt-hikoki` | Brand-specific first-screen answer separating Metabo's Nürtingen manufacturing from the Koki/HiKOKI production network | `local_verified` |
| 3 | Who Owns AEG Power Tools? Electrolux Trademark, TTI License and Manufacturing Explained | `who-owns-aeg-power-tools-tti-license` | Direct first-screen trademark-owner, licensed operator, manufacturing group and exact-model factory boundary | `local_verified` |

## Search and collision decision

- The order follows the confirmed brand-search opportunity queue after completion of the first fifteen pages.
- Repository checks found one managed page for each exact slug and combined ownership/manufacturing intent. The separate Ozito guide covers a different brand intent. Decision: update in place and create no competing URL.

## Current primary-source lock

| Topic | Locked conclusion | Current primary evidence |
|---|---|---|
| Einhell manufacturing | Einhell controls design, quality and sourcing; most of the current range is produced in China by suppliers, while batteries and chargers also use group-owned facilities in Kunshan and Hungary | Einhell 2025 annual report, checked August 8, 2026 |
| Metabo and Metabo HPT manufacturing | Metabowerke manufactures named product families and components in Nürtingen; HiKOKI and Metabo HPT use Koki Holdings' Japanese and overseas production network, but no group list allocates every SKU | Current Metabo manufacturing disclosure and Koki Holdings environmental-management factory list, checked August 8, 2026 |
| AEG Power Tools manufacturing | Electrolux owns the AEG trademark; TTI is the licensed industrial operator and manufacturing group, while regional TTI entities can sell or warrant products and the exact plant remains model-specific | Current AEG Power Tools company information, warranty terms, brand history and TTI trademark disclosure, checked August 8, 2026 |

## Visual decision

- The refreshed evidence does not change any ownership, licensing, battery-platform or production-network relationship shown in the current diagrams.
- Einhell and AEG each retain one cover and two body diagrams. Metabo retains one cover and one body diagram.
- All eight article visuals remain factually aligned; no image file or image reference is changed.
- Separate visual review fallback: `PASS`. The visuals retain clear ownership/manufacturing boundaries, remain relevant to the new first-screen answers and contain no new unsupported fact.

## Release gates

- Baseline passed content classification, 15 insight tests, 103 brand tests and 19 equipment tests on the current production base.
- The scheduled production quality gate for refreshed pages 11–15 passed before Batch S edits: ten desktop/mobile viewport combinations, 32 complete image loads, 41 internal links, Guide discovery on pages 11, 11, 9, 6 and 5, and all five sitemap entries passed with no unexpected console error. Visual inspection of all ten screenshots found no clipping, overlap or responsive-layout defect.
- Local gate: classification, insight tests, brand tests, equipment tests, production build, image decode, metadata/schema review and desktop 1440px plus mobile 390px rendering.
- Review gate: final separate read-only release review with recorded findings.
- Production gate: all three unchanged URLs must return HTTP 200 with expected title, H1, description, canonical, BlogPosting schema, direct manufacturing answer, complete visuals, guide discovery and sitemap entry.

## Local release evidence

- Content classification passed.
- All 15 insight tests, all 103 brand tests and all 19 equipment tests passed on the current production base.
- The production build completed successfully and generated 587 pages, including all three unchanged article routes and the three new equipment routes already integrated in the current base.
- All eight reused article visuals retained 1600x900 canvases and loaded completely; the three author-card images also loaded at 1600x1200.
- Desktop 1440px and mobile 390px checks passed for HTTP status, title, H1, description, production canonical, BlogPosting schema, direct manufacturing answer and zero horizontal overflow.
- Einhell and AEG each loaded three complete article visuals; Metabo loaded two. The only local browser errors were the expected unavailable Vercel Insights requests outside Vercel.
- All 12 unique WCB internal links passed. Ownership Guide discovery passed on page 5 for Einhell, page 6 for Metabo and page 4 for AEG. All three sitemap entries passed.
- Visual inspection of all six viewport screenshots confirmed stable desktop and mobile article headers, readable metadata and no clipping or overlap.
- Final separate read-only release review returned `PASS`: the exact scope is three established articles plus the Batch R production record, refresh queue and this Batch S record; titles, slugs, original publication dates, sort dates and image references are unchanged; each new answer remains inside the refreshed primary-source lock and preserves the model-level manufacturer, factory and origin boundary; `git diff --check` is clean.

## Production evidence

- GitHub PR: `#76`.
- Squash-merge commit: `7cc96bb147d7bd5d7c2dde43c390b9ff6abaf0f7`.
- Git-linked Vercel production deployment: `dpl_HnmbotXyo2my41V9zU8WSW9uVhLH`, status `READY` with the `worldcleanbiz.com` alias and no alias error.
- The live Einhell, Metabo/Metabo HPT and AEG Power Tools routes each returned HTTP 200 and passed desktop 1440px plus mobile 390px checks for title, H1, description, canonical, BlogPosting schema, direct manufacturing answer and zero horizontal overflow.
- All eight live article visuals loaded completely. All 12 unique WCB internal links, Ownership Guide discovery on pages 5, 6 and 4 respectively, and all three sitemap entries passed; no browser-console error remained.
