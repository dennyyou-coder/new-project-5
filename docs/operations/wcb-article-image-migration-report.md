# WCB historical article image migration report

Date: 2026-08-11
Scope: 437 historical articles, 1,755 referenced primary images
Result: complete; strict source and built-output gates pass

## Outcome

Historical primary image URLs, extensions, formats, aspect ratios, crops, and order were preserved. The migration optimized each repository primary in place and added only profitable WebP mobile variants. After Fix Round 1 removed invalid extreme mobile selections for explicitly classified non-photo assets, the final guarded image repository is 252,264,553 bytes, 40,390,318 bytes (13.80%) below the approved baseline and 69,655,805 bytes below the 321,920,358-byte ceiling.

No external source-library file changed. A byte-for-byte repair audit after the bulk migration also confirmed zero hash changes across all 1,755 primaries while invalid same-width mobile variants were removed or regenerated.

## Exact repository baseline and result

| Guarded directory | Before files | Before bytes | After files | After bytes | Byte change |
| --- | ---: | ---: | ---: | ---: | ---: |
| `public/images/articles` | 140 | 26,725,818 | 256 | 32,187,536 | +5,461,718 |
| `public/images/blog` | 645 | 97,022,727 | 1,164 | 99,001,193 | +1,978,466 |
| `public/images/insights` | 1,381 | 168,906,326 | 1,956 | 121,075,824 | -47,830,502 |
| **Total** | **2,166** | **292,654,871** | **3,376** | **252,264,553** | **-40,390,318** |

The captured baseline exactly reproduced the approved 292,654,871 bytes / 2,166 files before migration.

## Manifest and transfer estimates

| Measure | Before | After |
| --- | ---: | ---: |
| Articles | 437 | 437 |
| Primary assets | 1,755 | 1,755 |
| Retained mobile variants | 0 | 1,210 |
| Skipped mobile variants | 1,755 | 545 |
| Unique primary stored bytes | 231,022,895 | 143,802,439 |
| Summed per-article desktop transfer | 231,101,810 | 143,843,743 |
| Summed per-article mobile transfer | 231,101,810 | 60,829,780 |

The per-article sums count a shared asset once in each article that uses it. Desktop transfer decreased by 87,258,067 bytes (37.76%); estimated mobile transfer decreased by 170,272,030 bytes (73.68%). Every retained mobile variant is narrower than its primary and meets the configured minimum byte-or-ratio savings threshold.

## Budget classification and aggregate recovery

The following articles qualify for and use `image_budget: deep`:

- `ces-2026-backyard-robot-war`
- `cleaning-appliance-companies-at-awe`

`hundred-years-of-cleaning-appliance-history` is the only approved `image_budget: visual_archive` article. That strict historical class requires more than 50 unique body images and a complete, current hash-bound `URL + kind + outputHash` classification for every managed image. Its desktop/mobile aggregate limits are 2,500,000 / 1,600,000 bytes. No standard or deep article inherits the higher mobile limit.

`cleaning-industry-news-roundup-2026-06-20` remains `standard` because it has exactly eight unique body images.

Photo-only aggregate recovery selected the first/highest passing stage against each article's unchanged budget:

| Article | Budget | Desktop recovery | Mobile recovery | Final desktop | Final mobile |
| --- | --- | --- | --- | ---: | ---: |
| `bissell-barkbath-pet-vacuum-cleaner` | standard | normal | 640 px | 1,456,222 | 498,935 |
| `hundred-years-of-cleaning-appliance-history` | visual_archive | normal after migrated desktop | 480 px for explicitly classified photos only; non-photos use safe mobile or primary fallback | 1,958,574 | 1,559,030 |
| `ifa-2019-vacuum-cleaner-new-products-by-major-brands` | standard | normal | 560 px for explicitly classified photos only; image 014 uses primary fallback | 1,257,469 | 652,023 |

The extended mobile recovery never goes below 390 px or quality 72, never enlarges an image, and applies only to assets whose tracked URL and current primary hash explicitly classify them as photo. The classification registry contains 127 entries: 46 photos and 81 graphics. Unknown, incomplete, or stale classifications block extreme recovery; charts, graphics, transparency, and SVG never enter the sub-640 photo ladder. The 390 px hard floor is covered by an explicit rejection test.

## Mechanical integrity

- Primary public reference differences: 0.
- Primary extension/decoded-format differences: 0.
- Primary hash differences introduced by generated-state repair: 0 of 1,755.
- Invalid mobile dimensions after repair: 0.
- Mobile variants below the profitability threshold: 0.
- Article copy, title, slug, CTA, FAQ, JSON-LD, metadata, and image order changes: 0 outside the approved inventory lines below.
- External source library: 32 files / 21,720,743 bytes before and after; aggregate SHA-256 `b042619b08d76cbfe60bce41b573040188f1c78ba7cf4aebbaba40911c5ef54b` before and after.

Approved article-local inventory edits were limited to:

- explicit existing inferred cover paths for `floor-scrubber-rental-vs-buy`, `how-to-find-reliable-cleaning-product-suppliers-in-china`, and `who-owns-hayward-pool-products`;
- `image_budget: deep` for CES and AWE, plus the later reviewed `image_budget: visual_archive` line for cleaning-appliance history;
- one newline before image 002 in `midea-group-and-the-possible-philips-domestic-appliances-acquisition`, making the existing Markdown image independent without changing its text, URL, order, or meaning.

An exact regression assertion verifies that these are the only article-source byte changes.

## Source validation warnings

All warnings below are deterministic, approved historical-validation outcomes; none requires unresolved editorial review:

- 1 `EXTERNAL_SOURCE_CONFLICT_FALLBACK` for the known malformed Building Worlds episode 01 external filename.
- 10 `INCOMPATIBLE_HISTORICAL_PRIMARY_FORMAT` warnings where a unique validated external semantic source has a different format; repository primary URL, bytes, and format remain authoritative.
- 10 `HISTORICAL_SVG_PREFIX_NORMALIZED` warnings where the unique source semantic stem is an exact suffix and the extra primary prefix is owned by contiguous article-slug tokens.
- 2 `EXTERNAL_SOURCE_CONTENT_CONFLICT` warnings for the two Midea brand-portfolio repository primaries; each warning names that repository reference and both unmatched external descriptors, which did not replace or validate either primary.

Generated-state repair initially identified 305 byte-profitable but invalid mobile variants whose width was equal to or greater than the final primary. The atomic repair removed 254 and replaced the necessary aggregate-budget candidates with narrower variants. Fix Round 1 then identified 45 sub-640 mobile selections attached to explicitly classified graphics: it regenerated 3 through the normal safe graphic path and removed 42 low-value variants, preserving all primaries byte-identical. These are resolved mechanical warnings, not editorial warnings.

## Visual review

Representative original-size and 390 px-equivalent inspections covered:

- ordinary and phone/EXIF photographs;
- transparent SVG/logo content;
- a chart with small text;
- a homepage-linked article cover;
- Sourcing-related article imagery;
- the De'Longhi 99% progressive same-format fallback;
- all 46 CES photo-heavy outputs using two contact sheets;
- all 110 `hundred-years-of-cleaning-appliance-history` selections in the original six contact sheets, followed by nine corrected primary/390 px contact sheets covering all 81 explicitly classified non-photo assets across History and IFA;
- focused original/390 px comparisons of the actual catalog/text graphic `image-008`, Kirby catalog `image-010`, the legal press-release graphic `image-108`, Cecotec product photo `image-109`, and IFA Philips text/product graphic `image-014`.

No visible crop change, colour shift, halo, subject damage, meaning-changing softness, or new unreadable detail was found. The legal press-release headline and structure and the Kirby/catalog text retained the same readability as their primary-at-390 references; no claim is attached to a misidentified filename.

## Verification evidence

- Complete historical dry run: passed for all 437 articles before bulk apply.
- Bulk historical apply: completed once.
- Atomic generated-state repair dry run: passed with zero primary output paths.
- Atomic generated-state repair apply: passed; all 1,755 primary hashes remained identical.
- `npm run verify:article-images`: passed; 437 articles, 1,755 primaries, 1,210 mobile assets; 252,264,553 bytes / 3,376 files.
- `npm run test:asset-performance`: passed, 3/3.
- Focused pipeline/transform/prepare/budget suite: passed, 115/115.
- Article rendering regression: passed, 11/11.
- Full repository suite with its path-alias loader: passed, 488/488. (`npm test` is not defined; a raw glob without the loader predictably failed four alias-import suites and was replaced by the repository-correct command.)
- `npm run build`: passed.
- `npm run verify:built-article-images`: passed; 437 articles, 1,756 rendered article images, 1,211 responsive image sets.

## Fix Round 1 — Critical review corrections

The review fix used only `--repair-generated-state`; the full historical bulk migration was not rerun. The dry run listed exactly 3 mobile replacements and 42 mobile removals, with zero primary or other non-mobile stage outputs. The atomic apply made that same mobile-only change set and refreshed the manifest. Primary hash comparison before and after apply remained 0 changes across 1,755 / 1,755 primaries, with no primary URL additions or removals. A final post-apply dry run was idempotent across all 437 articles: 0 creates, 0 replacements, 0 removals, 0 primary stage outputs, unchanged manifest, and 0 empty conflict warnings.

Implementation corrections:

- SVG branches before every Sharp, source-inspection, transparency, metadata, raster-transform, and mobile-candidate call. A 100,000 × 100,000 SVG fixture that Sharp rejects on pixel limits remains byte-identical and creates no mobile output.
- `scripts/article-images/historical-kind-classifications.json` supplies explicit hash-bound authority for every asset eligible for sub-640 recovery. History `image-008` and `image-108` are graphics, `image-109` is a photo, and IFA `image-014` is a graphic.
- Historical external validation no longer accepts sequence alone. Exact and slug-owned semantic suffix rules govern validation; mismatches emit stable warnings containing both the repository primary and external descriptor names.
- `visual_archive` eligibility is shared by inventory discovery/preparation and source/aggregate verification. Only the approved History slug, with more than 50 unique body images and complete current classifications, can receive its 1,600,000-byte mobile limit.

Exact Fix Round 1 verification commands:

```bash
npm run verify:article-images
npm run test:asset-performance
node --test tests/articleImagePipeline.test.mjs tests/articleImageTransform.test.mjs tests/articleImagePrepare.test.mjs tests/articleImageBudgets.test.mjs
node --test tests/articleImageRendering.test.mjs
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --import ./tests/register-path-alias.mjs --test tests/*.test.mjs
npm run build
npm run verify:built-article-images
git diff --check
```

Results: PASS 437/1,755/1,210 source inventory; PASS 3/3 asset performance; PASS 115/115 focused; PASS 11/11 rendering; PASS 488/488 full repository suite; PASS production build with 645 static pages; PASS built verifier 437 articles / 1,756 rendered images / 1,211 responsive sets; PASS diff check. A final RED/GREEN edge case additionally proves a cover-only external folder reports `sources=01-cover.png` instead of an empty descriptor list.
- `git diff --check`: passed.

## Task 8 final integrated verification

Task 8 refreshed the authoritative base to `origin/main` `7500378e4b29eb4e9ee46bcabdb8554e9b1e9f51`. The upstream SEO squash tree was already present byte-for-byte in the branch history, and the later Episode 04 article was integrated normally. Its 15 unchanged article images were registered as a standard-budget article; no Episode 04 publish image was rewritten. The final source inventory is 438 articles, 1,770 primary assets, and 1,210 mobile variants.

Exact final transfer estimates use each unique local image once. Desktop selects the public primary. Mobile selects the manifest mobile candidate when one exists, otherwise the primary. Page measurements come from the final built HTML; article measurements come from the final manifest.

| Representative surface | Local images | Desktop bytes | Mobile bytes |
| --- | ---: | ---: | ---: |
| Homepage linked article imagery | 4 | 648,306 | 361,384 |
| Robot Vacuum Sourcing, all local page imagery | 10 | 1,112,632 | 900,907 |
| Robot Vacuum Sourcing, article-linked subset | 3 | 307,687 | 95,962 |
| Ordinary article: `building-worlds-no-1-cleaning-show-from-scratch-episode-04` | 15 | 743,572 | 743,572 |
| Responsive standard article: `aiper-fluidra-pool-robotics-alliance` | 5 | 652,730 | 237,078 |
| Deep article: `ces-2026-backyard-robot-war` | 46 | 2,472,623 | 1,173,208 |
| Visual archive: `hundred-years-of-cleaning-appliance-history` | 110 | 1,958,574 | 1,559,030 |

The final guarded repository contains 3,391 files / 253,008,125 bytes. This is 39,646,746 bytes (13.55%) below the approved 292,654,871-byte baseline and 68,912,233 bytes below the 321,920,358-byte ceiling. The 743,572-byte increase from the Task 6 snapshot is exactly the newly integrated Episode 04 primary inventory.

Fresh final verification:

- Complete repository suite: passed, 491/491, using the required path-alias command exactly once after upstream integration.
- Content classification: passed.
- SEO audit: passed, 7/7.
- Asset performance: passed, 3/3.
- Source image verifier: passed, 438 articles / 1,770 primary assets / 1,210 mobile assets / 253,008,125 bytes / 3,391 files.
- Superseding production build after the browser-discovered CSS regression fix: passed, 646 generated pages; lifecycle source and built-output gates passed, with 438 articles / 1,771 rendered article images / 1,211 responsive sets.
- The build left the tracked worktree unchanged.
- Desktop and 390 px production-server QA passed on `/`, `/blog`, Episode 04, Aiper/Fluidra, the 110-image visual archive, and `/sourcing/robotic-vacuums`: HTTP 200, one H1, one main landmark, correct canonical and primary OpenGraph image, stable cover framing, readable graphics, intrinsic dimensions, exactly one eager managed article image, lazy body images, and responsive candidate selection where available. Observed layout-shift score was 0 on all sampled navigations.

Browser QA exposed one real integration regression before completion: Blog article presentation selectors were stranded in About route CSS, so production article pages rendered without their intended cover and prose styles. A route-graph regression test failed first. The fix moved the existing 9,161-byte article block out of `about.css` into Blog-only `article.css`, added the Blog layout import, and set constrained body images to `height: auto`; it did not add the About stylesheet globally or duplicate that block. Focused GREEN results were 12/12 for content experience and 26/26 for adjacent article/blog/About coverage. The first successful build is therefore superseded by the fresh post-fix build above.

The only local console error was the expected `/_vercel/insights/script.js` 404 from running Vercel Web Analytics outside Vercel. No target-route runtime or image error was found.

## Baseline largest 30 referenced images

| # | Public URL | Bytes |
| ---: | --- | ---: |
| 1 | `/images/insights/delonghi-group-company-history-and-appliance-brands-image-001.png` | 1,001,325 |
| 2 | `/images/insights/thoughts-on-mijia-mite-removal-vacuum-image-004.png` | 994,482 |
| 3 | `/images/insights/thoughts-on-mijia-mite-removal-vacuum-image-003.png` | 951,362 |
| 4 | `/images/insights/thoughts-on-mijia-mite-removal-vacuum-image-002.png` | 811,804 |
| 5 | `/images/insights/thoughts-on-mijia-mite-removal-vacuum-image-009.png` | 675,911 |
| 6 | `/images/insights/anker-rmb-30-billion-shallow-sea-strategy-image-003.jpg` | 604,379 |
| 7 | `/images/insights/ifa-2019-vacuum-cleaner-new-products-by-major-brands-image-001.png` | 604,327 |
| 8 | `/images/insights/anker-rmb-30-billion-shallow-sea-strategy-image-006.jpg` | 594,434 |
| 9 | `/images/insights/anker-rmb-30-billion-shallow-sea-strategy-image-004.jpg` | 593,629 |
| 10 | `/images/insights/anker-rmb-30-billion-shallow-sea-strategy-cover.jpg` | 584,544 |
| 11 | `/images/insights/anker-rmb-30-billion-shallow-sea-strategy-image-001.jpg` | 584,544 |
| 12 | `/images/insights/anker-rmb-30-billion-shallow-sea-strategy-image-005.jpg` | 545,308 |
| 13 | `/images/insights/ifa-2019-vacuum-cleaner-new-products-by-major-brands-image-007.png` | 530,138 |
| 14 | `/images/insights/anker-rmb-30-billion-shallow-sea-strategy-image-002.jpg` | 519,367 |
| 15 | `/images/blog/navimow-robotic-mower-roadmap-cover.webp` | 518,380 |
| 16 | `/images/insights/bissell-barkbath-pet-vacuum-cleaner-image-010.png` | 494,818 |
| 17 | `/images/insights/hamilton-beach-2018-annual-report-faithful-translation-image-03.png` | 465,832 |
| 18 | `/images/insights/bissell-barkbath-pet-vacuum-cleaner-image-005.png` | 461,741 |
| 19 | `/images/insights/bissell-barkbath-pet-vacuum-cleaner-image-006.png` | 451,814 |
| 20 | `/images/insights/dyson-at-a-crossroads-image-006.jpg` | 431,961 |
| 21 | `/images/blog/roborock-robot-mowers-dealer-rollout.webp` | 429,270 |
| 22 | `/images/insights/midea-supplier-summit-review-image-002.jpg` | 423,985 |
| 23 | `/images/insights/bissell-barkbath-pet-vacuum-cleaner-image-002.png` | 422,569 |
| 24 | `/images/insights/dysons-anxiety-image-007.jpg` | 417,365 |
| 25 | `/images/blog/rtk-vs-lidar-robot-mower-site-decision-map.webp` | 417,010 |
| 26 | `/images/insights/robotic-mowers-retail-expansion-phase-image-08.jpg` | 408,492 |
| 27 | `/images/blog/robot-lawn-mower-stuck-diagnostic-map.webp` | 404,188 |
| 28 | `/images/insights/kingclean-chairman-ni-formal-interview-cover.jpg` | 395,739 |
| 29 | `/images/insights/kingclean-chairman-ni-formal-interview-image-001.jpg` | 395,739 |
| 30 | `/images/insights/kingclean-chairman-ni-formal-interview-image-002.jpg` | 395,739 |

## Baseline over-budget articles

The baseline had 73 over-budget articles. Before mobile variants existed, desktop and mobile estimates were identical. Limits are desktop/mobile bytes.

| Article | Class | Baseline desktop | Baseline mobile | Limits |
| --- | --- | ---: | ---: | ---: |
| amazon-first-stop-for-backyard-robotics | standard | 1,612,102 | 1,612,102 | 1,500,000 / 750,000 |
| american-factory-and-manufacturing-transfer | standard | 1,171,285 | 1,171,285 | 1,500,000 / 750,000 |
| anker-innovation-lacks-methodology | standard | 1,021,056 | 1,021,056 | 1,500,000 / 750,000 |
| anker-needs-a-hard-battle | standard | 1,119,368 | 1,119,368 | 1,500,000 / 750,000 |
| anker-prospectus-trillion-yuan-cleaning-industry | standard | 1,099,904 | 1,099,904 | 1,500,000 / 750,000 |
| anker-rmb-30-billion-shallow-sea-strategy | standard | 4,026,205 | 4,026,205 | 1,500,000 / 750,000 |
| beatbot-in-leifeng-coverage | standard | 965,990 | 965,990 | 1,500,000 / 750,000 |
| bissell-barkbath-pet-vacuum-cleaner | standard | 3,918,312 | 3,918,312 | 1,500,000 / 750,000 |
| bissell-crosswave-hard-floor-washer-logic | standard | 1,043,183 | 1,043,183 | 1,500,000 / 750,000 |
| bissell-vs-tineco-patent-details | standard | 1,280,028 | 1,280,028 | 1,500,000 / 750,000 |
| building-worlds-no-1-cleaning-show-from-scratch-episode-02 | standard | 1,088,070 | 1,088,070 | 1,500,000 / 750,000 |
| building-worlds-no-1-cleaning-show-from-scratch-episode-03 | standard | 785,766 | 785,766 | 1,500,000 / 750,000 |
| can-dji-become-top-three-in-robot-vacuums | standard | 959,196 | 959,196 | 1,500,000 / 750,000 |
| ces-2026-backyard-robot-war | standard | 7,728,974 | 7,728,974 | 1,500,000 / 750,000 |
| china-cleaning-robot-giants-move-into-backyard | standard | 1,098,598 | 1,098,598 | 1,500,000 / 750,000 |
| cleaning-appliance-companies-at-awe | standard | 1,602,266 | 1,602,266 | 1,500,000 / 750,000 |
| cleaning-industry-news-roundup-2026-06-20 | standard | 1,946,986 | 1,946,986 | 1,500,000 / 750,000 |
| commercial-cleaning-robot-manufacturers-china | standard | 832,310 | 832,310 | 1,500,000 / 750,000 |
| deerma-floorcare-value-for-money-limit | standard | 1,013,178 | 1,013,178 | 1,500,000 / 750,000 |
| delonghi-group-company-history-and-appliance-brands | standard | 2,673,023 | 2,673,023 | 1,500,000 / 750,000 |
| dreame-douyin-counterattack-against-tineco | standard | 951,984 | 951,984 | 1,500,000 / 750,000 |
| dyson-at-a-crossroads | standard | 1,237,306 | 1,237,306 | 1,500,000 / 750,000 |
| dyson-nautik-is-not-a-real-hard-floor-washer | standard | 1,200,814 | 1,200,814 | 1,500,000 / 750,000 |
| dysons-anxiety | standard | 1,343,783 | 1,343,783 | 1,500,000 / 750,000 |
| ecovacs-2018-annual-report-signals | standard | 3,475,166 | 3,475,166 | 1,500,000 / 750,000 |
| ecovacs-mid-year-report-reading | standard | 1,061,105 | 1,061,105 | 1,500,000 / 750,000 |
| european-tool-brands-battery-alliances | standard | 778,386 | 778,386 | 1,500,000 / 750,000 |
| eve-of-the-robot-vacuum-battle | standard | 867,206 | 867,206 | 1,500,000 / 750,000 |
| factory-audit-cleaning-appliance-suppliers-china | standard | 840,726 | 840,726 | 1,500,000 / 750,000 |
| factory-vs-trading-company-china-cleaning-appliances | standard | 890,642 | 890,642 | 1,500,000 / 750,000 |
| groupe-seb-2018-annual-report-signals | standard | 4,688,994 | 4,688,994 | 1,500,000 / 750,000 |
| hamilton-beach-2018-annual-report-faithful-translation | standard | 2,558,919 | 2,558,919 | 1,500,000 / 750,000 |
| how-to-find-reliable-cleaning-product-suppliers-in-china | standard | 806,788 | 806,788 | 1,500,000 / 750,000 |
| hundred-years-of-cleaning-appliance-history | standard | 3,168,086 | 3,168,086 | 1,500,000 / 750,000 |
| ifa-2019-vacuum-cleaner-new-products-by-major-brands | standard | 3,772,760 | 3,772,760 | 1,500,000 / 750,000 |
| irobot-at-a-crossroads | standard | 762,004 | 762,004 | 1,500,000 / 750,000 |
| irobot-decline-and-the-new-robot-vacuum-order | standard | 780,434 | 780,434 | 1,500,000 / 750,000 |
| irobot-exits-and-dji-enters | standard | 876,204 | 876,204 | 1,500,000 / 750,000 |
| karcher-hidden-champion-in-cleaning-appliances | standard | 864,249 | 864,249 | 1,500,000 / 750,000 |
| kingclean-chairman-ni-formal-interview | standard | 1,187,217 | 1,187,217 | 1,500,000 / 750,000 |
| lawsuit-that-shaped-the-handheld-vacuum-industry | standard | 817,084 | 817,084 | 1,500,000 / 750,000 |
| lithium-batteries-in-vacuums-and-power-tools | standard | 1,346,279 | 1,346,279 | 1,500,000 / 750,000 |
| midea-group-and-the-possible-philips-domestic-appliances-acquisition | standard | 862,696 | 862,696 | 1,500,000 / 750,000 |
| narwal-and-the-self-cleaning-robot-vacuum | standard | 2,210,208 | 2,210,208 | 1,500,000 / 750,000 |
| navimow-robotic-mower-roadmap | standard | 1,297,694 | 1,297,694 | 1,500,000 / 750,000 |
| nilfisk-2018-annual-report-commercial-cleaning | standard | 1,211,271 | 1,211,271 | 1,500,000 / 750,000 |
| oem-vs-odm-cleaning-products | standard | 841,850 | 841,850 | 1,500,000 / 750,000 |
| pool-and-lawn-robots-self-maintenance | standard | 2,894,010 | 2,894,010 | 1,500,000 / 750,000 |
| pool-robotics-new-competitive-table | standard | 1,078,252 | 1,078,252 | 1,500,000 / 750,000 |
| quality-control-cleaning-appliances-china | standard | 817,826 | 817,826 | 1,500,000 / 750,000 |
| roborock-ipo-prospectus-signals | standard | 3,606,413 | 3,606,413 | 1,500,000 / 750,000 |
| roborock-road-to-100-billion-rmb | standard | 1,048,092 | 1,048,092 | 1,500,000 / 750,000 |
| roborock-targets-70-billion-rmb-by-2029 | standard | 990,906 | 990,906 | 1,500,000 / 750,000 |
| robot-vacuum-industry-faces-dji-wang-tao | standard | 1,059,606 | 1,059,606 | 1,500,000 / 750,000 |
| robotic-lawn-mower-manufacturers-china | standard | 880,038 | 880,038 | 1,500,000 / 750,000 |
| robotic-lawn-mower-market-size-yard-automation | standard | 1,003,764 | 1,003,764 | 1,500,000 / 750,000 |
| robotic-mower-new-king-2026 | standard | 938,988 | 938,988 | 1,500,000 / 750,000 |
| robotic-mower-sales-channels | standard | 1,087,526 | 1,087,526 | 1,500,000 / 750,000 |
| robotic-mowers-retail-expansion-phase | standard | 4,018,417 | 4,018,417 | 1,500,000 / 750,000 |
| robotic-pool-cleaner-manufacturers-china | standard | 883,772 | 883,772 | 1,500,000 / 750,000 |
| rtk-vs-lidar-robot-lawn-mowers | standard | 760,324 | 760,324 | 1,500,000 / 750,000 |
| sample-testing-cleaning-appliances-china | standard | 764,916 | 764,916 | 1,500,000 / 750,000 |
| sharkninja-hit-product-pipeline | standard | 1,198,244 | 1,198,244 | 1,500,000 / 750,000 |
| sharkninja-q1-2026-growth-strategy | standard | 819,914 | 819,914 | 1,500,000 / 750,000 |
| sharkninja-road-to-10-billion-dollars | standard | 954,374 | 954,374 | 1,500,000 / 750,000 |
| spare-parts-warranty-cleaning-appliances-china | standard | 872,418 | 872,418 | 1,500,000 / 750,000 |
| story-of-hard-floor-washers | standard | 1,073,466 | 1,073,466 | 1,500,000 / 750,000 |
| the-hidden-front-brushless-motors | standard | 1,682,996 | 1,682,996 | 1,500,000 / 750,000 |
| thoughts-on-mijia-mite-removal-vacuum | standard | 5,519,589 | 5,519,589 | 1,500,000 / 750,000 |
| tineco-lacks-innovation | standard | 930,223 | 930,223 | 1,500,000 / 750,000 |
| tti-cleaning-appliance-strategy | standard | 1,081,418 | 1,081,418 | 1,500,000 / 750,000 |
| vacuum-companies-at-2018-autumn-canton-fair | standard | 780,678 | 780,678 | 1,500,000 / 750,000 |
| what-sharkninja-makes-us-think-about | standard | 939,262 | 939,262 | 1,500,000 / 750,000 |
