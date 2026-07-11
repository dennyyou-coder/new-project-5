# Market Reports Email Acquisition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a free-report email acquisition funnel at `/reports`.

**Architecture:** Keep the existing Reports page and shared Tally transport. Add a focused reports acquisition form contract, migrate the approved report content and assets, and protect the funnel with source-level conversion tests.

**Tech Stack:** Next.js 15, React, TypeScript, CSS, Node test runner, Tally.

## Global Constraints

- Preserve the existing multi-report selection and qualification form structure.
- No pricing, purchase, or paid-report language.
- Do not modify the homepage or unrelated pages.
- Do not deploy directly with `vercel --prod`.

---

### Task 1: Protect the lead-magnet contract

**Files:**
- Create: `tests/reportsAcquisition.test.mjs`
- Test: `app/reports/page.tsx`, `components/LeadForms.tsx`, `public/reports/wcb-cleaning-industry-growth-map-english-report.pdf`

- [x] Write tests for the report title, one free-report CTA family, preserved report-selection flow, PDF path, update consent copy, and prohibited sales words.
- [x] Run `node --test tests/reportsAcquisition.test.mjs` and confirm it fails for missing behavior.

### Task 2: Implement the report acquisition page

**Files:**
- Modify: `app/reports/page.tsx`
- Modify: `components/LeadForms.tsx`
- Modify: `app/globals.css`
- Create: `public/images/reports/wcb-cleaning-industry-growth-map-cover.png`
- Create: `public/reports/wcb-cleaning-industry-growth-map-english-report.pdf`

- [x] Migrate the approved report content and cover into the latest `main` baseline.
- [x] Preserve the existing Tally report-selection form and attribution transport.
- [x] Keep one visual hierarchy centered on free access, report proof, and email capture.
- [x] Run the focused test and confirm it passes.

### Task 3: Verify and publish Preview

**Files:**
- Test: `tests/reportsAcquisition.test.mjs`
- Test: existing test suites

- [x] Run all project tests, `npm run build`, and `git diff --check`.
- [x] Check desktop and 390px mobile rendering.
- [x] Confirm the form opens without sending test personal data.
- [ ] Commit, push the feature branch, wait for Vercel Preview Ready, and provide the unique Preview URL.
