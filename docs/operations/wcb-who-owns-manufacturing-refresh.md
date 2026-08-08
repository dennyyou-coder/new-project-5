# WCB Who Owns Manufacturing Refresh

This queue governs the sitewide update-in-place program for established `Who Owns` guides that do not yet give a sufficiently direct manufacturing answer near the top of the page.

## Program rule

- Keep the existing slug, canonical, publication date and sort date.
- Add a concise **Who makes/manufactures it?** answer immediately after the ownership answer.
- Separate brand owner, industrial group, legal manufacturer, factory and country of origin.
- Use model-level evidence where the group-level record does not identify one factory for the full range.
- Reuse the current visual package unless a factual relationship changes.
- Do not create a competing `Who Makes` URL for the same brand intent.

## Audit baseline

- Repository audit: 79 current article titles begin with `Who Owns`.
- 51 already meet the direct ownership-plus-manufacturing standard.
- 28 require a first-screen answer, a clearer manufacturing heading or both.
- Fresh GSC window: 2026-07-09 through 2026-08-05.
- GSC artifact: `worldcleanbiz.com-Performance-on-Search-2026-08-08.zip`; SHA-256 `3589cba7b12b981374292618778c8a411824dcf6ff9054e86ae023d2682ec7d6`.

## Traffic-first queue

The first four pages are ordered by observed GSC exposure. Remaining pages are grouped by brand-search opportunity; exact order inside each future batch may be promoted when fresh page or query data identifies a stronger opportunity.

| Priority | Existing slug | Required update | Status |
|---:|---|---|---|
| 1 | `who-owns-dyson-james-dyson-singapore-manufacturing` | Add direct group-versus-model manufacturing answer near the top | `published_verified` |
| 2 | `who-owns-karcher-family-professional-cleaning-network` | Add direct answer and explicit Who Makes heading | `published_verified` |
| 3 | `who-owns-eureka-midea-electrolux-manufacturing` | Add direct Midea-group versus Midea Robozone model boundary near the top | `published_verified` |
| 4 | `who-owns-tti-milwaukee-ryobi-hoover-vax-oreck` | Add direct group-manufacturing answer and clearer section | `published_verified` |
| 5 | `who-owns-ecovacs-tineco-manufacturing` | Move explicit manufacturer answer into the first screen | `published_verified` |
| 6 | `who-owns-electrolux-brands-manufacturing` | Move explicit manufacturer answer into the first screen | `published_verified` |
| 7 | `who-owns-bissell-family-sanitaire` | Move explicit manufacturer answer into the first screen | `published_verified` |
| 8 | `who-owns-whirlpool-appliances-beko-europe` | Move explicit manufacturer answer into the first screen | `published_verified` |
| 9 | `who-owns-hoover-tti-haier-candy` | Move current market-specific manufacturing answer into the first screen | `published_verified` |
| 10 | `who-owns-beko-appliances-beko-europe` | Add direct Beko Europe manufacturing answer near the top | `published_verified` |
| 11 | `who-owns-tineco-ecovacs-group` | Add direct group-versus-model manufacturing answer near the top | `published_verified` |
| 12 | `who-owns-eufy-anker-smart-home` | Add direct Anker-group versus supplier/factory answer near the top | `published_verified` |
| 13 | `who-owns-bosch-appliances-bsh-siemens-brands` | Add an explicit manufacturing section and direct first-screen answer | `local_verified` |
| 14 | `who-owns-skil-tools-chervon` | Add direct Chervon manufacturing answer near the top | `local_verified` |
| 15 | `who-owns-stihl-family-manufacturing` | Add direct global production-network answer near the top | `local_verified` |
| 16 | `who-owns-einhell-power-x-change` | Add direct manufacturer and sourcing-network answer near the top | queued |
| 17 | `who-owns-metabo-metabo-hpt-hikoki` | Add brand-specific manufacturer answer near the top | queued |
| 18 | `who-owns-aeg-power-tools-tti-license` | Add direct trademark-owner, licensee and manufacturer boundary near the top | queued |
| 19 | `who-owns-delonghi-appliance-group-brands` | Add direct group-manufacturing answer near the top | queued |
| 20 | `who-owns-braun-appliances-delonghi-pg-license` | Add direct licensee/manufacturer answer near the top | queued |
| 21 | `who-owns-breville-sage-regional-brand-rights` | Add direct regional-brand and manufacturer answer near the top | queued |
| 22 | `who-owns-gardena-husqvarna-sileno-manufacturing` | Add direct Husqvarna-group manufacturing answer near the top | queued |
| 23 | `who-owns-hayward-pool-products` | Add direct group-versus-product manufacturing answer near the top | queued |
| 24 | `who-owns-nilfisk-freudenberg-manufacturing` | Add direct production-network answer near the top | queued |
| 25 | `who-owns-mac-tools-stanley-black-decker` | Add direct brand, sourcing and manufacturer answer near the top | queued |
| 26 | `who-owns-triton-tools-timbecon` | Add direct current manufacturer/sourcing answer near the top | queued |
| 27 | `who-owns-ridgid-wet-dry-vacuums-emerson` | Add an explicit manufacturing section and direct first-screen answer | queued |
| 28 | `who-owns-shop-vac-greatstar-manufacturing` | Add an explicit manufacturing section and direct first-screen answer | queued |

## Batch rule

- Maximum three existing pages per release.
- Refresh primary evidence immediately before editing each batch.
- Run collision checks before work and production verification after release.
- Mark a row `published_verified` only after Git-linked production is `READY` and the live page passes desktop and 390px checks.
