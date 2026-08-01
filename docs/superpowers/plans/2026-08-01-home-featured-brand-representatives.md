# Homepage Featured Brand Representatives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage Brand Intelligence showcase with six approved category representatives and enlarge their official logos without changing the brand directory.

**Architecture:** Keep the homepage selection local to `app/page.tsx` as ordered `{ slug, categoryLabel }` records, resolve them against published profiles, and render one linked tile per record. Limit visual changes to the existing `.home-v9-brand-logos` CSS scope so other logo surfaces retain their current geometry.

**Tech Stack:** Next.js 15 App Router, React 19 server components, TypeScript, CSS, Node test runner.

## Global Constraints

- Homepage representatives are Milwaukee, Husqvarna, Maytronics, Roborock, Tineco and Kärcher in that order.
- Visible category labels are `Power Tools`, `Lawn & Garden`, `Pool Equipment`, `Floorcare`, `Floorcare` and `Commercial Cleaning`.
- The set is an editorial navigation aid, not a market-share ranking or commercial endorsement.
- Logos remain official local assets with existing alt text and `object-fit: contain`.
- Do not modify `/brands`, brand JSON files, brand ownership data, category membership or logo assets.
- Keep the desktop three-column and mobile two-column tile grids.

---

### Task 1: Homepage Representative Selection and Labels

**Files:**
- Modify: `tests/homepageStructure.test.mjs`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `getPublishedBrandProfiles(allInsights)` returning published `BrandProfile[]`.
- Produces: ordered `featuredBrandSelections: { slug: string; categoryLabel: string }[]` and rendered `.home-v9-brand-meta` content.

- [ ] **Step 1: Write the failing selection and rendering test**

Extend the existing `homepage gives Brand Intelligence a compact discovery entry` coverage with a separate test that asserts all six literal slug/label pairs, the `.home-v9-brand-meta` hook, and absence of the retired Aiper, Dreame and ECOVACS selections:

```js
test("homepage featured brands represent the five buying categories with six approved brands", () => {
  for (const [slug, categoryLabel] of [
    ["milwaukee", "Power Tools"],
    ["husqvarna", "Lawn & Garden"],
    ["maytronics", "Pool Equipment"],
    ["roborock", "Floorcare"],
    ["tineco", "Floorcare"],
    ["karcher", "Commercial Cleaning"]
  ]) {
    assert.match(homeSource, new RegExp(`slug: "${slug}"[\\s\\S]*?categoryLabel: "${categoryLabel}"`));
  }
  assert.match(homeSource, /className="home-v9-brand-meta"/);
  assert.doesNotMatch(homeSource, /slug: "(?:aiper|dreame|ecovacs)"/);
});
```

- [ ] **Step 2: Run the homepage test and verify RED**

Run: `npm run test:homepage`

Expected: FAIL because `featuredBrandSlugs` still contains Aiper, Dreame and ECOVACS and no category-label markup exists.

- [ ] **Step 3: Implement the ordered homepage selection**

Replace `featuredBrandSlugs` with:

```ts
const featuredBrandSelections = [
  { slug: "milwaukee", categoryLabel: "Power Tools" },
  { slug: "husqvarna", categoryLabel: "Lawn & Garden" },
  { slug: "maytronics", categoryLabel: "Pool Equipment" },
  { slug: "roborock", categoryLabel: "Floorcare" },
  { slug: "tineco", categoryLabel: "Floorcare" },
  { slug: "karcher", categoryLabel: "Commercial Cleaning" }
];
```

Resolve the records while preserving order:

```ts
const featuredBrands = featuredBrandSelections
  .map((selection) => {
    const profile = brandProfiles.find(({ slug }) => slug === selection.slug);
    return profile ? { ...selection, profile } : null;
  })
  .filter((selection): selection is NonNullable<typeof selection> => Boolean(selection));
```

Render each link with the existing image followed by:

```tsx
<div className="home-v9-brand-meta">
  <span>{categoryLabel}</span>
  <strong>{profile.name}</strong>
</div>
```

- [ ] **Step 4: Run the homepage test and verify GREEN**

Run: `npm run test:homepage`

Expected: all homepage tests PASS.

- [ ] **Step 5: Commit the representative selection**

```bash
git add app/page.tsx tests/homepageStructure.test.mjs
git commit -m "Feature representative brands on homepage"
```

---

### Task 2: Larger Homepage Logo Geometry

**Files:**
- Modify: `tests/homepageStructure.test.mjs`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `.home-v9-brand-logos`, `.home-v9-brand-meta` markup from Task 1.
- Produces: larger contained wordmarks and readable category/name hierarchy at desktop and mobile widths.

- [ ] **Step 1: Write the failing geometry test**

Add literal CSS behavior assertions to the homepage structure suite:

```js
test("homepage featured brand wordmarks use the enlarged contained geometry", () => {
  assert.match(cssSource, /\.home-v9-brand-logos img\s*\{[^}]*width:\s*min\(100%,\s*160px\)[^}]*height:\s*56px[^}]*object-fit:\s*contain/s);
  assert.match(cssSource, /\.home-v9-brand-meta\s*\{/);
  assert.match(cssSource, /\.home-v9-brand-meta span\s*\{/);
  assert.match(cssSource, /\.home-v9-brand-meta strong\s*\{/);
});
```

- [ ] **Step 2: Run the homepage test and verify RED**

Run: `npm run test:homepage`

Expected: FAIL because current logo geometry is `132px × 42px` and metadata styles do not exist.

- [ ] **Step 3: Implement the scoped CSS**

Update only the homepage showcase rules:

```css
.home-v9-brand-logos a {
  min-height: 116px;
  grid-template-rows: minmax(56px, 1fr) auto;
  gap: 6px;
  padding: 8px;
}

.home-v9-brand-logos img {
  width: min(100%, 160px);
  height: 56px;
  display: block;
  object-fit: contain;
}

.home-v9-brand-meta {
  display: grid;
  gap: 3px;
  min-width: 0;
  text-align: center;
}

.home-v9-brand-meta span {
  color: var(--v9-blue);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .08em;
  line-height: 1.2;
  text-transform: uppercase;
}

.home-v9-brand-meta strong {
  color: var(--v9-muted);
  font-size: 11px;
  font-weight: 850;
  line-height: 1.1;
}
```

Update the mobile minimum height from `94px` to `108px` so the enlarged logo and two text lines do not collide.

- [ ] **Step 4: Run the homepage test and verify GREEN**

Run: `npm run test:homepage`

Expected: all homepage tests PASS.

- [ ] **Step 5: Commit the geometry change**

```bash
git add app/globals.css tests/homepageStructure.test.mjs
git commit -m "Enlarge homepage featured brand logos"
```

---

### Task 3: Rendered QA and Release-Ready Validation

**Files:**
- Verify only; no committed QA artifacts.

**Interfaces:**
- Consumes: completed homepage and CSS changes from Tasks 1 and 2.
- Produces: browser and build evidence suitable for a Vercel preview.

- [ ] **Step 1: Run focused and production checks**

Run:

```bash
npm run test:homepage
npm run test:brands
npm run build
```

Expected: every command exits 0 and the build completes all static pages.

- [ ] **Step 2: Start the local site**

Run: `npm run dev -- --hostname 127.0.0.1 --port 3010`

Expected: the homepage responds at `http://127.0.0.1:3010/`.

- [ ] **Step 3: Verify desktop rendering with the Browser plugin**

At a 1512 × 900 viewport, verify:

- The six tiles appear in the approved order.
- Category labels match the plan.
- All six logos are visibly larger and uncropped.
- There is no horizontal overflow, framework overlay or relevant console warning/error.
- Clicking the Milwaukee tile opens `/brands/milwaukee`.

- [ ] **Step 4: Verify 390px mobile rendering with the Browser plugin**

At a 390 × 844 viewport, verify:

- Two-column tile grid remains intact.
- Labels do not collide with logos or tile boundaries.
- No horizontal overflow or relevant console warning/error appears.

- [ ] **Step 5: Push the feature branch and verify the Vercel Preview**

Push `codex/brand-logo-featured-representatives`, wait for the preview deployment to reach `Ready`, and verify that the preview homepage includes `Milwaukee`, `Husqvarna`, `Maytronics`, `Roborock`, `Tineco` and `Kärcher` in the featured-brand section.

