# WCB Article Image Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mandatory, deterministic image-preparation and verification pipeline so every new or historical WCB article ships correctly sized responsive images within the approved per-image, per-article, and repository budgets.

**Architecture:** A set of small Node/Sharp modules will discover article references, transform source assets, generate a deterministic responsive-image manifest, and verify both source files and built HTML. Preparation is the only write path; `prebuild`, `postbuild`, CI, and Vercel remain read-only gates. New articles use standardized WebP output paths, while historical primary URLs and formats remain stable.

**Tech Stack:** Next.js 15 App Router, React 19, MDX, Node.js test runner, Sharp 0.34.5, TypeScript/JavaScript modules, GitHub, Vercel Preview.

## Global Constraints

- Work in the isolated worktree `/Users/youdenny/Documents/Codex项目/New project 5/.worktrees/wcb-seo-performance-fixes` on branch `codex/wcb-article-image-pipeline`.
- Before final verification, fetch `origin/main`, integrate new upstream commits, and reassess the diff. Preserve unrelated user changes.
- Do not rewrite article copy, title, slug, metadata, CTA, FAQ, JSON-LD, image order, or narrative intent.
- Never modify files in `/Users/youdenny/Desktop/WorldCleanBizAssets`; they are immutable source assets.
- Only preparation commands may write image assets or the manifest. Build and verification commands must be read-only and fail on drift.
- Never enlarge an input. Correct EXIF orientation, convert to sRGB, and strip unnecessary metadata.
- New articles use `public/images/articles/{slug}/`; historical primary URLs and extensions remain unchanged.
- A historical article without a source asset folder may receive only same-path, same-format mechanical optimization plus an optional WebP mobile variant. It may not be recropped or visually replaced.
- Preserve small text, line art, transparency, people, products, and meaningful framing. Stop with an actionable error when the minimum safe quality cannot meet the budget.
- Do not push, open a pull request, merge, or deploy until the implementation has been separately authorized. Production always requires a new explicit approval for this global feature.

---

### Task 1: Lock the budget, inventory, and deterministic manifest contracts

**Files:**
- Create: `scripts/article-images/config.mjs`
- Create: `scripts/article-images/references.mjs`
- Create: `scripts/article-images/manifest.mjs`
- Create: `tests/articleImagePipeline.test.mjs`
- Create: `tests/fixtures/article-images/content/blog/pipeline-example.mdx`
- Create: `tests/fixtures/article-images/public/images/articles/pipeline-example/01-cover.webp`
- Create: `tests/fixtures/article-images/public/images/articles/pipeline-example/02-product.webp`

**Interfaces:**
- Export from `config.mjs`: `IMAGE_BUDGETS`, `ARTICLE_BUDGETS`, `ARTICLE_IMAGE_BASELINE_BYTES`, `ARTICLE_IMAGE_LIMIT_BYTES`, `MOBILE_MIN_SAVINGS_BYTES`, `MOBILE_MIN_SAVINGS_RATIO`.
- Export from `references.mjs`: `discoverArticleInventory({ contentRoot, publicRoot })`.
- Export from `manifest.mjs`: `buildManifest({ inventory, processedAssets, processorVersion })` and `serializeManifest(manifest)`.
- Manifest asset keys are public URLs; article keys are slugs. Do not store timestamps.

- [ ] **Step 1: Write failing tests for the approved constants**

  Assert the exact decimal-byte limits:

  ```js
  assert.deepEqual(IMAGE_BUDGETS, {
    cover: { desktop: 300_000, mobile: 120_000 },
    body: { desktop: 220_000, mobile: 100_000 },
    chart: { desktop: 300_000, mobile: 140_000 },
    transparent: 150_000,
  });
  assert.deepEqual(ARTICLE_BUDGETS, {
    standard: { desktop: 1_500_000, mobile: 750_000 },
    deep: { desktop: 2_500_000, mobile: 1_200_000 },
  });
  assert.equal(ARTICLE_IMAGE_BASELINE_BYTES, 292_654_871);
  assert.equal(ARTICLE_IMAGE_LIMIT_BYTES, 321_920_358);
  assert.equal(MOBILE_MIN_SAVINGS_BYTES, 20_000);
  assert.equal(MOBILE_MIN_SAVINGS_RATIO, 0.25);
  ```

- [ ] **Step 2: Write failing inventory tests using a real MDX-shaped fixture**

  Cover frontmatter cover/social paths, Markdown images, HTML `<img>` tags, duplicate references, body order, external URLs, and query/hash suffixes. Require one normalized entry per local public URL and retain article order separately.

  Deep-budget eligibility must require more than eight body images and an explicit `image_budget: deep` frontmatter value. Neither condition alone unlocks the larger budget.

- [ ] **Step 3: Write failing deterministic-manifest tests**

  Require stable lexical key ordering, stable pretty JSON, a trailing newline, normalized SHA-256 strings, and no `generatedAt`, filesystem path, or machine-specific field. Running serialization twice with identical input must produce byte-identical output.

  The required shape is:

  ```json
  {
    "version": 1,
    "processorVersion": "1",
    "assets": {
      "/images/articles/pipeline-example/01-cover.webp": {
        "role": "cover",
        "kind": "photo",
        "width": 1600,
        "height": 900,
        "bytes": 245000,
        "format": "webp",
        "quality": 82,
        "sourceHash": "sha256:source",
        "outputHash": "sha256:desktop",
        "mobile": {
          "src": "/images/articles/pipeline-example/01-cover-800.webp",
          "width": 800,
          "height": 450,
          "bytes": 93000,
          "outputHash": "sha256:mobile"
        }
      }
    },
    "articles": {
      "pipeline-example": {
        "budgetClass": "standard",
        "cover": "/images/articles/pipeline-example/01-cover.webp",
        "body": [
          "/images/articles/pipeline-example/02-product.webp"
        ]
      }
    }
  }
  ```

- [ ] **Step 4: Run the focused test and verify RED**

  Run:

  ```bash
  node --test tests/articleImagePipeline.test.mjs
  ```

  Expected: FAIL because the config, inventory, and manifest modules do not exist.

- [ ] **Step 5: Implement the smallest contract modules**

  Add the exact constants, discover production article MDX without importing application runtime code, normalize only local `/images/` references, classify cover versus ordered body images, and serialize a deterministic manifest. Make invalid slugs, missing files, duplicated conflicting roles, and unknown budget classes produce article-and-file-specific messages.

- [ ] **Step 6: Run the focused test and verify GREEN**

  Run the focused test again, then run:

  ```bash
  git diff --check
  ```

  Expected: zero failures and no whitespace errors.

- [ ] **Step 7: Commit the contract slice**

  ```bash
  git add scripts/article-images tests/articleImagePipeline.test.mjs tests/fixtures/article-images
  git commit -m "Test article image pipeline contracts"
  ```

---

### Task 2: Implement safe, adaptive Sharp transformations

**Files:**
- Create: `scripts/article-images/transform.mjs`
- Create: `tests/articleImageTransform.test.mjs`
- Create mechanically through a test fixture generator: temporary raster fixtures under the operating-system temp directory
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Export: `inspectSource(path)`, `createDesktopVariant(options)`, `createMobileVariant(options)`, `shouldKeepMobileVariant(options)`, `transformAsset(options)`.
- `transformAsset` returns buffers and metadata; it must not decide destination paths or mutate repository files.
- Roles: `cover`, `body`, `chart`, `transparent`. Kinds: `photo`, `graphic`, `transparent`.

- [ ] **Step 1: Add Sharp as an explicit development dependency**

  Install the exact version already compatible with the lockfile/runtime:

  ```bash
  npm install --save-dev --save-exact sharp@0.34.5
  ```

  Confirm `package.json` names Sharp directly rather than relying on Next.js's transitive dependency.

- [ ] **Step 2: Write failing metadata and resize tests**

  Generate tiny deterministic JPEG, PNG, and WebP fixtures during the test. Cover:

  - EXIF orientation is applied;
  - output colour space is sRGB;
  - long edge is at most 1600 desktop and 800 mobile;
  - an input below either maximum is not enlarged;
  - aspect ratio is preserved unless an explicitly approved cover crop is supplied;
  - metadata is not copied to the publish output;
  - alpha remains intact for transparent graphics.

- [ ] **Step 3: Write failing adaptive-quality and budget tests**

  Test a deterministic attempt ladder. For photographic desktop output use WebP quality 84, 80, 76, then 72, reducing the long edge from 1600 to 1440 and finally 1280 only when earlier safe attempts exceed the role budget. For mobile use quality 82, 78, 74, then 72 at 800 or 720 px. Never accept quality below 72.

  For charts, first use high-quality WebP; allow optimized PNG when WebP makes text/line output larger or loses alpha. If all safe candidates exceed the correct chart budget, return a structured failure containing slug, filename, actual bytes, limit, and recommended manual action.

- [ ] **Step 4: Write failing mobile-retention tests**

  Keep a mobile file only when it saves at least 20,000 bytes **or** 25% compared with the primary file. Delete/discard the candidate otherwise and make the manifest omit `mobile`.

  ```js
  assert.equal(shouldKeepMobileVariant({ desktopBytes: 100_000, mobileBytes: 79_999 }), true);
  assert.equal(shouldKeepMobileVariant({ desktopBytes: 100_000, mobileBytes: 75_000 }), true);
  assert.equal(shouldKeepMobileVariant({ desktopBytes: 100_000, mobileBytes: 80_000 }), true);
  assert.equal(shouldKeepMobileVariant({ desktopBytes: 100_000, mobileBytes: 80_001 }), false);
  ```

- [ ] **Step 5: Run the transform tests and verify RED**

  ```bash
  node --test tests/articleImageTransform.test.mjs
  ```

  Expected: FAIL because `transform.mjs` is absent.

- [ ] **Step 6: Implement transformations without repository writes**

  Use `sharp(input).autoOrient().toColourspace('srgb')`, `resize({ fit: 'inside', withoutEnlargement: true })`, and explicit encoders. Return source/output hashes, dimensions, format, bytes, chosen quality, warnings, and buffers. Do not copy EXIF/IPTC metadata.

  Cover cropping must require explicit crop coordinates or an approved focal point. If neither exists and the source ratio differs materially from 16:9, return `COVER_CROP_REVIEW_REQUIRED` rather than guessing.

- [ ] **Step 7: Run tests and inspect representative output pixels**

  Run:

  ```bash
  node --test tests/articleImageTransform.test.mjs
  ```

  Then write representative test outputs to `/private/tmp/wcb-article-image-transform-review/` and visually inspect one rotated photo, one low-resolution photo, one transparent graphic, and one text chart at original zoom. The review directory is temporary and must not be committed.

- [ ] **Step 8: Commit the transformation slice**

  ```bash
  git add package.json package-lock.json scripts/article-images/transform.mjs tests/articleImageTransform.test.mjs
  git commit -m "Add adaptive article image transforms"
  ```

---

### Task 3: Build atomic single-article preparation and its CLI

**Files:**
- Create: `scripts/article-images/prepare.mjs`
- Create: `scripts/prepare-article-images.mjs`
- Create: `tests/articleImagePrepare.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Export: `prepareArticleImages(options)` and `prepareAllArticleImages(options)`.
- CLI: `npm run prepare:article-images -- --slug <slug> [--dry-run]` and `npm run prepare:article-images -- --all [--dry-run]`.
- New-article source root defaults to `/Users/youdenny/Desktop/WorldCleanBizAssets/{slug}/` and may be overridden only in tests.
- Optional source-side `image-config.json` may declare `kind: "chart"` or an approved cover crop/focal point. Transparency is detected from image metadata; every undeclared non-transparent body image defaults to `photo`. The sidecar is read-only and is not copied into `public`.

- [ ] **Step 1: Write failing validation tests**

  Test rejection of path traversal, an unknown slug, simultaneous `--slug` and `--all`, missing source folder, missing `01-cover`, duplicate normalized filenames, a changed source hash targeting an existing output path, and a referenced source asset that has no deterministic output mapping.

  The missing-folder message must begin with the established text `Visual Asset Folder Not Found` and include the exact expected folder.

- [ ] **Step 2: Write failing atomicity tests**

  Use an isolated temporary project fixture. Make the second image fail budget/crop validation and prove that no publish image, MDX path, or manifest file changes. On success, prove all staged outputs, MDX reference updates, and manifest replacement become visible together.

- [ ] **Step 3: Write failing new-article naming and role tests**

  Require:

  - `01-cover.*` becomes `/images/articles/{slug}/01-cover.webp`;
  - `02-*` and later files keep a sanitized semantic stem and sequence;
  - optional variants append `-800.webp` before the extension;
  - original files remain untouched;
  - `01-cover.webp` becomes cover, directory thumbnail, and default social image without rewriting unrelated frontmatter;
  - body references are distributed exactly where the source MDX already places them; preparation does not invent placement.

  Test `image-config.json` with this deterministic shape:

  ```json
  {
    "images": {
      "01-cover.png": { "kind": "photo", "focalPoint": { "x": 0.52, "y": 0.44 } },
      "03-market-chart.png": { "kind": "chart" }
    }
  }
  ```

  Coordinates are normalized from 0 through 1. Reject unknown filenames, out-of-range coordinates, conflicting crop/focal-point declarations, and unsupported kinds.

- [ ] **Step 4: Write failing dry-run and report tests**

  `--dry-run` must perform the complete transform and verification in a temporary staging directory while changing no repository file. Its JSON-compatible result reports source bytes, desktop bytes, mobile bytes, files created, files replaced, files removed, net repository bytes, warnings, and budget class.

- [ ] **Step 5: Run preparation tests and verify RED**

  ```bash
  node --test tests/articleImagePrepare.test.mjs
  ```

- [ ] **Step 6: Implement a two-phase staged commit**

  Phase one validates all inputs, transforms every asset into a unique temp directory, computes the full candidate manifest, validates article budgets, and checks destination collisions. Phase two writes new files, updates only exact image/frontmatter paths in the target MDX, atomically replaces the manifest, then removes only superseded Git-recoverable publish files.

  If any phase-two write fails, restore backed-up repository files before returning a failure. Never delete or edit source-library files.

- [ ] **Step 7: Implement readable CLI output and exit codes**

  Successful output lists the slug, budget class, desktop/mobile totals, savings, file count, and manifest change. Failure output lists the slug, image name, observed value, permitted value, and one concrete next action. Use exit code 1 for validation/budget failures and 2 for invocation errors.

- [ ] **Step 8: Run focused tests and a real single-article dry run**

  Run the focused test, then choose a real article whose asset folder exists and run:

  ```bash
  npm run prepare:article-images -- --slug aiper-fluidra-pool-robotics-alliance --dry-run
  ```

  First confirm the exact asset folder for `aiper-fluidra-pool-robotics-alliance` exists. If it does not, stop the real dry-run and report `Visual Asset Folder Not Found`; do not substitute or search another folder.

- [ ] **Step 9: Commit the preparation slice**

  ```bash
  git add package.json scripts/article-images/prepare.mjs scripts/prepare-article-images.mjs tests/articleImagePrepare.test.mjs
  git commit -m "Add atomic article image preparation"
  ```

---

### Task 4: Replace the legacy dimension map with responsive manifest rendering

**Files:**
- Create: `lib/generated/article-image-manifest.json`
- Create: `lib/articleImages.ts`
- Create: `tests/articleImageRendering.test.mjs`
- Modify: `lib/content.ts`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/page.tsx`
- Modify: `app/blog/series/[series]/page.tsx`
- Modify: `components/ArticleCard.tsx`
- Modify: `components/BlogLanding.tsx`
- Modify: `components/ContentDirectory.tsx`
- Modify: `components/DirectorySidebar.tsx`
- Modify: `components/DirectorySeriesFeature.tsx`
- Modify: `components/GuideCard.tsx`
- Modify: `components/HomeSeriesFeature.tsx`
- Modify: `components/SourcingProductPage.tsx`
- Modify: `components/CommercialCleaningLanding.tsx`
- Modify: `components/FloorWasherLanding.tsx`
- Modify: `components/PoolRobotLanding.tsx`
- Modify: `components/RobotVacuumLanding.tsx`
- Modify: `components/VacuumCleanerLanding.tsx`
- Modify: `components/brands/BrandArticles.tsx`
- Delete after parity is proven: `lib/generated/image-dimensions.json`
- Delete after parity is proven: `scripts/generate-image-dimensions.mjs`
- Modify: `package.json`

**Interfaces:**
- Export from `lib/articleImages.ts`: `getArticleImage(url)`, `responsiveImageProps(url, context)`, and `responsiveImageAttributes(url, context)`.
- `context` is `cover`, `body`, or `card`; it determines `sizes`, loading, fetch priority, and decoding but not editorial content.
- Unknown local article-image URLs throw during build instead of guessing dimensions.

- [ ] **Step 1: Locate every consumer of the old dimension map**

  Run:

  ```bash
  rg -n "image-dimensions|imageDimensions|getImageDimensions|loading=|fetchPriority|priority" app components lib tests package.json
  ```

  Record all consumers in the implementation notes. Do not remove the old map until each production consumer has a tested replacement.

- [ ] **Step 2: Write failing helper tests**

  Given manifest entries with and without a mobile asset, require:

  ```ts
  responsiveImageProps('/images/articles/example/01-cover.webp', 'cover')
  // width/height from manifest, eager, fetchPriority high,
  // desktop src fallback, mobile+desktop srcSet, cover sizes

  responsiveImageAttributes('/images/articles/example/02-product.webp', 'body')
  // width/height, lazy, decoding async, body sizes
  ```

  When no mobile entry exists, omit `srcSet` and reuse `src`. External images retain safe current behavior. A local article image absent from the manifest must throw an error containing its public URL.

- [ ] **Step 3: Write failing rendered-markup tests**

  Render representative cover, Markdown body image, raw HTML body image, article card, and OpenGraph metadata. Assert:

  - exact intrinsic width and height;
  - only the article cover is eager/high priority;
  - body and card images are lazy and asynchronously decoded;
  - `srcset` contains mobile and primary candidates when available;
  - `sizes` matches the visual context;
  - OpenGraph uses the primary cover URL, never `-800`;
  - alt text and article copy are unchanged.

- [ ] **Step 4: Run rendering tests and verify RED**

  ```bash
  node --test tests/articleImageRendering.test.mjs
  ```

- [ ] **Step 5: Implement the manifest helper and integrate article rendering**

  Keep the primary URL as `src`. For body HTML, return standards-compliant lowercase `srcset` and `sizes` attributes through the MDX/HTML transformation path. For React components, return `srcSet`, `sizes`, `width`, `height`, `loading`, `decoding`, and `fetchPriority` props.

  Suggested sizes:

  - cover: `(max-width: 800px) 100vw, 1200px`;
  - body: `(max-width: 800px) calc(100vw - 32px), 900px`;
  - card: `(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 380px`.

  Preserve the current article renderer's sanitization and lazy-loading behavior. Change only image attributes and manifest lookup.

- [ ] **Step 6: Prove old/new dimension parity before cleanup**

  Generate the candidate article manifest, compare every old dimension-map key still referenced by production content with the new manifest, and require identical intrinsic width/height. Investigate mismatches rather than silently accepting them.

  Only after the comparison passes, delete the old JSON and generator and remove their package-script hooks/imports.

- [ ] **Step 7: Run focused and adjacent tests**

  ```bash
  node --test tests/articleImagePipeline.test.mjs tests/articleImageRendering.test.mjs
  npm run test:seo-audit
  npm run test:asset-performance
  ```

  Expected: no missing manifest entries, no changed article text, and no regression in the existing asset audit.

- [ ] **Step 8: Commit the rendering slice**

  ```bash
  git add app components lib scripts/generate-image-dimensions.mjs package.json tests/articleImageRendering.test.mjs
  git commit -m "Render responsive article images from manifest"
  ```

---

### Task 5: Add source, budget, repository, and built-output verification gates

**Files:**
- Create: `scripts/article-images/verify.mjs`
- Create: `scripts/verify-article-images.mjs`
- Create: `scripts/verify-built-article-images.mjs`
- Create: `tests/articleImageBudgets.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Export: `verifyArticleImages(options)`, `verifyArticleBudget(article, assets)`, `verifyRepositoryBudget(options)`, `verifyManifestFiles(options)`.
- CLI: `npm run verify:article-images` and `npm run verify:built-article-images`.
- Both commands are read-only and return nonzero on any blocking finding.

- [ ] **Step 1: Write failing per-file and per-article budget tests**

  Cover every approved role and both viewport totals. Calculate desktop as the primary file selected for each unique article image. Calculate mobile as its mobile entry when present, otherwise the primary file. Count each unique URL once per article even if content repeats it.

  Reject a deep budget unless `image_budget: deep` is explicit and the article has more than eight body images. Include exact actual and allowed bytes in every error.

- [ ] **Step 2: Write failing manifest-integrity tests**

  Verify real publish-file existence, format, byte count, dimensions, output hash, mobile pointer, article inventory, role, and deterministic serialization. Test stale bytes, stale dimensions, changed output content, orphaned manifest assets, referenced-but-unregistered local article images, and missing mobile files.

  `sourceHash` is recalculated against `WorldCleanBizAssets` during local preparation or verification only when that exact source folder is available. CI/Vercel, which intentionally does not contain the external source library, validates the field's format and the output hash but must not fail merely because the external library is absent. It must still fail if a present source file no longer matches its recorded hash.

- [ ] **Step 3: Write failing repository-growth tests**

  Sum files under exactly:

  - `public/images/articles`;
  - `public/images/blog`;
  - `public/images/insights`.

  Assert the total is at most `321_920_358` bytes. Report the current total, baseline `292_654_871`, allowed growth, and the ten largest new/changed files. Symlinks and files resolving outside `public` must fail.

- [ ] **Step 4: Write failing built-HTML tests**

  Parse `.next/server/app/blog/**/index.html` or the actual Next.js 15 output discovered after build. For each article page assert:

  - all local article images have width and height;
  - exactly one article content image is eager or `fetchpriority="high"`;
  - all other article content images are lazy;
  - responsive assets expose correct `srcset`/`sizes`;
  - `src`, every `srcset` candidate, and OpenGraph image resolve under `public`;
  - canonical and OpenGraph primary image still use the desktop URL.

  Scope the eager check to article content so global header assets cannot create false failures.

- [ ] **Step 5: Run the tests and verify RED**

  ```bash
  node --test tests/articleImageBudgets.test.mjs
  ```

- [ ] **Step 6: Implement pure verification with actionable reporting**

  The verifier may read files and compute hashes but may not create directories, rewrite images, refresh the manifest, or touch timestamps. Sort failures by slug then URL so CI output is stable. Print warnings separately and include a concise pass summary when successful.

- [ ] **Step 7: Generate the initial manifest through preparation, then verify GREEN**

  Use the preparation command, not the verifier, to create the initial manifest. Then run:

  ```bash
  npm run verify:article-images
  node --test tests/articleImageBudgets.test.mjs
  ```

  If current historical pages exceed approved article budgets, keep the verifier strict and resolve them in Task 6; do not weaken constants to obtain GREEN prematurely.

- [ ] **Step 8: Build once and validate the built verifier**

  ```bash
  npm run build
  npm run verify:built-article-images
  ```

  Expected after implementation and migration: zero blocking findings. If the output layout differs from the assumed path, update discovery to the real stable build structure and test it.

- [ ] **Step 9: Commit the verification slice**

  ```bash
  git add package.json scripts/article-images/verify.mjs scripts/verify-article-images.mjs scripts/verify-built-article-images.mjs tests/articleImageBudgets.test.mjs
  git commit -m "Enforce article image budgets"
  ```

---

### Task 6: Migrate historical articles without changing their public primary URLs

**Files:**
- Modify mechanically: referenced article assets under `public/images/articles/`, `public/images/blog/`, and `public/images/insights/`
- Create mechanically: profitable historical `-800.webp` variants beside their primary images
- Modify mechanically: `lib/generated/article-image-manifest.json`
- Modify only when required for image inventory/budget classification: article frontmatter under the existing content directories
- Create: `docs/operations/wcb-article-image-migration-report.md`

**Interfaces:**
- `npm run prepare:article-images -- --all --dry-run` produces the complete candidate report without changing the repository.
- `npm run prepare:article-images -- --all` applies only deterministic, verified changes.

- [ ] **Step 1: Capture an exact pre-migration baseline**

  Record file counts and bytes for the three guarded directories, the largest 30 referenced images, per-article desktop/mobile totals, and all over-budget articles. Confirm the baseline calculation reproduces `292_654_871` bytes and 2,166 files before using the 110% ceiling.

  If the checked-out upstream has legitimately changed that total, stop and document the delta. Do not silently replace the approved baseline.

- [ ] **Step 2: Run a complete dry run into temporary staging**

  ```bash
  npm run prepare:article-images -- --all --dry-run
  ```

  The dry run must keep historical primary paths and extensions, optimize JPEG as JPEG, PNG as PNG, and WebP as WebP. It may propose WebP only for additional mobile variants. List skipped files with a reason.

- [ ] **Step 3: Review representative categories before bulk application**

  Inspect at original zoom and 390px-equivalent width:

  - one ordinary photograph;
  - one phone/EXIF photograph;
  - one transparent logo/graphic;
  - one chart with small text;
  - the homepage's linked article cover;
  - a Sourcing page's article-related images;
  - the image-heaviest long article.

  Reject visible halos, unreadable labels, colour shifts, unintended crop, or softness that changes meaning. Adjust only the transform rule responsible, then rerun its focused test and the dry run.

- [ ] **Step 4: Apply the historical migration once**

  ```bash
  npm run prepare:article-images -- --all
  ```

  Do not rerun a successful migration without an input or rule change. Preserve Git-recoverable primary files in place; remove only obsolete publish variants after reference and manifest checks pass.

- [ ] **Step 5: Verify the mechanical diff**

  Confirm:

  - no primary public URL or extension changed;
  - no article copy, image order, title, slug, metadata, CTA, FAQ, or JSON-LD changed;
  - no source-library file changed;
  - all mobile variants meet the minimum savings threshold;
  - the guarded repository total is at or below `321_920_358` bytes;
  - all articles pass their selected desktop/mobile budgets.

- [ ] **Step 6: Write the migration report**

  Record exact before/after bytes, desktop/mobile transfer estimates, file counts, number of variants retained/skipped, articles that required deep-budget classification, and any warnings that need editorial review. Do not include machine-specific temp paths.

- [ ] **Step 7: Run asset and budget gates**

  ```bash
  npm run verify:article-images
  npm run test:asset-performance
  node --test tests/articleImagePipeline.test.mjs tests/articleImageTransform.test.mjs tests/articleImagePrepare.test.mjs tests/articleImageBudgets.test.mjs
  git diff --check
  ```

- [ ] **Step 8: Commit the historical migration separately**

  ```bash
  git add public/images/articles public/images/blog public/images/insights lib/generated/article-image-manifest.json docs/operations/wcb-article-image-migration-report.md
  git commit -m "Optimize historical article images"
  ```

---

### Task 7: Make the pipeline mandatory for future article publishing

**Files:**
- Modify: `package.json`
- Modify: `AGENTS.md`
- Create: `docs/operations/wcb-article-image-publishing.md`
- Modify: the repository's GitHub workflow files under `.github/workflows/` only if they do not already run `npm run build`
- Modify: `tests/articleImagePipeline.test.mjs`

**Interfaces:**
- `prebuild` runs read-only `verify:content-classification` and `verify:article-images` before `next build`.
- `postbuild` runs read-only `verify:built-article-images`.
- No build lifecycle script calls `prepare:article-images`.

- [ ] **Step 1: Write failing lifecycle-contract tests**

  Parse `package.json` and assert:

  - `prepare:article-images` exists and is not referenced from `prebuild`, `build`, or `postbuild`;
  - `prebuild` includes article-image source/manifest verification;
  - `build` remains `next build`;
  - `postbuild` includes built-HTML image verification;
  - the regular CI/Vercel build path therefore blocks stale, missing, or oversized assets.

- [ ] **Step 2: Run the lifecycle test and verify RED**

  ```bash
  node --test tests/articleImagePipeline.test.mjs
  ```

- [ ] **Step 3: Wire package scripts without duplicate work**

  Compose existing checks rather than deleting them. Keep any current content-classification gate, remove the legacy dimension-generator write from `prebuild`, add the read-only image verifier once, and run built verification once in `postbuild`.

  Do not run the same image transformation or full test suite twice during one unchanged build.

- [ ] **Step 4: Document the human and Codex publishing workflow**

  `docs/operations/wcb-article-image-publishing.md` must include copyable commands and these cases:

  1. Codex-generated visuals: generate at approved composition, save originals to `WorldCleanBizAssets/{slug}`, then prepare.
  2. Denny-provided photos: place originals unchanged in the same slug folder; preparation handles orientation, sRGB, resize, metadata removal, desktop/mobile encoding, and budget checks.
  3. Missing asset folder or cover: stop with `Visual Asset Folder Not Found` or the exact cover error; never guess another folder or create a placeholder.
  4. Crop review: explain how to provide an approved focal point/crop before rerunning.
  5. New article: prepare, inspect report, verify, build, and review desktop/390px.
  6. Historical maintenance: use `--all --dry-run` before `--all`; primary URLs remain fixed.

  State the approved generation targets: cover 1600×900 at 16:9; body image long edge at most 1600 with 16:9, 4:3, or content-required chart ratio.

- [ ] **Step 5: Update repository agent instructions**

  Add a concise mandatory rule to `AGENTS.md`: every generated or user-provided article image must enter through `prepare:article-images`; originals stay in the asset library; no raw large PNG/JPEG may be copied directly into `public`; build verification cannot auto-fix failures.

  Preserve all existing Visual OS, Buyer Guide, and production-release rules. Do not broaden authorization to publish.

- [ ] **Step 6: Confirm the GitHub/Vercel path exercises the gate**

  Inspect existing workflow and Vercel build settings available in the repository. If both use `npm run build`, no workflow change is needed. If a workflow bypasses it, make the smallest change so pull requests execute `npm run build` and surface the same failure.

- [ ] **Step 7: Run lifecycle and documentation checks**

  ```bash
  node --test tests/articleImagePipeline.test.mjs
  npm run verify:article-images
  git diff --check
  ```

- [ ] **Step 8: Commit the mandatory-workflow slice**

  ```bash
  git add package.json AGENTS.md docs/operations/wcb-article-image-publishing.md tests/articleImagePipeline.test.mjs .github/workflows
  git commit -m "Require article image preparation before build"
  ```

---

### Task 8: Run full regression, production build, and responsive browser QA

**Files:**
- Modify only when a verified regression exists: the smallest affected implementation or test file
- Update with final measured results: `docs/operations/wcb-article-image-migration-report.md`

**Interfaces:**
- Consumes the final source tree after upstream integration.
- Produces fresh, non-duplicated verification evidence and a review-ready local branch.

- [ ] **Step 1: Refresh and integrate the authoritative base**

  Check worktree cleanliness, then fetch `origin/main`. Inspect commits since the branch point. Integrate upstream without overwriting unrelated changes and classify conflicts before resolving them.

  If upstream changes image rendering, content loaders, package scripts, article assets, or manifests, rerun the affected focused tests and regenerate only outputs whose inputs changed.

- [ ] **Step 2: Review the final scope before expensive checks**

  Run `git diff --stat origin/main...HEAD`, `git diff --name-status origin/main...HEAD`, and inspect text diffs. The final scope may contain pipeline code, manifest, optimized/variant article images, pipeline tests, workflow wiring, and documentation. Stop if unrelated site changes appear.

- [ ] **Step 3: Run the complete Node test suite once**

  ```bash
  node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --import ./tests/register-path-alias.mjs --test tests/*.test.mjs
  ```

  Expected: zero failures. Diagnose any failure before changing code; do not weaken assertions merely to pass.

- [ ] **Step 4: Run focused repository gates**

  ```bash
  npm run verify:content-classification
  npm run test:seo-audit
  npm run test:asset-performance
  npm run verify:article-images
  git diff --check
  ```

- [ ] **Step 5: Run one clean production build**

  ```bash
  npm run build
  ```

  The lifecycle must run source verification before Next.js and built-HTML verification afterward. Confirm all expected article pages generate and no build step rewrites tracked files.

- [ ] **Step 6: Verify representative routes at desktop and 390px**

  Start the production server and inspect at least:

  - `/`;
  - `/blog`;
  - one ordinary article;
  - one article with a mobile variant;
  - the image-heaviest long article;
  - one Sourcing page linking article images.

  At desktop and 390px confirm HTTP 200, one H1, one main landmark, correct cover framing, readable charts, no layout shift from missing dimensions, only one eager article image, lazy body images, responsive candidate selection, canonical URL, and primary OpenGraph image.

- [ ] **Step 7: Measure transfer and repository outcomes**

  Record exact final values for homepage local article imagery, the representative Robot Vacuum Sourcing page, ordinary article desktop/mobile totals, deep article desktop/mobile totals, guarded repository bytes/files, and net change from baseline. Add these values to the migration report.

- [ ] **Step 8: Perform completion verification**

  Invoke `superpowers:verification-before-completion`, supply the fresh commands/results, confirm `git status --short`, and review all commits relative to `origin/main`. Do not claim completion if any required gate lacks fresh evidence.

---

### Task 9: Prepare Preview handoff; keep production behind explicit approval

**Files:**
- No planned source changes

**Interfaces:**
- GitHub feature branch and pull request created only after the user authorizes implementation/release preparation.
- Git-triggered Vercel Preview is the deployment gate. Direct `vercel --prod` is prohibited.

- [ ] **Step 1: Present the completed local implementation for approval to publish a branch**

  Report changed file groups, exact before/after image metrics, test/build evidence, representative browser results, and known warnings. Explicitly state that nothing is on production.

- [ ] **Step 2: Push the feature branch after authorization**

  Push `codex/wcb-article-image-pipeline` without force and create one ready-for-review pull request. The pull request must summarize the mandatory workflow, historical URL preservation, budgets, repository cap, migration metrics, and rollback path.

- [ ] **Step 3: Wait for the Git-triggered Vercel Preview**

  Require the Preview deployment to reach `READY` and all GitHub checks to pass. Do not use a direct local production deployment.

- [ ] **Step 4: Validate Preview at both viewport widths**

  Repeat the Task 8 representative-route checks on the Preview URL. Also confirm the built commit matches the feature-branch head and that no recent Preview runtime error is associated with the target routes.

- [ ] **Step 5: Request explicit production approval**

  Provide the pull-request link, Preview link, commit SHA, verification evidence, and remaining risks. Stop here until Denny explicitly approves merge/production. This global image-pipeline change is not covered by the equipment-page automated-release exception.

- [ ] **Step 6: After approval, merge through GitHub and verify production**

  Merge the approved pull request into GitHub `main`, allow the Git integration to deploy, then verify the deployed commit, representative target-route HTTP status, H1, canonical, primary image, responsive image markup, sitemap continuity, and recent runtime errors. Report the final commit and deployment result in Chinese.
