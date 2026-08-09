import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

import sharp from "sharp";

import {
  ARTICLE_BUDGETS,
  ARTICLE_IMAGE_BASELINE_BYTES,
  ARTICLE_IMAGE_LIMIT_BYTES,
  IMAGE_BUDGETS
} from "./config.mjs";
import { buildManifest, serializeManifest } from "./manifest.mjs";
import { discoverArticleInventory } from "./references.mjs";

const DEFAULT_SOURCE_LIBRARY = "/Users/youdenny/Desktop/WorldCleanBizAssets";
const HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;
const APPROVED_ROLES = new Set(["cover", "body", "chart", "transparent"]);
const APPROVED_KINDS = new Set(["photo", "graphic", "transparent"]);
const GUARDED_IMAGE_DIRECTORIES = [
  "public/images/articles",
  "public/images/blog",
  "public/images/insights"
];
const SOURCE_IMAGE = /\.(?:jpe?g|png|webp)$/i;

function finding(code, message, { slug = "~repository", url = "" } = {}) {
  return { code, slug, url, message };
}

function compareFindings(left, right) {
  return left.slug.localeCompare(right.slug)
    || left.url.localeCompare(right.url)
    || left.code.localeCompare(right.code)
    || left.message.localeCompare(right.message);
}

export function sortFindings(findings) {
  return findings.sort(compareFindings);
}

function result(failures, warnings, extra = {}) {
  sortFindings(failures);
  sortFindings(warnings);
  return { ok: failures.length === 0, failures, warnings, ...extra };
}

function roleBudget(role, viewport) {
  const configured = IMAGE_BUDGETS[role];
  if (typeof configured === "number") return configured;
  return configured?.[viewport];
}

function selectedArticleUrls(article) {
  return [...new Set([article.cover, ...(article.body ?? [])].filter(Boolean))];
}

function explicitImageBudget(article) {
  if (article.imageBudget !== undefined) return article.imageBudget;
  if (article.requestedBudgetClass !== undefined) return article.requestedBudgetClass;
  if (!article.file || !fs.existsSync(article.file)) return null;
  const source = fs.readFileSync(article.file, "utf8");
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? "";
  const value = frontmatter.match(/^image_budget:\s*(.*?)\s*$/m)?.[1];
  return value?.replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2") ?? null;
}

export function verifyArticleBudget(article, assets) {
  const failures = [];
  const warnings = [];
  const urls = selectedArticleUrls(article);
  const requestedClass = article.budgetClass ?? "standard";
  const explicitClass = explicitImageBudget(article);
  const bodyImageCount = article.body?.length ?? 0;
  let budgetClass = requestedClass;
  const ineligibleExplicitDeep = explicitClass === "deep" && bodyImageCount <= 8;
  const unapprovedDeep = requestedClass === "deep" && explicitClass !== "deep";
  if (ineligibleExplicitDeep || unapprovedDeep) {
    failures.push(finding(
      "DEEP_BUDGET_NOT_ELIGIBLE",
      `${article.slug}: deep budget requires explicit image_budget: deep and more than 8 body images; actual image_budget ${String(explicitClass)} with ${bodyImageCount} body images, allowed explicit deep with minimum 9 body images.`,
      { slug: article.slug }
    ));
    budgetClass = "standard";
  } else if (!ARTICLE_BUDGETS[requestedClass]) {
    failures.push(finding(
      "UNKNOWN_ARTICLE_BUDGET",
      `${article.slug}: unknown article budget ${String(requestedClass)}; allowed standard or deep.`,
      { slug: article.slug }
    ));
    budgetClass = "standard";
  }

  let desktopBytes = 0;
  let mobileBytes = 0;
  for (const url of urls) {
    const asset = assets?.[url];
    if (!asset) {
      failures.push(finding(
        "MISSING_BUDGET_ASSET",
        `${article.slug} ${url}: referenced image has no registered asset facts.`,
        { slug: article.slug, url }
      ));
      continue;
    }
    if (!APPROVED_ROLES.has(asset.role)) {
      failures.push(finding(
        "UNKNOWN_IMAGE_ROLE",
        `${article.slug} ${url}: actual role ${String(asset.role)}; allowed cover, body, chart, or transparent.`,
        { slug: article.slug, url }
      ));
    } else {
      const desktopLimit = roleBudget(asset.role, "desktop");
      if (Number.isFinite(asset.bytes) && asset.bytes > desktopLimit) {
        failures.push(finding(
          "FILE_BUDGET_EXCEEDED",
          `${article.slug} ${url}: desktop file budget actual ${asset.bytes} bytes; allowed ${desktopLimit} bytes for role ${asset.role}.`,
          { slug: article.slug, url }
        ));
      }
      if (asset.mobile) {
        const mobileLimit = roleBudget(asset.role, "mobile");
        if (Number.isFinite(asset.mobile.bytes) && asset.mobile.bytes > mobileLimit) {
          failures.push(finding(
            "FILE_BUDGET_EXCEEDED",
            `${article.slug} ${asset.mobile.src}: mobile file budget actual ${asset.mobile.bytes} bytes; allowed ${mobileLimit} bytes for role ${asset.role}.`,
            { slug: article.slug, url: asset.mobile.src ?? url }
          ));
        }
      }
    }
    if (Number.isFinite(asset.bytes)) {
      desktopBytes += asset.bytes;
      mobileBytes += Number.isFinite(asset.mobile?.bytes) ? asset.mobile.bytes : asset.bytes;
    }
  }

  const articleBudget = ARTICLE_BUDGETS[budgetClass];
  for (const [viewport, actual] of [["desktop", desktopBytes], ["mobile", mobileBytes]]) {
    const allowed = articleBudget[viewport];
    if (actual > allowed) {
      failures.push(finding(
        "ARTICLE_BUDGET_EXCEEDED",
        `${article.slug}: ${viewport} article transfer actual ${actual} bytes; allowed ${allowed} bytes for ${budgetClass}.`,
        { slug: article.slug }
      ));
    }
  }

  return result(failures, warnings, { slug: article.slug, budgetClass, desktopBytes, mobileBytes, urls });
}

function resolveVerificationPaths(options = {}) {
  const projectRoot = path.resolve(options.projectRoot ?? process.cwd());
  return {
    projectRoot,
    contentRoot: path.resolve(options.contentRoot ?? path.join(projectRoot, "content")),
    publicRoot: path.resolve(options.publicRoot ?? path.join(projectRoot, "public")),
    manifestPath: path.resolve(options.manifestPath ?? path.join(projectRoot, "lib", "generated", "article-image-manifest.json")),
    sourceLibraryRoot: options.sourceLibraryRoot === null
      ? null
      : path.resolve(options.sourceLibraryRoot ?? DEFAULT_SOURCE_LIBRARY)
  };
}

function sha256(file) {
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")}`;
}

function pathContained(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

function localPublicFile(publicRoot, url) {
  if (typeof url !== "string" || !url.startsWith("/") || url.startsWith("//")) return null;
  const withoutSuffix = url.split(/[?#]/, 1)[0];
  const file = path.resolve(publicRoot, `.${withoutSuffix}`);
  return pathContained(publicRoot, file) ? file : null;
}

function normalizeFormat(format) {
  return String(format ?? "").toLowerCase().replace(/^jpg$/, "jpeg");
}

function ownerMap(inventory) {
  const owners = new Map();
  for (const [slug, article] of Object.entries(inventory.articles)) {
    for (const url of new Set([article.cover, article.social, ...article.body].filter(Boolean))) {
      const entry = owners.get(url) ?? { slugs: new Set(), cover: false, body: false };
      entry.slugs.add(slug);
      if (article.cover === url || article.social === url) entry.cover = true;
      if (article.body.includes(url)) entry.body = true;
      owners.set(url, entry);
    }
  }
  return owners;
}

function primaryOwner(owners, url) {
  return [...(owners.get(url)?.slugs ?? [])].sort()[0] ?? "~repository";
}

function sanitizeStem(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sourceLogicalKey(basename) {
  const extension = path.extname(basename);
  const match = basename.slice(0, -extension.length).match(/^(\d{2})-(.+)$/);
  if (!match) return null;
  const semantic = sanitizeStem(match[2]);
  return semantic ? `${match[1]}-${semantic}` : null;
}

function exactSourceFiles(sourceLibraryRoot, owners, url) {
  const outputExtension = path.posix.extname(url).toLowerCase();
  if (!sourceLibraryRoot || ![".webp", ".jpg", ".jpeg", ".png"].includes(outputExtension)) return [];
  const expected = sourceLogicalKey(path.posix.basename(url));
  if (!expected) return [];
  const files = [];
  for (const slug of [...(owners.get(url)?.slugs ?? [])].sort()) {
    const folder = path.join(sourceLibraryRoot, slug);
    if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) continue;
    for (const entry of fs.readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (!entry.isFile() || !SOURCE_IMAGE.test(entry.name)) continue;
      if (sourceLogicalKey(entry.name) === expected) files.push({ slug, file: path.join(folder, entry.name) });
    }
  }
  return files;
}

function validateHash(value, field, slug, url, failures) {
  if (!HASH_PATTERN.test(String(value ?? ""))) {
    failures.push(finding(
      "INVALID_HASH",
      `${slug} ${url}: actual ${field} ${String(value)}; allowed sha256 followed by 64 lowercase hexadecimal characters.`,
      { slug, url }
    ));
    return false;
  }
  return true;
}

function validateManifestRole(asset, usage, slug, url, failures) {
  if (!APPROVED_ROLES.has(asset.role)) {
    failures.push(finding(
      "ROLE_MISMATCH",
      `${slug} ${url}: actual role ${String(asset.role)}; allowed approved inventory role.`,
      { slug, url }
    ));
    return;
  }
  const valid = usage?.cover
    ? asset.role === "cover" && !usage.body
    : usage?.body && ["body", "chart", "transparent"].includes(asset.role);
  if (!valid) {
    const expected = usage?.cover && usage?.body ? "one non-conflicting cover or body inventory role" : usage?.cover ? "cover" : "body, chart, or transparent";
    failures.push(finding(
      "ROLE_MISMATCH",
      `${slug} ${url}: actual role ${asset.role}; allowed ${expected}.`,
      { slug, url }
    ));
  }
  if (!APPROVED_KINDS.has(asset.kind)) {
    failures.push(finding(
      "KIND_MISMATCH",
      `${slug} ${url}: actual kind ${String(asset.kind)}; allowed photo, graphic, or transparent.`,
      { slug, url }
    ));
  }
}

async function inspectManifestFile({ publicRoot, url, recorded, slug, mobile = false, failures }) {
  const label = mobile ? "mobile" : "publish";
  const missingCode = mobile ? "MISSING_MOBILE_FILE" : "MISSING_PUBLISH_FILE";
  const file = localPublicFile(publicRoot, url);
  if (!file) {
    failures.push(finding(
      "INVALID_PUBLIC_URL",
      `${slug} ${url}: actual ${label} URL is outside public; allowed a local absolute public URL.`,
      { slug, url }
    ));
    return null;
  }
  if (!fs.existsSync(file)) {
    failures.push(finding(
      missingCode,
      `${slug} ${url}: actual ${label} file is missing; allowed an existing file under public.`,
      { slug, url }
    ));
    return null;
  }
  const lstat = fs.lstatSync(file);
  if (lstat.isSymbolicLink()) {
    failures.push(finding(
      "MANIFEST_FILE_SYMLINK",
      `${slug} ${url}: actual ${label} file is a symlink; allowed a regular file under public.`,
      { slug, url }
    ));
    return null;
  }
  const realFile = fs.realpathSync.native(file);
  const realPublic = fs.realpathSync.native(publicRoot);
  if (!pathContained(realPublic, realFile) || !lstat.isFile()) {
    failures.push(finding(
      "MANIFEST_FILE_OUTSIDE_PUBLIC",
      `${slug} ${url}: actual ${label} path ${realFile}; allowed a regular file within ${realPublic}.`,
      { slug, url }
    ));
    return null;
  }

  const actualBytes = lstat.size;
  if (recorded.bytes !== actualBytes) {
    failures.push(finding(
      "STALE_BYTES",
      `${slug} ${url}: ${label} bytes actual ${actualBytes} bytes; allowed ${recorded.bytes} bytes (recorded).`,
      { slug, url }
    ));
  }
  let metadata;
  try {
    metadata = await sharp(file).metadata();
  } catch (error) {
    failures.push(finding(
      "UNREADABLE_IMAGE",
      `${slug} ${url}: actual ${label} image is unreadable (${error.message}); allowed a supported image file.`,
      { slug, url }
    ));
    return null;
  }
  if (recorded.width !== metadata.width || recorded.height !== metadata.height) {
    failures.push(finding(
      "STALE_DIMENSIONS",
      `${slug} ${url}: ${label} dimensions actual ${metadata.width}x${metadata.height}; allowed recorded ${recorded.width}x${recorded.height}.`,
      { slug, url }
    ));
  }
  if (!mobile && normalizeFormat(recorded.format) !== normalizeFormat(metadata.format)) {
    failures.push(finding(
      "STALE_FORMAT",
      `${slug} ${url}: publish format actual ${normalizeFormat(metadata.format)}; allowed recorded ${normalizeFormat(recorded.format)}.`,
      { slug, url }
    ));
  }
  if (mobile && normalizeFormat(metadata.format) !== "webp") {
    failures.push(finding(
      "MOBILE_FORMAT_MISMATCH",
      `${slug} ${url}: mobile format actual ${normalizeFormat(metadata.format)}; allowed webp.`,
      { slug, url }
    ));
  }
  const actualHash = sha256(file);
  if (validateHash(recorded.outputHash, mobile ? "mobile.outputHash" : "outputHash", slug, url, failures)
    && recorded.outputHash !== actualHash) {
    failures.push(finding(
      "OUTPUT_HASH_MISMATCH",
      `${slug} ${url}: ${label} output hash actual ${actualHash}; allowed recorded ${recorded.outputHash}.`,
      { slug, url }
    ));
  }
  return { file, bytes: actualBytes, width: metadata.width, height: metadata.height, format: metadata.format, outputHash: actualHash };
}

export async function verifyManifestFiles(options = {}) {
  const paths = resolveVerificationPaths(options);
  const failures = [];
  const warnings = [];
  let manifest;
  let rawManifest;
  if (!fs.existsSync(paths.manifestPath)) {
    failures.push(finding(
      "MISSING_MANIFEST",
      `Article image manifest is missing at ${paths.manifestPath}; allowed a generated deterministic manifest.`
    ));
    return result(failures, warnings, { ...paths, manifest: null, inventory: null, verifiedAssets: 0, verifiedMobileAssets: 0 });
  }
  try {
    rawManifest = fs.readFileSync(paths.manifestPath, "utf8");
    manifest = JSON.parse(rawManifest);
  } catch (error) {
    failures.push(finding(
      "INVALID_MANIFEST",
      `Article image manifest is invalid: actual ${error.message}; allowed valid deterministic JSON.`
    ));
    return result(failures, warnings, { ...paths, manifest: null, inventory: null, verifiedAssets: 0, verifiedMobileAssets: 0 });
  }

  let inventory;
  try {
    inventory = discoverArticleInventory({ contentRoot: paths.contentRoot, publicRoot: paths.publicRoot });
  } catch (error) {
    failures.push(finding(
      "INVENTORY_DISCOVERY_FAILED",
      `Article inventory discovery failed: actual ${error.message}; allowed valid article references to existing public files.`
    ));
    return result(failures, warnings, { ...paths, manifest, inventory: null, verifiedAssets: 0, verifiedMobileAssets: 0 });
  }

  const manifestAssets = manifest?.assets && typeof manifest.assets === "object" ? manifest.assets : {};
  const manifestArticles = manifest?.articles && typeof manifest.articles === "object" ? manifest.articles : {};
  const owners = ownerMap(inventory);
  const inventoryUrls = new Set(Object.keys(inventory.assets));
  const manifestUrls = new Set(Object.keys(manifestAssets));

  for (const url of [...manifestUrls].filter((item) => !inventoryUrls.has(item)).sort()) {
    failures.push(finding(
      "ORPHANED_MANIFEST_ASSET",
      `${url}: manifest asset is orphaned; allowed only assets referenced by current article inventory.`,
      { url }
    ));
  }
  for (const url of [...inventoryUrls].filter((item) => !manifestUrls.has(item)).sort()) {
    const slug = primaryOwner(owners, url);
    failures.push(finding(
      "UNREGISTERED_REFERENCED_ASSET",
      `${slug} ${url}: local article image is referenced but unregistered; allowed a matching manifest asset.`,
      { slug, url }
    ));
  }

  const inventorySlugs = new Set(Object.keys(inventory.articles));
  const manifestSlugs = new Set(Object.keys(manifestArticles));
  for (const slug of [...manifestSlugs].filter((item) => !inventorySlugs.has(item)).sort()) {
    failures.push(finding(
      "ORPHANED_MANIFEST_ARTICLE",
      `${slug}: manifest article is orphaned; allowed only current MDX article slugs.`,
      { slug }
    ));
  }
  for (const slug of [...inventorySlugs].filter((item) => !manifestSlugs.has(item)).sort()) {
    failures.push(finding(
      "UNREGISTERED_ARTICLE",
      `${slug}: article inventory is absent from the manifest; allowed a matching manifest article.`,
      { slug }
    ));
  }
  for (const slug of [...inventorySlugs].filter((item) => manifestSlugs.has(item)).sort()) {
    const actual = manifestArticles[slug];
    const expected = inventory.articles[slug];
    if (actual.budgetClass !== expected.budgetClass
      || actual.cover !== expected.cover
      || JSON.stringify(actual.body) !== JSON.stringify(expected.body)) {
      failures.push(finding(
        "ARTICLE_INVENTORY_DRIFT",
        `${slug}: manifest article inventory actual ${JSON.stringify(actual)}; allowed ${JSON.stringify({ budgetClass: expected.budgetClass, cover: expected.cover, body: expected.body })}.`,
        { slug }
      ));
    }
  }

  if (paths.sourceLibraryRoot && !fs.existsSync(paths.sourceLibraryRoot)) {
    warnings.push(finding(
      "EXTERNAL_SOURCE_UNAVAILABLE",
      `External source library is unavailable at ${paths.sourceLibraryRoot}; sourceHash content checks were skipped while output hashes remain enforced.`
    ));
  }

  let verifiedAssets = 0;
  let verifiedMobileAssets = 0;
  const mobileOwners = new Map();
  for (const url of [...manifestUrls].sort()) {
    const asset = manifestAssets[url];
    const slug = primaryOwner(owners, url);
    if (!asset || typeof asset !== "object" || Array.isArray(asset)) {
      failures.push(finding("INVALID_MANIFEST_ASSET", `${slug} ${url}: actual asset is not an object; allowed complete asset facts.`, { slug, url }));
      continue;
    }
    validateManifestRole(asset, owners.get(url), slug, url, failures);
    validateHash(asset.sourceHash, "sourceHash", slug, url, failures);
    const inspected = await inspectManifestFile({ publicRoot: paths.publicRoot, url, recorded: asset, slug, failures });
    if (inspected) verifiedAssets += 1;

    const exactSources = exactSourceFiles(paths.sourceLibraryRoot, owners, url);
    if (exactSources.length > 1) {
      const sourceFiles = exactSources.map((source) => source.file).sort();
      failures.push(finding(
        "AMBIGUOUS_EXTERNAL_SOURCE",
        `${slug} ${url}: external source match actual ${sourceFiles.join(", ")}; allowed exactly one source with the same sequence and semantic stem.`,
        { slug, url }
      ));
    }
    for (const source of exactSources.length === 1 ? exactSources : []) {
      const actualSourceHash = sha256(source.file);
      if (HASH_PATTERN.test(String(asset.sourceHash ?? "")) && actualSourceHash !== asset.sourceHash) {
        failures.push(finding(
          "SOURCE_HASH_MISMATCH",
          `${source.slug} ${url}: external source hash actual ${actualSourceHash}; allowed recorded ${asset.sourceHash} for ${source.file}.`,
          { slug: source.slug, url }
        ));
      }
    }

    if (!asset.mobile) continue;
    if (!asset.mobile.src || asset.mobile.src === url) {
      failures.push(finding(
        "INVALID_MOBILE_POINTER",
        `${slug} ${url}: mobile pointer actual ${String(asset.mobile.src)}; allowed a distinct local mobile URL.`,
        { slug, url }
      ));
      continue;
    }
    const existingMobileOwner = mobileOwners.get(asset.mobile.src);
    if (existingMobileOwner && existingMobileOwner !== url) {
      failures.push(finding(
        "DUPLICATE_MOBILE_POINTER",
        `${slug} ${asset.mobile.src}: mobile pointer is shared by ${existingMobileOwner} and ${url}; allowed one primary owner.`,
        { slug, url: asset.mobile.src }
      ));
    }
    mobileOwners.set(asset.mobile.src, url);
    if (manifestUrls.has(asset.mobile.src)) {
      failures.push(finding(
        "MOBILE_POINTER_IS_PRIMARY",
        `${slug} ${asset.mobile.src}: mobile pointer is also registered as a primary asset; allowed a nested mobile-only candidate.`,
        { slug, url: asset.mobile.src }
      ));
    }
    const inspectedMobile = await inspectManifestFile({
      publicRoot: paths.publicRoot,
      url: asset.mobile.src,
      recorded: asset.mobile,
      slug,
      mobile: true,
      failures
    });
    if (inspectedMobile) {
      verifiedMobileAssets += 1;
      if (Number.isFinite(asset.width) && inspectedMobile.width >= asset.width) {
        failures.push(finding(
          "MOBILE_DIMENSIONS_INVALID",
          `${slug} ${asset.mobile.src}: mobile width actual ${inspectedMobile.width}; allowed less than primary width ${asset.width}.`,
          { slug, url: asset.mobile.src }
        ));
      }
    }
  }

  if ([...inventoryUrls].every((url) => manifestAssets[url])) {
    try {
      const canonical = serializeManifest(buildManifest({
        inventory,
        processedAssets: manifestAssets,
        processorVersion: manifest.processorVersion
      }));
      if (rawManifest !== canonical) {
        failures.push(finding(
          "NONDETERMINISTIC_MANIFEST",
          `Manifest serialization is nondeterministic; actual ${Buffer.byteLength(rawManifest)} bytes, allowed canonical ${Buffer.byteLength(canonical)} bytes.`
        ));
      }
    } catch (error) {
      failures.push(finding(
        "INVALID_MANIFEST_SHAPE",
        `Manifest cannot be deterministically rebuilt: actual ${error.message}; allowed complete canonical asset facts.`
      ));
    }
  }

  return result(failures, warnings, { ...paths, manifest, inventory, verifiedAssets, verifiedMobileAssets });
}

function repositoryChangedFiles(projectRoot, baseRef) {
  const args = baseRef
    ? ["diff", "--name-only", "--diff-filter=AMR", `${baseRef}...HEAD`, "--"]
    : ["status", "--porcelain=v1", "--untracked-files=all"];
  const command = spawnSync("git", args, { cwd: projectRoot, encoding: "utf8" });
  if (command.status !== 0) return [];
  return command.stdout.split(/\r?\n/).flatMap((line) => {
    if (!line) return [];
    const value = baseRef ? line : line.slice(3).split(" -> ").at(-1);
    return value ? [value] : [];
  });
}

function firstSymlinkComponent(projectRoot, relative) {
  let candidate = projectRoot;
  for (const segment of relative.split("/")) {
    candidate = path.join(candidate, segment);
    try {
      if (fs.lstatSync(candidate).isSymbolicLink()) return candidate;
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  }
  return null;
}

export function verifyRepositoryBudget(options = {}) {
  const paths = resolveVerificationPaths(options);
  const failures = [];
  const warnings = [];
  let currentBytes = 0;
  let fileCount = 0;
  const realPublicRoot = fs.existsSync(paths.publicRoot) ? fs.realpathSync.native(paths.publicRoot) : paths.publicRoot;

  const walk = (directory, relativeRoot) => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(directory, entry.name);
      const relative = path.relative(paths.projectRoot, file).split(path.sep).join("/");
      const stat = fs.lstatSync(file);
      if (stat.isSymbolicLink()) {
        failures.push(finding(
          "REPOSITORY_SYMLINK",
          `${relative}: actual symlink in ${relativeRoot}; allowed regular files and directories contained by public.`,
          { url: `/${relative}` }
        ));
        continue;
      }
      if (stat.isDirectory()) {
        walk(file, relativeRoot);
        continue;
      }
      if (!stat.isFile()) {
        failures.push(finding(
          "REPOSITORY_SPECIAL_FILE",
          `${relative}: actual non-regular repository entry; allowed regular image files.`,
          { url: `/${relative}` }
        ));
        continue;
      }
      const realFile = fs.realpathSync.native(file);
      if (!pathContained(realPublicRoot, realFile)) {
        failures.push(finding(
          "REPOSITORY_FILE_OUTSIDE_PUBLIC",
          `${relative}: actual resolved path ${realFile}; allowed a path within ${realPublicRoot}.`,
          { url: `/${relative}` }
        ));
        continue;
      }
      currentBytes += stat.size;
      fileCount += 1;
    }
  };

  for (const relative of GUARDED_IMAGE_DIRECTORIES) {
    const symlink = firstSymlinkComponent(paths.projectRoot, relative);
    if (symlink) {
      const symlinkRelative = path.relative(paths.projectRoot, symlink).split(path.sep).join("/");
      failures.push(finding(
        "REPOSITORY_SYMLINK",
        `${symlinkRelative}: actual symlink in guarded path ${relative}; allowed regular directories contained by public.`,
        { url: `/${symlinkRelative}` }
      ));
      continue;
    }
    walk(path.join(paths.projectRoot, ...relative.split("/")), relative);
  }

  const allowedGrowth = ARTICLE_IMAGE_LIMIT_BYTES - ARTICLE_IMAGE_BASELINE_BYTES;
  const changedFiles = options.changedFiles ?? repositoryChangedFiles(
    paths.projectRoot,
    options.baseRef ?? process.env.ARTICLE_IMAGE_BASE_REF ?? (process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : null)
  );
  const guardedPrefixes = GUARDED_IMAGE_DIRECTORIES.map((relative) => `${relative}/`);
  const topChanged = [...new Set(changedFiles)]
    .filter((relative) => guardedPrefixes.some((prefix) => relative.startsWith(prefix)))
    .flatMap((relative) => {
      const file = path.resolve(paths.projectRoot, relative);
      if (!pathContained(paths.projectRoot, file) || !fs.existsSync(file) || !fs.lstatSync(file).isFile()) return [];
      return [{ file: relative, bytes: fs.lstatSync(file).size }];
    })
    .sort((left, right) => right.bytes - left.bytes || left.file.localeCompare(right.file))
    .slice(0, 10);

  if (currentBytes > ARTICLE_IMAGE_LIMIT_BYTES) {
    const largest = topChanged.length
      ? ` Largest new/changed files: ${topChanged.map(({ file, bytes }) => `${file} (${bytes} bytes)`).join(", ")}.`
      : " No new/changed guarded files were detected in the current Git comparison.";
    failures.push(finding(
      "REPOSITORY_BUDGET_EXCEEDED",
      `Article image repository current ${currentBytes} bytes; baseline ${ARTICLE_IMAGE_BASELINE_BYTES} bytes; allowed growth ${allowedGrowth} bytes; limit ${ARTICLE_IMAGE_LIMIT_BYTES} bytes.${largest}`
    ));
  }

  return result(failures, warnings, {
    projectRoot: paths.projectRoot,
    roots: [...GUARDED_IMAGE_DIRECTORIES],
    currentBytes,
    baselineBytes: ARTICLE_IMAGE_BASELINE_BYTES,
    allowedGrowth,
    limitBytes: ARTICLE_IMAGE_LIMIT_BYTES,
    fileCount,
    topChanged
  });
}

export async function verifyArticleImages(options = {}) {
  const manifestReport = await verifyManifestFiles(options);
  const repositoryReport = verifyRepositoryBudget(options);
  const failures = [...manifestReport.failures, ...repositoryReport.failures];
  const warnings = [...manifestReport.warnings, ...repositoryReport.warnings];
  const articleBudgets = [];
  if (manifestReport.inventory && manifestReport.manifest) {
    for (const slug of Object.keys(manifestReport.inventory.articles).sort()) {
      const article = manifestReport.inventory.articles[slug];
      const budget = verifyArticleBudget(article, manifestReport.manifest.assets ?? {});
      articleBudgets.push(budget);
      failures.push(...budget.failures);
      warnings.push(...budget.warnings);
    }
  }
  return result(failures, warnings, {
    manifest: manifestReport,
    repository: repositoryReport,
    articleBudgets,
    summary: {
      articles: articleBudgets.length,
      assets: manifestReport.verifiedAssets,
      mobileAssets: manifestReport.verifiedMobileAssets,
      repositoryBytes: repositoryReport.currentBytes
    }
  });
}
