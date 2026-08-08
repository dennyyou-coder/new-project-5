# Equipment Technical Profiles Batch Nine Design

## Goal

Publish three evidence-led equipment database pages for Hot-Water Pressure Washer, Cold-Water Pressure Washer, and Commercial Air Mover while preserving the current equipment-page layout and evidence boundaries.

## Scope

- Create only the three equipment JSON records and their page-local assets.
- Extend the existing equipment regression test for the three exact slugs.
- Do not create or edit articles, ownership pages, brand pages, component pages, shared components, navigation, or global styling.
- Keep component-family references unlinked because no matching component profiles are being created.

## Topic boundaries

### Hot-Water Pressure Washer

The page covers professional high-pressure cleaners with an integrated or manufacturer-defined water-heating system. It distinguishes pump drive from heat source, and separates oil-fired, electrically heated, engine-driven, mobile, and stationary formats. It excludes separate hot boxes, steam-only generators, wash tunnels, and water-jet cutting.

### Cold-Water Pressure Washer

The page covers professional high-pressure cleaners without an integrated water-heating system. It distinguishes electric, engine-driven, mobile, and stationary formats and verifies model-specific inlet-temperature limits. The label “cold-water” must not be interpreted as permission to feed water above the exact manufacturer limit.

### Commercial Air Mover

The page covers portable commercial blowers used to accelerate evaporation after extraction cleaning, spills, or approved water-loss work. It distinguishes centrifugal and compact axial-style formats, airflow direction, speed settings, current draw, daisy-chain limits, and placement. It excludes dehumidifiers, air scrubbers, HVAC blowers, and any unsupported claim that airflow alone completes structural drying.

## Evidence and model requirements

- Each page has at least seven reliable sources, led by current official manufacturer pages, manuals, specifications, and applicable standards.
- Each page includes six to eight representative models across at least four already-published WCB brand profiles.
- Preserve each source unit and reporting boundary. Do not normalize pressure, flow, temperature, airflow, electrical, or productivity claims when test conditions differ.
- No model relationship implies common OEM, factory, component supplier, or cross-model compatibility.

## Visual package

Each page contains one official 1600 x 1000 WebP hero, two useful official 1500 x 900 WebP content images, and desktop/mobile WCB component-verification SVGs. Alt text describes only what is visibly shown. Every official visual records the exact source URL. Diagrams explicitly state that family labels do not establish cross-model compatibility.

## Validation and release

Add the batch-nine expectations before adding production records and observe the equipment test fail because the three profiles are absent. After implementation, run the focused equipment suite, all repository test scripts, content-classification and sourcing-SEO checks, production build, desktop review, 390 px mobile review, Preview validation, PR merge, Vercel production deployment, and live route/image/sitemap checks.

