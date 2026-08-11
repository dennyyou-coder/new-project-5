#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE_URL = "https://worldcleanbiz.com";
const COVER_SIZES = "(max-width: 800px) 100vw, 1200px";
const BODY_SIZES = "(max-width: 800px) calc(100vw - 32px), 900px";

function finding(code, message, { slug = "~build", url = "" } = {}) {
  return { code, slug, url, message };
}

function sortFindings(findings) {
  return findings.sort((left, right) => left.slug.localeCompare(right.slug)
    || left.url.localeCompare(right.url)
    || left.code.localeCompare(right.code)
    || left.message.localeCompare(right.message));
}

function parseAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    const name = match[1].toLowerCase();
    if (name === "img" || name === "meta" || name === "link") continue;
    attributes[name] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return attributes;
}

function articleMarkup(html) {
  const start = html.search(/<article\b[^>]*class=(?:"[^"]*\bblog-article-main\b[^"]*"|'[^']*\bblog-article-main\b[^']*')[^>]*>/i);
  if (start < 0) return null;
  const end = html.indexOf("</article>", start);
  return end < 0 ? null : html.slice(start, end + "</article>".length);
}

function imageTags(markup) {
  return [...markup.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => ({ tag, attributes: parseAttributes(tag) }));
}

function articleContentImageTags(markup) {
  return [...markup.matchAll(/<figure\b[^>]*class=(?:"[^"]*\b(?:blog-article-cover|article-inline-image)\b[^"]*"|'[^']*\b(?:blog-article-cover|article-inline-image)\b[^']*')[^>]*>[\s\S]*?<\/figure>/gi)]
    .flatMap(([figure]) => imageTags(figure));
}

function metadataContent(html, attributeName, attributeValue) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    if (attributes[attributeName] === attributeValue) return attributes.content;
  }
  return undefined;
}

function canonicalHref(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    if ((attributes.rel ?? "").split(/\s+/).includes("canonical")) return attributes.href;
  }
  return undefined;
}

function normalizeLocalUrl(value) {
  if (typeof value !== "string") return null;
  let url = value;
  if (url.startsWith(`${SITE_URL}/`)) url = url.slice(SITE_URL.length);
  if (!url.startsWith("/") || url.startsWith("//")) return null;
  return path.posix.normalize(url.split(/[?#]/, 1)[0]);
}

function contained(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

function publicCandidate(publicRoot, url) {
  const local = normalizeLocalUrl(url);
  if (!local) return { local: null, file: null, exists: false };
  const file = path.resolve(publicRoot, `.${local}`);
  if (!contained(publicRoot, file) || !fs.existsSync(file)) return { local, file, exists: false };
  const lstat = fs.lstatSync(file);
  if (lstat.isSymbolicLink() || !lstat.isFile()) return { local, file, exists: false };
  const realPublic = fs.realpathSync.native(publicRoot);
  const realFile = fs.realpathSync.native(file);
  return { local, file, exists: contained(realPublic, realFile) };
}

function srcsetCandidates(value) {
  if (typeof value !== "string") return { candidates: [], invalid: [] };
  const candidates = [];
  const invalid = [];
  for (const raw of value.split(",")) {
    const candidate = raw.trim();
    const match = candidate.match(/^(\S+)\s+([1-9]\d*)w$/);
    if (!match) invalid.push(candidate);
    else candidates.push({ url: match[1], width: Number(match[2]) });
  }
  return { candidates, invalid };
}

function reportMissingCandidate(failures, publicRoot, slug, url, context) {
  const resolved = publicCandidate(publicRoot, url);
  if (!resolved.local || !resolved.exists) {
    failures.push(finding(
      "BUILT_CANDIDATE_MISSING",
      `${slug} ${url}: ${context} actual candidate does not resolve under public; allowed an existing local public file.`,
      { slug, url: String(url ?? "") }
    ));
  }
}

function defaultPaths(options = {}) {
  const projectRoot = path.resolve(options.projectRoot ?? process.cwd());
  return {
    projectRoot,
    publicRoot: path.resolve(options.publicRoot ?? path.join(projectRoot, "public")),
    manifestPath: path.resolve(options.manifestPath ?? path.join(projectRoot, "lib", "generated", "article-image-manifest.json")),
    buildRoot: path.resolve(options.buildRoot ?? path.join(projectRoot, ".next", "server", "app", "blog"))
  };
}

export async function verifyBuiltArticleImages(options = {}) {
  const paths = defaultPaths(options);
  const failures = [];
  const warnings = [];
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(paths.manifestPath, "utf8"));
  } catch (error) {
    failures.push(finding(
      "BUILT_MANIFEST_INVALID",
      `Built verification manifest actual ${error.message}; allowed readable generated JSON.`
    ));
    return { ok: false, failures, warnings, summary: { articles: 0, articleImages: 0, responsiveImages: 0 }, ...paths };
  }

  let articleImages = 0;
  let responsiveImages = 0;
  for (const slug of Object.keys(manifest.articles ?? {}).sort()) {
    const article = manifest.articles[slug];
    const htmlFile = path.join(paths.buildRoot, `${slug}.html`);
    if (!fs.existsSync(htmlFile)) {
      failures.push(finding(
        "BUILT_ARTICLE_MISSING",
        `${slug}: built HTML actual missing ${htmlFile}; allowed Next 15 output ${path.join(paths.buildRoot, `${slug}.html`)}.`,
        { slug }
      ));
      continue;
    }
    const html = fs.readFileSync(htmlFile, "utf8");
    const markup = articleMarkup(html);
    if (!markup) {
      failures.push(finding(
        "BUILT_ARTICLE_SCOPE_MISSING",
        `${slug}: built article content scope actual missing blog-article-main; allowed one article content container.`,
        { slug }
      ));
      continue;
    }

    const expectedUrls = [...new Set([article.cover, ...(article.body ?? [])].filter(Boolean))];
    const expectedSet = new Set(expectedUrls);
    const contentImages = articleContentImageTags(markup);
    const selected = contentImages.filter(({ attributes }) => expectedSet.has(normalizeLocalUrl(attributes.src)));
    articleImages += selected.length;

    for (const url of expectedUrls) {
      if (!selected.some(({ attributes }) => normalizeLocalUrl(attributes.src) === url)) {
        failures.push(finding(
          "BUILT_ARTICLE_IMAGE_MISSING",
          `${slug} ${url}: built article image actual not rendered; allowed one rendered primary candidate.`,
          { slug, url }
        ));
      }
    }

    const prioritized = contentImages.filter(({ attributes }) => attributes.loading === "eager" || attributes.fetchpriority === "high");
    if (prioritized.length !== 1) {
      failures.push(finding(
        "BUILT_PRIORITY_COUNT",
        `${slug}: article content priority actual ${prioritized.length} images; allowed exactly 1 eager or fetchpriority=high cover image.`,
        { slug }
      ));
    } else if (normalizeLocalUrl(prioritized[0].attributes.src) !== article.cover) {
      failures.push(finding(
        "BUILT_PRIORITY_NOT_COVER",
        `${slug} ${prioritized[0].attributes.src}: prioritized image actual non-cover; allowed desktop cover ${String(article.cover)}.`,
        { slug, url: prioritized[0].attributes.src }
      ));
    }

    for (const image of contentImages) {
      const attributes = image.attributes;
      const url = normalizeLocalUrl(attributes.src);
      const asset = manifest.assets?.[url];
      const isDesktopCover = Boolean(article.cover) && url === article.cover;
      if (!isDesktopCover && attributes.loading !== "lazy") {
        failures.push(finding(
          "BUILT_IMAGE_NOT_LAZY",
          `${slug} ${url}: non-cover article image loading actual ${String(attributes.loading)}; allowed lazy.`,
          { slug, url }
        ));
      }
      if (!url) continue;
      reportMissingCandidate(failures, paths.publicRoot, slug, attributes.src, "src");
      if (!attributes.width || !attributes.height) {
        failures.push(finding(
          "BUILT_DIMENSIONS_MISSING",
          `${slug} ${url}: intrinsic dimensions actual ${String(attributes.width)}x${String(attributes.height)}; allowed positive width and height attributes.`,
          { slug, url }
        ));
      }
      if (!attributes.sizes) {
        failures.push(finding(
          "BUILT_SIZES_MISSING",
          `${slug} ${url}: responsive sizes actual missing; allowed a context-appropriate sizes attribute.`,
          { slug, url }
        ));
      }
      if (!asset) {
        failures.push(finding(
          "BUILT_UNREGISTERED_LOCAL_IMAGE",
          `${slug} ${url}: rendered local article image actual absent from manifest; allowed a registered primary article image.`,
          { slug, url }
        ));
        continue;
      }
      const expectedSizes = isDesktopCover ? COVER_SIZES : BODY_SIZES;
      if (attributes.sizes !== expectedSizes) {
        failures.push(finding(
          "BUILT_SIZES_MISMATCH",
          `${slug} ${url}: sizes actual ${String(attributes.sizes)}; allowed ${expectedSizes}.`,
          { slug, url }
        ));
      }
      if (attributes.decoding !== "async") {
        failures.push(finding(
          "BUILT_DECODING_MISMATCH",
          `${slug} ${url}: decoding actual ${String(attributes.decoding)}; allowed async.`,
          { slug, url }
        ));
      }
      if (isDesktopCover && (attributes.loading !== "eager" || attributes.fetchpriority !== "high")) {
        failures.push(finding(
          "BUILT_COVER_PRIORITY_MISMATCH",
          `${slug} ${url}: cover loading/fetchpriority actual ${String(attributes.loading)}/${String(attributes.fetchpriority)}; allowed eager/high.`,
          { slug, url }
        ));
      }
      if (attributes.width && attributes.height
        && (Number(attributes.width) !== asset.width || Number(attributes.height) !== asset.height)) {
        failures.push(finding(
          "BUILT_DIMENSIONS_MISMATCH",
          `${slug} ${url}: intrinsic dimensions actual ${attributes.width}x${attributes.height}; allowed ${asset.width}x${asset.height}.`,
          { slug, url }
        ));
      }
      const srcsetPresent = Object.hasOwn(attributes, "srcset");
      const { candidates, invalid } = srcsetCandidates(attributes.srcset);
      if (invalid.length) {
        failures.push(finding(
          "BUILT_SRCSET_INVALID",
          `${slug} ${url}: srcset contains unsupported or malformed candidates ${JSON.stringify(invalid)}; allowed local URL plus a positive width descriptor such as 800w.`,
          { slug, url }
        ));
      }
      if (asset.mobile) {
        responsiveImages += 1;
        const expected = [
          { url: asset.mobile.src, width: asset.mobile.width },
          { url, width: asset.width }
        ];
        if (JSON.stringify(candidates) !== JSON.stringify(expected)) {
          failures.push(finding(
            "BUILT_SRCSET_MISMATCH",
            `${slug} ${url}: srcset actual ${JSON.stringify(candidates)}; allowed ${JSON.stringify(expected)}.`,
            { slug, url }
          ));
        }
      } else if (srcsetPresent) {
        failures.push(finding(
          "BUILT_UNEXPECTED_SRCSET",
          `${slug} ${url}: srcset attribute is present with actual ${JSON.stringify(attributes.srcset)}; allowed no srcset attribute because no mobile variant is registered.`,
          { slug, url }
        ));
      }
      for (const candidate of candidates) {
        reportMissingCandidate(failures, paths.publicRoot, slug, candidate.url, "srcset");
      }
    }

    const canonical = canonicalHref(html);
    const expectedCanonical = `${SITE_URL}/blog/${slug}`;
    if (canonical !== expectedCanonical) {
      failures.push(finding(
        "BUILT_CANONICAL_MISMATCH",
        `${slug}: canonical actual ${String(canonical)}; allowed ${expectedCanonical}.`,
        { slug }
      ));
    }
    const ogImage = metadataContent(html, "property", "og:image");
    if (article.cover) {
      const expectedOgImage = `${SITE_URL}${article.cover}`;
      if (ogImage !== expectedOgImage) {
        failures.push(finding(
          "BUILT_OG_IMAGE_MISMATCH",
          `${slug}: OpenGraph image actual ${String(ogImage)}; allowed desktop primary ${expectedOgImage}.`,
          { slug, url: String(ogImage ?? "") }
        ));
      }
    }
    if (ogImage) reportMissingCandidate(failures, paths.publicRoot, slug, ogImage, "OpenGraph image");
  }

  sortFindings(failures);
  sortFindings(warnings);
  return {
    ok: failures.length === 0,
    failures,
    warnings,
    summary: {
      articles: Object.keys(manifest.articles ?? {}).length,
      articleImages,
      responsiveImages
    },
    ...paths
  };
}

class InvocationError extends Error {}

function parseArguments(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--project-root" || argument === "--build-root") {
      const value = argv[++index];
      if (!value || value.startsWith("--")) throw new InvocationError(`${argument} requires a path.`);
      if (argument === "--project-root") options.projectRoot = value;
      else options.buildRoot = value;
    } else {
      throw new InvocationError(`Unknown argument: ${argument}`);
    }
  }
  return options;
}

function printFindings(label, findings, stream) {
  if (!findings.length) return;
  stream.write(`${label}:\n`);
  for (const item of findings) {
    const location = [item.slug === "~build" ? null : item.slug, item.url].filter(Boolean).join(" ");
    stream.write(`[${item.code}]${location ? ` ${location}` : ""}: ${item.message}\n`);
  }
}

async function main() {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    console.error(`Invocation error: ${error.message}`);
    process.exitCode = 2;
    return;
  }
  try {
    const report = await verifyBuiltArticleImages(options);
    printFindings("Warnings", report.warnings, process.stdout);
    if (!report.ok) {
      printFindings(`Blocking findings (${report.failures.length})`, report.failures, process.stderr);
      process.exitCode = 1;
      return;
    }
    console.log(
      `Built article image verification passed: ${report.summary.articles} articles, `
      + `${report.summary.articleImages} rendered article images, ${report.summary.responsiveImages} responsive image sets.`
    );
  } catch (error) {
    console.error(`Built verification failed unexpectedly: ${error.stack ?? error.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
