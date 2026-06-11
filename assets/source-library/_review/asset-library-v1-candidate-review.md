# Asset Library V1 Candidate Review

This file tracks assets that should be reviewed before entering the official World Clean Biz source library.

Use the direct download manifest only for assets that are low-risk and clearly official. Use this review list for portraits, ambiguous logos, third-party photos, source-verification references, and article-data visual inputs.

## Review Labels

```text
approved
needs-crop
needs-source-check
reject
replace
```

## First Batch Brands

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

## Person / Founder / CEO Candidates

| Brand | Person | Role | Candidate Source | Current Decision | Notes |
| --- | --- | --- | --- | --- | --- |
| Maytronics | Rafi Benami | CEO | Official Maytronics corporate image, already downloaded | needs-source-check | Image quality is strong, but keep identity/current-role timing confirmation before cover or founder-profile use. |
| Aiper | Richard Wang | Founder & CEO | Needs official or verified source | needs-source-check | Do not use AI-generated face. Use only official company, press, event, or credible media photo. |
| Beatbot | Wang Xuefeng / company founder profile | Founder / CEO | Needs official or verified source | needs-source-check | Confirm English name and title before use. |
| Dreame | Yu Hao | Founder & CEO | Needs official or verified source | needs-source-check | Use only verified portrait. Avoid AI-generated founder photo. |
| Roborock | Chang Jing | Founder / Chairman | Needs official or verified source | needs-source-check | Confirm whether article needs founder, CEO, or company-level analysis. |
| Dyson | James Dyson | Founder | Needs official Dyson or press source | needs-source-check | Strong candidate for founder-profile template. |
| iRobot | Colin Angle | Co-founder / former CEO | Needs official or verified source | needs-source-check | Use only if article discusses founding history or strategic decline. |
| SharkNinja | Mark Barrocas | CEO | Needs official investor / company source | needs-source-check | Good candidate for SharkNinja growth article. |

## Logo Candidates Requiring Review

| Brand | Asset | Candidate Source | Current Decision | Notes |
| --- | --- | --- | --- | --- |
| Aiper | White logo lockup | Official homepage asset in manifest | replace | Download timed out on 2026-06-10; still need official accessible logo source. |
| Aiper | `26-01-15-logo-en.webp` / clean homepage logo candidate | Official Aiper homepage static asset | needs-source-check | Web view exposed a likely cleaner official logo file, but direct fetch returned cache miss in tooling. Do not add to manifest until direct URL is verified. |
| Beatbot | Prime banner logo asset | Official homepage asset in manifest | reject | Downloaded file is a Prime Day activity graphic, not a clean Beatbot logo. Do not use as logo. |
| Beatbot | Clean master logo | Official Beatbot homepage/header | needs-source-check | Official homepage displays Beatbot brand identity, but no reliable direct logo asset was captured. Keep as manual/browser-capture candidate only. |
| Dreame | Compact ellipse logo | Official homepage asset in manifest | replace | Downloaded file is only 48x48 and cropped to "REAM"; not usable for cover or brand matrix. |
| Dreame | Clean wordmark | Official Dreame homepage/header | needs-source-check | Official homepage shows the Dreame brand, but no direct clean wordmark file was captured. Do not use the 48x48 compact mark. |
| Roborock | Logo | Needs official source | needs-source-check | Product images are in manifest; clean logo still needed. |
| Roborock | Global icon | Official Roborock global homepage static asset | reject | Official direct file exists for the globe/region icon, but it is not the Roborock wordmark and should not be used as brand logo. |
| SharkNinja | Group logo | Official SharkNinja investor relations static asset | approved | Downloaded as `sharkninja-official-ir-logo-white.svg`; official source, but SVG embeds PNG rather than pure vector paths. |
| SharkNinja | Shark and Ninja logos | Official SharkNinja footer assets in manifest | approved | For SharkNinja group articles, may also need group-level corporate logo. |

## Logo Source Pass - 2026-06-10

Official pages checked:

| Brand | Official Page Checked | Result | Manifest Action |
| --- | --- | --- | --- |
| Aiper | `https://aiper.com/us/home` | Homepage logo lockup is official but original CloudFront assets timed out locally; a cleaner candidate surfaced but direct fetch was not reliable. | No new manifest row. Keep in review. |
| Beatbot | `https://beatbot.com/` | Homepage confirms brand identity, but captured downloadable candidate was a Prime Day graphic, not logo. | No new manifest row. Keep in review. |
| Dreame | `https://www.dreametech.com/` | Homepage confirms brand identity; existing compact file is not usable. | No new manifest row. Keep in review. |
| Roborock | `https://global.roborock.com/` | Captured official global icon, not Roborock wordmark. | No new manifest row. Reject as logo. |
| SharkNinja | `https://ir.sharkninja.com/overview/default.aspx` | Investor relations page exposes official group logo SVG. | Added group logo to manifest. |
| iRobot | `https://www.irobot.com/` / official static URL | Original manifest URL returned 403 in first pass. | No new manifest row. Need alternate official source or manual capture. |

## Product Image Candidates

| Brand | Product | Candidate Source | Current Decision | Notes |
| --- | --- | --- | --- | --- |
| Maytronics | Dolphin LIBERTY 600 | Official Maytronics product image | approved | Good for Maytronics brand analysis. |
| Aiper | Experts Duo / Scuba V3 | Official Aiper homepage assets | replace | Download timed out on 2026-06-10; choose alternate official URLs or retry later. |
| Beatbot | AquaSense X / AquaSense 2 Ultra | Official Beatbot homepage assets | approved / needs-crop | AquaSense 2 Ultra transparent product image is cover-ready; AquaSense X wide image needs crop. |
| Dreame | X60 / X50 comparison | Official Dreame homepage insight asset | replace | Download timed out on 2026-06-10; still need cleaner product-only image for cover. |
| Roborock | Saros Z70 / Saros 10R | Official Roborock homepage assets | approved / body-only | Saros Z70 transparent product image is cover-ready; Saros 10R wide image is body evidence only. |
| Dyson | V16 Piston Animal | Official Dyson homepage asset | reject | Downloaded file is a V16 text lockup, not a product photo. Need real product image. |
| iRobot | Roomba Max 705 | Official iRobot homepage asset | replace | Official URL returned 403 on 2026-06-10; still useful if an accessible official product source is found. |
| SharkNinja | Shark PowerDetect | Official SharkNinja product assets | body-only | Downloaded on rerun. Product image is small with lockup; use as product reference/body evidence, not cover hero. |

## Evidence / Event / Data Candidates

| Brand / Topic | Asset Type | Candidate Source | Current Decision | Notes |
| --- | --- | --- | --- | --- |
| Maytronics | Timeline evidence | Official Maytronics timeline image | approved | Strong evidence for history / category origin. |
| Aiper | CES 2026 event image | Official Aiper homepage event image | replace | Download timed out on 2026-06-10; still useful if alternate official source is found. |
| Beatbot | Product bundle / warranty / feature evidence | Official Beatbot homepage assets | needs-crop | Use as body evidence, not necessarily cover. |
| iRobot | 2026 homepage banner | Official iRobot homepage asset | replace | Official URL returned 403 on 2026-06-10; use browser/manual capture or alternate official source. |
| SharkNinja | DuoClean / feature evidence | Official SharkNinja product page asset | body-only | Downloaded on rerun. High-quality feature image, but strong promotional light effect; use as technical evidence, not industry-analysis cover hero. |

## Next Review Pass

For the next bulk pass, use:

```text
assets/source-library/_review/bulk-logo-photo-download-plan.md
assets/source-library/download-manifest-batch-2.tsv
```

After the download script runs:

1. Open each downloaded brand folder.
2. Reject or replace low-quality logo variants.
3. Approve product images that are clean enough for covers.
4. Move uncertain portraits into `raw/` until identity is verified.
5. Record approved use cases in each brand `notes.md`.
