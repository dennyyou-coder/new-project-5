# Brand Profiles Batch 06 Implementation Plan

**Goal:** Publish evidence-led profiles for BLACK+DECKER, Eureka, Milwaukee, Vax, Oreck and Aquabot without changing the approved Brand Intelligence architecture.

## Task 1: Establish the 40-Profile Release Gate

- [ ] Update `tests/brandIntelligence.test.mjs` to expect the exact 40 slugs.
- [ ] Require all six new logos, 1600 × 1000 heroes, content visuals and three primary articles.
- [ ] Assert the six brand-specific identity boundaries.
- [ ] Run the focused test in RED.

## Task 2: Build BLACK+DECKER and Eureka

- [ ] Refresh official ownership, operating-entity, product and manufacturing evidence.
- [ ] Create both JSON profiles, official logos and product-led heroes.
- [ ] Reuse accurate WCB ownership and responsibility visuals.
- [ ] Tag at least three primary WCB articles per brand.

## Task 3: Build Milwaukee, Vax and Oreck

- [ ] Refresh TTI ownership, subsidiary, product, manufacturing and channel evidence.
- [ ] Keep each brand's role distinct from the TTI parent and sibling brands.
- [ ] Create all three profiles and visual packages.
- [ ] Tag at least three primary WCB articles per brand.

## Task 4: Build Aquabot

- [ ] Refresh Aquatron ownership/manufacturing, BWT parent and Fluidra history evidence.
- [ ] Separate the manufacturer, U.S. seller, importer and warranty roles.
- [ ] Create the profile and visual package.
- [ ] Tag at least three primary WCB articles.

## Task 5: Validate the Complete Batch

- [ ] Run `npm run test:brands`.
- [ ] Run the full test suite and `npm run build`.
- [ ] Review the diff for unrelated changes.
- [ ] Check `/brands` and all six routes at desktop and 390 px.
- [ ] Confirm images, overflow, links, metadata, JSON-LD and console state.

## Task 6: Preview and Production

- [ ] Push `codex/brand-profiles-batch-06`.
- [ ] Create and validate one Vercel Preview.
- [ ] Request one explicit approval for the complete production release.
- [ ] After approval, merge to `main`, push and verify `worldcleanbiz.com`.
