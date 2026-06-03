# You Denny Website Project

This document tracks the build progress for the You Denny / World Clean Biz website.

## Project Goal

Build a professional English website for cleaning industry intelligence, sourcing opportunities, market reports, and World Clean Expo related content.

## Confirmed Positioning

| Item | Decision |
| --- | --- |
| English site name | World Clean Biz |
| Chinese internal project name | 游丹尼网站 |
| Audience | Global cleaning industry professionals, including buyers, suppliers, distributors, manufacturers, trade show visitors, analysts, and industry media |
| Core positioning | A trusted home for global cleaning industry professionals to find the information, opportunities, and market context they need |
| Chinese positioning | 全球清洁行业从业者的圣地，他们能从中获得需要的信息 |
| Product direction | Build as a comprehensive industry information platform first, then expand into sourcing, reports, events, and lead generation |

The site should support:

- Public business profile and platform introduction
- Cleaning industry insights and SEO articles
- Sourcing and supplier opportunity pages
- Market report pages
- World Clean Expo information pages
- Contact and lead collection
- GitHub-based version control
- Future Vercel deployment

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| Local website | In progress | Next.js site runs locally with `npm run dev` |
| GitHub repository | Done | Repository: `dennyyou-coder/new-project-5` |
| SSH setup | Done | Local machine can authenticate with GitHub |
| Initial Git push | Done | First version pushed to GitHub `main` branch |
| Vercel deployment | Not started | Next recommended milestone |
| Domain setup | Not started | Planned after deployment |
| Content system | In progress | MDX insight files exist in `content/insights` |
| SEO structure | In progress | Metadata, sitemap, robots, manifest, and icons exist |

## Website Sections

| Section | File | Status | Next Action |
| --- | --- | --- | --- |
| Homepage | `app/page.tsx` | In progress | Rewrite hero around the global cleaning industry platform positioning |
| About | `app/about/page.tsx` | In progress | Explain World Clean Biz as a trusted industry information platform |
| Insights list | `app/insights/page.tsx` | In progress | Check article list layout and categories |
| Insight detail | `app/insights/[slug]/page.tsx` | In progress | Improve article template and metadata |
| Sourcing | `app/sourcing/page.tsx` | In progress | Present sourcing as one major value channel inside the platform |
| Market Reports | `app/market-reports/page.tsx` | In progress | Present reports as market context for cleaning professionals |
| World Clean Expo | `app/world-clean-expo/page.tsx` | In progress | Position as trade show intelligence and event-related industry information |
| Contact | `app/contact/page.tsx` | In progress | Confirm contact fields and destination |

## Content Inventory

Current insight articles:

- `content/insights/robot-vacuum-market-trends-2026.mdx`
- `content/insights/europe-floor-care-demand-update.mdx`
- `content/insights/china-cleaning-supply-chain-update.mdx`

Future content types to consider:

- Industry news analysis
- Supplier profiles
- Market briefings
- Trade show notes
- Buyer guides
- Product category trend reports

## Recommended Next Milestones

1. Finish core page copy
2. Review website layout in browser
3. Commit and push latest edits
4. Deploy to Vercel
5. Connect custom domain
6. Add analytics and search indexing
7. Establish weekly content publishing workflow

## Operating Workflow With Codex

For future updates, use this pattern:

1. Tell Codex what changed or what content to add.
2. Codex edits the site files.
3. Codex checks the local website when needed.
4. Codex updates this project document if progress changes.
5. Codex commits the work.
6. Codex pushes the update to GitHub.

Useful request examples:

```text
帮我更新首页文案，并同步 PROJECT.md 进度
```

```text
帮我新增一篇行业文章，然后提交并推送到 GitHub
```

```text
帮我部署到 Vercel，并记录部署进度
```

## Change Log

| Date | Update |
| --- | --- |
| 2026-06-02 | GitHub account, SSH, repository, initial commit, and first push completed. |
| 2026-06-02 | Project tracking document created. |
| 2026-06-02 | Website positioning confirmed as a global information home for cleaning industry professionals. |
| 2026-06-02 | Core website copy updated around the global cleaning industry information platform positioning. |
| 2026-06-02 | Visual detail pass added for page hero backgrounds, cards, buttons, forms, and responsive polish. |
| 2026-06-02 | Homepage reorganized into a clearer platform flow: positioning, channels, latest intelligence, audience, categories, and inquiry CTA. |
| 2026-06-03 | Inner pages adjusted to match the homepage standard: clearer positioning, information-channel structure, decision context, and focused inquiry paths. |
| 2026-06-03 | Release polish added: metadata, manifest, icons, skip link, footer copyright, form accessibility, stable sitemap dates, and production-friendly Next.js config. |
| 2026-06-03 | High-standard visual refinement pass completed across blocks: navigation, hero, channel cards, article cards, sidebars, CTA bands, forms, page heroes, and mobile spacing. |
| 2026-06-03 | Site color system updated to a more technology-forward palette with deep navy, electric blue, cyan accents, and subtle information-grid backgrounds. |
| 2026-06-03 | Full content preview pass added: expanded homepage modules, sourcing scenarios, report samples, expo pillars, contact examples, about roadmap, and four additional insight articles. |
| 2026-06-03 | Homepage Latest Insights sidebar removed; section rebuilt as a full-width featured article, article grid, and integrated topic-request prompt. |
