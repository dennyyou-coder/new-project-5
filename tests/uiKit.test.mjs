import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { brandMonogram, buildBrandMarkIndex, figureDirection, resolveBrandMark } from "../lib/brandMarks.ts";
import { HUB_CATEGORIES } from "../lib/hubCategories.ts";
import { getInsights } from "../lib/content.ts";
import { getPublishedBrandProfiles } from "../lib/brands.ts";

const read = (file) => fs.readFileSync(path.join(process.cwd(), file), "utf8");

test("monograms are short and readable", () => {
  assert.equal(brandMonogram("SharkNinja"), "SN");
  assert.equal(brandMonogram("TTI"), "TTI");
  assert.equal(brandMonogram("Stanley Black & Decker"), "SB");
  assert.equal(brandMonogram("Dyson"), "D");
  assert.equal(brandMonogram("Globe Tools (Changzhou)"), "GT");
  assert.equal(brandMonogram("  "), "?");
});

test("figure direction follows the reported sign", () => {
  assert.equal(figureDirection("+10.61% YoY"), "up");
  assert.equal(figureDirection("−72.43% YoY"), "down");
  assert.equal(figureDirection("-3.47% YoY"), "down");
  assert.equal(figureDirection("+4% at constant exchange rates"), "up");
  assert.equal(figureDirection("+3.5% organic growth"), "up");
  assert.equal(figureDirection(undefined), "flat");
  assert.equal(figureDirection("unchanged"), "flat");
});

test("every published profile resolves to a logo mark", () => {
  const profiles = getPublishedBrandProfiles(getInsights());
  const index = buildBrandMarkIndex(profiles);
  assert.equal(index.size, profiles.length);
  for (const profile of profiles) {
    const mark = index.get(profile.slug);
    assert.ok(mark?.logo, `${profile.slug} has a logo`);
    assert.equal(mark.href, `/brands/${profile.slug}`);
  }
  assert.deepEqual(resolveBrandMark(index, "not-a-brand", "SharkNinja"), { name: "SharkNinja" });
  assert.equal(resolveBrandMark(index, undefined, ""), undefined);
});

test("every hub category has an icon and the kit styles load globally", () => {
  const icons = read("components/ui/CategoryIcon.tsx");
  for (const hub of HUB_CATEGORIES) assert.match(icons, new RegExp(`"${hub.slug}": \\(`), `${hub.slug} icon`);
  assert.match(read("app/layout.tsx"), /import "\.\/styles\/ui-kit\.css";/);
  const css = read("app/styles/ui-kit.css");
  for (const selector of [".company-mark--monogram", ".category-icon", ".figure-chip--up", ".figure-chip--down"]) {
    assert.ok(css.includes(selector), selector);
  }
});

test("brand profiles answer ownership first", async () => {
  const { buildBrandQuickAnswer, buildOwnershipFact, findParentProfile } = await import("../lib/brandProfileView.ts");
  const profiles = getPublishedBrandProfiles(getInsights());
  const bySlug = new Map(profiles.map((profile) => [profile.slug, profile]));
  assert.match(buildBrandQuickAnswer(bySlug.get("dyson")), /Sir James Dyson/);
  assert.equal(buildOwnershipFact(bySlug.get("aeg")), "Part of AB Electrolux");
  assert.equal(buildOwnershipFact(bySlug.get("electrolux")), "Publicly listed");
  assert.equal(findParentProfile(bySlug.get("electrolux"), profiles), undefined);
  assert.equal(findParentProfile(bySlug.get("aeg"), profiles)?.slug, "electrolux");
  assert.equal(findParentProfile(bySlug.get("milwaukee"), profiles)?.slug, "tti");
  for (const profile of profiles) {
    const answer = buildBrandQuickAnswer(profile);
    if (answer) assert.ok(answer.length <= 220 && !/\.\.$/.test(answer), `${profile.slug} answer`);
  }
  const sections = read("components/brands/BrandSections.tsx");
  const order = ["company-ownership", "product-portfolio", "manufacturing-channels", "competitive-position"].map((id) => sections.indexOf(`id="${id}"`));
  assert.deepEqual([...order].sort((a, b) => a - b), order, "ownership leads the profile sections");
});

test("landing pages carry company logos, the ownership card and guide ordering", () => {
  const article = read("app/blog/[slug]/page.tsx");
  assert.match(article, /article\.guideType === "ownership"/);
  assert.match(article, /\{glanceCompany \? <ArticleCompanyCard profile=\{glanceCompany\} \/> : null\}/);
  assert.match(read("components/ArticleCompanyCard.tsx"), /buildBrandQuickAnswer\(profile\)/);
  assert.match(read("components/ArticleBrandLinks.tsx"), /className="article-brand-logo"/);
  assert.match(read("app/categories/[slug]/page.tsx"), /<CategoryIcon slug=\{hub\.slug\} color=\{hub\.color\} size="lg" \/>/);
  assert.match(read("app/categories/page.tsx"), /<CategoryIcon slug=\{data\.hub\.slug\}/);
  assert.match(read("app/markets/page.tsx"), /figure-chip figure-chip--\$\{figureDirection\(row\.figure\.change\)\}/);
  assert.match(read("app/brands/page.tsx"), /brandMonogram\(group\.parent\)/);
  const guides = read("app/guides/page.tsx");
  assert.match(guides, /const guideTypeOrder = \["ownership", "comparison", "buying", "explainer", "sourcing", "maintenance"\]/);
});

test("every profile has a written ownership answer and a trimmed logo tile", async () => {
  const { brandLogoTile, logoTileWidth } = await import("../lib/brandLogoTiles.ts");
  const profiles = getPublishedBrandProfiles(getInsights());
  for (const profile of profiles) {
    assert.ok(profile.quickAnswer && profile.quickAnswer.length <= 220, `${profile.slug} quickAnswer`);
    const tile = brandLogoTile(profile.slug);
    assert.ok(tile, `${profile.slug} logo tile`);
    assert.ok(fs.existsSync(path.join(process.cwd(), "public", tile.src)), `${profile.slug} tile file`);
    assert.ok(tile.ratio > 0.3 && tile.ratio < 20, `${profile.slug} tile ratio`);
  }
  // Wide wordmarks get more width than square marks, within the box.
  assert.ok(logoTileWidth(7) > logoTileWidth(1));
  assert.ok(logoTileWidth(20) <= 0.9 && logoTileWidth(0.5) > 0);
});
