# WCB SEO and Performance Remediation Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the confirmed technical issues that can reduce World Clean Biz page speed, crawl efficiency, metadata quality, and guide discovery without changing the approved article bodies or publishing the result.

**Architecture:** Keep the existing Next.js App Router and MDX content pipeline. Add small shared SEO/content utilities at the data and metadata boundaries, improve the existing markdown renderer instead of editing hundreds of article bodies, and protect the fixes with real repository-level tests plus a production build audit.

**Tech Stack:** Next.js 15, React 19, TypeScript, Node test runner, MDX frontmatter, CSS.

**Global constraints:** Work only on `codex/wcb-seo-performance-fixes`; do not push, merge, deploy, or alter the user's main worktree. Preserve visible H1/article copy. Prefer omission over inaccurate SEO timestamps. Every behavioral change starts with a failing test and ends with focused tests plus a full build.

---

### Task 1: Establish SEO regression gates

**Files:**
- Create: `tests/seoPerformanceAudit.test.mjs`
- Modify: `package.json`

1. Add tests that exercise the content loader, sitemap result, rendered metadata helpers, markdown HTML, route metadata, and source files.
2. Cover these breaks: missing modified dates, missing publication dates, query-driven metadata making key directories dynamic, unresolved internal article links, misclassified sourcing guides, absent social images/titles, nested `<main>` landmarks, and eager markdown images.
3. Run `npm run test:seo-audit` and confirm the new tests fail for the audited reasons.

### Task 2: Repair content dates, guide classification, and internal links

**Files:**
- Modify: `lib/content.ts`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: the 10 confirmed sourcing-guide MDX files
- Modify: `content/insights/robotic-lawn-mower-manufacturers-china.mdx`
- Modify: `content/insights/robotic-lawn-mower-market-size-yard-automation.mdx`
- Modify: the 3 MDX files containing broken internal links

1. Derive missing original publication timestamps from committed evidence and add the recognized frontmatter fields.
2. Load `updated_at`/`updatedAt` as `updatedAt`; use it for Open Graph, Article JSON-LD, and sitemap modification dates.
3. Classify the 10 confirmed buyer/sourcing guides as search content with the sourcing guide type.
4. Correct the 3 confirmed broken internal article links.
5. Run `npm run test:seo-audit`, `npm run test:insights`, and content classification verification until green.

### Task 3: Improve article image loading and metadata length

**Files:**
- Modify: `lib/content.ts`
- Create: `lib/seo.ts`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: affected metadata producers for brand, equipment, component, sourcing, and guide pages

1. Add a real SEO-title/description normalizer that preserves whole words and important leading terms while enforcing safe search-snippet budgets only in metadata, never in H1/body copy.
2. Make body images lazy and asynchronously decoded, add stable dimensions when the local asset can be inspected, and keep only the article hero eager/high priority.
3. Add page-specific Twitter metadata where it currently inherits the generic site title.
4. Add a reliable global social-image fallback and explicit social metadata for sourcing detail pages.
5. Run focused SEO and existing brand/equipment/component/inquiry tests.

### Task 4: Restore static rendering for key discovery pages

**Files:**
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/archive/page.tsx`
- Modify: `app/guides/page.tsx`
- Modify: related tests if their public behavior changes

1. Remove request-query consumption from `generateMetadata` while retaining canonical URLs and index/follow defaults.
2. Keep directory pagination/filter rendering behavior unchanged.
3. Build and confirm `/blog`, `/blog/archive`, and `/guides` are statically generated.

### Task 5: Repair sitemap and document semantics

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/page.tsx`
- Modify: `app/reports/page.tsx`
- Modify: `app/inquiry-received/page.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `app/quality-compliance/page.tsx`
- Modify: `app/terms/page.tsx`
- Modify: six sourcing landing components

1. Add `/quality-compliance` to the sitemap and remove fabricated/fixed modification dates when no trustworthy source exists.
2. Keep one global `<main>` landmark by replacing nested page-level landmarks with neutral wrappers.
3. Add Organization and WebSite JSON-LD to the homepage without duplicating existing structured data.
4. Run SEO, trust, homepage, inquiry, brand, equipment, and component tests.

### Task 6: Reduce global CSS and third-party script cost

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `components/LeadForms.tsx`

1. Prove the retired `home-v5`, `home-v7`, and `home-v8` selectors have no live consumers; delete only their bounded legacy blocks.
2. Load the Tally widget on demand for popup interactions while preserving the direct-link fallback and inline form behavior.
3. Verify the source and built CSS budgets improve and conversion tests remain green.

### Task 7: Final verification and local handoff

**Files:**
- Modify: `docs/superpowers/plans/2026-08-09-wcb-seo-performance-fixes.md` only if implementation evidence changes the plan

1. Run every repository test command and both content verification commands.
2. Run `npm run build` and inspect the route table for static discovery pages.
3. Start the production build locally, run the sourcing SEO verifier against it, and audit representative homepage, article, guide, sourcing, brand, equipment, and component HTML.
4. Report the local branch/worktree, exact diff, measured improvements, residual risks, and confirmation that nothing was pushed or deployed.
