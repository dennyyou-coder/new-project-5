# Brand Profiles Batch 02 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish evidence-led Brand Intelligence profiles for Shark, WYBOT, Beatbot, Narwal, Husqvarna and Segway Navimow.

**Architecture:** Add six JSON records to the existing `content/brands` data source and store every new logo, hero and optional portrait in its matching `public/images/brands/{slug}` directory. Reuse the existing loader, schema, directory, detail route, JSON-LD and sitemap pipeline; only tests, profile records and brand-specific assets should change.

**Tech Stack:** Next.js 15 App Router, TypeScript, JSON content records, Node test runner, Sharp image metadata checks, Playwright CLI, Vercel Git deployments.

## Global Constraints

- Publish exactly these new slugs: `shark`, `wybot`, `beatbot`, `narwal`, `husqvarna`, `segway-navimow`.
- Preserve the current Brand Intelligence components, styles, routing and schema.
- Use official primary sources or authoritative regulatory and filing sources for material claims.
- Store official transparent logos as local WebP files at `/images/brands/{slug}/logo.webp`.
- Store one dedicated product-led hero per profile as a 1600 × 1000 WebP.
- Configure two or three local content visuals per profile.
- Add a leadership portrait only when the person, image and source URL are verified; never use a placeholder.
- Do not rewrite existing articles, change the homepage or change global navigation.
- Work only on `codex/brand-profiles-batch-02` until preview approval.
- Production must be released through GitHub `main` and the Vercel Git integration.

---

## File Structure

**Create**

- `content/brands/shark.json`
- `content/brands/wybot.json`
- `content/brands/beatbot.json`
- `content/brands/narwal.json`
- `content/brands/husqvarna.json`
- `content/brands/segway-navimow.json`
- `public/images/brands/shark/*`
- `public/images/brands/wybot/*`
- `public/images/brands/beatbot/*`
- `public/images/brands/narwal/*`
- `public/images/brands/husqvarna/*`
- `public/images/brands/segway-navimow/*`

**Modify**

- `tests/brandIntelligence.test.mjs`
- Modify existing profile JSON only if a competitor slug needs normalization to the approved canonical route.

**Do not modify**

- `lib/brands.ts`
- `app/brands/**`
- shared components or global styles
- existing article bodies

---

### Task 1: Establish the Six-Profile Release Gate

**Files:**

- Modify: `tests/brandIntelligence.test.mjs:513-669`
- Test: `tests/brandIntelligence.test.mjs`

**Interfaces:**

- Consumes: `getBrandProfiles()`, `getPublishedBrandProfiles()`, `validateBrandProfile()`, `buildBrandStaticParams()` and `buildBrandSitemapEntries()`.
- Produces: a failing release gate that requires the exact 16 published slugs and validates new assets and article relationships.

- [ ] **Step 1: Change the exact published-slug expectation**

Replace the current ten-slug array with:

```js
const expectedSlugs = [
  "aiper",
  "beatbot",
  "bissell",
  "dreame",
  "dyson",
  "ecovacs",
  "husqvarna",
  "irobot",
  "mammotion",
  "maytronics",
  "narwal",
  "roborock",
  "segway-navimow",
  "shark",
  "tineco",
  "wybot"
];
```

Update both `loadedProfiles.length` and the all-profile asset test from `10` to `16`. Rename the release-gate test to “the release gate validates the exact sixteen published profiles and approved article relationships”.

- [ ] **Step 2: Add dedicated asset expectations**

Add one object keyed by the six new slugs. For each profile assert:

```js
assert.equal(candidate.logoImage, `/images/brands/${slug}/logo.webp`);
assert.match(candidate.heroImage, new RegExp(`^/images/brands/${slug}/hero-.+\\.webp$`));
assert.match(candidate.logoSourceUrl, /^https:\/\//);
assert.ok(candidate.contentVisuals.length >= 2 && candidate.contentVisuals.length <= 3);
```

Decode the logo and hero with Sharp. Require:

```js
assert.equal(logoMetadata.format, "webp");
assert.equal(logoMetadata.hasAlpha, true);
assert.equal(heroMetadata.format, "webp");
assert.equal(heroMetadata.width, 1600);
assert.equal(heroMetadata.height, 1000);
```

- [ ] **Step 3: Add competitor-link expectations**

Use `buildCompetitorReferences()` with the published slugs and assert these routes resolve:

```js
{
  shark: "/brands/shark",
  wybot: "/brands/wybot",
  beatbot: "/brands/beatbot",
  husqvarna: "/brands/husqvarna",
  "segway-navimow": "/brands/segway-navimow"
}
```

- [ ] **Step 4: Run the focused test in RED**

Run:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
  --experimental-strip-types \
  --import ./tests/register-path-alias.mjs \
  --test \
  --test-name-pattern='exact sixteen|second batch|competitor links' \
  tests/brandIntelligence.test.mjs
```

Expected: FAIL because the six JSON records and brand asset directories do not exist.

- [ ] **Step 5: Commit the RED gate**

```bash
git add tests/brandIntelligence.test.mjs
git commit -m "test: define second brand profile release gate"
```

---

### Task 2: Build Shark and Narwal Profiles

**Files:**

- Create: `content/brands/shark.json`
- Create: `content/brands/narwal.json`
- Create: `public/images/brands/shark/logo.webp`
- Create: `public/images/brands/shark/hero-cleaning-portfolio.webp`
- Create: `public/images/brands/narwal/logo.webp`
- Create: `public/images/brands/narwal/hero-cleaning-robot-portfolio.webp`
- Reuse or create two to three section visuals per profile.
- Test: `tests/brandIntelligence.test.mjs`

**Interfaces:**

- Consumes: the `BrandProfile` JSON shape in `lib/brands.ts` and published articles matched through `name` and `aliases`.
- Produces: `/brands/shark` and `/brands/narwal`, plus active Shark competitor links from BISSELL, Dyson and Tineco.

- [ ] **Step 1: Refresh primary evidence**

For Shark, verify the latest SharkNinja annual report or 20-F, current proxy statement, official Shark product pages, current support or warranty pages and the existing WCB ownership research.

For Narwal, verify the official company page, current founder or leadership statement, current robot-vacuum portfolio, regional support terms and model-specific compliance or manufacturer evidence.

Record every used source directly in the profile `sources` array with stable IDs and `accessedAt: "2026-07-30"`.

- [ ] **Step 2: Build the Shark profile**

Use:

```json
{
  "status": "published",
  "slug": "shark",
  "name": "Shark",
  "aliases": ["SharkNinja", "SharkClean", "Shark Home"],
  "logoImage": "/images/brands/shark/logo.webp",
  "heroImage": "/images/brands/shark/hero-cleaning-portfolio.webp"
}
```

The ownership summary must state that Shark is a consumer brand within listed SharkNinja, not a standalone public company. Use existing WCB visuals where accurate:

- `/images/blog/sharkninja-js-global-joyoung-relationship-map.webp`
- `/images/blog/shark-vs-dyson-cordless-platforms.webp`
- `/images/blog/tineco-shark-hydrovac-floor-washer-architecture.webp`

- [ ] **Step 3: Build the Narwal profile**

Use:

```json
{
  "status": "published",
  "slug": "narwal",
  "name": "Narwal",
  "aliases": ["Narwal Robotics", "Yunjing Intelligence", "云鲸智能"],
  "logoImage": "/images/brands/narwal/logo.webp",
  "heroImage": "/images/brands/narwal/hero-cleaning-robot-portfolio.webp"
}
```

The ownership summary must distinguish Yunjing group entities from Tencent, ByteDance and other financing participants. Use:

- `/images/blog/narwal-yunjing-company-manufacturing-map.webp`
- `/images/blog/narwal-vs-ecovacs-robot-vacuums.webp`
- `/images/blog/roborock-vs-narwal-robot-vacuums.webp`

- [ ] **Step 4: Process official assets**

Use Sharp to contain the official logos on transparent canvases at a minimum width of 600 px. Crop product imagery to 1600 × 1000 without adding marketing copy. Preserve source URLs in `logoSourceUrl` and in the relevant `sources` entries.

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm run test:brands
```

Expected: the two new profiles validate; the release gate remains red only for the four missing profiles.

Commit:

```bash
git add content/brands/shark.json content/brands/narwal.json \
  public/images/brands/shark public/images/brands/narwal
git commit -m "feat: add Shark and Narwal brand profiles"
```

---

### Task 3: Build WYBOT and Beatbot Profiles

**Files:**

- Create: `content/brands/wybot.json`
- Create: `content/brands/beatbot.json`
- Create: `public/images/brands/wybot/logo.webp`
- Create: `public/images/brands/wybot/hero-pool-robot-portfolio.webp`
- Create: `public/images/brands/beatbot/logo.webp`
- Create: `public/images/brands/beatbot/hero-pool-robot-portfolio.webp`
- Reuse or create two to three section visuals per profile.
- Test: `tests/brandIntelligence.test.mjs`

**Interfaces:**

- Consumes: the same `BrandProfile` JSON contract and pool-robot WCB articles.
- Produces: `/brands/wybot` and `/brands/beatbot`, plus active related links from Aiper and Maytronics.

- [ ] **Step 1: Refresh primary evidence**

For WYBOT, verify WYBOTICS' latest official filing or listing application, company page, current product catalog, regional support terms and model-level manufacturer records.

For Beatbot, verify Xingmai's current operating identity, official founder statement, current product portfolio, dealer or channel pages, warranty terms and model-level compliance records.

- [ ] **Step 2: Build both profiles**

Use canonical identity records:

```json
{
  "wybot": {
    "aliases": ["WYBOTICS", "Wangyuan", "Winny"],
    "logoImage": "/images/brands/wybot/logo.webp",
    "heroImage": "/images/brands/wybot/hero-pool-robot-portfolio.webp"
  },
  "beatbot": {
    "aliases": ["Xingmai Innovation", "Xingmai", "星迈创新"],
    "logoImage": "/images/brands/beatbot/logo.webp",
    "heroImage": "/images/brands/beatbot/hero-pool-robot-portfolio.webp"
  }
}
```

The WYBOT page must separate own-brand production, Winny and ODM work. The Beatbot page must not convert financing participants into a parent-company claim.

- [ ] **Step 3: Configure section visuals**

WYBOT:

- `/images/blog/wybot-wybotics-wangyuan-manufacturer-cover.webp`
- `/images/blog/wybot-regional-odm-sku-responsibility-map.webp`
- `/images/blog/aiper-wybot-procurement-service-map.webp`

Beatbot:

- `/images/blog/beatbot-xingmai-ownership-cover.webp`
- `/images/blog/beatbot-global-entity-manufacturing-map.webp`
- `/images/blog/aiper-beatbot-procurement-service-map.webp`

- [ ] **Step 4: Run tests and commit**

Run `npm run test:brands`. Expected: four new profiles validate; the release gate remains red only for Husqvarna and Segway Navimow.

Commit:

```bash
git add content/brands/wybot.json content/brands/beatbot.json \
  public/images/brands/wybot public/images/brands/beatbot
git commit -m "feat: add WYBOT and Beatbot brand profiles"
```

---

### Task 4: Build Husqvarna and Segway Navimow Profiles

**Files:**

- Create: `content/brands/husqvarna.json`
- Create: `content/brands/segway-navimow.json`
- Create: `public/images/brands/husqvarna/logo.webp`
- Create: `public/images/brands/husqvarna/hero-automower-portfolio.webp`
- Create: `public/images/brands/segway-navimow/logo.webp`
- Create: `public/images/brands/segway-navimow/hero-robot-mower-portfolio.webp`
- Reuse or create two to three section visuals per profile.
- Test: `tests/brandIntelligence.test.mjs`

**Interfaces:**

- Consumes: the `BrandProfile` contract and existing mower-company research.
- Produces: `/brands/husqvarna` and `/brands/segway-navimow`, plus active related links from Mammotion.

- [ ] **Step 1: Refresh primary evidence**

For Husqvarna, verify the 2025 annual report, current shareholder table, group history, global-presence manufacturing information, Automower product pages and warranty route.

For Segway Navimow, verify Ninebot's latest annual report, Willand ownership and trademark evidence, current product manuals, regional sales entities, dealer routes and warranty terms.

- [ ] **Step 2: Build both profiles**

Use:

```json
{
  "husqvarna": {
    "aliases": ["Husqvarna Group", "Husqvarna AB", "Automower"],
    "logoImage": "/images/brands/husqvarna/logo.webp",
    "heroImage": "/images/brands/husqvarna/hero-automower-portfolio.webp"
  },
  "segway-navimow": {
    "aliases": ["Navimow", "Segway Navimow", "Willand", "Ninebot"],
    "logoImage": "/images/brands/segway-navimow/logo.webp",
    "heroImage": "/images/brands/segway-navimow/hero-robot-mower-portfolio.webp"
  }
}
```

Husqvarna must separate outdoor equipment from licensed motorcycle and sewing-machine uses. Segway Navimow must state the verified Ninebot group interest and must not describe the mower operation as wholly owned.

- [ ] **Step 3: Configure section visuals**

Husqvarna:

- `/images/blog/husqvarna-automower-ownership-map-cover.webp`
- `/images/blog/husqvarna-automower-manufacturing-region-checklist.webp`
- `/images/blog/segway-navimow-vs-husqvarna-automower.webp`

Segway Navimow:

- `/images/blog/segway-navimow-ninebot-willand-ownership-cover.webp`
- `/images/blog/navimow-regional-entities-procurement-check.webp`
- `/images/blog/luba-navimow-procurement-verification-map.webp`

- [ ] **Step 4: Run tests and commit**

Run:

```bash
npm run test:brands
```

Expected: all 16 profiles validate and the complete brand suite passes.

Commit:

```bash
git add content/brands/husqvarna.json content/brands/segway-navimow.json \
  public/images/brands/husqvarna public/images/brands/segway-navimow
git commit -m "feat: add Husqvarna and Navimow brand profiles"
```

---

### Task 5: Verify Article Relationships and Visual Quality

**Files:**

- Modify: `tests/brandIntelligence.test.mjs`
- Modify: a new profile JSON only when alias correction is required by a real published article.

**Interfaces:**

- Consumes: all 16 profiles and the current `getInsights()` collection.
- Produces: an exact article-relationship map and asset-quality gate for the complete collection.

- [ ] **Step 1: Capture actual new primary-brand relationships**

Run a Node script using `getInsights()` after the six profiles exist and print every article whose `primaryBrands` contains a new slug. Add those exact entries to `expectedPrimaryBrands`; do not assign articles manually in frontmatter.

- [ ] **Step 2: Require at least three article relationships per new profile**

For each new slug, count articles where the slug appears in `primaryBrands` or `relatedBrands`:

```js
assert.ok(
  realArticles.filter((article) =>
    [...article.primaryBrands, ...article.relatedBrands].includes(slug)
  ).length >= 3,
  `${slug} must have at least three related articles`
);
```

- [ ] **Step 3: Run asset inspection**

Use Sharp to verify:

- every logo decodes with alpha;
- every hero is exactly 1600 × 1000;
- every portrait, when present, is 720 × 840;
- all configured visual files exist;
- no hero or logo exceeds 250 KB.

- [ ] **Step 4: Run the brand suite and commit**

Run `npm run test:brands`. Expected: PASS with zero failures.

Commit:

```bash
git add tests/brandIntelligence.test.mjs content/brands
git commit -m "test: verify sixteen brand intelligence profiles"
```

---

### Task 6: Full Verification and Preview Release

**Files:**

- Verify all changed profile, test and asset files.
- Do not add browser screenshots to git.

**Interfaces:**

- Consumes: the complete branch.
- Produces: one GitHub branch commit set and one Vercel Preview ready for approval.

- [ ] **Step 1: Run static checks**

```bash
node -e 'const fs=require("fs"); for (const f of fs.readdirSync("content/brands").filter(f=>f.endsWith(".json"))) JSON.parse(fs.readFileSync("content/brands/"+f,"utf8")); console.log("brand JSON valid")'
git diff --check
git status --short
```

- [ ] **Step 2: Run the full test suite**

```bash
npm run test:analytics &&
npm run test:lead &&
npm run test:blog &&
npm run test:brands &&
npm run test:homepage &&
npm run test:inquiry &&
npm run test:insights &&
npm run test:blog-landing
```

Expected: every test passes with zero failures.

- [ ] **Step 3: Run the production build**

```bash
npm run build
```

Expected: exit code 0 and all static pages generated.

- [ ] **Step 4: Check local pages in a real browser**

Start the app on an unused localhost port. With Playwright CLI, check `/brands` and all six routes at 1440 × 1100 and 390 × 844. Verify:

- directory count is 16;
- all official logos load;
- every new hero reports 1600 × 1000 natural dimensions;
- no page has horizontal overflow;
- section navigation has seven links;
- browser console and page error collections are empty.

- [ ] **Step 5: Push and verify Vercel Preview**

```bash
git push -u origin codex/brand-profiles-batch-02
```

Wait for the Git-triggered preview. Repeat the six-route desktop and mobile checks against the preview URL. Report the preview, commit, test count and build result, then request the single production approval required by the repository release rule.
