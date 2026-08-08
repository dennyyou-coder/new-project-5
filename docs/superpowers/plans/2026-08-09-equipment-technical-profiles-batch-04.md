# Equipment Technical Profiles Batch 04 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish evidence-backed Commercial Dry Vacuum, Backpack Vacuum and Commercial Steam Cleaner technical profiles using the approved WCB equipment-page framework.

**Architecture:** Add three validated JSON records under `content/equipment/` and profile-local official WebP assets plus responsive WCB SVG verification diagrams under `public/images/equipment/`. Reuse the existing equipment loader, route, components, sitemap and directory without article, ownership, component-profile or shared-layout changes.

**Tech Stack:** Next.js 15, TypeScript, JSON content records, Node test runner, Sharp, SVG, GitHub and Vercel Git integration.

## Global Constraints

- Work only in `codex/equipment-batch-04-20260809`.
- Keep all three profiles `draft` until evidence, assets, focused tests, build and responsive QA pass.
- Use at least five official or standards sources, six to eight models and four published brands per profile.
- Preserve exact source units, configurations, market scope and measurement boundaries.
- Use one official Hero, two official content photos and one desktop/mobile WCB verification diagram per profile.
- Do not create or modify SEO articles, ownership pages, component pages, routing architecture or unrelated content.
- Release only through feature branch, Vercel Preview, GitHub `main` and Git-triggered production.

---

### Task 1: Define the batch contract

**Files:**
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Consumes: `getEquipmentProfiles()`, `validateEquipmentProfile()`, `getPublishedBrandProfiles()`, Sharp image metadata.
- Produces: regression gates for `commercial-dry-vacuum`, `backpack-vacuum` and `commercial-steam-cleaner`.

- [ ] Add a table-driven test requiring draft status, schema validity, five sources, six-to-eight models, four published brands, three content visuals, official image dimensions, responsive SVG diagrams and no component links.
- [ ] Run `npm run test:equipment` and verify failure because all three records are absent.
- [ ] Commit the failing contract test.

### Task 2: Research official evidence and visuals

**Files:**
- Create: `public/images/equipment/commercial-dry-vacuum/*.webp`
- Create: `public/images/equipment/backpack-vacuum/*.webp`
- Create: `public/images/equipment/commercial-steam-cleaner/*.webp`

**Interfaces:**
- Consumes: official manufacturer pages, manuals, specifications, standards catalogues and published WCB brand slugs.
- Produces: verified source ledgers, representative-model boundaries and nine official photos.

- [ ] Verify six-to-eight models across at least four brands for each category.
- [ ] Download only exact official assets and confirm content type, subject and source URL.
- [ ] Convert Heroes to 1600 x 1000 WebP and content photos to at least 1500 x 900 WebP without distortion.
- [ ] Inspect every converted image and verify metadata.

### Task 3: Implement the draft records

**Files:**
- Create: `content/equipment/commercial-dry-vacuum.json`
- Create: `content/equipment/backpack-vacuum.json`
- Create: `content/equipment/commercial-steam-cleaner.json`

**Interfaces:**
- Consumes: `EquipmentProfile` in `lib/equipment.ts`, published brand slugs and Task 2 evidence.
- Produces: three validator-compliant draft equipment records.

- [ ] Add identity, scope, system flow, variants, performance metrics, applications, component families, representative models, procurement decisions, engineering checks, standards, developments and sources.
- [ ] Keep dry-only, backpack and steam-cleaning claims within their separate operating and reporting boundaries.
- [ ] Run `npm run test:equipment` and make the contract green without weakening its evidence gates.

### Task 4: Add responsive verification diagrams

**Files:**
- Create: `public/images/equipment/commercial-dry-vacuum/component-verification-map.svg`
- Create: `public/images/equipment/commercial-dry-vacuum/component-verification-map-mobile.svg`
- Create: `public/images/equipment/backpack-vacuum/component-verification-map.svg`
- Create: `public/images/equipment/backpack-vacuum/component-verification-map-mobile.svg`
- Create: `public/images/equipment/commercial-steam-cleaner/component-verification-map.svg`
- Create: `public/images/equipment/commercial-steam-cleaner/component-verification-map-mobile.svg`

**Interfaces:**
- Consumes: each profile's component stack and declared source IDs.
- Produces: evidence-bounded desktop and mobile diagrams with compatibility warnings.

- [ ] Draw four verification zones per category using the established WCB equipment visual system.
- [ ] Include `Family labels do not establish cross-model compatibility` in every SVG.
- [ ] Extend the batch test to assert SVG structure and responsive variants.
- [ ] Run the focused equipment suite.

### Task 5: Run rendered QA and publish

**Files:**
- Modify: the three new JSON records.
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Consumes: draft routes through the existing equipment renderer.
- Produces: published profiles included in static generation, directory and sitemap.

- [ ] Check all pages at 1440 x 1000 and 390 x 844 for title wrapping, empty sections, image match, overflow, broken assets and console errors.
- [ ] Add publication and sitemap assertions first and verify failure while records remain drafts.
- [ ] Change all three records to `published` and verify the focused suite passes.

### Task 6: Verify and release through Git

**Files:**
- No new production files unless a failing regression test proves a shared defect.

**Interfaces:**
- Consumes: complete feature branch.
- Produces: production pages on `worldcleanbiz.com` from GitHub `main`.

- [ ] Run every project test script, `git diff --check`, sourcing verification and `npm run build`.
- [ ] Rebase on the latest `origin/main` and rerun validation.
- [ ] Push the branch, create a PR and wait for Vercel Preview `READY`.
- [ ] Merge through GitHub, wait for production `READY`, then verify all three URLs, images, console and sitemap entries.

