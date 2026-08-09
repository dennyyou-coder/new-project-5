# Equipment Technical Profiles Batch Eleven Design

## Goal

Publish three evidence-led household cleaning-equipment pages for Cordless Wet Dry Floor Cleaner, Steam Mop, and Handheld Vacuum Cleaner while preserving the established WCB equipment-page system.

## Why these topics

This batch extends the database from general household vacuum formats into three distinct high-intent cleaning architectures. The topics have strong brand coverage in the published WCB database, current official product evidence, and buyer decisions that are not answered by the existing cordless-stick, canister, robot-vacuum, carpet-extractor, wet-dry-vacuum, or commercial-steam-cleaner pages.

## Scope

- Create only the three equipment JSON records and their page-local assets.
- Extend the existing equipment regression test for the three exact slugs.
- Do not create or edit articles, ownership pages, brand pages, component pages, shared components, navigation, or global styling.
- Keep component-family references unlinked because no component profiles are being created.

## Topic boundaries

### Cordless Wet Dry Floor Cleaner

The page covers battery-powered upright household machines that dispense cleaning liquid, mechanically agitate a hard floor, and recover dirty liquid into a separate tank in the same pass. It separates clean- and dirty-water capacity, brush and edge geometry, runtime, self-cleaning or drying cycles, approved solutions, and surface restrictions. It excludes dry-only stick vacuums, mop-only appliances, carpet extractors, wet-dry canister vacuums, and robot floor cleaners.

### Steam Mop

The page covers mains-powered or battery-powered household upright appliances that deliver steam through a floor head and pad to clean manufacturer-approved sealed hard floors. It separates heat-up time, steam control, water capacity, pad system, cable or battery boundary, and approved surfaces. It excludes handheld garment steamers, steam-only canisters, commercial steam cleaners, extraction systems, and unsupported sanitization or chemical-free outcome claims.

### Handheld Vacuum Cleaner

The page covers compact portable household dry vacuums designed to be carried and operated as a self-contained hand unit, with an integrated or removable battery and short-reach tools. It separates runtime, battery and charger, bin, filtration, nozzle and pet-tool formats, and emptying. It excludes stick vacuums used with floor wands, corded automotive vacuums, workshop wet-dry vacuums, dust extractors, and any inference that voltage or maximum suction alone establishes pickup performance.

## Evidence and model requirements

- Each page has at least seven reliable sources led by current official product pages, manuals, standards, and official compliance material.
- Each page includes six to eight representative models across at least four published WCB brand profiles.
- Preserve every source value and source unit. Runtime, steam, suction, tank, filtration, temperature, sanitization, and coverage claims remain source- and test-method-specific.
- No model row implies shared OEM, factory, component supplier, chemical compatibility, accessory compatibility, or cross-model battery compatibility.

## Visual package

Each page contains one official 1600 x 1000 WebP hero, two useful official 1500 x 900 WebP content images, and desktop/mobile WCB component-verification SVGs. Alt text states only what is visibly shown. Every official visual records its exact source URL. Diagrams state that family labels do not establish cross-model compatibility.

## Validation and release

Add batch-eleven expectations before production records and observe the equipment test fail because the three profiles are absent. After implementation, run the focused equipment suite, all repository test scripts, content-classification and sourcing-SEO checks, production build, desktop and 390 px reviews, Preview validation, PR merge, Git-triggered Vercel production deployment, and live route, image, directory, and sitemap checks.
