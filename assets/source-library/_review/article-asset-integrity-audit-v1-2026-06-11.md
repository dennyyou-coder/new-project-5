# Article Asset Integrity Audit V1 - 2026-06-11

Scope: `content/insights/*.mdx` and `public/images/insights/*`.

Rule: this audit is report-only. It does not download, replace, delete, or regenerate images.

## Summary

| Check | Result |
| --- | ---: |
| Insight articles scanned | 152 |
| Insight image files found | 1341 |
| Local image references found | 1053 |
| Unique referenced image paths | 1052 |
| Missing referenced files | 0 |
| Articles without coverImage | 0 |
| Articles with no body images | 45 |
| Articles with 15+ body images | 16 |
| Reused image URLs across multiple articles | 1 |
| Unreferenced image files | 289 |
| Covers smaller than 1200x675 | 38 |
| Covers with non-16:9 ratio tolerance issue | 32 |

## Immediate Findings

The site no longer has broken local image references after the previous fix.

Highest-priority cleanup areas:

1. Cover quality normalization: 38 covers are below 1200x675 or use old low-resolution source images.
2. Cover aspect-ratio normalization: 32 covers are not close to 16:9.
3. Article body image balance: 45 articles have cover-only image treatment, while 16 articles have 15+ body images.
4. Unreferenced image review: 289 files in `public/images/insights/` are not currently referenced by articles. These are not delete candidates until manually reviewed; many may be legacy, backup, or migration artifacts.

## Missing References

Status: clear.

```text
missing=0
```

## Duplicate Image URL Across Articles

| Image | Articles | Note |
| --- | --- | --- |
| `/images/insights/bissell-vs-tineco-patent-details-cover.jpg` | `bissell-itc-337-investigation-against-tineco`, `bissell-vs-tineco-patent-details` | Could be intentional because both articles relate to the same Bissell / Tineco dispute; review before changing. |

## Articles With No Body Images

These articles have a cover image but no markdown body image references:

| Article |
| --- |
| `anker-shallow-sea-strategy-and-talent-platform` |
| `backyard-robots-price-and-channel-war` |
| `beatbot-in-leifeng-coverage` |
| `bissell-itc-337-investigation-against-tineco` |
| `can-dji-become-top-three-in-robot-vacuums` |
| `casual-gossip-on-dji-robot-vacuum` |
| `chinese-cleaning-brands-at-ces-2026` |
| `cleaning-appliance-industry-age-of-navigation` |
| `collapse-of-godfreys` |
| `complete-vacuum-cleaner-buying-guide-20221006` |
| `dji-goes-to-the-ground-dreame-and-insta360-go-to-the-sky` |
| `dji-romo-robot-vacuum-preview` |
| `do-you-still-need-trade-shows-if-you-know-the-suppliers` |
| `dreame-douyin-counterattack-against-tineco` |
| `dyson-china-oem-history` |
| `eve-of-the-robot-vacuum-battle` |
| `first-major-industry-shift-in-2019` |
| `historic-opportunities-in-the-vacuum-industry` |
| `i-want-to-become-an-influencer` |
| `irobot-decline-and-the-new-robot-vacuum-order` |
| `irobot-exits-and-dji-enters` |
| `jan-6-2026-yard-cleaning-and-tool-news` |
| `london-talks-55-percent-tariff` |
| `major-battle-about-to-begin` |
| `midea-cleaning-appliance-past` |
| `migo-ascender-stair-climbing-robot` |
| `milwaukee-2761-return-of-the-king` |
| `mova-took-me-to-meet-a-celebrity` |
| `narwal-j6-and-technology-iteration` |
| `one-power-strategy-in-small-appliances` |
| `robot-vacuum-navigation-solution-companies` |
| `robotic-mower-category-note` |
| `sharkninja-road-to-10-billion-dollars` |
| `story-of-hard-floor-washers` |
| `top-ten-vacuum-exporters-in-2019` |
| `tti-cleaning-appliance-strategy` |
| `tti-product-direction` |
| `uwant-resilience-in-china-cleaning-appliances` |
| `vacuum-industry-2018-review-2019-outlook` |
| `vs-industry-dyson-bissell-supplier-shift` |
| `what-sharkninja-makes-us-think-about` |
| `when-chinese-brands-become-the-powers` |
| `why-china-needs-a-cleaning-appliance-ifa` |
| `world-class-denny-or-world-class-bragging` |
| `xiaomi-ecosystem-at-a-crossroads` |

## Articles With Heavy Body Image Counts

These may be intentional long source translations or gallery-style historical pieces. Review before reducing.

| Article | Body images |
| --- | ---: |
| `hundred-years-of-cleaning-appliance-history` | 109 |
| `groupe-seb-2018-annual-report-signals` | 46 |
| `ces-2026-backyard-robot-war` | 45 |
| `roborock-ipo-prospectus-signals` | 36 |
| `ecovacs-2018-annual-report-signals` | 28 |
| `narwal-and-the-self-cleaning-robot-vacuum` | 26 |
| `hamilton-beach-2018-annual-report-faithful-translation` | 21 |
| `robotic-mowers-retail-expansion-phase` | 21 |
| `china-cleaning-robot-giants-move-into-backyard` | 20 |
| `american-factory-and-manufacturing-transfer` | 19 |
| `lithium-batteries-in-vacuums-and-power-tools` | 19 |
| `cleaning-appliance-companies-at-awe` | 18 |
| `delonghi-group-company-history-and-appliance-brands` | 17 |
| `nilfisk-2018-annual-report-commercial-cleaning` | 17 |
| `ifa-2019-vacuum-cleaner-new-products-by-major-brands` | 16 |
| `pool-and-lawn-robots-self-maintenance` | 16 |

## Small Cover Queue

Threshold: width below 1200 or height below 675.

| Article | Size | Cover |
| --- | ---: | --- |
| `who-will-be-eliminated-in-the-cordless-vacuum-cleaner-era` | 335x252 | `/images/insights/who-will-be-eliminated-in-the-cordless-vacuum-cleaner-era-image-001.jpg` |
| `irobot-2018-annual-report-faithful-translation` | 378x172 | `/images/insights/irobot-2018-annual-report-faithful-translation-image-01.png` |
| `should-shark-and-ninja-be-one-brand` | 449x240 | `/images/insights/should-shark-and-ninja-be-one-brand-image-01.png` |
| `ecovacs-invests-in-battery-cell-factory` | 500x300 | `/images/insights/ecovacs-invests-in-battery-cell-factory-cover.jpg` |
| `top-ten-vacuum-exporters-in-2019` | 506x348 | `/images/insights/top-ten-vacuum-exporters-in-2019-cover.jpg` |
| `midea-group-and-the-possible-philips-domestic-appliances-acquisition` | 533x300 | `/images/insights/midea-group-and-the-possible-philips-domestic-appliances-acquisition-image-001.png` |
| `vacuum-industry-2018-review-2019-outlook` | 564x800 | `/images/insights/vacuum-industry-2018-review-2019-outlook-cover.jpg` |
| `hamilton-beach-2018-annual-report-faithful-translation` | 600x345 | `/images/insights/hamilton-beach-2018-annual-report-faithful-translation-image-01.png` |
| `roborock-2019-annual-report-breakout-year` | 613x369 | `/images/insights/roborock-2019-annual-report-breakout-year-cover.jpg` |
| `narwal-raises-new-funding` | 640x266 | `/images/insights/narwal-raises-new-funding-cover.jpg` |
| `is-kingclean-mojie-a-good-product` | 640x359 | `/images/insights/is-kingclean-mojie-a-good-product-cover.jpg` |
| `xiaomi-ecosystem-at-a-crossroads` | 640x853 | `/images/insights/xiaomi-ecosystem-at-the-crossroads-cover.jpg` |
| `hundred-years-of-cleaning-appliance-history` | 647x567 | `/images/insights/hundred-years-of-cleaning-appliance-history-cover.jpg` |
| `cleaning-appliance-companies-at-awe` | 648x428 | `/images/insights/cleaning-appliance-companies-at-awe-cover.jpg` |
| `irobot-at-a-crossroads` | 664x413 | `/images/insights/irobot-at-the-crossroads-cover.jpg` |
| `who-benefits-from-china-us-trade-war-in-vacuums` | 671x337 | `/images/insights/who-benefits-from-china-us-trade-war-in-vacuums-cover.jpg` |
| `best-robot-vacuum-buying-guide-2022` | 679x561 | `/images/insights/best-robot-vacuum-buying-guide-2022-cover.jpg` |
| `tti-2019-interim-report` | 688x544 | `/images/insights/tti-2019-interim-report-cover.jpg` |
| `bissell-barkbath-pet-vacuum-cleaner` | 692x487 | `/images/insights/bissell-barkbath-pet-vacuum-cleaner-image-001.png` |
| `dji-enters-robot-vacuums` | 700x610 | `/images/insights/dji-enters-robot-vacuums-cover.jpg` |
| `the-counterattack-of-chyson-vacuum-brands` | 719x404 | `/images/insights/the-counterattack-of-chyson-vacuum-brands-image-001.png` |
| `two-sides-of-dyson` | 720x286 | `/images/insights/two-sides-of-dyson-cover.jpg` |
| `vs-industry-dyson-bissell-supplier-shift` | 728x472 | `/images/insights/vs-industry-dyson-bissell-supplier-shift-cover.jpg` |
| `who-is-china-cleaning-king` | 735x489 | `/images/insights/who-is-china-cleaning-king-cover.jpg` |
| `china-premium-vacuum-brand-opportunity` | 746x392 | `/images/insights/china-premium-vacuum-brand-opportunity-cover.jpg` |
| `tineco-lacks-innovation` | 766x378 | `/images/insights/tineco-lacks-innovation-cover.jpg` |
| `vacuum-companies-at-2018-autumn-canton-fair` | 783x584 | `/images/insights/vacuum-companies-at-2018-autumn-canton-fair-cover.jpg` |
| `delonghi-group-company-history-and-appliance-brands` | 789x595 | `/images/insights/delonghi-group-company-history-and-appliance-brands-image-001.png` |
| `vs-industry-bissell-three-year-agreement` | 844x390 | `/images/insights/vs-industry-bissell-three-year-agreement-cover.jpg` |
| `mijia-robot-vacuum-g1-and-xiaomi-ecosystem` | 933x476 | `/images/insights/mijia-robot-vacuum-g1-and-xiaomi-ecosystem-cover.jpg` |
| `bissell-itc-337-investigation-against-tineco` | 943x529 | `/images/insights/bissell-vs-tineco-patent-details-cover.jpg` |
| `bissell-vs-tineco-patent-details` | 943x529 | `/images/insights/bissell-vs-tineco-patent-details-cover.jpg` |
| `ifa-2019-vacuum-cleaner-new-products-by-major-brands` | 968x416 | `/images/insights/ifa-2019-vacuum-cleaner-new-products-by-major-brands-image-001.png` |
| `complete-vacuum-cleaner-buying-guide-20221006` | 1021x420 | `/images/insights/complete-vacuum-cleaner-buying-guide-20221006-image-01.png` |
| `first-major-industry-shift-in-2019` | 1080x400 | `/images/insights/first-major-industry-shift-in-2019-image-01.png` |
| `dyson-fights-bosch-again` | 1310x554 | `/images/insights/dyson-fights-bosch-again-cover.jpg` |
| `german-vacuum-brands-in-the-cordless-wave` | 1310x554 | `/images/insights/german-vacuum-brands-in-the-cordless-wave-cover.jpg` |
| `lawsuit-that-shaped-the-handheld-vacuum-industry` | 1310x554 | `/images/insights/lawsuit-that-shaped-the-handheld-vacuum-industry-cover.jpg` |

## Non-16:9 Cover Queue

Tolerance: ratio differs from 16:9 by more than 0.08.

| Article | Size | Ratio | Cover |
| --- | ---: | ---: | --- |
| `vacuum-industry-2018-review-2019-outlook` | 564x800 | 0.705 | `/images/insights/vacuum-industry-2018-review-2019-outlook-cover.jpg` |
| `xiaomi-ecosystem-at-a-crossroads` | 640x853 | 0.750 | `/images/insights/xiaomi-ecosystem-at-the-crossroads-cover.jpg` |
| `first-major-industry-shift-in-2019` | 1080x400 | 2.700 | `/images/insights/first-major-industry-shift-in-2019-image-01.png` |
| `two-sides-of-dyson` | 720x286 | 2.517 | `/images/insights/two-sides-of-dyson-cover.jpg` |
| `complete-vacuum-cleaner-buying-guide-20221006` | 1021x420 | 2.431 | `/images/insights/complete-vacuum-cleaner-buying-guide-20221006-image-01.png` |
| `hundred-years-of-cleaning-appliance-history` | 647x567 | 1.141 | `/images/insights/hundred-years-of-cleaning-appliance-history-cover.jpg` |
| `dji-enters-robot-vacuums` | 700x610 | 1.148 | `/images/insights/dji-enters-robot-vacuums-cover.jpg` |
| `narwal-raises-new-funding` | 640x266 | 2.406 | `/images/insights/narwal-raises-new-funding-cover.jpg` |
| `dyson-fights-bosch-again` | 1310x554 | 2.365 | `/images/insights/dyson-fights-bosch-again-cover.jpg` |
| `german-vacuum-brands-in-the-cordless-wave` | 1310x554 | 2.365 | `/images/insights/german-vacuum-brands-in-the-cordless-wave-cover.jpg` |
| `lawsuit-that-shaped-the-handheld-vacuum-industry` | 1310x554 | 2.365 | `/images/insights/lawsuit-that-shaped-the-handheld-vacuum-industry-cover.jpg` |
| `best-robot-vacuum-buying-guide-2022` | 679x561 | 1.210 | `/images/insights/best-robot-vacuum-buying-guide-2022-cover.jpg` |
| `ifa-2019-vacuum-cleaner-new-products-by-major-brands` | 968x416 | 2.327 | `/images/insights/ifa-2019-vacuum-cleaner-new-products-by-major-brands-image-001.png` |
| `tti-2019-interim-report` | 688x544 | 1.265 | `/images/insights/tti-2019-interim-report-cover.jpg` |
| `delonghi-group-company-history-and-appliance-brands` | 789x595 | 1.326 | `/images/insights/delonghi-group-company-history-and-appliance-brands-image-001.png` |
| `who-will-be-eliminated-in-the-cordless-vacuum-cleaner-era` | 335x252 | 1.329 | `/images/insights/who-will-be-eliminated-in-the-cordless-vacuum-cleaner-era-image-001.jpg` |
| `vacuum-companies-at-2018-autumn-canton-fair` | 783x584 | 1.341 | `/images/insights/vacuum-companies-at-2018-autumn-canton-fair-cover.jpg` |
| `irobot-2018-annual-report-faithful-translation` | 378x172 | 2.198 | `/images/insights/irobot-2018-annual-report-faithful-translation-image-01.png` |
| `vs-industry-bissell-three-year-agreement` | 844x390 | 2.164 | `/images/insights/vs-industry-bissell-three-year-agreement-cover.jpg` |
| `bissell-barkbath-pet-vacuum-cleaner` | 692x487 | 1.421 | `/images/insights/bissell-barkbath-pet-vacuum-cleaner-image-001.png` |
| `top-ten-vacuum-exporters-in-2019` | 506x348 | 1.454 | `/images/insights/top-ten-vacuum-exporters-in-2019-cover.jpg` |
| `who-is-china-cleaning-king` | 735x489 | 1.503 | `/images/insights/who-is-china-cleaning-king-cover.jpg` |
| `cleaning-appliance-companies-at-awe` | 648x428 | 1.514 | `/images/insights/cleaning-appliance-companies-at-awe-cover.jpg` |
| `tineco-lacks-innovation` | 766x378 | 2.026 | `/images/insights/tineco-lacks-innovation-cover.jpg` |
| `vs-industry-dyson-bissell-supplier-shift` | 728x472 | 1.542 | `/images/insights/vs-industry-dyson-bissell-supplier-shift-cover.jpg` |
| `who-benefits-from-china-us-trade-war-in-vacuums` | 671x337 | 1.991 | `/images/insights/who-benefits-from-china-us-trade-war-in-vacuums-cover.jpg` |
| `mijia-robot-vacuum-g1-and-xiaomi-ecosystem` | 933x476 | 1.960 | `/images/insights/mijia-robot-vacuum-g1-and-xiaomi-ecosystem-cover.jpg` |
| `irobot-at-a-crossroads` | 664x413 | 1.608 | `/images/insights/irobot-at-the-crossroads-cover.jpg` |
| `china-premium-vacuum-brand-opportunity` | 746x392 | 1.903 | `/images/insights/china-premium-vacuum-brand-opportunity-cover.jpg` |
| `roborock-2019-annual-report-breakout-year` | 613x369 | 1.661 | `/images/insights/roborock-2019-annual-report-breakout-year-cover.jpg` |
| `ecovacs-invests-in-battery-cell-factory` | 500x300 | 1.667 | `/images/insights/ecovacs-invests-in-battery-cell-factory-cover.jpg` |
| `should-shark-and-ninja-be-one-brand` | 449x240 | 1.871 | `/images/insights/should-shark-and-ninja-be-one-brand-image-01.png` |

## Unreferenced Image Files

Count: 289.

Interpretation:

- Do not delete automatically.
- Many may be legacy names, old generated variants, or assets waiting for future article cleanup.
- Recommended next step is a separate unused-image manifest with `keep / migrate / delete-candidate` classification.

First visible sample:

```text
amazon-first-stop-for-backyard-robotics-image-001.jpg
american-factory-and-manufacturing-transfer-image-001.jpg
anker-cleaning-appliance-strategy-analysis-image-01.jpg
anker-floorcare-strategy-problem-cover.jpg
anker-innovation-lacks-methodology-image-001.jpg
anker-needs-a-hard-battle-image-001.jpg
anker-shallow-sea-strategy-and-talent-platform-image-01.jpg
anker-shallow-sea-strategy-and-talent-platform-image-02.jpg
awe-china-cleaning-appliance-signals-cover.jpg
awe-china-cleaning-appliance-signals-image-001.jpg
```

## Recommended Next Actions

1. Keep current image download paused.
2. Start with a cover-quality batch, not body-image replacement.
3. Prioritize covers that are both small and badly shaped: `vacuum-industry-2018-review-2019-outlook`, `xiaomi-ecosystem-at-a-crossroads`, `first-major-industry-shift-in-2019`, `two-sides-of-dyson`, `complete-vacuum-cleaner-buying-guide-20221006`.
4. Generate a separate unused-image manifest before deleting or moving any unreferenced file.
5. For articles with zero body images, add body evidence only after the cover system is stable.
