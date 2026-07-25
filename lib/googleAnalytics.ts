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
