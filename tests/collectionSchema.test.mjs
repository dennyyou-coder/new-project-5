import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { buildCollectionSchemas } from "../lib/collectionSchema.ts";

test("collection markup lists items in order with absolute URLs and a breadcrumb", () => {
  const [page, crumbs] = buildCollectionSchemas({ name: "Tools", description: "d", path: "/tools", items: [{ name: "A", url: "/tools/a" }, { name: "B", url: "https://www.youtube.com/watch?v=x" }, { name: "C" }] });
  assert.equal(page["@type"], "CollectionPage");
  assert.equal(page.url, "https://worldcleanbiz.com/tools");
  assert.equal(page.mainEntity.numberOfItems, 3);
  assert.deepEqual(page.mainEntity.itemListElement.map((item) => [item.position, item.url]), [[1, "https://worldcleanbiz.com/tools/a"], [2, "https://www.youtube.com/watch?v=x"], [3, undefined]]);
  assert.equal(crumbs["@type"], "BreadcrumbList");
});

test("each list page renders the collection markup", () => {
  for (const page of ["components", "equipment", "topics", "tools", "videos", "sourcing", "rules-calendar"]) {
    assert.match(fs.readFileSync(`app/${page}/page.tsx`, "utf8"), /<CollectionSchema /, page);
  }
});
