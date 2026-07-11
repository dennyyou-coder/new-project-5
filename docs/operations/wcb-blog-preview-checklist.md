# WCB Blog Preview Verification

Date: 2026-07-11

Status: Local verification passed; Vercel Preview verification pending.

## Build

- [x] `npm run test:blog` — 8 passed, 0 failed
- [x] `npm run test:lead` — 7 passed, 0 failed
- [x] `npm run test:homepage` — 9 passed, 0 failed
- [x] `npm run build` — 192 routes generated

## Routes And SEO

- [x] `/blog` title is `Blog | World Clean Biz` with one brand suffix
- [x] `/blog` canonical is `https://worldcleanbiz.com/blog`
- [x] Query-filtered Blog metadata retains `noindex, follow`
- [x] Blog Open Graph image resolves locally with no broken images
- [x] Article canonical and existing JSON-LD rendering remain in the build
- [ ] Confirm the Open Graph image returns 200 on Vercel Preview

## CTA Samples

- [x] `/blog/commercial-cleaning-robot-manufacturers-china` — Buyer Guide → `Start A Sourcing Inquiry`
- [x] `/blog/pool-and-lawn-robots-self-maintenance` — Market Signals → `Get The Report`
- [x] `/blog/cleaning-appliance-companies-at-awe` — Trade Shows → `Get Expo Updates`
- [x] `/blog/dji-enters-robot-vacuums` — Floorcare fallback → `Subscribe To Blog Updates`
- [x] Every sample renders exactly one `.blog-conversion-cta`

## Analytics

- [x] Unit coverage confirms `cta_view` and `cta_click` accept article context
- [x] Existing Tally popup callbacks remain the only source of `form_open`, `form_submit`, and `form_success`
- [x] Click tracking remains separate from verified form callbacks
- [ ] Confirm `cta_view`, `cta_click`, and `form_open` in GA4 DebugView on Preview
- [ ] Confirm `form_success` only after a controlled Tally submission
- [ ] Confirm `NEXT_PUBLIC_TALLY_NEWSLETTER_FORM_ID` exists in the Preview environment

## Responsive And Accessibility

- [x] Desktop Blog screenshot inspected at 1440 × 1000
- [x] 390 × 844 article layout inspected
- [x] Desktop and mobile DOM measurements show no horizontal overflow
- [x] Mobile article and CTA containers both measure 362px inside a 390px viewport
- [x] Four sample articles report zero broken images
- [ ] Complete keyboard focus and popup interaction check on Preview
- [ ] Capture accepted Preview screenshots of Blog and the CTA area

## Regression

- [x] Homepage structure suite passes unchanged
- [x] Header and Footer source files are unchanged
- [x] No article body, title, slug, frontmatter, or approved image changed

## Preview Release Gate

Do not merge to `main` until the unchecked Preview items above pass and the user explicitly approves the Vercel Preview.
