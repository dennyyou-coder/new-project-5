# Brand Founder Portrait Cards Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add compact, source-backed founder portrait cards to the Leadership section of the first four World Clean Biz brand profiles without duplicating leaders or weakening the existing evidence standard.

**Architecture:** Extend the brand leadership data contract with an optional local portrait object, validate its provenance and path, partition one featured portrait leader from the remaining leadership rows, and render a reusable responsive card. Profiles without complete portrait data retain the existing leadership table.

**Tech Stack:** Next.js, React, TypeScript, CSS, Node test runner, Sharp, Vercel Preview.

**Constraints:** Use only traceable editorial/official or clearly licensed photographs; store local WebP assets under `/public/images/brands/{slug}/`; preserve existing brand-page SEO and structured data; do not add Person JSON-LD; do not deploy production without explicit approval.

---

### Task 1: Extend and validate the leadership portrait data contract

**Files:**
- Modify: `lib/brands.ts`
- Test: `tests/brandIntelligence.test.mjs`

- [ ] Add a failing validation test for an incomplete portrait record.
- [ ] Add failing tests for a non-HTTPS source URL and a portrait outside `/images/brands/{slug}/`.
- [ ] Define the optional portrait fields on a leadership person: `src`, `alt`, `credit`, `sourceUrl`, and optional `objectPosition`.
- [ ] Validate that a supplied portrait is a record with complete non-empty metadata.
- [ ] Require a local image path within the current brand directory and an HTTPS provenance URL.
- [ ] Run `npm run test:brands` and confirm the focused tests pass.
- [ ] Commit the data-contract change.

### Task 2: Add the portrait-card view model and component

**Files:**
- Create: `components/brands/BrandFounderCard.tsx`
- Modify: `components/brands/brandSectionData.ts`
- Modify: `components/brands/BrandSections.tsx`
- Test: `tests/brandExperience.test.mjs`

- [ ] Add failing tests for selecting one featured portrait leader and leaving all remaining leaders in the table.
- [ ] Add a failing source test that requires the founder card to render the photo, name, role, evidence note, credit, and source link.
- [ ] Implement a partition helper that selects the first leader with complete portrait metadata.
- [ ] Implement `BrandFounderCard` with semantic figure markup, optimized local image rendering, visible credit, and an external source link.
- [ ] Update the Leadership section so the featured founder is not repeated in the table.
- [ ] Preserve the existing table-only fallback when no portrait is present.
- [ ] Run `npm run test:brands` and confirm the focused tests pass.
- [ ] Commit the component change.

### Task 3: Add compact responsive styling

**Files:**
- Modify: `app/globals.css`
- Test: `tests/brandExperience.test.mjs`

- [ ] Add failing style assertions for the founder-card grid, portrait crop, metadata spacing, and source-link treatment.
- [ ] Add failing responsive assertions for the stacked mobile layout and overflow protection.
- [ ] Implement a compact desktop card with a portrait column around 180 pixels wide and a flexible text column.
- [ ] Add mobile rules that stack the portrait above the copy and keep all text and media within the viewport.
- [ ] Match existing World Clean Biz borders, color tokens, typography, and spacing.
- [ ] Run `npm run test:brands` and confirm the focused tests pass.
- [ ] Commit the responsive styling.

### Task 4: Prepare traceable founder photographs

**Files:**
- Create: `public/images/brands/aiper/founder-richard-wang.webp`
- Create: `public/images/brands/dreame/founder-yu-hao.webp`
- Create: `public/images/brands/dyson/founder-james-dyson.webp`
- Create: `public/images/brands/mammotion/founder-jidong-wei.webp`

- [ ] Verify the identity and provenance of each photograph from an official editorial source or a clearly licensed source.
- [ ] Reject any source that is ambiguous, hotlinked, AI-generated, or lacks a defensible editorial-use trail.
- [ ] Crop each verified source to a consistent portrait-friendly aspect ratio while preserving the subject.
- [ ] Convert each asset to WebP with an appropriate quality setting and record dimensions.
- [ ] Confirm each file decodes correctly and is reasonably sized for the web.
- [ ] If any person lacks a defensible photograph, omit that portrait rather than substitute an unverified image; the existing table fallback must remain intact.
- [ ] Commit the verified image assets.

### Task 5: Attach portraits to the first four brand profiles

**Files:**
- Modify: `content/brands/aiper.json`
- Modify: `content/brands/dreame.json`
- Modify: `content/brands/dyson.json`
- Modify: `content/brands/mammotion.json`
- Test: `tests/brandIntelligence.test.mjs`

- [ ] Add failing profile tests for each available portrait’s local path, alt text, credit, source URL, and file existence.
- [ ] Add a failing test that verifies the featured founder is not duplicated in leadership-table rows.
- [ ] Add complete portrait metadata only for images that passed the provenance gate.
- [ ] Keep role and evidence notes source-backed and unchanged unless the existing wording needs a factual correction.
- [ ] Run `npm run test:brands` and confirm the four profiles pass validation.
- [ ] Commit the profile-data change.

### Task 6: Verify pages, build, and create a preview release

**Files:**
- Verify: `app/brands/[slug]/page.tsx`
- Verify: `components/brands/BrandSections.tsx`
- Verify: `app/globals.css`

- [ ] Run the complete Node test suite.
- [ ] Run `npm run build`.
- [ ] Start a local production build and inspect Aiper, Dreame, Dyson, and Mammotion at desktop width.
- [ ] Inspect Aiper and Dyson at a mobile viewport and confirm no horizontal overflow.
- [ ] Confirm all portrait images load, credits and source links render, and the browser console has no new errors.
- [ ] Push `codex/brand-founder-portraits` to GitHub.
- [ ] Create a Vercel Preview deployment from the pushed branch.
- [ ] Recheck the four brand pages on the preview URL.
- [ ] Report the preview URL, tested pages, image provenance, commits, and any profile that intentionally retained the table fallback.
- [ ] Stop before production and obtain explicit approval.

