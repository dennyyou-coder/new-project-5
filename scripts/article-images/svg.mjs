import fs from "node:fs";

const SVG_PREFIX_BYTES = 64 * 1024;

function numericAttribute(source, name) {
  const raw = source.match(new RegExp(`\\b${name}=["']\\s*([0-9]+(?:\\.[0-9]+)?)(?:px)?\\s*["']`, "i"))?.[1];
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function svgIntrinsicDimensions(input) {
  const buffer = Buffer.isBuffer(input) ? input : fs.readFileSync(input);
  const source = buffer.toString("utf8", 0, Math.min(buffer.length, SVG_PREFIX_BYTES));
  let width = numericAttribute(source, "width");
  let height = numericAttribute(source, "height");
  const viewBox = source.match(/\bviewBox=["']\s*[-+0-9.e]+\s+[-+0-9.e]+\s+([-+0-9.e]+)\s+([-+0-9.e]+)\s*["']/i);
  if (!width) width = Number(viewBox?.[1]);
  if (!height) height = Number(viewBox?.[2]);
  if (!(Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0)) return null;
  return { width, height };
}
