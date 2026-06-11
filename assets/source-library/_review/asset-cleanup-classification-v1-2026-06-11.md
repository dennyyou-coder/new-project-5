# Asset Cleanup Classification V1 - 2026-06-11

Scope: first-batch raw candidates under `assets/source-library/brands/*/raw/`.

Rule: this pass classifies source-library candidates only. It does not update website article images.

Status meanings:

```text
approved = strong candidate for formal source library after cleanup
backup = retain for evidence, extraction, source verification, or fallback use
reject = failed download, wrong asset type, or not usable in this pass
```

## Executive Summary

| Brand | Approved | Backup | Reject | Immediate Best Assets |
| --- | ---: | ---: | ---: | --- |
| Maytronics | 3 | 2 | 0 | official logo, Dolphin LIBERTY 600, 1983 timeline |
| Aiper | 0 | 4 | 1 | Scuba 800 product candidate, CES 2026 source page |
| Beatbot | 1 | 4 | 0 | AquaSense product candidate |
| Dreame | 0 | 4 | 1 | Yu Hao / Dreame Xinhua image, Dreame logo fallback |
| Roborock | 1 | 4 | 0 | Saros Z70 product candidate |
| Dyson | 1 | 2 | 2 | official Dyson logo, James Dyson portrait backup |
| iRobot | 1 | 3 | 1 | Roomba Max 705 official Press Center photo |
| SharkNinja | 1 | 3 | 1 | official IR group logo, Mark Barrocas portrait backup |

Identity updates from user on 2026-06-11:

| Brand | Person Asset | Identity Status | Remaining Review |
| --- | --- | --- | --- |
| Dreame | `raw/people/yu-hao-xinhua-portrait.png` | user-confirmed as Dreame boss Yu Hao | source/licensing and role-timing review |
| SharkNinja | `raw/people/mark-barrocas-verge-portrait.png` | user-confirmed as SharkNinja CEO Mark Barrocas | source/licensing and role-timing review |
| Dyson | `raw/people/james-dyson-wikimedia-portrait.jpg` | user-confirmed as James Dyson of Dyson | source/licensing review and official-source comparison |
 

## Formal Library Candidates

These can move into formal classification first, subject to normal cleanup and no website-use until final approval:

| Brand | Asset | Suggested Formal Category | Status | Reason |
| --- | --- | --- | --- | --- |
| Maytronics | `raw/logos/maytronics-official-logo.svg` | `logos/` | approved | Official SVG; already also exists in formal logo folder. |
| Maytronics | `raw/products/dolphin-liberty-600-official.png` | `products/` | approved | Official 1090x1090 transparent product image; already also exists in formal product folder. |
| Maytronics | `raw/evidence/maytronics-1983-dolphin-timeline.png` | `evidence/` | approved | Official timeline evidence image; already also exists in formal evidence folder. |
| Beatbot | `raw/products/beatbot-aquasense-product-candidate.png` | `products/` | approved | Official Beatbot CDN image; 1600x1600, clean product layer. |
| Roborock | `raw/products/roborock-saros-z70-official.png` | `products/` | approved | Official Roborock CDN image; 1080x1080, clean product layer; already also exists in formal product folder. |
| Dyson | `raw/logos/dyson-official-logo.svg` | `logos/` | approved | Official Dyson SVG; already also exists in formal logo folder. |
| iRobot | `raw/products/irobot-roomba-max-705-media-kit-black.jpg` | `products/` | approved | Official iRobot Press Center photo; 2048x2048; already also exists in formal product folder. |
| SharkNinja | `raw/logos/sharkninja-ir-logo-white.svg` | `logos/` | approved | Official IR logo; already also exists in formal logo folder. Keep PNG-embedded SVG technical note. |

Formal library action completed in this pass:

- Created `assets/source-library/_review/asset-formal-library-approved-v1-2026-06-11.tsv`.
- Copied Beatbot `raw/products/beatbot-aquasense-product-candidate.png` to `products/beatbot-aquasense-product-candidate.png`.
- No other approved files were copied because they already exist in formal folders.
- No website article images were updated.

## Brand Classification

### Maytronics

Approved:

- `raw/logos/maytronics-official-logo.svg`
- `raw/products/dolphin-liberty-600-official.png`
- `raw/evidence/maytronics-1983-dolphin-timeline.png`

Backup:

- `raw/people/rafi-benami-official-maytronics.jpg`: high-quality official photo, but identity/current-role timing needs confirmation before founder/CEO-style use.
- `raw/events/maytronics-corporate-page-candidate.html`: useful source page; not itself a final image.

Reject:

- None in this pass.

Recommended use:

- Template A brand analysis: logo + Dolphin product.
- Body evidence: timeline image.
- People/founder card only after role/timing check.

### Aiper

Approved:

- None yet.

Backup:

- `raw/products/aiper-scuba-800-shopify-product.png`: visually strong 1800x1800 product candidate; source relationship to Aiper must be verified.
- `raw/events/aiper-ces-2026-official-page.html`: official source page; extract event/booth images later.
- `raw/logos/aiper-prnewswire-logo-candidate.html`: PR Newswire page; useful for logo/source extraction, not a logo file.
- `raw/evidence/aiper-prnewswire-company-page.html`: PR Newswire evidence page.

Reject:

- Authority Magazine / Medium Richard Wang page: failed download.

Recommended use:

- Keep Aiper product candidate as backup only until source chain is confirmed.
- Continue searching for clean logo and verified portrait.
- Use official CES page for manual extraction instead of blocked CloudFront direct links.

### Beatbot

Approved:

- `raw/products/beatbot-aquasense-product-candidate.png`

Backup:

- `raw/logos/beatbot-prnewswire-logo-candidate.html`: PR Newswire source page, not a master logo.
- `raw/people/beatbot-founder-36kr-candidate.html`: trusted media page, not a portrait file.
- `raw/events/beatbot-booth-36kr-candidate.html`: trusted media page for booth/event extraction.
- `raw/evidence/beatbot-day-prnewswire.html`: evidence source page.

Reject:

- None in this pass.

Recommended use:

- Add AquaSense candidate to product review queue.
- Formal action: copied `raw/products/beatbot-aquasense-product-candidate.png` to `products/beatbot-aquasense-product-candidate.png` on 2026-06-11.
- Clean master logo remains open.
- Founder/CEO portrait remains review-only.

### Dreame

Approved:

- None yet.

Backup:

- `raw/logos/dreame-wikimedia-logo.svg`: good fallback wordmark candidate, but not official company-hosted.
- `raw/people/yu-hao-xinhua-portrait.png`: strong trusted-media image with Dreame context; identity user-confirmed as Dreame boss Yu Hao on 2026-06-11; source/licensing and role-timing review still needed.
- `raw/events/dreame-xinhua-founder-story.html`: source page for Yu Hao / Dreame story.
- `raw/products/dreame-verge-product-ecosystem-page.html`: trusted media page for product/ecosystem extraction.

Reject:

- Wikipedia Dreame company page: failed download.

Recommended use:

- Use Xinhua portrait as backup for founder-profile research, not final cover until verified.
- Keep Wikimedia logo only as fallback; still prefer official Dreame wordmark.
- Extract product candidates from trusted media / official pages later.

### Roborock

Approved:

- `raw/products/roborock-saros-z70-official.png`

Backup:

- `raw/logos/roborock-wikimedia-logo.svg`: fallback wordmark candidate, not official company-hosted.
- `raw/people/roborock-founder-newsroom-page.html`: official newsroom/about page; extract and verify people assets later.
- `raw/events/roborock-ces-2024-official-page.html`: official CES source page.
- `raw/evidence/roborock-ces-2024-press-release-page.html`: official press release evidence.

Reject:

- None in this pass.

Recommended use:

- Saros Z70 remains primary product candidate.
- Roborock clean logo gap is partially reduced by Wikimedia fallback, but official wordmark is still preferred.
- Use CES pages for event/evidence extraction.

### Dyson

Approved:

- `raw/logos/dyson-official-logo.svg`

Backup:

- `raw/people/james-dyson-wikimedia-portrait.jpg`: high-resolution trusted fallback portrait; identity user-confirmed as James Dyson of Dyson on 2026-06-11; verify licensing and compare against official Dyson source.
- `raw/products/dyson-dc07-wikimedia-product.jpg`: historical product image; not suitable for 2025 V16 article cover.

Reject:

- James Dyson Wikipedia page: failed download.
- Dyson company Wikipedia page: failed download.

Recommended use:

- Keep official logo.
- Use James Dyson portrait only after source/licensing review.
- Product gap remains: still need real official V16 / current Dyson product photo.

### iRobot

Approved:

- `raw/products/irobot-roomba-max-705-media-kit-black.jpg`

Backup:

- `raw/logos/irobot-media-kit-logo-black-print.jpg`: official Press Center logo but small at 360x100.
- `raw/events/irobot-media-kit-home-robots-page.html`: official media-kit page for more extraction.
- `raw/evidence/irobot-media-kit-logo-page.html`: official logo media-kit proof page.

Reject:

- Business Insider Colin Angle page: failed download.

Recommended use:

- Roomba Max 705 Press Center product photo is the best iRobot product candidate so far.
- Logo still needs higher-resolution or vector source if possible.
- Colin Angle portrait remains open.

### SharkNinja

Approved:

- `raw/logos/sharkninja-ir-logo-white.svg`

Backup:

- `raw/people/mark-barrocas-verge-portrait.png`: strong trusted-media portrait candidate; identity user-confirmed as SharkNinja CEO Mark Barrocas on 2026-06-11; verify caption/source and role timing.
- `raw/events/sharkninja-verge-interview-page.html`: useful source context, not an event/booth photo.
- `raw/products/shark-powerdetect-cordless-official.png`: official but small 414x414 image with lockup; body/reference only.

Reject:

- SharkNinja IR overview page: failed with 403.

Recommended use:

- Group logo remains usable with existing technical note.
- Mark Barrocas portrait is a good backup for review, not final until verified.
- Product image should stay body/reference only.

## Cross-Brand Gaps After V1

Still missing or weak:

- Clean master logos: Aiper, Beatbot, Dreame, Roborock, iRobot.
- Verified founder/CEO portraits: Aiper, Beatbot, Roborock, iRobot.
- Current official product photos: Dreame and Dyson.
- Event/booth photos: most brands still only have HTML source pages, not extracted image files.

Best next extraction targets:

1. Aiper CES 2026 official page images.
2. Roborock CES 2024 official page images.
3. iRobot Press Center additional product/logo assets.
4. Beatbot 36Kr / PR Newswire image candidates.
5. Dreame Xinhua / Verge image candidates.

## Formal File Actions In This Pass

Only one file was copied from `raw/` to a formal folder:

- Beatbot `raw/products/beatbot-aquasense-product-candidate.png` -> `products/beatbot-aquasense-product-candidate.png`

No other approved files were copied because they already exist in formal folders.

No website article images were updated in this pass.
