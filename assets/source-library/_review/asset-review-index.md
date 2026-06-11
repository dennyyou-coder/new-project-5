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

## Asset Library V1 Gap Audit - 2026-06-11

Created:

```text
assets/source-library/_review/asset-library-v1-gap-audit-2026-06-11.md
assets/source-library/download-manifest-brand-assets-v1.tsv
```

Committed by user:

```text
e45238f Add asset library v1 gap audit
```

New official retry manifest result:

```text
Downloaded: 0
Skipped:    0
Failed:     9
```

Failure pattern: local DNS could not resolve official Aiper CloudFront hosts, `www.dreametech.com`, or `www.irobot.com`. No files were added to `assets/source-library/brands/` by this run.

Next recovery plan:

```text
assets/source-library/_review/asset-source-recovery-plan-2026-06-11.md
```

Use this plan to decide whether to retry official direct URLs, manually capture official assets into `raw/`, or keep candidates in review-only status.

## Download-First Policy Update - 2026-06-11

Current user direction:

```text
Download first. Clean, review, and classify after download.
```

Operational interpretation:

- Collect official and credible candidate assets first.
- Do not treat downloaded files as approved by default.
- Keep uncertain people, weak logos, and ambiguous images in review-only status until the cleanup pass.
- Do not update website article images during source collection.

Brand-assets manifest run after policy update:

```text
./assets/source-library/download-assets.sh assets/source-library/download-manifest-brand-assets-v1.tsv
```

Result:

```text
Downloaded: 4
Skipped:    0
Failed:     9
```

New downloaded files:

| Brand | File | Dimensions | Initial Status |
|---|---|---:|---|
| iRobot | `logos/irobot-media-kit-logo-black-print.jpg` | 360x100 | downloaded, needs review |
| iRobot | `logos/irobot-media-kit-logo-black-web.jpg` | 175x100 | downloaded, likely reference-only pending review |
| iRobot | `products/irobot-roomba-max-705-media-kit-black.jpg` | 2048x2048 | downloaded, needs review |
| iRobot | `products/irobot-roomba-max-705-media-kit-white.jpg` | 2048x2048 | downloaded, needs review |

Remaining failures:

| Brand | Count | Failure Pattern |
|---|---:|---|
| Aiper | 5 | official CloudFront hosts connect timeout |
| Dreame | 1 | `www.dreametech.com` connect timeout |
| iRobot homepage/static | 3 | official `www.irobot.com` static URLs return 403 |

## Raw Candidates Download Pass - 2026-06-11

User direction:

```text
Do not keep forcing Aiper / Dreame official CDN.
Build a raw candidates manifest.
Download first, then clean, review, and classify.
```

Created:

```text
assets/source-library/download-manifest-raw-candidates-v1.tsv
assets/source-library/_review/asset-raw-candidates-review-2026-06-11.tsv
```

Manifest coverage:

```text
8 first-batch brands
5 candidate types per brand:
logo / product / people / event / evidence
```

Download result:

```text
Downloaded: 34
Skipped:    0
Failed:     6
```

Main new usable download areas:

| Brand | Progress |
|---|---|
| Maytronics | Raw copies of logo, product, people, timeline, and corporate page source captured. |
| Aiper | Product candidate and official/press source pages captured without relying on blocked Aiper CDN image URLs. |
| Beatbot | Product candidate and trusted media / PR Newswire source pages captured. |
| Dreame | Wikimedia logo candidate, Xinhua Yu Hao portrait, Xinhua source page, and Verge product/source page captured. |
| Roborock | Wikimedia logo candidate, official Saros Z70 product image, official newsroom/about, CES page, and press release captured. |
| Dyson | Official logo, Wikimedia historical product photo, and James Dyson portrait candidate captured. |
| iRobot | Official Press Center logo/product and media-kit source pages captured. |
| SharkNinja | Official IR logo, product reference, Mark Barrocas portrait candidate, and Verge interview source page captured. |

Failed candidates:

| Brand | Candidate | Failure |
|---|---|---|
| Aiper | Authority Magazine / Medium Richard Wang page | timeout |
| Dreame | Wikipedia company page | connection reset |
| Dyson | James Dyson Wikipedia page | connection reset |
| Dyson | Dyson company Wikipedia page | connection reset |
| iRobot | Business Insider Colin Angle page | timeout |
| SharkNinja | SharkNinja IR overview page | 403 |

Initial review manifest uses:

```text
approved = strong candidate to keep for cleanup/classification, not direct website approval
backup = source/candidate retained, needs extraction or verification
reject = failed download or clearly not usable in this pass
```

## Asset Cleanup Classification V1 - 2026-06-11

Created:

```text
assets/source-library/_review/asset-cleanup-classification-v1-2026-06-11.md
```

This pass reviewed the raw candidates by brand and produced:

```text
approved / backup / reject
reason
suggested formal category
recommended use
remaining gaps
```

No files were moved out of `raw/` in this pass. Reason:

- several approved files already exist in formal folders;
- backup assets still need source, licensing, role, or image extraction review;
- keeping raw and formal source paths separate avoids duplicate or premature approval.

Strongest formal candidates after V1:

| Brand | Asset |
|---|---|
| Maytronics | official logo, Dolphin LIBERTY 600, 1983 timeline |
| Beatbot | AquaSense product candidate |
| Roborock | Saros Z70 product candidate |
| Dyson | official logo |
| iRobot | Roomba Max 705 Press Center product photo |
| SharkNinja | official IR group logo |

Main open gaps:

```text
Aiper / Beatbot / Dreame / Roborock / iRobot clean master logos
Aiper / Beatbot / Roborock / iRobot verified founder or CEO portraits
Dreame and Dyson current official product photos
Event / booth image extraction from downloaded HTML source pages
```

## People Identity Confirmations - 2026-06-11

User confirmed these raw people candidates:

| Brand | Person | Raw Asset | Status |
|---|---|---|---|
| Dreame | Yu Hao | `assets/source-library/brands/dreame/raw/people/yu-hao-xinhua-portrait.png` | identity-confirmed; source/licensing and role-timing review still needed |
| SharkNinja | Mark Barrocas | `assets/source-library/brands/sharkninja/raw/people/mark-barrocas-verge-portrait.png` | identity-confirmed; source/licensing and role-timing review still needed |
| Dyson | James Dyson | `assets/source-library/brands/dyson/raw/people/james-dyson-wikimedia-portrait.jpg` | identity-confirmed; source/licensing review and official-source comparison still needed |

## Formal Library Approved V1 - 2026-06-11

Created:

```text
assets/source-library/_review/asset-formal-library-approved-v1-2026-06-11.tsv
```

This pass promoted the first approved raw candidate into a formal product folder:

```text
assets/source-library/brands/beatbot/products/beatbot-aquasense-product-candidate.png
```

Other approved assets in the formal approved manifest were not copied because they already exist in formal folders.

No website article images were updated.

## Article Asset Integrity Audit V1 - 2026-06-11

Created:

```text
assets/source-library/_review/article-asset-integrity-audit-v1-2026-06-11.md
```

Result:

```text
152 insight articles scanned
1341 insight image files found
1053 local image references found
0 missing referenced files
0 articles without coverImage
45 articles with no body images
38 covers smaller than 1200x675
32 covers outside normal 16:9 tolerance
289 unreferenced insight image files
```

No website content or images were changed in this audit.

## Unused Insight Image Manifest V1 - 2026-06-11

Created:

```text
assets/source-library/_review/unused-insight-image-manifest-v1-2026-06-11.tsv
```

Result:

```text
289 unreferenced insight image files classified
161 keep
88 migrate-candidate
40 needs-review
0 delete-candidate
```

No images were deleted, moved, renamed, or reconnected in this pass.

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
