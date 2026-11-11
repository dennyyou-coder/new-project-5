import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { sameCorporateGroup } from "../lib/brandProfileView.ts";

const brand = (slug) => JSON.parse(fs.readFileSync(`content/brands/${slug}.json`, "utf8"));

test("brands in the same corporate group are recognised as sister brands", () => {
  assert.equal(sameCorporateGroup(brand("ecovacs"), brand("tineco")), true);
  assert.equal(sameCorporateGroup(brand("tineco"), brand("ecovacs")), true);
  assert.equal(sameCorporateGroup(brand("black-decker"), brand("dewalt")), true);
  assert.equal(sameCorporateGroup(brand("ecovacs"), brand("roborock")), false);
  assert.equal(sameCorporateGroup(brand("dreame"), brand("roborock")), false);
});

test("the brand page drops same-group brands from its competitor cards", () => {
  const page = fs.readFileSync("app/brands/[slug]/page.tsx", "utf8");
  assert.match(page, /sameCorporateGroup\(profile, competitor\)/);
});
