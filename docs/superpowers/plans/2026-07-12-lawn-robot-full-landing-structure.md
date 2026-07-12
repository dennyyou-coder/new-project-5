# Lawn Robot Full Landing Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the approved 12-section conversion structure on `/sourcing/lawn-robots` without changing the pool robot page or existing lead tracking.

**Architecture:** Extend the existing lawn-only branch in `SourcingProductPage` with four focused static sections: buyer fit, sourcing problems, decision framework, and FAQ. Preserve the client-side product selector and existing Tally buttons; use CSS scoped to `sourcing-lawn-*` classes so shared product pages are isolated.

**Tech Stack:** Next.js 15, React 19, TypeScript, existing CSS, Node-based rendered-page verifier.

## Global Constraints

- Website copy remains English.
- No factory names, fabricated cases, unverified specifications, prices, certifications, response times, supplier counts, or client claims.
- Use the approved Denny identity and real photo already in the project.
- Preserve product-specific `product_id` tracking and custom-brief CTA tracking.
- Keep `/sourcing/pool-robots` unchanged.
- Push only the feature branch and Vercel Preview; do not merge `main` or run `vercel --prod`.

---

### Task 1: Define the complete landing-page contract

**Files:**
- Modify: `scripts/verify-sourcing-seo.mjs`

**Interfaces:**
- Consumes: prerendered HTML for the lawn and pool routes.
- Produces: failing checks for buyer fit, sourcing problems, decision framework, FAQ, final CTA, ordering, and pool-page isolation.

- [ ] **Step 1: Add rendered HTML assertions**

Require the lawn page to contain the following strings:

```js
const fullLandingSections = [
  "Built for Buyers Developing or Expanding a Robotic Mower Range",
  "Brands developing a new robotic mower line",
  "Why a Supplier List Is Not Enough",
  "Similar quotations can hide different product platforms",
  "What You Receive Before Making a Supplier Decision",
  "How the Sourcing Discussion Works",
  "What We Look at Before Recommending the Next Step",
  "Are the products shown verified factory models?",
  "Turn Your Product Direction Into a Focused Supplier Search",
  "Start My Sourcing Brief"
];
```

Assert section order using `indexOf()` and require the pool page not to contain the lawn-only buyer-fit heading.

- [ ] **Step 2: Run the verifier and confirm RED**

Run `npm run verify:sourcing-seo` against the current production build. Expected: failures for the new section strings and order requirements.

- [ ] **Step 3: Commit the failing contract**

```bash
git add scripts/verify-sourcing-seo.mjs
git commit -m "test: define full lawn landing structure"
```

---

### Task 2: Implement the full lawn-only section sequence

**Files:**
- Modify: `components/SourcingProductPage.tsx`

**Interfaces:**
- Consumes: existing lawn-only branch, related articles, evaluation points, market notes, and `TallyButton`.
- Produces: the approved section order and English conversion copy.

- [ ] **Step 1: Add the buyer-fit strip after the hero**

Render the B2B qualifier line and four buyer types before the product selector.

- [ ] **Step 2: Add three sourcing problems after the selector**

Use three compact cards with the approved specific headings and explanations. Do not reintroduce the previous generic buyer-problem grid.

- [ ] **Step 3: Reorder deliverables, trust, and process**

Change the deliverables heading to `What You Receive Before Making a Supplier Decision`, keep the four concrete deliverables, then render Denny trust, followed by an independent `How the Sourcing Discussion Works` section.

- [ ] **Step 4: Replace the generic checks section with a decision framework**

Render Product, Supplier, Market, and Execution columns using the approved three checks per category. Do not present this as a customer case.

- [ ] **Step 5: Add seven FAQs**

Use native `<details>` and `<summary>` elements. The concept-product answer must state that final models, specifications, and availability require verification against the buyer brief.

- [ ] **Step 6: Rewrite final CTA and keep articles after it**

Use the approved final heading, `Start My Sourcing Brief` primary button, and a `Discuss a Selected Product` link back to `#product-options`. Keep related intelligence after the CTA.

- [ ] **Step 7: Build and verify GREEN**

Run `npm run build`, start the production server, then run `npm run verify:sourcing-seo`. Expected: 194 pages generated and `Sourcing SEO verification passed.`

- [ ] **Step 8: Commit the page structure**

```bash
git add components/SourcingProductPage.tsx
git commit -m "feat: complete lawn sourcing landing structure"
```

---

### Task 3: Style and visually verify the completed funnel

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: new `sourcing-lawn-*` section classes.
- Produces: compact desktop and mobile sections that preserve the current product-selector hierarchy.

- [ ] **Step 1: Add scoped section styles**

Style buyer fit as a compact four-column strip, sourcing problems as three compact cards, decision framework as four columns, FAQ as a readable accordion, and final CTA as a two-column conversion block.

- [ ] **Step 2: Add responsive styles**

At tablet widths use two columns where appropriate; at 760px use one column, preserve 390px no-overflow behavior, and retain visible focus states for details summaries and CTAs.

- [ ] **Step 3: Run fresh automated checks**

Run `npm run verify:sourcing-seo`, `npm run build`, and `git diff --check`.

- [ ] **Step 4: Verify rendered desktop and mobile flows**

Check 1280×720 and 390×844, the complete section sequence, FAQ opening, RM model switching, console health, no framework overlay, and pool page regression.

- [ ] **Step 5: Commit styling**

```bash
git add app/globals.css
git commit -m "style: complete lawn landing funnel"
```

- [ ] **Step 6: Push and confirm Preview Ready**

Push `codex/wcb-sourcing-seo-foundation`, inspect the new Vercel Preview, and do not publish production.
