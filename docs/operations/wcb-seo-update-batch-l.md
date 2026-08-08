# WCB SEO Update Batch L

This operational record covers three existing ownership guides selected from a fresh 28-day Google Search Console export.

## Authorization and scope

- Denny instructed the next batch to continue through production without routine confirmation.
- Work is isolated in `codex/wcb-seo-update-batch-l-20260808` from `origin/main` at `7c038177d3f5fca3e2faaa0b1e46ef009c7ba9d8`.
- This is a controlled CTR and intent refresh. Slugs, canonicals, original publication dates and sort dates remain unchanged.

| Order | Updated page | Existing slug | Main update | Status |
|---:|---|---|---|---|
| 1 | Who Owns Dyson? James Dyson, Private Status and Origin | `who-owns-dyson-james-dyson-singapore-manufacturing` | Shorter result title plus explicit private-company and country-of-origin answer | `published_verified` |
| 2 | Who Owns Miele? Family Ownership, Origin and Factories | `who-owns-miele-family-manufacturing-network` | Shorter result title plus direct German-origin answer | `published_verified` |
| 3 | Who Owns Kärcher? Family Ownership, Origin and Factories | `who-owns-karcher-family-professional-cleaning-network` | Shorter result title plus direct German-origin answer | `published_verified` |

## Search and collision decision

- Fresh GSC window: 2026-07-09 through 2026-08-05; 91 clicks, 17,200 impressions, 0.5% CTR and average position 11.4.
- GSC audit artifact: `worldcleanbiz.com-Performance-on-Search-2026-08-08.zip`; SHA-256 `3589cba7b12b981374292618778c8a411824dcf6ff9054e86ae023d2682ec7d6`.
- Dyson page baseline: 13 clicks, 1,609 impressions, 0.81% CTR and average position 15.75. The exact query `who owns dyson` had 271 impressions, zero clicks and average position 7.94.
- Miele page baseline: 5 clicks, 1,087 impressions, 0.46% CTR and average position 8.44. The exact query `who owns miele` had 111 impressions, one click and average position 7.77; `who owns miele appliances` added 36 impressions.
- Kärcher page baseline: 6 clicks, 1,453 impressions, 0.41% CTR and average position 10.34. `who owns karcher` had 25 impressions, zero clicks and average position 7.6; origin-country variants added at least 47 impressions.
- Repository and production checks found one established page for each intent. Decision: update in place and do not create competing `Who Makes` or country-origin URLs.

## Current primary-source lock

| Topic | Locked conclusion | Current primary evidence |
|---|---|---|
| Dyson ownership | Sir James Dyson remains the one active person with significant control of Dyson UK Group Limited at the 75%-or-more thresholds | Current UK Companies House PSC record |
| Dyson identity and manufacturing | Dyson is British-founded, globally headquartered in Singapore and uses a multi-country manufacturing and supplier network | Current Dyson and Singapore EDB disclosures already cited in the article |
| Miele ownership and origin | Miele has remained an independent German family company owned by the Miele and Zinkann families since 1899 | Current Miele About and Management pages |
| Miele manufacturing | Miele distinguishes 14 own production sites from a broader 19-plant network that includes subsidiary and joint-venture operations | Current Miele business-development, sustainability and factory pages already cited in the article |
| Kärcher ownership and origin | Kärcher remains a private German family company headquartered in Winnenden | Current Kärcher company and legal pages |
| Kärcher manufacturing | Kärcher operates production and logistics sites in Germany and multiple other countries; the site list does not establish model origin | Current Kärcher sustainability site directory |

## Visual review and reuse

- Ownership and manufacturing conclusions did not change, so the six existing 1600×900 WebP visuals remain factually aligned.
- Direct full-resolution review confirmed readable labels, no clipping, no visible generated-word artifacts and correct separation of ownership from operating and manufacturing roles.

| Article | Existing visuals | Review result |
|---|---|---|
| Dyson | `who-owns-dyson-james-dyson-cover.webp`; `dyson-ownership-headquarters-manufacturing-map.webp` | PASS |
| Miele | `who-owns-miele-family-cover.webp`; `miele-family-company-manufacturing-map.webp` | PASS |
| Kärcher | `who-owns-karcher-family-cover.webp`; `karcher-family-group-manufacturing-map.webp` | PASS |

## Release gates

- Fresh baseline on the release base passed content classification, 15 insight tests and 101 brand tests.
- Local gate requires classification, insight and brand tests, production build, image decode, metadata/schema review and desktop plus 390px rendering.
- Independent review must return `PASS` before release.
- Production gate requires the three unchanged URLs to return HTTP 200 with the expected title, H1, description, canonical and BlogPosting schema; visuals, guide discovery, sitemap, layout and console must also pass.

## Local release gate

- Content classification passed.
- All 15 insight tests and all 101 brand tests passed after the final repair.
- The production build completed successfully and generated 576 pages, including the three unchanged article routes.
- All six reused article visuals decode as 1600×900 WebP files and passed direct full-resolution review.
- Desktop 1440px and mobile 390px checks confirmed the expected title, H1, description, production canonical, BlogPosting schema and two complete 1600×900 article visuals on every route.
- No horizontal overflow or unexpected HTTP error occurred at either viewport. The only local 404 was the expected unavailable `/_vercel/insights/script.js` outside Vercel.
- All 28 unique internal-link checks passed: 10 on Dyson, 10 on Miele and 8 on Kärcher.
- Browser review found and repaired one stale Kärcher history link before the final build; the corrected target returned HTTP 200.
- Ownership-guide discovery passed on page 10 for Dyson and page 9 for Miele and Kärcher. All three sitemap entries passed.
- Fresh independent read-only review returned `PASS` with no release blocker. It confirmed the GSC values, unchanged URL/date fields, intent alignment, primary-source boundaries, visual reuse, repaired Kärcher link and Batch K production evidence.

## Production evidence

- Ready PR: #65.
- Squash merge on `main`: `4826a7181e2d8ae14e9ea15b165560e1681417b3`.
- Git-linked Vercel production deployment: `dpl_8x8wqJP62HkS46tzF7QzYRqNTGTn`, status `READY`.
- Live verification passed for all three unchanged URLs: HTTP 200, expected title, H1, description, canonical, BlogPosting schema, article visuals, ownership-guide discovery and sitemap entry.
- Desktop and 390px mobile rendering passed with no horizontal overflow and no production console errors.
