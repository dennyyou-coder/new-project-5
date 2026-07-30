import assert from "node:assert/strict";
import test from "node:test";
import {
  directoryHref,
  paginateDirectoryItems,
  parseDirectoryPage
} from "../lib/contentDirectory.ts";

test("invalid directory page values fall back to page one", () => {
  assert.equal(parseDirectoryPage(undefined), 1);
  assert.equal(parseDirectoryPage("bad"), 1);
  assert.equal(parseDirectoryPage("-2"), 1);
  assert.equal(parseDirectoryPage("0"), 1);
  assert.equal(parseDirectoryPage(["3", "4"]), 3);
});

test("directory pagination returns ten items and clamps overflow", () => {
  const items = Array.from({ length: 23 }, (_, index) => index);
  const secondPage = paginateDirectoryItems(items, 2);
  const overflowPage = paginateDirectoryItems(items, 99);

  assert.equal(secondPage.currentPage, 2);
  assert.equal(secondPage.totalPages, 3);
  assert.equal(secondPage.pageStart, 10);
  assert.deepEqual(secondPage.items, [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

  assert.equal(overflowPage.currentPage, 3);
  assert.equal(overflowPage.pageStart, 20);
  assert.deepEqual(overflowPage.items, [20, 21, 22]);
});

test("empty directories still expose one empty page", () => {
  assert.deepEqual(paginateDirectoryItems([], 4), {
    items: [],
    currentPage: 1,
    totalPages: 1,
    pageStart: 0
  });
});

test("directory links preserve filters and omit page one", () => {
  assert.equal(
    directoryHref("/blog/archive", 1, { category: "Robotic Mowers" }),
    "/blog/archive?category=Robotic+Mowers"
  );
  assert.equal(
    directoryHref("/blog/archive", 2, { category: "Robotic Mowers" }),
    "/blog/archive?category=Robotic+Mowers&page=2"
  );
  assert.equal(directoryHref("/guides", 2), "/guides?page=2");
  assert.equal(directoryHref("/guides", 1), "/guides");
});
