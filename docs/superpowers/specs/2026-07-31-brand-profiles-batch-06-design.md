# Brand Profiles Batch 06 Design

## Goal

Expand World Clean Biz Brand Intelligence from 34 to 40 published profiles with BLACK+DECKER, Eureka, Milwaukee, Vax, Oreck and Aquabot.

This batch strengthens four existing authority clusters:

- Stanley Black & Decker: BLACK+DECKER
- Midea floorcare: Eureka
- Techtronic Industries: Milwaukee, Vax and Oreck
- BWT and Aquatron pool robotics: Aquabot

## Routes and Identity Boundaries

| Route | Display name | Identity boundary |
| --- | --- | --- |
| `/brands/black-decker` | BLACK+DECKER | Treat BLACK+DECKER as a Stanley Black & Decker brand and sibling of DEWALT and STANLEY. Separate group ownership from licensees, regional sellers, model manufacturers and warranty providers. |
| `/brands/eureka` | Eureka | Treat Eureka as a Midea Group brand acquired from Electrolux in 2016. Separate Midea Group, Midea America and model-specific Midea Robozone evidence; exclude Sanitaire and Eureka Forbes. |
| `/brands/milwaukee` | Milwaukee | Treat Milwaukee Electric Tool Corporation as a wholly owned TTI business acquired in 2005. Separate the professional brand platform from TTI parent-level reporting and exact-SKU production. |
| `/brands/vax` | Vax | Treat Vax as a TTI-owned UK-centered floorcare brand and Vax Limited as a named group subsidiary. Separate the trademark, regional seller, manufacturing network and warranty route. |
| `/brands/oreck` | Oreck | Treat Oreck as a TTI-owned North American floorcare brand acquired in 2013. Separate the historical founder story from current TTI ownership and product-level responsibility. |
| `/brands/aquabot` | Aquabot | Treat Aquabot as a robotic pool-cleaner brand owned and manufactured by Aquatron Robotic Technology Ltd.; identify BWT as the parent group and Fluidra as the former owner. |

## Content and Visual Standard

Reuse the approved Brand Intelligence schema, routes, components, tables, JSON-LD and sitemap. Every profile must contain:

1. Canonical metadata, independent positioning and an affiliation disclaimer.
2. A local official logo and dedicated 1600 × 1000 product-led hero.
3. Clear legal-entity, ownership, headquarters and founding scope.
4. Evidence-backed leadership, product, manufacturing and channel sections.
5. Buyer checks that distinguish group claims from model- and market-level evidence.
6. Two or three relevant ownership, product or operations visuals.
7. A verified timeline, active competitor links and at least three primary WCB articles.
8. At least three official, filing, regulatory or otherwise authoritative sources.

Use existing accurate WCB diagrams where available. Product images should come from official brand pages. Leadership portraits remain optional when provenance or licensing is not sufficiently reliable.

## Scope

Included:

- Six brand JSON profiles.
- Local logos, product heroes and reused WCB analysis visuals.
- Selected article frontmatter relationships.
- Focused release-gate tests.

Excluded:

- Article-body rewrites.
- New components or schema changes.
- Homepage, navigation or global-style changes.
- Placeholder portraits or unsupported universal factory claims.

## Release Standard

Use test-driven implementation. Validate 40 exact published slugs, all required assets, three primary articles per new profile and the six identity boundaries. Run focused tests, full tests and production build, then verify the directory and six pages at desktop and 390 px. Release only through a pushed feature branch, Vercel Preview, explicit production approval and GitHub `main`.
