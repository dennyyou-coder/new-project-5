# Article Sharing and Related Editorial Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为所有 Blog 文章页增加可直接使用的社交分享入口，并将页尾推荐区改为固定 3 篇、连载优先的稳定随机深度分析推荐。

**Architecture:** 推荐选择保持在服务端纯函数中，文章模板只消费 3 篇已筛选结果；分享 URL、原生分享与复制行为放在可单测的纯辅助函数中，客户端组件只负责状态和渲染。正文仍使用 780px 阅读栏，桌面推荐区通过 CSS 扩展为三列宽网格，移动端收拢为紧凑列表。

**Tech Stack:** Next.js 15 App Router、React 19、TypeScript、CSS、Node.js `node:test`

## Global Constraints

- 推荐区始终展示恰好 3 篇文章，且全部满足 `contentClass === "editorial"`。
- 推荐不得包含当前文章；当前文章属于连载时，不得重复推荐同一连载。
- 非连载文章优先保留一个推荐位给其他连载的最新合格文章。
- 推荐使用 slug 驱动的稳定排序；相同候选集合下重新构建不得改变结果。
- 桌面分享渠道固定为 LinkedIn、X、Facebook、WhatsApp、复制链接。
- 平板和手机端额外提供系统分享；Web Share 不可用时直接渠道仍必须可用。
- 分享控件触控目标至少 44px，必须有可见焦点和明确的无障碍名称。
- 不修改文章正文、frontmatter、首页、导航、Footer、业务咨询 CTA、图片资产或发布配置。
- 不增加第三方依赖；继续使用现有 `responsiveImageProps` 图片路径。
- 修改前保留用户现有的 `AGENTS.md` 和 `.superpowers/verification/` 改动，不得暂存或提交这些文件。

---

## File Map

- Modify: `lib/insightCollections.ts` — 新增稳定的 3 篇深度分析推荐选择函数。
- Modify: `tests/insightCollections.test.mjs` — 覆盖 editorial 过滤、稳定性、连载优先、同系列排除和库存不足错误。
- Create: `lib/articleSharing.ts` — 构造平台分享 URL，并封装可测试的原生分享与复制结果。
- Create: `components/ArticleShareActions.tsx` — 渲染桌面悬浮栏和移动端内嵌分享区。
- Create: `tests/articleSharing.test.mjs` — 验证 URL 编码、Web Share 分支、取消行为和复制回退。
- Modify: `app/blog/[slug]/page.tsx` — 使用新推荐函数、插入分享组件并简化推荐卡内容。
- Modify: `app/styles/article.css` — 分享栏、响应式分享区和文章主体定位样式。
- Modify: `app/styles/content-directories.css` — `Continue Reading` 三列网格和移动端紧凑列表样式。
- Modify: `tests/contentExperience.test.mjs` — 锁定文章模板结构、推荐区信息密度和响应式规则。

---

### Task 1: Stable Editorial Recommendation Selection

**Files:**
- Modify: `lib/insightCollections.ts:4-128`
- Modify: `tests/insightCollections.test.mjs:4-14,90-260`

**Interfaces:**
- Consumes: `SortableInsight` fields `slug`, `contentClass`, `sortDate`, `series`, `seriesEpisode`.
- Produces: `getRelatedEditorialInsights<T extends SortableInsight>(articles: T[], current: T, limit?: number): T[]`.
- Failure contract: throws `RELATED_EDITORIAL_INSUFFICIENT slug=<slug> required=<n> available=<n>` when fewer than `limit` eligible results remain.

- [ ] **Step 1: Add failing selection tests**

Add `getRelatedEditorialInsights` to the import destructuring in `tests/insightCollections.test.mjs`, then add fixtures and assertions equivalent to:

```js
test("related recommendations return three stable editorial articles", () => {
  const current = insight({ slug: "current" });
  const candidates = [
    current,
    insight({ slug: "analysis-a", sortDate: "2026-08-01" }),
    insight({ slug: "analysis-b", sortDate: "2026-08-02" }),
    insight({ slug: "analysis-c", sortDate: "2026-08-03" }),
    insight({ slug: "analysis-d", sortDate: "2026-08-04" }),
    insight({ slug: "guide", contentClass: "search", guideType: "buying" })
  ];

  const first = getRelatedEditorialInsights(candidates, current);
  const second = getRelatedEditorialInsights([...candidates].reverse(), current);

  assert.equal(first.length, 3);
  assert.deepEqual(first.map(({ slug }) => slug), second.map(({ slug }) => slug));
  assert.ok(first.every(({ contentClass }) => contentClass === "editorial"));
  assert.ok(first.every(({ slug }) => slug !== current.slug));
  assert.equal(new Set(first.map(({ slug }) => slug)).size, 3);
});

test("related recommendations reserve one slot for the latest serial analysis", () => {
  const current = insight({ slug: "current" });
  const candidates = [
    current,
    insight({ slug: "series-1", series: "expo-series", seriesEpisode: "1", sortDate: "2026-08-01" }),
    insight({ slug: "series-2", series: "expo-series", seriesEpisode: "2", sortDate: "2026-08-02" }),
    insight({ slug: "analysis-a" }),
    insight({ slug: "analysis-b" }),
    insight({ slug: "analysis-c" })
  ];

  const related = getRelatedEditorialInsights(candidates, current);
  assert.ok(related.some(({ slug }) => slug === "series-2"));
  assert.ok(related.every(({ slug }) => slug !== "series-1"));
});

test("related recommendations do not duplicate the current series", () => {
  const current = insight({ slug: "series-current", series: "expo-series", seriesEpisode: "3" });
  const related = getRelatedEditorialInsights([
    current,
    insight({ slug: "series-older", series: "expo-series", seriesEpisode: "2" }),
    insight({ slug: "other-series", series: "market-series", seriesEpisode: "1" }),
    insight({ slug: "analysis-a" }),
    insight({ slug: "analysis-b" }),
    insight({ slug: "analysis-c" })
  ], current);

  assert.ok(related.every(({ series }) => series !== "expo-series"));
});

test("related recommendations fail clearly when three editorial articles are unavailable", () => {
  const current = insight({ slug: "current" });
  assert.throws(
    () => getRelatedEditorialInsights([
      current,
      insight({ slug: "only-one" }),
      insight({ slug: "guide", contentClass: "search" })
    ], current),
    /RELATED_EDITORIAL_INSUFFICIENT slug=current required=3 available=1/
  );
});
```

- [ ] **Step 2: Run the focused test and verify red state**

Run:

```bash
npm run test:insights
```

Expected: FAIL because `getRelatedEditorialInsights` is not exported.

- [ ] **Step 3: Implement deterministic selection**

Add the following behavior to `lib/insightCollections.ts`:

```ts
function stableInsightScore(seed: string, value: string) {
  let hash = 2166136261;
  for (const character of `${seed}:${value}`) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableInsightOrder<T extends SortableInsight>(articles: T[], seed: string) {
  return [...articles].sort(
    (a, b) =>
      stableInsightScore(seed, a.slug) - stableInsightScore(seed, b.slug) ||
      a.slug.localeCompare(b.slug)
  );
}

export function getRelatedEditorialInsights<T extends SortableInsight>(
  articles: T[],
  current: T,
  limit = 3
) {
  const eligible = getEditorialInsights(articles).filter(
    (article) =>
      article.slug !== current.slug &&
      (!current.series || article.series !== current.series)
  );
  const ungrouped = eligible.filter((article) => !article.series);
  const seriesGroups = new Map<string, T[]>();

  for (const article of eligible) {
    if (!article.series) continue;
    const group = seriesGroups.get(article.series) ?? [];
    group.push(article);
    seriesGroups.set(article.series, group);
  }

  const latestSeries = [...seriesGroups.values()]
    .map((group) => orderSeriesInsights(group, "descending")[0])
    .filter((article): article is T => Boolean(article));
  const ordered = stableInsightOrder([...ungrouped, ...latestSeries], current.slug);
  const selected: T[] = [];

  if (!current.series && latestSeries.length) {
    selected.push(stableInsightOrder(latestSeries, current.slug)[0]);
  }

  for (const article of ordered) {
    if (selected.some((item) => item.slug === article.slug)) continue;
    selected.push(article);
    if (selected.length === limit) break;
  }

  if (selected.length < limit) {
    throw new Error(
      `RELATED_EDITORIAL_INSUFFICIENT slug=${current.slug} required=${limit} available=${selected.length}`
    );
  }

  return selected;
}
```

Do not use `Math.random()`, timestamps, array input order, category fillers, or search articles.

- [ ] **Step 4: Run the focused test and verify green state**

Run:

```bash
npm run test:insights
```

Expected: all insight collection tests PASS.

- [ ] **Step 5: Commit the recommendation selector**

```bash
git add lib/insightCollections.ts tests/insightCollections.test.mjs
git commit -m "Add stable editorial article recommendations"
```

---

### Task 2: Share Behavior and Responsive Component

**Files:**
- Create: `lib/articleSharing.ts`
- Create: `components/ArticleShareActions.tsx`
- Create: `tests/articleSharing.test.mjs`

**Interfaces:**
- Produces: `getArticleShareLinks(title: string, url: string): ArticleShareLink[]`.
- Produces: `canUseNativeShare(navigatorLike: ShareNavigator, data: ShareData): boolean`.
- Produces: `shareArticle(navigatorLike: ShareNavigator, data: ShareData): Promise<"shared" | "cancelled" | "failed" | "unsupported">`.
- Produces: `copyArticleUrl(url: string, environment: CopyEnvironment): Promise<boolean>`.
- Produces: `<ArticleShareActions title: string url: string />`.
- Consumes in Task 3: article title and canonical absolute URL from `app/blog/[slug]/page.tsx`.

- [ ] **Step 1: Add failing share helper tests**

Create `tests/articleSharing.test.mjs` with tests equivalent to:

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  canUseNativeShare,
  copyArticleUrl,
  getArticleShareLinks,
  shareArticle
} from "../lib/articleSharing.ts";

const data = {
  title: "Pool robotics & the next market",
  url: "https://worldcleanbiz.com/blog/pool-robotics"
};

test("share links encode the canonical URL and title", () => {
  const links = getArticleShareLinks(data.title, data.url);
  assert.deepEqual(links.map(({ id }) => id), ["linkedin", "x", "facebook", "whatsapp"]);
  assert.ok(links.every(({ href }) => href.includes(encodeURIComponent(data.url))));
  assert.match(links.find(({ id }) => id === "x").href, /text=/);
  assert.match(links.find(({ id }) => id === "whatsapp").href, /text=/);
});

test("native share is exposed only when the browser accepts the payload", () => {
  assert.equal(canUseNativeShare({}, data), false);
  assert.equal(canUseNativeShare({ share: async () => {}, canShare: () => false }, data), false);
  assert.equal(canUseNativeShare({ share: async () => {}, canShare: () => true }, data), true);
});

test("native share distinguishes cancellation from failure", async () => {
  assert.equal(await shareArticle({ share: async () => {} }, data), "shared");
  assert.equal(await shareArticle({
    share: async () => { throw new DOMException("cancelled", "AbortError"); }
  }, data), "cancelled");
  assert.equal(await shareArticle({
    share: async () => { throw new Error("blocked"); }
  }, data), "failed");
});

test("copy falls back only when Clipboard API is unavailable or fails", async () => {
  const calls = [];
  assert.equal(await copyArticleUrl(data.url, {
    clipboard: { writeText: async (value) => calls.push(`clipboard:${value}`) },
    legacyCopy: () => { calls.push("legacy"); return true; }
  }), true);
  assert.deepEqual(calls, [`clipboard:${data.url}`]);

  assert.equal(await copyArticleUrl(data.url, {
    clipboard: { writeText: async () => { throw new Error("denied"); } },
    legacyCopy: (value) => { calls.push(`legacy:${value}`); return true; }
  }), true);
  assert.equal(calls.at(-1), `legacy:${data.url}`);
});
```

- [ ] **Step 2: Run the helper test and verify red state**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/articleSharing.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `lib/articleSharing.ts`.

- [ ] **Step 3: Implement pure share helpers**

Create `lib/articleSharing.ts` with explicit types and these behaviors:

```ts
export type ShareData = { title: string; url: string };
export type ArticleShareLink = {
  id: "linkedin" | "x" | "facebook" | "whatsapp";
  label: string;
  href: string;
};
export type ShareNavigator = {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
};
export type CopyEnvironment = {
  clipboard?: { writeText(value: string): Promise<void> };
  legacyCopy(value: string): boolean;
};

export function getArticleShareLinks(title: string, url: string): ArticleShareLink[] {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  return [
    { id: "linkedin", label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { id: "x", label: "Share on X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { id: "facebook", label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { id: "whatsapp", label: "Share on WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` }
  ];
}

export function canUseNativeShare(navigatorLike: ShareNavigator, data: ShareData) {
  if (typeof navigatorLike.share !== "function") return false;
  return typeof navigatorLike.canShare !== "function" || navigatorLike.canShare(data);
}

export async function shareArticle(navigatorLike: ShareNavigator, data: ShareData) {
  if (!canUseNativeShare(navigatorLike, data) || !navigatorLike.share) return "unsupported" as const;
  try {
    await navigatorLike.share(data);
    return "shared" as const;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return "cancelled" as const;
    return "failed" as const;
  }
}

export async function copyArticleUrl(url: string, environment: CopyEnvironment) {
  if (environment.clipboard) {
    try {
      await environment.clipboard.writeText(url);
      return true;
    } catch {
      // Continue to the explicit legacy fallback.
    }
  }
  try {
    return environment.legacyCopy(url);
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run helper tests and verify green state**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/articleSharing.test.mjs
```

Expected: all article sharing helper tests PASS.

- [ ] **Step 5: Create the client component**

Create `components/ArticleShareActions.tsx` as a client component. It must:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  canUseNativeShare,
  copyArticleUrl,
  getArticleShareLinks,
  shareArticle
} from "@/lib/articleSharing";

const SHARE_MARKS = {
  linkedin: "in",
  x: "X",
  facebook: "f",
  whatsapp: "WA"
} as const;

export function ArticleShareActions({ title, url }: { title: string; url: string }) {
  const data = { title, url };
  const links = getArticleShareLinks(title, url);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [status, setStatus] = useState("");
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setCanNativeShare(canUseNativeShare(navigator, data));
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, [title, url]);

  function announce(message: string) {
    setStatus(message);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setStatus(""), 2400);
  }

  function legacyCopy(value: string) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  }

  async function handleCopy() {
    const copied = await copyArticleUrl(url, {
      clipboard: navigator.clipboard,
      legacyCopy
    });
    announce(copied ? "Link copied" : "Copy failed");
  }

  async function handleNativeShare() {
    const result = await shareArticle(navigator, data);
    if (result === "failed") announce("Sharing unavailable");
  }

  return (
    <>
      <aside className="article-share-rail" aria-label="Share this article">
        <div className="article-share-rail-inner">
          <span className="article-share-kicker">Share</span>
          {links.map((link) => (
            <a
              aria-label={link.label}
              className="article-share-action"
              href={link.href}
              key={link.id}
              rel="noopener noreferrer"
              target="_blank"
              title={link.label}
            >
              <span aria-hidden="true">{SHARE_MARKS[link.id]}</span>
            </a>
          ))}
          <button
            aria-label="Copy article link"
            className="article-share-action"
            onClick={handleCopy}
            title="Copy article link"
            type="button"
          >
            <span aria-hidden="true">⧉</span>
          </button>
          <span className="article-share-status" role="status" aria-live="polite">
            {status}
          </span>
        </div>
      </aside>

      <section className="article-share-mobile" aria-labelledby="article-share-title">
        <div>
          <span className="article-share-kicker">Share</span>
          <h2 id="article-share-title">Share this analysis</h2>
        </div>
        <div className="article-share-mobile-actions">
          {canNativeShare ? (
            <button className="article-share-action" onClick={handleNativeShare} type="button">
              <span aria-hidden="true">↗</span>
              <span>Share</span>
            </button>
          ) : null}
          {links.map((link) => (
            <a
              aria-label={link.label}
              className="article-share-action"
              href={link.href}
              key={link.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span aria-hidden="true">{SHARE_MARKS[link.id]}</span>
              <span>{link.id === "x" ? "X" : link.id[0].toUpperCase() + link.id.slice(1)}</span>
            </a>
          ))}
          <button className="article-share-action" onClick={handleCopy} type="button">
            <span aria-hidden="true">⧉</span>
            <span>Copy link</span>
          </button>
        </div>
        <span className="article-share-status" role="status" aria-live="polite">
          {status}
        </span>
      </section>
    </>
  );
}
```

The render must include:

- `aside.article-share-rail[aria-label="Share this article"]` with an inner sticky wrapper.
- Four external anchors with `target="_blank" rel="noopener noreferrer"`.
- A `button type="button"` for copy.
- `section.article-share-mobile[aria-labelledby="article-share-title"]` after the article body.
- A native share button only when `canNativeShare` is true.
- A visible `<span className="article-share-status" role="status" aria-live="polite">` in each responsive region; CSS ensures only the active region is exposed.
- Inline SVG or text marks with `aria-hidden="true"`; accessible names must come from the anchor/button labels.

- [ ] **Step 6: Add source-contract assertions for the component**

Extend `tests/articleSharing.test.mjs` to read `components/ArticleShareActions.tsx` and assert:

```js
assert.match(componentSource, /^"use client"/);
assert.match(componentSource, /article-share-rail/);
assert.match(componentSource, /article-share-mobile/);
assert.match(componentSource, /aria-live="polite"/);
assert.match(componentSource, /rel="noopener noreferrer"/);
assert.match(componentSource, /canUseNativeShare/);
assert.match(componentSource, /copyArticleUrl/);
```

- [ ] **Step 7: Re-run share tests**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/articleSharing.test.mjs
```

Expected: helper and component source-contract tests PASS.

- [ ] **Step 8: Commit share behavior and component**

```bash
git add lib/articleSharing.ts components/ArticleShareActions.tsx tests/articleSharing.test.mjs
git commit -m "Add responsive article sharing controls"
```

---

### Task 3: Article Template, Editorial Grid, and End-to-End Verification

**Files:**
- Modify: `app/blog/[slug]/page.tsx:3-98,220-490`
- Modify: `app/styles/article.css:430-516`
- Modify: `app/styles/content-directories.css:364-405,1090-1220`
- Modify: `tests/contentExperience.test.mjs:1-130`

**Interfaces:**
- Consumes: `getRelatedEditorialInsights(articles, article, 3)` from Task 1.
- Consumes: `<ArticleShareActions title={article.title} url={url} />` from Task 2.
- Preserves: existing `BlogConversionCta`, `orderSeriesInsights`, `responsiveImageProps`, author note and series navigation.

- [ ] **Step 1: Add failing article-template assertions**

Update `tests/contentExperience.test.mjs` so the article template contract requires:

```js
test("Article template uses editorial recommendations and responsive sharing", () => {
  assert.match(article, /getRelatedEditorialInsights\(articles, article, 3\)/);
  assert.match(article, /<ArticleShareActions title=\{article\.title\} url=\{url\}/);
  assert.match(article, /<h2[^>]*>Continue Reading<\/h2>/);
  assert.match(article, /blog-related-signals-heading/);
  assert.match(article, /item\.seriesTitle \|\| item\.category/);
  assert.doesNotMatch(article, /relatedArticleOverrides/);
  assert.doesNotMatch(article, /<p>\{item\.excerpt\}<\/p>/);
});

test("Article share and related layouts adapt without covering mobile content", () => {
  assert.match(blogRouteCss, /\.article-share-rail[\s\S]*position:\s*absolute/);
  assert.match(blogRouteCss, /\.article-share-rail-inner[\s\S]*position:\s*sticky/);
  assert.match(blogRouteCss, /\.article-share-action[\s\S]*min-(?:width|height):\s*44px/);
  assert.match(blogRouteCss, /@media \(max-width:\s*1040px\)[\s\S]*\.article-share-rail[\s\S]*display:\s*none/);
  assert.match(blogRouteCss, /\.blog-related-signals \.related-signal-grid[\s\S]*repeat\(3,/);
  assert.match(blogRouteCss, /@media \(max-width:\s*640px\)[\s\S]*\.blog-related-signals \.related-signal-card[\s\S]*grid-template-columns:/);
});
```

Keep the existing assertions for breadcrumb, author, responsive images, mobile overflow and the single `BlogConversionCta`.

- [ ] **Step 2: Run the article experience test and verify red state**

Run:

```bash
node --test tests/contentExperience.test.mjs
```

Expected: FAIL because the article template and CSS do not yet use the new component or layout.

- [ ] **Step 3: Replace the legacy recommendation assembly**

In `app/blog/[slug]/page.tsx`:

1. Import `ArticleShareActions`.
2. Import `getRelatedEditorialInsights` beside `orderSeriesInsights`.
3. Delete `relatedArticleOverrides` and the `relatedOverrides`, `sameCategory`, `fillers` assembly.
4. After the article null check, calculate:

```ts
const related = getRelatedEditorialInsights(articles, article, 3);
```

5. Keep `url` as the canonical absolute URL already used by schema and pass it to the share component.

- [ ] **Step 4: Insert the share component without moving article content**

Immediately after the rendered article body and before `<footer className="blog-author-note">`, add:

```tsx
<ArticleShareActions title={article.title} url={url} />
```

Do not place sharing controls inside `dangerouslySetInnerHTML`, the author box, the series navigation or the conversion CTA.

- [ ] **Step 5: Simplify the related article markup**

Change the related block to:

```tsx
<section className="blog-related-signals" aria-labelledby="continue-reading-title">
  <div className="blog-related-signals-heading">
    <p>Selected analysis from across the cleaning industry</p>
    <h2 id="continue-reading-title">Continue Reading</h2>
  </div>
  <div className="related-signal-grid">
    {related.map((item) => (
      <Link className="related-signal-card" href={`/blog/${item.slug}`} key={item.slug}>
        <div className="related-signal-image">
          <img
            {...(item.coverImage
              ? responsiveImageProps(item.coverImage, "card")
              : {
                  src: "/images/site-refresh/real/city-architecture.webp",
                  loading: "lazy" as const,
                  decoding: "async" as const
                })}
            alt=""
          />
        </div>
        <div className="meta">{item.seriesTitle || item.category}</div>
        <h3>{item.title}</h3>
        <span>{item.readingTime} · Read Article</span>
      </Link>
    ))}
  </div>
</section>
```

Do not render `item.excerpt`. Keep the existing fallback image and responsive image helper.

- [ ] **Step 6: Implement desktop and mobile share styles**

In `app/styles/article.css`:

- Add `position: relative` to `.blog-article-main`.
- Position `.article-share-rail` absolutely to the left of the 780px reading column; place `.article-share-rail-inner` at `position: sticky; top: 112px`.
- Render each `.article-share-action` as a 44px circular control with border, hover and `:focus-visible` state.
- Hide `.article-share-mobile` by default.
- At `max-width: 1040px`, hide `.article-share-rail` and display `.article-share-mobile` after the body.
- Use flex-wrap for mobile actions so no horizontal scrolling is required.
- Style `.article-share-status` as a full-row, non-jumping status area with `min-height`.
- Under `prefers-reduced-motion: reduce`, remove share-control transitions.

Use existing CSS variables `--ink`, `--muted`, `--blue`, `--soft`, `--line`; do not introduce new global variables.

- [ ] **Step 7: Implement the editorial grid and compact mobile list**

In `app/styles/content-directories.css`, replace the article-specific related overrides so that:

```css
.blog-related-signals {
  width: min(calc(100vw - 40px), 1080px);
  margin-top: 58px;
  margin-left: 50%;
  border-top: 1px solid rgba(226, 232, 240, 0.92);
  padding-top: 34px;
  transform: translateX(-50%);
}

.blog-related-signals .related-signal-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 18px;
}
```

Cards must use 16:9 images, equal padding, no forced paragraph space, and a clear title/read-action hierarchy. At `max-width: 760px`, use one column. At `max-width: 640px`, each card becomes a compact two-column row with a fixed thumbnail column, content column and no minimum height. Ensure the section width becomes `calc(100vw - 28px)` at the existing mobile container breakpoint.

- [ ] **Step 8: Run focused tests**

Run:

```bash
npm run test:insights
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/articleSharing.test.mjs
node --test tests/contentExperience.test.mjs
```

Expected: all focused tests PASS.

- [ ] **Step 9: Run the production build**

Run:

```bash
npm run build
```

Expected: prebuild classification and article-image checks pass, Next.js build succeeds, and postbuild article-image verification passes.

- [ ] **Step 10: Verify two representative routes in a real browser**

Start the local site and inspect:

- Non-series editorial: `/blog/aiper-fluidra-pool-robotics-alliance`
- Series article: `/blog/building-worlds-no-1-cleaning-show-from-scratch-episode-04`

At 1440px confirm:

- The share rail stays beside the article and never overlaps text or images.
- All four external share links open the intended service with the canonical URL.
- Copy link reports `Link copied`.
- `Continue Reading` shows exactly 3 editorial cards in one row.
- The series article does not repeat its own series in the recommendation grid.
- The business inquiry CTA remains after the recommendation section.

At 390px confirm:

- The desktop rail is absent.
- The inline share section appears after the article body.
- System Share appears only when supported.
- Direct channels remain usable and all targets are at least 44px.
- Recommendation cards use compact rows with no horizontal overflow.
- Author box, series navigation and CTA retain their current order and readability.

- [ ] **Step 11: Commit the integrated article experience**

```bash
git add app/blog/[slug]/page.tsx app/styles/article.css app/styles/content-directories.css tests/contentExperience.test.mjs
git commit -m "Redesign article sharing and continued reading"
```

- [ ] **Step 12: Confirm the final diff is limited to approved scope**

Run:

```bash
git status --short
git diff HEAD~3 --stat
```

Expected: feature commits contain only the files listed in this plan. Pre-existing `AGENTS.md`, `.superpowers/brainstorm/` and `.superpowers/verification/` changes remain unstaged and untouched.
