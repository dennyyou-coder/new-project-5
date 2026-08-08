# WCB SEO Update Batch H

This is the operational record for the controlled update-first SEO batch covering three existing ownership guides. The batch expands manufacturing search intent inside the authoritative existing pages and creates no new article URL.

## Authorization

- Denny approved the update-first plan and instructed execution on 2026-08-08.
- The authorized path includes research, article-local edits, visual review, tests, PR, Git-linked Vercel production deployment and live verification without another routine confirmation.
- Production authority at the start of work: GitHub `origin/main` commit `61e1409`.

## Fixed scope

| Order | Page | Existing slug | Action | Status |
|---:|---|---|---|---|
| 1 | DeWalt | `who-owns-dewalt-stanley-black-decker` | Update existing page; no new `who makes` URL | `published_verified` |
| 2 | Husqvarna | `who-owns-husqvarna-automower-motorcycles` | Update existing page; no new `who makes` URL | `published_verified` |
| 3 | Ryobi | `who-owns-ryobi-tti-kyocera` | Update existing page; no new `who makes` URL | `published_verified` |

## GSC baseline

The latest saved 28-day window is 2026-07-09 through 2026-08-05.

| Page | Clicks | Impressions | Approximate CTR |
|---|---:|---:|---:|
| DeWalt ownership | 4 | 1,893 | 0.21% |
| Husqvarna ownership | 0 | 799 | 0% |
| Ryobi ownership | 1 | 669 | 0.15% |

The site-level baseline was 91 clicks, 17,200 impressions, 0.5% CTR and average position 11.4. These are GSC observations, not invented monthly keyword-volume estimates.

## Collision and intent decision

- Each brand already has one authoritative ownership guide with manufacturing coverage.
- Creating separate `who makes DeWalt`, `who makes Husqvarna` or `who makes Ryobi` pages would substantially overlap the existing pages and risk search cannibalization.
- The existing slugs, canonicals and original publication dates remain unchanged.
- Only the DeWalt title is shortened to bring Stanley Black & Decker and manufacturing into the visible result title. Husqvarna and Ryobi retain their established primary title intent.

## Current-source verification

- DeWalt: Stanley Black & Decker's 2025 Form 10-K continues to list DEWALT as a priority Tools & Outdoor trademark and describes the group's products and global operating network. Official model files still support model-specific licensed-manufacturer boundaries.
- Husqvarna: Husqvarna Group's 2025 annual report and current Global Presence page continue to identify the listed group structure and robotic-lawnmower manufacturing teams in Aycliffe, England, and Mielec, Poland.
- Ryobi: Ryobi Limited's official transfer notice continues to state that TTI manufactures and distributes RYOBI tools in the United States, Canada, Europe, Australia and New Zealand and has no capital relationship with Ryobi Limited. TTI's 2025 annual report continues to state that RYOBI is a Ryobi Limited trademark used under license.

## Article-local changes

- Add a direct `Who makes ...?` answer immediately after the ownership answer on each page.
- Tighten meta descriptions around the combined ownership and manufacturing intent.
- Preserve the detailed ownership, license, factory, model, regional, warranty and procurement sections already supported by official sources.
- Correct stale publication-status metadata and record the genuine 2026-08-08 content update.
- Reuse the six existing reviewed 1600×900 WebP assets; no visual fact changed and no duplicate illustration is required.

## Release gates

- `queued → researching → local_verified → preview_verified → published_verified`
- Required local checks: content classification, insight tests, brand tests, full production build, exact metadata/canonical/schema review, image decoding and desktop plus 390px rendering.
- Required production checks: three HTTP 200 pages, expected title/H1/description/canonical/schema, all visuals, no overflow or article-related console error, ownership guide discovery and sitemap inclusion.
- Save PR, merge commit and Vercel deployment evidence here after production verification, or synchronize it in the next substantive article PR if a record-only deployment would otherwise be required.

## Local release gate

- Content classification passed.
- All 15 insight tests and all 97 brand tests passed.
- The full Next.js production build completed successfully and generated 558 pages.
- All three local production routes rendered the expected title, H1, description, production canonical and BlogPosting schema.
- The six article visuals loaded successfully at 1600×900.
- Desktop and 390px mobile checks found no horizontal overflow; mobile H1 and article images remained within the viewport.
- The only browser-console error was the expected unavailable `/_vercel/insights/script.js` endpoint outside Vercel.
- Independent release review passed on 2026-08-08 with no required repairs or release blockers.

## Measurement checkpoints

- Day 7: crawl/indexing, canonical, title rewriting and technical checks only.
- Day 14: early query coverage and CTR signal; no automatic rollback for short-term volatility.
- Day 28: compare against the baseline above. Expand the update-first method only after reviewing CTR, average position, clicks and newly covered manufacturing queries.

## Production release evidence

- GitHub PR: `#57`
- Production commit: `303040c`
- Vercel deployment: `dpl_39aNm5sB8VwaeYzFfbdRJUfBjn2J`
- Production verification: all three retained URLs returned HTTP 200 with the expected title, H1, canonical, BlogPosting schema, visuals and ownership-guide discovery.
