# Brand Profiles Batch 04 Design

## Goal

Expand World Clean Biz Brand Intelligence from 22 to 28 published profiles with Bosch Home Appliances, Philips Home Appliances, Midea, Sunseeker, WORX and Nilfisk.

The batch extends the approved Brand Intelligence system into three complementary search areas:

- European appliance ownership and licensing: Bosch Home Appliances and Philips Home Appliances
- Chinese appliance and outdoor-equipment groups: Midea, Sunseeker and WORX
- Professional cleaning equipment: Nilfisk

## Routes and Identity Boundaries

| Route | Display name | Identity boundary |
| --- | --- | --- |
| `/brands/bosch-home-appliances` | Bosch Home Appliances | Treat Bosch home appliances as a BSH Hausgeräte brand. Separate appliance ownership and operations from Robert Bosch power tools, mobility and other Bosch businesses. |
| `/brands/philips-home-appliances` | Philips Home Appliances | Explain that Versuni operates Philips-branded domestic appliances under licence. Do not present the floorcare business as an operating division of Royal Philips. |
| `/brands/midea` | Midea | Separate the listed Midea Group, its smart-home business, regional entities, factories and the separately marketed Eureka brand. |
| `/brands/sunseeker` | Sunseeker | Distinguish the mower brand, Zhejiang Sunseeker Industrial / Zhejiang White Horse naming, trademark holders, regional sellers and model-level manufacturers. |
| `/brands/worx` | WORX | Treat WORX as a Positec Group brand and Landroid as its robotic-mower family. Separate group ownership, trademark, manufacturing, app, seller and warranty roles. |
| `/brands/nilfisk` | Nilfisk | Reflect Freudenberg's 2026 acquisition while separating the brand, Nilfisk operating entities, Advance and Viper, factories, distributors and historical listed-company disclosures. |

## Content and Visual Standard

Reuse the approved schema, routes, components, tables, JSON-LD and sitemap. Every profile must contain:

1. Canonical metadata, independent positioning and affiliation disclaimer.
2. Local official logo and a dedicated 1600 × 1000 product-led hero.
3. Clear legal-entity, ownership, headquarters and founding scope.
4. Evidence-backed leadership, product, manufacturing and channel sections.
5. Buyer checks that distinguish group claims from model- and market-level evidence.
6. Two or three relevant ownership, product or operations visuals.
7. Verified timeline, published competitor links and at least three primary WCB articles.
8. At least three official, filing, regulatory or otherwise authoritative sources.

Use existing accurate WCB diagrams where available. Article covers with large editorial headlines must not be used as product heroes. Omit a leadership portrait when reliable provenance is unavailable.

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

Use test-driven implementation. Validate 28 exact published slugs, all required assets, three primary articles per new profile and the six identity boundaries. Run focused tests, full tests and production build, then verify the directory and six pages at desktop and 390 px. Release only through a pushed feature branch, Vercel Preview, explicit production approval and GitHub `main`.
