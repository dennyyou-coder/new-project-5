# WCB First Ten Brand Profiles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish ten source-backed English brand intelligence profiles and explicitly connect at least three existing WCB articles to each profile.

**Architecture:** Execute the brand-platform plan first. Add one JSON profile per brand, keep it in `draft` during research, add explicit `primary_brands` and `related_brands` fields to selected article frontmatter, then change the profile to `published` only after source, content, image, and build checks pass.

**Tech Stack:** WCB brand JSON schema from `lib/brands.ts`, existing MDX insight files, existing local article images, Node.js tests, Next.js production build.

## Global Constraints

- Execute `2026-07-29-wcb-brand-intelligence-platform.md` Tasks 1–4 before this plan.
- Do not rewrite article titles, descriptions, dates, categories, tags, body copy, image paths, CTA, FAQ, or JSON-LD.
- Article edits are limited to `primary_brands` and `related_brands` frontmatter.
- Every profile needs at least three independent, reliable external sources; WCB articles do not count toward this minimum.
- Prefer company sites, exchange/regulatory filings, annual reports, prospectuses, formal press releases, official registries, and attributable management interviews.
- Record the exact source URL, publisher, title, publication date when available, and actual access date.
- Separate WCB analysis from reported facts.
- Omit facts that cannot be verified. Use “not publicly disclosed” only when the absence itself matters to buyers.
- Do not infer legal ownership from ecosystem membership, investment, distribution, minority stakes, manufacturing, or co-branding.
- Do not claim a manufacturing location without a dated source and clear entity/product scope.
- Set `publishedAt` and `lastModified` to the actual first publication time in ISO 8601 with `+08:00`.
- Set `lastVerified` and every source `accessedAt` to the actual verification date.
- Adding article relationships alone does not change `lastVerified` or `lastModified` after initial publication.
- Use only the existing local hero images listed below; do not download, generate, or invent replacement assets in this phase.
- Keep the primary CTA editorial and subscription-oriented.
- Do not push or deploy until the full local quality gate passes.

---

## Source Review Protocol

For every brand:

1. Resolve the exact operating brand, legal company, parent entity, and important aliases.
2. Open the current official corporate site and record the exact URL used.
3. Find the latest available official filing, annual report, exchange announcement, registry record, or equivalent legal disclosure.
4. Add at least one separate official product, channel, manufacturing, investor, or management source.
5. Compare dates and entity scope across sources.
6. Mark WCB interpretation in `competitivePosition.summary`; keep reported facts in the other sections.
7. Check every development’s `sourceIds` against an existing source entry.
8. Keep `status: "draft"` until the profile and its three article relationships pass the build.

If reliable sources disagree, state both dated positions in the profile and avoid resolving the disagreement without evidence.

---

## Approved Article and Image Matrix

| Brand slug | Hero image | Three required primary WCB articles |
|---|---|---|
| `roborock` | `/images/insights/roborock-ipo-prospectus-signals-cover.jpg` | `is-roborock-owned-by-xiaomi`, `roborock-ipo-prospectus-signals`, `roborock-channel-shift-online-to-offline-experience` |
| `dreame` | `/images/insights/dreame-douyin-counterattack-against-tineco-cover.jpg` | `is-dreame-owned-by-xiaomi`, `dreame-rise-to-10-billion-in-five-years`, `dreame-new-disruptor-in-vacuums` |
| `ecovacs` | `/images/insights/ecovacs-2019-and-industry-landscape-shift-cover.jpg` | `ecovacs-2018-annual-report-signals`, `ecovacs-invests-in-battery-cell-factory`, `ecovacs-at-a-crossroads` |
| `dyson` | `/images/insights/dyson-at-a-crossroads-cover.jpg` | `who-owns-dyson-james-dyson-singapore-manufacturing`, `where-are-dyson-vacuums-made`, `dyson-at-a-crossroads` |
| `tineco` | `/images/insights/tineco-lacks-innovation-cover.jpg` | `who-owns-tineco-ecovacs-group`, `tineco-lacks-innovation`, `tineco-vs-bissell-crosswave-floor-washers` |
| `irobot` | `/images/insights/irobot-at-the-crossroads-cover.jpg` | `who-owns-irobot-roomba-picea-robotics`, `irobot-financial-crisis`, `irobot-decline-and-the-new-robot-vacuum-order` |
| `bissell` | `/images/insights/bissell-crosswave-hard-floor-washer-logic-cover.jpg` | `who-owns-bissell-family-sanitaire`, `bissell-crosswave-hard-floor-washer-logic`, `bissell-robot-vacuums-flexclean-strategy` |
| `aiper` | `/images/insights/aiper-fluidra-pool-robotics-alliance-cover.jpg` | `who-owns-aiper-fluidra-stake`, `aiper-fluidra-pool-robotics-alliance`, `aiper-vs-wybot-fluidra-wybotics` |
| `maytronics` | `/images/insights/maytronics-robotic-pool-cleaner-reinvention-cover.jpg` | `who-makes-dolphin-pool-cleaners-maytronics`, `maytronics-robotic-pool-cleaner-reinvention`, `dolphin-vs-aiper-maytronics-fluidra` |
| `mammotion` | `/images/blog/luba-mammotion-songling-agilex-company-map-cover.webp` | `who-makes-luba-robot-mowers-mammotion-agilex`, `mammotion-luba-vs-yuka-robot-mowers`, `commercial-robotic-mower-market-navimow-mammotion` |

All image paths must exist before the profile changes to `published`.

---

### Task 1: Roborock, Dreame, and Ecovacs profiles

**Files:**

- Create: `content/brands/roborock.json`
- Create: `content/brands/dreame.json`
- Create: `content/brands/ecovacs.json`
- Modify:
  - `content/insights/is-roborock-owned-by-xiaomi.mdx`
  - `content/insights/roborock-ipo-prospectus-signals.mdx`
  - `content/insights/roborock-channel-shift-online-to-offline-experience.mdx`
  - `content/insights/is-dreame-owned-by-xiaomi.mdx`
  - `content/insights/dreame-rise-to-10-billion-in-five-years.mdx`
  - `content/insights/dreame-new-disruptor-in-vacuums.mdx`
  - `content/insights/ecovacs-2018-annual-report-signals.mdx`
  - `content/insights/ecovacs-invests-in-battery-cell-factory.mdx`
  - `content/insights/ecovacs-at-a-crossroads.mdx`

**Interfaces:**

- Consumes: `BrandProfile` schema and approved image/article matrix.
- Produces: three independently publishable `/brands/{slug}` pages.

- [ ] **Step 1: Create three draft JSON profiles**

Use every required `BrandProfile` field. Start with:

```json
"status": "draft"
```

Brand-specific editorial checks:

- Roborock: distinguish Xiaomi investment/ecosystem history from current legal ownership; verify the listed-company entity and current management.
- Dreame: distinguish Dreame, MOVA, Xiaomi ecosystem participation, investment, and legal ownership.
- Ecovacs: distinguish ECOVACS Robotics, the listed entity, and Tineco; identify which facts apply to the group and which apply to one brand.

Each `competitivePosition.summary` must address product breadth, route to market, and the strategic pressure visible in WCB’s existing reporting.

- [ ] **Step 2: Add explicit primary-brand frontmatter**

Add one line to each of the nine files:

```yaml
primary_brands: ["roborock"]
```

Use `dreame` or `ecovacs` in the corresponding files. Keep all existing frontmatter and body content unchanged.

- [ ] **Step 3: Run the focused tests while profiles remain drafts**

Run:

```bash
npm run test:brands
```

Expected: PASS; draft profiles do not appear publicly.

- [ ] **Step 4: Complete source and content review**

For each profile verify:

- three or more qualifying external sources;
- ownership language matches the legal evidence;
- at least one product portfolio entry;
- at least one manufacturing/supply-chain statement;
- at least one market/channel statement;
- WCB analysis is visibly distinct from sourced fact;
- hero image and alt text are accurate;
- dates and source IDs are valid.

- [ ] **Step 5: Publish the profiles and build**

Change each profile to:

```json
"status": "published"
```

Use the actual initial publication timestamps, then run:

```bash
npm run test:brands
npm run build
```

Expected: PASS; build output includes `/brands/roborock`, `/brands/dreame`, and `/brands/ecovacs`.

- [ ] **Step 6: Commit**

```bash
git add content/brands/roborock.json content/brands/dreame.json content/brands/ecovacs.json \
  content/insights/is-roborock-owned-by-xiaomi.mdx \
  content/insights/roborock-ipo-prospectus-signals.mdx \
  content/insights/roborock-channel-shift-online-to-offline-experience.mdx \
  content/insights/is-dreame-owned-by-xiaomi.mdx \
  content/insights/dreame-rise-to-10-billion-in-five-years.mdx \
  content/insights/dreame-new-disruptor-in-vacuums.mdx \
  content/insights/ecovacs-2018-annual-report-signals.mdx \
  content/insights/ecovacs-invests-in-battery-cell-factory.mdx \
  content/insights/ecovacs-at-a-crossroads.mdx
git commit -m "Publish first floorcare brand intelligence profiles"
```

---

### Task 2: Dyson, Tineco, iRobot, and Bissell profiles

**Files:**

- Create:
  - `content/brands/dyson.json`
  - `content/brands/tineco.json`
  - `content/brands/irobot.json`
  - `content/brands/bissell.json`
- Modify the twelve matching MDX files from the approved matrix.

**Interfaces:**

- Consumes: the same validated JSON and MDX relationship interfaces.
- Produces: four additional published brand pages.

- [ ] **Step 1: Create four draft profiles**

Brand-specific editorial checks:

- Dyson: separate the consumer brand, relevant group entities, family control, headquarters, engineering operations, and dated manufacturing locations.
- Tineco: explain the Ecovacs group relationship without treating the two consumer brands as the same operating entity.
- iRobot: verify ownership and operating status as of the actual execution date; older public-company facts must be dated and not presented as current.
- Bissell: verify family ownership, BISSELL company entities, and the relationship to Sanitaire before using parent/sub-brand language.

- [ ] **Step 2: Add the exact MDX relationships**

Add:

```yaml
primary_brands: ["dyson"]
```

to the three Dyson files; repeat for Tineco, iRobot, and Bissell.

For `tineco-vs-bissell-crosswave-floor-washers.mdx`, use:

```yaml
primary_brands: ["tineco", "bissell"]
```

If the file is already counted elsewhere for Bissell, the loader must deduplicate it by slug.

- [ ] **Step 3: Verify drafts remain hidden**

Run:

```bash
npm run test:brands
```

Expected: PASS.

- [ ] **Step 4: Complete the source review and publish**

Apply the Source Review Protocol, then change all four profiles to `published` with actual publication and verification dates.

- [ ] **Step 5: Run tests and build**

Run:

```bash
npm run test:brands
npm run build
```

Expected: PASS; seven total brand routes appear.

- [ ] **Step 6: Commit**

Stage only the four brand JSON files and the twelve named article files, then:

```bash
git commit -m "Publish established floorcare brand profiles"
```

---

### Task 3: Aiper, Maytronics, and Mammotion profiles

**Files:**

- Create:
  - `content/brands/aiper.json`
  - `content/brands/maytronics.json`
  - `content/brands/mammotion.json`
- Modify the nine matching MDX files from the approved matrix.

**Interfaces:**

- Consumes: the same validated JSON and MDX relationship interfaces.
- Produces: three outdoor-robotics brand pages and ten total published profiles.

- [ ] **Step 1: Create three draft profiles**

Brand-specific editorial checks:

- Aiper: state Fluidra’s relationship using the exact dated ownership or investment evidence; do not describe a minority stake or distribution alliance as full control.
- Maytronics: use Maytronics as the page entity and Dolphin as the principal product-brand alias; do not create `/brands/dolphin`.
- Mammotion: distinguish the Mammotion brand, legal operating entities, Songling/AgileX history, product manufacturing, and distribution entities.

- [ ] **Step 2: Add the exact MDX relationships**

Add the corresponding single-slug `primary_brands` line to each selected article.

For `dolphin-vs-aiper-maytronics-fluidra.mdx`, use:

```yaml
primary_brands: ["maytronics", "aiper"]
```

Use `maytronics` for Dolphin-focused content because `/brands/dolphin` does not exist.

- [ ] **Step 3: Verify drafts remain hidden**

Run:

```bash
npm run test:brands
```

Expected: PASS.

- [ ] **Step 4: Complete the source review and publish**

Apply the Source Review Protocol, then change all three profiles to `published` with actual publication and verification dates.

- [ ] **Step 5: Run tests and build**

Run:

```bash
npm run test:brands
npm run build
```

Expected: PASS; ten total brand routes appear.

- [ ] **Step 6: Commit**

Stage only the three brand JSON files and nine named article files, then:

```bash
git commit -m "Publish pool and lawn robotics brand profiles"
```

---

### Task 4: Cross-brand editorial and source audit

**Files:**

- Modify only brand JSON or selected MDX relationship fields that fail this audit.

**Interfaces:**

- Consumes: ten published profiles and their article relationships.
- Produces: a consistent, non-duplicative first release.

- [ ] **Step 1: Compare identity and relationship terminology**

Review all ten profiles side by side. Use these words consistently:

- `owned by` only for verified control;
- `minority investment` or exact stake for non-control investments;
- `ecosystem relationship` for commercial/ecosystem participation;
- `distributed by` for channel arrangements;
- `manufactured by` only when the producer and product scope are verified;
- `brand of` only when the company-brand relationship is evidenced.

- [ ] **Step 2: Check source independence and freshness**

For each brand, confirm:

- at least three external sources;
- sources are not three URLs repeating the same press release;
- time-sensitive ownership, management, manufacturing, and financial statements use the newest available official evidence;
- historical WCB conclusions are dated when the underlying facts are historical.

- [ ] **Step 3: Check page differentiation**

Each profile must have:

- a unique `headline`, `description`, and `metaDescription`;
- a brand-specific `competitivePosition.summary`;
- different ownership/manufacturing/channel facts;
- no repeated generic paragraph used across brands.

- [ ] **Step 4: Check buyer usefulness**

From each page, a buyer must be able to identify:

- the company behind the brand;
- the product categories it competes in;
- where public evidence places manufacturing or supply-chain responsibility;
- the main markets or channels disclosed;
- which competitors matter and why;
- when the page was last verified.

- [ ] **Step 5: Run automated checks**

Run:

```bash
npm run test:brands
npm run verify:content-classification
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit audit corrections**

```bash
git add content/brands content/insights
git commit -m "Audit first ten brand intelligence profiles"
```

Skip the commit if the audit required no changes.

---

### Task 5: Search baseline and Preview readiness

**Files:**

- Create: `docs/brand-intelligence/2026-07-29-search-baseline.md`
- Modify only files required by failed local verification.

**Interfaces:**

- Consumes: ten locally verified brand routes.
- Produces: a dated measurement baseline and a branch ready for user-approved Preview.

- [ ] **Step 1: Record the pre-launch Search Console baseline**

For the previous complete 28-day period, record:

- total WCB organic clicks and impressions;
- queries containing each of the ten brand names and important aliases;
- current WCB pages receiving those queries;
- average position and click-through rate where Search Console reports them;
- exact export date and date range.

If Search Console access is unavailable, state that clearly in the document and record the access blocker; do not invent zero values.

- [ ] **Step 2: Record the post-launch measurement schedule**

Add check dates relative to production launch:

- day 30: crawl, indexing, errors, and first queries;
- day 60–90: impressions, rankings, organic visits, and brand-page-to-article reading;
- month 6: expansion decision for the next brand batch.

- [ ] **Step 3: Perform final local route checks**

Verify:

- `/brands`
- all ten approved detail URLs
- one unknown brand URL returns 404
- every hero image loads
- every external source opens to the cited evidence
- every selected article links to its valid brand page
- Maytronics includes Dolphin as an alias and `/brands/dolphin` does not exist
- no page uses `ProfilePage`

- [ ] **Step 4: Run the final local gate**

Run:

```bash
npm run test:brands
npm run verify:content-classification
npm run build
```

Expected: PASS.

- [ ] **Step 5: Commit the baseline**

```bash
git add docs/brand-intelligence/2026-07-29-search-baseline.md
git commit -m "Record brand intelligence search baseline"
```

- [ ] **Step 6: Stop for external actions**

Report the commit list and local evidence. Ask for approval before pushing the branch and creating a Vercel Preview. A Preview approval is not production approval. Production still requires a separate explicit user decision after Preview validation.
