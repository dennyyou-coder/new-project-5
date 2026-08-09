# Equipment Technical Profiles Batch Thirteen Design

## Goal

Publish three evidence-led cleaning-equipment pages for Portable Carpet & Upholstery Cleaners, Electric Pressure Washers, and Robotic Pool Skimmers while preserving the established WCB equipment-page system.

## Why these topics

This batch fills three buyer-decision gaps adjacent to existing pages without duplicating them. Portable spot extractors differ materially from full-size household carpet cleaners and commercial extractors. Household electric pressure washers require electrical, pressure, flow, hose, nozzle and surface-risk checks that differ from commercial cold-water units. Robotic pool skimmers operate at the water surface and solve a different debris problem from submerged robotic pool cleaners.

## Scope

- Create only three equipment JSON records and their page-local assets.
- Extend the existing equipment regression test for the three exact slugs.
- Do not create or edit articles, ownership pages, brand pages, component pages, shared components, navigation, or global styling.
- Keep component-family references unlinked because no component profiles are being created.

## Topic boundaries

### Portable Carpet & Upholstery Cleaner

The page covers portable household extraction appliances that dispense cleaning solution onto a localized carpet or upholstery area and recover dirty liquid into a separate tank. It separates tank capacity, hose and tool configuration, powered or passive agitation, heat or steam claims, approved solutions, surface restrictions, cleanup and storage. It excludes full-size upright carpet cleaners, dry vacuums, steam-only cleaners, commercial extractors and aerosol spot treatments.

### Electric Pressure Washer

The page covers mains-powered household and light-duty pressure washers that use an electric motor and pump to pressurize supplied water for manufacturer-declared outdoor cleaning tasks. It separates rated and maximum pressure, flow, duty expectations, hose and cord reach, nozzles, detergent delivery, inlet requirements, GFCI protection and surface risk. It excludes engine-driven machines, hot-water pressure washers, battery-only washers, commercial fleet procurement and unsupported cross-brand accessories.

### Robotic Pool Skimmer

The page covers self-propelled pool-surface cleaning robots designed to collect floating debris before it sinks. It separates propulsion, solar and plug-in charging, basket or filter design, obstacle avoidance, edge behavior, runtime, connectivity, pool-shape restrictions and water-chemistry boundaries. It excludes submerged robotic pool cleaners, fixed through-wall skimmers, handheld nets and suction- or pressure-side underwater cleaners.

## Evidence and model requirements

- Each page has at least seven reliable sources led by current official product pages, manuals, standards and official compliance material.
- Each page includes six to eight representative models across at least four published WCB brand profiles.
- Preserve every source value and unit. Pressure, flow, runtime, coverage, tank volume, pickup, charging and filtration claims remain source- and test-method-specific.
- No model row implies shared OEM, factory, component supplier, chemical compatibility, accessory compatibility or cross-model battery compatibility.

## Visual package

Each page contains one official 1600 x 1000 WebP hero, two useful official 1500 x 900 WebP content images, and desktop/mobile WCB component-verification SVGs. Alt text states only what is visibly shown. Every official visual records its exact official asset URL. Diagrams state that family labels do not establish cross-model compatibility.

## Validation and release

Add batch-thirteen expectations before production records and observe the equipment test fail because the three profiles are absent. After implementation, run the focused equipment suite, all repository test scripts, content-classification and sourcing-SEO checks, production build, desktop and 390 px reviews, Preview validation, PR merge, Git-triggered Vercel production deployment, and live route, image, directory and sitemap checks.
