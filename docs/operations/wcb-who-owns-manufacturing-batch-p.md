# WCB Who Owns Manufacturing Refresh Batch P

This record covers the third three-page release in the sitewide manufacturing-answer refresh.

## Authorization and scope

- Denny instructed the next batch to continue automatically through production.
- Work is isolated in `codex/wcb-who-owns-manufacturing-batch-p-20260808` from `origin/main` at `a884250f4eb682b96b88e8a6ddb0485c0a5bd6ce`.
- All three established pages are updated in place. Slugs, canonicals, original publication dates, sort dates and visual packages remain unchanged.
- Article-level publish fields are mechanically synchronized to `published_verified` where needed because all three existing URLs were already live; the new Batch P edits remain `local_verified` until this release passes production.

| Order | Updated page | Existing slug | Main update | Status |
|---:|---|---|---|---|
| 1 | Who Owns BISSELL? The Bissell Family, Sanitaire and Its Manufacturing Network Explained | `who-owns-bissell-family-sanitaire` | Direct first-screen answer explaining BISSELL's audited finished-goods supplier network and model-level factory boundary | `local_verified` |
| 2 | Who Owns Whirlpool Appliances? Whirlpool Corporation, Beko Europe and Regional Brand Rights Explained | `who-owns-whirlpool-appliances-beko-europe` | Direct first-screen Americas-versus-Beko-Europe manufacturing answer | `local_verified` |
| 3 | Who Owns Hoover? TTI, Haier and the Brand's Regional Split Explained | `who-owns-hoover-tti-haier-candy` | Direct first-screen market-specific manufacturer and factory boundary | `local_verified` |

## Search and collision decision

- Fresh GSC window: 2026-07-09 through 2026-08-05.
- The three pages were either published late in or after the export window and did not have enough page-level data to justify inventing traffic differences; their order follows the confirmed structural audit and brand-search opportunity queue.
- Repository, production, Ownership Guide and sitemap checks found one established page for each combined owner and manufacturing intent. Decision: update in place and create no competing URL.

## Current primary-source lock

| Topic | Locked conclusion | Current primary evidence |
|---|---|---|
| BISSELL manufacturing | BISSELL remains family-owned but works with multiple major finished-goods suppliers and audits them; one brand-level factory answer would be misleading | BISSELL 2026 company materials and January-December 2025 supply-chain statement |
| Whirlpool manufacturing | Whirlpool Corporation operates the principal Americas manufacturing network; Beko Europe operates 11 European production sites within the portfolio that includes licensed Whirlpool rights; exact factories remain model-specific | Whirlpool Corporation 2025 annual report, Beko Europe current company and manufacturing disclosures, and current KAP ownership disclosure |
| Hoover manufacturing | TTI's global Floorcare & Cleaning organization covers Hoover manufacturing in its operating scope, while European Hoover appliances sit in Haier Europe's Candy-Hoover system; neither relationship assigns one factory to all Hoover products | TTI 2025 annual report, current Hoover U.S. legal notices, Haier Europe Hoover materials and Candy Hoover manufacturing certification |

## Visual decision

- Ownership and manufacturing conclusions did not change, and the existing visuals do not claim a model-level factory, so all seven current article visuals remain factually aligned.
- BISSELL and Hoover each retain one cover and one body visual. Whirlpool retains one cover and two body visuals.
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
- All seven reused article visuals loaded completely at 1600x900. The five WebP files decoded at 1600x900, and both Whirlpool SVG files declare 1600x900 canvases and rendered at those dimensions.
- Desktop 1440px and mobile 390px checks passed for HTTP status, title, H1, description, production canonical, BlogPosting schema, the direct manufacturing answer and zero horizontal overflow.
- BISSELL and Hoover each loaded two complete article visuals; Whirlpool loaded three complete article visuals.
- The only local browser error was the expected unavailable `/_vercel/insights/script.js` outside Vercel.
- All 11 unique article-level internal links passed: three on BISSELL, six on Whirlpool and two on Hoover.
- Ownership Guide discovery passed on page 10 for BISSELL and Hoover and page 3 for Whirlpool. All three sitemap entries passed.
- Visual inspection of all six viewport screenshots confirmed stable desktop and mobile article headers, readable metadata and no clipping or overlap.
- Final separate read-only release review returned `PASS`: the exact scope is three established articles plus the Batch O production record, refresh queue and new Batch P record; titles, slugs, publication dates, sort dates and image references are unchanged; every new manufacturing statement is inside the current primary-source lock and retains the model-level factory boundary; `git diff --check` is clean.

## Production evidence

- GitHub PR [#72](https://github.com/dennyyou-coder/new-project-5/pull/72) was squash-merged into `main` as `8bd412c30218819f3e808edddc4218c3470eabb8`.
- Git-linked Vercel production deployment `dpl_GXQLLioGkLNJWcXPxb7n5twxCMNb` reached `READY` for that exact merge commit.
- The live BISSELL, Whirlpool and Hoover URLs returned HTTP 200 and passed desktop 1440px plus mobile 390px checks for title, H1, description, canonical, BlogPosting schema, first-screen manufacturing answer, zero horizontal overflow and complete visuals.
- All seven live article visuals and all 11 unique article-level internal links loaded successfully.
- Ownership Guide discovery passed on page 10 for BISSELL and Hoover and page 3 for Whirlpool; all three sitemap entries were present.
- A cumulative regression check covered the first nine refreshed articles at both desktop and mobile sizes: all 18 page/viewport combinations passed with zero failures or browser errors, and the exact-intent collision check found no competing ownership/manufacturing URL.
