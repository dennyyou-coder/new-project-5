# Equipment Technical Profiles Batch 02 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish evidence-backed Floor Sweeper, Carpet Extractor and Wet & Dry Vacuum technical database pages using the approved equipment profile system.

**Architecture:** Add three records to `content/equipment` and dedicated local assets under `public/images/equipment`. Reuse the existing generic equipment route and components without creating new page architecture. Extend focused tests to lock the evidence, relationships, assets and production discovery of the batch.

**Tech Stack:** Next.js 15, React, TypeScript, JSON content records, Node test runner, Sharp, SVG and Vercel Git deployments.

## Global Constraints

- No SEO or ownership article files may change.
- New records start as `draft` and move to `published` only after evidence, build and responsive checks pass.
- Use official manufacturer, IEC or regulator sources; omit unsupported compatibility, OEM, factory and hazardous-use claims.
- Preserve source units and measurement boundaries.
- Use one official hero, two official photos and one WCB diagram per profile.
- Production deployment must originate from GitHub `main`; never use `vercel --prod`.

---

### Task 1: Lock the batch contract with failing tests

**Files:**
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Consumes: `getEquipmentProfiles()`, `validateEquipmentProfile()`, `getPublishedBrandProfiles()`.
- Produces: regression assertions for the three exact slugs, evidence gates, model diversity and visual assets.

- [ ] **Step 1: Add one data-driven test for the three profiles**

Assert that `floor-sweeper`, `carpet-extractor` and `wet-dry-vacuum` exist, start as `draft`, pass the validator, contain at least five sources, contain 6–8 models across at least four brands, contain three content visuals and have no component `href`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm run test:equipment`

Expected: FAIL because the three profile records do not exist.

- [ ] **Step 3: Commit the failing test**

Run: `git add tests/equipmentIntelligence.test.mjs && git commit -m "test: define equipment batch two gates"`

### Task 2: Add official visual assets

**Files:**
- Create: `public/images/equipment/floor-sweeper/hero.webp`
- Create: `public/images/equipment/floor-sweeper/type-walk-behind.webp`
- Create: `public/images/equipment/floor-sweeper/application-ride-on.webp`
- Create: `public/images/equipment/carpet-extractor/hero.webp`
- Create: `public/images/equipment/carpet-extractor/type-self-contained.webp`
- Create: `public/images/equipment/carpet-extractor/application-lobby.webp`
- Create: `public/images/equipment/wet-dry-vacuum/hero.webp`
- Create: `public/images/equipment/wet-dry-vacuum/type-large-canister.webp`
- Create: `public/images/equipment/wet-dry-vacuum/application-portable.webp`

**Interfaces:**
- Consumes: exact official URLs recorded in the design and future JSON `sourceUrl` fields.
- Produces: local WebP assets at the paths consumed by the three records.

- [ ] **Step 1: Download the nine official source images into a temporary directory**

Use only Hako, Kärcher, TASKI and Nilfisk official asset URLs. Verify each response content type before conversion.

- [ ] **Step 2: Inspect every image**

Confirm the named machine and scene match the intended page and alt text. Exclude text-heavy, mismatched or ambiguous assets.

- [ ] **Step 3: Convert without distortion**

Use Sharp to create 1600 x 1000 hero images and at least 1500 x 900 content images with `fit: contain` or `fit: cover` chosen to preserve the product and scene.

- [ ] **Step 4: Verify metadata**

Run Sharp metadata checks for format, width and height on all nine files.

- [ ] **Step 5: Commit the official images**

Run: `git add public/images/equipment && git commit -m "assets: add equipment batch two official visuals"`

### Task 3: Create the three evidence records

**Files:**
- Create: `content/equipment/floor-sweeper.json`
- Create: `content/equipment/carpet-extractor.json`
- Create: `content/equipment/wet-dry-vacuum.json`

**Interfaces:**
- Consumes: `EquipmentProfile` in `lib/equipment.ts`, published brand slugs and Task 2 asset paths.
- Produces: three draft equipment records discoverable by `getEquipmentProfiles()`.

- [ ] **Step 1: Add Floor Sweeper data**

Include the seven representative models and exact official sources listed in the design. Define system flow as edge collection, main-broom pickup, debris transfer, hopper retention, dust separation and filtered exhaust.

- [ ] **Step 2: Add Carpet Extractor data**

Include the seven representative models and exact official sources listed in the design. Define system flow as solution delivery, spray distribution, fibre agitation, soil suspension, extraction pickup and recovery containment.

- [ ] **Step 3: Add Wet & Dry Vacuum data**

Include the eight representative models and exact official sources listed in the design. Define system flow as inlet pickup, hose transport, liquid/dry separation, filter protection, motor airflow and container discharge.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm run test:equipment`

Expected: all equipment tests pass.

- [ ] **Step 5: Commit the records**

Run: `git add content/equipment tests/equipmentIntelligence.test.mjs && git commit -m "content: add equipment technical profiles batch two"`

### Task 4: Add original component-verification diagrams

**Files:**
- Create: `public/images/equipment/floor-sweeper/component-verification-map.svg`
- Create: `public/images/equipment/floor-sweeper/component-verification-map-mobile.svg`
- Create: `public/images/equipment/carpet-extractor/component-verification-map.svg`
- Create: `public/images/equipment/carpet-extractor/component-verification-map-mobile.svg`
- Create: `public/images/equipment/wet-dry-vacuum/component-verification-map.svg`
- Create: `public/images/equipment/wet-dry-vacuum/component-verification-map-mobile.svg`

**Interfaces:**
- Consumes: each profile's component-stack terminology and cited technical sources.
- Produces: responsive WCB diagrams referenced by the `component-stack` visual.

- [ ] **Step 1: Draw the desktop SVGs**

Use the established navy, blue and light-background visual language. Show four verification zones per machine and the compatibility warning.

- [ ] **Step 2: Draw the vertical mobile SVGs**

Use a 1:2 aspect ratio and readable labels at 390 px.

- [ ] **Step 3: Extend tests to inspect all six SVGs**

Assert `<svg` and `Family labels do not establish cross-model compatibility` appear in each file.

- [ ] **Step 4: Run the focused test**

Run: `npm run test:equipment`

Expected: all equipment tests pass.

- [ ] **Step 5: Commit the diagrams**

Run: `git add public/images/equipment tests/equipmentIntelligence.test.mjs && git commit -m "assets: add equipment batch two verification diagrams"`

### Task 5: Validate draft rendering

**Files:**
- Modify only if a proven generic rendering defect exists: `components/equipment/*.tsx`, `app/globals.css`
- Test any defect in: `tests/equipmentExperience.test.mjs`

**Interfaces:**
- Consumes: the existing equipment route and the three draft records.
- Produces: responsive draft pages with no new category-specific component code unless required by a failing test.

- [ ] **Step 1: Run focused tests and build**

Run: `npm run test:equipment`

Run: `npm run build`

- [ ] **Step 2: Check desktop and 390 px views**

Verify all sections, tables, images, captions and diagrams; confirm no horizontal overflow or console errors.

- [ ] **Step 3: If a generic defect appears, reproduce it with a failing test before editing production code**

Run the focused test to prove RED, apply the smallest generic fix, then rerun to prove GREEN.

- [ ] **Step 4: Commit only proven fixes**

Run: `git add components/equipment app/globals.css tests/equipmentExperience.test.mjs && git commit -m "fix: support equipment batch two layouts"`

### Task 6: Publish and release

**Files:**
- Modify: `content/equipment/floor-sweeper.json`
- Modify: `content/equipment/carpet-extractor.json`
- Modify: `content/equipment/wet-dry-vacuum.json`
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Consumes: verified draft pages.
- Produces: published profiles in static params, equipment directory and sitemap.

- [ ] **Step 1: Change tests to require `published` and production discovery**

Run `npm run test:equipment` and verify RED while records remain drafts.

- [ ] **Step 2: Change all three records to `published`**

Run `npm run test:equipment` and verify GREEN.

- [ ] **Step 3: Run the complete test set and production build**

Run every project test script and `npm run build`. Confirm zero failures and all three routes in build output.

- [ ] **Step 4: Push the feature branch and validate Vercel Preview**

Check desktop, 390 px, images and browser logs.

- [ ] **Step 5: Merge through GitHub `main` and verify production**

Use a normal non-force push to `main`, wait for Vercel Git deployment success, and verify the three routes, directory, sitemap and all local assets on `worldcleanbiz.com`.

