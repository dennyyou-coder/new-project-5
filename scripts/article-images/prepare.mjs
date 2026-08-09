import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

import sharp from "sharp";

import { ARTICLE_BUDGETS } from "./config.mjs";
import { buildManifest, serializeManifest } from "./manifest.mjs";
import { discoverArticleInventory } from "./references.mjs";
import {
  createMobileVariant,
  inspectSource,
  shouldKeepMobileVariant,
  transformAsset
} from "./transform.mjs";

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SOURCE_IMAGE = /\.(?:jpe?g|png|webp)$/i;
const DEFAULT_SOURCE_LIBRARY = "/Users/youdenny/Desktop/WorldCleanBizAssets";
const PROCESSOR_VERSION = "1";
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

function sha256(buffer) {
  return `sha256:${crypto.createHash("sha256").update(buffer).digest("hex")}`;
}

function normalizedHash(value) {
  return typeof value === "string" ? `sha256:${value.replace(/^sha256:/i, "").toLowerCase()}` : null;
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

function exactKeys(value, allowed, context) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw failure(`${context} must be an object.`, {
      code: "INVALID_IMAGE_CONFIG",
      recommendedAction: "Use the documented image-config.json object schema."
    });
  }
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length) {
    throw failure(`Unknown ${context} field: ${unknown.join(", ")}`, {
      code: "INVALID_IMAGE_CONFIG", observedValue: unknown.join(", "), permittedValue: [...allowed].join(", "),
      recommendedAction: "Remove unsupported fields from image-config.json."
    });
  }
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

async function readImageConfig(sourceRoot, descriptors) {
  const configPath = path.join(sourceRoot, "image-config.json");
  if (!fs.existsSync(configPath)) return {};
  let parsed;
  try {
    parsed = JSON.parse(await fsp.readFile(configPath, "utf8"));
  } catch (error) {
    throw failure(`Invalid image-config.json: ${error.message}`, {
      code: "INVALID_IMAGE_CONFIG",
      recommendedAction: "Correct the JSON syntax and rerun preparation."
    });
  }
  exactKeys(parsed, new Set(["images"]), "image-config.json");
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
}

async function discoverSourceImages(sourceRoot) {
  const entries = (await fsp.readdir(sourceRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && SOURCE_IMAGE.test(entry.name))
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

async function describeExistingAsset(url, file, inventory, existing, publicRoot) {
  const source = await inspectSource(file);
  const transparent = await hasRealTransparency(file);
  const metadata = await sharp(file).metadata();
  const role = existing?.role ?? roleForUrl(inventory, url);
  const kind = existing?.kind ?? (transparent ? "transparent" : "photo");
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
      result.mobile = {
        src: existing.mobile.src,
        width: mobile.width,
        height: mobile.height,
        bytes: mobile.bytes,
        outputHash: mobile.sourceHash
      };
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
  const config = await readImageConfig(sourceRoot, descriptors);
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

async function planHistoricalArticle(context, slug) {
  const article = context.currentInventory.articles[slug];
  const stageOutputs = [];
  const processed = {};
  const warnings = [];
  let sourceBytes = 0;
  for (const url of allArticleReferences(article)) {
    const file = context.currentInventory.assets[url]?.file;
    if (!file) continue;
    const existing = context.existingManifest.assets?.[url];
    const primary = await describeExistingAsset(url, file, context.currentInventory, existing, context.publicRoot);
    processed[url] = primary;
    sourceBytes += primary.bytes;
    const role = primary.role;
    const kind = primary.kind;
    const mobile = await createMobileVariant({
      input: file,
      filename: path.basename(file),
      slug,
      role,
      kind,
      outputFormat: "webp"
    });
    if (!mobile.ok) {
      warnings.push(`${path.basename(file)}: ${mobile.code}`);
      continue;
    }
    if (mobile.format !== "webp" || !shouldKeepMobileVariant({ desktopBytes: primary.bytes, mobileBytes: mobile.bytes })) {
      warnings.push(`${path.basename(file)}: MOBILE_VARIANT_DISCARDED_INSUFFICIENT_SAVINGS`);
      continue;
    }
    const mobileUrl = `${url.slice(0, -path.posix.extname(url).length)}-800.webp`;
    processed[url] = {
      ...primary,
      mobile: {
        src: mobileUrl,
        width: mobile.width,
        height: mobile.height,
        bytes: mobile.bytes,
        outputHash: mobile.outputHash
      }
    };
    stageOutputs.push({ url: mobileUrl, buffer: mobile.buffer, sourceHash: primary.sourceHash, imageName: path.basename(file), mobile: true });
  }
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
      if (!fs.existsSync(destination)) continue;
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
    else processed[url] = await describeExistingAsset(url, asset.file, candidate, context.existingManifest.assets?.[url], context.publicRoot);
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
      writes.push({ destination: publicUrlFile(context.publicRoot, output.url), source: output.stageFile });
    }
    if (plan.updatedSource !== await fsp.readFile(plan.article.file, "utf8")) {
      writes.push({ destination: plan.article.file, source: plan.mdxStage });
    }
  }
  writes.push({ destination: context.manifestPath, source: manifestStage });
  const removals = [...new Set(plans.flatMap((plan) => plan.removable))];
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

function resolveContext(options) {
  const projectRoot = path.resolve(options.projectRoot ?? process.cwd());
  const contentRoot = path.resolve(options.contentRoot ?? path.join(projectRoot, "content"));
  const publicRoot = path.resolve(options.publicRoot ?? path.join(projectRoot, "public"));
  const manifestPath = path.resolve(options.manifestPath ?? path.join(projectRoot, "lib", "generated", "article-image-manifest.json"));
  return { projectRoot, contentRoot, publicRoot, manifestPath, dryRun: Boolean(options.dryRun) };
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
    const sourceRoots = new Map();
    for (const slug of requestedSlugs) {
      const sourceRoot = mode === "single"
        ? path.resolve(options.sourceRoot ?? path.join(DEFAULT_SOURCE_LIBRARY, slug))
        : path.resolve(options.sourceLibraryRoot ?? DEFAULT_SOURCE_LIBRARY, slug);
      if (fs.existsSync(sourceRoot) && fs.statSync(sourceRoot).isDirectory()) sourceRoots.set(slug, sourceRoot);
      else if (mode === "single") {
        throw failure(`Visual Asset Folder Not Found: ${sourceRoot}`, {
          code: "VISUAL_ASSET_FOLDER_NOT_FOUND", slug,
          recommendedAction: `Create or restore the exact source folder ${sourceRoot}.`
        });
      }
    }
    const inventoryPublicRoot = await inventoryPublicOverlay(context, [...sourceRoots.keys()], files);
    context.currentInventory = discoverArticleInventory({ contentRoot: context.contentRoot, publicRoot: inventoryPublicRoot });
    context.existingManifest = await readManifest(context.manifestPath);
    const plans = [];
    for (const slug of requestedSlugs) {
      const sourceRoot = sourceRoots.get(slug);
      if (!sourceRoot) {
        plans.push(await planHistoricalArticle(context, slug));
      } else {
        plans.push(await planSourceArticle(context, slug, sourceRoot));
      }
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
