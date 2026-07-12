# Lawn Robot Landing Page Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `/sourcing/lawn-robots` into a product-led Sourcing landing page while preserving SEO metadata, analytics parameters, and the current `/sourcing/pool-robots` experience.

**Architecture:** Keep the shared `SourcingProductPage` as the route entry, but branch its presentation only when `product.directions` exists so pool robots retain the existing generic layout. Keep interactive selection inside `LawnRobotProductSelector`, and use existing `TallyButton` tracking rather than introducing a new form system.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, existing CSS, Node-based sourcing verifier, GA4/Tally tracking.

## Global Constraints

- Website copy is English; user communication is Chinese.
- Do not expose factory names or imply AI concepts are verified production models.
- Do not add unverified specifications, prices, certifications, supplier counts, response times, or client claims.
- Product images remain 3:2 and use the existing six concept assets.
- Preserve `product_id` tracking for product CTAs and omit it for custom brief CTAs.
- Do not change `/sourcing/pool-robots` visible copy or layout.
- Do not merge `main`, deploy production, or run `vercel --prod`.

---

### Task 1: Lock conversion requirements in the sourcing verifier

**Files:**
- Modify: `scripts/verify-sourcing-seo.mjs`

**Interfaces:**
- Consumes: rendered HTML from `BASE_URL`, source text for client-only selector behavior.
- Produces: failing checks for lawn-only hero copy, custom brief entry, trust proof, product-specific CTA copy, product position indicator, and pool-page isolation.

- [ ] **Step 1: Add failing checks**

Add rendered-page requirements for:

```js
const lawn = await readPage("/sourcing/lawn-robots");
const pool = await readPage("/sourcing/pool-robots");

for (const value of [
  "Choose the Right Robotic Mower Platform Before You Choose a Supplier",
  "Explore Product Options",
  "I Already Have a Product Brief",
  "Inside the cleaning industry since 2006",
  "Product Direction Review",
  "What happens after you share your brief"
]) {
  requireValue(lawn.html.includes(value), `/sourcing/lawn-robots: missing ${value}`);
}

requireValue(
  pool.html.includes("Robotic Pool Cleaner Manufacturers &amp; Sourcing in China"),
  "/sourcing/pool-robots: shared page presentation changed"
);
requireValue(
  !pool.html.includes("Choose the Right Robotic Mower Platform"),
  "/sourcing/pool-robots: lawn-only conversion content leaked"
);
```

Add source checks for `Request Suppliers for`, `Use My Own Product Brief`, `Product 1 of`, and `productId={selected.id}`.

- [ ] **Step 2: Run verifier and confirm RED**

Run the production server and:

```bash
npm run verify:sourcing-seo
```

Expected: FAIL only for the newly required conversion content.

- [ ] **Step 3: Commit the failing verification contract**

```bash
git add scripts/verify-sourcing-seo.mjs
git commit -m "test: define lawn sourcing conversion requirements"
```

---

### Task 2: Implement the lawn-only conversion structure and product selector

**Files:**
- Modify: `components/SourcingProductPage.tsx`
- Modify: `components/LawnRobotProductSelector.tsx`
- Modify: `lib/sourcingProducts.ts`

**Interfaces:**
- Consumes: `SourcingProduct.directions`, existing product direction fields, `TallyButton`.
- Produces: lawn-only hero and supporting sections; selector CTAs that preserve `product_id`; custom brief CTAs without `product_id`.

- [ ] **Step 1: Add lawn-only hero and supporting content**

In `SourcingProductPage`, use `const isLawnRobotPage = Boolean(product.directions)` and render the approved product-led hero when true. The primary CTA is an anchor to `#product-options`; the secondary CTA is a `TallyButton` with `ctaLocation="lawn_robot_hero_custom_brief"` and no `productId`.

Render a lawn-only trust block using:

```text
Founder, World Clean Biz
Organizer, World Clean Expo
Inside the cleaning industry since 2006
Product and supplier decisions reviewed by Denny
```

Use `/images/industry/about-denny-portrait-event.jpg` with an accurate alt description.

Replace the generic lawn cards with four deliverables and a three-step post-submit explanation. Preserve the current generic sections unchanged in the false branch for pool robots. Put related intelligence after the final lawn CTA.

- [ ] **Step 2: Improve the selector decision path**

Add `id="product-options"`, compute the selected index, display `Product X of 6`, and update CTA labels:

```tsx
<TallyButton productId={selected.id}>
  Request Suppliers for {selected.id}
</TallyButton>
<TallyButton ctaLocation="lawn_robot_selector_custom_brief">
  Use My Own Product Brief
</TallyButton>
```

Keep the concept disclaimer visible as:

```text
Illustrative product directions. Final supplier models and specifications are verified against your brief.
```

Add a mobile-only hint that more product directions can be swiped horizontally.

- [ ] **Step 3: Update lawn product copy without changing metadata**

Keep `metadata.title` and `metaDescription` unchanged. Update only the lawn visible title and intro fields where they are still consumed by the lawn-only presentation. Do not alter pool product data.

- [ ] **Step 4: Run verifier and confirm GREEN**

```bash
npm run verify:sourcing-seo
```

Expected: `Sourcing SEO verification passed.`

- [ ] **Step 5: Commit structure and behavior**

```bash
git add components/SourcingProductPage.tsx components/LawnRobotProductSelector.tsx lib/sourcingProducts.ts
git commit -m "feat: strengthen lawn robot sourcing conversion"
```

---

### Task 3: Tighten responsive layout and complete full verification

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: lawn-only CSS class names introduced by Task 2.
- Produces: compact desktop hero, same-viewport product image and decision copy, 3:2 imagery, accessible focus styles, and mobile horizontal thumbnails without page overflow.

- [ ] **Step 1: Add desktop conversion layout styles**

Create lawn-only classes so the shared pool hero rules stay untouched. Use a compact hero, two-column selector body, and dedicated thumbnail rail. Keep the main media container at `aspect-ratio: 3 / 2` with a desktop maximum height of 520px. Put selected product copy beside or immediately adjacent to the image so the CTA appears in the same 720–900px desktop viewport.

- [ ] **Step 2: Add mobile reflow and interaction affordances**

At `max-width: 760px`, stack hero content, keep the main image at 3:2, display three thumbnail cards with the next card partially visible, and ensure `overflow-x: auto` is scoped to the thumbnail rail. Add `:focus-visible` styling for thumbnail buttons and keep the page width at 390px without horizontal overflow.

- [ ] **Step 3: Run automated verification**

```bash
npm run verify:sourcing-seo
npm run build
```

Expected: verifier passes and Next.js generates all routes successfully.

- [ ] **Step 4: Verify desktop and mobile in the browser**

Check `/sourcing/lawn-robots` at desktop and 390×844 mobile widths:

- Hero value is understandable without scrolling.
- Product selector begins near the first viewport.
- Selected product image, decision content, and CTA are visible without an excessive image-only screen.
- RM-01 through RM-06 switch image, copy, position indicator, pressed state, and CTA ID.
- Mobile thumbnails scroll horizontally and the page itself has no horizontal overflow.
- No console errors or warnings.

Also inspect `/sourcing/pool-robots` to confirm the shared page has not visually changed.

- [ ] **Step 5: Commit responsive styling**

```bash
git add app/globals.css
git commit -m "style: tighten lawn sourcing landing page"
```

- [ ] **Step 6: Push and inspect Vercel Preview**

```bash
git push origin codex/wcb-sourcing-seo-foundation
```

Wait for the branch Preview to become Ready. Verify the same desktop and mobile states on the Preview URL. Do not merge `main` and do not run `vercel --prod`.
