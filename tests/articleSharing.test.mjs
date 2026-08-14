import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  canUseNativeShare,
  copyArticleUrl,
  getArticleShareLinks,
  shareArticle
} from "../lib/articleSharing.ts";

const data = {
  title: "Pool robotics & the next market",
  url: "https://worldcleanbiz.com/blog/pool-robotics"
};

test("share links encode the canonical URL and title", () => {
  const links = getArticleShareLinks(data.title, data.url);
  assert.deepEqual(links.map(({ id }) => id), ["linkedin", "x", "facebook", "whatsapp"]);
  assert.ok(links.every(({ href }) => href.includes(encodeURIComponent(data.url))));
  assert.match(links.find(({ id }) => id === "x").href, /text=/);
  assert.match(links.find(({ id }) => id === "whatsapp").href, /text=/);
});

test("native share is exposed only when the browser accepts the payload", () => {
  assert.equal(canUseNativeShare({}, data), false);
  assert.equal(canUseNativeShare({ share: async () => {}, canShare: () => false }, data), false);
  assert.equal(canUseNativeShare({ share: async () => {}, canShare: () => true }, data), true);
});

test("native share distinguishes cancellation from failure", async () => {
  assert.equal(await shareArticle({ share: async () => {} }, data), "shared");
  assert.equal(await shareArticle({
    share: async () => { throw new DOMException("cancelled", "AbortError"); }
  }, data), "cancelled");
  assert.equal(await shareArticle({
    share: async () => { throw new Error("blocked"); }
  }, data), "failed");
});

test("copy falls back only when Clipboard API is unavailable or fails", async () => {
  const calls = [];
  assert.equal(await copyArticleUrl(data.url, {
    clipboard: { writeText: async (value) => calls.push(`clipboard:${value}`) },
    legacyCopy: () => { calls.push("legacy"); return true; }
  }), true);
  assert.deepEqual(calls, [`clipboard:${data.url}`]);

  assert.equal(await copyArticleUrl(data.url, {
    clipboard: { writeText: async () => { throw new Error("denied"); } },
    legacyCopy: (value) => { calls.push(`legacy:${value}`); return true; }
  }), true);
  assert.equal(calls.at(-1), `legacy:${data.url}`);
});

test("responsive sharing component contains the required accessibility contracts", async () => {
  const componentSource = await readFile(
    new URL("../components/ArticleShareActions.tsx", import.meta.url),
    "utf8"
  );

  assert.match(componentSource, /^"use client"/);
  assert.match(componentSource, /article-share-rail/);
  assert.match(componentSource, /article-share-mobile/);
  assert.match(componentSource, /aria-live="polite"/);
  assert.match(componentSource, /rel="noopener noreferrer"/);
  assert.match(componentSource, /canUseNativeShare/);
  assert.match(componentSource, /copyArticleUrl/);
});
