import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
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
