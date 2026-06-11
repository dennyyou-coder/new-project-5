# Asset Source Recovery Plan - 2026-06-11

Purpose: recover first-batch brand assets that are blocked by local DNS, 403 responses, weak logo candidates, or identity uncertainty.

This plan is for source-library work only. Do not update website article images from these assets until a separate review pass approves them.

Current operating rule from 2026-06-11: download first, then clean, review, and classify in a later pass. Uncertain assets may be collected into the source library or raw/review queue, but they are not approved for website use until review.

## Recovery Order

| Priority | Workstream | Brands | Why |
| --- | --- | --- | --- |
| 1 | Official direct-download retry | Aiper, Dreame, iRobot | URLs are already official; current blocker is local DNS/403, not source quality. |
| 2 | Clean master logo sourcing | Aiper, Beatbot, Dreame, Roborock, iRobot | Logo gaps block brand matrices and Template A covers. |
| 3 | Product image replacement | Aiper, Dreame, Dyson, iRobot | Several product slots are missing or rejected. |
| 4 | People candidate verification | Maytronics, Aiper, Beatbot, Dreame, Roborock, Dyson, iRobot, SharkNinja | Portraits are useful but higher risk; keep review-only until identity/timing is verified. |
| 5 | Event / forum / exhibition evidence | Aiper first, then broader industry folders | Event images are useful evidence, but should not outrank logos/products. |
| 6 | WCB-native market/data visuals | SharkNinja, Roborock, iRobot, Aiper, Maytronics | Generate visuals from article data; use official filings only for verification. |

## Official Direct-Download Retry

Retry this manifest when network access is available:

```text
./assets/source-library/download-assets.sh assets/source-library/download-manifest-brand-assets-v1.tsv
```

Expected if successful:

| Brand | Target Files | Initial Use |
| --- | --- | --- |
| Aiper | Experts Duo, Scuba V3, CES/Piscina event images | product evidence, event evidence |
| Dreame | Matrix Series robot vacuum image | product evidence pending review |
| iRobot | current logo, Roomba Max 705, homepage banner | logo/product/evidence pending review |
| iRobot | Press Center logo and Roomba Max 705 media-kit photos | alternate official logo/product candidates pending review |

If the script fails again:

- Do not replace official URLs with generic third-party image search results.
- Record the failure in `asset-library-v1-gap-audit-2026-06-11.md`.
- Move the affected brand to the manual capture workflow below.

## Manual Capture Workflow

Use this only for official pages where direct image downloads fail but the page clearly displays the asset.

Allowed source pages:

```text
official company homepage
official product page
official press / newsroom page
official investor relations page
official media kit / brand kit page
official event page
```

Manual capture rules:

1. Save the image under `assets/source-library/brands/{brand}/raw/` first.
2. Use a filename that includes the source and date, for example:

```text
irobot-homepage-roomba-max-705-manual-2026-06-11.png
```

3. Add a note to the brand `notes.md` with:

```text
source page URL
capture date
asset identity
why direct download failed
review decision: needs-source-check
```

4. Move from `raw/` to `logos/`, `products/`, or `evidence/` only after visual review.
5. Never use a manual-captured person photo as a final portrait until identity and role timing are verified.

## Clean Logo Recovery Rules

Do not approve:

- activity banners
- promotional lockups
- social icons
- app icons
- favicon-sized marks
- cropped wordmarks
- white-only logos that require a dark background unless no better source exists

Brand-specific logo status:

| Brand | Current Status | Next Allowed Action |
| --- | --- | --- |
| Aiper | missing | Find official clean master logo or manually capture from official page into `raw/`. |
| Beatbot | Prime Day graphic rejected | Find official master wordmark; do not reuse the Prime Day banner. |
| Dreame | 48x48 compact mark rejected | Find clean Dreame wordmark from official site/media kit. |
| Roborock | global icon rejected | Find official Roborock wordmark, not globe/region icon. |
| iRobot | official static URL blocked | Retry current official URL or manual capture from official homepage/header. |
| SharkNinja | approved | No immediate action; keep technical note for group IR SVG embedding PNG. |
| Dyson | approved | No immediate action. |
| Maytronics | approved | No immediate action. |

## Product Image Recovery Rules

Approve product assets only if:

- brand and model identity are clear
- product is real and official
- image is not only a text lockup
- resolution is enough for body evidence or cover composition
- promotional effects do not obscure the product

Brand-specific product status:

| Brand | Current Status | Next Allowed Action |
| --- | --- | --- |
| Aiper | missing | Retry official Experts Duo / Scuba URLs; manual capture official product page if needed. |
| Beatbot | partial approved | Keep AquaSense 2 Ultra as cover product layer; crop AquaSense X carefully. |
| Dreame | missing | Recover official robot vacuum or wet-dry vacuum product image. |
| Roborock | partial approved | Saros Z70 cover-ready; search only for stronger evidence/logo. |
| Dyson | rejected V16 text lockup | Replace with a real official Dyson product photo. |
| iRobot | missing | Retry official Roomba Max 705; manual capture if official page blocks direct image download. |
| SharkNinja | body-only | Use PowerDetect assets as body evidence only unless a stronger product image is found. |

## Official Source Discovery - 2026-06-11

iRobot official Press Center / Media Kit is now the preferred alternate source for iRobot logo and Roomba product recovery.

Source pages:

```text
https://media.irobot.com/
https://media.irobot.com/media-kits?cat=5
https://media.irobot.com/media-kits?cat=4
https://media.irobot.com/media-kits?item=17
https://media.irobot.com/media-kits?item=50
```

Manifest additions:

```text
irobot-media-kit-logo-black-print.jpg
irobot-media-kit-logo-black-web.jpg
irobot-roomba-max-705-media-kit-black.jpg
irobot-roomba-max-705-media-kit-white.jpg
```

Review rule:

- The media-kit logo files are official but may be thumbnail-sized; approve only after dimensions are checked.
- The Roomba Max 705 media-kit photos are stronger product candidates than the homepage thumbnail if direct download succeeds.

Download result:

```text
Downloaded: 4
Skipped:    0
Failed:     9
```

Downloaded iRobot Press Center files:

| File | Dimensions | Initial Status |
| --- | ---: | --- |
| `brands/irobot/logos/irobot-media-kit-logo-black-print.jpg` | 360x100 | downloaded, needs review |
| `brands/irobot/logos/irobot-media-kit-logo-black-web.jpg` | 175x100 | downloaded, likely too small for final cover use, needs review |
| `brands/irobot/products/irobot-roomba-max-705-media-kit-black.jpg` | 2048x2048 | downloaded, product candidate for review |
| `brands/irobot/products/irobot-roomba-max-705-media-kit-white.jpg` | 2048x2048 | downloaded, product candidate for review |

Still failed:

| Brand | Count | Failure Pattern |
| --- | ---: | --- |
| Aiper | 5 | official CloudFront hosts connect timeout |
| Dreame | 1 | `www.dreametech.com` connect timeout |
| iRobot homepage/static | 3 | official `www.irobot.com` static URLs return 403 |

## People / Portrait Handling

People assets remain review-only.

Do not add founder / CEO portraits to direct-download manifests unless all are true:

- person identity is explicit on the source page
- current or historical role is clear
- source is official company, IR, press kit, official event, or credible business media
- page date or context is clear enough to avoid outdated-role misuse

Current people candidates stay in:

```text
assets/source-library/_review/asset-library-v1-candidate-review.md
```

## Review Output After Recovery

After any successful download or manual capture, update:

1. Brand `notes.md`
2. `asset-library-v1-candidate-review.md` for ambiguous logos, people, third-party or manual captures
3. `asset-review-index.md` for approved/rejected summary
4. `asset-library-v1-gap-audit-2026-06-11.md` if the gap status changes

Recommended post-download review labels:

```text
approved
body-only
needs-crop
needs-source-check
replace
reject
```

## Build Check

This plan does not touch website runtime code, but still run:

```text
npm run build
```

before committing any source-library file changes.
