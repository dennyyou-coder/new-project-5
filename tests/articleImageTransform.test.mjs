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
  const sub1280Png = path.join(fixtureRoot, "sub-1280-photo.png");
  const progressivePng = path.join(fixtureRoot, "progressive-photo.png");

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

  for (const [file, amplitude] of [[sub1280Png, 4], [progressivePng, 5]]) {
    const width = 789;
    const height = 595;
    const pixels = Buffer.alloc(width * height * 3);
    let state = 0x12345678;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        for (let channel = 0; channel < 3; channel += 1) {
          state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
          const noiseValue = ((state >>> 24) % (amplitude * 2 + 1)) - amplitude;
          const base = (x * 3 + y * 2 + channel * 47) % 256;
          pixels[(y * width + x) * 3 + channel] = Math.max(0, Math.min(255, base + noiseValue));
        }
      }
    }
    await sharp(pixels, { raw: { width, height, channels: 3 } })
      .png({ compressionLevel: 9, effort: 10 })
      .toFile(file);
  }

  return { orientedJpeg, largeJpeg, smallJpeg, smallWebp, transparentPng, chartPng, noisyChartPng, sub1280Png, progressivePng };
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

test("historical preservation mode keeps a non-16:9 cover uncropped", async () => {
  const output = await createDesktopVariant({
    input: fixtures.largeJpeg,
    role: "cover",
    kind: "photo",
    outputFormat: "jpeg",
    preserveCrop: true
  });

  assert.equal(output.ok, true);
  assert.equal(output.format, "jpeg");
  assert.ok(Math.abs(output.width / output.height - 1.5) < 0.002);
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
  assert.equal(desktop.limit, 1);
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
  assert.equal(mobile.limit, 1);
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

test("deep historical photo recovery honors an explicit safe long-edge cap at quality 72", async () => {
  const desktop = await createDesktopVariant({
    input: fixtures.largeJpeg,
    role: "body",
    kind: "photo",
    outputFormat: "jpeg",
    preserveCrop: true,
    photoLongEdgeCap: 960
  });
  const mobile = await createMobileVariant({
    input: fixtures.largeJpeg,
    role: "body",
    kind: "photo",
    outputFormat: "webp",
    preserveCrop: true,
    photoLongEdgeCap: 680
  });

  assert.equal(desktop.ok, true);
  assert.equal(desktop.longEdge, 960);
  assert.equal(desktop.width, 960);
  assert.equal(desktop.quality, 72);
  assert.deepEqual(desktop.attempts.map(({ longEdge, quality }) => ({ longEdge, quality })), [
    { longEdge: 960, quality: 72 }
  ]);
  assert.equal(mobile.ok, true);
  assert.equal(mobile.longEdge, 680);
  assert.equal(mobile.width, 680);
  assert.equal(mobile.quality, 72);
});

test("historical photo mobile recovery accepts the extended ladder down to 390px and rejects lower caps", async () => {
  for (const longEdge of [560, 480, 390]) {
    const mobile = await createMobileVariant({
      input: fixtures.largeJpeg,
      role: "body",
      kind: "photo",
      outputFormat: "webp",
      preserveCrop: true,
      photoLongEdgeCap: longEdge
    });
    assert.equal(mobile.ok, true);
    assert.equal(mobile.width, longEdge);
    assert.equal(mobile.quality, 72);
  }
  await assert.rejects(
    createMobileVariant({
      input: fixtures.largeJpeg,
      role: "body",
      kind: "photo",
      outputFormat: "webp",
      preserveCrop: true,
      photoLongEdgeCap: 389
    }),
    /unsupported mobile deep-photo long-edge cap: 389/i
  );
});

test("caller limits can tighten but never weaken the configured role budget", async () => {
  const output = await createDesktopVariant({
    input: fixtures.noisyChartPng,
    role: "body",
    kind: "photo",
    limitBytes: Number.MAX_SAFE_INTEGER
  });

  assert.equal(output.ok, false);
  assert.equal(output.limit, IMAGE_BUDGETS.body.desktop);
  assert.ok(output.actualBytes > output.limit);
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

test("charts ignore same-format overrides and always compare safe WebP and PNG candidates", async () => {
  for (const outputFormat of ["jpeg", "webp", "png"]) {
    const chart = await createDesktopVariant({
      input: fixtures.chartPng,
      role: "chart",
      kind: "graphic",
      outputFormat
    });

    assert.equal(chart.ok, true);
    assert.notEqual(chart.format, "jpeg");
    assert.deepEqual(chart.attempts.map((attempt) => attempt.format), ["webp", "png"]);
  }
});

test("historical preservation mode keeps a chart's requested primary format", async () => {
  const output = await createDesktopVariant({
    input: fixtures.chartPng,
    role: "chart",
    kind: "graphic",
    outputFormat: "jpeg",
    preserveOutputFormat: true
  });

  assert.equal(output.ok, true);
  assert.equal(output.format, "jpeg");
});

test("historical progressive fallback handles a DeLonghi-shaped sub-1280 PNG at the first 99% stage", async () => {
  const withoutFallback = await createDesktopVariant({
    input: fixtures.sub1280Png,
    role: "cover",
    kind: "photo",
    outputFormat: "png",
    preserveCrop: true
  });
  const output = await createDesktopVariant({
    input: fixtures.sub1280Png,
    role: "cover",
    kind: "photo",
    outputFormat: "png",
    preserveCrop: true,
    historicalProgressiveFallback: true
  });

  assert.equal(withoutFallback.ok, false);
  assert.equal(output.ok, true);
  assert.equal(output.format, "png");
  assert.deepEqual([output.width, output.height, output.fallbackScale], [781, 589, 0.99]);
  assert.equal(output.bytes <= IMAGE_BUDGETS.cover.desktop, true);
  assert.deepEqual(output.attempts.filter(({ fallbackScale }) => fallbackScale).map(({ fallbackScale }) => fallbackScale), [0.99]);
});

test("historical progressive fallback selects the first passing stage deterministically", async () => {
  const output = await createDesktopVariant({
    input: fixtures.progressivePng,
    role: "cover",
    kind: "photo",
    outputFormat: "png",
    preserveCrop: true,
    historicalProgressiveFallback: true
  });

  assert.equal(output.ok, true);
  assert.equal(output.fallbackScale, 0.96);
  assert.deepEqual(output.attempts.filter(({ fallbackScale }) => fallbackScale).map(({ fallbackScale, bytes }) => ({ fallbackScale, passes: bytes <= IMAGE_BUDGETS.cover.desktop })), [
    { fallbackScale: 0.99, passes: false },
    { fallbackScale: 0.98, passes: false },
    { fallbackScale: 0.96, passes: true }
  ]);
});

test("mobile retention uses the approved byte-or-ratio threshold boundaries", () => {
  const dimensions = { desktopWidth: 1200, mobileWidth: 800 };
  assert.equal(shouldKeepMobileVariant({ desktopBytes: 100_000, mobileBytes: 79_999, ...dimensions }), true);
  assert.equal(shouldKeepMobileVariant({ desktopBytes: 100_000, mobileBytes: 75_000, ...dimensions }), true);
  assert.equal(shouldKeepMobileVariant({ desktopBytes: 100_000, mobileBytes: 80_000, ...dimensions }), true);
  assert.equal(shouldKeepMobileVariant({ desktopBytes: 100_000, mobileBytes: 80_001, ...dimensions }), false);
});

test("mobile retention rejects a byte-profitable candidate that is not narrower than the final primary", () => {
  assert.equal(shouldKeepMobileVariant({
    desktopBytes: 100_000,
    mobileBytes: 40_000,
    desktopWidth: 720,
    mobileWidth: 720
  }), false);
  assert.equal(shouldKeepMobileVariant({
    desktopBytes: 100_000,
    mobileBytes: 40_000,
    desktopWidth: 781,
    mobileWidth: 789
  }), false);
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
