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

// Periods that do not end a sentence: initialisms (U.S., U.K.), single initials
// (Joseph Galli Jr., S. Duncan Black) and common company or title abbreviations.
const abbreviation = /\b(?:(?:[A-Z]\.){2,}|[A-Z]\.(?=\s+[A-Z])|(?:Co|Cie)\.(?=\s+KG)|(?:Mfg|u)\.|(?:Inc|Co|Corp|Ltd|Jr|Sr|Mr|Mrs|Ms|Dr|St|No|Nos|vs|approx|e\.g|i\.e|etc)\.(?=\s+[a-z0-9(]|\s+[A-Z][a-z]*[,)]|,))/g;
const placeholder = "\u0000";

/** Splits profile text into sentences without breaking on "U.S.", "Inc." or initials. */
export function splitSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const protectedText = trimmed.replace(abbreviation, (match) => match.replaceAll(".", placeholder));
  const parts = protectedText.split(/(?<=[.!?])\s+(?=[A-Z0-9“"'(])/);
  return parts.map((part) => part.replaceAll(placeholder, ".").trim()).filter(Boolean);
}

/** First sentence of a profile text, for short bullet points. */
export function firstSentence(text: string): string {
  return splitSentences(text)[0] ?? text.trim();
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

const GENERIC_BRAND_WORDS = new Set(["home", "appliances", "household", "power", "tools", "robotics", "industries", "group", "and"]);

/**
 * The ownership guide a company page should point to. Several guides can name
 * the same company (a parent's portfolio piece, a sister brand's guide); the
 * one about this company comes first: its name right after "who owns" or
 * "who makes" in the slug, then its name anywhere in the slug or title.
 */
export function pickOwnershipGuide<T extends { slug: string; title: string; contentClass?: string; guideType?: string; primaryBrands: string[] }>(
  profile: { slug: string; name: string },
  articles: readonly T[]
): T | undefined {
  const candidates = articles.filter(
    (article) => article.contentClass === "search" && article.guideType === "ownership" && article.primaryBrands.includes(profile.slug)
  );
  const tokens = profile.slug.split("-").filter((word) => word.length > 2 && !GENERIC_BRAND_WORDS.has(word));
  const lead = tokens[0];
  const score = (article: T) => {
    let value = 0;
    if (lead && new RegExp(`^(who-owns|who-makes|is)-(the-)?${lead}\\b`).test(article.slug)) value += 3;
    if (tokens.some((token) => article.slug.includes(token))) value += 1;
    if (article.title.toLowerCase().includes(profile.name.toLowerCase())) value += 1;
    return value;
  };
  return candidates
    .map((article, index) => ({ article, index, value: score(article) }))
    .sort((a, b) => b.value - a.value || a.index - b.index)[0]?.article;
}

/** URL-style tokens a comparison slug uses for this company: its slug, name and aliases. */
function brandSlugTokens(profile: { slug: string; name: string; aliases?: string[] }) {
  const slugify = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return [...new Set([profile.slug, profile.name, ...(profile.aliases ?? [])].map(slugify).filter((token) => token.length > 2))];
}

/**
 * Comparison guides about a company, for its "Compare" block. Many comparisons
 * carry no primary brands, so they are matched by the company's name in the
 * slug (roborock-vs-dreame-…, …-vs-roborock-…) as well as by primary brands.
 */
export function pickComparisonGuides<T extends { slug: string; guideType?: string; primaryBrands: string[]; sortDate?: string; date?: string }>(
  profile: { slug: string; name: string; aliases?: string[] },
  articles: readonly T[],
  limit = 4
): T[] {
  const tokens = brandSlugTokens(profile);
  const mentions = (slug: string) => tokens.some((token) => new RegExp(`(^|-)${token}(-|$)`).test(slug));
  return articles
    .filter((article) => article.guideType === "comparison" && (article.primaryBrands.includes(profile.slug) || mentions(article.slug)))
    .sort((a, b) => String(b.sortDate || b.date || "").localeCompare(String(a.sortDate || a.date || "")))
    .slice(0, limit);
}
