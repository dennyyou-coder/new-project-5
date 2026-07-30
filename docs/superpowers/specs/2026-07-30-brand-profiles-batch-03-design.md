# Brand Profiles Batch 03 Design

## Goal

Expand World Clean Biz Brand Intelligence from 16 to 22 published profiles with:

- Eufy
- MOVA
- DJI ROMO
- Kärcher
- Miele
- Hoover

The batch should convert existing WCB ownership, product and comparison research into durable search-entry pages for global buyers, distributors and cleaning-industry professionals.

## Selection Rationale

The selection adds three complementary groups:

- Robot and smart-home cleaning: Eufy, MOVA and DJI ROMO
- Professional and outdoor cleaning: Kärcher
- Premium and legacy floorcare: Miele and Hoover

All six already have dedicated WCB research and enough related analysis to support at least three internal article relationships. The group also closes high-value ownership questions that generic brand directories frequently describe imprecisely.

## Routes and Identity Boundaries

| Route | Display name | Identity boundary |
| --- | --- | --- |
| `/brands/eufy` | Eufy | Treat Eufy as an Anker Innovations smart-home brand, not a standalone listed company. Separate cleaning products from security and baby-care categories. |
| `/brands/mova` | MOVA | Explain MOVA's relationship with Dreame Group and distinguish the brand, regional sellers, Kutting lawn-mower activity and model-level manufacturing evidence. |
| `/brands/dji-romo` | DJI ROMO | Scope the page to DJI's ROMO cleaning-robot business. Do not turn the page into a general DJI corporate profile or infer that every DJI entity manufactures or sells ROMO. |
| `/brands/karcher` | Kärcher | Treat Kärcher as the family-controlled cleaning-equipment group and distinguish the brand from individual country subsidiaries, dealers and model factories. |
| `/brands/miele` | Miele | Explain the Miele and Zinkann family ownership, group entities and product-specific manufacturing footprint without generalizing one plant to all appliances. |
| `/brands/hoover` | Hoover | Explicitly separate Hoover North America under TTI Floor Care from Hoover in Europe under Haier's Candy/Haier Europe structure. Avoid presenting either regional owner as the universal global owner. |

## Page and Evidence Standard

Reuse the approved Brand Intelligence schema and page components. Every profile must include:

1. Independent positioning, disclaimer and canonical metadata.
2. Official local logo and dedicated 1600 × 1000 product-led hero.
3. Legal-entity boundary, ownership, headquarters, founding context, official website and verification date.
4. Evidence-backed ownership and leadership sections.
5. Product portfolio with buyer relevance.
6. Manufacturing, supply-chain, market and channel evidence with exact scope and buyer checks.
7. Independent competitive assessment, verified timeline and related published brand links.
8. At least three primary WCB articles and at least three official, filing, regulatory or other authoritative sources.

Current ownership, leadership, channel and product claims must be refreshed from primary evidence. Company-reported figures must be labeled. Model-level compliance evidence must not be generalized to the whole brand.

## Visual Standard

Store brand-specific assets under `public/images/brands/{slug}/`.

Required:

- `logo.webp`: transparent official wordmark or mark, preserved without cropping.
- `hero-*.webp`: representative product image, exactly 1600 × 1000.
- Two or three relevant content visuals for ownership, products or operations.
- Leadership portrait only when the person, image and source are reliably verified; otherwise omit it.

Reuse accurate WCB diagrams where available. Article covers with large headlines are not suitable as product heroes. Every configured image needs useful alt text and a caption that explains the buyer value.

## Data and Internal Linking

Create six JSON profiles and keep the current loader, schema, routes, directory, sitemap and JSON-LD pipeline unchanged. Canonical slugs are:

`dji-romo`, `eufy`, `hoover`, `karcher`, `miele`, `mova`.

Add `primary_brands` and `related_brands` only to carefully selected existing article frontmatter; do not rewrite article bodies. New profiles should link only to published brand routes.

## Testing and Release

Use test-driven development:

1. Change the exact release gate from 16 to 22 slugs and run it red.
2. Require the six new profiles to have official local logos, 1600 × 1000 local heroes, two or three content visuals and at least three primary articles.
3. Add profile-specific assertions for DJI ROMO scope and Hoover's regional ownership split.
4. Run Brand Intelligence tests, full tests and the production build.
5. Validate `/brands` and all six routes at desktop and 390 px, including images, overflow, metadata, structured data and console errors.
6. Push one preview and request one final production approval for the complete batch.

Production must be released by merging the approved branch to GitHub `main` and allowing the Vercel Git integration to deploy. Do not use a routine direct production deployment.

## Scope Boundaries

Included:

- Six brand JSON profiles.
- Brand logos, product heroes, relevant reused diagrams and verified portraits.
- Selected article frontmatter relationships.
- Focused tests.

Excluded:

- Article-body rewrites.
- Homepage, navigation or global-style changes.
- New components, schema changes or architecture changes.
- Placeholder portraits or unverified factory and ownership claims.
