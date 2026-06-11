# Bulk Logo / Photo Download Plan

This file tracks the one-pass source collection plan for the remaining first-batch brands.

The goal is to collect as much as possible in one batch without lowering the source-accuracy bar.

## Rule

Use direct download manifests only for assets that are:

```text
official
identity-clear
low-risk
directly downloadable
```

Use review-only tracking for:

```text
founder / CEO portraits
ambiguous logo files
third-party images
manual browser captures
source-verification references
```

Do not update website images from this folder until the user explicitly approves.

## Current Batch Result

Second batch manifest rerun on **2026-06-10**:

```text
Downloaded: 0
Skipped:    3
Failed:     0
```

This confirms the current batch-2 SharkNinja assets are already present locally.

| Brand | Logo Status | Photo / Product Status | Next Action |
|---|---|---|---|
| Maytronics | Official logo downloaded | Product and Rafi Benami portrait downloaded | Confirm Rafi Benami identity/timing before cover use |
| Aiper | Original official logo URL times out | Product/event URLs time out | Needs alternate official URLs or browser capture |
| Beatbot | Downloaded candidate rejected; it is Prime Day graphic | Product images downloaded | Needs clean master logo and verified founder portrait |
| Dreame | Downloaded compact logo rejected; too small/cropped | Product URL times out | Needs clean wordmark and official product image |
| Roborock | Clean wordmark still missing | Saros Z70 product image downloaded | Needs official logo; market/valuation charts should be generated from article data |
| Dyson | Official logo downloaded | Downloaded V16 file is text lockup, not product photo | Needs real official product photo and James Dyson verified portrait |
| iRobot | Official static URLs return 403 | Product/banner URLs return 403 | Needs browser/manual capture or alternate official source |
| SharkNinja | Shark, Ninja, and group logo downloaded | PowerDetect product/evidence images downloaded | Needs article-data chart inputs for growth/category visuals |

## Remaining Logo Targets

| Brand | Target | Source Priority | Status |
|---|---|---|---|
| Aiper | Clean official wordmark / logo lockup | Aiper official website or press kit | needs-source-check |
| Beatbot | Clean master logo | Beatbot official website, media kit, press release | needs-source-check |
| Dreame | Clean Dreame wordmark | Dreame official website or media kit | needs-source-check |
| Roborock | Clean Roborock wordmark | Roborock official website / official brand materials | needs-source-check |
| iRobot | Clean iRobot logo | iRobot official website / newsroom / press kit | needs-source-check |

## Remaining Founder / CEO Photo Targets

| Brand | Person | Source Priority | Status |
|---|---|---|---|
| Aiper | Richard Wang / Wang Yang | Official company page, verified interview, Forbes/company profile | review-only |
| Beatbot | Wang Xuefeng / founder profile | Official company page, financing interview, credible media | review-only |
| Dreame | Yu Hao | Official company page, credible business media, conference photo | review-only |
| Roborock | Chang Jing | Official company source, verified media interview, listing document if needed for identity only | review-only |
| Dyson | James Dyson | Dyson official media/about page | review-only |
| iRobot | Colin Angle | iRobot official history/newsroom or credible media | review-only |
| SharkNinja | Mark Barrocas | SharkNinja leadership page / verified executive bio | review-only |

## Remaining Product / Evidence Targets

| Brand | Target | Preferred Source | Status |
|---|---|---|---|
| Aiper | Scuba / pool robot product images | Aiper official product pages | needs-source-check |
| Aiper | Fluidra partnership evidence | Fluidra official release / annual report | needs-source-check |
| Dreame | Robot vacuum / wet-dry vacuum product image | Dreame official product pages | needs-source-check |
| Roborock | Article-data valuation / market-position chart | Article data, with official sources only for verification | needs-data-extraction |
| Dyson | V16 real product photo | Dyson official product page / media assets | needs-source-check |
| iRobot | Roomba official product image | iRobot official product page / newsroom | needs-source-check |
| SharkNinja | Article-data revenue / category chart | Article data, with official sources only for verification | needs-data-extraction |

## Operational Next Step

Because the local sandbox cannot reliably resolve or fetch several official pages, use this workflow:

1. Add only verified direct image URLs to `download-manifest.tsv` or `download-manifest-batch-2.tsv`.
2. Put portraits, ambiguous assets, and source-verification references into this review file first.
3. Run:

```text
./assets/source-library/download-assets.sh assets/source-library/download-manifest-batch-2.tsv
```

4. Review all downloaded files before website use.

## Data Visual Generation Rule

Do not collect annual report / investor presentation screenshots as image assets by default.

For market and financial visuals, extract the relevant numbers from the article and generate WCB-native visuals:

```text
data cards
line/bar charts
market maps
brand matrices
comparison tables
```

Official reports, filings, and IR pages are used to verify the data behind the image, not to become the image.
