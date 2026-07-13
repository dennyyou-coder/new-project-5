# World Clean Biz Production Audit Fixes Design

## Goal

Resolve the five issues found in the July 13 production audit in one isolated batch, while preserving the approved Sourcing page design and the published `USD 40B+ → USD 140B` industry estimate.

## Scope

1. Make the public Newsletter and World Clean Expo exhibitor Tally forms reliable in every Git/Vercel build.
2. Add self-referencing canonical metadata to `/` and `/reports`.
3. Track views and clicks for the six Sourcing opportunity cards with the established lead-attribution fields.
4. Keep the existing market-size figures and add concise editorial methodology, scope, and timing language without inventing a third-party source.
5. Add article cover images to Lawn Robots Related Intelligence cards and align their layout with the other Sourcing product pages.

## Constraints

- Do not alter the approved `USD 40B+ → USD 140B` figures.
- Do not change shared navigation, Footer, route structure, dependencies, or unrelated pages.
- Keep all Sourcing-specific styles scoped to the existing Sourcing page classes.
- Preserve the existing Tally hidden-field attribution model and GA4 event names.
- Publish Preview first and return its URL. Production deployment requires the user's confirmation after Preview review.

## Design

### Reliable public form configuration

Use the approved public Tally form IDs directly in `lib/tallyForms.ts`, matching the existing pattern already used for Contact, Sourcing, Reports, and visitor forms. Tally form IDs are public routing identifiers, not secrets. This avoids a build-time failure mode where missing Vercel variables leave visible buttons without a usable form.

The affected buttons remain unchanged visually and continue to use the shared `TallyButton` fallback and event tracking.

### Canonical metadata

Add `alternates.canonical` to the homepage and Reports metadata. The final canonical URLs remain generated through the existing root `metadataBase` convention.

### Sourcing opportunity-card tracking

Create one small client component responsible for rendering an opportunity card and recording:

- `cta_view` when at least 35% of the card becomes visible;
- `cta_click` immediately before navigation;
- `conversion_group: sourcing`;
- `form_type: sourcing`;
- current `source_page`;
- each card's existing `ctaLocation` and category `value`;
- `inquiry_intent: category_exploration`.

The component uses the existing `createLeadAttribution` and `trackLeadEvent` functions so reporting stays consistent with form CTAs. Navigation remains a normal internal Next.js link.

### Market-estimate disclosure

Keep both displayed figures. Expand the existing `World Clean Biz Industry Estimate` note to state:

- the estimate is directional rather than audited market data;
- the current reference period is 2026;
- the horizon is approximately the next decade;
- the scope covers major global indoor and outdoor cleaning-equipment categories;
- USD values are approximate conversions from the RMB framing.

No external source will be invented or implied.

### Lawn Robots Related Intelligence

Render each related article's approved cover image before its title. Use the same article data already returned by `getInsights()`. Add a scoped fallback image only for an article without a cover, and use flex layout so titles, excerpts, and `Read the analysis →` actions align consistently.

## Error handling

- Existing Tally fallback behavior remains intact if a form service is unavailable.
- Opportunity-card tracking remains non-blocking; navigation proceeds even when `window.gtag` is unavailable.
- Missing article cover data uses an existing Sourcing image rather than a placeholder.

## Verification

- Add regression tests that fail before implementation for both public Tally IDs, both canonical values, all six tracked card fields, the preserved market figures and disclosure, and Lawn Robots article images.
- Run each affected test in red state, implement the minimum changes, then run it green.
- Run all existing test scripts and `npm run build`.
- Run the production Sourcing SEO verifier against the Preview URL.
- Check Preview HTML for canonical values, form IDs, one H1 per page, image loading, and the six live Sourcing routes.

