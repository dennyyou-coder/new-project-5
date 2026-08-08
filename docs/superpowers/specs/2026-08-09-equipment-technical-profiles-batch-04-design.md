# Equipment Technical Profiles Batch 04 Design

## Objective

Publish three evidence-backed equipment database pages using the approved World Clean Biz technical-profile system:

- `/equipment/commercial-dry-vacuum`
- `/equipment/backpack-vacuum`
- `/equipment/commercial-steam-cleaner`

These records extend professional vacuum and steam-cleaning coverage without creating articles, ownership records, component profiles, or a new page architecture.

## Identity boundaries

### Commercial Dry Vacuum

Cover corded commercial dry-only canister and tub vacuums intended for ordinary indoor dust and debris. Exclude wet pickup, hazardous dust without exact certification, central extraction, domestic stick vacuums, upright vacuums, and backpack vacuums. Do not treat motor input power, airflow, vacuum, filtration class, sound level, or container volume as interchangeable performance measures.

### Backpack Vacuum

Cover commercial corded and battery backpack vacuums carried by an operator. Exclude handheld vacuums, ordinary canisters, hazardous-dust duties without exact certification, and blower use unless the exact model documentation permits it. Separate machine mass, battery mass, runtime, airflow, vacuum, sound and ergonomic fit.

### Commercial Steam Cleaner

Cover professional steam-only and steam-vacuum machines used for surface cleaning. Exclude pressure washers, carpet extractors, domestic steam mops, medical-device sterilization, food-contact sanitation claims, and disinfection claims not supported by the exact machine, method and validation record. Separate boiler pressure, steam temperature, heat-up time, tank architecture and vacuum-recovery functions.

## Data and evidence design

Each JSON record follows `content/equipment/README.md` and contains one official Hero, two official explanatory photos, one responsive WCB verification diagram, at least five primary sources, six to eight representative models, at least four published brand links, explicit model and market scope, engineering checks, procurement decisions and standards boundaries.

Official manufacturer pages, manuals, specifications and IEC catalogue records are the evidence layer. WCB conclusions remain visibly labelled as assessment and never convert a model claim into a category-wide fact. No OEM, factory, supplier or cross-model compatibility relationship is inferred.

## Visual design

Reuse the current equipment layout unchanged. Each profile receives:

- `hero.webp` at 1600 x 1000 from an official product or application source;
- two official WebP content images at 1500 x 900 or larger;
- desktop `component-verification-map.svg` at 1600 x 1000;
- mobile `component-verification-map-mobile.svg` at 800 x 1600.

Alt text describes only the visible machine or task. Captions identify the official source and state that the pictured configuration does not establish category-wide limits.

## Publication and validation

Records begin as `draft`. Publication requires the focused equipment suite, every project test script, production build, desktop 1440 px review, mobile 390 px review, zero broken images, no horizontal overflow, no new browser errors, Preview readiness, GitHub merge and live sitemap verification. Production deploys only through the GitHub `main` integration.

