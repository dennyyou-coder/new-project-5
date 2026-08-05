# Brand Database Completion and Release Design

## Goal

Complete and publish the nine existing power-tool brand drafts plus a new, independent Metabo profile, while preserving the current Brand Intelligence architecture and separating consumer brands, parents, trademark owners, regional operators, manufacturers, importers, retailers and warranty entities.

## Approved Scope

- Correct `bosch-power-tools`, `craftsman`, `kobalt`, `skil`, `hilti`, `festool`, `hikoki`, `flex` and `dremel`.
- Add `metabo` only after confirming its identity boundary from HiKOKI / Metabo HPT.
- Add or replace article-local brand assets under `public/images/brands/{slug}/`.
- Update brand categories and directly relevant article-brand relationships where evidence supports them.
- Add focused release-gate tests, run the production build, validate Preview, then merge through GitHub `main` for Vercel production.

Excluded: homepage, navigation, shared visual redesign, unrelated articles, speculative manufacturing claims, generated logos, founder likenesses and direct `vercel --prod` deployment.

## Evidence and Entity Model

Official corporate pages, annual reports, regulatory notices, warranty terms and exact official announcements are the primary evidence. `legalName` is used only when the profile's legal entity is established; parent and regional service entities belong in `legalEntityNote`, ownership, manufacturing or channel records with explicit scope. Missing product-level manufacturer or factory evidence is stated as undisclosed and remains a buyer verification action.

The Metabo page represents the global Metabo brand within Koki Holdings. It does not merge Metabo with the HiKOKI consumer brand or the North American Metabo HPT trade name. CAS and MultiVolt are described only within their evidenced brand and regional scope.

## Visual Package

Each published profile has an official-source logo at `/images/brands/{slug}/logo.webp`, an official real product or brand-scene hero at 1600 x 1000, and two evidence-led content visuals. Logos and heroes are not generated or redrawn. Content visuals may be deterministic WCB diagrams built from cited facts, with no unsupported factories, people, product origins or ownership edges.

The existing unrelated desert image, promotional heroes, blurred Kobalt hero, white-on-light FLEX and Dremel logos and generic cross-brand visuals are replaced. No global component or style change is required.

## Release Gates

- All ten profiles are `published`, pass the current schema and have at least three authoritative sources.
- All asset paths decode locally; logos are official-source and heroes are real, relevant images.
- Every manufacturing and channel record has `evidence`, `scope` and `buyerCheck`.
- Metabo is in Power Tools, has at least three legitimate article relationships and does not collapse into HiKOKI / Metabo HPT.
- `npm run test:brands`, the adjacent full test set and `npm run build` pass.
- `/brands` and all ten routes pass desktop and 390 px image, overflow, console and link checks on Vercel Preview.
- The reviewed feature branch is merged into GitHub `main`; production is deployed only by the Git integration and then checked on `worldcleanbiz.com`.

## Failure Handling

If an official asset cannot be obtained or a material identity claim cannot be verified, that brand remains draft and the batch is not released. Existing slugs and unrelated user work are never overwritten or cleaned.
