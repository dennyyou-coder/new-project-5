import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import sharp from "sharp";

const homeSource = await readFile(
  new URL("../app/page.tsx", import.meta.url),
  "utf8"
);
const seriesSource = await readFile(
  new URL("../components/HomeSeriesFeature.tsx", import.meta.url),
  "utf8"
);
const avatarUrl = new URL(
  "../public/images/testimonials/testimonial-avatar-product-director.webp",
  import.meta.url
);
const avatarPath = fileURLToPath(avatarUrl);
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const [homeCss, globalCss] = await Promise.all([
  readFile(new URL("../app/styles/home.css", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8")
]);

async function productionTsxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await productionTsxFiles(absolute)));
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      files.push(absolute);
    }
  }

  return files.sort();
}

const productionSource = (
  await Promise.all(
    (
      await Promise.all(
        ["app", "components"].map((directory) =>
          productionTsxFiles(path.join(projectRoot, directory))
        )
      )
    )
      .flat()
      .sort()
      .map((file) => readFile(file, "utf8"))
  )
).join("\n");

test("homepage-owned raster visuals use next/image with explicit responsive sizes", () => {
  assert.match(homeSource, /import Image from "next\/image"/);
  assert.match(homeSource, /sizes="\(max-width: 720px\) 42vw,/);
  assert.match(
    homeSource,
    /sizes="\(max-width: 720px\) calc\(100vw - 40px\),/
  );
  assert.doesNotMatch(
    homeSource,
    /className="home-v9-testimonial-avatar[^>]*role="img"/
  );
});

test("homepage series uses responsive optimization without unconditional priority", () => {
  assert.match(seriesSource, /import Image from "next\/image"/);
  assert.match(seriesSource, /getArticleImage\(/);
  assert.match(seriesSource, /loading="lazy"/);
  assert.match(
    seriesSource,
    /sizes="\(max-width: 1050px\) calc\(100vw - 40px\), 480px"/
  );
  assert.doesNotMatch(seriesSource, /priority|fetchPriority="high"/);
});

test("product-director avatar is a compact square WebP", async () => {
  const [facts, file] = await Promise.all([
    sharp(avatarPath).metadata(),
    stat(avatarPath)
  ]);
  assert.equal(facts.format, "webp");
  assert.equal(facts.width, 160);
  assert.equal(facts.height, 160);
  assert.ok(file.size <= 20_000, `avatar is ${file.size} bytes`);
});

test("homepage route owns its Expo and updates-form styles", () => {
  assert.match(homeCss, /\.home-v9-expo-campaign\s*\{/);
  assert.match(homeCss, /\.home-v9-updates-form\s*\{/);
  assert.doesNotMatch(globalCss, /\.home-v9-expo-campaign/);
});

test("retired Home V4 selectors have no production references", () => {
  assert.doesNotMatch(globalCss, /\.home-v4-/);
  assert.doesNotMatch(productionSource, /home-v4-/);
});
