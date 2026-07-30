# Brand Profiles Batch 02 Design

## Goal

Expand World Clean Biz Brand Intelligence from 10 to 16 published profiles with a second evidence-led batch:

- Shark
- WYBOT
- Beatbot
- Narwal
- Husqvarna
- Segway Navimow

The batch should capture existing brand-search demand, activate currently unlinked competitor references and turn WCB's published company research into durable brand authority pages for buyers, distributors and industry professionals.

## Selection Rationale

This batch balances three high-value cleaning-robot categories:

- Floorcare: Shark and Narwal
- Robotic pool cleaning: WYBOT and Beatbot
- Robotic lawn care: Husqvarna and Segway Navimow

All six brands already appear repeatedly in WCB research. Each has an ownership or manufacturing article plus enough comparison and market analysis to support at least three related articles. Existing brand profiles already reference Shark, WYBOT, Beatbot, Husqvarna and Segway Navimow as competitors, so publishing these profiles also converts plain-text references into internal links.

## Routes and Identity Boundaries

| Route | Display name | Identity boundary |
| --- | --- | --- |
| `/brands/shark` | Shark | Treat Shark as the consumer cleaning brand operated by SharkNinja. Explain SharkNinja's public-company ownership and the separate Ninja brand without presenting Shark as a standalone corporation. |
| `/brands/wybot` | WYBOT | Separate the WYBOT consumer brand from WYBOTICS, the Wangyuan predecessor, Winny products and ODM manufacturing. |
| `/brands/beatbot` | Beatbot | Separate the Beatbot brand from Xingmai Innovation, regional entities, investors and SKU-level manufacturing roles. |
| `/brands/narwal` | Narwal | Separate the Narwal brand from the Yunjing Intelligence group, investors, regional sellers and model-specific factories. |
| `/brands/husqvarna` | Husqvarna | Scope the page to Husqvarna AB's outdoor-equipment and Automower business. Distinguish licensed motorcycle and sewing-machine uses of the name. |
| `/brands/segway-navimow` | Segway Navimow | Explain the relationship among Ninebot, Willand, Segway and Navimow without presenting the mower business as wholly owned when the verified group interest is lower. |

Aliases should support article matching without collapsing distinct companies or licensed categories into one entity. The page slug is the canonical internal-link target.

## Page Content Standard

Each profile will use the existing Brand Intelligence schema and components. Every page must include:

1. Independent positioning, disclaimer and canonical metadata.
2. Official logo with a source URL.
3. Dedicated product-led hero image.
4. Key facts covering the legal-entity boundary, ownership type, headquarters, founding date, official website and last verification date.
5. Ownership summary with explicit distinctions among parent company, shareholder, investor, licensee, operator and regional entity.
6. Leadership evidence. Add a founder or executive portrait only when the person, image and source can be verified. Otherwise render the existing leadership table without a placeholder portrait.
7. Product portfolio with buyer relevance for every category.
8. Manufacturing and supply-chain evidence divided by evidence scope and exact buyer check.
9. Markets and channels evidence with market-specific verification guidance.
10. Independent competitive assessment and related brand links.
11. A verified development timeline.
12. At least three related WCB articles.
13. At least three primary or authoritative sources, with every material claim traceable to a declared source.

Existing WCB articles are research inputs and internal links, not substitutes for current source verification. Ownership, leadership, product, channel and manufacturing claims must be checked against current official filings, company pages, regulatory records or product documents before publication.

## Visual Standard

Each brand receives a local asset directory under:

`public/images/brands/{slug}/`

Required assets:

- `logo.webp`: transparent official wordmark or brand mark, preserved without cropping.
- One product-led hero image: 1600 × 1000 WebP, named descriptively.
- Two or three content visuals assigned to ownership, portfolio or operations.
- Optional verified leadership portrait in the same brand directory.

The hero should show a representative current product or portfolio and must not reuse a text-heavy article cover. Existing WCB diagrams may be reused when they accurately match the section. If a required ownership, product or operations explanation lacks a suitable asset, create a new WCB diagram using the existing visual language.

Image captions must explain what the visual helps the reader understand. Alt text should identify the brand, product or relationship rather than repeat decorative marketing language.

## Data and Internal Linking

Add six JSON profiles under `content/brands/` and keep the current loader, schema and route architecture unchanged.

The release gate will move from exactly 10 to exactly 16 published profiles. Article relationships should resolve through the profile name and carefully selected aliases. The batch should activate these existing competitor links:

- BISSELL, Dyson and Tineco → Shark
- Aiper and Maytronics → WYBOT
- Aiper → Beatbot
- Mammotion → Husqvarna
- Mammotion → Segway Navimow

New profiles should link back to relevant published profiles such as BISSELL, Dyson, Tineco, Roborock, ECOVACS, iRobot, Aiper, Maytronics and Mammotion. Do not create links to unpublished brand slugs.

The Brand Intelligence directory, sitemap, JSON-LD and related-article sections should update through the existing data pipeline. No separate page registration or manual directory card is allowed.

## Error and Evidence Handling

- If a current ownership percentage, parent relationship or factory claim cannot be verified, describe the evidence boundary instead of inferring it.
- Model-specific manufacturing evidence must not be generalized to the full brand.
- Company-reported market reach, store counts and performance claims must be labeled as company-reported.
- If a reliable leadership photo is unavailable, omit the portrait.
- If an official logo cannot be obtained with clear provenance, keep the profile unpublished until the asset is resolved.
- A profile must fail validation when required sources, visuals, article relationships or evidence fields are incomplete.

## Testing

Use test-driven development for the batch:

1. Add a failing release-gate test expecting the exact 16 approved slugs.
2. Add failing checks that all six profiles have local official logos, dedicated high-resolution heroes, two or three content visuals and at least three related articles.
3. Add failing checks for newly activated competitor links.
4. Add profile-specific assertions for material identity boundaries where a generic schema test is insufficient.
5. Implement the six profiles and assets until the focused tests pass.

Verification must include:

- Brand test suite.
- Full project test suite.
- Production build.
- JSON parsing and diff checks.
- Browser checks for `/brands` and all six profiles at desktop and 390 px.
- Image loading, layout overflow, section navigation, metadata, structured data and browser-console errors.

## Scope Boundaries

Included:

- Six brand JSON profiles.
- Brand-specific logos, heroes, diagrams and verified portraits.
- Focused Brand Intelligence tests.
- Internal competitor-link activation produced by the new published slugs.

Excluded:

- Rewriting existing articles.
- Homepage changes.
- Global navigation changes.
- New page components or a Brand Intelligence redesign.
- Unrelated styling, routing, schema or build-system changes.

## Release

- Work on `codex/brand-profiles-batch-02` in an isolated worktree.
- Run focused tests, the full test suite and the production build.
- Push the feature branch and verify one Vercel Preview.
- Obtain one explicit production approval for the complete six-brand batch.
- Merge the approved branch into GitHub `main`.
- Allow the Vercel Git integration to deploy production.
- Verify `worldcleanbiz.com/brands` and all six production routes.
