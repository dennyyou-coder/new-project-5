# Lawn Robot Layout Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the broken empty space in the lawn-robot product selector and make every section on the page follow one consistent alignment and spacing system.

**Architecture:** Refactor only the lawn product selector markup into a two-row CSS grid, with the proof content moved into a dedicated evidence strip and the thumbnail rail spanning both rows. Add lawn-scoped alignment tokens and responsive overrides, then extend the existing Sourcing verification script to protect the structure and scope.

**Tech Stack:** Next.js 15, React, TypeScript, CSS Grid, existing Node verification script, Vercel Preview.

## Global Constraints

- Only `/sourcing/lawn-robots` and `.sourcing-lawn-page` scoped styles may change.
- Pool Robots, shared navigation, global container width, copy, forms and tracking behavior remain unchanged.
- Product images must not be heavily cropped.
- The thumbnail rail is bounded on desktop and horizontally scrollable on mobile.
- Production is not deployed; publish Preview only.
- Ignore and never stage `.audit/` and `.superpowers/`.

---

### Task 1: Protect the Revised Product Workbench Contract

**Files:**
- Modify: `scripts/verify-sourcing-seo.mjs`
- Test: `scripts/verify-sourcing-seo.mjs`

**Interfaces:**
- Consumes: rendered `/sourcing/lawn-robots` HTML and source files.
- Produces: assertions for the new workbench and lawn-only CSS scope.

- [ ] **Step 1: Add failing structural assertions**

Require the rendered lawn page and selector source to contain these stable class hooks:

```js
for (const className of [
  "sourcing-lawn-selector-workbench",
  "sourcing-lawn-selector-summary",
  "sourcing-lawn-selector-evidence",
  "sourcing-lawn-selector-rail"
]) {
  requireValue(selectorSource.includes(className), `lawn selector: missing ${className}`);
  requireValue(sourcingStyles.includes(`.sourcing-lawn-page .${className}`), `lawn selector: ${className} is not lawn scoped`);
}
```

Also retain the existing six-model, FAQ, tracking and Pool Robots assertions.

- [ ] **Step 2: Run the verifier and confirm it fails**

Run:

```bash
BASE_URL=http://127.0.0.1:3100 npm run verify:sourcing-seo
```

Expected: failure naming `sourcing-lawn-selector-workbench` before the component is changed.

- [ ] **Step 3: Keep the failing assertions for Task 2**

Do not weaken or remove existing assertions. The implementation in Task 2 must satisfy them.

### Task 2: Rebuild the Product Selector and Page Alignment

**Files:**
- Modify: `components/LawnRobotProductSelector.tsx`
- Modify: `app/globals.css`
- Modify if needed: `components/LawnRobotDecisionVisuals.tsx`
- Test: `scripts/verify-sourcing-seo.mjs`

**Interfaces:**
- Consumes: existing `LawnRobotDirection[]`, selected-product state and Tally CTA behavior.
- Produces: the same selector behavior using four stable layout hooks from Task 1.

- [ ] **Step 1: Restructure the selector without changing state or CTA behavior**

Use this structure inside the existing selector component:

```tsx
<div className="sourcing-lawn-selector-workbench">
  <div className="sourcing-lawn-selector-media">
    <img src={selected.image} alt={selected.imageAlt} />
    <span>{selected.id}</span>
  </div>
  <div className="sourcing-lawn-selector-summary">
    <p className="sourcing-selector-count">Product {selectedIndex + 1} of {products.length}</p>
    <p className="sourcing-selector-id">{selected.id} · {selected.technologyDirection}</p>
    <h3>{selected.name}</h3>
    <p className="sourcing-selector-positioning"><strong>Market opportunity</strong><br />{selected.positioning}</p>
    <div className="sourcing-selector-tags">{selected.markets.map((item) => <span key={item}>{item}</span>)}</div>
    <div className="sourcing-selector-actions">
      <TallyButton className="sourcing-v3-button" form="sourcing" conversionGroup="sourcing" ctaLocation="lawn_robot_product_selector" inquiryIntent="product_sourcing" productCategory="robotic_lawn_mower" productId={selected.id}>Request Suppliers for {selected.id}</TallyButton>
      <TallyButton className="sourcing-selector-secondary" form="sourcing" conversionGroup="sourcing" ctaLocation="lawn_robot_selector_custom_brief" inquiryIntent="product_sourcing" productCategory="robotic_lawn_mower">Use My Own Product Brief</TallyButton>
    </div>
  </div>
  <div className="sourcing-lawn-selector-evidence">
    <article><strong>Why it can win</strong><p>{selected.opportunity}</p></article>
    <article><strong>Critical proof points</strong><p>{selected.verificationRisk}</p></article>
  </div>
  <div className="sourcing-lawn-selector-rail" aria-label="Choose a lawn robot product direction">
    {products.map((product) => <button key={product.id} type="button" aria-pressed={product.id === selected.id} onClick={() => setSelectedId(product.id)}><img src={product.image} alt="" /><strong>{product.id}</strong><span>{product.name}</span></button>)}
  </div>
</div>
```

Keep the current selected product state, `aria-pressed`, product IDs and both CTA actions unchanged.

- [ ] **Step 2: Add the desktop two-row grid**

Add lawn-scoped CSS with this layout contract:

```css
.sourcing-lawn-page .sourcing-lawn-selector-workbench {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(300px, 1fr) 188px;
  grid-template-areas:
    "media summary rail"
    "evidence evidence rail";
  gap: 16px;
  align-items: stretch;
}
```

The media keeps its existing image aspect ratio. The summary ends after the CTA row. The evidence strip has two equal columns. The rail spans both rows, uses a maximum height tied to the workbench and scrolls vertically when required.

- [ ] **Step 3: Apply one page-wide alignment rhythm**

Use the existing `sourcing-v3-container` edge. Normalize lawn-only section padding, visual-heading columns, rule endpoints, card radii and internal padding. Do not change the shared container or header.

Review and align:

```text
Opportunity landscape
Channel matrix
Success-condition cards
Denny credibility section
Four-decision evidence flow
FAQ
Final CTA
```

- [ ] **Step 4: Add tablet and mobile behavior**

At tablet width, switch the rail into a horizontal strip below the first row. At mobile width, stack in this order:

```text
media -> summary -> evidence -> horizontal model rail
```

Remove fixed heights that create blank space. Preserve the matrix's internal horizontal scroll and marker visibility.

- [ ] **Step 5: Run the verifier**

Run:

```bash
BASE_URL=http://127.0.0.1:3100 npm run verify:sourcing-seo
```

Expected: `Sourcing SEO verification passed.`

### Task 3: Visual Regression, Build and Preview

**Files:**
- Verify: `components/LawnRobotProductSelector.tsx`
- Verify: `components/LawnRobotDecisionVisuals.tsx`
- Verify: `app/globals.css`
- Verify: `scripts/verify-sourcing-seo.mjs`

**Interfaces:**
- Consumes: completed selector and alignment implementation.
- Produces: verified commit and a Vercel Preview URL.

- [ ] **Step 1: Run production build**

Run:

```bash
npm run build
```

Expected: successful compilation, type checking and 194 static pages.

- [ ] **Step 2: Verify desktop, tablet and mobile**

Inspect at 1280px, 820px and 390px widths. Confirm:

```text
No blank area below the main product image
Workbench edges align with later sections
All six models switch correctly
Selected product CTA retains its model ID
Thumbnail rail scrolls within its own area
Ten FAQs are initially collapsed
No page-level horizontal overflow
```

- [ ] **Step 3: Verify Pool Robots isolation**

Open `/sourcing/pool-robots` and confirm no new lawn selector or decision-visual class is present and no horizontal overflow is introduced.

- [ ] **Step 4: Commit only intended files**

```bash
git add components/LawnRobotProductSelector.tsx components/LawnRobotDecisionVisuals.tsx app/globals.css scripts/verify-sourcing-seo.mjs
git commit -m "fix: polish lawn sourcing page alignment"
```

Do not stage `.audit/` or `.superpowers/`.

- [ ] **Step 5: Push the current branch and wait for Preview**

```bash
git push origin codex/wcb-sourcing-seo-foundation
npx vercel@50.28.0 ls new-project-5 --yes
npx vercel@50.28.0 inspect https://new-project-5-git-codex-wcb-sourcing-seo-2e4182-world-clean-biz.vercel.app --wait --timeout 120s
```

Expected: a new deployment with target `preview` and status `Ready`. Never use `--prod`.
