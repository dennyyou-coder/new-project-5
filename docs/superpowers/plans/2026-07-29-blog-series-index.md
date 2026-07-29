# Blog Series Index Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a permanent page for all episodes of the WCB original series and a separate “View Full Series” action on the Blog Featured Article.

**Architecture:** A small pure helper filters and orders series articles using existing frontmatter. A dynamic Next.js route renders the collection, while the Blog page links to it whenever the featured article has a `series` value.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Node test runner, CSS.

## Global Constraints

- Permanent route: `/blog/series/building-worlds-no-1-cleaning-show-from-scratch`.
- Use existing `series`, `series_title` and `series_episode` frontmatter.
- Future matching episodes must appear automatically.
- Keep existing per-article `All Episodes` and previous/next navigation.
- Do not change article content, article URLs, category filters, site header or other Blog cards.
- Verify desktop and 390 px layouts without horizontal overflow.

---

### Task 1: Series Collection Helper

**Files:**
- Create: `lib/blogSeries.ts`
- Create: `tests/blogSeries.test.mjs`

**Interfaces:**
- Consumes: articles exposing `series`, `seriesEpisode` and `sortDate`.
- Produces: `getSeriesArticles<T>(articles: T[], series: string): T[]`.

- [ ] **Step 1: Write the failing helper tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { getSeriesArticles } from "../lib/blogSeries.ts";

const articles = [
  { slug: "episode-10", series: "wcb-series", seriesEpisode: "10", sortDate: "2026-08-10" },
  { slug: "other-series", series: "other", seriesEpisode: "01", sortDate: "2026-08-01" },
  { slug: "episode-02", series: "wcb-series", seriesEpisode: "02", sortDate: "2026-07-28" },
  { slug: "episode-01", series: "wcb-series", seriesEpisode: "01", sortDate: "2026-07-20" }
];

test("filters a series and sorts numeric episode values in ascending order", () => {
  assert.deepEqual(
    getSeriesArticles(articles, "wcb-series").map(({ slug }) => slug),
    ["episode-01", "episode-02", "episode-10"]
  );
});

test("uses sortDate when episode numbers are absent or equal", () => {
  const undatedEpisodes = [
    { slug: "later", series: "wcb-series", sortDate: "2026-08-02" },
    { slug: "earlier", series: "wcb-series", sortDate: "2026-08-01" }
  ];

  assert.deepEqual(
    getSeriesArticles(undatedEpisodes, "wcb-series").map(({ slug }) => slug),
    ["earlier", "later"]
  );
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/blogSeries.test.mjs
```

Expected: FAIL because `lib/blogSeries.ts` does not exist.

- [ ] **Step 3: Implement the minimal pure helper**

```ts
type SeriesArticle = {
  series?: string;
  seriesEpisode?: string;
  sortDate: string;
};

export function getSeriesArticles<T extends SeriesArticle>(articles: T[], series: string): T[] {
  return articles
    .filter((article) => article.series === series)
    .sort((a, b) => {
      const episodeA = Number.parseInt(a.seriesEpisode || "", 10);
      const episodeB = Number.parseInt(b.seriesEpisode || "", 10);

      if (Number.isFinite(episodeA) && Number.isFinite(episodeB) && episodeA !== episodeB) {
        return episodeA - episodeB;
      }

      return a.sortDate.localeCompare(b.sortDate);
    });
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the Step 2 command. Expected: 2 tests pass, 0 fail.

- [ ] **Step 5: Commit the helper**

```bash
git add lib/blogSeries.ts tests/blogSeries.test.mjs
git commit -m "Add blog series collection helper"
```

### Task 2: Permanent Series Page and SEO

**Files:**
- Create: `app/blog/series/[series]/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: `tests/blogSeries.test.mjs`

**Interfaces:**
- Consumes: `getInsights()`, `getEditorialInsights()` and `getSeriesArticles()`.
- Produces: statically generated series routes with page metadata and CollectionPage, ItemList and BreadcrumbList schemas.

- [ ] **Step 1: Add failing source-contract tests**

Extend `tests/blogSeries.test.mjs` to read the route and sitemap sources and assert:

```js
const [seriesPageSource, sitemapSource] = await Promise.all([
  readFile(new URL("../app/blog/series/[series]/page.tsx", import.meta.url), "utf8").catch(() => ""),
  readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8")
]);

test("series page exposes collection metadata and ordered episodes", () => {
  assert.match(seriesPageSource, /getSeriesArticles/);
  assert.match(seriesPageSource, /generateStaticParams/);
  assert.match(seriesPageSource, /generateMetadata/);
  assert.match(seriesPageSource, /CollectionPage/);
  assert.match(seriesPageSource, /ItemList/);
  assert.match(seriesPageSource, /BreadcrumbList/);
  assert.match(seriesPageSource, /WCB Original Series/);
});

test("sitemap includes permanent Blog series routes", () => {
  assert.match(sitemapSource, /getBlogSeriesSlugs/);
  assert.match(sitemapSource, /\/blog\/series\/\$\{series\}/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run the Task 1 test command. Expected: the two new tests fail because the route and sitemap support are absent.

- [ ] **Step 3: Add series slug discovery**

Extend `lib/blogSeries.ts`:

```ts
export function getBlogSeriesSlugs<T extends Pick<SeriesArticle, "series">>(articles: T[]): string[] {
  return [...new Set(articles.map((article) => article.series).filter((series): series is string => Boolean(series)))];
}
```

Add a helper test asserting duplicates and missing values are removed.

- [ ] **Step 4: Build the dynamic route**

Create `app/blog/series/[series]/page.tsx` with:

- `generateStaticParams()` from editorial series slugs.
- `generateMetadata()` using the series title, canonical route and first episode cover.
- `notFound()` when no editorial episodes match.
- Breadcrumbs, series heading, description, episode count and latest date.
- An ordered list of cards linking to `/blog/${article.slug}`.
- JSON-LD for CollectionPage, ItemList and BreadcrumbList.
- A `Back to Blog` link.

Use this description for the named WCB series:

```ts
const descriptions: Record<string, string> = {
  "building-worlds-no-1-cleaning-show-from-scratch":
    "Follow You Denny’s public record of building World Clean Expo, from the industry experiences that shaped the idea to the decisions, setbacks and connections behind the show."
};
```

- [ ] **Step 5: Add series URLs to the sitemap**

In `app/sitemap.ts`, derive editorial series slugs and append:

```ts
...getBlogSeriesSlugs(getEditorialInsights(getInsights())).map((series) => ({
  url: `${baseUrl}/blog/series/${series}`,
  lastModified
}))
```

- [ ] **Step 6: Run the focused test and verify GREEN**

Run the Task 1 test command. Expected: all series tests pass.

- [ ] **Step 7: Commit the series page**

```bash
git add app/blog/series/[series]/page.tsx app/sitemap.ts lib/blogSeries.ts tests/blogSeries.test.mjs
git commit -m "Add permanent blog series pages"
```

### Task 3: Blog Featured Series Action and Responsive Styles

**Files:**
- Modify: `app/blog/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/blogSeries.test.mjs`

**Interfaces:**
- Consumes: `featured.series` and `featured.slug`.
- Produces: separate article and full-series links without nested anchors.

- [ ] **Step 1: Add failing Blog action tests**

```js
const blogSource = await readFile(
  new URL("../app/blog/page.tsx", import.meta.url),
  "utf8"
);

test("Featured Article offers separate article and full-series actions", () => {
  assert.match(blogSource, /Read Article/);
  assert.match(blogSource, /View Full Series/);
  assert.match(blogSource, /`\/blog\/series\/\$\{featured\.series\}`/);
  assert.match(blogSource, /insights-featured-actions/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run the Task 1 test command. Expected: the new action test fails because `View Full Series` is absent.

- [ ] **Step 3: Refactor the Featured Article into a semantic article card**

Replace the single outer `<Link>` with `<article className="insights-featured-hero">`. Keep the cover and title linked to the featured article. Add:

```tsx
<div className="insights-featured-actions">
  <Link href={`/blog/${featured.slug}`}>Read Article →</Link>
  {featured.series ? (
    <Link href={`/blog/series/${featured.series}`}>View Full Series →</Link>
  ) : null}
</div>
```

Keep the current featured selection, title hierarchy, excerpt, date and reading time unchanged.

- [ ] **Step 4: Add narrowly scoped styles**

Add:

```css
.insights-featured-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 24px;
  align-items: center;
  margin-top: 18px;
}

.insights-featured-actions a {
  border-bottom: 2px solid var(--accent);
  color: var(--ink);
  font-size: 13px;
  font-weight: 900;
}
```

Add series-page classes for the hero, metadata and responsive episode cards, using existing color and spacing tokens. At `max-width: 640px`, use one-column cards and prevent image or action overflow.

- [ ] **Step 5: Run focused and Blog tests**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/blogSeries.test.mjs tests/blogConversion.test.mjs tests/insightCollections.test.mjs tests/contentExperience.test.mjs
```

Expected: all tests pass.

- [ ] **Step 6: Commit the Blog entry point**

```bash
git add app/blog/page.tsx app/globals.css tests/blogSeries.test.mjs
git commit -m "Link Featured Article to full series"
```

### Task 4: Build, Preview and Release Verification

**Files:**
- Verify all modified files.

**Interfaces:**
- Produces: deployable feature branch, verified Vercel Preview and production deployment.

- [ ] **Step 1: Run the complete relevant test set**

```bash
npm run test:blog
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/blogSeries.test.mjs tests/insightCollections.test.mjs tests/contentExperience.test.mjs tests/guidesExperience.test.mjs
```

- [ ] **Step 2: Run the production build**

```bash
npm run build
```

Expected: exit 0 and the series route appears in generated routes.

- [ ] **Step 3: Review the exact diff**

```bash
git diff --check
git status --short
git log --oneline --decorate -5
```

Confirm that only the helper, tests, series route, Blog page, sitemap, scoped CSS and planning documents changed.

- [ ] **Step 4: Push and verify Vercel Preview**

Push `codex/blog-series-index`, wait for the matching Vercel Preview to reach `READY`, then inspect:

- Blog Featured Article at desktop and 390 px.
- Series page at desktop and 390 px.
- Episode 01 then Episode 02 ordering.
- Separate `Read Article` and `View Full Series` links.
- Cover images, canonical, JSON-LD, sitemap, overflow and browser console.

- [ ] **Step 5: Release using the approved GitHub path**

Fast-forward the approved branch into `main`, push `main`, wait for the GitHub-triggered Vercel production deployment to reach `READY`, and verify:

- `https://worldcleanbiz.com/blog`
- `https://worldcleanbiz.com/blog/series/building-worlds-no-1-cleaning-show-from-scratch`
- Production sitemap.

- [ ] **Step 6: Record the release**

Report the live series URL, Git commit, Vercel deployment ID, tests, build and browser-verification results.
