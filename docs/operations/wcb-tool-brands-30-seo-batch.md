# WCB Tool Brands 30-Article SEO Batch

This website-project record is the operational source of truth for the first tool-brand ownership SEO batch. It does not recreate the retired Obsidian writing system.

## Authorization and rules

- Batch authorization: approved by Denny on 2026-08-03.
- Scope: publish the remaining 27 articles in the fixed order below without per-article approval.
- Maximum: three new articles per publishing day.
- Quality gates: after each five `published_verified` articles.
- Maintenance: natural day 6 and natural day 12 of the resumed schedule.
- Pause only for a material topic, primary-keyword, slug, factual-boundary, permission or deployment problem.
- Article bodies, visuals, release records and SEO data stay in this website project.

## Status values

- `queued`
- `researching`
- `local_verified`
- `preview_verified`
- `published_verified`
- `blocked`

## Fixed order

| No. | Brand/topic | Slug | Status | Production URL / note |
|---:|---|---|---|---|
| 1 | Milwaukee | `who-owns-milwaukee-tools-tti-manufacturing` | `published_verified` | https://worldcleanbiz.com/blog/who-owns-milwaukee-tools-tti-manufacturing |
| 2 | Makita | `who-owns-makita-company-manufacturing` | `published_verified` | https://worldcleanbiz.com/blog/who-owns-makita-company-manufacturing |
| 3 | Bosch Power Tools | `who-owns-bosch-power-tools-robert-bosch` | `published_verified` | https://worldcleanbiz.com/blog/who-owns-bosch-power-tools-robert-bosch |
| 4 | CRAFTSMAN | `who-owns-craftsman-tools-stanley-black-decker` | `published_verified` | Production deployment and live verification completed on 2026-08-03 |
| 5 | Kobalt | `who-makes-kobalt-tools-lowes-suppliers` | `published_verified` | Production deployment and live verification completed on 2026-08-03 |
| 6 | SKIL | `who-owns-skil-tools-chervon` | `published_verified` | https://worldcleanbiz.com/blog/who-owns-skil-tools-chervon |
| 7 | Hilti | `who-owns-hilti-family-trust-manufacturing` | `published_verified` | https://worldcleanbiz.com/blog/who-owns-hilti-family-trust-manufacturing |
| 8 | Festool | `who-owns-festool-tts-tooltechnic-systems` | `published_verified` | https://worldcleanbiz.com/blog/who-owns-festool-tts-tooltechnic-systems |
| 9 | Metabo / Metabo HPT / HiKOKI | `who-owns-metabo-metabo-hpt-hikoki` | `published_verified` | https://worldcleanbiz.com/blog/who-owns-metabo-metabo-hpt-hikoki |
| 10 | FLEX | `who-owns-flex-tools-chervon-lowes` | `local_verified` | Draft, original visuals, content checks, production build and desktop/mobile local verification passed; publish first, then run quality gate 2 |
| 11 | Porter-Cable | `who-owns-porter-cable-stanley-black-decker` | `local_verified` | Draft, original visuals, content checks, production build and desktop/mobile local verification passed; release follows quality gate 2 |
| 12 | Dremel | `who-owns-dremel-bosch-manufacturing` | `local_verified` | Draft, original visuals, content checks, production build and desktop/mobile local verification passed; release follows quality gate 2 |
| 13 | Snap-on | `who-owns-snap-on-tools-company-manufacturing` | `queued` |  |
| 14 | STIHL | `who-owns-stihl-family-manufacturing` | `queued` |  |
| 15 | Einhell | `who-owns-einhell-power-x-change` | `queued` | Quality gate 3 triggers after publication |
| 16 | Kress | `who-owns-kress-positec-robot-mowers` | `queued` |  |
| 17 | Parkside | `who-makes-parkside-tools-lidl-suppliers` | `queued` |  |
| 18 | HART Tools | `who-makes-hart-tools-walmart-tti-2026` | `queued` | High time-sensitivity |
| 19 | Bauer | `who-makes-bauer-tools-harbor-freight` | `queued` |  |
| 20 | Hercules | `who-makes-hercules-tools-harbor-freight` | `queued` | Quality gate 4 triggers after publication |
| 21 | Masterforce | `who-makes-masterforce-tools-menards` | `queued` |  |
| 22 | Ozito | `who-makes-ozito-tools-einhell-bunnings` | `queued` |  |
| 23 | Erbauer | `who-makes-erbauer-tools-kingfisher` | `queued` |  |
| 24 | Evolution Power Tools | `who-owns-evolution-power-tools` | `queued` | High time-sensitivity |
| 25 | Triton Tools | `who-owns-triton-tools-kreg` | `queued` | Quality gate 5 triggers after publication; high time-sensitivity |
| 26 | FEIN | `who-owns-fein-tools-company-manufacturing` | `queued` |  |
| 27 | Matco Tools | `who-owns-matco-tools-vontier` | `queued` |  |
| 28 | Mac Tools | `who-owns-mac-tools-stanley-black-decker` | `queued` |  |
| 29 | Chervon | `who-owns-chervon-ego-flex-skil` | `queued` |  |
| 30 | AEG Power Tools | `who-owns-aeg-power-tools-tti-license` | `queued` | Quality gate 6 triggers after publication; high time-sensitivity |

## Current checkpoint

- Articles 1–6 are `published_verified`.
- Denny clarified that CRAFTSMAN, Kobalt and SKIL count toward the previous publishing day. Articles 7–9 are `published_verified` as the current publishing day's three releases.
- Next after day 3 publication: article 10 FLEX, which triggers quality gate 2 after publication.
- Existing unrelated local work in the main checkout must not be mixed into this batch.

## Publishing day 4 local gate — articles 10–12

- Checked 2026-08-04 after midnight (Asia/Shanghai).
- `verify:content-classification`, `test:insights`, `test:brands` and the production build passed.
- All three local article routes returned 200 with the expected title, H1, meta description, canonical URL and Article JSON-LD.
- Both article visuals on every page decoded at 1600×900; internal links were present.
- Desktop and 390px mobile checks found no horizontal overflow.
- The only local console error was the expected unavailable `/_vercel/insights/script.js`; preview and production verification remain required.
- Release order is fixed: FLEX first, quality gate 2 for articles 6–10 second, then Porter-Cable and Dremel.

## Publishing day 3 local gate — articles 7–9

Completed on 2026-08-03 in preparation for the next publishing day.

- Hilti: 2,432 words, exact fixed title and slug, Family Trust ownership, multi-country manufacturing, direct-sales, Fleet Management, Nuron and dust-control boundaries verified.
- Festool: 2,302 words, exact fixed title and slug, TTS/Festool/Tanos/TTS Cleantec/Festo identities and European production boundaries verified.
- Metabo / Metabo HPT / HiKOKI: 2,436 words, exact fixed title and slug, 2016 acquisition, 2017 separation from Hitachi, regional naming and the 2025–2026 North American transition verified.
- Each article has one original 1600×900 WebP cover and one deterministic 1600×900 SVG relationship map.
- Content classification, 14 insight tests, 82 brand tests and a 457-page production build passed.
- All three local production pages returned 200 with correct title, H1, Meta Description, canonical, JSON-LD, internal links and both article images.
- Desktop and 390px browser checks found no horizontal overflow. The only console error was the expected local `/_vercel/insights/script.js` 404.
- Draft PR #8 Vercel Preview returned 200 for all three pages; title, H1, Meta Description, canonical, JSON-LD, both 1600×900 visuals and internal links were verified again with no browser console errors.
- Denny confirmed the publishing-day boundary after preview verification: CRAFTSMAN, Kobalt and SKIL belong to the previous day, so Hilti, Festool and Metabo / Metabo HPT / HiKOKI may publish as the current day's three articles.
- PR #8 was squash-merged and production deployment `dpl_3NrvtUQiihtEk8fbx2DSyXWgovhQ` reached READY. All three production URLs returned 200 with correct SEO metadata, JSON-LD, two 1600×900 visuals, internal links and 390px layouts; `/guides/ownership` and `sitemap.xml` include all three slugs, and the production browser reported no console errors.

## Quality gate 1 — articles 1–5

Completed on 2026-08-03 after five `published_verified` articles.

- All five production URLs returned 200 and appeared in `sitemap.xml` and `/guides/ownership`.
- SEO title, H1, Meta Description, canonical and JSON-LD were present and correct on all five pages.
- Article cover images loaded at 1600×900; the two new relationship diagrams also loaded at 1600×900.
- All five pages matched the 390px viewport without horizontal overflow; the automated production pass reported no browser console errors.
- Existing ownership-intent pages were reviewed for cannibalization. The separate Milwaukee 2761 product story, TTI parent-company guide, DeWalt ownership guide and Bosch appliance guide have distinct search intent.
- CRAFTSMAN and Kobalt internal article links returned 200. The gate added related-article links to the first three articles and corrected Bosch Power Tools' canonical brand slug.
- Ownership, manufacturing, supplier, battery-platform, recall and warranty boundaries were rechecked. No title, primary-keyword, slug or factual-boundary change was required.
- The five articles retain brand-specific evidence and structure; no mechanical duplicate-body issue was found.
- Content classification, brand tests and a 453-page production build passed after the gate fixes.
- GSC query evidence is not yet meaningful for the newly published pages; review is deferred to the next maintenance window rather than treated as a failure.
