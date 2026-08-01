# Brand Directory Logo Scale and Representative Brands

## Goal

Improve the homepage Brand Intelligence showcase so its six official wordmarks are easier to read and the selection represents WCB's main buying categories without implying an independent market ranking.

## Scope

- Replace the six homepage `featuredBrandSlugs` with the approved representative set.
- Enlarge official logos only in `.home-v9-brand-logos` while preserving the full logo canvas and `object-fit: contain` behavior.
- Add a short buying-category label to each featured brand tile so the representative logic is visible to readers.
- Do not change the `/brands` directory, brand ownership data, product evidence, category membership, brand-detail pages or logo assets.

## Representative Set

| Buying category | Homepage representative brand |
| --- | --- |
| Power Tools | Milwaukee |
| Lawn & Garden Equipment | Husqvarna |
| Pool Equipment & Pool Care | Maytronics |
| Floorcare & Home Cleaning | Roborock and Tineco |
| Commercial & Industrial Cleaning | Kärcher |

Floorcare intentionally has two representatives. The set is an editorial navigation aid, not a market-share ranking or commercial endorsement.

## Data and Rendering

- Define the approved homepage selection as objects containing `slug` and a reader-facing category label.
- Resolve each object against published brand profiles in the declared order.
- Render the category label above the existing brand name inside the same homepage link.
- Keep the existing `Explore all {brandProfiles.length} brand profiles` count based on unique published profiles.

## Visual Treatment

- Increase the homepage logo box from 132 × 42 pixels to a larger responsive width and height that remains within the existing tile.
- Keep logos centered, uncropped and free of filters or shadows.
- Preserve the existing tile dimensions and three-column desktop / two-column mobile grid.
- Use a quiet uppercase category label and retain the brand name below it.
- On mobile, both labels wrap safely without horizontal overflow.

## Accessibility and Semantics

- The category label is visible text, not color-only state.
- Existing logo alt text and link targets remain unchanged.
- Tiles remain normal links; no extra nested interactive element is introduced.

## Verification

- Add regression tests for the six approved homepage assignments, rendered category labels and larger logo sizing rules.
- Run the complete brand test suite and production build.
- Verify `/` at desktop and 390px mobile widths, including Logo legibility, tile order, no clipping, no horizontal overflow, one featured-brand link interaction and console health.
