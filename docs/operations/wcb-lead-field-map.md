# WCB Lead Form Field Map

Status: external configuration completed; end-to-end test submission and GA4 verification pending.

## Airtable base

- Base: `World Clean Biz Leads`
- Table: `Leads`
- Reuse the existing `Lead Type` field as the form-intent field. Do not create a second `Form Type` field.
- Reuse `Notes` for open-ended enquiry details.

## Fields to add to Airtable

Add these fields as single line text unless stated otherwise:

| Airtable field | Type | Tally hidden field |
| --- | --- | --- |
| Source Page | Single line text | `source_page` |
| CTA Location | Single line text | `cta_location` |
| Language | Single line text | `language` |
| UTM Source | Single line text | `utm_source` |
| UTM Medium | Single line text | `utm_medium` |
| UTM Campaign | Single line text | `utm_campaign` |
| UTM Content | Single line text | `utm_content` |
| UTM Term | Single line text | `utm_term` |
| Report ID | Single line text | `report_id` |

Add these `Lead Type` single-select choices if absent:

`contact`, `sourcing`, `reports`, `newsletter`, `wce_exhibitor`, `wce_visitor`.

## Required hidden fields in every Tally form

Create these case-sensitive hidden fields in each form:

`form_type`, `source_page`, `cta_location`, `language`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `report_id`.

Map `form_type` to Airtable `Lead Type`.

## Form routing

| Form | Public ID | Lead Type | Existing / create | Airtable destination |
| --- | --- | --- | --- | --- |
| Contact World Clean Biz | `MeV8L8` | `contact` | Existing | Leads |
| Sourcing inquiry | `1ARG4M` | `sourcing` | Existing | Leads |
| Reports | `ZjeGvz` | `reports` | Existing | Leads |
| World Clean Expo updates | `lbzVN6` | `wce_visitor` | Existing | Leads |
| WCB Newsletter | `xX1xZJ` | `newsletter` | Published | Leads |
| WCE exhibitor / partner | `XxklMV` | `wce_exhibitor` | Published | Leads |

## New Newsletter form

Required visible questions:

1. Work email — Email, required
2. Your role — Dropdown, required
3. Interests — Multiple select: Market Intelligence, Sourcing, World Clean Expo
4. Consent — Required checkbox for WCB updates

Success message:

> Thank you. You are subscribed to World Clean Biz updates. We will send industry intelligence based on the interests you selected.

## New WCE exhibitor / partner form

Required visible questions:

1. Name — Short answer, required
2. Work email — Email, required
3. Company — Short answer, required
4. Role — Dropdown, required
5. Product category — Short answer, required
6. Interest — Multiple choice: Exhibit, Sponsor, Forum, Media, Other
7. Business goal — Long answer, required
8. Country / Region — Short answer, required

Success message:

> Thank you. The World Clean Expo team received your inquiry and will review the information you provided.

## Verification record

External configuration completed on 2026-07-10:

- Airtable tracking fields created and verified: Source Page, CTA Location, Language, UTM Source, UTM Medium, UTM Campaign, UTM Content, UTM Term and Report ID.
- Contact, Sourcing, Reports and WCE visitor forms: all ten hidden fields and Airtable mappings saved.
- WCE exhibitor / partner: published and full visible-field plus tracking-field mapping saved.
- Newsletter: published; Work email, role, source/language and tracking mappings configured. The Tally `Interests` multi-select cannot map to the existing Airtable `Interest` single-select field and remains available in Tally submissions only until a compatible Airtable multi-select field is added.
- Website environment contains both new public form IDs.
- Lead contract tests pass and the production build completes successfully.

Before production release, record the following for all six form intents:

- Published form ID and Tally-to-Airtable mapping verified
- Test lead present in `Leads` with the expected Lead Type, Source Page and CTA Location
- GA4 DebugView observed `form_open`, `form_submit` and `form_success`
- Preview URL and test date
