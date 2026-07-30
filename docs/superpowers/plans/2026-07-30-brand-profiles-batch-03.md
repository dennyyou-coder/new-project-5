# Brand Profiles Batch 03 Implementation Plan

**Goal:** Publish evidence-led profiles for Eufy, MOVA, DJI ROMO, Kärcher, Miele and Hoover without changing the approved Brand Intelligence architecture.

**Architecture:** Add six JSON records to `content/brands`, brand-specific local assets under `public/images/brands/{slug}`, and selected `primary_brands` relationships in existing article frontmatter. Reuse the current routes, schema, components, JSON-LD and sitemap.

## Global Constraints

- Publish exactly: `dji-romo`, `eufy`, `hoover`, `karcher`, `miele`, `mova`.
- Use primary or authoritative evidence for material claims.
- Require official transparent WebP logos, exact 1600 × 1000 WebP heroes and two or three content visuals.
- Omit portraits when reliable provenance is unavailable.
- Preserve existing article bodies, components, styles and architecture.
- Work only on `codex/brand-profiles-batch-03` until preview approval.

## Task 1: Establish the 22-Profile Release Gate

- [ ] Update `tests/brandIntelligence.test.mjs` to expect the exact 22 slugs.
- [ ] Require all six new assets, content visuals and three primary articles.
- [ ] Assert the DJI ROMO and Hoover identity boundaries.
- [ ] Run the focused test in RED.
- [ ] Commit the failing release gate.

## Task 2: Build Eufy and MOVA

- [ ] Refresh official ownership, product, regional-service and manufacturing evidence.
- [ ] Create `content/brands/eufy.json` and `content/brands/mova.json`.
- [ ] Process official logos and product-led heroes.
- [ ] Reuse accurate WCB ownership, operations and comparison visuals.
- [ ] Tag at least three primary WCB articles per brand.
- [ ] Run focused tests and commit.

## Task 3: Build DJI ROMO and Hoover

- [ ] Scope DJI ROMO to the cleaning-robot business and regional operating evidence.
- [ ] Encode Hoover's TTI North America and Haier/Candy Europe split explicitly.
- [ ] Create both profiles, logos, heroes and section visuals.
- [ ] Tag at least three primary WCB articles per brand.
- [ ] Run focused tests and commit.

## Task 4: Build Kärcher and Miele

- [ ] Refresh family ownership, current management, product and manufacturing evidence.
- [ ] Create both profiles, logos, heroes and section visuals.
- [ ] Add verified portraits only if provenance is reliable.
- [ ] Tag at least three primary WCB articles per brand.
- [ ] Run focused tests and commit.

## Task 5: Validate the Complete Batch

- [ ] Run `npm run test:brands`.
- [ ] Run the full test suite.
- [ ] Run `npm run build`.
- [ ] Review the JSON and asset diff for accidental unrelated changes.
- [ ] Check `/brands` and all six profiles at desktop and 390 px.
- [ ] Confirm images, layout, links, metadata, JSON-LD and console state.

## Task 6: Preview and Production

- [ ] Push `codex/brand-profiles-batch-03`.
- [ ] Create and validate one Vercel Preview.
- [ ] Request one explicit approval for the complete production release.
- [ ] After approval, merge to `main`, push and verify `worldcleanbiz.com`.
