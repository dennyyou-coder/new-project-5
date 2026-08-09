import fs from "node:fs";
import path from "node:path";

export type ComponentStatus = "draft" | "published";
export type ComponentVisualPlacement =
  | "architecture-families"
  | "performance-boundaries"
  | "application-context"
  | "compatibility-gate";

export type ComponentEvidence = {
  evidence: string;
  scope: string;
  sourceIds: string[];
  verifiedAt: string;
};

export type ComponentAssessment = {
  assessment: string;
  basis: string;
  limitations: string;
  buyerAction: string;
  engineeringCheck?: string;
};

export type ComponentSource = {
  id: string;
  title: string;
  publisher: string;
  sourceType: "manufacturer" | "datasheet" | "manual" | "standard" | "regulator" | "service" | "technical";
  url: string;
  publishedAt?: string;
  accessedAt: string;
};

export type ComponentContentVisual = {
  placement: ComponentVisualPlacement;
  visualType: "official-photo" | "wcb-diagram";
  src: string;
  mobileSrc?: string;
  alt: string;
  caption: string;
  sourceUrl?: string;
  sourceIds?: string[];
};

export type ComponentProfile = {
  status: ComponentStatus;
  slug: string;
  name: string;
  aliases: string[];
  definition: string;
  includedScope: string[];
  excludedScope: string[];
  primaryApplications: string[];
  headline: string;
  description: string;
  metaDescription: string;
  disclaimer: string;
  heroImage: string;
  heroImageAlt: string;
  heroImageCaption: string;
  heroSourceUrl: string;
  contentVisuals: ComponentContentVisual[];
  keyFacts: Array<ComponentEvidence & { label: string; value: string }>;
  systemRole: Array<ComponentEvidence & { order: number; name: string; role: string }>;
  architectures: Array<ComponentEvidence & {
    name: string;
    operatingPrinciple: string;
    applicationBoundary: string;
    benefits: string[];
    limitations: string[];
    buyerCheck: string;
  }>;
  specifications: Array<ComponentEvidence & {
    name: string;
    purchasingMeaning: string;
    reportingBoundary: string;
    comparisonCaution: string;
  }>;
  applicationMatrix: Array<ComponentEvidence & ComponentAssessment & { application: string; wcbAssessment: string }>;
  compatibilityChecks: Array<ComponentEvidence & { check: string; requiredMatch: string; why: string; buyerAction: string }>;
  failureModes: Array<ComponentEvidence & { symptom: string; possibleCauses: string[]; safetyBoundary: string; serviceAction: string }>;
  representativeFamilies: Array<ComponentEvidence & {
    manufacturer: string;
    familyName: string;
    architecture: string;
    applicationScope: string;
    distinguishingSpecifications: string[];
    marketScope: string;
  }>;
  procurementDecisions: Array<ComponentEvidence & ComponentAssessment & {
    intendedUse: string;
    attributeToVerify: string;
    comparisonTrap: string;
  }>;
  engineeringChecks: Array<ComponentEvidence & { check: string; reason: string; buyerAction: string }>;
  standards: Array<ComponentEvidence & { name: string; jurisdiction: string; version?: string; applicability: string }>;
  developments: Array<ComponentEvidence & { date: string; title: string; summary: string }>;
  sources: ComponentSource[];
  publishedAt: string;
  lastVerified: string;
  lastModified: string;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const sourceTypes = new Set(["manufacturer", "datasheet", "manual", "standard", "regulator", "service", "technical"]);
const visualPlacements = new Set<ComponentVisualPlacement>([
  "architecture-families", "performance-boundaries", "application-context", "compatibility-gate"
]);

function componentDirectory() {
  return path.join(process.cwd(), "content", "components");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function textArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(hasText);
}

function isHttpUrl(value: unknown) {
  if (!hasText(value)) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function requireFields(value: unknown, label: string, fields: string[], errors: string[]) {
  if (!isRecord(value)) {
    errors.push(`${label} must be an object.`);
    return;
  }
  for (const field of fields) if (!hasText(value[field])) errors.push(`${label} ${field} is required.`);
}

function validateEvidence(value: unknown, label: string, sources: ReadonlySet<string>, errors: string[]) {
  requireFields(value, label, ["evidence", "scope", "verifiedAt"], errors);
  if (!isRecord(value)) return;
  if (!datePattern.test(String(value.verifiedAt ?? ""))) errors.push(`${label} verifiedAt must use YYYY-MM-DD.`);
  if (!textArray(value.sourceIds)) {
    errors.push(`${label} sourceIds must contain at least one source.`);
  } else {
    for (const sourceId of value.sourceIds) if (!sources.has(sourceId)) errors.push(`${label} references unknown source ID: ${sourceId}.`);
  }
}

export function getComponentProfiles(): unknown[] {
  const directory = componentDirectory();
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(directory, filename), "utf8")) as unknown;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Could not parse component profile ${filename}: ${message}`);
      }
    })
    .sort((a, b) => String(isRecord(a) ? a.name ?? "" : "").localeCompare(String(isRecord(b) ? b.name ?? "" : "")));
}

export function validateComponentProfile(profile: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(profile)) return ["profile must be an object."];

  requireFields(profile, "profile", [
    "slug", "name", "definition", "headline", "description", "metaDescription", "disclaimer",
    "heroImage", "heroImageAlt", "heroImageCaption", "heroSourceUrl", "publishedAt", "lastVerified", "lastModified"
  ], errors);
  if (profile.status !== "draft" && profile.status !== "published") errors.push("status must be draft or published.");
  if (!hasText(profile.slug) || !slugPattern.test(profile.slug)) errors.push("slug must use lowercase kebab-case.");
  for (const field of ["aliases", "includedScope", "excludedScope", "primaryApplications"]) {
    if (!textArray(profile[field])) errors.push(`${field} must contain at least one text item.`);
  }
  const localPrefix = `/images/components/${String(profile.slug ?? "")}/`;
  if (!hasText(profile.heroImage) || !profile.heroImage.startsWith(localPrefix) || !profile.heroImage.endsWith(".webp")) {
    errors.push("heroImage must be a local WebP path inside the profile image directory.");
  }
  if (!isHttpUrl(profile.heroSourceUrl)) errors.push("heroSourceUrl must be a valid official HTTP(S) URL.");
  for (const field of ["publishedAt", "lastVerified", "lastModified"]) {
    if (!datePattern.test(String(profile[field] ?? ""))) errors.push(`${field} must use YYYY-MM-DD.`);
  }
  if (!/physical resemblance/i.test(String(profile.disclaimer ?? "")) || !/matching wattage/i.test(String(profile.disclaimer ?? ""))) {
    errors.push("disclaimer must state the compatibility boundary for physical resemblance and matching wattage.");
  }

  const sources = Array.isArray(profile.sources) ? profile.sources : [];
  if (sources.length < 5) errors.push("profile must declare at least five sources.");
  const sourceIds = new Set<string>();
  sources.forEach((source, index) => {
    const label = `source ${index + 1}`;
    requireFields(source, label, ["id", "title", "publisher", "sourceType", "url", "accessedAt"], errors);
    if (!isRecord(source)) return;
    if (hasText(source.id)) {
      if (sourceIds.has(source.id)) errors.push(`${label} ID must be unique.`);
      sourceIds.add(source.id);
    }
    if (!sourceTypes.has(String(source.sourceType ?? ""))) errors.push(`${label} sourceType is not supported.`);
    if (!isHttpUrl(source.url)) errors.push(`${label} url must be HTTP(S).`);
    if (!datePattern.test(String(source.accessedAt ?? ""))) errors.push(`${label} accessedAt must use YYYY-MM-DD.`);
  });

  const visuals = Array.isArray(profile.contentVisuals) ? profile.contentVisuals : [];
  if (visuals.length < 3 || visuals.length > 5) errors.push("contentVisuals must contain three to five rows.");
  const usedPlacements = new Set<string>();
  visuals.forEach((visual, index) => {
    const label = `contentVisuals row ${index + 1}`;
    requireFields(visual, label, ["placement", "visualType", "src", "alt", "caption"], errors);
    if (!isRecord(visual)) return;
    if (!visualPlacements.has(visual.placement as ComponentVisualPlacement)) errors.push(`${label} placement is not supported.`);
    else if (usedPlacements.has(String(visual.placement))) errors.push(`${label} placement must be unique.`);
    else usedPlacements.add(String(visual.placement));
    if (!hasText(visual.src) || !visual.src.startsWith(localPrefix)) errors.push(`${label} src must be inside the profile image directory.`);
    if (visual.visualType === "official-photo") {
      if (!hasText(visual.src) || !visual.src.endsWith(".webp")) errors.push(`${label} official-photo src must be WebP.`);
      if (!isHttpUrl(visual.sourceUrl)) errors.push(`${label} sourceUrl must be a valid official HTTP(S) URL.`);
    } else if (visual.visualType === "wcb-diagram") {
      if (!hasText(visual.src) || !visual.src.endsWith(".svg")) errors.push(`${label} wcb-diagram src must be SVG.`);
      if (!hasText(visual.mobileSrc) || !visual.mobileSrc.startsWith(localPrefix) || !visual.mobileSrc.endsWith(".svg")) {
        errors.push(`${label} mobileSrc must be a local SVG inside the profile image directory.`);
      }
      if (!textArray(visual.sourceIds)) errors.push(`${label} sourceIds must contain at least one source.`);
      else for (const sourceId of visual.sourceIds) if (!sourceIds.has(sourceId)) errors.push(`${label} references unknown source ID: ${sourceId}.`);
    } else errors.push(`${label} visualType is not supported.`);
  });

  const collections = [
    "keyFacts", "systemRole", "architectures", "specifications", "applicationMatrix", "compatibilityChecks",
    "failureModes", "representativeFamilies", "procurementDecisions", "engineeringChecks", "standards", "developments"
  ] as const;
  for (const collection of collections) {
    const rows = Array.isArray(profile[collection]) ? profile[collection] : [];
    if (rows.length === 0) errors.push(`${collection} must contain at least one row.`);
    rows.forEach((row, index) => validateEvidence(row, `${collection} row ${index + 1}`, sourceIds, errors));
  }

  const fieldMap: Record<string, string[]> = {
    keyFacts: ["label", "value"],
    systemRole: ["name", "role"],
    architectures: ["name", "operatingPrinciple", "applicationBoundary", "buyerCheck"],
    specifications: ["name", "purchasingMeaning", "reportingBoundary", "comparisonCaution"],
    applicationMatrix: ["application", "wcbAssessment", "assessment", "basis", "limitations", "buyerAction"],
    compatibilityChecks: ["check", "requiredMatch", "why", "buyerAction"],
    failureModes: ["symptom", "safetyBoundary", "serviceAction"],
    representativeFamilies: ["manufacturer", "familyName", "architecture", "applicationScope", "marketScope"],
    procurementDecisions: ["intendedUse", "attributeToVerify", "comparisonTrap", "assessment", "basis", "limitations", "buyerAction"],
    engineeringChecks: ["check", "reason", "buyerAction"],
    standards: ["name", "jurisdiction", "applicability"],
    developments: ["date", "title", "summary"]
  };
  for (const [collection, fields] of Object.entries(fieldMap)) {
    const rows = Array.isArray(profile[collection]) ? profile[collection] : [];
    rows.forEach((row, index) => requireFields(row, `${collection} row ${index + 1}`, fields, errors));
  }

  const orders = new Set<number>();
  (Array.isArray(profile.systemRole) ? profile.systemRole : []).forEach((row, index) => {
    if (!isRecord(row) || !Number.isInteger(row.order) || Number(row.order) < 1) errors.push(`systemRole row ${index + 1} order must be a positive integer.`);
    else if (orders.has(Number(row.order))) errors.push(`systemRole row ${index + 1} order must be unique.`);
    else orders.add(Number(row.order));
  });
  (Array.isArray(profile.architectures) ? profile.architectures : []).forEach((row, index) => {
    if (!isRecord(row) || !textArray(row.benefits)) errors.push(`architectures row ${index + 1} benefits is required.`);
    if (!isRecord(row) || !textArray(row.limitations)) errors.push(`architectures row ${index + 1} limitations is required.`);
  });
  (Array.isArray(profile.failureModes) ? profile.failureModes : []).forEach((row, index) => {
    if (!isRecord(row) || !textArray(row.possibleCauses)) errors.push(`failureModes row ${index + 1} possibleCauses is required.`);
  });
  const families = Array.isArray(profile.representativeFamilies) ? profile.representativeFamilies : [];
  if (families.length < 6 || families.length > 8) errors.push("representativeFamilies must contain 6–8 rows.");
  const manufacturers = new Set<string>();
  families.forEach((row, index) => {
    if (!isRecord(row) || !textArray(row.distinguishingSpecifications)) errors.push(`representativeFamilies row ${index + 1} distinguishingSpecifications is required.`);
    if (isRecord(row) && hasText(row.manufacturer)) manufacturers.add(row.manufacturer);
  });
  if (families.length >= 6 && manufacturers.size < 3) errors.push("representativeFamilies must cover at least three manufacturers.");
  (Array.isArray(profile.developments) ? profile.developments : []).forEach((row, index) => {
    if (!isRecord(row) || !datePattern.test(String(row.date ?? ""))) errors.push(`developments row ${index + 1} date must use YYYY-MM-DD.`);
  });

  return errors;
}

export function getPublishedComponentProfiles(): ComponentProfile[] {
  return getComponentProfiles().filter((profile): profile is ComponentProfile => (
    isRecord(profile) && profile.status === "published" && validateComponentProfile(profile).length === 0
  ));
}

export function isComponentDraftVisible(vercelEnvironment: string | undefined): boolean {
  return vercelEnvironment !== "production";
}

export function getComponentPageData(slug: string, options: { includeDrafts?: boolean } = {}): ComponentProfile | undefined {
  return getComponentProfiles().find((profile): profile is ComponentProfile => (
    isRecord(profile)
    && profile.slug === slug
    && validateComponentProfile(profile).length === 0
    && (profile.status === "published" || options.includeDrafts === true)
  ));
}

export function buildComponentStaticParams(profiles: readonly ComponentProfile[]) {
  return profiles.map(({ slug }) => ({ slug }));
}

export function buildComponentSitemapEntries(profiles: readonly ComponentProfile[], siteUrl: string) {
  return profiles.map((profile) => ({ url: `${siteUrl}/components/${profile.slug}`, lastModified: profile.lastModified }));
}

export function buildComponentPageTitle(profile: ComponentProfile) {
  return `${profile.name}: Types, Specifications & Compatibility Checks`;
}

export function buildComponentPageSchemas(profile: ComponentProfile, siteUrl: string): object[] {
  const pageUrl = `${siteUrl}/components/${profile.slug}`;
  return [
    {
      "@context": "https://schema.org", "@type": "WebPage", "@id": pageUrl,
      name: buildComponentPageTitle(profile), description: profile.metaDescription, url: pageUrl,
      datePublished: profile.publishedAt, dateModified: profile.lastModified,
      image: `${siteUrl}${profile.heroImage}`, about: { "@id": `${pageUrl}#component` }
    },
    {
      "@context": "https://schema.org", "@type": "Product", "@id": `${pageUrl}#component`,
      name: profile.name, description: profile.definition, category: "Cleaning equipment component"
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Component Intelligence", item: `${siteUrl}/components` },
        { "@type": "ListItem", position: 3, name: profile.name, item: pageUrl }
      ]
    }
  ];
}
