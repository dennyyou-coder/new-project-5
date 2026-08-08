# Equipment Technical Profiles Batch 05 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish autonomous floor scrubber, commercial robot vacuum and combination sweeper-scrubber technical profiles using the existing WCB equipment database and page system.

**Architecture:** Add three schema-valid JSON records and profile-local visual packages. Reuse the current loader, renderer, routes, sitemap and responsive styles without adding a component route or new shared architecture. Add one focused batch contract to protect publication, evidence, relationship and asset gates.

**Tech Stack:** Next.js 15, React 19, TypeScript, JSON equipment records, Node test runner, Sharp metadata checks, SVG and WebP assets.

## Global Constraints

- Only equipment technical database pages are in scope; do not create articles, ownership records, brand records or component pages.
- All evidence statements require `evidence`, `scope`, `sourceIds` and `verifiedAt`; WCB interpretation remains explicitly labelled.
- Each page uses at least five reliable primary sources, six to eight models and at least four published brand profiles.
- Do not infer OEM, factory, software-provider, supplier or compatibility relationships.
- New pages use the existing equipment component and route architecture unchanged.
- Production is released only from GitHub `main` through the Vercel Git integration.

---

### Task 1: Lock the fifth-batch publication contract

**Files:**
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Consumes: `getEquipmentProfiles()`, `validateEquipmentProfile()`, `getPublishedBrandProfiles()`, `sitemap()` and Sharp metadata.
- Produces: a fifth-batch test covering slugs, publication state, schema validation, source/model/brand thresholds, unlinked component families, official-photo dimensions, responsive diagrams and sitemap inclusion.

- [ ] **Step 1: Add the failing fifth-batch profile test**

  Add a loop over `autonomous-floor-scrubber`, `commercial-robot-vacuum` and `combination-sweeper-scrubber`. Assert that each profile exists, is published, validates without errors, declares at least five sources, six to eight representative models, at least four distinct published brand slugs, no component `href`, exactly two official photos and one responsive WCB diagram, a 1600 x 1000 or larger WebP Hero, 1500 x 900 or larger official content photos, and desktop/mobile SVG compatibility warnings.

- [ ] **Step 2: Add the failing sitemap test**

  Assert that production sitemap discovery contains all three exact `/equipment/{slug}` routes.

- [ ] **Step 3: Run the focused suite and verify RED**

  Run `npm run test:equipment`. Expected result: the new test fails because all three profile records are absent.

- [ ] **Step 4: Commit the contract**

  Commit only the test change with message `test: define equipment batch five contract`.

### Task 2: Build the three evidence records

**Files:**
- Create: `content/equipment/autonomous-floor-scrubber.json`
- Create: `content/equipment/commercial-robot-vacuum.json`
- Create: `content/equipment/combination-sweeper-scrubber.json`

**Interfaces:**
- Consumes: `EquipmentProfile` and `validateEquipmentProfile()` from `lib/equipment.ts`; published brand slugs from the existing brand database.
- Produces: three complete `EquipmentProfile` records consumed automatically by the directory, route, schema builder and sitemap.

- [ ] **Step 1: Author records as drafts**

  Include precise scope, Hero metadata, three visual declarations, key facts, five or more system-flow nodes, three or more variants, performance metrics, application assessments, component families without links, six representative models, procurement decisions, engineering checks, IEC applicability boundaries, dated developments, at least five primary sources and current verification dates.

- [ ] **Step 2: Run the focused suite**

  Run `npm run test:equipment`. Expected result: schema and publication/asset assertions still fail because records remain draft and assets are not present.

### Task 3: Add official visual packages and WCB diagrams

**Files:**
- Create: `public/images/equipment/autonomous-floor-scrubber/hero.webp`
- Create: `public/images/equipment/autonomous-floor-scrubber/type-autonomous-scrubber.webp`
- Create: `public/images/equipment/autonomous-floor-scrubber/application-autonomous-scrubber.webp`
- Create: `public/images/equipment/autonomous-floor-scrubber/component-verification-map.svg`
- Create: `public/images/equipment/autonomous-floor-scrubber/component-verification-map-mobile.svg`
- Create: `public/images/equipment/commercial-robot-vacuum/hero.webp`
- Create: `public/images/equipment/commercial-robot-vacuum/type-commercial-robot-vacuum.webp`
- Create: `public/images/equipment/commercial-robot-vacuum/application-commercial-robot-vacuum.webp`
- Create: `public/images/equipment/commercial-robot-vacuum/component-verification-map.svg`
- Create: `public/images/equipment/commercial-robot-vacuum/component-verification-map-mobile.svg`
- Create: `public/images/equipment/combination-sweeper-scrubber/hero.webp`
- Create: `public/images/equipment/combination-sweeper-scrubber/type-combination-machine.webp`
- Create: `public/images/equipment/combination-sweeper-scrubber/application-combination-machine.webp`
- Create: `public/images/equipment/combination-sweeper-scrubber/component-verification-map.svg`
- Create: `public/images/equipment/combination-sweeper-scrubber/component-verification-map-mobile.svg`

**Interfaces:**
- Consumes: official asset URLs declared in the JSON records and the existing `EquipmentContentVisualFigure` renderer.
- Produces: local profile-scoped assets matching the dimensions and provenance declared by each record.

- [ ] **Step 1: Download and inspect official source images**

  Use only current manufacturer product pages, official media assets or official brochures. Inspect each source image before conversion and reject mismatched products, screenshots, logos and diagrams.

- [ ] **Step 2: Convert without distortion**

  Fit each selected official image into the required WebP canvas using neutral padding or crop only when the subject remains complete and accurate. Do not generate or redraw equipment.

- [ ] **Step 3: Create responsive verification diagrams**

  Create one desktop and one mobile SVG for each profile with readable labels, evidence-bound verification zones and the exact compatibility warning required by the equipment contract.

- [ ] **Step 4: Promote records and verify GREEN**

  Change all three statuses to `published`, run `npm run test:equipment`, and confirm the fifth-batch and sitemap tests pass.

- [ ] **Step 5: Commit the implementation**

  Commit the JSON, assets and test-compatible output with message `Add equipment technical profiles batch five`.

### Task 4: Complete release verification

**Files:**
- Verify only; modify production files only if a failing test or rendered defect demonstrates a batch-scoped problem.

**Interfaces:**
- Consumes: all project test scripts, content verifiers, Next.js production build and rendered equipment routes.
- Produces: evidence that the three profiles are safe to publish.

- [ ] **Step 1: Run focused and global automated checks**

  Run `npm run test:equipment`, every remaining `test:*` script, `npm run verify:content-classification`, `npm run verify:sourcing-seo`, `git diff --check` and `npm run build`.

- [ ] **Step 2: Review rendered routes**

  At 1440 x 1000 and 390 x 844, inspect the equipment directory and all three profiles for correct titles, visible Hero and content visuals, correct mobile diagram source selection, table stacking, no blank sections, no horizontal overflow, no broken images and no new console errors.

- [ ] **Step 3: Push and verify Preview**

  Push `codex/equipment-batch-05-20260809`, create a ready pull request, wait for Vercel Preview readiness, and verify the directory, routes and sitemap in Preview.

- [ ] **Step 4: Merge and verify production**

  Merge the approved pull request into GitHub `main`, wait for the Vercel Git deployment to succeed, then verify the production directory, three routes, Hero assets and sitemap entries return successfully.

