import test from "node:test";
import assert from "node:assert/strict";
import * as leadTracking from "../lib/leadTracking.ts";

const {
  LEAD_FORM_TYPES,
  buildTallyUrl,
  createLeadAttribution,
  trackLeadEvent
} = leadTracking;

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
      report_id: "",
      product_category: "",
      inquiry_type: "",
      inquiry_intent: ""
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
    report_id: "",
    product_category: "",
    inquiry_type: "",
    inquiry_intent: ""
  });

  assert.equal(
    url,
    "https://tally.so/r/abc123?form_type=newsletter&source_page=%2F&cta_location=home_newsletter&language=en&utm_source=email&utm_medium=newsletter&utm_campaign=launch&utm_content=&utm_term=&report_id=&product_category=&inquiry_type=&inquiry_intent="
  );
});

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
    report_id: "next-decade-cleaning-growth",
    product_category: "",
    inquiry_type: "",
    inquiry_intent: ""
  });

  assert.match(url, /transparentBackground=1/);
  assert.match(url, /report_id=next-decade-cleaning-growth/);
});

test("createLeadAttribution keeps product and inquiry context", () => {
  const result = createLeadAttribution({
    formType: "sourcing",
    sourcePage: "/sourcing",
    ctaLocation: "sourcing_category_pool_robots",
    productCategory: "pool_robots",
    inquiryType: "sourcing",
    search: "?utm_source=google"
  });

  assert.equal(result.product_category, "pool_robots");
  assert.equal(result.inquiry_type, "sourcing");
  assert.match(
    buildTallyUrl("https://tally.so/r/test", result),
    /product_category=pool_robots/
  );
});

test("createLeadAttribution keeps sourcing funnel intent", () => {
  const result = createLeadAttribution({
    formType: "sourcing",
    sourcePage: "/sourcing",
    ctaLocation: "sourcing_hero_opportunity",
    inquiryIntent: "opportunity_discovery"
  });

  assert.equal(result.inquiry_intent, "opportunity_discovery");
  assert.match(
    buildTallyUrl("https://tally.so/r/test", result),
    /inquiry_intent=opportunity_discovery/
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

test("trackLeadEvent sends article CTA context to GA4", () => {
  const calls = [];
  global.window = { gtag: (...args) => calls.push(args) };

  assert.equal(
    trackLeadEvent("cta_click", {
      form_type: "sourcing",
      source_page: "/blog/example",
      cta_location: "article_footer",
      language: "en",
      cta_type: "sourcing",
      article_slug: "example",
      article_category: "Buyer Guide"
    }),
    true
  );
  assert.equal(calls[0][1], "cta_click");
  assert.equal(calls[0][2].article_slug, "example");
  delete global.window;
});
