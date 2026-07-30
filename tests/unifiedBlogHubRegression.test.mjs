import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const blogPage = await readFile(
  new URL("../app/blog/page.tsx", import.meta.url),
  "utf8"
);

test("Blog is the shared landing page for analysis and practical guides", () => {
  assert.match(blogPage, /title="Deep Analysis"/);
  assert.match(blogPage, /archiveHref="\/blog\/archive#analysis"/);
  assert.match(blogPage, /title="Practical Guides"/);
  assert.match(blogPage, /archiveHref="\/guides"/);
});
