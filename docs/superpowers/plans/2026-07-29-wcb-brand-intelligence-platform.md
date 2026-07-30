# WCB Brand Intelligence Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the crawlable `/brands` hub and reusable brand-detail system without publishing thin or unverified brand pages.

**Architecture:** Store each brand as an independently editable JSON profile under `content/brands`. A server-only loader validates profiles, joins them to explicitly tagged WCB articles, and exposes only profiles that pass the publishing gate. Next.js App Router pages render the directory and detail views; pure helpers own article grouping, validation, sitemap records, and JSON-LD so they can be tested outside React.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5, Node.js test runner, JSON content files, existing WCB global CSS.

## Global Constraints

- Audience: overseas buyers, distributors, brand professionals, supply-chain researchers, investors, and industry analysts.
- Primary outcome: WCB authority and organic search growth; sourcing conversion is not the primary CTA.
- Public routes are `/brands` and `/brands/{slug}`.
- Brand facts require human verification; no external data scraping or automatic fact generation.
- A public brand needs at least three reliable sources and three explicitly related WCB articles.
- Brand pages use `WebPage`, `Organization`, `BreadcrumbList`, `CollectionPage`, and `ItemList` where applicable; do not use `ProfilePage`.
- A new related article must not automatically change `lastVerified` or `lastModified`.
- Unpublished or invalid brand profiles must not appear in public routes, the directory, internal brand links, or the sitemap.
- Do not add consumer coupon, review, deal, or generic “best product” content.
- Do not change the primary header navigation in this phase.
- Do not add dependencies.
- Preserve the current blog URL structure and MDX article body.
- Routine release path remains feature branch → tests/build → GitHub → Vercel Preview → explicit production approval → merge to `main`.
- Do not use `vercel --prod`.

---

## File Structure

### New files

- `lib/brands.ts` — types, JSON loading, validation, article grouping, schema builders, and sitemap records.
- `content/brands/README.md` — editing rules, field definitions, source hierarchy, and publishing gate.
- `app/brands/page.tsx` — crawlable brand directory.
- `app/brands/[slug]/page.tsx` — statically generated brand detail page.
- `components/brands/BrandDirectoryCard.tsx` — directory card only.
- `components/brands/BrandHero.tsx` — identity, snapshot, dates, and disclaimer.
- `components/brands/BrandSections.tsx` — ownership, leadership, portfolio, manufacturing, markets, and competitive position.
- `components/brands/BrandTimeline.tsx` — dated developments.
- `components/brands/BrandArticles.tsx` — primary and related WCB analysis.
- `components/brands/BrandSources.tsx` — numbered sources and update record.
- `components/ArticleBrandLinks.tsx` — links an article to valid brand hubs.
- `tests/brandIntelligence.test.mjs` — loader, validation, grouping, and schema behavior.
- `tests/brandExperience.test.mjs` — route, metadata, internal-link, sitemap, and CSS integration checks.

### Modified files

- `lib/content.ts` — expose `primaryBrands` and `relatedBrands` from MDX frontmatter.
- `app/blog/[slug]/page.tsx` — render valid primary-brand links near article metadata.
- `app/sitemap.ts` — add valid brand directory and detail records with per-profile modification dates.
- `components/Footer.tsx` — add one “Brand Intelligence” discovery link under the existing editorial/resources group.
- `app/globals.css` — isolated brand-directory and brand-detail styles.
- `package.json` — add `test:brands`.

### Content files added by the separate rollout plan

- `content/brands/*.json`
- Selected `content/insights/*.mdx` frontmatter entries

---

### Task 1: Brand profile types, loader, and publishing gate

**Files:**

- Create: `lib/brands.ts`
- Create: `content/brands/README.md`
- Create: `tests/brandIntelligence.test.mjs`
- Modify: `package.json`

**Interfaces:**

- Consumes: JSON files in `content/brands`.
- Produces:
  - `BrandProfile`
  - `BrandTaggedArticle`
  - `BrandPageData`
  - `getBrandProfiles(): BrandProfile[]`
  - `validateBrandProfile(profile, articles): string[]`
  - `getPublishedBrandProfiles(articles): BrandProfile[]`
  - `getBrandPageData(slug, articles): BrandPageData | undefined`
  - `normalizeBrandSlugs(value): string[]`

- [ ] **Step 1: Add the focused test command**

Add to `package.json`:

```json
"test:brands": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/brandIntelligence.test.mjs tests/brandExperience.test.mjs"
```

- [ ] **Step 2: Write failing validation and article-grouping tests**

Create `tests/brandIntelligence.test.mjs` with an in-memory profile that contains:

```js
const profile = {
  status: "published",
  slug: "sample-brand",
  name: "Sample Brand",
  aliases: ["Sample"],
  legalName: "Sample Brand Holdings Ltd.",
  officialWebsite: "https://example.com",
  headline: "Sample Brand company, products and market strategy",
  description: "Independent company and market intelligence for cleaning-industry professionals.",
  metaDescription: "Sample Brand ownership, products, manufacturing, channels and strategy.",
  disclaimer: "World Clean Biz is not affiliated with Sample Brand.",
  headquarters: "Sample City",
  founded: "2018",
  heroImage: "/images/insights/sample-cover.jpg",
  heroImageAlt: "Sample Brand products",
  ownership: { summary: "Sample Brand Holdings Ltd. controls the brand." },
  leadership: [{ name: "Alex Example", role: "Founder" }],
  productPortfolio: [{ name: "Robot vacuums", positioning: "Premium residential floorcare" }],
  manufacturingSupplyChain: ["Manufacturing statement verified against the cited company source."],
  marketsChannels: ["Direct ecommerce and distributor channels in named markets."],
  competitivePosition: {
    summary: "WCB assessment based on product breadth, channel reach and verified company disclosures.",
    competitorSlugs: ["other-brand"]
  },
  developments: [{
    date: "2026-07-01",
    title: "Company update",
    summary: "The company disclosed a material channel update.",
    sourceIds: ["source-1"]
  }],
  sources: [
    { id: "source-1", title: "Company source", publisher: "Sample Brand", url: "https://example.com/company", accessedAt: "2026-07-29" },
    { id: "source-2", title: "Regulatory filing", publisher: "Exchange", url: "https://example.com/filing", accessedAt: "2026-07-29" },
    { id: "source-3", title: "Management interview", publisher: "Industry Publication", url: "https://example.com/interview", accessedAt: "2026-07-29" }
  ],
  publishedAt: "2026-07-29T12:00:00+08:00",
  lastVerified: "2026-07-29",
  lastModified: "2026-07-29T12:00:00+08:00"
};
```

Use three article fixtures with `primaryBrands: ["sample-brand"]`. Assert:

- the valid profile returns no validation errors;
- two sources trigger a source-count error;
- two related articles trigger an article-count error;
- an unknown `sourceId` in a development triggers an error;
- an invalid date triggers an error;
- duplicated primary/related articles appear once;
- primary articles sort by descending `sortDate`;
- `status: "draft"` never appears in `getPublishedBrandProfiles`.

- [ ] **Step 3: Run the test to verify it fails**

Run:

```bash
npm run test:brands
```

Expected: FAIL because `lib/brands.ts` and `tests/brandExperience.test.mjs` do not exist.

- [ ] **Step 4: Implement the profile model and pure validation**

Define the production shape in `lib/brands.ts`:

```ts
export type BrandProfile = {
  status: "draft" | "published";
  slug: string;
  name: string;
  aliases: string[];
  legalName: string;
  officialWebsite: string;
  headline: string;
  description: string;
  metaDescription: string;
  disclaimer: string;
  headquarters: string;
  founded: string;
  heroImage?: string;
  heroImageAlt?: string;
  ownership: { summary: string; parentCompany?: string };
  leadership: Array<{ name: string; role: string; context?: string }>;
  productPortfolio: Array<{ name: string; positioning: string }>;
  manufacturingSupplyChain: string[];
  marketsChannels: string[];
  competitivePosition: {
    summary: string;
    competitorSlugs: string[];
  };
  developments: Array<{
    date: string;
    title: string;
    summary: string;
    sourceIds: string[];
  }>;
  sources: Array<{
    id: string;
    title: string;
    publisher: string;
    url: string;
    publishedAt?: string;
    accessedAt: string;
  }>;
  publishedAt: string;
  lastVerified: string;
  lastModified: string;
};

export type BrandTaggedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  sortDate: string;
  readingTime?: string;
  coverImage?: string;
  coverAlt?: string;
  primaryBrands: string[];
  relatedBrands: string[];
};

export type BrandPageData = {
  profile: BrandProfile;
  primaryArticles: BrandTaggedArticle[];
  relatedArticles: BrandTaggedArticle[];
};
```

Validation must reject a published profile when:

- a required identity, page-copy, update-date, or disclaimer field is blank;
- fewer than three unique valid HTTP(S) sources exist;
- fewer than three unique primary-plus-related articles exist;
- no primary article exists;
- `productPortfolio`, `manufacturingSupplyChain`, `marketsChannels`, or `competitivePosition.summary` is empty;
- source IDs are duplicated;
- a development references an unknown source ID;
- a profile date or development date cannot be parsed;
- `heroImage` is present without `heroImageAlt`;
- slug format does not match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`.

Load only `.json` files, sort profiles by `name`, and throw an error that includes the filename when JSON cannot be parsed. `getPublishedBrandProfiles` must return only `status: "published"` profiles with zero validation errors.

- [ ] **Step 5: Document editing and source rules**

In `content/brands/README.md`, copy the exact field names above and document:

- official company, regulator, exchange, annual report, prospectus, and formal interview sources take priority;
- unsupported facts are omitted or described as not publicly disclosed;
- WCB analysis is clearly separated from reported fact;
- `lastVerified` changes only after a human source review;
- `lastModified` changes only after a material profile edit;
- profiles remain `draft` until `npm run test:brands` accepts them.

- [ ] **Step 6: Create a temporary empty experience test file**

Create `tests/brandExperience.test.mjs` with:

```js
import test from "node:test";

test("brand experience tests are added with the routes", { skip: true }, () => {});
```

This keeps the focused script runnable until Task 3 replaces the skipped test.

- [ ] **Step 7: Run the focused tests**

Run:

```bash
npm run test:brands
```

Expected: all active tests PASS; one route test is SKIP.

- [ ] **Step 8: Commit**

```bash
git add package.json lib/brands.ts content/brands/README.md tests/brandIntelligence.test.mjs tests/brandExperience.test.mjs
git commit -m "Add validated brand intelligence data model"
```

---

### Task 2: Explicit article-to-brand relationships

**Files:**

- Modify: `lib/content.ts`
- Modify: `tests/brandIntelligence.test.mjs`

**Interfaces:**

- Consumes: MDX frontmatter keys `primary_brands` and `related_brands`.
- Produces: `Insight.primaryBrands: string[]` and `Insight.relatedBrands: string[]`.

- [ ] **Step 1: Write failing normalization tests**

Add tests for `normalizeBrandSlugs`:

```js
assert.deepEqual(normalizeBrandSlugs([" Roborock ", "roborock", "Dreame"]), [
  "roborock",
  "dreame"
]);
assert.deepEqual(normalizeBrandSlugs("Roborock"), ["roborock"]);
assert.deepEqual(normalizeBrandSlugs(undefined), []);
```

Also assert malformed values and blank strings are removed.

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test:brands
```

Expected: FAIL because `normalizeBrandSlugs` does not yet accept every supported frontmatter value.

- [ ] **Step 3: Implement slug normalization**

Implement:

```ts
export function normalizeBrandSlugs(value: unknown): string[] {
  const values = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];

  return [...new Set(
    values
      .map((item) => String(item).trim().toLowerCase())
      .filter((item) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item))
  )];
}
```

- [ ] **Step 4: Extend `Insight` and the MDX loader**

Add:

```ts
primaryBrands: string[];
relatedBrands: string[];
```

Populate them in `getInsights()`:

```ts
primaryBrands: normalizeBrandSlugs(data.primary_brands),
relatedBrands: normalizeBrandSlugs(data.related_brands)
```

Do not infer these fields from title, body text, or legacy tags.

- [ ] **Step 5: Run focused and existing content tests**

Run:

```bash
npm run test:brands
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/insightCollections.test.mjs tests/guideTaxonomy.test.mjs tests/blogSeries.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/content.ts lib/brands.ts tests/brandIntelligence.test.mjs
git commit -m "Add explicit article brand relationships"
```

---

### Task 3: Brand directory and detail routes

**Files:**

- Create: `app/brands/page.tsx`
- Create: `app/brands/[slug]/page.tsx`
- Create: `components/brands/BrandDirectoryCard.tsx`
- Create: `components/brands/BrandHero.tsx`
- Create: `components/brands/BrandSections.tsx`
- Create: `components/brands/BrandTimeline.tsx`
- Create: `components/brands/BrandArticles.tsx`
- Create: `components/brands/BrandSources.tsx`
- Replace: `tests/brandExperience.test.mjs`

**Interfaces:**

- Consumes: `getInsights()`, `getPublishedBrandProfiles()`, `getBrandPageData()`.
- Produces: `/brands`, `/brands/{slug}`, static params, metadata, visible breadcrumbs, and JSON-LD.

- [ ] **Step 1: Write failing route-structure tests**

Replace the skipped test with source checks that assert:

- `/brands` has canonical metadata, one H1, `CollectionPage`, `ItemList`, and a link for each published profile;
- `/brands/[slug]` exports `dynamicParams = false`, `generateStaticParams`, and `generateMetadata`;
- the detail route calls `notFound()` when `getBrandPageData` returns no profile;
- the detail route renders `WebPage`, `Organization`, and `BreadcrumbList`;
- no brand route contains `ProfilePage`;
- visible text includes “Independent Brand Intelligence” and the stored disclaimer;
- sources and update dates are visible.

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test:brands
```

Expected: FAIL because the routes and components do not exist.

- [ ] **Step 3: Add schema builders to `lib/brands.ts`**

Add:

```ts
export function buildBrandDirectorySchemas(profiles: BrandProfile[], siteUrl: string): object[];
export function buildBrandPageSchemas(data: BrandPageData, siteUrl: string): object[];
```

Directory schemas must contain `CollectionPage`, `ItemList`, and `BreadcrumbList`.

Detail schemas must contain:

```json
{
  "@type": "WebPage",
  "about": { "@id": "#brand" }
}
```

and a separate organization node:

```json
{
  "@id": "#brand",
  "@type": "Organization",
  "name": "Stored profile name",
  "legalName": "Stored legal name",
  "url": "Stored official website"
}
```

Do not add properties that are absent from the verified profile.

- [ ] **Step 4: Build the directory route**

`app/brands/page.tsx` must:

- load `getInsights()` once;
- derive valid profiles through `getPublishedBrandProfiles(articles)`;
- render title “Cleaning Industry Brand Intelligence”;
- explain the buyer/distributor audience;
- render `BrandDirectoryCard` for each valid profile;
- include a restrained link back to `/blog`;
- inject schemas from `buildBrandDirectorySchemas`.

- [ ] **Step 5: Build the detail route**

`app/brands/[slug]/page.tsx` must:

- set `dynamicParams = false`;
- generate params from valid profiles only;
- return `{}` metadata for an invalid slug;
- set title to `${profile.name} Company Profile, Ownership, Products & Strategy`;
- set canonical to `/brands/${profile.slug}`;
- use `profile.metaDescription` and `profile.heroImage` for Open Graph;
- call `notFound()` for drafts, invalid profiles, or unknown slugs;
- render the components in the approved order;
- inject schema output from `buildBrandPageSchemas`.

- [ ] **Step 6: Implement focused components**

Responsibilities:

- `BrandHero`: breadcrumb, identity, snapshot, verification dates, hero image, and disclaimer.
- `BrandSections`: ownership, leadership, portfolio, manufacturing/supply chain, markets/channels, and competitive position.
- `BrandTimeline`: developments sorted newest first and linked to numbered source anchors.
- `BrandArticles`: primary analysis first, related analysis second, no duplicated slug.
- `BrandSources`: ordered sources, accessed dates, first publication, last verification, and last material modification.
- `BrandDirectoryCard`: name, summary, categories inferred from `productPortfolio`, update date, and detail link.

Each component must return `null` for an optional empty section instead of adding empty headings.

- [ ] **Step 7: Run focused tests**

Run:

```bash
npm run test:brands
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add app/brands components/brands lib/brands.ts tests/brandExperience.test.mjs
git commit -m "Build brand intelligence directory and detail pages"
```

---

### Task 4: Styles, article links, sitemap, and discovery

**Files:**

- Create: `components/ArticleBrandLinks.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: `components/Footer.tsx`
- Modify: `app/globals.css`
- Modify: `tests/brandExperience.test.mjs`

**Interfaces:**

- Consumes: valid published profiles and `Insight.primaryBrands`.
- Produces: natural article-to-brand links, sitemap records, footer discovery, and responsive presentation.

- [ ] **Step 1: Write failing integration tests**

Add assertions that:

- the article route renders `ArticleBrandLinks` once near article metadata;
- only `primaryBrands` are shown as the article’s main brand links;
- unpublished slugs are filtered out;
- the sitemap includes `/brands` and one record per valid profile;
- each detail sitemap record uses `profile.lastModified`;
- the footer includes exactly one link to `/brands`;
- CSS includes an isolated `/* Brand intelligence hub */` section;
- mobile rules collapse the two-column hero, fact grid, and article cards below `760px`;
- image rules use `object-fit: cover`;
- no route adds a second `<main>` landmark.

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test:brands
```

Expected: FAIL because integration points are absent.

- [ ] **Step 3: Implement valid article brand links**

`ArticleBrandLinks` receives:

```ts
{
  brandSlugs: string[];
  profiles: BrandProfile[];
}
```

It preserves input order, removes duplicates, filters to published profiles, and returns `null` when no valid links remain. Visible label:

```text
Brand Intelligence
```

Each link uses `/brands/{slug}`. Do not link every brand mention in the article body.

- [ ] **Step 4: Add article integration**

In `app/blog/[slug]/page.tsx`:

- derive published profiles once from the existing `articles` array;
- render `ArticleBrandLinks` with `article.primaryBrands`;
- place it after the visible tag/meta block and before the body;
- leave article content and related-article selection unchanged.

- [ ] **Step 5: Add sitemap and footer discovery**

In `app/sitemap.ts`:

- load insights once;
- add `/brands`;
- add only profiles returned by `getPublishedBrandProfiles(insights)`;
- set each brand detail `lastModified` from the stored profile value.

In `components/Footer.tsx`, add one “Brand Intelligence” link under the existing editorial/resources column. Do not modify `components/Header.tsx`.

- [ ] **Step 6: Add isolated responsive styles**

Append one clearly marked section to `app/globals.css`. Use existing WCB color variables and container widths. Required selectors:

```css
.brand-hub
.brand-directory-hero
.brand-directory-grid
.brand-directory-card
.brand-detail
.brand-detail-hero
.brand-snapshot-grid
.brand-section-grid
.brand-timeline
.brand-article-grid
.brand-sources
.article-brand-links
```

At `max-width: 760px`, all multi-column layouts become one column; source URLs wrap; hero images retain a stable crop.

- [ ] **Step 7: Run focused tests**

Run:

```bash
npm run test:brands
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add components/ArticleBrandLinks.tsx app/blog/[slug]/page.tsx app/sitemap.ts components/Footer.tsx app/globals.css tests/brandExperience.test.mjs
git commit -m "Connect brand hubs to articles and discovery"
```

---

### Task 5: Local quality gate and preview handoff

**Files:**

- Modify only files required to fix failures discovered below.

**Interfaces:**

- Consumes: all platform tasks and the first-ten-brand content plan.
- Produces: a locally verified feature branch ready for Preview approval.

- [ ] **Step 1: Run all brand tests**

Run:

```bash
npm run test:brands
```

Expected: PASS with zero skipped tests.

- [ ] **Step 2: Run adjacent regression tests**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test \
  tests/blogSeries.test.mjs \
  tests/blogConversion.test.mjs \
  tests/guideTaxonomy.test.mjs \
  tests/guidesExperience.test.mjs \
  tests/insightCollections.test.mjs
```

Expected: PASS.

- [ ] **Step 3: Run the production build**

Run:

```bash
npm run build
```

Expected: exit 0; `/brands` and ten `/brands/{slug}` routes appear in the build output.

- [ ] **Step 4: Inspect locally**

Run:

```bash
npm run dev
```

Check:

- `/brands`
- `/brands/roborock`
- one page from each of the other two product categories
- one linked article
- one unknown brand URL

Verify desktop and mobile layout, visible disclaimer, source links, article cards, no broken images, no browser console errors, and a 404 for the unknown brand.

- [ ] **Step 5: Commit any verification fixes**

```bash
git add <only-the-files-fixed-during-verification>
git commit -m "Fix brand hub verification issues"
```

Skip this commit when no files changed.

- [ ] **Step 6: Stop for external preview approval**

Report the local test and build evidence. Ask before pushing the branch or creating a Vercel Preview. Do not merge to `main` and do not deploy production.
