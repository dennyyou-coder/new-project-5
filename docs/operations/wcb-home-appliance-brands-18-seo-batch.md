# WCB Home Appliance Brands — 18-Article SEO Batch

This file is the operational source of truth for the home-appliance ownership and manufacturing SEO batch.

## Authorization and rules

- Research and batch plan approved by Denny on 2026-08-05.
- Batch 1 publication, visual generation and normal GitHub/Vercel release authorized on 2026-08-05.
- No per-article confirmation is required for the unchanged approved scope.
- Maximum: three new production articles per natural day (Asia/Shanghai), including other WCB batches.
- Pause only for a material title, slug, factual-boundary, asset, permission or deployment problem.
- Article bodies, visuals and release evidence remain in this website project.

## Status values

- `planned`
- `researching`
- `local_verified`
- `preview_verified`
- `published_verified`
- `blocked`

## Fixed order

| No. | Brand/topic | Slug | Batch | Status | Production URL / note |
|---:|---|---|---:|---|---|
| 1 | Samsung | `who-makes-samsung-appliances-manufacturing-bespoke-ai` | 1 | `local_verified` | Local release gate passed on 2026-08-05 |
| 2 | LG | `who-makes-lg-appliances-manufacturing-network` | 1 | `researching` |  |
| 3 | Haier | `who-owns-haier-appliances-brand-portfolio` | 1 | `researching` |  |
| 4 | GE Appliances | `who-owns-ge-appliances-haier-manufacturing` | 2 | `planned` |  |
| 5 | Fisher & Paykel | `who-owns-fisher-paykel-haier-manufacturing` | 2 | `planned` |  |
| 6 | Midea | `who-owns-midea-appliances-brand-portfolio` | 2 | `planned` |  |
| 7 | Toshiba Appliances | `who-owns-toshiba-appliances-midea-lifestyle` | 3 | `planned` |  |
| 8 | Whirlpool | `who-owns-whirlpool-appliances-beko-europe` | 3 | `planned` |  |
| 9 | KitchenAid | `who-makes-kitchenaid-appliances-whirlpool` | 3 | `planned` |  |
| 10 | Beko | `who-owns-beko-appliances-beko-europe` | 4 | `planned` |  |
| 11 | Hotpoint | `who-owns-hotpoint-appliances-regional-split` | 4 | `planned` |  |
| 12 | Hisense | `who-owns-hisense-appliances-gorenje-asko` | 4 | `planned` |  |
| 13 | Gorenje | `who-owns-gorenje-appliances-hisense` | 5 | `planned` |  |
| 14 | Panasonic | `who-owns-panasonic-appliances-vacuum-manufacturing` | 5 | `planned` |  |
| 15 | Groupe SEB | `who-owns-groupe-seb-brands-supor` | 5 | `planned` |  |
| 16 | Rowenta | `who-owns-rowenta-groupe-seb-vacuums` | 6 | `planned` |  |
| 17 | SUPOR | `who-owns-supor-groupe-seb-manufacturing` | 6 | `planned` |  |
| 18 | De'Longhi | `who-owns-delonghi-appliance-group-brands` | 6 | `planned` |  |

## Batch 1 checkpoint

- Baseline on `origin/main` commit `7061097`: content classification passed; 14 insight tests passed; 82 brand tests passed.
- Exact local slugs were absent before writing. Official-source review is in progress.
- FEIN and Matco were already published on 2026-08-05 at 20:58 and 21:02 Asia/Shanghai. The natural-day limit therefore leaves one production slot on 2026-08-05; the remaining Batch 1 pages must not be released before the next eligible day.
- Visual system: `industry_map`; each article uses one unbranded conceptual cover and two deterministic relationship/verification maps.

### Samsung local release gate

- Exact title and slug matched the approved table; the live target returned `404` before release.
- The article contains 2,026 file words, five relevant internal article links, six official Samsung sources, an at-a-glance table, B2B verification checklist, FAQ and final answer.
- Ownership/manufacturer boundaries distinguish Samsung Electronics, Digital Appliances, regional companies, the Newberry washing-machine facility, model-level origin, SmartThings and local warranty responsibility.
- The visual package contains one reviewed unbranded 1600×900 WebP cover and two deterministic 1600×900 SVG maps. One cover repair removed generated pseudo-characters; the second visual review passed.
- Content classification, 14 insight tests, 82 brand tests and a 477-page production build passed.
- The local production route exposed the expected title, H1, description, production canonical, BlogPosting JSON-LD, three loaded 1600×900 article visuals and nine internal article links.
- Desktop and 390px mobile checks found no horizontal overflow. The only local console error was the expected unavailable `/_vercel/insights/script.js`.
- Independent Agent review was unavailable under the current execution constraint; a separate second-pass English, fact-boundary, image and release review returned `PASS`.
