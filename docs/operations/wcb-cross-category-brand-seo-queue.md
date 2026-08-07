# WCB Cross-Category Brand SEO Queue

This is the website operational record for the traffic-prioritized brand SEO queue that combines appliance, outdoor-power-equipment, garden and professional-cleaning topics.

## Authorization and execution rules

- Denny approved the cross-category traffic-first order on 2026-08-06.
- “Next batch” authorizes the complete WCB loop through production verification for the next fixed group of up to three articles.
- Existing published tool-brand and appliance articles are not republished; GitHub `main` and the live site override stale status fields.
- Publication uses an isolated `codex/` branch, GitHub PR, squash merge and Git-linked Vercel deployment. Routine `vercel --prod` is prohibited.

## Fixed remaining order

| Order | Topic | Slug / pre-writing lock | Batch | Status |
|---:|---|---|---:|---|
| 1 | EGO Power+ | `who-owns-ego-power-plus-chervon-manufacturing` | A | `published_verified` |
| 2 | Hotpoint Appliances | `who-owns-hotpoint-appliances-regional-split` | A | `published_verified` |
| 3 | Toro | `who-owns-toro-company-brands-manufacturing` | A | `published_verified` |
| 4 | Toshiba Appliances | `who-owns-toshiba-appliances-midea-lifestyle` | B | `published_verified` |
| 5 | Xiaomi / Mijia Home Appliances | `who-makes-xiaomi-mijia-home-appliances` | B | `published_verified` |
| 6 | Nilfisk | `who-owns-nilfisk-freudenberg-manufacturing` | B | `published_verified` |
| 7 | Hisense Appliances | `who-owns-hisense-appliances-gorenje-asko` | C | `published_verified` |
| 8 | Panasonic Appliances | `who-owns-panasonic-appliances-vacuum-manufacturing` | C | `published_verified` |
| 9 | Breville / Sage | `who-owns-breville-sage-regional-brand-rights` | C | `published_verified` |
| 10 | De'Longhi | `who-owns-delonghi-appliance-group-brands` | D | `local_verified` |
| 11 | GARDENA | `who-owns-gardena-husqvarna-sileno-manufacturing` | D | `local_verified` |
| 12 | Braun Appliances | `who-owns-braun-appliances-delonghi-pg-license` | D | `local_verified` |
| 13 | Groupe SEB | `who-owns-groupe-seb-brands-supor` | E | `planned` |
| 14 | Rowenta | `who-owns-rowenta-groupe-seb-vacuums` | E | `planned` |
| 15 | Gorenje | `who-owns-gorenje-appliances-hisense` | E | `planned` |
| 16 | ASKO Appliances | `who-owns-asko-appliances-hisense-gorenje` | F | `planned` |
| 17 | Hamilton Beach | `who-owns-hamilton-beach-brands-sourcing` | F | `planned` |
| 18 | Teka Appliances | `who-owns-teka-appliances-midea` | F | `planned` |
| 19 | LawnMaster | `lock before research` | G | `planned` |
| 20 | SUPOR | `who-owns-supor-groupe-seb-manufacturing` | G | `planned` |

Slugs after Batch A remain queue locks and must still pass exact-intent collision checks immediately before writing. If reliable evidence requires a material title or slug change, stop that target instead of silently renaming it.

## Batch A fixed titles

1. **Who Owns EGO Power+? Chervon, the 56V Battery Platform and Manufacturing Explained**
2. **Who Owns Hotpoint Appliances? Beko Europe, GE Appliances and the Regional Brand Split Explained**
3. **Who Owns Toro? The Toro Company, Brands and Outdoor Equipment Manufacturing Explained**

## Batch A collision and factual boundary

- All three exact repository slugs were absent on `origin/main` commit `1e7e99a9870eb29afc845d50bcc18298b397cfd4` before writing.
- EGO and Hotpoint exact production URLs returned `404`; site-restricted exact-title searches found no matching article. Toro had no exact slug or intent in the repository or site search.
- EGO is distinct from `who-owns-chervon-ego-flex-skil`: the existing page explains the parent group; this page focuses on the EGO brand, 56V platform, model-level production and warranty.
- Hotpoint separates the GE Appliances Americas path from Beko Europe's UK and European operation; Beko Europe equity, Hotpoint regional rights, factories and warranties remain separate.
- Toro separates public-company ownership, the group brand portfolio, manufacturing capacity, outside components, dealers and product-specific warranties.

## Batch A article and visual review

- Each article contains a direct answer, at-a-glance table, model-level procurement boundaries, FAQ, final answer, official sources and relevant internal links.
- Each package contains one reviewed 1600×900 unbranded WebP cover and two deterministic 1600×900 SVG fact maps.
- Covers contain no brand logos or readable generated text and serve only as editorial concepts.
- Fact-map labels are supported by the cited official sources. Two targeted information-layer repair rounds removed long-text overflow; the final visual review passed at full size and article-width scaling.
- Independent reviewer Agent was unavailable under the current execution constraint; a separate second-pass fact, English, visual and release review is used.

## Batch A local release gate

- Local gate passed: content classification, 15 insight tests, 86 brand tests and the 510-page production build all succeeded.
- Rendered desktop and 390 px mobile checks passed for all three pages: correct title, H1, description, canonical and BlogPosting schema; all nine article images loaded at 1600 × 900 with no horizontal overflow.
- After Preview reaches `READY`, update this record to `preview_verified` before merge when feasible.
- Only live production verification can establish `published_verified`; the final deployment evidence may be mechanically recorded in the next substantive content PR to avoid a record-only deployment.

## Previous appliance checkpoint synchronized in this release

- Whirlpool, KitchenAid and Beko were published through PR #37 and production commit `1e7e99a9870eb29afc845d50bcc18298b397cfd4`.
- Their three article status fields and rows in `wcb-home-appliance-brands-18-seo-batch.md` are mechanically corrected to `published_verified` in this substantive Batch A release.

## Batch B fixed titles

1. **Who Owns Toshiba Appliances? Midea, Toshiba Lifestyle and the 40-Year Brand License Explained**
2. **Who Makes Xiaomi and Mijia Home Appliances? Brand Ownership, Ecosystem Partners and Manufacturing Explained**
3. **Who Owns Nilfisk? Freudenberg, Manufacturing and Professional Cleaning Brands Explained**

## Batch B collision and factual boundary

- All three exact repository slugs were absent on `origin/main` commit `50dda134a8a9200662156f552869736e81513127` before writing, and each exact production URL returned `404`.
- Toshiba is distinct from its Brand Intelligence profile. The article separates Midea's 80.1% control of Toshiba Lifestyle from Toshiba Corporation's ownership of the trademark and the 40-year home-appliance license.
- Xiaomi / Mijia is distinct from the published Roborock and Dreame ownership pages. It answers the broader model-level manufacturer question without treating ecosystem membership, investment, app integration or contract manufacturing as the same relationship.
- Nilfisk is distinct from the published Freudenberg transaction article. It provides the direct current-ownership answer, separates Nilfisk, Advance and Viper, and keeps factory, autonomous-technology and service roles model-specific.

## Batch B article and visual review

- Each article contains a direct answer, at-a-glance table, model-level responsibility boundaries, FAQ, final answer, official primary sources and verified internal links.
- Each package contains one reviewed 1600×900 unbranded WebP cover and two deterministic 1600×900 SVG fact maps.
- Covers contain no brand logos, trademarks, people or readable generated text. The generated concepts were converted to WebP and reviewed after final cropping.
- A separate second visual pass repaired title and card-edge overflow in the Toshiba, Xiaomi / Mijia and Nilfisk diagrams; final article-width renders passed.

## Cumulative quality checkpoint before Batch B

- The six most recent cross-category and appliance ownership articles—Whirlpool, KitchenAid, Beko, EGO, Hotpoint and Toro—were rechecked on production before Batch B.
- All six canonical article URLs returned HTTP 200. The remaining metadata, image and responsive checks are repeated in the Batch B production acceptance gate.

## Batch B local release gate

- Local gate passed on the latest `main`: content classification, 15 insight tests, 90 brand tests and the 525-page production build all succeeded.
- Rendered desktop and 390 px mobile checks passed for all three pages: HTTP 200, correct title, H1, description, canonical and BlogPosting schema; all nine article images loaded at 1600×900 with no horizontal overflow or unexpected failed requests.
- The only local console message was the expected unavailable `/_vercel/insights/script.js` endpoint outside Vercel; it does not occur as an application error in the Git-linked deployment.
- Preview, merge, Vercel production deployment and final live verification remain required before these rows can become `published_verified`.

## Next starting point

After Batch D is production-verified, the next fixed batch is: **Groupe SEB, Rowenta, Gorenje**.

## Batch B production checkpoint synchronized in this release

- Toshiba Appliances, Xiaomi / Mijia and Nilfisk were published through PR #43 and production commit `f98697c8b616636fb0c4d30d0075b058fed21fb2`.
- Their exact production URLs, metadata, images and responsive layouts passed live verification. Their article and queue statuses are mechanically corrected to `published_verified` in this substantive Batch C release.

## Batch C fixed titles

1. **Who Owns Hisense Appliances? Gorenje, ASKO and Manufacturing Explained**
2. **Who Owns Panasonic Appliances? Vacuum Cleaners and Manufacturing Explained**
3. **Who Owns Breville and Sage? Regional Brand Rights Explained**

## Batch C collision and factual boundary

- All three exact repository slugs were absent on `origin/main` commit `f98697c8b616636fb0c4d30d0075b058fed21fb2` before writing, and each exact production URL returned `404`.
- Hisense is distinct from its Brand Intelligence profile and the planned standalone Gorenje and ASKO guides. This article answers the higher-volume Hisense ownership query while keeping the brands and model-level manufacturing responsibilities separate.
- Panasonic uses the operating structure effective 1 April 2026. The article distinguishes Panasonic Holdings, Panasonic Corporation, appliance divisions and local legal entities rather than repeating the pre-reorganization structure.
- Breville / Sage explains the regional trademark boundary disclosed by Breville Group and does not claim that similar regional models, legal sellers or warranties are identical.

## Batch C article and visual review

- Each article contains a direct answer, at-a-glance table, legal and manufacturing boundaries, buyer checklist, FAQ, final answer, official primary sources and approved Brand Intelligence relationship.
- Each package contains one reviewed 1600×900 unbranded WebP cover and two deterministic 1600×900 SVG fact maps using the `industry_map` visual system.
- Covers contain no brand logos, trademarks, people or readable generated text. Diagrams separate ownership, operating responsibility and model-level verification.

## Batch C local release gate

- Local gate passed on the latest `main`: content classification, 15 insight tests, 91 brand tests and the 531-page production build all succeeded.
- Rendered desktop and 390 px mobile checks passed for all three pages: HTTP 200, correct title, H1, description, canonical and BlogPosting schema; all nine article images loaded at 1600×900 with no horizontal overflow.
- The only local console message was the expected unavailable `/_vercel/insights/script.js` endpoint outside Vercel; it is not an application error in the Git-linked deployment.
- Preview, merge, Vercel production deployment and final live verification remain required before these rows can become `published_verified`.

## Batch C production checkpoint synchronized in this release

- Hisense Appliances, Panasonic Appliances and Breville / Sage were published through PR #45 and production commit `b32384867369ded8de6d163c64cd669629e73ce6`.
- Vercel production deployment `dpl_GVEocsoP1W9YWKFqhHphMmgLmFaY` reached `READY`; the three exact production URLs, metadata, images and responsive layouts passed live verification.
- Their article and queue statuses are mechanically corrected to `published_verified` in this substantive Batch D release.

## Batch D fixed titles

1. **Who Owns De’Longhi? Appliance Group Brands, Shareholders and Manufacturing Explained**
2. **Who Owns GARDENA? Husqvarna Group, SILENO Robot Mowers and Manufacturing Explained**
3. **Who Owns Braun Appliances? De’Longhi, P&G and the Household Brand License Explained**

## Batch D collision and factual boundary

- All three exact repository slugs were absent on `origin/main` commit `082f425941b0ed01432f8fb774d46618e107234a`, and each exact production URL returned `404` before writing.
- De’Longhi is distinct from the older company-history article. This search guide answers current control, group brands, manufacturing and service responsibility; it links to rather than duplicates the historical chronology.
- GARDENA is a separate Husqvarna Group division. The article does not infer battery compatibility, factory origin, software responsibility or warranty from common group ownership.
- P&G owns the Braun trademark while De’Longhi holds a perpetual license for defined household categories. The article keeps household appliances separate from shavers, grooming and Oral-B.

## Batch D article and visual review

- Each article contains a direct answer, at-a-glance table, model-level responsibility boundaries, FAQ, final answer, official primary sources and approved Brand Intelligence relationships.
- Each package contains one reviewed 1600×900 unbranded WebP cover and two deterministic 1600×900 SVG fact maps using the `industry_map` system.
- Covers contain no real brand logos or trademarks. A separate second pass checked crop safety, product realism, diagram labels and the ownership-versus-license boundaries.

## Batch D local release gate

- Local gate passed after rebasing onto the latest `main`: content classification, 15 insight tests, 93 brand tests and the 540-page production build all succeeded.
- Rendered desktop and 390 px mobile checks passed for all three pages: HTTP 200, correct August 8, 2026 date, title, H1, canonical and BlogPosting schema; all nine article images loaded at 1600 × 900 with no horizontal overflow.
- The only local console message was the expected unavailable `/_vercel/insights/script.js` endpoint outside Vercel; it is not an application error in the Git-linked deployment.
- Preview, merge, Vercel production deployment and final live verification remain required before these rows can become `published_verified`.
