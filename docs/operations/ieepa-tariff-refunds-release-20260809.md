# IEEPA Tariff Refunds Article Release

## Scope and authorization

- Article: `$166 Billion in Tariff Refunds Is Being Paid Out. Who Actually Gets the Money?`
- Slug: `ieepa-tariff-refunds-who-gets-the-money`
- Route: `/blog/ieepa-tariff-refunds-who-gets-the-money`
- Branch: `codex/publish-ieepa-tariff-refunds-20260809`
- Denny confirmed the complete Chinese article and instructed the established automatic workflow to continue through English adaptation and publication.
- Release scope is limited to one MDX article, three 1600×900 WebP images and this operational record.

## Identity and collision check

- Repository search on current `origin/main` found no existing exact slug or IEEPA tariff-refund article.
- The existing Stanley Black & Decker earnings article discusses tariff refunds only as one contributor to quarterly margin and has a different search intent.
- Decision: create one new Industry article at the fixed slug above.

## Editorial and evidence lock

- Chinese source: confirmed Obsidian final dated August 9, 2026.
- English adaptation: `en-v1.0`, reviewed against the complete Chinese final without softening the approved judgments.
- Central rule: the legal refund follows the Importer of Record and the qualifying customs entry, not brand nationality, marketplace GMV or the party that merely absorbed the economic cost.
- Company amounts retain their disclosed status: expected, filed, accepted, receivable, recognized gain or received cash.
- TTI is omitted because no verifiable refund amount was disclosed.
- Primary evidence includes BEA, CBP, SEC filings for SharkNinja and UPS, Stanley Black & Decker's 10-Q, and current court-procedure reporting.

## Visual package

- `ieepa-tariff-refunds-who-gets-the-money-cover.webp`: one editorial cover.
- `ieepa-tariff-refunds-company-disclosures.webp`: one company-amount and status evidence graphic.
- `ieepa-tariff-refunds-ior-flow.webp`: one IOR mechanism graphic.
- All three assets are 1600×900 WebP. Generated concepts carry no logos or documentary claims; exact facts and text are deterministic overlays.
- Visual review repaired the long Stanley Black & Decker label by using `SBD` with the full name in the note.

## Release gates

- Current status: `local_verified`.
- Independent-review fallback: `PASS`. A separate second pass compared the English article paragraph by paragraph with the confirmed Chinese final; names, dates, amounts, status labels, IOR logic, certainty and the supplier-sharing judgment were preserved. No fact was added and no approved conclusion was softened.
- Focused content tests: classification, 15 Insights tests and 10 Blog landing tests passed.
- Production build: passed; Next.js generated 624 pages including the target route.
- Desktop 1440×1100 and mobile 390×844 browser verification: passed. Title, H1, description, production canonical and Article JSON-LD were present; all three article images loaded at 1600×900; horizontal overflow was zero.
- Browser console: only the expected local `/_vercel/insights/script.js` 404 appeared.
- PR / Preview / production deployment: pending.
- Live route, images, metadata, sitemap and collection order: pending.
