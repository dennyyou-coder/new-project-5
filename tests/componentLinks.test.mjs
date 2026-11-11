import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { COMPONENT_MACHINES, componentsForEquipment, equipmentForComponent, publishedEquipmentLinks, siblingComponents } from "../lib/componentLinks.ts";
import { getPublishedComponentProfiles } from "../lib/componentProfiles.ts";

const components = getPublishedComponentProfiles().map(({ slug, name }) => ({ slug, name }));

test("every published component belongs to a machine type and gets at least three sibling or machine links", () => {
  for (const { slug } of components) {
    const links = siblingComponents(slug, components).length + equipmentForComponent(slug).length;
    assert.ok(links >= 3, `${slug} has ${links} links`);
    assert.ok(!siblingComponents(slug, components).some((item) => item.slug === slug));
  }
});

test("machine mappings point only at equipment files that exist and are published", () => {
  const published = new Set(publishedEquipmentLinks().map(({ slug }) => slug));
  for (const machine of COMPONENT_MACHINES) for (const slug of machine.equipment) {
    assert.ok(fs.existsSync(`content/equipment/${slug}.json`), slug);
    assert.ok(published.has(slug), `${slug} is not published`);
  }
});

test("equipment pages list only components of their own machine type", () => {
  assert.ok(componentsForEquipment("cold-water-pressure-washer", components).every(({ slug }) => slug.startsWith("pressure-washer-")));
  assert.equal(componentsForEquipment("dishwasher", components).length, 0);
});
