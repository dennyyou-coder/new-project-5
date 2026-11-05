import type { BrandProfile } from "@/lib/brands";

// Country names as they appear in the `headquarters` field of brand profiles.
const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Hong Kong",
  "South Korea",
  "New Zealand",
  "China",
  "Japan",
  "Germany",
  "Italy",
  "France",
  "Sweden",
  "Switzerland",
  "Israel",
  "Slovenia",
  "Türkiye",
  "Turkey",
  "Australia",
  "Netherlands",
  "Denmark",
  "Spain",
  "Taiwan",
  "Singapore",
  "Canada",
  "Austria",
  "Belgium",
  "Finland",
  "Norway",
  "India",
  "Ireland",
  "Liechtenstein",
  "Luxembourg",
  "Czech Republic",
  "Poland"
];

/**
 * The first country named in the headquarters text, or undefined when the
 * profile says the headquarters is not stated.
 */
export function headquartersCountry(headquarters: string): string | undefined {
  if (/^not (stated|disclosed)/i.test(headquarters.trim())) return undefined;
  let best: { country: string; index: number } | undefined;
  for (const country of COUNTRIES) {
    const index = headquarters.indexOf(country);
    if (index >= 0 && (!best || index < best.index)) best = { country, index };
  }
  if (best?.country === "Turkey") return "Türkiye";
  return best?.country;
}

/** One short ownership line for directory cards, taken from the profile. */
export function ownershipLine(profile: BrandProfile): string | undefined {
  const label = profile.ownership.displayLabel?.trim();
  if (label) return label;
  const parent = profile.ownership.parentCompany?.trim();
  if (!parent) return undefined;
  return `Parent: ${parent}`;
}

const SUFFIXES = /\s+(co\.|ltd\.|inc\.|s\.a\.s\.|s\.a\.|s\.p\.a\.|plc|corporation|company|limited|group|holdings?|gmbh|ag|ab|se|& co\. kg|industries|aş|a\.ş\.)$/i;

/**
 * A grouping key for `ownership.parentCompany`, or undefined when the parent
 * text describes split, regional or private ownership that should not be
 * grouped automatically.
 */
export function parentGroupKey(parentCompany: string | undefined): string | undefined {
  if (!parentCompany) return undefined;
  if (/;|regional structure|^private/i.test(parentCompany)) return undefined;
  let name = parentCompany.split(/ \(|, | through | within | is the | with the | in /)[0].trim();
  name = name.replace(/^AB\s+/, "");
  let previous = "";
  while (previous !== name) {
    previous = name;
    name = name.replace(SUFFIXES, "").trim();
  }
  return name ? name.toLowerCase() : undefined;
}

export type OwnershipGroup = { key: string; parent: string; parentProfile?: BrandProfile; brands: BrandProfile[] };

/** Parents that own two or more published profiles, largest first. */
export function buildOwnershipGroups(profiles: BrandProfile[]): OwnershipGroup[] {
  const groups = new Map<string, OwnershipGroup>();
  for (const profile of profiles) {
    const key = parentGroupKey(profile.ownership.parentCompany);
    if (!key) continue;
    const parent = profile.ownership.parentCompany!.split(/ \(|; |, within /)[0].trim();
    const group = groups.get(key) ?? { key, parent, brands: [] };
    // Show the shortest form of the parent name.
    if (parent.length < group.parent.length) group.parent = parent;
    group.brands.push(profile);
    groups.set(key, group);
  }
  return [...groups.values()]
    .filter((group) => group.brands.length >= 2)
    .map((group) => ({
      ...group,
      // The parent's own profile, when it has one: matched on the profile's
      // name, or on its legal name only if the profile has no parent itself
      // (a brand whose legal entity is the parent is not the parent's profile).
      parentProfile: profiles.find(
        (profile) =>
          parentGroupKey(profile.name) === group.key ||
          (!profile.ownership.parentCompany && parentGroupKey(profile.legalName) === group.key)
      ),
      brands: [...group.brands].sort((a, b) => a.name.localeCompare(b.name))
    }))
    .sort((a, b) => b.brands.length - a.brands.length || a.parent.localeCompare(b.parent));
}
