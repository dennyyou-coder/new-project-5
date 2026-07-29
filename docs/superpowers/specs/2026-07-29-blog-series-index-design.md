# Blog Series Index Design

## Goal

Give readers a stable place to browse every episode of “Building the World’s No.1 Cleaning Show from Scratch” without first opening the latest article and scrolling to its series navigation.

## User Experience

- Add a permanent series URL:
  `/blog/series/building-worlds-no-1-cleaning-show-from-scratch`
- Keep the Blog Featured Article focused on the latest episode.
- When the featured article belongs to this series, show two distinct actions:
  - `Read Article`
  - `View Full Series`
- Keep the existing `All Episodes`, previous-episode and next-episode navigation on each article.
- On the series page, display the series title, a short description and all published episodes in ascending episode order.
- Each episode card includes its episode number, title, excerpt, publication date, reading time and cover image.
- The layout must work at desktop width and at 390 px without horizontal overflow.

## Content and Data

- Use the existing article frontmatter fields:
  - `series`
  - `series_title`
  - `series_episode`
- Select only published editorial articles whose `series` matches the route slug.
- Sort numeric `series_episode` values in ascending order, with publication date as the fallback.
- The page updates automatically whenever a future article uses the same `series` value.
- Return the site’s normal not-found response when no matching series exists.

## Page Structure

1. Breadcrumb: `Home / Blog / Series`
2. Eyebrow: `WCB Original Series`
3. H1: `Building the World’s No.1 Cleaning Show from Scratch`
4. Short description explaining that the series documents the process of building World Clean Expo in public.
5. Episode count and latest update date.
6. Chronological episode list.
7. Link back to the main Blog page.

The page will reuse existing Blog typography, cards, colors and spacing patterns. No global navigation change or unrelated redesign is included.

## SEO

- Title: `Building the World’s No.1 Cleaning Show from Scratch | World Clean Biz`
- Meta description: `Follow You Denny’s public record of building World Clean Expo, with every episode of the series collected in chronological order.`
- Canonical: the permanent series URL.
- Breadcrumb structured data.
- CollectionPage and ItemList structured data containing the published episodes.

## Implementation Boundaries

- Add one dynamic series route under `app/blog/series/[series]/`.
- Add a small series-selection helper only if needed to keep sorting and filtering independently testable.
- Update the Blog Featured Article actions without changing how the featured episode is selected.
- Reuse existing components and styles where practical; add only narrowly scoped series-page styles.
- Do not change article content, article URLs, category filters, the site header, or other Blog cards.

## Testing and Verification

- Add a failing test first for series filtering and numeric episode ordering.
- Add a failing test for the Blog Featured Article’s `View Full Series` destination.
- Verify focused tests, the full Blog test suite and the production build.
- Check the series page and Blog Featured Article in a browser at desktop and 390 px.
- Verify titles, links, episode order, images, canonical metadata, structured data, overflow and browser-console errors.

## Release

- Work on the isolated `codex/blog-series-index` branch.
- Push the feature branch and verify a Vercel Preview.
- Obtain explicit production approval after preview review.
- Merge to `main`, let GitHub trigger Vercel production and verify the live URLs.
