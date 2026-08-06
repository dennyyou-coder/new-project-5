# Home Appliance Brand Batch 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish standalone Hotpoint, Toshiba Appliances, and Panasonic brand pages without creating or modifying ownership SEO articles.

**Architecture:** Follow the existing JSON-driven brand page system. Remove only the article-count dependency from profile validation, then add three fully sourced profiles, dedicated official assets, category mappings, and release-gate coverage. Existing rendering components remain unchanged because they already omit the article section when no tagged articles exist.

**Tech Stack:** Next.js App Router, TypeScript, JSON content profiles, Node test runner, Sharp, SVG/WebP assets, Playwright CLI, GitHub and Vercel Git integration.

## Global Constraints

- Do not create or modify any file under `content/insights/`.
- Do not create a parent-company-only brand page.
- Use at least three reliable sources per profile, prioritizing official company, annual-report, regulator, warranty, compliance, and press materials.
- Use official logos and real official hero images only.
- Keep model-level manufacturer, factory, importer, seller, and warranty responsibility separate from group-level facts.
- Publish only after local tests, build, Preview, desktop, mobile, image, sitemap, and console checks pass.
- Production deployment must be triggered by merging GitHub `main`; never use `vercel --prod`.

---

### Task 1: Enable standalone brand profiles

**Files:**
- Modify: `tests/brandIntelligence.test.mjs`
- Modify: `lib/brands.ts`

**Interfaces:**
- Consumes: `validateBrandProfile(profile, articles)`.
- Produces: a validator that accepts a complete profile even when `articles` contains no matching primary or related entry.

- [ ] Add a test using the existing complete profile fixture and an empty article list; assert that the only previous article-count errors are absent and the profile validates successfully.
- [ ] Run `npm run test:brands` and confirm the new test fails with the article-count validation messages.
- [ ] Remove the two article-count errors from `validateBrandProfile` while preserving article sorting and page-data behavior.
- [ ] Run `npm run test:brands` and confirm the standalone-profile test passes.

### Task 2: Add the three release-gate expectations

**Files:**
- Modify: `tests/brandIntelligence.test.mjs`

**Interfaces:**
- Consumes: `getBrandProfiles`, `getPublishedBrandProfiles`, Sharp metadata, category and sitemap builders.
- Produces: literal expectations for 67 profiles and the three batch-four brand routes and assets.

- [ ] Update the exact published profile count from 64 to 67 and add `hotpoint`, `panasonic`, and `toshiba-appliances` to the sorted slug fixture.
- [ ] Add a batch-four test that asserts exact profile slugs, published status, dedicated logo/hero/content-visual paths, 1600 by 1000 hero dimensions, transparent WebP logos, home-appliance primary categories, and no requirement for tagged articles.
- [ ] Run `npm run test:brands` and confirm failure because the three profiles and category mappings do not exist.

### Task 3: Research and add profile data

**Files:**
- Create: `content/brands/hotpoint.json`
- Create: `content/brands/toshiba-appliances.json`
- Create: `content/brands/panasonic.json`
- Create: `docs/operations/home-appliance-brand-batch-4.md`

**Interfaces:**
- Consumes: the fields and evidence rules in `content/brands/README.md`.
- Produces: three complete `BrandProfile` JSON objects with current sources, buyer checks, dates, and evidence boundaries.

- [ ] Record reviewed official URLs, entity boundaries, visual provenance, category reasoning, and unresolved claims in the operations document.
- [ ] Write each JSON profile with status `published`, at least three unique official sources, two dedicated content visuals, structured manufacturing and channel evidence, relevant published competitor slugs, and publication timestamps on 2026-08-06.
- [ ] Validate JSON syntax with `jq empty content/brands/hotpoint.json content/brands/toshiba-appliances.json content/brands/panasonic.json`.

### Task 4: Add official visual assets

**Files:**
- Create: `public/images/brands/hotpoint/logo.webp`
- Create: `public/images/brands/hotpoint/hero-*.webp`
- Create: `public/images/brands/hotpoint/*.svg`
- Create: `public/images/brands/toshiba-appliances/logo.webp`
- Create: `public/images/brands/toshiba-appliances/hero-*.webp`
- Create: `public/images/brands/toshiba-appliances/*.svg`
- Create: `public/images/brands/panasonic/logo.webp`
- Create: `public/images/brands/panasonic/hero-*.webp`
- Create: `public/images/brands/panasonic/*.svg`

**Interfaces:**
- Consumes: official media URLs documented in each profile and operations record.
- Produces: transparent logos, real 1600 by 1000 heroes, and evidence-based 1600 by 900 SVG diagrams.

- [ ] Download the exact official logo and hero source files to a temporary directory and visually verify their brand, subject, and context.
- [ ] Convert logos to transparent WebP canvases at least 1200 pixels wide and heroes to 1600 by 1000 WebP without distortion.
- [ ] Create two restrained, readable evidence SVGs for each brand using only conclusions supported in its cited sources.
- [ ] Inspect all nine raster assets and six SVGs before continuing.

### Task 5: Add category mappings and pass the release gate

**Files:**
- Modify: `lib/brandCategories.ts`
- Test: `tests/brandIntelligence.test.mjs`

**Interfaces:**
- Consumes: the three new profile slugs.
- Produces: primary and secondary category membership used by directory, profile breadcrumbs, category routes, and sitemap.

- [ ] Add all three slugs to `home-appliances-small-appliances` membership and primary lists in alphabetical order.
- [ ] Add Panasonic to `floorcare-home-cleaning` membership only if official current vacuum evidence was retained in the profile.
- [ ] Run `npm run test:brands` until all brand release-gate assertions pass without weakening evidence or asset rules.

### Task 6: Verify, publish, and validate production

**Files:**
- Verify all changed files; create no new application architecture files.

**Interfaces:**
- Consumes: the completed feature branch.
- Produces: a verified GitHub PR, Vercel Preview, merged `main`, and live production pages.

- [ ] Run all project test scripts, sourcing/content verification, `git diff --check`, and `npm run build`.
- [ ] Start the production build locally and check `/brands/hotpoint`, `/brands/toshiba-appliances`, `/brands/panasonic`, `/brands`, and relevant category routes at 1440 by 1000 and 390 by 844; confirm no horizontal overflow, broken images, abnormal heading wraps, or console errors.
- [ ] Stage only batch-four files, commit, push `codex/home-appliance-brand-batch-4`, and open a ready pull request.
- [ ] Wait for the Git-integrated Vercel Preview, repeat desktop/mobile/image/console checks, and merge only when green.
- [ ] Wait for the GitHub-triggered production deployment, then verify all three live pages, category cards, sitemap entries, images, and browser console on `worldcleanbiz.com`.
