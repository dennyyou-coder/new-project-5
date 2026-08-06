# Home Appliance Brand Intelligence Batch 3 Design

## Goal

Publish the third approved home-appliance SEO and Brand Intelligence batch for Whirlpool, KitchenAid and Beko. The release must help buyers distinguish the consumer brands, Whirlpool Corporation, Beko and Beko Europe, regional trademark or licensing rights, operating companies, manufacturing evidence and warranty responsibility without treating a group-level disclosure as proof for every SKU.

## Approved Scope

- Add three consumer-brand profiles: `whirlpool`, `kitchenaid` and `beko`.
- Publish the three titles and slugs frozen in the approved WCB topic research:
  - `who-owns-whirlpool-appliances-beko-europe`
  - `who-makes-kitchenaid-appliances-whirlpool`
  - `who-owns-beko-appliances-beko-europe`
- Add the three brands to `home-appliances-small-appliances` as their primary category.
- Add a cross-category membership only where a current official product portfolio proves a relevant floor-care or home-cleaning line.
- Add official logos, real official product or brand-scene heroes and two or three evidence-led visuals per published profile.
- Update brand release tests, exact article relationships, static routes, sitemap expectations and operational research records.
- Release through an isolated branch, GitHub pull request and the Vercel Git integration after local and Preview verification.

Excluded: Maytag, Hotpoint, Toshiba Appliances, Panasonic, Hisense, De'Longhi, Groupe SEB, Rowenta, Gorenje and SUPOR; parent-only brand routes; unrelated article rewrites; speculative SKU factories; generated or redrawn logos; direct `vercel --prod`; homepage or site-architecture changes.

## Identity Boundaries

- `whirlpool` represents the Whirlpool consumer appliance brand. The profile must separate Whirlpool Corporation and its retained businesses from the Beko Europe transaction, regional brand licensing and the legal seller or warranty entity shown on a buyer's local documents.
- `kitchenaid` represents the KitchenAid consumer brand. It must separate Whirlpool ownership from brand licensing and product-category-specific operating or manufacturing arrangements. Major appliances, countertop appliances and accessories cannot be assigned to one manufacturer or factory without model-level evidence.
- `beko` represents the Beko consumer appliance brand. It must separate the Beko corporate identity and legal listed entity from Beko Europe, regional subsidiaries, the Whirlpool transaction and any seller, importer, manufacturer or warranty entity named for a specific market.
- KitchenAid is not presumed to have transferred to Beko Europe. The final article and profile wording must be supported by current official transaction scope or omit that conclusion.
- Whirlpool, KitchenAid and Beko are distinct brands even when an official document discusses them in a shared corporate or regional context.

## Article Relationship Model

The current validator requires every published profile to have at least three distinct tagged articles and at least one primary article. The three approved articles may be related to all three profiles only when their bodies contain substantive, sourced analysis of the relevant boundary:

- The Whirlpool article is primary for `whirlpool`; it may relate to `beko` and `kitchenaid` when it explains the Beko Europe scope and retained Whirlpool-brand portfolio.
- The KitchenAid article is primary for `kitchenaid`; it may relate to `whirlpool` and `beko` only when official evidence supports the ownership and European transaction boundary discussed in the article.
- The Beko article is primary for `beko`; it may relate to `whirlpool` and `kitchenaid` only when it materially explains the Whirlpool transaction and the relevant retained-brand boundary.

No unrelated legacy article will be tagged merely to pass the numeric gate. If one profile cannot reach three legitimate relationships, it remains `draft` and the whole one-time production batch is blocked rather than weakening validation.

## Evidence Standard

The evidence matrix must identify, where disclosed: consumer brand, controlling parent, trademark owner or licensee, operating company, regional seller or importer, manufacturer, factory, warranty provider and source date. Preferred sources are current company annual reports, transaction filings and announcements, official legal or warranty pages, official product pages and official media assets.

Group factory counts, regional production networks and historic brand relationships are scoped to the disclosed entity, market and time. They are not generalized to every current product. Missing facts are omitted or described as not disclosed in the reviewed public materials.

## Visual Package

Every published profile contains:

- `/images/brands/{slug}/logo.webp` from an official brand site, media library or press kit, preserved as a transparent WebP;
- a real official product, kitchen, laundry, factory, team, store or brand-scene Hero rendered at 1600 x 1000;
- two or three dedicated 1600 x 900 evidence visuals for ownership, portfolio, operations or competition.

Content visuals may summarize official evidence, but captions must identify their evidentiary scope. Article cover images do not substitute for a real brand Hero. Founder or executive portraits remain absent unless identity and official provenance are both reliable.

## Page and Category Experience

The existing JSON-driven brand components remain unchanged unless verification exposes a concrete defect. All three profiles use the current compact hero, visible official logo, responsive tables, evidence visuals, timeline, article groups and source list.

All three brands belong primarily to `home-appliances-small-appliances`. Cross-listing in `floorcare-home-cleaning` requires a verified current cleaning appliance portfolio and must not be inferred from broad corporate activity.

## Release Gates

- Three exact approved SEO articles are complete, sourced, internally linked and use the approved title and slug.
- Each published profile has at least three genuine tagged articles, one primary article, three unique reliable sources, a verified official logo, a real Hero and two or three dedicated content visuals.
- Identity wording passes explicit tests for Whirlpool Corporation, Beko Europe, KitchenAid product-category boundaries and Beko corporate or regional entities.
- `npm run verify:content-classification`, `npm run test:insights`, `npm run test:brands` and `npm run build` pass.
- `/blog` ordering, the three article routes, `/brands`, the home-appliance category and all three profile routes pass desktop and 390 px checks with no broken images, horizontal overflow or new console errors.
- A Vercel Preview is reviewed before merging. Production is released only by pushing the reviewed merge to GitHub `main`; direct production CLI deployment is prohibited.

## Failure Handling

An existing slug, uncertain legal identity, unsupported article relationship, missing official asset, failed test or failed browser check blocks the affected profile and the one-time production release. The implementation does not overwrite uncertain content, invent evidence, lower a release gate or touch the user's unrelated dirty files in the original working tree.
