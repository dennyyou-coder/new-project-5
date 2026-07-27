# Directory Series Feature and Sidebar Redesign

Date: 2026-07-27

## Goal

Improve the redesigned Analysis and Guides directories by adding the World
Clean Biz ongoing series as a distinctive editorial feature and replacing the
generic sidebars with content that strengthens author trust and helps readers
discover relevant companies, guide categories, and strategically important
articles.

This enhancement builds on
`2026-07-27-analysis-guides-directory-design.md`. The approved `/blog` landing
page remains unchanged.

## Confirmed Scope

### Redesigned

- `/blog/archive`
- `/guides`
- `/guides/[type]` sidebar structure
- Shared directory components and styles
- Analysis company and brand filtering

### Unchanged

- `/blog`
- Individual article pages and URLs
- The existing six Guide categories
- Existing article content and images
- Existing canonical URL strategy
- Ten feed items per page
- Production deployment approval boundary

## Selected Visual Direction

The user selected the editorial-feature layout, option A.

The main Analysis and Guides directory landing pages contain:

1. Existing navy directory introduction.
2. A full-width ongoing-series feature.
3. Existing horizontal category filters.
4. Existing single-column article feed.
5. A redesigned contextual sidebar.

The series feature spans the full directory container rather than occupying one
feed column. This gives the ongoing series clear editorial importance without
changing the approved `/blog` landing page.

## Ongoing-Series Feature

### Content source

Both directories use the existing series identifier:

`building-worlds-no-1-cleaning-show-from-scratch`

The feature resolves the latest episode with the existing
`getLatestSeriesInsight` helper. When Episode 02 or a later episode is
published, the directory feature updates automatically.

### Visible content

The feature contains:

- `Ongoing Series · Latest Episode` eyebrow
- Series title
- Latest episode title
- Episode excerpt
- Existing episode cover image
- `Read latest episode` link
- `View all episodes` link to the article's `#series-episodes` section

The entire feature is visually distinct, but only the explicit actions are
links. The image uses `object-fit: contain` so the editorial artwork is not
cropped.

### Route behavior

The full series feature appears on:

- `/blog/archive` with no filters or pagination
- `/guides` with no pagination

It is not repeated on:

- Analysis category or company-filtered URLs
- Analysis page 2 and later
- Guide page 2 and later
- `/guides/[type]`

This keeps the main directory landing pages editorially distinctive without
forcing readers to pass the same large feature again while browsing a filtered
or paginated collection.

## Author Profile Module

The profile is the first sidebar module on Analysis and Guide pages.

It contains:

- Existing Denny event portrait
- Name: Denny You
- Founder, World Clean Biz
- Organizer, World Clean Expo
- Inside the cleaning industry since 2006
- A short sentence explaining the combination of industry analysis, sourcing
  judgment, and global industry connections
- `About Denny You` link

The wording uses facts already present on the website. It does not introduce
new scale, audience, revenue, or event claims.

## Analysis Sidebar

The Analysis sidebar order is fixed:

1. Denny profile
2. Company & Brand Index
3. Important Analysis

The existing `Explore World Clean Biz`, `Popular Analysis Categories`, and
`Latest Articles` sidebar modules are removed.

### Company & Brand Index

All configured company and brand keyword groups that match at least one
editorial Analysis article are displayed directly. Nothing is hidden behind a
`View all`, accordion, modal, or secondary page.

The index uses a compact wrapping keyword layout and alphabetical ordering.
Long names may occupy a full line while shorter names share a line. The module
remains readable at the existing 300–340 px sidebar width.

The initial normalized registry is:

- Aiper
- ALDI
- Amazon
- Anker / Eufy
- Beatbot
- Benewake
- BISSELL
- Bosch
- Chervon
- Chyson
- De’Longhi
- Deerma
- DEWALT
- DJI / ROMO
- Dreame
- Dyson
- EAI
- Ecovacs
- EGO
- Fluidra
- Freudenberg / Vileda
- Godfreys
- Groupe SEB / Rowenta
- Hamilton Beach
- Hoover
- Husqvarna
- Insta360
- iRobot / Roomba
- Kärcher
- Kingclean
- Kress
- Laifen
- Lymow
- Makita
- Mammotion
- Maston
- Maytronics / Dolphin
- Midea
- Miele
- MOVA
- Narwal
- Navimow / Segway
- Nilfisk
- Philips Domestic Appliances
- Picea Robotics
- Pudu Robotics
- Roborock
- Ryobi
- SharkNinja / Shark / Ninja
- Silver Star
- Stanley Black & Decker / BLACK+DECKER
- STIHL
- Sunseeker
- TerraMow
- Tineco
- TTI / Milwaukee
- Uwant
- Vermop
- Vorwerk
- Worx
- WYBOT
- Xiaomi / Mijia
- Xinbao / Guangdong Xinbao
- Yarbo

Registry entries are shown only when the current editorial collection contains
a title or tag matching at least one configured alias. Product models,
technology terms, people, exhibitions, countries, channels, and generic
industry keywords are excluded.

### Company filtering

Each company keyword is a server-rendered link using a `company` query
parameter.

Filtering rules:

- Match against normalized article titles and tags.
- Aliases in one registry group return one combined result set.
- Selecting a company clears category and page parameters.
- Selecting an Analysis category clears company and page parameters.
- Pagination preserves the selected company.
- The selected company exposes `aria-current="page"`.
- An invalid or unmatched company value falls back to All Analysis.
- Company-filtered URLs use `noindex, follow`.
- The canonical remains `/blog/archive`.

The index itself remains complete on company-filtered result pages so readers
can switch directly between companies.

### Important Analysis

Important Analysis is editorially curated rather than date-driven.

It uses existing editorial articles with `featured: true`, ordered newest
first. Each item contains a small image, article title, and date. If no
editorial articles are featured, the module is omitted rather than replaced by
an arbitrary latest-article list.

## Guides Sidebar

The Guides sidebar order is fixed:

1. Denny profile
2. Guide Categories
3. Essential Guides

The same structure is used on `/guides` and `/guides/[type]`.

### Guide Categories

The module lists the existing six authoritative Guide categories:

- Buying Guides
- Brand Ownership
- Product Comparisons
- OEM & Sourcing
- Maintenance & Troubleshooting
- Technology & Market Explainers

The active Guide type is highlighted on `/guides/[type]`. `/guides` also
provides an `All Industry Guides` entry.

### Essential Guides

Essential Guides uses the existing positive `guide_priority` values through
`getFeaturedGuides`.

It displays up to six high-value Guides, preserving the current priority order:

- Distributor and dealer evaluation
- Manufacturing cost
- OEM/ODM
- Factory and supplier audit
- Other explicitly prioritized commercial Guides

Each entry contains a small image, title, and reading time. This module is not
replaced by the latest Guides because the purpose is commercial and practical
importance rather than recency.

## Scrolling and Responsive Behavior

### Desktop

- The Guides sidebar may retain sticky behavior when its total height fits the
  viewport naturally.
- The Analysis sidebar uses normal document scrolling because the complete
  company index is intentionally long.
- The main feed remains the dominant column.
- The company index wraps within the sidebar and never creates horizontal
  overflow.

### Mobile

- The feed remains before the sidebar in reading order.
- The author profile, complete company index or Guide categories, and important
  links appear below the feed.
- Every company keyword remains visible.
- Keyword links have at least a 44 px effective tap target.
- No horizontal page overflow is introduced.

## Component Boundaries

The implementation should keep responsibilities separated:

- A directory-series component renders the shared ongoing-series feature.
- A profile component renders the shared Denny module.
- Analysis company registry and matching logic live in a dedicated content
  helper, not inside JSX.
- Analysis and Guide pages choose their own sidebar data.
- The shared directory shell renders supplied sidebar modules without knowing
  how company matching or Guide prioritization works.

The existing Blog series component may share data helpers, but its markup and
approved visual layout must remain unchanged.

## SEO and Structured Data

- The series feature links to the existing article URL; it does not create a
  duplicate article.
- The series article is not added to the directory feed count unless it already
  belongs to that feed.
- Company filtering does not alter the authoritative Analysis collection
  schema beyond the visible filtered `ItemList`.
- Filtered and paginated URLs remain `noindex, follow`.
- Canonicals remain `/blog/archive`, `/guides`, and `/guides/[type]`.
- Existing article, breadcrumb, and collection URLs remain unchanged.

## Accessibility

- The series feature has one heading inside the page heading hierarchy.
- Both series actions have distinct accessible names.
- The company index is a labelled navigation region.
- Active category, company, and pagination links expose `aria-current`.
- Sidebar images have meaningful alt text; repeated article thumbnails may use
  empty alt text when adjacent link text supplies the title.
- Focus states remain visible and consistent with the existing blue design
  system.
- No content depends on hover or collapsed controls.

## Validation

Before presenting the revised preview:

1. Confirm `/blog` source and rendered layout remain unchanged.
2. Confirm both root directories display the same latest series episode.
3. Confirm filtered, paginated, and Guide-type pages do not repeat the full
   series feature.
4. Confirm every visible company keyword returns at least one Analysis article.
5. Confirm aliases return the correct combined result set.
6. Confirm selecting a company clears category and selecting a category clears
   company.
7. Confirm pagination preserves the selected company.
8. Confirm the complete company index is visible without an expansion control.
9. Confirm Important Analysis uses only `featured: true` editorial articles.
10. Confirm Essential Guides follow existing positive Guide priorities.
11. Confirm desktop and mobile layouts have no horizontal overflow.
12. Confirm focus, heading order, reading order, and active states.
13. Run focused behavior tests, the complete test suite, and a production build.
14. Create a new Vercel Preview and obtain explicit approval before production.

## Release Boundary

The enhancement is released first as a Vercel Preview. Production remains
unchanged until the user explicitly approves deployment.
