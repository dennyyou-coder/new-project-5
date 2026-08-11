# WCB Homepage PageSpeed Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce `worldcleanbiz.com` homepage image transfer and render-blocking CSS enough to raise the controlled mobile Lighthouse median from 67 to at least 80 without changing content, SEO, conversion behavior, or unrelated routes.

**Architecture:** Keep original homepage and article assets as canonical sources, but render homepage consumers through `next/image` with exact intrinsic dimensions and viewport-specific `sizes`. Preserve the audited article-image pipeline for article pages, replace only the oversized avatar with a small derived WebP, and remove obsolete global Home V4 CSS after moving the few live homepage rules into route-scoped `home.css`.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, `next/image`, Sharp 0.34, Node test runner, Lighthouse 13, Playwright browser QA.

## Global Constraints

- Work only in `codex/wcb-home-pagespeed`, based on production merge `46c02c5e25d2e0cd404561d3d9745c17cfd3df32`.
- Do not change homepage copy, section order, canonical, OpenGraph, structured data, lead tracking, or Tally behavior.
- Do not change article bodies, article image URLs, the article image manifest/runtime, or article pipeline rules.
- Keep every below-fold homepage image lazy and asynchronously decoded.
- Do not add unconditional eager/high priority to the founder-series image.
- Keep the original product-director PNG; add a derived WebP instead of overwriting it.
- Do not broaden JavaScript cleanup while mobile TBT remains effectively zero.
- Do not merge, push, or deploy production without a separate approved release step.

---

### Task 1: Lock the homepage image-delivery contract

**Files:**
- Create: `tests/homepagePerformance.test.mjs`
- Modify: `app/page.tsx`
- Modify: `components/HomeSeriesFeature.tsx`
- Create: `public/images/testimonials/testimonial-avatar-product-director.webp`

**Interfaces:**
- Consumes: `getArticleImage(url)` from `lib/articleImages.ts` and the existing `Insight.coverImage` metadata.
- Produces: homepage `Image` elements with exact `width`, `height`, `sizes`, `loading`, and accessible alt text; no change to article URLs or manifest state.

- [ ] **Step 1: Write failing image-contract tests**

Create `tests/homepagePerformance.test.mjs` with source and binary checks:

```js
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";

const homeSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const seriesSource = await readFile(new URL("../components/HomeSeriesFeature.tsx", import.meta.url), "utf8");
const avatarUrl = new URL(
  "../public/images/testimonials/testimonial-avatar-product-director.webp",
  import.meta.url
);

test("homepage-owned raster visuals use next/image with explicit responsive sizes", () => {
  assert.match(homeSource, /import Image from "next\/image"/);
  assert.match(homeSource, /sizes="\(max-width: 720px\) 42vw,/);
  assert.match(homeSource, /sizes="\(max-width: 720px\) calc\(100vw - 40px\),/);
  assert.doesNotMatch(homeSource, /className="home-v9-testimonial-avatar[^>]*role="img"/);
});

test("homepage series uses responsive optimization without unconditional priority", () => {
  assert.match(seriesSource, /import Image from "next\/image"/);
  assert.match(seriesSource, /getArticleImage\(/);
  assert.match(seriesSource, /loading="lazy"/);
  assert.match(seriesSource, /sizes="\(max-width: 1050px\) calc\(100vw - 40px\), 480px"/);
  assert.doesNotMatch(seriesSource, /priority|fetchPriority="high"/);
});

test("product-director avatar is a compact square WebP", async () => {
  const [facts, file] = await Promise.all([sharp(avatarUrl).metadata(), stat(avatarUrl)]);
  assert.equal(facts.format, "webp");
  assert.equal(facts.width, 160);
  assert.equal(facts.height, 160);
  assert.ok(file.size <= 20_000, `avatar is ${file.size} bytes`);
});
```

- [ ] **Step 2: Run the focused test and capture RED**

Run:

```bash
node --test tests/homepagePerformance.test.mjs
```

Expected: failures for the missing WebP, missing `next/image` imports, and raw testimonial background markup.

- [ ] **Step 3: Generate the derived avatar without replacing its source**

Run the Sharp transform from the repository root:

```bash
node --input-type=module -e "import sharp from 'sharp'; await sharp('public/images/testimonials/testimonial-avatar-product-director.png').resize(160,160,{fit:'cover'}).webp({quality:82,effort:6}).toFile('public/images/testimonials/testimonial-avatar-product-director.webp')"
```

Inspect both the source PNG and derived WebP at original zoom and at 68 px. Reject the output if facial framing, color, or edge quality changes materially.

- [ ] **Step 4: Convert homepage-owned images to exact responsive consumers**

In `app/page.tsx`, import `Image` and add intrinsic dimensions to the existing data objects. Render them with these exact size contracts:

```tsx
<Image
  src={product.image}
  alt={product.alt}
  width={1200}
  height={900}
  sizes="(max-width: 720px) 42vw, (max-width: 1050px) 21vw, 165px"
  loading="lazy"
/>
```

```tsx
<Image
  src="/images/expo/wcb-expo-2026-hero.webp"
  alt="WCB Expo visual showing cleaning appliances and an industry exhibition setting"
  width={1672}
  height={941}
  sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1180px) 40vw, 480px"
  loading="lazy"
/>
```

Use the same `Image` contract for pathway and trust-gallery images, with `sizes` matching their current CSS widths. Replace each testimonial background `<div>` with:

```tsx
<Image
  className="home-v9-testimonial-avatar"
  src="/images/testimonials/testimonial-avatar-product-director.webp"
  alt="Asian cleaning appliance product director"
  width={68}
  height={68}
  sizes="(max-width: 720px) 54px, 68px"
  loading="lazy"
/>
```

Keep founder and sourcing avatars on their current source paths while giving them the same element contract.

- [ ] **Step 5: Optimize the dynamic founder-series consumer**

In `components/HomeSeriesFeature.tsx`, use `getArticleImage` to obtain source dimensions and render the latest cover through `Image`:

```tsx
const coverUrl = article.coverImage || fallbackCover;
const cover = getArticleImage(coverUrl);

<Image
  src={coverUrl}
  alt={article.coverAlt || `${seriesTitle} cover`}
  width={cover.width}
  height={cover.height}
  sizes="(max-width: 1050px) calc(100vw - 40px), 480px"
  loading="lazy"
/>
```

Do not add `priority` or `fetchPriority="high"` in this task.

- [ ] **Step 6: Run image-contract and existing homepage tests until GREEN**

Run:

```bash
node --test tests/homepagePerformance.test.mjs tests/homepageSeriesFeature.test.mjs tests/homepageStructure.test.mjs
```

Expected: all tests pass; any old test that required raw background-image avatars is updated to assert the new semantic image contract without weakening identity/copy checks.

- [ ] **Step 7: Commit the image-delivery task**

```bash
git add app/page.tsx components/HomeSeriesFeature.tsx tests/homepagePerformance.test.mjs tests/homepageSeriesFeature.test.mjs tests/homepageStructure.test.mjs public/images/testimonials/testimonial-avatar-product-director.webp
git commit -m "Optimize homepage image delivery"
```

---

### Task 2: Remove obsolete global homepage CSS

**Files:**
- Modify: `components/HomeUpdatesForm.tsx`
- Modify: `app/styles/home.css`
- Modify: `app/globals.css`
- Modify: `tests/homepagePerformance.test.mjs`
- Modify: `tests/homepageStructure.test.mjs`

**Interfaces:**
- Consumes: current Home V9 markup and the shared route-style reader in `tests/readRouteStyles.mjs`.
- Produces: `home-v9-updates-form` as the only homepage form wrapper class; Home V9 Expo and form styles owned by `home.css`; no live `home-v4-*` selectors.

- [ ] **Step 1: Add failing CSS ownership and dead-selector tests**

Append tests that read production TSX sources and both CSS files:

```js
test("homepage route owns its Expo and updates-form styles", () => {
  assert.match(homeCss, /\.home-v9-expo-campaign\s*\{/);
  assert.match(homeCss, /\.home-v9-updates-form\s*\{/);
  assert.doesNotMatch(globalCss, /\.home-v9-expo-campaign/);
});

test("retired Home V4 selectors have no production references", () => {
  assert.doesNotMatch(globalCss, /\.home-v4-/);
  assert.doesNotMatch(productionSource, /home-v4-/);
});
```

Build `productionSource` deterministically from all `.tsx` files under `app/` and `components/`, sorted by path, so the test does not rely on shell commands.

- [ ] **Step 2: Run the focused test and capture RED**

Run:

```bash
node --test tests/homepagePerformance.test.mjs
```

Expected: the test reports Home V4 selectors and global Home V9 Expo ownership.

- [ ] **Step 3: Move the live form wrapper into Home V9**

Change `HomeUpdatesForm.tsx` to:

```tsx
export function HomeUpdatesForm() {
  return (
    <div className="home-v9-updates-form">
      <TallyButton ctaLocation="home_newsletter" form="newsletter">
        Get Industry Updates
      </TallyButton>
    </div>
  );
}
```

Move only the live container/button declarations into `home.css`, updating hero and updates selectors to `home-v9-updates-form`.

- [ ] **Step 4: Move Home V9 Expo rules out of the global stylesheet**

Move the `.home-v9-expo-campaign*` base rules plus their 1020 px and 720 px responsive declarations from `app/globals.css` to `app/styles/home.css` without changing their values or cascade order within the homepage route.

- [ ] **Step 5: Delete the unreferenced Home V4 block**

Remove the complete block from `/* Home V4 */` through its closing 720 px media query. Confirm the next global rule remains the existing universal selector and that no surrounding WCB Expo or Phase 2 styles are removed.

- [ ] **Step 6: Run CSS and adjacent page tests until GREEN**

Run:

```bash
node --test tests/homepagePerformance.test.mjs tests/homepageStructure.test.mjs tests/expoConversion.test.mjs tests/contentExperience.test.mjs tests/siteVisualRefresh.test.mjs
```

Expected: all tests pass and `wc -c app/globals.css` is at least 14,000 bytes smaller than the 130,984-byte baseline.

- [ ] **Step 7: Commit the route-scoped CSS task**

```bash
git add app/globals.css app/styles/home.css components/HomeUpdatesForm.tsx tests/homepagePerformance.test.mjs tests/homepageStructure.test.mjs
git commit -m "Remove obsolete homepage CSS"
```

---

### Task 3: Verify rendering, budgets, and controlled performance

**Files:**
- Create: `docs/operations/wcb-home-pagespeed-report.md`
- Modify only if a failing gate proves a scoped defect: files already listed in Tasks 1–2 and their focused tests.

**Interfaces:**
- Consumes: completed Tasks 1–2, existing build gates, local production server, Lighthouse baseline JSON in `/private/tmp`.
- Produces: evidence-backed report with before/after medians, selected responsive resources, visual QA, build/test results, and remaining limitations.

- [ ] **Step 1: Run focused and full automated tests once on the final code tree**

Run focused homepage/adjacent tests first, then the repository suite:

```bash
node --test tests/homepagePerformance.test.mjs tests/homepageSeriesFeature.test.mjs tests/homepageStructure.test.mjs tests/expoConversion.test.mjs tests/contentExperience.test.mjs tests/siteVisualRefresh.test.mjs
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --import ./tests/register-path-alias.mjs --test tests/*.test.mjs
```

Expected: zero failures. Do not repeat a passing full suite without a material code or base change.

- [ ] **Step 2: Run the production build once**

```bash
npm run build
```

Expected: prebuild source verification, 646 static pages, and postbuild article-image verification all pass. Do not rerun a passing build unless a material implementation file changes afterward.

- [ ] **Step 3: Perform production-mode browser QA**

Start the built site on an unused local port. At desktop and 390 px verify the homepage returns 200, has exactly one H1/main, preserves canonical and OpenGraph metadata, has no horizontal overflow, and shows no visible image crop or form-layout regression.

Record for each targeted image: `currentSrc`, intrinsic dimensions, rendered dimensions, `loading`, and observed layout shift. Confirm the browser selects optimizer candidates rather than full originals for category, pathway, trust, avatar, Expo, and series consumers.

- [ ] **Step 4: Run three comparable Lighthouse passes per viewport**

Use the same Lighthouse 13 simulated-throttling configuration as the baseline. Save six JSON reports under `/private/tmp`, calculate medians for performance, FCP, LCP, TBT, CLS, Speed Index, transferred bytes, and request count.

Acceptance:

```text
mobile performance >= 80
desktop performance >= 95
mobile CLS = 0
mobile image transfer reduction >= 30%
no material TBT regression
```

If mobile remains below 80, do not add shared infrastructure changes. Document the remaining LCP trace and stop for review.

- [ ] **Step 5: Write the final report and run diff checks**

Create `docs/operations/wcb-home-pagespeed-report.md` with:

- exact baseline and final commit;
- the six run scores and medians;
- before/after image transfer and CSS bytes;
- test, build, and browser evidence;
- any PageSpeed Insights availability limitation;
- confirmation that article assets/manifests, copy, SEO, analytics, and conversion behavior did not change.

Run:

```bash
git diff --check origin/main...HEAD
git status --short
```

Expected: clean diff check and only intended files before the report commit.

- [ ] **Step 6: Commit the verified report**

```bash
git add docs/operations/wcb-home-pagespeed-report.md
git commit -m "Document homepage PageSpeed verification"
```

After the commit, report the verified result to the user. Do not push, merge, or deploy in this task.
