import assert from "node:assert/strict";
import test from "node:test";
import {
  ANALYSIS_COMPANY_KEYWORDS,
  filterArticlesByCompany,
  getAvailableCompanyKeywords,
  getCompanyKeyword
} from "../lib/companyKeywords.ts";

const articles = [
  { slug: "romo", title: "DJI ROMO Enters Floorcare", tags: ["DJI", "ROMO"] },
  { slug: "roomba", title: "How iRobot Is Rebuilding Roomba", tags: ["iRobot", "Roomba"] },
  { slug: "dyson", title: "Dyson at a Crossroads", tags: ["Dyson"] },
  { slug: "generic", title: "Robot Vacuum Market", tags: ["robot vacuum"] }
];

test("company registry keeps normalized labels and values unique", () => {
  const labels = ANALYSIS_COMPANY_KEYWORDS.map((keyword) => keyword.label);
  const values = ANALYSIS_COMPANY_KEYWORDS.map((keyword) => keyword.value);
  assert.equal(new Set(labels).size, labels.length);
  assert.equal(new Set(values).size, values.length);
});

test("available keywords contain only groups with matching analysis articles", () => {
  const available = getAvailableCompanyKeywords(articles);
  assert.deepEqual(
    available.map((keyword) => keyword.value),
    ["dji-romo", "dyson", "irobot-roomba"]
  );
});

test("aliases return a combined company result set", () => {
  const available = getAvailableCompanyKeywords(articles);
  const keyword = getCompanyKeyword("dji-romo", available);
  assert.ok(keyword);
  assert.deepEqual(
    filterArticlesByCompany(articles, keyword).map((article) => article.slug),
    ["romo"]
  );
});

test("invalid company values do not create an active filter", () => {
  const available = getAvailableCompanyKeywords(articles);
  assert.equal(getCompanyKeyword("not-a-company", available), undefined);
});
