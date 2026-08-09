# WCB SEO Traffic Update Batch F

This release refreshes the final three existing editorial URLs in the locked traffic-first queue. All changes are update-first: the original URLs and publication dates are preserved.

## Authorization and scope

- Denny authorized processing the current queue through production without routine confirmation.
- Work is isolated in `codex/seo-traffic-update-batch-f-20260809` and began from `origin/main` at `78d77b7a2fc5a49a2ac660cc62972d87ef1209bc`.
- The saved Search Console export covers July 9 through August 5, 2026. Artifact: `/private/tmp/wcb-gsc-20260808.UsNvPd/`; `网页.csv` SHA-256: `a6d7f7bbd6208e8fd55b54fe842ecdff380e35fc0f30ce0375d8252cb717193c`; `查询数.csv` SHA-256: `f1d333bf591543376681b4dcd2ec7b2d786602c6f8f2906e499b349eaf4ed27f`.

| Order | Existing article | Locked slug | 28-day clicks | 28-day impressions | CTR | Average position | Status |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | Maytronics and Dolphin | `maytronics-robotic-pool-cleaner-reinvention` | 3 | 192 | 1.56% | 11.21 | `local_verified` |
| 2 | Husqvarna after EU anti-dumping | `husqvarna-robotic-mowers-after-eu-anti-dumping` | 7 | 118 | 5.93% | 17.72 | `local_verified` |
| 3 | Navimow robotic mower roadmap | `navimow-robotic-mower-roadmap` | 3 | 49 | 6.12% | 22.82 | `local_verified` |

## Search and collision decision

- No new URL, redirect or canonical is created. Each article is updated in place and its original `date`, `publishedAt` and `sortDate` remain unchanged.
- Maytronics retains company-history and strategic-reset intent. The separate Dolphin ownership/manufacturing guide remains authoritative for owner, maker and factory questions.
- Husqvarna retains competition and EU trade-defense intent. The separate Husqvarna ownership/manufacturing guide remains authoritative for corporate and manufacturing queries.
- Navimow retains product-roadmap intent across i1, i2, H2, X4 and Terranox. The separate Segway Navimow ownership guide remains authoritative for Ninebot and manufacturer identity.

## Current primary-source lock

| Topic | Locked conclusion | Primary evidence checked August 9, 2026 |
|---|---|---|
| Maytronics | Dolphin's brand, specialist channels and service remain valuable, but 2025 revenue declined and the 2026 recovery depends on new-product execution, planning and operational efficiency | Maytronics FY2025 results, Q1 2026 results, corporate profile, management and timeline pages |
| Husqvarna | EU proceeding C/2025/6235 and Regulation 2026/142 establish the investigation and import registration; registration is not itself a final duty or duty rate. Husqvarna's defensible premium rests on product performance, dealers, professional experience and aftermarket | EUR-Lex initiation and registration regulations; Husqvarna 2025 annual report, Q2 2026 report and AI Vision announcement |
| Navimow | The current portfolio spans i1, i2, H2, X4 and Terranox; its strategic progression is best read as reducing intervention from simple residential lawns to commercial uptime | Current official Navimow product and regional portfolio pages |

## Editorial and visual boundaries

- Titles and descriptions now expose the exact existing intent on the first screen; no ownership or manufacturer intent is duplicated.
- Local Vault source paths were removed from the three website records.
- Existing visuals were decoded and reviewed at original resolution. Maytronics and Navimow visuals remain aligned with the updated thesis. The Husqvarna supply-chain graphic was removed from the article because it could imply that a duty and origin shift were already established; the remaining cover, price and leadership visuals remain accurate and readable.
- No new visual, shared component, dependency, route or website architecture change is included.

## Simplified release gates

- Content classification and all 15 insight collection tests passed.
- One production build passed after final synchronization with `origin/main`; 630 static pages were generated.
- The generated pages exposed the expected title, H1 and unchanged canonical for all three routes.
- A separate second-pass review rechecked the diff, original publication fields, GSC rows and hashes, current primary sources, full-resolution visuals and generated metadata. It removed one misleading Husqvarna supply-chain visual and two unverified industry-account details; no release blocker remains. An external reviewer was unavailable under the current no-subagent constraint.
- Preview: one Git-linked deployment; production: one merged-main deployment.
- Production acceptance: Vercel `READY`, three HTTP 200 routes, expected title/H1 and unchanged canonical URLs.

## Production evidence

- PR: pending.
- Squash merge: pending.
- Git-linked Vercel production deployment: pending.
- Live verification: pending.

## Next traffic-first queue

The locked queue is exhausted after this batch. The next batch must be selected from a fresh Search Console export and checked against existing ownership, manufacturing, comparison, maintenance and editorial URLs before writing.
