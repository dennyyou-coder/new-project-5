import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readRouteStyles } from "./readRouteStyles.mjs";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const [blog, blogLayout, blogLanding, archive, directory, article, css, sitemap, directorySeries, directorySidebar] = await Promise.all([
  read("app/blog/page.tsx"),
  read("app/blog/layout.tsx"),
  read("components/BlogLanding.tsx"),
  read("app/blog/archive/page.tsx"),
  read("components/ContentDirectory.tsx"),
  read("app/blog/[slug]/page.tsx"),
  Promise.resolve(readRouteStyles("content-directories.css")),
  read("app/sitemap.ts"),
  read("components/DirectorySeriesFeature.tsx"),
  read("components/DirectorySidebar.tsx")
]);

const blogRouteCss = [
  await read("app/globals.css"),
  ...await Promise.all(
    [...blogLayout.matchAll(/import\s+["']\.\.\/styles\/([^"']+\.css)["']/g)]
      .map((match) => read(`app/styles/${match[1]}`))
  )
].join("\n");

test("Blog uses the approved full-width landing without a sidebar", () => {
  assert.match(blog, /blog-home-intro/);
  assert.match(blog, /<BlogBusinessLinks \/>/);
  assert.match(blogLanding, /Explore Market Reports/);
  assert.match(blogLanding, /Discuss Product Opportunities/);
  assert.doesNotMatch(blog, /SidebarContent/);
  assert.doesNotMatch(blog, /<aside/);
});

test("Blog landing does not introduce a nested main landmark", () => {
  assert.doesNotMatch(blog, /<main className="insights-feed"/);
  assert.doesNotMatch(blogLanding, /<main\b/);
});

test("Blog cards use the shared lazy responsive image contract", () => {
  assert.match(blogLanding, /responsiveImageProps\(article\.coverImage, "card"\)/);
  assert.doesNotMatch(blogLanding, /fetchPriority="high"/);
  assert.match(blogLanding, /loading:\s*"lazy"/);
  assert.match(blogLanding, /decoding:\s*"async"/);
});

test("Archive exposes paginated analysis, reading metadata, and structured data", () => {
  assert.match(archive, /<ContentDirectory/);
  assert.match(archive, /filteredArticles\.length/);
  assert.match(directory, /article\.readingTime/);
  assert.match(archive, /CollectionPage/);
  assert.match(archive, /ItemList/);
  assert.match(archive, /BreadcrumbList/);
  assert.match(archive, /getAvailableCompanyKeywords/);
  assert.match(archive, /navigationTitle: "Company & Brand Index"/);
  assert.match(archive, /importantTitle: "Important Analysis"/);
  assert.match(archive, /paginateDirectoryItems/);
});

test("Article template strengthens trust and related discovery without changing body conversion", () => {
  assert.match(article, /blog-visible-breadcrumb/);
  assert.match(article, /publishedTime/);
  assert.match(article, /href="\/about"/);
  assert.match(article, /className="related-signal-image"/);
  assert.match(article, /loading="lazy"/);
  assert.match(article, /<BlogConversionCta/);
  assert.equal((article.match(/<BlogConversionCta/g) || []).length, 1);
});

test("Article schema includes author identity, section, keywords, and publisher logo", () => {
  assert.match(article, /articleSection: article\.category/);
  assert.match(article, /keywords: article\.tags/);
  assert.match(article, /url: `\$\{siteUrl\}\/about`/);
  assert.match(article, /logo:/);
  assert.match(article, /isPartOf:/);
});

test("Content pages have isolated responsive and long-reading styles", () => {
  assert.match(css, /Content experience optimization/);
  assert.match(css, /\.blog-home-intro/);
  assert.match(css, /Analysis and Guides directories/);
  assert.match(css, /\.content-directory-series/);
  assert.match(css, /\.content-directory-profile/);
  assert.match(css, /\.content-directory-keywords/);
  assert.match(css, /\.content-directory-layout/);
  assert.match(css, /\.content-directory-sidebar/);
  assert.match(css, /data-sidebar-mode="analysis"/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /object-fit:\s*contain/);
  assert.match(css, /\.blog-visible-breadcrumb/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /content-visibility:\s*auto/);
  assert.match(css, /\.blog-archive-actions span\s*\{[^}]*gap:\s*4px/);
});

test("Blog route CSS graph preserves article cover framing and responsive body images", () => {
  assert.match(blogRouteCss, /\.blog-article-cover\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/s);
  assert.match(blogRouteCss, /\.blog-article-cover img\s*\{[^}]*object-fit:\s*cover/s);
  assert.match(blogRouteCss, /\.article-inline-image img\s*\{[^}]*max-width:\s*100%[^}]*height:\s*auto/s);
});

test("Sitemap keeps Blog and Archive discoverable", () => {
  assert.match(sitemap, /"\/blog"/);
  assert.match(sitemap, /"\/blog\/archive"/);
});

test("Archive is an analysis-only directory without changing article links", () => {
  assert.match(archive, /title="Analysis & Insights"/);
  assert.match(archive, /id="analysis"/);
  assert.match(archive, /getEditorialInsights/);
  assert.doesNotMatch(archive, /getGuideInsights/);
  assert.doesNotMatch(archive, /Guides &amp; Comparisons/);
  assert.match(archive, /<ContentDirectory/);
});

test("article breadcrumbs reflect the reader-facing collection", () => {
  assert.match(article, /article\.contentClass === "search"/);
  assert.match(article, /\/guides\/\$\{article\.guideType\}/);
  assert.match(article, /collectionName/);
  assert.match(article, /World Clean Biz Industry Guides/);
  assert.match(article, /url: `\$\{siteUrl\}\$\{collectionHref\}`/);
});

test("directory feature and profile use approved existing content", () => {
  assert.match(directorySeries, /Ongoing Series · Latest Episode/);
  assert.match(directorySeries, /View all episodes/);
  assert.match(directorySeries, /objectFit/);
  assert.match(directorySidebar, /Denny You/);
  assert.match(directorySidebar, /Founder, World Clean Biz/);
  assert.match(directorySidebar, /Organizer, WCB Expo/);
  assert.match(directorySidebar, /since 2006/);
});
