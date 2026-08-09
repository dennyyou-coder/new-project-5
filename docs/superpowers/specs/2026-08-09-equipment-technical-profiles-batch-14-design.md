# Equipment Technical Profiles Batch Fourteen Design

## Goal

Publish three evidence-led cleaning-appliance technical pages for Front-Load Washing Machines, Dishwashers, and Air Purifiers while preserving the established WCB equipment-page system.

## Why these topics

This batch expands WCB from dedicated cleaning machines into high-demand household appliances that directly wash textiles, wash tableware, or remove airborne particles. The topics match the previously approved household-appliance customer direction, have strong component and replacement-consumable intent, and can be represented by at least four already-published WCB brand profiles without creating ownership content.

## Scope

- Create only three equipment JSON records and their page-local assets.
- Extend the existing equipment regression test for the three exact slugs.
- Do not create or edit articles, ownership pages, brand pages, component pages, shared components, navigation, or global styling.
- Keep component-family references unlinked because no component profiles are being created.

## Topic boundaries

### Front-Load Washing Machine

The page covers household automatic washers with a horizontal-axis drum loaded through a front door. It separates rated capacity, spin speed, water heating, cycle scope, detergent dosing, drain and installation requirements, door-lock and seal maintenance, energy-label jurisdiction, and exact-model service parts. It excludes top-load washers, washer-dryers when evaluated as combined drying appliances, commercial laundry systems, dryers, and unsupported cross-model parts.

### Dishwasher

The page covers household automatic dishwashers that circulate heated water and detergent through racks and spray systems, then drain and use a documented drying method. It separates width and installation format, place-setting or rack capacity, cycle and water-use claims, noise, filtration, drying architecture, leak protection, inlet and drain requirements, detergent compatibility, and exact-model components. It excludes commercial warewashers, countertop hand-washing devices, sinks, garbage disposals, and unsupported cross-model racks, pumps, filters or control parts.

### Air Purifier

The page covers portable household room air cleaners that move indoor air through documented particulate, gas-phase or combined treatment stages. It separates CADR and test basis, particle-filter class, room-size convention, airflow, sound, sensors, gas-filter limits, replacement intervals, electrical configuration and filter identity. It excludes HVAC whole-building filtration, unverified medical claims, standalone humidifiers or dehumidifiers, industrial dust collectors, and ozone-generating devices presented as equivalent filtration.

## Evidence and model requirements

- Each page has at least seven reliable sources led by current official product pages, manuals, standards, regulators and official energy or certification material.
- Each page includes six to eight representative models across at least four published WCB brand profiles.
- Preserve every source value, unit, jurisdiction and test method. Capacity, water, energy, sound, CADR, room area and filtration statements remain source-specific.
- No model row implies shared OEM, factory, component supplier, detergent, filter, hose, rack, pump, motor, control board or cross-model part compatibility.

## Visual package

Each page contains one official 1600 x 1000 WebP hero, two useful official 1500 x 900 WebP content images, and desktop/mobile WCB component-verification SVGs. Alt text states only what is visibly shown. Every official visual records its exact official asset URL. Diagrams state that family labels do not establish cross-model compatibility.

## Validation and release

Add batch-fourteen expectations before production records and observe the equipment test fail because the three profiles are absent. After implementation, run the focused equipment suite, all repository test scripts, content-classification and sourcing-SEO checks, production build, desktop and 390 px reviews, Preview validation, PR merge, Git-triggered Vercel production deployment, and live route, image, directory and sitemap checks.
