import fs from "node:fs";
import path from "node:path";

import { sha256File, validateVisualArchiveEligibility } from "./historical-kinds.mjs";

const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const supportedBudgetClasses = new Set(["standard", "deep", "visual_archive"]);
const localImagePrefix = "/images/";
const imageReference = /!\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))[^)]*\)|<img\b[^>]*?\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)')/gi;

function walkMdxFiles(root) {
  return fs.readdirSync(root, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const file = path.join(root, entry.name);
      if (entry.isDirectory()) return walkMdxFiles(file);
      return path.extname(entry.name).toLowerCase() === ".mdx" ? [file] : [];
    });
}

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { fields: {}, body: source };

  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*?)\s*$/);
    if (!field) continue;
    const [, key, rawValue] = field;
    fields[key] = rawValue.replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2");
  }

  return { fields, body: source.slice(match[0].length) };
}

function normalizeLocalImageReference(reference) {
  const withoutSuffix = reference.trim().split(/[?#]/, 1)[0];
  if (!withoutSuffix.startsWith(localImagePrefix)) return null;

  const normalized = path.posix.normalize(withoutSuffix);
  if (!normalized.startsWith(localImagePrefix)) {
    throw new Error(`Invalid local image reference: ${reference}`);
  }

  return normalized;
}

function articleError(slug, file, message) {
  return new Error(`Article ${slug} (${file}): ${message}`);
}

function frontmatterImage(fields, names) {
  for (const name of names) {
    if (fields[name]) return fields[name];
  }
  return null;
}

function bodyImageReferences(body) {
  const references = [];
  for (const match of body.matchAll(imageReference)) {
    const reference = match[1] ?? match[2] ?? match[3] ?? match[4];
    const normalized = normalizeLocalImageReference(reference);
    references.push(normalized);
  }
  return references;
}

function ensurePublicFile({ slug, articleFile, publicRoot, url }) {
  const file = path.resolve(publicRoot, `.${url}`);
  const resolvedPublicRoot = path.resolve(publicRoot);
  if (!file.startsWith(`${resolvedPublicRoot}${path.sep}`) || !fs.existsSync(file)) {
    throw articleError(slug, articleFile, `missing local image file for ${url}`);
  }
  return file;
}

export function discoverArticleInventory({ contentRoot, publicRoot, historicalKindClassifications }) {
  const articles = {};
  const assets = {};

  for (const file of walkMdxFiles(contentRoot)) {
    const slug = path.basename(file, ".mdx");
    if (!validSlug.test(slug)) {
      throw articleError(slug, file, "invalid slug; use lowercase letters, numbers, and hyphens only");
    }
    if (articles[slug]) {
      throw articleError(slug, file, "duplicate article slug");
    }

    const { fields, body: sourceBody } = parseFrontmatter(fs.readFileSync(file, "utf8"));
    const requestedBudgetClass = fields.image_budget?.trim();
    if (requestedBudgetClass && !supportedBudgetClasses.has(requestedBudgetClass)) {
      throw articleError(slug, file, `unknown image_budget value: ${requestedBudgetClass}`);
    }

    const cover = frontmatterImage(fields, ["coverImage", "cover_image"]);
    const social = frontmatterImage(fields, ["socialImage", "social_image"]);
    const rolesByUrl = new Map();
    const register = (reference, role) => {
      if (!reference) return null;
      const url = normalizeLocalImageReference(reference);
      if (!url) return null;
      const roles = rolesByUrl.get(url) ?? new Set();
      roles.add(role);
      rolesByUrl.set(url, roles);
      return url;
    };

    const coverUrl = register(cover, "cover");
    const socialUrl = register(social, "cover");
    const body = [];
    const bodyReferences = bodyImageReferences(sourceBody);
    // Historical articles conventionally repeat the cover once as their first body image.
    if (coverUrl && bodyReferences[0] === coverUrl) bodyReferences.shift();
    for (const url of bodyReferences) {
      if (!url) continue;
      register(url, "body");
      if (!body.includes(url)) body.push(url);
    }

    for (const [url, roles] of rolesByUrl) {
      if (roles.size > 1) {
        throw articleError(slug, file, `conflicting roles for ${url}`);
      }
      if (!assets[url]) {
        assets[url] = { url, file: ensurePublicFile({ slug, articleFile: file, publicRoot, url }) };
      }
    }

    let budgetClass = requestedBudgetClass === "deep" && body.length > 8 ? "deep" : "standard";
    if (requestedBudgetClass === "visual_archive") {
      try {
        validateVisualArchiveEligibility({
          slug,
          cover: coverUrl,
          body,
          classifications: historicalKindClassifications,
          actualHashes: (url) => sha256File(assets[url].file)
        });
        budgetClass = "visual_archive";
      } catch (error) {
        throw articleError(slug, file, error.message);
      }
    }

    articles[slug] = {
      slug,
      file,
      budgetClass,
      cover: coverUrl,
      social: socialUrl,
      body
    };
  }

  return {
    assets: Object.fromEntries(Object.entries(assets).sort(([left], [right]) => left.localeCompare(right))),
    articles: Object.fromEntries(Object.entries(articles).sort(([left], [right]) => left.localeCompare(right)))
  };
}
