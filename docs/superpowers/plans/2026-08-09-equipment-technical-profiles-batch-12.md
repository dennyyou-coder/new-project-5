# Equipment Technical Profiles Batch Twelve Implementation Plan

**Goal:** Publish three verified technical equipment pages for household upright vacuums, household carpet cleaners, and robotic pool cleaners.

**Architecture:** Reuse the existing JSON-driven equipment renderer and directory discovery. Add only three schema-compatible content records, page-local official images and responsive WCB diagrams, plus narrow regression coverage in the existing equipment test.

**Tech Stack:** Next.js 15, React, JSON content records, Node test runner, Sharp/WebP assets, SVG, Vercel Git deployment.

## Global Constraints

- Work only in the isolated `codex/equipment-batch-12-20260809` branch.
- Do not modify articles, ownership pages, brand pages, component pages, shared components, global styles, or navigation.
- Use at least seven reliable sources and six to eight models from four published brand profiles per page.
- Official photos only; no AI product images, third-party logo sites, copied search-result screenshots, or uncertain subjects.
- Component-family names remain unlinked and do not establish cross-model compatibility.
- Publish through GitHub `main` and Vercel Git integration; never use `vercel --prod`.

## Task 1: Batch-twelve release contract

- Add failing test expectations for the three exact slugs, technical boundaries, evidence, models, brand links, visual dimensions, responsive diagrams and sitemap discovery.
- Run `npm run test:equipment` and confirm failure because the records are absent.

## Task 2: Profile data and official visual assets

- Create `content/equipment/upright-vacuum-cleaner.json` and its local visual package.
- Create `content/equipment/household-carpet-cleaner.json` and its local visual package.
- Create `content/equipment/robotic-pool-cleaner.json` and its local visual package.
- Populate schema-complete technical data from declared official evidence only.
- Run `npm run test:equipment` and confirm the suite turns green.

## Task 3: Repository and rendered-page verification

- Run every `test:*` script, content-classification and sourcing-SEO verification, `git diff --check`, and production build.
- Inspect all three pages at 1440 x 1000 and 390 x 844 for image integrity, wrapping, tables, component navigation, overflow and browser errors.
- Push the feature branch, create and validate a ready Preview, squash-merge to `main`, then verify the Git-triggered production deployment, routes, images, directory and sitemap.
