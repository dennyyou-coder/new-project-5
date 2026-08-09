import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

import "./register-path-alias.mjs";

const root = process.cwd();
const articleImages = await import("../lib/articleImages.ts");
const content = await import("../lib/content.ts");

const fixtureManifest = {
  version: 1,
  processorVersion: "test",
  assets: {
    "/images/articles/example/01-cover.webp": {
      role: "cover",
      kind: "photo",
      width: 1600,
      height: 900,
      bytes: 245_000,
      format: "webp",
      quality: 82,
      sourceHash: "sha256:source-cover",
      outputHash: "sha256:primary-cover",
      mobile: {
        src: "/images/articles/example/01-cover-800.webp",
        width: 800,
        height: 450,
        bytes: 93_000,
        outputHash: "sha256:mobile-cover"
      }
    },
    "/images/articles/example/02-product.webp": {
      role: "body",
      kind: "photo",
      width: 1200,
      height: 900,
      bytes: 180_000,
      format: "webp",
      quality: 80,
      sourceHash: "sha256:source-body",
      outputHash: "sha256:primary-body"
    }
  },
  articles: {}
};

const fixtureImages = articleImages.createArticleImageHelpers(fixtureManifest);

function imageTags(markup) {
  return [...markup.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
}

function loadTsxModule(relativeFile, dependencies) {
  const filename = path.join(root, relativeFile);
  const source = fs.readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: filename
  }).outputText;
  const module = { exports: {} };
  const require = (specifier) => {
    if (specifier === "react/jsx-runtime") return dependencies.jsxRuntime;
    if (specifier in dependencies) return dependencies[specifier];
    throw new Error(`Unexpected ${relativeFile} dependency: ${specifier}`);
  };
  new Function("require", "module", "exports", compiled)(require, module, module.exports);
  return module.exports;
}

const jsxRuntime = await import("react/jsx-runtime");
const Link = ({ children, href, ...props }) => React.createElement("a", { href, ...props }, children);

test("responsive helpers keep the primary src and describe approved mobile candidates by context", () => {
  const cover = fixtureImages.responsiveImageProps(
    "/images/articles/example/01-cover.webp",
    "cover"
  );
  assert.deepEqual(cover, {
    src: "/images/articles/example/01-cover.webp",
    srcSet: "/images/articles/example/01-cover-800.webp 800w, /images/articles/example/01-cover.webp 1600w",
    sizes: "(max-width: 800px) 100vw, 1200px",
    width: 1600,
    height: 900,
    loading: "eager",
    decoding: "async",
    fetchPriority: "high"
  });

  const body = fixtureImages.responsiveImageAttributes(
    "/images/articles/example/02-product.webp",
    "body"
  );
  assert.deepEqual(body, {
    src: "/images/articles/example/02-product.webp",
    sizes: "(max-width: 800px) calc(100vw - 32px), 900px",
    width: 1200,
    height: 900,
    loading: "lazy",
    decoding: "async",
    fetchpriority: "auto"
  });
  assert.equal("srcset" in body, false);
});

test("external images remain usable while an unknown local article image fails with its URL", () => {
  assert.deepEqual(
    fixtureImages.responsiveImageProps("https://cdn.example.com/editorial.jpg", "card"),
    {
      src: "https://cdn.example.com/editorial.jpg",
      sizes: "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 380px",
      loading: "lazy",
      decoding: "async",
      fetchPriority: "auto"
    }
  );
  assert.throws(
    () => fixtureImages.getArticleImage("/images/articles/example/missing.webp"),
    /\/images\/articles\/example\/missing\.webp/
  );
});

test("rendered cover, body, and card markup use intrinsic dimensions with only the cover prioritized", () => {
  const markup = renderToStaticMarkup(
    React.createElement(
      "section",
      null,
      React.createElement("img", {
        ...fixtureImages.responsiveImageProps("/images/articles/example/01-cover.webp", "cover"),
        alt: "Exact cover alt"
      }),
      React.createElement("img", {
        ...fixtureImages.responsiveImageProps("/images/articles/example/02-product.webp", "body"),
        alt: "Exact body alt"
      }),
      React.createElement("img", {
        ...fixtureImages.responsiveImageProps("/images/articles/example/02-product.webp", "card"),
        alt: "Exact card alt"
      })
    )
  );
  const [cover, body, card] = imageTags(markup);

  assert.match(cover, /src="\/images\/articles\/example\/01-cover\.webp"/);
  assert.match(cover, /srcSet="\/images\/articles\/example\/01-cover-800\.webp 800w, \/images\/articles\/example\/01-cover\.webp 1600w"/);
  assert.match(cover, /width="1600" height="900"/);
  assert.match(cover, /loading="eager"/);
  assert.match(cover, /fetchPriority="high"/);
  assert.match(cover, /alt="Exact cover alt"/);

  for (const tag of [body, card]) {
    assert.match(tag, /width="1200" height="900"/);
    assert.match(tag, /loading="lazy"/);
    assert.match(tag, /decoding="async"/);
    assert.doesNotMatch(tag, /fetchPriority="high"/);
  }
  assert.match(body, /sizes="\(max-width: 800px\) calc\(100vw - 32px\), 900px"/);
  assert.match(card, /sizes="\(max-width: 640px\) 100vw, \(max-width: 1100px\) 50vw, 380px"/);
  assert.equal(imageTags(markup).filter((tag) => /fetchPriority="high"/.test(tag)).length, 1);
});

test("Markdown and raw HTML body images gain safe lowercase responsive attributes without copy changes", () => {
  const primary = "/images/articles/aiper-fluidra-pool-robotics-alliance/02-alliance-complementary-strengths.webp";
  const markdown = `Opening copy.\n\n![Alliance evidence](${primary} "Evidence caption")\n\nClosing copy.`;
  const markdownHtml = content.markdownToHtml(markdown);
  const markdownImage = imageTags(markdownHtml)[0];

  assert.match(markdownHtml, /<p>Opening copy\.<\/p>/);
  assert.match(markdownHtml, /<p>Closing copy\.<\/p>/);
  assert.match(markdownHtml, /<figcaption>Evidence caption<\/figcaption>/);
  assert.match(markdownImage, /src="\/images\/articles\/aiper-fluidra-pool-robotics-alliance\/02-alliance-complementary-strengths\.webp"/);
  assert.match(markdownImage, /alt="Alliance evidence"/);
  assert.match(markdownImage, /width="1536" height="1024"/);
  assert.match(markdownImage, /loading="lazy" decoding="async"/);
  assert.match(markdownImage, /sizes="\(max-width: 800px\) calc\(100vw - 32px\), 900px"/);

  const rawHtml = content.markdownToHtml(
    `<img src="${primary}" alt="Raw alliance evidence" />`
  );
  const rawImage = imageTags(rawHtml)[0];
  assert.match(rawImage, /src="\/images\/articles\/aiper-fluidra-pool-robotics-alliance\/02-alliance-complementary-strengths\.webp"/);
  assert.match(rawImage, /alt="Raw alliance evidence"/);
  assert.match(rawImage, /width="1536" height="1024"/);
  assert.match(rawImage, /loading="lazy" decoding="async"/);
  assert.match(rawImage, /sizes="\(max-width: 800px\) calc\(100vw - 32px\), 900px"/);
});

test("the real removal path preserves intro copy while removing a conventional Markdown cover block", () => {
  const cover = "/images/articles/aiper-fluidra-pool-robotics-alliance/01-cover.webp";
  const source = `# Fixture title\n\nOpening analysis stays.\n\nSecond introduction stays.\n\n![Cover duplicate](${cover} "Cover caption")\n\n## Evidence\n\nBody copy stays.`;

  const body = content.removeLeadingArticleTitleAndCover(source, "Fixture title", cover);
  const html = content.markdownToHtml(body);

  assert.doesNotMatch(html, /<h1>Fixture title<\/h1>/);
  assert.match(html, /<p>Opening analysis stays\.<\/p>/);
  assert.match(html, /<p>Second introduction stays\.<\/p>/);
  assert.match(html, /<h2>Evidence<\/h2>/);
  assert.match(html, /<p>Body copy stays\.<\/p>/);
  assert.doesNotMatch(html, /Cover duplicate|Cover caption/);
  assert.doesNotMatch(html, new RegExp(cover.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("the real removal path recognizes a conventional raw HTML cover after intro copy", () => {
  const cover = "/images/articles/aiper-fluidra-pool-robotics-alliance/01-cover.webp";
  const source = `Intro before raw image.\n\n<img class="legacy-cover" src="${cover}?v=1" alt="Raw cover duplicate" />\n\nCopy after raw image.`;

  const html = content.markdownToHtml(
    content.removeLeadingArticleTitleAndCover(source, "Fixture title", cover)
  );

  assert.match(html, /<p>Intro before raw image\.<\/p>/);
  assert.match(html, /<p>Copy after raw image\.<\/p>/);
  assert.doesNotMatch(html, /Raw cover duplicate|legacy-cover|01-cover\.webp/);
});

test("the real removal path leaves a later cover unchanged when another image appears first", () => {
  const cover = "/images/articles/aiper-fluidra-pool-robotics-alliance/01-cover.webp";
  const other = "/images/articles/aiper-fluidra-pool-robotics-alliance/02-alliance-complementary-strengths.webp";
  const cases = [
    `Intro.\n\n![External first](https://cdn.example.com/first.jpg)\n\n![Cover later](${cover})`,
    `Intro.\n\n![Other local first](${other})\n\n![Cover later](${cover})`
  ];

  for (const source of cases) {
    const body = content.removeLeadingArticleTitleAndCover(source, "Fixture title", cover);
    assert.equal(body, source);
  }
});

test("a current article with intro prose no longer renders its conventional body cover duplicate", () => {
  const article = content.getInsight("above-ground-vs-in-ground-robotic-pool-cleaners");
  assert.ok(article);
  const body = content.removeLeadingArticleTitleAndCover(
    article.content,
    article.title,
    article.coverImage
  );
  const html = content.markdownToHtml(body);

  assert.match(html, /That distinction matters to consumers/);
  assert.doesNotMatch(html, /above-ground-vs-in-ground-pool-robots\.webp/);
});

test("the real ArticleCard renders its editorial cover as a lazy responsive image", () => {
  const { ArticleCard } = loadTsxModule("components/ArticleCard.tsx", {
    jsxRuntime,
    "next/link": { __esModule: true, default: Link },
    "@/lib/articleImages": articleImages
  });
  const markup = renderToStaticMarkup(
    React.createElement(ArticleCard, {
      article: {
        slug: "aiper-fluidra-pool-robotics-alliance",
        title: "Unchanged article title",
        excerpt: "Unchanged article excerpt.",
        category: "Pool Cleaning",
        date: "2026-01-02",
        coverImage: "/images/articles/aiper-fluidra-pool-robotics-alliance/01-cover.webp",
        coverAlt: "Unchanged article alt"
      }
    })
  );
  const cardImage = imageTags(markup)[0];

  assert.match(cardImage, /src="\/images\/articles\/aiper-fluidra-pool-robotics-alliance\/01-cover\.webp"/);
  assert.match(cardImage, /width="1536" height="1024"/);
  assert.match(cardImage, /loading="lazy" decoding="async"/);
  assert.match(cardImage, /alt="Unchanged article alt"/);
  assert.match(markup, /Unchanged article title/);
  assert.match(markup, /Unchanged article excerpt\./);
  assert.doesNotMatch(markup, /fetchPriority="high"/);
});

test("article OpenGraph metadata keeps the primary cover URL rather than a mobile candidate", async () => {
  const page = loadTsxModule("app/blog/[slug]/page.tsx", {
    jsxRuntime,
    "next/navigation": { notFound() { throw new Error("not found"); } },
    "next/link": { __esModule: true, default: Link },
    "@/components/ArticleBrandLinks": { ArticleBrandLinks() { return null; } },
    "@/components/BlogConversionCta": { BlogConversionCta() { return null; } },
    "@/lib/articleImages": articleImages,
    "@/lib/brands": { getPublishedBrandProfiles() { return []; } },
    "@/lib/content": content,
    "@/lib/insightCollections": { orderSeriesInsights(items) { return items; } },
    "@/lib/seo": await import("../lib/seo.ts")
  });
  const slug = "aiper-fluidra-pool-robotics-alliance";
  const metadata = await page.generateMetadata({ params: Promise.resolve({ slug }) });
  const expected = `https://worldcleanbiz.com/images/articles/${slug}/01-cover.webp`;

  assert.deepEqual(metadata.openGraph.images, [expected]);
  assert.deepEqual(metadata.twitter.images, [expected]);
  assert.doesNotMatch(JSON.stringify(metadata), /-800\.webp/);
});
