# WCB Asset Performance Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the transfer and render cost of WCB's referenced raster assets and split route-specific CSS out of the site-wide stylesheet without changing editorial copy or publishing the result.

**Architecture:** A reusable Node/Sharp migration script will convert only referenced raster images larger than 1 MiB to bounded WebP assets and mechanically update their source references. Route-specific CSS sections will move into focused files imported by the relevant App Router page or nested layout, leaving only shared primitives in `app/globals.css`. File-level and built-output audits provide independent safety gates.

**Tech Stack:** Next.js 15 App Router, React 19, Node.js test runner, Sharp, CSS, MDX.

## Global Constraints

- Work only in `/Users/youdenny/Documents/Codex项目/New project 5/.worktrees/wcb-seo-performance-fixes` on `codex/wcb-seo-performance-fixes`.
- Do not commit, push, deploy, or modify the user's original dirty workspace.
- Do not rewrite article copy, titles, slugs, metadata, CTA, FAQ, or schema content.
- Optimize only raster assets that are actually referenced by production source and exceed 1 MiB.
- Preserve aspect ratio; never enlarge an image; use adaptive WebP quality and a minimum final long edge of 1400 px when the source is at least that large.
- Remove a superseded PNG only after the WebP exists, every known source reference is updated, and the migration can be recovered from Git.
- A production build, broken-reference audit, full test suite, and representative route verification are required before completion.

---

### Task 1: Add independent asset-budget gates

**Files:**
- Create: `tests/assetPerformanceAudit.test.mjs`
- Create: `scripts/verify-built-asset-budgets.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: quoted `/images/`, `/brand/`, and `/expo/` raster references in production source; `.next/server/app/**/*.html`; `.next/static/css/*.css`.
- Produces: `npm run test:asset-performance` and `npm run verify:asset-budgets`.

- [ ] **Step 1: Write the failing referenced-image test**

  Scan real production source files, resolve every local raster reference under `public`, assert that every referenced file exists, and assert that no referenced raster exceeds `1_048_576` bytes. The current site must fail with the existing large-asset count.

- [ ] **Step 2: Run the image test and verify RED**

  Run `npm run test:asset-performance`. Expected: FAIL listing referenced assets larger than 1 MiB, not a syntax or fixture error.

- [ ] **Step 3: Write the built CSS budget verifier**

  Read actual CSS links from representative built HTML routes. Assert that the CSS file shared by all audited routes is at most `225_280` bytes and that each route's total linked raw CSS is at most `327_680` bytes.

- [ ] **Step 4: Run the built verifier and verify RED**

  Run `npm run verify:asset-budgets` against the current `.next` output. Expected: FAIL because the single shared stylesheet is about 410 KiB.

### Task 2: Add and execute the safe image migration

**Files:**
- Create: `scripts/optimize-referenced-images.mjs`
- Modify mechanically: raster references under `app/`, `components/`, `content/`, and `lib/`
- Create mechanically: optimized `.webp` files under `public/`
- Delete mechanically: only superseded, Git-recoverable source `.png` files converted by this task

**Interfaces:**
- Consumes: source-file references and referenced image files larger than 1 MiB.
- Produces: WebP assets using the same basename, a reference mapping, byte-savings summary, and no broken local references.

- [ ] **Step 1: Implement reference discovery and collision checks**

  Discover references from real production files, reject missing inputs or existing output-path collisions, and select only referenced `.png`, `.jpg`, `.jpeg`, or `.webp` files above the budget.

- [ ] **Step 2: Implement adaptive Sharp encoding**

  Encode WebP at quality 84 and at most 1920 px; if the result remains above 900 KiB, retry at quality 78 and at most 1600 px; if still above budget, retry at quality 72 and at most 1400 px. Preserve transparency, rotate from metadata, preserve aspect ratio, and never enlarge.

- [ ] **Step 3: Implement safe reference replacement and cleanup**

  Write successful outputs first, replace exact public paths in production text files, verify the new files exist, then remove only converted source files. Print source bytes, output bytes, converted count, and skipped count.

- [ ] **Step 4: Run the migration and verify GREEN**

  Run the migration once, then run `npm run test:asset-performance`. Expected: all referenced files resolve and every referenced raster is at or below 1 MiB.

### Task 3: Split route-specific CSS from the global payload

**Files:**
- Modify: `app/globals.css`
- Create: `app/styles/home.css`
- Create: `app/styles/sourcing.css`
- Create: `app/styles/content-directories.css`
- Create: `app/styles/brands.css`
- Create: `app/styles/equipment.css`
- Create: `app/styles/components.css`
- Create: `app/styles/about.css`
- Create: `app/styles/trust.css`
- Create: `app/blog/layout.tsx`
- Create: `app/guides/layout.tsx`
- Create: `app/brands/layout.tsx`
- Create: `app/equipment/layout.tsx`
- Create: `app/components/layout.tsx`
- Create: `app/sourcing/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/inquiry-received/page.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `app/quality-compliance/page.tsx`
- Modify: `app/terms/page.tsx`

**Interfaces:**
- Consumes: comment-delimited route sections currently embedded in `app/globals.css`.
- Produces: App Router CSS chunks that load only on routes using their selectors.

- [ ] **Step 1: Extract unambiguous page-family sections**

  Move Home V9 and its final Expo alignment override to `home.css`; all Sourcing V2/V3/V4, opportunity, product, and lawn sections to `sourcing.css`; Guides, unified Blog, and Analysis/Guides directory sections to `content-directories.css`; Brand, Equipment, and Component Intelligence sections to their matching files; About and trust-page sections to their matching files.

- [ ] **Step 2: Add route-scoped imports**

  Import family CSS from nested layouts for `/blog`, `/guides`, `/brands`, `/equipment`, `/components`, and `/sourcing`. Import home, About, and trust CSS only from their direct pages. Keep shared variables, header/footer, article typography, buttons, forms, and layout primitives in `globals.css`.

- [ ] **Step 3: Build and run the real CSS budget gate**

  Run `npm run build`, then `npm run verify:asset-budgets`. Expected: all representative routes remain generated; shared CSS is at most 220 KiB and every audited route is at most 320 KiB raw CSS.

- [ ] **Step 4: Inspect CSS chunk ownership**

  Confirm that homepage HTML does not link Brand/Equipment/Component CSS chunks, and those route families link only their own family chunk plus shared CSS.

### Task 4: Full regression and representative route validation

**Files:**
- Modify only if a real regression is found: the smallest affected implementation or test file

**Interfaces:**
- Consumes: final source tree and final production build.
- Produces: fresh test/build evidence and a local-review handoff.

- [ ] **Step 1: Run the complete Node test suite**

  Run `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --import ./tests/register-path-alias.mjs --test tests/*.test.mjs`. Expected: zero failures.

- [ ] **Step 2: Run content and asset checks**

  Run `npm run verify:content-classification`, `npm run test:seo-audit`, `npm run test:asset-performance`, `npm run verify:asset-budgets`, and `git diff --check`.

- [ ] **Step 3: Run representative local production checks**

  Start the production server locally and verify HTTP 200, one H1, one main landmark, canonical URL, primary image, and CSS availability for `/`, `/blog`, `/guides`, `/sourcing`, `/brands`, `/equipment`, `/components`, `/about`, and `/wcb-expo`.

- [ ] **Step 4: Review scope and preserve the branch locally**

  Confirm no user-owned workspace files changed, report the byte reductions and remaining risks, and keep `codex/wcb-seo-performance-fixes` uncommitted and unpublished for user review.
