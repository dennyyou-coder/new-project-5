import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTACT_INQUIRIES,
  SOURCING_CATEGORIES
} from "../lib/inquiryConversion.ts";

test("defines six unique tracked sourcing categories", () => {
  assert.equal(SOURCING_CATEGORIES.length, 6);
  assert.equal(new Set(SOURCING_CATEGORIES.map((item) => item.value)).size, 6);
  for (const item of SOURCING_CATEGORIES) {
    assert.match(item.ctaLocation, /^sourcing_category_/);
    assert.equal("href" in item, false);
  }
});

test("defines one tracked route for each Contact intent", () => {
  assert.deepEqual(
    CONTACT_INQUIRIES.map(({ value, form }) => [value, form]),
    [
      ["sourcing", "sourcing"],
      ["expo", "expo"],
      ["media", "contact"],
      ["general", "contact"]
    ]
  );
  assert.equal(
    new Set(CONTACT_INQUIRIES.map((item) => item.ctaLocation)).size,
    4
  );
});
