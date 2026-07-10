# WCB GA4 Local Debug Design

Date: 2026-07-11
Status: Approved direction; implementation pending

## Objective

Make WCB form events visible in GA4 DebugView during local QA while leaving production analytics behavior unchanged.

The verification target is the shared lead event sequence:

- `form_open`
- `form_submit`
- `form_success`

## Scope

Included:

- Add a small, testable helper that identifies local browser hosts.
- Pass GA4 `debug_mode` only when the site runs on `localhost`, `127.0.0.1` or `::1`.
- Submit one Contact QA record through the actual local-site Tally popup.
- Confirm all three events in the World Clean Biz GA4 DebugView.
- Record the result in the lead operations document.

Excluded:

- Production deployment.
- Changes to form content, Airtable mappings, navigation or page design.
- Enabling debug mode for production visitors.
- Re-testing all six forms, because they share the same event component and their Airtable mappings were already verified separately.

## Considered approaches

### 1. Local-host conditional in the Analytics integration — selected

Add a deterministic local-host check and configure GA4 debug mode only for local preview traffic.

Advantages:

- Verifies the real website, Tally popup callbacks and GA4 integration together.
- Reusable for future local QA.
- No production analytics impact.

Trade-off:

- Requires a small shared Analytics code change and regression tests.

### 2. Install a browser analytics debugger extension

Advantages:

- No repository change.

Trade-offs:

- Adds third-party browser software and permissions.
- Depends on one browser profile and is less reproducible.

### 3. Send synthetic events directly to GA4

Advantages:

- Fast to make DebugView display events.

Trade-offs:

- Does not prove the website button, Tally callbacks or shared tracking component work.
- Therefore it does not satisfy the end-to-end objective.

## Design

Create a pure local-host predicate in the analytics tracking module. The Google Analytics setup reads the current hostname in the browser and sets `debug_mode` from that predicate. Production hosts return `false`; local development hosts return `true`.

The form event flow remains unchanged:

1. A user opens the Contact Tally popup and the site emits `form_open`.
2. Tally accepts the form and invokes its submit callback.
3. The site emits `form_submit` and then `form_success` with the same attribution context and response ID.
4. GA4 marks the local session as a debug device and displays the three events in DebugView.

## Testing

Automated tests will be written first for the local-host predicate:

- `localhost` returns true.
- `127.0.0.1` returns true.
- `::1` returns true.
- `worldcleanbiz.com` returns false.

After the failing test is observed, implement the minimum helper and connect it to GA4 configuration. Then run:

- Lead tracking tests.
- Production build.

The production build must still compile all pages successfully.

## End-to-end verification

Use one clearly labelled fake Contact QA record. The test will include a QA-only email address and notes indicating that no follow-up is required.

Success requires:

- Tally reaches its success state.
- Airtable receives the Contact QA record.
- GA4 DebugView shows `form_open`, `form_submit` and `form_success` from the local debug device.
- Event details identify `form_type = contact` and the expected CTA location.

## Risk controls

- Debug mode is restricted to local hosts.
- No production deployment is included.
- No real customer details are used.
- Only one additional QA record is created.
- The Airtable token is not displayed or committed.
