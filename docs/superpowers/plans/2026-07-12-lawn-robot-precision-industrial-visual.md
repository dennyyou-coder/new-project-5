# Lawn Robot Precision Industrial Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved Precision Industrial Editorial visual system to the lawn robot sourcing page without changing its content, funnel behavior or sibling sourcing pages.

**Architecture:** Add one conditional lawn-page class to the existing page root, then scope all new visual tokens and refinements beneath that class. Extend the existing sourcing verifier with regression guards before implementing the CSS.

**Tech Stack:** Next.js 15, React 19, global CSS, Node verification script.

## Global Constraints

- Preserve all visible English copy and section order.
- Preserve form and GA4 tracking behavior.
- Do not add dependencies or new image assets.
- Keep `/sourcing/pool-robots` visually unchanged.

---

### Task 1: Add visual isolation guards

**Files:**
- Modify: `scripts/verify-sourcing-seo.mjs`

- [ ] Add assertions for the lawn-only root class and visual tokens.
- [ ] Run the verifier and confirm it fails because the class and tokens do not exist.
- [ ] Commit the failing guard.

### Task 2: Implement the scoped editorial system

**Files:**
- Modify: `components/SourcingProductPage.tsx`
- Modify: `app/globals.css`

- [ ] Add the conditional `sourcing-lawn-page` root class.
- [ ] Implement scoped color tokens, typography, rules, selector, profile, framework, FAQ and final CTA styling.
- [ ] Add responsive rules for tablet and mobile.
- [ ] Run the verifier and build until both pass.
- [ ] Commit the implementation.

### Task 3: Render and verify

**Files:**
- No committed file changes expected.

- [ ] Inspect desktop and mobile screenshots in the browser.
- [ ] Switch product models and open an FAQ item.
- [ ] Check console health, overflow and pool-page isolation.
- [ ] Fix any visible mismatch, rerun verification and push the feature branch.
