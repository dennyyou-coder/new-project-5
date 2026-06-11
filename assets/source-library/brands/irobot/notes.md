# iRobot Asset Notes

Status: Pending user review

## Target Articles

- `content/insights/irobot-financial-crisis.mdx`
- `content/insights/irobot-exits-and-dji-enters.mdx`
- `content/insights/irobot-2018-annual-report-faithful-translation.mdx`

## Priority Assets

| Asset | Type | Suggested Use | Source | Review Notes |
|---|---|---|---|---|
| iRobot logo | Logo | Cover / evidence block | https://www.irobot.com/ | Use official logo |
| CEO / executive image | Person | Only if relevant and verified | iRobot official / investor relations | Confirm current role |
| Roomba product image | Product | Product / history evidence | iRobot official product pages | Use real Roomba image |
| SEC filing / annual report | Data verification source | Verify financial-crisis numbers used in article-generated charts | SEC EDGAR / iRobot investor relations | Use for verification and source labels; generate WCB-native visuals from article data |

## Suggested Image Set

1. Cover: iRobot logo + Roomba product + WCB-generated crisis data anchor.
2. Body: WCB-generated financial-crisis data card or timeline based on article data.
3. Body: Roomba product image.
4. Body: timeline of iRobot decline.

## Do Not Use

- AI-generated Roomba labeled as real.
- Fake financial document.
- Generic crisis illustration.

## Download Review - 2026-06-10

Status: No iRobot files downloaded in first manifest pass.

| Manifest Asset | Result | Decision | Notes |
|---|---|---|---|
| `logos/irobot-official-logo.svg` | failed | replace | Official URL returned 403. Need alternate official logo source or manual capture. |
| `products/irobot-roomba-max-705-official.png` | failed | replace | Official URL returned 403. Need accessible official product image. |
| `evidence/irobot-2026-homepage-banner-official.jpg` | failed | replace | Official URL returned 403. Use browser/manual capture only if source page and identity are clear. |

Next action: prioritize one verified Roomba product image and extract article data for WCB-generated crisis charts / timelines.

## Official Source Recovery - 2026-06-11

Status: official alternate source identified and partially downloaded locally.

Official source pages checked:

| Source Page | Result | Notes |
|---|---|---|
| `https://www.irobot.com/` | official homepage still exposes iRobot logo and Roomba Max 705 product context | Direct static URLs may be blocked by DNS/403 in local tooling. |
| `https://media.irobot.com/` | official iRobot Press Center / Media Kit found | Page states media-kit materials are provided for media use. |
| `https://media.irobot.com/media-kits?cat=5` | official company information media kit found | Contains `iRobot logos` media-kit item. |
| `https://media.irobot.com/media-kits?cat=4` | official home robots media kit found | Contains Roomba Max 705 Vac Robot + AutoEmpty Dock press materials. |
| `https://media.irobot.com/media-kits?item=17` | official iRobot logo media-kit page found | Contains iRobot print/web logo image candidates. |
| `https://media.irobot.com/media-kits?item=50` | official Roomba Max 705 Vac media-kit page found | Contains Roomba Max 705 press release and photo candidates. |

New rows added to `assets/source-library/download-manifest-brand-assets-v1.tsv`:

| Manifest Asset | Type | Decision | Notes |
|---|---|---|---|
| `logos/irobot-media-kit-logo-black-print.jpg` | Logo candidate | needs-source-check | Official Press Center image, but likely thumbnail-sized; verify resolution after download. |
| `logos/irobot-media-kit-logo-black-web.jpg` | Logo candidate | needs-source-check | Official Press Center image, but likely thumbnail-sized; verify resolution after download. |
| `products/irobot-roomba-max-705-media-kit-black.jpg` | Product candidate | needs-source-check | Official Press Center Roomba Max 705 press photo. |
| `products/irobot-roomba-max-705-media-kit-white.jpg` | Product candidate | needs-source-check | Official Press Center Roomba Max 705 press photo. |

Review note:

- Do not mark the media-kit logo candidates approved until downloaded dimensions are checked.
- Prefer media-kit product photos over homepage product thumbnails if download succeeds.
- Keep Colin Angle portrait review-only; no people asset was added to the download manifest.

Download Run - 2026-06-11:

| Local File | Type | Dimensions | Initial Decision | Notes |
|---|---|---:|---|---|
| `logos/irobot-media-kit-logo-black-print.jpg` | Logo candidate | 360x100 | needs review | Official Press Center source; usable as source evidence, but final logo quality depends on cleanup needs. |
| `logos/irobot-media-kit-logo-black-web.jpg` | Logo candidate | 175x100 | needs review / likely too small | Official Press Center source; likely reference-only unless no better logo is found. |
| `products/irobot-roomba-max-705-media-kit-black.jpg` | Product candidate | 2048x2048 | needs review | Official Press Center Roomba Max 705 photo; strong candidate for product layer after cleanup. |
| `products/irobot-roomba-max-705-media-kit-white.jpg` | Product candidate | 2048x2048 | needs review | Official Press Center Roomba Max 705 photo; strong candidate for product layer after cleanup. |

Failed in same run:

| Source | Result | Notes |
|---|---|---|
| `www.irobot.com` logo/product/banner static URLs | 403 | Keep as source references only; Press Center is now the preferred downloadable source. |
