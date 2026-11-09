/**
 * Cacheable filtered listings. Pages such as /news?topic=products&page=2 used to be rendered on every
 * request because they read searchParams. middleware.ts rewrites those requests to an internal path,
 * /news/q/<encoded query>, which Next renders once and caches; the address in the browser does not change.
 */

/** Query keys that never change what a listing shows (tracking, Next's own RSC marker). */
const IGNORED = /^(utm_|fbclid$|gclid$|msclkid$|ref$|v$|_rsc$|fresh$|x$)/;

export type QueryParams = Record<string, string | string[] | undefined>;

/** The listing-relevant pairs of a query string, in a stable order. */
export function listingPairs(search: URLSearchParams) {
  return [...search.entries()]
    .filter(([key, value]) => !IGNORED.test(key) && value !== "")
    .sort(([a, x], [b, y]) => a.localeCompare(b) || x.localeCompare(y));
}

function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(segment: string) {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

/** "topic=products&page=2" → a URL-safe path segment. */
export function encodeQuerySegment(pairs: [string, string][]) {
  return toBase64Url(new URLSearchParams(pairs).toString());
}

/** The segment back to the searchParams shape a page expects; anything malformed reads as no filter. */
export function decodeQuerySegment(segment: string): QueryParams {
  try {
    const params: QueryParams = {};
    for (const [key, value] of new URLSearchParams(fromBase64Url(decodeURIComponent(segment)))) {
      const existing = params[key];
      params[key] = existing === undefined ? value : Array.isArray(existing) ? [...existing, value] : [existing, value];
    }
    return params;
  } catch {
    return {};
  }
}
