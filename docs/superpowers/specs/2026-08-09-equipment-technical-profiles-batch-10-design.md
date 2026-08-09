# Equipment Technical Profiles Batch Ten Design

## Goal

Publish three evidence-led household cleaning-equipment pages for Cordless Stick Vacuum, Canister Vacuum Cleaner, and Household Robot Vacuum while preserving the established WCB equipment-page system.

## Why these topics

This batch extends the technical database into high-demand home floorcare without duplicating existing commercial vacuum pages. Each topic has a distinct operating architecture, strong buyer intent, current official product evidence, and at least four already-published WCB brand profiles. Industrial dry-ice, ultrasonic, and parts-washing topics remain deferred because the current representative-model contract cannot yet link four published specialist brands.

## Scope

- Create only the three equipment JSON records and their page-local assets.
- Extend the existing equipment regression test for the three exact slugs.
- Do not create or edit articles, ownership pages, brand pages, component pages, shared components, navigation, or global styling.
- Keep component-family references unlinked because no component profiles are being created.

## Topic boundaries

### Cordless Stick Vacuum

The page covers battery-powered household dry vacuums built around a handheld motor-and-bin unit used with a wand, floor head, or handheld tools. It separates battery voltage, stated runtime, floor-head design, filtration, dust-bin handling, and charging or dock arrangements. It excludes corded stick vacuums, handheld-only vacuums, wet floor washers, carpet extractors, and unsupported equivalence between source-specific suction claims.

### Canister Vacuum Cleaner

The page covers household or similar dry vacuums with the motor, filtration, and collection system in a separate body connected to the cleaning head through a flexible hose and wand. It distinguishes bagged and bagless formats, floor-head systems, filtration, cord reach, and handling. It excludes central-vacuum plants, wet-and-dry tubs, upright vacuums, cordless sticks, industrial dust extractors, and unsupported comparison of motor input with cleaning performance.

### Household Robot Vacuum

The page covers autonomous dry-cleaning robots intended for household or similar indoor floors, including combo products only within their documented vacuuming function. It separates navigation and sensing, pickup system, battery and charging, obstacle and threshold limits, app or local controls, and dock functions. It excludes commercial cleaning robots, pool or window robots, lawn robots, mopping-only machines, and any claim that one navigation or suction number proves whole-home cleaning performance.

## Evidence and model requirements

- Each page has at least seven reliable sources led by current official product pages, manuals, standards, and official compliance material.
- Each page includes six to eight representative models across at least four published WCB brand profiles.
- Preserve every source value and unit. Runtime, suction, airflow, dust pickup, navigation, coverage, noise, and dock claims remain source- and test-method-specific.
- No model row implies shared OEM, factory, component supplier, software stack, or cross-model compatibility.

## Visual package

Each page contains one official 1600 x 1000 WebP hero, two useful official 1500 x 900 WebP content images, and desktop/mobile WCB component-verification SVGs. Alt text states only what is visibly shown. Every official visual records its exact source URL. Diagrams state that family labels do not establish cross-model compatibility.

## Validation and release

Add batch-ten expectations before production records and observe the equipment test fail because the three profiles are absent. After implementation, run the focused equipment suite, all repository test scripts, content-classification and sourcing-SEO checks, production build, desktop and 390 px reviews, Preview validation, PR merge, Git-triggered Vercel production deployment, and live route, image, directory, and sitemap checks.
