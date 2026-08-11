import fs from "node:fs";

const SVG_PREFIX_BYTES = 64 * 1024;

function numericAttribute(source, name) {
  const raw = source.match(new RegExp(`\\b${name}=["']\\s*([0-9]+(?:\\.[0-9]+)?)(?:px)?\\s*["']`, "i"))?.[1];
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function skipDoctype(source) {
  let quote = null;
  let subsetDepth = 0;
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === quote) quote = null;
    } else if (character === '"' || character === "'") quote = character;
    else if (character === "[") subsetDepth += 1;
    else if (character === "]") subsetDepth = Math.max(0, subsetDepth - 1);
    else if (character === ">" && subsetDepth === 0) return source.slice(index + 1);
  }
  return null;
}

function openingRootSvg(source) {
  let remainder = source.replace(/^\uFEFF/, "").trimStart();
  while (true) {
    if (remainder.startsWith("<?")) {
      const end = remainder.indexOf("?>");
      if (end < 0) return null;
      remainder = remainder.slice(end + 2).trimStart();
      continue;
    }
    if (remainder.startsWith("<!--")) {
      const end = remainder.indexOf("-->");
      if (end < 0) return null;
      remainder = remainder.slice(end + 3).trimStart();
      continue;
    }
    if (/^<!doctype\b/i.test(remainder)) {
      remainder = skipDoctype(remainder);
      if (remainder === null) return null;
      remainder = remainder.trimStart();
      continue;
    }
    break;
  }
  if (!/^<svg(?:\s|\/?>)/i.test(remainder)) return null;
  const end = remainder.indexOf(">");
  return end < 0 ? null : remainder.slice(0, end + 1);
}

export function svgIntrinsicDimensions(input) {
  const buffer = Buffer.isBuffer(input) ? input : fs.readFileSync(input);
  const source = buffer.toString("utf8", 0, Math.min(buffer.length, SVG_PREFIX_BYTES));
  const root = openingRootSvg(source);
  if (!root) return null;
  let width = numericAttribute(root, "width");
  let height = numericAttribute(root, "height");
  const viewBox = root.match(/\bviewBox=["']\s*[-+0-9.e]+\s+[-+0-9.e]+\s+([-+0-9.e]+)\s+([-+0-9.e]+)\s*["']/i);
  if (!width) width = Number(viewBox?.[1]);
  if (!height) height = Number(viewBox?.[2]);
  if (!(Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0)) return null;
  return { width, height };
}
