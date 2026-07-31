# Brand Profiles Batch 05 Implementation Plan

**Goal:** Publish evidence-led profiles for AEG, DEWALT, Greenworks, Ryobi, Polaris and Hayward without changing the approved Brand Intelligence architecture.

## Task 1: Establish the 34-Profile Release Gate

- [ ] Update `tests/brandIntelligence.test.mjs` to expect the exact 34 slugs.
- [ ] Require all six new logos, 1600 × 1000 heroes, content visuals and three primary articles.
- [ ] Assert the six brand-specific identity boundaries.
- [ ] Run the focused test in RED.

## Task 2: Build AEG and DEWALT

- [ ] Refresh official ownership, licensing, management, product and manufacturing evidence.
- [ ] Create both JSON profiles, official logos and product-led heroes.
- [ ] Reuse accurate WCB ownership and responsibility visuals.
- [ ] Tag at least three primary WCB articles per brand.

## Task 3: Build Greenworks and Ryobi

- [ ] Refresh group, investment, licensing and regional-market evidence.
- [ ] Separate the Greenworks / Globe / STIHL and Ryobi / TTI / Kyocera relationships.
- [ ] Create both profiles and visual packages.
- [ ] Tag at least three primary WCB articles per brand.

## Task 4: Build Polaris and Hayward

- [ ] Refresh public-company, brand-portfolio, manufacturing and channel evidence.
- [ ] Separate corporate ownership, regional sellers and exact-product responsibility.
- [ ] Create both profiles and visual packages.
- [ ] Tag at least three primary WCB articles per brand.

## Task 5: Validate the Complete Batch

- [ ] Run `npm run test:brands`.
- [ ] Run the full test suite and `npm run build`.
- [ ] Review the diff for unrelated changes.
- [ ] Check `/brands` and all six routes at desktop and 390 px.
- [ ] Confirm images, overflow, links, metadata, JSON-LD and console state.

## Task 6: Preview and Production

- [ ] Push `codex/brand-profiles-batch-05`.
- [ ] Create and validate one Vercel Preview.
- [ ] Request one explicit approval for the complete production release.
- [ ] After approval, merge to `main`, push and verify `worldcleanbiz.com`.
