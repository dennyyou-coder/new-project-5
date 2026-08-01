import fs from "node:fs";
import path from "node:path";
import { isValidBrandDate } from "@/lib/brandDates";

export type BrandVisualPlacement =
  | "ownership"
  | "portfolio"
  | "operations"
  | "competition";

export type BrandContentVisual = {
  placement: BrandVisualPlacement;
  src: string;
  alt: string;
  caption: string;
};

export type BrandEvidenceItem = {
  evidence: string;
  scope: string;
  buyerCheck: string;
};

export type BrandLeadershipPortrait = {
  src: string;
  alt: string;
  credit: string;
  sourceUrl: string;
  objectPosition?: string;
};

export type BrandLeadershipPerson = {
  name: string;
  role: string;
  context?: string;
  portrait?: BrandLeadershipPortrait;
};

export type BrandProfile = {
  status: "draft" | "published";
  slug: string;
  name: string;
  aliases: string[];
  legalName?: string;
  legalEntityNote?: string;
  officialWebsite: string;
  headline: string;
  description: string;
  metaDescription: string;
  disclaimer: string;
  headquarters: string;
  founded: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroImageCaption?: string;
  logoImage: string;
  logoImageAlt: string;
  logoSourceUrl: string;
  contentVisuals: BrandContentVisual[];
  ownership: { summary: string; parentCompany?: string };
  leadership: BrandLeadershipPerson[];
  productPortfolio: Array<{
    name: string;
    positioning: string;
    buyerRelevance?: string;
  }>;
  manufacturingSupplyChain: BrandEvidenceItem[];
  marketsChannels: BrandEvidenceItem[];
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

export type BrandCompetitorReference = {
  slug: string;
  href?: string;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function brandProfilesDirectory() {
  return path.join(process.cwd(), "content", "brands");
}

export function normalizeOptionalBrandText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function hasText(value: unknown): value is string {
  return normalizeOptionalBrandText(value) !== undefined;
}

function isValidDate(value: unknown) {
  return hasText(value) && isValidBrandDate(value);
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

function isValidHttpsUrl(value: unknown) {
  if (!hasText(value)) return false;

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function recordText(
  record: Record<string, unknown>,
  field: string,
  label: string,
  errors: string[]
) {
  if (!hasText(record[field])) {
    errors.push(`${label} is required.`);
  }
}

function optionalRecordText(
  record: Record<string, unknown>,
  field: string,
  label: string,
  errors: string[]
) {
  if (record[field] !== undefined && !hasText(record[field])) {
    errors.push(`${label} must be a non-empty string when provided.`);
  }
}

function textArray(
  value: unknown,
  label: string,
  errors: string[],
  minimum = 0
): string[] {
  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array.`);
    return [];
  }

  if (value.length < minimum) {
    errors.push(`${label} must include at least one item.`);
  }

  const values: string[] = [];
  value.forEach((item, index) => {
    if (!hasText(item)) {
      errors.push(`${label} item ${index + 1} must be a non-empty string.`);
      return;
    }
    values.push(item);
  });

  return values;
}

function recordArray(
  value: unknown,
  label: string,
  errors: string[]
): Array<{ record: Record<string, unknown>; index: number }> {
  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array.`);
    return [];
  }

  const records: Array<{
    record: Record<string, unknown>;
    index: number;
  }> = [];
  value.forEach((item, index) => {
    if (!isRecord(item)) {
      errors.push(`${label} item ${index + 1} must be an object.`);
      return;
    }
    records.push({ record: item, index });
  });

  return records;
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

export function sortBrandArticlesNewestFirst<
  T extends Pick<BrandTaggedArticle, "slug" | "sortDate">
>(articles: readonly T[]): T[] {
  return articles
    .map((article, index) => ({
      article,
      index,
      timestamp: Date.parse(article.sortDate)
    }))
    .sort((a, b) => {
      const aValid = Number.isFinite(a.timestamp);
      const bValid = Number.isFinite(b.timestamp);

      if (aValid && bValid && a.timestamp !== b.timestamp) {
        return b.timestamp - a.timestamp;
      }
      if (aValid !== bValid) return aValid ? -1 : 1;

      const slugOrder = a.article.slug.localeCompare(b.article.slug);
      return slugOrder || a.index - b.index;
    })
    .map(({ article }) => article);
}

function sortArticles(articles: BrandTaggedArticle[]) {
  return sortBrandArticlesNewestFirst(articles);
}

export function normalizeBrandSlugs(value: unknown): string[] {
  const values = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];

  return [...new Set(
    values
      .map((item) => String(item).trim().toLowerCase())
      .filter((item) => slugPattern.test(item))
  )];
}

export function getBrandProfiles(): unknown[] {
  const directory = brandProfilesDirectory();
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(directory, filename), "utf8")) as unknown;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Could not parse brand profile ${filename}: ${message}`);
      }
    })
    .sort((a, b) => {
      const aName = isRecord(a) ? String(a.name ?? "") : "";
      const bName = isRecord(b) ? String(b.name ?? "") : "";
      return aName.localeCompare(bName);
    });
}

export function validateBrandProfile(profile: unknown, articles: BrandTaggedArticle[]): string[] {
  const errors: string[] = [];
  if (!isRecord(profile)) {
    return ["profile must be an object."];
  }
  const candidate = profile;
  const requiredFields = [
    ["slug", "slug"],
    ["name", "name"],
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
  ] as const;

  for (const [field, label] of requiredFields) {
    recordText(candidate, field, label, errors);
  }

  if (candidate.status !== "draft" && candidate.status !== "published") {
    errors.push("status must be draft or published.");
  }

  const legalName = normalizeOptionalBrandText(candidate.legalName);
  const legalEntityNote = normalizeOptionalBrandText(candidate.legalEntityNote);

  if (candidate.legalName !== undefined && !legalName) {
    errors.push("legalName must be a non-empty string when provided.");
  }
  if (candidate.legalEntityNote !== undefined && !legalEntityNote) {
    errors.push("legalEntityNote must be a non-empty string when provided.");
  }
  if (!legalName && !legalEntityNote) {
    errors.push("legalName or legalEntityNote is required.");
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

  textArray(candidate.aliases, "aliases", errors);

  optionalRecordText(candidate, "heroImage", "heroImage", errors);
  optionalRecordText(candidate, "heroImageAlt", "heroImageAlt", errors);
  optionalRecordText(candidate, "heroImageCaption", "heroImageCaption", errors);
  if (hasText(candidate.heroImage) && !hasText(candidate.heroImageAlt)) {
    errors.push("heroImageAlt is required when heroImage is provided.");
  }

  const logoFields = ["logoImage", "logoImageAlt", "logoSourceUrl"] as const;
  for (const field of logoFields) {
    if (candidate.status === "published" && candidate[field] === undefined) {
      errors.push(`${field} is required for published profiles.`);
    } else if (candidate[field] !== undefined && !hasText(candidate[field])) {
      errors.push(`${field} must be a non-empty string when provided.`);
    }
  }
  if (hasText(candidate.logoImage) && !candidate.logoImage.startsWith("/images/")) {
    errors.push("logoImage must begin with /images/.");
  }
  if (hasText(candidate.logoSourceUrl) && !isValidHttpUrl(candidate.logoSourceUrl)) {
    errors.push("logoSourceUrl must be a valid HTTP(S) URL.");
  }

  const visualRecords = recordArray(
    candidate.contentVisuals,
    "contentVisuals",
    errors
  );
  if (
    Array.isArray(candidate.contentVisuals)
    && (candidate.contentVisuals.length < 2 || candidate.contentVisuals.length > 3)
  ) {
    errors.push("contentVisuals must include 2 or 3 items.");
  }
  const visualPlacements = new Set<BrandVisualPlacement>([
    "ownership",
    "portfolio",
    "operations",
    "competition"
  ]);
  visualRecords.forEach(({ record: visual, index }) => {
    const label = `contentVisuals item ${index + 1}`;
    if (
      !hasText(visual.placement)
      || !visualPlacements.has(visual.placement as BrandVisualPlacement)
    ) {
      errors.push(
        `${label} placement must be ownership, portfolio, operations, or competition.`
      );
    }
    recordText(visual, "src", `${label} src`, errors);
    if (hasText(visual.src) && !visual.src.startsWith("/images/")) {
      errors.push(`${label} src must begin with /images/.`);
    }
    recordText(visual, "alt", `${label} alt`, errors);
    recordText(visual, "caption", `${label} caption`, errors);
  });

  if (!isRecord(candidate.ownership)) {
    errors.push("ownership must be an object.");
  } else {
    recordText(candidate.ownership, "summary", "ownership.summary", errors);
    optionalRecordText(
      candidate.ownership,
      "parentCompany",
      "ownership.parentCompany",
      errors
    );
  }

  if (!Array.isArray(candidate.leadership)) {
    errors.push("leadership must be an array.");
  } else {
    candidate.leadership.forEach((item, index) => {
      const label = `leadership item ${index + 1}`;
      if (!isRecord(item)) {
        errors.push(`${label} must be an object.`);
        return;
      }
      recordText(item, "name", `${label} name`, errors);
      recordText(item, "role", `${label} role`, errors);
      optionalRecordText(item, "context", `${label} context`, errors);
      if (item.portrait !== undefined) {
        if (!isRecord(item.portrait)) {
          errors.push(`${label} portrait must be an object.`);
          return;
        }

        const portrait = item.portrait;
        recordText(portrait, "src", `${label} portrait src`, errors);
        recordText(portrait, "alt", `${label} portrait alt`, errors);
        recordText(portrait, "credit", `${label} portrait credit`, errors);
        recordText(
          portrait,
          "sourceUrl",
          `${label} portrait sourceUrl`,
          errors
        );
        optionalRecordText(
          portrait,
          "objectPosition",
          `${label} portrait objectPosition`,
          errors
        );

        if (
          hasText(portrait.src)
          && hasText(candidate.slug)
          && !portrait.src.startsWith(`/images/brands/${candidate.slug}/`)
        ) {
          errors.push(
            `${label} portrait src must begin with /images/brands/${candidate.slug}/.`
          );
        }
        if (
          hasText(portrait.sourceUrl)
          && !isValidHttpsUrl(portrait.sourceUrl)
        ) {
          errors.push(`${label} portrait sourceUrl must be a valid HTTPS URL.`);
        }
      }
    });
  }

  if (!Array.isArray(candidate.productPortfolio)) {
    errors.push("productPortfolio must be an array.");
  } else {
    if (candidate.productPortfolio.length === 0) {
      errors.push("productPortfolio must include at least one item.");
    }
    candidate.productPortfolio.forEach((item, index) => {
      const label = `productPortfolio item ${index + 1}`;
      if (!isRecord(item)) {
        errors.push(`${label} must be an object.`);
        return;
      }
      recordText(item, "name", `${label} name`, errors);
      recordText(item, "positioning", `${label} positioning`, errors);
      optionalRecordText(
        item,
        "buyerRelevance",
        `${label} buyerRelevance`,
        errors
      );
    });
  }

  const manufacturingRecords = recordArray(
    candidate.manufacturingSupplyChain,
    "manufacturingSupplyChain",
    errors
  );
  if (
    Array.isArray(candidate.manufacturingSupplyChain)
    && candidate.manufacturingSupplyChain.length === 0
  ) {
    errors.push("manufacturingSupplyChain must include at least one item.");
  }
  manufacturingRecords.forEach(({ record: item, index }) => {
    const label = `manufacturingSupplyChain item ${index + 1}`;
    recordText(item, "evidence", `${label} evidence`, errors);
    recordText(item, "scope", `${label} scope`, errors);
    recordText(item, "buyerCheck", `${label} buyerCheck`, errors);
  });

  const marketRecords = recordArray(
    candidate.marketsChannels,
    "marketsChannels",
    errors
  );
  if (
    Array.isArray(candidate.marketsChannels)
    && candidate.marketsChannels.length === 0
  ) {
    errors.push("marketsChannels must include at least one item.");
  }
  marketRecords.forEach(({ record: item, index }) => {
    const label = `marketsChannels item ${index + 1}`;
    recordText(item, "evidence", `${label} evidence`, errors);
    recordText(item, "scope", `${label} scope`, errors);
    recordText(item, "buyerCheck", `${label} buyerCheck`, errors);
  });

  if (!isRecord(candidate.competitivePosition)) {
    errors.push("competitivePosition must be an object.");
  } else {
    recordText(
      candidate.competitivePosition,
      "summary",
      "competitivePosition.summary",
      errors
    );
    const competitorSlugs = textArray(
      candidate.competitivePosition.competitorSlugs,
      "competitivePosition.competitorSlugs",
      errors
    );
    competitorSlugs.forEach((slug, index) => {
      if (!slugPattern.test(slug)) {
        errors.push(
          `competitivePosition.competitorSlugs item ${index + 1} must use lowercase kebab-case.`
        );
      }
    });
  }

  const sourceRecords: Array<{
    source: Record<string, unknown>;
    index: number;
  }> = [];
  if (!Array.isArray(candidate.sources)) {
    errors.push("sources must be an array.");
  } else {
    candidate.sources.forEach((source, index) => {
      if (!isRecord(source)) {
        errors.push(`source ${index + 1} must be an object.`);
        return;
      }
      sourceRecords.push({ source, index });
    });
  }

  sourceRecords.forEach(({ source, index }) => {
    const sourceNumber = index + 1;

    for (const field of ["id", "title", "publisher", "accessedAt"] as const) {
      if (!hasText(source[field])) {
        errors.push(`source ${sourceNumber} ${field} is required.`);
      }
    }
    if (!isValidHttpUrl(source.url)) {
      errors.push(`source ${sourceNumber} url must be a valid HTTP(S) URL.`);
    }
    if (hasText(source.accessedAt) && !isValidDate(source.accessedAt)) {
      errors.push(`source ${sourceNumber} accessedAt must be a valid date.`);
    }
    if (source.publishedAt !== undefined && !isValidDate(source.publishedAt)) {
      errors.push(`source ${sourceNumber} publishedAt must be a valid date.`);
    }
  });

  const sourceIds = sourceRecords.map(({ source }) => source.id).filter(hasText);
  const duplicateSourceIds = sourceIds.filter((id, index) => sourceIds.indexOf(id) !== index);
  if (duplicateSourceIds.length > 0) {
    errors.push("source IDs must be unique.");
  }

  const validSourceUrls = new Set(
    sourceRecords
      .filter(({ source }) => isValidHttpUrl(source.url))
      .map(({ source }) => new URL(String(source.url)).href)
  );
  if (validSourceUrls.size < 3) {
    errors.push("At least three unique valid HTTP(S) sources are required.");
  }

  const declaredSourceIds = new Set(sourceIds);
  const developmentRecords: Array<{
    development: Record<string, unknown>;
    index: number;
  }> = [];
  if (!Array.isArray(candidate.developments)) {
    errors.push("developments must be an array.");
  } else {
    candidate.developments.forEach((development, index) => {
      if (!isRecord(development)) {
        errors.push(`development ${index + 1} must be an object.`);
        return;
      }
      developmentRecords.push({ development, index });
    });
  }

  developmentRecords.forEach(({ development, index }) => {
    recordText(development, "title", `development ${index + 1} title`, errors);
    recordText(development, "summary", `development ${index + 1} summary`, errors);
    if (!isValidDate(development.date)) {
      errors.push(`development ${index + 1} date must be a valid date.`);
    }

    const developmentSourceIds = textArray(
      development.sourceIds,
      `development ${index + 1} sourceIds`,
      errors,
      1
    );
    if (developmentSourceIds.length === 0) {
      errors.push(`development ${index + 1} must reference at least one source.`);
    }

    for (const sourceId of developmentSourceIds) {
      if (!declaredSourceIds.has(sourceId)) {
        errors.push(`development ${index + 1} references unknown source ID: ${sourceId}.`);
      }
    }
  });

  const slug = hasText(candidate.slug) ? candidate.slug : "";
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
  return getBrandProfiles().filter(
    (profile): profile is BrandProfile => (
      isRecord(profile)
      && profile.status === "published"
      && validateBrandProfile(profile, articles).length === 0
    )
  );
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

export function sortBrandDevelopmentsNewestFirst(
  developments: BrandProfile["developments"]
): BrandProfile["developments"] {
  return [...developments].sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date)
  );
}

export function buildBrandCompetitorReferences(
  competitorSlugs: string[],
  allowedCompetitorSlugs: ReadonlySet<string>
): BrandCompetitorReference[] {
  return competitorSlugs.map((slug) => (
    allowedCompetitorSlugs.has(slug)
      ? { slug, href: `/brands/${slug}` }
      : { slug }
  ));
}

export function buildBrandStaticParams(profiles: readonly BrandProfile[]) {
  return profiles.map(({ slug }) => ({ slug }));
}

export function buildBrandSitemapEntries(
  profiles: readonly BrandProfile[],
  siteUrl: string
) {
  return profiles.map((profile) => ({
    url: `${siteUrl}/brands/${profile.slug}`,
    lastModified: profile.lastModified
  }));
}

export function buildBrandDirectorySchemas(
  profiles: BrandProfile[],
  siteUrl: string
): object[] {
  const directoryUrl = `${siteUrl}/brands`;
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "World Clean Biz Brand Intelligence",
    numberOfItems: profiles.length,
    itemListElement: profiles.map((profile, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: profile.name,
      url: `${directoryUrl}/${profile.slug}`
    }))
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": directoryUrl,
      name: "Cleaning Industry Brand Intelligence",
      description:
        "Independent company intelligence for cleaning-industry buyers, distributors and market professionals.",
      url: directoryUrl,
      mainEntity: itemList
    },
    itemList,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Brand Intelligence",
          item: directoryUrl
        }
      ]
    }
  ];
}

export function buildBrandPageSchemas(
  data: BrandPageData,
  siteUrl: string
): object[] {
  const { profile } = data;
  const pageUrl = `${siteUrl}/brands/${profile.slug}`;
  const legalName = normalizeOptionalBrandText(profile.legalName);

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageUrl,
      name: `${profile.name} Company Profile, Ownership, Products & Strategy`,
      description: profile.metaDescription,
      url: pageUrl,
      datePublished: profile.publishedAt,
      dateModified: profile.lastModified,
      ...(profile.heroImage ? { image: `${siteUrl}${profile.heroImage}` } : {}),
      about: { "@id": "#brand" }
    },
    {
      "@context": "https://schema.org",
      "@id": "#brand",
      "@type": "Organization",
      name: profile.name,
      ...(legalName ? { legalName } : {}),
      url: profile.officialWebsite,
      logo: `${siteUrl}${profile.logoImage}`
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Brand Intelligence",
          item: `${siteUrl}/brands`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: profile.name,
          item: pageUrl
        }
      ]
    }
  ];
}
