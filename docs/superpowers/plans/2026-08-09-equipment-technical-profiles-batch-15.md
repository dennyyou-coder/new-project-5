# Equipment Technical Profiles Batch Fifteen Implementation Plan

**Goal:** Publish washer-dryer combo, heat-pump dryer, and dehumidifier technical profiles with auditable evidence, official visuals, responsive component-verification diagrams, and production discovery.

**Architecture:** Reuse the existing JSON-driven equipment route, validator, directory and sitemap. Add only page-local records and visual assets plus a batch-specific regression gate; do not change shared rendering code.

**Tech Stack:** Next.js 15, TypeScript, JSON content records, Node test runner, Sharp, SVG, Vercel Git deployments.

## Global Constraints

- Exact slugs: `washer-dryer-combo`, `heat-pump-dryer`, `dehumidifier`.
- At least seven reliable official or primary sources per page.
- Six to eight representative models across at least four published WCB brand profiles per page.
- One official 1600 x 1000 WebP hero, two official 1500 x 900 WebP content images, and responsive WCB SVGs per page.
- No ownership, OEM, factory, component-supplier or cross-model compatibility inference.
- No article, brand, ownership, shared component, navigation or global-style edits.

## Tasks

### 1. Add the batch-fifteen release gate

- Add failing record and sitemap tests for the three exact slugs.
- Assert published state, schema validity, at least seven sources, six to eight models, four published brands, exact visual placements and dimensions, responsive diagrams, and no component `href` fields.
- Run `npm run test:equipment` and confirm only the new expectations fail because the profiles are absent.

### 2. Research and create the three profiles

- Collect exact official URLs, regional model names, source measurements, test conditions, standards, manual limitations, and full-resolution official visual URLs.
- Populate complete `EquipmentProfile` records with evidence, scope, source IDs, verification dates, buyer checks, engineering checks and limitations.
- Keep washer and dryer capacities separate; retain dryer test basis; retain dehumidifier temperature/humidity rating conditions.

### 3. Build the page-local visual packages

- Inspect and convert official images to one exact 1600 x 1000 hero and two exact 1500 x 900 content WebPs per page.
- Create desktop and mobile WCB component-verification diagrams with the exact sentence `Family labels do not establish cross-model compatibility`.
- Verify every local path, format, dimension, alt description and official asset URL.

### 4. Turn the release gate green and verify the site

- Run `npm run test:equipment`, all repository `test:*` scripts, `npm run verify:content-classification`, sourcing SEO verification, production build and `git diff --check`.
- Inspect all three pages at 1440 x 1000 and 390 x 844 for alignment, empty sections, image relevance, broken assets, overflow and browser errors.
- Click the Components navigation item on each page and verify its anchor target.

### 5. Release through GitHub and Vercel

- Re-fetch `origin/main`, merge if it moved, repeat focused tests and build, and stage only the three JSON records, fifteen page-local assets, two batch documents and the test file.
- Push `codex/equipment-batch-15-20260809`, create a ready PR and wait for the Vercel Preview result.
- Squash-merge the approved PR, wait for the Git-triggered production deployment, and verify the three live routes, heroes, directory links and sitemap entries.
