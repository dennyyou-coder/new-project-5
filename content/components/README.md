# Component profile data

Component profiles live in `content/components/{slug}.json`. They are technical database records, not articles, brand records, ownership analysis, repair instructions, or replacement-parts catalogues.

## Status and visibility

- New records start as `draft`.
- Valid drafts render locally and in Vercel Preview with `noindex, nofollow`.
- Drafts stay out of the production directory, static parameters, and sitemap.
- Publish only after evidence, assets, tests, build, desktop review, 390 px review, and visual approval pass.

## Evidence layers

Source-backed rows require `evidence`, `scope`, `sourceIds`, and `verifiedAt`. WCB interpretation requires `assessment`, `basis`, `limitations`, `buyerAction`, and optional `engineeringCheck`. Never merge the two layers into an unlabelled conclusion.

## Compatibility boundary

A component family, physical resemblance, group ownership, seller claim, or matching wattage does not establish compatibility. Exact compatibility requires the relevant manufacturer part number and revision, appliance model and serial scope, electrical and control specification, mechanical interfaces, airflow and cooling arrangement, protection and approval requirements, and current service documentation.

Do not claim an OEM, factory, customer, supplier, or brand relationship without direct authoritative evidence for that exact relationship.

## Images

Images live under `/images/components/{slug}/`. A published profile requires three to five body visuals; the vacuum-motor pilot requires four distinct placements. Official photos require exact official source URLs. WCB diagrams require cited source IDs and separate mobile SVGs when dense labels would not remain readable at 390 px.

Do not use AI product imagery, third-party logos, search screenshots, copied manual diagrams, or decorative images without information value.

## Sources and units

Prefer official manufacturer datasheets and technical pages, official service documents, standards bodies, regulators, and authoritative technical references. Preserve source values, units, test methods, and reporting boundaries. Do not turn input power, airflow, sealed vacuum, or air watts into interchangeable ranking values.
