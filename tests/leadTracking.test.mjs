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
