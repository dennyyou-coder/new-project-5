# Lawn Robot Hybrid Visual Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace repeated lawn-robot landing-page prose with a six-platform opportunity landscape, channel-fit matrix, product imagery and a single evidence flow.

**Architecture:** Add one lawn-only presentational component file containing semantic, dependency-free visual modules. Compose those modules in the existing lawn page, remove three redundant text sections, and scope responsive styling beneath `sourcing-lawn-page` so the pool page remains unchanged.

**Tech Stack:** Next.js 15, React 19, TypeScript, semantic HTML tables, CSS Grid, Node verification script.

## Global Constraints

- Preserve product IDs, image paths, selector interaction, form routing and GA4 parameters.
- Preserve the approved Precision Industrial Editorial palette and container system.
- Label qualitative charts `World Clean Biz editorial assessment`.
- Do not introduce numeric scores, percentages or unsupported market statistics.
- Do not add charting dependencies.
- Keep all ten FAQ items closed on initial load.
- Preserve the pool robot page and unrelated site surfaces.

---

### Task 1: Add failing visual-content guards

**Files:**
- Modify: `scripts/verify-sourcing-seo.mjs`

**Interfaces:**
- Consumes: rendered lawn and pool sourcing HTML plus component source.
- Produces: failures when qualitative charts, six platform labels, ten closed FAQs or lawn-only isolation are missing.

- [ ] Require `Where the Six Product Platforms Compete`, `Which Channels Fit Each Product Platform?`, `World Clean Biz editorial assessment`, and `Four Decisions Before You Back a Platform` in rendered order.
- [ ] Require RM-01 through RM-06 in the visual module source and semantic table headings for five channels.
- [ ] Reject the removed headings `What You Need to Know Before Backing a Product Platform`, `Turn the Opportunity Into a Testable Product Direction`, and `The Four Decisions Behind a Scalable Robotic Mower Program`.
- [ ] Assert ten `<details>` elements and no initially open lawn FAQ.
- [ ] Run the sourcing verifier and confirm it fails on the missing visual modules.
- [ ] Commit the failing guards and plan.

### Task 2: Build semantic decision visuals

**Files:**
- Create: `components/LawnRobotDecisionVisuals.tsx`

**Interfaces:**
- Produces: `LawnRobotOpportunityLandscape`, `LawnRobotChannelMatrix`, `LawnRobotEvidenceFlow`, and `LawnRobotSuccessConditions` React components.

- [ ] Build a two-axis landscape with six labeled platform markers and an accessible summary.
- [ ] Build a semantic table using `Strong fit`, `Conditional fit`, and an em dash.
- [ ] Build three image-backed market-success conditions using existing RM-01, RM-03 and RM-05 assets.
- [ ] Build the four-stage Opportunity, Platform, Supplier and Economics evidence flow.
- [ ] Run TypeScript/build and correct semantic or type failures.

### Task 3: Replace redundant page sections

**Files:**
- Modify: `components/SourcingProductPage.tsx`

**Interfaces:**
- Consumes: the four visual components from `LawnRobotDecisionVisuals.tsx`.
- Produces: Hero → buyer strip → selector → landscape → matrix → success conditions → Denny → evidence flow → FAQ → CTA → related intelligence.

- [ ] Insert the opportunity landscape and channel matrix after the selector.
- [ ] Replace the existing risk cards with `LawnRobotSuccessConditions`.
- [ ] Remove the separate deliverables, process and framework sections.
- [ ] Insert `LawnRobotEvidenceFlow` after the Denny profile.
- [ ] Shorten Denny's visible copy to one judgment paragraph.
- [ ] Preserve all ten FAQ questions and ensure no `<details open>` attribute is added.

### Task 4: Implement scoped responsive styling

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: lawn visual component class names.
- Produces: desktop two-axis map/table/flow and mobile stacked/scrollable equivalents without page overflow.

- [ ] Add landscape axes, marker positions, legend and assessment-note styling.
- [ ] Add a table viewport with a sticky first column and `Swipe to compare` hint on mobile.
- [ ] Add image-backed success-condition cards with consistent crop behavior.
- [ ] Add four connected evidence stages on desktop and a vertical sequence on mobile.
- [ ] Preserve reduced-motion, focus visibility and current page tokens.

### Task 5: Verify and publish Preview

**Files:**
- No committed files expected beyond fixes discovered during QA.

**Interfaces:**
- Consumes: local production build and Vercel Preview.
- Produces: evidence for desktop/mobile rendering, selector interaction, FAQ behavior, no overflow and pool isolation.

- [ ] Run the sourcing verifier and production build.
- [ ] Inspect the accepted hybrid mockup and rendered implementation with `view_image`.
- [ ] Verify desktop 1280×720 and mobile 390×844.
- [ ] Switch RM-03, open one FAQ and confirm the other FAQs remain closed.
- [ ] Confirm the pool page contains no lawn visual modules.
- [ ] Push the feature branch and wait for a Ready Preview without using `vercel --prod`.
