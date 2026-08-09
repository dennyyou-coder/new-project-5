import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sharedCssBudget = 225_280;
const routeCssBudget = 327_680;
const routes = new Map([
  ["home", ".next/server/app/index.html"],
  ["blog", ".next/server/app/blog.html"],
  ["guides", ".next/server/app/guides.html"],
  ["sourcing", ".next/server/app/sourcing.html"],
  ["brands", ".next/server/app/brands.html"],
  ["equipment", ".next/server/app/equipment.html"],
  ["components", ".next/server/app/components.html"],
  ["about", ".next/server/app/about.html"],
  ["wcb-expo", ".next/server/app/wcb-expo.html"]
]);

function cssLinks(html) {
  return new Set(
    [...html.matchAll(/\/_next\/static\/css\/([a-zA-Z0-9._-]+\.css)/g)].map(
      ([, file]) => file
    )
  );
}

const routeCss = new Map();
for (const [route, relativeHtml] of routes) {
  const htmlPath = path.join(root, relativeHtml);
  assert.equal(fs.existsSync(htmlPath), true, `Missing built HTML for ${route}: ${relativeHtml}`);
  const links = cssLinks(fs.readFileSync(htmlPath, "utf8"));
  assert.ok(links.size > 0, `No built CSS found for ${route}`);
  routeCss.set(route, links);
}

const sharedFiles = [...routeCss.values()].reduce((shared, links) => {
  return new Set([...shared].filter((file) => links.has(file)));
});

const sizeOf = (file) => fs.statSync(path.join(root, ".next/static/css", file)).size;
const sharedBytes = [...sharedFiles].reduce((total, file) => total + sizeOf(file), 0);
assert.ok(
  sharedBytes <= sharedCssBudget,
  `Shared CSS is ${sharedBytes} bytes; budget is ${sharedCssBudget} bytes (${[...sharedFiles].join(", ")})`
);

const routeTotals = [];
for (const [route, files] of routeCss) {
  const bytes = [...files].reduce((total, file) => total + sizeOf(file), 0);
  routeTotals.push({ route, bytes, files: [...files] });
}

const oversizedRoutes = routeTotals.filter(({ bytes }) => bytes > routeCssBudget);
assert.deepEqual(
  oversizedRoutes,
  [],
  `Routes over the CSS budget:\n${oversizedRoutes
    .map(({ route, bytes, files }) => `${route}\t${bytes}\t${files.join(",")}`)
    .join("\n")}`
);

console.log(`Shared CSS: ${sharedBytes} bytes across ${sharedFiles.size} file(s)`);
for (const { route, bytes, files } of routeTotals) {
  console.log(`${route}: ${bytes} bytes (${files.join(", ")})`);
}
