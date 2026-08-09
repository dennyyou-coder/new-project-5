import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import sharp from "sharp";

import { IMAGE_BUDGETS } from "../scripts/article-images/config.mjs";
import {
  createDesktopVariant,
  createMobileVariant,
  inspectSource,
  shouldKeepMobileVariant,
  transformAsset
} from "../scripts/article-images/transform.mjs";

const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wcb-article-image-transform-"));
let fixtures;

function svgFixture({ width, height, transparent = false, chart = false }) {
  const background = transparent ? "none" : "#d9edf7";
  const chartMarks = chart
    ? `<path d="M80 ${height - 100} L300 420 L520 560 L760 220 L${width - 80} 120" fill="none" stroke="#0b5cab" stroke-width="12"/>
       <text x="80" y="100" font-family="Arial" font-size="52" fill="#172b4d">Quarterly cleaning equipment demand</text>`
    : `<circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 4}" fill="#27a17b"/>
       <text x="40" y="${height - 50}" font-family="Arial" font-size="44" fill="#172b4d">Readable line art</text>`;

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="${background}"/>
      ${chartMarks}
    </svg>`
  );
}

async function generateFixtures() {
  const orientedJpeg = path.join(fixtureRoot, "rotated-photo.jpg");
  const largeJpeg = path.join(fixtureRoot, "large-photo.jpg");
  const smallJpeg = path.join(fixtureRoot, "small-photo.jpg");
  const smallWebp = path.join(fixtureRoot, "small-photo.webp");
  const transparentPng = path.join(fixtureRoot, "transparent-graphic.png");
  const chartPng = path.join(fixtureRoot, "text-chart.png");
  const noisyChartPng = path.join(fixtureRoot, "noisy-chart.png");

  await sharp(svgFixture({ width: 120, height: 60 }))
    .jpeg({ quality: 95 })
    .withMetadata({ orientation: 6, comment: "remove this publish metadata" })
    .toFile(orientedJpeg);
  await sharp(svgFixture({ width: 1800, height: 1200 }))
    .jpeg({ quality: 95 })
    .withMetadata({ comment: "remove this publish metadata" })
    .toFile(largeJpeg);
  await sharp(svgFixture({ width: 320, height: 200 }))
    .jpeg({ quality: 95 })
    .toFile(smallJpeg);
  await sharp(svgFixture({ width: 240, height: 160 }))
    .webp({ quality: 90 })
    .toFile(smallWebp);
  await sharp(svgFixture({ width: 1000, height: 600, transparent: true }))
    .png()
    .toFile(transparentPng);
  await sharp(svgFixture({ width: 1400, height: 900, chart: true }))
    .png()
    .toFile(chartPng);

  const noise = Buffer.alloc(900 * 600 * 3);
  let state = 0x1a2b3c4d;
  for (let index = 0; index < noise.length; index += 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    noise[index] = state >>> 24;
  }
  await sharp(noise, { raw: { width: 900, height: 600, channels: 3 } })
    .png({ compressionLevel: 0 })
    .toFile(noisyChartPng);

  return { orientedJpeg, largeJpeg, smallJpeg, smallWebp, transparentPng, chartPng, noisyChartPng };
}

test.before(async () => {
  fixtures = await generateFixtures();
});

test.after(() => {
  fs.rmSync(fixtureRoot, { recursive: true, force: true });
});

test("inspectSource reports stable source facts and a SHA-256 hash", async () => {
  const source = await inspectSource(fixtures.largeJpeg);

  assert.equal(source.width, 1800);
  assert.equal(source.height, 1200);
  assert.equal(source.format, "jpeg");
  assert.equal(source.bytes, fs.statSync(fixtures.largeJpeg).size);
  assert.match(source.sourceHash, /^sha256:[a-f0-9]{64}$/);

  const webpSource = await inspectSource(fixtures.smallWebp);
  assert.deepEqual([webpSource.format, webpSource.width, webpSource.height], ["webp", 240, 160]);
});

test("desktop output applies EXIF orientation, converts to sRGB, and strips metadata", async () => {
  const output = await createDesktopVariant({
    input: fixtures.orientedJpeg,
    role: "body",
    kind: "photo"
  });
  const metadata = await sharp(output.buffer).metadata();

  assert.equal(output.ok, true);
  assert.equal(metadata.width, 60);
  assert.equal(metadata.height, 120);
  assert.equal(metadata.space, "srgb");
  assert.equal(metadata.orientation, undefined);
  assert.equal(metadata.exif, undefined);
  assert.equal(metadata.icc, undefined);
});

test("desktop and mobile variants cap their long edges without enlarging smaller inputs", async () => {
  const desktop = await createDesktopVariant({
    input: fixtures.largeJpeg,
    role: "body",
    kind: "photo"
  });
  const mobile = await createMobileVariant({
    input: fixtures.largeJpeg,
    role: "body",
    kind: "photo"
  });
  const smallDesktop = await createDesktopVariant({
    input: fixtures.smallJpeg,
    role: "body",
    kind: "photo"
  });
  const smallMobile = await createMobileVariant({
    input: fixtures.smallJpeg,
    role: "body",
    kind: "photo"
  });

  assert.deepEqual([desktop.width, desktop.height], [1600, 1067]);
  assert.deepEqual([mobile.width, mobile.height], [800, 533]);
  assert.deepEqual([smallDesktop.width, smallDesktop.height], [320, 200]);
  assert.deepEqual([smallMobile.width, smallMobile.height], [320, 200]);
});

test("aspect ratio is preserved unless an explicit cover crop is supplied", async () => {
  const uncropped = await createDesktopVariant({
    input: fixtures.largeJpeg,
    role: "body",
    kind: "photo"
  });
  const review = await createDesktopVariant({
    input: fixtures.largeJpeg,
    role: "cover",
    kind: "photo"
  });
  const cropped = await createDesktopVariant({
    input: fixtures.largeJpeg,
    role: "cover",
    kind: "photo",
    crop: { left: 0, top: 94, width: 1800, height: 1012 }
  });

  assert.ok(Math.abs(uncropped.width / uncropped.height - 1.5) < 0.002);
  assert.deepEqual(review, {
    ok: false,
    code: "COVER_CROP_REVIEW_REQUIRED",
    slug: null,
    filename: "large-photo.jpg",
    sourceRatio: 1.5,
    targetRatio: 16 / 9,
    recommendedAction: "Provide explicit crop coordinates or an approved focal point."
  });
  assert.deepEqual([cropped.width, cropped.height], [1600, 900]);
});

test("transparent graphics retain alpha and can keep PNG for same-format publishing", async () => {
  const output = await createDesktopVariant({
    input: fixtures.transparentPng,
    role: "transparent",
    kind: "transparent",
    outputFormat: "png"
  });
  const metadata = await sharp(output.buffer).metadata();
  const pixel = await sharp(output.buffer).ensureAlpha().raw().toBuffer();

  assert.equal(output.ok, true);
  assert.equal(output.format, "png");
  assert.equal(metadata.hasAlpha, true);
  assert.equal(pixel[3], 0);
});

test("photographic variants use the deterministic safe quality and size ladders", async () => {
  const desktop = await createDesktopVariant({
    input: fixtures.largeJpeg,
    role: "body",
    kind: "photo",
    limitBytes: 1
  });
  const mobile = await createMobileVariant({
    input: fixtures.largeJpeg,
    role: "body",
    kind: "photo",
    limitBytes: 1
  });

  assert.equal(desktop.ok, false);
  assert.deepEqual(
    desktop.attempts.map(({ longEdge, quality }) => ({ longEdge, quality })),
    [
      { longEdge: 1600, quality: 84 },
      { longEdge: 1600, quality: 80 },
      { longEdge: 1440, quality: 76 },
      { longEdge: 1280, quality: 72 }
    ]
  );
  assert.equal(mobile.ok, false);
  assert.deepEqual(
    mobile.attempts.map(({ longEdge, quality }) => ({ longEdge, quality })),
    [
      { longEdge: 800, quality: 82 },
      { longEdge: 800, quality: 78 },
      { longEdge: 720, quality: 74 },
      { longEdge: 720, quality: 72 }
    ]
  );
  assert.equal(Math.min(...desktop.attempts.map(({ quality }) => quality)), 72);
  assert.equal(Math.min(...mobile.attempts.map(({ quality }) => quality)), 72);
});

test("charts choose a safe WebP or PNG candidate and report an actionable budget failure", async () => {
  const chart = await createDesktopVariant({
    input: fixtures.chartPng,
    slug: "market-chart",
    role: "chart",
    kind: "graphic"
  });
  const failure = await createDesktopVariant({
    input: fixtures.noisyChartPng,
    slug: "oversize-chart",
    role: "chart",
    kind: "graphic"
  });

  assert.equal(chart.ok, true, JSON.stringify(chart, (key, value) => key === "buffer" ? `<${value.length} bytes>` : value));
  assert.equal(chart.format, "png");
  const chartAttempts = Object.fromEntries(chart.attempts.map((attempt) => [attempt.format, attempt.bytes]));
  assert.ok(chartAttempts.png < chartAttempts.webp);
  assert.ok(chart.bytes <= IMAGE_BUDGETS.chart.desktop);
  assert.deepEqual(
    {
      ok: failure.ok,
      code: failure.code,
      slug: failure.slug,
      filename: failure.filename,
      limit: failure.limit,
      recommendedAction: failure.recommendedAction
    },
    {
      ok: false,
      code: "IMAGE_BUDGET_EXCEEDED",
      slug: "oversize-chart",
      filename: "noisy-chart.png",
      limit: IMAGE_BUDGETS.chart.desktop,
      recommendedAction: "Simplify the chart or provide a manually optimized source without reducing quality below 72."
    }
  );
  assert.ok(failure.actualBytes > failure.limit);
});

test("mobile retention uses the approved byte-or-ratio threshold boundaries", () => {
  assert.equal(shouldKeepMobileVariant({ desktopBytes: 100_000, mobileBytes: 79_999 }), true);
  assert.equal(shouldKeepMobileVariant({ desktopBytes: 100_000, mobileBytes: 75_000 }), true);
  assert.equal(shouldKeepMobileVariant({ desktopBytes: 100_000, mobileBytes: 80_000 }), true);
  assert.equal(shouldKeepMobileVariant({ desktopBytes: 100_000, mobileBytes: 80_001 }), false);
});

test("transformAsset returns buffers and metadata while omitting an uneconomical mobile candidate", async () => {
  const output = await transformAsset({
    input: fixtures.smallJpeg,
    slug: "small-photo",
    role: "body",
    kind: "photo"
  });

  assert.equal(output.ok, true);
  assert.equal(Buffer.isBuffer(output.desktop.buffer), true);
  assert.equal(output.desktop.format, "webp");
  assert.match(output.source.sourceHash, /^sha256:[a-f0-9]{64}$/);
  assert.match(output.desktop.outputHash, /^sha256:[a-f0-9]{64}$/);
  assert.equal("mobile" in output, false);
  assert.ok(output.warnings.includes("MOBILE_VARIANT_DISCARDED_INSUFFICIENT_SAVINGS"));
});
