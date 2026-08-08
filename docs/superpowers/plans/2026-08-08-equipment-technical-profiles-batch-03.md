# Equipment Technical Profiles Batch 03 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish evidence-backed technical profiles for Single-disc Floor Machine, Floor Burnisher, and Commercial Pressure Washer using the approved WCB equipment-page framework.

**Architecture:** Add three validated records under `content/equipment/` and profile-local official WebP assets plus WCB SVG verification diagrams under `public/images/equipment/`. Reuse the existing equipment route, components, schemas, sitemap integration, and CSS without adding article, ownership, component-profile, routing, or shared-layout changes.

**Tech Stack:** Next.js 15, TypeScript, JSON content records, Node test runner, Sharp, SVG, GitHub/Vercel Git integration.

## Global Constraints

- Work only in the isolated `codex/equipment-batch-03-20260808` worktree.
- Keep all new profiles `draft` until evidence, assets, tests, build, and rendered QA pass.
- Each profile must declare at least five primary official sources, six to eight representative models, and at least four published brand slugs.
- Each profile must contain one official Hero, two official content photos, and one WCB component-verification diagram with desktop and mobile SVG variants.
- Evidence, scope, buyer action, model market scope, and compatibility boundaries must remain explicit.
- Do not add SEO articles, ownership pages, component pages, guessed OEM relationships, or direct production deployment.
- Release only through feature branch, Vercel Preview, reviewed merge to GitHub `main`, and Git-triggered Vercel production.

---

### Task 1: Lock the batch contract with a failing test

**Files:**
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Consumes: `getEquipmentProfiles()`, `validateEquipmentProfile()`, published brand profiles, Sharp image metadata.
- Produces: a regression gate for `single-disc-floor-machine`, `floor-burnisher`, and `commercial-pressure-washer`.

- [ ] Add one table-driven test that requires draft profiles, five sources, six-to-eight models, four published brands, three approved visual placements, two official photos, one responsive SVG diagram, local image dimensions, and no component links.
- [ ] Run `npm run test:equipment` and verify failure is caused by the three missing profiles.
- [ ] Commit the failing contract test.

### Task 2: Research primary evidence and official assets

**Files:**
- Create: `public/images/equipment/single-disc-floor-machine/*.webp`
- Create: `public/images/equipment/floor-burnisher/*.webp`
- Create: `public/images/equipment/commercial-pressure-washer/*.webp`

**Interfaces:**
- Consumes: official manufacturer pages/manuals, IEC/ISO/regulator sources, published WCB brand slugs.
- Produces: source ledger, six-to-eight verified models per profile, and nine normalized official photos.

- [ ] Verify identity and market scope for each representative model against its manufacturer source.
- [ ] Download only official product/application assets and record exact source URLs.
- [ ] Convert Heroes to 1600×1000 WebP and content photos to at least 1500×900 WebP without distorting the product.
- [ ] Visually inspect every converted asset and commit only the nine official photos.

### Task 3: Implement the three draft records

**Files:**
- Create: `content/equipment/single-disc-floor-machine.json`
- Create: `content/equipment/floor-burnisher.json`
- Create: `content/equipment/commercial-pressure-washer.json`

**Interfaces:**
- Consumes: `EquipmentProfile` in `lib/equipment.ts`, the source/model/asset ledger from Task 2.
- Produces: three schema-valid draft profiles consumed by the existing equipment route.

- [ ] Add definitions, scope boundaries, system flow, variants, metrics, application fit, component stack, representative models, procurement decisions, engineering checks, standards, developments, and source metadata.
- [ ] Keep manufacturer claims within exact entity, model, configuration, market, and date boundaries.
- [ ] Run `npm run test:equipment` and fix profile-contract failures without weakening evidence gates.

### Task 4: Add responsive WCB verification diagrams

**Files:**
- Create: `public/images/equipment/single-disc-floor-machine/component-verification-map.svg`
- Create: `public/images/equipment/single-disc-floor-machine/component-verification-map-mobile.svg`
- Create: `public/images/equipment/floor-burnisher/component-verification-map.svg`
- Create: `public/images/equipment/floor-burnisher/component-verification-map-mobile.svg`
- Create: `public/images/equipment/commercial-pressure-washer/component-verification-map.svg`
- Create: `public/images/equipment/commercial-pressure-washer/component-verification-map-mobile.svg`
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Consumes: profile component stacks and cited source IDs.
- Produces: valid 1600×1000 desktop and 800×1600 mobile diagrams.

- [ ] Add four evidence-bounded verification zones per equipment type.
- [ ] Extend the batch test to decode official assets and assert both SVG variants and compatibility disclaimer.
- [ ] Run `npm run test:equipment` and commit data, diagrams, and green regression tests.

### Task 5: Rendered draft QA and publication gate

**Files:**
- Modify: the three profile JSON files only if evidence or visual QA reveals a problem.
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Consumes: local draft routes and existing equipment UI.
- Produces: three publication-ready records and sitemap assertions.

- [ ] Check all three pages at 1440px and 390px for title wrapping, empty cards, image match, table overflow, broken images, and console errors.
- [ ] Write the publication-status and sitemap assertions first and verify they fail while profiles remain drafts.
- [ ] Change all three statuses to `published`, rerun `npm run test:equipment`, and verify the new assertions pass.

### Task 6: Full verification and Git-based release

**Files:**
- No new production files unless verification identifies a tested defect.

**Interfaces:**
- Consumes: complete feature branch.
- Produces: production pages on `worldcleanbiz.com` from GitHub `main`.

- [ ] Run every project test script, `git diff --check`, and `npm run build`.
- [ ] Rebase on the latest `origin/main`, rerun all tests and the production build, then push the feature branch.
- [ ] Create a GitHub pull request and wait for Vercel Preview `Ready`; validate Preview when access protection permits.
- [ ] Merge the approved PR into `main`, wait for Vercel production success, then verify HTTP 200, page titles, responsive screenshots, image integrity, and sitemap entries on the public domain.
