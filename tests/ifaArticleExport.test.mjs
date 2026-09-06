import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { transformAsset } from "../scripts/article-images/transform.mjs";

const slug = "ifa-2026-cleaning-products-company-roundup";
const input = await sharp({ create: { width: 1800, height: 1200, channels: 3, background: "#dfe8e3" } }).png().toBuffer();

test("IFA collage export keeps the reviewed desktop/mobile sizes for graphics and photos", async () => {
  for (const [role, kind] of [["chart", "graphic"], ["body", "photo"]]) {
    const result = await transformAsset({ input, slug, role, kind });
    assert.equal(result.ok, true);
    assert.equal(result.desktop.width, 1280);
    assert.equal(result.mobile.width, 640);
    assert.equal(result.desktop.quality, 72);
    assert.equal(result.mobile.quality, 72);
    assert.equal(result.desktop.format, "webp");
  }
});

test("IFA export still rejects images over their role budget", async () => {
  const result = await transformAsset({ input, slug, role: "chart", kind: "graphic", limitBytes: 1 });
  assert.equal(result.ok, false);
  assert.equal(result.code, "IMAGE_BUDGET_EXCEEDED");
});

test("IFA export does not alter other articles or covers", async () => {
  const other = await transformAsset({ input, slug: "another-article", role: "chart", kind: "graphic", outputFormat: "webp", preserveOutputFormat: true });
  assert.equal(other.desktop.width, 1600);
  assert.equal(other.mobile.width, 800);
  assert.equal(other.desktop.quality, 90);
  const cover = await sharp({ create: { width: 1600, height: 900, channels: 3, background: "#dfe8e3" } }).png().toBuffer();
  const result = await transformAsset({ input: cover, slug, role: "cover", kind: "graphic", outputFormat: "webp" });
  assert.equal(result.desktop.width, 1600);
  assert.equal(result.desktop.quality, 90);
});
