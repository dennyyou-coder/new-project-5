# WCB SEO Maintenance Traffic Batch B

This release continues the troubleshooting-first traffic plan with three independent robot-vacuum symptom pages. Each page owns one diagnostic intent and links to adjacent symptoms rather than combining them into a broad fault collection.

## Authorization and scope

- Denny instructed `continue next batch`; the fixed WCB loop authorizes research, article-local visuals, tests, PR, merge, Git-linked production and live verification without routine confirmation.
- Work is isolated in `codex/seo-maintenance-traffic-batch-b-20260809`; the final quiet-window base is `origin/main` at `de43e674baba0b4e5b99668e5630bf22af9b158b` after the component batches reached production READY.
- Allowed scope: three new MDX articles, nine article-local WebP images, this Batch B record, and a mechanical production-evidence update to the prior Batch A record. No shared component, route, layout, CSS, dependency, configuration or unrelated article is changed.

| Order | Locked title | Locked slug | Search intent | Status |
|---:|---|---|---|---|
| 1 | Robot Vacuum Not Returning to Dock? Base Placement, Map, Sensors and Route Checks | `robot-vacuum-not-returning-to-dock` | Diagnose failure to find, approach or align with the dock; exclude a robot that is already seated but not charging | `local_verified` |
| 2 | Robot Vacuum Self-Empty Dock Not Working? Bag, Airway, Settings and Power Checks | `robot-vacuum-self-empty-dock-not-working` | Diagnose a missing or ineffective dry-debris evacuation cycle after correct docking; exclude navigation and mop-washing faults | `local_verified` |
| 3 | Robot Vacuum Not Dispensing Water? Tank, Mop, Flow Setting and Outlet Checks | `robot-vacuum-not-dispensing-water` | Diagnose robot-side mopping water delivery; separate onboard dispensing from dock washing, dirty-water recovery and refill functions | `local_verified` |

## Duplicate and intent decision

- Final pre-writing `origin/main` contains 434 insight MDX files and has no exact title, slug or dedicated same-intent page for the three targets.
- All three proposed live URLs return 404 and neither Maintenance Guides nor the live sitemap contains the target slugs.
- The return-to-dock page is separated from `robot-vacuum-not-charging`: navigation ends when normal seating succeeds; battery and charging-circuit diagnosis remains on the charging page.
- The self-empty page is separated from `self-emptying-robot-vacuum-market`, which is a market, dock-strategy and supply-chain analysis rather than a fault diagnostic.
- The no-water page is robot-specific and does not compete with `floor-scrubber-not-dispensing-water`; the articles cross-link only to explain the category boundary.
- If a matching target appears on a newer `main` before push, the affected article is blocked rather than renamed or duplicated.

## Primary-source lock

| Article | Locked technical boundary | Primary evidence checked August 9, 2026 |
|---|---|---|
| Robot does not return to dock | Separate route/localization from final approach and from charging; dock power, placement, start location, map, accessible sensors, wheels and near-dock test precede reset or internal repair | iRobot all-model return and navigation support; Roborock cannot-find-dock support; Dreame X50 return support; eufy charging-base return support |
| Self-empty dock does not work | Separate no-trigger from motor-runs/no-transfer; model compatibility, App/DND trigger, bag/cover, robot bin and user-accessible airway precede dock motor or electrical diagnosis | Roborock auto-empty support and manuals; eufy station/bag and X10 dust-collection support; iRobot Clean Base overview |
| Robot does not dispense water | Separate robot-side water delivery from dock wash/refill; exact mopping mode, flow setting, tank architecture/detection, pad and approved outlets precede pump/valve diagnosis | Dreame current generic and L10/L20 water support; Roborock Q7/S8 manuals and dock-wash support |

## Safety and service boundary

- Map deletion and factory reset remain last-resort steps after screenshots, settings and error evidence are preserved.
- A mains-powered dock is unplugged before approved bag or airway maintenance; wiring, motors, sealed ducts and damaged electronics remain with qualified service.
- Water troubleshooting stops for leaks into electrical or charging areas. Hot water, chemicals, outlet tools and washable parts follow the exact manual rather than a universal rule.
- Model-specific clearances, indicator colors, DND logic, compatible bins, emptying frequency, water tests and cleaning methods are not promoted into universal instructions.

## Visual package

- Visual system: `product_teardown`; three images per article: one conceptual 1600×900 cover plus two deterministic 1080×1440 mobile-first diagnostic diagrams.
- Total: nine sRGB WebP files. Covers are unbranded conceptual scenes with no logos, readable text, documentary claim or model-specific product identity.
- Body diagrams use only article-supported labels and are reviewed at full resolution and at 360px article width.

## Simplified article release gates

- Exact slugs and live targets: passed at pre-writing check.
- Content classification: passed.
- Insight collection tests: 15 passed.
- Internal-link and image-path checks: passed.
- Independent article and visual review: passed with no content repair; the near-dock diagram was proactively clarified to show three mutually exclusive results.
- Six-page cumulative quality gate: passed; charging, Wi-Fi, suction, return-to-dock, self-emptying and robot water delivery retain distinct symptoms and keywords.
- Final quiet-window synchronization: passed after two stable remote checks at `de43e674baba0b4e5b99668e5630bf22af9b158b`.
- One production build: passed; Next.js generated 645 routes and all three article paths were present.
- Preview: pending.
- Production: pending.

## Production evidence

- PR: pending.
- Squash merge: pending.
- Git-linked Vercel production deployment: pending.
- Live verification: pending.

## Next candidate queue

After this batch and its cumulative quality gate are production-verified, recheck these high-intent symptom targets against the then-current site before locking them:

1. `robot-vacuum-brush-not-spinning`
2. `robot-vacuum-keeps-getting-stuck`
3. `robot-vacuum-leaving-dirt-behind`
