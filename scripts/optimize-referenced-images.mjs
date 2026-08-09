import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicRoot = path.join(root, "public");
const sourceRoots = ["app", "components", "content", "lib"];
const sourceExtensions = new Set([".css", ".json", ".md", ".mdx", ".ts", ".tsx"]);
const rasterReference = /["'(](\/(?:images|brand|expo)\/[^\s"'`()?{}]+\.(?:avif|jpe?g|png|webp))/gi;
const sourceBudget = 1_048_576;
const targetBudget = 921_600;
const encodingStages = [
  { quality: 84, maxEdge: 1920 },
  { quality: 78, maxEdge: 1600 },
  { quality: 72, maxEdge: 1400 },
  { quality: 64, maxEdge: 1400 }
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

const sourceFiles = sourceRoots.flatMap((sourceRoot) =>
  walk(path.join(root, sourceRoot)).filter((file) =>
    sourceExtensions.has(path.extname(file).toLowerCase())
  )
);

const referencesByFile = new Map();
const references = new Set();
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, "utf8");
  const fileReferences = [...source.matchAll(rasterReference)].map((match) => match[1]);
  if (fileReferences.length === 0) continue;
  referencesByFile.set(file, new Set(fileReferences));
  fileReferences.forEach((reference) => references.add(reference));
}

const candidates = [...references]
  .map((reference) => ({
    reference,
    input: path.join(publicRoot, reference.slice(1))
  }))
  .filter(({ input }) => fs.existsSync(input) && fs.statSync(input).size > sourceBudget)
  .sort((left, right) => left.reference.localeCompare(right.reference));

for (const candidate of candidates) {
  const extension = path.extname(candidate.input).toLowerCase();
  candidate.output = extension === ".webp"
    ? candidate.input
    : candidate.input.slice(0, -extension.length) + ".webp";
  candidate.outputReference = extension === ".webp"
    ? candidate.reference
    : candidate.reference.slice(0, -extension.length) + ".webp";
  candidate.temporary = `${candidate.output}.wcb-optimized-${process.pid}.tmp`;

  if (candidate.output !== candidate.input && fs.existsSync(candidate.output)) {
    throw new Error(`Refusing to overwrite an existing migration target: ${candidate.output}`);
  }
}

const staged = [];
try {
  for (const [index, candidate] of candidates.entries()) {
    const inputBytes = fs.statSync(candidate.input).size;
    let outputBytes = Number.POSITIVE_INFINITY;
    let appliedStage = null;

    for (const stage of encodingStages) {
      await sharp(candidate.input)
        .rotate()
        .resize({
          width: stage.maxEdge,
          height: stage.maxEdge,
          fit: "inside",
          withoutEnlargement: true
        })
        .webp({
          quality: stage.quality,
          effort: 6,
          smartSubsample: true,
          alphaQuality: 90
        })
        .toFile(candidate.temporary);

      outputBytes = fs.statSync(candidate.temporary).size;
      appliedStage = stage;
      if (outputBytes <= targetBudget) break;
    }

    if (outputBytes > sourceBudget) {
      throw new Error(
        `Unable to bring ${candidate.reference} under one MiB; final size ${outputBytes}`
      );
    }

    staged.push({ ...candidate, inputBytes, outputBytes, appliedStage });
    console.log(
      `[${index + 1}/${candidates.length}] ${candidate.reference} ` +
      `${inputBytes} -> ${outputBytes} bytes (q${appliedStage.quality}, ${appliedStage.maxEdge}px)`
    );
  }

  for (const candidate of staged) fs.renameSync(candidate.temporary, candidate.output);

  for (const [file, fileReferences] of referencesByFile) {
    let source = fs.readFileSync(file, "utf8");
    let changed = false;

    for (const candidate of staged) {
      if (!fileReferences.has(candidate.reference) || candidate.reference === candidate.outputReference) {
        continue;
      }
      const updated = source.split(candidate.reference).join(candidate.outputReference);
      changed ||= updated !== source;
      source = updated;
    }

    if (changed) fs.writeFileSync(file, source);
  }

  for (const candidate of staged) {
    if (!fs.existsSync(candidate.output)) {
      throw new Error(`Optimized output missing after reference update: ${candidate.output}`);
    }
  }

  for (const candidate of staged) {
    if (candidate.input !== candidate.output) fs.unlinkSync(candidate.input);
  }
} catch (error) {
  for (const candidate of candidates) {
    if (fs.existsSync(candidate.temporary)) fs.unlinkSync(candidate.temporary);
  }
  throw error;
}

const inputBytes = staged.reduce((total, candidate) => total + candidate.inputBytes, 0);
const outputBytes = staged.reduce((total, candidate) => total + candidate.outputBytes, 0);
console.log(`Converted: ${staged.length}`);
console.log(`Input bytes: ${inputBytes}`);
console.log(`Output bytes: ${outputBytes}`);
console.log(`Saved bytes: ${inputBytes - outputBytes}`);
