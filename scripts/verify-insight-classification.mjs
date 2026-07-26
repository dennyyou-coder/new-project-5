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
