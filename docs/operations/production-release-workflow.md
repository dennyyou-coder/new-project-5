# World Clean Biz Production Release Workflow

## Objective

Keep GitHub, Vercel, and `worldcleanbiz.com` synchronized so every production release is reproducible and has a clear rollback point.

## Source of truth

- GitHub repository: `dennyyou-coder/new-project-5`
- Production branch: `main`
- Production website: `https://worldcleanbiz.com`
- Deployment system: Vercel Git integration

The GitHub `main` branch is the only authoritative production source.

## Standard release sequence

1. Create or use an isolated feature branch/worktree.
2. Confirm the intended scope and preserve unrelated user changes.
3. Implement the approved change.
4. Run focused tests for the changed behavior.
5. Run `npm run build` and confirm all expected routes are generated.
6. Commit the change with a focused message.
7. Push the feature branch to GitHub.
8. Deploy or inspect a Vercel Preview linked to that branch.
9. Validate the approved scope, including desktop, mobile, forms, analytics, SEO, and browser errors when relevant.
10. Obtain explicit user approval for production.
11. Merge the approved branch into `main`.
12. Push `main` to GitHub.
13. Wait for the Vercel Git deployment triggered by `main`.
14. Verify the production domain and report the production commit, deployment result, and rollback point.

## Prohibited routine action

Do not use `vercel --prod` for routine production releases. It can make production differ from GitHub and allows a later Git deployment to overwrite the live site unexpectedly.

## Emergency exception

A direct CLI production deployment is permitted only when:

- the normal GitHub-to-Vercel path is unavailable;
- the user explicitly approves the emergency action;
- the exact local commit is recorded before deployment; and
- the deployed change is reconciled into GitHub `main` immediately after service is restored.

## Required verification checklist

- Working tree and release branch are understood.
- Focused tests pass.
- Production build passes.
- Vercel Preview is reviewed when the change affects the rendered site.
- User explicitly approves production.
- `main` is pushed successfully.
- Vercel reports the Git-triggered production deployment as ready.
- `https://worldcleanbiz.com` loads the approved version.
- Core navigation works.
- Relevant forms open and preserve their intended lead type.
- Browser console has no production errors.
- Production commit and rollback point are reported.
