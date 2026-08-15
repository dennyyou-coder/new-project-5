# World Clean Biz Production Release Workflow

## Objective

Keep GitHub, Vercel, and `worldcleanbiz.com` synchronized so every production release is reproducible and has a clear rollback point.

## Source of truth

- GitHub repository: `dennyyou-coder/new-project-5`
- Production branch: `main`
- Production website: `https://worldcleanbiz.com`
- Deployment system: Vercel Git integration

The GitHub `main` branch is the only authoritative production source.

## Default: routine page update

Most work in this repository changes a page, article, or page-local visual. Keep that workflow short:

1. Change only the requested page or article scope and preserve unrelated work.
2. Run one targeted check. Inspect the affected page; add a 390 px check only when responsive layout may change. Prepare and verify article images when images are involved.
3. Commit and push one focused branch/PR, then merge automatically after the targeted check passes. A Vercel Preview and local production build are not routine requirements.
4. Let the Vercel Git integration deploy `main` to production.
5. Verify the live target URL and report the deployed commit and result once.

One confirmed request authorizes this routine sequence through production. Do not add design specs, implementation plans, TDD ceremony, multi-agent review, full-suite testing, release-specific records, or repeated approval prompts unless the user explicitly requests them.

## High-impact exception

Use expanded engineering checks only when the final change affects dependencies, build/deployment configuration, environment variables, global routing or layout, authentication, payments, analytics, forms, destructive operations, data migrations, or several site systems at once.

For these changes:

- run the relevant regression checks;
- use a local production build only when it provides evidence not already supplied by Preview;
- use Vercel Preview and validate the affected systems;
- obtain one production approval after the complete result is available;
- avoid repeating a passing check without a relevant code or base-branch change.

## Prohibited routine action

Do not use `vercel --prod` for routine production releases. It can make production differ from GitHub and allows a later Git deployment to overwrite the live site unexpectedly.

## Emergency exception

A direct CLI production deployment is permitted only when:

- the normal GitHub-to-Vercel path is unavailable;
- the user explicitly approves the emergency action;
- the exact local commit is recorded before deployment; and
- the deployed change is reconciled into GitHub `main` immediately after service is restored.

## Minimum production verification

- Vercel reports the Git-triggered deployment for the merged `main` commit as ready.
- The target URL loads the requested version.
- Check only the changed behavior and any directly affected SEO/image requirement.
- Review recent runtime errors when the changed code can produce runtime failures.
- Report the production commit and result. Include a rollback point only for high-impact changes.
