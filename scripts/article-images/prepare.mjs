import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

import sharp from "sharp";

import { ARTICLE_BUDGETS } from "./config.mjs";
import {
  HISTORICAL_KINDS,
  readHistoricalKindClassifications
} from "./historical-kinds.mjs";
import { buildManifest, serializeManifest } from "./manifest.mjs";
import { discoverArticleInventory } from "./references.mjs";
import {
  createDesktopVariant,
  createMobileVariant,
  inspectSource,
  shouldKeepMobileVariant,
  transformAsset
} from "./transform.mjs";

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SOURCE_IMAGE = /\.(?:jpe?g|png|webp)$/i;
const HISTORICAL_SOURCE_IMAGE = /\.(?:jpe?g|png|webp|svg)$/i;
const DEFAULT_SOURCE_LIBRARY = "/Users/youdenny/Desktop/WorldCleanBizAssets";
const PROCESSOR_VERSION = "1";
export const PHOTO_AGGREGATE_MOBILE_LONG_EDGES = Object.freeze([680, 640, 560, 480, 390]);
const PHOTO_AGGREGATE_MOBILE_MIN_LONG_EDGE = PHOTO_AGGREGATE_MOBILE_LONG_EDGES.at(-1);
const HISTORICAL_SOURCE_CONFLICT_FALLBACKS = new Map([
  ["building-worlds-no-1-cleaning-show-from-scratch-episode-01", {
    malformedFilename: "building-worlds-no-1-cleaning-show-episode-01-cover.webp"
  }]
]);
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/;
const FRONTMATTER_IMAGE_FIELDS = new Set([
  "coverImage", "cover_image", "socialImage", "social_image",
  "thumbnail", "thumbnailImage", "thumbnail_image"
]);

export class ArticleImagePreparationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ArticleImagePreparationError";
    this.code = details.code ?? "ARTICLE_IMAGE_PREPARATION_FAILED";
    Object.assign(this, details);
  }
}

function failure(message, details) {
  return new ArticleImagePreparationError(message, details);
}

export function selectPhotoAggregateRecoveryStage({ photoCount, budgetClass, budget, desktopStages, mobileStages }) {
  if (!Number.isInteger(photoCount) || photoCount < 1 || !ARTICLE_BUDGETS[budgetClass]) return null;
  const desktop = desktopStages.find((stage) => stage.bytes <= budget.desktop);
  const mobile = mobileStages.find((stage) => (
    (stage.longEdge === null || stage.longEdge >= PHOTO_AGGREGATE_MOBILE_MIN_LONG_EDGE)
    && stage.bytes <= budget.mobile
  ));
  return desktop && mobile ? { budgetClass, desktop, mobile } : null;
}

export function classifyHistoricalExtremeRecoveryAssets({ slug, urls, processed, classifications }) {
  const photoUrls = [];
  const excluded = [];
  for (const url of urls) {
    const classification = classifications?.[url];
    if (!classification || !HISTORICAL_KINDS.has(classification.kind) || !normalizedHash(classification.outputHash)) {
      throw failure(`Historical extreme recovery for ${slug} requires an explicit kind classification for ${url}.`, {
        code: "HISTORICAL_KIND_CLASSIFICATION_REQUIRED",
        slug,
        imageName: path.posix.basename(url),
        recommendedAction: "Classify the current primary as photo, chart, graphic, or transparent and bind it to its current output hash."
      });
    }
    const actualHash = normalizedHash(processed?.[url]?.outputHash);
    if (!actualHash || normalizedHash(classification.outputHash) !== actualHash) {
      throw failure(`Historical kind classification for ${url} is stale for the current primary.`, {
        code: "HISTORICAL_KIND_CLASSIFICATION_STALE",
        slug,
        imageName: path.posix.basename(url),
        observedValue: actualHash,
        permittedValue: normalizedHash(classification.outputHash),
        recommendedAction: "Re-inspect the current primary and update its hash-bound kind classification before extreme recovery."
      });
    }
    if (classification.kind === "photo") photoUrls.push(url);
    else excluded.push({ url, kind: classification.kind });
  }
  return { photoUrls, excluded };
}

function sha256(buffer) {
  return `sha256:${crypto.createHash("sha256").update(buffer).digest("hex")}`;
}

function normalizedHash(value) {
  return typeof value === "string" ? `sha256:${value.replace(/^sha256:/i, "").toLowerCase()}` : null;
}

function manifestKindForHistoricalClassification(kind) {
  if (kind === "chart" || kind === "graphic") return "graphic";
  return kind;
}

function classifiedHistoricalKind(slug, url, outputHash, classifications, fallbackKind) {
  const classification = classifications?.[url];
  if (!classification) return fallbackKind;
  const result = classifyHistoricalExtremeRecoveryAssets({
    slug,
    urls: [url],
    processed: { [url]: { outputHash } },
    classifications
  });
  return result.photoUrls.length ? "photo" : manifestKindForHistoricalClassification(classification.kind);
}

function relativeRepositoryPath(projectRoot, file) {
  return path.relative(projectRoot, file).split(path.sep).join("/");
}

function publicUrlFile(publicRoot, url) {
  return path.join(publicRoot, ...url.replace(/^\//, "").split("/"));
}

function walkMdx(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const file = path.join(root, entry.name);
      if (entry.isDirectory()) return walkMdx(file);
      return entry.isFile() && path.extname(entry.name).toLowerCase() === ".mdx" ? [file] : [];
    });
}

function articleFilesBySlug(contentRoot) {
  const files = new Map();
  for (const file of walkMdx(contentRoot)) {
    const slug = path.basename(file, ".mdx");
    if (files.has(slug)) {
      throw failure(`Unknown article slug mapping: duplicate MDX files for ${slug}`, {
        code: "DUPLICATE_ARTICLE_SLUG", slug,
        recommendedAction: "Keep exactly one MDX file for the article slug."
      });
    }
    files.set(slug, file);
  }
  return files;
}

function approvedHistoricalSourceValidationWarning(slug, sourceRoot) {
  const approved = HISTORICAL_SOURCE_CONFLICT_FALLBACKS.get(slug);
  if (approved) {
    const malformedFile = path.join(sourceRoot, approved.malformedFilename);
    const hasMalformedFile = fs.existsSync(malformedFile) && fs.statSync(malformedFile).isFile();
    const hasValidCover = fs.readdirSync(sourceRoot, { withFileTypes: true })
      .some((entry) => entry.isFile() && /^01-cover\.(?:jpe?g|png|webp)$/i.test(entry.name));
    if (hasMalformedFile && !hasValidCover) {
      return `EXTERNAL_SOURCE_CONFLICT_FALLBACK slug=${slug} file=${approved.malformedFilename} reason=INVALID_SOURCE_FILENAME repository-primary-preserved`;
    }
  }
  return null;
}

function normalizedImageFormat(filename) {
  const extension = path.extname(filename).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "jpeg";
  return extension.slice(1);
}

function historicalReferenceSemanticStem(reference) {
  const basename = path.posix.basename(reference);
  const extension = path.posix.extname(basename);
  return sanitizeStem(basename.slice(0, -extension.length).replace(/^\d{2}-/, ""));
}

function localReferencesInSource(source) {
  return [...source.matchAll(/\/images\/[^\s)"'>]+/g)]
    .map((match) => normalizeReference(match[0]))
    .filter(Boolean);
}

async function inventoryPublicOverlay(context, sourceBackedSlugs, articleFiles) {
  if (!sourceBackedSlugs.length) return context.publicRoot;
  const overlayRoot = path.join(context.stageRoot, "inventory-public");
  const overlayImages = path.join(overlayRoot, "images");
  const overlayArticles = path.join(overlayImages, "articles");
  const realImages = path.join(context.publicRoot, "images");
  const realArticles = path.join(realImages, "articles");
  await fsp.mkdir(overlayArticles, { recursive: true });

  if (fs.existsSync(realImages)) {
    for (const entry of await fsp.readdir(realImages, { withFileTypes: true })) {
      if (entry.name === "articles") continue;
      await fsp.symlink(path.join(realImages, entry.name), path.join(overlayImages, entry.name));
    }
  }
  const targetSet = new Set(sourceBackedSlugs);
  if (fs.existsSync(realArticles)) {
    for (const entry of await fsp.readdir(realArticles, { withFileTypes: true })) {
      if (targetSet.has(entry.name)) continue;
      await fsp.symlink(path.join(realArticles, entry.name), path.join(overlayArticles, entry.name));
    }
  }

  for (const slug of sourceBackedSlugs) {
    const targetOverlay = path.join(overlayArticles, slug);
    const realTarget = path.join(realArticles, slug);
    await fsp.mkdir(targetOverlay, { recursive: true });
    if (fs.existsSync(realTarget)) {
      for (const entry of await fsp.readdir(realTarget, { withFileTypes: true })) {
        await fsp.symlink(path.join(realTarget, entry.name), path.join(targetOverlay, entry.name));
      }
    }
    const source = await fsp.readFile(articleFiles.get(slug), "utf8");
    const prefix = `/images/articles/${slug}/`;
    for (const reference of localReferencesInSource(source)) {
      if (!reference.startsWith(prefix)) continue;
      const placeholder = publicUrlFile(overlayRoot, reference);
      if (fs.existsSync(placeholder)) continue;
      await fsp.mkdir(path.dirname(placeholder), { recursive: true });
      await fsp.writeFile(placeholder, "inventory placeholder");
    }
  }
  return overlayRoot;
}

function normalizeReference(value) {
  const clean = value.trim().replace(/^<|>$/g, "").split(/[?#]/, 1)[0];
  return clean.startsWith("/images/") ? path.posix.normalize(clean) : null;
}

function sequenceFromReference(reference) {
  const match = path.posix.basename(reference).match(/^(\d{2})(?:-|\.)/);
  return match ? Number(match[1]) : null;
}

function sanitizeStem(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sourceDescriptor(file, basename) {
  const extension = path.extname(basename);
  const rawStem = basename.slice(0, -extension.length);
  const match = rawStem.match(/^(\d{2})-(.+)$/);
  if (!match) {
    throw failure(`Source image ${basename} has no deterministic two-digit sequence mapping.`, {
      code: "INVALID_SOURCE_FILENAME", imageName: basename,
      recommendedAction: "Rename it to NN-semantic-name with a two-digit sequence."
    });
  }
  const sequence = Number(match[1]);
  const semanticStem = sanitizeStem(match[2]);
  if (!semanticStem) {
    throw failure(`Source image ${basename} has an empty semantic filename.`, {
      code: "INVALID_SOURCE_FILENAME", imageName: basename,
      recommendedAction: "Add a meaningful semantic name after the sequence."
    });
  }
  return {
    file,
    basename,
    sequence,
    semanticStem,
    logicalOutput: `${match[1]}-${semanticStem}.webp`
  };
}

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function requirePlainObject(value, context) {
  if (!isPlainObject(value)) {
    throw failure(`${context} must be an object.`, {
      code: "INVALID_IMAGE_CONFIG",
      recommendedAction: "Use the documented image-config.json object schema."
    });
  }
}

function exactKeys(value, allowed, context) {
  requirePlainObject(value, context);
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length) {
    throw failure(`Unknown ${context} field: ${unknown.join(", ")}`, {
      code: "INVALID_IMAGE_CONFIG", observedValue: unknown.join(", "), permittedValue: [...allowed].join(", "),
      recommendedAction: "Remove unsupported fields from image-config.json."
    });
  }
}

function configErrorWithArticle(error, slug, configPath) {
  const structured = error instanceof ArticleImagePreparationError
    ? error
    : failure(`Invalid image-config.json: ${error.message}`, {
      code: "INVALID_IMAGE_CONFIG",
      recommendedAction: "Correct the JSON syntax and rerun preparation."
    });
  structured.slug ??= slug;
  structured.file ??= configPath;
  if (!structured.message.startsWith(`Article ${slug} (`)) {
    structured.message = `Article ${slug} (${configPath}): ${structured.message}`;
  }
  return structured;
}

function validatePoint(point, filename) {
  exactKeys(point, new Set(["x", "y"]), `focalPoint for ${filename}`);
  if (![point.x, point.y].every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) {
    throw failure(`Focal point for ${filename} must use normalized coordinates from 0 through 1.`, {
      code: "INVALID_FOCAL_POINT", imageName: filename,
      observedValue: JSON.stringify(point), permittedValue: "x and y from 0 through 1",
      recommendedAction: "Provide normalized x and y coordinates."
    });
  }
}

function validateCrop(crop, filename) {
  exactKeys(crop, new Set(["left", "top", "width", "height"]), `crop for ${filename}`);
  if (![crop.left, crop.top, crop.width, crop.height].every(Number.isFinite)) {
    throw failure(`Crop for ${filename} must contain finite left, top, width, and height values.`, {
      code: "INVALID_CROP", imageName: filename,
      recommendedAction: "Provide one positive crop rectangle inside the oriented source."
    });
  }
}

async function readImageConfig(sourceRoot, descriptors, slug) {
  const configPath = path.join(sourceRoot, "image-config.json");
  if (!fs.existsSync(configPath)) return {};
  try {
    const parsed = JSON.parse(await fsp.readFile(configPath, "utf8"));
    exactKeys(parsed, new Set(["images"]), "image-config.json");
    requirePlainObject(parsed.images, "image-config images");
    const known = new Set(descriptors.map(({ basename }) => basename));
    for (const filename of Object.keys(parsed.images)) {
      if (!known.has(filename)) {
        throw failure(`image-config.json contains unknown filename ${filename}.`, {
          code: "UNKNOWN_CONFIG_IMAGE", imageName: filename,
          recommendedAction: "Use an exact filename that exists in the source folder."
        });
      }
    }
    for (const [filename, entry] of Object.entries(parsed.images)) {
      exactKeys(entry, new Set(["kind", "crop", "focalPoint"]), `configuration for ${filename}`);
      if (entry.kind !== undefined && !["photo", "chart"].includes(entry.kind)) {
        throw failure(`Unsupported kind ${entry.kind} for ${filename}.`, {
          code: "UNSUPPORTED_IMAGE_KIND", imageName: filename,
          observedValue: entry.kind, permittedValue: "photo or chart",
          recommendedAction: "Use photo or chart; transparency is detected automatically."
        });
      }
      if (entry.crop && entry.focalPoint) {
        throw failure(`Conflicting crop and focal-point declarations for ${filename}.`, {
          code: "CONFLICTING_CROP", imageName: filename,
          recommendedAction: "Keep either crop or focalPoint, not both."
        });
      }
      if (entry.crop) validateCrop(entry.crop, filename);
      if (entry.focalPoint) validatePoint(entry.focalPoint, filename);
    }
    return parsed.images;
  } catch (error) {
    throw configErrorWithArticle(error, slug, configPath);
  }
}

async function discoverSourceImages(sourceRoot, { includeSvg = false } = {}) {
  const sourceImage = includeSvg ? HISTORICAL_SOURCE_IMAGE : SOURCE_IMAGE;
  const entries = (await fsp.readdir(sourceRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && sourceImage.test(entry.name))
    .sort((left, right) => left.name.localeCompare(right.name));
  const descriptors = entries.map((entry) => sourceDescriptor(path.join(sourceRoot, entry.name), entry.name));
  const outputs = new Map();
  const sequences = new Map();
  for (const descriptor of descriptors) {
    const normalized = descriptor.logicalOutput.toLowerCase();
    if (outputs.has(normalized)) {
      throw failure(`Duplicate normalized filename ${descriptor.logicalOutput}: ${outputs.get(normalized)} and ${descriptor.basename}.`, {
        code: "DUPLICATE_NORMALIZED_FILENAME", imageName: descriptor.basename,
        recommendedAction: "Give each source image a unique sanitized semantic filename."
      });
    }
    if (sequences.has(descriptor.sequence)) {
      throw failure(`Source sequence ${String(descriptor.sequence).padStart(2, "0")} has no deterministic output mapping.`, {
        code: "DUPLICATE_SOURCE_SEQUENCE", imageName: descriptor.basename,
        recommendedAction: "Use each two-digit sequence exactly once."
      });
    }
    outputs.set(normalized, descriptor.basename);
    sequences.set(descriptor.sequence, descriptor);
  }
  const cover = sequences.get(1);
  if (!cover || cover.semanticStem !== "cover") {
    throw failure("Missing required 01-cover source image.", {
      code: "MISSING_COVER", imageName: "01-cover",
      recommendedAction: "Add one 01-cover.png, .jpg, .jpeg, or .webp source file."
    });
  }
  return { descriptors, sequences };
}

async function validateHistoricalSourceFolder(context, slug, sourceRoot) {
  const article = context.currentInventory.articles[slug];
  const approvedWarning = approvedHistoricalSourceValidationWarning(slug, sourceRoot);
  if (approvedWarning) return [approvedWarning];
  const { descriptors } = await discoverSourceImages(sourceRoot, { includeSvg: true });
  await readImageConfig(sourceRoot, descriptors, slug);
  const referencedDescriptors = new Set();
  const warnings = [];
  for (const reference of article.body) {
    const semanticStem = historicalReferenceSemanticStem(reference);
    const exactMatches = descriptors
      .filter((descriptor) => descriptor.sequence > 1 && descriptor.semanticStem === semanticStem)
      .sort((left, right) => left.basename.localeCompare(right.basename));
    if (exactMatches.length > 1) {
      warnings.push(`EXTERNAL_SOURCE_CONTENT_CONFLICT slug=${slug} primary=${reference} sources=${exactMatches.map(({ basename }) => basename).join(",")} reason=AMBIGUOUS_SEMANTIC_MATCH repository-primary-preserved`);
      continue;
    }
    let matches = exactMatches;
    let normalizedPrefix = null;
    if (matches.length === 0) {
      const slugWithBoundaries = `-${sanitizeStem(slug)}-`;
      matches = descriptors
        .filter((descriptor) => {
          if (descriptor.sequence <= 1) return false;
          const suffix = `-${descriptor.semanticStem}`;
          if (!semanticStem.endsWith(suffix)) return false;
          const prefix = semanticStem.slice(0, -suffix.length);
          return prefix && slugWithBoundaries.includes(`-${prefix}-`);
        })
        .sort((left, right) => left.basename.localeCompare(right.basename));
      if (matches.length > 1) {
        warnings.push(`EXTERNAL_SOURCE_CONTENT_CONFLICT slug=${slug} primary=${reference} sources=${matches.map(({ basename }) => basename).join(",")} reason=AMBIGUOUS_SEMANTIC_MATCH repository-primary-preserved`);
        continue;
      }
      if (matches.length === 1) {
        normalizedPrefix = semanticStem.slice(0, -(`-${matches[0].semanticStem}`).length);
      }
    }
    if (matches.length === 0) {
      const sequence = sequenceFromReference(reference);
      const sameSequence = descriptors
        .filter((descriptor) => descriptor.sequence > 1 && descriptor.sequence === sequence)
        .sort((left, right) => left.basename.localeCompare(right.basename));
      const bodyDescriptors = descriptors.filter((descriptor) => descriptor.sequence > 1);
      const candidates = sameSequence.length
        ? sameSequence
        : bodyDescriptors.length ? bodyDescriptors : descriptors;
      warnings.push(`EXTERNAL_SOURCE_CONTENT_CONFLICT slug=${slug} primary=${reference} sources=${candidates.map(({ basename }) => basename).join(",")} reason=NO_SEMANTIC_MATCH repository-primary-preserved`);
      for (const descriptor of candidates) referencedDescriptors.add(descriptor.basename);
      continue;
    }
    const [match] = matches;
    referencedDescriptors.add(match.basename);
    if (normalizedPrefix) {
      warnings.push(`HISTORICAL_SVG_PREFIX_NORMALIZED slug=${slug} primary=${reference} source=${match.basename} prefix=${normalizedPrefix} repository-primary-preserved`);
    }
    if (normalizedImageFormat(reference) !== normalizedImageFormat(match.basename)) {
      warnings.push(`INCOMPATIBLE_HISTORICAL_PRIMARY_FORMAT slug=${slug} primary=${reference} source=${match.basename} repository-primary-preserved`);
    }
  }
  const unmatchedDescriptors = descriptors
    .filter(({ sequence, basename }) => sequence > 1 && !referencedDescriptors.has(basename));
  for (const descriptor of unmatchedDescriptors) {
    const sequenceReference = article.body.find((reference) => sequenceFromReference(reference) === descriptor.sequence);
    const primary = sequenceReference ?? article.body[0];
    warnings.push(`EXTERNAL_SOURCE_CONTENT_CONFLICT slug=${slug} primary=${primary} sources=${descriptor.basename} reason=UNREFERENCED_EXTERNAL_DESCRIPTOR repository-primary-preserved`);
  }
  return warnings;
}

async function hasRealTransparency(file) {
  const metadata = await sharp(file).metadata();
  if (!metadata.hasAlpha) return false;
  return !(await sharp(file).stats()).isOpaque;
}

function transformFailure(slug, descriptor, result) {
  const observed = result.actualBytes ?? result.sourceRatio ?? "validation failed";
  const permitted = result.limit ?? result.targetRatio ?? "approved crop and budget rules";
  return failure(`${slug} ${descriptor.basename}: observed ${observed}; permitted ${permitted}; budget/crop validation failed.`, {
    code: result.code,
    slug,
    imageName: descriptor.basename,
    observedValue: observed,
    permittedValue: permitted,
    recommendedAction: result.recommendedAction ?? "Correct the source image configuration and rerun preparation."
  });
}

function processedAssetFromTransform(result, { role, kind, mobileUrl }) {
  const processed = {
    role,
    kind,
    width: result.desktop.width,
    height: result.desktop.height,
    bytes: result.desktop.bytes,
    format: result.desktop.format,
    quality: result.desktop.quality,
    sourceHash: result.source.sourceHash,
    outputHash: result.desktop.outputHash
  };
  if (result.mobile?.format === "webp") {
    processed.mobile = {
      src: mobileUrl,
      width: result.mobile.width,
      height: result.mobile.height,
      bytes: result.mobile.bytes,
      outputHash: result.mobile.outputHash
    };
  }
  return processed;
}

function replaceBodyReferences(body, replacements) {
  const replace = (reference) => replacements.get(normalizeReference(reference)) ?? reference;
  const markdown = body.replace(
    /(!\[[^\]]*\]\(\s*<?)([^\s)>]+)(>?[^)]*\))/gi,
    (match, before, reference, after) => `${before}${replace(reference)}${after}`
  );
  return markdown.replace(
    /(<img\b[^>]*?\bsrc\s*=\s*["'])([^"']+)(["'][^>]*>)/gi,
    (match, before, reference, after) => `${before}${replace(reference)}${after}`
  );
}

function quotedFrontmatterValue(line, value) {
  const match = line.match(/^(\s*[A-Za-z][A-Za-z0-9_-]*:\s*)(["']?)(.*?)(\2)(\s*)$/);
  if (!match) return line;
  const quote = match[2] || "\"";
  return `${match[1]}${quote}${value}${quote}${match[5]}`;
}

function updateArticleSource(source, article, { coverUrl, bodyReplacements }) {
  const match = source.match(FRONTMATTER);
  if (!match) {
    throw failure(`Article ${article.slug} has no supported frontmatter block.`, {
      code: "MISSING_FRONTMATTER", slug: article.slug,
      recommendedAction: "Add a standard YAML frontmatter block before preparing images."
    });
  }
  const newline = match[0].includes("\r\n") ? "\r\n" : "\n";
  const oldCover = article.cover;
  const lines = match[1].split(/\r?\n/);
  let hasCover = false;
  let hasSocial = false;
  const updatedLines = lines.map((line) => {
    const field = line.match(/^\s*([A-Za-z][A-Za-z0-9_-]*):/)?.[1];
    if (!field || !FRONTMATTER_IMAGE_FIELDS.has(field)) return line;
    const raw = line.slice(line.indexOf(":") + 1).trim().replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2");
    if (field === "coverImage" || field === "cover_image") {
      hasCover = true;
      return quotedFrontmatterValue(line, coverUrl);
    }
    if (field === "socialImage" || field === "social_image") {
      hasSocial = true;
      return !raw || raw === oldCover ? quotedFrontmatterValue(line, coverUrl) : line;
    }
    return raw === oldCover ? quotedFrontmatterValue(line, coverUrl) : line;
  });
  if (!hasCover) updatedLines.push(`coverImage: "${coverUrl}"`);
  if (!hasSocial) updatedLines.push(`socialImage: "${coverUrl}"`);
  const frontmatter = `---${newline}${updatedLines.join(newline)}${newline}---${match[2]}`;
  const body = replaceBodyReferences(source.slice(match[0].length), bodyReplacements);
  return `${frontmatter}${body}`;
}

function allArticleReferences(article) {
  return [...new Set([article.cover, article.social, ...article.body].filter(Boolean))];
}

function roleForUrl(inventory, url) {
  for (const article of Object.values(inventory.articles)) {
    if (article.cover === url || article.social === url) return "cover";
    if (article.body.includes(url)) return "body";
  }
  return "body";
}

async function describeExistingAsset(url, file, inventory, existing, publicRoot, classifications = {}) {
  const role = roleForUrl(inventory, url);
  if (path.extname(file).toLowerCase() === ".svg") {
    const buffer = await fsp.readFile(file);
    const source = buffer.toString("utf8", 0, Math.min(buffer.length, 16_384));
    const numeric = (name) => Number(source.match(new RegExp(`\\b${name}=["']([0-9]+(?:\\.[0-9]+)?)(?:px)?["']`, "i"))?.[1]);
    let width = numeric("width");
    let height = numeric("height");
    if (!(width > 0 && height > 0)) {
      const viewBox = source.match(/\bviewBox=["']\s*[-+0-9.e]+\s+[-+0-9.e]+\s+([-+0-9.e]+)\s+([-+0-9.e]+)\s*["']/i);
      width = width > 0 ? width : Number(viewBox?.[1]);
      height = height > 0 ? height : Number(viewBox?.[2]);
    }
    if (!(width > 0 && height > 0)) {
      throw failure(`Historical SVG ${url} has no validation-only intrinsic dimensions.`, {
        code: "HISTORICAL_SVG_DIMENSIONS_MISSING",
        imageName: path.posix.basename(url),
        recommendedAction: "Add intrinsic width/height or viewBox metadata without rasterizing or replacing the repository SVG."
      });
    }
    const outputHash = sha256(buffer);
    return {
      role,
      kind: classifiedHistoricalKind("historical-inventory", url, outputHash, classifications, "graphic"),
      width,
      height,
      bytes: buffer.length,
      format: "svg",
      quality: existing?.quality ?? 100,
      sourceHash: existing?.sourceHash ?? outputHash,
      outputHash
    };
  }
  const source = await inspectSource(file);
  const transparent = await hasRealTransparency(file);
  const metadata = await sharp(file).metadata();
  const kind = classifiedHistoricalKind("historical-inventory", url, source.sourceHash, classifications, existing?.kind ?? (transparent ? "transparent" : "photo"));
  const result = {
    role,
    kind,
    width: source.width,
    height: source.height,
    bytes: source.bytes,
    format: metadata.format,
    quality: existing?.quality ?? 100,
    sourceHash: existing?.sourceHash ?? source.sourceHash,
    outputHash: source.sourceHash
  };
  if (existing?.mobile?.src) {
    const mobileFile = publicUrlFile(publicRoot, existing.mobile.src);
    if (fs.existsSync(mobileFile)) {
      const mobile = await inspectSource(mobileFile);
      const describedMobile = {
        src: existing.mobile.src,
        width: mobile.width,
        height: mobile.height,
        bytes: mobile.bytes,
        outputHash: mobile.sourceHash
      };
      if (shouldKeepMobileVariant({
        desktopBytes: result.bytes,
        mobileBytes: describedMobile.bytes,
        desktopWidth: result.width,
        mobileWidth: describedMobile.width
      })) result.mobile = describedMobile;
    }
  }
  return result;
}

function cloneInventory(inventory) {
  return {
    assets: Object.fromEntries(Object.entries(inventory.assets).map(([url, asset]) => [url, { ...asset }])),
    articles: Object.fromEntries(Object.entries(inventory.articles).map(([slug, article]) => [slug, {
      ...article,
      body: [...article.body]
    }]))
  };
}

function remainingReferences(inventory, excludedSlug) {
  const references = new Set();
  for (const [slug, article] of Object.entries(inventory.articles)) {
    if (slug === excludedSlug) continue;
    for (const url of allArticleReferences(article)) references.add(url);
  }
  return references;
}

function isGitTracked(projectRoot, file) {
  const relative = relativeRepositoryPath(projectRoot, file);
  return spawnSync("git", ["-C", projectRoot, "ls-files", "--error-unmatch", "--", relative], {
    stdio: "ignore"
  }).status === 0;
}

async function planSourceArticle(context, slug, sourceRoot) {
  const { descriptors, sequences } = await discoverSourceImages(sourceRoot);
  const config = await readImageConfig(sourceRoot, descriptors, slug);
  const article = context.currentInventory.articles[slug];
  const stageOutputs = [];
  const processed = {};
  const destinationBySequence = new Map();
  const sourceBytes = descriptors.reduce((total, item) => total + fs.statSync(item.file).size, 0);
  const warnings = [];

  for (const descriptor of descriptors) {
    const settings = config[descriptor.basename] ?? {};
    if ((settings.crop || settings.focalPoint) && descriptor.sequence !== 1) {
      throw failure(`Approved crop or focal point is only supported for 01-cover; found ${descriptor.basename}.`, {
        code: "BODY_CROP_NOT_ALLOWED", slug, imageName: descriptor.basename,
        recommendedAction: "Remove the body crop declaration or prepare the source framing manually."
      });
    }
    const transparent = await hasRealTransparency(descriptor.file);
    const role = descriptor.sequence === 1 ? "cover" : settings.kind === "chart" ? "chart" : transparent ? "transparent" : "body";
    const kind = settings.kind === "chart" ? "graphic" : transparent ? "transparent" : "photo";
    const result = await transformAsset({
      input: descriptor.file,
      filename: descriptor.basename,
      slug,
      role,
      kind,
      crop: settings.crop,
      focalPoint: settings.focalPoint,
      outputFormat: role === "chart" ? undefined : "webp"
    });
    if (!result.ok) throw transformFailure(slug, descriptor, result);
    const prefix = String(descriptor.sequence).padStart(2, "0");
    const outputName = descriptor.sequence === 1
      ? "01-cover.webp"
      : `${prefix}-${descriptor.semanticStem}.${result.desktop.format === "jpeg" ? "jpg" : result.desktop.format}`;
    const url = `/images/articles/${slug}/${outputName}`;
    const mobileUrl = `/images/articles/${slug}/${prefix}-${descriptor.sequence === 1 ? "cover" : descriptor.semanticStem}-800.webp`;
    destinationBySequence.set(descriptor.sequence, url);
    processed[url] = processedAssetFromTransform(result, { role, kind, mobileUrl });
    stageOutputs.push({ url, buffer: result.desktop.buffer, sourceHash: result.source.sourceHash, imageName: descriptor.basename });
    if (result.mobile) {
      if (result.mobile.format === "webp") {
        stageOutputs.push({ url: mobileUrl, buffer: result.mobile.buffer, sourceHash: result.source.sourceHash, imageName: descriptor.basename, mobile: true });
      } else {
        delete processed[url].mobile;
        warnings.push(`${descriptor.basename}: MOBILE_VARIANT_DISCARDED_NON_WEBP`);
      }
    }
    warnings.push(...result.warnings.map((warning) => `${descriptor.basename}: ${warning}`));
  }

  const bodyReplacements = new Map();
  const referencedSequences = new Set();
  for (const reference of article.body) {
    const sequence = sequenceFromReference(reference);
    if (sequence === null || !destinationBySequence.has(sequence)) {
      throw failure(`Referenced source asset ${reference} has no deterministic output mapping${sequence === null ? "" : ` for ${String(sequence).padStart(2, "0")}`}.`, {
        code: "REFERENCE_MAPPING_MISSING", slug, imageName: path.posix.basename(reference),
        recommendedAction: "Match every body reference to one NN-prefixed source image."
      });
    }
    referencedSequences.add(sequence);
    bodyReplacements.set(reference, destinationBySequence.get(sequence));
  }
  for (const descriptor of descriptors.filter(({ sequence }) => sequence > 1)) {
    if (!referencedSequences.has(descriptor.sequence)) {
      throw failure(`Source image ${descriptor.basename} has no existing MDX placement.`, {
        code: "SOURCE_PLACEMENT_MISSING", slug, imageName: descriptor.basename,
        recommendedAction: "Place its matching sequence in the MDX before preparation."
      });
    }
  }

  const coverUrl = destinationBySequence.get(1);
  const originalSource = await fsp.readFile(article.file, "utf8");
  const updatedSource = updateArticleSource(originalSource, article, { coverUrl, bodyReplacements });
  const updatedBody = article.body.map((url) => bodyReplacements.get(url));
  const oldReferences = allArticleReferences(article);
  const unshared = remainingReferences(context.currentInventory, slug);
  const removable = oldReferences
    .filter((url) => ![coverUrl, ...updatedBody].includes(url) && !unshared.has(url))
    .map((url) => publicUrlFile(context.publicRoot, url))
    .filter((file) => file.startsWith(`${path.join(context.publicRoot, "images", "articles", slug)}${path.sep}`))
    .filter((file) => fs.existsSync(file) && isGitTracked(context.projectRoot, file));

  const explicitSocial = article.social && article.social !== article.cover ? article.social : coverUrl;
  return {
    slug,
    article,
    sourceRoot,
    sourceBytes,
    stageOutputs,
    processed,
    updatedSource,
    updatedArticle: {
      ...article,
      cover: coverUrl,
      social: explicitSocial,
      body: updatedBody
    },
    oldReferences,
    removable,
    warnings,
    historicalPrimaryPreserved: false
  };
}

function articleTransferTotals(article, processed) {
  const urls = [...new Set([article.cover, ...article.body].filter(Boolean))];
  return {
    desktop: urls.reduce((total, url) => total + processed[url].bytes, 0),
    mobile: urls.reduce((total, url) => total + (processed[url].mobile?.bytes ?? processed[url].bytes), 0)
  };
}

function replaceStageOutput(stageOutputs, output) {
  const index = stageOutputs.findIndex((candidate) => candidate.url === output.url);
  if (index === -1) stageOutputs.push(output);
  else stageOutputs[index] = output;
}

function removeStageOutput(stageOutputs, url) {
  const index = stageOutputs.findIndex((candidate) => candidate.url === url);
  if (index !== -1) stageOutputs.splice(index, 1);
}

async function deepPhotoDesktopStage(context, slug, article, processed, longEdge, includeCover) {
  const targetUrls = (includeCover ? [article.cover, ...article.body] : article.body)
    .filter((url) => processed[url]?.kind === "photo" && ["jpeg", "png", "webp"].includes(processed[url]?.format));
  const results = new Map();
  for (const url of targetUrls) {
    const current = processed[url];
    const file = context.currentInventory.assets[url].file;
    const candidate = await createDesktopVariant({
      input: file,
      filename: path.basename(file),
      slug,
      role: current.role,
      kind: "photo",
      outputFormat: current.format,
      preserveCrop: true,
      preserveOutputFormat: true,
      photoLongEdgeCap: longEdge
    });
    if (!candidate.ok) return null;
    results.set(url, {
      role: current.role,
      kind: current.kind,
      width: candidate.width,
      height: candidate.height,
      bytes: candidate.bytes,
      format: candidate.format,
      quality: candidate.quality,
      sourceHash: current.sourceHash,
      outputHash: candidate.outputHash,
      buffer: candidate.buffer
    });
  }
  const urls = [...new Set([article.cover, ...article.body].filter(Boolean))];
  const bytes = urls.reduce((total, url) => total + (results.get(url)?.bytes ?? processed[url].bytes), 0);
  return { longEdge, includeCover, bytes, results };
}

async function deepPhotoMobileStage(context, slug, article, processed, desktopStage, longEdge, includeCover, eligibleUrls = null) {
  const eligible = eligibleUrls ? new Set(eligibleUrls) : null;
  const targetUrls = (includeCover ? [article.cover, ...article.body] : article.body)
    .filter((url) => processed[url]?.kind === "photo" && ["jpeg", "png", "webp"].includes(processed[url]?.format))
    .filter((url) => !eligible || eligible.has(url));
  const results = new Map();
  for (const url of targetUrls) {
    const desktop = desktopStage.results.get(url) ?? processed[url];
    const file = context.currentInventory.assets[url].file;
    const candidate = await createMobileVariant({
      input: file,
      filename: path.basename(file),
      slug,
      role: desktop.role,
      kind: "photo",
      outputFormat: "webp",
      preserveCrop: true,
      photoLongEdgeCap: longEdge
    });
    if (!candidate.ok) return null;
    const retained = shouldKeepMobileVariant({
      desktopBytes: desktop.bytes,
      mobileBytes: candidate.bytes,
      desktopWidth: desktop.width,
      mobileWidth: candidate.width
    });
    results.set(url, { candidate, retained });
  }
  const urls = [...new Set([article.cover, ...article.body].filter(Boolean))];
  const bytes = urls.reduce((total, url) => {
    const desktop = desktopStage.results.get(url) ?? processed[url];
    const result = results.get(url);
    if (result) return total + (result.retained ? result.candidate.bytes : desktop.bytes);
    const existingMobile = processed[url].mobile;
    const retained = existingMobile && shouldKeepMobileVariant({
      desktopBytes: desktop.bytes,
      mobileBytes: existingMobile.bytes,
      desktopWidth: desktop.width,
      mobileWidth: existingMobile.width
    });
    results.set(url, { retained: Boolean(retained), existing: true });
    return total + (retained ? existingMobile.bytes : desktop.bytes);
  }, 0);
  return { longEdge, includeCover, bytes, results };
}

function normalDeepPhotoMobileStage(article, processed, desktopStage) {
  const results = new Map();
  const urls = [...new Set([article.cover, ...article.body].filter(Boolean))];
  const bytes = urls.reduce((total, url) => {
    const desktop = desktopStage.results.get(url) ?? processed[url];
    const existingMobile = processed[url].mobile;
    const retained = existingMobile && shouldKeepMobileVariant({
      desktopBytes: desktop.bytes,
      mobileBytes: existingMobile.bytes,
      desktopWidth: desktop.width,
      mobileWidth: existingMobile.width
    });
    results.set(url, { retained: Boolean(retained), existing: true });
    return total + (retained ? existingMobile.bytes : desktop.bytes);
  }, 0);
  return { longEdge: null, includeCover: false, bytes, results };
}

async function applyPhotoAggregateRecovery(context, slug, article, processed, stageOutputs, warnings) {
  const budget = ARTICLE_BUDGETS[article.budgetClass];
  const urls = [...new Set([article.cover, ...article.body].filter(Boolean))];
  const normal = articleTransferTotals(article, processed);
  if (normal.desktop <= budget.desktop && normal.mobile <= budget.mobile) return;
  const normalPhotoUrls = urls.filter((url) => processed[url]?.kind === "photo" && ["jpeg", "png", "webp"].includes(processed[url]?.format));
  if (!normalPhotoUrls.length) return;

  const normalDesktop = { longEdge: null, includeCover: false, bytes: normal.desktop, results: new Map() };
  const desktopStages = [normalDesktop];
  if (normal.desktop > budget.desktop) {
    for (const longEdge of [1120, 960, 800]) {
      const stage = await deepPhotoDesktopStage(context, slug, article, processed, longEdge, false);
      if (stage) desktopStages.push(stage);
    }
    if (!desktopStages.some((stage) => stage.bytes <= budget.desktop)) {
      for (const longEdge of [1120, 960, 800]) {
        const stage = await deepPhotoDesktopStage(context, slug, article, processed, longEdge, true);
        if (stage) desktopStages.push(stage);
      }
    }
  }
  const selectedDesktop = desktopStages.find((stage) => stage.bytes <= budget.desktop);
  if (!selectedDesktop) return;

  const normalMobile = normalDeepPhotoMobileStage(article, processed, selectedDesktop);
  const mobileStages = [normalMobile];
  if (normal.mobile > budget.mobile) {
    for (const longEdge of PHOTO_AGGREGATE_MOBILE_LONG_EDGES) {
      const eligibleUrls = longEdge < 640
        ? classifyHistoricalExtremeRecoveryAssets({
            slug,
            urls,
            processed,
            classifications: context.historicalKindClassifications
          }).photoUrls
        : normalPhotoUrls;
      const stage = await deepPhotoMobileStage(context, slug, article, processed, selectedDesktop, longEdge, false, eligibleUrls);
      if (stage) mobileStages.push(stage);
      if (stage?.bytes <= budget.mobile) break;
    }
    if (!mobileStages.some((stage) => stage.bytes <= budget.mobile)) {
      for (const longEdge of PHOTO_AGGREGATE_MOBILE_LONG_EDGES) {
        const eligibleUrls = longEdge < 640
          ? classifyHistoricalExtremeRecoveryAssets({
              slug,
              urls,
              processed,
              classifications: context.historicalKindClassifications
            }).photoUrls
          : normalPhotoUrls;
        const stage = await deepPhotoMobileStage(context, slug, article, processed, selectedDesktop, longEdge, true, eligibleUrls);
        if (stage) mobileStages.push(stage);
        if (stage?.bytes <= budget.mobile) break;
      }
    }
  }
  const selected = selectPhotoAggregateRecoveryStage({
    photoCount: normalPhotoUrls.length,
    budgetClass: article.budgetClass,
    budget,
    desktopStages,
    mobileStages
  });
  if (!selected) return;

  for (const [url, candidate] of selected.desktop.results) {
    const mobile = processed[url].mobile;
    processed[url] = { ...candidate };
    delete processed[url].buffer;
    if (mobile) processed[url].mobile = mobile;
    replaceStageOutput(stageOutputs, {
      url,
      buffer: candidate.buffer,
      sourceHash: candidate.sourceHash,
      imageName: path.posix.basename(url),
      historicalPrimary: true
    });
  }
  for (const [url, result] of selected.mobile.results) {
    const mobileUrl = `${url.slice(0, -path.posix.extname(url).length)}-800.webp`;
    if (!result.retained) {
      delete processed[url].mobile;
      removeStageOutput(stageOutputs, mobileUrl);
      continue;
    }
    if (result.existing) continue;
    processed[url].mobile = {
      src: mobileUrl,
      width: result.candidate.width,
      height: result.candidate.height,
      bytes: result.candidate.bytes,
      outputHash: result.candidate.outputHash
    };
    replaceStageOutput(stageOutputs, {
      url: mobileUrl,
      buffer: result.candidate.buffer,
      sourceHash: processed[url].sourceHash,
      imageName: path.posix.basename(url),
      mobile: true
    });
  }
  warnings.push(`PHOTO_AGGREGATE_RECOVERY slug=${slug} budget=${article.budgetClass} desktop=${selected.desktop.longEdge ?? "normal"} mobile=${selected.mobile.longEdge ?? "normal"} cover=${selected.desktop.includeCover || selected.mobile.includeCover ? "capped" : "normal"} images=${urls.length}`);
}

async function planHistoricalArticle(context, slug, initialWarnings = []) {
  const article = context.currentInventory.articles[slug];
  const stageOutputs = [];
  const processed = {};
  const warnings = [...initialWarnings];
  let sourceBytes = 0;
  for (const url of allArticleReferences(article)) {
    const file = context.currentInventory.assets[url]?.file;
    if (!file) continue;
    const existing = context.existingManifest.assets?.[url];
    const current = await describeExistingAsset(url, file, context.currentInventory, existing, context.publicRoot, context.historicalKindClassifications);
    sourceBytes += current.bytes;
    const role = current.role;
    const kind = current.kind;
    let primary = current;
    if (current.format === "svg") {
      processed[url] = primary;
      continue;
    }
    if (["jpeg", "png", "webp"].includes(current.format)) {
      const desktop = await createDesktopVariant({
        input: file,
        filename: path.basename(file),
        slug,
        role,
        kind,
        outputFormat: current.format,
        preserveCrop: true,
        preserveOutputFormat: true,
        historicalProgressiveFallback: true
      });
      if (!desktop.ok) throw transformFailure(slug, { basename: path.basename(file) }, desktop);
      if (desktop.fallbackScale) {
        warnings.push(`HISTORICAL_PROGRESSIVE_DOWNSCALE file=${path.basename(file)} variant=primary scale=${desktop.fallbackScale} dimensions=${desktop.width}x${desktop.height}`);
      }
      if (desktop.bytes < current.bytes) {
        primary = {
          role,
          kind,
          width: desktop.width,
          height: desktop.height,
          bytes: desktop.bytes,
          format: desktop.format,
          quality: desktop.quality,
          sourceHash: existing?.sourceHash ?? current.sourceHash,
          outputHash: desktop.outputHash
        };
        stageOutputs.push({
          url,
          buffer: desktop.buffer,
          sourceHash: primary.sourceHash,
          imageName: path.basename(file),
          historicalPrimary: true
        });
      }
    }
    const mobile = await createMobileVariant({
      input: file,
      filename: path.basename(file),
      slug,
      role,
      kind,
      outputFormat: "webp",
      preserveCrop: true,
      historicalProgressiveFallback: true
    });
    if (!mobile.ok) {
      warnings.push(`${path.basename(file)}: ${mobile.code}`);
      processed[url] = primary;
      continue;
    }
    if (mobile.fallbackScale) {
      warnings.push(`HISTORICAL_PROGRESSIVE_DOWNSCALE file=${path.basename(file)} variant=mobile scale=${mobile.fallbackScale} dimensions=${mobile.width}x${mobile.height}`);
    }
    if (mobile.format !== "webp" || !shouldKeepMobileVariant({
      desktopBytes: primary.bytes,
      mobileBytes: mobile.bytes,
      desktopWidth: primary.width,
      mobileWidth: mobile.width
    })) {
      warnings.push(`${path.basename(file)}: MOBILE_VARIANT_DISCARDED_INSUFFICIENT_SAVINGS`);
      processed[url] = primary;
      continue;
    }
    const mobileUrl = `${url.slice(0, -path.posix.extname(url).length)}-800.webp`;
    primary = {
      ...primary,
      mobile: {
        src: mobileUrl,
        width: mobile.width,
        height: mobile.height,
        bytes: mobile.bytes,
        outputHash: mobile.outputHash
      }
    };
    processed[url] = primary;
    stageOutputs.push({ url: mobileUrl, buffer: mobile.buffer, sourceHash: primary.sourceHash, imageName: path.basename(file), mobile: true });
  }
  await applyPhotoAggregateRecovery(context, slug, article, processed, stageOutputs, warnings);
  return {
    slug,
    article,
    sourceBytes,
    stageOutputs,
    processed,
    updatedSource: await fsp.readFile(article.file, "utf8"),
    updatedArticle: { ...article, body: [...article.body] },
    oldReferences: [],
    removable: [],
    warnings,
    historicalPrimaryPreserved: true
  };
}

async function planHistoricalGeneratedStateRepair(context, slug, initialWarnings = []) {
  const article = context.currentInventory.articles[slug];
  const stageOutputs = [];
  const processed = {};
  const warnings = [...initialWarnings];
  const removable = [];
  let sourceBytes = 0;
  for (const url of allArticleReferences(article)) {
    const file = context.currentInventory.assets[url]?.file;
    if (!file) continue;
    const existing = context.existingManifest.assets?.[url];
    const current = await describeExistingAsset(url, file, context.currentInventory, existing, context.publicRoot, context.historicalKindClassifications);
    sourceBytes += current.bytes;
    processed[url] = current;
    const invalidExtremeKindMobile = current.mobile
      && current.kind !== "photo"
      && Math.max(current.mobile.width, current.mobile.height) < 640;
    if (invalidExtremeKindMobile) {
      const mobileFile = publicUrlFile(context.publicRoot, current.mobile.src);
      delete current.mobile;
      if (fs.existsSync(mobileFile)) removable.push(mobileFile);
      const candidate = await createMobileVariant({
        input: file,
        filename: path.basename(file),
        slug,
        role: current.role,
        kind: current.kind,
        outputFormat: "webp",
        preserveCrop: true
      });
      const retained = candidate.ok && candidate.format === "webp" && shouldKeepMobileVariant({
        desktopBytes: current.bytes,
        mobileBytes: candidate.bytes,
        desktopWidth: current.width,
        mobileWidth: candidate.width
      });
      if (retained) {
        current.mobile = {
          src: existing.mobile.src,
          width: candidate.width,
          height: candidate.height,
          bytes: candidate.bytes,
          outputHash: candidate.outputHash
        };
        stageOutputs.push({
          url: existing.mobile.src,
          buffer: candidate.buffer,
          sourceHash: current.sourceHash,
          imageName: path.basename(file),
          mobile: true
        });
      }
      warnings.push(`INVALID_EXTREME_MOBILE_KIND_${retained ? "REGENERATED" : "REMOVED"} slug=${slug} primary=${url} kind=${current.kind} mobile=${existing.mobile.src} long-edge=${Math.max(existing.mobile.width, existing.mobile.height)}`);
    }
    if (existing?.mobile?.src && !current.mobile) {
      const mobileFile = publicUrlFile(context.publicRoot, existing.mobile.src);
      if (fs.existsSync(mobileFile) && !removable.includes(mobileFile)) removable.push(mobileFile);
      if (!invalidExtremeKindMobile) {
        warnings.push(`INVALID_MOBILE_VARIANT_REMOVED slug=${slug} primary=${url} mobile=${existing.mobile.src} primary-width=${current.width} mobile-width=${existing.mobile.width}`);
      }
    }
  }
  const normal = articleTransferTotals(article, processed);
  if (normal.desktop <= ARTICLE_BUDGETS[article.budgetClass].desktop) {
    await applyPhotoAggregateRecovery(context, slug, article, processed, stageOutputs, warnings);
  }
  const replacedUrls = new Set(stageOutputs.map(({ url }) => url));
  return {
    slug,
    article,
    sourceBytes,
    stageOutputs,
    processed,
    updatedSource: await fsp.readFile(article.file, "utf8"),
    updatedArticle: { ...article, body: [...article.body] },
    oldReferences: [],
    removable: removable.filter((file) => !replacedUrls.has(`/${relativeRepositoryPath(context.publicRoot, file)}`)),
    warnings,
    historicalPrimaryPreserved: true
  };
}

async function readManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) return { version: 1, processorVersion: PROCESSOR_VERSION, assets: {}, articles: {} };
  try {
    const manifest = JSON.parse(await fsp.readFile(manifestPath, "utf8"));
    return {
      version: manifest.version ?? 1,
      processorVersion: manifest.processorVersion ?? PROCESSOR_VERSION,
      assets: manifest.assets ?? {},
      articles: manifest.articles ?? {}
    };
  } catch (error) {
    throw failure(`Invalid existing article image manifest: ${error.message}`, {
      code: "INVALID_MANIFEST",
      recommendedAction: "Restore or correct the generated manifest before preparation."
    });
  }
}

function collisionError(plan, output) {
  return failure(`Changed source hash targets existing output path ${output.url} for ${output.imageName}.`, {
    code: "SOURCE_HASH_COLLISION", slug: plan.slug, imageName: output.imageName,
    observedValue: output.sourceHash, permittedValue: "the sourceHash already recorded for this output path",
    recommendedAction: "Choose a new semantic filename or explicitly review the existing destination."
  });
}

function validateOutputCollisions(context, plans) {
  for (const plan of plans) {
    for (const output of plan.stageOutputs) {
      const destination = publicUrlFile(context.publicRoot, output.url);
      assertRepositoryPath(destination, context.publicRoot, "publish destination");
      if (!fs.existsSync(destination)) continue;
      if (output.historicalPrimary) {
        if (!allArticleReferences(plan.article).includes(output.url)) throw collisionError(plan, output);
        continue;
      }
      if (output.mobile) {
        const owner = Object.values(context.existingManifest.assets ?? {}).find((asset) => asset.mobile?.src === output.url);
        if (!owner || normalizedHash(owner.sourceHash) !== normalizedHash(output.sourceHash)) throw collisionError(plan, output);
      } else {
        const existing = context.existingManifest.assets?.[output.url];
        if (!existing || normalizedHash(existing.sourceHash) !== normalizedHash(output.sourceHash)) throw collisionError(plan, output);
      }
    }
  }
}

function applyPlansToInventory(currentInventory, plans, stageRoot) {
  const candidate = cloneInventory(currentInventory);
  for (const plan of plans) {
    candidate.articles[plan.slug] = plan.updatedArticle;
  }
  const referenced = new Set(Object.values(candidate.articles).flatMap(allArticleReferences));
  for (const url of Object.keys(candidate.assets)) {
    if (!referenced.has(url)) delete candidate.assets[url];
  }
  for (const plan of plans) {
    for (const output of plan.stageOutputs.filter((item) => !item.mobile)) {
      candidate.assets[output.url] = { url: output.url, file: path.join(stageRoot, "public", output.url.slice(1)) };
    }
  }
  return candidate;
}

async function processedAssetsForCandidate(context, candidate, plans) {
  const overridden = Object.assign({}, ...plans.map((plan) => plan.processed));
  const processed = {};
  for (const [url, asset] of Object.entries(candidate.assets)) {
    if (overridden[url]) processed[url] = overridden[url];
    else processed[url] = await describeExistingAsset(url, asset.file, candidate, context.existingManifest.assets?.[url], context.publicRoot, context.historicalKindClassifications);
  }
  return processed;
}

function validateArticleBudgets(candidate, processed, slugs) {
  const totals = new Map();
  for (const slug of slugs) {
    const article = candidate.articles[slug];
    const urls = [...new Set([article.cover, ...article.body].filter(Boolean))];
    const desktopBytes = urls.reduce((total, url) => total + processed[url].bytes, 0);
    const mobileBytes = urls.reduce((total, url) => total + (processed[url].mobile?.bytes ?? processed[url].bytes), 0);
    const budget = ARTICLE_BUDGETS[article.budgetClass];
    if (desktopBytes > budget.desktop || mobileBytes > budget.mobile) {
      const viewport = desktopBytes > budget.desktop ? "desktop" : "mobile";
      const observed = viewport === "desktop" ? desktopBytes : mobileBytes;
      const permitted = budget[viewport];
      throw failure(`${slug}: ${viewport} article image budget observed ${observed}; permitted ${permitted}.`, {
        code: "ARTICLE_BUDGET_EXCEEDED", slug,
        observedValue: observed, permittedValue: permitted,
        recommendedAction: "Reduce or manually optimize the largest article image."
      });
    }
    totals.set(slug, { desktopBytes, mobileBytes });
  }
  return totals;
}

async function stagePlans(context, plans, candidateManifestSource) {
  for (const plan of plans) {
    for (const output of plan.stageOutputs) {
      const file = path.join(context.stageRoot, "public", output.url.slice(1));
      await fsp.mkdir(path.dirname(file), { recursive: true });
      await fsp.writeFile(file, output.buffer);
      output.stageFile = file;
      delete output.buffer;
    }
    const mdxStage = path.join(context.stageRoot, "content", relativeRepositoryPath(context.contentRoot, plan.article.file));
    await fsp.mkdir(path.dirname(mdxStage), { recursive: true });
    await fsp.writeFile(mdxStage, plan.updatedSource);
    plan.mdxStage = mdxStage;
  }
  const manifestStage = path.join(context.stageRoot, "manifest.json");
  await fsp.writeFile(manifestStage, candidateManifestSource);
  return manifestStage;
}

async function sameFileBytes(file, candidate) {
  if (!fs.existsSync(file)) return false;
  const [current, next] = await Promise.all([fsp.readFile(file), fsp.readFile(candidate)]);
  return current.equals(next);
}

async function createReports(context, plans, totals, manifestStage) {
  const manifestChanged = !(await sameFileBytes(context.manifestPath, manifestStage));
  const reports = [];
  for (const plan of plans) {
    const filesCreated = [];
    const filesReplaced = [];
    const filesRemoved = plan.removable.map((file) => relativeRepositoryPath(context.projectRoot, file));
    const candidateWrites = plan.stageOutputs.map(({ url, stageFile }) => ({
      destination: publicUrlFile(context.publicRoot, url), stageFile
    }));
    if (plan.updatedSource !== await fsp.readFile(plan.article.file, "utf8")) {
      candidateWrites.push({ destination: plan.article.file, stageFile: plan.mdxStage });
    }
    for (const write of candidateWrites) {
      const relative = relativeRepositoryPath(context.projectRoot, write.destination);
      if (!fs.existsSync(write.destination)) filesCreated.push(relative);
      else if (!(await sameFileBytes(write.destination, write.stageFile))) filesReplaced.push(relative);
    }
    let netRepositoryBytes = 0;
    for (const write of candidateWrites) {
      const oldBytes = fs.existsSync(write.destination) ? fs.statSync(write.destination).size : 0;
      netRepositoryBytes += fs.statSync(write.stageFile).size - oldBytes;
    }
    for (const file of plan.removable) netRepositoryBytes -= fs.statSync(file).size;
    if (plan === plans[0] && manifestChanged) {
      const oldBytes = fs.existsSync(context.manifestPath) ? fs.statSync(context.manifestPath).size : 0;
      netRepositoryBytes += fs.statSync(manifestStage).size - oldBytes;
      (fs.existsSync(context.manifestPath) ? filesReplaced : filesCreated)
        .push(relativeRepositoryPath(context.projectRoot, context.manifestPath));
    }
    reports.push({
      slug: plan.slug,
      dryRun: context.dryRun,
      budgetClass: plan.updatedArticle.budgetClass,
      sourceBytes: plan.sourceBytes,
      desktopBytes: totals.get(plan.slug).desktopBytes,
      mobileBytes: totals.get(plan.slug).mobileBytes,
      filesCreated,
      filesReplaced,
      filesRemoved,
      netRepositoryBytes,
      warnings: [...plan.warnings],
      manifestChanged,
      historicalPrimaryPreserved: plan.historicalPrimaryPreserved
    });
  }
  return reports;
}

async function atomicWrite(destination, source) {
  await fsp.mkdir(path.dirname(destination), { recursive: true });
  const temporary = path.join(path.dirname(destination), `.${path.basename(destination)}.${crypto.randomUUID()}.tmp`);
  try {
    await fsp.copyFile(source, temporary);
    await fsp.rename(temporary, destination);
  } finally {
    await fsp.rm(temporary, { force: true });
  }
}

async function commitPlans(context, plans, manifestStage) {
  const writes = [];
  for (const plan of plans) {
    for (const output of plan.stageOutputs) {
      const destination = publicUrlFile(context.publicRoot, output.url);
      assertRepositoryPath(destination, context.publicRoot, "publish replacement");
      writes.push({ destination, source: output.stageFile });
    }
    if (plan.updatedSource !== await fsp.readFile(plan.article.file, "utf8")) {
      assertRepositoryPath(plan.article.file, context.contentRoot, "target MDX replacement");
      writes.push({ destination: plan.article.file, source: plan.mdxStage });
    }
  }
  assertExactRepositoryPath(context.manifestPath, context.expectedManifestPath, "manifest replacement");
  writes.push({ destination: context.manifestPath, source: manifestStage });
  const removals = [...new Set(plans.flatMap((plan) => plan.removable))];
  for (const removal of removals) assertRepositoryPath(removal, context.publicRoot, "publish removal");
  const touched = [...new Set([...writes.map(({ destination }) => destination), ...removals])];
  const backups = new Map();
  for (const file of touched) backups.set(file, fs.existsSync(file) ? await fsp.readFile(file) : null);
  try {
    for (const write of writes) await atomicWrite(write.destination, write.source);
    for (const file of removals) await fsp.rm(file);
  } catch (error) {
    const restoreErrors = [];
    for (const [file, backup] of backups) {
      try {
        if (backup === null) {
          if (fs.existsSync(file)) await fsp.rm(file, { force: true });
        }
        else {
          const backupFile = path.join(context.stageRoot, "backups", crypto.randomUUID());
          await fsp.mkdir(path.dirname(backupFile), { recursive: true });
          await fsp.writeFile(backupFile, backup);
          await atomicWrite(file, backupFile);
        }
      } catch (restoreError) {
        restoreErrors.push(`${file}: ${restoreError.message}`);
      }
    }
    throw failure(`Phase-two repository write failed: ${error.message}${restoreErrors.length ? `; restore failures: ${restoreErrors.join("; ")}` : ""}`, {
      code: "ATOMIC_COMMIT_FAILED",
      recommendedAction: restoreErrors.length ? "Restore the named files from Git before retrying." : "Resolve the filesystem error and retry preparation."
    });
  }
}

function canonicalPath(candidate) {
  let cursor = path.resolve(candidate);
  const remainder = [];
  while (!fs.existsSync(cursor)) {
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    remainder.unshift(path.basename(cursor));
    cursor = parent;
  }
  const existing = fs.existsSync(cursor) ? fs.realpathSync.native(cursor) : cursor;
  return path.resolve(existing, ...remainder);
}

function pathIsContained(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

function repositoryPathError(label, observed, permitted) {
  return failure(`Invalid repository path for ${label}: ${observed}; expected ${permitted}.`, {
    code: "INVALID_REPOSITORY_PATH",
    observedValue: observed,
    permittedValue: permitted,
    recommendedAction: "Keep repository roots and write targets inside their standard projectRoot areas."
  });
}

function assertRepositoryPath(candidate, expectedRoot, label) {
  const canonicalRoot = canonicalPath(expectedRoot);
  const canonicalCandidate = canonicalPath(candidate);
  if (!pathIsContained(canonicalRoot, canonicalCandidate)) {
    throw repositoryPathError(label, canonicalCandidate, canonicalRoot);
  }
  return canonicalCandidate;
}

function assertExactRepositoryPath(candidate, expected, label) {
  const canonicalCandidate = canonicalPath(candidate);
  const canonicalExpected = canonicalPath(expected);
  if (canonicalCandidate !== canonicalExpected) {
    throw repositoryPathError(label, canonicalCandidate, canonicalExpected);
  }
  return canonicalCandidate;
}

function resolveContext(options) {
  const requestedProjectRoot = path.resolve(options.projectRoot ?? process.cwd());
  if (!fs.existsSync(requestedProjectRoot) || !fs.statSync(requestedProjectRoot).isDirectory()) {
    throw repositoryPathError("projectRoot", requestedProjectRoot, "an existing project directory");
  }
  const projectRoot = fs.realpathSync.native(requestedProjectRoot);
  const expectedContentRoot = path.join(projectRoot, "content");
  const expectedPublicRoot = path.join(projectRoot, "public");
  const expectedManifestPath = path.join(projectRoot, "lib", "generated", "article-image-manifest.json");
  const contentRoot = assertExactRepositoryPath(options.contentRoot ?? expectedContentRoot, expectedContentRoot, "contentRoot");
  const publicRoot = assertExactRepositoryPath(options.publicRoot ?? expectedPublicRoot, expectedPublicRoot, "publicRoot");
  const manifestPath = assertExactRepositoryPath(options.manifestPath ?? expectedManifestPath, expectedManifestPath, "manifestPath");
  assertRepositoryPath(contentRoot, projectRoot, "contentRoot");
  assertRepositoryPath(publicRoot, projectRoot, "publicRoot");
  assertRepositoryPath(manifestPath, projectRoot, "manifestPath");
  return {
    projectRoot,
    contentRoot,
    publicRoot,
    manifestPath,
    expectedManifestPath,
    dryRun: Boolean(options.dryRun),
    repairGeneratedState: Boolean(options.repairGeneratedState)
  };
}

async function prepareSelection(options, mode) {
  const context = resolveContext(options);
  context.stageRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "wcb-article-image-stage-"));
  try {
    const files = articleFilesBySlug(context.contentRoot);
    const requestedSlugs = mode === "all" ? [...files.keys()].sort() : [options.slug];
    if (!requestedSlugs.length) {
      throw failure("No article MDX files were found.", {
        code: "NO_ARTICLES", recommendedAction: "Confirm the content root and add an article before preparation."
      });
    }
    if (mode === "single" && !files.has(options.slug)) {
      throw failure(`Unknown article slug: ${options.slug}`, {
        code: "UNKNOWN_ARTICLE_SLUG", slug: options.slug,
        recommendedAction: "Use the exact basename of an existing article MDX file."
      });
    }
    for (const file of files.values()) assertRepositoryPath(file, context.contentRoot, "article MDX");
    const sourceRoots = new Map();
    for (const slug of requestedSlugs) {
      const sourceRoot = mode === "single"
        ? path.resolve(options.sourceRoot ?? path.join(DEFAULT_SOURCE_LIBRARY, slug))
        : path.resolve(options.sourceLibraryRoot ?? DEFAULT_SOURCE_LIBRARY, slug);
      if (fs.existsSync(sourceRoot) && fs.statSync(sourceRoot).isDirectory()) {
        sourceRoots.set(slug, sourceRoot);
      }
      else if (mode === "single") {
        throw failure(`Visual Asset Folder Not Found: ${sourceRoot}`, {
          code: "VISUAL_ASSET_FOLDER_NOT_FOUND", slug,
          recommendedAction: `Create or restore the exact source folder ${sourceRoot}.`
        });
      }
    }
    const inventoryPublicRoot = await inventoryPublicOverlay(
      context,
      mode === "single" ? [...sourceRoots.keys()] : [],
      files
    );
    context.historicalKindClassifications = mode === "all"
      ? readHistoricalKindClassifications(context.projectRoot)
      : {};
    context.currentInventory = discoverArticleInventory({
      contentRoot: context.contentRoot,
      publicRoot: inventoryPublicRoot,
      historicalKindClassifications: context.historicalKindClassifications
    });
    for (const url of Object.keys(context.currentInventory.assets)) {
      const repositoryAsset = publicUrlFile(context.publicRoot, url);
      if (fs.existsSync(repositoryAsset)) assertRepositoryPath(repositoryAsset, context.publicRoot, "published source asset");
    }
    context.existingManifest = await readManifest(context.manifestPath);
    const plans = [];
    for (const slug of requestedSlugs) {
      const sourceRoot = sourceRoots.get(slug);
      if (mode === "single") {
        plans.push(await planSourceArticle(context, slug, sourceRoot));
      } else {
        const warnings = sourceRoot
          ? await validateHistoricalSourceFolder(context, slug, sourceRoot)
          : [];
        plans.push(context.repairGeneratedState
          ? await planHistoricalGeneratedStateRepair(context, slug, warnings)
          : await planHistoricalArticle(context, slug, warnings));
      }
    }
    for (const plan of plans) {
      assertRepositoryPath(plan.article.file, context.contentRoot, "target MDX");
      for (const removal of plan.removable) assertRepositoryPath(removal, context.publicRoot, "publish removal");
    }
    validateOutputCollisions(context, plans);
    const candidate = applyPlansToInventory(context.currentInventory, plans, context.stageRoot);
    const processed = await processedAssetsForCandidate(context, candidate, plans);
    const totals = validateArticleBudgets(candidate, processed, requestedSlugs);
    const manifest = buildManifest({ inventory: candidate, processedAssets: processed, processorVersion: PROCESSOR_VERSION });
    const manifestSource = serializeManifest(manifest);
    const manifestStage = await stagePlans(context, plans, manifestSource);
    const reports = await createReports(context, plans, totals, manifestStage);
    if (!context.dryRun) await commitPlans(context, plans, manifestStage);
    if (mode === "single") return reports[0];
    return {
      mode: "all",
      dryRun: context.dryRun,
      articles: reports,
      sourceBytes: reports.reduce((sum, report) => sum + report.sourceBytes, 0),
      desktopBytes: reports.reduce((sum, report) => sum + report.desktopBytes, 0),
      mobileBytes: reports.reduce((sum, report) => sum + report.mobileBytes, 0),
      filesCreated: reports.flatMap((report) => report.filesCreated),
      filesReplaced: reports.flatMap((report) => report.filesReplaced),
      filesRemoved: reports.flatMap((report) => report.filesRemoved),
      netRepositoryBytes: reports.reduce((sum, report) => sum + report.netRepositoryBytes, 0),
      warnings: reports.flatMap((report) => report.warnings),
      manifestChanged: reports.some((report) => report.manifestChanged)
    };
  } finally {
    await fsp.rm(context.stageRoot, { recursive: true, force: true });
  }
}

export async function prepareArticleImages(options = {}) {
  if (typeof options.slug !== "string" || !VALID_SLUG.test(options.slug)) {
    throw failure("Invalid slug; use lowercase letters, numbers, and hyphens only.", {
      code: "INVALID_SLUG", slug: options.slug ?? null,
      observedValue: options.slug ?? "missing", permittedValue: "lowercase letters, numbers, and hyphens",
      recommendedAction: "Pass one exact article slug."
    });
  }
  return prepareSelection(options, "single");
}

export function prepareAllArticleImages(options = {}) {
  return prepareSelection(options, "all");
}
