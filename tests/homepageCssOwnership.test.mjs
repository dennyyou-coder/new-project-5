import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("homepage root CSS excludes route-owned selector families", () => {
  const globals = read("app/globals.css");
  assert.ok(Buffer.byteLength(globals) <= 45_000);
  assert.doesNotMatch(
    globals,
    /(?:^|\n)\.(?:wcb-expo|insights-(?!page-container\b)|blog-|sourcing|reports-library|contact-response|about-network)/m
  );
  assert.match(globals, /\.insights-page-container\s*\{/);
  assert.match(read("app/equipment/page.tsx"), /insights-page-container/);
  assert.match(globals, /\.footer\s*\{/);
  assert.match(globals, /\.lead-form-status a\s*\{/);
});

test("each route imports the stylesheet that owns its visual system", () => {
  assert.match(read("app/page.tsx"), /import "\.\/styles\/home\.css"/);
  assert.match(read("app/wcb-expo/page.tsx"), /import "\.\.\/styles\/wcb-expo\.css"/);
  assert.match(read("app/reports/page.tsx"), /import "\.\.\/styles\/reports\.css"/);
  assert.match(read("app/blog/layout.tsx"), /content-directories\.css/);
  assert.match(read("app/sourcing/layout.tsx"), /sourcing\.css/);
});

test("route styles retain representative moved declarations", () => {
  assert.match(read("app/styles/wcb-expo.css"), /\.wcb-expo-page\s*\{/);
  assert.match(read("app/styles/reports.css"), /\.reports-library-page\s*\{/);
  assert.match(read("app/styles/content-directories.css"), /\.blog-editorial-intro\s*\{/);
  assert.match(read("app/styles/sourcing.css"), /\.sourcing-v4-page\s*\{/);
  assert.match(read("app/styles/trust.css"), /\.contact-response-layout\s*\{/);
  assert.match(read("app/styles/home.css"), /\.home-v9-pathway-grid article\s*\{/);
});
