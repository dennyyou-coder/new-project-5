# Equipment Technical Profiles Batch 07 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish walk-behind floor scrubber, ride-on floor scrubber and wide-area vacuum technical profiles using the existing WCB equipment database and page system.

**Architecture:** Add three schema-valid JSON records and profile-local visual packages. Reuse the current loader, renderer, routes, sitemap and responsive styles without adding component routes, hierarchy fields or shared architecture. Add one focused batch contract protecting publication, evidence, relationship and asset gates.

**Tech Stack:** Next.js 15, React 19, TypeScript, JSON equipment records, Node test runner, Sharp metadata checks, SVG and WebP assets.

## Global Constraints

- Only equipment technical database pages are in scope; do not create articles, ownership records, brand records or component pages.
- Treat the new records as independently scoped subtype references, not replacements for the existing Floor Scrubber, Commercial Dry Vacuum or Upright Commercial Vacuum overviews.
- Every evidence statement uses declared primary sources; WCB interpretation remains explicitly labelled.
- Each page uses at least five reliable sources, six to eight models and at least four published brand profiles.
- Do not infer OEM, factory, supplier, certification, achieved productivity or compatibility relationships.
- Reuse the existing equipment route and component architecture unchanged.
- Production releases only from GitHub `main` through the Vercel Git integration.

---

### Task 1: Lock the seventh-batch publication contract

**Files:**
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Consumes: `getEquipmentProfiles()`, `validateEquipmentProfile()`, `getPublishedBrandProfiles()`, `sitemap()` and Sharp metadata.
- Produces: seventh-batch assertions for exact slugs, publication, evidence, six-to-eight models, four brands, unlinked component families, official-photo dimensions, responsive diagrams and sitemap inclusion.

- [ ] Add failing tests for `walk-behind-floor-scrubber`, `ride-on-floor-scrubber` and `wide-area-vacuum` using literal slug expectations and the existing batch-six behavior gates.
- [ ] Run `npm run test:equipment`; confirm failure is `profile should exist` and sitemap absence for the three new records.
- [ ] Commit the verified RED contract as `test: define equipment batch seven contract`.

### Task 2: Build the evidence records

**Files:**
- Create: `content/equipment/walk-behind-floor-scrubber.json`
- Create: `content/equipment/ride-on-floor-scrubber.json`
- Create: `content/equipment/wide-area-vacuum.json`

**Interfaces:**
- Consumes: the existing `EquipmentProfile` contract, declared source IDs and published brand slugs.
- Produces: three complete profiles automatically consumed by the equipment directory, detail route, schemas and sitemap.

- [ ] Author each record as `draft` with precise inclusion/exclusion scope, three visuals, key facts, system flow, variants, metrics, application assessments, component families without links, representative models, procurement decisions, engineering checks, standards, developments and primary sources.
- [ ] Validate each record with `validateEquipmentProfile()` and the real published-brand slug set.
- [ ] Run `npm run test:equipment`; confirm only draft and missing-asset publication gates remain.

### Task 3: Add official visual packages and responsive diagrams

**Files:**
- Create: `public/images/equipment/walk-behind-floor-scrubber/hero.webp`
- Create: two official WebP content photos and two SVG diagrams in the same directory.
- Create: the equivalent five files under `public/images/equipment/ride-on-floor-scrubber/`.
- Create: the equivalent five files under `public/images/equipment/wide-area-vacuum/`.

**Interfaces:**
- Consumes: exact official asset URLs declared in the records and `EquipmentContentVisualFigure`.
- Produces: locally verified, source-traceable photos plus readable desktop and mobile verification maps.

- [ ] Download current manufacturer images and visually inspect identity, subject and aspect before selection.
- [ ] Convert selected images without distortion to 1600 x 1000 Hero and at least 1500 x 900 content canvases.
- [ ] Create 1600 x 1000 desktop and 800 x 1600 mobile diagrams with evidence-bound zones and the exact compatibility warning.
- [ ] Change all three statuses to `published` only after assets and evidence validate.
- [ ] Run `npm run test:equipment` to GREEN and commit as `Add equipment technical profiles batch seven`.

### Task 4: Verify and release

**Files:**
- Verify only; modify batch-scoped files only when evidence shows a defect.

**Interfaces:**
- Consumes: project tests, production build, rendered routes, GitHub Preview and production deployment.
- Produces: validated public pages, Hero assets and sitemap entries.

- [ ] Run every project `test:*` script, both content verifiers, `git diff --check` and `npm run build`.
- [ ] Inspect `/equipment` and the three detail pages at 1440 x 1000 and 390 x 844 for H1, images, responsive diagrams, alignment, table and page overflow, and browser errors.
- [ ] Push the branch, create a ready pull request and wait for a successful Vercel Preview status.
- [ ] Merge to GitHub `main`, allow Git-integrated production deployment, then verify the directory, routes, Hero assets and sitemap on `worldcleanbiz.com`.
