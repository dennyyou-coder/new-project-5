/**
 * Key brands: an editorial list of the companies WCB puts first wherever the homepage lists companies.
 * Order matters; companies not listed follow in their usual order (coverage, date).
 */
export const KEY_BRANDS = [
  "roborock",
  "ecovacs",
  "dreame",
  "shark",
  "dyson",
  "irobot",
  "tineco",
  "narwal",
  "karcher",
  "husqvarna",
  "segway-navimow",
  "mammotion",
  "midea",
  "eufy",
  "bissell",
  "aiper",
  "beatbot"
] as const;

const rank = new Map<string, number>(KEY_BRANDS.map((slug, index) => [slug, index]));

/** Position in the key-brand list, or Infinity for everyone else. */
export function keyBrandRank(slug: string | undefined) {
  return slug ? rank.get(slug) ?? Number.POSITIVE_INFINITY : Number.POSITIVE_INFINITY;
}

/** Comparator: key brands first, in list order; ties (both unlisted) return 0 so a stable sort keeps the prior order. */
export function compareKeyBrands(a: string | undefined, b: string | undefined) {
  const ra = keyBrandRank(a);
  const rb = keyBrandRank(b);
  return ra === rb ? 0 : ra < rb ? -1 : 1;
}

export function isKeyBrand(slug: string | undefined) {
  return keyBrandRank(slug) !== Number.POSITIVE_INFINITY;
}
