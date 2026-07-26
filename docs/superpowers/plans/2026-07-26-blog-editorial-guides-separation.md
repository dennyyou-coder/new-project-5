# World Clean Biz Blog 与 Guides 内容分层 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 World Clean Biz 的深度文章集中到 Blog，将搜索型实用文章集中到独立 Guides 频道，同时保留全部现有文章 URL 和搜索可发现性。

**Architecture:** 继续由 `lib/content.ts` 读取 `content/insights/*.mdx`，增加强类型内容分类字段，并通过独立集合函数向 Blog、Guides、Archive、首页和 Sitemap 提供数据。历史文章由一次性、可重复运行的迁移脚本写入显式 frontmatter；生产构建先运行分类校验，缺失或非法字段时直接失败。

**Tech Stack:** Next.js 15、React 19、TypeScript、MDX frontmatter、CSS、Node.js test、Vercel。

## Global Constraints

- `/blog` 只聚合 `content_class: "editorial"` 的文章。
- `/guides` 只聚合 `content_class: "search"` 的文章。
- Guides 对外不出现“SEO Articles”“Search Content”或“Traffic Articles”。
- 所有现有文章继续使用 `/blog/[slug]`，不得移动或重命名。
- 不删除、合并、`noindex` 或改写任何现有文章正文。
- 不修改现有文章的 `date`、`publishedAt` 或 `sortDate`。
- `content_class` 只能是 `editorial` 或 `search`。
- search 文章必须具有 `buying`、`ownership`、`comparison`、`sourcing`、`maintenance`、`explainer` 之一的 `guide_type`。
- 不新增第三方依赖。
- 先写失败测试，再写最小实现；每个任务单独提交。
- 正式生产部署必须在全量验证和用户授权之后进行。

---

## File Structure

### 新建

- `lib/guideTaxonomy.ts`：内容分类和 Guides 六类栏目定义。
- `lib/insightCollections.ts`：Blog、Guides 和精选指南的纯集合函数。
- `scripts/apply-insight-classification.mjs`：一次性、幂等的历史 frontmatter 迁移。
- `scripts/verify-insight-classification.mjs`：构建前全量分类检查。
- `docs/superpowers/audits/2026-07-26-insight-classification.json`：迁移后的分类审计记录。
- `components/GuideCard.tsx`：Guides 页面共享文章卡片。
- `app/guides/page.tsx`：Guides 总入口。
- `app/guides/[type]/page.tsx`：六个 Guides 栏目页。
- `tests/guideTaxonomy.test.mjs`：栏目类型与路径测试。
- `tests/insightClassification.test.mjs`：345 篇历史内容字段完整性测试。
- `tests/insightCollections.test.mjs`：Blog 与 Guides 集合隔离测试。
- `tests/guidesExperience.test.mjs`：Guides 页面、导航、Schema 和 Sitemap 回归测试。

### 修改

- `lib/content.ts`：解析并暴露 `contentClass`、`guideType`、`guidePriority`。
- `content/insights/*.mdx`：写入明确分类字段，不改正文和日期。
- `app/blog/page.tsx`：只消费 editorial 集合并增加 Practical Guides 入口。
- `app/blog/archive/page.tsx`：按 Analysis 与 Guides 分组。
- `app/blog/[slug]/page.tsx`：根据内容类型显示正确的可见面包屑和集合归属。
- `app/page.tsx`：首页行业洞察只消费 editorial 集合。
- `components/Header.tsx`：主导航增加 Guides。
- `components/Footer.tsx`：Platform 导航增加 Guides。
- `app/sitemap.ts`：加入 `/guides` 和六个栏目页。
- `app/globals.css`：Guides、Archive 分组和 Blog 实用指南模块样式。
- `tests/contentExperience.test.mjs`：Blog、Archive 和文章模板分类行为断言。
- `tests/homepageStructure.test.mjs`：导航与首页 editorial 行为断言。
- `package.json`：增加分类校验命令，并在 build 前执行。

---

### Task 1: 定义内容分类与 Guides 栏目接口

**Files:**
- Create: `tests/guideTaxonomy.test.mjs`
- Create: `lib/guideTaxonomy.ts`
- Modify: `lib/content.ts`

**Interfaces:**
- Produces: `ContentClass = "editorial" | "search"`
- Produces: `GuideType = "buying" | "ownership" | "comparison" | "sourcing" | "maintenance" | "explainer"`
- Produces: `GUIDE_TYPE_CONFIG`, `isContentClass(value)`, `isGuideType(value)`
- Produces on `Insight`: `contentClass`, `guideType?`, `guidePriority`

- [ ] **Step 1: 写栏目类型失败测试**

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  GUIDE_TYPE_CONFIG,
  isContentClass,
  isGuideType
} from "../lib/guideTaxonomy.ts";

test("publishes exactly six reader-facing guide types", () => {
  assert.deepEqual(
    GUIDE_TYPE_CONFIG.map(({ type }) => type),
    ["buying", "ownership", "comparison", "sourcing", "maintenance", "explainer"]
  );
  assert.equal(isContentClass("editorial"), true);
  assert.equal(isContentClass("search"), true);
  assert.equal(isContentClass("seo"), false);
  assert.equal(isGuideType("comparison"), true);
  assert.equal(isGuideType("other"), false);
});

test("guide config exposes stable crawlable paths and reader-facing labels", () => {
  for (const guide of GUIDE_TYPE_CONFIG) {
    assert.equal(guide.href, `/guides/${guide.type}`);
    assert.doesNotMatch(`${guide.label} ${guide.description}`, /\bSEO\b|Search Content|Traffic Articles/i);
  }
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/guideTaxonomy.test.mjs
```

Expected: FAIL，错误包含 `Cannot find module '../lib/guideTaxonomy.ts'`。

- [ ] **Step 3: 实现栏目类型和配置**

```ts
export const CONTENT_CLASSES = ["editorial", "search"] as const;
export type ContentClass = (typeof CONTENT_CLASSES)[number];

export const GUIDE_TYPES = [
  "buying",
  "ownership",
  "comparison",
  "sourcing",
  "maintenance",
  "explainer"
] as const;
export type GuideType = (typeof GUIDE_TYPES)[number];

export const GUIDE_TYPE_CONFIG = [
  { type: "buying", label: "Buying Guides", description: "Choose products, features and service models with clearer trade-offs.", href: "/guides/buying" },
  { type: "ownership", label: "Brand Ownership", description: "Understand the companies, brands and manufacturing relationships behind the market.", href: "/guides/ownership" },
  { type: "comparison", label: "Product Comparisons", description: "Compare product architecture, ownership cost, support and channel fit.", href: "/guides/comparison" },
  { type: "sourcing", label: "OEM & Sourcing", description: "Evaluate suppliers, manufacturing cost, compliance and distribution readiness.", href: "/guides/sourcing" },
  { type: "maintenance", label: "Maintenance & Troubleshooting", description: "Solve ownership, service and product-care problems.", href: "/guides/maintenance" },
  { type: "explainer", label: "Technology & Market Explainers", description: "Understand product technologies, market structures and industry terminology.", href: "/guides/explainer" }
] as const;

export function isContentClass(value: string): value is ContentClass {
  return CONTENT_CLASSES.includes(value as ContentClass);
}

export function isGuideType(value: string): value is GuideType {
  return GUIDE_TYPES.includes(value as GuideType);
}
```

- [ ] **Step 4: 扩展 `Insight` 与 frontmatter 解析**

在 `lib/content.ts` 引入类型：

```ts
import type { ContentClass, GuideType } from "@/lib/guideTaxonomy";
```

在 `Insight` 中增加：

```ts
contentClass: ContentClass;
guideType?: GuideType;
guidePriority: number;
```

在构造文章对象时增加：

```ts
contentClass: String(data.content_class || "") as ContentClass,
guideType: data.guide_type ? String(data.guide_type) as GuideType : undefined,
guidePriority: Number(data.guide_priority || 0),
```

- [ ] **Step 5: 运行测试和类型检查**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/guideTaxonomy.test.mjs
npx tsc --noEmit
```

Expected: 两条命令均退出码 0。

- [ ] **Step 6: 提交**

```bash
git add lib/guideTaxonomy.ts lib/content.ts tests/guideTaxonomy.test.mjs
git commit -m "Add insight content taxonomy"
```

---

### Task 2: 迁移并校验全部历史文章

**Files:**
- Create: `scripts/apply-insight-classification.mjs`
- Create: `scripts/verify-insight-classification.mjs`
- Create: `tests/insightClassification.test.mjs`
- Create: `docs/superpowers/audits/2026-07-26-insight-classification.json`
- Modify: `content/insights/*.mdx`
- Modify: `package.json`

**Interfaces:**
- Consumes: `CONTENT_CLASSES`, `GUIDE_TYPES`
- Produces: every visible MDX has `content_class`; every search MDX has `guide_type`
- Produces: package command `npm run verify:content-classification`
- Produces: `prebuild` runs classification verification

- [ ] **Step 1: 写全量分类失败测试**

```js
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const directory = new URL("../content/insights/", import.meta.url);
const files = (await readdir(directory)).filter((file) => file.endsWith(".mdx"));
const allowedTypes = new Set(["buying", "ownership", "comparison", "sourcing", "maintenance", "explainer"]);

test("every visible insight has an explicit valid content class", async () => {
  const invalid = [];
  for (const file of files) {
    const source = await readFile(new URL(file, directory), "utf8");
    if (/^hidden:\s*"?true"?$/m.test(source)) continue;
    const contentClass = source.match(/^content_class:\s*"?(editorial|search)"?\s*$/m)?.[1];
    if (!contentClass) invalid.push(file);
  }
  assert.deepEqual(invalid, []);
});

test("every search insight has one valid guide type", async () => {
  const invalid = [];
  for (const file of files) {
    const source = await readFile(new URL(file, directory), "utf8");
    if (!/^content_class:\s*"?search"?\s*$/m.test(source)) continue;
    const guideType = source.match(/^guide_type:\s*"?([^"\n]+)"?\s*$/m)?.[1];
    if (!guideType || !allowedTypes.has(guideType)) invalid.push(file);
  }
  assert.deepEqual(invalid, []);
});
```

- [ ] **Step 2: 运行测试并确认历史文章缺少字段**

Run:

```bash
node --test tests/insightClassification.test.mjs
```

Expected: FAIL，并列出缺少 `content_class` 的 MDX 文件。

- [ ] **Step 3: 实现幂等分类迁移**

`scripts/apply-insight-classification.mjs` 使用以下优先级：

```js
function classifyContent(frontmatter, title, slug) {
  if (frontmatter.delivery_format === "article") return "editorial";
  if (frontmatter.delivery_format === "wcb_search_article") return "search";

  const text = `${title} ${slug}`.toLowerCase();
  const searchPattern =
    /\bwho owns\b|\bwho makes\b|\bwhere (?:are|is).+made\b|\bvs\.?\b|\bversus\b|\bbuying guide\b|\bbuyer'?s guide\b|\bmanufacturing cost\b|\boem\b|\bodm\b|\bsupplier audit\b|\bdistributor guide\b|\bhow (?:long|much|often|to)\b|\bwhat is\b|\bnot picking up\b|\btroubleshoot/;

  return searchPattern.test(text) ? "search" : "editorial";
}

function classifyGuideType(title, slug) {
  const text = `${title} ${slug}`.toLowerCase();
  if (/\bwho owns\b|\bwho makes\b|\bwhere (?:are|is).+made\b|\bwhat brands does\b/.test(text)) return "ownership";
  if (/\bvs\.?\b|\bversus\b|\bcompare\b|\bcomparison\b/.test(text)) return "comparison";
  if (/\boem\b|\bodm\b|\bmanufactur|\bsupplier\b|\bfactory audit\b|\bdistributor\b|\blanded cost\b/.test(text)) return "sourcing";
  if (/\bmaintenance\b|\bnot picking up\b|\btroubleshoot|\brepair\b|\bhow long\b|\bcleaning cycle\b/.test(text)) return "maintenance";
  if (/\bbuying guide\b|\bbuyer'?s guide\b|\bbest\b|\bfor pet hair\b|\bfor small yards\b/.test(text)) return "buying";
  return "explainer";
}
```

脚本要求：

- 只在第一段 frontmatter 内写入字段。
- 将字段插入 `article_type` 之前；没有 `article_type` 时插入 closing `---` 之前。
- 已存在合法字段时不重复写入。
- 不改变正文、日期、slug 或其他字段。
- 为以下高商业价值文章写入 `guide_priority`：

```js
const priorities = new Map([
  ["robot-vacuum-distributor-guide", 10],
  ["robotic-pool-cleaner-distributor-guide", 20],
  ["robotic-pool-cleaner-manufacturing-cost", 30],
  ["cordless-vacuum-cleaner-oem-odm-guide", 40],
  ["factory-audit-cleaning-appliance-suppliers-china", 50],
  ["robot-lawn-mower-buying-guide", 60]
]);
```

- 输出 audit JSON，结构固定为：

```json
{
  "generatedAt": "2026-07-26",
  "total": 345,
  "editorialCount": 0,
  "searchCount": 0,
  "unclassifiedCount": 0,
  "editorial": [],
  "search": [],
  "unclassified": []
}
```

其中计数和 slug 数组由实际迁移结果生成，`unclassifiedCount` 必须为 0，否则脚本退出码为 1。

- [ ] **Step 4: 实现独立校验脚本和构建闸门**

`scripts/verify-insight-classification.mjs` 逐文件检查：

```js
const allowedClasses = new Set(["editorial", "search"]);
const allowedGuideTypes = new Set(["buying", "ownership", "comparison", "sourcing", "maintenance", "explainer"]);
```

失败信息必须包含文件名和具体原因，例如：

```text
content/insights/example.mdx: search article requires a valid guide_type
```

在 `package.json` 增加：

```json
"prebuild": "npm run verify:content-classification",
"verify:content-classification": "node scripts/verify-insight-classification.mjs"
```

- [ ] **Step 5: 执行迁移并审计差异**

Run:

```bash
node scripts/apply-insight-classification.mjs
npm run verify:content-classification
git diff --stat
git diff -- content/insights | sed -n '1,220p'
```

Expected:

- 校验退出码 0。
- Audit 的 `total` 等于实际可见 MDX 数量。
- `editorialCount + searchCount = total`。
- `unclassifiedCount = 0`。
- MDX 差异只包含新增的 `content_class`、`guide_type`、`guide_priority`。

- [ ] **Step 6: 运行分类测试**

Run:

```bash
node --test tests/insightClassification.test.mjs
```

Expected: PASS。

- [ ] **Step 7: 提交**

```bash
git add package.json scripts/apply-insight-classification.mjs scripts/verify-insight-classification.mjs tests/insightClassification.test.mjs docs/superpowers/audits/2026-07-26-insight-classification.json content/insights
git commit -m "Classify editorial and guide articles"
```

---

### Task 3: 建立 Blog 与 Guides 集合边界

**Files:**
- Create: `tests/insightCollections.test.mjs`
- Create: `lib/insightCollections.ts`
- Modify: `app/blog/page.tsx`

**Interfaces:**
- Consumes: `Insight.contentClass`, `Insight.guideType`, `Insight.guidePriority`
- Produces: `getEditorialInsights(articles)`
- Produces: `getGuideInsights(articles, guideType?)`
- Produces: `getFeaturedGuides(articles, limit?)`
- Produces: Blog Feed、Featured、Latest Articles、分类和品牌筛选只使用 editorial

- [ ] **Step 1: 写集合隔离失败测试**

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  getEditorialInsights,
  getFeaturedGuides,
  getGuideInsights
} from "../lib/insightCollections.ts";

const blogSource = await readFile(new URL("../app/blog/page.tsx", import.meta.url), "utf8");

const articles = [
  { slug: "new-guide", contentClass: "search", guideType: "buying", guidePriority: 20, sortDate: "2026-07-27" },
  { slug: "latest-analysis", contentClass: "editorial", guidePriority: 0, sortDate: "2026-07-26" },
  { slug: "priority-guide", contentClass: "search", guideType: "sourcing", guidePriority: 10, sortDate: "2026-07-25" },
  { slug: "older-analysis", contentClass: "editorial", guidePriority: 0, sortDate: "2026-07-20" }
];

test("editorial collection excludes search articles and keeps date order", () => {
  assert.deepEqual(getEditorialInsights(articles).map(({ slug }) => slug), ["latest-analysis", "older-analysis"]);
});

test("guide collection excludes editorial and supports type filtering", () => {
  assert.deepEqual(getGuideInsights(articles).map(({ slug }) => slug), ["new-guide", "priority-guide"]);
  assert.deepEqual(getGuideInsights(articles, "sourcing").map(({ slug }) => slug), ["priority-guide"]);
});

test("featured guides use explicit priority rather than fabricated dates", () => {
  assert.deepEqual(getFeaturedGuides(articles, 2).map(({ slug }) => slug), ["priority-guide", "new-guide"]);
});

test("Blog derives every discovery surface from editorial articles", () => {
  assert.match(blogSource, /const articles = getEditorialInsights\(allArticles\)/);
  assert.match(blogSource, /const visibleCategories = categories\.filter/);
  assert.match(blogSource, /const visibleBrandTopics = brandTopics\.filter/);
  assert.match(blogSource, /getFeaturedGuides\(allArticles, 5\)/);
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/insightCollections.test.mjs
```

Expected: FAIL，错误包含 `Cannot find module '../lib/insightCollections.ts'`。

- [ ] **Step 3: 实现纯集合函数**

```ts
import type { GuideType } from "@/lib/guideTaxonomy";
import type { Insight } from "@/lib/content";

type SortableInsight = Pick<Insight, "slug" | "contentClass" | "guideType" | "guidePriority" | "sortDate">;

function newestFirst<T extends SortableInsight>(articles: T[]) {
  return [...articles].sort(
    (a, b) => b.sortDate.localeCompare(a.sortDate) || a.slug.localeCompare(b.slug)
  );
}

export function getEditorialInsights<T extends SortableInsight>(articles: T[]) {
  return newestFirst(articles.filter((article) => article.contentClass === "editorial"));
}

export function getGuideInsights<T extends SortableInsight>(articles: T[], guideType?: GuideType) {
  return newestFirst(
    articles.filter(
      (article) =>
        article.contentClass === "search" &&
        (!guideType || article.guideType === guideType)
    )
  );
}

export function getFeaturedGuides<T extends SortableInsight>(articles: T[], limit = 5) {
  return articles
    .filter((article) => article.contentClass === "search" && article.guidePriority > 0)
    .sort(
      (a, b) =>
        a.guidePriority - b.guidePriority ||
        b.sortDate.localeCompare(a.sortDate) ||
        a.slug.localeCompare(b.slug)
    )
    .slice(0, limit);
}
```

- [ ] **Step 4: 将 Blog 全部入口切到 editorial 集合**

在 `app/blog/page.tsx`：

```ts
import {
  getEditorialInsights,
  getFeaturedGuides
} from "@/lib/insightCollections";
```

页面数据改为：

```ts
const allArticles = getInsights();
const articles = getEditorialInsights(allArticles);
const practicalGuides = getFeaturedGuides(allArticles, 5);
```

Featured、筛选、`feedArticles`、分页、`latestSignals` 均从 `articles` 计算。Blog 顶部计数文案改为：

```tsx
<span><strong>{articles.length}+</strong><small>Original analysis and industry insights</small></span>
```

避免显示会产生空结果的旧 SEO 分类和品牌入口：

```ts
const visibleCategories = categories.filter(
  (category) => category === "All" || articles.some((article) => article.category === category)
);
const visibleBrandTopics = brandTopics.filter((topic) =>
  articles.some((article) => matchesTopic(article, topic))
);
```

分类导航和品牌侧栏分别渲染 `visibleCategories`、`visibleBrandTopics`。Metadata description、Open Graph description、CollectionPage description 和 ItemList name 同步改为强调 original analysis、company strategy、market signals 与 industry observations，不再把购买指南描述为 Blog 主内容。

侧栏加入：

```tsx
<div className="sidebar-box practical-guides-sidebar">
  <p className="eyebrow">Practical Guides</p>
  <h3>Research For Product, Brand And Sourcing Decisions</h3>
  {practicalGuides.map((article) => (
    <Link href={`/blog/${article.slug}`} key={article.slug}>{article.title}</Link>
  ))}
  <Link className="blog-archive-sidebar-link" href="/guides">Explore All Guides</Link>
</div>
```

扩展 `SidebarContent` props，显式接收 `practicalGuides`。

- [ ] **Step 5: 运行集合测试和 Blog 现有回归测试**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/insightCollections.test.mjs tests/blogConversion.test.mjs tests/contentExperience.test.mjs
npx tsc --noEmit
```

Expected: 全部 PASS。

- [ ] **Step 6: 提交**

```bash
git add lib/insightCollections.ts tests/insightCollections.test.mjs app/blog/page.tsx
git commit -m "Keep Blog focused on editorial analysis"
```

---

### Task 4: 新建 Guides 总入口与六个栏目页

**Files:**
- Create: `tests/guidesExperience.test.mjs`
- Create: `components/GuideCard.tsx`
- Create: `app/guides/page.tsx`
- Create: `app/guides/[type]/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `GUIDE_TYPE_CONFIG`, `getGuideInsights`, `getFeaturedGuides`, `getInsights`
- Produces: `/guides`
- Produces: `/guides/buying`, `/guides/ownership`, `/guides/comparison`, `/guides/sourcing`, `/guides/maintenance`, `/guides/explainer`

- [ ] **Step 1: 写 Guides 页面失败测试**

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8").catch(() => "");
const [landing, category, card, css] = await Promise.all([
  read("app/guides/page.tsx"),
  read("app/guides/[type]/page.tsx"),
  read("components/GuideCard.tsx"),
  read("app/globals.css")
]);

test("Guides landing has reader-facing categories and editorial return path", () => {
  assert.match(landing, /Industry Guides/);
  assert.match(landing, /GUIDE_TYPE_CONFIG/);
  assert.match(landing, /Featured Guides/);
  assert.match(landing, /Read Industry Analysis/);
  assert.doesNotMatch(landing, /\bSEO Articles\b|Search Content|Traffic Articles/i);
});

test("Guide category pages are static, canonical and structured", () => {
  assert.match(category, /generateStaticParams/);
  assert.match(category, /generateMetadata/);
  assert.match(category, /BreadcrumbList/);
  assert.match(category, /ItemList/);
  assert.match(category, /notFound\(\)/);
});

test("Guide cards retain existing article URLs", () => {
  assert.match(card, /href=\{`\/blog\/\$\{article\.slug\}`\}/);
});

test("Guides have isolated responsive styles", () => {
  assert.match(css, /Guides content hub/);
  assert.match(css, /\.guides-category-grid/);
  assert.match(css, /\.guide-card/);
});
```

- [ ] **Step 2: 运行测试并确认页面尚不存在**

Run:

```bash
node --test tests/guidesExperience.test.mjs
```

Expected: FAIL，并指出 Guides 页面或样式断言缺失。

- [ ] **Step 3: 创建共享 Guide 卡片**

`components/GuideCard.tsx`：

```tsx
import Link from "next/link";
import type { Insight } from "@/lib/content";

export function GuideCard({ article }: { article: Insight }) {
  return (
    <article className="guide-card">
      <Link href={`/blog/${article.slug}`}>
        {article.coverImage ? <img src={article.coverImage} alt={article.coverAlt || `${article.title} guide cover`} loading="lazy" decoding="async" /> : null}
        <div>
          <span>{article.category}</span>
          <h2>{article.title}</h2>
          <p>{article.excerpt}</p>
          <small>{article.readingTime}</small>
        </div>
      </Link>
    </article>
  );
}
```

- [ ] **Step 4: 创建 `/guides`**

页面要求：

- Metadata title 为 `Industry Guides`，canonical 为 `/guides`。
- Hero 文案：

```tsx
<p className="eyebrow">World Clean Biz Guides</p>
<h1>Industry Guides For Better Product, Brand And Sourcing Decisions.</h1>
<p>Research brand ownership, compare cleaning products, evaluate suppliers and understand the technologies shaping the market.</p>
```

- `Featured Guides` 使用 `getFeaturedGuides(getInsights(), 6)`。
- 六个栏目使用 `GUIDE_TYPE_CONFIG` 生成，每个栏目展示最新 4 篇并链接到 `guide.href`。
- 页面底部提供：

```tsx
<Link href="/blog">Read Industry Analysis</Link>
```

- 输出 `CollectionPage`、可见精选文章的 `ItemList` 和 `BreadcrumbList`。

- [ ] **Step 5: 创建 `/guides/[type]`**

实现：

```ts
export function generateStaticParams() {
  return GUIDE_TYPE_CONFIG.map(({ type }) => ({ type }));
}
```

`generateMetadata` 从配置生成栏目 title、description 和 canonical。页面通过 `isGuideType(type)` 拒绝非法路径，通过 `getGuideInsights(getInsights(), type)` 显示该栏目的全部文章；输出与可见文章顺序一致的 ItemList 和 BreadcrumbList。

- [ ] **Step 6: 增加响应式样式**

在 `app/globals.css` 末尾增加 `/* Guides content hub */` 区块，必须包含：

```css
.guides-category-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.guide-card a {
  display: grid;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.guide-card img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

@media (max-width: 900px) {
  .guides-category-grid {
    grid-template-columns: 1fr;
  }
}
```

其余颜色、圆角、字体和间距复用现有 Blog CSS 变量与容器类，不新增第三套视觉系统。

- [ ] **Step 7: 运行测试、类型检查和构建**

Run:

```bash
node --test tests/guidesExperience.test.mjs
npx tsc --noEmit
npm run build
```

Expected: 全部退出码 0，构建路由包含 `/guides` 和六个 `/guides/[type]` 静态页面。

- [ ] **Step 8: 提交**

```bash
git add app/guides components/GuideCard.tsx app/globals.css tests/guidesExperience.test.mjs
git commit -m "Add reader-focused Guides hub"
```

---

### Task 5: 改造 Archive 与文章集合归属

**Files:**
- Modify: `tests/contentExperience.test.mjs`
- Modify: `app/blog/archive/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `Insight.contentClass`, `Insight.guideType`, `GUIDE_TYPE_CONFIG`
- Produces: Archive 包含并分开显示全部文章
- Produces: search 文章面包屑指向 Guides；editorial 文章面包屑指向 Blog

- [ ] **Step 1: 增加失败断言**

在 `tests/contentExperience.test.mjs` 增加：

```js
test("Archive separates analysis and guides without changing article links", () => {
  assert.match(archive, /Analysis & Insights/);
  assert.match(archive, /Guides & Comparisons/);
  assert.match(archive, /href="#analysis"/);
  assert.match(archive, /href="#guides"/);
  assert.match(archive, /getEditorialInsights/);
  assert.match(archive, /getGuideInsights/);
  assert.match(archive, /href=\{`\/blog\/\$\{article\.slug\}`\}/);
});

test("article breadcrumbs reflect the reader-facing collection", () => {
  assert.match(article, /article\.contentClass === "search"/);
  assert.match(article, /\/guides\/\$\{article\.guideType\}/);
  assert.match(article, /collectionName/);
  assert.match(article, /World Clean Biz Industry Guides/);
  assert.match(article, /url: `\$\{siteUrl\}\$\{collectionHref\}`/);
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```bash
node --test tests/contentExperience.test.mjs
```

Expected: 新增两项 FAIL。

- [ ] **Step 3: Archive 使用两个集合**

在 `app/blog/archive/page.tsx`：

```ts
const articles = getInsights();
const editorialArticles = getEditorialInsights(articles);
const guideArticles = getGuideInsights(articles);
```

渲染两个带可见标题的 section；每篇仍链接 `/blog/${article.slug}`。页面顶部显示三项计数：

```tsx
<span><strong>{articles.length}</strong>All Articles</span>
<span><strong>{editorialArticles.length}</strong>Analysis &amp; Insights</span>
<span><strong>{guideArticles.length}</strong>Guides &amp; Comparisons</span>
```

Archive ItemList 顺序必须是 `[...editorialArticles, ...guideArticles]`，与可见页面一致。

顶部浏览入口使用普通锚点链接：

```tsx
<nav className="archive-content-nav" aria-label="Article archive sections">
  <a href="#all-articles">All Articles</a>
  <a href="#analysis">Analysis &amp; Insights</a>
  <a href="#guides">Guides &amp; Comparisons</a>
</nav>
```

Archive 外层使用 `id="all-articles"`，两个分组分别使用 `id="analysis"` 和 `id="guides"`。

- [ ] **Step 4: 文章页显示正确集合面包屑**

在 `app/blog/[slug]/page.tsx` 计算：

```ts
const isGuide = article.contentClass === "search" && article.guideType;
const collectionHref = isGuide ? `/guides/${article.guideType}` : "/blog";
const collectionName = isGuide ? "Guides" : "Blog";
```

可见面包屑和 BreadcrumbList Schema 都使用 `collectionHref`、`collectionName`。文章 canonical 和实际 URL 仍为 `/blog/${article.slug}`。

BlogPosting 的 `isPartOf` 同步使用当前集合：

```ts
isPartOf: {
  "@type": "CollectionPage",
  name: collectionName === "Guides" ? "World Clean Biz Industry Guides" : "World Clean Biz Blog",
  url: `${siteUrl}${collectionHref}`
},
```

- [ ] **Step 5: 增加 Archive 分组样式并运行验证**

Run:

```bash
node --test tests/contentExperience.test.mjs
npx tsc --noEmit
```

Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add app/blog/archive/page.tsx app/blog/[slug]/page.tsx app/globals.css tests/contentExperience.test.mjs
git commit -m "Separate analysis and guides in content discovery"
```

---

### Task 6: 更新全站导航、首页与 Sitemap

**Files:**
- Modify: `tests/homepageStructure.test.mjs`
- Modify: `tests/guidesExperience.test.mjs`
- Modify: `components/Header.tsx`
- Modify: `components/Footer.tsx`
- Modify: `app/page.tsx`
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: `getEditorialInsights`, `GUIDE_TYPE_CONFIG`
- Produces: Header 和 Footer 的 `/guides` 入口
- Produces: 首页三篇行业洞察只来自 editorial
- Produces: Sitemap 包含 Guides 入口与六个栏目

- [ ] **Step 1: 增加失败测试**

在 `tests/homepageStructure.test.mjs` 的导航标签数组中加入 `"Guides"`，并增加：

```js
test("homepage editorial proof excludes search guides", () => {
  assert.match(homeSource, /getEditorialInsights\(getInsights\(\)\)/);
});
```

在 `tests/guidesExperience.test.mjs` 增加：

```js
const [header, footer, sitemap] = await Promise.all([
  read("components/Header.tsx"),
  read("components/Footer.tsx"),
  read("app/sitemap.ts")
]);

test("Guides are reachable from global navigation and sitemap", () => {
  assert.match(header, /\{ href: "\/guides", label: "Guides" \}/);
  assert.match(footer, /href="\/guides"/);
  assert.match(sitemap, /"\/guides"/);
  assert.match(sitemap, /GUIDE_TYPE_CONFIG/);
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```bash
node --test tests/homepageStructure.test.mjs tests/guidesExperience.test.mjs
```

Expected: 导航、首页 editorial 集合和 Sitemap 断言 FAIL。

- [ ] **Step 3: 更新 Header、Footer 和首页**

Header 在 Blog 后增加：

```ts
{ href: "/guides", label: "Guides" },
```

Footer 的 Platform 列在 Blog 后增加：

```tsx
<Link href="/guides">Industry Guides</Link>
```

首页引入 `getEditorialInsights`，并改为：

```ts
const featuredInsights = getFeaturedInsights(getEditorialInsights(getInsights()));
```

- [ ] **Step 4: 更新 Sitemap**

引入 `GUIDE_TYPE_CONFIG`，静态路由加入 `/guides`，并加入：

```ts
const guideRoutes = GUIDE_TYPE_CONFIG.map(({ href }) => href);
```

最终静态集合使用：

```ts
const staticRoutes = ["", "/blog", "/blog/archive", "/guides", ...guideRoutes, ...existingRoutes];
```

文章 URL 生成逻辑保持 `/blog/${article.slug}`。

- [ ] **Step 5: 运行测试、类型检查和分类校验**

Run:

```bash
node --test tests/homepageStructure.test.mjs tests/guidesExperience.test.mjs
npm run verify:content-classification
npx tsc --noEmit
```

Expected: 全部退出码 0。

- [ ] **Step 6: 提交**

```bash
git add components/Header.tsx components/Footer.tsx app/page.tsx app/sitemap.ts tests/homepageStructure.test.mjs tests/guidesExperience.test.mjs
git commit -m "Expose Guides across site navigation"
```

---

### Task 7: 全量自动验证与浏览器验收

**Files:**
- Modify: `docs/superpowers/audits/2026-07-26-insight-classification.json` only when regenerated data differs

**Interfaces:**
- Consumes: all completed implementation tasks
- Produces: verified local build and visual acceptance evidence

- [ ] **Step 1: 检查工作树和分类审计**

Run:

```bash
git status --short
npm run verify:content-classification
node -e 'const a=require("./docs/superpowers/audits/2026-07-26-insight-classification.json"); if(a.unclassifiedCount!==0 || a.editorialCount+a.searchCount!==a.total) process.exit(1); console.log(a)'
```

Expected: 分类检查退出码 0；`unclassifiedCount` 为 0；两类计数之和等于 total。

- [ ] **Step 2: 运行全部自动测试**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/*.test.mjs
```

Expected: 全部测试 PASS，无 skipped 或 failed。

- [ ] **Step 3: 运行生产构建**

Run:

```bash
npm run build
```

Expected:

- `prebuild` 分类校验先通过。
- Next.js build 退出码 0。
- 输出包含 `/blog`、`/blog/archive`、`/guides`、六个 `/guides/[type]` 和全部 `/blog/[slug]`。

- [ ] **Step 4: 检查代码差异**

Run:

```bash
git diff --check
git status --short
git log --oneline -8
```

Expected: `git diff --check` 无输出；工作树没有未提交实现文件。

- [ ] **Step 5: 启动本地生产版本并做桌面检查**

Run:

```bash
npm run start
```

浏览器以 1440×1000 检查：

- `/blog`：Featured、Feed、Latest Articles 均没有 search 文章。
- `/guides`：精选区和六个栏目可见。
- `/guides/ownership`：Who Owns / Who Makes 文章可见并链接原 `/blog/[slug]`。
- `/blog/archive`：Analysis 在前、Guides 在后，两组计数正确。
- 一篇 editorial 详情页：面包屑返回 Blog。
- 一篇 search 详情页：面包屑返回对应 Guides 栏目。

- [ ] **Step 6: 做移动端检查**

浏览器以 390×844 检查同一组代表页面，确认：

- Header 菜单能访问 Blog 和 Guides。
- 页面无横向滚动。
- 卡片图片不变形。
- 栏目标题、卡片标题和面包屑不溢出。
- Blog Practical Guides 模块不挤压主文章流。

- [ ] **Step 7: 提交验证产生的确定性文件**

只有 audit 文件因脚本确定性重建而变化时执行：

```bash
git add docs/superpowers/audits/2026-07-26-insight-classification.json
git commit -m "Record final insight classification audit"
```

- [ ] **Step 8: 报告发布前状态**

报告必须包含：

- editorial、search、unclassified 实际数量。
- 自动测试总数和结果。
- production build 结果。
- Blog、Guides、Archive 与两类文章详情页的桌面/移动检查结果。
- 明确说明生产环境尚未部署，并等待用户部署授权。
