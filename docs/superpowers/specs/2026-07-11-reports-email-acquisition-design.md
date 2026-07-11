# Market Reports Email Acquisition Design

## Goal

Turn `/reports` into a free-report lead magnet whose primary business outcome is collecting qualified work email addresses, not selling reports.

## Scope

- Update the Reports page, Reports lead form, report cover/PDF assets, and focused tests.
- Preserve the homepage, Sourcing, Contact, navigation, and unrelated pages.
- Keep all visible website copy in English.
- Publish only through a feature branch and Vercel Preview until final approval.

## Experience

The page leads with one specific free report, proves its value through report scope and page previews, and repeats one consistent `Get The Report` action. The existing report-interest selector and qualification fields remain because the library will expand to multiple reports. There is no pricing, purchasing language, or report-sales funnel.

## Delivery

Submission uses the existing Tally form, report selector, qualification fields, and attribution fields. The report PDF is the current promised deliverable, and the form copy clearly states that subscribers may receive future World Clean Biz industry intelligence updates.

## Validation

- Tests assert the lead-magnet positioning, report-selection flow, PDF asset, CTA consistency, and absence of sales language.
- Run all existing suites and a production build.
- Verify desktop and mobile Preview rendering plus the report form interaction.
