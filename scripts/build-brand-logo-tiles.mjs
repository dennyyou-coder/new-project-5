// Builds small, trimmed logo tiles for compact logo cards.
//
// The official logo files keep their own padding (some use only 13% of the
// canvas), which makes them look tiny in small cards. This script trims the
// empty margin, adds a small even margin back, scales to 120px high at most
// and records each tile's aspect ratio so cards can size logos by area.
//
// Usage: node scripts/build-brand-logo-tiles.mjs
// Writes public/images/brands/{slug}/logo-tile.webp and
// lib/generated/brand-logo-tiles.json. The original logo.webp is not changed.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const brandsDir = path.join(root, "content/brands");
const out = {};

for (const file of fs.readdirSync(brandsDir).filter((name) => name.endsWith(".json")).sort()) {
  const profile = JSON.parse(fs.readFileSync(path.join(brandsDir, file), "utf8"));
  if (!profile.logoImage?.startsWith("/images/brands/")) continue;
  const source = path.join(root, "public", profile.logoImage);
  if (!fs.existsSync(source)) continue;

  const trimmed = await sharp(source).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
  const { width, height } = trimmed.info;
  // Even breathing room, proportional to the short side so wide wordmarks stay wide.
  const margin = Math.max(2, Math.round(Math.min(width, height) * 0.08));
  const tile = await sharp(trimmed.data)
    .extend({ top: margin, bottom: margin, left: margin, right: margin, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize({ height: 120, width: 720, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100 })
    .toBuffer({ resolveWithObject: true });

  // Mean luminance of the visible pixels: near-white logos need darkening on white cards.
  const { data: pixels, info: pixelInfo } = await sharp(tile.data).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let sum = 0;
  let chroma = 0;
  let dark = 0;
  let count = 0;
  for (let index = 0; index < pixels.length; index += pixelInfo.channels) {
    if (pixels[index + 3] < 128) continue;
    const [r, g, b] = [pixels[index], pixels[index + 1], pixels[index + 2]];
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sum += luminance;
    if (luminance < 100) dark += 1;
    chroma += Math.max(r, g, b) - Math.min(r, g, b);
    count += 1;
  }
  // Only pale, colourless logos (white or light grey wordmarks) are darkened;
  // a dark logo on its own white panel has many dark pixels and is left alone.
  const light = count > 0 && sum / count > 220 && chroma / count < 40 && dark / count < 0.1;

  const target = path.join(path.dirname(source), "logo-tile.webp");
  fs.writeFileSync(target, tile.data);
  out[profile.slug] = {
    src: `${path.dirname(profile.logoImage)}/logo-tile.webp`,
    ratio: Number((tile.info.width / tile.info.height).toFixed(3)),
    ...(light ? { light: true } : {})
  };
}

fs.mkdirSync(path.join(root, "lib/generated"), { recursive: true });
fs.writeFileSync(path.join(root, "lib/generated/brand-logo-tiles.json"), `${JSON.stringify(out, null, 2)}\n`);
console.log(`Wrote ${Object.keys(out).length} logo tiles.`);
