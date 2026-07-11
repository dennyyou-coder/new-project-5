# WCB Sourcing And Contact Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace six broken Sourcing category links and duplicated Contact routes with one tracked, accessible Tally conversion system.

**Architecture:** Extend the existing lead attribution contract with product and inquiry context, then render both pages from pure centralized definitions. Keep `TallyButton` as the only popup/fallback transport so UTM fields, status feedback, and verified submit callbacks remain consistent.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tally popup embed, GA4, Node.js built-in test runner.

## Global Constraints

- Do not modify homepage content/layout, Header, Footer, Blog, articles, Reports, World Clean Expo, About, routes, dependencies, or approved images.
- Do not create `/sourcing/*` routes.
- Use existing Tally keys `sourcing`, `expo`, and `contact`.
- Only Tally's real callback may emit `form_submit` and `form_success`.
- Do not use `vercel --prod` or merge `main` before Preview approval.
- Every production task must pass `test:inquiry`, `test:lead`, `test:blog`, `test:homepage`, and `npm run build`.

## File Map

- Create `lib/inquiryConversion.ts`: Sourcing and Contact definitions.
- Modify `lib/leadTracking.ts`: product/inquiry attribution.
- Modify `components/LeadForms.tsx`: pass context through Tally, fallback URL, and events.
- Modify `app/sourcing/page.tsx`: remove dead links/nested main; add tracked buttons and metadata.
- Modify `app/contact/page.tsx`: one four-route choice set; remove duplicate paths; add metadata.
- Delete `components/ContactForm.tsx` after removing its only import.
- Modify `app/globals.css`: scoped button-card, focus, and mobile rules.
- Create `tests/inquiryConversion.test.mjs`; modify `tests/leadTracking.test.mjs` and `package.json`.
- Create `docs/operations/wcb-sourcing-contact-preview-checklist.md`.

---

### Task 1: Extend Lead Attribution

**Files:** `lib/leadTracking.ts`, `components/LeadForms.tsx`, `tests/leadTracking.test.mjs`

**Produces:** `product_category` and `inquiry_type` in popup hidden fields, fallback URLs, and all relevant events.

- [ ] Add a failing test calling `createLeadAttribution()` with `productCategory: "pool_robots"` and `inquiryType: "sourcing"`; expect snake-case fields with those values. Update existing fixtures to expect both new fields as empty strings.
- [ ] Run `npm run test:lead`; expect failure because the fields do not exist.
- [ ] Add required string fields `product_category` and `inquiry_type` to `LeadAttribution`; add optional camel-case inputs and default them to `""`.
- [ ] Add optional `productCategory`, `inquiryType`, and `trackClick` props to `TallyButton`. Pass context into `createLeadAttribution()`.
- [ ] When `trackClick` is true, emit exactly one `cta_click` with attribution after attribution creation. Keep Blog's existing `onClickTrack`; default `trackClick` to false so Blog does not double count.
- [ ] Confirm every existing popup, fallback, submit, success and error payload spreads the expanded attribution.
- [ ] Run all four tests and build; expect zero failures and 192 generated routes.
- [ ] Commit: `feat: carry inquiry context through lead events`.

Required test shape:

```js
assert.equal(result.product_category, "pool_robots");
assert.equal(result.inquiry_type, "sourcing");
assert.match(buildTallyUrl("https://tally.so/r/test", result), /product_category=pool_robots/);
```

### Task 2: Centralize Inquiry Definitions

**Files:** create `lib/inquiryConversion.ts`, create `tests/inquiryConversion.test.mjs`, modify `package.json`

**Produces:** `SOURCING_CATEGORIES` and `CONTACT_INQUIRIES`.

- [ ] Add `test:inquiry` using Node type stripping.
- [ ] Write failing tests requiring six unique Sourcing values and four Contact mappings.
- [ ] Run `npm run test:inquiry`; expect `ERR_MODULE_NOT_FOUND`.
- [ ] Move the six existing Sourcing titles, descriptions, images and icons into definitions with values `pool_robots`, `lawn_robots`, `floor_washers`, `robotic_vacuums`, `commercial_cleaning`, and `vacuum_cleaners`.
- [ ] Give each Sourcing item `ctaLocation: "sourcing_category_<value>"`; do not include an `href`.
- [ ] Define Contact mappings exactly as follows:

```ts
[
  ["sourcing", "sourcing", "contact_sourcing", "Start A Sourcing Inquiry"],
  ["expo", "expo", "contact_expo", "Send An Expo Inquiry"],
  ["media", "contact", "contact_media", "Send A Media Inquiry"],
  ["general", "contact", "contact_general", "Send A General Inquiry"]
]
```

- [ ] Preserve current Contact titles, descriptions and icons in the definitions.
- [ ] Run all tests and build; commit `feat: define sourcing and contact inquiry routes`.

### Task 3: Replace Broken And Duplicated Paths

**Files:** `app/sourcing/page.tsx`, `app/contact/page.tsx`, `app/globals.css`, delete `components/ContactForm.tsx`, modify `tests/inquiryConversion.test.mjs`

- [ ] Add failing source tests asserting: no `href: "/sourcing/`, no page-level `<main`, one `CONTACT_INQUIRIES.map`, no `inquiryRoutes`, no `target="_blank"`, no `ContactForm`, and both pages contain canonical/Open Graph/Twitter metadata.
- [ ] Run `npm run test:inquiry`; verify failures correspond to the current dead links, nested main, duplicate Contact routes, and missing metadata.
- [ ] In Sourcing, import `SOURCING_CATEGORIES`, delete local `productOpportunities`, and replace the outer page `<main>` with `<div>`.
- [ ] Render each category with `TallyButton` using `form="sourcing"`, `productCategory={item.value}`, `ctaLocation={item.ctaLocation}`, and `trackClick`; preserve existing card image/copy markup.
- [ ] Add Sourcing canonical `/sourcing`, Open Graph/Twitter metadata, and `/images/industry/sourcing-supplier-meeting-2026.jpg`.
- [ ] In Contact, remove `Link`, `Suspense`, `ContactForm`, and direct `TALLY_FORMS` usage. Render exactly one `CONTACT_INQUIRIES.map` grid with `TallyButton`, the mapped form, `inquiryType`, location, `trackClick`, and specific button label.
- [ ] Delete the repeated `inquiryRoutes` section. Replace the lower panel with three truthful points: what context to prepare, how WCB routes the request, and follow-up based on fit without a guaranteed deadline.
- [ ] Add Contact canonical `/contact`, Open Graph/Twitter metadata, and `/images/industry/sourcing-supplier-meeting-2026.jpg`.
- [ ] Verify `rg "ContactForm"` returns no imports, then delete `components/ContactForm.tsx`.
- [ ] Add scoped native-button resets and `:focus-visible` outlines for `.sourcing-v3-product-card` and `.contact-help-card`; ensure `.lead-form-trigger` and buttons are 100% wide at 390px.
- [ ] Run all tests, build, `git diff --check`, and verify `rg 'href: "/sourcing/' app/sourcing/page.tsx` has no matches.
- [ ] Commit `feat: streamline sourcing and contact inquiry paths`.

Required page usage:

```tsx
<TallyButton
  className="sourcing-v3-product-card"
  ctaLocation={item.ctaLocation}
  form="sourcing"
  productCategory={item.value}
  trackClick
>
  {/* existing visual card content */}
</TallyButton>
```

```tsx
<TallyButton
  className="case-card contact-help-card"
  ctaLocation={item.ctaLocation}
  form={item.form}
  inquiryType={item.value}
  trackClick
>
  {/* current icon, title, description, and specific label */}
</TallyButton>
```

### Task 4: Verify And Create Preview

**Files:** create `docs/operations/wcb-sourcing-contact-preview-checklist.md`; only fix in-scope defects found by verification.

- [ ] Record the four test counts, build result, six Sourcing categories, four Contact mappings, main count, metadata, events, screenshots, overflow, keyboard focus, images, console errors, and homepage/Header/Footer regression.
- [ ] Run the final gate:

```bash
npm run test:inquiry && npm run test:lead && npm run test:blog && npm run test:homepage && npm run build && git diff --check
```

- [ ] Start local dev and inspect `/sourcing` and `/contact` at 1440×1000 and 390×844. Confirm one root `<main>`, no horizontal overflow, all ten buttons, visible focus, fallback status, no broken images, and no console errors. Do not submit a real form.
- [ ] Commit checklist: `docs: add sourcing and contact preview checklist`.
- [ ] Confirm clean branch and push `codex/sourcing-contact-conversion` to GitHub.
- [ ] Wait for Git-triggered Vercel Preview; verify metadata and rendered pages. A real form submission requires action-time approval.
- [ ] Return Preview URL, modified files, test results, screenshots, event evidence, and blockers. Stop for user approval; do not merge `main`.
