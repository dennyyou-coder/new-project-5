import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  ARTICLE_BUDGETS,
  ARTICLE_IMAGE_BASELINE_BYTES,
  ARTICLE_IMAGE_LIMIT_BYTES,
  IMAGE_BUDGETS,
  MOBILE_MIN_SAVINGS_BYTES,
  MOBILE_MIN_SAVINGS_RATIO
} from "../scripts/article-images/config.mjs";
import {
  buildManifest,
  buildRuntimeIndex,
  serializeManifest,
  serializeRuntimeIndex
} from "../scripts/article-images/manifest.mjs";
import { discoverArticleInventory } from "../scripts/article-images/references.mjs";

const fixtureRoot = path.join(process.cwd(), "tests", "fixtures", "article-images");
const fixtureContentRoot = path.join(fixtureRoot, "content");
const fixturePublicRoot = path.join(fixtureRoot, "public");

test("keeps article image preparation outside the mandatory read-only build gates", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
  const scripts = packageJson.scripts ?? {};

  assert.equal(scripts["prepare:article-images"], "node scripts/prepare-article-images.mjs");
  assert.equal(
    scripts.prebuild,
    "npm run verify:content-classification && npm run verify:article-images",
    "prebuild must compose the existing content gate with one read-only source/manifest image gate"
  );
  assert.equal(scripts.build, "next build");
  assert.equal(
    scripts.postbuild,
    "npm run verify:built-article-images",
    "postbuild must verify generated article HTML exactly once"
  );

  for (const lifecycle of ["prebuild", "build", "postbuild"]) {
    assert.doesNotMatch(scripts[lifecycle] ?? "", /prepare:article-images/);
  }
  assert.equal((scripts.prebuild.match(/verify:article-images/g) ?? []).length, 1);
  assert.equal((scripts.postbuild.match(/verify:built-article-images/g) ?? []).length, 1);
});

function makeFixtureProject() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wcb-article-image-pipeline-"));
  const contentRoot = path.join(root, "content");
  const publicRoot = path.join(root, "public");
  return { root, contentRoot, publicRoot };
}

function writeArticle({ contentRoot, slug, frontmatter = "", body = "" }) {
  const file = path.join(contentRoot, "blog", `${slug}.mdx`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `---\n${frontmatter}---\n\n${body}\n`);
  return file;
}

function writePublicImage({ publicRoot, url }) {
  const file = path.join(publicRoot, url.slice(1));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, "fixture");
}

function hashBoundClassifications(project, urls, kind = "photo") {
  return Object.fromEntries(urls.map((url) => [url, {
    kind,
    outputHash: `sha256:${crypto.createHash("sha256").update(fs.readFileSync(path.join(project.publicRoot, url.slice(1)))).digest("hex")}`
  }]));
}

test("exports the approved decimal-byte image and article budgets", () => {
  assert.deepEqual(IMAGE_BUDGETS, {
    cover: { desktop: 300_000, mobile: 120_000 },
    body: { desktop: 220_000, mobile: 100_000 },
    chart: { desktop: 300_000, mobile: 140_000 },
    transparent: 150_000
  });
  assert.deepEqual(ARTICLE_BUDGETS, {
    standard: { desktop: 1_500_000, mobile: 750_000 },
    deep: { desktop: 2_500_000, mobile: 1_200_000 },
    visual_archive: { desktop: 2_500_000, mobile: 1_600_000 }
  });
  assert.equal(ARTICLE_IMAGE_BASELINE_BYTES, 292_654_871);
  assert.equal(ARTICLE_IMAGE_LIMIT_BYTES, 321_920_358);
  assert.equal(MOBILE_MIN_SAVINGS_BYTES, 20_000);
  assert.equal(MOBILE_MIN_SAVINGS_RATIO, 0.25);
});

test("discovers and normalizes local article image references while retaining body order", () => {
  const inventory = discoverArticleInventory({
    contentRoot: fixtureContentRoot,
    publicRoot: fixturePublicRoot
  });

  assert.deepEqual(Object.keys(inventory.assets), [
    "/images/articles/pipeline-example/01-cover.webp",
    "/images/articles/pipeline-example/02-product.webp"
  ]);
  assert.deepEqual(inventory.articles["pipeline-example"], {
    slug: "pipeline-example",
    file: path.join(fixtureContentRoot, "blog", "pipeline-example.mdx"),
    budgetClass: "standard",
    cover: "/images/articles/pipeline-example/01-cover.webp",
    social: "/images/articles/pipeline-example/01-cover.webp",
    body: ["/images/articles/pipeline-example/02-product.webp"]
  });
  assert.equal(
    inventory.assets["/images/articles/pipeline-example/01-cover.webp"].file,
    path.join(fixturePublicRoot, "images", "articles", "pipeline-example", "01-cover.webp")
  );
});

test("treats one leading body reference to the cover as the conventional cover duplicate", () => {
  const project = makeFixtureProject();
  const cover = "/images/articles/leading-cover-duplicate/01-cover.webp";
  const bodyImage = "/images/articles/leading-cover-duplicate/02-product.webp";
  writePublicImage({ publicRoot: project.publicRoot, url: cover });
  writePublicImage({ publicRoot: project.publicRoot, url: bodyImage });
  writeArticle({
    contentRoot: project.contentRoot,
    slug: "leading-cover-duplicate",
    frontmatter: `coverImage: ${cover}\n`,
    body: `![cover](${cover})\n\n![product](${bodyImage})`
  });

  const inventory = discoverArticleInventory(project);

  assert.deepEqual(inventory.articles["leading-cover-duplicate"].body, [bodyImage]);
  assert.deepEqual(Object.keys(inventory.assets), [cover, bodyImage]);
});

test("rejects a cover reference that occurs again after the conventional leading duplicate", () => {
  const project = makeFixtureProject();
  const cover = "/images/articles/repeated-cover-conflict/01-cover.webp";
  const bodyImage = "/images/articles/repeated-cover-conflict/02-product.webp";
  writePublicImage({ publicRoot: project.publicRoot, url: cover });
  writePublicImage({ publicRoot: project.publicRoot, url: bodyImage });
  writeArticle({
    contentRoot: project.contentRoot,
    slug: "repeated-cover-conflict",
    frontmatter: `coverImage: ${cover}\n`,
    body: `![cover](${cover})\n\n![product](${bodyImage})\n\n![cover again](${cover})`
  });

  assert.throws(
    () => discoverArticleInventory(project),
    /repeated-cover-conflict.*repeated-cover-conflict\.mdx.*conflicting roles/i
  );
});

test("rejects a cover reference preceded by an external body image", () => {
  const project = makeFixtureProject();
  const cover = "/images/articles/external-before-cover/01-cover.webp";
  writePublicImage({ publicRoot: project.publicRoot, url: cover });
  writeArticle({
    contentRoot: project.contentRoot,
    slug: "external-before-cover",
    frontmatter: `coverImage: ${cover}\n`,
    body: `![external](https://cdn.example.com/first.jpg)\n\n![cover later](${cover})`
  });

  assert.throws(
    () => discoverArticleInventory(project),
    /external-before-cover.*external-before-cover\.mdx.*conflicting roles/i
  );
});

test("only assigns the deep budget when explicit deep frontmatter has more than eight body images", () => {
  const project = makeFixtureProject();
  const deepBody = Array.from({ length: 9 }, (_, index) => {
    const url = `/images/articles/deep-example/${String(index + 2).padStart(2, "0")}.webp`;
    writePublicImage({ publicRoot: project.publicRoot, url });
    return `![image ${index + 2}](${url})`;
  }).join("\n");

  writeArticle({
    contentRoot: project.contentRoot,
    slug: "deep-example",
    frontmatter: "image_budget: deep\n",
    body: deepBody
  });
  writeArticle({
    contentRoot: project.contentRoot,
    slug: "many-images-standard",
    body: deepBody
  });
  writeArticle({
    contentRoot: project.contentRoot,
    slug: "explicit-deep-standard",
    frontmatter: "image_budget: deep\n",
    body: "![one](/images/articles/deep-example/02.webp)"
  });
  writeArticle({
    contentRoot: project.contentRoot,
    slug: "explicit-standard",
    frontmatter: "image_budget: standard\n",
    body: ""
  });

  const inventory = discoverArticleInventory(project);

  assert.equal(inventory.articles["deep-example"].budgetClass, "deep");
  assert.equal(inventory.articles["many-images-standard"].budgetClass, "standard");
  assert.equal(inventory.articles["explicit-deep-standard"].budgetClass, "standard");
  assert.equal(inventory.articles["explicit-standard"].budgetClass, "standard");
});

test("assigns visual_archive only to the approved historical archive with more than 50 fully hash-bound classified body images", () => {
  const project = makeFixtureProject();
  const slug = "hundred-years-of-cleaning-appliance-history";
  const cover = `/images/insights/${slug}-cover.jpg`;
  const body = Array.from({ length: 51 }, (_, index) => `/images/insights/${slug}-image-${String(index + 1).padStart(3, "0")}.jpg`);
  for (const url of [cover, ...body]) writePublicImage({ publicRoot: project.publicRoot, url });
  writeArticle({
    contentRoot: project.contentRoot,
    slug,
    frontmatter: `coverImage: ${cover}\nimage_budget: visual_archive\n`,
    body: body.map((url, index) => `![archive ${index + 1}](${url})`).join("\n")
  });

  const inventory = discoverArticleInventory({
    ...project,
    historicalKindClassifications: hashBoundClassifications(project, [cover, ...body])
  });

  assert.equal(inventory.articles[slug].budgetClass, "visual_archive");
});

test("rejects visual_archive with 50 body images or fewer", () => {
  const project = makeFixtureProject();
  const slug = "hundred-years-of-cleaning-appliance-history";
  const body = Array.from({ length: 50 }, (_, index) => `/images/insights/${slug}-image-${String(index + 1).padStart(3, "0")}.jpg`);
  for (const url of body) writePublicImage({ publicRoot: project.publicRoot, url });
  writeArticle({
    contentRoot: project.contentRoot,
    slug,
    frontmatter: "image_budget: visual_archive\n",
    body: body.map((url) => `![archive](${url})`).join("\n")
  });

  assert.throws(
    () => discoverArticleInventory({
      ...project,
      historicalKindClassifications: hashBoundClassifications(project, body)
    }),
    /VISUAL_ARCHIVE_NOT_ELIGIBLE.*more than 50 unique body images.*actual 50/i
  );
});

test("rejects incomplete, stale, and unknown visual_archive classifications", () => {
  const scenarios = [
    ["missing", (classifications, body) => { delete classifications[body[0]]; }, /CLASSIFICATION_REQUIRED.*image-001\.jpg/i],
    ["stale", (classifications, body) => { classifications[body[0]].outputHash = `sha256:${"0".repeat(64)}`; }, /CLASSIFICATION_STALE.*image-001\.jpg/i],
    ["unknown", (classifications, body) => { classifications[body[0]].kind = "unknown"; }, /CLASSIFICATION_REQUIRED.*image-001\.jpg/i]
  ];
  for (const [label, mutate, expected] of scenarios) {
    const project = makeFixtureProject();
    const slug = "hundred-years-of-cleaning-appliance-history";
    const body = Array.from({ length: 51 }, (_, index) => `/images/insights/${slug}-image-${String(index + 1).padStart(3, "0")}.jpg`);
    for (const url of body) writePublicImage({ publicRoot: project.publicRoot, url });
    writeArticle({
      contentRoot: project.contentRoot,
      slug,
      frontmatter: "image_budget: visual_archive\n",
      body: body.map((url) => `![archive](${url})`).join("\n")
    });
    const classifications = hashBoundClassifications(project, body);
    mutate(classifications, body);
    assert.throws(
      () => discoverArticleInventory({ ...project, historicalKindClassifications: classifications }),
      expected,
      label
    );
  }
});

test("does not grant visual_archive to an unapproved slug", () => {
  const project = makeFixtureProject();
  const slug = "another-large-archive";
  const body = Array.from({ length: 51 }, (_, index) => `/images/insights/${slug}-image-${String(index + 1).padStart(3, "0")}.jpg`);
  for (const url of body) writePublicImage({ publicRoot: project.publicRoot, url });
  writeArticle({
    contentRoot: project.contentRoot,
    slug,
    frontmatter: "image_budget: visual_archive\n",
    body: body.map((url) => `![archive](${url})`).join("\n")
  });

  assert.throws(
    () => discoverArticleInventory({ ...project, historicalKindClassifications: hashBoundClassifications(project, body) }),
    /VISUAL_ARCHIVE_NOT_ELIGIBLE.*approved historical archive/i
  );
});

test("reports invalid slugs, missing files, conflicting roles, and unknown budget classes with article and file details", () => {
  const cases = [
    {
      slug: "invalid_slug",
      frontmatter: "",
      body: "",
      message: /invalid_slug.*invalid_slug\.mdx/i
    },
    {
      slug: "missing-image",
      frontmatter: "",
      body: "![missing](/images/articles/missing-image/02.webp)",
      message: /missing-image.*missing-image\.mdx.*02\.webp/i
    },
    {
      slug: "conflicting-role",
      frontmatter: "coverImage: /images/articles/conflicting-role/01-cover.webp\n",
      body: "![body first](/images/articles/conflicting-role/02-product.webp)\n\n![cover later](/images/articles/conflicting-role/01-cover.webp)",
      message: /conflicting-role.*conflicting-role\.mdx.*conflicting roles/i
    },
    {
      slug: "unknown-budget",
      frontmatter: "image_budget: enterprise\n",
      body: "",
      message: /unknown-budget.*unknown-budget\.mdx.*enterprise/i
    }
  ];

  for (const scenario of cases) {
    const project = makeFixtureProject();
    if (scenario.slug === "conflicting-role") {
      writePublicImage({
        publicRoot: project.publicRoot,
        url: "/images/articles/conflicting-role/01-cover.webp"
      });
      writePublicImage({
        publicRoot: project.publicRoot,
        url: "/images/articles/conflicting-role/02-product.webp"
      });
    }
    writeArticle({ contentRoot: project.contentRoot, ...scenario });
    assert.throws(
      () => discoverArticleInventory(project),
      scenario.message,
      `expected ${scenario.slug} to name the article and its MDX file`
    );
  }
});

test("builds a deterministic manifest with sorted keys and normalized hashes", () => {
  const inventory = {
    assets: {
      "/images/articles/pipeline-example/02-product.webp": {},
      "/images/articles/pipeline-example/01-cover.webp": {}
    },
    articles: {
      "pipeline-example": {
        slug: "pipeline-example",
        budgetClass: "standard",
        cover: "/images/articles/pipeline-example/01-cover.webp",
        social: "/images/articles/pipeline-example/01-cover.webp",
        body: ["/images/articles/pipeline-example/02-product.webp"]
      }
    }
  };
  const processedAssets = {
    "/images/articles/pipeline-example/02-product.webp": {
      role: "body",
      kind: "photo",
      width: 1200,
      height: 900,
      bytes: 180_000,
      format: "webp",
      quality: 80,
      sourceHash: "SOURCE-BODY",
      outputHash: "SHA256:DESKTOP-BODY",
      sourcePath: "/machine/private/source.webp"
    },
    "/images/articles/pipeline-example/01-cover.webp": {
      role: "cover",
      kind: "photo",
      width: 1600,
      height: 900,
      bytes: 245_000,
      format: "webp",
      quality: 82,
      sourceHash: "SOURCE",
      outputHash: "SHA256:DESKTOP",
      mobile: {
        src: "/images/articles/pipeline-example/01-cover-800.webp",
        width: 800,
        height: 450,
        bytes: 93_000,
        outputHash: "MOBILE"
      },
      generatedAt: "2026-08-09T00:00:00.000Z"
    }
  };

  const manifest = buildManifest({ inventory, processedAssets, processorVersion: 1 });

  assert.deepEqual(manifest, {
    version: 1,
    processorVersion: "1",
    assets: {
      "/images/articles/pipeline-example/01-cover.webp": {
        role: "cover",
        kind: "photo",
        width: 1600,
        height: 900,
        bytes: 245_000,
        format: "webp",
        quality: 82,
        sourceHash: "sha256:source",
        outputHash: "sha256:desktop",
        mobile: {
          src: "/images/articles/pipeline-example/01-cover-800.webp",
          width: 800,
          height: 450,
          bytes: 93_000,
          outputHash: "sha256:mobile"
        }
      },
      "/images/articles/pipeline-example/02-product.webp": {
        role: "body",
        kind: "photo",
        width: 1200,
        height: 900,
        bytes: 180_000,
        format: "webp",
        quality: 80,
        sourceHash: "sha256:source-body",
        outputHash: "sha256:desktop-body"
      }
    },
    articles: {
      "pipeline-example": {
        budgetClass: "standard",
        cover: "/images/articles/pipeline-example/01-cover.webp",
        body: ["/images/articles/pipeline-example/02-product.webp"]
      }
    }
  });
});

test("serializes manifests as stable pretty JSON with a trailing newline", () => {
  const manifest = buildManifest({
    inventory: {
      assets: {},
      articles: {
        zebra: { slug: "zebra", budgetClass: "standard", cover: null, body: [] },
        alpha: { slug: "alpha", budgetClass: "standard", cover: null, body: [] }
      }
    },
    processedAssets: {},
    processorVersion: "1"
  });

  const first = serializeManifest(manifest);
  const second = serializeManifest(manifest);

  assert.equal(first, second);
  assert.match(first, /^\{\n  "version": 1,/);
  assert.ok(first.indexOf('"alpha"') < first.indexOf('"zebra"'));
  assert.ok(first.endsWith("\n"));
  assert.doesNotMatch(first, /generatedAt|sourcePath|\/machine\//);
});

test("canonicalizes external source audit slugs, filenames, and record fields", () => {
  const hash = `sha256:${"a".repeat(64)}`;
  const manifest = buildManifest({
    inventory: { assets: {}, articles: {} },
    processedAssets: {},
    processorVersion: "1",
    externalSources: {
      zebra: {
        files: {
          "02-body.png": { hash, primary: "/images/body.webp", code: "BODY_DISPOSITION", status: "disposition" },
          "01-cover.png": { primary: "/images/cover.webp", hash, status: "matched" }
        }
      },
      alpha: {
        files: {
          "01-cover.png": { hash, status: "disposition", code: "FALLBACK" }
        }
      }
    }
  });

  assert.deepEqual(Object.keys(manifest.externalSources), ["alpha", "zebra"]);
  assert.deepEqual(Object.keys(manifest.externalSources.zebra.files), ["01-cover.png", "02-body.png"]);
  assert.deepEqual(Object.keys(manifest.externalSources.zebra.files["02-body.png"]), [
    "status",
    "code",
    "primary",
    "hash"
  ]);
});

test("builds a slim deterministic runtime index without audit facts or article inventory", () => {
  const full = {
    version: 1,
    processorVersion: "1",
    externalSources: { example: { files: { "01-cover.png": { status: "matched", hash: `sha256:${"a".repeat(64)}` } } } },
    articles: { example: { budgetClass: "standard", cover: "/images/cover.webp", body: [] } },
    assets: {
      "/images/body.webp": {
        role: "body", kind: "photo", width: 900, height: 600, bytes: 200,
        format: "webp", quality: 84, sourceHash: `sha256:${"b".repeat(64)}`, outputHash: `sha256:${"c".repeat(64)}`
      },
      "/images/cover.webp": {
        role: "cover", kind: "photo", width: 1600, height: 900, bytes: 300,
        format: "webp", quality: 84, sourceHash: `sha256:${"d".repeat(64)}`, outputHash: `sha256:${"e".repeat(64)}`,
        mobile: { src: "/images/cover-800.webp", width: 800, height: 450, bytes: 100, outputHash: `sha256:${"f".repeat(64)}` }
      }
    }
  };

  const runtime = buildRuntimeIndex(full);

  assert.deepEqual(runtime, {
    version: 1,
    assets: {
      "/images/body.webp": { width: 900, height: 600 },
      "/images/cover.webp": {
        width: 1600,
        height: 900,
        mobile: { src: "/images/cover-800.webp", width: 800, height: 450 }
      }
    }
  });
  assert.equal(serializeRuntimeIndex(runtime), `${JSON.stringify(runtime)}\n`);
  assert.equal(serializeRuntimeIndex(runtime).includes("sourceHash"), false);
  assert.equal(serializeRuntimeIndex(runtime).includes("externalSources"), false);
});
