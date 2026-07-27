# Analysis and Guides Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep `/blog` unchanged while rebuilding `/blog/archive`, `/guides`, and `/guides/[type]` as the previous Blog-style single-column article feed with a contextual right sidebar.

**Architecture:** Add one server-rendered directory component shared by the analysis and Guides routes, plus pure pagination and URL helpers. Each route remains responsible for selecting its collection, filters, metadata, and structured data; the shared component owns only presentation.

**Tech Stack:** Next.js App Router, React server components, TypeScript, existing MDX content helpers, CSS, Node test runner.

## Global Constraints

- `/blog` and `components/BlogLanding.tsx` must not change.
- Existing article URLs, guide taxonomy, canonical paths, and content stay unchanged.
- `/blog/archive` renders editorial analysis only.
- `/guides` renders all guides; `/guides/[type]` renders one guide type.
- Render 10 feed items per page.
- Use existing cover images with `object-fit: contain`.
- Desktop uses a sticky 300–340 px sidebar; mobile moves sidebar below the feed.
- Filtered and paginated query URLs use `noindex, follow`.
- No new dependencies, image assets, or third-party scripts.

---

### Task 1: Directory pagination and URL helpers

**Files:**
- Create: `lib/contentDirectory.ts`
- Create: `tests/contentDirectory.test.mjs`

**Interfaces:**
- Consumes: `Insight[]` from `lib/content.ts`.
- Produces:
  - `DIRECTORY_PAGE_SIZE: 10`
  - `parseDirectoryPage(value: string | string[] | undefined): number`
  - `paginateDirectoryItems<T>(items: T[], requestedPage: number): { items: T[]; currentPage: number; totalPages: number; pageStart: number }`
  - `directoryHref(pathname: string, page: number, params?: Record<string, string | undefined>): string`

- [ ] **Step 1: Write failing helper tests**

```js
test("directory pagination clamps invalid and out-of-range pages", () => {
  assert.equal(parseDirectoryPage("bad"), 1);
  assert.equal(parseDirectoryPage("-2"), 1);
  const result = paginateDirectoryItems(Array.from({ length: 23 }, (_, index) => index), 99);
  assert.equal(result.currentPage, 3);
  assert.deepEqual(result.items, [20, 21, 22]);
});

test("directoryHref preserves filters and omits page one", () => {
  assert.equal(directoryHref("/blog/archive", 1, { category: "Floorcare" }), "/blog/archive?category=Floorcare");
  assert.equal(directoryHref("/guides", 2), "/guides?page=2");
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/contentDirectory.test.mjs
```

Expected: FAIL because `lib/contentDirectory.ts` does not exist.

- [ ] **Step 3: Implement the pure helpers**

```ts
export const DIRECTORY_PAGE_SIZE = 10;

export function parseDirectoryPage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function paginateDirectoryItems<T>(items: T[], requestedPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / DIRECTORY_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const pageStart = (currentPage - 1) * DIRECTORY_PAGE_SIZE;
  return {
    items: items.slice(pageStart, pageStart + DIRECTORY_PAGE_SIZE),
    currentPage,
    totalPages,
    pageStart
  };
}
```

`directoryHref` must use `URLSearchParams`, preserve every defined parameter,
omit `page` when the page is one, and return the pathname without a trailing
question mark when there are no parameters.

- [ ] **Step 4: Run helper tests**

Run the Task 1 test command again.

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/contentDirectory.ts tests/contentDirectory.test.mjs
git commit -m "feat: add directory pagination helpers"
```

### Task 2: Shared single-column feed and sidebar

**Files:**
- Create: `components/ContentDirectory.tsx`
- Modify: `app/globals.css`
- Create: `tests/directoryExperience.test.mjs`

**Interfaces:**
- Consumes:
  - `Insight` from `lib/content.ts`
  - precomputed filters, pagination links, sidebar links, and visible articles
- Produces:
  - `DirectoryFilter`
  - `DirectoryLink`
  - `DirectoryPaginationItem`
  - `ContentDirectory(props)`

The component props are:

```ts
type ContentDirectoryProps = {
  variant: "analysis" | "guides";
  eyebrow: string;
  title: string;
  description: string;
  totalLabel: string;
  articles: Insight[];
  filters: DirectoryFilter[];
  pagination: DirectoryPaginationItem[];
  previousHref?: string;
  nextHref?: string;
  sidebarPrimaryTitle: string;
  sidebarPrimaryLinks: DirectoryLink[];
  sidebarSecondaryTitle: string;
  sidebarSecondaryLinks: DirectoryLink[];
  latestArticles: Insight[];
};
```

- [ ] **Step 1: Write failing component contract tests**

Assert that the component source includes:

```js
assert.match(source, /className="content-directory-layout"/);
assert.match(source, /<main className="content-directory-feed"/);
assert.match(source, /<aside className="content-directory-sidebar"/);
assert.match(source, /className="content-directory-feed-item"/);
assert.match(source, /aria-current=\{filter\.active \? "page" : undefined\}/);
assert.match(source, /loading=\{index === 0 \? "eager" : "lazy"\}/);
```

Also assert in CSS:

```js
assert.match(css, /\.content-directory-layout\\s*\\{[^}]*grid-template-columns:\\s*minmax\\(0,\\s*1fr\\)\\s+minmax\\(300px,\\s*340px\\)/s);
assert.match(css, /\.content-directory-feed-item\\s*\\{[^}]*grid-template-columns:/s);
assert.match(css, /\.content-directory-sidebar\\s*\\{[^}]*position:\\s*sticky/s);
assert.match(css, /\.content-directory-feed-image img\\s*\\{[^}]*object-fit:\\s*contain/s);
```

- [ ] **Step 2: Run the component contract test and verify it fails**

Run:

```bash
node --test tests/directoryExperience.test.mjs
```

Expected: FAIL because the component and CSS classes do not exist.

- [ ] **Step 3: Implement `ContentDirectory`**

Render:

- A compact navy directory header
- Horizontally scrollable filter links
- A semantic `main` containing one linked article per row
- Cover image, category, title, excerpt, date, reading time
- Semantic pagination with `aria-current="page"`
- A semantic `aside` containing primary links, secondary links, and latest
  articles with thumbnail images

Use one full-row link:

```tsx
<Link
  className="content-directory-feed-item"
  href={`/blog/${article.slug}`}
  aria-label={`Read ${article.title}`}
>
  <div className="content-directory-feed-image">
    <img
      src={imageFor(article, index)}
      alt={article.coverAlt || `${article.title} cover`}
      loading={index === 0 ? "eager" : "lazy"}
      decoding="async"
    />
  </div>
  <div className="content-directory-feed-copy">
    <span className="insights-category">{article.category}</span>
    <h2>{article.title}</h2>
    <p>{article.excerpt}</p>
    <div className="insights-card-meta">
      {article.date ? <span>{article.date}</span> : null}
      <span>{article.readingTime}</span>
    </div>
    <strong>Read Article →</strong>
  </div>
</Link>
```

Reuse the existing four fallback images from `components/BlogLanding.tsx`
without modifying that file.

- [ ] **Step 4: Add responsive directory CSS**

Desktop:

- `.content-directory-layout`: flexible feed plus 300–340 px sidebar
- `.content-directory-feed-item`: approximately 310 px image plus copy
- `.content-directory-sidebar`: sticky at 92 px
- 30–40 px gap and restrained borders instead of large cards

At 900 px and below:

- One content column
- Sidebar is no longer sticky

At 760 px and below:

- Article rows become one column
- Image appears above copy
- Filters remain horizontally scrollable
- Pagination wraps

- [ ] **Step 5: Run the component contract test**

Run the Task 2 test command again.

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/ContentDirectory.tsx app/globals.css tests/directoryExperience.test.mjs
git commit -m "feat: add shared content directory layout"
```

### Task 3: Rebuild the Analysis archive

**Files:**
- Modify: `app/blog/archive/page.tsx`
- Modify: `tests/contentExperience.test.mjs`
- Modify: `tests/directoryExperience.test.mjs`

**Interfaces:**
- Consumes:
  - `getEditorialInsights(getInsights())`
  - Task 1 pagination helpers
  - Task 2 `ContentDirectory`
- Produces: server-rendered `/blog/archive` analysis directory.

- [ ] **Step 1: Replace obsolete Archive assertions with failing directory assertions**

Assert that:

```js
assert.match(archive, /getEditorialInsights/);
assert.doesNotMatch(archive, /getGuideInsights/);
assert.match(archive, /<ContentDirectory/);
assert.match(archive, /variant="analysis"/);
assert.match(archive, /DIRECTORY_PAGE_SIZE|paginateDirectoryItems/);
assert.match(archive, /robots:\\s*hasQueryParams/);
assert.match(archive, /id="analysis"/);
```

Keep structured-data assertions for `CollectionPage`, `ItemList`, and
`BreadcrumbList`. Remove assertions for the old category-summary cards and
the Guides section inside Archive.

- [ ] **Step 2: Run the focused tests and verify they fail**

Run:

```bash
node --test tests/contentExperience.test.mjs tests/directoryExperience.test.mjs
```

Expected: FAIL against the old two-column Archive cards.

- [ ] **Step 3: Implement server-rendered filtering and pagination**

Add:

```ts
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
```

Resolve `category` and `page`, filter the editorial collection, paginate it,
and build category filter links and page links with `directoryHref`.

`generateMetadata` must retain canonical `/blog/archive` and return
`robots: { index: false, follow: true }` when any query parameter is present.

- [ ] **Step 4: Render the shared directory**

Use:

```tsx
<ContentDirectory
  variant="analysis"
  eyebrow="Original Editorial"
  title="Analysis & Insights"
  description="Industry shifts, company strategy, original research and market observations."
  totalLabel={`${editorialArticles.length} analysis articles`}
  articles={visibleArticles}
  filters={filters}
  pagination={pagination}
  previousHref={previousHref}
  nextHref={nextHref}
  sidebarPrimaryTitle="Explore World Clean Biz"
  sidebarPrimaryLinks={directoryLinks}
  sidebarSecondaryTitle="Popular Analysis Categories"
  sidebarSecondaryLinks={categoryLinks}
  latestArticles={editorialArticles.slice(0, 5)}
/>
```

The root wrapping element must carry `id="analysis"` so the existing
`/blog/archive#analysis` Blog link lands correctly.

Structured data must include only editorial articles, and visible `ItemList`
positions must account for the current page start.

- [ ] **Step 5: Run focused tests**

Run the Task 3 test command again.

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/blog/archive/page.tsx tests/contentExperience.test.mjs tests/directoryExperience.test.mjs
git commit -m "feat: rebuild analysis archive as article feed"
```

### Task 4: Rebuild Guides and guide-type directories

**Files:**
- Modify: `app/guides/page.tsx`
- Modify: `app/guides/[type]/page.tsx`
- Modify: `tests/guidesExperience.test.mjs`
- Modify: `tests/directoryExperience.test.mjs`

**Interfaces:**
- Consumes:
  - `getGuideInsights`
  - `GUIDE_TYPE_CONFIG`
  - Task 1 pagination helpers
  - Task 2 `ContentDirectory`
- Produces:
  - `/guides` complete guide feed
  - `/guides/[type]` filtered guide feed

- [ ] **Step 1: Replace old Guides hub assertions with failing directory assertions**

Assert that both Guides route sources render `ContentDirectory`, that the
landing no longer renders `guides-category-grid`, and that category pages
preserve `generateStaticParams`.

Also assert:

```js
assert.match(landing, /variant="guides"/);
assert.match(category, /variant="guides"/);
assert.match(landing, /getGuideInsights\\(allArticles\\)/);
assert.match(category, /getGuideInsights\\(getInsights\\(\\), type\\)/);
assert.match(category, /directoryHref\\(config\\.href/);
```

- [ ] **Step 2: Run the focused Guides tests and verify they fail**

Run:

```bash
node --test tests/guidesExperience.test.mjs tests/directoryExperience.test.mjs
```

Expected: FAIL against the old Guides hub and card grid.

- [ ] **Step 3: Implement `/guides` pagination**

Resolve `page`, paginate the complete guide collection, and construct filters
from `GUIDE_TYPE_CONFIG`.

The sidebar uses:

- All Guides plus six guide-type links
- Four featured high-value guides
- Five latest guides with thumbnails

Retain `/guides` canonical metadata and update the structured-data `ItemList`
to match the visible page.

- [ ] **Step 4: Implement `/guides/[type]` pagination**

Add `searchParams` to the page props, paginate the already-filtered collection,
highlight the current guide type, and build page URLs from `config.href`.

Keep:

- Existing static params
- Existing canonical path for each guide type
- Existing breadcrumb structure
- Existing guide-type description

Add `robots: { index: false, follow: true }` only when a page query parameter
is present.

- [ ] **Step 5: Run focused Guides tests**

Run the Task 4 test command again.

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/guides/page.tsx app/guides/[type]/page.tsx tests/guidesExperience.test.mjs tests/directoryExperience.test.mjs
git commit -m "feat: rebuild guide directories as article feeds"
```

### Task 5: Regression, build, and preview verification

**Files:**
- Modify only files required by failures found in this task.

**Interfaces:**
- Consumes: Tasks 1–4.
- Produces: a verified Vercel Preview without modifying production.

- [ ] **Step 1: Run all focused content tests**

Run:

```bash
node --test tests/contentDirectory.test.mjs tests/directoryExperience.test.mjs tests/contentExperience.test.mjs tests/guidesExperience.test.mjs tests/blogLanding.test.mjs tests/blogConversion.test.mjs tests/insightCollections.test.mjs
```

Expected: PASS.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: successful Next.js production build with all guide category routes.

- [ ] **Step 3: Confirm Blog source is unchanged**

Run:

```bash
git diff 7ae78ae -- app/blog/page.tsx components/BlogLanding.tsx
```

Expected: no output.

- [ ] **Step 4: Verify local desktop and mobile pages**

Check:

- `/blog` at desktop and mobile
- `/blog/archive#analysis` at desktop and mobile
- `/blog/archive?category=Robotic+Mowers&page=2`
- `/guides` at desktop and mobile
- `/guides/ownership`
- `/guides/comparison?page=2`

Confirm image containment, sidebar position, filter state, pagination, article
links, focus visibility, and mobile reading order.

- [ ] **Step 5: Create a Vercel Preview**

Push the feature branch and create a non-production Vercel Preview following
the repository release rules.

- [ ] **Step 6: Verify the Preview**

Repeat the desktop and mobile checks against the Preview URL, confirm there are
no browser errors, and confirm production `worldcleanbiz.com/blog` remains
unchanged.

- [ ] **Step 7: Hand off the Preview**

Give the Preview URL to the user. Do not merge to `main` or deploy production
until explicit approval is received.
