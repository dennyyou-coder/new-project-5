# Asset Library V1 Gap Audit - 2026-06-11

Scope: first-batch priority brands for World Clean Biz Asset Library V1.

Checked against:

- `assets/source-library/download-manifest.tsv`
- `assets/source-library/download-manifest-batch-2.tsv`
- local files under `assets/source-library/brands/`
- existing review decisions in `asset-review-index.md` and `asset-library-v1-candidate-review.md`

Important rule: this audit does not approve uncertain people photos. Founder / CEO portraits stay in candidate review until identity, role, and source timing are confirmed.

## Summary

| Brand | Logo | People | Products | Evidence | Event / Forum | Priority Gap |
| --- | --- | --- | --- | --- | --- | --- |
| Maytronics | partial approved | needs source timing check | approved | approved | missing | Confirm Rafi Benami role/timing before cover use; add event/forum assets later. |
| Aiper | missing | review-only | missing | missing | missing | Retry official Aiper product/event URLs and find a clean master logo. |
| Beatbot | missing | review-only | partial approved | partial body-only | missing | Find clean master logo and verified founder/executive source. |
| Dreame | missing | review-only | missing | missing | missing | Replace 48x48 compact logo and add official product-only images. |
| Roborock | missing | review-only | partial approved | temporary/reference only | missing | Find clean Roborock wordmark and stronger company/product evidence. |
| Dyson | approved | review-only | missing | missing | missing | Replace rejected V16 text lockup with real official product photo. |
| iRobot | missing | review-only | missing | missing | missing | Retry official iRobot logo/product/banner URLs; use manual capture only if source is clear. |
| SharkNinja | approved | review-only | body-only | body-only | missing | Generate article-data visuals from article figures; add event/IR evidence later. |

## Brand Detail

### Maytronics

Current local files:

- `logos/maytronics-official-logo.svg`
- `people/rafi-benami-official-maytronics.jpg`
- `products/dolphin-liberty-600-official.png`
- `evidence/maytronics-1983-dolphin-timeline.png`

Gap assessment:

- Logo: approved official SVG.
- People: photo is official, but identity/current-role timing still needs confirmation before founder/CEO-style use.
- Products: Dolphin LIBERTY 600 is approved.
- Evidence: 1983 Dolphin timeline evidence is approved.
- Event/forum: no source-library event or exhibition image yet.

Next action:

- Do not redownload current approved files.
- Keep Rafi Benami in candidate review until role/timing is confirmed.

### Aiper

Current local files:

- `notes.md` only.

Manifest result:

- `aiper-official-logo-white.webp`: failed / replace.
- `aiper-experts-duo-official.webp`: failed / replace.
- `aiper-scuba-v3-official.webp`: failed / replace.
- `aiper-ces-2026-official-event.webp`: failed / replace.

Gap assessment:

- Logo: missing. The official homepage logo candidate is a white logo plus "World's No.1" claim lockup, not a clean master logo.
- People: Richard Wang / Wang Yang remains review-only.
- Products: missing. Official Aiper homepage currently exposes Experts Duo and Scuba V3 product image URLs.
- Evidence: missing. Fluidra partnership evidence still needs official source.
- Event/forum: missing. Official Aiper event images are visible on the homepage, but direct fetch reliability is mixed.

Next action:

- Add official Aiper homepage product/event URLs to the new retry manifest.
- Do not add any founder/CEO portrait to direct download.
- Continue searching separately for a clean official logo or media-kit source.

### Beatbot

Current local files:

- `logos/beatbot-official-logo-prime-banner.webp`
- `products/beatbot-aquasense-2-ultra-official.png`
- `products/beatbot-aquasense-x-official.webp`
- `evidence/beatbot-aquasense-x-bundle-official.webp`

Gap assessment:

- Logo: missing. Prime Day banner image is rejected as master logo.
- People: founder/CEO portrait remains review-only.
- Products: AquaSense 2 Ultra approved for cover product layer; AquaSense X needs crop.
- Evidence: bundle image is body evidence only.
- Event/forum: missing.

Next action:

- Do not add the rejected Prime Day logo to any future logo workflow.
- Keep clean logo and verified people source as open sourcing tasks.

### Dreame

Current local files:

- `logos/dreame-official-logo-ellipse.png`
- `notes.md`

Manifest result:

- `dreame-official-logo-ellipse.png`: downloaded but rejected/replace.
- `dreame-x60-vs-x50-official.webp`: failed / replace.

Gap assessment:

- Logo: missing. Existing 48x48 compact mark is not usable.
- People: Yu Hao portrait remains review-only.
- Products: missing. Official Dreame homepage currently exposes product/category image URLs, including Matrix Series robot vacuum imagery.
- Evidence: missing.
- Event/forum: missing.

Next action:

- Add one official Dreame robot vacuum image URL to retry manifest as product evidence.
- Continue searching for a clean Dreame wordmark and product-only hero images.

### Roborock

Current local files:

- `products/roborock-saros-z70-official.png`
- `products/roborock-saros-10r-official.jpg`
- `evidence/roborock-product-lineup-official.jpg`

Gap assessment:

- Logo: missing. Global icon candidate is rejected because it is not the Roborock wordmark.
- People: Chang Jing remains review-only.
- Products: Saros Z70 is cover-ready; Saros 10R is body evidence only.
- Evidence: product lineup image is temporary/reference only.
- Event/forum: missing.

Next action:

- Search for official wordmark, newsroom/media kit, or trusted press kit source.
- Do not change Roborock article data units; user has confirmed they are intentional.

### Dyson

Current local files:

- `logos/dyson-official-logo.svg`
- `products/dyson-v16-piston-animal-official.png`

Gap assessment:

- Logo: approved official SVG.
- People: James Dyson portrait remains review-only.
- Products: missing. Existing V16 asset is rejected because it is text lockup, not a product photo.
- Evidence: missing.
- Event/forum: missing.

Next action:

- Find real official Dyson product photo from Dyson product page, press page, or official media source before adding to download manifest.
- Keep James Dyson portrait out of direct download until source and usage are confirmed.

### iRobot

Current local files:

- `notes.md` only.

Manifest result:

- `irobot-official-logo.svg`: failed / replace due 403.
- `irobot-roomba-max-705-official.png`: failed / replace due 403.
- `irobot-2026-homepage-banner-official.jpg`: failed / replace due 403.

Gap assessment:

- Logo: missing. Homepage exposes an official logo image URL with a new static hash, but direct download may still be blocked.
- People: Colin Angle remains review-only.
- Products: missing. Official homepage exposes Roomba Max 705 product image URL.
- Evidence: missing. Official homepage banner is useful as evidence only if downloaded or manually captured with clear source.
- Event/forum: missing.

Next action:

- Add current official iRobot logo/product/banner URLs to retry manifest.
- If curl still returns 403, record failure and use browser/manual capture only with clear source-page notes.

### SharkNinja

Current local files:

- `logos/shark-official-logo.svg`
- `logos/ninja-official-logo.svg`
- `logos/sharkninja-official-ir-logo-white.svg`
- `products/shark-powerdetect-cordless-official.png`
- `evidence/shark-powerdetect-duoclean-official.jpg`

Gap assessment:

- Logo: approved. Group IR SVG has technical note because it embeds PNG.
- People: Mark Barrocas remains review-only.
- Products: PowerDetect product image is body evidence only.
- Evidence: DuoClean feature evidence is body evidence only.
- Event/forum: missing.
- Market/data: revenue/category visuals still need to be generated from article data, not annual report screenshots.

Next action:

- Prioritize WCB-native revenue/category visuals from article figures.
- Do not use SharkNinja product evidence as cover hero without review.

## Download Manifest Recommendation

Create and run:

```text
assets/source-library/download-manifest-brand-assets-v1.tsv
```

Rules for this manifest:

- Official or trusted source only.
- No uncertain founder / CEO portraits.
- No rejected logo variants.
- Failed official URLs should stay documented rather than replaced with random third-party assets.

After download:

1. Review dimensions and visual content for each new file.
2. Mark product images as cover-ready, body-only, needs-crop, or reject in brand notes.
3. Keep all people assets in `asset-library-v1-candidate-review.md`.
4. Do not update website article images from this pass.

## Download Run - 2026-06-11

Command:

```text
./assets/source-library/download-assets.sh assets/source-library/download-manifest-brand-assets-v1.tsv
```

Result:

```text
Downloaded: 0
Skipped:    0
Failed:     9
```

Failure pattern:

| Brand | Files | Failure Type | Decision |
| --- | ---: | --- | --- |
| Aiper | 5 | local DNS could not resolve official CloudFront hosts | Keep official URLs in manifest for retry; do not replace with third-party images. |
| Dreame | 1 | local DNS could not resolve `www.dreametech.com` | Keep official URL in manifest for retry. |
| iRobot | 3 | local DNS could not resolve `www.irobot.com` | Keep official URLs in manifest for retry; if curl remains blocked later, use browser/manual capture only with clear source-page notes. |

No files were added to `assets/source-library/brands/` by this run.
