import assert from "node:assert/strict";
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
import { buildManifest, serializeManifest } from "../scripts/article-images/manifest.mjs";
import { discoverArticleInventory } from "../scripts/article-images/references.mjs";

const fixtureRoot = path.join(process.cwd(), "tests", "fixtures", "article-images");
const fixtureContentRoot = path.join(fixtureRoot, "content");
const fixturePublicRoot = path.join(fixtureRoot, "public");

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

test("exports the approved decimal-byte image and article budgets", () => {
  assert.deepEqual(IMAGE_BUDGETS, {
    cover: { desktop: 300_000, mobile: 120_000 },
    body: { desktop: 220_000, mobile: 100_000 },
    chart: { desktop: 300_000, mobile: 140_000 },
    transparent: 150_000
  });
  assert.deepEqual(ARTICLE_BUDGETS, {
    standard: { desktop: 1_500_000, mobile: 750_000 },
    deep: { desktop: 2_500_000, mobile: 1_200_000 }
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
      body: "![cover again](/images/articles/conflicting-role/01-cover.webp)",
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
