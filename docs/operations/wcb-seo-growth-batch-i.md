# WCB SEO Growth Batch I

This is the operational record for three new ownership-and-manufacturing guides that fill distinct search-intent gaps without duplicating the existing Kenmore vacuum, Tineco or AEG pages.

## Authorization

- Denny approved the update-first growth plan and instructed the next batch to proceed through production without another routine confirmation.
- The authorized path includes collision checks, research, English writing, visuals, tests, PR, merge, Git-linked Vercel production deployment and live verification.
- Work is isolated in `codex/wcb-seo-update-batch-i-20260808` from current `origin/main`.

## Fixed scope

| Order | Fixed title | Slug | Intent boundary | Status |
|---:|---|---|---|---|
| 1 | Who Makes Kenmore Appliances? Transformco, Brand Licensing and Manufacturers Explained | `who-makes-kenmore-appliances-transformco-manufacturers` | Broad appliances; distinct from the Cleva floor-care license page | `local_verified` |
| 2 | Who Owns ECOVACS? Public Company, Tineco and Manufacturing Explained | `who-owns-ecovacs-tineco-manufacturing` | Listed parent and ECOVACS brand; distinct from Tineco ownership and product comparisons | `local_verified` |
| 3 | Who Owns Electrolux? Shareholders, Brands and Manufacturing Explained | `who-owns-electrolux-brands-manufacturing` | AB Electrolux parent; distinct from the AEG child-brand relationship page | `local_verified` |

## Collision and intent checks

- Repository and production-site searches found no exact title or slug collision for any of the three pages.
- Kenmore's existing guide is limited to current North American floor care and Cleva's category license. The new page covers major appliances, Transformco ownership and model-level manufacturer verification.
- Existing ECOVACS articles are comparisons, historical commentary or Tineco-focused ownership. None provides a current comprehensive answer for the listed parent, control disclosure, brand split and manufacturing system.
- The AEG guide begins with the AEG brand. The new Electrolux page begins with AB Electrolux shareholders, the parent brand portfolio, manufacturing network and Electrolux Professional separation.

## Current primary-source lock

| Topic | Locked conclusion | Primary evidence |
|---|---|---|
| Kenmore owner | Transform SR Brands LLC owns the registered Kenmore mark inside the Transformco structure | Kenmore official site, terms, warranty, licensing, manual and EnergyGuide pages |
| Kenmore manufacturing | Multiple product programs and historical suppliers mean the exact manufacturer is model-specific | Kenmore product catalogue, model/manual search, official cross-platform parts application and model-scoped CPSC recall evidence |
| ECOVACS parent | Ecovacs Robotics Co., Ltd. is listed in Shanghai under 603486 | 2025 annual report filed with the Shanghai Stock Exchange |
| ECOVACS control | Suzhou Chuangling is controlling shareholder; Qian Dongqi and David Cheng Qian are actual controllers | 2025 annual report |
| ECOVACS and Tineco | Two separate consumer brands within the listed group | 2025 annual report and ECOVACS group history |
| ECOVACS manufacturing | The group reports mainly self-produced manufacturing from key components to finished robots | 2025 annual report and sustainability disclosure |
| Electrolux ownership | AB Electrolux is publicly listed; Investor AB held 17.9% of capital and 30.4% of votes at 31 December 2025 | Electrolux Group Annual Report 2025 |
| Electrolux brands | Electrolux, AEG and Frigidaire are the three main appliance brands | Electrolux Group Annual Report 2025 and current strategy page |
| Electrolux Professional | Separate listed company since 23 March 2020 | Electrolux distribution and listing record |
| Electrolux manufacturing | Global production network; factory examples do not prove origin for every model | 2025 annual report and current Kinston/Brazil factory releases |

## Visual manifest and fact locks

- Visual system: `industry_map` with one generated conceptual cover and two deterministic relationship maps per article.
- Covers use generic, unbranded products and factories. They are editorial concepts, not documentary images of an official product or plant.
- All words, entity names, dates and figures are rendered in deterministic overlays and trace to the source lock above.

| Article | Image | Role and fact lock | Status |
|---|---|---|---|
| Kenmore | `kenmore-appliances-transformco-manufacturers-cover.webp` | Concept cover; no factual product claim beyond the reviewed headline | local_pass |
| Kenmore | `kenmore-brand-license-manufacturer-map.webp` | Transform SR Brands owner; multiple program and model boundary | local_pass |
| Kenmore | `kenmore-model-verification-map.webp` | Model, records, responsible entities and factory-evidence chain | local_pass |
| ECOVACS | `ecovacs-ownership-tineco-manufacturing-cover.webp` | Concept cover; generic robotics and integrated-supply-chain metaphor | local_pass |
| ECOVACS | `ecovacs-listed-group-brand-map.webp` | Shanghai-listed parent, control disclosure and separate ECOVACS/Tineco brands | local_pass |
| ECOVACS | `ecovacs-manufacturing-verification-map.webp` | Mainly self-produced group disclosure with exact-SKU boundary | local_pass |
| Electrolux | `electrolux-shareholders-brands-manufacturing-cover.webp` | Concept cover; generic global appliance network | local_pass |
| Electrolux | `electrolux-shareholder-brand-structure-map.webp` | Year-end 2025 shareholder figures, listed parent and three main brands | local_pass |
| Electrolux | `electrolux-manufacturing-professional-boundary-map.webp` | Household group, named factory examples, model proof and 2020 Professional split | local_pass |

## Release gates

- Stage order: `queued → researching → local_verified → preview_verified → published_verified`.
- Local: classification, 15 insight tests, 98 brand tests, full production build, metadata/canonical/schema review, image decode and desktop plus 390px rendering.
- Preview: exact three-page scope, expected article output and no unrelated site/configuration changes.
- Production: HTTP 200, title/H1/description/canonical/schema, all nine visuals, guide discovery, sitemap, desktop/mobile layout and console review.

## GSC measurement

- This batch uses the saved site baseline for 2026-07-09 through 2026-08-05: 91 clicks, 17,200 impressions, 0.5% CTR and average position 11.4.
- These are site observations, not fabricated keyword-volume estimates.
- Day 7 checks crawl and technical health; Day 14 checks early query coverage; Day 28 is the main performance comparison.

## Local release gate

- Content classification passed.
- All 15 insight tests and all 98 brand tests passed after registering the two new article-to-brand relationships.
- The full Next.js production build completed successfully and generated 564 pages, including all three new routes.
- All nine article images decoded as 1600×900 WebP files.
- Desktop and 390px checks confirmed the expected H1, description, production canonical, BlogPosting schema and three article visuals on each route.
- No horizontal overflow appeared at either viewport. The only local console error was the expected unavailable `/_vercel/insights/script.js` outside Vercel.
- Initial visual review repaired generated pseudo-text and one Kenmore information-map overflow before this gate passed.
- Independent release review passed after four precision repairs: Kenmore licensing/contract wording and model-scoped LG evidence, the Tineco internal-link title, and removal of a conflicting exact Electrolux shareholder count from both article and visual.

## Production evidence

Add PR, merge commit, Vercel deployment and live verification after the production gate passes.
