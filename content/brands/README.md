# Brand profile source files

Each brand profile is one JSON file in this folder. Its filename should match the profile `slug`.

## Profile fields

Use these field names exactly:

- `status`
- `slug`
- `name`
- `aliases`
- `legalName` (optional when `legalEntityNote` is present)
- `legalEntityNote` (optional when `legalName` is present)
- `schemaEntityType` (optional; `Brand` or `Organization`, defaults to `Organization`)
- `officialWebsite`
- `headline`
- `description`
- `metaDescription`
- `disclaimer`
- `headquarters`
- `founded`
- `heroImage`
- `heroImageAlt`
- `heroSourceUrl` (recommended official HTTPS source for the exact Hero asset)
- `logoImage`
- `logoImageAlt`
- `logoSourceUrl`
- `contentVisuals`
- `contentVisuals[].placement`
- `contentVisuals[].src`
- `contentVisuals[].alt`
- `contentVisuals[].caption`
- `ownership`
- `ownership.summary`
- `ownership.parentCompany`
- `leadership`
- `leadership[].name`
- `leadership[].role`
- `leadership[].context`
- `productPortfolio`
- `productPortfolio[].name`
- `productPortfolio[].positioning`
- `productPortfolio[].buyerRelevance` (optional)
- `manufacturingSupplyChain`
- `manufacturingSupplyChain[].evidence`
- `manufacturingSupplyChain[].scope`
- `manufacturingSupplyChain[].buyerCheck`
- `marketsChannels`
- `marketsChannels[].evidence`
- `marketsChannels[].scope`
- `marketsChannels[].buyerCheck`
- `competitivePosition`
- `competitivePosition.summary`
- `competitivePosition.competitorSlugs`
- `developments`
- `developments[].date`
- `developments[].title`
- `developments[].summary`
- `developments[].sourceIds`
- `sources`
- `sources[].id`
- `sources[].title`
- `sources[].publisher`
- `sources[].url`
- `sources[].publishedAt`
- `sources[].accessedAt`
- `publishedAt`
- `lastVerified`
- `lastModified`

## Editorial and source rules

- Prioritize official company, regulator, exchange, annual report, prospectus, and formal interview sources.
- Omit unsupported facts, or describe them as not publicly disclosed.
- Clearly separate World Clean Biz analysis from reported fact.
- Change `lastVerified` only after a human source review.
- Change `lastModified` only after a material profile edit.
- Use `schemaEntityType: "Brand"` when the page subject is a consumer brand rather than a legal company. Use `Organization` for a corporate group or operating company.
- Keep profiles in `draft` until `npm run test:brands` accepts them.
- Provide at least one of `legalName` or `legalEntityNote`. Use `legalEntityNote` when no single reviewed legal entity truthfully represents the consumer brand.

## Logo and content visual rules

- Published profiles require complete official Logo metadata: `logoImage`, `logoImageAlt` and `logoSourceUrl`.
- Draft profiles may omit Logo fields. Any Logo field supplied on a draft must still meet the same field-level validation.
- `logoImage` must use `/images/brands/{slug}/logo.webp`, and `logoImageAlt` must identify the brand logo.
- `logoSourceUrl` must be a valid HTTP(S) URL for the brand's official website or official media or press-kit page. Use it only as the retrieval source for the exact official Logo asset; do not use third-party Logo repositories or redraw the mark.
- `heroSourceUrl`, when supplied, must be the official HTTPS product, media-library or press-kit page used to retrieve the Hero image.
- `contentVisuals` must contain 2 or 3 items. Every `src` must begin with `/images/`, and every item requires factual, non-empty `alt` and `caption` text.
- `contentVisuals[].placement` must be exactly one of `ownership`, `portfolio`, `operations` or `competition`.

## Structured evidence rules

Both `manufacturingSupplyChain` and `marketsChannels` are arrays of evidence objects:

```json
{
  "evidence": "The existing source-backed conclusion, preserved verbatim.",
  "scope": "The exact entity, model, market or reporting-period level covered by the evidence.",
  "buyerCheck": "A concrete verification action for the buyer."
}
```

- Keep the existing conclusion unchanged in `evidence`.
- Use `scope` to prevent group-level, model-level, regional or dated evidence from being generalized.
- Use `buyerCheck` for a concrete action such as checking exact SKU origin, seller authorization, warranty entity, shipment documents or a distributor agreement.
- `productPortfolio[].buyerRelevance` is optional, but when present it must be a non-empty sentence grounded in the existing positioning and cited profile.
