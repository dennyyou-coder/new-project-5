import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanInternalTrafficUrl,
  getInternalTrafficControl,
  isProductionAnalyticsHost,
  shouldLoadGoogleAnalytics
} from "../lib/googleAnalytics.ts";

test("only production hostnames can load GA4", () => {
  assert.equal(isProductionAnalyticsHost("worldcleanbiz.com"), true);
  assert.equal(isProductionAnalyticsHost("www.worldcleanbiz.com"), true);
  assert.equal(isProductionAnalyticsHost("localhost"), false);
  assert.equal(isProductionAnalyticsHost("127.0.0.1"), false);
  assert.equal(isProductionAnalyticsHost("example.vercel.app"), false);
  assert.equal(isProductionAnalyticsHost("preview.example.com"), false);
});

test("production hostname checks are case insensitive", () => {
  assert.equal(isProductionAnalyticsHost("WorldCleanBiz.com"), true);
  assert.equal(isProductionAnalyticsHost("WWW.WORLDCLEANBIZ.COM"), true);
});

test("internal traffic controls are parsed exactly", () => {
  assert.equal(getInternalTrafficControl("?wcb_internal=1"), "enable");
  assert.equal(getInternalTrafficControl("?wcb_internal=0"), "disable");
  assert.equal(getInternalTrafficControl("?wcb_internal=true"), null);
  assert.equal(getInternalTrafficControl("?wcb_internal="), null);
  assert.equal(getInternalTrafficControl(""), null);
});

test("control parameter is removed without losing other URL state", () => {
  assert.equal(
    cleanInternalTrafficUrl(
      "/sourcing",
      "?utm_source=email&wcb_internal=1",
      "#product-options"
    ),
    "/sourcing?utm_source=email#product-options"
  );
  assert.equal(
    cleanInternalTrafficUrl("/", "?wcb_internal=0", ""),
    "/"
  );
});

test("production traffic policy excludes automation and internal browsers", () => {
  assert.equal(
    shouldLoadGoogleAnalytics({
      hostname: "worldcleanbiz.com",
      isAutomated: false,
      isInternal: false
    }),
    true
  );
  assert.equal(
    shouldLoadGoogleAnalytics({
      hostname: "worldcleanbiz.com",
      isAutomated: true,
      isInternal: false
    }),
    false
  );
  assert.equal(
    shouldLoadGoogleAnalytics({
      hostname: "worldcleanbiz.com",
      isAutomated: false,
      isInternal: true
    }),
    false
  );
  assert.equal(
    shouldLoadGoogleAnalytics({
      hostname: "example.vercel.app",
      isAutomated: false,
      isInternal: false
    }),
    false
  );
});
