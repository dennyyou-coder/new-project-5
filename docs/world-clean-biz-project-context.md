# World Clean Biz Project Context

## Current Status

World Clean Biz has launched.

The visual template system has been upgraded to **World Clean Biz Visual System V1.1**.

## Finalized Visual Templates

```text
Template A: Brand Analysis
Status: Final

Template B: Market Analysis
Status: Final

Template C: Founder Profile
Status: Final

Template D: Industry Opinion
Status: Final

Template E: Data Visual
Status: Final in V1.1
```

## Visual Principles

Use:

```text
Real logo
Real founder photo
Real product photo
Real event photography
Evidence-driven design
Bloomberg Intelligence style
CB Insights style
Industry research publication style
```

Avoid:

```text
Generic AI robots
Futuristic blue-glow graphics
Decorative AI illustrations
```

## Current Priority

Build **Asset Library V1**.

Current asset work is source-library work only. Do not update website images or article MDX image references unless the user explicitly approves.

## Asset Library V1 Needs

```text
1. Top 50 brand logo library
2. Top 50 founder portrait library
3. Product image library
4. Event photo library
5. Market data library
```

## Future Goal

Scale article production using the established visual template system.

The next bottleneck is not template design. The next bottleneck is verified source asset supply.

## Asset Library V1 Current Pass

First official download manifest covers:

```text
Maytronics
Aiper
Beatbot
Dreame
Roborock
Dyson
iRobot
SharkNinja
```

The first download/review pass was recorded on **2026-06-10**.

Result:

```text
Downloaded: 12
Skipped:    4
Failed:     10
```

Current useful source assets:

```text
Maytronics: logo, Dolphin product, timeline evidence; Rafi Benami portrait needs identity/timing confirmation before cover use.
Beatbot: product images usable; downloaded Prime Day graphic is not a logo.
Roborock: Saros Z70 product image usable for cover product layer; wider product images are body/reference only.
Dyson: official logo usable; downloaded V16 file is a text lockup, not a product photo.
SharkNinja: Shark and Ninja logos usable; group-level IR logo downloaded and usable with technical note; PowerDetect product/evidence images downloaded but body-only, not cover hero.
```

Current replacement needs:

```text
Aiper: all first-pass assets failed due to CloudFront timeout.
Dreame: clean logo and product image needed.
iRobot: official URLs returned 403; use alternate official or manual browser capture.
SharkNinja: product/evidence CDN failed DNS resolution.
Beatbot: clean master logo still needed.
Roborock: clean logo still needed; chart images should be generated from article data, with official sources used only for verification.
Dyson: real product photo still needed.
```

## Bulk Logo / Photo Collection Policy

The user wants remaining first-batch brand logos and photos collected in one pass.

Use:

```text
assets/source-library/download-manifest-batch-2.tsv
assets/source-library/_review/bulk-logo-photo-download-plan.md
```

Policy:

```text
Direct manifests: official, low-risk, identity-clear assets only.
Review file: founder / CEO portraits, ambiguous logos, third-party photos, manual browser captures, source-verification references.
Website images: do not update until explicitly approved.
```

Batch-2 manifest was rerun on **2026-06-10** and returned:

```text
Downloaded: 0
Skipped:    3
Failed:     0
```

All current batch-2 SharkNinja assets are already present locally.

## Market Data Image Rule

The user does **not** want annual report / investor presentation screenshots as the primary image material.

Market and financial visuals should be generated from the data used inside the article.

Use annual reports, investor presentations, prospectuses, SEC filings, and IR pages only as verification sources for:

```text
number accuracy
date accuracy
company identity
source label
context
```

Final WCB images should be:

```text
article-data charts
brand matrices
market maps
comparison tables
data cards
```

## Article Data Visual Library Current Pass

First batch data visual tracking has started.

Data Visual has been promoted into the formal visual system:

```text
Template E: Data Visual
```

Files:

```text
assets/source-library/data-visuals/README.md
assets/source-library/data-visuals/first-batch-data-visual-plan.md
assets/source-library/data-visuals/first-batch-data-points.tsv
```

Ready-for-design first visuals:

```text
SharkNinja 2022 vs 2024 sales split
iRobot debt stack / bankruptcy-risk card
Aiper / Fluidra alliance data card
Maytronics revenue reset chart
Maytronics pool robot penetration chart
Dyson 2025 product comparison table
```

Generated-for-review:

```text
SharkNinja 2022 vs 2024 sales split:
assets/source-library/data-visuals/sharkninja-sales-split/sharkninja-sales-split-v1.png
assets/source-library/data-visuals/sharkninja-sales-split/sharkninja-sales-split-v1.jpg

iRobot debt stack / deadline risk:
assets/source-library/data-visuals/irobot-debt-risk/irobot-debt-risk-v1.png
assets/source-library/data-visuals/irobot-debt-risk/irobot-debt-risk-v1.jpg

Maytronics revenue reset / target gap:
assets/source-library/data-visuals/maytronics-revenue-reset/maytronics-revenue-reset-v1.png
assets/source-library/data-visuals/maytronics-revenue-reset/maytronics-revenue-reset-v1.jpg

Aiper / Fluidra alliance economics:
assets/source-library/data-visuals/aiper-fluidra-alliance/aiper-fluidra-alliance-v1.png
assets/source-library/data-visuals/aiper-fluidra-alliance/aiper-fluidra-alliance-v1.jpg
```

Template E applies to:

```text
revenue change
market share
brand split
growth decomposition
regional split
channel split
category mix
product mix evolution
```

Needs author check before design:

```text
Beatbot financing card: confirm Beatbot / Starlight naming.
Roborock growth path: confirm RMB 10B vs 100B target and RMB conversion units.
```

## Blog Image Update Planning

Current planning file:

```text
assets/source-library/_review/blog-image-update-plan-v1.md
```

Screenshot/data-image audit file:

```text
assets/source-library/_review/screenshot-to-data-visual-audit-v1.md
```

Data visual approval queue:

```text
assets/source-library/_review/data-visual-approval-queue.md
```

Full article replacement candidate list:

```text
assets/source-library/_review/article-full-replacement-candidates-v1.md
```

User review preference:

```text
When confirmation is needed, provide direct clickable links to the candidate image files.
Do not ask the user to browse folders manually.
```

Key rule:

```text
Do not run a site-wide image replacement.
Do not touch chronicle/history/body archive image sets by default.
Do not touch faithful translations, annual-report excerpts, buying guides, patent/legal evidence, or real event photo sets unless there is a clear issue or user approval.
Convert data screenshots only when the screenshot is being used to communicate data, not when it is the source evidence itself.
Preserve original evidence screenshots and add a separate E Data Visual when needed.
```

Recommended first execution batch:

```text
1. sharkninja-road-to-10-billion-dollars: add E Data Visual sales split.
2. irobot-financial-crisis: generate E debt stack / deadline risk card.
3. maytronics-robotic-pool-cleaner-reinvention: generate E revenue reset + penetration visuals.
4. aiper-fluidra-pool-robotics-alliance: generate E alliance data card.
5. dyson-new-product-review-2025: generate E product comparison table.
```

Hold:

```text
Roborock: wait for unit confirmation.
Beatbot: wait for entity/name confirmation.
```
