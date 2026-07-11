# World Clean Biz Trust Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four restrained, English-language trust and conversion-closure pages, expose the appropriate trust links in the footer, and preserve the existing visual and analytics architecture.

**Architecture:** Implement four static Next.js App Router server pages with route-specific metadata. Reuse the existing Header/Footer layout, Link component, TallyButton attribution API, and a new scoped `.trust-page-*` CSS family so existing pages remain unaffected.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Node test runner, existing global CSS.

## Global Constraints

- Website copy remains English; design and handoff documentation remain Chinese.
- Do not claim universal certification, guaranteed quality, or unverified company, address, customer, investor, or certification details.
- Do not modify primary navigation, article content, Analytics event names, or GA4 settings.
- Do not add images or dependencies.
- `/inquiry-received` is noindex and does not itself emit `form_success`.
- Production publication must follow branch → tests/build → GitHub → Vercel Preview → user confirmation → merge main; never use `vercel --prod`.

---

### Task 1: Lock the four-route and footer contract with a failing test

**Files:**
- Create: `tests/trustPages.test.mjs`
- Test: `tests/trustPages.test.mjs`

**Interfaces:**
- Consumes: static source files under `app/` and `components/Footer.tsx`.
- Produces: a source-level regression contract for routes, metadata, required copy, and navigation.

- [ ] **Step 1: Write the failing test**

Create a Node test that reads the four future pages and Footer. It must assert:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const [received, privacy, terms, quality, footer] = await Promise.all([
  read("app/inquiry-received/page.tsx"),
  read("app/privacy/page.tsx"),
  read("app/terms/page.tsx"),
  read("app/quality-compliance/page.tsx"),
  read("components/Footer.tsx")
]);

test("inquiry received page closes the loop without claiming a submission", () => {
  assert.match(received, /Your Inquiry Is In The Right Place/);
  assert.match(received, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/s);
  assert.match(received, /Review/);
  assert.match(received, /Route/);
  assert.match(received, /Respond/);
  assert.doesNotMatch(received, /form_success/);
});

test("privacy policy explains actual data handling and contact path", () => {
  assert.match(privacy, /Privacy Policy/);
  assert.match(privacy, /Google Analytics/);
  assert.match(privacy, /Tally/);
  assert.match(privacy, /do not sell your personal information/i);
  assert.match(privacy, /href="\/contact"/);
});

test("terms define content and commercial boundaries", () => {
  assert.match(terms, /Terms of Use/);
  assert.match(terms, /not investment, legal, tax, certification/i);
  assert.match(terms, /confirmed in writing/i);
  assert.match(terms, /href="\/contact"/);
});

test("quality page explains the five-stage responsibility model", () => {
  for (const stage of ["Define", "Evaluate", "Confirm", "Monitor", "Document"]) {
    assert.match(quality, new RegExp(stage));
  }
  assert.match(quality, /Quality Starts With Clear Requirements/);
  assert.match(quality, /Buyer Responsibility/);
  assert.match(quality, /ctaLocation="quality_compliance_cta"/);
  assert.match(quality, /href="\/sourcing"|form="sourcing"/);
});

test("footer exposes trust pages but not the process-only success route", () => {
  assert.match(footer, />Trust</);
  assert.match(footer, /href="\/quality-compliance"/);
  assert.match(footer, /href="\/privacy"/);
  assert.match(footer, /href="\/terms"/);
  assert.doesNotMatch(footer, /inquiry-received/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --test tests/trustPages.test.mjs
```

Expected: FAIL with `ENOENT` for `app/inquiry-received/page.tsx`.

- [ ] **Step 3: Commit the red contract**

```bash
git add tests/trustPages.test.mjs
git commit -m "test: define trust page contract"
```

---

### Task 2: Add Inquiry Received and legal information pages

**Files:**
- Create: `app/inquiry-received/page.tsx`
- Create: `app/privacy/page.tsx`
- Create: `app/terms/page.tsx`
- Test: `tests/trustPages.test.mjs`

**Interfaces:**
- Consumes: `next/link`, Next.js `Metadata`, global Header/Footer layout.
- Produces: `/inquiry-received`, `/privacy`, and `/terms` static routes.

- [ ] **Step 1: Implement `/inquiry-received`**

Export metadata with title `Inquiry Received | World Clean Biz`, canonical `/inquiry-received`, and `robots: { index: false, follow: true }`. Render:

- eyebrow `INQUIRY RECEIVED`
- H1 `Your Inquiry Is In The Right Place.`
- conditional wording beginning `If you have just completed a World Clean Biz form...`
- the exact stages `01 Review`, `02 Route`, `03 Respond`
- response expectation without a guarantee
- links to `/sourcing`, `/world-clean-expo`, `/reports`, and `/`

- [ ] **Step 2: Implement `/privacy`**

Export title `Privacy Policy | World Clean Biz`, canonical `/privacy`, and description. Render a shared legal-page structure with effective date `July 12, 2026` and these exact section headings:

1. `Information You Provide`
2. `Information Collected Through The Website`
3. `How We Use Information`
4. `Service Providers And International Processing`
5. `How We Share Information`
6. `Retention And Security`
7. `Your Choices And Requests`
8. `Business Audience And Children`
9. `Policy Updates`
10. `Contact`

Name Google Analytics and Tally accurately, state `World Clean Biz does not sell your personal information`, and link to `/contact`.

- [ ] **Step 3: Implement `/terms`**

Export title `Terms of Use | World Clean Biz`, canonical `/terms`, and description. Render effective date `July 12, 2026` and these exact section headings:

1. `Using This Website`
2. `Industry Content And Estimates`
3. `No Professional Advice`
4. `Sourcing, Reports And Expo Opportunities`
5. `Intellectual Property`
6. `Acceptable Use`
7. `Third-Party Services And Links`
8. `Availability And Disclaimer`
9. `Limitation Of Responsibility`
10. `Changes And Contact`

Include the phrase `not investment, legal, tax, certification or other professional advice` and state that commercial terms are `confirmed in writing for the specific project`.

- [ ] **Step 4: Run the focused test**

```bash
node --test tests/trustPages.test.mjs
```

Expected: the quality/footer assertions still fail; all assertions for the three implemented routes pass.

- [ ] **Step 5: Commit the three routes**

```bash
git add app/inquiry-received/page.tsx app/privacy/page.tsx app/terms/page.tsx
git commit -m "feat: add inquiry and legal pages"
```

---

### Task 3: Add Quality & Compliance and trust navigation

**Files:**
- Create: `app/quality-compliance/page.tsx`
- Modify: `components/Footer.tsx`
- Test: `tests/trustPages.test.mjs`

**Interfaces:**
- Consumes: `TallyButton` with `form="sourcing"`, `ctaLocation`, `inquiryIntent`, `inquiryType`, and `trackClick`.
- Produces: `/quality-compliance` route and `Trust` footer group.

- [ ] **Step 1: Implement `/quality-compliance`**

Export title `Quality & Compliance | Cleaning Product Sourcing`, canonical `/quality-compliance`, and a B2B description. Use static arrays for the five stages and four responsibility groups. Render:

- eyebrow `QUALITY & COMPLIANCE`
- H1 `Quality Starts With Clear Requirements.`
- five cards titled `Define`, `Evaluate`, `Confirm`, `Monitor`, `Document`
- section `Clear Roles Create Better Outcomes.`
- groups `World Clean Biz Coordination`, `Supplier Responsibility`, `Testing Partner Responsibility`, and `Buyer Responsibility`
- boundary statement that requirements vary by product, use case, and target market
- `TallyButton` configured as:

```tsx
<TallyButton
  className="button"
  ctaLocation="quality_compliance_cta"
  form="sourcing"
  inquiryIntent="quality_compliance"
  inquiryType="sourcing"
  trackClick
>
  Discuss Quality Requirements
</TallyButton>
```

- [ ] **Step 2: Add the footer Trust group**

Add after the existing Connect group:

```tsx
<div>
  <strong>Trust</strong>
  <Link href="/quality-compliance">Quality &amp; Compliance</Link>
  <Link href="/privacy">Privacy Policy</Link>
  <Link href="/terms">Terms of Use</Link>
</div>
```

- [ ] **Step 3: Run the focused test and verify GREEN for content**

```bash
node --test tests/trustPages.test.mjs
```

Expected: PASS.

- [ ] **Step 4: Commit the quality route and navigation**

```bash
git add app/quality-compliance/page.tsx components/Footer.tsx
git commit -m "feat: add quality and compliance guidance"
```

---

### Task 4: Add scoped responsive presentation

**Files:**
- Modify: `app/globals.css`
- Test: `tests/trustPages.test.mjs`

**Interfaces:**
- Consumes: `.trust-page`, `.trust-hero`, `.trust-content`, `.trust-card-grid`, `.trust-process-grid`, `.trust-next-grid`, `.trust-responsibility-grid`, and `.trust-cta` classes emitted by Tasks 2-3.
- Produces: responsive page and three-column footer presentation without affecting existing page selectors.

- [ ] **Step 1: Extend the failing test with CSS scope assertions**

Read `app/globals.css` and assert it contains `.trust-page`, `.trust-process-grid`, `.trust-content`, and a mobile media-query rule. Run the test and confirm it fails because these selectors are missing.

- [ ] **Step 2: Implement the scoped CSS**

Add styles that:

- use the existing navy, blue, white, border, and background tokens already present in `globals.css`
- keep legal copy at a readable maximum width of approximately 800px
- make process/next-step grids three columns and responsibility grid two columns on desktop
- collapse all new grids to one column below the existing mobile breakpoint
- align headings, cards, and CTA edges consistently
- update `.footer-links` to support three content columns while preserving its existing mobile collapse

- [ ] **Step 3: Run focused content/style tests**

```bash
node --test tests/trustPages.test.mjs
```

Expected: PASS.

- [ ] **Step 4: Commit the styling**

```bash
git add app/globals.css tests/trustPages.test.mjs
git commit -m "style: present trust pages responsively"
```

---

### Task 5: Verify production readiness and publish Preview

**Files:**
- No additional source files expected.

**Interfaces:**
- Consumes: completed four routes and footer navigation.
- Produces: verified GitHub branch and Vercel Preview URL.

- [ ] **Step 1: Run every Node test file**

```bash
for file in tests/*.test.mjs; do node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test "$file" || exit 1; done
```

Expected: all tests pass.

- [ ] **Step 2: Check patch integrity**

```bash
git diff --check
```

Expected: no output and exit 0.

- [ ] **Step 3: Run a production build**

```bash
npm run build
```

Expected: build exits 0 and lists the four new static routes.

- [ ] **Step 4: Inspect desktop and mobile rendering**

Start the local production server and verify all four routes plus the footer at desktop and mobile widths. Confirm no horizontal overflow, no clipped headings, consistent alignment, working internal links, and no console errors.

- [ ] **Step 5: Push the feature branch**

```bash
git push -u origin codex/trust-pages
```

Expected: push succeeds.

- [ ] **Step 6: Verify Vercel Preview**

Wait for the GitHub-triggered Preview to become Ready. Check `/inquiry-received`, `/privacy`, `/terms`, and `/quality-compliance` on the Preview URL at desktop and mobile widths. Do not merge `main` and do not run `vercel --prod` until the user explicitly approves publication.
