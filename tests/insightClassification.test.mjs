import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const directory = new URL("../content/insights/", import.meta.url);
const files = (await readdir(directory)).filter((file) => file.endsWith(".mdx"));
const allowedTypes = new Set([
  "buying",
  "ownership",
  "comparison",
  "sourcing",
  "maintenance",
  "explainer"
]);

test("every visible insight has an explicit valid content class", async () => {
  const invalid = [];

  for (const file of files) {
    const source = await readFile(new URL(file, directory), "utf8");
    if (/^hidden:\s*"?true"?\s*$/m.test(source)) continue;
    const contentClass = source.match(
      /^content_class:\s*"?(editorial|search)"?\s*$/m
    )?.[1];
    if (!contentClass) invalid.push(file);
  }

  assert.deepEqual(invalid, []);
});

test("every search insight has one valid guide type", async () => {
  const invalid = [];

  for (const file of files) {
    const source = await readFile(new URL(file, directory), "utf8");
    if (!/^content_class:\s*"?search"?\s*$/m.test(source)) continue;
    const guideType = source.match(
      /^guide_type:\s*"?([^"\n]+)"?\s*$/m
    )?.[1];
    if (!guideType || !allowedTypes.has(guideType)) invalid.push(file);
  }

  assert.deepEqual(invalid, []);
});

test("six commercial guides have unique priorities and editorial articles have none", async () => {
  const prioritized = [];
  const invalidEditorial = [];

  for (const file of files) {
    const source = await readFile(new URL(file, directory), "utf8");
    const priority = Number(
      source.match(/^guide_priority:\s*(\d+)\s*$/m)?.[1] || 0
    );
    if (!priority) continue;
    if (!/^content_class:\s*"?search"?\s*$/m.test(source)) {
      invalidEditorial.push(file);
    }
    prioritized.push(priority);
  }

  assert.deepEqual(invalidEditorial, []);
  assert.deepEqual(
    prioritized.sort((a, b) => a - b),
    [10, 20, 30, 40, 50, 60]
  );
});

test("articles titled as buying guides are classified for the buying journey", async () => {
  const invalid = [];

  for (const file of files) {
    const source = await readFile(new URL(file, directory), "utf8");
    if (!/^content_class:\s*"?search"?\s*$/m.test(source)) continue;
    if (!/^title:\s*".*\bBuying Guide\b.*"\s*$/im.test(source)) continue;
    if (!/^guide_type:\s*"?buying"?\s*$/m.test(source)) invalid.push(file);
  }

  assert.deepEqual(invalid, []);
});
