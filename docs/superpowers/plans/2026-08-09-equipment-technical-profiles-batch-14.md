# Equipment Technical Profiles Batch Fourteen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish front-load washing machine, dishwasher, and air purifier technical profiles with auditable evidence, official visuals, responsive component-verification diagrams, and production discovery.

**Architecture:** Reuse the existing JSON-driven equipment route, validator, directory and sitemap. Add only page-local records and visual assets plus a batch-specific regression gate; do not change shared rendering code.

**Tech Stack:** Next.js 15, TypeScript, JSON content records, Node test runner, Sharp, SVG, Vercel Git deployments.

## Global Constraints

- Exact slugs: `front-load-washing-machine`, `dishwasher`, `air-purifier`.
- At least seven reliable official or primary sources per page.
- Six to eight representative models across at least four published WCB brand profiles per page.
- One official 1600 x 1000 WebP hero, two official 1500 x 900 WebP content images, and responsive WCB SVGs per page.
- No ownership, OEM, factory, component-supplier or cross-model compatibility inference.
- No article, brand, ownership, shared component, navigation or global-style edits.

---

### Task 1: Add the batch-fourteen release gate

**Files:**
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Consumes: `getEquipmentProfiles`, `validateEquipmentProfile`, published brand slugs and `sitemap()`.
- Produces: failing expectations for the three exact slugs, evidence counts, model relationships, visual dimensions and sitemap discovery.

- [ ] **Step 1: Write the failing test**

Add a `fourteenth equipment batch` test matching the prior batch gate, with definition expressions for a horizontal-axis front-load washer, an automatic rack-and-spray dishwasher, and a portable room air cleaner. Assert published state, schema validity, at least seven sources, six to eight models, at least four brand slugs, three visual placements, official WebP dimensions, responsive diagrams and absence of component `href` fields.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:equipment`

Expected: the two new batch-fourteen tests fail because the three profiles and sitemap URLs do not exist; the prior 42 tests pass.

### Task 2: Research and create the three profiles

**Files:**
- Create: `content/equipment/front-load-washing-machine.json`
- Create: `content/equipment/dishwasher.json`
- Create: `content/equipment/air-purifier.json`

**Interfaces:**
- Consumes: `content/equipment/README.md`, official manufacturer pages/manuals, applicable standards or regulator sources, and published brand slugs.
- Produces: three complete `EquipmentProfile` records accepted by `validateEquipmentProfile`.

- [ ] **Step 1: Collect exact official evidence**

For each page record at least seven current official URLs, exact regional model names, measurement units, standards jurisdiction, manual limitations, and official full-resolution visual URLs. Use only published WCB brand slugs for model relationships.

- [ ] **Step 2: Write the minimal valid records**

Populate identity, scope, hero provenance, key facts, system flow, variants, metrics, application fit, component stack, six to eight models, procurement decisions, engineering checks, standards, one dated official development, sources and verification dates. Set `status` to `published` only because the user has standing batch approval and release still remains gated by tests, build and visual review.

- [ ] **Step 3: Keep evidence and WCB assessment separate**

Every factual row must include `evidence`, `scope`, `sourceIds`, and `verifiedAt`; every recommendation must expose its basis, limitation and buyer action. Component families must not contain `href`.

### Task 3: Build the page-local visual packages

**Files:**
- Create: `public/images/equipment/front-load-washing-machine/*`
- Create: `public/images/equipment/dishwasher/*`
- Create: `public/images/equipment/air-purifier/*`

**Interfaces:**
- Consumes: exact official image URLs declared by the JSON records.
- Produces: `hero.webp`, `type-format.webp`, `application-use.webp`, `component-verification-map.svg`, and `component-verification-map-mobile.svg` for each slug.

- [ ] **Step 1: Inspect and convert official images**

Download official source images, visually confirm product and context, crop without altering factual content, and convert the hero to exactly 1600 x 1000 WebP and content images to exactly 1500 x 900 WebP.

- [ ] **Step 2: Create responsive component diagrams**

Create desktop and mobile diagrams using the established WCB visual language. Each diagram maps only category-level component families and includes the exact sentence `Family labels do not establish cross-model compatibility`.

- [ ] **Step 3: Verify asset paths and dimensions**

Run Sharp metadata checks for all nine WebP assets and parse all six SVG files. Confirm every local path matches its JSON record.

### Task 4: Turn the release gate green and verify the site

**Files:**
- Test: `tests/equipmentIntelligence.test.mjs`
- Verify: all files created in Tasks 2 and 3

**Interfaces:**
- Consumes: the completed profiles and assets.
- Produces: a validated build, responsive page evidence and release-ready branch.

- [ ] **Step 1: Run focused tests**

Run: `npm run test:equipment`

Expected: all 44 tests pass, including the batch-fourteen record and sitemap gates.

- [ ] **Step 2: Run repository regression and production build**

Run every `test:*` script, `npm run verify:content-classification`, the sourcing SEO verifier against a local production server, `npm run build`, and `git diff --check`. Expected: zero failures and all three routes listed in static generation.

- [ ] **Step 3: Inspect desktop and mobile rendering**

At 1440 x 1000 and 390 x 844, inspect all three pages for title alignment, empty space, image relevance, broken assets, table overflow and console errors. Click at least one section-navigation link on each page and verify the anchor destination.

### Task 5: Release through GitHub and Vercel

**Files:**
- Release the exact scoped diff only.

**Interfaces:**
- Consumes: verified feature commit and standing production authorization.
- Produces: merged GitHub PR and Git-triggered Vercel production deployment.

- [ ] **Step 1: Re-sync and commit**

Fetch `origin/main`, merge it if needed, repeat the focused test and build, stage only the three JSON records, fifteen page-local assets, two batch documents and test file, then create one scoped commit.

- [ ] **Step 2: Validate Preview**

Push `codex/equipment-batch-14-20260809`, create a ready PR, wait for Vercel Preview `READY`, confirm zero build errors and verify the three Preview routes.

- [ ] **Step 3: Merge and verify production**

Squash-merge the PR, wait for the GitHub-triggered production deployment to reach `READY`, and verify all three live routes, heroes, equipment-directory links, sitemap entries and route-specific runtime errors.
