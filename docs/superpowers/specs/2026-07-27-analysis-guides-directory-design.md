# Analysis and Guides Directory Redesign

Date: 2026-07-27

## Goal

Keep the current `/blog` landing page unchanged while redesigning the two
directory experiences opened from:

- `View all analysis`
- `Browse all guides`

Both destinations will reuse the previous World Clean Biz Blog structure:
a single-column article feed in the main content area and a contextual,
sticky sidebar on desktop.

## Confirmed Scope

### Unchanged

- `/blog`
- The featured series section
- The six-card Deep Analysis section
- The six-card Practical Guides section
- Existing article URLs
- Existing article content and images
- Existing guide taxonomy
- Existing canonical URLs and structured data intent

### Redesigned

- `/blog/archive`, including the `#analysis` destination
- `/guides`
- `/guides/[type]`

## Page Structure

### Analysis directory

`/blog/archive` becomes the complete Analysis directory. The existing
`/blog/archive#analysis` link continues to work and lands at the feed heading;
it does not require client-side hash filtering.

The page contains:

1. A compact page introduction showing the directory name and article count.
2. Analysis category filters.
3. A main feed with one article per row.
4. Ten articles per page.
5. Pagination below the feed.
6. A sticky right sidebar on desktop.

Each article row contains:

- Cover image
- Category
- Title
- Short excerpt
- Publication date
- Reading time
- A full-card link to the article

The analysis sidebar contains:

- Directory navigation: All Analysis, Industry Guides, Back to Blog
- Popular analysis categories
- Latest analysis articles with thumbnails
- A compact World Clean Biz or market-research entry where space allows

### Guides directory

`/guides` becomes the complete Guides directory rather than a large set of
text-heavy category panels.

The page contains:

1. A compact Guides introduction and total guide count.
2. Guide-type filters.
3. A main feed with one guide per row.
4. Ten guides per page.
5. Pagination below the feed.
6. A sticky right sidebar on desktop.

Each guide row contains:

- Cover image
- Guide type or category
- Title
- Short excerpt
- Publication date when available
- Reading time
- A full-card link to the guide

The Guides sidebar contains:

- Six guide categories
- Popular or high-value guides
- Latest guides with thumbnails
- A compact World Clean Biz author or research entry

### Guide category pages

`/guides/[type]` uses the same Guides directory shell.

The selected guide type is:

- Reflected in the heading
- Highlighted in the filters and sidebar
- Used to restrict the article feed
- Preserved when changing pages

## Visual Direction

The redesign reuses the previous Blog feed rather than creating a new card
system.

Desktop layout:

- Main feed: flexible width
- Sidebar: approximately 300–340 px
- Gap: approximately 36–40 px
- Article row image: approximately 300–320 px wide, 16:9
- Sidebar remains visible while scrolling when viewport height allows

Mobile layout:

- One content column
- Article image above article copy
- Sidebar modules move below the feed
- Filters become horizontally scrollable
- Pagination remains keyboard accessible and wraps when needed

Images use `object-fit: contain` so existing editorial artwork is not cropped.

## Content and Data Behavior

- `/blog/archive` renders only the existing editorial collection.
- Guide content comes from the existing guide collection.
- Existing sorting remains newest-first.
- Existing guide taxonomy remains authoritative.
- Pagination and filter parameters are server-rendered.
- Filtered and paginated URLs use `noindex, follow` when appropriate.
- Canonical URLs remain `/blog/archive`, `/guides`, and the existing
  `/guides/[type]` paths.
- The `/blog/archive` structured-data item count and list include only visible
  analysis content.
- `ItemList`, `CollectionPage`, and breadcrumb structured data remain aligned
  with the visible page content.

## Accessibility

- Feed and sidebar use semantic `main` and `aside` regions.
- The active filter and current page expose `aria-current`.
- Every article row has one clear accessible link name.
- Visible focus states match the current World Clean Biz design system.
- Images keep meaningful alt text; decorative sidebar thumbnails use empty alt
  text only when the adjacent title supplies the same information.
- Mobile reading order places the article feed before sidebar content.
- No hover-only information is introduced.

## Performance

- Images below the fold remain lazy-loaded.
- The first visible feed image may load eagerly.
- Archive items retain content-visibility optimization where safe.
- Only the current page of results is rendered in the feed.
- No new image assets or third-party scripts are required.

## Validation

Before presenting the preview:

1. Confirm `/blog` is visually and functionally unchanged.
2. Confirm `View all analysis` opens the new analysis feed.
3. Confirm `Browse all guides` opens the new Guides feed.
4. Confirm all six `/guides/[type]` routes use the same layout and correct
   filtered content.
5. Confirm pagination preserves the selected directory or guide type.
6. Confirm article links, cover images, dates, and reading times render.
7. Check desktop and mobile layouts.
8. Check keyboard focus, active filters, and reading order.
9. Run focused tests and a production build.
10. Create a Vercel Preview and obtain explicit approval before production.

## Release Boundary

The redesign will first be shown in a preview deployment. Production remains
unchanged until the user explicitly approves deployment.
