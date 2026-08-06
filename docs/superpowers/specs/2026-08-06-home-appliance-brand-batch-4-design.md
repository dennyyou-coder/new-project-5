# Home Appliance Brand Batch 4 Design

## Scope

Build and publish standalone World Clean Biz brand profiles for:

- Hotpoint (`hotpoint`)
- Toshiba Appliances (`toshiba-appliances`)
- Panasonic (`panasonic`)

This batch must not create or rewrite ownership, manufacturing, or other SEO articles. Existing insight frontmatter and article bodies remain untouched.

## Publishing model

The current validator requires every published brand profile to have at least three tagged articles and at least one primary article. That rule conflicts with the confirmed brand-only workflow and would encourage false or duplicate article relationships.

Published profiles will instead be allowed to stand alone when their own JSON, sources, official logo, real hero image, content visuals, categories, buyer checks, dates, and local assets pass the brand release gate. `BrandArticles` already renders nothing when no related articles exist, so no page-component change is required.

## Evidence boundaries

- Hotpoint must separate the European brand operation from the North American Hotpoint operation and must not imply a single worldwide operator, manufacturer, or warranty entity.
- Toshiba Appliances must be scoped to the Toshiba-branded home-appliance business and regional licences. It must not generalize from television, carrier air-conditioning, infrastructure, or other Toshiba businesses.
- Panasonic must distinguish the consumer brand, Panasonic group entities, regional appliance companies, product-level manufacturers, factories, importers, and warranty providers.
- Ownership is included only as the concise, source-backed identity field required by the existing brand schema. No separate ownership article or expanded ownership content is created.
- Group or factory disclosures never establish the maker or origin of every SKU.

## Visual system

Each profile uses:

- `/images/brands/{slug}/logo.webp` from the official brand or official corporate media source;
- one real official product, factory, team, store, or exhibition hero image, normalized to 1600 by 1000 WebP;
- two dedicated 1600 by 900 SVG evidence visuals under the same brand directory;
- no generated logo, third-party logo site, unrelated collage, or uncertain person photograph.

## Categories and links

All three profiles use `home-appliances-small-appliances` as the primary category. Panasonic may also appear in `floorcare-home-cleaning` only if an official current vacuum or floorcare portfolio is verified. Hotpoint and Toshiba receive no secondary cleaning category without equivalent evidence.

Competitor links point only to already published, directly relevant brand profiles. No parent-company page is introduced.

## Validation

The release gate will be updated test-first to:

- expect 67 published profiles;
- include the three exact new slugs;
- allow a complete standalone profile with no tagged articles;
- retain the existing checks for JSON structure, three unique sources, official logo metadata, local asset integrity, category assignments, sitemap output, and page generation;
- verify the three new logos are transparent WebP files at least 600 pixels wide;
- verify the three hero images are 1600 by 1000 WebP files;
- verify every content visual is dedicated to its brand directory.

After implementation, run the full brand tests, all project test suites, production build, local production-mode browser checks at 1440 pixels and 390 pixels, Vercel Preview checks, GitHub merge, and production verification on `worldcleanbiz.com`.
