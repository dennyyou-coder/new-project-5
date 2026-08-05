# Brand Database Completion and Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish nine corrected brand profiles and one independent Metabo profile through the approved GitHub-to-Vercel release path.

**Architecture:** Retain the existing JSON-driven Brand Intelligence routes and components. Strengthen only content records, brand-local assets, article relationships, category mappings and focused release gates.

**Tech Stack:** Next.js, TypeScript, JSON brand records, Node test runner, Sharp-compatible WebP assets, GitHub and Vercel Git integration.

## Global Constraints

- Do not touch unrelated user files, homepage, navigation or shared visual architecture.
- Do not infer product-level manufacturer, factory or origin from group ownership.
- Do not generate, redraw or source logos from third-party logo aggregators.
- Do not use `vercel --prod`; production must come from GitHub `main`.

---

### Task 1: Establish the 56-profile release gate

**Files:**
- Modify: `tests/brandIntelligence.test.mjs`
- Modify: `tests/brandExperience.test.mjs`

**Interfaces:** Existing `loadBrands()` and profile schema are the public behavior; the test produces an exact published-slug gate and ten identity/asset assertions.

- [ ] Add the ten slugs to the expected published set and assert Metabo remains distinct from `hikoki`.
- [ ] Assert official local logos, 1600 x 1000 heroes, two content visuals and three article relationships for each profile.
- [ ] Assert entity-boundary phrases and reject the known unrelated desert visual for the ten profiles.
- [ ] Run `npm run test:brands` and confirm RED because the drafts and Metabo do not yet satisfy the release gate.

### Task 2: Correct the nine existing records

**Files:**
- Modify: `content/brands/{bosch-power-tools,craftsman,kobalt,skil,hilti,festool,hikoki,flex,dremel}.json`

**Interfaces:** Each file must satisfy `BrandProfile` in `lib/brands.ts`, preserving `evidence`, `scope` and `buyerCheck` objects.

- [ ] Replace parent or regional operator values incorrectly placed in `legalName` with precise `legalEntityNote` language.
- [ ] Replace irrelevant or generic URLs with exact official corporate, warranty, regulatory or announcement sources.
- [ ] Correct ownership, trademark, operating and regional warranty boundaries without product-level extrapolation.
- [ ] Set `status` to `published` only after its asset package and evidence checks pass.

### Task 3: Create the independent Metabo record

**Files:**
- Create: `content/brands/metabo.json`
- Modify: `lib/brandCategories.ts`
- Modify only evidence-relevant article frontmatter under `content/insights/`.

**Interfaces:** The new slug is `metabo`; primary category is `power-tools`; article relationships use existing `primary_brands` or `related_brands` arrays.

- [ ] Establish Koki Holdings ownership, Metabo legal/operating scope and official regional websites.
- [ ] Separate global Metabo, Metabo HPT, HiKOKI, CAS and MultiVolt identities.
- [ ] Add three legitimate existing article relationships without rewriting article bodies.
- [ ] Add Metabo to Power Tools and no unsupported secondary category.

### Task 4: Replace and add brand-local visual packages

**Files:**
- Modify/create: `public/images/brands/{slug}/logo.webp`
- Modify/create: `public/images/brands/{slug}/hero.webp`
- Modify/create: `public/images/brands/{slug}/visual-*.webp`

**Interfaces:** JSON paths remain `/images/brands/{slug}/...`; logos preserve official artwork; heroes are 1600 x 1000 WebP.

- [ ] Download official logos and real official product/brand-scene images, recording the source URL in JSON.
- [ ] Replace promotional, blurred and mismatched heroes and invisible light logos.
- [ ] Build two readable evidence-led WCB diagrams per brand from the verified JSON facts.
- [ ] Verify dimensions, decoding, captions, alt text and section placement.

### Task 5: Turn the release gate GREEN

**Files:** All files from Tasks 1-4.

- [ ] Run `npm run test:brands` and fix only factual, structural or asset defects.
- [ ] Run the adjacent test scripts in `package.json` and preserve all existing behavior.
- [ ] Run `npm run build` and confirm all ten routes and sitemap entries are generated.
- [ ] Review `git diff --check`, the full diff and changed-file scope.

### Task 6: Browser and Preview verification

**Files:** No source changes unless a reproducible brand-page defect is found; any fix begins with a failing test.

- [ ] Start the local production app and verify `/brands` plus all ten routes at desktop and 390 px.
- [ ] Check image loading, heading wraps, evidence tables, horizontal overflow, internal links and browser errors.
- [ ] Push the feature branch and obtain the Vercel Git Preview URL.
- [ ] Repeat representative directory and ten-route checks on Preview.

### Task 7: GitHub-main production release

**Files:** No additional product files.

- [ ] Stage only reviewed brand-scope changes and create an intentional commit.
- [ ] Open a ready pull request with source, visual and verification details.
- [ ] Merge the reviewed branch into `main` and confirm the merge commit is present on GitHub.
- [ ] Wait for the Git-triggered Vercel production deployment; verify `/brands`, all ten routes, assets, sitemap, mobile layout and console state on `worldcleanbiz.com`.
