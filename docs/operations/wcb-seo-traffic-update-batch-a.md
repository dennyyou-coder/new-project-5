# WCB SEO Traffic Update Batch A

This operational record covers three existing search guides selected from the latest available 28-day Google Search Console export. It starts the post-ownership traffic-expansion phase with update-first quick wins.

## Authorization and scope

- Denny approved the traffic-first plan and the fixed WCB loop authorizes this confirmed batch through production verification without routine confirmation.
- Work is isolated in `codex/seo-update-quickwins-20260809` from the latest `origin/main` at `f34d4b90a86cc029010b518226eb5333fcef7da8`.
- This is an in-place intent and CTR refresh. All three slugs, canonicals, original `date`, `publishedAt` and `sortDate` values remain unchanged.

| Order | Updated page | Existing slug | Main update | Status |
|---:|---|---|---|---|
| 1 | Robot Lawn Mower Not Charging? Dock, Contact and Battery Checks | `robot-lawn-mower-not-charging` | Shorter exact-intent title, five-check direct answer and boundary-wire cross-link | `local_verified` |
| 2 | Spot Cleaner vs Carpet Cleaner: Differences and Which to Buy | `spot-cleaner-vs-carpet-cleaner` | Shorter comparison title, direct purchase decision and equipment-profile links | `local_verified` |
| 3 | How to Find a Break in a Robot Mower Boundary Wire | `robot-mower-boundary-wire-break` | Exact how-to title, six-step answer and corrected return-to-service visual | `local_verified` |

## Search and collision decision

- GSC window: 2026-07-09 through 2026-08-05; site baseline 91 clicks, 17,200 impressions, 0.5% CTR and average position 11.4.
- GSC artifact: `worldcleanbiz.com-Performance-on-Search-2026-08-08.zip`; SHA-256 `3589cba7b12b981374292618778c8a411824dcf6ff9054e86ae023d2682ec7d6`.
- Robot mower not charging: 183 impressions, zero clicks and average position 11.22.
- Spot cleaner vs carpet cleaner: 65 impressions, zero clicks and average position 22.34. Query variants include `carpet cleaner vs spot cleaner` and `spot cleaner or carpet cleaner`.
- Boundary-wire break: 56 impressions, zero clicks and average position 15.64. The query export includes `how do i find a break in my boundary wire`.
- Repository and production checks found exactly one established page for each intent. Decision: update those URLs in place; do not create competing pages.

## Editorial and factual lock

- Charging diagnosis still separates return/docking, external station power, accessible contacts, protection states, battery condition and internal faults. No universal voltage, LED or battery conclusion was added.
- The spot-cleaner comparison still distinguishes portable local work from room-scale carpet cleaning. The new decision section does not claim a universal performance winner.
- The boundary-wire guide still treats a no-loop message as a system symptom rather than proof of one clean cable break. Model-specific isolation, terminals, resistance limits and approved parts remain explicit boundaries.
- Current official support evidence already cited in the articles remains aligned with the edited conclusions. No ownership, manufacturing or product-specification conclusion changed.

## Visual review and repair

- Six existing 1600x900 WebP article visuals were decoded and reviewed at full resolution.
- Five visuals passed unchanged with readable labels and no clipping or factual conflict.
- The boundary-wire return-to-service visual contained one visible spelling error, `AUTONDMOUS DOCK`. Two targeted repair passes were used; the final 1600x900 WebP now reads `AUTONOMOUS DOCK` and passed full-resolution review.
- No new visual claim was introduced and the original image concept, workflow and safety boundaries were preserved.

## Release gates

- Content classification, all 15 insight tests and all 34 equipment tests passed after rebasing onto the latest production base.
- The complete production build passed and generated 608 static pages.
- All 12 inspected internal links across the three routes returned successfully in the local production build.
- Desktop and 390px browser checks passed for all three routes: expected title, H1, description, canonical and BlogPosting schema; complete 1600x900 article visuals; and no horizontal overflow. The only local console error was the expected unavailable `/_vercel/insights/script.js` request outside Vercel.
- A separated read-only release pass rechecked the exact diff, unchanged slug/date fields, GSC evidence, editorial boundaries, corrected visual and latest-main alignment. No release blocker remained.
- Production gate requires HTTP 200, expected title, H1, description, canonical and BlogPosting schema, complete visuals, guide discovery, sitemap presence and clean desktop/mobile rendering.

## Production evidence

- PR: pending.
- Squash merge: pending.
- Git-linked Vercel production deployment: pending.
- Live verification: pending.

## Next queue after this batch

1. `who-makes-ridgid-power-tools-tti-emerson`
2. `who-makes-insignia-appliances-best-buy-suppliers`
3. `who-makes-amana-appliances-whirlpool-hvac-split`
