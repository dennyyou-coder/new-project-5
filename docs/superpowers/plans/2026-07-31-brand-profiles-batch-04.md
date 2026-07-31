# Brand Profiles Batch 04 Implementation Plan

**Goal:** Publish evidence-led profiles for Bosch Home Appliances, Philips Home Appliances, Midea, Sunseeker, WORX and Nilfisk without changing the approved Brand Intelligence architecture.

## Task 1: Establish the 28-Profile Release Gate

- [ ] Update `tests/brandIntelligence.test.mjs` to expect the exact 28 slugs.
- [ ] Require all six new logos, 1600 × 1000 heroes, content visuals and three primary articles.
- [ ] Assert the six brand-specific identity boundaries.
- [ ] Run the focused test in RED.

## Task 2: Build Bosch Home Appliances and Philips Home Appliances

- [ ] Refresh official ownership, licensing, management, product and manufacturing evidence.
- [ ] Create both JSON profiles, official logos and product-led heroes.
- [ ] Reuse accurate WCB ownership and responsibility visuals.
- [ ] Tag at least three primary WCB articles per brand.

## Task 3: Build Midea and Nilfisk

- [ ] Refresh listed-group and post-acquisition evidence.
- [ ] Separate group, brand, factory, seller and model-level claims.
- [ ] Create both profiles and visual packages.
- [ ] Tag at least three primary WCB articles per brand.

## Task 4: Build Sunseeker and WORX

- [ ] Refresh official company, trademark, manufacturing and regional-channel evidence.
- [ ] Encode the Sunseeker naming boundary and WORX / Positec / Landroid relationship.
- [ ] Create both profiles and visual packages.
- [ ] Tag at least three primary WCB articles per brand.

## Task 5: Validate the Complete Batch

- [ ] Run `npm run test:brands`.
- [ ] Run the full test suite and `npm run build`.
- [ ] Review the diff for unrelated changes.
- [ ] Check `/brands` and all six routes at desktop and 390 px.
- [ ] Confirm images, overflow, links, metadata, JSON-LD and console state.

## Task 6: Preview and Production

- [ ] Push `codex/brand-profiles-batch-04`.
- [ ] Create and validate one Vercel Preview.
- [ ] Request one explicit approval for the complete production release.
- [ ] After approval, merge to `main`, push and verify `worldcleanbiz.com`.
