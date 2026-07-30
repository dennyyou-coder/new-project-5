# WCB Brand Visual System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace editorial-cover brand directory cards with official brand logos and turn the 10 published brand profiles into visual, table-led intelligence pages without changing their verified factual conclusions.

**Architecture:** Extend the existing JSON-backed `BrandProfile` model with required logo metadata, structured evidence rows, optional buyer relevance, and placed body visuals. Add small brand-only presentation components, then compose them inside the existing directory, hero, and detail section components; keep the current routes, article mapping, timeline, sources, metadata, and publication gates intact.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5, JSON content profiles, global CSS, Node.js built-in test runner.

## Global Constraints

- Work only on the current isolated feature branch; do not merge or deploy production without explicit user approval.
- Do not modify the homepage, primary navigation, article bodies, or unrelated site components.
- Use only official brand-site or official press-kit Logo assets; do not generate, trace, recolor, stretch, or crop logos.
- Directory cards use official logos; detail pages keep the existing editorial hero image for Open Graph and research framing.
- Reuse approved local WCB visuals; do not create placeholder body images.
- Preserve every existing source-backed conclusion and source record.
- Every published profile must have a local Logo file, Logo alt text, Logo source URL, and 2–3 placed body visuals.
- Body visuals require `src`, `alt`, `caption`, and one of `ownership`, `portfolio`, `operations`, or `competition`.
- Desktop tables must expose real column headers; mobile layouts must remain understandable without horizontal scrolling.
- Use TDD: write each failing test, verify the expected failure, implement the minimum change, verify the pass, then commit.
- Before release, run brand tests, adjacent regressions, content classification, TypeScript, production build, and browser checks on a Vercel Preview.

---

## File Structure

### Create

- `components/brands/BrandLogo.tsx` — renders a contained official Logo in directory and hero variants.
- `components/brands/BrandVisual.tsx` — renders a placed WCB image using semantic figure and caption markup.
- `components/brands/BrandDataTable.tsx` — renders accessible desktop tables and mobile label/value records.
- `public/images/brands/aiper/logo.webp`
- `public/images/brands/bissell/logo.webp`
- `public/images/brands/dreame/logo.webp`
- `public/images/brands/dyson/logo.webp`
- `public/images/brands/ecovacs/logo.webp`
- `public/images/brands/irobot/logo.webp`
- `public/images/brands/mammotion/logo.webp`
- `public/images/brands/maytronics/logo.webp`
- `public/images/brands/roborock/logo.webp`
- `public/images/brands/tineco/logo.webp`

### Modify

- `lib/brands.ts` — types, validation, local asset checks, and Organization Logo schema.
- `content/brands/README.md` — document new required fields and evidence rules.
- `content/brands/*.json` — add Logo metadata, buyer relevance, structured evidence, and 2–3 visual placements to all 10 profiles.
- `components/brands/BrandDirectoryCard.tsx` — display Logo stage and at most three categories.
- `components/brands/BrandHero.tsx` — display Logo and compact Key Facts table.
- `components/brands/BrandSections.tsx` — compose ownership, leadership, portfolio, operations, channels, and competitive sections using tables and visuals.
- `app/globals.css` — isolated Logo, table, figure, section, and mobile styles.
- `tests/brandIntelligence.test.mjs` — validate new data fields, files, and JSON-LD.
- `tests/brandExperience.test.mjs` — verify the rendered component structure and responsive CSS.

### Preserve

- `app/brands/page.tsx`
- `app/brands/[slug]/page.tsx`
- `components/brands/BrandTimeline.tsx`
- `components/brands/BrandArticles.tsx`
- `components/brands/BrandSources.tsx`
- Existing brand article relationships, dates, sources, canonical URLs, Open Graph hero images, and sitemap behavior.

---

### Task 1: Extend the Contract and Migrate Published Profile Data

**Files:**
- Modify: `lib/brands.ts`
- Modify: `tests/brandIntelligence.test.mjs`
- Modify: `content/brands/README.md`
- Modify: all 10 `content/brands/*.json` files.

**Interfaces:**
- Produces: `BrandVisualPlacement`, `BrandContentVisual`, `BrandEvidenceItem`, expanded `BrandProfile`, 10 valid migrated profiles, and validation errors consumed by all later tasks.
- Preserves: `validateBrandProfile(profile, articles): string[]` and `getPublishedBrandProfiles(articles): BrandProfile[]`.

- [ ] **Step 1: Add a complete valid visual profile to the test fixture**

Add these fields to the existing `profile` fixture in `tests/brandIntelligence.test.mjs`:

```js
logoImage: "/images/brands/sample-brand/logo.webp",
logoImageAlt: "Sample Brand logo",
logoSourceUrl: "https://example.com/brand-assets",
contentVisuals: [
  {
    placement: "ownership",
    src: "/images/blog/sample-brand-company-map.webp",
    alt: "Diagram of Sample Brand company ownership",
    caption: "Sample Brand ownership structure based on reviewed company records."
  },
  {
    placement: "portfolio",
    src: "/images/blog/sample-brand-product-map.webp",
    alt: "Sample Brand product portfolio map",
    caption: "Sample Brand product categories and positioning."
  }
],
```

Change the portfolio and evidence fixtures to:

```js
productPortfolio: [{
  name: "Robot vacuums",
  positioning: "Premium residential floorcare",
  buyerRelevance: "A core line for residential floorcare assortment planning."
}],
manufacturingSupplyChain: [{
  evidence: "Manufacturing statement verified against the cited company source.",
  scope: "Company disclosure",
  buyerCheck: "Confirm the manufacturer and origin for the contracted SKU."
}],
marketsChannels: [{
  evidence: "Direct ecommerce and distributor channels in named markets.",
  scope: "Named regional markets",
  buyerCheck: "Confirm seller authorization and local warranty coverage."
}],
```

- [ ] **Step 2: Write failing validation tests**

Add focused tests that delete or corrupt each new boundary:

```js
test("requires complete official logo metadata for a published profile", () => {
  for (const field of ["logoImage", "logoImageAlt", "logoSourceUrl"]) {
    const invalidProfile = structuredClone(profile);
    delete invalidProfile[field];
    assert.match(
      validateBrandProfile(invalidProfile, articles).join("\n"),
      new RegExp(field, "i")
    );
  }
});

test("requires valid placed content visuals", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.contentVisuals[0].placement = "gallery";
  invalidProfile.contentVisuals[1].caption = " ";
  const errors = validateBrandProfile(invalidProfile, articles).join("\n");
  assert.match(errors, /contentVisuals item 1 placement/i);
  assert.match(errors, /contentVisuals item 2 caption/i);
});

test("requires structured manufacturing and channel evidence", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.manufacturingSupplyChain[0].scope = "";
  invalidProfile.marketsChannels[0].buyerCheck = 42;
  const errors = validateBrandProfile(invalidProfile, articles).join("\n");
  assert.match(errors, /manufacturingSupplyChain item 1 scope/i);
  assert.match(errors, /marketsChannels item 1 buyerCheck/i);
});
```

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```bash
npm run test:brands
```

Expected: FAIL because the type and validator do not yet recognize required Logo fields, `contentVisuals`, structured evidence rows, or `buyerRelevance`.

- [ ] **Step 4: Add types and validation**

Add these exported types in `lib/brands.ts`:

```ts
export type BrandVisualPlacement =
  | "ownership"
  | "portfolio"
  | "operations"
  | "competition";

export type BrandContentVisual = {
  placement: BrandVisualPlacement;
  src: string;
  alt: string;
  caption: string;
};

export type BrandEvidenceItem = {
  evidence: string;
  scope: string;
  buyerCheck: string;
};
```

Extend `BrandProfile` with:

```ts
logoImage: string;
logoImageAlt: string;
logoSourceUrl: string;
contentVisuals: BrandContentVisual[];
productPortfolio: Array<{
  name: string;
  positioning: string;
  buyerRelevance?: string;
}>;
manufacturingSupplyChain: BrandEvidenceItem[];
marketsChannels: BrandEvidenceItem[];
```

Validation rules:

- published and draft profiles both require all three Logo fields;
- `logoImage` and every visual `src` must begin with `/images/`;
- `logoSourceUrl` must be valid HTTP(S);
- `contentVisuals` must contain 2 or 3 items;
- placements must be one of the four exact values;
- every visual requires non-empty `src`, `alt`, and `caption`;
- every structured evidence item requires non-empty `evidence`, `scope`, and `buyerCheck`;
- `buyerRelevance` is optional but must be non-empty when supplied.

Use a dedicated `recordArray()`-style validator instead of coercing malformed values.

- [ ] **Step 5: Add the fixed visual placement matrix to all profiles**

Add 2–3 `contentVisuals` entries to each profile using these already committed WCB files:

| Brand | Ownership | Portfolio | Operations or competition |
| --- | --- | --- | --- |
| Aiper | `/images/blog/aiper-fluidra-ownership-control-cover.webp` | `/images/blog/aiper-pool-cleaner-model-selection-map.webp` | `/images/blog/aiper-manufacturing-regional-responsibility-map.webp` |
| BISSELL | `/images/blog/bissell-company-brand-foundation-map.webp` | `/images/blog/bissell-little-green-vs-spotclean-platforms.webp` | `/images/blog/tineco-vs-bissell-crosswave-floor-washer-systems.webp` |
| Dreame | `/images/blog/dreame-xiaomi-mova-relationship-map.webp` | `/images/blog/dreame-vs-ecovacs-robot-platforms.webp` | `/images/blog/roborock-vs-dreame-expansion-systems-v3-r2-with-logos.webp` |
| Dyson | `/images/blog/dyson-ownership-headquarters-manufacturing-map.webp` | `/images/blog/dyson-washg1-vs-tineco-floor-one-architecture.webp` | `/images/blog/dyson-global-vacuum-manufacturing-network.webp` |
| ECOVACS | `/images/blog/tineco-ecovacs-company-structure.webp` | `/images/blog/dreame-vs-ecovacs-robot-platforms.webp` | `/images/blog/roborock-vs-ecovacs-robot-vacuums.webp` |
| iRobot | `/images/blog/irobot-picea-manufacturer-lender-owner-timeline.webp` | `/images/blog/roborock-vs-roomba-system.webp` | `/images/blog/irobot-picea-xinbao-rebuilding-map.webp` |
| Mammotion | `/images/blog/luba-mammotion-songling-agilex-company-map-cover.webp` | `/images/blog/mammotion-luba-vs-yuka-robot-mowers.webp` | `/images/blog/mammotion-regional-entity-buyer-check.webp` |
| Maytronics | `/images/blog/dolphin-maytronics-manufacturer-ownership-cover.webp` | `/images/blog/dolphin-pool-cleaner-selection-map.webp` | `/images/blog/dolphin-regional-responsibility-sku-check.webp` |
| Roborock | `/images/blog/is-roborock-owned-by-xiaomi-cover.webp` | `/images/blog/roborock-rockmow-product-map.webp` | `/images/blog/roborock-vs-dreame-platform-comparison.webp` |
| Tineco | `/images/blog/tineco-ecovacs-company-structure.webp` | `/images/blog/tineco-vs-bissell-crosswave-floor-washer-systems.webp` | `/images/blog/tineco-vs-dreame-floor-washers.webp` |

Set the third placement to `operations` when the image explains manufacturing, regional responsibility, or channels; otherwise use `competition`.

For every visual, add a factual `alt` describing the visible relationship and a one-sentence `caption` stating what the diagram helps the reader understand.

- [ ] **Step 6: Migrate the 10 profile records without changing conclusions**

For each JSON profile:

- add `logoImage: "/images/brands/{slug}/logo.webp"`;
- add `logoImageAlt: "{Brand name} logo"`;
- set `logoSourceUrl` to the profile’s official website or its official media/press-kit page from which Task 2 will retrieve the exact asset;
- copy each existing product `name` and `positioning` verbatim;
- add one concise `buyerRelevance` sentence that states an assortment, service, channel, origin, or platform implication already supported by the existing positioning and cited profile;
- convert every manufacturing and channel string verbatim into the `evidence` field;
- set `scope` to the exact level named by the original sentence, such as `Group disclosure`, `Named model`, `U.S. authorized sellers`, `China manufacturing base`, or `Reviewed reporting period`;
- set `buyerCheck` to a concrete verification action already implied by the sentence, such as checking exact SKU origin, regional seller authorization, warranty entity, shipment document, or distributor agreement;
- do not modify ownership, leadership, developments, sources, dates, descriptions, or competitive conclusions.

- [ ] **Step 7: Document the contract**

Update `content/brands/README.md` with the exact new fields, placement enum, official Logo sourcing boundary, 2–3 visual rule, and evidence object structure.

- [ ] **Step 8: Run tests and verify GREEN**

Run:

```bash
npm run test:brands
```

Expected: existing fixture tests plus the new boundary tests PASS, all 10 real profiles still meet publication gates, and all existing body visual paths exist.

- [ ] **Step 9: Commit**

```bash
git add lib/brands.ts tests/brandIntelligence.test.mjs content/brands/README.md content/brands
git commit -m "Define and migrate brand visual content"
```

---

### Task 2: Add Official Logo Assets

**Files:**
- Create: `public/images/brands/{slug}/logo.webp` for all 10 slugs listed in File Structure.
- Modify: `content/brands/*.json` only when replacing a source page with the exact official Logo asset URL.
- Modify: `tests/brandIntelligence.test.mjs`

**Interfaces:**
- Consumes: `BrandProfile` fields and validation from Task 1.
- Produces: 10 valid published profiles with stable official Logo files.

- [ ] **Step 1: Write the published-asset integrity test**

Add:

```js
test("all published brand profiles have local official logos and two to three local visuals", () => {
  const profiles = getBrandProfiles();
  assert.equal(profiles.length, 10);

  for (const candidate of profiles) {
    assert.equal(candidate.status, "published");
    assert.match(candidate.logoImage, /^\/images\/brands\/[a-z0-9-]+\/logo\.webp$/);
    assert.equal(
      fs.existsSync(path.join(process.cwd(), "public", candidate.logoImage)),
      true,
      `${candidate.slug} logo must exist`
    );
    assert.ok(candidate.contentVisuals.length >= 2 && candidate.contentVisuals.length <= 3);
    for (const visual of candidate.contentVisuals) {
      assert.equal(
        fs.existsSync(path.join(process.cwd(), "public", visual.src)),
        true,
        `${candidate.slug} visual must exist: ${visual.src}`
      );
    }
  }
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npm run test:brands
```

Expected: FAIL listing missing Logo metadata/assets and the unmigrated string evidence arrays.

- [ ] **Step 3: Acquire and normalize official Logo files**

For each brand, start at the profile’s `officialWebsite` and use only the official header Logo, media center, press kit, or an official downloadable brand asset. Save the original source URL in `logoSourceUrl`.

Normalize the official artwork to a transparent `logo.webp` without changing colors or geometry. Preserve a generous transparent margin and a minimum raster width of 600 px when the official source is raster.

After acquisition, set `logoSourceUrl` to the exact official asset URL when it is stable; otherwise retain the official media, press-kit, or webpage URL that directly exposes the asset.

Target paths:

```text
/images/brands/aiper/logo.webp
/images/brands/bissell/logo.webp
/images/brands/dreame/logo.webp
/images/brands/dyson/logo.webp
/images/brands/ecovacs/logo.webp
/images/brands/irobot/logo.webp
/images/brands/mammotion/logo.webp
/images/brands/maytronics/logo.webp
/images/brands/roborock/logo.webp
/images/brands/tineco/logo.webp
```

Reject favicon-only, screenshot-cropped, third-party Logo-library, and low-resolution files.

- [ ] **Step 4: Run brand tests and verify GREEN**

Run:

```bash
npm run test:brands
```

Expected: all 10 profiles remain published and every Logo/body visual path exists.

- [ ] **Step 5: Commit**

```bash
git add public/images/brands content/brands tests/brandIntelligence.test.mjs
git commit -m "Add official brand logo assets"
```

---

### Task 3: Build Reusable Brand Visual Components

**Files:**
- Create: `components/brands/BrandLogo.tsx`
- Create: `components/brands/BrandVisual.tsx`
- Create: `components/brands/BrandDataTable.tsx`
- Modify: `tests/brandExperience.test.mjs`

**Interfaces:**
- Consumes: `BrandProfile`, `BrandContentVisual`.
- Produces:
  - `BrandLogo({ profile, variant }: { profile: BrandProfile; variant: "card" | "hero" })`
  - `BrandVisual({ visual }: { visual: BrandContentVisual })`
  - `BrandDataTable({ caption, columns, rows }: BrandDataTableProps)`

- [ ] **Step 1: Write failing source-structure tests**

Add:

```js
test("brand visual primitives preserve logo geometry and semantic figures", () => {
  const logo = read("components/brands/BrandLogo.tsx");
  const visual = read("components/brands/BrandVisual.tsx");
  const table = read("components/brands/BrandDataTable.tsx");

  assert.match(logo, /variant:\s*"card"\s*\|\s*"hero"/);
  assert.match(logo, /src=\{profile\.logoImage\}/);
  assert.match(logo, /alt=\{profile\.logoImageAlt\}/);
  assert.match(visual, /<figure/);
  assert.match(visual, /<figcaption>/);
  assert.match(table, /<table/);
  assert.match(table, /<caption/);
  assert.match(table, /scope="col"/);
  assert.match(table, /data-label=/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm run test:brands
```

Expected: FAIL because the three component files do not exist.

- [ ] **Step 3: Implement `BrandLogo`**

Render:

```tsx
<div className={`brand-logo brand-logo--${variant}`}>
  <img
    src={profile.logoImage}
    alt={profile.logoImageAlt}
    loading={variant === "card" ? "lazy" : "eager"}
    decoding="async"
  />
</div>
```

Do not make the Logo a second nested link; the directory card’s outer link remains the single interactive target.

- [ ] **Step 4: Implement `BrandVisual`**

Render semantic `<figure className="brand-visual">`, image, and `<figcaption>`. Use `loading="lazy"` and `decoding="async"` because all body visuals are below the hero.

- [ ] **Step 5: Implement `BrandDataTable`**

Define:

```ts
type BrandDataColumn = {
  key: string;
  label: string;
};

type BrandDataTableProps = {
  caption: string;
  columns: BrandDataColumn[];
  rows: Array<Record<string, React.ReactNode>>;
};
```

Render a real `<table>` with a visually hidden caption, column headers, and each body cell carrying `data-label={column.label}` for mobile CSS.

- [ ] **Step 6: Run tests and verify GREEN**

Run:

```bash
npm run test:brands
```

Expected: the new primitive tests PASS.

- [ ] **Step 7: Commit**

```bash
git add components/brands/BrandLogo.tsx components/brands/BrandVisual.tsx components/brands/BrandDataTable.tsx tests/brandExperience.test.mjs
git commit -m "Add brand visual primitives"
```

---

### Task 4: Replace Directory Covers with Official Logos

**Files:**
- Modify: `components/brands/BrandDirectoryCard.tsx`
- Modify: `app/globals.css`
- Modify: `tests/brandExperience.test.mjs`

**Interfaces:**
- Consumes: `BrandLogo` from Task 3 and existing `BrandProfile`.
- Produces: one-link directory cards with a normalized Logo stage and at most three category labels.

- [ ] **Step 1: Write the failing directory test**

Add:

```js
test("brand directory cards use official logos instead of editorial hero images", () => {
  const card = read("components/brands/BrandDirectoryCard.tsx");
  assert.match(card, /<BrandLogo\s+profile=\{profile\}\s+variant="card"/);
  assert.match(card, /categories\.slice\(0,\s*3\)/);
  assert.doesNotMatch(card, /profile\.heroImage/);
  assert.doesNotMatch(card, /profile\.heroImageAlt/);
});
```

Update the CSS assertion to require `.brand-logo--card img` with `object-fit: contain`, and explicitly reject `object-fit: cover` for Logo images.

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
npm run test:brands
```

Expected: FAIL because the current card renders `profile.heroImage` and all categories.

- [ ] **Step 3: Implement the Logo card**

Import `BrandLogo`, render it before `.guide-card-copy`, and change category rendering to:

```tsx
const visibleCategories = categories.slice(0, 3);
...
<span>{visibleCategories.join(" · ")}</span>
```

Keep the name, description, `Updated` date, route, and one outer `<Link>`.

- [ ] **Step 4: Add isolated directory Logo styles**

Add:

- `.brand-logo--card` with a light neutral background, fixed `aspect-ratio: 16 / 7`, centered grid alignment, and consistent padding;
- `.brand-logo--card img` with constrained `max-width`, `max-height`, `width: 100%`, `height: 100%`, and `object-fit: contain`;
- no shadow, color filter, forced background removal, or Logo crop;
- stable card-copy spacing and equal-height card layout.

- [ ] **Step 5: Run tests and verify GREEN**

Run:

```bash
npm run test:brands
```

Expected: directory tests PASS and existing route/link tests remain green.

- [ ] **Step 6: Commit**

```bash
git add components/brands/BrandDirectoryCard.tsx app/globals.css tests/brandExperience.test.mjs
git commit -m "Use official logos in brand directory"
```

---

### Task 5: Add Hero Logo and Key Facts Table

**Files:**
- Modify: `components/brands/BrandHero.tsx`
- Modify: `app/globals.css`
- Modify: `tests/brandExperience.test.mjs`

**Interfaces:**
- Consumes: `BrandLogo`, `BrandDataTable`, `BrandProfile`.
- Produces: hero identity row, unchanged editorial cover, and a six-field Key Facts table.

- [ ] **Step 1: Write the failing hero test**

Add:

```js
test("brand hero separates official identity from editorial cover and renders key facts", () => {
  const hero = read("components/brands/BrandHero.tsx");
  assert.match(hero, /<BrandLogo\s+profile=\{profile\}\s+variant="hero"/);
  assert.match(hero, /profile\.heroImage/);
  assert.match(hero, /caption="Key facts"/);
  ["Legal entity scope", "Ownership type", "Headquarters", "Founded", "Official website", "Last verified"]
    .forEach((label) => assert.match(hero, new RegExp(label)));
  assert.doesNotMatch(hero, /<dl className="brand-snapshot-grid"/);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
npm run test:brands
```

Expected: FAIL because the hero has no Logo and still renders the old snapshot definition list.

- [ ] **Step 3: Implement the identity row**

Place `<BrandLogo profile={profile} variant="hero" />` inside a `.brand-hero-identity` wrapper immediately before the eyebrow/name group. Keep the existing hero cover and copy unchanged.

- [ ] **Step 4: Implement Key Facts**

Build six rows for `BrandDataTable`. Use `legalName || legalEntityNote` for legal entity scope. Use:

```ts
const ownershipType = profile.ownership.parentCompany
  ? `Part of ${profile.ownership.parentCompany}`
  : "See verified ownership analysis";
```

Render the official website as the existing external link and format `lastVerified` with `formatBrandDate`.

- [ ] **Step 5: Add hero and fact-table styles**

Keep the dark hero background and existing editorial cover proportions. Give the hero Logo a compact white stage. Style Key Facts as a contained table below the hero content; mobile cells stack using `data-label`.

- [ ] **Step 6: Run tests and verify GREEN**

Run:

```bash
npm run test:brands
```

Expected: hero, disclaimer, date, legal entity, and responsive tests PASS.

- [ ] **Step 7: Commit**

```bash
git add components/brands/BrandHero.tsx app/globals.css tests/brandExperience.test.mjs
git commit -m "Add brand identity and key facts table"
```

---

### Task 6: Turn Detail Sections into Tables and Placed Visuals

**Files:**
- Modify: `components/brands/BrandSections.tsx`
- Modify: `app/globals.css`
- Modify: `tests/brandExperience.test.mjs`

**Interfaces:**
- Consumes: `BrandDataTable`, `BrandVisual`, structured profile evidence, and `buildBrandCompetitorReferences`.
- Produces: four full-width section groups with relevant visuals and no text-only two-column card wall.

- [ ] **Step 1: Write the failing section test**

Add:

```js
test("brand sections pair structured tables with placed visuals", () => {
  const sections = read("components/brands/BrandSections.tsx");
  assert.match(sections, /placement === "ownership"/);
  assert.match(sections, /placement === "portfolio"/);
  assert.match(sections, /placement === "operations"/);
  assert.match(sections, /placement === "competition"/);
  assert.match(sections, /caption="Leadership"/);
  assert.match(sections, /caption="Product portfolio"/);
  assert.match(sections, /caption="Manufacturing and supply-chain evidence"/);
  assert.match(sections, /caption="Markets and channels evidence"/);
  assert.match(sections, /buyerRelevance/);
  assert.match(sections, /buyerCheck/);
  assert.doesNotMatch(sections, /function TextList/);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
npm run test:brands
```

Expected: FAIL because `BrandSections` still uses `TextList`, definition lists, and prose cards.

- [ ] **Step 3: Add deterministic visual lookup**

Inside `BrandSections`, derive:

```ts
const visualByPlacement = new Map(
  profile.contentVisuals.map((visual) => [visual.placement, visual])
);
```

Render a visual only when the placement exists. Never duplicate a visual into multiple sections.

- [ ] **Step 4: Implement Company & Ownership**

Render one `.brand-content-section` with:

- section title `Company & Ownership`;
- ownership summary and optional parent company;
- leadership table columns `Person`, `Role`, `Evidence note`;
- ownership visual beside or below the table.

Use `leader.context || "Role identified in the reviewed sources."` only as a display fallback; do not save this fallback into JSON.

- [ ] **Step 5: Implement Product Portfolio**

Render columns `Category`, `Positioning`, `Buyer relevance`. Use `product.buyerRelevance || "Review model and regional fit for the intended assortment."` only as a defensive fallback; Task 1 should populate the field for all real profiles.

Render the portfolio visual in the same section.

- [ ] **Step 6: Implement Manufacturing & Channels**

Render two separate `BrandDataTable` instances with columns `Evidence`, `Scope`, `Buyer check`. Use the corresponding structured arrays without parsing prose at render time.

Render the operations visual once after the two tables.

- [ ] **Step 7: Implement Competitive Position**

Keep the full WCB assessment and the current published-only competitor link behavior. Replace the comma sentence with `.brand-competitor-links` chips; render the competition visual when configured.

- [ ] **Step 8: Add section and mobile styles**

Add:

- full-width `.brand-content-section` with clear spacing and borders;
- `.brand-section-layout` two-column layout only when a visual is present;
- `.brand-table` desktop header/body styling;
- mobile table transformation where `thead` is visually hidden, each row becomes a block, and `td::before { content: attr(data-label) }`;
- `.brand-visual img { object-fit: contain; height: auto; }`;
- readable captions and no fixed-height crop;
- `.brand-competitor-links` wrapping chip layout.

- [ ] **Step 9: Run tests and verify GREEN**

Run:

```bash
npm run test:brands
```

Expected: all brand content, route, source, disclaimer, competitor, and responsive tests PASS.

- [ ] **Step 10: Commit**

```bash
git add components/brands/BrandSections.tsx app/globals.css tests/brandExperience.test.mjs
git commit -m "Visualize brand intelligence sections"
```

---

### Task 7: Add Logo Structured Data and Complete Automated Verification

**Files:**
- Modify: `lib/brands.ts`
- Modify: `tests/brandIntelligence.test.mjs`

**Interfaces:**
- Consumes: `profile.logoImage`.
- Produces: absolute `Organization.logo` in `buildBrandPageSchemas`.
- Preserves: `WebPage.image` and Open Graph image from `heroImage`.

- [ ] **Step 1: Write the failing schema test**

Extend the existing schema assertion:

```js
const schemas = buildBrandPageSchemas(
  { profile, primaryArticles: [], relatedArticles: [] },
  "https://worldcleanbiz.com"
);
const organization = schemas.find((schema) => schema["@type"] === "Organization");
const webPage = schemas.find((schema) => schema["@type"] === "WebPage");

assert.equal(
  organization.logo,
  "https://worldcleanbiz.com/images/brands/sample-brand/logo.webp"
);
assert.equal(
  webPage.image,
  "https://worldcleanbiz.com/images/insights/sample-cover.jpg"
);
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
npm run test:brands
```

Expected: FAIL because `Organization` does not yet include `logo`.

- [ ] **Step 3: Add the schema Logo**

Add:

```ts
logo: `${siteUrl}${profile.logoImage}`
```

to the Organization object only. Do not change `WebPage.image` or the page’s Open Graph hero.

- [ ] **Step 4: Run focused and adjacent verification**

Run:

```bash
npm run test:brands
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/blogConversion.test.mjs tests/homepageStructure.test.mjs tests/inquiryConversion.test.mjs
npm run verify:content-classification
npx tsc --noEmit
npm run build
```

Expected:

- all brand tests PASS;
- adjacent regression tests PASS, except only a previously documented unrelated failure may be reported separately rather than silently ignored;
- content classification PASS;
- TypeScript PASS;
- production build PASS and still generates `/brands` plus all 10 detail routes.

- [ ] **Step 5: Commit**

```bash
git add lib/brands.ts tests/brandIntelligence.test.mjs
git commit -m "Expose official brand logos in structured data"
```

---

### Task 8: Preview Deployment and Visual Acceptance

**Files:**
- No source changes unless a verified Preview defect requires a focused fix and new test.

**Interfaces:**
- Consumes: completed feature branch and passing build.
- Produces: user-reviewable Vercel Preview evidence; does not authorize production.

- [ ] **Step 1: Push the feature branch**

```bash
git push origin codex/wcb-brand-intelligence-implementation
```

Expected: remote branch points to the latest verified commit.

- [ ] **Step 2: Create or refresh the Vercel Preview**

Use the existing `new-project-5` Vercel project and confirm the deployment commit SHA matches the pushed branch HEAD.

Expected: Preview state `READY`, with a successful build and no build-time errors.

- [ ] **Step 3: Verify the directory**

Check `/brands` at desktop and mobile widths:

- exactly 10 published cards;
- every card displays the correct official Logo;
- no editorial hero cover appears in a directory card;
- Logo geometry and colors are unchanged;
- category labels are limited to three;
- cards remain aligned without broken images.

- [ ] **Step 4: Verify representative detail pages**

Check at least:

- `/brands/aiper` — multi-entity ownership, model-specific manufacturing, pool portfolio;
- `/brands/dyson` — long headquarters/manufacturing content;
- `/brands/ecovacs` — listed group and Tineco company relationship;
- `/brands/mammotion` — regional entity and product-platform visuals.

For each, confirm:

- Logo and editorial hero both render;
- Key Facts table is readable;
- ownership, portfolio, manufacturing, channel, and competitor sections use the correct visual;
- figures have visible captions;
- desktop headers and mobile label/value table layouts work;
- timeline, article list, sources, disclaimer, and dates are unchanged;
- no browser console errors or broken asset requests.

- [ ] **Step 5: Report Preview and request production approval**

Report:

- branch name and final commit;
- automated test/build results;
- Preview URL;
- pages and widths checked;
- any unrelated known test issue;
- explicit statement that production remains unchanged.

Do not merge `main` until the user explicitly approves production.
