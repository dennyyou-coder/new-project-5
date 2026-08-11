import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import {
  IMAGE_BUDGETS,
  MOBILE_MIN_SAVINGS_BYTES,
  MOBILE_MIN_SAVINGS_RATIO
} from "./config.mjs";

const COVER_RATIO = 16 / 9;
const COVER_RATIO_TOLERANCE = 0.02;
const EXPLICIT_COVER_CROP_RATIO_TOLERANCE = 0.005;
const PHOTO_ATTEMPTS = {
  desktop: [
    { longEdge: 1600, quality: 84 },
    { longEdge: 1600, quality: 80 },
    { longEdge: 1440, quality: 76 },
    { longEdge: 1280, quality: 72 }
  ],
  mobile: [
    { longEdge: 800, quality: 82 },
    { longEdge: 800, quality: 78 },
    { longEdge: 720, quality: 74 },
    { longEdge: 720, quality: 72 }
  ]
};
const GRAPHIC_LONG_EDGE = { desktop: 1600, mobile: 800 };
const HISTORICAL_PROGRESSIVE_SCALES = [0.99, 0.98, 0.96];
const DEEP_PHOTO_LONG_EDGE_CAPS = {
  desktop: new Set([1120, 960, 800]),
  mobile: new Set([680, 640, 560, 480, 390])
};

function sha256(buffer) {
  return `sha256:${crypto.createHash("sha256").update(buffer).digest("hex")}`;
}

function sourceFilename(input, filename) {
  if (filename) return filename;
  return typeof input === "string" ? path.basename(input) : "buffer-input";
}

function roleLimit(role, viewport) {
  const budget = IMAGE_BUDGETS[role];
  if (typeof budget === "number") return budget;
  if (budget?.[viewport]) return budget[viewport];
  throw new Error(`Unknown article image role: ${role}`);
}

async function sourceBuffer(input) {
  return Buffer.isBuffer(input) ? input : fs.readFile(input);
}

async function orientedMetadata(input) {
  const metadata = await sharp(input).metadata();
  const swapsAxes = [5, 6, 7, 8].includes(metadata.orientation);
  return {
    ...metadata,
    width: swapsAxes ? metadata.height : metadata.width,
    height: swapsAxes ? metadata.width : metadata.height
  };
}

function explicitCrop(crop, dimensions) {
  if (!crop) return null;
  const normalized = {
    left: Math.round(crop.left),
    top: Math.round(crop.top),
    width: Math.round(crop.width),
    height: Math.round(crop.height)
  };
  if (
    Object.values(normalized).some((value) => !Number.isInteger(value)) ||
    normalized.left < 0 ||
    normalized.top < 0 ||
    normalized.width < 1 ||
    normalized.height < 1 ||
    normalized.left + normalized.width > dimensions.width ||
    normalized.top + normalized.height > dimensions.height
  ) {
    throw new Error("Crop coordinates must describe a positive rectangle inside the oriented source.");
  }
  return normalized;
}

function focalPointCrop(focalPoint, dimensions) {
  if (!focalPoint) return null;
  const { x, y } = focalPoint;
  if (![x, y].every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) {
    throw new Error("Approved focal point coordinates must be normalized between 0 and 1.");
  }

  let width = dimensions.width;
  let height = Math.round(width / COVER_RATIO);
  if (height > dimensions.height) {
    height = dimensions.height;
    width = Math.round(height * COVER_RATIO);
  }
  const left = Math.max(0, Math.min(dimensions.width - width, Math.round(x * dimensions.width - width / 2)));
  const top = Math.max(0, Math.min(dimensions.height - height, Math.round(y * dimensions.height - height / 2)));
  return { left, top, width, height };
}

function coverReview({ input, filename, slug, dimensions, crop, focalPoint }) {
  if (crop || focalPoint) return null;
  const sourceRatio = dimensions.width / dimensions.height;
  if (Math.abs(sourceRatio / COVER_RATIO - 1) <= COVER_RATIO_TOLERANCE) return null;
  return {
    ok: false,
    code: "COVER_CROP_REVIEW_REQUIRED",
    slug: slug ?? null,
    filename: sourceFilename(input, filename),
    sourceRatio,
    targetRatio: COVER_RATIO,
    recommendedAction: "Provide explicit crop coordinates or an approved focal point."
  };
}

function imagePipeline(input, crop, longEdge) {
  let pipeline = sharp(input).autoOrient().toColourspace("srgb");
  if (crop) pipeline = pipeline.extract(crop);
  return pipeline.resize({
    width: longEdge,
    height: longEdge,
    fit: "inside",
    withoutEnlargement: true
  });
}

function encoder(pipeline, format, quality) {
  if (format === "webp") return pipeline.webp({ quality, effort: 6, alphaQuality: 100 });
  if (format === "jpeg") return pipeline.jpeg({ quality, mozjpeg: true });
  if (format === "png") return pipeline.png({ compressionLevel: 9, effort: 10 });
  throw new Error(`Unsupported article image output format: ${format}`);
}

async function encodeCandidate({ input, crop, longEdge, format, quality }) {
  const buffer = await encoder(imagePipeline(input, crop, longEdge), format, quality).toBuffer();
  const metadata = await sharp(buffer).metadata();
  return {
    ok: true,
    buffer,
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    colourSpace: metadata.space,
    hasAlpha: metadata.hasAlpha,
    bytes: buffer.byteLength,
    quality,
    longEdge,
    outputHash: sha256(buffer),
    warnings: []
  };
}

function publicAttempt(candidate) {
  const attempt = {
    longEdge: candidate.longEdge,
    quality: candidate.quality,
    format: candidate.format,
    bytes: candidate.bytes
  };
  if (candidate.fallbackScale) attempt.fallbackScale = candidate.fallbackScale;
  return attempt;
}

async function historicalProgressiveCandidate({
  options,
  viewport,
  crop,
  dimensions,
  format,
  quality,
  limit,
  candidates,
  accept = () => true
}) {
  if (!options.historicalProgressiveFallback) return null;
  const currentLongEdge = Math.min(
    Math.max(crop?.width ?? dimensions.width, crop?.height ?? dimensions.height),
    viewport === "desktop" ? 1280 : 720
  );
  for (const fallbackScale of HISTORICAL_PROGRESSIVE_SCALES) {
    const longEdge = Math.max(1, Math.floor(currentLongEdge * fallbackScale));
    const candidate = await encodeCandidate({
      input: options.input,
      crop,
      longEdge,
      format,
      quality
    });
    candidate.fallbackScale = fallbackScale;
    candidates.push(candidate);
    if (candidate.bytes <= limit && accept(candidate)) {
      candidate.attempts = candidates.map(publicAttempt);
      return candidate;
    }
  }
  return null;
}

function budgetFailure({ candidates, input, filename, slug, role, limit }) {
  const smallest = candidates.reduce((best, candidate) => candidate.bytes < best.bytes ? candidate : best);
  const recommendedAction = role === "chart"
    ? "Simplify the chart or provide a manually optimized source without reducing quality below 72."
    : "Provide a manually optimized source without reducing quality below 72.";
  return {
    ok: false,
    code: "IMAGE_BUDGET_EXCEEDED",
    slug: slug ?? null,
    filename: sourceFilename(input, filename),
    actualBytes: smallest.bytes,
    limit,
    recommendedAction,
    attempts: candidates.map(publicAttempt),
    warnings: []
  };
}

async function photoVariant(options, viewport, crop, limit, dimensions) {
  const format = options.outputFormat ?? "webp";
  const candidates = [];
  if (options.photoLongEdgeCap !== undefined) {
    if (!DEEP_PHOTO_LONG_EDGE_CAPS[viewport].has(options.photoLongEdgeCap)) {
      throw new Error(`Unsupported ${viewport} deep-photo long-edge cap: ${options.photoLongEdgeCap}`);
    }
    const candidate = await encodeCandidate({
      input: options.input,
      crop,
      longEdge: options.photoLongEdgeCap,
      format,
      quality: format === "png" ? 100 : 72
    });
    candidates.push(candidate);
    if (candidate.bytes <= limit) {
      candidate.attempts = candidates.map(publicAttempt);
      return candidate;
    }
    return budgetFailure({ ...options, candidates, limit });
  }
  for (const attempt of PHOTO_ATTEMPTS[viewport]) {
    const candidate = await encodeCandidate({
      input: options.input,
      crop,
      longEdge: attempt.longEdge,
      format,
      quality: format === "png" ? 100 : attempt.quality
    });
    candidates.push(candidate);
    if (candidate.bytes <= limit) {
      candidate.attempts = candidates.map(publicAttempt);
      return candidate;
    }
  }
  const fallback = await historicalProgressiveCandidate({
    options,
    viewport,
    crop,
    dimensions,
    format,
    quality: format === "png" ? 100 : PHOTO_ATTEMPTS[viewport].at(-1).quality,
    limit,
    candidates
  });
  if (fallback) return fallback;
  return budgetFailure({ ...options, candidates, limit });
}

async function graphicVariant(options, viewport, crop, limit, dimensions) {
  const longEdge = GRAPHIC_LONG_EDGE[viewport];
  const requestedFormat = options.outputFormat;
  const candidates = [];
  const addSafeCandidates = async () => {
    const webp = await encodeCandidate({
      input: options.input,
      crop,
      longEdge,
      format: "webp",
      quality: 90
    });
    const png = await encodeCandidate({
      input: options.input,
      crop,
      longEdge,
      format: "png",
      quality: 100
    });
    candidates.push(webp, png);
  };

  if (options.role === "chart" && options.preserveOutputFormat && requestedFormat) {
    candidates.push(await encodeCandidate({
      input: options.input,
      crop,
      longEdge,
      format: requestedFormat,
      quality: requestedFormat === "png" ? 100 : 90
    }));
  } else if (options.role === "chart") {
    await addSafeCandidates();
  } else if (requestedFormat) {
    candidates.push(await encodeCandidate({
      input: options.input,
      crop,
      longEdge,
      format: requestedFormat,
      quality: requestedFormat === "png" ? 100 : 90
    }));
  } else if (options.kind === "transparent" || options.role === "transparent") {
    candidates.push(await encodeCandidate({
      input: options.input,
      crop,
      longEdge,
      format: "png",
      quality: 100
    }));
  } else {
    await addSafeCandidates();
  }

  const source = await sharp(options.input).metadata();
  const sourceHasTransparency = source.hasAlpha && !(await sharp(options.input).stats()).isOpaque;
  const eligible = candidates.filter((candidate) => {
    if (sourceHasTransparency && !candidate.hasAlpha) return false;
    if (candidate.format === "png") {
      const webp = candidates.find((item) => item.format === "webp");
      return !webp || candidate.bytes < webp.bytes || (sourceHasTransparency && !webp.hasAlpha);
    }
    return true;
  });
  const accepted = eligible
    .filter((candidate) => candidate.bytes <= limit)
    .sort((left, right) => left.bytes - right.bytes)[0];
  if (accepted) {
    accepted.attempts = candidates.map(publicAttempt);
    return accepted;
  }
  if (options.preserveOutputFormat && requestedFormat) {
    const fallback = await historicalProgressiveCandidate({
      options,
      viewport,
      crop,
      dimensions,
      format: requestedFormat,
      quality: requestedFormat === "png" ? 100 : 90,
      limit,
      candidates,
      accept: (candidate) => !sourceHasTransparency || candidate.hasAlpha
    });
    if (fallback) return fallback;
  }
  const finalEligible = candidates.filter((candidate) => !sourceHasTransparency || candidate.hasAlpha);
  return budgetFailure({ ...options, candidates: finalEligible.length ? finalEligible : candidates, limit });
}

async function createVariant(options, viewport) {
  if (!options?.input) throw new Error("Article image transform requires an input path or Buffer.");
  const dimensions = await orientedMetadata(options.input);
  if (options.role === "cover" && !options.preserveCrop) {
    const review = coverReview({ ...options, dimensions });
    if (review) return review;
  }
  const crop = explicitCrop(options.crop, dimensions) ?? focalPointCrop(options.focalPoint, dimensions);
  if (options.role === "cover" && options.crop && Math.abs((crop.width / crop.height) / COVER_RATIO - 1) > EXPLICIT_COVER_CROP_RATIO_TOLERANCE) {
    return {
      ok: false,
      code: "COVER_CROP_RATIO_INVALID",
      slug: options.slug ?? null,
      filename: sourceFilename(options.input, options.filename),
      sourceRatio: crop.width / crop.height,
      targetRatio: COVER_RATIO,
      recommendedAction: "Adjust the explicit cover crop rectangle to a 16:9 ratio (within 0.5%)."
    };
  }
  const configuredLimit = roleLimit(options.role, viewport);
  const limit = options.limitBytes === undefined
    ? configuredLimit
    : Math.min(options.limitBytes, configuredLimit);
  const isGraphic = options.kind === "graphic" || options.kind === "transparent" || options.role === "chart" || options.role === "transparent";
  return isGraphic
    ? graphicVariant(options, viewport, crop, limit, dimensions)
    : photoVariant(options, viewport, crop, limit, dimensions);
}

export async function inspectSource(sourcePath) {
  const buffer = await fs.readFile(sourcePath);
  const metadata = await sharp(buffer).metadata();
  return {
    path: sourcePath,
    sourceHash: sha256(buffer),
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    colourSpace: metadata.space,
    hasAlpha: metadata.hasAlpha,
    orientation: metadata.orientation,
    bytes: buffer.byteLength
  };
}

export function createDesktopVariant(options) {
  return createVariant(options, "desktop");
}

export function createMobileVariant(options) {
  return createVariant(options, "mobile");
}

export function shouldKeepMobileVariant({ desktopBytes, mobileBytes, desktopWidth, mobileWidth }) {
  if (!Number.isFinite(desktopWidth) || !Number.isFinite(mobileWidth) || mobileWidth >= desktopWidth) return false;
  const savings = desktopBytes - mobileBytes;
  return savings >= MOBILE_MIN_SAVINGS_BYTES || savings / desktopBytes >= MOBILE_MIN_SAVINGS_RATIO;
}

export async function transformAsset(options) {
  const inputBuffer = await sourceBuffer(options.input);
  const sourceMetadata = await sharp(inputBuffer).metadata();
  const source = {
    path: typeof options.input === "string" ? options.input : null,
    sourceHash: sha256(inputBuffer),
    width: sourceMetadata.width,
    height: sourceMetadata.height,
    format: sourceMetadata.format,
    colourSpace: sourceMetadata.space,
    hasAlpha: sourceMetadata.hasAlpha,
    orientation: sourceMetadata.orientation,
    bytes: inputBuffer.byteLength
  };
  const variantOptions = { ...options, input: inputBuffer, filename: sourceFilename(options.input, options.filename) };
  const desktop = await createDesktopVariant(variantOptions);
  if (!desktop.ok) return { ...desktop, source };
  const mobile = await createMobileVariant(variantOptions);
  if (!mobile.ok) return { ...mobile, source, desktop };

  const warnings = [...desktop.warnings, ...mobile.warnings];
  const result = { ok: true, source, desktop, warnings };
  if (shouldKeepMobileVariant({
    desktopBytes: desktop.bytes,
    mobileBytes: mobile.bytes,
    desktopWidth: desktop.width,
    mobileWidth: mobile.width
  })) {
    result.mobile = mobile;
  } else {
    result.warnings.push("MOBILE_VARIANT_DISCARDED_INSUFFICIENT_SAVINGS");
  }
  return result;
}
