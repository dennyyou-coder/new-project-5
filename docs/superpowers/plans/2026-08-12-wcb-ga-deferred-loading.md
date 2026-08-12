# WCB Deferred GA4 Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep WCB page-view and lead-event measurement reliable while moving the 170 KB GA4 library out of the mobile homepage critical loading path.

**Architecture:** A small inline bootstrap keeps the existing production-host, automation, and internal-browser policy, creates `dataLayer`/`gtag` immediately, and queues the initial `js` and `config` commands. The external GA library is injected exactly once after first interaction, when the page becomes hidden, or after a bounded 3,500 ms fallback; timers and listeners are removed when any trigger wins. Vercel Analytics and page prefetch behavior remain unchanged so the measured change isolates GA4.

**Tech Stack:** Next.js 15 App Router, React 19, `next/script`, GA4 `gtag.js`, Node test runner, Lighthouse 13.4.1.

## Global Constraints

- Preserve measurement ID `G-6RW65B9CD0`, production-host filtering, internal-browser exclusion, automation exclusion, URL cleanup, and idempotency.
- Queue the initial page view and early lead events before downloading `gtag.js`.
- Load `gtag.js` once on `pointerdown`, `keydown`, `touchstart`, hidden-page transition, or the 3,500 ms maximum delay.
- Do not change Vercel Analytics, homepage content, CSS, images, SEO, forms, routing, dependencies, or Vercel/GitHub configuration.
- Use the normal GitHub PR -> Vercel Preview -> approved main merge production path; never use `vercel --prod`.
- Require a three-run public mobile median of at least 80, desktop at least 95, CLS 0, and no GA page-view/lead-event regression before production completion.

---

### Task 1: Lock the deferred GA runtime contract

**Files:**
- Modify: `tests/googleAnalytics.test.mjs`
- Modify: `lib/googleAnalytics.ts`

**Interfaces:**
- Consumes: existing `getGoogleAnalyticsBootstrapScript()`, production/internal/automation policy, and `GOOGLE_ANALYTICS_SCRIPT_ID`.
- Produces: generated bootstrap behavior that queues GA commands immediately and injects one external library script only after an approved trigger.

- [x] **Step 1: Add a real generated-script fixture**

Execute the string returned by `getGoogleAnalyticsBootstrapScript()` in a controlled `node:vm` context with real arrays, event listeners, timers, visibility state, history, storage, and DOM script insertion. The fixture must expose pending timer/idle callbacks and dispatched window/document events without mocking the bootstrap itself.

- [x] **Step 2: Write failing behavior tests**

Add separate tests proving that an allowed production visit:

```js
assert.deepEqual(runtime.dataLayerCommands.slice(0, 2).map(([command]) => command), ["js", "config"]);
assert.equal(runtime.appendedScripts.length, 0);

runtime.dispatchWindow("pointerdown");
assert.equal(runtime.appendedScripts.length, 1);
assert.match(runtime.appendedScripts[0].src, /G-6RW65B9CD0/);
```

Also prove timeout, hidden-page and keyboard triggers; trigger races still append once; excluded visits append nothing; and a queued early lead event remains ordered before library injection.

- [x] **Step 3: Run RED**

Run:

```bash
node --test tests/googleAnalytics.test.mjs
```

Expected: the new tests fail because the current `next/script` library request is not controlled by the bootstrap and no deferred trigger contract exists.

- [x] **Step 4: Implement the minimal bootstrap scheduler**

Extend `getGoogleAnalyticsBootstrapScript()` so an allowed visit:

```js
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
window.gtag("js", new Date());
window.gtag("config", measurementId);
```

Then define an idempotent loader that creates one async script with a distinct library ID and the GA URL, removes all listeners, cancels the timer handle, and is called by first interaction, `document.visibilityState === "hidden"`, or the 3,500 ms fallback. Use passive, once-capable interaction listeners and preserve every existing exclusion branch.

- [x] **Step 5: Run GREEN**

Run:

```bash
node --test tests/googleAnalytics.test.mjs tests/leadTracking.test.mjs
```

Expected: all GA policy, queue, trigger, idempotency, and lead-event tests pass.

- [ ] **Step 6: Commit**

Commit the runtime and tests as `Defer GA4 library loading`.

---

### Task 2: Remove the eager GA library consumer

**Files:**
- Modify: `components/GoogleAnalytics.tsx`
- Modify: `tests/googleAnalytics.test.mjs`

**Interfaces:**
- Consumes: the complete inline string from `getGoogleAnalyticsBootstrapScript()`.
- Produces: one small `afterInteractive` bootstrap Script and no external `src` Script in the initial Next.js script graph.

- [x] **Step 1: Add a failing component integration assertion**

Import/render or otherwise inspect the actual component boundary so the test fails if it produces an eager/`afterInteractive` external GA `src`. Keep the assertion behavioral: the component output must contain the bootstrap but no external library element.

- [x] **Step 2: Run RED**

Run `node --test tests/googleAnalytics.test.mjs` and confirm the current two-Script component fails the new contract.

- [x] **Step 3: Make the smallest component change**

Return only:

```tsx
<Script id={GOOGLE_ANALYTICS_SCRIPT_ID} strategy="afterInteractive">
  {getGoogleAnalyticsBootstrapScript()}
</Script>
```

The bootstrap remains reliable and independently inserts the external script after an approved trigger.

- [x] **Step 4: Run focused GREEN**

Run:

```bash
node --test tests/googleAnalytics.test.mjs tests/leadTracking.test.mjs
```

Expected: every focused test passes.

- [ ] **Step 5: Commit**

Commit the component integration as `Load GA4 after the critical render`.

---

### Task 3: Verify the production story and prepare Preview

**Files:**
- Create: `docs/operations/wcb-ga-deferred-loading-report.md`

**Interfaces:**
- Consumes: final implementation tree and existing WCB release gates.
- Produces: reproducible GA reliability, build, browser, and Lighthouse evidence for the PR and production decision.

- [ ] **Step 1: Refresh and integrate `origin/main`**

Fetch the latest main, integrate any new commits without overwriting unrelated work, and rerun focused tests if the base changes.

- [ ] **Step 2: Run final automated verification once**

Run the complete Node suite and one production build. Confirm prebuild and postbuild gates pass and tracked generated files do not change.

- [ ] **Step 3: Verify the production-mode browser contract**

At desktop and 390 px, confirm `/`, `/sourcing`, one lead CTA path, and one article return 200, retain one H1/main/canonical, have no overflow or CLS, and expose an immediate `window.gtag` queue while the external GA script remains absent before triggers and appears once after interaction/timeout.

- [ ] **Step 4: Run Lighthouse and record evidence**

Run three comparable mobile and desktop audits. Record score, FCP, LCP, TBT, CLS, total bytes, image bytes, GA request timing, and the difference from production commit `0f59c54`.

- [ ] **Step 5: Write the operational report**

Document RED/GREEN evidence, GA queue/order checks, test/build/browser results, Lighthouse medians, remaining data-loss risk, and the release boundary.

- [ ] **Step 6: Push and create one GitHub PR**

Push the isolated branch, create a PR to `main`, wait for the Git-triggered Vercel Preview to become READY, and verify the Preview deployment commit and target routes.

- [ ] **Step 7: Request one production approval**

Present the Preview URL, commit, GA reliability evidence, and performance results. After approval, merge to `main`, wait for Git-triggered production, confirm deployed commit/runtime health, and run the final public three-run Lighthouse comparison.
