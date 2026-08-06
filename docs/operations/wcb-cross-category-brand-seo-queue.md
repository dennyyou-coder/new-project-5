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
| 1 | EGO Power+ | `who-owns-ego-power-plus-chervon-manufacturing` | A | `local_verified` |
| 2 | Hotpoint Appliances | `who-owns-hotpoint-appliances-regional-split` | A | `local_verified` |
| 3 | Toro | `who-owns-toro-company-brands-manufacturing` | A | `local_verified` |
| 4 | Toshiba Appliances | `who-owns-toshiba-appliances-midea-lifestyle` | B | `planned` |
| 5 | Xiaomi / Mijia Home Appliances | `who-makes-xiaomi-mijia-home-appliances` | B | `planned` |
| 6 | Nilfisk | `lock before research` | B | `planned` |
| 7 | Hisense Appliances | `who-owns-hisense-appliances-gorenje-asko` | C | `planned` |
| 8 | Panasonic Appliances | `who-owns-panasonic-appliances-vacuum-manufacturing` | C | `planned` |
| 9 | Breville / Sage | `who-owns-breville-sage-regional-brand-rights` | C | `planned` |
| 10 | De'Longhi | `who-owns-delonghi-appliance-group-brands` | D | `planned` |
| 11 | GARDENA | `lock before research` | D | `planned` |
| 12 | Braun Appliances | `who-owns-braun-appliances-delonghi-pg-license` | D | `planned` |
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

## Next starting point

After Batch A is production-verified, the next fixed batch is: **Toshiba Appliances, Xiaomi / Mijia Home Appliances, Nilfisk**.
