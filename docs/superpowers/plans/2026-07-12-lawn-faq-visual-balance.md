# Lawn FAQ Visual Balance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an existing lawn-robot image to the FAQ introduction column so the desktop section is visually balanced without changing FAQ content or behavior.

**Architecture:** Add a lawn-scoped image element inside the existing FAQ introduction wrapper, then add lawn-scoped desktop and mobile presentation rules. Extend the existing sourcing verifier so the visual hook, image path, alt text and CSS scope cannot silently regress.

**Tech Stack:** Next.js 15, React, CSS, Node verification script

## Global Constraints

- Reuse `/images/sourcing/lawn-robots/rm-03-awd-slope.png`.
- Do not change FAQ questions, answers, accordion behavior, forms, tracking, shared layout or Pool Robots.
- Keep every new selector scoped beneath `.sourcing-lawn-page`.
- Preserve a single-column mobile reading order and prevent horizontal overflow.

---

### Task 1: Add and verify the FAQ balancing image

**Files:**
- Modify: `scripts/verify-sourcing-seo.mjs`
- Modify: `components/SourcingProductPage.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: existing lawn FAQ markup and `/images/sourcing/lawn-robots/rm-03-awd-slope.png`
- Produces: `.sourcing-lawn-faq-visual` image hook scoped to the lawn page

- [ ] **Step 1: Write the failing verification**

Add checks requiring `sourcing-lawn-faq-visual`, the approved image path, meaningful alt text and a lawn-scoped CSS selector.

- [ ] **Step 2: Run the verifier and confirm RED**

Run `BASE_URL=http://127.0.0.1:3101 npm run verify:sourcing-seo`.

Expected: failure reporting the missing FAQ visual hook.

- [ ] **Step 3: Add the minimal markup and styles**

Insert the image after the FAQ introduction paragraph. Style it at full column width with a `16 / 10` aspect ratio, `object-fit: cover`, the lawn rule border and 10px radius. Keep it full width between the introduction and accordion on mobile.

- [ ] **Step 4: Verify GREEN and responsive layout**

Run the sourcing verifier, then inspect 1280px and 390px layouts. Confirm the image renders, the FAQ columns share a top edge, mobile order is correct, no horizontal overflow exists and Pool Robots contains no FAQ visual hook.

- [ ] **Step 5: Build, commit, push and confirm Preview**

Run `npm run build`, commit only the three implementation files, push the current branch, and confirm the newest Vercel Preview is Ready. Do not deploy production.
