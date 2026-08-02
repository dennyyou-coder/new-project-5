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
| 6 | SKIL | `who-owns-skil-tools-chervon` | `queued` |  |
| 7 | Hilti | `who-owns-hilti-family-trust-manufacturing` | `queued` |  |
| 8 | Festool | `who-owns-festool-tts-tooltechnic-systems` | `queued` |  |
| 9 | Metabo / Metabo HPT / HiKOKI | `who-owns-metabo-metabo-hpt-hikoki` | `queued` |  |
| 10 | FLEX | `who-owns-flex-tools-chervon-lowes` | `queued` | Quality gate 2 triggers after publication |
| 11 | Porter-Cable | `who-owns-porter-cable-stanley-black-decker` | `queued` |  |
| 12 | Dremel | `who-owns-dremel-bosch-manufacturing` | `queued` |  |
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

- Resume point: article 4, CRAFTSMAN.
- Next after CRAFTSMAN: Kobalt, then quality gate 1 for articles 1–5, then SKIL.
- Existing unrelated local work in the main checkout must not be mixed into this batch.

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
