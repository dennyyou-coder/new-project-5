# Directory Series and Sidebars Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the ongoing World Clean Biz series to the Analysis and Guides directory landing pages, replace both generic sidebars with approved author and discovery modules, and make every Analysis company or brand keyword a visible server-rendered filter.

**Architecture:** A dedicated company-keyword helper owns the normalized registry, alias matching, availability checks, and filtering. Two focused presentation components render the shared series feature and directory sidebar, while the existing `ContentDirectory` remains responsible for the hero, filters, feed, and pagination. Analysis and Guides pages assemble their own data and pass explicit sidebar configurations into the shared shell.

**Tech Stack:** Next.js 15 App Router, React server components, TypeScript, CSS, Node test runner, Vercel Preview Deployments.

## Global Constraints

- Keep `/blog` source and rendered layout unchanged.
- Display all matched Analysis company and brand keyword groups directly; do not add an accordion, modal, `View all`, or hidden state.
- Keep ten feed items per page.
- Use the existing series identifier `building-worlds-no-1-cleaning-show-from-scratch`.
- Show the full series feature only on unfiltered page-one `/blog/archive` and `/guides`.
- Do not show the full series feature on company/category filters, page 2+, or `/guides/[type]`.
- Company-filtered and paginated URLs use `noindex, follow`; canonical URLs remain unchanged.
- Analysis company matching uses normalized titles and tags, not excerpts or article bodies.
- Analysis sidebar order is Denny profile, Company & Brand Index, Important Analysis.
- Guides sidebar order is Denny profile, Guide Categories, Essential Guides.
- Analysis sidebar scrolls normally; Guides may remain sticky.
- Use existing images only and keep editorial artwork uncropped with `object-fit: contain`.
- Production remains unchanged until explicit approval after a Vercel Preview.

---

### Task 1: Company and Brand Keyword Registry

**Files:**
- Create: `lib/companyKeywords.ts`
- Create: `tests/companyKeywords.test.mjs`

**Interfaces:**
- Consumes: article objects with `title: string` and `tags: string[]`.
- Produces:
  - `type CompanyKeyword = { label: string; value: string; aliases: readonly string[] }`
  - `ANALYSIS_COMPANY_KEYWORDS: readonly CompanyKeyword[]`
  - `getAvailableCompanyKeywords<T extends CompanyArticle>(articles: readonly T[]): CompanyKeyword[]`
  - `getCompanyKeyword(value: string | undefined, available: readonly CompanyKeyword[]): CompanyKeyword | undefined`
  - `filterArticlesByCompany<T extends CompanyArticle>(articles: readonly T[], keyword: CompanyKeyword): T[]`

- [ ] **Step 1: Write failing registry and alias tests**

Create `tests/companyKeywords.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  ANALYSIS_COMPANY_KEYWORDS,
  filterArticlesByCompany,
  getAvailableCompanyKeywords,
  getCompanyKeyword
} from "../lib/companyKeywords.ts";

const articles = [
  { slug: "romo", title: "DJI ROMO Enters Floorcare", tags: ["DJI", "ROMO"] },
  { slug: "roomba", title: "How iRobot Is Rebuilding Roomba", tags: ["iRobot", "Roomba"] },
  { slug: "dyson", title: "Dyson at a Crossroads", tags: ["Dyson"] },
  { slug: "generic", title: "Robot Vacuum Market", tags: ["robot vacuum"] }
];

test("company registry keeps normalized labels and values unique", () => {
  const labels = ANALYSIS_COMPANY_KEYWORDS.map((keyword) => keyword.label);
  const values = ANALYSIS_COMPANY_KEYWORDS.map((keyword) => keyword.value);
  assert.equal(new Set(labels).size, labels.length);
  assert.equal(new Set(values).size, values.length);
});

test("available keywords contain only groups with matching analysis articles", () => {
  const available = getAvailableCompanyKeywords(articles);
  assert.deepEqual(
    available.map((keyword) => keyword.value),
    ["dji-romo", "dyson", "irobot-roomba"]
  );
});

test("aliases return a combined company result set", () => {
  const available = getAvailableCompanyKeywords(articles);
  const keyword = getCompanyKeyword("dji-romo", available);
  assert.ok(keyword);
  assert.deepEqual(
    filterArticlesByCompany(articles, keyword).map((article) => article.slug),
    ["romo"]
  );
});

test("invalid company values do not create an active filter", () => {
  const available = getAvailableCompanyKeywords(articles);
  assert.equal(getCompanyKeyword("not-a-company", available), undefined);
});
```

- [ ] **Step 2: Run the unit test and verify it fails**

Run:

```bash
node --test tests/companyKeywords.test.mjs
```

Expected: FAIL because `lib/companyKeywords.ts` does not exist.

- [ ] **Step 3: Implement the registry and matching helpers**

Create `lib/companyKeywords.ts` with a lowercase-and-diacritic-insensitive
normalizer, title/tag matching, and this alphabetized registry:

```ts
type CompanyArticle = {
  title: string;
  tags: readonly string[];
};

export type CompanyKeyword = {
  label: string;
  value: string;
  aliases: readonly string[];
};

const keyword = (
  label: string,
  value: string,
  aliases: readonly string[]
): CompanyKeyword => ({ label, value, aliases });

export const ANALYSIS_COMPANY_KEYWORDS = [
  keyword("Aiper", "aiper", ["aiper"]),
  keyword("ALDI", "aldi", ["aldi"]),
  keyword("Amazon", "amazon", ["amazon"]),
  keyword("Anker / Eufy", "anker-eufy", ["anker", "eufy"]),
  keyword("Beatbot", "beatbot", ["beatbot"]),
  keyword("Benewake", "benewake", ["benewake"]),
  keyword("BISSELL", "bissell", ["bissell"]),
  keyword("Bosch", "bosch", ["bosch"]),
  keyword("Chervon", "chervon", ["chervon"]),
  keyword("Chyson", "chyson", ["chyson"]),
  keyword("De’Longhi", "delonghi", ["de’longhi", "de'longhi", "delonghi"]),
  keyword("Deerma", "deerma", ["deerma"]),
  keyword("DEWALT", "dewalt", ["dewalt"]),
  keyword("DJI / ROMO", "dji-romo", ["dji", "romo"]),
  keyword("Dreame", "dreame", ["dreame"]),
  keyword("Dyson", "dyson", ["dyson"]),
  keyword("EAI", "eai", ["eai"]),
  keyword("Ecovacs", "ecovacs", ["ecovacs"]),
  keyword("EGO", "ego", ["ego"]),
  keyword("Fluidra", "fluidra", ["fluidra"]),
  keyword("Freudenberg / Vileda", "freudenberg-vileda", ["freudenberg", "vileda", "vileda professional"]),
  keyword("Godfreys", "godfreys", ["godfreys"]),
  keyword("Groupe SEB / Rowenta", "groupe-seb-rowenta", ["groupe seb", "rowenta"]),
  keyword("Hamilton Beach", "hamilton-beach", ["hamilton beach"]),
  keyword("Hoover", "hoover", ["hoover"]),
  keyword("Husqvarna", "husqvarna", ["husqvarna"]),
  keyword("Insta360", "insta360", ["insta360"]),
  keyword("iRobot / Roomba", "irobot-roomba", ["irobot", "roomba"]),
  keyword("Kärcher", "karcher", ["kärcher", "karcher"]),
  keyword("Kingclean", "kingclean", ["kingclean"]),
  keyword("Kress", "kress", ["kress"]),
  keyword("Laifen", "laifen", ["laifen"]),
  keyword("Lymow", "lymow", ["lymow"]),
  keyword("Makita", "makita", ["makita"]),
  keyword("Mammotion", "mammotion", ["mammotion"]),
  keyword("Maston", "maston", ["maston"]),
  keyword("Maytronics / Dolphin", "maytronics-dolphin", ["maytronics", "dolphin"]),
  keyword("Midea", "midea", ["midea", "midea group"]),
  keyword("Miele", "miele", ["miele"]),
  keyword("MOVA", "mova", ["mova"]),
  keyword("Narwal", "narwal", ["narwal"]),
  keyword("Navimow / Segway", "navimow-segway", ["navimow", "segway"]),
  keyword("Nilfisk", "nilfisk", ["nilfisk"]),
  keyword("Philips Domestic Appliances", "philips-domestic-appliances", ["philips domestic appliances"]),
  keyword("Picea Robotics", "picea-robotics", ["picea", "picea robotics"]),
  keyword("Pudu Robotics", "pudu-robotics", ["pudu", "pudu robotics"]),
  keyword("Roborock", "roborock", ["roborock"]),
  keyword("Ryobi", "ryobi", ["ryobi"]),
  keyword("SharkNinja / Shark / Ninja", "sharkninja", ["sharkninja", "shark", "ninja"]),
  keyword("Silver Star", "silver-star", ["silver star"]),
  keyword("Stanley Black & Decker / BLACK+DECKER", "stanley-black-decker", ["stanley black & decker", "stanley black and decker", "black & decker", "black+decker"]),
  keyword("STIHL", "stihl", ["stihl"]),
  keyword("Sunseeker", "sunseeker", ["sunseeker"]),
  keyword("TerraMow", "terramow", ["terramow"]),
  keyword("Tineco", "tineco", ["tineco"]),
  keyword("TTI / Milwaukee", "tti-milwaukee", ["tti", "techtronic industries", "milwaukee"]),
  keyword("Uwant", "uwant", ["uwant"]),
  keyword("Vermop", "vermop", ["vermop"]),
  keyword("Vorwerk", "vorwerk", ["vorwerk"]),
  keyword("Worx", "worx", ["worx"]),
  keyword("WYBOT", "wybot", ["wybot"]),
  keyword("Xiaomi / Mijia", "xiaomi-mijia", ["xiaomi", "mijia"]),
  keyword("Xinbao / Guangdong Xinbao", "xinbao", ["xinbao", "guangdong xinbao"]),
  keyword("Yarbo", "yarbo", ["yarbo"])
] as const satisfies readonly CompanyKeyword[];

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9+&]+/g, " ")
    .trim();
}

function articleMatchesKeyword(
  article: CompanyArticle,
  companyKeyword: CompanyKeyword
) {
  const fields = [article.title, ...article.tags].map(normalize);
  return companyKeyword.aliases
    .map(normalize)
    .some((alias) =>
      fields.some((field) => ` ${field} `.includes(` ${alias} `))
    );
}

export function getAvailableCompanyKeywords<T extends CompanyArticle>(
  articles: readonly T[]
) {
  return ANALYSIS_COMPANY_KEYWORDS
    .filter((companyKeyword) =>
      articles.some((article) => articleMatchesKeyword(article, companyKeyword))
    )
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getCompanyKeyword(
  value: string | undefined,
  available: readonly CompanyKeyword[]
) {
  return available.find((companyKeyword) => companyKeyword.value === value);
}

export function filterArticlesByCompany<T extends CompanyArticle>(
  articles: readonly T[],
  companyKeyword: CompanyKeyword
) {
  return articles.filter((article) =>
    articleMatchesKeyword(article, companyKeyword)
  );
}
```

- [ ] **Step 4: Run the unit test and verify it passes**

Run:

```bash
node --test tests/companyKeywords.test.mjs
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit the keyword helper**

```bash
git add lib/companyKeywords.ts tests/companyKeywords.test.mjs
git commit -m "feat: add analysis company keyword filters"
```

---

### Task 2: Shared Series Feature and Sidebar Components

**Files:**
- Create: `components/DirectorySeriesFeature.tsx`
- Create: `components/DirectorySidebar.tsx`
- Modify: `components/ContentDirectory.tsx`
- Modify: `tests/contentExperience.test.mjs`
- Modify: `tests/guidesExperience.test.mjs`

**Interfaces:**
- Consumes:
  - `Insight` from `lib/content.ts`
  - `DirectoryLink` items with `label`, `href`, and optional `active`
- Produces:
  - `DirectorySeriesFeature({ article }: { article: Insight })`
  - `DirectorySidebar({ mode, navigationTitle, navigationLinks, importantTitle, importantArticles, importantMeta })`
  - `ContentDirectory` props `featuredSeriesArticle?: Insight` and `sidebar: DirectorySidebarProps`

- [ ] **Step 1: Extend source-level tests before changing components**

Add these assertions to `tests/contentExperience.test.mjs`:

```js
const directorySeries = await read("components/DirectorySeriesFeature.tsx");
const directorySidebar = await read("components/DirectorySidebar.tsx");

test("directory feature and profile use approved existing content", () => {
  assert.match(directorySeries, /Ongoing Series · Latest Episode/);
  assert.match(directorySeries, /View all episodes/);
  assert.match(directorySeries, /objectFit/);
  assert.match(directorySidebar, /Denny You/);
  assert.match(directorySidebar, /Founder, World Clean Biz/);
  assert.match(directorySidebar, /Organizer, World Clean Expo/);
  assert.match(directorySidebar, /since 2006/);
});
```

Add these assertions to `tests/guidesExperience.test.mjs`:

```js
test("directory sidebar supports guide categories and important content", () => {
  assert.match(directory, /<DirectorySidebar/);
  assert.match(directory, /featuredSeriesArticle/);
  assert.doesNotMatch(directory, /Latest Articles/);
});
```

- [ ] **Step 2: Run the focused tests and verify they fail**

Run:

```bash
node --test tests/contentExperience.test.mjs tests/guidesExperience.test.mjs
```

Expected: FAIL because the new components and props do not exist.

- [ ] **Step 3: Implement `DirectorySeriesFeature`**

Create a server component that renders:

```tsx
export function DirectorySeriesFeature({ article }: { article: Insight }) {
  return (
    <section
      className="insights-page-container content-directory-series"
      aria-labelledby="directory-series-title"
    >
      <div className="content-directory-series-image">
        <img
          src={article.coverImage}
          alt={article.coverAlt || `${article.seriesTitle || article.title} cover`}
          fetchPriority="high"
          decoding="async"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="content-directory-series-copy">
        <p className="eyebrow">Ongoing Series · Latest Episode</p>
        <h2 id="directory-series-title">
          {article.seriesTitle || article.title}
        </h2>
        {article.seriesTitle ? <h3>{article.title}</h3> : null}
        <p>{article.excerpt}</p>
        <div className="content-directory-series-actions">
          <Link href={`/blog/${article.slug}`}>Read latest episode →</Link>
          <Link href={`/blog/${article.slug}#series-episodes`}>
            View all episodes
          </Link>
        </div>
      </div>
    </section>
  );
}
```

If `coverImage` is missing, use
`/images/blog/building-worlds-no-1-cleaning-show-episode-01-cover.webp`.

- [ ] **Step 4: Implement `DirectorySidebar`**

Export this props type:

```ts
export type DirectorySidebarProps = {
  mode: "analysis" | "guides";
  navigationTitle: string;
  navigationLinks: DirectoryLink[];
  importantTitle: string;
  importantArticles: Insight[];
  importantMeta: "date" | "readingTime";
};
```

Render, in fixed order:

1. `.content-directory-profile` with the existing Denny portrait and approved
   factual copy.
2. A labelled navigation using `.content-directory-keywords` for Analysis and
   the existing vertical link treatment for Guides.
3. `.content-directory-important` containing thumbnail, title, and the
   configured date or reading-time metadata.

Do not render the important module when `importantArticles` is empty.

- [ ] **Step 5: Refactor `ContentDirectory` to use focused components**

Replace the old `sidebarPrimaryTitle`, `sidebarPrimaryLinks`,
`sidebarSecondaryTitle`, `sidebarSecondaryLinks`, and `latestArticles` props
with:

```ts
featuredSeriesArticle?: Insight;
sidebar: DirectorySidebarProps;
```

Render `DirectorySeriesFeature` after `.content-directory-hero` and before
`.content-directory-filters`. Render `DirectorySidebar` in the existing
two-column layout. Add
`data-sidebar-mode={sidebar.mode}` to `.content-directory-layout`.

- [ ] **Step 6: Run focused tests**

Run:

```bash
node --test tests/contentExperience.test.mjs tests/guidesExperience.test.mjs
```

Expected: all focused tests PASS.

- [ ] **Step 7: Commit the shared components**

```bash
git add components/DirectorySeriesFeature.tsx components/DirectorySidebar.tsx components/ContentDirectory.tsx tests/contentExperience.test.mjs tests/guidesExperience.test.mjs
git commit -m "feat: add directory series and profile sidebars"
```

---

### Task 3: Analysis Company Filtering and Curated Sidebar

**Files:**
- Modify: `app/blog/archive/page.tsx`
- Modify: `tests/directoryPages.integration.mjs`

**Interfaces:**
- Consumes:
  - Company helpers from `lib/companyKeywords.ts`
  - `getLatestSeriesInsight` from `lib/insightCollections.ts`
  - `ContentDirectory` props from Task 2
- Produces:
  - `company` query filtering on `/blog/archive`
  - Complete visible Company & Brand Index
  - Featured editorial Important Analysis list

- [ ] **Step 1: Add failing Analysis integration behavior**

Extend `tests/directoryPages.integration.mjs`:

```js
test("Analysis root shows the series, full company index and curated sidebar", async () => {
  const html = await page("/blog/archive");
  includesMatch(html, /class="[^"]*content-directory-series[^"]*"/, "Analysis shows the series");
  includesMatch(html, />Denny You</, "Analysis shows the author profile");
  includesMatch(html, />Company &amp; Brand Index</, "Analysis shows the company index");
  includesMatch(html, />Important Analysis</, "Analysis shows curated articles");
  excludesMatch(html, />View all company/i, "All company keywords are directly visible");
  includesMatch(html, /company=dji-romo/, "Company keywords are linked filters");
});

test("Analysis company filters replace category state and preserve pagination", async () => {
  const html = await page("/blog/archive?company=dji-romo");
  excludesMatch(html, /class="[^"]*content-directory-series[^"]*"/, "Filtered Analysis omits the series");
  includesMatch(html, /aria-current="page"[^>]*>DJI \/ ROMO</, "Company is active");
  includesMatch(html, /company=dji-romo/, "Company pagination is preserved");
  excludesMatch(html, /category=/, "Company links do not retain category");
  includesMatch(html, /content="noindex, follow"/, "Company filters are noindex");
});
```

- [ ] **Step 2: Run the integration test and verify it fails**

With the local app running at port 4173:

```bash
TEST_BASE_URL=http://127.0.0.1:4173 node --test tests/directoryPages.integration.mjs
```

Expected: the two new tests FAIL because the series, company filters, and new
sidebar are not wired.

- [ ] **Step 3: Wire company selection and filtering**

In `app/blog/archive/page.tsx`:

1. Build `availableCompanies` from the complete editorial collection.
2. Parse `company` with the existing `queryValue`.
3. Resolve only values present in `availableCompanies`.
4. Give a valid company selection precedence over a manually supplied category.
5. Filter by company aliases or by the selected category.
6. Build pagination parameters as either `{ company }` or `{ category }`.
7. Keep category links category-only and company links company-only.

Use:

```ts
const requestedCompany = queryValue(resolvedSearchParams.company);
const availableCompanies = getAvailableCompanyKeywords(editorialArticles);
const selectedCompany = getCompanyKeyword(requestedCompany, availableCompanies);
const selectedCategory = selectedCompany
  ? undefined
  : categories.includes(requestedCategory || "")
    ? requestedCategory
    : undefined;
const filteredArticles = selectedCompany
  ? filterArticlesByCompany(editorialArticles, selectedCompany)
  : selectedCategory
    ? editorialArticles.filter((article) => article.category === selectedCategory)
    : editorialArticles;
```

- [ ] **Step 4: Supply the series and approved Analysis sidebar**

Resolve the latest series episode with the existing helper. Pass it to
`ContentDirectory` only when there are no query parameters, `currentPage ===
1`, `selectedCategory` is undefined, and `selectedCompany` is undefined.

Build the sidebar:

```ts
sidebar={{
  mode: "analysis",
  navigationTitle: "Company & Brand Index",
  navigationLinks: availableCompanies.map((company) => ({
    label: company.label,
    href: directoryHref("/blog/archive", 1, { company: company.value }),
    active: selectedCompany?.value === company.value
  })),
  importantTitle: "Important Analysis",
  importantArticles: editorialArticles.filter((article) => article.featured),
  importantMeta: "date"
}}
```

- [ ] **Step 5: Run Analysis integration tests**

```bash
TEST_BASE_URL=http://127.0.0.1:4173 node --test tests/directoryPages.integration.mjs
```

Expected: Blog preservation and all Analysis tests PASS.

- [ ] **Step 6: Commit the Analysis behavior**

```bash
git add app/blog/archive/page.tsx tests/directoryPages.integration.mjs
git commit -m "feat: add analysis company discovery"
```

---

### Task 4: Guides Series and Essential Sidebar

**Files:**
- Modify: `app/guides/page.tsx`
- Modify: `app/guides/[type]/page.tsx`
- Modify: `tests/directoryPages.integration.mjs`

**Interfaces:**
- Consumes:
  - `getLatestSeriesInsight`
  - `getFeaturedGuides`
  - `GUIDE_TYPE_CONFIG`
  - `ContentDirectory` props from Task 2
- Produces:
  - Root Guides series feature on page one
  - Author-first Guide sidebar
  - Guide Categories and Essential Guides on root and type pages

- [ ] **Step 1: Add failing Guides integration behavior**

Extend `tests/directoryPages.integration.mjs`:

```js
test("Guides root shows the series and approved sidebar order", async () => {
  const html = await page("/guides");
  includesMatch(html, /class="[^"]*content-directory-series[^"]*"/, "Guides shows the series");
  includesMatch(html, />Denny You</, "Guides shows the author profile");
  includesMatch(html, />Guide Categories</, "Guides shows categories");
  includesMatch(html, />Essential Guides</, "Guides shows prioritized Guides");
  excludesMatch(html, />Latest Articles</, "Guides removes the generic latest module");
});

test("Guide pagination and type pages do not repeat the series", async () => {
  const pageTwo = await page("/guides?page=2");
  const ownership = await page("/guides/ownership");
  excludesMatch(pageTwo, /class="[^"]*content-directory-series[^"]*"/, "Page 2 omits the series");
  excludesMatch(ownership, /class="[^"]*content-directory-series[^"]*"/, "Type pages omit the series");
  includesMatch(ownership, /aria-current="page"[^>]*>Brand Ownership</, "Guide type is active");
});
```

- [ ] **Step 2: Run the integration test and verify it fails**

```bash
TEST_BASE_URL=http://127.0.0.1:4173 node --test tests/directoryPages.integration.mjs
```

Expected: the new Guides assertions FAIL.

- [ ] **Step 3: Wire `/guides`**

Resolve the latest series episode. Pass it only when there are no query
parameters and `currentPage === 1`.

Pass:

```ts
sidebar={{
  mode: "guides",
  navigationTitle: "Guide Categories",
  navigationLinks: [
    { label: "All Industry Guides", href: "/guides", active: true },
    ...GUIDE_TYPE_CONFIG.map((guideType) => ({
      label: guideType.label,
      href: guideType.href
    }))
  ],
  importantTitle: "Essential Guides",
  importantArticles: getFeaturedGuides(allArticles, 6),
  importantMeta: "readingTime"
}}
```

- [ ] **Step 4: Wire `/guides/[type]`**

Use the same sidebar data, with `All Industry Guides` inactive and the current
Guide type active. Do not supply `featuredSeriesArticle`.

- [ ] **Step 5: Run the integration test**

```bash
TEST_BASE_URL=http://127.0.0.1:4173 node --test tests/directoryPages.integration.mjs
```

Expected: all Guides and Analysis integration tests PASS.

- [ ] **Step 6: Commit Guides behavior**

```bash
git add app/guides/page.tsx 'app/guides/[type]/page.tsx' tests/directoryPages.integration.mjs
git commit -m "feat: add guide series and essential sidebar"
```

---

### Task 5: Directory Presentation and Responsive Behavior

**Files:**
- Modify: `app/globals.css`
- Modify: `tests/contentExperience.test.mjs`
- Modify: `tests/guidesExperience.test.mjs`

**Interfaces:**
- Consumes class names from Tasks 2–4.
- Produces the approved option-A layout, complete visible keyword index,
  non-sticky Analysis sidebar, sticky Guides sidebar, and responsive behavior.

- [ ] **Step 1: Add failing style-contract assertions**

Add:

```js
assert.match(css, /\.content-directory-series/);
assert.match(css, /\.content-directory-profile/);
assert.match(css, /\.content-directory-keywords/);
assert.match(css, /data-sidebar-mode="analysis"/);
assert.match(css, /min-height:\s*44px/);
assert.match(css, /object-fit:\s*contain/);
```

- [ ] **Step 2: Run source-level tests and verify they fail**

```bash
node --test tests/contentExperience.test.mjs tests/guidesExperience.test.mjs
```

Expected: FAIL for missing series, profile, keyword, and sidebar-mode styles.

- [ ] **Step 3: Add desktop styles**

Under the existing `/* Analysis and Guides directories */` block:

- Give `.content-directory-series` a two-column 40/60 layout, white surface,
  blue border, restrained shadow, and spacing between hero and filters.
- Give `.content-directory-series-image` a fixed aspect ratio and
  `object-fit: contain`.
- Style `.content-directory-profile` with the existing portrait, compact role
  list, and visible About link.
- Style `.content-directory-keywords` as a wrapping flex navigation.
- Give each keyword link `min-height: 44px`, visible active state, and no
  horizontal overflow.
- Style `.content-directory-important` with compact thumbnail rows.
- Apply normal scrolling to:

```css
.content-directory-layout[data-sidebar-mode="analysis"]
  .content-directory-sidebar {
  position: static;
}
```

- [ ] **Step 4: Add responsive styles**

At the existing directory breakpoints:

- Stack the series image over copy.
- Keep the full artwork visible.
- Preserve feed-before-sidebar DOM order.
- Keep all keywords visible and wrapping within the viewport.
- Make series actions stack on narrow screens.
- Preserve 44 px keyword tap targets.

- [ ] **Step 5: Run focused tests**

```bash
node --test tests/contentExperience.test.mjs tests/guidesExperience.test.mjs
```

Expected: all focused tests PASS.

- [ ] **Step 6: Commit presentation**

```bash
git add app/globals.css tests/contentExperience.test.mjs tests/guidesExperience.test.mjs
git commit -m "style: polish directory series and sidebars"
```

---

### Task 6: Full Verification and Preview

**Files:**
- Verify only; modify implementation or tests only when a failing check exposes
  a requirement gap.

**Interfaces:**
- Consumes all prior tasks.
- Produces a clean branch, passing build, and a Vercel Preview URL for approval.

- [ ] **Step 1: Run company helper tests**

```bash
node --test tests/companyKeywords.test.mjs tests/contentDirectory.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 2: Run the complete source and unit suite**

```bash
node --test tests/*.test.mjs
```

Expected: all tests PASS with zero failures.

- [ ] **Step 3: Run real-page integration tests**

With the dev server running:

```bash
TEST_BASE_URL=http://127.0.0.1:4173 node --test tests/directoryPages.integration.mjs
```

Expected: all integration tests PASS.

- [ ] **Step 4: Run a production build**

Stop the development server first so `next build` and `next dev` do not write
to `.next` concurrently. Then run:

```bash
npm run build
```

Expected: content classification, TypeScript, compilation, static generation,
and route output complete successfully.

Restart the development server before Step 5.

- [ ] **Step 5: Verify rendered desktop and mobile pages**

Inspect these routes at 1440×900 and 390×844:

- `/blog`
- `/blog/archive`
- `/blog/archive?company=dji-romo`
- `/blog/archive?page=2`
- `/guides`
- `/guides?page=2`
- `/guides/ownership`

Confirm:

- `/blog` is unchanged.
- Both root directories show the latest series episode.
- Filtered, paginated, and Guide-type pages omit the series.
- All Analysis company keywords are directly visible.
- Analysis sidebar scrolls normally.
- Guide sidebar order is profile, categories, Essential Guides.
- No horizontal overflow occurs.
- Images are loaded and not cropped.

- [ ] **Step 6: Check branch cleanliness and push**

```bash
git diff --check
git status --short
git push origin codex/unified-blog-analysis-guides
```

Expected: only the visual-companion `.superpowers/` artifact may remain
untracked; implementation files are committed and the branch push succeeds.

- [ ] **Step 7: Confirm the Git-triggered Vercel Preview**

Verify the deployment metadata points to the latest branch commit, has
`target: null`, and reaches `state: READY`.

- [ ] **Step 8: Present the preview and stop before production**

Share direct preview links to `/blog/archive` and `/guides`. State clearly that
the production site is unchanged and wait for explicit deployment approval.
