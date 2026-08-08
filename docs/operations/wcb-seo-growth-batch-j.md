# WCB SEO Growth Batch J

This is the operational record for three high-intent ownership and manufacturing guides selected from the approved update-first SEO growth plan.

## Authorization

- Denny instructed the next batch to continue through production without routine confirmation.
- The authorized path includes collision checks, current primary-source research, English writing, visuals, tests, independent review, PR, merge, Git-linked Vercel production deployment and live verification.
- Work is isolated in `codex/wcb-seo-growth-batch-j-20260808` from `origin/main` at `349e0305252d6f8f21d81161c7cdeb819c0d5117`.

## Fixed scope

| Order | Fixed title | Slug | Intent boundary | Status |
|---:|---|---|---|---|
| 1 | Who Owns Frigidaire? Electrolux, Manufacturing and Brand History Explained | `who-owns-frigidaire-electrolux-manufacturing` | Frigidaire child brand; distinct from the Electrolux parent-company guide | `published_verified` |
| 2 | Who Owns Maytag? Whirlpool, Manufacturing and the Appliance Brand Explained | `who-owns-maytag-whirlpool-manufacturing` | Maytag child brand; distinct from the Whirlpool parent and regional licensing guide | `published_verified` |
| 3 | Who Makes Henry Vacuum Cleaners? Numatic, UK Manufacturing and the Product Family Explained | `who-makes-henry-vacuum-cleaners-numatic` | Henry product family; distinct from the Numatic Brand Intelligence profile and historical commentary | `published_verified` |

## Collision and intent checks

- Exact production URLs returned 404 before the release, and repository plus site searches found no matching title, slug or same-intent page.
- Frigidaire receives a child-brand history, manufacturing-context and model-verification page; the existing Electrolux page remains the listed-parent and group-portfolio answer.
- Maytag receives a child-brand history and model-scoped manufacturing page; the existing Whirlpool page remains the parent-company and Beko Europe licensing answer.
- Henry receives a product-family manufacturer and supply-chain page; the Numatic Brand Intelligence page remains the canonical brand profile.

## Current primary-source lock

| Topic | Locked conclusion | Primary evidence |
|---|---|---|
| Frigidaire ownership | Frigidaire is a current Electrolux Group main brand; the brand history runs through GM, WCI and Electrolux | Electrolux Group Annual Report 2025, current brand strategy and official Frigidaire history |
| Frigidaire manufacturing | Electrolux has named North American production units, but exact origin remains model-specific | Electrolux North America page, current Frigidaire support and CPSC model records |
| Maytag ownership | Whirlpool acquired Maytag in 2006 and currently markets the Maytag brand | Whirlpool Corporation Annual Report 2025 and official Maytag history |
| Maytag manufacturing | Named product pages support selected U.S. assembly examples; Whirlpool's 80% statement is portfolio-level | Current Maytag product pages and official U.S. manufacturing page |
| Henry manufacturer | Numatic International Ltd operates MyHenry and makes the Henry product family | Numatic official company information, history and MyHenry terms |
| Henry manufacturing | Numatic reports one UK manufacturing plant in Chard; overseas subsidiaries distribute rather than manufacture | Numatic 2025 modern-slavery statement and current support terms |

## Visual manifest and fact locks

- Visual system: `industry_map`, with one generated conceptual cover and two deterministic information maps per article.
- Covers are generic editorial concepts with no logos, readable marks or claim that they show an official factory or product.
- All factual words in the information maps trace to the source lock above; group footprint and portfolio claims are visually separated from model-level conclusions.

| Article | Image | Role and fact lock | Status |
|---|---|---|---|
| Frigidaire | `frigidaire-electrolux-manufacturing-cover.webp` | Generic North American appliance-network concept | local_pass |
| Frigidaire | `frigidaire-ownership-history-map.webp` | 1919, 1979, 1986 and current group relationship | local_pass |
| Frigidaire | `frigidaire-manufacturing-model-verification-map.webp` | Named group footprint, CPSC examples and model-label boundary | local_pass |
| Maytag | `maytag-whirlpool-manufacturing-cover.webp` | Generic U.S. appliance-manufacturing concept | local_pass |
| Maytag | `maytag-ownership-whirlpool-history-map.webp` | 1893 founding, 2006 acquisition and current parent | local_pass |
| Maytag | `maytag-manufacturing-model-verification-map.webp` | Named model examples and portfolio-claim boundary | local_pass |
| Henry | `henry-vacuum-cleaners-numatic-cover.webp` | Generic UK vacuum-manufacturing concept | local_pass |
| Henry | `henry-numatic-company-product-family-map.webp` | Numatic, 1981 Henry inception and Chard relationship | local_pass |
| Henry | `henry-manufacturing-supply-chain-verification-map.webp` | Global inputs, UK final production and distribution boundary | local_pass |

## Release gates

- Stage order: `queued → researching → local_verified → preview_verified → published_verified`.
- Fresh baseline on the release base passed: content classification, 15 insight tests and 99 brand tests.
- Local gate requires classification, insight and brand tests, production build, image decode, metadata/schema review and desktop plus 390px rendering.
- Independent review must return `PASS` before release.
- Production gate requires HTTP 200, title/H1/description/canonical/schema, all nine visuals, guide discovery, sitemap, desktop/mobile layout and console review.

## GSC measurement

- Saved site baseline for 2026-07-09 through 2026-08-05: 91 clicks, 17,200 impressions, 0.5% CTR and average position 11.4.
- These are site observations, not fabricated keyword-volume estimates.
- Day 7 checks crawl and technical health; Day 14 checks early query coverage; Day 28 is the main comparison.

## Local release gate

- Content classification passed.
- All 15 insight tests and all 99 brand tests passed after registering the three approved article-to-brand relationships and replacing Numatic's obsolete no-article expectation with an exact Henry-only relationship.
- The full Next.js production build completed successfully and generated 570 pages, including all three new routes.
- All nine visual assets decode as 1600×900 WebP files and passed a contact-sheet review for text legibility, claim boundaries and generated-mark artifacts.
- Desktop 1440px and mobile 390px checks confirmed HTTP 200, expected title/H1/description, production canonical, BlogPosting schema and three article images on each route.
- Every internal article link returned HTTP 200 and no horizontal overflow appeared at either viewport.
- The only local console error was the expected unavailable `/_vercel/insights/script.js` outside Vercel.
- Independent release review returned `PASS` after two repairs: the Frigidaire 1986 timeline label was shortened to eliminate clipping, and the two missing Maytag model-specific official source links were added.

## Production evidence

- Ready PR: #62.
- Squash-merge commit on `main`: `00b94cbd85ed5cc2d7670e87ea9210b78be5d794`.
- Git-linked Vercel production deployment: `dpl_EnDeAnYwRtiKm7wgroMwhaKsU4Su`, status `READY`.
- Live verification passed for the three article URLs, all nine article visuals, ownership-guide discovery, sitemap discovery, metadata/schema and desktop/mobile rendering.
