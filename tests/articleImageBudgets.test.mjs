import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

import sharp from "sharp";

import {
  ARTICLE_IMAGE_LIMIT_BYTES,
  ARTICLE_IMAGE_RUNTIME_LIMIT_BYTES
} from "../scripts/article-images/config.mjs";
import {
  buildManifest,
  buildRuntimeIndex,
  serializeManifest,
  serializeRuntimeIndex
} from "../scripts/article-images/manifest.mjs";
import { discoverArticleInventory } from "../scripts/article-images/references.mjs";
import {
  verifyArticleBudget,
  verifyArticleImages,
  verifyManifestFiles,
  verifyRepositoryBudget
} from "../scripts/article-images/verify.mjs";
import { verifyBuiltArticleImages } from "../scripts/verify-built-article-images.mjs";

const temporaryRoots = [];

function temporaryProject(prefix = "wcb-article-image-verify-") {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  temporaryRoots.push(projectRoot);
  const contentRoot = path.join(projectRoot, "content");
  const publicRoot = path.join(projectRoot, "public");
  const manifestPath = path.join(projectRoot, "lib", "generated", "article-image-manifest.json");
  const runtimePath = path.join(projectRoot, "lib", "generated", "article-image-runtime.json");
  const sourceLibraryRoot = path.join(projectRoot, "source-library");
  fs.mkdirSync(path.join(contentRoot, "insights"), { recursive: true });
  fs.mkdirSync(publicRoot, { recursive: true });
  fs.mkdirSync(sourceLibraryRoot, { recursive: true });
  return { projectRoot, contentRoot, publicRoot, manifestPath, runtimePath, sourceLibraryRoot };
}

function sha256(file) {
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")}`;
}

function publicFile(project, url) {
  return path.join(project.publicRoot, url.slice(1));
}

async function writeImage(file, { width = 1200, height = 675, format = "webp", color = "#147a8c" } = {}) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const input = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${color}"/></svg>`
  );
  const pipeline = sharp(input);
  if (format === "png") await pipeline.png().toFile(file);
  else if (format === "jpeg") await pipeline.jpeg().toFile(file);
  else await pipeline.webp().toFile(file);
}

async function manifestFacts(file, { role, kind = "photo", sourceHash, mobile } = {}) {
  const metadata = await sharp(file).metadata();
  const facts = {
    role,
    kind,
    width: metadata.width,
    height: metadata.height,
    bytes: fs.statSync(file).size,
    format: metadata.format,
    quality: 84,
    sourceHash: sourceHash ?? sha256(file),
    outputHash: sha256(file)
  };
  if (mobile) {
    const mobileMetadata = await sharp(mobile.file).metadata();
    facts.mobile = {
      src: mobile.url,
      width: mobileMetadata.width,
      height: mobileMetadata.height,
      bytes: fs.statSync(mobile.file).size,
      outputHash: sha256(mobile.file)
    };
  }
  return facts;
}

function writeManifest(project, manifest, source = serializeManifest(manifest)) {
  fs.mkdirSync(path.dirname(project.manifestPath), { recursive: true });
  fs.writeFileSync(project.manifestPath, source);
  fs.writeFileSync(project.runtimePath, serializeRuntimeIndex(buildRuntimeIndex(manifest)));
}

async function validManifestProject({ slug = "verified-article", mobile = true, exactSource = false } = {}) {
  const project = temporaryProject();
  const cover = `/images/articles/${slug}/01-cover.webp`;
  const body = `/images/articles/${slug}/02-evidence.webp`;
  const coverMobile = `/images/articles/${slug}/01-cover-800.webp`;
  const articleFile = path.join(project.contentRoot, "insights", `${slug}.mdx`);
  fs.writeFileSync(articleFile, `---\ntitle: "Verified article"\ncoverImage: "${cover}"\nsocialImage: "${cover}"\n---\n\n![Evidence](${body})\n`);
  await writeImage(publicFile(project, cover), { width: 1600, height: 900 });
  await writeImage(publicFile(project, body), { width: 1200, height: 800, color: "#b35826" });
  if (mobile) await writeImage(publicFile(project, coverMobile), { width: 800, height: 450 });

  let coverSourceHash;
  let exactSourceFile;
  if (exactSource) {
    exactSourceFile = path.join(project.sourceLibraryRoot, slug, "01-cover.png");
    await writeImage(exactSourceFile, { width: 1600, height: 900, format: "png" });
    coverSourceHash = sha256(exactSourceFile);
  }

  const inventory = discoverArticleInventory(project);
  const processedAssets = {
    [cover]: await manifestFacts(publicFile(project, cover), {
      role: "cover",
      sourceHash: coverSourceHash,
      mobile: mobile ? { url: coverMobile, file: publicFile(project, coverMobile) } : undefined
    }),
    [body]: await manifestFacts(publicFile(project, body), { role: "body" })
  };
  const externalSources = exactSource ? {
    [slug]: {
      files: {
        "01-cover.png": { status: "matched", primary: cover, hash: sha256(exactSourceFile) }
      }
    }
  } : undefined;
  const manifest = buildManifest({ inventory, processedAssets, processorVersion: "1", externalSources });
  writeManifest(project, manifest);
  return { ...project, slug, cover, body, coverMobile, articleFile, manifest, exactSourceFile };
}

async function validPngChartSourceProject({ slug = "verified-chart" } = {}) {
  const project = temporaryProject();
  const chart = `/images/articles/${slug}/03-market-chart.png`;
  const articleFile = path.join(project.contentRoot, "insights", `${slug}.mdx`);
  fs.writeFileSync(articleFile, `---\ntitle: "Verified chart"\n---\n\n![Market chart](${chart})\n`);
  await writeImage(publicFile(project, chart), { width: 1200, height: 800, format: "png", color: "#147a8c" });
  const exactSourceFile = path.join(project.sourceLibraryRoot, slug, "03-market-chart.png");
  await writeImage(exactSourceFile, { width: 1200, height: 800, format: "png", color: "#b35826" });

  const inventory = discoverArticleInventory(project);
  const processedAssets = {
    [chart]: await manifestFacts(publicFile(project, chart), {
      role: "chart",
      kind: "graphic",
      sourceHash: sha256(exactSourceFile)
    })
  };
  const manifest = buildManifest({
    inventory,
    processedAssets,
    processorVersion: "1",
    externalSources: {
      [slug]: {
        files: {
          "03-market-chart.png": { status: "matched", primary: chart, hash: sha256(exactSourceFile) }
        }
      }
    }
  });
  writeManifest(project, manifest);
  return { ...project, slug, chart, articleFile, manifest, exactSourceFile };
}

function findingCodes(report) {
  return report.failures.map(({ code }) => code);
}

function treeSnapshot(root) {
  const snapshot = {};
  const walk = (directory) => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else {
        const stat = fs.lstatSync(file);
        snapshot[path.relative(root, file)] = {
          hash: entry.isSymbolicLink() ? `link:${fs.readlinkSync(file)}` : sha256(file),
          mtimeMs: stat.mtimeMs,
          size: stat.size
        };
      }
    }
  };
  walk(root);
  return snapshot;
}

test.after(() => {
  for (const root of temporaryRoots) fs.rmSync(root, { recursive: true, force: true });
});

test("per-file budgets cover all approved roles with exact actual and allowed bytes", () => {
  const article = {
    slug: "role-limits",
    budgetClass: "standard",
    cover: "/images/role-limits/cover.webp",
    body: [
      "/images/role-limits/body.webp",
      "/images/role-limits/chart.png",
      "/images/role-limits/transparent.png"
    ]
  };
  const assets = {
    [article.cover]: { role: "cover", bytes: 300_001, mobile: { src: "/images/role-limits/cover-800.webp", bytes: 120_001 } },
    [article.body[0]]: { role: "body", bytes: 220_001, mobile: { src: "/images/role-limits/body-800.webp", bytes: 100_001 } },
    [article.body[1]]: { role: "chart", bytes: 300_001, mobile: { src: "/images/role-limits/chart-800.webp", bytes: 140_001 } },
    [article.body[2]]: { role: "transparent", bytes: 150_001, mobile: { src: "/images/role-limits/transparent-800.webp", bytes: 150_001 } }
  };

  const result = verifyArticleBudget(article, assets);

  assert.equal(result.failures.filter(({ code }) => code === "FILE_BUDGET_EXCEEDED").length, 8);
  for (const [actual, allowed] of [
    [300_001, 300_000], [120_001, 120_000],
    [220_001, 220_000], [100_001, 100_000],
    [300_001, 300_000], [140_001, 140_000],
    [150_001, 150_000], [150_001, 150_000]
  ]) {
    assert.ok(result.failures.some(({ message }) => message.includes(`actual ${actual} bytes`) && message.includes(`allowed ${allowed} bytes`)));
  }
});

test("article transfer totals count each selected URL once and use primary bytes as the mobile fallback", () => {
  const cover = "/images/unique/cover.webp";
  const body = "/images/unique/body.webp";
  const result = verifyArticleBudget({
    slug: "unique-transfer",
    budgetClass: "standard",
    cover,
    body: [body, body, cover]
  }, {
    [cover]: { role: "cover", bytes: 100, mobile: { src: "/images/unique/cover-800.webp", bytes: 40 } },
    [body]: { role: "body", bytes: 200 }
  });

  assert.deepEqual(
    { desktopBytes: result.desktopBytes, mobileBytes: result.mobileBytes, urls: result.urls },
    { desktopBytes: 300, mobileBytes: 240, urls: [cover, body] }
  );
});

test("deep budget eligibility requires an effective explicit deep class and more than eight body images", () => {
  const body = Array.from({ length: 9 }, (_, index) => `/images/deep/${index + 2}.webp`);
  const assets = Object.fromEntries(body.map((url, index) => [url, {
    role: "body",
    bytes: 200_000,
    mobile: { src: `/images/deep/${index + 2}-800.webp`, bytes: 100_000 }
  }]));

  const eight = verifyArticleBudget({ slug: "only-eight", budgetClass: "deep", imageBudget: "deep", body: body.slice(0, 8) }, assets);
  const unapproved = verifyArticleBudget({ slug: "unapproved-deep", budgetClass: "deep", body }, assets);
  const implicit = verifyArticleBudget({ slug: "implicit-standard", budgetClass: "standard", body }, assets);
  const eligible = verifyArticleBudget({ slug: "eligible-deep", budgetClass: "deep", imageBudget: "deep", body }, assets);

  assert.ok(findingCodes(eight).includes("DEEP_BUDGET_NOT_ELIGIBLE"));
  assert.ok(findingCodes(unapproved).includes("DEEP_BUDGET_NOT_ELIGIBLE"));
  assert.ok(findingCodes(implicit).includes("ARTICLE_BUDGET_EXCEEDED"));
  assert.equal(findingCodes(eligible).includes("DEEP_BUDGET_NOT_ELIGIBLE"), false);
  assert.equal(findingCodes(eligible).includes("ARTICLE_BUDGET_EXCEEDED"), false);
  assert.match(implicit.failures.find(({ code }) => code === "ARTICLE_BUDGET_EXCEEDED").message, /actual 1800000 bytes.*allowed 1500000 bytes/);
});

test("visual_archive alone accepts a 1559000-byte mobile transfer and requires complete current classifications", () => {
  const slug = "hundred-years-of-cleaning-appliance-history";
  const body = Array.from({ length: 51 }, (_, index) => `/images/archive/${index + 1}.jpg`);
  const assets = Object.fromEntries(body.map((url, index) => [url, {
    role: "body",
    bytes: 30_000,
    outputHash: `sha256:${String(index + 1).padStart(64, "0")}`,
    mobile: { src: `/images/archive/${index + 1}-800.webp`, bytes: index === 50 ? 59_000 : 30_000 }
  }]));
  const classifications = Object.fromEntries(body.map((url) => [url, {
    kind: "photo",
    outputHash: assets[url].outputHash
  }]));
  const article = { slug, budgetClass: "visual_archive", imageBudget: "visual_archive", body };

  const archive = verifyArticleBudget(article, assets, { historicalKindClassifications: classifications });
  const deep = verifyArticleBudget({ ...article, budgetClass: "deep", imageBudget: "deep" }, assets, { historicalKindClassifications: classifications });
  const standard = verifyArticleBudget({ ...article, budgetClass: "standard", imageBudget: "standard" }, assets, { historicalKindClassifications: classifications });

  assert.equal(archive.mobileBytes, 1_559_000);
  assert.equal(findingCodes(archive).includes("ARTICLE_BUDGET_EXCEEDED"), false);
  assert.ok(findingCodes(deep).includes("ARTICLE_BUDGET_EXCEEDED"));
  assert.ok(findingCodes(standard).includes("ARTICLE_BUDGET_EXCEEDED"));

  classifications[body[0]].outputHash = `sha256:${"f".repeat(64)}`;
  const stale = verifyArticleBudget(article, assets, { historicalKindClassifications: classifications });
  assert.ok(findingCodes(stale).includes("VISUAL_ARCHIVE_CLASSIFICATION_STALE"));
});

test("aggregate verification blocks an explicit deep declaration with eight or fewer body images", async () => {
  const project = await validManifestProject({ mobile: false });
  const source = fs.readFileSync(project.articleFile, "utf8")
    .replace('title: "Verified article"', 'title: "Verified article"\nimage_budget: deep');
  fs.writeFileSync(project.articleFile, source);

  const result = await verifyArticleImages(project);
  const deepFinding = result.failures.find(({ code }) => code === "DEEP_BUDGET_NOT_ELIGIBLE");

  assert.ok(deepFinding);
  assert.equal(deepFinding.slug, project.slug);
  assert.match(deepFinding.message, /actual image_budget deep with 1 body images.*minimum 9 body images/);
});

test("source verification loads the tracked hash-bound classifications for visual_archive inventory", async () => {
  const project = temporaryProject();
  const slug = "hundred-years-of-cleaning-appliance-history";
  const body = Array.from({ length: 51 }, (_, index) => `/images/insights/${slug}-image-${String(index + 1).padStart(3, "0")}.jpg`);
  for (const url of body) {
    const file = publicFile(project, url);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, "archive fixture");
  }
  fs.writeFileSync(
    path.join(project.contentRoot, "insights", `${slug}.mdx`),
    `---\ntitle: "Archive"\nimage_budget: visual_archive\n---\n\n${body.map((url) => `![archive](${url})`).join("\n")}\n`
  );
  const outputHash = sha256(publicFile(project, body[0]));
  const classificationPath = path.join(project.projectRoot, "scripts", "article-images", "historical-kind-classifications.json");
  fs.mkdirSync(path.dirname(classificationPath), { recursive: true });
  fs.writeFileSync(classificationPath, `${JSON.stringify({
    version: 1,
    assets: Object.fromEntries(body.map((url) => [url, { kind: "graphic", outputHash }]))
  }, null, 2)}\n`);
  writeManifest(project, { version: 1, processorVersion: "1", assets: {}, articles: {} });

  const result = await verifyManifestFiles(project);

  assert.ok(result.inventory, result.failures.map(({ message }) => message).join("\n"));
  assert.equal(result.inventory.articles[slug].budgetClass, "visual_archive");
  assert.equal(findingCodes(result).includes("INVENTORY_DISCOVERY_FAILED"), false);
});

test("manifest verification accepts exact real facts and checks a present external source without requiring it in CI", async () => {
  const project = await validManifestProject({ exactSource: true });
  const present = await verifyManifestFiles(project);
  assert.deepEqual(present.failures, []);

  const withoutExternalLibrary = await verifyManifestFiles({
    ...project,
    sourceLibraryRoot: path.join(project.projectRoot, "intentionally-absent-in-ci")
  });
  assert.deepEqual(withoutExternalLibrary.failures, []);
  assert.ok(withoutExternalLibrary.warnings.some(({ code }) => code === "EXTERNAL_SOURCE_UNAVAILABLE"));

  await writeImage(project.exactSourceFile, { width: 1600, height: 900, format: "png", color: "#111111" });
  const changedSource = await verifyManifestFiles(project);
  assert.ok(findingCodes(changedSource).includes("SOURCE_HASH_MISMATCH"));
});

test("manifest verification blocks runtime-index drift and enforces its committed size budget", async () => {
  const project = await validManifestProject();
  const valid = await verifyManifestFiles(project);
  assert.deepEqual(valid.failures, []);
  assert.ok(fs.statSync(project.runtimePath).size <= ARTICLE_IMAGE_RUNTIME_LIMIT_BYTES);

  const runtime = JSON.parse(fs.readFileSync(project.runtimePath, "utf8"));
  runtime.assets[project.cover].width += 1;
  fs.writeFileSync(project.runtimePath, `${JSON.stringify(runtime)}\n`);
  const drifted = await verifyManifestFiles(project);

  assert.ok(findingCodes(drifted).includes("RUNTIME_INDEX_DRIFT"));
});

test("manifest verification checks an exact PNG chart source independent of publish extension", async () => {
  const project = await validPngChartSourceProject();
  const before = await verifyManifestFiles(project);
  assert.deepEqual(before.failures, []);

  await writeImage(project.exactSourceFile, { width: 1200, height: 800, format: "png", color: "#111111" });
  const changed = await verifyManifestFiles(project);

  assert.ok(findingCodes(changed).includes("SOURCE_HASH_MISMATCH"));
});

test("external source audit hashes matched and disposition records and blocks unbound folder files", async () => {
  const project = await validManifestProject({ slug: "external-audit", exactSource: true });
  const folder = path.dirname(project.exactSourceFile);
  const dispositionFile = path.join(folder, "02-conflicting-catalog.png");
  await writeImage(dispositionFile, { width: 900, height: 600, format: "png", color: "#c75b34" });
  project.manifest.externalSources = {
    [project.slug]: {
      files: {
        "01-cover.png": {
          status: "matched",
          primary: project.cover,
          hash: sha256(project.exactSourceFile)
        },
        "02-conflicting-catalog.png": {
          status: "disposition",
          code: "EXTERNAL_SOURCE_CONTENT_CONFLICT",
          primary: project.body,
          hash: sha256(dispositionFile)
        }
      }
    }
  };
  writeManifest(project, project.manifest);

  const valid = await verifyManifestFiles(project);
  assert.deepEqual(valid.failures, []);
  assert.deepEqual(valid.externalSources, { folders: 1, checked: 2, matched: 1, dispositions: 1 });

  fs.appendFileSync(dispositionFile, "changed");
  const changed = await verifyManifestFiles(project);
  assert.ok(findingCodes(changed).includes("EXTERNAL_SOURCE_HASH_MISMATCH"));

  project.manifest.externalSources[project.slug].files["02-conflicting-catalog.png"].hash = sha256(dispositionFile);
  writeManifest(project, project.manifest);
  await writeImage(path.join(folder, "03-unbound.png"), { width: 800, height: 500, format: "png" });
  const unbound = await verifyManifestFiles(project);
  assert.ok(findingCodes(unbound).includes("EXTERNAL_SOURCE_UNBOUND"));
});

test("external source audit rejects cross-article primaries and noncanonical status/code combinations", async (t) => {
  await t.test("cross-article primary", async () => {
    const project = await validManifestProject({ slug: "external-owner-a", exactSource: true });
    const otherSlug = "external-owner-b";
    const otherCover = `/images/articles/${otherSlug}/01-cover.webp`;
    const otherArticle = path.join(project.contentRoot, "insights", `${otherSlug}.mdx`);
    fs.writeFileSync(otherArticle, `---\ntitle: "Other owner"\ncoverImage: "${otherCover}"\n---\n`);
    await writeImage(publicFile(project, otherCover), { width: 1600, height: 900, color: "#713f91" });
    project.manifest.assets[otherCover] = await manifestFacts(publicFile(project, otherCover), { role: "cover" });
    project.manifest.articles[otherSlug] = { budgetClass: "standard", cover: otherCover, body: [] };
    project.manifest.externalSources[project.slug].files["01-cover.png"].primary = otherCover;
    writeManifest(project, project.manifest);

    const result = await verifyManifestFiles(project);
    assert.ok(findingCodes(result).includes("EXTERNAL_SOURCE_PRIMARY_INVALID"));
  });

  for (const scenario of [
    { name: "unknown code", status: "disposition", code: "UNREVIEWED_DISPOSITION" },
    { name: "matched fallback code", status: "matched", code: "EXTERNAL_SOURCE_CONFLICT_FALLBACK" },
    { name: "disposition without code", status: "disposition", code: undefined }
  ]) {
    await t.test(scenario.name, async () => {
      const project = await validManifestProject({ slug: `external-schema-${scenario.name.replaceAll(" ", "-")}`, exactSource: true });
      const record = project.manifest.externalSources[project.slug].files["01-cover.png"];
      record.status = scenario.status;
      if (scenario.code === undefined) delete record.code;
      else record.code = scenario.code;
      writeManifest(project, project.manifest);

      const result = await verifyManifestFiles(project);
      assert.ok(findingCodes(result).includes("EXTERNAL_SOURCE_AUDIT_INVALID"));
    });
  }
});

test("manifest verification rejects ambiguous exact external source matches", async () => {
  const project = await validPngChartSourceProject({ slug: "ambiguous-chart" });
  const duplicate = path.join(project.sourceLibraryRoot, project.slug, "03-Market Chart.jpg");
  await writeImage(duplicate, { width: 1200, height: 800, format: "jpeg", color: "#147a8c" });

  const result = await verifyManifestFiles(project);
  const ambiguity = result.failures.find(({ code }) => code === "AMBIGUOUS_EXTERNAL_SOURCE");

  assert.ok(ambiguity);
  assert.match(ambiguity.message, /03-Market Chart\.jpg.*03-market-chart\.png|03-market-chart\.png.*03-Market Chart\.jpg/);
});

test("manifest verification reports stale facts, output drift, inventory drift, missing mobile files, and nondeterministic serialization", async (t) => {
  const cases = [
    {
      name: "stale bytes",
      code: "STALE_BYTES",
      mutate(project, manifest) { manifest.assets[project.body].bytes += 1; }
    },
    {
      name: "stale dimensions",
      code: "STALE_DIMENSIONS",
      mutate(project, manifest) { manifest.assets[project.body].width += 1; }
    },
    {
      name: "stale format",
      code: "STALE_FORMAT",
      mutate(project, manifest) { manifest.assets[project.body].format = "jpeg"; }
    },
    {
      name: "changed output content",
      code: "OUTPUT_HASH_MISMATCH",
      mutate(project, manifest) {
        fs.appendFileSync(publicFile(project, project.body), "changed-output");
        manifest.assets[project.body].bytes = fs.statSync(publicFile(project, project.body)).size;
      }
    },
    {
      name: "orphaned manifest asset",
      code: "ORPHANED_MANIFEST_ASSET",
      mutate(project, manifest) {
        manifest.assets["/images/articles/orphan/99-orphan.webp"] = { ...manifest.assets[project.body] };
      }
    },
    {
      name: "referenced but unregistered local image",
      code: "UNREGISTERED_REFERENCED_ASSET",
      mutate(project, manifest) { delete manifest.assets[project.body]; }
    },
    {
      name: "wrong inventory role",
      code: "ROLE_MISMATCH",
      mutate(project, manifest) { manifest.assets[project.cover].role = "body"; }
    },
    {
      name: "missing mobile file",
      code: "MISSING_MOBILE_FILE",
      mutate(project) { fs.unlinkSync(publicFile(project, project.coverMobile)); }
    },
    {
      name: "nondeterministic manifest serialization",
      code: "NONDETERMINISTIC_MANIFEST",
      mutate(project, manifest) { project.customSource = JSON.stringify(manifest); }
    }
  ];

  for (const scenario of cases) {
    await t.test(scenario.name, async () => {
      const project = await validManifestProject();
      const manifest = structuredClone(project.manifest);
      scenario.mutate(project, manifest);
      writeManifest(project, manifest, project.customSource);

      const result = await verifyManifestFiles(project);

      assert.ok(findingCodes(result).includes(scenario.code), result.failures.map(({ message }) => message).join("\n"));
    });
  }
});

test("repository growth scans exactly the three guarded roots, reports exact totals and ten largest changed files", () => {
  const project = temporaryProject("wcb-article-repository-budget-");
  const guarded = ["articles", "blog", "insights"];
  for (const name of guarded) fs.mkdirSync(path.join(project.publicRoot, "images", name), { recursive: true });
  const changedFiles = [];
  for (let index = 0; index < 12; index += 1) {
    const relative = `public/images/articles/${String(index).padStart(2, "0")}.bin`;
    const file = path.join(project.projectRoot, relative);
    fs.writeFileSync(file, "");
    fs.truncateSync(file, index + 1);
    changedFiles.push(relative);
  }
  const outsideGuard = path.join(project.publicRoot, "images", "equipment", "ignored.bin");
  fs.mkdirSync(path.dirname(outsideGuard), { recursive: true });
  fs.writeFileSync(outsideGuard, "");
  fs.truncateSync(outsideGuard, ARTICLE_IMAGE_LIMIT_BYTES);

  const within = verifyRepositoryBudget({ ...project, changedFiles });
  assert.equal(within.currentBytes, 78);
  assert.equal(within.topChanged.length, 10);
  assert.deepEqual(within.topChanged.map(({ bytes }) => bytes), [12, 11, 10, 9, 8, 7, 6, 5, 4, 3]);

  const oversized = path.join(project.publicRoot, "images", "blog", "oversized.bin");
  fs.writeFileSync(oversized, "");
  fs.truncateSync(oversized, ARTICLE_IMAGE_LIMIT_BYTES);
  const exceeded = verifyRepositoryBudget({ ...project, changedFiles: [...changedFiles, "public/images/blog/oversized.bin"] });
  const finding = exceeded.failures.find(({ code }) => code === "REPOSITORY_BUDGET_EXCEEDED");
  assert.ok(finding);
  assert.match(finding.message, new RegExp(`current ${ARTICLE_IMAGE_LIMIT_BYTES + 78} bytes`));
  assert.match(finding.message, /baseline 292654871 bytes.*allowed growth 29265487 bytes.*limit 321920358 bytes/);
});

test("repository growth rejects symlinks instead of following them outside public", () => {
  const project = temporaryProject("wcb-article-repository-link-");
  for (const name of ["articles", "blog", "insights"]) fs.mkdirSync(path.join(project.publicRoot, "images", name), { recursive: true });
  const outside = path.join(project.projectRoot, "outside.bin");
  fs.writeFileSync(outside, "outside");
  fs.symlinkSync(outside, path.join(project.publicRoot, "images", "articles", "escape.bin"));

  const result = verifyRepositoryBudget(project);

  assert.ok(findingCodes(result).includes("REPOSITORY_SYMLINK"));
});

test("repository growth rejects an empty guarded root that is itself a symlink", () => {
  const project = temporaryProject("wcb-article-repository-root-link-");
  const outside = path.join(project.projectRoot, "outside-empty");
  fs.mkdirSync(outside);
  fs.mkdirSync(path.join(project.publicRoot, "images"), { recursive: true });
  fs.symlinkSync(outside, path.join(project.publicRoot, "images", "articles"));
  for (const name of ["blog", "insights"]) fs.mkdirSync(path.join(project.publicRoot, "images", name));

  const result = verifyRepositoryBudget(project);

  assert.ok(findingCodes(result).includes("REPOSITORY_SYMLINK"));
});

function attribute(name, value) {
  return `${name}="${value}"`;
}

function builtHtml(project, overrides = {}) {
  const cover = project.manifest.assets[project.cover];
  const body = project.manifest.assets[project.body];
  const canonical = overrides.canonical ?? `https://worldcleanbiz.com/blog/${project.slug}`;
  const ogImage = overrides.ogImage ?? `https://worldcleanbiz.com${project.cover}`;
  const coverAttributes = overrides.coverAttributes ?? [
    attribute("src", project.cover),
    cover.mobile ? attribute("srcset", `${cover.mobile.src} ${cover.mobile.width}w, ${project.cover} ${cover.width}w`) : null,
    attribute("sizes", "(max-width: 800px) 100vw, 1200px"),
    attribute("width", cover.width), attribute("height", cover.height),
    attribute("loading", "eager"), attribute("decoding", "async"), attribute("fetchpriority", "high")
  ].filter(Boolean).join(" ");
  const bodyAttributes = overrides.bodyAttributes ?? [
    attribute("src", project.body), attribute("sizes", "(max-width: 800px) calc(100vw - 32px), 900px"),
    attribute("width", body.width), attribute("height", body.height), attribute("loading", "lazy"), attribute("decoding", "async")
  ].join(" ");
  return `<!doctype html><html><head><link rel="canonical" href="${canonical}"/><meta property="og:image" content="${ogImage}"/></head><body><header><img src="/logo.svg" fetchpriority="high"/></header><article class="article-prose blog-article-main"><figure class="blog-article-cover"><img ${coverAttributes}/></figure><div><figure class="article-inline-image"><img ${bodyAttributes}/></figure>${overrides.extraContent ?? ""}</div><footer><img src="/author.webp" loading="lazy"/></footer></article></body></html>`;
}

function writeBuiltArticle(project, html) {
  const file = path.join(project.projectRoot, ".next", "server", "app", "blog", `${project.slug}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  return file;
}

test("built HTML verification accepts the real Next 15 layout and scopes priority to article content", async () => {
  const project = await validManifestProject();
  fs.writeFileSync(path.join(project.publicRoot, "logo.svg"), "<svg/>");
  fs.writeFileSync(path.join(project.publicRoot, "author.webp"), "author");
  writeBuiltArticle(project, builtHtml(project));

  const result = await verifyBuiltArticleImages(project);

  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.summary, { articles: 1, articleImages: 2, responsiveImages: 1 });
});

test("built HTML verification enforces exact article image loading attributes and forbids fallback srcset", async (t) => {
  const cases = [
    {
      name: "cover sizes drift",
      code: "BUILT_SIZES_MISMATCH",
      async project() { return validManifestProject(); },
      override(project) {
        const cover = project.manifest.assets[project.cover];
        return { coverAttributes: `${attribute("src", project.cover)} ${attribute("srcset", `${cover.mobile.src} ${cover.mobile.width}w, ${project.cover} ${cover.width}w`)} ${attribute("sizes", "100vw")} ${attribute("width", cover.width)} ${attribute("height", cover.height)} ${attribute("loading", "eager")} ${attribute("decoding", "async")} ${attribute("fetchpriority", "high")}` };
      }
    },
    {
      name: "body sizes drift",
      code: "BUILT_SIZES_MISMATCH",
      async project() { return validManifestProject(); },
      override(project) {
        const body = project.manifest.assets[project.body];
        return { bodyAttributes: `${attribute("src", project.body)} ${attribute("sizes", "900px")} ${attribute("width", body.width)} ${attribute("height", body.height)} ${attribute("loading", "lazy")} ${attribute("decoding", "async")}` };
      }
    },
    {
      name: "decoding drift",
      code: "BUILT_DECODING_MISMATCH",
      async project() { return validManifestProject(); },
      override(project) {
        const body = project.manifest.assets[project.body];
        return { bodyAttributes: `${attribute("src", project.body)} ${attribute("sizes", "(max-width: 800px) calc(100vw - 32px), 900px")} ${attribute("width", body.width)} ${attribute("height", body.height)} ${attribute("loading", "lazy")}` };
      }
    },
    {
      name: "cover fetch priority drift",
      code: "BUILT_COVER_PRIORITY_MISMATCH",
      async project() { return validManifestProject(); },
      override(project) {
        const cover = project.manifest.assets[project.cover];
        return { coverAttributes: `${attribute("src", project.cover)} ${attribute("srcset", `${cover.mobile.src} ${cover.mobile.width}w, ${project.cover} ${cover.width}w`)} ${attribute("sizes", "(max-width: 800px) 100vw, 1200px")} ${attribute("width", cover.width)} ${attribute("height", cover.height)} ${attribute("loading", "eager")} ${attribute("decoding", "async")}` };
      }
    },
    {
      name: "fallback srcset without mobile",
      code: "BUILT_UNEXPECTED_SRCSET",
      async project() { return validManifestProject({ mobile: false }); },
      override(project) {
        const cover = project.manifest.assets[project.cover];
        return { coverAttributes: `${attribute("src", project.cover)} ${attribute("srcset", `${project.cover} ${cover.width}w`)} ${attribute("sizes", "(max-width: 800px) 100vw, 1200px")} ${attribute("width", cover.width)} ${attribute("height", cover.height)} ${attribute("loading", "eager")} ${attribute("decoding", "async")} ${attribute("fetchpriority", "high")}` };
      }
    },
    {
      name: "present but empty srcset without mobile",
      code: "BUILT_UNEXPECTED_SRCSET",
      async project() { return validManifestProject({ mobile: false }); },
      override(project) {
        const cover = project.manifest.assets[project.cover];
        return { coverAttributes: `${attribute("src", project.cover)} ${attribute("srcset", "")} ${attribute("sizes", "(max-width: 800px) 100vw, 1200px")} ${attribute("width", cover.width)} ${attribute("height", cover.height)} ${attribute("loading", "eager")} ${attribute("decoding", "async")} ${attribute("fetchpriority", "high")}` };
      }
    },
    {
      name: "density descriptor srcset",
      code: "BUILT_SRCSET_INVALID",
      async project() { return validManifestProject(); },
      override(project) {
        const cover = project.manifest.assets[project.cover];
        return { coverAttributes: `${attribute("src", project.cover)} ${attribute("srcset", `${cover.mobile.src} 1x, ${project.cover} 2x`)} ${attribute("sizes", "(max-width: 800px) 100vw, 1200px")} ${attribute("width", cover.width)} ${attribute("height", cover.height)} ${attribute("loading", "eager")} ${attribute("decoding", "async")} ${attribute("fetchpriority", "high")}` };
      }
    },
    {
      name: "malformed srcset candidate",
      code: "BUILT_SRCSET_INVALID",
      async project() { return validManifestProject(); },
      override(project) {
        const cover = project.manifest.assets[project.cover];
        return { coverAttributes: `${attribute("src", project.cover)} ${attribute("srcset", `${cover.mobile.src} ${cover.mobile.width}w, malformed candidate descriptor`)} ${attribute("sizes", "(max-width: 800px) 100vw, 1200px")} ${attribute("width", cover.width)} ${attribute("height", cover.height)} ${attribute("loading", "eager")} ${attribute("decoding", "async")} ${attribute("fetchpriority", "high")}` };
      }
    }
  ];

  for (const scenario of cases) {
    await t.test(scenario.name, async () => {
      const project = await scenario.project();
      writeBuiltArticle(project, builtHtml(project, scenario.override(project)));
      const result = await verifyBuiltArticleImages(project);
      assert.ok(findingCodes(result).includes(scenario.code), result.failures.map(({ message }) => message).join("\n"));
    });
  }
});

test("built HTML verification blocks a rendered local article image absent from the manifest", async () => {
  const project = await validManifestProject();
  const unregistered = `/images/articles/${project.slug}/99-unregistered.webp`;
  await writeImage(publicFile(project, unregistered), { width: 900, height: 600 });
  writeBuiltArticle(project, builtHtml(project, {
    extraContent: `<figure class="article-inline-image"><img src="${unregistered}" width="900" height="600" sizes="900px" loading="lazy"/></figure>`
  }));

  const result = await verifyBuiltArticleImages(project);
  const finding = result.failures.find(({ code }) => code === "BUILT_UNREGISTERED_LOCAL_IMAGE");

  assert.ok(finding);
  assert.equal(finding.url, unregistered);
});

test("built HTML verification checks dimensions and sizes before rejecting an unregistered local image", async () => {
  const project = await validManifestProject();
  const unregistered = `/images/articles/${project.slug}/99-unregistered.webp`;
  await writeImage(publicFile(project, unregistered), { width: 900, height: 600 });
  writeBuiltArticle(project, builtHtml(project, {
    extraContent: `<figure class="article-inline-image"><img src="${unregistered}" loading="lazy"/></figure>`
  }));

  const result = await verifyBuiltArticleImages(project);

  assert.ok(findingCodes(result).includes("BUILT_UNREGISTERED_LOCAL_IMAGE"));
  assert.ok(findingCodes(result).includes("BUILT_DIMENSIONS_MISSING"));
  assert.ok(findingCodes(result).includes("BUILT_SIZES_MISSING"));
});

test("built HTML verification reports dimensions, priority, laziness, responsive candidates, canonical, and primary social drift", async (t) => {
  const cases = [
    {
      name: "missing intrinsic dimensions",
      code: "BUILT_DIMENSIONS_MISSING",
      override(project) {
        const body = project.manifest.assets[project.body];
        return { bodyAttributes: `${attribute("src", project.body)} ${attribute("sizes", "900px")} ${attribute("width", body.width)} ${attribute("loading", "lazy")}` };
      }
    },
    {
      name: "more than one prioritized content image",
      code: "BUILT_PRIORITY_COUNT",
      override(project) {
        const body = project.manifest.assets[project.body];
        return { bodyAttributes: `${attribute("src", project.body)} ${attribute("sizes", "900px")} ${attribute("width", body.width)} ${attribute("height", body.height)} ${attribute("loading", "eager")}` };
      }
    },
    {
      name: "non-cover image is not lazy",
      code: "BUILT_IMAGE_NOT_LAZY",
      override(project) {
        const body = project.manifest.assets[project.body];
        return { bodyAttributes: `${attribute("src", project.body)} ${attribute("sizes", "900px")} ${attribute("width", body.width)} ${attribute("height", body.height)}` };
      }
    },
    {
      name: "missing responsive source set",
      code: "BUILT_SRCSET_MISMATCH",
      override(project) {
        const cover = project.manifest.assets[project.cover];
        return { coverAttributes: `${attribute("src", project.cover)} ${attribute("sizes", "1200px")} ${attribute("width", cover.width)} ${attribute("height", cover.height)} ${attribute("loading", "eager")} ${attribute("fetchpriority", "high")}` };
      }
    },
    {
      name: "unresolvable responsive candidate",
      code: "BUILT_CANDIDATE_MISSING",
      override(project) {
        const cover = project.manifest.assets[project.cover];
        return { coverAttributes: `${attribute("src", project.cover)} ${attribute("srcset", `/images/missing.webp 800w, ${project.cover} ${cover.width}w`)} ${attribute("sizes", "1200px")} ${attribute("width", cover.width)} ${attribute("height", cover.height)} ${attribute("loading", "eager")} ${attribute("fetchpriority", "high")}` };
      }
    },
    {
      name: "canonical route drift",
      code: "BUILT_CANONICAL_MISMATCH",
      override() { return { canonical: "https://worldcleanbiz.com/blog/wrong" }; }
    },
    {
      name: "mobile OpenGraph drift",
      code: "BUILT_OG_IMAGE_MISMATCH",
      override(project) { return { ogImage: `https://worldcleanbiz.com${project.coverMobile}` }; }
    }
  ];

  for (const scenario of cases) {
    await t.test(scenario.name, async () => {
      const project = await validManifestProject();
      writeBuiltArticle(project, builtHtml(project, scenario.override(project)));
      const result = await verifyBuiltArticleImages(project);
      assert.ok(findingCodes(result).includes(scenario.code), result.failures.map(({ message }) => message).join("\n"));
    });
  }
});

test("both verification CLIs are read-only and return nonzero with stable actionable findings", async () => {
  const sourceProject = await validManifestProject();
  sourceProject.manifest.assets[sourceProject.body].bytes += 1;
  writeManifest(sourceProject, sourceProject.manifest);
  writeBuiltArticle(sourceProject, builtHtml(sourceProject, { canonical: "https://worldcleanbiz.com/blog/wrong" }));
  const before = treeSnapshot(sourceProject.projectRoot);

  const sourceResult = spawnSync(process.execPath, [
    path.join(process.cwd(), "scripts", "verify-article-images.mjs"),
    "--project-root", sourceProject.projectRoot,
    "--source-library-root", sourceProject.sourceLibraryRoot
  ], { cwd: process.cwd(), encoding: "utf8" });
  const builtResult = spawnSync(process.execPath, [
    path.join(process.cwd(), "scripts", "verify-built-article-images.mjs"),
    "--project-root", sourceProject.projectRoot
  ], { cwd: process.cwd(), encoding: "utf8" });

  assert.equal(sourceResult.status, 1);
  assert.match(sourceResult.stderr, /\[STALE_BYTES\].*actual \d+ bytes.*allowed \d+ bytes/i);
  assert.equal(builtResult.status, 1);
  assert.match(builtResult.stderr, /\[BUILT_CANONICAL_MISMATCH\].*verified-article/i);
  assert.deepEqual(treeSnapshot(sourceProject.projectRoot), before);
});

test("the aggregate source verifier sorts blocking findings by slug then URL", async () => {
  const project = await validManifestProject({ slug: "zeta-article" });
  const alpha = await validManifestProject({ slug: "alpha-article", mobile: false });
  fs.copyFileSync(alpha.articleFile, path.join(project.contentRoot, "insights", "alpha-article.mdx"));
  for (const url of [alpha.cover, alpha.body]) {
    const destination = publicFile(project, url);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(publicFile(alpha, url), destination);
    project.manifest.assets[url] = alpha.manifest.assets[url];
  }
  project.manifest.articles["alpha-article"] = alpha.manifest.articles["alpha-article"];
  project.manifest.assets[project.body].bytes += 1;
  project.manifest.assets[alpha.cover].bytes += 1;
  writeManifest(project, project.manifest);

  const result = await verifyArticleImages(project);
  const stale = result.failures.filter(({ code }) => code === "STALE_BYTES");

  assert.deepEqual(stale.map(({ slug }) => slug), ["alpha-article", "zeta-article"]);
});
