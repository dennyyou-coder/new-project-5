# Equipment Technical Profiles Batch 06 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish industrial dust extractor, upright commercial vacuum and escalator cleaner technical profiles using the existing WCB equipment database and page system.

**Architecture:** Add three schema-valid JSON records and profile-local visual packages. Reuse the current loader, renderer, routes, sitemap and responsive styles without adding component routes or shared architecture. Add one focused batch contract protecting publication, evidence, relationship and asset gates.

**Tech Stack:** Next.js 15, React 19, TypeScript, JSON equipment records, Node test runner, Sharp metadata checks, SVG and WebP assets.

## Global Constraints

- Only equipment technical database pages are in scope; do not create articles, ownership records, brand records or component pages.
- Every evidence statement uses declared primary sources; WCB interpretation remains explicitly labelled.
- Each page uses at least five reliable sources, six to eight models and at least four published brand profiles.
- Do not infer OEM, factory, supplier, certification or compatibility relationships.
- Reuse the existing equipment route and component architecture unchanged.
- Production releases only from GitHub `main` through the Vercel Git integration.

---

### Task 1: Lock the sixth-batch publication contract

**Files:**
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Consumes: `getEquipmentProfiles()`, `validateEquipmentProfile()`, `getPublishedBrandProfiles()`, `sitemap()` and Sharp metadata.
- Produces: sixth-batch assertions for exact slugs, publication, evidence, six-to-eight models, four brands, unlinked component families, official-photo dimensions, responsive diagrams and sitemap inclusion.

- [ ] Add failing tests for `industrial-dust-extractor`, `upright-commercial-vacuum` and `escalator-cleaner` using the existing batch-five assertions.
- [ ] Run `npm run test:equipment`; confirm failure is caused by the three absent records.
- [ ] Commit the contract as `test: define equipment batch six contract`.

### Task 2: Build the evidence records

**Files:**
- Create: `content/equipment/industrial-dust-extractor.json`
- Create: `content/equipment/upright-commercial-vacuum.json`
- Create: `content/equipment/escalator-cleaner.json`

**Interfaces:**
- Consumes: the existing `EquipmentProfile` contract and published brand slugs.
- Produces: three complete profiles automatically consumed by the equipment directory, route, schemas and sitemap.

- [ ] Author all records as drafts with precise inclusion/exclusion scope, three visuals, key facts, system flow, variants, metrics, application assessments, component families without links, representative models, procurement decisions, engineering checks, standards, developments and primary sources.
- [ ] Run `npm run test:equipment`; confirm only draft/asset publication gates remain.

### Task 3: Add official visual packages and diagrams

**Files:**
- Create five profile-local assets under each `public/images/equipment/{slug}/`: `hero.webp`, two official WebP content photos, `component-verification-map.svg`, and `component-verification-map-mobile.svg`.

**Interfaces:**
- Consumes: exact official asset URLs declared in the records and `EquipmentContentVisualFigure`.
- Produces: locally verified, source-traceable WebP photos plus readable responsive diagrams.

- [ ] Download current manufacturer images and visually inspect them before selection.
- [ ] Convert selected images without distortion to the required canvases.
- [ ] Create desktop and mobile diagrams with evidence-bound zones and the exact compatibility warning.
- [ ] Change the three statuses to `published` and run `npm run test:equipment` to GREEN.
- [ ] Commit implementation as `Add equipment technical profiles batch six`.

### Task 4: Verify and release

**Files:**
- Verify only; modify batch-scoped files only when evidence shows a defect.

**Interfaces:**
- Consumes: project tests, production build, rendered routes, GitHub Preview and production deployment.
- Produces: validated public pages and sitemap entries.

- [ ] Run every project `test:*` script, content verifiers, `git diff --check` and `npm run build`.
- [ ] Inspect the directory and three pages at 1440 x 1000 and 390 x 844 for content, images, responsive diagrams, alignment, overflow and browser errors.
- [ ] Push the branch, create a ready pull request and verify a ready Vercel Preview.
- [ ] Merge to GitHub `main`, allow Git-integrated production deployment, then verify the directory, routes, Hero assets and sitemap on `worldcleanbiz.com`.
