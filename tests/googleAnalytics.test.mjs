import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanInternalTrafficUrl,
  getInternalTrafficControl,
  GOOGLE_ANALYTICS_MEASUREMENT_ID,
  GOOGLE_ANALYTICS_SCRIPT_ID,
  initializeGoogleAnalytics,
  INTERNAL_TRAFFIC_STORAGE_KEY,
  isProductionAnalyticsHost,
  shouldLoadGoogleAnalytics
} from "../lib/googleAnalytics.ts";

function createRuntime({
  href,
  storedInternal = false,
  webdriver = false,
  storageThrows = false
}) {
  const url = new URL(href);
  const values = new Map();
  const historyCalls = [];
  const appendedScripts = [];

  if (storedInternal) {
    values.set(INTERNAL_TRAFFIC_STORAGE_KEY, "1");
  }

  const storage = {
    getItem(key) {
      if (storageThrows) throw new Error("storage unavailable");
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      if (storageThrows) throw new Error("storage unavailable");
      values.set(key, value);
    },
    removeItem(key) {
      if (storageThrows) throw new Error("storage unavailable");
      values.delete(key);
    }
  };

  const document = {
    createElement(tagName) {
      assert.equal(tagName, "script");
      return {
        async: false,
        id: "",
        src: ""
      };
    },
    getElementById(id) {
      return appendedScripts.find((script) => script.id === id) ?? null;
    },
    head: {
      appendChild(script) {
        appendedScripts.push(script);
        return script;
      }
    }
  };

  const window = {
    location: {
      hash: url.hash,
      hostname: url.hostname,
      pathname: url.pathname,
      search: url.search
    },
    navigator: {
      webdriver
    },
    localStorage: storage,
    history: {
      replaceState(_state, _unused, nextUrl) {
        historyCalls.push(nextUrl);
      }
    }
  };

  return {
    appendedScripts,
    document,
    historyCalls,
    storage,
    window
  };
}

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

test("enable link persists exclusion, cleans URL and never injects GA4", () => {
  const runtime = createRuntime({
    href: "https://worldcleanbiz.com/?utm_source=test&wcb_internal=1#top"
  });
  const result = initializeGoogleAnalytics(runtime.window, runtime.document);

  assert.equal(result.loaded, false);
  assert.equal(result.reason, "internal-browser");
  assert.equal(runtime.storage.getItem(INTERNAL_TRAFFIC_STORAGE_KEY), "1");
  assert.equal(runtime.historyCalls[0], "/?utm_source=test#top");
  assert.equal(runtime.appendedScripts.length, 0);
  assert.equal(
    runtime.window[`ga-disable-${GOOGLE_ANALYTICS_MEASUREMENT_ID}`],
    true
  );
});

test("disable link clears exclusion and loads GA4 on production", () => {
  const runtime = createRuntime({
    href: "https://worldcleanbiz.com/?wcb_internal=0",
    storedInternal: true
  });
  const result = initializeGoogleAnalytics(runtime.window, runtime.document);

  assert.equal(result.loaded, true);
  assert.equal(result.reason, "allowed");
  assert.equal(runtime.storage.getItem(INTERNAL_TRAFFIC_STORAGE_KEY), null);
  assert.equal(runtime.historyCalls[0], "/");
  assert.equal(runtime.appendedScripts.length, 1);
  assert.equal(
    runtime.appendedScripts[0].id,
    GOOGLE_ANALYTICS_SCRIPT_ID
  );
  assert.match(
    runtime.appendedScripts[0].src,
    new RegExp(GOOGLE_ANALYTICS_MEASUREMENT_ID)
  );
  assert.equal(runtime.appendedScripts[0].async, true);
  assert.equal(runtime.window.dataLayer.length, 2);
});

test("stored internal marker excludes later production visits", () => {
  const runtime = createRuntime({
    href: "https://worldcleanbiz.com/sourcing",
    storedInternal: true
  });
  const result = initializeGoogleAnalytics(runtime.window, runtime.document);

  assert.equal(result.loaded, false);
  assert.equal(result.reason, "internal-browser");
  assert.equal(runtime.appendedScripts.length, 0);
});

test("enable link still excludes the current page when storage is unavailable", () => {
  const runtime = createRuntime({
    href: "https://worldcleanbiz.com/?wcb_internal=1",
    storageThrows: true
  });
  const result = initializeGoogleAnalytics(runtime.window, runtime.document);

  assert.equal(result.loaded, false);
  assert.equal(result.reason, "internal-browser");
  assert.equal(runtime.historyCalls[0], "/");
  assert.equal(runtime.appendedScripts.length, 0);
});

test("preview and automated browsers never inject GA4", () => {
  const preview = createRuntime({
    href: "https://example.vercel.app/sourcing"
  });
  const automated = createRuntime({
    href: "https://worldcleanbiz.com/sourcing",
    webdriver: true
  });

  assert.equal(
    initializeGoogleAnalytics(preview.window, preview.document).reason,
    "non-production-host"
  );
  assert.equal(
    initializeGoogleAnalytics(automated.window, automated.document).reason,
    "automated"
  );
  assert.equal(preview.appendedScripts.length, 0);
  assert.equal(automated.appendedScripts.length, 0);
});

test("initialization is idempotent", () => {
  const runtime = createRuntime({
    href: "https://worldcleanbiz.com/sourcing"
  });
  initializeGoogleAnalytics(runtime.window, runtime.document);
  const second = initializeGoogleAnalytics(
    runtime.window,
    runtime.document
  );

  assert.equal(second.loaded, true);
  assert.equal(second.reason, "already-initialized");
  assert.equal(runtime.appendedScripts.length, 1);
  assert.equal(runtime.window.dataLayer.length, 2);
});
