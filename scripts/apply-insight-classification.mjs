import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const insightsDirectory = path.join(root, "content", "insights");
const auditPath = path.join(
  root,
  "docs",
  "superpowers",
  "audits",
  "2026-07-26-insight-classification.json"
);

const priorities = new Map([
  ["robot-vacuum-distributor-dealer-guide", 10],
  ["robotic-pool-cleaner-distributor-dealer-guide", 20],
  ["robotic-pool-cleaner-manufacturing-cost", 30],
  ["cordless-vacuum-cleaner-oem-odm-guide", 40],
  ["factory-audit-cleaning-appliance-suppliers-china", 50],
  ["robot-lawn-mower-buying-guide", 60]
]);

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return null;

  const values = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^"|"$/g, "");
    values[key] = value;
  }

  return {
    block: match[1],
    fullMatch: match[0],
    values
  };
}

function searchLike(title, slug) {
  const text = `${title} ${slug}`.toLowerCase();
  return /\bwho owns\b|\bwho makes\b|\bwhat brands does\b|\bwhere (?:are|is).+made\b|\bis .+ owned by\b|\bvs\.?\b|\bversus\b|\bbuying guide\b|\bbuyer'?s guide\b|\bmanufacturing cost\b|\boem\b|\bodm\b|\bsupplier audit\b|\bfactory audit\b|\bdistributor guide\b|\bhow (?:long|much|often|to|.+ work)\b|\bwhat is\b|\bnot (?:picking up|dispensing)\b|\btroubleshoot/.test(
    text
  );
}

function classifyContent(frontmatter, title, slug) {
  if (frontmatter.delivery_format === "article") {
    return { contentClass: "editorial", reason: "delivery_format_article" };
  }
  if (frontmatter.delivery_format === "wcb_search_article") {
    return { contentClass: "search", reason: "delivery_format_wcb_search_article" };
  }
  if (searchLike(title, slug)) {
    return { contentClass: "search", reason: "search_intent_title" };
  }
  return { contentClass: "editorial", reason: "editorial_archive_default" };
}

function classifyGuideType(title, slug) {
  const text = `${title} ${slug}`.toLowerCase();
  if (
    /\bwho owns\b|\bwho makes\b|\bwhere (?:are|is).+made\b|\bis .+ owned by\b|\bwhat brands does\b/.test(
      text
    )
  ) {
    return "ownership";
  }
  if (/\bvs\.?\b|\bversus\b|\bcompare\b|\bcomparison\b/.test(text)) {
    return "comparison";
  }
  if (
    /\boem\b|\bodm\b|\bmanufactur|\bsupplier\b|\bfactory audit\b|\bdistributor\b|\blanded cost\b/.test(
      text
    )
  ) {
    return "sourcing";
  }
  if (
    /\bmaintenance\b|\bnot (?:picking up|dispensing)\b|\btroubleshoot|\brepair\b|\bhow long\b|\bcleaning cycle\b/.test(
      text
    )
  ) {
    return "maintenance";
  }
  if (
    /\bbuying guide\b|\bbuyer'?s guide\b|\bbest\b|\bfor pet hair\b|\bfor small yards\b/.test(
      text
    )
  ) {
    return "buying";
  }
  return "explainer";
}

function addFields(block, fields) {
  const lines = block.split("\n");
  const insertAt = lines.findIndex((line) => line.startsWith("article_type:"));
  const index = insertAt >= 0 ? insertAt : lines.length;
  lines.splice(index, 0, ...fields);
  return lines.join("\n");
}

const audit = {
  generatedAt: "2026-07-26",
  total: 0,
  editorialCount: 0,
  searchCount: 0,
  unclassifiedCount: 0,
  editorial: [],
  search: [],
  unclassified: []
};

const files = fs
  .readdirSync(insightsDirectory)
  .filter((file) => file.endsWith(".mdx"))
  .sort();

for (const file of files) {
  const filePath = path.join(insightsDirectory, file);
  const source = fs.readFileSync(filePath, "utf8");
  const parsed = parseFrontmatter(source);
  const slug = file.replace(/\.mdx$/, "");

  if (!parsed || !parsed.values.title) {
    audit.unclassified.push({ slug, reason: "missing_frontmatter_or_title" });
    continue;
  }

  if (String(parsed.values.hidden || "false").toLowerCase() === "true") {
    continue;
  }

  const inferred = classifyContent(parsed.values, parsed.values.title, slug);
  const existingClass = parsed.values.content_class;
  const contentClass =
    existingClass === "editorial" || existingClass === "search"
      ? existingClass
      : inferred.contentClass;
  const guideType =
    contentClass === "search"
      ? parsed.values.guide_type || classifyGuideType(parsed.values.title, slug)
      : undefined;
  const priority = priorities.get(slug);
  const fields = [];

  if (!existingClass) fields.push(`content_class: "${contentClass}"`);
  if (contentClass === "search" && !parsed.values.guide_type) {
    fields.push(`guide_type: "${guideType}"`);
  }
  if (priority && !parsed.values.guide_priority) {
    fields.push(`guide_priority: ${priority}`);
  }

  if (fields.length) {
    const nextBlock = addFields(parsed.block, fields);
    const nextSource = source.replace(parsed.fullMatch, `---\n${nextBlock}\n---\n`);
    fs.writeFileSync(filePath, nextSource);
  }

  audit.total += 1;
  const record = {
    slug,
    reason: existingClass ? "existing_explicit_class" : inferred.reason,
    ...(guideType ? { guideType } : {}),
    ...(priority ? { guidePriority: priority } : {})
  };
  audit[contentClass].push(record);
  audit[`${contentClass}Count`] += 1;
}

audit.unclassifiedCount = audit.unclassified.length;
fs.mkdirSync(path.dirname(auditPath), { recursive: true });
fs.writeFileSync(auditPath, `${JSON.stringify(audit, null, 2)}\n`);

console.log(
  `Classified ${audit.total} insights: ${audit.editorialCount} editorial, ${audit.searchCount} search, ${audit.unclassifiedCount} unclassified.`
);

if (audit.unclassifiedCount > 0) {
  process.exitCode = 1;
}
