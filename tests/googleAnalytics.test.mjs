import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import {
  cleanInternalTrafficUrl,
  getGoogleAnalyticsBootstrapScript,
  getInternalTrafficControl,
  GOOGLE_ANALYTICS_MEASUREMENT_ID,
  GOOGLE_ANALYTICS_LIBRARY_SCRIPT_ID,
  GOOGLE_ANALYTICS_SCRIPT_ID,
  initializeGoogleAnalytics,
  INTERNAL_TRAFFIC_STORAGE_KEY,
  isProductionAnalyticsHost,
  shouldLoadGoogleAnalytics
} from "../lib/googleAnalytics.ts";

function createBootstrapRuntime({
  href = "https://worldcleanbiz.com/",
  storedInternal = false,
  webdriver = false,
  storageThrows = false
} = {}) {
  const url = new URL(href);
  const values = new Map();
  const historyCalls = [];
  const appendedScripts = [];
  const windowListeners = new Map();
  const documentListeners = new Map();
  const timers = new Map();
  let nextTimerId = 1;

  if (storedInternal) values.set(INTERNAL_TRAFFIC_STORAGE_KEY, "1");

  function addListener(registry, type, listener) {
    const listeners = registry.get(type) ?? new Set();
    listeners.add(listener);
    registry.set(type, listeners);
  }

  function removeListener(registry, type, listener) {
    registry.get(type)?.delete(listener);
  }

  function dispatch(registry, type) {
    for (const listener of [...(registry.get(type) ?? [])]) {
      listener({ type });
    }
  }

  const document = {
    visibilityState: "visible",
    addEventListener(type, listener) {
      addListener(documentListeners, type, listener);
    },
    removeEventListener(type, listener) {
      removeListener(documentListeners, type, listener);
    },
    createElement(tagName) {
      assert.equal(tagName, "script");
      return { async: false, id: "", src: "" };
    },
    getElementById(id) {
      if (id === GOOGLE_ANALYTICS_SCRIPT_ID) return { id };
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
    navigator: { webdriver },
    localStorage: {
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
    },
    history: {
      replaceState(_state, _unused, nextUrl) {
        historyCalls.push(nextUrl);
      }
    },
    addEventListener(type, listener) {
      addListener(windowListeners, type, listener);
    },
    removeEventListener(type, listener) {
      removeListener(windowListeners, type, listener);
    }
  };

  const context = vm.createContext({
    URLSearchParams,
    Date,
    document,
    window,
    setTimeout(callback, delay) {
      const id = nextTimerId++;
      timers.set(id, { callback, delay });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    }
  });

  vm.runInContext(getGoogleAnalyticsBootstrapScript(), context);

  return {
    appendedScripts,
    dataLayerCommands() {
      return Array.from(
        window.dataLayer ?? [],
        (command) => Array.from(command)
      );
    },
    dispatchDocument(type) {
      dispatch(documentListeners, type);
    },
    dispatchWindow(type) {
      dispatch(windowListeners, type);
    },
    document,
    historyCalls,
    listenerCount(type) {
      return (windowListeners.get(type)?.size ?? 0) +
        (documentListeners.get(type)?.size ?? 0);
    },
    runTimers() {
      for (const [id, timer] of [...timers]) {
        timers.delete(id);
        timer.callback();
      }
    },
    storageValues: values,
    timers,
    window
  };
}

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
    GOOGLE_ANALYTICS_LIBRARY_SCRIPT_ID
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

test("GA4 is bootstrapped by Next Script instead of relying on a mount effect", async () => {
  const analyticsModule = await import("../lib/googleAnalytics.ts");
  const componentSource = await readFile(
    new URL("../components/GoogleAnalytics.tsx", import.meta.url),
    "utf8"
  );

  assert.equal(
    typeof analyticsModule.getGoogleAnalyticsBootstrapScript,
    "function"
  );
  assert.match(componentSource, /from "next\/script"/);
  assert.match(componentSource, /getGoogleAnalyticsBootstrapScript/);
  assert.doesNotMatch(componentSource, /useEffect/);
  assert.equal([...componentSource.matchAll(/<Script\b/g)].length, 1);
  assert.doesNotMatch(componentSource, /googletagmanager\.com/);
  assert.doesNotMatch(componentSource, /\bsrc=/);
});

test("bootstrap queues the initial page view before loading the GA4 library", () => {
  const runtime = createBootstrapRuntime();

  assert.deepEqual(
    runtime.dataLayerCommands().map(([command]) => command),
    ["js", "config"]
  );
  assert.equal(runtime.appendedScripts.length, 0);
  assert.equal(runtime.timers.size, 1);
  assert.equal([...runtime.timers.values()][0].delay, 3500);
});

test("first interaction loads GA4 once and removes every trigger", () => {
  const runtime = createBootstrapRuntime();

  runtime.dispatchWindow("pointerdown");
  runtime.dispatchWindow("keydown");
  runtime.runTimers();

  assert.equal(runtime.appendedScripts.length, 1);
  assert.equal(
    runtime.appendedScripts[0].id,
    GOOGLE_ANALYTICS_LIBRARY_SCRIPT_ID
  );
  assert.equal(runtime.appendedScripts[0].async, true);
  assert.match(
    runtime.appendedScripts[0].src,
    new RegExp(GOOGLE_ANALYTICS_MEASUREMENT_ID)
  );
  assert.equal(runtime.listenerCount("pointerdown"), 0);
  assert.equal(runtime.listenerCount("keydown"), 0);
  assert.equal(runtime.listenerCount("touchstart"), 0);
  assert.equal(runtime.listenerCount("visibilitychange"), 0);
  assert.equal(runtime.timers.size, 0);
});

test("timeout and hidden-page fallbacks each load GA4", () => {
  const timed = createBootstrapRuntime();
  timed.runTimers();
  assert.equal(timed.appendedScripts.length, 1);

  const hidden = createBootstrapRuntime();
  hidden.document.visibilityState = "hidden";
  hidden.dispatchDocument("visibilitychange");
  assert.equal(hidden.appendedScripts.length, 1);
});

test("early lead events remain queued ahead of deferred library injection", () => {
  const runtime = createBootstrapRuntime();

  runtime.window.gtag("event", "cta_click", {
    cta_location: "home_hero"
  });

  assert.deepEqual(
    runtime.dataLayerCommands().map(([command]) => command),
    ["js", "config", "event"]
  );
  assert.equal(runtime.appendedScripts.length, 0);

  runtime.dispatchWindow("touchstart");
  assert.equal(runtime.appendedScripts.length, 1);
  assert.equal(runtime.dataLayerCommands()[2][1], "cta_click");
});

test("excluded bootstrap visits never queue or schedule GA4", () => {
  for (const options of [
    { href: "https://preview.vercel.app/" },
    { webdriver: true },
    { storedInternal: true }
  ]) {
    const runtime = createBootstrapRuntime(options);
    runtime.dispatchWindow("pointerdown");
    runtime.runTimers();

    assert.equal(runtime.appendedScripts.length, 0);
    assert.deepEqual(runtime.dataLayerCommands(), []);
    assert.equal(runtime.timers.size, 0);
  }
});
