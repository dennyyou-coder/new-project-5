export const GOOGLE_ANALYTICS_MEASUREMENT_ID = "G-6RW65B9CD0";
export const GOOGLE_ANALYTICS_SCRIPT_ID = "wcb-google-analytics";
export const INTERNAL_TRAFFIC_PARAM = "wcb_internal";
export const INTERNAL_TRAFFIC_STORAGE_KEY = "wcb_internal_traffic";

const PRODUCTION_ANALYTICS_HOSTS = new Set([
  "worldcleanbiz.com",
  "www.worldcleanbiz.com"
]);

export function isProductionAnalyticsHost(hostname: string): boolean {
  return PRODUCTION_ANALYTICS_HOSTS.has(hostname.toLowerCase());
}

export function getInternalTrafficControl(
  search: string
): "enable" | "disable" | null {
  const value = new URLSearchParams(search).get(INTERNAL_TRAFFIC_PARAM);

  if (value === "1") return "enable";
  if (value === "0") return "disable";
  return null;
}

export function cleanInternalTrafficUrl(
  pathname: string,
  search: string,
  hash: string
): string {
  const params = new URLSearchParams(search);
  params.delete(INTERNAL_TRAFFIC_PARAM);
  const nextSearch = params.toString();

  return `${pathname}${nextSearch ? `?${nextSearch}` : ""}${hash}`;
}

export function shouldLoadGoogleAnalytics({
  hostname,
  isAutomated,
  isInternal
}: {
  hostname: string;
  isAutomated: boolean;
  isInternal: boolean;
}): boolean {
  return (
    isProductionAnalyticsHost(hostname) && !isAutomated && !isInternal
  );
}

export function getGoogleAnalyticsBootstrapScript(): string {
  const measurementId = JSON.stringify(GOOGLE_ANALYTICS_MEASUREMENT_ID);
  const internalParam = JSON.stringify(INTERNAL_TRAFFIC_PARAM);
  const storageKey = JSON.stringify(INTERNAL_TRAFFIC_STORAGE_KEY);
  const productionHosts = JSON.stringify([...PRODUCTION_ANALYTICS_HOSTS]);

  return `
(function () {
  var measurementId = ${measurementId};
  var disableKey = "ga-disable-" + measurementId;
  var productionHosts = ${productionHosts};
  var params = new URLSearchParams(window.location.search);
  var control = params.get(${internalParam});
  var isInternal = control === "1";

  try {
    if (control === "1") {
      window.localStorage.setItem(${storageKey}, "1");
    } else if (control === "0") {
      window.localStorage.removeItem(${storageKey});
      isInternal = false;
    } else {
      isInternal = window.localStorage.getItem(${storageKey}) === "1";
    }
  } catch (_) {
    isInternal = control === "1";
  }

  if (control === "1" || control === "0") {
    params.delete(${internalParam});
    var nextSearch = params.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname +
        (nextSearch ? "?" + nextSearch : "") +
        window.location.hash
    );
  }

  var isProduction =
    productionHosts.indexOf(window.location.hostname.toLowerCase()) !== -1;
  var isAutomated = window.navigator.webdriver === true;

  if (!isProduction || isAutomated || isInternal) {
    window[disableKey] = true;
    return;
  }

  delete window[disableKey];
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
})();
`.trim();
}

type AnalyticsScriptElement = {
  async: boolean;
  id: string;
  src: string;
};

export type GoogleAnalyticsWindow = {
  location: {
    hostname: string;
    pathname: string;
    search: string;
    hash: string;
  };
  navigator: {
    webdriver?: boolean;
  };
  localStorage: {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
  };
  history: {
    replaceState(
      data: unknown,
      unused: string,
      url?: string | URL | null
    ): void;
  };
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
  [key: string]: unknown;
};

export type GoogleAnalyticsDocument = {
  createElement(tagName: "script"): AnalyticsScriptElement;
  getElementById(id: string): unknown | null;
  head: {
    appendChild(node: AnalyticsScriptElement): unknown;
  };
};

export type AnalyticsInitializationResult = {
  loaded: boolean;
  reason:
    | "allowed"
    | "non-production-host"
    | "automated"
    | "internal-browser"
    | "already-initialized";
};

function readInternalBrowserState(
  windowLike: GoogleAnalyticsWindow
): boolean {
  const control = getInternalTrafficControl(windowLike.location.search);
  let isInternal = control === "enable";

  try {
    if (control === "enable") {
      windowLike.localStorage.setItem(INTERNAL_TRAFFIC_STORAGE_KEY, "1");
    } else if (control === "disable") {
      windowLike.localStorage.removeItem(INTERNAL_TRAFFIC_STORAGE_KEY);
      isInternal = false;
    } else {
      isInternal =
        windowLike.localStorage.getItem(INTERNAL_TRAFFIC_STORAGE_KEY) ===
        "1";
    }
  } catch {
    isInternal = control === "enable";
  }

  if (control) {
    windowLike.history.replaceState(
      null,
      "",
      cleanInternalTrafficUrl(
        windowLike.location.pathname,
        windowLike.location.search,
        windowLike.location.hash
      )
    );
  }

  return isInternal;
}

export function initializeGoogleAnalytics(
  windowLike: GoogleAnalyticsWindow,
  documentLike: GoogleAnalyticsDocument
): AnalyticsInitializationResult {
  const isInternal = readInternalBrowserState(windowLike);
  const isAutomated = windowLike.navigator.webdriver === true;
  const disableKey = `ga-disable-${GOOGLE_ANALYTICS_MEASUREMENT_ID}`;

  let exclusionReason:
    | "non-production-host"
    | "automated"
    | "internal-browser"
    | null = null;

  if (!isProductionAnalyticsHost(windowLike.location.hostname)) {
    exclusionReason = "non-production-host";
  } else if (isAutomated) {
    exclusionReason = "automated";
  } else if (isInternal) {
    exclusionReason = "internal-browser";
  }

  if (exclusionReason) {
    windowLike[disableKey] = true;
    return {
      loaded: false,
      reason: exclusionReason
    };
  }

  delete windowLike[disableKey];

  if (documentLike.getElementById(GOOGLE_ANALYTICS_SCRIPT_ID)) {
    return {
      loaded: true,
      reason: "already-initialized"
    };
  }

  const dataLayer = windowLike.dataLayer ?? [];
  windowLike.dataLayer = dataLayer;
  windowLike.gtag =
    windowLike.gtag ??
    ((...args: unknown[]) => {
      dataLayer.push(args);
    });

  windowLike.gtag("js", new Date());
  windowLike.gtag("config", GOOGLE_ANALYTICS_MEASUREMENT_ID);

  const script = documentLike.createElement("script");
  script.id = GOOGLE_ANALYTICS_SCRIPT_ID;
  script.async = true;
  script.src =
    `https://www.googletagmanager.com/gtag/js?id=` +
    GOOGLE_ANALYTICS_MEASUREMENT_ID;
  documentLike.head.appendChild(script);

  return {
    loaded: true,
    reason: "allowed"
  };
}
