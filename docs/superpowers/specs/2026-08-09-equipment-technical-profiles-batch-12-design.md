# Equipment Technical Profiles Batch Twelve Design

## Goal

Publish three evidence-led cleaning-equipment pages for Household Upright Vacuum Cleaners, Household Carpet Cleaners, and Robotic Pool Cleaners while preserving the established WCB equipment-page system.

## Why these topics

This batch closes three commercially useful format gaps. Household upright vacuums and full-size household carpet cleaners have buyer decisions that differ from the existing commercial upright-vacuum and carpet-extractor pages. Robotic pool cleaners extend the technical database into a distinct cleaning environment with different propulsion, filtration, cable or battery, coverage, and pool-compatibility checks.

## Scope

- Create only the three equipment JSON records and their page-local assets.
- Extend the existing equipment regression test for the three exact slugs.
- Do not create or edit articles, ownership pages, brand pages, component pages, shared components, navigation, or global styling.
- Keep component-family references unlinked because no component profiles are being created.

## Topic boundaries

### Household Upright Vacuum Cleaner

The page covers mains-powered household dry vacuums whose upright body, floor head, dust collection and primary controls form one floor-cleaning assembly. It separates bagged and bagless architectures, floor-head and brush control, height adjustment, filtration, cord and hose reach, tools, weight, and service parts. It excludes cordless sticks, canisters, handhelds, robots, wet-dry vacuums, carpet washers, and commercial upright procurement.

### Household Carpet Cleaner

The page covers household upright extraction appliances that dispense cleaning solution into carpet, agitate where designed, and recover dirty liquid into a separate tank. It separates tank capacity, brush system, cleaning path, heater or drying claims, hose and upholstery tools, approved solution, surface restrictions, and cleaning/maintenance steps. It excludes dry vacuums, spot-only portable cleaners, hard-floor wet-dry cleaners, rental/commercial extractors, and steam-only appliances.

### Robotic Pool Cleaner

The page covers self-propelled pool-cleaning machines that operate underwater and use onboard or tethered power, drive, debris collection and filtration to clean manufacturer-declared pool surfaces. It separates corded and cordless architectures, floor/wall/waterline coverage, navigation, cycle time, filter format, pool-size limits, retrieval, charging, connectivity, and water-chemistry boundaries. It excludes suction-side and pressure-side cleaners without onboard propulsion, surface skimmers, household floor robots, and unsupported claims of universal pool compatibility.

## Evidence and model requirements

- Each page has at least seven reliable sources led by current official product pages, manuals, standards, and official compliance material.
- Each page includes six to eight representative models across at least four published WCB brand profiles.
- Preserve every source value and unit. Pickup, runtime, capacity, coverage, cycle, filtration, power, drying and sanitization claims remain source- and test-method-specific.
- No model row implies shared OEM, factory, component supplier, chemical compatibility, accessory compatibility, or cross-model battery compatibility.

## Visual package

Each page contains one official 1600 x 1000 WebP hero, two useful official 1500 x 900 WebP content images, and desktop/mobile WCB component-verification SVGs. Alt text states only what is visibly shown. Every official visual records its exact official asset URL. Diagrams state that family labels do not establish cross-model compatibility.

## Validation and release

Add batch-twelve expectations before production records and observe the equipment test fail because the three profiles are absent. After implementation, run the focused equipment suite, all repository test scripts, content-classification and sourcing-SEO checks, production build, desktop and 390 px reviews, Preview validation, PR merge, Git-triggered Vercel production deployment, and live route, image, directory, and sitemap checks.
