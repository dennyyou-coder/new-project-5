# WCB Expo Visitor Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the user-selected premium WCB Expo homepage entry and complete visitor-first landing page using verified 2026 event facts.

**Architecture:** Add `/wcb-expo` as the canonical App Router page, keep the legacy route as a permanent redirect, and reuse the current lead-form integration with separate visitor and exhibitor intents. The Expo experience uses a dedicated generated hero image plus existing WCB photography and category assets, with scoped CSS inside the current visual system.

**Tech Stack:** Next.js App Router, React, TypeScript, existing Tally lead forms, global CSS, Node test runner.

## Global Constraints

- Public navigation label: `WCB Expo`.
- English full name: `2026 WCB International Cleaning Appliance Expo`.
- Chinese full name: `2026 WCB 国际清洁电器博览会`.
- Confirmed event details: `18–20 November 2026`, `Suzhou Shishan Convention Center`, `Suzhou, China`.
- Visitor planning is primary; exhibitor information remains secondary.
- No unverified country counts, scale claims, leadership claims or free-registration claims.
- Production release is excluded from this plan.

---

### Task 1: Canonical route and naming regression tests

**Files:**
- Modify: `tests/expoConversion.test.mjs`
- Modify: `tests/homepageStructure.test.mjs`
- Modify: `tests/dennyIdentityConsistency.test.mjs`

**Interfaces:**
- Consumes: current page-source regression test conventions.
- Produces: failing assertions for `/wcb-expo`, canonical naming, visitor-first CTAs, homepage entry and the legacy redirect.

- [ ] **Step 1: Write failing tests** that read `app/wcb-expo/page.tsx`, `app/world-clean-expo/page.tsx`, navigation, homepage and sitemap sources.
- [ ] **Step 2: Run focused tests and verify RED** with missing canonical route and old naming failures.
- [ ] **Step 3: Implement only the route, navigation and sitemap changes needed for GREEN.**
- [ ] **Step 4: Run focused tests and verify GREEN.**

### Task 2: Visitor-first WCB Expo landing page

**Files:**
- Create: `app/wcb-expo/page.tsx`
- Modify: `app/globals.css`
- Add: `public/images/expo/wcb-expo-2026-hero.png`
- Modify: `tests/expoConversion.test.mjs`

**Interfaces:**
- Consumes: `TallyButton`, existing category images and confirmed event details.
- Produces: accessible sections and stable `#visitor-interest` and `#exhibitor-interest` anchors.

- [ ] **Step 1: Extend the test with failing assertions** for prior-event proof, seven categories, supply-chain participants, three event programs and exact inquiry tracking values.
- [ ] **Step 2: Run the focused test and verify RED.**
- [ ] **Step 3: Build the page** with the selected dark-navy visual hierarchy, real imagery, accurate copy and working CTA anchors/forms.
- [ ] **Step 4: Add responsive scoped styles** without horizontal overflow at 390px.
- [ ] **Step 5: Run the focused test and verify GREEN.**

### Task 3: Homepage campaign entrance

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/homepageStructure.test.mjs`

**Interfaces:**
- Consumes: canonical `/wcb-expo` route and `#visitor-interest` anchor.
- Produces: a direct event module immediately below the homepage hero.

- [ ] **Step 1: Write a failing structure assertion** for the campaign module, exact date/place and `Plan Your Visit` link.
- [ ] **Step 2: Run the homepage test and verify RED.**
- [ ] **Step 3: Add the campaign module** using concise event copy and visitor-first hierarchy.
- [ ] **Step 4: Run the homepage test and verify GREEN.**

### Task 4: Current-interface naming migration

**Files:**
- Modify: `components/Header.tsx`
- Modify: `components/Footer.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/manifest.ts`
- Modify: current event references identified by focused search only.

**Interfaces:**
- Consumes: canonical event route and naming rules.
- Produces: consistent current navigation and metadata without altering historical article records.

- [ ] **Step 1: Add or extend failing identity assertions** for current interface surfaces.
- [ ] **Step 2: Run identity tests and verify RED.**
- [ ] **Step 3: Update current interface copy and links** while leaving historical content unchanged.
- [ ] **Step 4: Run identity tests and verify GREEN.**

### Task 5: Build, browser verification and design QA

**Files:**
- Create: `design-qa.md`
- Create: local verification screenshots under `.superpowers/verification/`

**Interfaces:**
- Consumes: selected visual target and working local implementation.
- Produces: evidence-backed desktop/mobile QA and a locally reviewable URL.

- [ ] **Step 1: Run all focused tests and `npm run build`.**
- [ ] **Step 2: Start the local site and inspect `/` and `/wcb-expo` at desktop and 390px.**
- [ ] **Step 3: Test navigation, primary CTA, both forms, legacy redirect, console errors and horizontal overflow.**
- [ ] **Step 4: Capture the implementation and compare it with the selected option 1 visual at the same desktop width.**
- [ ] **Step 5: Record findings in `design-qa.md`, fix every P0–P2 issue and repeat until `final result: passed`.**
- [ ] **Step 6: Keep the local preview running and hand off the preview URL without deploying production.**
