# Lawn Robot Industry Opportunity Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace generic sourcing-process copy with commercially specific robotic mower opportunity signals for experienced overseas buyers.

**Architecture:** Keep the existing page structure and interactions. Rewrite lawn-only JSX in `SourcingProductPage.tsx`, product-direction data in `sourcingProducts.ts`, and selector labels in `LawnRobotProductSelector.tsx`; protect the approved scope with rendered-page assertions in the existing sourcing verifier.

**Tech Stack:** Next.js 15, React 19, TypeScript, Node verification script.

## Global Constraints

- Website copy remains pure English.
- Preserve section order, visual system, images, product IDs, selector behavior, form routing and GA4 parameters.
- Do not invent market sizes, growth rates, prices, MOQ, certifications or supplier capabilities.
- Do not modify the pool robot page or unrelated website copy.
- FAQ discusses detailed industry opportunity and platform decisions only.

---

### Task 1: Guard the opportunity-copy contract

**Files:**
- Modify: `scripts/verify-sourcing-seo.mjs`

**Interfaces:**
- Consumes: rendered `/sourcing/lawn-robots` and `/sourcing/pool-robots` HTML.
- Produces: failures when required opportunity signals are missing or service-oriented FAQ questions remain.

- [ ] Add required rendered phrases including `Choose the Market Opportunity Before You Choose the Factory`, `Market opportunity`, `Why it can win`, and all ten approved FAQ questions.
- [ ] Add forbidden lawn-page phrases including `Questions buyers often ask before starting`, `Do you disclose factory names publicly?`, and `What information should I prepare before contacting you?`.
- [ ] Run `BASE_URL=http://127.0.0.1:3100 npm run verify:sourcing-seo` and confirm failure reports the missing opportunity copy.
- [ ] Commit the failing verification contract.

### Task 2: Rewrite the product opportunity selector

**Files:**
- Modify: `lib/sourcingProducts.ts`
- Modify: `components/LawnRobotProductSelector.tsx`

**Interfaces:**
- Consumes: the existing six `ProductDirection` records and selector interaction.
- Produces: six commercial product positions with `opportunity` and `verificationRisk` rendered under `Why it can win` and `Critical proof points`.

- [ ] Rewrite RM-01 through RM-06 around mass adoption, RTK step-up, AWD differentiation, boundary-wire value, professional large-area use and compact retail entry.
- [ ] Replace selector framing with `Six Product Platforms. Six Different Market Opportunities.` and `Compare the Opportunity`.
- [ ] Rename fact labels to `Why it can win` and `Critical proof points` without changing data flow.
- [ ] Run the sourcing verifier and confirm selector-related assertions pass.

### Task 3: Rewrite the landing-page opportunity narrative

**Files:**
- Modify: `components/SourcingProductPage.tsx`

**Interfaces:**
- Consumes: the approved 12-section page structure.
- Produces: opportunity-led Hero, audience signals, market-success conditions, buyer outcomes, industry judgment, go/no-go framework, final CTA and ten industry FAQs.

- [ ] Rewrite the Hero around choosing the commercial opportunity before the factory.
- [ ] Rewrite buyer-fit, risks, outcomes, Denny judgment, framework and CTA without changing markup structure or tracking attributes.
- [ ] Replace the seven service-oriented FAQs with the ten approved industry-opportunity questions and evidence-based answers.
- [ ] Run `BASE_URL=http://127.0.0.1:3100 npm run verify:sourcing-seo` and confirm all assertions pass.
- [ ] Run `npm run build` and confirm 194 pages generate successfully.
- [ ] Commit the copy implementation.

### Task 4: Browser and Preview verification

**Files:**
- No committed file changes expected.

**Interfaces:**
- Consumes: local production build and Vercel Preview.
- Produces: desktop/mobile evidence that copy density, selector switching, FAQ expansion and pool-page isolation remain correct.

- [ ] Check desktop and mobile first viewport, selector copy, lower-page hierarchy and all ten FAQ questions.
- [ ] Switch to RM-03 and confirm the opportunity copy updates.
- [ ] Open one FAQ and confirm its detailed answer renders without overflow.
- [ ] Confirm the pool robot page contains none of the lawn opportunity copy.
- [ ] Push the feature branch and wait for a Ready Vercel Preview; do not deploy with `vercel --prod`.
