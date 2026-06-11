# Screenshot to Data Visual Audit V1

Created: 2026-06-10

Purpose:

```text
Decide which report/data screenshots can be converted into WCB-native E Data Visual images, and which screenshots should remain as source evidence.
```

Core rule:

```text
Do not replace every screenshot.
Convert data screenshots when the article needs readability.
Preserve source-document screenshots when the screenshot itself is the evidence object.
```

## Classification Rules

### Preserve As Evidence

Keep screenshots when they are:

```text
annual report pages
prospectus pages
filing excerpts
patent drawings
court/legal screenshots
conference/event photos
historical/archive images
```

Reason:

```text
The reader needs to see the original document or historical object.
```

Allowed action:

```text
Keep the screenshot.
Add a separate E Data Visual after it if the article contains a strong numeric conclusion.
```

### Convert To E Data Visual

Rebuild screenshots when they are:

```text
Excel-style charts
low-resolution tables
market-size charts
revenue breakdown charts
brand share charts
channel/category split charts
debt/cash/risk tables
product comparison screenshots
```

Reason:

```text
The screenshot is being used mainly to communicate data, not to prove document authenticity.
```

Allowed action:

```text
Extract the specific article-used numbers.
Verify unit, year, and source label from article context.
Generate a WCB-native E Data Visual.
Do not recreate full copyrighted report pages.
```

## First Pass Findings

### Generated For Review

| Article | Visual | Files | Notes |
|---|---|---|---|
| `sharkninja-road-to-10-billion-dollars` | Shark / Ninja sales split | `assets/source-library/data-visuals/sharkninja-sales-split/sharkninja-sales-split-v1.png` | Article-data visual; already suitable as first E example. |
| `irobot-financial-crisis` | Debt stack and deadline risk | `assets/source-library/data-visuals/irobot-debt-risk/irobot-debt-risk-v1.png` | Converts filing/debt figures into a reader-friendly risk visual. |
| `maytronics-robotic-pool-cleaner-reinvention` | Revenue reset / 2025 target gap | `assets/source-library/data-visuals/maytronics-revenue-reset/maytronics-revenue-reset-v1.png` | Converts article revenue and margin data into a target-gap visual. |
| `aiper-fluidra-pool-robotics-alliance` | Alliance economics / growth path | `assets/source-library/data-visuals/aiper-fluidra-alliance/aiper-fluidra-alliance-v1.png` | Converts deal structure and Aiper growth data into an alliance logic visual. |

### High Priority Next

| Article | Candidate Visual | Action |
|---|---|---|
| `maytronics-robotic-pool-cleaner-reinvention` | Pool robot penetration / margin pressure | Optional second E visual; keep historical/product evidence images. |
| `dyson-new-product-review-2025` | Product spec and price table | Generate comparison-table visual. |
| `china-cleaning-appliance-financial-reality-check` | Industry financial reality card | Review article data, then generate only if units are clear. |
| `irobot-fourth-quarter-and-full-year-revenue` | Revenue trend / Q4 vs full-year structure | Review whether current images are evidence screenshots or low-readability data screenshots. |

### Preserve By Default

| Article Type | Examples | Decision |
|---|---|---|
| Annual report translation | `irobot-2018-annual-report-faithful-translation`, `hamilton-beach-2018-annual-report-faithful-translation` | Preserve screenshots; optional E summary card only after approval. |
| Prospectus/report reading | `roborock-ipo-prospectus-signals`, `ecovacs-mid-year-report-reading`, `tti-2019-interim-report` | Preserve document evidence; do not replace body screenshots globally. |
| Patent/legal | `bissell-vs-tineco-patent-details`, `lawsuit-that-shaped-the-handheld-vacuum-industry` | Preserve legal/patent evidence images. |
| History/archive | `hundred-years-of-cleaning-appliance-history`, `delonghi-group-company-history-and-appliance-brands` | Preserve archive image sequence. |
| Buying guide | `best-robot-vacuum-buying-guide-2022`, `complete-hard-floor-washer-buying-guide` | Preserve product/example images unless broken or wrong. |

## Working Process

For each candidate article:

1. Identify whether the current image is source evidence or data communication.
2. Extract only the numbers used by the article.
3. Confirm unit, year, company/entity name, and source label.
4. Generate candidate in `assets/source-library/data-visuals/`.
5. Visually review the image.
6. Wait for user approval before copying anything to `public/images/insights/`.
7. Update MDX only after approval.

## Current Decision

```text
Two E Data Visual candidates are generated for review.
No website images or MDX references have been changed.
Next recommended generation target: Maytronics revenue reset or Aiper/Fluidra alliance economics.
```
