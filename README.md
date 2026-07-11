# World Clean Biz

World Clean Biz is a Next.js content platform for global cleaning industry intelligence, sourcing opportunities, market reports, and World Clean Expo.

## First-phase stack

- Next.js App Router
- MDX-style content files in `content/insights`
- GitHub for code and article storage
- Vercel for hosting, deployment, HTTPS, and performance
- Cloudflare for domain registration and DNS management only in Phase 1

## Daily publishing workflow

1. Draft raw notes in Obsidian.
2. Ask Codex to turn the notes into an English SEO article.
3. Codex creates a `.mdx` file in `content/insights`.
4. Codex updates related links or homepage highlights when useful.
5. Commit to GitHub.
6. Vercel deploys automatically.

## Production release workflow

The GitHub `main` branch is the single source of truth for production.

1. Make changes on an isolated feature branch.
2. Run focused tests and `npm run build`.
3. Push the feature branch to GitHub.
4. Create and verify a Vercel Preview deployment.
5. Obtain explicit approval for production release.
6. Merge the approved branch into `main` and push `main` to GitHub.
7. Let the Vercel Git integration deploy production automatically.
8. Verify `worldcleanbiz.com`, core navigation, forms, analytics, and browser errors.

Do not use `vercel --prod` for routine releases. Direct CLI production deployment is reserved for an explicitly approved emergency recovery when the normal GitHub-to-Vercel path is unavailable.

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Lead collection

Website calls to action open Tally forms. Tally sends submissions to Airtable:

- Get Free Reports: `https://tally.so/r/ZjeGvz`
- Sourcing Inquiry: `https://tally.so/r/1ARG4M`
- World Clean Expo Updates: `https://tally.so/r/lbzVN6`
- Contact World Clean Biz: `https://tally.so/r/MeV8L8`

The Airtable base is `World Clean Biz Leads`, table `Leads`.
