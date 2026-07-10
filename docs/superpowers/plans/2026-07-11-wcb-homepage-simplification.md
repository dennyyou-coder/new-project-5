# WCB Homepage Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shorten the WCB homepage into a six-module commercial journey that prioritizes sourcing and WCE leads while preserving industry authority, navigation, SEO language, and newsletter capture.

**Architecture:** Replace the long `HomePage` composition with six focused sections while reusing the current content loader and lead-form components. Add isolated `home-v9-*` styles so unrelated pages remain unchanged, and remove the global header report CTA as specified by the approved design.

**Tech Stack:** Next.js 15 App Router, React, TypeScript, CSS, Node test runner, Tally lead forms.

## Global Constraints

- Keep navigation names, order, routes, and homepage URL unchanged.
- Preserve one homepage H1 and the core cleaning-category SEO terms.
- Do not rewrite articles, change slugs, restructure the project, or deploy production.
- Primary conversion is sourcing/business opportunity; newsletter is secondary.
- WCE exhibitor/partner and visitor/update actions must remain separate.
- Validate desktop, 390px mobile, forms, images, links, tests, and build.

---

### Task 1: Lock the homepage contract

**Files:**
- Create: `tests/homepageStructure.test.mjs`

**Interfaces:**
- Consumes: `app/page.tsx`, `components/Header.tsx`
- Produces: regression coverage for section count, CTA intent, SEO wording, and removal of the header report CTA

- [ ] Write source-level tests that require six named homepage sections, `Start A Sourcing Inquiry`, `Get Industry Updates`, separate WCE exhibitor and visitor forms, exactly three featured insights, and no `TallyReportButton` in the header.
- [ ] Run `node --test tests/homepageStructure.test.mjs` and confirm the assertions fail against the old homepage.

### Task 2: Implement the simplified homepage

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/HomeUpdatesForm.tsx`
- Modify: `components/Header.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `getInsights()`, `TallyButton`, existing image assets and stable routes
- Produces: six-section homepage with sourcing, newsletter, WCE exhibitor, WCE visitor, article, report, About, Blog, Reports, Sourcing, and WCE links

- [ ] Replace the old repeated categories, full biography timeline, detailed sourcing process, and four-report grid with the six approved modules.
- [ ] Keep six categories as compact crawlable hero labels and retain the core category terms in the H1/supporting copy.
- [ ] Change the newsletter button copy to `Get Industry Updates` and connect WCE exhibitor and visitor buttons to their separate configured forms.
- [ ] Remove the fixed header report CTA without changing the navigation.
- [ ] Add responsive `home-v9-*` styles, keeping 390px free of horizontal overflow.
- [ ] Re-run `node --test tests/homepageStructure.test.mjs` and confirm it passes.

### Task 3: Verify and publish Preview

**Files:**
- Modify only if verification finds an in-scope homepage regression.

**Interfaces:**
- Consumes: completed homepage implementation
- Produces: verified Vercel Preview URL

- [ ] Run `npm run test:lead`, `node --test tests/homepageStructure.test.mjs`, and `npm run build`.
- [ ] Verify `/` in a browser at desktop and 390px: one H1, no overflow, no broken images, no console errors, complete navigation, and correct Tally popup IDs.
- [ ] Deploy with `vercel deploy --yes` to Preview only, inspect for `Ready`, and hand off the Preview URL.
