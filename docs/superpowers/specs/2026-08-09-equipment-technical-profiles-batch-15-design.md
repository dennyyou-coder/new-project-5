# Equipment Technical Profiles Batch Fifteen Design

## Goal

Publish three evidence-led household-appliance technical pages for Washer-Dryer Combos, Heat-Pump Dryers, and Dehumidifiers while preserving the established WCB equipment-page system.

## Why these topics

This batch completes the household laundry cluster after the front-load washing-machine profile and connects the air-treatment cluster to indoor moisture control. Each topic has meaningful specification, installation, maintenance, consumable, component-verification, and procurement intent, and can be represented by at least four already-published WCB brand profiles without creating ownership or article content.

## Scope

- Create only three equipment JSON records and their page-local assets.
- Extend the existing equipment regression test for the three exact slugs.
- Do not create or edit articles, ownership pages, brand pages, component pages, shared components, navigation, or global styling.
- Keep component-family references unlinked because no component profiles are being created.

## Topic boundaries

### Washer-Dryer Combo

The page covers one household front-load cabinet that performs automatic washing and tumble drying. It keeps washer and dryer rated capacities separate and distinguishes wash-only, dry-only, and continuous wash-to-dry operation. It excludes separate stacked washer/dryer pairs, commercial laundry systems, standalone washers or dryers, and unsupported cross-model parts.

### Heat-Pump Dryer

The page covers household tumble dryers using a closed-loop refrigerant heat-pump system to recover heat during drying. It separates rated capacity, energy-label jurisdiction, condensation or drainage arrangement, ambient operating limits, cycle basis, refrigerant service, lint and heat-exchanger maintenance, and exact-model components. It excludes vented resistance dryers, generic condenser dryers without a heat pump, industrial dryers, washer-dryer combos, and unsupported cross-model parts.

### Dehumidifier

The page covers portable household appliances that remove moisture from indoor air by condensation or a documented adsorption process and collect or drain the resulting water. It separates moisture-removal rating and test condition, room-area convention, temperature range, drainage mode, tank capacity, sound, filtration, defrost or pump features, refrigerant service, and exact-model components. It excludes air conditioners, whole-building dehumidification systems, humidifiers, air purifiers without moisture removal, and unsupported cross-model parts.

## Evidence and model requirements

- Each page has at least seven reliable sources led by current official product pages, manuals, standards, regulators and official energy or certification material.
- Each page includes six to eight representative models across at least four published WCB brand profiles.
- Preserve every source value, unit, jurisdiction, test condition and method. Wash and dry capacities remain separate; dryer efficiency and cycle claims retain their test basis; dehumidifier extraction rates retain temperature and humidity conditions.
- No model row implies shared OEM, factory, component supplier, refrigerant circuit, drain system, filter, motor, control board or cross-model part compatibility.

## Visual package

Each page contains one official 1600 x 1000 WebP hero, two useful official 1500 x 900 WebP content images, and desktop/mobile WCB component-verification SVGs. Alt text states only what is visibly shown. Every official visual records its exact official asset URL. Diagrams state that family labels do not establish cross-model compatibility.

## Validation and release

Add batch-fifteen expectations before production records and observe the equipment test fail because the three profiles are absent. After implementation, run the focused equipment suite, all repository test scripts, content-classification and sourcing-SEO checks, production build, desktop and 390 px reviews, Preview validation, PR merge, Git-triggered Vercel production deployment, and live route, image, directory and sitemap checks.
