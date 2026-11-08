import assert from "node:assert/strict";
import test from "node:test";
import { decodeQuerySegment, encodeQuerySegment, listingPairs } from "../lib/queryRoute.ts";

test("listing query survives the round trip and ignores tracking keys", () => {
  const pairs = listingPairs(new URLSearchParams("utm_source=x&page=2&topic=products&_rsc=abc&category=robot-vacuums"));
  assert.deepEqual(pairs, [["category", "robot-vacuums"], ["page", "2"], ["topic", "products"]]);
  const segment = encodeQuerySegment(pairs);
  assert.match(segment, /^[A-Za-z0-9_-]+$/);
  assert.deepEqual(decodeQuerySegment(segment), { category: "robot-vacuums", page: "2", topic: "products" });
});

test("tracking-only or malformed queries read as no filter", () => {
  assert.deepEqual(listingPairs(new URLSearchParams("utm_campaign=a&gclid=b")), []);
  assert.deepEqual(decodeQuerySegment("%%%not-base64"), {});
  assert.deepEqual(decodeQuerySegment(encodeQuerySegment([["company", "Dreame & Co"]])), { company: "Dreame & Co" });
});
