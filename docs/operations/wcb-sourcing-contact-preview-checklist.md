# WCB Sourcing And Contact Preview Verification

Date: 2026-07-11

Status: Local verification passed; Vercel Preview verification pending.

## Automated Checks

- [x] Inquiry tests: 5 passed
- [x] Lead tests: 8 passed
- [x] Blog regression tests: 8 passed
- [x] Homepage regression tests: 9 passed
- [x] Production build: 192 routes generated

## Sourcing

- [x] Six category buttons render
- [x] No `/sourcing/*` links remain
- [x] Each definition has a unique `product_category` and CTA location
- [x] Exactly one root-layout `<main>`
- [x] Canonical is `/sourcing`
- [x] Social metadata uses an existing industry image
- [x] Desktop 1440 × 1000: no overflow, zero broken images
- [x] Mobile 390 × 844: no overflow, zero broken images

## Contact

- [x] Exactly four inquiry buttons render
- [x] Sourcing, Expo, Media and General map to the correct form keys
- [x] No direct Tally links remain in rendered HTML
- [x] Duplicate route list and query-driven ContactForm removed
- [x] Exactly one root-layout `<main>`
- [x] Canonical is `/contact`
- [x] Social metadata uses an existing industry image
- [x] Desktop 1440 × 1000: no overflow, zero broken images
- [x] Card text wraps inside each card without horizontal clipping
- [x] Mobile 390 × 844: no overflow, zero broken images

## Events And Accessibility

- [x] `product_category` and `inquiry_type` serialize into fallback URLs
- [x] New page buttons opt into exactly one `cta_click`
- [x] Existing Tally callbacks remain the only `form_submit` and `form_success` source
- [x] Category and inquiry cards use native buttons
- [x] Scoped `:focus-visible` outline exists
- [ ] Confirm popup hidden fields and GA4 events on Vercel Preview
- [ ] Confirm protected Preview screenshots after deployment

## Scope Regression

- [x] Homepage tests pass unchanged
- [x] Blog tests pass unchanged
- [x] Header and Footer not modified
- [x] No unrelated page or article changed

## Release Gate

Do not merge to `main` until Vercel Preview is READY and the user approves it.
