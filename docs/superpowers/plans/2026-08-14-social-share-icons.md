# Social Share Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace article sharing text marks with recognizable vector icons on desktop and mobile without changing sharing behavior or accessibility.

**Architecture:** Add one typed icon registry backed by `react-icons`, verify every registry entry by rendering the real icon component to static SVG markup, and consume the registry from the existing client component. Existing link generation, copy handling, native sharing, responsive breakpoints, and accessible names remain unchanged.

**Tech Stack:** Next.js 15, React 19, TypeScript, Node test runner, `react-icons` 5.7.0, existing CSS.

## Global Constraints

- Desktop share controls remain icon-only inside 44 by 44 pixel circles.
- Mobile share controls remain icon plus visible text.
- LinkedIn, X, Facebook, WhatsApp, copy, and native share must each use a recognizable vector icon.
- Decorative SVGs must use `aria-hidden="true"` and `focusable="false"`.
- Existing hover, high-contrast focus, reduced-motion, status announcement, sharing URL, and copy behavior must not change.
- Do not modify article content, recommendation logic, navigation, homepage, CTA, images, analytics, or deployment configuration.
- Publish only through the established GitHub PR and Git-triggered Vercel flow; do not use direct production CLI deployment.

---

### Task 1: Add the tested icon registry and update the share component

**Files:**
- Create: `lib/articleShareIcons.ts`
- Modify: `components/ArticleShareActions.tsx`
- Modify: `app/styles/article.css`
- Modify: `tests/articleSharing.test.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: `ArticleShareLink["id"]` from `lib/articleSharing.ts`.
- Produces: `ARTICLE_SHARE_ICONS: Record<ArticleShareLink["id"], IconType>`, `ARTICLE_COPY_ICON: IconType`, and `ARTICLE_NATIVE_SHARE_ICON: IconType`.

- [ ] **Step 1: Write the failing real-render test**

Add imports for React static rendering and the wished-for registry to `tests/articleSharing.test.mjs`:

```js
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ARTICLE_COPY_ICON,
  ARTICLE_NATIVE_SHARE_ICON,
  ARTICLE_SHARE_ICONS
} from "../lib/articleShareIcons.ts";
```

Add this test:

```js
test("article share actions use six distinct accessible vector icons", () => {
  assert.deepEqual(Object.keys(ARTICLE_SHARE_ICONS), [
    "linkedin",
    "x",
    "facebook",
    "whatsapp"
  ]);

  const icons = [
    ...Object.values(ARTICLE_SHARE_ICONS),
    ARTICLE_COPY_ICON,
    ARTICLE_NATIVE_SHARE_ICON
  ];

  assert.equal(new Set(icons).size, 6);
  for (const Icon of icons) {
    const markup = renderToStaticMarkup(
      createElement(Icon, { "aria-hidden": "true", focusable: "false" })
    );
    assert.match(markup, /^<svg/);
    assert.match(markup, /aria-hidden="true"/);
    assert.match(markup, /focusable="false"/);
  }
});
```

This catches a missing action, duplicate icon assignment, non-SVG fallback, or loss of the decorative accessibility attributes.

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/articleSharing.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `lib/articleShareIcons.ts`.

- [ ] **Step 3: Install the approved pinned dependency**

Run:

```bash
npm install react-icons@5.7.0 --save-exact --registry=https://registry.npmjs.org
```

Expected: `package.json` contains `"react-icons": "5.7.0"` and the lockfile records the same package version.

- [ ] **Step 4: Implement the minimal typed icon registry**

Create `lib/articleShareIcons.ts`:

```ts
import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter
} from "react-icons/fa6";
import { FiCopy, FiShare2 } from "react-icons/fi";
import type { ArticleShareLink } from "@/lib/articleSharing";

export const ARTICLE_SHARE_ICONS: Record<ArticleShareLink["id"], IconType> = {
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  facebook: FaFacebookF,
  whatsapp: FaWhatsapp
};

export const ARTICLE_COPY_ICON: IconType = FiCopy;
export const ARTICLE_NATIVE_SHARE_ICON: IconType = FiShare2;
```

- [ ] **Step 5: Verify the registry test reaches GREEN**

Run the focused test command from Step 2.

Expected: all article-sharing tests pass, including the six-icon real-render test.

- [ ] **Step 6: Replace temporary marks in the real component**

In `components/ArticleShareActions.tsx`, remove `SHARE_MARKS` and import the registry:

```tsx
import {
  ARTICLE_COPY_ICON,
  ARTICLE_NATIVE_SHARE_ICON,
  ARTICLE_SHARE_ICONS
} from "@/lib/articleShareIcons";
```

For each direct sharing link, resolve the component and render it in both desktop and mobile branches:

```tsx
const ShareIcon = ARTICLE_SHARE_ICONS[link.id];

<ShareIcon aria-hidden="true" focusable="false" />
```

Use the action icons in their existing buttons:

```tsx
<ARTICLE_NATIVE_SHARE_ICON aria-hidden="true" focusable="false" />
<ARTICLE_COPY_ICON aria-hidden="true" focusable="false" />
```

Keep all existing text labels, `aria-label`, `title`, link targets, copy logic, announcement logic, and native-share conditions unchanged.

- [ ] **Step 7: Normalize icon geometry in existing controls**

Add to `app/styles/article.css` immediately after `.article-share-action`:

```css
.article-share-action svg {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
}
```

Do not change the control dimensions, border, radius, colors, or breakpoints.

- [ ] **Step 8: Run focused tests and type checking**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/articleSharing.test.mjs
node --test tests/contentExperience.test.mjs
npx tsc --noEmit
```

Expected: every command exits 0.

- [ ] **Step 9: Commit the implementation**

```bash
git add package.json package-lock.json lib/articleShareIcons.ts components/ArticleShareActions.tsx app/styles/article.css tests/articleSharing.test.mjs
git commit -m "Use recognizable article share icons"
```

---

### Task 2: Verify the integrated UI and release it

**Files:**
- Verify only; no planned source changes.

**Interfaces:**
- Consumes: the completed Task 1 branch.
- Produces: validated GitHub PR, Vercel Preview, merged `main`, and verified production deployment.

- [ ] **Step 1: Run production verification**

Run:

```bash
npm run build
```

Expected: type checking, all static pages, content classification, article image checks, and postbuild checks pass.

- [ ] **Step 2: Run browser QA at 1440 pixels**

Open one production-build article locally and verify:

- The desktop rail shows LinkedIn, X, Facebook, WhatsApp, and copy SVG icons.
- All five controls remain 44 by 44 pixels and centered.
- Accessible names and visible keyboard focus remain present.
- The mobile sharing block is hidden.
- No horizontal overflow occurs.

- [ ] **Step 3: Run browser QA at 390 pixels**

Verify:

- The desktop rail is hidden.
- Native share, four direct channels, and copy use SVG icons with visible text labels.
- Controls wrap inside the viewport and remain at least 44 pixels high.
- No horizontal overflow occurs.

- [ ] **Step 4: Review the final diff**

Run:

```bash
git diff --check origin/main...HEAD
git diff --stat origin/main...HEAD
git status --short
```

Expected: no whitespace errors, no uncommitted files, and only the approved design, plan, dependency, icon registry, share component, share styles, and test files differ.

- [ ] **Step 5: Publish through the established release path**

Push `codex/social-share-icons`, create a PR against `main`, wait for Vercel Preview `READY`, merge with the verified head SHA, and wait for the Git-triggered production deployment. Do not use `vercel --prod`.

- [ ] **Step 6: Verify production**

Confirm the production deployment commit, target article HTTP 200, one H1, canonical URL, cover image, SVG share icons, exactly three recommendations, sitemap entry, and recent runtime errors before reporting completion.
