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

The GitHub `main` branch is the single source of truth for production. The current release rules — which changes are routine page updates and which are high-impact, and when a Vercel Preview is required — live in [`AGENTS.md`](AGENTS.md) under "Production release rule". Follow that document rather than a copy here.

GitHub Actions (`.github/workflows/test.yml`) runs the server-free tests on every pull request and on `main`.

Do not use `vercel --prod` for routine releases. Direct CLI production deployment is reserved for an explicitly approved emergency recovery when the normal GitHub-to-Vercel path is unavailable.

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Lead collection

Website calls to action open Tally forms. The form IDs are defined in [`lib/tallyForms.ts`](lib/tallyForms.ts); that file is the source of truth. As of this update it defines six distinct forms:

| Key in `TALLY_FORMS` | Form | Lead type |
| --- | --- | --- |
| `contact` | `https://tally.so/r/MeV8L8` | `contact` |
| `sourcing` | `https://tally.so/r/1ARG4M` | `sourcing` |
| `reports` | `https://tally.so/r/ZjeGvz` | `reports` |
| `newsletter` | `https://tally.so/r/xX1xZJ` | `newsletter` |
| `wceExhibitor` | `https://tally.so/r/XxklMV` | `wce_exhibitor` |
| `wceVisitor` and `expo` | `https://tally.so/r/lbzVN6` | `wce_visitor` |

`lbzVN6` was previously listed here as "World Clean Expo Updates"; it is now used for expo visitor registration.

Tally sends submissions to Airtable. The Airtable base is `World Clean Biz Leads`, table `Leads`.
