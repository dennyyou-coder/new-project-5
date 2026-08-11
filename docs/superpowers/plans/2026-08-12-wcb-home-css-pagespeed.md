# WCB Homepage CSS PageSpeed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove route-exclusive CSS from the homepage render path so the public mobile Lighthouse median reaches at least 80 without changing design, content, SEO, forms, analytics, or images.

**Architecture:** Keep root tokens, reset, shell, navigation, footer, shared buttons, forms, and lead-state primitives in `app/globals.css`. Move existing declarations, without value changes, into the CSS files imported only by WCB Expo, Blog, Reports, Sourcing, About, and Contact routes; split mixed selector lists by owner and lock the ownership graph with a Node source test.

**Tech Stack:** Next.js 15 App Router, React 19, CSS, Node.js test runner, Lighthouse 13.4.1, Playwright CLI.

## Global Constraints

- Do not change visible homepage design, copy, DOM behavior, SEO metadata, conversion behavior, forms, analytics, article content, or article images.
- Do not change dependencies, Next.js configuration, Vercel configuration, or deployment configuration.
- Preserve every moved CSS declaration value and its responsive breakpoint; only ownership, selector-list splitting, and proven dead-selector deletion are allowed.
- Main homepage CSS transfer must be at or below 13 KB in the comparable Lighthouse run.
- Public mobile Lighthouse three-run median must be at least 80; desktop must remain at least 95.
- CLS must remain 0, mobile TBT must remain at or below 25 ms, and mobile image transfer must remain at or below 120 KB.
- Production release must use GitHub `main` and the existing Vercel Git integration; never use `vercel --prod`.

---

### Task 1: Lock the CSS ownership and source budgets

**Files:**
- Create: `tests/homepageCssOwnership.test.mjs`
- Reference: `app/layout.tsx`
- Reference: `app/page.tsx`
- Reference: `app/globals.css`
- Reference: `app/styles/home.css`

**Interfaces:**
- Consumes: the repository source tree and CSS imports expressed as quoted relative paths.
- Produces: a Node test that prevents route-exclusive selectors from entering `app/globals.css`, verifies route imports, and caps root source CSS at 45,000 bytes.

- [ ] **Step 1: Write the failing ownership test**

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("homepage root CSS excludes route-owned selector families", () => {
  const globals = read("app/globals.css");
  assert.ok(Buffer.byteLength(globals) <= 45_000);
  assert.doesNotMatch(
    globals,
    /(?:^|\n)\.(?:wcb-expo|insights|blog-|sourcing|reports-library|contact-response|about-network)/m
  );
  assert.match(globals, /\.footer\s*\{/);
  assert.match(globals, /\.lead-form-status a\s*\{/);
});

test("each route imports the stylesheet that owns its visual system", () => {
  assert.match(read("app/page.tsx"), /import "\.\/styles\/home\.css"/);
  assert.match(read("app/wcb-expo/page.tsx"), /import "\.\.\/styles\/wcb-expo\.css"/);
  assert.match(read("app/reports/page.tsx"), /import "\.\.\/styles\/reports\.css"/);
  assert.match(read("app/blog/layout.tsx"), /content-directories\.css/);
  assert.match(read("app/sourcing/layout.tsx"), /sourcing\.css/);
});

test("route styles retain representative moved declarations", () => {
  assert.match(read("app/styles/wcb-expo.css"), /\.wcb-expo-page\s*\{/);
  assert.match(read("app/styles/reports.css"), /\.reports-library-page\s*\{/);
  assert.match(read("app/styles/content-directories.css"), /\.blog-editorial-intro\s*\{/);
  assert.match(read("app/styles/sourcing.css"), /\.sourcing-v4-page\s*\{/);
  assert.match(read("app/styles/trust.css"), /\.contact-response-layout\s*\{/);
  assert.match(read("app/styles/home.css"), /\.home-v9-pathway-grid article\s*\{/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/homepageCssOwnership.test.mjs`

Expected: FAIL because `app/globals.css` is 113,933 bytes, route prefixes are present, route-owned files/imports do not yet exist, and the footer is not in the root stylesheet.

- [ ] **Step 3: Commit the RED contract**

```bash
git add tests/homepageCssOwnership.test.mjs
git commit -m "test: lock homepage CSS ownership"
```

---

### Task 2: Isolate WCB Expo and Reports visual systems

**Files:**
- Create: `app/styles/wcb-expo.css`
- Create: `app/styles/reports.css`
- Modify: `app/wcb-expo/page.tsx:1-4`
- Modify: `app/reports/page.tsx:1-4`
- Modify: `app/globals.css:29-732,4597-5118`
- Test: `tests/homepageCssOwnership.test.mjs`

**Interfaces:**
- Consumes: existing `.wcb-expo-*` and `.reports-library-*` declaration blocks from `app/globals.css`.
- Produces: route-owned styles imported directly by `/wcb-expo` and `/reports`; no declaration remains in the root graph.

- [ ] **Step 1: Move the WCB Expo block byte-for-byte**

Create `app/styles/wcb-expo.css` from the complete `/* 2026 WCB Expo visitor campaign */` block, including its `1020px` and `720px` media queries. Remove that block from `app/globals.css`, then add after the existing imports in `app/wcb-expo/page.tsx`:

```ts
import "../styles/wcb-expo.css";
```

- [ ] **Step 2: Move the Reports library block byte-for-byte**

Create `app/styles/reports.css` from `.reports-library-page` through the Reports media-query rules immediately before `.sourcing-v4-page`. Remove those rules from `app/globals.css`, then add after the metadata import in `app/reports/page.tsx`:

```ts
import "../styles/reports.css";
```

- [ ] **Step 3: Prove the route imports and declarations are present**

Run: `node --test tests/homepageCssOwnership.test.mjs`

Expected: the route-import assertion and WCB Expo/Reports representative assertions pass; the overall file remains RED because Blog, Sourcing, Contact, phase-two mixed selectors, and the source-size budget are not finished.

- [ ] **Step 4: Check for accidental declaration duplication**

Run:

```bash
rg -n "^\.wcb-expo-page|^\.reports-library-page" app/globals.css app/styles/*.css
```

Expected: each selector appears exactly once, in its route-owned file.

- [ ] **Step 5: Commit the isolated route styles**

```bash
git add app/globals.css app/styles/wcb-expo.css app/styles/reports.css app/wcb-expo/page.tsx app/reports/page.tsx tests/homepageCssOwnership.test.mjs
git commit -m "Move Expo and Reports CSS out of homepage"
```

---

### Task 3: Move Blog and Sourcing systems out of the root graph

**Files:**
- Modify: `app/globals.css:2081-4467,5119-5436,5866-5972`
- Modify: `app/styles/content-directories.css`
- Modify: `app/styles/article.css`
- Modify: `app/styles/sourcing.css`
- Test: `tests/homepageCssOwnership.test.mjs`
- Test: `tests/contentExperience.test.mjs`

**Interfaces:**
- Consumes: the existing Blog/Insights/Archive and Sourcing declarations plus the existing Blog and Sourcing layout imports.
- Produces: Blog directory declarations in `content-directories.css`, article-only declarations in `article.css`, and all `.sourcing-*` declarations in `sourcing.css`.

- [ ] **Step 1: Move the contiguous Blog/Insights directory system**

Move the root block beginning with `.article-grid` and ending immediately before `.sourcing-lead h2` to the end of `app/styles/content-directories.css`. Keep `.insights-page-container` in `app/globals.css` because Equipment pages also consume that shared container. Preserve rule order and all media queries.

- [ ] **Step 2: Split the content-experience additions by consumer**

Move these selectors and their responsive rules to `content-directories.css`:

```text
.blog-editorial-*
.insights-*
.blog-archive-*
.archive-category-summary
```

Move these selectors and their responsive rules to `article.css`:

```text
.blog-visible-breadcrumb
.signal-detail-author
.blog-article-main table
.blog-author-bio-box
.related-signal-card
.related-signal-image
```

- [ ] **Step 3: Move both Sourcing generations into the Sourcing route file**

Move the complete root blocks beginning with `.sourcing-lead h2` and `.sourcing-v4-page`, including their media queries and final `.sourcing-v4-page button.sourcing-v3-button` rule, to the end of `app/styles/sourcing.css` in their original order.

- [ ] **Step 4: Run Blog and ownership tests**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --import ./tests/register-path-alias.mjs --test tests/contentExperience.test.mjs tests/homepageCssOwnership.test.mjs
```

Expected: Blog route graph tests remain PASS; the ownership test may remain RED only for Contact/phase-two/shared-footer work.

- [ ] **Step 5: Commit Blog and Sourcing ownership**

```bash
git add app/globals.css app/styles/article.css app/styles/content-directories.css app/styles/sourcing.css tests/contentExperience.test.mjs tests/homepageCssOwnership.test.mjs
git commit -m "Route-scope Blog and Sourcing CSS"
```

---

### Task 4: Split mixed alignment rules and restore shared root primitives

**Files:**
- Modify: `app/globals.css:4468-4596,5437-5865`
- Modify: `app/styles/home.css`
- Modify: `app/styles/about.css`
- Modify: `app/styles/reports.css`
- Modify: `app/styles/sourcing.css`
- Modify: `app/styles/trust.css`
- Modify: `app/styles/content-directories.css:451-715`
- Test: `tests/homepageCssOwnership.test.mjs`
- Test: `tests/homepageStructure.test.mjs`

**Interfaces:**
- Consumes: mixed phase-two selector lists, Contact-specific rules, and shared Footer/form rules that currently live only in the Blog stylesheet.
- Produces: one owner for each selector and a root stylesheet that styles root-layout UI on every route.

- [ ] **Step 1: Split phase-two mixed selector lists by route**

For each declaration group under `/* Phase 2 visual alignment */`, preserve the declaration body and append only the matching selectors to:

```text
home-v9-* -> app/styles/home.css
about-network-* -> app/styles/about.css
reports-library-* -> app/styles/reports.css
sourcing-opportunity-* -> app/styles/sourcing.css
contact-response-* -> app/styles/trust.css
```

Search `app/` and `components/` for `.expo-track-*`, `.expo-path-*`, `.expo-visual-*`, and `.expo-organizer-*`. Delete those selector branches only when the search returns no production reference. Keep `.lead-form-status a` and `.lead-form-expectation` in `app/globals.css`.

- [ ] **Step 2: Move Contact-only declarations to the Contact/Trust stylesheet**

Move `.contact-help-*`, `.contact-response-*`, `.contact-context-*`, and the Contact branches of mixed product/contact rules from `app/globals.css` to `app/styles/trust.css`. Split `.sourcing-*` branches into `sourcing.css` instead of duplicating the complete mixed rule.

- [ ] **Step 3: Restore Footer and generic form styling to the root layout**

Move the complete `.footer-link-button`, `.form`, `.form-status`, `.footer`, `.footer-grid`, `.footer-brand`, `.footer-slogan`, `.footer-bottom`, and `.footer-links` rules plus their responsive rules from `content-directories.css` to `app/globals.css`. These classes are rendered by the root `Footer` on every route and must have exactly one owner.

- [ ] **Step 4: Run the ownership test and verify GREEN**

Run: `node --test tests/homepageCssOwnership.test.mjs`

Expected: PASS; `app/globals.css` is at most 45,000 bytes, contains Footer and lead-state rules, and contains none of the forbidden route prefixes.

- [ ] **Step 5: Run focused adjacent regression tests**

Run:

```bash
npm run test:homepage
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --import ./tests/register-path-alias.mjs --test tests/contentExperience.test.mjs tests/inquiryConversion.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 6: Commit the ownership split**

```bash
git add app/globals.css app/styles/about.css app/styles/content-directories.css app/styles/home.css app/styles/reports.css app/styles/sourcing.css app/styles/trust.css tests/homepageCssOwnership.test.mjs
git commit -m "Complete homepage CSS ownership split"
```

---

### Task 5: Integrate upstream and run one final verification pass

**Files:**
- Modify only if required by a real upstream conflict: files already listed in Tasks 1-4.
- Generate (untracked): `.next/` build output and temporary Lighthouse/browser evidence.

**Interfaces:**
- Consumes: the complete CSS split and the latest `origin/main`.
- Produces: final test/build/browser/Lighthouse evidence for the exact release tree.

- [ ] **Step 1: Refresh and integrate the latest main branch**

Run:

```bash
git fetch origin main
git merge --no-edit origin/main
```

Expected: clean merge or conflicts limited to the files named in this plan. If a conflict touches unrelated content or generated image state, stop rather than overwrite it.

- [ ] **Step 2: Run the complete Node suite once**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --import ./tests/register-path-alias.mjs --test tests/*.test.mjs
```

Expected: all tests PASS with zero failures.

- [ ] **Step 3: Build production once**

Run: `npm run build`

Expected: Next.js build, content classification, source article-image verifier, all static pages, and built article-image verifier PASS.

- [ ] **Step 4: Measure the built homepage CSS graph**

Read the stylesheet URLs from `.next/server/app/index.html`, sum their file sizes under `.next/static/css`, and verify the root/main stylesheet transfer budget is represented by a built file no larger than the design target in the comparable Lighthouse run. Confirm `.wcb-expo-page`, `.reports-library-page`, `.sourcing-v4-page`, and `.blog-editorial-intro` do not occur in homepage-loaded CSS files.

- [ ] **Step 5: Run production-mode browser QA**

Start the already-built app on an unused local port. At 1440×1100 and 390×844, check `/`, `/wcb-expo`, `/blog`, one current `/blog/{slug}`, `/reports`, and `/sourcing` for HTTP 200, one H1, one main landmark, no horizontal overflow, and observed CLS 0. For `/`, verify canonical `https://worldcleanbiz.com`, unchanged OpenGraph image, intact header/footer, and unchanged hero/form geometry.

- [ ] **Step 6: Run three Lighthouse passes per viewport**

Use Lighthouse 13.4.1 with the same simulated-throttling profile as phase one. Report mobile and desktop medians for score, FCP, LCP, TBT, CLS, Speed Index, total transfer, image transfer, CSS transfer, and request count.

Expected local/pre-release gates: main CSS transfer at or below 13 KB; desktop at least 95; CLS 0; mobile TBT at or below 25 ms; mobile image transfer at or below 120 KB. The public mobile median of at least 80 is confirmed after release.

---

### Task 6: Document evidence and prepare the normal GitHub/Vercel release

**Files:**
- Modify: `docs/operations/wcb-home-pagespeed-report.md`
- Create: `docs/operations/wcb-home-css-pagespeed-report.md`
- Modify: `docs/superpowers/plans/2026-08-12-wcb-home-css-pagespeed.md`

**Interfaces:**
- Consumes: exact final tree, measurements, test totals, and browser evidence.
- Produces: an auditable report and a clean feature branch ready for push/Preview.

- [ ] **Step 1: Record exact before/after evidence**

Document source and built CSS sizes, the complete test total, build page count, six-route browser results, Lighthouse run table and medians, unchanged analytics/content/image boundaries, and any remaining non-blocking opportunity.

- [ ] **Step 2: Run final scope and whitespace checks**

Run:

```bash
git diff --check origin/main...HEAD
git diff --name-status origin/main...HEAD
git status --short
```

Expected: no whitespace errors; every changed file belongs to this plan; no article, image, manifest, analytics, dependency, or deployment-config change.

- [ ] **Step 3: Commit the final verification record**

```bash
git add docs/operations/wcb-home-pagespeed-report.md docs/operations/wcb-home-css-pagespeed-report.md docs/superpowers/plans/2026-08-12-wcb-home-css-pagespeed.md
git commit -m "Document homepage CSS PageSpeed verification"
```

- [ ] **Step 4: Push, create one PR, and use the Git-triggered Vercel Preview**

Push `codex/wcb-home-css-pagespeed`, create one ready-for-review pull request, wait for Vercel Preview `READY`, and verify that the Preview commit equals the branch head. Do not deploy production directly.

- [ ] **Step 5: Request the single production approval**

Present the exact commit, local/Preview gates, Lighthouse medians, and remaining risk. After approval, merge the PR into GitHub `main`, wait for Git-triggered Vercel production, verify the deployed commit and public route, then repeat the three-run public Lighthouse median that determines the mobile-80 acceptance.
