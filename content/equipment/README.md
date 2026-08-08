# Equipment profile data

Equipment profiles live in `content/equipment/{slug}.json`. They are technical database records, not articles or brand ownership records.

## Status and visibility

- New records start as `draft`.
- Draft records may render locally and in Vercel Preview.
- Draft records are excluded from production static parameters, directory cards, structured directory lists, and sitemap entries.
- A record becomes `published` only after evidence, assets, focused tests, production build, desktop review, 390 px review, and explicit content approval.

## Evidence layers

Official or primary-source claims use `evidence`, `scope`, `sourceIds`, and `verifiedAt`. Model relationships additionally record `brandSlug`, `brandName`, `modelName`, `subtype`, `marketScope`, and only officially supported distinguishing specifications.

WCB interpretation uses `assessment` or `wcbAssessment`, `basis`, `limitations`, `buyerAction`, and optional `engineeringCheck`. Evidence and WCB interpretation must not be combined in an unlabelled field.

## Required sections

Each profile contains identity and scope, an official hero asset, key facts, working-system nodes, equipment variants, a performance-metric dictionary, application-fit rows, component families, 6–8 representative models across at least four published brand profiles, procurement decisions, engineering checks, directly applicable standards, technical developments, and at least five reliable sources.

## Source and relationship rules

Prefer official manuals and specifications, official manufacturer technical pages, standards bodies or regulators, and official safety/service/compliance documents. Every evidence row references declared source IDs. Unsupported model, factory, OEM, component-supplier, or compatibility relationships are omitted.

A component family has no `href` until a separate component profile exists, validates, and is published. Brand links must resolve to published `/brands/{slug}` profiles.

## Images

The hero path is `/images/equipment/{slug}/hero.webp`. It must be a real matching product or operating scene from an official source, with exact source URL, accurate alt text, and caption. Do not use AI product images, third-party logos, copied manual diagrams, or search-result screenshots.

## Units

Preserve each source value and source unit. A display conversion is allowed only when it is purely mathematical and does not change the source measurement method. Theoretical and practical productivity must never be treated as equivalent without a documented test basis.
