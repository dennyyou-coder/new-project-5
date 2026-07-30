# Brand Intelligence Search Baseline

**Prepared:** 2026-07-30

**Planned production launch:** Not yet approved

**Scope:** `/brands`, the first ten brand pages, and the 30 selected supporting articles

## Baseline status

The pre-launch Google Search Console baseline is **blocked by data access**.

This working environment does not have:

- an authenticated Google Search Console connection;
- Search Console API credentials for `worldcleanbiz.com`; or
- an approved Search Console export for the requested period.

No zero values have been entered. A zero would mean Search Console reported no activity; that has not been established.

| Required measure | Current value | Status |
| --- | --- | --- |
| Exact export date | Pending authenticated export | Blocked |
| Exact 28-day start date | Pending confirmation of Search Console's latest finalized date | Blocked |
| Exact 28-day end date | Pending confirmation of Search Console's latest finalized date | Blocked |
| Total organic clicks | Pending | Not measured |
| Total organic impressions | Pending | Not measured |
| Sitewide CTR | Pending | Not measured |
| Sitewide average position | Pending | Not measured |
| Brand-query rows, landing pages, CTR and position | Pending | Not measured |

### Exact collection method after access is granted

Use the Google Search Console domain property for `worldcleanbiz.com` and the **Search results** performance report.

1. Record the extraction date and the report's latest finalized date.
2. Set **Search type: Web**.
3. Set a custom 28-day range ending on the latest finalized date. Record the exact start and end dates above before exporting.
4. Leave country, device and search appearance unfiltered.
5. Export the unfiltered total clicks, impressions, CTR and average position.
6. Export rows with both **Query** and **Page** dimensions for each brand term set below. Preserve clicks, impressions, CTR and position exactly as Search Console reports them.
7. Save the untouched exports with the property, date range and extraction date in the filename. Keep a separate working sheet for grouping aliases; do not overwrite the raw exports.
8. Add the resulting totals and query/page rows to this document before the production comparison is interpreted.

If the API is used, run one ungrouped request for property totals and query-plus-page requests for the brand terms. Use the same Web search type and exact finalized date range as the interface export. Record any anonymized or row-limit omissions reported by Search Console.

### Brand query sets

The filters should capture the brand name plus buyer-relevant aliases. Ambiguous product names should be reviewed manually and retained only when the query is clearly about the brand.

| Brand page | Query terms to inspect |
| --- | --- |
| `/brands/roborock` | Roborock; Stone Technology; Beijing Roborock Technology |
| `/brands/dreame` | Dreame; Dreame Technology; Dreametech; Zhui Mi |
| `/brands/ecovacs` | ECOVACS; ECOVACS Robotics; Ecovacs Group; Kewo Si |
| `/brands/dyson` | Dyson |
| `/brands/tineco` | Tineco; Tineco Intelligent Technology; TEK when the query also indicates floorcare |
| `/brands/irobot` | iRobot; Roomba; iRobot Corp. |
| `/brands/bissell` | BISSELL; Bissell Homecare |
| `/brands/aiper` | Aiper; Aiper Group; Aiper Inc. |
| `/brands/maytronics` | Maytronics; Maytronics International; Dolphin when the query also indicates pool cleaning |
| `/brands/mammotion` | Mammotion; LUBA; YUKA; SPINO when the query indicates the relevant robot product |

For each set, the completed baseline must show:

- the query;
- the WCB landing page;
- clicks and impressions;
- CTR and average position;
- whether the landing page is one of the new brand pages, a selected article, or another WCB page.

## Local pre-launch evidence

All checks below were run against commit `d6c98e085f8588fc90840b7e24e2acdd87040dd2` before this document was added.

| Gate | Result |
| --- | --- |
| `npm run test:brands` | PASS — 35 tests passed |
| `npm run verify:content-classification` | PASS |
| `npm run build` | PASS — 402 static pages generated |
| `/brands` | HTTP 200 |
| Ten approved brand detail routes | 10/10 returned HTTP 200 |
| Unknown brand route | HTTP 404 |
| `/brands/dolphin` | HTTP 404 |
| Maytronics alias | `Dolphin` present on `/brands/maytronics` |
| Structured data | No rendered brand route contained `ProfilePage` |
| Selected article links | 30/30 articles rendered; 32/32 primary-brand links pointed to a published brand route |
| Assigned hero assets | 8/8 existed and returned HTTP 200 |

ECOVACS and iRobot intentionally have no hero image. Their previously considered assets did not accurately represent those brands, so no placeholder or misleading image was assigned.

### Source reachability and claim sampling

The ten profiles contain 73 source records and 72 unique external URLs.

- 55 unique URLs returned HTTP 2xx during the automated pre-launch check.
- 15 URLs returned `403` or connection-reset responses associated with automated-access controls. These are access limitations, not evidence that the citation is invalid.
- Two Mammotion newsroom URLs returned `404` to the automated Node check. An independent current web-index check retrieved the cited LUBA and SPINO page content at the same canonical URLs. They remain a required manual browser check in Preview.

Representative source-to-claim checks matched the profile wording, including:

- Fluidra's completed 27% Aiper investment and approximately USD 100 million consideration;
- BISSELL's 2018 acquisition of Sanitaire from Electrolux;
- Dreame's 2020 Series B+ financing, Xiaomi/Shunwei participation and 2017 Xiaomi ecosystem entry;
- the Companies House control scope for Dyson UK Group Limited;
- iRobot becoming privately held and wholly owned by Picea;
- Mammotion's stated AgileX technology lineage, without treating that lineage as current ownership;
- Dolphin being a Maytronics product brand rather than a separate company page; and
- Tineco's 2018 change from the TEK brand.

Before Preview is approved, manually open the 17 automation-limited citations in a normal browser and confirm that the specific cited passage remains visible. Do not replace a source solely because an automated checker is blocked.

## Post-launch measurement schedule

Let **L** be the verified production launch date. Record the actual calendar dates when production approval is given.

| Checkpoint | Due date | Required checks | Decision/output |
| --- | --- | --- | --- |
| Day 30 | L + 30 days | Inspect crawl status, indexing, canonical selection, sitemap discovery, page errors and first brand queries. Confirm all ten pages are indexed or document the reason each excluded page gives. | Technical remediation list; first-query snapshot |
| Day 60 | L + 60 days | Compare impressions, clicks, CTR, average position and organic landing-page visits against the pre-launch 28-day baseline. Review new query/page pairs and brand-page-to-article reading paths. | Early search and engagement report |
| Day 90 | L + 90 days | Repeat the Day 60 measures using a stable comparison window. Separate brand-name gains from generic buyer-intent gains and note pages needing stronger internal links or fresher evidence. | 60–90 day performance decision |
| Month 6 | L + 180 days | Evaluate sustained impressions, rankings, organic visits, assisted reading, citation freshness and maintenance cost by brand. | Approve, revise or stop the next brand batch |

Use comparable complete date windows. Annotate seasonality, launches, recalls, major corporate events and tracking changes rather than attributing every change to the brand pages.

## External-action boundary

This document records local readiness only. The branch has not been pushed and no Vercel Preview or production deployment has been created.

The next authorized step requires explicit approval to:

1. push the feature branch; and
2. create and validate a Vercel Preview.

Preview approval is not production approval. Merging to `main` and the production release require a separate explicit decision after Preview validation.
