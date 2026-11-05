import fs from "node:fs";
import path from "node:path";

const directory = path.join(process.cwd(), "content", "insights");
const allowedClasses = new Set(["editorial", "search"]);
const allowedGuideTypes = new Set([
  "buying",
  "ownership",
  "comparison",
  "sourcing",
  "maintenance",
  "explainer"
]);
const errors = [];

// Category values must be listed in CATEGORY_ALIASES (lib/categories.ts).
// Brand slugs referenced by articles that have no profile in content/brands yet.
// "breville", "dji", "ego" and "philips" name a wider company than the existing
// breville-sage, dji-romo, ego-power-plus and philips-home-appliances profiles,
// which are deliberately scoped; they stay unlinked until that is decided.
const PENDING_BRAND_PROFILES = new Set([
  "anthbot",
  "breville",
  "chervon",
  "dji",
  "ego",
  "einhell",
  "kingclean",
  "ninebot",
  "philips",
  "porter-cable",
  "segway",
  "snap-on",
  "stanley-black-decker",
  "switchbot",
  "versuni"
]);

const categoriesSource = fs.readFileSync(path.join(process.cwd(), "lib", "categories.ts"), "utf8");
const aliasBlock = categoriesSource.match(/const CATEGORY_ALIASES[^{]*\{([\s\S]*?)\n\};/)?.[1];
if (!aliasBlock) {
  console.error("lib/categories.ts: CATEGORY_ALIASES not found");
  process.exit(1);
}
const mappedCategories = new Set(
  Array.from(aliasBlock.matchAll(/^\s*(?:"([^"]+)"|([A-Za-z]+)):/gm), (match) => match[1] ?? match[2])
);
const brandProfiles = new Set(
  fs.readdirSync(path.join(process.cwd(), "content", "brands"))
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.replace(/\.json$/, ""))
);

for (const file of fs.readdirSync(directory).filter((name) => name.endsWith(".mdx")).sort()) {
  const relativePath = `content/insights/${file}`;
  const source = fs.readFileSync(path.join(directory, file), "utf8");
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n?/)?.[1];

  if (!frontmatter) {
    errors.push(`${relativePath}: missing frontmatter`);
    continue;
  }
  if (/^hidden:\s*"?true"?\s*$/m.test(frontmatter)) continue;

  const contentClass = frontmatter.match(
    /^content_class:\s*"?([^"\n]+)"?\s*$/m
  )?.[1];
  const guideType = frontmatter.match(
    /^guide_type:\s*"?([^"\n]+)"?\s*$/m
  )?.[1];

  const category = frontmatter.match(/^category:\s*"?([^"\n]+?)"?\s*$/m)?.[1];
  if (category && !mappedCategories.has(category)) {
    errors.push(`${relativePath}: category "${category}" is not mapped in lib/categories.ts`);
  }

  for (const field of ["primary_brands", "related_brands"]) {
    const list = frontmatter.match(new RegExp(`^${field}:\\s*(\\[.*\\])\\s*$`, "m"))?.[1];
    if (!list) continue;
    for (const brand of JSON.parse(list)) {
      const slug = String(brand).trim().toLowerCase();
      if (!brandProfiles.has(slug) && !PENDING_BRAND_PROFILES.has(slug)) {
        errors.push(`${relativePath}: ${field} "${brand}" has no profile in content/brands`);
      }
    }
  }

  if (!contentClass || !allowedClasses.has(contentClass)) {
    errors.push(`${relativePath}: requires content_class editorial or search`);
    continue;
  }
  if (contentClass === "search" && (!guideType || !allowedGuideTypes.has(guideType))) {
    errors.push(`${relativePath}: search article requires a valid guide_type`);
  }
  if (contentClass === "editorial" && guideType) {
    errors.push(`${relativePath}: editorial article must not declare guide_type`);
  }
  if (
    contentClass === "editorial" &&
    /^guide_priority:\s*\d+\s*$/m.test(frontmatter)
  ) {
    errors.push(`${relativePath}: editorial article must not declare guide_priority`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Insight classification verified.");
