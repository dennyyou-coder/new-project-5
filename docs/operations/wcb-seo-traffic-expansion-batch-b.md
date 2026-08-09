# WCB SEO Traffic Expansion Batch B

This release implements the three new traffic topics locked as the next queue in `wcb-seo-traffic-update-batch-a.md`.

## Authorization and scope

- Denny said `continue next batch`; the fixed WCB loop authorizes research, writing, visuals, PR, merge, Git-linked Vercel production and live verification without routine confirmation.
- Work is isolated in `codex/seo-ownership-expansion-batch-b-20260809` and was refreshed to the latest `origin/main` at `8764877f225415f4c7db143d814162c466979bdd` before the final gate.
- This batch creates three new search guides and nine article visuals: three unbranded 1600x900 WebP covers plus six deterministic 1600x900 SVG fact maps.

| Order | New guide | Locked slug | Primary intent | Status |
|---:|---|---|---|---|
| 1 | Who Makes RIDGID Power Tools? TTI, Emerson and Home Depot Explained | `who-makes-ridgid-power-tools-tti-emerson` | Separate Emerson's trademark ownership, TTI's licensed power-tool operation, OWT/TTI product evidence and Home Depot retail | `local_verified` |
| 2 | Who Makes Insignia Appliances? Best Buy and Its Suppliers Explained | `who-makes-insignia-appliances-best-buy-suppliers` | Explain Best Buy's private-label ownership and the model-specific supplier-factory system | `local_verified` |
| 3 | Who Makes Amana Appliances? Whirlpool and the HVAC Brand Split Explained | `who-makes-amana-appliances-whirlpool-hvac-split` | Separate Whirlpool major appliances, licensed Daikin/Goodman HVAC and XLS room-air products | `local_verified` |

## Search and collision decision

- The exact slugs were absent from the repository on the release base, each exact production URL returned HTTP 404 and exact-title site searches returned no result.
- RIDGID power tools are distinct from `who-owns-ridgid-wet-dry-vacuums-emerson`: the existing page documents Emerson Tool Company's vacuum relationship, while this page covers the TTI-operated licensed power-tool category. The pages are mutually linked and no canonical or primary-keyword conflict exists.
- Insignia has no existing brand-level appliance manufacturing guide. The article does not create individual OEM claims for categories already covered by Midea, Whirlpool or another manufacturer guide.
- Amana is referenced inside Whirlpool and Maytag guides but has no dedicated manufacturing-and-license page. The new page links to those parent-level guides and makes the major-appliance/HVAC split its primary intent.

## Current primary-source lock

| Topic | Locked conclusion | Primary evidence checked August 9, 2026 |
|---|---|---|
| RIDGID power tools | Emerson/Ridge Tool owns the brand system; TTI's licensed power-tool organization, OWT Industries and TTI Consumer Power Tools are supported by public product, service and recall records; exact model maker, factory and origin remain product-specific | Current RIDGID legal, power-tool and Lifetime Service Agreement pages; TTI license/OWT statement; 2025 U.S. CPSC RIDGID nailer recall |
| Insignia appliances | Best Buy owns and manages Insignia and partners with multiple factories for private-label design, production and testing; no single supplier or country can be assigned to the full brand | Best Buy fiscal 2025 Form 10-K, 2025 CR&S report, current Insignia and Best Buy Brands support pages, product-specific CPSC records |
| Amana appliances | Whirlpool owns and operates Amana core major appliances; Daikin/Goodman operates central HVAC under license; XLS Products is the named licensee for selected room-air categories | Whirlpool fiscal 2025 Form 10-K, current Amana history/manufacturing/registration pages, current Daikin operating and manufacturing statements |

## Editorial boundaries

- Brand owner, licensee, product operator, legal manufacturer, importer, retailer, factory, origin and warranty entity are stated as separate roles.
- The RIDGID article does not extend TTI's power-tool role to wet/dry vacuums or professional plumbing tools, and does not infer cross-brand battery compatibility.
- The Insignia article does not name a universal OEM from product resemblance or one historical model; every supplier conclusion remains model-specific.
- The Amana article does not treat the Iowa brand origin or Whirlpool's portfolio-level U.S. production statement as proof for every SKU.

## Visual review

- The `industry_map` system is used. Covers are clearly generic editorial concepts with no real logos, people, factories or documentary claim.
- Six fact maps carry all relationship labels in deterministic SVG. They distinguish brand ownership from licensed operation and model-level factory evidence.
- One targeted RIDGID cover repair removed generated pseudo-labels while preserving the unbranded industrial concept.
- All three exported WebP covers and six SVG fact maps were decoded and reviewed at full 1600x900 resolution. Labels, arrows and category boundaries are readable with no clipping, pseudo-text or unsupported documentary detail; all nine also passed article-width rendering at desktop and 390px.

## Release gates

- Clean baseline passed content classification, 15 insight tests and 103 brand tests before writing.
- After refreshing to the latest production base, content classification, all 15 insight tests, all 103 brand tests and all 36 equipment tests passed. The complete production build passed and generated 614 static pages.
- All 13 inspected internal article and image links returned HTTP 200. The three routes appear on the ownership guide and exactly once each in the sitemap.
- Desktop and 390px browser checks passed for all three routes: expected title, H1, description, canonical and BlogPosting schema; three complete 1600x900 article visuals per page; and no horizontal overflow. The only local console error was the expected unavailable `/_vercel/insights/script.js` request outside Vercel.
- A separated second review rechecked the exact diff, collision decisions, source boundaries, all nine full-resolution visuals, latest-main alignment and every release gate. No release blocker remained; an external reviewer was unavailable under the current no-subagent constraint.
- Production gate requires Vercel `READY`, HTTP 200, expected title/H1/description/canonical/BlogPosting, guide discovery, sitemap presence, complete visuals, internal links and clean desktop/mobile browser checks.

## Production evidence

- PR: pending.
- Squash merge: pending.
- Git-linked Vercel production deployment: pending.
- Live verification: pending.

## Next traffic-first queue

1. `who-owns-dewalt-stanley-black-decker`
2. `who-makes-philips-vacuum-cleaners-versuni`
3. `who-owns-worx-positec-landroid-manufacturing`

These are the next update-first candidates from the same 28-day GSC export, led by high impressions and low click-through rate. Reconfirm current queries, page state and intent overlap before editing.
