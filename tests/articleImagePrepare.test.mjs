import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

import sharp from "sharp";

import {
  ArticleImagePreparationError,
  PHOTO_AGGREGATE_MOBILE_LONG_EDGES,
  classifyHistoricalExtremeRecoveryAssets,
  prepareAllArticleImages,
  prepareArticleImages,
  selectPhotoAggregateRecoveryStage
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

test("photo aggregate mobile recovery uses the approved descending ladder with a 390px hard floor", () => {
  assert.deepEqual(PHOTO_AGGREGATE_MOBILE_LONG_EDGES, [680, 640, 560, 480, 390]);
});

test("extreme historical recovery accepts only hash-bound explicit photos and identifies non-photo assets", () => {
  const photo = "/images/insights/history-photo.jpg";
  const graphic = "/images/insights/history-catalog.jpg";
  const photoHash = `sha256:${"a".repeat(64)}`;
  const graphicHash = `sha256:${"b".repeat(64)}`;

  const result = classifyHistoricalExtremeRecoveryAssets({
    slug: "history-fixture",
    urls: [photo, graphic],
    processed: {
      [photo]: { outputHash: photoHash },
      [graphic]: { outputHash: graphicHash }
    },
    classifications: {
      [photo]: { kind: "photo", outputHash: photoHash },
      [graphic]: { kind: "graphic", outputHash: graphicHash }
    }
  });

  assert.deepEqual(result.photoUrls, [photo]);
  assert.deepEqual(result.excluded, [{ url: graphic, kind: "graphic" }]);
});

test("extreme historical recovery blocks unknown and stale kind classifications", () => {
  const url = "/images/insights/history-photo.jpg";
  const outputHash = `sha256:${"a".repeat(64)}`;

  assert.throws(
    () => classifyHistoricalExtremeRecoveryAssets({
      slug: "unknown-history-kind",
      urls: [url],
      processed: { [url]: { outputHash } },
      classifications: {}
    }),
    (error) => error instanceof ArticleImagePreparationError
      && error.code === "HISTORICAL_KIND_CLASSIFICATION_REQUIRED"
      && error.message.includes(url)
  );

  assert.throws(
    () => classifyHistoricalExtremeRecoveryAssets({
      slug: "stale-history-kind",
      urls: [url],
      processed: { [url]: { outputHash } },
      classifications: { [url]: { kind: "photo", outputHash: `sha256:${"b".repeat(64)}` } }
    }),
    (error) => error instanceof ArticleImagePreparationError
      && error.code === "HISTORICAL_KIND_CLASSIFICATION_STALE"
      && error.message.includes(url)
  );
});

test("generated-state repair applies sub-640 recovery only to explicitly classified photos", async () => {
  const project = temporaryProject();
  const slug = "mixed-kind-extreme-repair";
  const cover = `/images/insights/${slug}-cover.webp`;
  const body = Array.from({ length: 5 }, (_, index) => `/images/insights/${slug}-image-${String(index + 1).padStart(3, "0")}.webp`);
  writeArticle(project, slug, { cover, body });

  const urls = [cover, ...body];
  for (const url of urls) {
    const width = 720;
    const height = 480;
    const pixels = Buffer.alloc(width * height * 3);
    let state = 0x12345678;
    for (let index = 0; index < pixels.length; index += 1) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      pixels[index] = state >>> 24;
    }
    fs.mkdirSync(path.dirname(publicFile(project, url)), { recursive: true });
    await sharp(pixels, { raw: { width, height, channels: 3 } })
      .webp({ quality: 72, effort: 6 })
      .toFile(publicFile(project, url));
  }

  const graphic = body[0];
  const classifications = Object.fromEntries(urls.map((url) => {
    const outputHash = `sha256:${crypto.createHash("sha256").update(fs.readFileSync(publicFile(project, url))).digest("hex")}`;
    return [url, { kind: url === graphic ? "graphic" : "photo", outputHash }];
  }));
  const classificationPath = path.join(project.projectRoot, "scripts", "article-images", "historical-kind-classifications.json");
  fs.mkdirSync(path.dirname(classificationPath), { recursive: true });
  fs.writeFileSync(classificationPath, `${JSON.stringify({ version: 1, assets: classifications }, null, 2)}\n`);

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    repairGeneratedState: true,
    dryRun: true
  });

  assert.ok(result.articles[0].warnings.includes(
    `PHOTO_AGGREGATE_RECOVERY slug=${slug} budget=standard desktop=normal mobile=480 cover=normal images=6`
  ));
  assert.equal(result.articles[0].filesCreated.some((file) => file.endsWith(`${path.basename(graphic, ".webp")}-800.webp`)), false);
  assert.equal(result.articles[0].filesReplaced.some((file) => !file.endsWith("article-image-manifest.json")), false);
  assert.equal(result.articles[0].desktopBytes <= 1_500_000, true);
  assert.equal(result.articles[0].mobileBytes <= 750_000, true);
});

test("historical preparation grants visual_archive only after loading complete current classifications", async () => {
  const project = temporaryProject();
  const slug = "hundred-years-of-cleaning-appliance-history";
  const cover = `/images/insights/${slug}-cover.jpg`;
  const body = Array.from({ length: 51 }, (_, index) => `/images/insights/${slug}-image-${String(index + 1).padStart(3, "0")}.jpg`);
  writeArticle(project, slug, { cover, body, extraFrontmatter: "image_budget: visual_archive\n" });
  await writeImage(publicFile(project, cover), { width: 48, height: 32, format: "jpeg" });
  for (const url of body) {
    fs.mkdirSync(path.dirname(publicFile(project, url)), { recursive: true });
    fs.copyFileSync(publicFile(project, cover), publicFile(project, url));
  }
  const outputHash = `sha256:${crypto.createHash("sha256").update(fs.readFileSync(publicFile(project, cover))).digest("hex")}`;
  const classificationPath = path.join(project.projectRoot, "scripts", "article-images", "historical-kind-classifications.json");
  fs.mkdirSync(path.dirname(classificationPath), { recursive: true });
  fs.writeFileSync(classificationPath, `${JSON.stringify({
    version: 1,
    assets: Object.fromEntries([cover, ...body].map((url) => [url, { kind: "graphic", outputHash }]))
  }, null, 2)}\n`);

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    repairGeneratedState: true,
    dryRun: true
  });

  assert.equal(result.articles[0].budgetClass, "visual_archive");
  assert.equal(result.articles[0].desktopBytes <= 2_500_000, true);
  assert.equal(result.articles[0].mobileBytes <= 1_600_000, true);
  assert.equal(result.articles[0].filesReplaced.some((file) => !file.endsWith("article-image-manifest.json")), false);
});

test("deep photo recovery selects the first passing aggregate stage for a 46-photo fixture", () => {
  const selected = selectPhotoAggregateRecoveryStage({
    photoCount: 46,
    budgetClass: "deep",
    budget: { desktop: 2_500_000, mobile: 1_200_000 },
    desktopStages: [
      { longEdge: 1120, includeCover: false, bytes: 2_730_000 },
      { longEdge: 960, includeCover: false, bytes: 2_440_000 },
      { longEdge: 800, includeCover: false, bytes: 2_010_000 }
    ],
    mobileStages: [
      { longEdge: 680, includeCover: false, bytes: 1_170_000 },
      { longEdge: 640, includeCover: false, bytes: 1_050_000 }
    ]
  });

  assert.deepEqual(selected, {
    budgetClass: "deep",
    desktop: { longEdge: 960, includeCover: false, bytes: 2_440_000 },
    mobile: { longEdge: 680, includeCover: false, bytes: 1_170_000 }
  });
});

test("deep photo recovery selects the first lower mobile stage that passes for a 110-photo fixture", () => {
  const selected = selectPhotoAggregateRecoveryStage({
    photoCount: 110,
    budgetClass: "deep",
    budget: { desktop: 2_500_000, mobile: 1_200_000 },
    desktopStages: [
      { longEdge: null, includeCover: false, bytes: 1_958_574 }
    ],
    mobileStages: [
      { longEdge: 640, includeCover: false, bytes: 1_457_179 },
      { longEdge: 560, includeCover: false, bytes: 1_284_000 },
      { longEdge: 480, includeCover: false, bytes: 1_176_000 },
      { longEdge: 390, includeCover: false, bytes: 1_034_000 }
    ]
  });

  assert.deepEqual(selected, {
    budgetClass: "deep",
    desktop: { longEdge: null, includeCover: false, bytes: 1_958_574 },
    mobile: { longEdge: 480, includeCover: false, bytes: 1_176_000 }
  });
});

test("deep photo recovery rejects a passing stage below the 390px hard floor", () => {
  const selected = selectPhotoAggregateRecoveryStage({
    photoCount: 110,
    budgetClass: "deep",
    budget: { desktop: 2_500_000, mobile: 1_200_000 },
    desktopStages: [
      { longEdge: null, includeCover: false, bytes: 1_958_574 }
    ],
    mobileStages: [
      { longEdge: 390, includeCover: true, bytes: 1_210_000 },
      { longEdge: 320, includeCover: true, bytes: 1_100_000 }
    ]
  });

  assert.equal(selected, null);
});

test("standard photo recovery keeps an exactly-eight-body article standard and selects its first passing stage", () => {
  const selected = selectPhotoAggregateRecoveryStage({
    photoCount: 9,
    budgetClass: "standard",
    budget: { desktop: 1_500_000, mobile: 750_000 },
    desktopStages: [
      { longEdge: 1120, includeCover: false, bytes: 1_517_000 },
      { longEdge: 960, includeCover: false, bytes: 1_482_000 },
      { longEdge: 800, includeCover: false, bytes: 1_310_000 }
    ],
    mobileStages: [
      { longEdge: 680, includeCover: false, bytes: 742_000 },
      { longEdge: 640, includeCover: false, bytes: 690_000 }
    ]
  });

  assert.deepEqual(selected, {
    budgetClass: "standard",
    desktop: { longEdge: 960, includeCover: false, bytes: 1_482_000 },
    mobile: { longEdge: 680, includeCover: false, bytes: 742_000 }
  });
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

test("rejects missing or non-object image-config images with article and sidecar details", async () => {
  for (const config of [{}, { images: null }, { images: [] }, { images: "01-cover.png" }]) {
    const fixture = await validFixture({ slug: `config-shape-${temporaryRoots.length}` });
    const configPath = path.join(fixture.folder, "image-config.json");
    fs.writeFileSync(configPath, JSON.stringify(config));

    await assert.rejects(
      prepareArticleImages({ slug: fixture.slug, projectRoot: fixture.projectRoot, sourceRoot: fixture.folder }),
      (error) => {
        assert.equal(error instanceof ArticleImagePreparationError, true);
        assert.equal(error.code, "INVALID_IMAGE_CONFIG");
        assert.equal(error.slug, fixture.slug);
        assert.equal(error.file, configPath);
        assert.match(error.message, new RegExp(fixture.slug));
        assert.match(error.message, /image-config\.json/);
        return true;
      }
    );
  }
});

test("rejects repository root overrides outside projectRoot without mutating them", async (t) => {
  for (const rootName of ["contentRoot", "publicRoot", "manifestPath"]) {
    await t.test(rootName, async () => {
      const fixture = await validFixture({ slug: `outside-${rootName.toLowerCase()}` });
      const outside = path.join(fixture.root, `outside-${rootName}`);
      fs.mkdirSync(outside, { recursive: true });
      let override;
      if (rootName === "contentRoot") {
        override = path.join(outside, "content");
        fs.cpSync(path.join(fixture.projectRoot, "content"), override, { recursive: true });
      } else if (rootName === "publicRoot") {
        override = path.join(outside, "public");
        fs.cpSync(path.join(fixture.projectRoot, "public"), override, { recursive: true });
      } else {
        override = path.join(outside, "article-image-manifest.json");
        fs.writeFileSync(override, "outside manifest must remain unchanged");
      }
      const before = readTree(outside);

      await assert.rejects(
        prepareArticleImages({
          slug: fixture.slug,
          projectRoot: fixture.projectRoot,
          sourceRoot: fixture.folder,
          [rootName]: override
        }),
        (error) => error instanceof ArticleImagePreparationError && error.code === "INVALID_REPOSITORY_PATH"
      );
      assert.deepEqual(readTree(outside), before);
    });
  }
});

test("rejects content, public, and manifest symlink escapes without mutating external files", async (t) => {
  for (const area of ["content", "public", "manifest"]) {
    await t.test(area, async () => {
      const fixture = await validFixture({ slug: `symlink-${area}` });
      const outside = path.join(fixture.root, `outside-${area}`);
      fs.mkdirSync(outside, { recursive: true });
      if (area === "content") {
        const externalContent = path.join(outside, "content");
        fs.renameSync(path.join(fixture.projectRoot, "content"), externalContent);
        fs.symlinkSync(externalContent, path.join(fixture.projectRoot, "content"));
      } else if (area === "public") {
        const externalPublic = path.join(outside, "public");
        fs.renameSync(path.join(fixture.projectRoot, "public"), externalPublic);
        fs.symlinkSync(externalPublic, path.join(fixture.projectRoot, "public"));
      } else {
        const externalGenerated = path.join(outside, "generated");
        fs.mkdirSync(externalGenerated, { recursive: true });
        fs.writeFileSync(path.join(externalGenerated, "marker.txt"), "must remain unchanged");
        fs.mkdirSync(path.join(fixture.projectRoot, "lib"), { recursive: true });
        fs.symlinkSync(externalGenerated, path.join(fixture.projectRoot, "lib", "generated"));
      }
      const before = readTree(outside);

      await assert.rejects(
        prepareArticleImages({ slug: fixture.slug, projectRoot: fixture.projectRoot, sourceRoot: fixture.folder }),
        (error) => error instanceof ArticleImagePreparationError && error.code === "INVALID_REPOSITORY_PATH"
      );
      assert.deepEqual(readTree(outside), before);
    });
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

test("prepareAllArticleImages preserves historical primary URLs and formats when their source folder is absent", async () => {
  const project = temporaryProject();
  const slug = "historical-only";
  const cover = `/images/articles/${slug}/01-cover.png`;
  const body = [`/images/articles/${slug}/02-diagram.png`];
  writeArticle(project, slug, { cover, body });
  await writeCurrentArticleAssets(project, { cover, body });
  const articleBefore = fs.readFileSync(articleFile(project, slug), "utf8");
  const beforeCoverBytes = fs.statSync(publicFile(project, cover)).size;
  const beforeBodyBytes = fs.statSync(publicFile(project, body[0])).size;

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot
  });

  assert.equal(fs.readFileSync(articleFile(project, slug), "utf8"), articleBefore);
  assert.equal((await sharp(publicFile(project, cover)).metadata()).format, "png");
  assert.equal((await sharp(publicFile(project, body[0])).metadata()).format, "png");
  assert.ok(fs.statSync(publicFile(project, cover)).size <= beforeCoverBytes);
  assert.ok(fs.statSync(publicFile(project, body[0])).size <= beforeBodyBytes);
  assert.equal(result.mode, "all");
  assert.equal(result.articles[0].historicalPrimaryPreserved, true);
  assert.equal(result.articles[0].filesCreated.some((file) => file.includes(`/images/articles/${slug}/`)), false);
});

test("generated-state repair removes an invalid same-width mobile and refreshes the current cover role without touching the primary", async () => {
  const project = temporaryProject();
  const slug = "historical-generated-state-repair";
  const cover = `/images/blog/${slug}-cover.webp`;
  const mobile = `/images/blog/${slug}-cover-800.webp`;
  writeArticle(project, slug, { cover, body: [] });
  await writeImage(publicFile(project, cover), { width: 720, height: 480, format: "webp", noise: true });
  await writeImage(publicFile(project, mobile), { width: 720, height: 480, format: "webp" });
  const primaryBefore = fs.readFileSync(publicFile(project, cover));
  const mobileBefore = fs.readFileSync(publicFile(project, mobile));
  const hash = (buffer) => `sha256:${crypto.createHash("sha256").update(buffer).digest("hex")}`;
  const manifestPath = path.join(project.projectRoot, "lib", "generated", "article-image-manifest.json");
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify({
    version: 1,
    processorVersion: "1",
    assets: {
      [cover]: {
        role: "body",
        kind: "photo",
        width: 720,
        height: 480,
        bytes: primaryBefore.length,
        format: "webp",
        quality: 84,
        sourceHash: hash(primaryBefore),
        outputHash: hash(primaryBefore),
        mobile: {
          src: mobile,
          width: 720,
          height: 480,
          bytes: mobileBefore.length,
          outputHash: hash(mobileBefore)
        }
      }
    },
    articles: {
      [slug]: { budgetClass: "standard", cover, body: [] }
    }
  }));

  const dryRun = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    repairGeneratedState: true,
    dryRun: true
  });

  assert.deepEqual(fs.readFileSync(publicFile(project, cover)), primaryBefore);
  assert.deepEqual(fs.readFileSync(publicFile(project, mobile)), mobileBefore);
  assert.deepEqual(dryRun.articles[0].filesReplaced, ["lib/generated/article-image-manifest.json"]);
  assert.deepEqual(dryRun.articles[0].filesRemoved, [`public${mobile}`]);

  await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    repairGeneratedState: true
  });

  assert.deepEqual(fs.readFileSync(publicFile(project, cover)), primaryBefore);
  assert.equal(fs.existsSync(publicFile(project, mobile)), false);
  const repaired = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.equal(repaired.assets[cover].role, "cover");
  assert.equal("mobile" in repaired.assets[cover], false);
});

test("prepareAllArticleImages optimizes repository primaries in place even when a valid external source folder exists", async () => {
  const project = temporaryProject();
  const slug = "historical-source-backed";
  const cover = "/images/blog/historical-source-backed-cover.jpg";
  const body = ["/images/insights/02-historical-source-backed.jpg"];
  const originalArticle = writeArticle(project, slug, { cover, body });
  await writeCurrentArticleAssets(project, { cover, body });
  const originalBytes = {
    cover: fs.statSync(publicFile(project, cover)).size,
    body: fs.statSync(publicFile(project, body[0])).size
  };
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  await writeImage(path.join(folder, "02-product-view.png"), { width: 1100, height: 760 });
  const sourceBefore = readTree(project.sourceLibraryRoot);

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot
  });

  assert.equal(fs.readFileSync(articleFile(project, slug), "utf8"), originalArticle);
  assert.equal((await sharp(publicFile(project, cover)).metadata()).format, "jpeg");
  assert.equal((await sharp(publicFile(project, body[0])).metadata()).format, "jpeg");
  assert.ok(fs.statSync(publicFile(project, cover)).size < originalBytes.cover);
  assert.ok(fs.statSync(publicFile(project, body[0])).size < originalBytes.body);
  assert.ok(result.articles[0].filesReplaced.includes("public/images/blog/historical-source-backed-cover.jpg"));
  assert.ok(result.articles[0].filesReplaced.includes("public/images/insights/02-historical-source-backed.jpg"));
  assert.equal(result.articles[0].filesCreated.some((file) => file.includes(`/images/articles/${slug}/`)), false);
  const manifest = JSON.parse(fs.readFileSync(path.join(project.projectRoot, "lib", "generated", "article-image-manifest.json"), "utf8"));
  assert.ok(manifest.assets[cover]);
  assert.ok(manifest.assets[body[0]]);
  assert.equal(Object.keys(manifest.assets).some((url) => url.startsWith(`/images/articles/${slug}/`)), false);
  assert.deepEqual(readTree(project.sourceLibraryRoot), sourceBefore, "validation-only external sources must remain immutable");
});

test("prepareAllArticleImages uses the approved repository-primary fallback for the one known malformed source folder", async () => {
  const project = temporaryProject();
  const slug = "building-worlds-no-1-cleaning-show-from-scratch-episode-01";
  const malformedFilename = "building-worlds-no-1-cleaning-show-episode-01-cover.webp";
  const cover = "/images/blog/building-worlds-no-1-cleaning-show-episode-01-cover.webp";
  const body = ["/images/blog/building-worlds-no-1-cleaning-show-episode-01-body.webp"];
  writeArticle(project, slug, { cover, body });
  await writeCurrentArticleAssets(project, { cover, body });
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, malformedFilename), { format: "webp" });
  const sourceBefore = readTree(project.sourceLibraryRoot);
  const primaryBefore = fs.readFileSync(publicFile(project, cover));

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });

  assert.equal(result.articles[0].historicalPrimaryPreserved, true);
  assert.deepEqual(result.articles[0].warnings, [
    `EXTERNAL_SOURCE_CONFLICT_FALLBACK slug=${slug} file=${malformedFilename} reason=INVALID_SOURCE_FILENAME repository-primary-preserved`
  ]);
  assert.deepEqual(fs.readFileSync(publicFile(project, cover)), primaryBefore);
  assert.deepEqual(readTree(project.sourceLibraryRoot), sourceBefore, "the malformed external source folder must remain immutable");
});

test("prepareAllArticleImages keeps every other present malformed source folder blocking", async () => {
  const project = temporaryProject();
  const slug = "unapproved-present-malformed";
  const cover = `/images/legacy/${slug}-cover.webp`;
  writeArticle(project, slug, { cover, body: [] });
  await writeCurrentArticleAssets(project, { cover });
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "cover-without-sequence.webp"), { format: "webp" });

  await assert.rejects(
    prepareAllArticleImages({
      projectRoot: project.projectRoot,
      sourceLibraryRoot: project.sourceLibraryRoot,
      dryRun: true
    }),
    /cover-without-sequence\.webp.*no deterministic two-digit sequence mapping/i
  );
});

test("prepareAllArticleImages preserves the approved LG SVG primary and reports its incompatible historical source format", async () => {
  const project = temporaryProject();
  const slug = "who-makes-lg-appliances-manufacturing-network";
  const cover = "/images/blog/who-makes-lg-appliances-manufacturing-network-cover.webp";
  const body = [
    "/images/blog/lg-home-appliance-solution-map.svg",
    "/images/blog/lg-appliance-manufacturing-verification-map.svg"
  ];
  writeArticle(project, slug, { cover, body });
  await writeImage(publicFile(project, cover), { format: "webp" });
  fs.mkdirSync(path.dirname(publicFile(project, body[0])), { recursive: true });
  for (const url of body) {
    fs.writeFileSync(publicFile(project, url), '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><rect width="900" height="600" fill="#fff"/><text x="40" y="80">LG verification map</text></svg>');
  }
  const primaryBefore = fs.readFileSync(publicFile(project, body[0]));
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  await writeImage(path.join(folder, "02-lg-home-appliance-solution-map.png"), { width: 900, height: 600 });
  await writeImage(path.join(folder, "03-lg-appliance-manufacturing-verification-map.png"), { width: 900, height: 600 });

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });

  assert.equal(result.articles[0].historicalPrimaryPreserved, true);
  assert.ok(result.articles[0].warnings.includes(
    `INCOMPATIBLE_HISTORICAL_PRIMARY_FORMAT slug=${slug} primary=${body[0]} source=02-lg-home-appliance-solution-map.png repository-primary-preserved`
  ));
  assert.deepEqual(fs.readFileSync(publicFile(project, body[0])), primaryBefore);
  assert.equal(result.articles[0].filesReplaced.some((file) => file.endsWith("lg-home-appliance-solution-map.svg")), false);
  assert.equal(result.articles[0].filesCreated.some((file) => file.endsWith("lg-home-appliance-solution-map-800.webp")), false);
});

test("historical SVG primaries bypass every raster path even when Sharp rejects their declared size", async () => {
  const project = temporaryProject();
  const slug = "historical-svg-raster-bypass";
  const cover = `/images/blog/${slug}-cover.webp`;
  const body = [`/images/blog/${slug}-large-map.svg`];
  writeArticle(project, slug, { cover, body });
  await writeImage(publicFile(project, cover), { format: "webp" });
  fs.mkdirSync(path.dirname(publicFile(project, body[0])), { recursive: true });
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="100000" height="100000"><rect width="100000" height="100000" fill="#fff"/></svg>');
  fs.writeFileSync(publicFile(project, body[0]), svg);

  await assert.rejects(
    sharp(svg).metadata(),
    /pixel limit/i,
    "fixture must remain invalid for Sharp so a passing preparation proves the raster path was bypassed"
  );

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });

  assert.deepEqual(fs.readFileSync(publicFile(project, body[0])), svg);
  assert.equal(result.articles[0].filesCreated.some((file) => file.endsWith("-large-map-800.webp")), false);
  assert.equal(result.articles[0].filesReplaced.some((file) => file.endsWith("-large-map.svg")), false);
});

test("prepareAllArticleImages generally preserves a uniquely matched incompatible historical primary format", async () => {
  const project = temporaryProject();
  const slug = "historical-incompatible-format";
  const cover = `/images/blog/${slug}-cover.webp`;
  const body = ["/images/blog/exact-semantic-map.svg"];
  writeArticle(project, slug, { cover, body });
  await writeImage(publicFile(project, cover), { format: "webp" });
  fs.mkdirSync(path.dirname(publicFile(project, body[0])), { recursive: true });
  fs.writeFileSync(publicFile(project, body[0]), '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><text x="40" y="80">Exact map</text></svg>');
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  await writeImage(path.join(folder, "02-exact-semantic-map.png"), { width: 900, height: 600 });

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });

  assert.ok(result.articles[0].warnings.includes(
    `INCOMPATIBLE_HISTORICAL_PRIMARY_FORMAT slug=${slug} primary=${body[0]} source=02-exact-semantic-map.png repository-primary-preserved`
  ));
});

test("prepareAllArticleImages reports ambiguous external semantic matches without displacing the repository primary", async () => {
  const project = temporaryProject();
  const slug = "ambiguous-historical-source";
  const cover = `/images/blog/${slug}-cover.webp`;
  const body = ["/images/blog/shared-map.svg"];
  writeArticle(project, slug, { cover, body });
  await writeImage(publicFile(project, cover), { format: "webp" });
  fs.mkdirSync(path.dirname(publicFile(project, body[0])), { recursive: true });
  fs.writeFileSync(publicFile(project, body[0]), '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><text x="40" y="80">Ambiguous map</text></svg>');
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  await writeImage(path.join(folder, "02-shared-map.png"), { width: 900, height: 600 });
  await writeImage(path.join(folder, "03-shared-map.webp"), { width: 900, height: 600, format: "webp" });

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });
  assert.ok(result.articles[0].warnings.includes(
    `EXTERNAL_SOURCE_CONTENT_CONFLICT slug=${slug} primary=${body[0]} sources=02-shared-map.png,03-shared-map.webp reason=AMBIGUOUS_SEMANTIC_MATCH repository-primary-preserved`
  ));
});

test("historical validation never treats a same-sequence different-name and format source as equivalent", async () => {
  const project = temporaryProject();
  const slug = "historical-sequence-is-not-identity";
  const cover = `/images/blog/${slug}-cover.webp`;
  const body = ["/images/blog/02-repository-identity.svg"];
  writeArticle(project, slug, { cover, body });
  await writeImage(publicFile(project, cover), { format: "webp" });
  fs.mkdirSync(path.dirname(publicFile(project, body[0])), { recursive: true });
  fs.writeFileSync(publicFile(project, body[0]), '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"/>');
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  await writeImage(path.join(folder, "02-unrelated-external-catalog.png"), { width: 900, height: 600 });

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });

  assert.deepEqual(result.articles[0].warnings, [
    `EXTERNAL_SOURCE_CONTENT_CONFLICT slug=${slug} primary=${body[0]} sources=02-unrelated-external-catalog.png reason=NO_SEMANTIC_MATCH repository-primary-preserved`
  ]);
});

test("historical validation names the real external descriptor when only a cover descriptor exists", async () => {
  const project = temporaryProject();
  const slug = "historical-cover-only-source-conflict";
  const cover = `/images/blog/${slug}-cover.webp`;
  const body = ["/images/blog/repository-identity.svg"];
  writeArticle(project, slug, { cover, body });
  await writeImage(publicFile(project, cover), { format: "webp" });
  fs.mkdirSync(path.dirname(publicFile(project, body[0])), { recursive: true });
  fs.writeFileSync(publicFile(project, body[0]), '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"/>');
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });

  assert.deepEqual(result.articles[0].warnings, [
    `EXTERNAL_SOURCE_CONTENT_CONFLICT slug=${slug} primary=${body[0]} sources=01-cover.png reason=NO_SEMANTIC_MATCH repository-primary-preserved`
  ]);
});

test("historical validation assigns an unreferenced external body descriptor to the real repository cover", async () => {
  const project = temporaryProject();
  const slug = "historical-cover-owns-unreferenced-body-source";
  const cover = `/images/blog/${slug}-cover.webp`;
  writeArticle(project, slug, { cover, body: [] });
  await writeImage(publicFile(project, cover), { format: "webp" });
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  await writeImage(path.join(folder, "02-external-body.png"));

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });

  assert.deepEqual(result.articles[0].warnings, [
    `EXTERNAL_SOURCE_CONTENT_CONFLICT slug=${slug} primary=${cover} sources=02-external-body.png reason=UNREFERENCED_EXTERNAL_DESCRIPTOR repository-primary-preserved`
  ]);
});

test("historical validation blocks an external body descriptor without any repository primary owner", async () => {
  const project = temporaryProject();
  const slug = "historical-unowned-external-body";
  writeArticle(project, slug, { cover: "https://example.com/external-cover.jpg", body: [] });
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  await writeImage(path.join(folder, "02-external-body.png"));

  await assert.rejects(
    prepareAllArticleImages({
      projectRoot: project.projectRoot,
      sourceLibraryRoot: project.sourceLibraryRoot,
      dryRun: true
    }),
    (error) => error instanceof ArticleImagePreparationError
      && error.code === "HISTORICAL_REPOSITORY_PRIMARY_OWNERSHIP_MISSING"
      && error.slug === slug
      && error.imageName === "02-external-body.png"
  );
});

test("historical validation records a true same-sequence semantic match and its real format conflict", async () => {
  const project = temporaryProject();
  const slug = "historical-sequence-with-semantic-identity";
  const cover = `/images/blog/${slug}-cover.webp`;
  const body = ["/images/blog/02-identity-map.svg"];
  writeArticle(project, slug, { cover, body });
  await writeImage(publicFile(project, cover), { format: "webp" });
  fs.mkdirSync(path.dirname(publicFile(project, body[0])), { recursive: true });
  fs.writeFileSync(publicFile(project, body[0]), '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"/>');
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  await writeImage(path.join(folder, "02-identity-map.png"), { width: 900, height: 600 });

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });

  assert.deepEqual(result.articles[0].warnings, [
    `INCOMPATIBLE_HISTORICAL_PRIMARY_FORMAT slug=${slug} primary=${body[0]} source=02-identity-map.png repository-primary-preserved`
  ]);
});

test("prepareAllArticleImages validates an EGO-shaped historical SVG through a slug-owned prefix", async () => {
  const project = temporaryProject();
  const slug = "who-owns-ego-power-plus-chervon-manufacturing";
  const cover = "/images/blog/ego-power-plus-cover.webp";
  const body = ["/images/blog/ego-power-plus-ownership-platform-map.svg"];
  writeArticle(project, slug, { cover, body });
  await writeImage(publicFile(project, cover), { format: "webp" });
  fs.mkdirSync(path.dirname(publicFile(project, body[0])), { recursive: true });
  const primary = '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><text x="40" y="80">EGO ownership</text></svg>';
  fs.writeFileSync(publicFile(project, body[0]), primary);
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  fs.writeFileSync(path.join(folder, "02-ownership-platform-map.svg"), primary);

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });

  assert.ok(result.articles[0].warnings.includes(
    `HISTORICAL_SVG_PREFIX_NORMALIZED slug=${slug} primary=${body[0]} source=02-ownership-platform-map.svg prefix=ego-power-plus repository-primary-preserved`
  ));
  assert.equal(fs.readFileSync(publicFile(project, body[0]), "utf8"), primary);
  assert.equal(result.articles[0].filesReplaced.some((file) => file.endsWith(".svg")), false);
});

test("prepareAllArticleImages validates a Fisher-and-Paykel-shaped prefixed SVG against incompatible PNG sources", async () => {
  const project = temporaryProject();
  const slug = "who-owns-fisher-paykel-haier-manufacturing";
  const cover = "/images/blog/fisher-paykel-haier-manufacturing-cover.webp";
  const body = [
    "/images/blog/fisher-paykel-ownership-identity-map.svg",
    "/images/blog/fisher-paykel-manufacturing-verification-map.svg"
  ];
  writeArticle(project, slug, { cover, body });
  await writeImage(publicFile(project, cover), { format: "webp" });
  fs.mkdirSync(path.dirname(publicFile(project, body[0])), { recursive: true });
  for (const url of body) {
    fs.writeFileSync(publicFile(project, url), '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><text x="40" y="80">Fisher Paykel</text></svg>');
  }
  const before = body.map((url) => fs.readFileSync(publicFile(project, url)));
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  await writeImage(path.join(folder, "02-ownership-identity-map.png"), { width: 900, height: 600 });
  await writeImage(path.join(folder, "03-manufacturing-verification-map.png"), { width: 900, height: 600 });

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });

  for (const [index, source] of ["02-ownership-identity-map.png", "03-manufacturing-verification-map.png"].entries()) {
    assert.ok(result.articles[0].warnings.includes(
      `HISTORICAL_SVG_PREFIX_NORMALIZED slug=${slug} primary=${body[index]} source=${source} prefix=fisher-paykel repository-primary-preserved`
    ));
    assert.ok(result.articles[0].warnings.includes(
      `INCOMPATIBLE_HISTORICAL_PRIMARY_FORMAT slug=${slug} primary=${body[index]} source=${source} repository-primary-preserved`
    ));
    assert.deepEqual(fs.readFileSync(publicFile(project, body[index])), before[index]);
  }
});

test("prepareAllArticleImages reports ambiguous slug-owned suffix matches with incompatible formats", async () => {
  const project = temporaryProject();
  const slug = "who-owns-fisher-paykel-ownership";
  const cover = `/images/blog/${slug}-cover.webp`;
  const body = ["/images/blog/fisher-paykel-ownership-identity-map.svg"];
  writeArticle(project, slug, { cover, body });
  await writeImage(publicFile(project, cover), { format: "webp" });
  fs.mkdirSync(path.dirname(publicFile(project, body[0])), { recursive: true });
  fs.writeFileSync(publicFile(project, body[0]), '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"/>');
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  await writeImage(path.join(folder, "02-ownership-identity-map.png"), { width: 900, height: 600 });
  await writeImage(path.join(folder, "03-identity-map.webp"), { width: 900, height: 600, format: "webp" });

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });
  assert.ok(result.articles[0].warnings.includes(
    `EXTERNAL_SOURCE_CONTENT_CONFLICT slug=${slug} primary=${body[0]} sources=02-ownership-identity-map.png,03-identity-map.webp reason=AMBIGUOUS_SEMANTIC_MATCH repository-primary-preserved`
  ));
});

test("prepareAllArticleImages reports ambiguous slug-owned historical SVG suffix matches", async () => {
  const project = temporaryProject();
  const slug = "who-owns-ego-power-plus-ownership";
  const cover = `/images/blog/${slug}-cover.webp`;
  const body = ["/images/blog/ego-power-plus-ownership-platform-map.svg"];
  writeArticle(project, slug, { cover, body });
  await writeImage(publicFile(project, cover), { format: "webp" });
  fs.mkdirSync(path.dirname(publicFile(project, body[0])), { recursive: true });
  fs.writeFileSync(publicFile(project, body[0]), '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"/>');
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  fs.writeFileSync(path.join(folder, "02-ownership-platform-map.svg"), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  fs.writeFileSync(path.join(folder, "03-platform-map.svg"), '<svg xmlns="http://www.w3.org/2000/svg"/>');

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });
  assert.ok(result.articles[0].warnings.includes(
    `EXTERNAL_SOURCE_CONTENT_CONFLICT slug=${slug} primary=${body[0]} sources=02-ownership-platform-map.svg,03-platform-map.svg reason=AMBIGUOUS_SEMANTIC_MATCH repository-primary-preserved`
  ));
});

test("prepareAllArticleImages reports unrelated external SVG prefixes without displacing the repository primary", async () => {
  const project = temporaryProject();
  const slug = "who-owns-ego-power-plus-chervon-manufacturing";
  const cover = `/images/blog/${slug}-cover.webp`;
  const body = ["/images/blog/other-brand-ownership-platform-map.svg"];
  writeArticle(project, slug, { cover, body });
  await writeImage(publicFile(project, cover), { format: "webp" });
  fs.mkdirSync(path.dirname(publicFile(project, body[0])), { recursive: true });
  fs.writeFileSync(publicFile(project, body[0]), '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"/>');
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  fs.writeFileSync(path.join(folder, "02-ownership-platform-map.svg"), '<svg xmlns="http://www.w3.org/2000/svg"/>');

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });
  assert.ok(result.articles[0].warnings.includes(
    `EXTERNAL_SOURCE_CONTENT_CONFLICT slug=${slug} primary=${body[0]} sources=02-ownership-platform-map.svg reason=NO_SEMANTIC_MATCH repository-primary-preserved`
  ));
});

test("prepareAllArticleImages keeps Midea-shaped historical repository primaries authoritative over semantic source conflicts", async () => {
  const project = temporaryProject();
  const slug = "who-owns-midea-appliances-brand-portfolio";
  const cover = "/images/blog/midea-appliance-brand-portfolio-cover.webp";
  const body = [
    "/images/blog/midea-group-brand-portfolio-map.svg",
    "/images/blog/midea-global-operating-network-map.svg"
  ];
  writeArticle(project, slug, { cover, body });
  await writeImage(publicFile(project, cover), { format: "webp" });
  fs.mkdirSync(path.dirname(publicFile(project, body[0])), { recursive: true });
  for (const url of body) {
    fs.writeFileSync(publicFile(project, url), '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><text x="40" y="80">Repository authority</text></svg>');
  }
  const before = body.map((url) => fs.readFileSync(publicFile(project, url)));
  const folder = sourceFolder(project, slug);
  await writeImage(path.join(folder, "01-cover.png"));
  await writeImage(path.join(folder, "02-brand-relationship-map.png"), { width: 900, height: 600 });
  await writeImage(path.join(folder, "03-manufacturing-responsibility-map.png"), { width: 900, height: 600 });

  const result = await prepareAllArticleImages({
    projectRoot: project.projectRoot,
    sourceLibraryRoot: project.sourceLibraryRoot,
    dryRun: true
  });

  for (const url of body) {
    assert.ok(result.articles[0].warnings.includes(
      `EXTERNAL_SOURCE_CONTENT_CONFLICT slug=${slug} primary=${url} sources=02-brand-relationship-map.png,03-manufacturing-responsibility-map.png reason=NO_SEMANTIC_MATCH repository-primary-preserved`
    ));
  }
  for (const [index, url] of body.entries()) {
    assert.deepEqual(fs.readFileSync(publicFile(project, url)), before[index]);
    assert.equal(result.articles[0].filesReplaced.some((file) => file.endsWith(path.basename(url))), false);
  }
});

test("prepareAllArticleImages still blocks missing or role-ambiguous repository primaries", async () => {
  const missing = temporaryProject();
  const missingSlug = "missing-repository-primary";
  const missingCover = `/images/blog/${missingSlug}-cover.webp`;
  const missingBody = [`/images/blog/${missingSlug}-map.svg`];
  writeArticle(missing, missingSlug, { cover: missingCover, body: missingBody });
  await writeImage(publicFile(missing, missingCover), { format: "webp" });
  await assert.rejects(
    prepareAllArticleImages({
      projectRoot: missing.projectRoot,
      sourceLibraryRoot: missing.sourceLibraryRoot,
      dryRun: true
    }),
    /missing-repository-primary.*missing local image file.*missing-repository-primary-map\.svg/i
  );

  const ambiguous = temporaryProject();
  const ambiguousSlug = "ambiguous-repository-primary";
  const shared = `/images/blog/${ambiguousSlug}-shared.webp`;
  const other = `/images/blog/${ambiguousSlug}-other.webp`;
  writeArticle(ambiguous, ambiguousSlug, { cover: shared, body: [other, shared] });
  await writeImage(publicFile(ambiguous, shared), { format: "webp" });
  await writeImage(publicFile(ambiguous, other), { format: "webp" });
  await assert.rejects(
    prepareAllArticleImages({
      projectRoot: ambiguous.projectRoot,
      sourceLibraryRoot: ambiguous.sourceLibraryRoot,
      dryRun: true
    }),
    /ambiguous-repository-primary.*conflicting roles.*ambiguous-repository-primary-shared\.webp/i
  );
});
