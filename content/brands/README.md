# Brand profile source files

Each brand profile is one JSON file in this folder. Its filename should match the profile `slug`.

## Required profile fields

Use these field names exactly:

- `status`
- `slug`
- `name`
- `aliases`
- `legalName`
- `officialWebsite`
- `headline`
- `description`
- `metaDescription`
- `disclaimer`
- `headquarters`
- `founded`
- `heroImage`
- `heroImageAlt`
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
- `manufacturingSupplyChain`
- `marketsChannels`
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
- Keep profiles in `draft` until `npm run test:brands` accepts them.
