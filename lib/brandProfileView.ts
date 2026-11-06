import { normalizeOptionalBrandText, type BrandProfile } from "@/lib/brands";
import { parentGroupKey } from "@/lib/brandDirectory";

/** The parent company's short name, e.g. "AB Electrolux (publ)" -> "AB Electrolux". */
export function shortParentName(parentCompany: string | undefined): string | undefined {
  const parent = parentCompany?.trim();
  if (!parent || !parentGroupKey(parent)) return undefined;
  return parent.split(/ \(|; |, within |, with /)[0].trim();
}

/** True when the profile is itself the parent group (Electrolux, Midea, BISSELL). */
function isOwnGroupParent(profile: BrandProfile): boolean {
  const parentKey = parentGroupKey(profile.ownership.parentCompany);
  return Boolean(parentKey && parentGroupKey(profile.name) === parentKey);
}

function sentence(text: string): string {
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

/**
 * The plain-language ownership answer shown first on a profile: the
 * hand-written quickAnswer, or "X is part of Y." when the parent is clear.
 */
export function buildBrandQuickAnswer(profile: BrandProfile): string | undefined {
  const written = normalizeOptionalBrandText(profile.quickAnswer);
  if (written) return written;
  const parent = shortParentName(profile.ownership.parentCompany);
  if (parent && !isOwnGroupParent(profile)) return sentence(`${profile.name} is part of ${parent}`);
  return undefined;
}

/** A short ownership label for the key-facts card. */
export function buildOwnershipFact(profile: BrandProfile): string {
  const label = normalizeOptionalBrandText(profile.ownership.displayLabel);
  if (label) return label;
  const parent = shortParentName(profile.ownership.parentCompany);
  if (parent && !isOwnGroupParent(profile)) return `Part of ${parent}`;
  const summary = profile.ownership.summary;
  if (/privately held|private company|family[- ](owned|business)/i.test(summary)) return "Privately held";
  if (/\blisted\b|stock exchange|\bNYSE\b|\bNasdaq\b/i.test(summary)) return "Publicly listed";
  return "See the ownership section";
}

/**
 * The published profile of a brand's parent company, matched the same way as
 * the directory's ownership groups: on the parent profile's name, or on its
 * legal name when that profile has no parent of its own.
 */
export function findParentProfile(profile: BrandProfile, profiles: readonly BrandProfile[]): BrandProfile | undefined {
  const key = parentGroupKey(profile.ownership.parentCompany);
  if (!key || isOwnGroupParent(profile)) return undefined;
  return profiles.find(
    (candidate) =>
      candidate.slug !== profile.slug &&
      (parentGroupKey(candidate.name) === key ||
        (!candidate.ownership.parentCompany && parentGroupKey(candidate.legalName) === key))
  );
}
