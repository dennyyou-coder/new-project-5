# WCB SEO Traffic Update Batch C

This release refreshes three existing ownership and manufacturing guides selected from current Search Console demand. All changes are update-first: the original URLs and publication dates are preserved.

## Authorization and scope

- Denny said `continue next batch`; the fixed WCB loop authorizes research, editing, visual review, PR, merge, Git-linked Vercel production and live verification without routine confirmation.
- Work is isolated in `codex/seo-traffic-update-batch-c-20260809` and began from `origin/main` at `c86a9db240cd22ed6f856245fe3798c6a893238d`.
- The saved Search Console export covers July 9 through August 5, 2026. Artifact: `/private/tmp/wcb-gsc-20260808.UsNvPd/`; `网页.csv` SHA-256: `a6d7f7bbd6208e8fd55b54fe842ecdff380e35fc0f30ce0375d8252cb717193c`; `查询数.csv` SHA-256: `f1d333bf591543376681b4dcd2ec7b2d786602c6f8f2906e499b349eaf4ed27f`.
- The prior Batch B queue was stale. DeWalt had already shipped in Batch H; Philips vacuum and WORX had already shipped in Batch K. Current `main`, production and exact-intent checks therefore replaced them with the three highest-impression unrefreshed candidates below.

| Order | Existing guide | Locked slug | 28-day clicks | 28-day impressions | CTR | Average position | Status |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | Who Makes Dolphin Pool Cleaners? | `who-makes-dolphin-pool-cleaners-maytronics` | 1 | 584 | 0.17% | 8.85 | `published_verified` |
| 2 | Who Makes LUBA Robot Mowers? | `who-makes-luba-robot-mowers-mammotion-agilex` | 7 | 540 | 1.30% | 8.93 | `published_verified` |
| 3 | Who Owns Segway Navimow? | `who-owns-segway-navimow-ninebot-willand` | 2 | 354 | 0.56% | 9.91 | `published_verified` |

## Search and collision decision

- Each slug appears exactly once as the authoritative article. No new URL, redirect, canonical or same-intent page is created.
- Dolphin gains a more direct Maytronics-and-Israel title and description for `who makes` and `where made` searches.
- LUBA gains direct China-origin, private-ownership and dealer-count answers. Search Console recorded 26 impressions for `mammotion official global dealer count`, 22 for `mammotion country of origin`, 19 for `where are mammotion mowers made` and 17 for `who owns mammotion`.
- Navimow gains a more compact ownership/manufacturing title plus a careful answer to global-distribution queries. Search Console recorded 23 impressions for `ninebot navimow number of distributors globally`, alongside `who owns`, `manufacturer` and `country of origin` variants.
- Dolphin queries include `where are dolphin pool cleaners made`, `who owns maytronics` and `who makes dolphin pool cleaners`; the refreshed first screen answers all three without changing intent.

## Current primary-source lock

| Topic | Locked conclusion | Current primary evidence checked August 9, 2026 |
|---|---|---|
| Dolphin | Maytronics owns, develops and manufactures Dolphin; core robotic-cleaner production is in Israel, increasingly concentrated at Kibbutz Yizre'el during 2025; exact SKU, plant, component and customs origin remain document-specific | Maytronics 2025 annual report, current corporate governance, timeline, FAQ, subsidiaries, terms and warranty pages |
| LUBA | MAMMOTION makes and markets LUBA; its core current trademark and regulatory entity is in Shenzhen, while Hong Kong, U.S. and German entities have regional roles; public primary materials do not establish an ultimate shareholder chart or one global dealer-company total | Current MAMMOTION About, contact, dealer locator, warranty and regional terms; USPTO, EUIPO, CIPO and model-specific FCC records |
| Navimow | Ninebot controls Willand/Navimow through a 69.26% group interest as of December 31, 2025; Willand owns key trademarks and is the manufacturer named in current manuals; the official 3,000-plus figure describes online and offline distribution channels, not separate distributor companies | Ninebot 2025 annual report, Shanghai Stock Exchange announcement, current Navimow About/legal/privacy/contact pages, trademark record and model manuals |

## Editorial boundaries

- Original `slug`, `date`, `publishedAt` and `sortDate` remain unchanged for all three pages.
- Brand owner, corporate controller, legal manufacturer, physical factory, country of origin, seller, importer, distributor, dealer and warranty provider remain separate roles.
- MAMMOTION's `30+ countries and regions` statement is not converted into a dealer total. Navimow's `3,000+ online and offline distribution channels` is not converted into 3,000 distributor companies.
- A legal manufacturer address or group manufacturing location is not presented as proof of the plant or customs origin for every model and batch.

## Visual review

- Each page retains its existing 1600x900 WebP cover and one 1600x900 explanatory fact map; no factual relationship shown in the visuals changed.
- All six files were decoded and reviewed at original resolution. Company links, ownership limits, regional roles, exact-SKU warnings and labels remain accurate and readable with no clipping or unsupported documentary claims.
- Article-width desktop and 390px rendering remain release gates below.

## Release gates

- Clean baseline passed content classification, 15 insight tests, 103 brand tests and 38 equipment tests before editing.
- Final content classification, all 15 insight tests, all 103 brand tests and all 38 equipment tests passed. The complete production build passed and generated 617 static pages.
- Desktop and 390px browser checks passed for all three routes: expected title, H1, description, canonical and BlogPosting schema; two complete 1600x900 article visuals per page; and no horizontal overflow. All 12 in-article WCB links returned HTTP 200, each route appears on ownership-guide page 9 and exactly once in the sitemap. The only local console error was the expected unavailable `/_vercel/insights/script.js` request outside Vercel.
- A separated second review rechecked the exact diff, unchanged slugs and publication dates, Search Console rows and file hashes, source boundaries, all six original-resolution visuals, latest-main alignment and every release gate. No release blocker remained; an external reviewer was unavailable under the current no-subagent constraint.
- Production requires Vercel `READY`, HTTP 200, expected title/H1/description/canonical/BlogPosting, guide discovery, sitemap presence, complete visuals, internal links and clean desktop/mobile browser checks.

## Production evidence

- PR: [#92](https://github.com/dennyyou-coder/new-project-5/pull/92).
- Squash merge: `bc9a24a87e0871891a2dc958c77274679e472be1`.
- Git-linked Vercel production deployment: `dpl_3wWmBekYF3qDVfMMmcynyDMdHDGx`, `READY`.
- Live verification: all three production URLs returned HTTP 200 and passed expected title, H1, description, canonical, BlogPosting schema, ownership-guide discovery, unique sitemap presence, two complete 1600x900 visuals, 15 internal WCB links, desktop and 390px checks without horizontal overflow or runtime errors.

## Next traffic-first queue

1. `who-makes-aquabot-pool-cleaners-bwt-aquatron`
2. `who-makes-wybot-pool-cleaners-wybotics-wangyuan`
3. `who-owns-aiper-fluidra-stake`

These are update-first candidates from the same 28-day Search Console export after excluding pages already refreshed in earlier batches. Reconfirm current query rows, production state and intent overlap before editing.
