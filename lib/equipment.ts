import fs from "node:fs";
import path from "node:path";

export type EquipmentStatus = "draft" | "published";

export type EquipmentEvidence = {
  evidence: string;
  scope: string;
  sourceIds: string[];
  verifiedAt: string;
};

export type EquipmentAssessment = {
  assessment: string;
  basis: string;
  limitations: string;
  buyerAction: string;
  engineeringCheck?: string;
};

export type EquipmentSource = {
  id: string;
  title: string;
  publisher: string;
  sourceType: "manual" | "specification" | "manufacturer" | "standard" | "regulator" | "service" | "technical";
  url: string;
  publishedAt?: string;
  accessedAt: string;
};

export type EquipmentModelRelationship = EquipmentEvidence & {
  brandSlug: string;
  brandName: string;
  modelName: string;
  subtype: string;
  distinguishingSpecifications: string[];
  marketScope: string;
};

export type EquipmentContentVisualPlacement =
  | "equipment-types"
  | "application-fit"
  | "component-stack";

export type EquipmentContentVisual = {
  placement: EquipmentContentVisualPlacement;
  visualType: "official-photo" | "wcb-diagram";
  src: string;
  alt: string;
  caption: string;
  sourceUrl?: string;
  sourceIds?: string[];
  mobileSrc?: string;
};

export type EquipmentProfile = {
  status: EquipmentStatus;
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
  contentVisuals?: EquipmentContentVisual[];
  keyFacts: Array<EquipmentEvidence & { label: string; value: string }>;
  systemFlow: Array<EquipmentEvidence & { order: number; name: string; componentFamily: string; role: string }>;
  variants: Array<EquipmentEvidence & { name: string; taskScale: string; operatorRelationship: string; spaceConstraints: string; limitations: string }>;
  performanceMetrics: Array<EquipmentEvidence & { name: string; purchasingMeaning: string; reportingBoundary: string; comparisonCaution: string }>;
  applicationFit: Array<EquipmentEvidence & EquipmentAssessment & { application: string; wcbAssessment: string }>;
  componentStack: Array<EquipmentEvidence & { name: string; role: string; variants: string[]; criticalChecks: string[]; href?: string }>;
  representativeModels: EquipmentModelRelationship[];
  procurementDecisions: Array<EquipmentEvidence & EquipmentAssessment & { intendedTask: string; attributeToVerify: string; comparisonTrap: string }>;
  engineeringChecks: Array<EquipmentEvidence & { check: string; reason: string; buyerAction: string }>;
  standards: Array<EquipmentEvidence & { name: string; jurisdiction: string; version?: string; applicability: string }>;
  developments: Array<EquipmentEvidence & { date: string; title: string; summary: string }>;
  sources: EquipmentSource[];
  publishedAt: string;
  lastVerified: string;
  lastModified: string;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const sourceTypes = new Set([
  "manual", "specification", "manufacturer", "standard", "regulator", "service", "technical"
]);
const contentVisualPlacements = new Set<EquipmentContentVisualPlacement>([
  "equipment-types", "application-fit", "component-stack"
]);

function equipmentDirectory() {
  return path.join(process.cwd(), "content", "equipment");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isHttpUrl(value: unknown) {
  if (!hasText(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function textArray(value: unknown) {
  return Array.isArray(value) && value.length > 0 && value.every(hasText);
}

function validateEvidence(
  value: unknown,
  label: string,
  declaredSources: ReadonlySet<string>,
  errors: string[]
) {
  if (!isRecord(value)) {
    errors.push(`${label} must be an object.`);
    return;
  }
  for (const field of ["evidence", "scope", "verifiedAt"] as const) {
    if (!hasText(value[field])) errors.push(`${label} ${field} is required.`);
  }
  if (!datePattern.test(String(value.verifiedAt ?? ""))) {
    errors.push(`${label} verifiedAt must use YYYY-MM-DD.`);
  }
  if (!textArray(value.sourceIds)) {
    errors.push(`${label} sourceIds must contain at least one source.`);
  } else {
    for (const sourceId of value.sourceIds as string[]) {
      if (!declaredSources.has(sourceId)) errors.push(`${label} references unknown source ID: ${sourceId}.`);
    }
  }
}

function requireFields(value: unknown, label: string, fields: string[], errors: string[]) {
  if (!isRecord(value)) {
    errors.push(`${label} must be an object.`);
    return;
  }
  for (const field of fields) {
    if (!hasText(value[field])) errors.push(`${label} ${field} is required.`);
  }
}

export function getEquipmentProfiles(): unknown[] {
  const directory = equipmentDirectory();
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(directory, filename), "utf8")) as unknown;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Could not parse equipment profile ${filename}: ${message}`);
      }
    })
    .sort((a, b) => String(isRecord(a) ? a.name ?? "" : "").localeCompare(String(isRecord(b) ? b.name ?? "" : "")));
}

export function validateEquipmentProfile(
  profile: unknown,
  publishedBrandSlugs: ReadonlySet<string>
): string[] {
  const errors: string[] = [];
  if (!isRecord(profile)) return ["profile must be an object."];

  const required = [
    "slug", "name", "definition", "headline", "description", "metaDescription", "disclaimer",
    "heroImage", "heroImageAlt", "heroImageCaption", "heroSourceUrl",
    "publishedAt", "lastVerified", "lastModified"
  ];
  requireFields(profile, "profile", required, errors);
  if (profile.status !== "draft" && profile.status !== "published") errors.push("status must be draft or published.");
  if (!hasText(profile.slug) || !slugPattern.test(profile.slug)) errors.push("slug must use lowercase kebab-case.");
  for (const field of ["aliases", "includedScope", "excludedScope", "primaryApplications"] as const) {
    if (!textArray(profile[field])) errors.push(`${field} must contain at least one text item.`);
  }
  if (!hasText(profile.heroImage) || !profile.heroImage.startsWith(`/images/equipment/${profile.slug}/`) || !profile.heroImage.endsWith(".webp")) {
    errors.push("heroImage must be a local WebP path inside the profile image directory.");
  }
  if (!isHttpUrl(profile.heroSourceUrl)) errors.push("heroSourceUrl must be a valid official HTTP(S) URL.");
  for (const field of ["publishedAt", "lastVerified", "lastModified"] as const) {
    if (!datePattern.test(String(profile[field] ?? ""))) errors.push(`${field} must use YYYY-MM-DD.`);
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
    if (!isHttpUrl(source.url)) errors.push(`${label} url must be HTTP(S).`);
    if (!sourceTypes.has(String(source.sourceType ?? ""))) errors.push(`${label} sourceType is not supported.`);
    if (!datePattern.test(String(source.accessedAt ?? ""))) errors.push(`${label} accessedAt must use YYYY-MM-DD.`);
  });

  const contentVisuals = Array.isArray(profile.contentVisuals) ? profile.contentVisuals : [];
  if (profile.status === "published" && (contentVisuals.length < 2 || contentVisuals.length > 3)) {
    errors.push("published profiles must declare two or three contentVisuals.");
  } else if (profile.contentVisuals !== undefined && (contentVisuals.length < 2 || contentVisuals.length > 3)) {
    errors.push("contentVisuals must contain two or three rows when provided.");
  }
  const visualPlacements = new Set<string>();
  contentVisuals.forEach((visual, index) => {
    const label = `contentVisuals row ${index + 1}`;
    requireFields(visual, label, ["placement", "visualType", "src", "alt", "caption"], errors);
    if (!isRecord(visual)) return;

    if (!contentVisualPlacements.has(visual.placement as EquipmentContentVisualPlacement)) {
      errors.push(`${label} placement is not supported.`);
    } else if (visualPlacements.has(String(visual.placement))) {
      errors.push(`${label} placement must be unique.`);
    } else {
      visualPlacements.add(String(visual.placement));
    }

    const localPrefix = `/images/equipment/${String(profile.slug ?? "")}/`;
    if (!hasText(visual.src) || !visual.src.startsWith(localPrefix)) {
      errors.push(`${label} src must be inside the profile image directory.`);
    }
    if (visual.mobileSrc !== undefined && (
      !hasText(visual.mobileSrc)
      || !visual.mobileSrc.startsWith(localPrefix)
      || !visual.mobileSrc.endsWith(".svg")
    )) {
      errors.push(`${label} mobileSrc must be a local SVG inside the profile image directory.`);
    }

    if (visual.visualType === "official-photo") {
      if (!hasText(visual.src) || !visual.src.endsWith(".webp")) {
        errors.push(`${label} official-photo src must be WebP.`);
      }
      if (!isHttpUrl(visual.sourceUrl)) {
        errors.push(`${label} sourceUrl must be a valid official HTTP(S) URL.`);
      }
    } else if (visual.visualType === "wcb-diagram") {
      if (!hasText(visual.src) || !visual.src.endsWith(".svg")) {
        errors.push(`${label} wcb-diagram src must be SVG.`);
      }
      if (!textArray(visual.sourceIds)) {
        errors.push(`${label} sourceIds must contain at least one source.`);
      } else {
        for (const sourceId of visual.sourceIds as string[]) {
          if (!sourceIds.has(sourceId)) errors.push(`${label} references unknown source ID: ${sourceId}.`);
        }
      }
      if (!hasText(visual.mobileSrc)) {
        errors.push(`${label} wcb-diagram mobileSrc is required.`);
      }
    } else {
      errors.push(`${label} visualType is not supported.`);
    }
  });

  const evidenceCollections = [
    "keyFacts", "systemFlow", "variants", "performanceMetrics", "applicationFit", "componentStack",
    "representativeModels", "procurementDecisions", "engineeringChecks", "standards", "developments"
  ] as const;
  for (const collection of evidenceCollections) {
    const rows = Array.isArray(profile[collection]) ? profile[collection] : [];
    if (rows.length === 0) errors.push(`${collection} must contain at least one row.`);
    rows.forEach((row, index) => validateEvidence(row, `${collection} row ${index + 1}`, sourceIds, errors));
  }

  const requiredCollectionFields: Record<string, string[]> = {
    keyFacts: ["label", "value"],
    systemFlow: ["name", "componentFamily", "role"],
    variants: ["name", "taskScale", "operatorRelationship", "spaceConstraints", "limitations"],
    performanceMetrics: ["name", "purchasingMeaning", "reportingBoundary", "comparisonCaution"],
    applicationFit: ["application", "wcbAssessment", "basis", "limitations", "buyerAction"],
    componentStack: ["name", "role"],
    procurementDecisions: ["intendedTask", "attributeToVerify", "comparisonTrap", "assessment", "basis", "limitations", "buyerAction"],
    engineeringChecks: ["check", "reason", "buyerAction"],
    standards: ["name", "jurisdiction", "applicability"],
    developments: ["date", "title", "summary"]
  };
  for (const [collection, fields] of Object.entries(requiredCollectionFields)) {
    const rows = Array.isArray(profile[collection]) ? profile[collection] : [];
    rows.forEach((row, index) => requireFields(row, `${collection} row ${index + 1}`, fields, errors));
  }

  const systemOrders = new Set<number>();
  (Array.isArray(profile.systemFlow) ? profile.systemFlow : []).forEach((row, index) => {
    if (!isRecord(row) || !Number.isInteger(row.order) || Number(row.order) < 1) {
      errors.push(`systemFlow row ${index + 1} order must be a positive integer.`);
    } else if (systemOrders.has(Number(row.order))) {
      errors.push(`systemFlow row ${index + 1} order must be unique.`);
    } else {
      systemOrders.add(Number(row.order));
    }
  });

  (Array.isArray(profile.componentStack) ? profile.componentStack : []).forEach((row, index) => {
    if (!isRecord(row) || !textArray(row.variants)) errors.push(`componentStack row ${index + 1} variants is required.`);
    if (!isRecord(row) || !textArray(row.criticalChecks)) errors.push(`componentStack row ${index + 1} criticalChecks is required.`);
  });

  (Array.isArray(profile.developments) ? profile.developments : []).forEach((row, index) => {
    if (!isRecord(row) || !datePattern.test(String(row.date ?? ""))) {
      errors.push(`developments row ${index + 1} date must use YYYY-MM-DD.`);
    }
  });

  const assessmentCollections = ["applicationFit", "procurementDecisions"] as const;
  for (const collection of assessmentCollections) {
    const rows = Array.isArray(profile[collection]) ? profile[collection] : [];
    rows.forEach((row, index) => {
      requireFields(row, `${collection} row ${index + 1}`, ["basis", "limitations", "buyerAction"], errors);
      if (isRecord(row) && !hasText(row.assessment) && !hasText(row.wcbAssessment)) {
        errors.push(`${collection} row ${index + 1} assessment is required.`);
      }
    });
  }

  const models = Array.isArray(profile.representativeModels) ? profile.representativeModels : [];
  if (models.length < 6 || models.length > 8) errors.push("representativeModels must contain 6–8 rows.");
  const modelBrands = new Set<string>();
  models.forEach((model, index) => {
    requireFields(model, `representativeModels row ${index + 1}`, ["brandSlug", "brandName", "modelName", "subtype", "marketScope"], errors);
    if (!isRecord(model)) return;
    if (!textArray(model.distinguishingSpecifications)) errors.push(`representativeModels row ${index + 1} distinguishingSpecifications is required.`);
    if (hasText(model.brandSlug)) {
      modelBrands.add(model.brandSlug);
      if (!publishedBrandSlugs.has(model.brandSlug)) errors.push(`representativeModels row ${index + 1} must link to a published brand.`);
    }
  });
  if (modelBrands.size < 4) errors.push("representativeModels must cover at least four published brands.");

  const components = Array.isArray(profile.componentStack) ? profile.componentStack : [];
  components.forEach((component, index) => {
    if (isRecord(component) && component.href !== undefined) {
      errors.push(`componentStack row ${index + 1} component links are not allowed until a published component profile exists.`);
    }
  });

  return errors;
}

export function getPublishedEquipmentProfiles(
  publishedBrandSlugs: ReadonlySet<string>
): EquipmentProfile[] {
  return getEquipmentProfiles().filter((profile): profile is EquipmentProfile => (
    isRecord(profile)
    && profile.status === "published"
    && validateEquipmentProfile(profile, publishedBrandSlugs).length === 0
  ));
}

export function isEquipmentDraftVisible(vercelEnvironment: string | undefined): boolean {
  return vercelEnvironment !== "production";
}

export function getEquipmentPageData(
  slug: string,
  publishedBrandSlugs: ReadonlySet<string>,
  options: { includeDrafts?: boolean } = {}
): EquipmentProfile | undefined {
  return getEquipmentProfiles().find((profile): profile is EquipmentProfile => (
    isRecord(profile)
    && profile.slug === slug
    && validateEquipmentProfile(profile, publishedBrandSlugs).length === 0
    && (profile.status === "published" || options.includeDrafts === true)
  ));
}

export function buildEquipmentStaticParams(profiles: readonly EquipmentProfile[]) {
  return profiles.map(({ slug }) => ({ slug }));
}

export function buildEquipmentSitemapEntries(profiles: readonly EquipmentProfile[], siteUrl: string) {
  return profiles.map((profile) => ({
    url: `${siteUrl}/equipment/${profile.slug}`,
    lastModified: profile.lastModified
  }));
}

export function buildEquipmentPageTitle(profile: EquipmentProfile) {
  return `${profile.name} Technical Profile: Types, Specs, Parts & Buyer Checks`;
}

export function buildEquipmentPageSchemas(profile: EquipmentProfile, siteUrl: string): object[] {
  const pageUrl = `${siteUrl}/equipment/${profile.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageUrl,
      name: buildEquipmentPageTitle(profile),
      description: profile.metaDescription,
      url: pageUrl,
      datePublished: profile.publishedAt,
      dateModified: profile.lastModified,
      image: `${siteUrl}${profile.heroImage}`,
      about: { "@id": `${pageUrl}#equipment` }
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${pageUrl}#equipment`,
      name: profile.name,
      description: profile.definition,
      category: "Professional cleaning equipment"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Equipment Intelligence", item: `${siteUrl}/equipment` },
        { "@type": "ListItem", position: 3, name: profile.name, item: pageUrl }
      ]
    }
  ];
}
