# WCB Blog Conversion And SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Blog and article traffic into correctly attributed Sourcing, Reports, Expo, or Newsletter leads while fixing Blog SEO and preserving every approved article and the homepage.

**Architecture:** Add a pure category-to-CTA mapping in `lib/`, render it through one Blog-only client component, and extend the existing analytics contract with Blog CTA context. Keep the existing Tally registry and popup behavior as the form transport; the Blog layer supplies stable CTA metadata without changing Header, Footer, homepage content, or article source files.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tally popup embed, GA4 `gtag.js`, Node.js built-in test runner.

## Global Constraints

- Modify only `/blog`, `/blog/[slug]`, Blog-only CTA/tracking modules, their styles, tests, and documentation.
- Do not modify homepage content or layout, shared Header/Footer, article bodies, article titles, article slugs, frontmatter, or approved article images.
- Use existing form keys: `sourcing`, `reports`, `expo`, and `newsletter`; do not reuse Reports as a Newsletter substitute.
- Do not emit `form_success` from a click or popup open. Preserve the existing verified Tally `onSubmit` callback behavior and verify it in Preview.
- Use `/images/industry/about-forum-stage-2025.jpg` as the Blog social image; do not create or download new assets in this batch.
- Do not add dependencies.
- Do not use `vercel --prod`.
- Every production-code task must pass its focused test, `npm run test:lead`, `npm run test:homepage`, and `npm run build` before commit.
- Stop before merging to `main`; Preview requires explicit user approval.

## File Map

- Create `lib/blogConversion.ts`: pure CTA mapping, copy, analytics context types, and stable fallback behavior.
- Create `components/BlogConversionCta.tsx`: Blog-only client CTA, view/click tracking, and existing Tally button dispatch.
- Modify `lib/leadTracking.ts`: accept `cta_view` and `cta_click` plus optional Blog context.
- Modify `app/blog/page.tsx`: correct metadata and keep Newsletter as the primary Blog conversion.
- Modify `app/blog/[slug]/page.tsx`: replace the two generic footer buttons with the mapped Blog CTA.
- Modify `app/globals.css`: style the single Blog CTA and its 390px layout without changing homepage selectors.
- Create `tests/blogConversion.test.mjs`: mapping, SEO source, article integration, Newsletter separation, and homepage isolation checks.
- Modify `package.json`: add `test:blog` and ensure the existing homepage regression command is available.
- Create `docs/operations/wcb-blog-preview-checklist.md`: exact Preview checks and evidence fields.

---

### Task 1: Add The Pure Article CTA Mapping

**Files:**
- Create: `lib/blogConversion.ts`
- Create: `tests/blogConversion.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `category: string`, `slug: string`.
- Produces: `BlogCtaType`, `BlogCtaDefinition`, `getBlogCta(category)`, and `createBlogCtaContext({ category, slug, location })`.

- [ ] **Step 1: Add the failing mapping tests**

Create `tests/blogConversion.test.mjs` with these initial tests:

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  createBlogCtaContext,
  getBlogCta
} from "../lib/blogConversion.ts";

test("maps buying content to sourcing", () => {
  for (const category of ["Buyer Guide", "Sourcing Guide", "Sourcing"]) {
    assert.equal(getBlogCta(category).type, "sourcing");
  }
});

test("maps market content to reports", () => {
  for (const category of [
    "Market Signals",
    "Industry",
    "Supply Chain",
    "Supply Chain Analysis",
    "Commercial Cleaning"
  ]) {
    assert.equal(getBlogCta(category).type, "reports");
  }
});

test("maps trade shows to expo and unknown categories to newsletter", () => {
  assert.equal(getBlogCta("Trade Shows").type, "expo");
  assert.equal(getBlogCta("Floorcare").type, "newsletter");
});

test("creates stable article analytics context", () => {
  assert.deepEqual(
    createBlogCtaContext({
      category: "Buyer Guide",
      slug: "robot-vacuum-guide",
      location: "article_footer"
    }),
    {
      article_category: "Buyer Guide",
      article_slug: "robot-vacuum-guide",
      cta_location: "article_footer",
      cta_type: "sourcing"
    }
  );
});
```

Add this script to `package.json`:

```json
"test:blog": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/blogConversion.test.mjs"
```

If `test:homepage` is absent, add:

```json
"test:homepage": "node --test tests/homepageStructure.test.mjs"
```

- [ ] **Step 2: Verify the tests fail for the missing module**

Run:

```bash
npm run test:blog
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `lib/blogConversion.ts`.

- [ ] **Step 3: Implement the mapping**

Create `lib/blogConversion.ts`:

```ts
export type BlogCtaType = "sourcing" | "reports" | "expo" | "newsletter";

export type BlogCtaDefinition = {
  type: BlogCtaType;
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  form: "sourcing" | "reports" | "expo" | "newsletter";
  reportId?: string;
};

const CTA_BY_TYPE: Record<BlogCtaType, BlogCtaDefinition> = {
  sourcing: {
    type: "sourcing",
    eyebrow: "Sourcing Support",
    title: "Turn Product Research Into A Qualified Supplier Brief",
    description: "Share your category, target market and supplier requirements with World Clean Biz.",
    buttonLabel: "Start A Sourcing Inquiry",
    form: "sourcing"
  },
  reports: {
    type: "reports",
    eyebrow: "Market Intelligence",
    title: "Continue With The World Clean Biz Industry Report",
    description: "Get the current report on cleaning industry growth, categories and supplier signals.",
    buttonLabel: "Get The Report",
    form: "reports",
    reportId: "next-decade-cleaning-growth"
  },
  expo: {
    type: "expo",
    eyebrow: "World Clean Expo",
    title: "Follow The Next Cleaning Industry Platform",
    description: "Receive visitor registration, exhibitor, forum and business matching updates.",
    buttonLabel: "Get Expo Updates",
    form: "expo"
  },
  newsletter: {
    type: "newsletter",
    eyebrow: "Blog Updates",
    title: "Get New Cleaning Industry Articles First",
    description: "Receive new articles, market signals and industry notes when they are published.",
    buttonLabel: "Subscribe To Blog Updates",
    form: "newsletter"
  }
};

const SOURCING_CATEGORIES = new Set(["Buyer Guide", "Sourcing Guide", "Sourcing"]);
const REPORT_CATEGORIES = new Set([
  "Market Signals",
  "Industry",
  "Supply Chain",
  "Supply Chain Analysis",
  "Commercial Cleaning"
]);

export function getBlogCta(category: string): BlogCtaDefinition {
  if (SOURCING_CATEGORIES.has(category)) return CTA_BY_TYPE.sourcing;
  if (REPORT_CATEGORIES.has(category)) return CTA_BY_TYPE.reports;
  if (category === "Trade Shows") return CTA_BY_TYPE.expo;
  return CTA_BY_TYPE.newsletter;
}

export function createBlogCtaContext({
  category,
  slug,
  location
}: {
  category: string;
  slug: string;
  location: string;
}) {
  return {
    article_category: category,
    article_slug: slug,
    cta_location: location,
    cta_type: getBlogCta(category).type
  };
}
```

- [ ] **Step 4: Run focused and regression tests**

Run:

```bash
npm run test:blog
npm run test:lead
npm run test:homepage
npm run build
```

Expected: all tests PASS and the production build generates all Blog routes.

- [ ] **Step 5: Commit the mapping**

```bash
git add lib/blogConversion.ts tests/blogConversion.test.mjs package.json
git commit -m "feat: map article categories to conversion intents"
```

---

### Task 2: Extend Analytics And Render The Blog-Only CTA

**Files:**
- Modify: `lib/leadTracking.ts`
- Create: `components/BlogConversionCta.tsx`
- Modify: `components/LeadForms.tsx`
- Modify: `tests/leadTracking.test.mjs`
- Modify: `tests/blogConversion.test.mjs`

**Interfaces:**
- Consumes: `category`, `slug`, `location`, existing `TallyButton`.
- Produces: `BlogConversionCta({ category, slug, location })` and GA4 events with `cta_type`, `article_slug`, and `article_category`.

- [ ] **Step 1: Add failing analytics-contract tests**

Extend `tests/leadTracking.test.mjs` to assert `trackLeadEvent` accepts Blog CTA events in a simulated browser:

```js
test("trackLeadEvent sends article CTA context to GA4", () => {
  const calls = [];
  global.window = { gtag: (...args) => calls.push(args) };

  assert.equal(
    trackLeadEvent("cta_click", {
      form_type: "sourcing",
      source_page: "/blog/example",
      cta_location: "article_footer",
      language: "en",
      cta_type: "sourcing",
      article_slug: "example",
      article_category: "Buyer Guide"
    }),
    true
  );
  assert.equal(calls[0][1], "cta_click");
  assert.equal(calls[0][2].article_slug, "example");
  delete global.window;
});
```

Extend `tests/blogConversion.test.mjs` to read `components/BlogConversionCta.tsx` and assert it contains `cta_view`, `cta_click`, `TallyButton`, and no hard-coded article category branches.

- [ ] **Step 2: Verify the new tests fail**

Run:

```bash
npm run test:lead
npm run test:blog
```

Expected: FAIL because `cta_click` is not a valid `LeadEventName` and the component does not exist.

- [ ] **Step 3: Extend the typed analytics contract**

In `lib/leadTracking.ts`:

```ts
export type LeadEventName =
  | "cta_view"
  | "cta_click"
  | "form_open"
  | "form_submit"
  | "form_success"
  | "form_error";
```

Add these optional fields to `LeadEventParameters`:

```ts
cta_type?: string;
article_slug?: string;
article_category?: string;
```

- [ ] **Step 4: Allow Blog context to flow through the existing Tally button**

Add an optional `eventContext` property to `TallyButton` and pass it into every `trackLeadEvent` call without changing existing callers:

```ts
eventContext?: {
  cta_type?: string;
  article_slug?: string;
  article_category?: string;
};
```

Each existing event payload becomes:

```ts
trackLeadEvent("form_open", {
  ...attribution,
  ...eventContext,
  open_method: "popup"
});
```

Apply the same merge to `form_submit`, `form_success`, `form_error`, and fallback `form_open`. Existing Header, homepage, Footer, and page callers must compile unchanged.

- [ ] **Step 5: Create the Blog-only client CTA**

Create `components/BlogConversionCta.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { TallyButton } from "@/components/LeadForms";
import { createBlogCtaContext, getBlogCta } from "@/lib/blogConversion";
import { trackLeadEvent } from "@/lib/leadTracking";

export function BlogConversionCta({
  category,
  slug,
  location = "article_footer"
}: {
  category: string;
  slug: string;
  location?: string;
}) {
  const cta = getBlogCta(category);
  const context = createBlogCtaContext({ category, slug, location });
  const baseEvent = {
    form_type: cta.form === "expo" ? "wce_visitor" : cta.form,
    source_page: `/blog/${slug}`,
    cta_location: location,
    language: "en",
    ...context
  } as const;

  useEffect(() => {
    trackLeadEvent("cta_view", baseEvent);
  }, [category, location, slug]);

  return (
    <aside className={`blog-conversion-cta blog-conversion-cta-${cta.type}`} aria-labelledby="blog-conversion-title">
      <div>
        <p className="eyebrow">{cta.eyebrow}</p>
        <h2 id="blog-conversion-title">{cta.title}</h2>
        <p>{cta.description}</p>
      </div>
      <TallyButton
        className="button"
        ctaLocation={location}
        eventContext={context}
        form={cta.form}
        onClickTrack={() => trackLeadEvent("cta_click", baseEvent)}
        reportId={cta.reportId}
      >
        {cta.buttonLabel}
      </TallyButton>
    </aside>
  );
}
```

Add optional `onClickTrack?: () => void` to `TallyButton`; call it as the first line of `openTallyForm()`. This keeps click measurement separate from Tally's verified `onOpen` and `onSubmit` callbacks.

- [ ] **Step 6: Run focused and regression tests**

```bash
npm run test:lead
npm run test:blog
npm run test:homepage
npm run build
```

Expected: all commands PASS; existing callers remain type-safe and homepage tests remain unchanged.

- [ ] **Step 7: Commit the analytics and component layer**

```bash
git add lib/leadTracking.ts components/LeadForms.tsx components/BlogConversionCta.tsx tests/leadTracking.test.mjs tests/blogConversion.test.mjs
git commit -m "feat: track and render blog conversion actions"
```

---

### Task 3: Integrate The CTA And Correct Blog SEO

**Files:**
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/blogConversion.test.mjs`

**Interfaces:**
- Consumes: `BlogConversionCta`, current `article.category`, current `article.slug`, existing `NewsletterLeadForm`.
- Produces: one intent-matched article CTA, separated Blog Newsletter CTA, and correct Blog social metadata.

- [ ] **Step 1: Add failing source-integration tests**

Extend `tests/blogConversion.test.mjs` with source checks:

```js
import { readFile } from "node:fs/promises";

const blogSource = await readFile(new URL("../app/blog/page.tsx", import.meta.url), "utf8");
const articleSource = await readFile(new URL("../app/blog/[slug]/page.tsx", import.meta.url), "utf8");
const homeSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("Blog metadata relies on the root title template exactly once", () => {
  assert.match(blogSource, /title: "Blog"/);
  assert.doesNotMatch(blogSource, /title: "Blog \| World Clean Biz"/);
  assert.match(blogSource, /openGraph:/);
  assert.match(blogSource, /\/images\/industry\/about-forum-stage-2025\.jpg/);
});

test("article footer uses one mapped conversion CTA", () => {
  assert.match(articleSource, /<BlogConversionCta/);
  assert.match(articleSource, /category=\{article\.category\}/);
  assert.match(articleSource, /slug=\{article\.slug\}/);
  assert.doesNotMatch(articleSource, /article_footer_contact/);
  assert.doesNotMatch(articleSource, />Get Free Reports</);
});

test("Blog keeps a dedicated Newsletter form and homepage stays outside this batch", () => {
  assert.match(blogSource, /<NewsletterLeadForm \/>/);
  assert.doesNotMatch(homeSource, /BlogConversionCta/);
});
```

- [ ] **Step 2: Verify the integration tests fail**

Run `npm run test:blog`.

Expected: FAIL on the old Blog title and generic article footer buttons.

- [ ] **Step 3: Correct Blog metadata**

In `app/blog/page.tsx`, change the metadata title to `Blog` and add:

```ts
openGraph: {
  title: "World Clean Biz Blog",
  description:
    "Cleaning appliance analysis, brand strategy, supplier intelligence and global market observations.",
  type: "website",
  url: "/blog",
  images: ["/images/industry/about-forum-stage-2025.jpg"]
},
twitter: {
  card: "summary_large_image",
  title: "World Clean Biz Blog",
  description:
    "Cleaning appliance analysis, brand strategy, supplier intelligence and global market observations.",
  images: ["/images/industry/about-forum-stage-2025.jpg"]
}
```

Keep the existing canonical and query-parameter `noindex, follow` logic unchanged.

- [ ] **Step 4: Replace the generic article footer**

In `app/blog/[slug]/page.tsx`, remove unused `TallyButton` and `TallyReportButton` imports, import `BlogConversionCta`, and replace `.blog-article-footer-cta` with:

```tsx
<BlogConversionCta
  category={article.category}
  location="article_footer"
  slug={article.slug}
/>
```

- [ ] **Step 5: Add scoped responsive styles**

Add Blog-only rules to `app/globals.css`:

```css
.blog-conversion-cta {
  align-items: center;
  background: #0f2747;
  color: #fff;
  display: grid;
  gap: 32px;
  grid-template-columns: minmax(0, 1fr) auto;
  margin-top: 48px;
  padding: 36px;
}

.blog-conversion-cta h2,
.blog-conversion-cta p {
  margin: 0;
}

.blog-conversion-cta h2 {
  font-size: clamp(26px, 3vw, 36px);
  margin-top: 8px;
}

.blog-conversion-cta > div > p:last-child {
  color: rgba(255, 255, 255, 0.78);
  margin-top: 12px;
  max-width: 680px;
}

@media (max-width: 640px) {
  .blog-conversion-cta {
    align-items: stretch;
    grid-template-columns: minmax(0, 1fr);
    padding: 24px;
  }

  .blog-conversion-cta .lead-form-trigger,
  .blog-conversion-cta button {
    width: 100%;
  }
}
```

If the existing design tokens use a different exact blue or spacing value, use the closest existing Blog token while preserving selector scope and layout behavior.

- [ ] **Step 6: Run all automated checks**

```bash
npm run test:blog
npm run test:lead
npm run test:homepage
npm run build
git diff --check
```

Expected: all tests and build PASS; no whitespace errors; all article routes generate.

- [ ] **Step 7: Commit the page integration**

```bash
git add app/blog/page.tsx 'app/blog/[slug]/page.tsx' app/globals.css tests/blogConversion.test.mjs
git commit -m "feat: align blog seo and article conversion paths"
```

---

### Task 4: Verify Preview Readiness And Record Evidence

**Files:**
- Create: `docs/operations/wcb-blog-preview-checklist.md`
- Modify only if verification finds an in-scope defect: files from Tasks 1–3.

**Interfaces:**
- Consumes: built Blog routes, Tally configuration, GA4 DebugView, desktop and 390px rendered pages.
- Produces: a reproducible verification record and a feature branch ready for GitHub/Vercel Preview.

- [ ] **Step 1: Create the verification record**

Create `docs/operations/wcb-blog-preview-checklist.md` with:

```md
# WCB Blog Preview Verification

## Build
- [ ] `npm run test:blog`
- [ ] `npm run test:lead`
- [ ] `npm run test:homepage`
- [ ] `npm run build`

## Routes And SEO
- [ ] `/blog` title has one World Clean Biz suffix
- [ ] `/blog` canonical is `https://worldcleanbiz.com/blog`
- [ ] query-filtered Blog page is `noindex, follow`
- [ ] Blog Open Graph and Twitter image returns 200
- [ ] article canonical and BlogPosting/Breadcrumb/FAQ JSON-LD remain valid

## CTA Samples
- [ ] Buyer Guide or Sourcing Guide → Sourcing
- [ ] Market Signals or Industry → Reports
- [ ] Trade Shows → Expo
- [ ] Floorcare or another fallback category → Newsletter

## Analytics
- [ ] `cta_view` appears once per tested article load
- [ ] `cta_click` contains type, location, slug and category
- [ ] `form_open` preserves the same Blog context
- [ ] `form_success` appears only after an actual Tally submission callback
- [ ] missing Newsletter form produces a visible unavailable state and blocks release

## Responsive And Accessibility
- [ ] Desktop Blog and article screenshots accepted
- [ ] 390px Blog and article screenshots accepted
- [ ] no horizontal overflow
- [ ] filter, pagination and CTA work with keyboard
- [ ] focus indicator is visible
- [ ] article image, table and long-link containment checked

## Regression
- [ ] homepage content, layout and CTA behavior unchanged
- [ ] Header and Footer unchanged
- [ ] no article body, title, slug, frontmatter or approved image changed
```

- [ ] **Step 2: Run the final local automated gate**

```bash
npm run test:blog && npm run test:lead && npm run test:homepage && npm run build && git diff --check
```

Expected: exit code 0 for every command.

- [ ] **Step 3: Run local rendered checks**

Start `npm run dev`, then inspect `/blog` and one article for each of the four CTA types at desktop width and 390px. Verify console errors, broken images, horizontal overflow, keyboard focus, Tally fallback, and that the homepage is visually unchanged. Do not submit a real form during this local step.

- [ ] **Step 4: Record exact results and commit**

Fill the checklist with date, tested URLs, viewport sizes, event parameters, and any named blocker. Then run:

```bash
git add docs/operations/wcb-blog-preview-checklist.md
git commit -m "docs: add blog preview verification checklist"
```

- [ ] **Step 5: Push only the feature branch**

```bash
git status --short --branch
git log --oneline origin/main..HEAD
git push -u origin codex/blog-conversion-seo
```

Expected: clean worktree and GitHub branch updated. Obtain the Vercel Preview URL; do not merge to `main`.

- [ ] **Step 6: Verify Vercel Preview and stop for approval**

On Preview, repeat the checklist with real GA4 DebugView and, only with action-time approval, one controlled test submission per relevant form. If `NEXT_PUBLIC_TALLY_NEWSLETTER_FORM_ID` is missing or the Newsletter form is not operational, report the blocker and do not request production approval.

Return the Preview URL, modified-file list, automated results, screenshots, event evidence, form evidence, and remaining issues. Wait for explicit user confirmation before any merge to `main`.
