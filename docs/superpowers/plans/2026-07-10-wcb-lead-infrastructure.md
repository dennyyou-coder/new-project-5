# WCB Lead Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first release batch for World Clean Biz: separated lead forms, source attribution, Tally fallback and status handling, Airtable routing, and GA4 conversion events without changing the approved homepage or other page layouts.

**Architecture:** Keep Tally as the form UI and Airtable as the lead store. Add a typed lead contract and analytics helper in `lib/`, extend the existing Tally registry, and make the shared `TallyButton` pass hidden attribution fields and emit consistent events. External Tally and Airtable configuration is completed before switching Newsletter or WCE buttons to new form keys.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tally popup embed, Airtable native Tally integration, GA4 `gtag.js`, Node.js built-in test runner.

## Global Constraints

- Preserve the current navigation names, order, and URLs: `Home | Blog | Sourcing | Market Reports | World Clean Expo | About | Contact`.
- Do not remove the header `Get Free Reports` CTA in this batch; removal belongs to the second batch after page-specific CTAs are ready.
- Do not change article bodies, article titles, slugs, approved SEO content, homepage layout, or page metadata in this batch.
- Use the existing Tally forms for `contact`, `sourcing`, `reports`, and WCE visitor updates; create only the missing Newsletter and WCE exhibitor/partner forms.
- Never commit `.env.local`, Tally credentials, Airtable credentials, GA4 credentials, personal data, or test submissions.
- Keep `.superpowers/`, current report assets, and all unrelated working-tree changes out of every task commit.
- Before Task 1, resolve the current uncommitted overlap in `components/LeadForms.tsx`, `app/reports/page.tsx`, and `app/globals.css`: either commit those owner changes separately or explicitly include their current versions as the implementation baseline.
- Before Task 5 changes Tally, Airtable, or GA4, present the exact external mutations and obtain action-time approval; form preview and read-only inspection do not authorize publishing or remapping data.
- Use `form_success` as the GA4 key event. `form_submit` means Tally accepted the submission callback; `form_success` means the website displayed the success state.
- Run lead unit tests with Node.js 22.6.0 or newer so the built-in type-stripping loader can import `lib/leadTracking.ts` without adding a test dependency.
- Every task must pass its focused test plus `npm run build` before its commit when it changes production code.

## File Map

- Create `lib/leadTracking.ts`: lead types, attribution extraction, hidden-field serialization, fallback URL construction, and GA4 event dispatch.
- Modify `lib/tallyForms.ts`: typed form registry for existing and new lead intents.
- Modify `components/LeadForms.tsx`: Tally popup callbacks, attribution, error/fallback behavior, and accessible status feedback.
- Modify `components/HomeUpdatesForm.tsx`: route the existing home subscription CTA to Newsletter after the external form exists.
- Modify `components/Header.tsx`, `components/Footer.tsx`, `components/ContactForm.tsx`, `app/page.tsx`, `app/about/page.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/reports/page.tsx`, `app/sourcing/page.tsx`, and `app/world-clean-expo/page.tsx`: give every existing CTA a stable `ctaLocation` value without changing layout or copy.
- Modify `components/GoogleAnalytics.tsx`: expose a typed `window.gtag` contract compatible with `leadTracking.ts`.
- Create `tests/leadTracking.test.mjs`: Node built-in tests for attribution and fallback URLs.
- Modify `package.json`: add the no-dependency lead test command.
- Create `.env.example`: document the two public Tally form IDs needed by new form keys.
- Create `docs/operations/wcb-lead-field-map.md`: exact Tally-to-Airtable field map and verification record.

---

### Task 1: Protect the working baseline and add the lead contract

**Files:**
- Create: `lib/leadTracking.ts`
- Create: `tests/leadTracking.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: browser pathname, search parameters, CTA location, form type, and optional report ID.
- Produces: `LeadFormType`, `LeadEventName`, `LeadAttribution`, `createLeadAttribution()`, `buildTallyUrl()`, and `trackLeadEvent()`.

- [ ] **Step 1: Record the owner-change baseline**

Run:

```bash
git status --short
git diff -- components/LeadForms.tsx app/reports/page.tsx app/globals.css
```

Expected: the three known modified files are visible. Stop if another process changes them while this task is running. Do not stage or alter them in Task 1.

- [ ] **Step 2: Add the failing attribution tests**

Create `tests/leadTracking.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  LEAD_FORM_TYPES,
  buildTallyUrl,
  createLeadAttribution,
  trackLeadEvent
} from "../lib/leadTracking.ts";

test("lead form types remain stable", () => {
  assert.deepEqual(LEAD_FORM_TYPES, [
    "contact",
    "sourcing",
    "reports",
    "newsletter",
    "wce_exhibitor",
    "wce_visitor"
  ]);
});

test("createLeadAttribution keeps source and UTM context", () => {
  assert.deepEqual(
    createLeadAttribution({
      formType: "sourcing",
      sourcePage: "/blog/example",
      ctaLocation: "article_footer_sourcing",
      language: "en",
      search: "?utm_source=linkedin&utm_medium=social&utm_campaign=q3"
    }),
    {
      form_type: "sourcing",
      source_page: "/blog/example",
      cta_location: "article_footer_sourcing",
      language: "en",
      utm_source: "linkedin",
      utm_medium: "social",
      utm_campaign: "q3",
      utm_content: "",
      utm_term: "",
      report_id: ""
    }
  );
});

test("buildTallyUrl serializes hidden fields", () => {
  const url = buildTallyUrl("https://tally.so/r/abc123", {
    form_type: "newsletter",
    source_page: "/",
    cta_location: "home_newsletter",
    language: "en",
    utm_source: "email",
    utm_medium: "newsletter",
    utm_campaign: "launch",
    utm_content: "",
    utm_term: "",
    report_id: ""
  });

  assert.equal(
    url,
    "https://tally.so/r/abc123?form_type=newsletter&source_page=%2F&cta_location=home_newsletter&language=en&utm_source=email&utm_medium=newsletter&utm_campaign=launch&utm_content=&utm_term=&report_id="
  );
});

test("trackLeadEvent is safe during server rendering", () => {
  assert.equal(
    trackLeadEvent("form_open", {
      form_type: "contact",
      source_page: "/contact",
      cta_location: "contact_general",
      language: "en"
    }),
    false
  );
});
```

- [ ] **Step 3: Add the test command and verify the tests fail**

Add to `package.json` scripts:

```json
"test:lead": "node --experimental-strip-types --test tests/leadTracking.test.mjs"
```

Run:

```bash
npm run test:lead
```

Expected: FAIL because `lib/leadTracking.ts` does not exist.

- [ ] **Step 4: Implement the lead contract**

Create `lib/leadTracking.ts`:

```ts
export const LEAD_FORM_TYPES = [
  "contact",
  "sourcing",
  "reports",
  "newsletter",
  "wce_exhibitor",
  "wce_visitor"
] as const;

export type LeadFormType = (typeof LEAD_FORM_TYPES)[number];

export type LeadEventName =
  | "form_open"
  | "form_submit"
  | "form_success"
  | "form_error";

export type LeadAttribution = {
  form_type: LeadFormType;
  source_page: string;
  cta_location: string;
  language: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  report_id: string;
};

type AttributionInput = {
  formType: LeadFormType;
  sourcePage: string;
  ctaLocation: string;
  language?: string;
  search?: string;
  reportId?: string;
};

type LeadEventParameters = Partial<LeadAttribution> & {
  form_type: LeadFormType;
  source_page: string;
  cta_location: string;
  language: string;
  response_id?: string;
  error_reason?: string;
  open_method?: "popup" | "fallback";
};

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: LeadEventName,
      parameters: LeadEventParameters
    ) => void;
  }
}

export function createLeadAttribution({
  formType,
  sourcePage,
  ctaLocation,
  language = "en",
  search = "",
  reportId = ""
}: AttributionInput): LeadAttribution {
  const params = new URLSearchParams(search);

  return {
    form_type: formType,
    source_page: sourcePage,
    cta_location: ctaLocation,
    language,
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    report_id: reportId
  };
}

export function buildTallyUrl(
  baseUrl: string,
  attribution: LeadAttribution
): string {
  const url = new URL(baseUrl);

  for (const [key, value] of Object.entries(attribution)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

export function trackLeadEvent(
  eventName: LeadEventName,
  parameters: LeadEventParameters
): boolean {
  if (typeof window === "undefined" || !window.gtag) return false;

  window.gtag("event", eventName, parameters);
  return true;
}
```

- [ ] **Step 5: Run focused tests and the production build**

Run:

```bash
npm run test:lead
npm run build
```

Expected: four tests PASS; Next.js build completes with exit code 0.

- [ ] **Step 6: Commit only Task 1 files**

```bash
git add lib/leadTracking.ts tests/leadTracking.test.mjs package.json
git commit -m "test: define WCB lead tracking contract"
```

---

### Task 2: Extend the Tally form registry without breaking existing pages

**Files:**
- Modify: `lib/tallyForms.ts`
- Create: `.env.example`

**Interfaces:**
- Consumes: `LeadFormType` from `lib/leadTracking.ts` and two public environment variables.
- Produces: `TALLY_FORMS`, `TallyFormKey`, and `getTallyForm()` for `TallyButton`.

- [ ] **Step 1: Verify the lead-type contract before changing the registry**

Run `npm run test:lead`.

Expected: four tests PASS, including the stable six-value `LEAD_FORM_TYPES` contract created in Task 1.

- [ ] **Step 2: Replace the registry with typed definitions**

Replace `lib/tallyForms.ts` with:

```ts
import {
  LEAD_FORM_TYPES,
  type LeadFormType
} from "@/lib/leadTracking";

export { LEAD_FORM_TYPES };

type TallyFormDefinition = {
  id: string;
  url: string;
  formType: LeadFormType;
};

function defineForm(id: string | undefined, formType: LeadFormType) {
  const normalizedId = id?.trim() || "";

  return {
    id: normalizedId,
    url: normalizedId ? `https://tally.so/r/${normalizedId}` : "",
    formType
  } satisfies TallyFormDefinition;
}

export const TALLY_FORMS = {
  contact: defineForm("MeV8L8", "contact"),
  sourcing: defineForm("1ARG4M", "sourcing"),
  reports: defineForm("ZjeGvz", "reports"),
  expo: defineForm("lbzVN6", "wce_visitor"),
  newsletter: defineForm(
    process.env.NEXT_PUBLIC_TALLY_NEWSLETTER_FORM_ID,
    "newsletter"
  ),
  wceExhibitor: defineForm(
    process.env.NEXT_PUBLIC_TALLY_WCE_EXHIBITOR_FORM_ID,
    "wce_exhibitor"
  ),
  wceVisitor: defineForm("lbzVN6", "wce_visitor")
} as const;

export type TallyFormKey = keyof typeof TALLY_FORMS;

export function getTallyForm(key: TallyFormKey): TallyFormDefinition {
  return TALLY_FORMS[key];
}
```

The `expo` key remains as a compatibility alias until the WCE page changes in batch two.

- [ ] **Step 3: Document the two new public IDs**

Create `.env.example`:

```dotenv
NEXT_PUBLIC_TALLY_NEWSLETTER_FORM_ID=
NEXT_PUBLIC_TALLY_WCE_EXHIBITOR_FORM_ID=
```

The values are generated by Tally during Task 5. Copy them into `.env.local` and the production hosting environment; never commit the values.

- [ ] **Step 4: Run focused tests and build**

Run:

```bash
npm run test:lead
npm run build
```

Expected: four tests PASS; build completes even when the two new environment values are absent because no live page uses them yet.

- [ ] **Step 5: Commit only Task 2 files**

```bash
git add lib/tallyForms.ts tests/leadTracking.test.mjs .env.example
git commit -m "feat: add typed WCB lead form registry"
```

---

### Task 3: Add attribution, GA4 events, fallback, and status feedback to TallyButton

**Files:**
- Modify: `components/LeadForms.tsx:1-74`
- Modify: `components/GoogleAnalytics.tsx:1-22`
- Modify: `tests/leadTracking.test.mjs`

**Interfaces:**
- Consumes: `getTallyForm()`, `createLeadAttribution()`, `buildTallyUrl()`, and `trackLeadEvent()`.
- Produces: `TallyButton` props `ctaLocation`, `reportId`, and existing `form`, `className`, `children`, `onOpen`.

- [ ] **Step 1: Add fallback URL coverage**

Add a test confirming existing query parameters are preserved:

```js
test("buildTallyUrl preserves existing parameters", () => {
  const url = buildTallyUrl("https://tally.so/r/abc123?transparentBackground=1", {
    form_type: "reports",
    source_page: "/reports",
    cta_location: "reports_hero",
    language: "en",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    report_id: "next-decade-cleaning-growth"
  });

  assert.match(url, /transparentBackground=1/);
  assert.match(url, /report_id=next-decade-cleaning-growth/);
});
```

Run `npm run test:lead` and confirm it passes before editing the component.

- [ ] **Step 2: Expand the Tally browser type and component state**

In `components/LeadForms.tsx`, use these imports:

```ts
import { ReactNode, useState } from "react";
import { getTallyForm, type TallyFormKey } from "@/lib/tallyForms";
import {
  buildTallyUrl,
  createLeadAttribution,
  trackLeadEvent,
  type LeadAttribution
} from "@/lib/leadTracking";
```

Replace the current Tally declaration with:

```ts
type TallySubmitPayload = {
  responseId?: string;
};

declare global {
  interface Window {
    Tally?: {
      openPopup: (
        formId: string,
        options?: {
          layout?: "modal";
          width?: number;
          hiddenFields?: LeadAttribution;
          onOpen?: () => void;
          onSubmit?: (payload: TallySubmitPayload) => void;
        }
      ) => void;
    };
  }
}
```

Add these props to `TallyButton`:

```ts
ctaLocation?: string;
reportId?: string;
```

Add component state:

```ts
const [status, setStatus] = useState<
  "idle" | "unavailable" | "fallback" | "success"
>("idle");
```

- [ ] **Step 3: Replace openTallyForm with attributed behavior**

Use this implementation inside `TallyButton`:

```ts
function openTallyForm() {
  const tallyForm = getTallyForm(form);
  const attribution = createLeadAttribution({
    formType: tallyForm.formType,
    sourcePage: window.location.pathname,
    ctaLocation: ctaLocation || "legacy_unmapped",
    language: document.documentElement.lang || "en",
    search: window.location.search,
    reportId
  });

  onOpen?.();

  if (!tallyForm.id || !tallyForm.url) {
    setStatus("unavailable");
    trackLeadEvent("form_error", {
      ...attribution,
      error_reason: "missing_form_configuration"
    });
    return;
  }

  if (window.Tally?.openPopup) {
    window.Tally.openPopup(tallyForm.id, {
      layout: "modal",
      width: popupWidth,
      hiddenFields: attribution,
      onOpen: () => {
        trackLeadEvent("form_open", {
          ...attribution,
          open_method: "popup"
        });
      },
      onSubmit: (payload) => {
        trackLeadEvent("form_submit", {
          ...attribution,
          response_id: payload.responseId
        });
        setStatus("success");
        trackLeadEvent("form_success", {
          ...attribution,
          response_id: payload.responseId
        });
      }
    });
    return;
  }

  const fallback = window.open(
    buildTallyUrl(tallyForm.url, attribution),
    "_blank",
    "noopener,noreferrer"
  );

  if (!fallback) {
    setStatus("unavailable");
    trackLeadEvent("form_error", {
      ...attribution,
      error_reason: "popup_blocked"
    });
    return;
  }

  setStatus("fallback");
  trackLeadEvent("form_open", {
    ...attribution,
    open_method: "fallback"
  });
}
```

- [ ] **Step 4: Render accessible feedback below the button**

Replace the current `TallyButton` return value with:

```tsx
<span className="lead-form-trigger">
  <button className={className} onClick={openTallyForm} type="button">
    {children}
  </button>
  <span aria-live="polite" className="lead-form-status" role="status">
    {status === "unavailable" &&
      "The form is temporarily unavailable. Please use the Contact page."}
    {status === "fallback" && "The form opened in a new tab."}
    {status === "success" &&
      "Thank you. Your information was received successfully."}
  </span>
</span>
```

The status is visible text, not a toast that disappears before assistive technology reads it.

- [ ] **Step 5: Keep the Google tag definition compatible**

Do not duplicate the `window.gtag` type in `components/GoogleAnalytics.tsx`. Keep its runtime script unchanged. Add a comment above the component:

```ts
// The typed window.gtag contract is declared in lib/leadTracking.ts.
```

- [ ] **Step 6: Keep legacy call sites buildable until Task 4**

Use this intermediate `TallyReportButton` signature and pass both values to `TallyButton`:

```tsx
export function TallyReportButton({
  className = "button",
  children = "Get Free Reports",
  ctaLocation,
  reportId,
  onOpen
}: {
  className?: string;
  children?: ReactNode;
  ctaLocation?: string;
  reportId?: string;
  onOpen?: () => void;
}) {
  return (
    <TallyButton
      className={className}
      ctaLocation={ctaLocation}
      form="reports"
      onOpen={onOpen}
      reportId={reportId}
    >
      {children}
    </TallyButton>
  );
}
```

During this intermediate task only, unmapped legacy buttons emit `cta_location=legacy_unmapped`. Task 4 removes that fallback after every call site has an exact value.

- [ ] **Step 7: Run checks**

Run:

```bash
npm run test:lead
npm run build
```

Expected: five tests PASS; build completes with exit code 0. Existing buttons remain operational and emit `legacy_unmapped` until Task 4.

- [ ] **Step 8: Commit Task 3**

```bash
git add components/LeadForms.tsx components/GoogleAnalytics.tsx tests/leadTracking.test.mjs
git commit -m "feat: add attributed Tally form events"
```

---

### Task 4: Label every existing CTA and separate Newsletter intent

**Files:**
- Modify: `components/Header.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/HomeUpdatesForm.tsx`
- Modify: `components/ContactForm.tsx`
- Modify: `components/LeadForms.tsx:76-120`
- Modify: `app/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/reports/page.tsx`
- Modify: `app/sourcing/page.tsx`
- Modify: `app/world-clean-expo/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: the temporary optional `TallyButton.ctaLocation` and `TallyReportButton.ctaLocation` contract from Task 3.
- Produces: required CTA location props, stable CTA location names, and a Newsletter route that no longer uses the reports form.

- [ ] **Step 1: Apply the exact CTA location map**

Use these values:

```text
Header report button: header_reports
Footer contact button: footer_contact
Home hero report: home_hero_reports
Home hero sourcing: home_hero_sourcing
Home report section: home_reports
Home newsletter: home_newsletter
About hero contact: about_hero_contact
About hero reports: about_hero_reports
About footer contact: about_footer_contact
About footer reports: about_footer_reports
Blog sidebar reports: blog_sidebar_reports
Blog newsletter: blog_newsletter
Article footer reports: article_footer_reports
Article footer contact: article_footer_contact
Reports hero: reports_hero
Reports inline: reports_inline
Sourcing hero: sourcing_hero
Sourcing middle: sourcing_middle
Sourcing footer: sourcing_footer
WCE hero visitor: wce_hero_visitor
WCE footer visitor: wce_footer_visitor
Contact selected route: contact_selected_route
```

Pass `reportId="next-decade-cleaning-growth"` to report CTAs that deliver the current featured report. Keep generic site-wide report CTAs without a report ID until their delivered asset is confirmed.

After updating all call sites, change `ctaLocation?: string` back to required `ctaLocation: string` in both `TallyButton` and `TallyReportButton`, and remove the `legacy_unmapped` fallback.

- [ ] **Step 2: Switch Newsletter components to the Newsletter form key**

Change `HomeUpdatesForm` to:

```tsx
import { TallyButton } from "@/components/LeadForms";

export function HomeUpdatesForm() {
  return (
    <div className="home-v4-email-form">
      <TallyButton ctaLocation="home_newsletter" form="newsletter">
        Subscribe To Blog Updates
      </TallyButton>
    </div>
  );
}
```

Change `NewsletterLeadForm` to use:

```tsx
<TallyButton ctaLocation="blog_newsletter" form="newsletter">
  Subscribe To Blog Updates
</TallyButton>
```

Remove the current visual `Email Address` label because there is no on-page input in batch one. The real inline email field belongs to the batch-two homepage layout.

- [ ] **Step 3: Add minimal status styles without changing page layout**

Append to `app/globals.css`:

```css
.lead-form-trigger {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.lead-form-status {
  color: var(--muted);
  font-size: 0.875rem;
  line-height: 1.4;
}

.lead-form-status:empty {
  display: none;
}
```

If the existing stylesheet uses a different muted-color token, reuse that exact token instead of creating a duplicate.

- [ ] **Step 4: Run focused tests and build**

Run:

```bash
npm run test:lead
npm run build
```

Expected: five tests PASS; build completes with no missing `ctaLocation` props or type errors.

- [ ] **Step 5: Commit Task 4**

```bash
git add components/LeadForms.tsx components/GoogleAnalytics.tsx components/Header.tsx components/Footer.tsx components/HomeUpdatesForm.tsx components/ContactForm.tsx app/page.tsx app/about/page.tsx app/blog/page.tsx 'app/blog/[slug]/page.tsx' app/reports/page.tsx app/sourcing/page.tsx app/world-clean-expo/page.tsx app/globals.css
git commit -m "feat: track and separate WCB lead intents"
```

---

### Task 5: Configure Tally and Airtable

**Files:**
- Create: `docs/operations/wcb-lead-field-map.md`
- Modify locally only: `.env.local`
- Modify externally: Tally forms and Airtable `Website Leads` table

**Interfaces:**
- Consumes: exact form types and hidden-field names from Tasks 1–4.
- Produces: two new Tally form IDs, six active form-to-Airtable mappings, and production environment values.

- [ ] **Step 1: Inspect existing external configuration without changing it**

Open the four current forms by ID and the current Airtable integration logs:

```text
contact: MeV8L8
sourcing: 1ARG4M
reports: ZjeGvz
WCE visitor: lbzVN6
```

Record existing questions, redirects, notification recipients, Airtable base/table names, and any automation that depends on current field names. Stop if an existing automation would be broken by renaming a field; add new fields instead.

- [ ] **Step 2: Create the Airtable field contract**

In the existing lead base, create or verify a `Website Leads` table with these fields and types:

```text
Lead ID — Autonumber or existing primary field
Created At — Created time
Form Type — Single select: contact, sourcing, reports, newsletter, wce_exhibitor, wce_visitor
Status — Single select: New, Qualified, Follow Up, Closed
Name — Single line text
Email — Email
Company — Single line text
Role — Single select
Country / Region — Single line text
Interests — Multiple select
Product Category — Single line text
Target Market — Single line text
Project Stage — Single select
Timeline — Single line text
Need Details — Long text
Source Page — Single line text
CTA Location — Single line text
Language — Single line text
UTM Source — Single line text
UTM Medium — Single line text
UTM Campaign — Single line text
UTM Content — Single line text
UTM Term — Single line text
Report ID — Single line text
```

Do not add sensitive budget, identity-document, payment, or password fields.

- [ ] **Step 3: Add the same hidden fields to all six form intents**

Create these case-sensitive hidden fields in every Tally form:

```text
form_type
source_page
cta_location
language
utm_source
utm_medium
utm_campaign
utm_content
utm_term
report_id
```

Tally automatically forwards the website page and query parameters for popup forms, while `TallyButton` also passes the normalized values programmatically.

- [ ] **Step 4: Create the Newsletter form**

Create a published Tally form with:

```text
Work email — Email, required
Your role — Dropdown, required
Interests — Multi-select: Market Intelligence, Sourcing, World Clean Expo
Consent — Checkbox confirming receipt of WCB updates, required
```

Add the ten hidden fields, connect it to Airtable, map `Form Type` to `newsletter`, and set the success message to:

```text
Thank you. You are subscribed to World Clean Biz updates. We will send industry intelligence based on the interests you selected.
```

Copy the form ID from the published Newsletter form Share URL. In `.env.local`, set `NEXT_PUBLIC_TALLY_NEWSLETTER_FORM_ID` to that exact ID, restart the local server, and confirm `getTallyForm("newsletter").url` resolves to the published form URL without printing respondent data.

- [ ] **Step 5: Create the WCE exhibitor/partner form**

Create a published Tally form with:

```text
Name — Short answer, required
Work email — Email, required
Company — Short answer, required
Role — Dropdown, required
Product category — Short answer, required
Interest — Multiple choice: Exhibit, Sponsor, Forum, Media, Other
Business goal — Long answer, required
Country / Region — Short answer, required
```

Add the ten hidden fields, connect it to Airtable, map `Form Type` to `wce_exhibitor`, and set the success message to:

```text
Thank you. The World Clean Expo team received your inquiry and will review the information you provided.
```

Copy the form ID from the published WCE exhibitor/partner form Share URL. In `.env.local`, set `NEXT_PUBLIC_TALLY_WCE_EXHIBITOR_FORM_ID` to that exact ID, restart the local server, and confirm `getTallyForm("wceExhibitor").url` resolves to the published form URL without printing respondent data.

- [ ] **Step 6: Update the existing WCE visitor form**

Keep form ID `lbzVN6`. Verify it collects:

```text
Work email — Email, required
Company — Short answer, required
Role — Dropdown, required
Interested categories — Multi-select
Country / Region — Short answer, required
Plan to attend — Multiple choice: Yes, Maybe, Updates only
```

Add the ten hidden fields and map `Form Type` to `wce_visitor`. Do not redirect current WCE traffic to the exhibitor form.

- [ ] **Step 7: Verify existing Contact, Sourcing, and Reports mappings**

Keep their public IDs unchanged. Add the ten hidden fields and map them to the matching Airtable columns. Set fixed Form Type values:

```text
MeV8L8 → contact
1ARG4M → sourcing
ZjeGvz → reports
```

Use Tally integration sync logs to verify each test response reaches Airtable. Delete test submissions from Airtable only after recording their mapping result; do not delete real responses.

- [ ] **Step 8: Write the field map and commit only documentation**

Create `docs/operations/wcb-lead-field-map.md` with a table containing form name, form ID, form type, question name, Airtable field, required/optional status, and verification date. Include IDs because Tally public form IDs are not secrets; exclude credentials and respondent data.

```bash
git add docs/operations/wcb-lead-field-map.md
git commit -m "docs: record WCB lead field mappings"
```

---

### Task 6: Configure production environment and GA4 reporting

**Files:**
- Modify externally: hosting environment variables and GA4 property
- Modify locally only: `.env.local`

**Interfaces:**
- Consumes: generated Tally IDs and events emitted by `trackLeadEvent()`.
- Produces: production-ready form configuration, GA4 custom dimensions, and `form_success` key event.

- [ ] **Step 1: Add production environment variables**

Set these exact names in the production and preview environments:

```text
NEXT_PUBLIC_TALLY_NEWSLETTER_FORM_ID
NEXT_PUBLIC_TALLY_WCE_EXHIBITOR_FORM_ID
```

Trigger a preview deployment. Confirm the values are present without printing them in public build logs.

- [ ] **Step 2: Register GA4 custom dimensions**

In GA4 Admin, create event-scoped custom dimensions for:

```text
form_type
source_page
cta_location
language
report_id
open_method
error_reason
```

UTM values remain standard acquisition dimensions and should not be duplicated unless the existing property requires a custom report field.

- [ ] **Step 3: Mark the key event**

Mark `form_success` as a GA4 key event. Do not mark `form_open`, `form_submit`, or `form_error` as key events.

- [ ] **Step 4: Verify with DebugView**

For each form type, open the form once and submit one clearly labeled test record. Confirm this sequence:

```text
form_open → form_submit → form_success
```

Confirm all seven custom parameters appear. Trigger one missing-form configuration locally and confirm `form_error` with `error_reason=missing_form_configuration`.

Expected: six successful test sequences and one controlled error sequence.

---

### Task 7: End-to-end preview verification and handoff

**Files:**
- Modify: `docs/operations/wcb-lead-field-map.md`
- No production code changes unless verification exposes a defect

**Interfaces:**
- Consumes: completed code, external forms, Airtable mappings, preview environment, and GA4 DebugView.
- Produces: verified first-batch release candidate and a named list of evidence limits.

- [ ] **Step 1: Run automated checks from a clean dependency state**

Run:

```bash
npm run test:lead
npm run build
```

Expected: all lead tests PASS; production build exits 0 and generates all existing routes.

- [ ] **Step 2: Verify desktop and mobile CTA behavior**

Use 1440×900 and 390×844 viewports. Test Header, Footer, Home, Blog, one article, Reports, Sourcing, WCE, About, and Contact.

For each visible CTA confirm:

```text
Button remains visually usable
Correct form opens
Source Page is correct
CTA Location matches the map
Keyboard focus is visible
Status message is announced after success or fallback
No horizontal overflow is introduced
```

- [ ] **Step 3: Verify fallback behavior**

Block or delay `https://tally.so/widgets/embed.js` in the test browser. Click one CTA.

Expected: a new Tally tab opens with hidden fields in the URL; the page shows `The form opened in a new tab.` and emits `form_open` with `open_method=fallback`.

Block popups and repeat.

Expected: the page shows the unavailable message and emits `form_error` with `error_reason=popup_blocked`.

- [ ] **Step 4: Verify Airtable routing**

Submit one labeled test lead for each form type. Confirm all six rows contain the correct Form Type, Source Page, CTA Location, Language, UTM fields, and Report ID where applicable.

Expected: no test lead enters the wrong form-type view; no real lead is altered.

- [ ] **Step 5: Record verification evidence**

Update `docs/operations/wcb-lead-field-map.md` with:

```text
Preview URL
Build commit
Test date
Desktop result
Mobile result
GA4 DebugView result
Airtable sync result
Known limitations
```

The fallback new-tab path cannot observe final submission success from the WCB page; Airtable sync logs are the authority for that path.

- [ ] **Step 6: Commit the verification record**

```bash
git add docs/operations/wcb-lead-field-map.md
git commit -m "docs: verify WCB lead infrastructure"
```

- [ ] **Step 7: Request production release approval**

Present the preview URL, screenshots, build result, six form routing results, GA4 DebugView evidence, Airtable sync evidence, and rollback commit. Do not deploy until the user explicitly approves this first-batch release.
