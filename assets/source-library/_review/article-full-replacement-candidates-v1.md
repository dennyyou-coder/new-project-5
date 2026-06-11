# Article Full Image Replacement Candidates V1

Created: 2026-06-10

Purpose:

```text
Select a few articles for full image replacement from cover to body images.
```

Rule:

```text
Do not update public website images or MDX references until the user approves a specific article package.
```

## Tier 1: Ready For User Review

### 1. Maytronics

Article:

```text
content/insights/maytronics-robotic-pool-cleaner-reinvention.mdx
```

Why first:

```text
This article has a cover plus multiple body images.
Approved official logo, product photo, history evidence image, and generated E Data Visual are already available.
The replacement package avoids the unconfirmed CEO portrait.
```

Replacement package:

```text
assets/source-library/article-replacements/maytronics-robotic-pool-cleaner-reinvention/
```

Review links:

- [Cover](</Users/youdenny/Documents/New project 5/assets/source-library/article-replacements/maytronics-robotic-pool-cleaner-reinvention/maytronics-robotic-pool-cleaner-reinvention-cover.jpg>)
- [Body 001 Product V2](</Users/youdenny/Documents/New project 5/assets/source-library/article-replacements/maytronics-robotic-pool-cleaner-reinvention/maytronics-robotic-pool-cleaner-reinvention-body-001-product-v2.jpg>)
- [Body 002 History](</Users/youdenny/Documents/New project 5/assets/source-library/article-replacements/maytronics-robotic-pool-cleaner-reinvention/maytronics-robotic-pool-cleaner-reinvention-body-002-history.jpg>)
- [Body 003 Data Visual](</Users/youdenny/Documents/New project 5/assets/source-library/article-replacements/maytronics-robotic-pool-cleaner-reinvention/maytronics-robotic-pool-cleaner-reinvention-body-003-data-visual.jpg>)

Proposed mapping after approval:

| Current Role | Website File To Replace |
|---|---|
| Cover | `public/images/insights/maytronics-robotic-pool-cleaner-reinvention-cover.jpg` |
| Body image 1 | `public/images/insights/maytronics-robotic-pool-cleaner-reinvention-image-02.jpg` |
| Body image 2 | `public/images/insights/maytronics-robotic-pool-cleaner-reinvention-image-003.jpg` |
| Body image 3 | `public/images/insights/maytronics-robotic-pool-cleaner-reinvention-image-004.jpg` |

## Tier 2: Good Candidates, But Need One More Step

### 2. iRobot Financial Crisis

Current state:

```text
The article has cover only, no body images.
Generated E Data Visual is ready.
```

Candidate:

- [iRobot debt risk](</Users/youdenny/Documents/New project 5/assets/source-library/data-visuals/irobot-debt-risk/irobot-debt-risk-v1.png>)

Recommended next step:

```text
Create a matching cover image and insert the debt risk visual into the body after the debt section.
```

### 3. SharkNinja Road to USD 10 Billion

Current state:

```text
The article has cover only, no body images.
Generated E Data Visual is ready.
Official Shark / Ninja logos are available, but CEO portrait is not yet approved for cover use.
```

Candidate:

- [SharkNinja sales split](</Users/youdenny/Documents/New project 5/assets/source-library/data-visuals/sharkninja-sales-split/sharkninja-sales-split-v1.png>)

Recommended next step:

```text
Create a cover using official logos + product/category data.
Add sales split visual into body after the 2022/2024 sales paragraph.
```

### 4. Aiper / Fluidra

Current state:

```text
The article has cover plus three body images.
Generated E Data Visual is ready.
Official Aiper product/logo assets are still missing because first downloads failed.
```

Candidate:

- [Aiper / Fluidra alliance](</Users/youdenny/Documents/New project 5/assets/source-library/data-visuals/aiper-fluidra-alliance/aiper-fluidra-alliance-v1.png>)

Recommended next step:

```text
Do not do full replacement yet.
First source official Aiper logo/product images or choose a data-led replacement style.
```

## Hold

| Article | Reason |
|---|---|
| `roborock-road-to-100-billion-rmb` | Unit and target figures need author confirmation. |
| `beatbot-in-leifeng-coverage` | Entity/name confirmation needed before final visuals. |
| Chronicle/history/archive articles | Keep existing image sequence unless there is a clear problem. |
| Annual report translation/report-reading articles | Preserve source-document screenshots as evidence. |

## Current Recommendation

```text
Start with Maytronics as the first full replacement test.
After approval, copy candidate files into public/images/insights/ using the same filenames and keep MDX references unchanged.
Then visually check the article page.
```
