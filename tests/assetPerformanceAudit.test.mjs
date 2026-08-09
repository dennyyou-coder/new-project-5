import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const sourceRoots = ["app", "components", "content", "lib"];
const sourceExtensions = new Set([".css", ".json", ".md", ".mdx", ".ts", ".tsx"]);
const rasterReference = /["'(](\/(?:images|brand|expo)\/[^\s"'`()?{}]+\.(?:avif|jpe?g|png|webp))/gi;
const maxReferencedRasterBytes = 1_048_576;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function referencedRasters() {
  const references = new Set();

  for (const sourceRoot of sourceRoots) {
    const absoluteRoot = path.join(root, sourceRoot);
    for (const file of walk(absoluteRoot)) {
      if (!sourceExtensions.has(path.extname(file).toLowerCase())) continue;
      const source = fs.readFileSync(file, "utf8");
      for (const match of source.matchAll(rasterReference)) references.add(match[1]);
    }
  }

  return [...references].sort();
}

test("every referenced local raster resolves to a public asset", () => {
  const missing = referencedRasters().filter(
    (reference) => !fs.existsSync(path.join(root, "public", reference.slice(1)))
  );

  assert.deepEqual(missing, []);
});

test("referenced raster assets stay within the one MiB transfer budget", () => {
  const oversized = referencedRasters()
    .filter((reference) => fs.existsSync(path.join(root, "public", reference.slice(1))))
    .map((reference) => ({
      reference,
      bytes: fs.statSync(path.join(root, "public", reference.slice(1))).size
    }))
    .filter(({ bytes }) => bytes > maxReferencedRasterBytes)
    .sort((left, right) => right.bytes - left.bytes);

  assert.deepEqual(
    oversized,
    [],
    `Referenced raster assets over one MiB:\n${oversized
      .map(({ reference, bytes }) => `${bytes}\t${reference}`)
      .join("\n")}`
  );
});

test("article image dimensions come from the responsive article manifest", () => {
  const manifestPath = path.join(root, "lib", "generated", "article-image-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const articleSources = walk(path.join(root, "content", "insights"))
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n");
  const articleReferences = new Set(
    [...articleSources.matchAll(rasterReference)].map((match) => match[1])
  );
  const missingDimensions = [...articleReferences].filter((reference) => {
    const dimensions = manifest.assets[reference];
    return !dimensions || dimensions.width <= 0 || dimensions.height <= 0;
  });

  assert.deepEqual(missingDimensions, []);
});
