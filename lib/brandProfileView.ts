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
  if (/(?<!not\b[^.]{0,40})family[- ](owned|run|business|led)/i.test(summary)) return "Privately held, family-owned";
  if (/privately held|private company/i.test(summary)) return "Privately held";
  if (/\blisted\b|stock exchange|\bNYSE\b|\bNasdaq\b|public company/i.test(summary)) return "Publicly listed";
  // Founder-led only when the ownership record itself says the founder runs the company.
  const founderLed = /founder and (ceo|chief executive)|founded and (is )?led|founder-led/i.test(summary);
  const undisclosed = /not (publicly )?disclos|not public|do not (name|disclose)|does not (name|disclose)/i.test(summary);
  if (founderLed && undisclosed) return "Founder-led; shareholders not public";
  if (founderLed) return "Founder-led";
  if (undisclosed) return "Shareholders not public";
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

/** First sentence of a profile text, for short bullet points. */
export function firstSentence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^(.+?[.!?])(\s+(?=[A-Z0-9“"'(])|$)/);
  return (match ? match[1] : trimmed).trim();
}

/** A short "City, Country" from a profile's headquarters text. */
export function shortHeadquarters(headquarters: string): string {
  let text = headquarters.split(";")[0];
  text = text.replace(/^[^:]{0,40}:\s*/, "").replace(/\s*\([^)]*\)/g, "");
  text = text.replace(/\s+(at|for|in the)\s+[^,]*$/i, "").trim();
  const parts = text.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 3) return `${parts[0]}, ${parts[parts.length - 1]}`;
  if (parts.length === 2) return parts[0].split(/\s+/).length <= 2 ? parts.join(", ") : parts[1];
  return parts[0] ?? headquarters;
}

/** The first plausible year in a profile's founded text. */
export function foundedYear(founded: string): string | undefined {
  return founded.match(/\b(1[6-9]\d\d|20\d\d)\b/)?.[1];
}

/** One line under the company name: category · city, country · since year. */
export function buildBrandTagline(profile: BrandProfile, categoryName?: string): string {
  const year = foundedYear(profile.founded);
  return [categoryName, shortHeadquarters(profile.headquarters), year ? `Since ${year}` : undefined]
    .filter(Boolean)
    .join(" · ");
}

/** The profile description when it reads as an overview rather than page boilerplate. */
export function buildBrandOverview(profile: BrandProfile): string | undefined {
  const description = profile.description.trim();
  // Page boilerplate ("A source-backed profile of …") is not an overview.
  if (/^(a|an) (source-backed|verified|independent)\b[^.]{0,60}\bprofile\b/i.test(description)) return undefined;
  // Ownership-style descriptions repeat the answer card shown just above.
  if (/\bown(s|ed|er|ership)?\b|\bpart of\b|\bcontrolled\b|\bshareholder|\bsubsidiary\b/i.test(description)) return undefined;
  const answer = normalizeOptionalBrandText(profile.quickAnswer);
  if (answer) {
    const words = (text: string) => new Set(text.toLowerCase().match(/[a-z0-9]{4,}/g) ?? []);
    const a = words(description);
    const b = words(answer);
    const shared = [...a].filter((word) => b.has(word)).length;
    if (shared / Math.max(1, Math.min(a.size, b.size)) > 0.4) return undefined;
  }
  return description;
}

/** The competitive assessment without its "World Clean Biz assessment:" prefix. */
export function buildCompetitiveView(profile: BrandProfile): string {
  return profile.competitivePosition.summary.replace(/^World Clean Biz assessment:\s*/i, "").trim();
}

/** Unique "what to verify" checks from manufacturing and channel evidence. */
export function buildBuyerChecks(profile: BrandProfile, limit = 6): string[] {
  const seen = new Set<string>();
  const checks: string[] = [];
  for (const item of [...profile.manufacturingSupplyChain, ...profile.marketsChannels]) {
    const check = item.buyerCheck?.trim();
    if (!check || seen.has(check.toLowerCase())) continue;
    seen.add(check.toLowerCase());
    checks.push(check);
  }
  return checks.slice(0, limit);
}

/** Founded for the fact sheet: the year, unless sources disagree ("2015 or 2017"). */
export function foundedShort(founded: string): string {
  if (/\b\d{4}\s+or\s+\d{4}\b/.test(founded)) return founded.replace(/\s*\([^)]*\)/g, "").trim();
  return foundedYear(founded) ?? founded;
}
