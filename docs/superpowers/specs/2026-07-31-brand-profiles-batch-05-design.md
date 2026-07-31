# Brand Profiles Batch 05 Design

## Goal

Expand World Clean Biz Brand Intelligence from 28 to 34 published profiles with AEG, DEWALT, Greenworks, Ryobi, Polaris and Hayward.

The batch targets six brands with strong ownership-intent searches and clear relevance to overseas buyers, distributors and industry professionals:

- Home floorcare: AEG
- Professional and consumer tool ecosystems: DEWALT and Ryobi
- Outdoor power equipment and robotic mowing: Greenworks
- Pool equipment and robotic cleaning: Polaris and Hayward

## Routes and Identity Boundaries

| Route | Display name | Identity boundary |
| --- | --- | --- |
| `/brands/aeg` | AEG | Treat AEG as an Electrolux Group-owned trademark used for home appliances while separating product-category operators, regional sellers and licensing arrangements from the trademark owner. |
| `/brands/dewalt` | DEWALT | Treat DEWALT as a Stanley Black & Decker brand. Separate brand ownership from regional sellers, authorized service, factories and exact-SKU origin. |
| `/brands/greenworks` | Greenworks | Explain Globe Group control and STIHL's minority investment without presenting Greenworks as a STIHL-owned brand. Separate consumer, commercial and regional entities. |
| `/brands/ryobi` | Ryobi | Separate Ryobi power tools and outdoor equipment licensed to Techtronic Industries from Ryobi Limited's other businesses and Kyocera's licensed power-tool markets. |
| `/brands/polaris` | Polaris | Treat Polaris pool equipment as a Fluidra portfolio brand with Zodiac heritage. Separate brand ownership, regional Fluidra entities, model-level manufacturing and authorized seller responsibilities. |
| `/brands/hayward` | Hayward | Treat Hayward as a listed pool-equipment group and distinguish the corporate parent, regional operating entities, product brands, factories and channel partners. |

## Content and Visual Standard

Reuse the approved Brand Intelligence schema, routes, components, tables, JSON-LD and sitemap. Every profile must contain:

1. Canonical metadata, independent positioning and affiliation disclaimer.
2. Local official logo and a dedicated 1600 × 1000 product-led hero.
3. Clear legal-entity, ownership, headquarters and founding scope.
4. Evidence-backed leadership, product, manufacturing and channel sections.
5. Buyer checks that distinguish group claims from model- and market-level evidence.
6. Two or three relevant ownership, product or operations visuals.
7. Verified timeline, published competitor links and at least three primary WCB articles.
8. At least three official, filing, regulatory or otherwise authoritative sources.

Use existing accurate WCB diagrams where available. Editorial covers may support body analysis but must not replace a dedicated product-led hero. Leadership portraits remain optional when provenance is not sufficiently reliable.

## Scope

Included:

- Six brand JSON profiles.
- Local logos, heroes and reused content visuals.
- Selected article frontmatter relationships.
- Focused release-gate tests.

Excluded:

- Article-body rewrites.
- New components or schema changes.
- Homepage, navigation or global-style changes.
- Placeholder portraits or unsupported ownership and factory claims.

## Release Standard

Use test-driven implementation. Validate 34 exact published slugs, all required assets, three primary articles per new profile and the six identity boundaries. Run focused tests, full tests and production build, then verify the directory and six pages at desktop and 390 px. Release only through a pushed feature branch, Vercel Preview, explicit production approval and GitHub `main`.
