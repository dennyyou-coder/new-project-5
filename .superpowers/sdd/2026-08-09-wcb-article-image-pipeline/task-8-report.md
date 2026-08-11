# Task 8 report: final regression, build, and responsive QA

Date: 2026-08-11
Branch: `codex/wcb-article-image-pipeline`
Authoritative base: `origin/main` `7500378e4b29eb4e9ee46bcabdb8554e9b1e9f51`

## Outcome

Task 8 is complete locally. The final branch is integrated with the current authoritative base, the complete suite and focused gates pass, the superseding production build passes without rewriting tracked files, and all six representative routes pass desktop and 390 px production-server QA. Nothing was pushed, merged, previewed, or deployed.

Browser verification found one real route-scoped CSS regression. It was fixed through a failing route-graph test and the smallest style ownership change. No unrelated production code was changed.

## Upstream integration evidence

Initial branch head was `fd54bd7`. The refreshed upstream commits were:

- SEO squash: `60f027b076f602cf533345787fd91e544c05fcd2` (`Improve SEO and site performance (#107)`).
- Episode 04: `7500378e4b29eb4e9ee46bcabdb8554e9b1e9f51` (`Publish WCB series Episode 04 (#108)`).

The SEO squash and the existing branch SEO commit `215b701` both had tree `f6c7dfab7da6d3b24cf7aa52ff7b117633da81c4`. A direct content merge would therefore have produced artificial conflicts from equivalent squashed history. Commit `8aaee21` aligned that equivalent history while retaining the identical branch tree. Episode 04 was then actually integrated in merge `26c44da`.

The only real Episode 04 merge decision concerned the legacy generated image-dimension map, which Task 4 had already replaced with the article-image manifest. The deleted legacy file stayed deleted. Episode 04 content and all 15 publish images are present. Their aggregate SHA-256 was unchanged before and after registration: `941cccae75f82ae12cbb4c250a77d9000e5d6f7cfcb276970cadc538482feb80`.

After integration:

- `git merge-base HEAD origin/main` = `7500378e4b29eb4e9ee46bcabdb8554e9b1e9f51`.
- Episode 04 preparation reported `standard`, desktop/mobile `743,572 / 743,572`, with zero image creates, replacements, or removals.
- `git diff origin/main...HEAD` contains only the approved article-image pipeline, consumers, historical image migration, tests, workflow/docs, and the Task 8 article-style regression fix. No unrelated change was found.

## Verification commands and results

The full Node suite was first run exactly once after upstream integration, before the browser-discovered CSS regression and its new route-graph test:

```text
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --import ./tests/register-path-alias.mjs --test tests/*.test.mjs
PASS 491/491
```

After the CSS regression fix and its additional test were committed, the reviewer independently reran the complete final-tree suite and recorded `PASS 492/492`. Task 8 did not perform or claim a second local full-suite run.

Focused gates:

```text
npm run verify:content-classification       PASS
npm run test:seo-audit                     PASS 7/7
npm run test:asset-performance             PASS 3/3
npm run verify:article-images              PASS 438 / 1,770 / 1,210
git diff --check                           PASS
```

The initial production build passed, but browser QA then discovered the CSS regression described below. After the material fix, a single superseding build was run:

```text
npm run build
PASS 646/646 generated pages
prebuild source verification PASS: 438 articles / 1,770 primaries / 1,210 mobiles
postbuild verification PASS: 438 articles / 1,771 rendered images / 1,211 responsive sets
```

Tracked status before and after the superseding build was identical: only the already-known CSS/test changes remained. The build did not rewrite the manifest, article assets, content, package files, or any other tracked file.

## CSS regression: RED, root cause, GREEN

Root cause: Blog article selectors such as `.blog-article-cover` and `.article-inline-image` were owned by `app/styles/about.css`, while the Blog route graph imported only `content-directories.css`. Production articles therefore lacked the intended 16:9 cover framing, `object-fit`, prose, and responsive inline-image presentation.

RED: `tests/contentExperience.test.mjs` assembled the actual Blog route CSS graph and failed because the route graph lacked the cover aspect-ratio, cover `object-fit: cover`, and inline-image constrained sizing rules.

Minimal fix:

- split the existing article-only block into `app/styles/article.css`;
- remove that same block from `app/styles/about.css`;
- import `article.css` only from `app/blog/layout.tsx`;
- add `height: auto` to constrained body images.

The moved block was 9,161 bytes. `about.css` decreased by that exact amount; the combined route-style source increased by only 80 bytes for the ownership comment and the effective `height: auto` rule. The About stylesheet was not loaded globally, and no large CSS block was duplicated.

GREEN:

```text
node --test tests/contentExperience.test.mjs
PASS 12/12

node --test tests/articleImageRendering.test.mjs tests/blogLanding.test.mjs tests/aboutConversion.test.mjs
PASS 26/26
```

## Production-server browser QA

Playwright CLI session: `wcb-task8`
Viewports: 1440 × 1000 and 390 × 844

Routes:

- `/`
- `/blog`
- `/blog/building-worlds-no-1-cleaning-show-from-scratch-episode-04`
- `/blog/aiper-fluidra-pool-robotics-alliance`
- `/blog/hundred-years-of-cleaning-appliance-history`
- `/sourcing/robotic-vacuums`

All 12 route/viewport checks returned HTTP 200, one H1, one main landmark, correct canonical URL, correct primary OpenGraph image, and observed layout-shift score 0.

Managed article-image details:

- Episode 04 desktop/mobile: 15 images, exactly one eager cover, 14 lazy body images, zero missing intrinsic dimensions. The 16:9 cover rendered `778 × 437` within a `780 × 439` desktop frame and `316 × 177` within a `318 × 179` mobile frame with `object-fit: cover`. It has no profitable mobile variant and correctly falls back to its primary.
- Aiper desktop/mobile: 5 managed images, exactly one eager cover and 4 lazy body images, zero missing dimensions. At 390 px the cover selected `01-cover-800.webp`; the first body image selected `02-alliance-complementary-strengths-800.webp`, rendered `288 × 192`, and retained `object-fit: contain`. The small-text growth chart was visibly readable at 390 px.
- History desktop/mobile: 110 managed images, exactly one eager cover and 109 lazy body images, zero missing dimensions. At 390 px the first body image selected `image-001-800.webp` (480 px candidate), rendered `288 × 253`, and retained `object-fit: contain`. Focused late-article catalog/logo graphics remained framed and readable.
- Sourcing: no managed article-content image inside the page body, as expected; the three linked article cards still contribute correctly responsive article imagery to the page transfer totals.

The sole console error was the expected local-only 404 for `/_vercel/insights/script.js`; Vercel Web Analytics is unavailable under `next start` outside Vercel. No broken target-route resource or article image was observed.

Playwright artifacts were kept under ignored `output/playwright/task8/` and are not part of the commit.

## Exact final measurements

| Surface | Files | Desktop bytes | Mobile bytes |
| --- | ---: | ---: | ---: |
| Homepage linked article imagery | 4 | 648,306 | 361,384 |
| Robot Vacuum Sourcing, all local imagery | 10 | 1,112,632 | 900,907 |
| Robot Vacuum Sourcing, article-linked subset | 3 | 307,687 | 95,962 |
| Ordinary Episode 04 article | 15 | 743,572 | 743,572 |
| Responsive Aiper standard article | 5 | 652,730 | 237,078 |
| CES deep article | 46 | 2,472,623 | 1,173,208 |
| History visual archive | 110 | 1,958,574 | 1,559,030 |

Final guarded repository: 253,008,125 bytes / 3,391 files.

- Approved baseline: 292,654,871 bytes / 2,166 files.
- Net bytes: -39,646,746 (-13.55%).
- Ceiling: 321,920,358 bytes.
- Remaining headroom: 68,912,233 bytes.
- Change from the Task 6 snapshot: +743,572 bytes / +15 files, exactly Episode 04.

## Final scope and handoff

Task 8's new implementation diff is limited to:

- `app/blog/layout.tsx`
- `app/styles/about.css`
- `app/styles/article.css`
- `tests/contentExperience.test.mjs`
- this Task 8 report and the fresh Task 8 section in the migration report

The complete branch diff remains within the planned article-image pipeline scope. No push, pull request, Preview, merge to `main`, or production deployment was performed.

## Fix Round 1 — verification record corrections

- Removed the pre-existing Markdown trailing spaces from the design document date so the branch-wide `git diff --check origin/main...HEAD` gate can pass.
- Corrected the complete-suite chronology: Task 8's pre-fix full run was 491/491; the reviewer independently verified the final tree, including the newly added CSS route-graph test, at 492/492.
- This correction changed documentation and formatting only. No code, test, image, manifest, or content file changed, and no build, browser QA, or full suite was rerun for this documentation-only round.
