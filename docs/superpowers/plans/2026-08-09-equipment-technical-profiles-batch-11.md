# Equipment Technical Profiles Batch Eleven Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish three verified technical equipment pages for cordless wet dry floor cleaners, steam mops, and handheld vacuum cleaners.

**Architecture:** Reuse the existing JSON-driven equipment renderer and directory discovery. Add only three schema-compatible content records, page-local official images and responsive WCB diagrams, plus narrow regression coverage in the existing equipment test.

**Tech Stack:** Next.js 15, React, JSON content records, Node test runner, Sharp/WebP assets, SVG, Vercel Git deployment.

## Global Constraints

- Work only in the isolated `codex/equipment-batch-11-20260809` branch.
- Do not modify articles, ownership pages, brand pages, component pages, shared components, global styles, or navigation.
- Use at least seven reliable sources and six to eight models from four published brand profiles per page.
- Official photos only; no AI product images, third-party logo sites, copied search-result screenshots, or uncertain subjects.
- Component-family names remain unlinked and do not establish cross-model compatibility.
- Publish through GitHub `main` and Vercel Git integration; never use `vercel --prod`.

---

### Task 1: Batch-eleven release contract

**Files:**
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Consumes: equipment JSON discovery and existing validation helpers.
- Produces: failing expectations for the three absent slugs and their evidence, model, visual, brand-link, component-link, and sitemap contracts.

- [ ] **Step 1: Write the failing test**

Add literal expected slugs and technical-boundary phrases for `cordless-wet-dry-floor-cleaner`, `steam-mop`, and `handheld-vacuum-cleaner`. Assert published status, valid schema, at least seven sources, six to eight representative models, at least four published brands, no component links, one official hero, two official content photos, one desktop/mobile WCB diagram pair, required image dimensions, and sitemap discovery.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:equipment`

Expected: FAIL because the three JSON records and sitemap entries do not exist.

### Task 2: Profile data and official visual assets

**Files:**
- Create: `content/equipment/cordless-wet-dry-floor-cleaner.json`
- Create: `content/equipment/steam-mop.json`
- Create: `content/equipment/handheld-vacuum-cleaner.json`
- Create: `public/images/equipment/cordless-wet-dry-floor-cleaner/*`
- Create: `public/images/equipment/steam-mop/*`
- Create: `public/images/equipment/handheld-vacuum-cleaner/*`

**Interfaces:**
- Consumes: the existing equipment schema, official product evidence, and published `/brands/{slug}` records.
- Produces: three discoverable published profiles and complete local visual packages.

- [ ] **Step 1: Add schema-complete records**

Populate identity, category boundaries, system flow, variants, metrics, application fit, component families, representative models, procurement decisions, engineering checks, directly applicable standards, dated developments, source records, and publication dates using only declared evidence.

- [ ] **Step 2: Add official photos and responsive diagrams**

Create one 1600 x 1000 hero, two 1500 x 900 official content images, and 1600 x 1000 plus 800 x 1600 component-verification SVGs for each page. Record exact official asset URLs and accurate visible-subject captions.

- [ ] **Step 3: Run test to verify GREEN**

Run: `npm run test:equipment`

Expected: all equipment tests pass.

### Task 3: Repository and rendered-page verification

**Files:**
- Verify only; no additional production files unless a failing check identifies an in-scope defect.

**Interfaces:**
- Consumes: three completed profiles and the existing build pipeline.
- Produces: release evidence for content, build, responsive rendering, and sitemap discovery.

- [ ] **Step 1: Run all automated checks**

Run every `test:*` package script, `npm run verify:content-classification`, `npm run verify:sourcing-seo`, `git diff --check`, and `npm run build`.

- [ ] **Step 2: Inspect desktop and mobile pages**

At 1440 x 1000 and 390 x 844, verify title wrapping, all images, tables, component navigation, no horizontal overflow, and no new browser errors or warnings.

- [ ] **Step 3: Release through the approved Git workflow**

Push the feature branch, create a ready PR and Vercel Preview, validate it, squash-merge to `main`, wait for the Git-triggered production deployment, and verify the three live pages, images, equipment-directory count, and sitemap entries.
