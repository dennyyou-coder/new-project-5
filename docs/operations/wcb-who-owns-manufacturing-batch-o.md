# WCB Who Owns Manufacturing Refresh Batch O

This record covers the second three-page release in the sitewide manufacturing-answer refresh.

## Authorization and scope

- Denny instructed the next batch to continue automatically through production.
- Work is isolated in `codex/wcb-who-owns-manufacturing-batch-o-20260808` from `origin/main` at `ff484c3e70a4a297d28c90bd7f0f1a433ff81371`.
- All three established pages are updated in place. Slugs, canonicals, original publication dates, sort dates and visual packages remain unchanged.
- Their article-level publish fields are mechanically synchronized to `published_verified`, reflecting the already verified live URLs; the new Batch O edits remain `local_verified` until this release passes production.

| Order | Updated page | Existing slug | Main update | Status |
|---:|---|---|---|---|
| 1 | Who Owns TTI? Milwaukee, Ryobi, Hoover, Vax and Oreck Explained | `who-owns-tti-milwaukee-ryobi-hoover-vax-oreck` | Direct group-manufacturing answer plus an explicit Who Makes section heading | `local_verified` |
| 2 | Who Owns ECOVACS? Public Company, Tineco and Manufacturing Explained | `who-owns-ecovacs-tineco-manufacturing` | Direct first-screen in-house manufacturing and model-level boundary | `local_verified` |
| 3 | Who Owns Electrolux? Shareholders, Brands and Manufacturing Explained | `who-owns-electrolux-brands-manufacturing` | Direct first-screen global factory, supplier and model-level boundary | `local_verified` |

## Search and collision decision

- Fresh GSC window: 2026-07-09 through 2026-08-05.
- TTI baseline: 2 clicks, 298 impressions, 0.67% CTR and average position 9.07.
- ECOVACS and Electrolux were first published after the GSC export window, so the batch uses the confirmed structural audit and brand-search opportunity rather than inventing page-level baseline values.
- Repository, production, ownership-guide and sitemap checks found one established page for each combined owner and manufacturing intent. Decision: update in place and create no competing URL.

## Current primary-source lock

| Topic | Locked conclusion | Current primary evidence |
|---|---|---|
| TTI manufacturing | TTI has a diversified global manufacturing footprint and manufacturing subsidiaries across power equipment and floorcare; external suppliers and model-specific assignments remain part of the network | Current TTI 2025 annual report and principal-subsidiary disclosure |
| ECOVACS manufacturing | Ecovacs Robotics mainly uses self-production and has capability from components to finished robots, but one factory cannot be assigned to every current model | Current Ecovacs 2025 annual report plus official group manufacturing history |
| Electrolux manufacturing | Electrolux Group operates factories in multiple regions and also uses suppliers; the exact legal manufacturer, factory and origin remain model-specific | Current Electrolux 2025 annual report and official Kinston and Brazil factory disclosures |

## Visual decision

- Ownership and manufacturing conclusions did not change, so all eight existing 1600x900 WebP visuals remain factually aligned.
- TTI retains one cover and one body visual. ECOVACS and Electrolux each retain one cover and two body visuals.
- No image file or image reference is changed in this batch.

## Release gates

- Baseline passed content classification, 15 insight tests and 103 brand tests on the production base.
- Local gate: classification, insight tests, brand tests, production build, image decode, metadata/schema review and desktop 1440px plus mobile 390px rendering.
- Review gate: final read-only release review with recorded findings.
- Production gate: all three unchanged URLs must return HTTP 200 with expected title, H1, description, canonical, BlogPosting schema, direct manufacturing answer, complete visuals, guide discovery and sitemap entry.

## Local release evidence

- Content classification passed.
- All 15 insight tests and all 103 brand tests passed after the final edits.
- The production build completed successfully and generated 582 pages, including all three unchanged article routes.
- All eight reused article visuals decode as 1600x900 WebP files.
- Desktop 1440px and mobile 390px checks passed for HTTP status, title, H1, description, production canonical, BlogPosting schema, the direct manufacturing answer and zero horizontal overflow.
- TTI loaded two complete article visuals; ECOVACS and Electrolux each loaded three complete article visuals.
- The only local browser error was the expected unavailable `/_vercel/insights/script.js` outside Vercel.
- All 13 unique article-level internal links passed: two on TTI, five on ECOVACS and six on Electrolux.
- Ownership-guide discovery passed on page 10 for TTI and page 1 for ECOVACS and Electrolux. All three sitemap entries passed.
- Visual inspection of all six viewport screenshots confirmed stable desktop and mobile article headers, readable metadata and no clipping or overlap.
- Final read-only release review returned `PASS`: the diff is limited to three article files and three operational records; slugs, titles, publication dates, sort dates and image references remain unchanged; primary-source and model-level manufacturing boundaries are preserved.

## Production evidence

- GitHub PR [#70](https://github.com/dennyyou-coder/new-project-5/pull/70) was squash-merged into `main` as `a884250f4eb682b96b88e8a6ddb0485c0a5bd6ce`.
- Git-linked Vercel production deployment `dpl_8Q7TGpHGmH8sm656Hzpo2CFfCwyk` reached `READY` for that exact merge commit.
- All three canonical production URLs returned HTTP 200 on desktop and 390px mobile with the expected title, H1, description, canonical, BlogPosting schema, direct manufacturing answer and zero horizontal overflow.
- All eight article visuals, all 13 unique article-level internal links, Ownership Guide discovery and sitemap entries passed on production. Article-page browser consoles were clean; the sitemap XML view only requested a missing `/favicon.ico`, which did not affect article delivery or indexing.
