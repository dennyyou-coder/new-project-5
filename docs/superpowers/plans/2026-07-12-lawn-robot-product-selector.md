# Lawn Robot Product Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic lawn-robot service content with an interactive six-product selector that creates concrete, attributable Sourcing interest without presenting AI concepts as verified factory models.

**Architecture:** Extend the existing typed sourcing-product data with six concept directions, render the lawn-robot selector as a focused client component, and keep the rest of the sourcing page server-rendered. The selector owns only visual selection state; Tally and GA4 continue through the existing tracked `TallyButton` interface with a new `productId` field.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, GA4, Tally popup, AI-generated 3:2 PNG/WebP assets, Vercel Preview.

## Global Constraints

- Do not expose factory names.
- AI images must be labeled as concept product directions.
- Do not invent exact performance, pricing, certification, availability, production, or supplier-validation claims.
- Six images use 3:2 framing, consistent camera direction, commercial product-photography lighting, no logos, and a product subject occupying 55%–70% of the frame.
- Desktop uses an approximately 80/20 main-image-to-thumbnail relationship.
- Mobile uses a 3:2 main image and horizontally scrollable thumbnails with no 390px overflow.
- Preserve the current branch, routing, metadata, sitemap, article links, GA4 event names, and publishing workflow.
- Do not merge `main` or publish production without Preview approval.

---

### Task 1: Generate the Six Concept Product Images

**Files:**
- Create: `public/images/sourcing/lawn-robots/rm-01-compact-vision.png`
- Create: `public/images/sourcing/lawn-robots/rm-02-rtk-platform.png`
- Create: `public/images/sourcing/lawn-robots/rm-03-awd-slope.png`
- Create: `public/images/sourcing/lawn-robots/rm-04-value-wire.png`
- Create: `public/images/sourcing/lawn-robots/rm-05-large-area-professional.png`
- Create: `public/images/sourcing/lawn-robots/rm-06-compact-retail.png`

**Interfaces:**
- Produces: six 3:2 image paths consumed by `lib/sourcingProducts.ts`.

- [ ] Generate one coherent six-image product family using the image generation skill. Keep the same three-quarter front camera direction, product scale, daylight, neutral grass setting and premium industrial-design language; vary body architecture enough to distinguish compact vision, RTK, AWD slope, value wire, professional large-area and compact retail directions.
- [ ] Inspect all six images at original detail. Reject any image containing a logo, text, malformed wheels/blades, impossible geometry, people, cables in unsafe positions, or inconsistent aspect ratio.
- [ ] Verify dimensions with `sips -g pixelWidth -g pixelHeight public/images/sourcing/lawn-robots/*.png`; expected ratio is exactly or visually equivalent to 3:2 for all six.
- [ ] Commit with `git add public/images/sourcing/lawn-robots && git commit -m "assets: add lawn robot concept directions"`.

### Task 2: Add Product IDs to Lead Attribution

**Files:**
- Modify: `lib/leadTracking.ts`
- Modify: `components/LeadForms.tsx`
- Modify: `scripts/verify-sourcing-seo.mjs`

**Interfaces:**
- Produces: optional `product_id?: string` in `LeadEventPayload` and optional `productId?: string` on `TallyButton`.

- [ ] Extend `scripts/verify-sourcing-seo.mjs` to require `product_id` in tracking source and run `npm run verify:sourcing-seo`; expected FAIL with `tracking: missing product_id`.
- [ ] Add `product_id?: string` to `LeadEventPayload`, add `productId?: string` to `TallyButton`, and map it into the emitted payload without changing existing callers.
- [ ] Run `npm run verify:sourcing-seo && npm run build`; expected PASS.
- [ ] Commit with `git add lib/leadTracking.ts components/LeadForms.tsx scripts/verify-sourcing-seo.mjs && git commit -m "feat: attribute sourcing leads by product"`.

### Task 3: Define the Six Product Directions

**Files:**
- Modify: `lib/sourcingProducts.ts`
- Modify: `scripts/verify-sourcing-seo.mjs`

**Interfaces:**
- Produces:

```ts
export type ProductDirection = {
  id: "RM-01" | "RM-02" | "RM-03" | "RM-04" | "RM-05" | "RM-06";
  name: string;
  positioning: string;
  lawnContext: string;
  markets: string[];
  channels: string[];
  technologyDirection: string;
  opportunity: string;
  verificationRisk: string;
  image: string;
  imageAlt: string;
};
```

- [ ] Extend verification to require six unique IDs, six unique images and the concept disclaimer; run the verifier and confirm failure.
- [ ] Add the six approved directions from the design specification. Use qualitative language only and connect every image path created in Task 1.
- [ ] Run the verifier and build; expected PASS.
- [ ] Commit with `git add lib/sourcingProducts.ts scripts/verify-sourcing-seo.mjs && git commit -m "content: define lawn robot product directions"`.

### Task 4: Build the Interactive Selector

**Files:**
- Create: `components/LawnRobotProductSelector.tsx`
- Modify: `components/SourcingProductPage.tsx`
- Modify: `app/globals.css`
- Modify: `scripts/verify-sourcing-seo.mjs`

**Interfaces:**
- Consumes: `ProductDirection[]`.
- Produces: `LawnRobotProductSelector({ products }: { products: ProductDirection[] })`.

- [ ] Extend verification to require selector markup, six product buttons, concept disclaimer, `aria-pressed`, and a CTA carrying the selected product ID; confirm failure.
- [ ] Implement a client component using `useState(products[0].id)`. Thumbnail controls are real buttons with `aria-pressed`; selection updates the main image, all product text and `TallyButton productId`.
- [ ] Render the selector only for `product.slug === "lawn-robots"`. Compress the generic lawn-robot sections so the selector is the dominant commercial module; keep supplier strategy, regional differences, related articles and final custom inquiry.
- [ ] Implement CSS with a 4fr/1fr desktop grid, 3:2 `aspect-ratio`, `object-fit: contain`, vertically scrollable desktop thumbnails, and horizontally scrollable mobile thumbnails. Confirm `scrollWidth === clientWidth` at 390px.
- [ ] Run `npm run verify:sourcing-seo && npm run build`; expected PASS.
- [ ] Commit with `git add components/LawnRobotProductSelector.tsx components/SourcingProductPage.tsx app/globals.css scripts/verify-sourcing-seo.mjs && git commit -m "feat: add lawn robot product selector"`.

### Task 5: Local and Preview QA

**Files:**
- No new committed source files unless verification identifies a scoped defect.

**Interfaces:**
- Produces: updated Preview on `codex/wcb-sourcing-seo-foundation`; production remains unchanged.

- [ ] Start the production build locally and verify desktop: one 3:2 main image, approximately 80/20 layout, four visible thumbnails, readable disclaimer and synchronized RM product content.
- [ ] Verify mobile at 390×844: 3:2 main image, horizontal thumbnails, no document overflow, readable CTA and complete product image.
- [ ] Click at least three thumbnails and verify image, title, opportunity, risk and CTA product ID all change together; confirm no console errors.
- [ ] Open the Sourcing popup without submitting and confirm GA4 DebugView receives `cta_click` and `form_open` with `product_id`, `product_category`, `inquiry_intent` and `cta_location`.
- [ ] Run fresh `npm run verify:sourcing-seo && npm run build && git status --short`; expected PASS, PASS and clean.
- [ ] Push the branch, wait for Vercel Preview Ready, verify the lawn-robot page, and request user approval. Do not merge `main`.

## Definition of Done

- Six coherent 3:2 concept images exist and pass visual inspection.
- The product selector behaves correctly on desktop and mobile.
- AI concept status is unambiguous.
- Every product inquiry carries the selected RM product ID.
- No factory names or fabricated product claims appear.
- Automated verification, production build, console checks and responsive checks pass.
- An updated Vercel Preview is ready for user review; production is unchanged.
