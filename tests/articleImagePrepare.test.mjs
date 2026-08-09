import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

import sharp from "sharp";

import {
  prepareAllArticleImages,
  prepareArticleImages
} from "../scripts/article-images/prepare.mjs";

const temporaryRoots = [];

function temporaryProject() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wcb-article-image-prepare-"));
  temporaryRoots.push(root);
  const projectRoot = path.join(root, "project");
  const sourceLibraryRoot = path.join(root, "source-library");
  fs.mkdirSync(path.join(projectRoot, "content", "insights"), { recursive: true });
  fs.mkdirSync(path.join(projectRoot, "public"), { recursive: true });
  fs.mkdirSync(sourceLibraryRoot, { recursive: true });
  return { root, projectRoot, sourceLibraryRoot };
}

function articleFile(project, slug) {
  return path.join(project.projectRoot, "content", "insights", `${slug}.mdx`);
}

function sourceFolder(project, slug) {
  const folder = path.join(project.sourceLibraryRoot, slug);
  fs.mkdirSync(folder, { recursive: true });
  return folder;
}

function publicFile(project, url) {
  return path.join(project.projectRoot, "public", url.slice(1));
}

async function writeImage(file, { width = 1200, height = 675, format = "png", noise = false, alpha = false } = {}) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  let pipeline;
  if (noise) {
    const pixels = Buffer.alloc(width * height * 3);
    let state = 0x12345678;
    for (let index = 0; index < pixels.length; index += 1) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      pixels[index] = state >>> 24;
    }
    pipeline = sharp(pixels, { raw: { width, height, channels: 3 } });
  } else {
    const background = alpha ? "none" : "#dcecf2";
    pipeline = sharp(Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="${background}"/>
        <path d="M40 ${height - 50} L${Math.round(width * 0.4)} ${Math.round(height * 0.45)} L${width - 40} 60" fill="none" stroke="#126a78" stroke-width="18"/>
        <circle cx="${Math.round(width * 0.7)}" cy="${Math.round(height * 0.35)}" r="80" fill="#ef8354" fill-opacity="${alpha ? "0.55" : "1"}"/>
      </svg>`
    ));
  }
  if (format === "jpeg" || format === "jpg") await pipeline.jpeg({ quality: 94 }).toFile(file);
  else if (format === "webp") await pipeline.webp({ quality: 94 }).toFile(file);
  else await pipeline.png({ compressionLevel: noise ? 0 : 9 }).toFile(file);
}

function writeArticle(project, slug, {
  cover = `/images/legacy/${slug}-cover.webp`,
  social,
  body = [`/images/legacy/${slug}-02.webp`],
  extraFrontmatter = "campaign: \"keep-exactly\"\n"
} = {}) {
  const socialLine = social ? `socialImage: "${social}"\n` : "";
  const images = body.map((url, index) => `Paragraph ${index + 1}.\n\n![Placed ${index + 2}](${url})`).join("\n\nKeep this placement.\n\n");
  const source = `---\ntitle: "Fixture ${slug}"\nslug: "${slug}"\ncoverImage: "${cover}"\n${socialLine}${extraFrontmatter}---\n\n${images}\n`;
  fs.writeFileSync(articleFile(project, slug), source);
  return source;
}

async function writeCurrentArticleAssets(project, { cover, body = [] }) {
  await writeImage(publicFile(project, cover), { format: path.extname(cover).slice(1) || "webp" });
  for (const url of body) {
    await writeImage(publicFile(project, url), { width: 1000, height: 700, format: path.extname(url).slice(1) || "webp" });
  }
}

function readTree(root) {
  const entries = {};
  if (!fs.existsSync(root)) return entries;
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else entries[path.relative(root, file)] = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
    }
  };
  walk(root);
  return entries;
}

async function validFixture({ slug = "atomic-example", bodyCount = 1, coverSize } = {}) {
  const project = temporaryProject();
  const folder = sourceFolder(project, slug);
  const cover = `/images/legacy/${slug}-cover.webp`;
  const body = Array.from({ length: bodyCount }, (_, index) => `/images/legacy/${String(index + 2).padStart(2, "0")}-${slug}.webp`);
  writeArticle(project, slug, { cover, body });
  await writeCurrentArticleAssets(project, { cover, body });
  await writeImage(path.join(folder, "01-cover.png"), coverSize);
  for (let index = 0; index < bodyCount; index += 1) {
    await writeImage(path.join(folder, `${String(index + 2).padStart(2, "0")}-product-view.png`), { width: 1100, height: 760 });
  }
  return { ...project, slug, folder, cover, body };
}

test.after(() => {
  for (const root of temporaryRoots) fs.rmSync(root, { recursive: true, force: true });
});

test("rejects traversal slugs and unknown article slugs before resolving source paths", async () => {
  const project = temporaryProject();

  await assert.rejects(
    prepareArticleImages({ slug: "../outside", projectRoot: project.projectRoot, sourceRoot: project.sourceLibraryRoot }),
    /invalid slug.*lowercase.*hyphens/i
  );
  await assert.rejects(
    prepareArticleImages({ slug: "unknown-article", projectRoot: project.projectRoot, sourceRoot: path.join(project.sourceLibraryRoot, "unknown-article") }),
    /unknown article slug.*unknown-article/i
  );
});

test("CLI rejects simultaneous --slug and --all with invocation exit code 2", () => {
  const result = spawnSync(process.execPath, [
    path.join(process.cwd(), "scripts", "prepare-article-images.mjs"),
    "--slug", "atomic-example", "--all"
  ], { cwd: process.cwd(), encoding: "utf8" });

  assert.equal(result.status, 2);
  assert.match(result.stderr, /choose exactly one.*--slug.*--all/i);
});

test("CLI uses validation exit code 1 and prints an actionable structured failure", () => {
  const result = spawnSync(process.execPath, [
    path.join(process.cwd(), "scripts", "prepare-article-images.mjs"),
    "--slug", "definitely-unknown-article"
  ], { cwd: process.cwd(), encoding: "utf8" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Article: definitely-unknown-article/);
  assert.match(result.stderr, /Image: n\/a/);
  assert.match(result.stderr, /Observed:/);
  assert.match(result.stderr, /Permitted:/);
  assert.match(result.stderr, /Next action:/);
});

test("reports the exact expected source folder when it is absent", async () => {
  const project = temporaryProject();
  const slug = "missing-source";
  writeArticle(project, slug, { body: [] });
  const expected = path.join(project.sourceLibraryRoot, slug);

  await assert.rejects(
    prepareArticleImages({ slug, projectRoot: project.projectRoot, sourceRoot: expected }),
    (error) => error.message.startsWith("Visual Asset Folder Not Found") && error.message.includes(expected)
  );
});

test("rejects missing covers, duplicate normalized names, and article references without a sequence mapping", async () => {
  {
    const project = temporaryProject();
    const slug = "missing-cover";
    const folder = sourceFolder(project, slug);
    const cover = `/images/legacy/${slug}-cover.webp`;
    const body = [`/images/legacy/${slug}-02.webp`];
    writeArticle(project, slug, { cover, body });
    await writeCurrentArticleAssets(project, { cover, body });
    await writeImage(path.join(folder, "02-product.png"));
    await assert.rejects(
      prepareArticleImages({ slug, projectRoot: project.projectRoot, sourceRoot: folder }),
      /missing required 01-cover/i
    );
  }

  {
    const fixture = await validFixture({ slug: "duplicate-output" });
    await writeImage(path.join(fixture.folder, "02-Product View!.jpg"), { format: "jpg" });
    await assert.rejects(
      prepareArticleImages({ slug: fixture.slug, projectRoot: fixture.projectRoot, sourceRoot: fixture.folder }),
      /duplicate normalized filename.*02-product-view\.webp/i
    );
  }

  {
    const fixture = await validFixture({ slug: "missing-mapping" });
    const source = fs.readFileSync(articleFile(fixture, fixture.slug), "utf8")
      .replace(`02-${fixture.slug}.webp`, `03-${fixture.slug}.webp`);
    fs.writeFileSync(articleFile(fixture, fixture.slug), source);
    await writeImage(publicFile(fixture, `/images/legacy/03-${fixture.slug}.webp`), { format: "webp" });
    await assert.rejects(
      prepareArticleImages({ slug: fixture.slug, projectRoot: fixture.projectRoot, sourceRoot: fixture.folder }),
      /no deterministic output mapping.*03/i
    );
  }
});

test("rejects a changed source hash before replacing an existing output path", async () => {
  const fixture = await validFixture({ slug: "hash-collision" });
  const destination = `/images/articles/${fixture.slug}/01-cover.webp`;
  await writeImage(publicFile(fixture, destination), { format: "webp" });
  const manifestPath = path.join(fixture.projectRoot, "lib", "generated", "article-image-manifest.json");
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify({
    version: 1,
    processorVersion: "1",
    assets: {
      [destination]: {
        role: "cover", kind: "photo", width: 1200, height: 675, bytes: 100,
        format: "webp", quality: 84, sourceHash: `sha256:${"0".repeat(64)}`, outputHash: `sha256:${"1".repeat(64)}`
      }
    },
    articles: {}
  }));

  await assert.rejects(
    prepareArticleImages({ slug: fixture.slug, projectRoot: fixture.projectRoot, sourceRoot: fixture.folder }),
    /changed source hash.*01-cover\.webp/i
  );
});

test("a later transform failure leaves publish assets, MDX, and manifest byte-identical", async () => {
  const fixture = await validFixture({ slug: "atomic-failure", bodyCount: 2 });
  fs.writeFileSync(path.join(fixture.folder, "image-config.json"), JSON.stringify({
    images: { "03-product-view.png": { kind: "chart" } }
  }));
  await writeImage(path.join(fixture.folder, "03-product-view.png"), { width: 900, height: 600, noise: true });
  const manifestPath = path.join(fixture.projectRoot, "lib", "generated", "article-image-manifest.json");
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, "{\n  \"version\": 1,\n  \"processorVersion\": \"old\",\n  \"assets\": {},\n  \"articles\": {}\n}\n");
  const before = readTree(fixture.projectRoot);

  await assert.rejects(
    prepareArticleImages({ slug: fixture.slug, projectRoot: fixture.projectRoot, sourceRoot: fixture.folder }),
    /03-product-view\.png.*(?:budget|permitted|limit)/i
  );

  assert.deepEqual(readTree(fixture.projectRoot), before);
});

test("a phase-two filesystem failure restores every repository file from backup", async () => {
  const fixture = await validFixture({ slug: "rollback-example", bodyCount: 1 });
  fs.mkdirSync(path.join(fixture.projectRoot, "lib"), { recursive: true });
  fs.writeFileSync(path.join(fixture.projectRoot, "lib", "generated"), "this file intentionally blocks the manifest directory");
  const before = readTree(fixture.projectRoot);

  await assert.rejects(
    prepareArticleImages({ slug: fixture.slug, projectRoot: fixture.projectRoot, sourceRoot: fixture.folder }),
    /phase-two repository write failed/i
  );

  assert.deepEqual(readTree(fixture.projectRoot), before);
});

test("publishes sanitized names atomically and changes only exact target references", async () => {
  const fixture = await validFixture({ slug: "atomic-success", bodyCount: 2, coverSize: { width: 1200, height: 800 } });
  fs.renameSync(path.join(fixture.folder, "02-product-view.png"), path.join(fixture.folder, "02-Product View!!.png"));
  fs.renameSync(path.join(fixture.folder, "03-product-view.png"), path.join(fixture.folder, "03-market-chart.png"));
  fs.writeFileSync(path.join(fixture.folder, "image-config.json"), JSON.stringify({
    images: {
      "01-cover.png": { kind: "photo", focalPoint: { x: 0.52, y: 0.44 } },
      "03-market-chart.png": { kind: "chart" }
    }
  }, null, 2));
  const originals = readTree(fixture.folder);

  const result = await prepareArticleImages({
    slug: fixture.slug,
    projectRoot: fixture.projectRoot,
    sourceRoot: fixture.folder
  });

  const updated = fs.readFileSync(articleFile(fixture, fixture.slug), "utf8");
  assert.match(updated, new RegExp(`coverImage: "/images/articles/${fixture.slug}/01-cover\\.webp"`));
  assert.match(updated, new RegExp(`socialImage: "/images/articles/${fixture.slug}/01-cover\\.webp"`));
  assert.match(updated, /campaign: "keep-exactly"/);
  const firstPlacement = updated.indexOf(`/images/articles/${fixture.slug}/02-product-view.webp`);
  const marker = updated.indexOf("Keep this placement.");
  const secondPlacement = updated.indexOf(`/images/articles/${fixture.slug}/03-market-chart.`);
  assert.ok(firstPlacement > 0 && firstPlacement < marker && marker < secondPlacement);
  assert.equal(fs.existsSync(publicFile(fixture, `/images/articles/${fixture.slug}/01-cover.webp`)), true);
  assert.equal(fs.existsSync(publicFile(fixture, `/images/articles/${fixture.slug}/02-product-view.webp`)), true);
  assert.deepEqual(readTree(fixture.folder), originals, "the source library must remain byte-identical");

  const manifest = JSON.parse(fs.readFileSync(path.join(fixture.projectRoot, "lib", "generated", "article-image-manifest.json"), "utf8"));
  assert.equal(manifest.articles[fixture.slug].cover, `/images/articles/${fixture.slug}/01-cover.webp`);
  assert.equal(manifest.assets[`/images/articles/${fixture.slug}/03-market-chart.png`]?.role ?? manifest.assets[`/images/articles/${fixture.slug}/03-market-chart.webp`]?.role, "chart");
  for (const asset of Object.values(manifest.assets)) {
    if (asset.mobile) assert.match(asset.mobile.src, /-800\.webp$/);
  }
  assert.equal(result.slug, fixture.slug);
  assert.equal(result.budgetClass, "standard");
  assert.equal(result.manifestChanged, true);
});

test("prepares a new article whose placed target URLs do not exist in public yet", async () => {
  const project = temporaryProject();
  const slug = "brand-new-article";
  const folder = sourceFolder(project, slug);
  const cover = `/images/articles/${slug}/01-cover.webp`;
  const body = [`/images/articles/${slug}/02-product-view.webp`];
  writeArticle(project, slug, { cover, body });
  await writeImage(path.join(folder, "01-cover.png"));
  await writeImage(path.join(folder, "02-product-view.png"), { width: 1100, height: 760 });

  const result = await prepareArticleImages({
    slug,
    projectRoot: project.projectRoot,
    sourceRoot: folder,
    dryRun: true
  });

  assert.equal(result.slug, slug);
  assert.ok(result.filesCreated.includes(`public/images/articles/${slug}/01-cover.webp`));
  assert.ok(result.filesCreated.includes(`public/images/articles/${slug}/02-product-view.webp`));
});

test("validates the exact image-config schema before transforming", async () => {
  const cases = [
    [{ images: { "99-unknown.png": { kind: "photo" } } }, /unknown filename.*99-unknown/i],
    [{ images: { "01-cover.png": { kind: "photo", focalPoint: { x: 1.01, y: 0.5 } } } }, /normalized.*0.*1/i],
    [{ images: { "01-cover.png": { kind: "photo", crop: { left: 0, top: 0, width: 100, height: 100 }, focalPoint: { x: 0.5, y: 0.5 } } } }, /conflicting crop.*focal/i],
    [{ images: { "02-product-view.png": { kind: "illustration" } } }, /unsupported kind.*illustration/i],
    [{ images: {}, extra: true }, /unknown image-config.*extra/i]
  ];

  for (const [config, message] of cases) {
    const fixture = await validFixture({ slug: `config-${temporaryRoots.length}` });
    fs.writeFileSync(path.join(fixture.folder, "image-config.json"), JSON.stringify(config));
    await assert.rejects(
      prepareArticleImages({ slug: fixture.slug, projectRoot: fixture.projectRoot, sourceRoot: fixture.folder }),
      message
    );
  }
});

test("dry-run completes transforms and reports repository deltas without changing any repository file", async () => {
  const fixture = await validFixture({ slug: "dry-run-report", bodyCount: 2 });
  const before = readTree(fixture.projectRoot);

  const result = await prepareArticleImages({
    slug: fixture.slug,
    projectRoot: fixture.projectRoot,
    sourceRoot: fixture.folder,
    dryRun: true
  });

  assert.deepEqual(readTree(fixture.projectRoot), before);
  assert.equal(result.dryRun, true);
  assert.equal(result.budgetClass, "standard");
  for (const field of ["sourceBytes", "desktopBytes", "mobileBytes", "netRepositoryBytes"]) {
    assert.equal(Number.isFinite(result[field]), true, `${field} must be numeric`);
  }
  for (const field of ["filesCreated", "filesReplaced", "filesRemoved", "warnings"]) {
    assert.equal(Array.isArray(result[field]), true, `${field} must be an array`);
  }
  assert.ok(result.filesCreated.some((file) => file.endsWith("01-cover.webp")));
});

test("prepareAllArticleImages preserves historical primaries when their source folder is absent", async () => {
  const project = temporaryProject();
  const slug = "historical-only";
  const cover = `/images/articles/${slug}/01-cover.png`;
  const body = [`/images/articles/${slug}/02-diagram.png`];
  writeArticle(project, slug, { cover, body });
  await writeCurrentArticleAssets(project, { cover, body });
  const beforeCover = fs.readFileSync(publicFile(project, cover));
  const beforeBody = fs.readFileSync(publicFile(project, body[0]));

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot
  });

  assert.deepEqual(fs.readFileSync(publicFile(project, cover)), beforeCover);
  assert.deepEqual(fs.readFileSync(publicFile(project, body[0])), beforeBody);
  assert.equal(result.mode, "all");
  assert.equal(result.articles[0].historicalPrimaryPreserved, true);
  assert.equal(result.articles[0].filesReplaced.some((file) => /01-cover\.png$|02-diagram\.png$/.test(file)), false);
});
