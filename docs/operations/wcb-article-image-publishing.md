# WCB Article Image Publishing Workflow

## Purpose

Every new or replacement article image must be prepared before it enters the website. The source library keeps the unchanged original; the preparation command creates and verifies the publish-ready desktop and mobile assets. Build commands only verify current state and never repair it.

## Source Asset Contract

Use the article slug as the exact source-folder name:

```text
/Users/youdenny/Desktop/WorldCleanBizAssets/{slug}/
```

Name files in article order:

```text
01-cover.png
02-semantic-name.png
03-semantic-name.jpg
```

The first file must be `01-cover` with a supported `.png`, `.jpg`, `.jpeg`, or `.webp` extension. Images `02+` are inserted in the same sequence as the article body. Keep names semantic and do not reuse a sequence number.

### Approved Generation Targets

- Cover: `1600 x 900`, exactly `16:9`.
- Body: long edge no greater than `1600`; use `16:9`, `4:3`, or the ratio required to keep a chart or text graphic legible.
- Do not enlarge a small source just to reach these dimensions.
- Do not put an already-compressed publish derivative back into the source library as a substitute for the original.

## Codex-Generated Visuals

1. Generate the visual using the approved composition and dimensions above.
2. Save the generated original unchanged in the exact slug folder.
3. Use `01-cover` for the cover and `02+` for body visuals.
4. Run preparation; do not copy the generated PNG or JPEG directly into `public`.

```bash
npm run prepare:article-images -- --slug ARTICLE-SLUG --dry-run
npm run prepare:article-images -- --slug ARTICLE-SLUG
```

## Denny-Provided Photos

Place every provided original unchanged in the same slug folder and give it the correct sequence name. Do not resize, rotate, recolour, strip metadata, or recompress the source-library copy manually.

Preparation automatically applies EXIF orientation, converts to sRGB, avoids enlargement, resizes within the approved limits, removes unnecessary metadata, creates desktop/mobile encodings when useful, and enforces per-image, per-article, and repository budgets.

```bash
npm run prepare:article-images -- --slug ARTICLE-SLUG --dry-run
npm run prepare:article-images -- --slug ARTICLE-SLUG
```

## Stop Conditions

If the exact source folder is missing, stop on:

```text
Visual Asset Folder Not Found: /Users/youdenny/Desktop/WorldCleanBizAssets/{slug}
```

If `01-cover` is missing, stop on:

```text
Missing required 01-cover source image.
```

Never search another folder, guess a replacement, or create a placeholder. Correct the source package and rerun the dry run.

If preparation reports `COVER_CROP_REVIEW_REQUIRED`, visually review the source and approve its framing before rerunning. Add one normalized focal point to the read-only source-side `image-config.json`:

```json
{
  "images": {
    "01-cover.jpg": {
      "kind": "photo",
      "focalPoint": { "x": 0.52, "y": 0.44 }
    }
  }
}
```

`x` and `y` run from `0` to `1`. An exact pixel `crop` may be supplied instead, but never provide both `crop` and `focalPoint`. Crop/focal settings are cover-only. Recheck people, products, text, logos, and other meaningful framing after preparation.

An explicit cover crop must itself be `16:9` within a strict `0.5%` ratio tolerance. Square and portrait crop rectangles stop with `COVER_CROP_RATIO_INVALID`; body-image ratios remain content-driven and are not forced to `16:9`.

For a body chart or text graphic, declare it instead of allowing photo treatment:

```json
{
  "images": {
    "03-market-chart.png": { "kind": "chart" }
  }
}
```

## New Article Sequence

1. Finalize the article slug and create the matching source folder.
2. Put unchanged originals in that folder as `01-cover` and ordered `02+` files.
3. In the MDX, use deterministic target URLs under `/images/articles/{slug}/`; keep image placement and order aligned with the source sequence.
4. Run a complete dry run and inspect the reported budget class, desktop/mobile totals, warnings, and planned file changes.
5. Resolve every crop, naming, missing-source, classification, or budget error. Then run preparation without `--dry-run`.
6. Run the read-only source/manifest verifier.
7. Run the production build. Its prebuild gate repeats source/manifest checks; its postbuild gate checks the generated article HTML.
8. Review the article on desktop and at `390px`, including cover framing, chart readability, responsive selection, and broken-image checks.

```bash
npm run prepare:article-images -- --slug ARTICLE-SLUG --dry-run
npm run prepare:article-images -- --slug ARTICLE-SLUG
npm run verify:article-images
npm run build
```

Do not publish merely because these checks pass. The existing GitHub, Vercel Preview, approval, and production-release rules still apply.

## Historical Maintenance

Historical maintenance is repository-primary: existing primary public URLs and file extensions remain fixed. First validate and plan the complete migration, then apply the same complete operation:

```bash
npm run prepare:article-images -- --all --dry-run
npm run prepare:article-images -- --all
npm run verify:article-images
npm run build
```

The external source library is validation-only during historical maintenance and remains unchanged. Do not recrop, replace, reorder, or rename historical primary assets through this workflow.

Ordinary maintenance is incremental. A current pipeline-owned primary is reused byte-for-byte only when its recorded output hash and processor version still match. Missing, new, or drifted assets continue through the normal planner; generated-state repair remains an explicit separate operation. Consecutive unchanged `--all --dry-run` commands must report zero creates, replacements, removals, and primary changes.

Every present external source file must have a hash-bound exact semantic binding or an explicit repository-primary disposition in the full audit manifest. A new, missing, changed, ambiguous, or unbound file blocks verification. Format conflicts and approved fallbacks remain visible dispositions and never authorize replacing a repository primary. The source library is read-only.

## `visual_archive` Budget Class

`visual_archive` is a strict exception for an explicitly allowlisted historical visual archive. It requires more than 50 unique body images and complete URL-plus-current-output-hash kind classification for all governed images. Its desktop limit remains `2,500,000` bytes and its mobile limit is `1,600,000` bytes.

It must not be used for a normal new article, ordinary deep article, or as a way to bypass optimization. Missing, unknown, or stale classifications block preparation and verification.

## Build Lifecycle

The mandatory lifecycle is intentionally read-only:

```text
prebuild  -> verify:content-classification + verify:article-images
build     -> next build
postbuild -> verify:built-article-images
```

No lifecycle script invokes `prepare:article-images`. If a build gate fails, return to the source folder, correct the input or approved configuration, run preparation explicitly, and rebuild.

Preparation atomically maintains two generated files:

- `article-image-manifest.json`: full server-side audit facts, hashes, article inventory, and external-source bindings/dispositions.
- `article-image-runtime.json`: compact URL-to-dimensions/mobile-candidate data used by rendering. It must stay at or below `350,000` bytes and must not contain source hashes, output hashes, budgets, article inventory, or external-source audit records.

The source verifier checks deterministic drift in both files. The runtime application imports only the compact index; the full audit manifest must not enter client or unrelated route chunks.

Before any repository write or backup, preparation calculates the candidate guarded-image total with all staged replacements and deletions. A total above `321,920,358` bytes stops before commit and leaves the tree unchanged. Every repository path component must be a real directory or file; internal and external symlinks are rejected rather than followed.
