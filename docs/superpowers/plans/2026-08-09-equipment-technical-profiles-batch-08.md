# Equipment Technical Profiles Batch 08 Implementation Plan

**Goal:** Publish walk-behind floor sweeper, ride-on floor sweeper and carpet spot extractor technical profiles using the existing equipment page system.

**Architecture:** Add three schema-valid JSON records and profile-local visual packages. Reuse the current loader, renderer, route, directory and sitemap without shared component changes.

## Constraints

- Equipment technical pages only; no articles, ownership pages, brand pages or component pages.
- At least five reliable sources, six to eight models and four published brand links per page.
- Evidence and WCB assessment remain separate; do not infer compatibility or achieved performance.
- Production is released only from GitHub `main` through Vercel Git integration.

## Tasks

1. Add literal eighth-batch contract and sitemap tests; run focused tests and confirm RED on missing profiles.
2. Add the three complete records as drafts, using official model, manual and standards sources.
3. Add official heroes, two official content photos and responsive WCB diagrams for each record.
4. Change status to published only after schema, evidence and local asset gates pass.
5. Run focused and full tests, content verifiers, diff checks and production build.
6. Review `/equipment` and all three pages at 1440 px and 390 px, including overflow and console errors.
7. Push a feature branch, validate Vercel Preview, merge through GitHub and verify production routes, assets and sitemap.
