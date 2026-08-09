# Vacuum Cleaner Motor Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a draft-only Preview of the first WCB component-intelligence page at `/components/vacuum-cleaner-motor`, with a reusable data contract, evidence-backed content, and five well-distributed visuals.

**Architecture:** Add an independent `ComponentProfile` JSON contract and loader, a public component directory, and a reusable dynamic detail route. Component UI lives under `components/component-intelligence/`, reusing established table and responsive patterns without coupling component fields to `EquipmentProfile`.

**Tech Stack:** Next.js App Router, React, TypeScript, JSON content, Node test runner, Sharp image validation, SVG/WebP assets, Vercel Preview.

## Global Constraints

- The page is a technical database record, not an SEO article, brand page, ownership page, repair manual, or parts catalogue.
- Pilot status remains `draft` through Preview review and is excluded from production discovery.
- Use one official hero plus exactly four distributed body visuals: two official WebP images and two WCB SVG diagrams.
- Never infer exact compatibility, OEM supply, factory origin, or brand-to-supplier relationships.
- Every source-backed row uses `evidence`, `scope`, `sourceIds`, and `verifiedAt`.
- Every WCB judgement uses `assessment`, `basis`, `limitations`, and `buyerAction`.
- No AI product imagery, third-party logos, copied manual diagrams, or search screenshots.
- Desktop and 390 px layouts must have no horizontal overflow, clipped content, misaligned cards, or large empty structural gaps.
- Production release must go through GitHub `main` and Vercel Git integration; never use `vercel --prod`.

---

### Task 1: Component profile contract and loader

**Files:**
- Create: `lib/componentProfiles.ts`
- Create: `content/components/README.md`
- Create: `tests/componentIntelligence.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `ComponentProfile`, `getComponentProfiles()`, `validateComponentProfile(profile)`, `getPublishedComponentProfiles()`, `getComponentPageData(slug, options)`, `isComponentDraftVisible(vercelEnvironment)`, `buildComponentStaticParams(profiles)`, `buildComponentSitemapEntries(profiles, siteUrl)`, `buildComponentPageTitle(profile)`, and `buildComponentPageSchemas(profile, siteUrl)`.
- `getComponentPageData` returns a validated published profile or a validated draft only when `options.includeDrafts === true`.

- [ ] **Step 1: Write the failing contract tests**

Create a complete sample profile in `tests/componentIntelligence.test.mjs` and assert:

```js
assert.deepEqual(validateComponentProfile(validProfile), []);
assert.equal(isComponentDraftVisible("production"), false);
assert.equal(isComponentDraftVisible("preview"), true);
assert.deepEqual(buildComponentStaticParams([validProfile]), [{ slug: "sample-motor" }]);
assert.doesNotMatch(JSON.stringify(buildComponentPageSchemas(validProfile, siteUrl)), /Organization|Brand|offers|aggregateRating|manufacturer/);
```

Clone the sample into invalid cases covering unknown source IDs, fewer than five sources, missing evidence fields, missing assessment boundaries, invalid dates and URLs, image paths outside `/images/components/{slug}/`, duplicate visual placements, missing diagram mobile assets, fewer than six representative families, and compatibility claims without the verification disclaimer.

- [ ] **Step 2: Run the test and verify the contract is missing**

Run: `node --test tests/componentIntelligence.test.mjs`  
Expected: FAIL because `lib/componentProfiles.ts` does not exist.

- [ ] **Step 3: Implement the independent data contract**

Define explicit types for sources, evidence, assessments, visuals, system nodes, architectures, metrics, application rows, compatibility checks, failure modes, representative families, procurement decisions, engineering checks, standards, and developments. Enforce:

```ts
type ComponentStatus = "draft" | "published";
type ComponentVisualPlacement = "architecture-families" | "performance-boundaries" | "application-context" | "compatibility-gate";
type ComponentVisualType = "official-photo" | "wcb-diagram";
```

The pilot validator accepts three to five body visuals in the general contract but the pilot test separately requires all four placements. Published profiles require five sources and six to eight representative families across at least three manufacturers.

- [ ] **Step 4: Add the focused command and documentation**

Add `"test:components": "node --test tests/componentIntelligence.test.mjs tests/componentExperience.test.mjs"` to `package.json`. Document draft visibility, evidence layers, compatibility boundaries, images, and publication requirements in `content/components/README.md`.

- [ ] **Step 5: Run the contract tests**

Run: `node --test tests/componentIntelligence.test.mjs`  
Expected: PASS for helper and validator tests; real pilot assertions are added in Task 4.

- [ ] **Step 6: Commit**

Commit message: `feat: add component intelligence data contract`

### Task 2: Component routes and responsive UI

**Files:**
- Create: `app/components/page.tsx`
- Create: `app/components/[slug]/page.tsx`
- Create: `components/component-intelligence/ComponentDirectoryCard.tsx`
- Create: `components/component-intelligence/ComponentEvidence.tsx`
- Create: `components/component-intelligence/ComponentVisual.tsx`
- Create: `components/component-intelligence/ComponentHero.tsx`
- Create: `components/component-intelligence/ComponentSystemRole.tsx`
- Create: `components/component-intelligence/ComponentArchitecture.tsx`
- Create: `components/component-intelligence/ComponentTechnicalSections.tsx`
- Create: `components/component-intelligence/ComponentCompatibility.tsx`
- Create: `components/component-intelligence/ComponentServiceSections.tsx`
- Create: `components/component-intelligence/ComponentRelationships.tsx`
- Create: `components/component-intelligence/ComponentDecisionSections.tsx`
- Create: `components/component-intelligence/ComponentTimeline.tsx`
- Create: `components/component-intelligence/ComponentSources.tsx`
- Create: `tests/componentExperience.test.mjs`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `ComponentProfile` and loader helpers from Task 1.
- Produces: draft-aware `/components/[slug]`, published-only `/components`, and scoped `.component-intelligence-*` styles.

- [ ] **Step 1: Write failing experience tests**

Assert one H1, draft label, `noindex` metadata, exact section order, all evidence labels, compatibility warning text, four visual placements, directory filtering, source links, and the following mobile safeguards:

```js
assert.match(styles, /@media \(max-width: 760px\)/);
assert.match(styles, /overflow-wrap: anywhere/);
assert.match(styles, /grid-template-columns:\s*1fr/);
assert.match(detail, /robots: profile\.status === "draft"/);
```

- [ ] **Step 2: Run the experience tests and verify failure**

Run: `node --test tests/componentExperience.test.mjs`  
Expected: FAIL because routes and components do not exist.

- [ ] **Step 3: Build directory and detail composition**

Detail order:

```tsx
<ComponentHero />
<ComponentSystemRole />
<ComponentArchitecture />
<ComponentTechnicalSections />
<ComponentCompatibility />
<ComponentServiceSections />
<ComponentRelationships />
<ComponentDecisionSections />
<ComponentTimeline />
<ComponentSources />
```

The directory calls only `getPublishedComponentProfiles()`. The detail route uses `dynamicParams = true` and `includeDrafts: isComponentDraftVisible(process.env.VERCEL_ENV)`.

- [ ] **Step 4: Implement visual rhythm and mobile layout**

Place official photos at architecture and application sections; place WCB diagrams after the metric dictionary and before the compatibility checklist. Use mobile cards for dense tables, single-column layouts at 760 px, `min-width: 0`, and safe wrapping for part numbers, units, and URLs.

- [ ] **Step 5: Run experience and contract tests**

Run: `npm run test:components`  
Expected: PASS for framework tests.

- [ ] **Step 6: Commit**

Commit message: `feat: build component intelligence pages`

### Task 3: Sitemap integration

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `tests/componentIntelligence.test.mjs`

**Interfaces:**
- Consumes: `getPublishedComponentProfiles()` and `buildComponentSitemapEntries()`.
- Produces: `/components` and detail sitemap entries only when at least one published component profile exists.

- [ ] **Step 1: Write the failing sitemap assertions**

Assert the sitemap source uses published profile helpers and does not hard-code `vacuum-cleaner-motor`. Assert the draft pilot is absent from generated production URLs.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm run test:components`  
Expected: FAIL on missing sitemap integration.

- [ ] **Step 3: Add generic published-only sitemap integration**

Load component profiles once, add `/components` only when the published list is non-empty, then spread `buildComponentSitemapEntries(componentProfiles, baseUrl)`. Do not expose the draft pilot.

- [ ] **Step 4: Run the focused test**

Run: `npm run test:components`  
Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: add component discovery rules`

### Task 4: Evidence-backed pilot data and visuals

**Files:**
- Create: `content/components/vacuum-cleaner-motor.json`
- Create: `public/images/components/vacuum-cleaner-motor/hero.webp`
- Create: `public/images/components/vacuum-cleaner-motor/architecture-family.webp`
- Create: `public/images/components/vacuum-cleaner-motor/application-reference.webp`
- Create: `public/images/components/vacuum-cleaner-motor/performance-boundaries.svg`
- Create: `public/images/components/vacuum-cleaner-motor/performance-boundaries-mobile.svg`
- Create: `public/images/components/vacuum-cleaner-motor/compatibility-gate.svg`
- Create: `public/images/components/vacuum-cleaner-motor/compatibility-gate-mobile.svg`
- Modify: `tests/componentIntelligence.test.mjs`

**Interfaces:**
- Consumes: the Task 1 schema and Task 2 visual placements.
- Produces: a fully validated `draft` profile accessible in local and Preview environments.

- [ ] **Step 1: Add failing pilot gates**

Assert the real profile exists, remains draft, validates cleanly, has at least five primary sources, has exactly four body visuals with all required placements, contains two official WebPs and two desktop/mobile WCB diagram pairs, and contains six to eight representative families across three manufacturers.

- [ ] **Step 2: Verify the pilot test fails**

Run: `npm run test:components`  
Expected: FAIL because profile and assets do not exist.

- [ ] **Step 3: Research and write the profile**

Use direct official material from Domel, Nidec, Johnson Electric, standards bodies, and other primary motor-manufacturer documents where required. Keep brush-drive motors separate from suction motors. Record exact source scope and preserve original units and test boundaries.

- [ ] **Step 4: Acquire and verify official images**

Download only images embedded in the selected official motor pages. Inspect each image before use, record its exact page or asset URL, crop without changing factual content, and convert to the required WebP dimensions.

- [ ] **Step 5: Create the two WCB diagram pairs**

Create source-labelled desktop and mobile SVGs for performance-measurement boundaries and the compatibility decision gate. Keep mobile labels readable at 390 px and avoid copied source diagrams.

- [ ] **Step 6: Run pilot and asset tests**

Run: `npm run test:components`  
Expected: PASS, including dimensions and provenance.

- [ ] **Step 7: Commit**

Commit message: `content: add vacuum motor component pilot`

### Task 5: Regression, build, and Preview review

**Files:**
- Modify only files required by verified failures in the component implementation.

**Interfaces:**
- Consumes: completed framework and draft pilot.
- Produces: a pushed feature branch and Vercel Preview ready for visual approval.

- [ ] **Step 1: Run focused regression tests**

Run: `npm run test:components && npm run test:equipment && npm run test:brands`  
Expected: all tests pass without reducing evidence or image gates.

- [ ] **Step 2: Run production build**

Run: `npm run build`  
Expected: successful build; draft detail is not statically published or included in production sitemap.

- [ ] **Step 3: Push feature branch and obtain Preview**

Push `codex/component-intelligence-pilot-20260809` to GitHub and use the Vercel Git Preview produced from that branch. Do not deploy production.

- [ ] **Step 4: Inspect desktop and 390 px Preview**

Verify the visual cadence, hero alignment, all four body visuals, captions and provenance, table/card alignment, long identifiers, absence of horizontal overflow, image loading, and browser console errors.

- [ ] **Step 5: Report Preview for visual approval**

Report modified files, evidence boundary, official image sources, test/build results, desktop/mobile findings, and the Preview URL. Keep the profile draft until visual approval.
