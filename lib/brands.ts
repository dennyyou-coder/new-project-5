import fs from "node:fs";
import path from "node:path";

export type BrandProfile = {
  status: "draft" | "published";
  slug: string;
  name: string;
  aliases: string[];
  legalName: string;
  officialWebsite: string;
  headline: string;
  description: string;
  metaDescription: string;
  disclaimer: string;
  headquarters: string;
  founded: string;
  heroImage?: string;
  heroImageAlt?: string;
  ownership: { summary: string; parentCompany?: string };
  leadership: Array<{ name: string; role: string; context?: string }>;
  productPortfolio: Array<{ name: string; positioning: string }>;
  manufacturingSupplyChain: string[];
  marketsChannels: string[];
  competitivePosition: {
    summary: string;
    competitorSlugs: string[];
  };
  developments: Array<{
    date: string;
    title: string;
    summary: string;
    sourceIds: string[];
  }>;
  sources: Array<{
    id: string;
    title: string;
    publisher: string;
    url: string;
    publishedAt?: string;
    accessedAt: string;
  }>;
  publishedAt: string;
  lastVerified: string;
  lastModified: string;
};

export type BrandTaggedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  sortDate: string;
  readingTime?: string;
  coverImage?: string;
  coverAlt?: string;
  primaryBrands: string[];
  relatedBrands: string[];
};

export type BrandPageData = {
  profile: BrandProfile;
  primaryArticles: BrandTaggedArticle[];
  relatedArticles: BrandTaggedArticle[];
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function brandProfilesDirectory() {
  return path.join(process.cwd(), "content", "brands");
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidDate(value: unknown) {
  return hasText(value) && !Number.isNaN(Date.parse(value));
}

function isValidHttpUrl(value: unknown) {
  if (!hasText(value)) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function uniqueArticles(
  articles: BrandTaggedArticle[],
  matcher: (article: BrandTaggedArticle) => boolean
) {
  const seen = new Set<string>();

  return articles.filter((article) => {
    if (!matcher(article) || !hasText(article.slug) || seen.has(article.slug)) {
      return false;
    }

    seen.add(article.slug);
    return true;
  });
}

function sortArticles(articles: BrandTaggedArticle[]) {
  return [...articles].sort((a, b) => b.sortDate.localeCompare(a.sortDate));
}

export function normalizeBrandSlugs(value: unknown): string[] {
  const values = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];

  return [...new Set(
    values
      .map((item) => String(item).trim().toLowerCase())
      .filter((item) => slugPattern.test(item))
  )];
}

export function getBrandProfiles(): BrandProfile[] {
  const directory = brandProfilesDirectory();
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(directory, filename), "utf8")) as BrandProfile;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Could not parse brand profile ${filename}: ${message}`);
      }
    })
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));
}

export function validateBrandProfile(profile: BrandProfile, articles: BrandTaggedArticle[]): string[] {
  const errors: string[] = [];
  const candidate = profile as Partial<BrandProfile>;
  const requiredFields: Array<[keyof BrandProfile, string]> = [
    ["slug", "slug"],
    ["name", "name"],
    ["legalName", "legalName"],
    ["officialWebsite", "officialWebsite"],
    ["headline", "headline"],
    ["description", "description"],
    ["metaDescription", "metaDescription"],
    ["disclaimer", "disclaimer"],
    ["headquarters", "headquarters"],
    ["founded", "founded"],
    ["publishedAt", "publishedAt"],
    ["lastVerified", "lastVerified"],
    ["lastModified", "lastModified"]
  ];

  for (const [field, label] of requiredFields) {
    if (!hasText(candidate[field])) {
      errors.push(`${label} is required.`);
    }
  }

  if (!hasText(candidate.slug) || !slugPattern.test(candidate.slug)) {
    errors.push("slug must use lowercase kebab-case.");
  }

  if (!isValidHttpUrl(candidate.officialWebsite)) {
    errors.push("officialWebsite must be a valid HTTP(S) URL.");
  }

  for (const field of ["publishedAt", "lastVerified", "lastModified"] as const) {
    if (!isValidDate(candidate[field])) {
      errors.push(`${field} must be a valid date.`);
    }
  }

  if (hasText(candidate.heroImage) && !hasText(candidate.heroImageAlt)) {
    errors.push("heroImageAlt is required when heroImage is provided.");
  }

  if (!Array.isArray(candidate.productPortfolio) || candidate.productPortfolio.length === 0) {
    errors.push("productPortfolio must include at least one item.");
  }
  if (!Array.isArray(candidate.manufacturingSupplyChain) || candidate.manufacturingSupplyChain.length === 0) {
    errors.push("manufacturingSupplyChain must include at least one item.");
  }
  if (!Array.isArray(candidate.marketsChannels) || candidate.marketsChannels.length === 0) {
    errors.push("marketsChannels must include at least one item.");
  }
  if (!hasText(candidate.competitivePosition?.summary)) {
    errors.push("competitivePosition.summary is required.");
  }
  if (!hasText(candidate.ownership?.summary)) {
    errors.push("ownership.summary is required.");
  }

  const sources = Array.isArray(candidate.sources) ? candidate.sources : [];
  sources.forEach((source, index) => {
    const sourceNumber = index + 1;

    for (const field of ["id", "title", "publisher", "accessedAt"] as const) {
      if (!hasText(source?.[field])) {
        errors.push(`source ${sourceNumber} ${field} is required.`);
      }
    }
    if (hasText(source?.accessedAt) && !isValidDate(source.accessedAt)) {
      errors.push(`source ${sourceNumber} accessedAt must be a valid date.`);
    }
    if (source?.publishedAt !== undefined && !isValidDate(source.publishedAt)) {
      errors.push(`source ${sourceNumber} publishedAt must be a valid date.`);
    }
  });

  const sourceIds = sources.map((source) => source?.id).filter(hasText);
  const duplicateSourceIds = sourceIds.filter((id, index) => sourceIds.indexOf(id) !== index);
  if (duplicateSourceIds.length > 0) {
    errors.push("source IDs must be unique.");
  }

  const validSourceUrls = new Set(
    sources
      .filter((source) => isValidHttpUrl(source?.url))
      .map((source) => new URL(source.url).href)
  );
  if (validSourceUrls.size < 3) {
    errors.push("At least three unique valid HTTP(S) sources are required.");
  }

  const declaredSourceIds = new Set(sourceIds);
  const developments = Array.isArray(candidate.developments) ? candidate.developments : [];
  developments.forEach((development, index) => {
    if (!isValidDate(development?.date)) {
      errors.push(`development ${index + 1} date must be a valid date.`);
    }

    const developmentSourceIds = Array.isArray(development?.sourceIds)
      ? development.sourceIds.filter(hasText)
      : [];
    if (developmentSourceIds.length === 0) {
      errors.push(`development ${index + 1} must reference at least one source.`);
    }

    for (const sourceId of developmentSourceIds) {
      if (!declaredSourceIds.has(sourceId)) {
        errors.push(`development ${index + 1} references unknown source ID: ${sourceId}.`);
      }
    }
  });

  const slug = candidate.slug || "";
  const primaryArticles = uniqueArticles(
    articles,
    (article) => Array.isArray(article.primaryBrands) && article.primaryBrands.includes(slug)
  );
  const allTaggedArticles = uniqueArticles(
    articles,
    (article) => (
      Array.isArray(article.primaryBrands) && article.primaryBrands.includes(slug)
    ) || (
      Array.isArray(article.relatedBrands) && article.relatedBrands.includes(slug)
    )
  );

  if (allTaggedArticles.length < 3) {
    errors.push("At least three unique primary or related articles are required.");
  }
  if (primaryArticles.length === 0) {
    errors.push("At least one primary article is required.");
  }

  return errors;
}

export function getPublishedBrandProfiles(articles: BrandTaggedArticle[]): BrandProfile[] {
  return getBrandProfiles().filter((profile) => (
    profile.status === "published" && validateBrandProfile(profile, articles).length === 0
  ));
}

export function getBrandPageData(slug: string, articles: BrandTaggedArticle[]): BrandPageData | undefined {
  const profile = getPublishedBrandProfiles(articles).find((item) => item.slug === slug);
  if (!profile) return undefined;

  const primaryArticles = sortArticles(uniqueArticles(
    articles,
    (article) => article.primaryBrands.includes(profile.slug)
  ));
  const primarySlugs = new Set(primaryArticles.map((article) => article.slug));
  const relatedArticles = sortArticles(uniqueArticles(
    articles,
    (article) => article.relatedBrands.includes(profile.slug) && !primarySlugs.has(article.slug)
  ));

  return { profile, primaryArticles, relatedArticles };
}
