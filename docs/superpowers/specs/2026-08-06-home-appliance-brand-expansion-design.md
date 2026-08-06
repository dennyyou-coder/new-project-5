# Home Appliance Brand Intelligence Expansion Design

## Goal

Expand World Clean Biz Brand Intelligence from a cleaning-led directory into a buyer-facing database that also covers major home-appliance and small-appliance brands whose channels, sourcing organizations and product portfolios overlap with floor care and cleaning appliances.

The first release adds verified profiles for Samsung Home Appliances, LG Home Appliances, Haier Home Appliances, GE Appliances and Fisher & Paykel, refreshes the existing Midea profile, and introduces a dedicated Home Appliances & Small Appliances buying category without weakening the meaning of the existing Floorcare & Home Cleaning category.

## Approved Scope

- Add `samsung-home-appliances`, `lg-home-appliances`, `haier-home-appliances`, `ge-appliances` and `fisher-paykel` profiles.
- Update `midea` only where the newly published Midea ownership guide or newly reviewed official evidence materially improves the profile.
- Add a `home-appliances-small-appliances` category in `lib/brandCategories.ts`.
- Make the new category the primary category for verified appliance-led profiles, including existing AEG, Bosch Home Appliances, Electrolux, Midea, Miele and Philips Home Appliances profiles.
- Cross-list only brands with verified vacuum, robot, wet-dry, floor-care or directly relevant home-cleaning products in `floorcare-home-cleaning`.
- Add or correct directly relevant `primaryBrands` and `relatedBrands` article metadata where the article itself supports the relationship. Article bodies, titles, slugs and search intent remain unchanged.
- Add official logos, real official product or brand-scene heroes and two or three evidence-led content visuals for every new profile.
- Update focused brand tests, sitemap expectations and buyer-facing Brand Intelligence copy needed to describe the expanded coverage accurately.
- Validate locally, on Vercel Preview and on production through the normal GitHub `main` release path.

Excluded: unrelated article rewrites, parent-only consumer brand pages, speculative supplier or factory claims, generated or redrawn logos, uncertain founder portraits, direct `vercel --prod`, homepage redesign and unrelated site architecture changes.

## Identity and Page Boundaries

The five new routes represent consumer-facing appliance brands or appliance businesses, not their broadest corporate groups:

- `samsung-home-appliances` covers Samsung Electronics' home-appliance and floor-care business. It is not a Samsung Group profile.
- `lg-home-appliances` covers LG Electronics' Home Appliance Solution business and relevant regional entities. It is not an LG Corporation profile.
- `haier-home-appliances` covers the Haier consumer appliance brand and its operation through Haier Smart Home. It does not turn Haier Group into a consumer brand page.
- `ge-appliances` covers Haier US Appliance Solutions, Inc. doing business as GE Appliances, while separating Haier ownership, the licensed GE trademark and the wider General Electric identity.
- `fisher-paykel` covers the distinct Fisher & Paykel Appliances brand and operating organization under Haier ownership.

Groupe SEB, Haier Smart Home, Samsung Group, LG Corporation and similar parents remain ownership or company-analysis subjects. They do not receive `/brands` routes in this release.

## Category Model

Add a sixth category:

- Slug: `home-appliances-small-appliances`
- Name: `Home Appliances & Small Appliances`
- Purpose: profiles for major appliances, small domestic appliances, connected-home platforms and adjacent floor-care portfolios, with emphasis on ownership, manufacturing, regional operation, channels and buyer verification.

Primary membership in the first release:

- Existing: `aeg`, `bosch-home-appliances`, `electrolux`, `midea`, `miele`, `philips-home-appliances`
- New: `samsung-home-appliances`, `lg-home-appliances`, `haier-home-appliances`, `ge-appliances`, `fisher-paykel`

Cross-category rules:

- Samsung Home Appliances, LG Home Appliances, Haier Home Appliances and Midea also appear in Floorcare & Home Cleaning because official sources confirm cleaning-product lines.
- AEG, Bosch Home Appliances, Electrolux, Miele and Philips Home Appliances retain their existing Floorcare & Home Cleaning membership for the same reason.
- GE Appliances and Fisher & Paykel remain only in Home Appliances & Small Appliances unless reviewed official evidence supports a current cleaning-product line.
- Every profile has exactly one primary category but may appear in multiple evidence-supported categories.

## Evidence and Article Relationships

Every profile separates consumer brand, listed or controlling parent, trademark owner or license, operating company, regional seller, manufacturer, physical factory, importer and warranty provider. Group ownership or factory totals are never used to infer the maker or origin of every SKU.

Official company reports, investor filings, transaction announcements, legal notices, warranty terms, model documentation and official product pages are the preferred sources. Unsupported facts are omitted or described as not publicly disclosed.

The existing validator requires at least three distinct tagged articles before a profile can be published. Relationships are added only when an article materially discusses the brand, ownership chain, product portfolio, manufacturing, channel or competitive context. No unrelated article is tagged simply to satisfy the numeric gate.

If any new profile has fewer than three legitimate relationships after the audit, it remains `draft`; the one-time production batch waits rather than lowering the gate or publishing a thin page.

## Visual Package

Each new published profile must contain:

- `/images/brands/{slug}/logo.webp`, retrieved from the official brand site, media library or press kit and preserved as a transparent WebP;
- one real official product, factory, team, store or brand-scene hero with a consistent aspect ratio and sufficient resolution;
- two or three evidence-led content visuals placed in ownership, portfolio, operations or competition sections.

Existing article relationship maps may be reused only when their facts and visual subject match the profile. Editorial article covers are not used as substitutes for real brand heroes. Founder portraits remain absent unless identity and official image provenance are both reliable.

## Directory and Page Experience

The Brand Intelligence directory copy will describe both cleaning and appliance buying coverage. Each category remains a separate section with a short introduction followed directly by brand cards. No duplicate feature labels, keyword lists or extra Explore links are added.

The existing brand-detail component system remains unchanged unless verification exposes a concrete responsive or accessibility defect. New pages use the same compact hero, visible official logo, real hero image, tables, evidence visuals, timeline, articles and source presentation as the current published profiles.

## Testing and Release Gates

- New and updated JSON files pass schema validation and contain at least three authoritative sources.
- Every published new profile has at least three genuine tagged article relationships.
- Category membership, primary-category uniqueness, directory rendering, static routes and sitemap entries are tested.
- Official logos decode as transparent WebP files and remain legible in directory and hero layouts.
- Heroes and content visuals exist locally, match their captions and render without broken paths.
- `npm run test:brands`, relevant content tests and `npm run build` pass.
- `/brands`, the new category route and every new profile pass desktop and 390 px checks for title wrapping, overflow, images, links and console errors.
- The feature branch is pushed, a Vercel Preview is reviewed, and production is released only by merging to GitHub `main` after the already confirmed publication scope is fully satisfied.
- `worldcleanbiz.com` is verified after the Git-linked production deployment.

## Failure Handling

An identity conflict, uncertain trademark or operating boundary, missing official logo, unsuitable real hero, fewer than three legitimate article relationships, failed build or failed Preview keeps the affected profile in draft and blocks the one-time release. The implementation does not overwrite an uncertain slug, invent a relationship, weaken a test or mix the user's unrelated working-tree files into the branch.
