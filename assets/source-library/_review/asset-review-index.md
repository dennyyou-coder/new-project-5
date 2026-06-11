# World Clean Biz Asset Review Index

This folder stores source assets for future World Clean Biz article images.

The source library is separate from the published website image folder:

```text
Source library:
assets/source-library/

Published website images:
public/images/insights/
```

Workflow:

1. Collect real-source materials into `assets/source-library/`.
2. Record source, usage, and accuracy notes.
3. User reviews material accuracy.
4. Approved assets are cropped/composited into final website images.
5. Final images are copied to `public/images/insights/`.
6. Article MDX files are updated only after final approval.

Review status values:

```text
Pending review
Approved
Rejected
Needs replacement
```

## First Batch Target Brands

| Brand | Folder | Status |
|---|---|---|
| Maytronics | `brands/maytronics/` | Partial approved source set |
| Aiper | `brands/aiper/` | Download failed, needs replacement sources |
| Beatbot | `brands/beatbot/` | Partial source set, logo replacement needed |
| Dreame | `brands/dreame/` | Logo placeholder only, needs replacement sources |
| Roborock | `brands/roborock/` | Partial product source set, logo/evidence needed |
| Dyson | `brands/dyson/` | Logo collected, product replacement needed |
| iRobot | `brands/irobot/` | Download blocked, needs replacement sources |
| SharkNinja | `brands/sharkninja/` | Shark/Ninja logos collected, product/evidence failed |

## First Manifest Download Pass - 2026-06-10

Download command run by user:

```text
./assets/source-library/download-assets.sh
```

Result:

```text
Downloaded: 12
Skipped:    4
Failed:     10
```

Failure pattern:

| Brand | Failed Assets | Failure Type | Next Action |
|---|---:|---|---|
| Aiper | 4 | CloudFront timeout | Retry later or replace with alternate official URLs |
| Dreame | 1 | dreametech.com timeout | Replace with direct CDN/product-page source |
| iRobot | 3 | 403 from official site | Use browser/manual source capture or alternate official investor/media assets |
| SharkNinja | 2 | DNS resolution failure for assets.sharkninja.com | Retry later or replace with accessible official CDN URLs |

Current review decisions:

| Brand | Asset | Decision | Approved Use |
|---|---|---|---|
| Maytronics | Official logo SVG | approved | cover-brand-analysis, body-evidence |
| Maytronics | Rafi Benami official image | needs identity confirmation before cover | body-person; cover-founder-profile after user confirmation |
| Maytronics | Dolphin LIBERTY 600 product image | approved | cover-brand-analysis, body-product |
| Maytronics | 1983 Dolphin timeline image | approved | body-evidence |
| Beatbot | AquaSense X wide product image | needs crop | cover-brand-analysis, body-product |
| Beatbot | AquaSense 2 Ultra transparent product image | approved for cover product layer | cover-brand-analysis, body-product |
| Beatbot | AquaSense X bundle image | body evidence only | body-product, body-evidence |
| Beatbot | Prime Day logo image | reject as logo | none |
| Dreame | 48px ellipse logo | needs replacement | temporary reference only |
| Roborock | Saros Z70 transparent product image | approved for cover product layer | cover-brand-analysis, body-product |
| Roborock | Saros 10R wide product image | body evidence only | body-product |
| Roborock | Z Store product lineup image | needs replacement | temporary reference only |
| Dyson | Official logo SVG | approved | cover-brand-analysis, body-evidence |
| Dyson | V16 Piston Animal text asset | reject as product image | none |
| SharkNinja | Shark logo SVG | approved | body-evidence, brand matrix |
| SharkNinja | Ninja logo SVG | approved | body-evidence, brand matrix |
| SharkNinja | Group IR logo SVG | approved with technical note | cover-brand-analysis, body-evidence |
| SharkNinja | PowerDetect cordless product image | body evidence only | body-product, brand matrix |
| SharkNinja | PowerDetect DuoClean feature image | body evidence only | body-evidence, body-product |

## Logo Source Pass - 2026-06-10

Second-pass logo sourcing focused on low-risk official sources.

| Brand | Result | Status |
|---|---|---|
| SharkNinja | Official group logo SVG found on SharkNinja investor relations static host and added to manifest. Downloaded successfully on rerun. | Approved with technical note: SVG embeds a PNG image, not pure vector paths. |
| Aiper | Official homepage logo candidates remain blocked by unreliable CloudFront/direct fetch behavior. | Keep in review |
| Beatbot | Downloaded logo candidate is a Prime Day graphic, not master logo. | Replace |
| Dreame | Existing compact asset is too small/cropped. | Replace |
| Roborock | Captured official global icon is not the Roborock wordmark. | Reject as logo |
| iRobot | Original official static URL returned 403. | Replace or manual capture |

## Second Manifest Rerun - 2026-06-10

Result:

```text
Downloaded: 3
Skipped:    16
Failed:     8
```

New successful downloads:

| Brand | Asset | Decision | Notes |
|---|---|---|---|
| SharkNinja | `logos/sharkninja-official-ir-logo-white.svg` | approved with technical note | Official IR logo; SVG wrapper embeds PNG, so treat as official raster logo rather than pure vector. |
| SharkNinja | `products/shark-powerdetect-cordless-official.png` | body evidence only | Small 414x414 product image with Shark PowerDetect lockup; useful for product matrix/reference, not cover hero. |
| SharkNinja | `evidence/shark-powerdetect-duoclean-official.jpg` | body evidence only | High-quality feature/evidence image; strong promotional light effect, so better for technical evidence than cover. |

Batch-2 manifest confirmation rerun:

```text
Downloaded: 0
Skipped:    3
Failed:     0
```

No new assets were added because all three batch-2 SharkNinja files already existed locally.

## Article Data Visual Library - 2026-06-10

Created:

```text
assets/source-library/data-visuals/README.md
assets/source-library/data-visuals/first-batch-data-visual-plan.md
assets/source-library/data-visuals/first-batch-data-points.tsv
```

First ready-for-design visuals:

| Article | Visual | Status |
|---|---|---|
| `sharkninja-road-to-10-billion-dollars` | 2022 vs 2024 Shark / Ninja sales split | generated-for-review |
| `irobot-financial-crisis` | iRobot debt stack and deadline risk | ready-for-design |
| `aiper-fluidra-pool-robotics-alliance` | Aiper / Fluidra alliance economics | ready-for-design |
| `maytronics-robotic-pool-cleaner-reinvention` | Maytronics revenue peak and reset | ready-for-design |
| `maytronics-robotic-pool-cleaner-reinvention` | Pool robot penetration path | ready-for-design |
| `dyson-new-product-review-2025` | Dyson 2025 product comparison table | ready-for-design |
| `beatbot-in-leifeng-coverage` | Beatbot financing and allocation card | needs-author-check |
| `roborock-road-to-100-billion-rmb` | Roborock growth path | needs-author-check |

Important data warning:

```text
Roborock article has possible unit conflicts. Do not generate final data visuals until the author confirms the RMB 10B / 100B target and RMB conversion figures.
```

First generated data visual:

```text
assets/source-library/data-visuals/sharkninja-sales-split/sharkninja-sales-split-v1.png
assets/source-library/data-visuals/sharkninja-sales-split/sharkninja-sales-split-v1.jpg
```

Template decision:

```text
Template E: Data Visual
Status: formalized in Visual System V1.1
```

Design rule added after SharkNinja sample review:

```text
Key Insight should be data-specific. Example: "Ninja contributed 67% of total growth between 2022 and 2024."
```
