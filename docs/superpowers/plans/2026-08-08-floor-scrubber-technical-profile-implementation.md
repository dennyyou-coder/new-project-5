# Floor Scrubber Technical Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one evidence-backed, brand-page-style technical profile at `/equipment/floor-scrubber`, keep it reviewable as a draft in local and Vercel Preview environments, and prevent it from appearing in production discovery surfaces until approved.

**Architecture:** Add a separate equipment content domain under `content/equipment`, with validation, visibility, structured-data, and sitemap helpers in `lib/equipment.ts`. Render the pilot through equipment-specific React components that reuse the existing brand table and visual vocabulary without coupling equipment records to brand ownership data. Official evidence, verified relationships, and WCB analysis remain separate typed layers throughout the JSON and UI.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, JSON content records, Node test runner, Sharp image validation, existing global CSS, Vercel Preview.

## Global Constraints

- Work only in `/Users/youdenny/Documents/Codex项目/New project 5/.worktrees/floor-scrubber-tech-design` on `codex/floor-scrubber-tech-design`.
- Preserve the user's modified `AGENTS.md` and all `.superpowers` files in the original workspace; do not copy, stage, clean, or commit them.
- Do not create or edit SEO articles, ownership-analysis articles, brand JSON, brand categories, homepage content, or unrelated components.
- Use primary sources first: official manuals/specification sheets, official product pages, official standards/regulator material, and official service/safety documents.
- Keep the pilot record at `status: "draft"` through the first Preview review.
- Draft equipment may render locally and on Vercel Preview, but must be absent from production static params, directory cards, sitemap entries, canonical discovery links, and structured directory lists.
- Do not infer factory, OEM, component supplier, model compatibility, or cross-brand interchangeability.
- Do not add links to `/components/*` until the linked component record exists and is published.
- Do not use AI-generated product imagery, third-party logo sites, copied manual diagrams, or screenshots of search results.
- Do not commit source downloads or working files; only the optimized final hero asset belongs under `public/images/equipment/floor-scrubber/`.
- Run focused tests after every task. Before Preview, run `npm run test:equipment`, `npm run test:brands`, and `npm run build` from a clean worktree.
- Do not merge, push `main`, or deploy production in this plan. Stop after the reviewed feature-branch Preview is ready.

---

## Task 1: Establish the Equipment Content Contract

**Files:**

- Create: `content/equipment/README.md`
- Create: `lib/equipment.ts`
- Create: `tests/equipmentIntelligence.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add the focused test command**

Add this script to `package.json`:

```json
"test:equipment": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --import ./tests/register-path-alias.mjs --test tests/equipmentIntelligence.test.mjs tests/equipmentExperience.test.mjs"
```

At this point `tests/equipmentExperience.test.mjs` does not exist, so first run only the intelligence file directly while Task 1 is in progress:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --import ./tests/register-path-alias.mjs --test tests/equipmentIntelligence.test.mjs
```

Expected initial result: fail because `tests/equipmentIntelligence.test.mjs` and `lib/equipment.ts` do not exist.

- [ ] **Step 2: Write contract tests before the implementation**

Create `tests/equipmentIntelligence.test.mjs` with a complete inline `validProfile` fixture and tests for:

```js
import {
  buildEquipmentPageSchemas,
  buildEquipmentSitemapEntries,
  buildEquipmentStaticParams,
  getEquipmentPageData,
  getEquipmentProfiles,
  getPublishedEquipmentProfiles,
  isEquipmentDraftVisible,
  validateEquipmentProfile
} from "../lib/equipment.ts";
```

The fixture and assertions must cover these invariants:

```js
assert.deepEqual(validateEquipmentProfile(validProfile, publishedBrandSlugs), []);
assert.deepEqual(buildEquipmentStaticParams([validProfile]), [{ slug: "sample-equipment" }]);
assert.equal(isEquipmentDraftVisible("development"), true);
assert.equal(isEquipmentDraftVisible("preview"), true);
assert.equal(isEquipmentDraftVisible("production"), false);
```

Add negative cases for:

- invalid or duplicate slug;
- fewer than five sources;
- unknown `sourceIds` in any evidence-bearing row;
- source URL that is not HTTP(S);
- missing `evidence`, `scope`, `verifiedAt`, `limitations`, or `buyerAction` in the relevant layer;
- representative model with an unpublished or nonexistent `brandSlug`;
- fewer than six or more than eight representative models;
- fewer than four unique linked brands;
- component entry containing an `href` to an unpublished component page;
- non-local or missing hero image path;
- draft entry included in published loaders, static params, or sitemap helpers.

- [ ] **Step 3: Define the explicit TypeScript contract**

Create `lib/equipment.ts` with these public types as the stable boundary:

```ts
export type EquipmentStatus = "draft" | "published";

export type EquipmentEvidence = {
  evidence: string;
  scope: string;
  sourceIds: string[];
  verifiedAt: string;
};

export type EquipmentAssessment = {
  assessment: string;
  basis: string;
  limitations: string;
  buyerAction: string;
  engineeringCheck?: string;
};

export type EquipmentModelRelationship = EquipmentEvidence & {
  brandSlug: string;
  modelName: string;
  subtype: string;
  distinguishingSpecifications: string[];
  marketScope: string;
};

export type EquipmentSource = {
  id: string;
  title: string;
  publisher: string;
  sourceType: "manual" | "specification" | "manufacturer" | "standard" | "regulator" | "service" | "technical";
  url: string;
  publishedAt?: string;
  accessedAt: string;
};
```

Define `EquipmentProfile` with the exact top-level sections from the approved design: identity/scope, hero, key facts, system flow, variants, performance metrics, application fit, component stack, representative models, procurement decisions, engineering checks, standards, developments, sources, and publication/verification dates.

- [ ] **Step 4: Implement loader, validator, visibility, and schema helpers**

Export these functions:

```ts
export function getEquipmentProfiles(): unknown[];
export function validateEquipmentProfile(
  profile: unknown,
  publishedBrandSlugs: ReadonlySet<string>
): string[];
export function getPublishedEquipmentProfiles(
  publishedBrandSlugs: ReadonlySet<string>
): EquipmentProfile[];
export function isEquipmentDraftVisible(
  vercelEnvironment: string | undefined
): boolean;
export function getEquipmentPageData(
  slug: string,
  publishedBrandSlugs: ReadonlySet<string>,
  options?: { includeDrafts?: boolean }
): EquipmentProfile | undefined;
export function buildEquipmentStaticParams(
  profiles: readonly EquipmentProfile[]
): Array<{ slug: string }>;
export function buildEquipmentSitemapEntries(
  profiles: readonly EquipmentProfile[],
  siteUrl: string
): Array<{ url: string; lastModified: string }>;
export function buildEquipmentPageSchemas(
  profile: EquipmentProfile,
  siteUrl: string
): object[];
```

`buildEquipmentPageSchemas` must describe the subject as `Product` or `DefinedTerm`, not `Organization`, and must emit `WebPage` plus `BreadcrumbList`. The page schema must use `/equipment/floor-scrubber` as the canonical subject URL and must not claim an offer, rating, manufacturer, or universal compatibility.

- [ ] **Step 5: Document every field and failure rule**

In `content/equipment/README.md`, document:

- field definitions and allowed values;
- separation of `EquipmentEvidence`, `EquipmentModelRelationship`, and `EquipmentAssessment`;
- source priority and minimum count;
- draft/Preview/production visibility;
- model and brand-link requirements;
- image provenance requirements;
- no component hyperlink until a published component record exists;
- unit-normalization rule: preserve original source value and unit alongside any normalized display value.

- [ ] **Step 6: Run the intelligence tests**

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --import ./tests/register-path-alias.mjs --test tests/equipmentIntelligence.test.mjs
```

Expected result: all Task 1 contract tests pass.

- [ ] **Step 7: Commit the contract**

```bash
git add package.json lib/equipment.ts content/equipment/README.md tests/equipmentIntelligence.test.mjs
git commit -m "feat: add equipment profile content contract"
```

---

## Task 2: Research and Encode the Floor Scrubber Evidence Record

**Files:**

- Create: `content/equipment/floor-scrubber.json`
- Create: `public/images/equipment/floor-scrubber/hero.webp`
- Modify: `tests/equipmentIntelligence.test.mjs`

- [ ] **Step 1: Add pilot-record acceptance tests first**

Extend `tests/equipmentIntelligence.test.mjs` to load the real pilot and assert:

```js
const floorScrubber = getEquipmentProfiles().find(
  (candidate) => candidate?.slug === "floor-scrubber"
);

assert.ok(floorScrubber);
assert.equal(floorScrubber.status, "draft");
assert.equal(validateEquipmentProfile(floorScrubber, publishedBrandSlugs).length, 0);
assert.ok(floorScrubber.sources.length >= 5);
assert.ok(floorScrubber.representativeModels.length >= 6);
assert.ok(floorScrubber.representativeModels.length <= 8);
assert.ok(new Set(floorScrubber.representativeModels.map((row) => row.brandSlug)).size >= 4);
assert.equal(floorScrubber.componentStack.some((item) => "href" in item), false);
```

Also assert every relationship source is official, every linked brand is published, every source ID resolves, and the hero source URL is an exact official asset or official page URL rather than a search page.

Run the test and expect failure because the JSON and hero asset do not exist.

- [ ] **Step 2: Verify current official evidence before writing claims**

Research current official materials for the technical mechanism, model specifications, safety, maintenance, and representative products. Use at least:

- one official floor-scrubber operating manual that documents solution delivery, agitation, squeegee, vacuum, and recovery flow;
- official current product/specification pages from at least four brands already published in `/brands`;
- one official safety, service, regulator, or standards source directly applicable to the stated market scope;
- an official page or official media asset for the real hero image.

For each candidate model, verify on the same day:

- exact model spelling;
- subtype;
- current official page or manual URL;
- market/region represented by that source;
- only the distinguishing specifications actually printed by that source;
- its brand slug exists and is published.

Exclude any candidate with ambiguous status, distributor-only evidence, an unavailable official source, or a brand page that is not published. Select 6–8 verified rows across at least four qualifying brands; do not fill a quota with weaker evidence.

- [ ] **Step 3: Create the complete draft record**

Create `content/equipment/floor-scrubber.json` with:

```json
{
  "status": "draft",
  "slug": "floor-scrubber",
  "name": "Floor Scrubber",
  "aliases": ["automatic floor scrubber", "scrubber dryer", "auto scrubber"],
  "heroImage": "/images/equipment/floor-scrubber/hero.webp"
}
```

Populate every approved content section. Apply these rules during writing:

- Define the page subject and exclusions before discussing applications.
- Qualify terminology differences such as `scrubber dryer` versus `automatic floor scrubber` by market/source scope.
- Keep system-flow nodes technical and manufacturer-neutral.
- Preserve original specification values and units in representative-model rows.
- Never convert theoretical productivity into practical productivity without an official test method.
- Put interpretations only in `wcbAssessment`/`assessment` fields.
- Every application row includes evidence, scope, WCB assessment, limitations, and buyer action.
- Every procurement row states a comparison trap and a concrete verification action.
- Engineering checks verify part numbers, serial ranges, battery/charger pairing, deck interface, squeegee geometry/material, electrical requirements, service entity, and warranty scope without promising compatibility.
- Standards rows name the jurisdiction and applicability boundary.

- [ ] **Step 4: Acquire and optimize the official hero**

Download the verified official image to a temporary directory, inspect it visually, then produce:

```text
public/images/equipment/floor-scrubber/hero.webp
```

The final asset must be a real floor scrubber in a relevant operating or product context, visually match the alt text and caption, be WebP, use a consistent 8:5 crop, and be at least 1600×1000 pixels. Record the exact official source URL in `heroSourceUrl`. Do not upscale a low-resolution source.

- [ ] **Step 5: Validate record and image mechanically**

Add Sharp assertions:

```js
const heroPath = path.join(process.cwd(), "public", floorScrubber.heroImage);
const heroMetadata = await sharp(heroPath).metadata();
assert.equal(heroMetadata.format, "webp");
assert.ok((heroMetadata.width ?? 0) >= 1600);
assert.ok((heroMetadata.height ?? 0) >= 1000);
```

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --import ./tests/register-path-alias.mjs --test tests/equipmentIntelligence.test.mjs
```

Expected result: all contract and pilot evidence tests pass.

- [ ] **Step 6: Perform a source-to-claim audit**

Review each `sourceIds` array against the exact source content. Remove or narrow any claim whose source does not support its entity, model, market, or time scope. Confirm no source title, publisher, URL, access date, or model value was copied from a search result snippet.

- [ ] **Step 7: Commit the evidence record**

```bash
git add content/equipment/floor-scrubber.json public/images/equipment/floor-scrubber/hero.webp tests/equipmentIntelligence.test.mjs
git commit -m "content: add floor scrubber technical evidence"
```

---

## Task 3: Add Draft-Safe Equipment Routes and Structured Data

**Files:**

- Create: `app/equipment/page.tsx`
- Create: `app/equipment/[slug]/page.tsx`
- Create: `tests/equipmentExperience.test.mjs`
- Modify: `tests/equipmentIntelligence.test.mjs`

- [ ] **Step 1: Write route and visibility tests first**

Create `tests/equipmentExperience.test.mjs` and assert that the detail route:

- exports `generateStaticParams`, `generateMetadata`, and `dynamicParams = true`;
- passes only published profiles to `buildEquipmentStaticParams`;
- computes draft access from `process.env.VERCEL_ENV`;
- calls `notFound()` for an invalid slug or a production-hidden draft;
- emits `buildEquipmentPageSchemas(profile, siteUrl)`;
- uses one canonical URL and one `<h1>`;
- renders components in the approved section order.

Assert the directory route:

- calls `getPublishedEquipmentProfiles`;
- renders no draft card;
- has an accessible empty state when no equipment profile is published;
- does not expose the pilot slug in hard-coded markup.

Run `npm run test:equipment` and expect failure because the routes and component imports do not exist.

- [ ] **Step 2: Implement environment-aware detail loading**

In `app/equipment/[slug]/page.tsx`, use this visibility boundary:

```ts
const includeDrafts = isEquipmentDraftVisible(process.env.VERCEL_ENV);

export const dynamicParams = true;

export function generateStaticParams() {
  const articles = getInsights();
  const publishedBrandSlugs = new Set(
    getPublishedBrandProfiles(articles).map(({ slug }) => slug)
  );
  return buildEquipmentStaticParams(
    getPublishedEquipmentProfiles(publishedBrandSlugs)
  );
}
```

Both `generateMetadata` and the page component must load the profile through the same helper and visibility rule. Preview/local draft metadata must include:

```ts
robots: { index: false, follow: false }
```

Published profiles may use normal indexable metadata. Draft pages must show a visible `Draft preview` label.

- [ ] **Step 3: Add safe page-level structured data**

Render the schemas from `buildEquipmentPageSchemas`. Assert in `tests/equipmentIntelligence.test.mjs` that:

- the subject is not `Organization`;
- there is no `aggregateRating`, `review`, `offers`, or unsupported `manufacturer`;
- breadcrumb order is Home → Equipment Intelligence → Floor Scrubber;
- draft schemas are used only on the directly accessed draft Preview route, never in a directory list or sitemap.

- [ ] **Step 4: Implement the minimal equipment directory**

Create `/equipment` with metadata, a concise technical-database introduction, published-profile count, published cards only, and an empty state. Do not add header/footer navigation in the pilot branch. This route exists to validate the future information architecture and must not promote a draft record.

- [ ] **Step 5: Run route tests**

```bash
npm run test:equipment
```

Expected result: route, metadata, visibility, and schema tests pass; presentation tests may still be pending if explicitly marked for later tasks, but no missing test file remains.

- [ ] **Step 6: Commit routes**

```bash
git add app/equipment tests/equipmentExperience.test.mjs tests/equipmentIntelligence.test.mjs
git commit -m "feat: add draft-safe equipment routes"
```

---

## Task 4: Build the Hero, Key Facts, and Original System Visuals

**Files:**

- Create: `components/equipment/EquipmentHero.tsx`
- Create: `components/equipment/EquipmentSystemFlow.tsx`
- Create: `components/equipment/EquipmentTypeComparison.tsx`
- Modify: `app/equipment/[slug]/page.tsx`
- Modify: `tests/equipmentExperience.test.mjs`

- [ ] **Step 1: Write component-structure tests first**

Assert:

- breadcrumb is Home → Equipment Intelligence → Floor Scrubber;
- the page contains exactly one `<h1>`;
- hero renders official image, alt, caption, and source link;
- key facts use `BrandDataTable` to preserve the current responsive table behavior;
- draft label, definition, inclusions, exclusions, primary applications, and last verified date are visible;
- section navigation points to every rendered section ID;
- system-flow and taxonomy visuals use semantic HTML/text, not copied image diagrams;
- component nodes without published pages render as text, not anchors;
- no scoring, stars, winner labels, or rankings exist.

Run `npm run test:equipment`; expect the new assertions to fail.

- [ ] **Step 2: Implement the equipment hero**

`EquipmentHero` receives only `EquipmentProfile` and renders:

```tsx
<EquipmentHero profile={profile} isDraft={profile.status === "draft"} />
```

Reuse `BrandDataTable` for the fact table. Do not import `BrandHero` or brand ownership helpers. Use equipment-specific labels such as `Independent Technical Reference`, `Equipment scope`, and `Last verified`.

- [ ] **Step 3: Implement the working-system flow as an original UI visual**

Render data-driven nodes in this order:

```text
Solution delivery → Mechanical agitation → Soil suspension → Squeegee collection → Vacuum recovery → Recovery tank
```

Each node displays its role and associated component family. Use ordered-list semantics so the explanation remains understandable without CSS. Add a nearby evidence note with source references from the profile; do not reproduce a manufacturer diagram.

- [ ] **Step 4: Implement the type taxonomy visual**

Render compact, walk-behind, stand-on only if supported, ride-on, and autonomous/robotic types as a comparison grid driven by JSON. Each card shows task scale, operator relationship, space constraint, and limitations. Do not declare a universal best type.

- [ ] **Step 5: Run tests and commit**

```bash
npm run test:equipment
git add components/equipment app/equipment/[slug]/page.tsx tests/equipmentExperience.test.mjs
git commit -m "feat: render equipment overview and system visuals"
```

Expected result: all tests added through Task 4 pass.

---

## Task 5: Render Metrics, Application Fit, Components, and Model Relationships

**Files:**

- Create: `components/equipment/EquipmentTechnicalSections.tsx`
- Create: `components/equipment/EquipmentRelationships.tsx`
- Modify: `app/equipment/[slug]/page.tsx`
- Modify: `tests/equipmentExperience.test.mjs`

- [ ] **Step 1: Add table-boundary tests first**

Assert the page renders:

- metric dictionary with metric, purchasing meaning, original reporting boundary, and comparison caution;
- application-fit rows with evidence, scope, WCB assessment, limitations, and buyer action visibly separated;
- component stack with function, variants, critical checks, and no links to nonexistent component pages;
- 6–8 representative model rows;
- linked brand names only for published brand slugs;
- model subtype, distinguishing specification, market scope, source, and verification date;
- a visible `Representative, not exhaustive` disclosure.

Run `npm run test:equipment`; expect failure until components are added.

- [ ] **Step 2: Implement technical reference sections**

Use `BrandDataTable` for narrow tables and stacked article-like rows for dense evidence/assessment content. Do not merge official evidence and WCB assessment into one paragraph. Source references should link to `#source-{id}` anchors.

For normalized values, display both values together:

```tsx
<span>{metric.sourceValue} {metric.sourceUnit}</span>
{metric.normalizedValue ? (
  <span className="equipment-unit-note">
    Display equivalent: {metric.normalizedValue} {metric.normalizedUnit}
  </span>
) : null}
```

Do not calculate a normalized value unless the conversion is purely mathematical and preserves the source measurement basis.

- [ ] **Step 3: Implement relationship rendering**

Build the brand link from the validated relationship only:

```tsx
<Link href={`/brands/${model.brandSlug}`}>{model.brandName}</Link>
```

Do not read or mutate brand JSON to infer models. Component families render as labels because no component pages exist yet. Model rows must never imply manufacturer, OEM, factory, or component-supplier relationships beyond the cited official model/brand relationship.

- [ ] **Step 4: Run tests and commit**

```bash
npm run test:equipment
git add components/equipment app/equipment/[slug]/page.tsx tests/equipmentExperience.test.mjs
git commit -m "feat: add equipment evidence and model relationships"
```

Expected result: all tests added through Task 5 pass.

---

## Task 6: Render WCB Decision Support, Engineering Checks, Standards, Timeline, and Sources

**Files:**

- Create: `components/equipment/EquipmentDecisionSections.tsx`
- Create: `components/equipment/EquipmentTimeline.tsx`
- Create: `components/equipment/EquipmentSources.tsx`
- Modify: `app/equipment/[slug]/page.tsx`
- Modify: `tests/equipmentExperience.test.mjs`

- [ ] **Step 1: Add analysis-separation tests first**

Assert:

- every procurement row is visibly labelled `WCB assessment`;
- each row contains intended task, attribute to verify, common comparison trap, evidence limitation, and buyer action;
- engineering checks cover the named verification categories without a compatibility guarantee;
- standards show jurisdiction, version/date when available, applicability, and source;
- timeline events reference declared sources;
- sources display title, publisher, source type, URL, and access date;
- first-published, last-verified, and last-material-modification dates appear;
- disclaimer states that the page is not model-specific purchasing, safety, or repair advice.

Run `npm run test:equipment`; expect failure until the sections exist.

- [ ] **Step 2: Implement procurement and engineering sections**

Use a visible analysis marker on every WCB row. Avoid scores, preferred brands, and generic recommendations. `buyerAction` and `engineeringCheck` must be actionable commands such as confirming a model-specific manual, serial range, charger part number, local service entity, or written supplier declaration.

- [ ] **Step 3: Implement standards and developments**

Render only entries supported by the profile. Timeline order is newest first. Do not render a general cleaning-industry news feed or infer regulatory applicability beyond each row's `scope`.

- [ ] **Step 4: Implement auditable sources**

Assign each source item `id={`source-${source.id}`}` so evidence links resolve. External links use `target="_blank"` and `rel="noopener noreferrer"`. Show access/verification dates in the same date style as brand profiles.

- [ ] **Step 5: Verify approved component order**

The detail route must render in this order:

```tsx
<EquipmentHero />
<EquipmentSystemFlow />
<EquipmentTypeComparison />
<EquipmentTechnicalSections />
<EquipmentRelationships />
<EquipmentDecisionSections />
<EquipmentTimeline />
<EquipmentSources />
```

- [ ] **Step 6: Run tests and commit**

```bash
npm run test:equipment
git add components/equipment app/equipment/[slug]/page.tsx tests/equipmentExperience.test.mjs
git commit -m "feat: add equipment decision and verification sections"
```

Expected result: all equipment intelligence and experience tests pass.

---

## Task 7: Add Responsive Equipment Styling Without Regressing Brand Pages

**Files:**

- Modify: `app/globals.css`
- Modify: `tests/equipmentExperience.test.mjs`

- [ ] **Step 1: Add CSS contract tests first**

Under a new marker `/* Equipment intelligence */`, assert the stylesheet contains equipment-specific selectors for:

- directory and detail shells;
- hero and hero media;
- key facts;
- section navigation;
- system flow;
- type taxonomy;
- evidence/assessment labels;
- relationship tables;
- source list;
- 840 px and 760 px breakpoints;
- 390 px-safe wrapping via `min-width: 0`, `overflow-wrap: anywhere`, and stacked table behavior.

Also assert the new section does not override global `table`, `img`, `a`, or heading selectors without an `.equipment-` ancestor.

Run `npm run test:equipment`; expect the CSS assertions to fail.

- [ ] **Step 2: Implement the visual system**

Reuse existing CSS custom properties, borders, radii, type scale, and spacing. Equipment pages should feel like the brand database while remaining recognizable through equipment-specific eyebrow labels and original technical diagrams.

Required responsive behavior:

- desktop hero uses a consistent two-column layout and 8:5 media frame;
- system-flow nodes wrap without shrinking text below the existing body minimum;
- dense data tables use the existing mobile card transformation from `BrandDataTable`;
- long URLs, model names, part identifiers, specifications, and units wrap safely;
- no fixed width exceeds the viewport;
- section navigation wraps into multiple lines without horizontal scrolling;
- evidence, scope, WCB assessment, limitation, and action remain visually distinguishable at 390 px.

- [ ] **Step 3: Run focused and regression tests**

```bash
npm run test:equipment
npm run test:brands
```

Expected result: both suites pass with no changes required to brand JSON or brand components other than reusing `BrandDataTable`.

- [ ] **Step 4: Commit styling**

```bash
git add app/globals.css tests/equipmentExperience.test.mjs
git commit -m "style: add responsive equipment profile layout"
```

---

## Task 8: Integrate Sitemap Rules, Build, and Prepare the Review Preview

**Files:**

- Modify: `app/sitemap.ts`
- Modify: `tests/equipmentIntelligence.test.mjs`
- Modify: `tests/equipmentExperience.test.mjs`

- [ ] **Step 1: Add sitemap release-gate tests first**

Assert:

```js
const equipmentEntries = sitemap().filter(({ url }) => url.includes("/equipment/"));
assert.equal(equipmentEntries.some(({ url }) => url.endsWith("/equipment/floor-scrubber")), false);
```

Also test `buildEquipmentSitemapEntries` with a published inline fixture to prove a future approved profile receives its own URL and `lastModified`, while draft fixtures are rejected before the helper is called. If no published equipment profiles exist, `/equipment` itself must also stay out of the production sitemap during the pilot.

Run `npm run test:equipment`; expect failure until sitemap integration is added.

- [ ] **Step 2: Integrate published-only equipment sitemap data**

In `app/sitemap.ts`, compute the published equipment profiles from the same published brand slug set used by the route. Append:

```ts
...buildEquipmentSitemapEntries(equipmentProfiles, baseUrl)
```

Add `/equipment` to static sitemap routes only when `equipmentProfiles.length > 0`. Do not hard-code the draft pilot slug.

- [ ] **Step 3: Run the full local release gate**

```bash
npm run test:equipment
npm run test:brands
npm run build
git status --short
```

Expected result:

- equipment tests pass;
- brand tests pass;
- production build passes;
- production build does not statically generate or sitemap the draft pilot;
- only intentional feature files are modified;
- original workspace user files remain untouched.

- [ ] **Step 4: Run local browser verification**

Start the app and inspect `/equipment/floor-scrubber` at desktop and 390 px. Verify:

- hero image, caption, and official source match;
- exactly one H1 and no abnormal heading wraps;
- section navigation anchors land correctly;
- all tables and model specifications remain inside the viewport;
- system flow is understandable visually and in DOM order;
- official evidence and WCB assessment are unmistakably separate;
- brand links resolve;
- component labels do not link;
- all source anchors and external links work;
- no broken images;
- browser console has no new error or warning caused by the feature.

Capture one desktop and one 390 px full-page screenshot in the isolated worktree verification folder; do not use or alter the user's original `.superpowers/verification` files.

- [ ] **Step 5: Commit sitemap integration and any verified fixes**

```bash
git add app/sitemap.ts tests/equipmentIntelligence.test.mjs tests/equipmentExperience.test.mjs
git commit -m "test: enforce equipment draft release gates"
```

If browser verification required CSS/content corrections, stage them explicitly in the same commit only after rerunning the focused tests and build.

- [ ] **Step 6: Request a code review before publishing the branch**

Use `superpowers:requesting-code-review` against the full implementation diff. Resolve every Critical or Important finding, then rerun Task 8 Step 3. Confirm the review checks evidence boundaries, draft visibility, model-brand links, schemas, mobile overflow, and no unrelated article/brand changes.

- [ ] **Step 7: Push only the feature branch and create a Vercel Preview**

After the review gate passes:

```bash
git push -u origin codex/floor-scrubber-tech-design
```

Create a Vercel Preview from this branch. Do not use `vercel --prod`. Verify the Preview at desktop and 390 px using the same checklist, including console errors and draft `noindex,nofollow` metadata.

- [ ] **Step 8: Stop for pilot review**

Report in Chinese:

1. added and modified files;
2. page URL and Preview URL;
3. technical content coverage;
4. representative brands/models and official evidence boundaries;
5. hero source and original visual completion;
6. equipment/brand test results;
7. production build result;
8. desktop and 390 px results;
9. remaining limitations or uncertain facts;
10. confirmation that the profile remains draft, is not in the production sitemap/directory, and has not been deployed to production.

Do not batch additional equipment or component pages until the user accepts this pilot's content density, visual treatment, and maintenance model.
