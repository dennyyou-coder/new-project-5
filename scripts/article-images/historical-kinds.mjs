import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const HISTORICAL_KINDS = new Set(["photo", "chart", "graphic", "transparent"]);
export const VISUAL_ARCHIVE_SLUGS = new Set(["hundred-years-of-cleaning-appliance-history"]);

function classificationFailure(code, message, details = {}) {
  const error = new Error(`${code}: ${message}`);
  error.code = code;
  Object.assign(error, details);
  return error;
}

export function normalizedOutputHash(value) {
  if (typeof value !== "string") return null;
  const normalized = `sha256:${value.replace(/^sha256:/i, "").toLowerCase()}`;
  return /^sha256:[a-f0-9]{64}$/.test(normalized) ? normalized : null;
}

export function sha256File(file) {
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")}`;
}

export function readHistoricalKindClassifications(projectRoot) {
  const file = path.join(projectRoot, "scripts", "article-images", "historical-kind-classifications.json");
  if (!fs.existsSync(file)) return {};
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw classificationFailure(
      "INVALID_HISTORICAL_KIND_CLASSIFICATIONS",
      `cannot parse ${file}: ${error.message}`,
      { file }
    );
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || parsed.version !== 1
    || !parsed.assets || typeof parsed.assets !== "object" || Array.isArray(parsed.assets)) {
    throw classificationFailure(
      "INVALID_HISTORICAL_KIND_CLASSIFICATIONS",
      `${file} must contain version 1 and an assets object.`,
      { file }
    );
  }
  const classifications = {};
  for (const [url, entry] of Object.entries(parsed.assets)) {
    const outputHash = normalizedOutputHash(entry?.outputHash);
    if (!url.startsWith("/images/") || !entry || typeof entry !== "object" || Array.isArray(entry)
      || !HISTORICAL_KINDS.has(entry.kind) || !outputHash) {
      throw classificationFailure(
        "INVALID_HISTORICAL_KIND_CLASSIFICATIONS",
        `${file} has an invalid URL, kind, or outputHash for ${url}.`,
        { file, url }
      );
    }
    classifications[url] = { kind: entry.kind, outputHash };
  }
  return classifications;
}

export function validateVisualArchiveEligibility({ slug, body = [], cover = null, classifications, actualHashes }) {
  if (!VISUAL_ARCHIVE_SLUGS.has(slug)) {
    throw classificationFailure(
      "VISUAL_ARCHIVE_NOT_ELIGIBLE",
      `${slug} is not an approved historical archive; visual_archive is restricted to an explicit slug allowlist.`,
      { slug }
    );
  }
  const uniqueBody = [...new Set(body.filter(Boolean))];
  if (uniqueBody.length <= 50) {
    throw classificationFailure(
      "VISUAL_ARCHIVE_NOT_ELIGIBLE",
      `${slug} requires more than 50 unique body images; actual ${uniqueBody.length}.`,
      { slug }
    );
  }
  const urls = [...new Set([cover, ...uniqueBody].filter(Boolean))];
  for (const url of urls) {
    const classification = classifications?.[url];
    const recordedHash = normalizedOutputHash(classification?.outputHash);
    if (!classification || !HISTORICAL_KINDS.has(classification.kind) || !recordedHash) {
      throw classificationFailure(
        "VISUAL_ARCHIVE_CLASSIFICATION_REQUIRED",
        `${slug} requires URL, kind, and current outputHash classification for ${url}.`,
        { slug, url }
      );
    }
    const actualHash = normalizedOutputHash(
      typeof actualHashes === "function" ? actualHashes(url) : actualHashes?.[url]
    );
    if (!actualHash || actualHash !== recordedHash) {
      throw classificationFailure(
        "VISUAL_ARCHIVE_CLASSIFICATION_STALE",
        `${slug} classification for ${url} records ${recordedHash}, but current primary is ${String(actualHash)}.`,
        { slug, url, recordedHash, actualHash }
      );
    }
  }
  return { budgetClass: "visual_archive", urls, bodyImageCount: uniqueBody.length };
}
