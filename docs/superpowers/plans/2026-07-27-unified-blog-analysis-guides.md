# Unified Blog Analysis and Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/blog` as a full-width landing page with the latest fixed series episode, six editorial analysis cards, six practical guide cards, no sidebar, and one Blog item in the primary navigation.

**Architecture:** Keep the existing `content_class`, `guide_type`, `guide_priority`, `series`, and `/blog/[slug]` data model. Add small pure collection helpers for deterministic homepage selection, keep presentation in a focused server component, and let `app/blog/page.tsx` compose the page and structured data. Preserve `/guides`, `/blog/archive`, all article URLs, and the current content-classification checks.

**Tech Stack:** Next.js 15 App Router, React 19 server components, TypeScript, MDX frontmatter, CSS in `app/globals.css`, Node test runner.

## Global Constraints

- Primary navigation contains `Blog` but no separate `Guides` item.
- `/guides`, Guide category pages, `/blog/archive`, and every `/blog/[slug]` URL remain available and indexable.
- Homepage order is: Blog introduction, fixed series, six Deep Analysis cards, six Practical Guides cards, Newsletter, full-width business links.
- Desktop article grids are exactly three columns and two rows when six articles are available.
- Tablet grids use two columns; mobile grids use one column without horizontal scrolling.
- The fixed series is `building-worlds-no-1-cleaning-show-from-scratch`.
- The fixed series is excluded from the six Deep Analysis cards to prevent duplication.
- Every analysis and guide card is one ordinary server-rendered link to its article.
- Guide selection uses positive `guide_priority` first and fills remaining positions by `sortDate`.
- Do not alter article dates, article slugs, content classification, or canonical URLs.
- Do not add a new dependency.

---

### Task 1: Add deterministic Blog homepage collection helpers

**Files:**
- Create: `tests/insightCollections.test.mjs`
- Modify: `lib/insightCollections.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `Insight.series`, `Insight.seriesEpisode`, `Insight.contentClass`, `Insight.guidePriority`, `Insight.sortDate`, and `Insight.slug`.
- Produces:
  - `getLatestSeriesInsight<T extends SortableInsight>(articles: T[], series: string): T | undefined`
  - `getBlogHomepageEditorial<T extends SortableInsight>(articles: T[], excludedSeries: string, limit?: number): T[]`
  - `getBlogHomepageGuides<T extends SortableInsight>(articles: T[], limit?: number): T[]`

- [ ] **Step 1: Write focused failing tests for series, editorial, and Guide selection**

Create `tests/insightCollections.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  getBlogHomepageEditorial,
  getBlogHomepageGuides,
  getLatestSeriesInsight
} from "../lib/insightCollections.ts";

function insight(overrides) {
  return {
    slug: overrides.slug,
    contentClass: "editorial",
    guideType: undefined,
    guidePriority: 0,
    sortDate: "2026-01-01",
    series: undefined,
    seriesEpisode: undefined,
    ...overrides
  };
}

test("selects the highest numeric episode from the fixed series", () => {
  const articles = [
    insight({ slug: "ep-2", series: "wcb-series", seriesEpisode: "02", sortDate: "2026-07-01" }),
    insight({ slug: "ep-10", series: "wcb-series", seriesEpisode: "10", sortDate: "2026-06-01" }),
    insight({ slug: "other", series: "another-series", seriesEpisode: "99" })
  ];

  assert.equal(getLatestSeriesInsight(articles, "wcb-series")?.slug, "ep-10");
});

test("falls back to sortDate when series episodes are not numeric", () => {
  const articles = [
    insight({ slug: "older", series: "wcb-series", seriesEpisode: "", sortDate: "2026-06-01" }),
    insight({ slug: "newer", series: "wcb-series", seriesEpisode: "special", sortDate: "2026-07-01" })
  ];

  assert.equal(getLatestSeriesInsight(articles, "wcb-series")?.slug, "newer");
});

test("returns six newest editorial articles while excluding the fixed series", () => {
  const articles = [
    insight({ slug: "series-episode", series: "wcb-series", sortDate: "2026-07-20" }),
    ...Array.from({ length: 8 }, (_, index) =>
      insight({
        slug: `editorial-${index}`,
        sortDate: `2026-07-${String(19 - index).padStart(2, "0")}`
      })
    ),
    insight({ slug: "guide", contentClass: "search", guideType: "buying", sortDate: "2026-07-21" })
  ];

  assert.deepEqual(
    getBlogHomepageEditorial(articles, "wcb-series").map((article) => article.slug),
    ["editorial-0", "editorial-1", "editorial-2", "editorial-3", "editorial-4", "editorial-5"]
  );
});

test("puts prioritized guides first and fills the remaining six by newest date", () => {
  const articles = [
    insight({ slug: "priority-2", contentClass: "search", guideType: "buying", guidePriority: 2, sortDate: "2026-01-01" }),
    insight({ slug: "priority-1", contentClass: "search", guideType: "ownership", guidePriority: 1, sortDate: "2025-01-01" }),
    ...Array.from({ length: 6 }, (_, index) =>
      insight({
        slug: `latest-${index}`,
        contentClass: "search",
        guideType: "comparison",
        guidePriority: 0,
        sortDate: `2026-07-${String(20 - index).padStart(2, "0")}`
      })
    )
  ];

  assert.deepEqual(
    getBlogHomepageGuides(articles).map((article) => article.slug),
    ["priority-1", "priority-2", "latest-0", "latest-1", "latest-2", "latest-3"]
  );
});
```

- [ ] **Step 2: Add the test script and verify the tests fail**

Add to `package.json` scripts:

```json
"test:insights": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/insightCollections.test.mjs"
```

Run:

```bash
npm run test:insights
```

Expected: FAIL because the three homepage helper exports do not exist.

- [ ] **Step 3: Implement the minimal pure selection helpers**

Extend `SortableInsight` with `series` and `seriesEpisode`, then add:

```ts
function episodeNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function getLatestSeriesInsight<T extends SortableInsight>(
  articles: T[],
  series: string
) {
  return [...articles]
    .filter((article) => article.series === series)
    .sort((a, b) => {
      const episodeA = episodeNumber(a.seriesEpisode);
      const episodeB = episodeNumber(b.seriesEpisode);

      if (episodeA !== undefined && episodeB !== undefined && episodeA !== episodeB) {
        return episodeB - episodeA;
      }

      if (episodeA !== undefined) return -1;
      if (episodeB !== undefined) return 1;

      return b.sortDate.localeCompare(a.sortDate) || a.slug.localeCompare(b.slug);
    })[0];
}

export function getBlogHomepageEditorial<T extends SortableInsight>(
  articles: T[],
  excludedSeries: string,
  limit = 6
) {
  return getEditorialInsights(articles)
    .filter((article) => article.series !== excludedSeries)
    .slice(0, limit);
}

export function getBlogHomepageGuides<T extends SortableInsight>(
  articles: T[],
  limit = 6
) {
  return getGuideInsights(articles)
    .sort((a, b) => {
      const priorityA = a.guidePriority > 0 ? a.guidePriority : Number.MAX_SAFE_INTEGER;
      const priorityB = b.guidePriority > 0 ? b.guidePriority : Number.MAX_SAFE_INTEGER;
      return (
        priorityA - priorityB ||
        b.sortDate.localeCompare(a.sortDate) ||
        a.slug.localeCompare(b.slug)
      );
    })
    .slice(0, limit);
}
```

- [ ] **Step 4: Run the helper tests and classification verification**

Run:

```bash
npm run test:insights
npm run verify:content-classification
```

Expected: all helper tests PASS and content classification reports no invalid visible articles.

- [ ] **Step 5: Commit the collection contract**

```bash
git add package.json lib/insightCollections.ts tests/insightCollections.test.mjs
git commit -m "test: define unified blog content selection"
```

---

### Task 2: Create reusable full-width Blog landing components

**Files:**
- Create: `components/BlogLanding.tsx`
- Create: `tests/blogLanding.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `Insight` objects already selected by Task 1.
- Produces:
  - `BlogSeriesHero({ article }: { article: Insight }): JSX.Element`
  - `BlogArticleGrid({ articles, sectionId, eyebrow, title, description, archiveHref, archiveLabel, variant }: BlogArticleGridProps): JSX.Element`
  - `BlogBusinessLinks(): JSX.Element`

- [ ] **Step 1: Write failing structural tests for links and page modules**

Create `tests/blogLanding.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentSource = await readFile(
  new URL("../components/BlogLanding.tsx", import.meta.url),
  "utf8"
).catch(() => "");

test("article cards are ordinary whole-card links", () => {
  assert.match(componentSource, /className="blog-home-card"/);
  assert.match(componentSource, /href=\{`\\/blog\\/\\$\\{article\\.slug\\}`\}/);
  assert.match(componentSource, /aria-label=\{`Read \\$\\{article\\.title\\}`\}/);
});

test("landing components expose series, grid, and business modules", () => {
  assert.match(componentSource, /export function BlogSeriesHero/);
  assert.match(componentSource, /export function BlogArticleGrid/);
  assert.match(componentSource, /export function BlogBusinessLinks/);
});

test("series hero provides latest episode and all episodes links", () => {
  assert.match(componentSource, /Read latest episode/);
  assert.match(componentSource, /#series-episodes/);
});
```

- [ ] **Step 2: Add the test script and verify failure**

Add:

```json
"test:blog-landing": "node --test tests/blogLanding.test.mjs"
```

Run:

```bash
npm run test:blog-landing
```

Expected: FAIL because `components/BlogLanding.tsx` does not exist.

- [ ] **Step 3: Implement `BlogSeriesHero`**

Use a semantic section with one primary linked visual/copy area and a separate All Episodes link:

```tsx
export function BlogSeriesHero({ article }: { article: Insight }) {
  return (
    <section className="blog-home-series" aria-labelledby="blog-series-title">
      <Link
        className="blog-home-series-main"
        href={`/blog/${article.slug}`}
        aria-label={`Read ${article.title}`}
      >
        <div className="blog-home-series-image">
          <img
            src={imageFor(article, 0)}
            alt={`${article.seriesTitle || article.title} cover`}
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="blog-home-series-copy">
          <p className="eyebrow">Ongoing Series · Latest Episode</p>
          <h2 id="blog-series-title">{article.seriesTitle || article.title}</h2>
          {article.seriesTitle ? <h3>{article.title}</h3> : null}
          <p>{article.excerpt}</p>
          <strong>Read latest episode →</strong>
        </div>
      </Link>
      <Link className="blog-home-series-all" href={`/blog/${article.slug}#series-episodes`}>
        View all episodes
      </Link>
    </section>
  );
}
```

Define `imageFor()` in this presentation file using the current four fallback images from `app/blog/page.tsx`, so the data route no longer owns visual fallback logic.

- [ ] **Step 4: Implement one whole-card component and the shared six-card grid**

Use this card contract:

```tsx
function BlogHomeCard({
  article,
  index,
  variant
}: {
  article: Insight;
  index: number;
  variant: "analysis" | "guide";
}) {
  return (
    <Link
      className={`blog-home-card blog-home-card-${variant}`}
      href={`/blog/${article.slug}`}
      aria-label={`Read ${article.title}`}
    >
      <div className="blog-home-card-image">
        <img
          src={imageFor(article, index)}
          alt={`${article.title} cover`}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="blog-home-card-copy">
        <span className="insights-category">{article.category}</span>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <div className="insights-card-meta">
          <span>{article.date}</span>
          <span>{article.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
```

`BlogArticleGrid` must render one H2, one archive link, and `articles.map()` inside `.blog-home-grid`. Do not put nested links inside `BlogHomeCard`.

- [ ] **Step 5: Implement full-width business links**

`BlogBusinessLinks` renders three ordinary links after the Newsletter:

```tsx
export function BlogBusinessLinks() {
  return (
    <section className="blog-home-business" aria-labelledby="blog-business-title">
      <div>
        <p className="eyebrow">Continue With World Clean Biz</p>
        <h2 id="blog-business-title">Turn industry intelligence into practical opportunities.</h2>
      </div>
      <nav aria-label="World Clean Biz business resources">
        <Link href="/reports">Explore Market Reports</Link>
        <Link href="/sourcing">Discuss Product Opportunities</Link>
        <Link href="/world-clean-expo">Explore World Clean Expo</Link>
      </nav>
    </section>
  );
}
```

- [ ] **Step 6: Run component structural tests**

Run:

```bash
npm run test:blog-landing
```

Expected: all tests PASS.

- [ ] **Step 7: Commit the presentation components**

```bash
git add package.json components/BlogLanding.tsx tests/blogLanding.test.mjs
git commit -m "feat: add unified blog landing components"
```

---

### Task 3: Replace the Blog feed and sidebar with the confirmed landing page

**Files:**
- Modify: `app/blog/page.tsx`
- Modify: `tests/blogConversion.test.mjs`

**Interfaces:**
- Consumes:
  - `getLatestSeriesInsight(allArticles, featuredSeries)`
  - `getBlogHomepageEditorial(allArticles, featuredSeries, 6)`
  - `getBlogHomepageGuides(allArticles, 6)`
  - Components from `components/BlogLanding.tsx`
- Produces: `/blog` server-rendered page with exactly the confirmed section order and no sidebar.

- [ ] **Step 1: Add failing homepage composition assertions**

Extend `tests/blogConversion.test.mjs`:

```js
test("Blog homepage composes the fixed series and two six-card sections", () => {
  assert.match(blogSource, /getLatestSeriesInsight/);
  assert.match(blogSource, /getBlogHomepageEditorial\\(allArticles, featuredSeries, 6\\)/);
  assert.match(blogSource, /getBlogHomepageGuides\\(allArticles, 6\\)/);
  assert.match(blogSource, /<BlogSeriesHero article=\{latestSeriesArticle\}/);
  assert.match(blogSource, /title="Deep Analysis"/);
  assert.match(blogSource, /title="Practical Guides"/);
  assert.match(blogSource, /href="\\/blog\\/archive#analysis"/);
  assert.match(blogSource, /href="\\/guides"/);
});

test("Blog homepage no longer renders the legacy sidebar, filters, or pagination", () => {
  assert.doesNotMatch(blogSource, /SidebarContent/);
  assert.doesNotMatch(blogSource, /<aside/);
  assert.doesNotMatch(blogSource, /insights-filter-panel/);
  assert.doesNotMatch(blogSource, /insights-pagination-v2/);
});
```

Run:

```bash
npm run test:blog
```

Expected: the new assertions FAIL against the legacy Blog page.

- [ ] **Step 2: Replace legacy filtering, pagination, feed, and sidebar selection**

Remove from `app/blog/page.tsx`:

- `articlesPerPage`
- brand and category matcher arrays
- filter and pagination helpers
- `SidebarContent`
- `ArticleFeedItem`
- query-driven feed selection
- sidebar rendering
- pagination rendering

Keep query-aware `generateMetadata()` so unexpected query parameter versions remain `noindex, follow`.

Select homepage content once:

```ts
const allArticles = getInsights();
const latestSeriesArticle = getLatestSeriesInsight(allArticles, featuredSeries);
const analysisArticles = getBlogHomepageEditorial(allArticles, featuredSeries, 6);
const guideArticles = getBlogHomepageGuides(allArticles, 6);
const visibleArticles = [
  ...(latestSeriesArticle ? [latestSeriesArticle] : []),
  ...analysisArticles,
  ...guideArticles
];
```

- [ ] **Step 3: Render the confirmed section order**

Compose:

```tsx
<>
  <section className="blog-home-intro">
    <div className="insights-page-container">
      <p className="eyebrow">World Clean Biz Intelligence</p>
      <h1>Cleaning Industry Analysis And Practical Guides.</h1>
      <p>
        Original industry intelligence and practical decision guides for
        buyers, brands, distributors and manufacturers.
      </p>
    </div>
  </section>

  <main className="blog-home-main">
    <div className="insights-page-container">
      {latestSeriesArticle ? <BlogSeriesHero article={latestSeriesArticle} /> : null}
      <BlogArticleGrid
        articles={analysisArticles}
        sectionId="analysis"
        eyebrow="Original Editorial"
        title="Deep Analysis"
        description="Industry shifts, company strategy, original research and market observations."
        archiveHref="/blog/archive#analysis"
        archiveLabel="View all analysis"
        variant="analysis"
      />
      <BlogArticleGrid
        articles={guideArticles}
        sectionId="guides"
        eyebrow="Practical Research"
        title="Practical Guides"
        description="Buying decisions, brand ownership, product comparisons, sourcing and maintenance."
        archiveHref="/guides"
        archiveLabel="Browse all guides"
        variant="guide"
      />
      <NewsletterLeadForm />
      <BlogBusinessLinks />
    </div>
  </main>
</>
```

There must be no `aside` on this page.

- [ ] **Step 4: Update metadata and ItemList structured data**

Broaden the Blog description to include both analysis and guides. Build ItemList from `visibleArticles`:

```ts
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "World Clean Biz Blog",
  numberOfItems: visibleArticles.length,
  itemListElement: visibleArticles.map((article, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${siteUrl}/blog/${article.slug}`,
    name: article.title
  }))
};
```

Keep Blog canonical `/blog` and the existing BreadcrumbList.

- [ ] **Step 5: Run Blog and landing tests**

Run:

```bash
npm run test:blog
npm run test:blog-landing
npm run test:insights
```

Expected: all tests PASS.

- [ ] **Step 6: Commit the new Blog page composition**

```bash
git add app/blog/page.tsx tests/blogConversion.test.mjs
git commit -m "feat: unify analysis and guides on Blog"
```

---

### Task 4: Add the 3×2 responsive visual system and simplify primary navigation

**Files:**
- Modify: `app/globals.css`
- Modify: `components/Header.tsx`
- Modify: `tests/blogLanding.test.mjs`

**Interfaces:**
- Consumes: class names emitted by `components/BlogLanding.tsx` and `app/blog/page.tsx`.
- Produces: three-column desktop grids, two-column tablet grids, one-column mobile grids, full-width CTA modules, and a primary nav with Blog but no Guides.

- [ ] **Step 1: Add failing source assertions for navigation and responsive rules**

Extend `tests/blogLanding.test.mjs`:

```js
const headerSource = await readFile(
  new URL("../components/Header.tsx", import.meta.url),
  "utf8"
);
const cssSource = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8"
);

test("primary navigation keeps Blog and removes Guides", () => {
  assert.match(headerSource, /href: "\\/blog", label: "Blog"/);
  assert.doesNotMatch(headerSource, /href: "\\/guides", label: "Guides"/);
});

test("Blog grids use three, two, and one columns at responsive breakpoints", () => {
  assert.match(cssSource, /\\.blog-home-grid\\s*\\{[^}]*grid-template-columns:\\s*repeat\\(3,/s);
  assert.match(cssSource, /@media \\(max-width: 900px\\)[\\s\\S]*\\.blog-home-grid\\s*\\{[^}]*repeat\\(2,/);
  assert.match(cssSource, /@media \\(max-width: 760px\\)[\\s\\S]*\\.blog-home-grid\\s*\\{[^}]*grid-template-columns:\\s*1fr/);
});
```

Run:

```bash
npm run test:blog-landing
```

Expected: FAIL because the navigation and new responsive CSS are not yet updated.

- [ ] **Step 2: Remove Guides from the primary navigation**

Delete only this item from `navItems` in `components/Header.tsx`:

```ts
{ href: "/guides", label: "Guides" },
```

Do not delete the `/guides` route or any footer/content link.

- [ ] **Step 3: Add full-width Blog landing styles**

Append one clearly labelled `/* Unified Blog landing */` block to `app/globals.css`. The core layout contract is:

```css
.blog-home-main {
  padding: 56px 0 72px;
  background: #f4f8fe;
}

.blog-home-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.blog-home-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #d7e3f2;
  border-radius: 16px;
  color: var(--ink);
  background: #fff;
  box-shadow: 0 8px 22px rgba(7, 29, 58, .06);
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}

.blog-home-card:hover,
.blog-home-card:focus-visible {
  transform: translateY(-4px);
  border-color: #9db9dc;
  box-shadow: 0 14px 30px rgba(7, 29, 58, .12);
}

.blog-home-card-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #e8eef7;
}

.blog-home-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 900px) {
  .blog-home-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .blog-home-grid {
    grid-template-columns: 1fr;
  }
}
```

Also style:

- `.blog-home-intro` as a compact introduction, not the previous oversized two-column hero.
- `.blog-home-series` and `.blog-home-series-main` as the highest-priority two-column feature.
- `.blog-home-section` with consistent spacing and an H2/archive-link heading row.
- `.blog-home-card-copy` with bounded excerpt length and consistent card height.
- `.blog-home-guides` with a subtle alternate background or border to distinguish Guides without lowering readability.
- `.insights-newsletter-cta` as a full-width module.
- `.blog-home-business` as a full-width final resource module.

Do not retain `.insights-publication-layout` or `.insights-sidebar` in the new Blog JSX.

- [ ] **Step 4: Add responsive series and CTA behavior**

At `max-width: 900px`, collapse `.blog-home-series-main` from two columns to one. At `max-width: 760px`, keep all CTA links full width, reduce section padding, and ensure `.blog-home-series-all` remains visible without horizontal scrolling.

- [ ] **Step 5: Run source, Blog, and classification tests**

Run:

```bash
npm run test:blog-landing
npm run test:blog
npm run test:insights
npm run verify:content-classification
```

Expected: all tests PASS.

- [ ] **Step 6: Commit navigation and styling**

```bash
git add app/globals.css components/Header.tsx tests/blogLanding.test.mjs
git commit -m "style: finish unified Blog landing layout"
```

---

### Task 5: Validate routes, responsive behavior, structured data, and production build

**Files:**
- Modify only if verification finds a defect:
  - `app/blog/page.tsx`
  - `components/BlogLanding.tsx`
  - `app/globals.css`
  - `components/Header.tsx`
  - corresponding test file
- Reference: `docs/operations/wcb-blog-preview-checklist.md`

**Interfaces:**
- Consumes: completed Tasks 1–4.
- Produces: a buildable, reviewable preview ready for production authorization.

- [ ] **Step 1: Run the complete relevant automated suite**

Run:

```bash
npm run test:insights
npm run test:blog-landing
npm run test:blog
npm run test:homepage
npm run verify:content-classification
npm run build
```

Expected: every test passes and Next.js completes a production build without TypeScript, route, metadata, or prerender failures.

- [ ] **Step 2: Start a local production-equivalent preview**

Run:

```bash
npm run dev
```

Open these routes:

- `/blog`
- `/blog/archive#analysis`
- `/guides`
- one Guide category page
- the current latest series article
- one editorial article
- one Guide article

Expected: all routes load, and no existing article URL redirects or returns 404.

- [ ] **Step 3: Verify desktop behavior at 1440×900**

Check:

- fixed series appears above both grids;
- Deep Analysis shows 3 cards per row and 6 total;
- Practical Guides shows 3 cards per row and 6 total;
- no sidebar, Latest Articles duplicate, or Guide duplicate module exists;
- all card areas show pointer/focus affordance and enter the correct article;
- View all analysis enters `/blog/archive#analysis`;
- Browse all guides enters `/guides`;
- Header has Blog and no Guides;
- Newsletter and business links appear after both grids.

- [ ] **Step 4: Verify tablet and mobile behavior**

Check at 834×1112 and 390×844:

- tablet grids show 2 columns;
- mobile grids show 1 column;
- no horizontal overflow;
- title, cover, metadata, and CTA remain readable;
- mobile navigation has Blog and no Guides;
- the series CTA and All Episodes link remain reachable.

- [ ] **Step 5: Verify semantics and structured data**

Inspect the rendered page:

- exactly one H1;
- series, Deep Analysis, Practical Guides, Newsletter/business headings follow logical H2/H3 order;
- visible ItemList order matches latest series, six analysis articles, then six guides;
- all 13 visible article entries are unique;
- `/blog` canonical is unchanged;
- ordinary anchor links exist without requiring client-side JavaScript.

- [ ] **Step 6: Fix only verified defects and rerun the affected test plus the full build**

For each defect:

1. add or tighten the smallest relevant automated assertion;
2. confirm it fails;
3. make the minimal code or CSS fix;
4. rerun the affected test;
5. rerun `npm run build`.

Expected: PASS after every fix, with no unrelated refactor.

- [ ] **Step 7: Commit final verification fixes**

If files changed:

```bash
git add app/blog/page.tsx components/BlogLanding.tsx app/globals.css components/Header.tsx tests
git commit -m "fix: address unified Blog preview findings"
```

If no files changed, do not create an empty commit.

- [ ] **Step 8: Stop before production deployment**

Report:

- selected latest series slug;
- six Deep Analysis slugs;
- six Practical Guide slugs;
- automated test results;
- production build result;
- desktop/tablet/mobile preview result;
- preview URL if a preview deployment is created.

Production deployment requires the user's explicit deployment authorization.
