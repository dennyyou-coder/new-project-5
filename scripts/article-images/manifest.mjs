const assetFields = [
  "role",
  "kind",
  "width",
  "height",
  "bytes",
  "format",
  "quality"
];

function normalizeHash(value, field, url) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Manifest asset ${url} has an invalid ${field}`);
  }
  return `sha256:${value.trim().replace(/^sha256:/i, "").toLowerCase()}`;
}

function manifestAsset(url, processed) {
  if (!processed || typeof processed !== "object") {
    throw new Error(`Missing processed asset for ${url}`);
  }

  const asset = {};
  for (const field of assetFields) {
    if (processed[field] === undefined) {
      throw new Error(`Manifest asset ${url} is missing ${field}`);
    }
    asset[field] = processed[field];
  }
  asset.sourceHash = normalizeHash(processed.sourceHash, "sourceHash", url);
  asset.outputHash = normalizeHash(processed.outputHash, "outputHash", url);

  if (processed.mobile) {
    const { src, width, height, bytes } = processed.mobile;
    if (![src, width, height, bytes].every((value) => value !== undefined)) {
      throw new Error(`Manifest asset ${url} has an incomplete mobile variant`);
    }
    asset.mobile = {
      src,
      width,
      height,
      bytes,
      outputHash: normalizeHash(processed.mobile.outputHash, "mobile.outputHash", url)
    };
  }

  return asset;
}

export function buildManifest({ inventory, processedAssets, processorVersion }) {
  const assets = {};
  for (const url of Object.keys(inventory.assets ?? {}).sort()) {
    assets[url] = manifestAsset(url, processedAssets?.[url]);
  }

  const articles = {};
  for (const slug of Object.keys(inventory.articles ?? {}).sort()) {
    const article = inventory.articles[slug];
    articles[slug] = {
      budgetClass: article.budgetClass,
      cover: article.cover,
      body: [...article.body]
    };
  }

  return {
    version: 1,
    processorVersion: String(processorVersion),
    assets,
    articles
  };
}

export function serializeManifest(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}
