# WCB Home Appliance Brands — 18-Article SEO Batch

This file is the operational source of truth for the home-appliance ownership and manufacturing SEO batch.

## Authorization and rules

- Research and batch plan approved by Denny on 2026-08-05.
- Batch 1 publication, visual generation and normal GitHub/Vercel release authorized on 2026-08-05.
- No per-article confirmation is required for the unchanged approved scope.
- Daily publishing cap: cancelled by Denny on 2026-08-05. Articles are released by verified content batch.
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
| 1 | Samsung | `who-makes-samsung-appliances-manufacturing-bespoke-ai` | 1 | `published_verified` | https://worldcleanbiz.com/blog/who-makes-samsung-appliances-manufacturing-bespoke-ai |
| 2 | LG | `who-makes-lg-appliances-manufacturing-network` | 1 | `published_verified` | https://worldcleanbiz.com/blog/who-makes-lg-appliances-manufacturing-network |
| 3 | Haier | `who-owns-haier-appliances-brand-portfolio` | 1 | `published_verified` | https://worldcleanbiz.com/blog/who-owns-haier-appliances-brand-portfolio |
| 4 | GE Appliances | `who-owns-ge-appliances-haier-manufacturing` | 2 | `local_verified` | Local release gate passed on 2026-08-06 |
| 5 | Fisher & Paykel | `who-owns-fisher-paykel-haier-manufacturing` | 2 | `local_verified` | Local release gate passed on 2026-08-06 |
| 6 | Midea | `who-owns-midea-appliances-brand-portfolio` | 2 | `local_verified` | Local release gate passed on 2026-08-06 |
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
- FEIN and Matco were already published on 2026-08-05. Denny subsequently cancelled the daily publishing cap, so Samsung, LG and Haier remain one release unit after all three pass verification.
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

### LG local release gate

- The article contains 2,124 file words, five relevant internal article links and seven official LG sources, plus an at-a-glance table, procurement checklist, FAQ and final answer.
- The responsibility boundary separates LG Electronics, the Home Appliance Solution Company, Changwon Smart Park, the Tennessee washing-machine plant, ThinQ services and model-level local responsibility.
- One repaired unbranded 1600×900 WebP cover and two deterministic 1600×900 SVG maps passed visual review; matching raw PNGs are stored in the approved article asset folder.
- The local production page exposed the expected title, H1, description, production canonical, BlogPosting JSON-LD, three loaded 1600×900 article visuals and five internal article links.
- Desktop and 390px mobile checks found no horizontal overflow. The only console error was the expected unavailable local Vercel Insights script.

### Haier local release gate

- The article contains 2,146 file words, six relevant internal article links and eight official Haier or Haier Smart Home sources, plus an at-a-glance table, procurement checklist, FAQ and final answer.
- The ownership boundary separates Haier Group from listed Haier Smart Home, then distinguishes GE Appliances' licensed trademark, Fisher & Paykel, Candy and the Hoover Europe/Americas regional split.
- One repaired unbranded 1600×900 WebP cover and two deterministic 1600×900 SVG maps passed visual review; matching raw PNGs are stored in the approved article asset folder.
- The local production page exposed the expected title, H1, description, production canonical, BlogPosting JSON-LD, three loaded 1600×900 article visuals and six internal article links.
- Desktop and 390px mobile checks found no horizontal overflow. The only console error was the expected unavailable local Vercel Insights script.

### Batch 1 local gate

- Samsung, LG and Haier now form one verified release unit after the daily publishing cap was cancelled.
- Content classification, 14 insight tests, 82 brand tests and a 479-page production build passed with all three articles present.
- All three article routes use the established WCB ownership-guide structure and remain inside the approved content, image and operational-record scope.

### Batch 1 production gate

- PR #28 was merged to `main` at commit `f138c628`; Vercel production deployment `dpl_ChZVxqXbYkxyzMa2qEexHB3TJP34` reached `READY` on 2026-08-05.
- The Samsung, LG and Haier production routes returned `200` with the expected title, canonical, structured data and article visuals.
- The Brand Ownership guide and production sitemap both exposed all three slugs; desktop and 390px mobile production checks passed.

## Batch 2 checkpoint

- Baseline on `origin/main` commit `96f298d`: content classification passed; 15 insight tests passed; 83 brand tests passed.
- Exact repository, production-route, ownership-guide and sitemap checks found no existing GE Appliances, Fisher & Paykel or Midea target slug before writing. Each target route returned `404`.
- Research used current first-party corporate, investor, legal, manufacturing and warranty disclosures. Ownership, trademark, factory, seller and warranty responsibilities are kept separate at model and market level.
- Visual system: `industry_map`; each article uses one reviewed unbranded 1600×900 WebP cover and two deterministic 1600×900 relationship or verification maps.

### GE Appliances local release gate

- The article contains 1,973 file words, five relevant internal links, official GE Appliances, General Electric and Haier Smart Home sources, an at-a-glance table, buyer checklist, FAQ and final answer.
- The responsibility boundary separates Haier Smart Home ownership, Haier US Appliance Solutions as legal operator, GE trademark licensing, U.S. manufacturing examples and model-level warranty responsibility.
- One repaired unbranded cover and two repaired deterministic maps passed the final visual review.

### Fisher & Paykel local release gate

- The article contains 1,915 file words, five relevant internal links, official Fisher & Paykel and Haier sources, an at-a-glance table, buyer checklist, FAQ and final answer.
- The responsibility boundary distinguishes the 2009 and 2012 ownership steps, the continuing premium brand identity, current factory countries, supplier production and regional warranty entities.
- One repaired unbranded cover and two repaired deterministic maps passed the final visual review.

### Midea local release gate

- The article contains 2,109 file words, five relevant internal links, current Midea Group investor and regional warranty sources, an at-a-glance table, buyer checklist, FAQ and final answer.
- The responsibility boundary separates listed Midea Group, its Smart Home business, selected appliance brands, overseas operating scale, model origin, local seller and warranty provider.
- One repaired unbranded cover and two repaired deterministic maps passed the final visual review.

### Batch 2 local gate

- Content classification, 15 insight tests, 83 brand tests and a 495-page production build passed with all three articles present.
- Each local article route returned `200` and exposed the expected title, H1, description, production canonical, BlogPosting JSON-LD and three loaded 1600×900 article visuals.
- The Brand Ownership guide and sitemap included all three slugs. Desktop and 390px mobile checks found no horizontal overflow.
- The only local console error was the expected unavailable `/_vercel/insights/script.js`; the separate second-pass English, fact-boundary, image and release review returned `PASS`.
