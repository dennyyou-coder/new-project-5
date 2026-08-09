import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentDirectory = path.join(root, "content", "insights");
const outputPath = path.join(root, "lib", "generated", "image-dimensions.json");
const localRaster = /\/(?:images|brand|expo)\/[^\s"'`()?{}]+\.(?:jpe?g|png|webp)/gi;

function readImageDimensions(buffer) {
  if (
    buffer.length >= 24 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (buffer.length >= 10 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }

      const marker = buffer[offset + 1];
      if (marker === 0xd8 || marker === 0xd9) {
        offset += 2;
        continue;
      }

      const length = buffer.readUInt16BE(offset + 2);
      if (length < 2) break;
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        return {
          width: buffer.readUInt16BE(offset + 7),
          height: buffer.readUInt16BE(offset + 5)
        };
      }
      offset += 2 + length;
    }
  }

  if (
    buffer.length >= 30 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    const format = buffer.toString("ascii", 12, 16);
    if (format === "VP8X") {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3)
      };
    }
    if (format === "VP8L" && buffer[20] === 0x2f) {
      const bits = buffer.readUInt32LE(21);
      return {
        width: 1 + (bits & 0x3fff),
        height: 1 + ((bits >> 14) & 0x3fff)
      };
    }
    if (format === "VP8 ") {
      const frameHeader = buffer.indexOf(Buffer.from([0x9d, 0x01, 0x2a]), 20);
      if (frameHeader >= 0 && frameHeader + 7 <= buffer.length) {
        return {
          width: buffer.readUInt16LE(frameHeader + 3) & 0x3fff,
          height: buffer.readUInt16LE(frameHeader + 5) & 0x3fff
        };
      }
    }
  }

  return undefined;
}

const references = new Set();
for (const file of fs.readdirSync(contentDirectory).filter((name) => name.endsWith(".mdx"))) {
  const source = fs.readFileSync(path.join(contentDirectory, file), "utf8");
  for (const match of source.matchAll(localRaster)) references.add(match[0]);
}

const dimensions = {};
for (const reference of [...references].sort()) {
  const assetPath = path.join(root, "public", reference.slice(1));
  if (!fs.existsSync(assetPath)) continue;
  const size = readImageDimensions(fs.readFileSync(assetPath));
  if (!size) throw new Error(`Unable to read image dimensions: ${reference}`);
  dimensions[reference] = size;
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(dimensions, null, 2)}\n`);
console.log(`Generated dimensions for ${Object.keys(dimensions).length} article images.`);
