# WCB GA4 Local Debug Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make local WCB form events appear in GA4 DebugView without enabling debug mode for production visitors.

**Architecture:** Extend the existing lead tracking module with a pure local-host predicate and an exported host allowlist. The Google Analytics inline configuration reuses that allowlist to set `debug_mode` from `window.location.hostname`, while the existing Tally callback event flow remains unchanged.

**Tech Stack:** Next.js 15, React, TypeScript, Node test runner, Tally popup SDK, Google Analytics 4.

## Global Constraints

- Debug mode is enabled only for `localhost`, `127.0.0.1` and `::1`.
- Production deployment is excluded.
- Form content, Airtable mappings, navigation and page design must not change.
- Use one fake Contact QA record and no real customer data.
- Never display or commit the Airtable token.

---

### Task 1: Add the local GA4 debug contract

**Files:**
- Modify: `tests/leadTracking.test.mjs`
- Modify: `lib/leadTracking.ts`
- Modify: `components/GoogleAnalytics.tsx`

**Interfaces:**
- Consumes: `window.location.hostname` inside the existing Google Analytics inline setup.
- Produces: `LOCAL_ANALYTICS_DEBUG_HOSTS: readonly string[]` and `isLocalAnalyticsDebugHost(hostname: string): boolean`.

- [ ] **Step 1: Write the failing test**

Change the test import to a namespace import and add this test:

```js
import * as leadTracking from "../lib/leadTracking.ts";

test("GA4 debug mode is limited to local hosts", () => {
  assert.equal(typeof leadTracking.isLocalAnalyticsDebugHost, "function");
  assert.equal(leadTracking.isLocalAnalyticsDebugHost("localhost"), true);
  assert.equal(leadTracking.isLocalAnalyticsDebugHost("127.0.0.1"), true);
  assert.equal(leadTracking.isLocalAnalyticsDebugHost("::1"), true);
  assert.equal(
    leadTracking.isLocalAnalyticsDebugHost("worldcleanbiz.com"),
    false
  );
});
```

Keep the existing tests working by destructuring their imported functions from `leadTracking`.

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test:lead
```

Expected: one assertion failure because `isLocalAnalyticsDebugHost` is undefined.

- [ ] **Step 3: Implement the minimal local-host predicate**

Add to `lib/leadTracking.ts`:

```ts
export const LOCAL_ANALYTICS_DEBUG_HOSTS = [
  "localhost",
  "127.0.0.1",
  "::1"
] as const;

export function isLocalAnalyticsDebugHost(hostname: string): boolean {
  return LOCAL_ANALYTICS_DEBUG_HOSTS.some((host) => host === hostname);
}
```

- [ ] **Step 4: Connect the allowlist to GA4 configuration**

In `components/GoogleAnalytics.tsx`, import the allowlist, serialize it once, and change the configuration call to:

```tsx
import { LOCAL_ANALYTICS_DEBUG_HOSTS } from "@/lib/leadTracking";

const LOCAL_DEBUG_HOSTS = JSON.stringify(LOCAL_ANALYTICS_DEBUG_HOSTS);

gtag('config', '${GA_MEASUREMENT_ID}', {
  debug_mode: ${LOCAL_DEBUG_HOSTS}.includes(window.location.hostname)
});
```

This evaluates to `false` on `worldcleanbiz.com` and does not alter the existing event parameters.

- [ ] **Step 5: Run automated verification**

Run:

```bash
npm run test:lead
npm run build
```

Expected: all lead tracking tests pass and the production build exits with code 0 after generating 192 pages.

- [ ] **Step 6: Commit the implementation**

```bash
git add tests/leadTracking.test.mjs lib/leadTracking.ts components/GoogleAnalytics.tsx
git commit -m "feat: enable GA4 debug mode for local QA"
```

### Task 2: Verify the live Contact event sequence

**Files:**
- Modify: `docs/operations/wcb-lead-field-map.md`

**Interfaces:**
- Consumes: the local Contact CTA, Tally popup callbacks and World Clean Biz GA4 property `G-6RW65B9CD0`.
- Produces: a dated operational verification record for `form_open`, `form_submit` and `form_success`.

- [ ] **Step 1: Start the local site and open DebugView**

Run `npm run dev`, open a Contact page URL containing QA attribution parameters, and keep GA4 DebugView open for property World Clean Biz.

Use this local URL:

```text
http://localhost:3000/contact?utm_source=codex&utm_medium=qa&utm_campaign=ga4_debug_validation&utm_content=contact&utm_term=qa3
```

Expected: DebugView displays one local debug device after the page loads and the CTA is opened.

- [ ] **Step 2: Submit one fake Contact QA record**

Use:

```text
Name: WCB GA4 QA Test
Email: wcb.qa3+contact@example.com
Company: World Clean Biz QA
Country: China
Inquiry: GA4 local DebugView verification. No follow-up required.
```

Expected: the Tally popup reaches its success state and Airtable creates one Contact lead.

- [ ] **Step 3: Verify the GA4 events and parameters**

In DebugView, confirm all three event names:

```text
form_open
form_submit
form_success
```

Open event details and confirm:

```text
form_type = contact
source_page = /contact
cta_location = contact_hero
utm_source = codex
utm_medium = qa
utm_campaign = ga4_debug_validation
utm_content = contact
utm_term = qa3
```

- [ ] **Step 4: Update the operations record**

Replace the pending GA4 verification note in `docs/operations/wcb-lead-field-map.md` with the verified event sequence, form type, CTA location, local preview URL and verification date `2026-07-11`.

- [ ] **Step 5: Run final checks and commit**

Run:

```bash
git diff --check
npm run test:lead
npm run build
```

Expected: no whitespace errors, all tests pass, and the build exits with code 0.

Commit:

```bash
git add docs/operations/wcb-lead-field-map.md
git commit -m "docs: record GA4 lead event verification"
```
