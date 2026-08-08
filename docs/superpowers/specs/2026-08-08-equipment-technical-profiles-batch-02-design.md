# Equipment Technical Profiles Batch 02 Design

## Objective

Expand the approved World Clean Biz equipment-intelligence system with three adjacent professional-cleaning categories:

- `/equipment/floor-sweeper`
- `/equipment/carpet-extractor`
- `/equipment/wet-dry-vacuum`

The batch reuses the published Floor Scrubber profile contract and rendered page. It creates database pages only: no SEO articles, ownership pages, supplier rankings, or component-detail routes.

## Selection Rationale

The three profiles cover distinct procurement jobs while remaining close enough to the Floor Scrubber pilot to reuse its evidence model and visual system.

- Floor Sweeper covers dry debris collection, dust control, hopper and brush-system selection.
- Carpet Extractor covers spray extraction, agitation, solution recovery, drying and textile-surface constraints.
- Wet & Dry Vacuum covers portable wet/dry pickup, airflow and vacuum boundaries, filtration, container handling and hazardous-material exclusions.

## Shared Page Contract

Each profile must include:

- a precise definition, included scope and excluded scope;
- one official hero image, two official content photographs and one WCB component-verification diagram with a mobile version;
- key facts, working-system nodes, variants, performance metrics and application-fit rows;
- component families without links to unpublished component pages;
- 6–8 representative models across at least four published brand profiles;
- procurement decisions, engineering checks, directly applicable standards, technical developments and at least five primary sources;
- explicit `evidence`, `scope`, `sourceIds`, `verifiedAt`, `limitations` and buyer-action boundaries.

All three records start as `draft`. They become `published` only after focused tests, production build, desktop review and 390 px review pass. The user's standing instruction authorizes publication after those gates without another content-approval pause.

## Profile Scope

### Floor Sweeper

Included:

- manual push sweepers;
- powered walk-behind vacuum sweepers;
- compact and industrial ride-on sweepers used on commercial floors and paved areas.

Excluded:

- road-legal municipal sweepers;
- scrubber-sweepers when sweeping cannot be evaluated separately;
- household robotic vacuums and ordinary manual brooms.

Representative models: Kärcher KM 70/20 C and KM 75/40 W Bp, Tennant S16, Nilfisk SW900, Hako Sweepmaster M600 and Sweepmaster 1200 RH, TASKI balimat 2300.

Core official sources include Tennant S16 specifications and operator manual, Nilfisk SW900 brochure, Kärcher product specifications, Hako Sweepmaster product pages and 2026 brochure, TASKI balimat 2300 information sheet, IEC 60335-2-72:2021 and IEC 62885-9:2019.

### Carpet Extractor

Included:

- portable spray extractors;
- self-contained brush extractors;
- dual extraction/encapsulation machines where both modes are documented.

Excluded:

- steam-only cleaners;
- dry compound machines without extraction;
- household spot cleaners and truck-mount systems outside the portable commercial-machine scope.

Representative models: Tennant E5, Nilfisk ES300, Kärcher BRC 30/15 C and BRC 40/22 C, TASKI procarpet 30 and procarpet 45, Truvox Hydromist Compact.

Core official sources include the Tennant E5 operator manual, Nilfisk ES300 product page and catalogue, Kärcher BRC product pages, TASKI procarpet product pages and information sheets, Truvox Hydromist manual and IEC 60335-2-68:2021.

### Wet & Dry Vacuum

Included:

- portable commercial vacuums documented for wet pickup, dry pickup, or both;
- corded and battery variants;
- trolley, drain, tip-container and front-squeegee configurations where officially documented.

Excluded:

- household shop vacuums;
- fixed central systems;
- ordinary industrial vacuums without documented liquid pickup;
- use with combustible dust, flammable liquids, hazardous locations or hazardous dust unless the exact machine is approved for that duty.

Representative models: Tennant V-WD-9 and V-WD-24P, Nilfisk VL500 35 and VL500 55, Kärcher NT 48/1 and NT 55/2 Tact2 Me I, TASKI vacumat 22/22T and vacumat 44T.

Core official sources include Tennant wet/dry-vacuum brochures, Nilfisk VL500 product pages and brochure, Kärcher NT product pages, TASKI vacumat pages and manual, IEC 60335-2-69:2021 and OSHA combustible-dust guidance.

## Visual Sources

Official visual assets must be downloaded from the exact manufacturer source listed in each record and converted to local WebP without redrawing products.

- Floor Sweeper: Hako Sweepmaster 1200 RH factory-hall application image, Kärcher KM 75/40 W Bp product image and TASKI balimat 6500 product image.
- Carpet Extractor: Nilfisk ES300 in-use lobby image, Kärcher BRC 40/34 C product image and TASKI procarpet 30 product image.
- Wet & Dry Vacuum: Kärcher NT 55/2 Tact2 product image, Nilfisk VL500 55 product image and TASKI vacumat 22 product image.

Each WCB diagram identifies the page-specific component-verification zones and includes a visible warning that component-family labels do not establish cross-model compatibility.

## Validation

Acceptance requires:

- three JSON records pass `validateEquipmentProfile`;
- source IDs resolve and brand links point only to published profiles;
- each hero is WebP at least 1600 x 1000 and each official content photo is at least 1500 x 900 after fit-without-distortion processing;
- desktop and 390 px layouts have no horizontal overflow;
- all local and production image paths return successfully;
- `npm run test:equipment`, the complete project test set and `npm run build` pass;
- published routes, equipment directory and sitemap contain all three slugs;
- production release follows GitHub `main` and Vercel Git integration only.

