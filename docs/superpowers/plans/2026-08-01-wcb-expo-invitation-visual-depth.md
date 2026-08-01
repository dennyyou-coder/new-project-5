# WCB Expo Direct Invitation And Visual Depth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage state that the 2026 WCB Expo is in preparation and directly invite visitors, while turning the event landing page into a richer image-led visitor experience.

**Architecture:** Keep the existing `/wcb-expo` route, Tally conversion flow and dark-navy design system. Extend the page with data-driven image sections that reuse verified WCB event photography, and strengthen the existing homepage campaign module instead of adding another promotional block.

**Tech Stack:** Next.js App Router, React, TypeScript, existing Tally lead forms, scoped global CSS, Node test runner.

## Global Constraints

- Current status wording: `2026 WCB Expo Is Now In Preparation`.
- Direct homepage invitation: `2026 WCB Expo Is Coming To Suzhou. We Invite You To Join Us.`
- Confirmed event details remain `18–20 November 2026`, `Suzhou Shishan Convention Center`, `Suzhou, China`.
- Visitor planning remains primary; exhibitor information remains secondary.
- Prior-event images must be identified as previous WCB gatherings, not the November 2026 show.
- No new unverified attendance, country, scale, leadership or registration claims.
- Production release remains excluded; update only the existing feature-branch Preview.

---

### Task 1: Direct invitation regression tests

**Files:**
- Modify: `tests/homepageStructure.test.mjs`
- Modify: `tests/expoConversion.test.mjs`

**Interfaces:**
- Consumes: existing source-based homepage and Expo regression tests.
- Produces: assertions for direct preparation copy, the single homepage visitor CTA, image-led visit reasons, prior-event gallery and the final Suzhou invitation.

- [ ] **Step 1: Add failing homepage assertions** for `2026 WCB Expo Is Now In Preparation`, the direct invitation headline and one `/wcb-expo#visitor-interest` CTA.
- [ ] **Step 2: Add failing Expo assertions** for the preparation band, four visit reasons, prior-event gallery, four participant groups and final Suzhou invitation.
- [ ] **Step 3: Run `node --test tests/homepageStructure.test.mjs tests/expoConversion.test.mjs` and verify the new assertions fail.**

### Task 2: Strengthen the homepage campaign

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `/wcb-expo#visitor-interest` and confirmed event facts.
- Produces: one direct, visitor-led homepage invitation module.

- [ ] **Step 1: Replace the abstract campaign eyebrow and headline** with the approved preparation status and invitation.
- [ ] **Step 2: Add one concise preparation sentence** and retain date and venue.
- [ ] **Step 3: Keep only the `Plan Your Visit` primary action** and ensure responsive styles preserve the full headline at 390px.
- [ ] **Step 4: Run the homepage test and verify it passes.**

### Task 3: Add image-led landing-page depth

**Files:**
- Modify: `app/wcb-expo/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: existing images under `public/images/industry/` and `public/images/expo/`.
- Produces: preparation status, `Why Visit`, prior-event gallery, `Who You Will Meet`, larger program imagery and final invitation sections.

- [ ] **Step 1: Update the hero copy** to state the show is in preparation and invite visitors to Suzhou.
- [ ] **Step 2: Add the preparation-status band** with date, venue, visitor-interest status and seven-category scope.
- [ ] **Step 3: Add four image-led visit-reason cards** using relevant product, manufacturing, matchmaking and forum photography.
- [ ] **Step 4: Add a four-image previous-WCB-gatherings gallery** with an explicit historical label and accurate alternative text.
- [ ] **Step 5: Convert the supply-chain participant explanation into an image-led `Who You Will Meet` section.**
- [ ] **Step 6: Increase program-image prominence and add a full-width final visitor invitation.**
- [ ] **Step 7: Add desktop and 390px responsive styling, then run the focused Expo test.**

### Task 4: Verify and update Preview

**Files:**
- Modify: `design-qa.md`
- Add: final screenshots under `.superpowers/verification/`

**Interfaces:**
- Consumes: approved visual direction, updated page and existing Vercel feature branch.
- Produces: passing tests, production build, desktop/mobile QA and a refreshed Vercel Preview.

- [ ] **Step 1: Run all affected tests and `npm run build`.**
- [ ] **Step 2: Verify `/` and `/wcb-expo` at desktop and 390px, including image loading, overflow, CTA behavior and console errors.**
- [ ] **Step 3: Update `design-qa.md` with comparison history and final screenshots; fix all P0–P2 findings.**
- [ ] **Step 4: Commit and push the same feature branch so Vercel refreshes the existing Preview without touching `main`.**
