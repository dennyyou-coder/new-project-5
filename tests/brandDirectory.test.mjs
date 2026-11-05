import test from "node:test";
import assert from "node:assert/strict";
import { buildOwnershipGroups, headquartersCountry, parentGroupKey } from "../lib/brandDirectory.ts";
import { getPublishedBrandProfiles } from "../lib/brands.ts";
import { getInsights } from "../lib/content.ts";

test("headquarters country comes from the profile text, or none when not stated", () => {
  assert.equal(headquartersCountry("Suzhou, Jiangsu, China"), "China");
  assert.equal(headquartersCountry("Istanbul, Türkiye (Beko / Arçelik A.Ş.)"), "Türkiye");
  assert.equal(headquartersCountry("Not stated at group level in the reviewed sources; operated from Singapore"), undefined);
});

test("ownership groups only merge clear single parents", () => {
  assert.equal(parentGroupKey("Midea Group Co., Ltd."), parentGroupKey("Midea Group, with the TOSHIBA home-appliance trademark used under licence"));
  assert.equal(parentGroupKey("Regional structure: Beko Europe in Europe; GE Appliances in the Americas"), undefined);
  assert.equal(parentGroupKey("Private ownership; complete cap table not disclosed"), undefined);
  const groups = buildOwnershipGroups(getPublishedBrandProfiles(getInsights()));
  assert.ok(groups.length > 0);
  for (const group of groups) assert.ok(group.brands.length >= 2, group.parent);
  const brandsInGroups = groups.flatMap((group) => group.brands.map((brand) => brand.slug));
  assert.equal(new Set(brandsInGroups).size, brandsInGroups.length, "a brand appears in one group only");
});

test("ownership groups link the parent's own profile when it exists", () => {
  const groups = buildOwnershipGroups(getPublishedBrandProfiles(getInsights()));
  const tti = groups.find((group) => group.brands.some((brand) => brand.slug === "milwaukee"));
  assert.equal(tti?.parentProfile?.slug, "tti");
});
