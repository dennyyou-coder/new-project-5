# Brand Directory Logo Scale and Representative Brands

## Goal

Improve the `/brands` directory so official wordmarks are easier to read and each buying category has an immediate visual anchor without implying an independent market ranking.

## Scope

- Enlarge official logos in brand directory cards while preserving the full logo canvas and `object-fit: contain` behavior.
- Add a featured-representative state to selected cards on the main brand directory and category landing pages.
- Keep all published brands visible in their verified categories.
- Do not change brand ownership data, product evidence, category membership, brand-detail pages or logo assets.

## Representative Set

| Buying category | Representative brand |
| --- | --- |
| Power Tools | Milwaukee |
| Lawn & Garden Equipment | Husqvarna |
| Pool Equipment & Pool Care | Maytronics |
| Floorcare & Home Cleaning | Roborock and Tineco |
| Commercial & Industrial Cleaning | Kärcher |

Floorcare intentionally has two representatives. The set is an editorial navigation aid, not a market-share ranking or commercial endorsement.

## Data and Rendering

- Add `representativeBrandSlugs` to each category definition.
- Validate that every representative belongs to that category and that duplicate entries inside one category are rejected.
- Sort representatives to the beginning of each category while preserving the existing relative order of all remaining profiles.
- Pass an explicit representative flag to `BrandDirectoryCard`; the card must not infer status from brand name or global state.
- Render a short `Category representative` label only on representative cards.

## Visual Treatment

- Reduce the logo-stage padding and apply a modest optical scale so narrow wordmarks become visibly larger.
- Keep logos centered, uncropped and free of filters or shadows.
- Preserve the existing card dimensions so the grid remains stable.
- Representative cards use a stronger blue border, a restrained pale-blue logo stage and the label above the brand name.
- On mobile, the label wraps safely and the grid retains one-column flow without horizontal overflow.

## Accessibility and Semantics

- The representative label is visible text, not color-only state.
- Existing logo alt text and link targets remain unchanged.
- Representative cards remain normal linked articles; no extra nested interactive element is introduced.

## Verification

- Add regression tests for the six representative assignments, representative-first ordering, rendered label and logo sizing rules.
- Run the complete brand test suite and production build.
- Verify `/brands` at desktop and 390px mobile widths, including Logo legibility, card order, no clipping, no horizontal overflow, one representative-card link interaction and console health.

