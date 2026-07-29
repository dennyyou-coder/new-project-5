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

test("public company index excludes channels, component suppliers, and secondary companies", () => {
  const available = getAvailableCompanyKeywords([
    { title: "Aiper Expands Its Pool Robot Line", tags: ["Aiper"] },
    { title: "Tineco Builds the Floor Washer Category", tags: ["Tineco"] },
    { title: "Amazon as a Sales Channel", tags: ["Amazon"] },
    { title: "Benewake Supplies Underwater LiDAR", tags: ["Benewake"] },
    { title: "EAI Navigation Components", tags: ["EAI"] },
    { title: "Insta360 Enters Consumer Robotics", tags: ["Insta360"] },
    { title: "Midea Expands Its Appliance Portfolio", tags: ["Midea"] }
  ]);

  assert.deepEqual(
    available.map((keyword) => keyword.value),
    ["aiper", "tineco"]
  );
});

test("public company index includes the primary robotic mower brands without duplicate Sunseeker labels", () => {
  const available = getAvailableCompanyKeywords([
    { title: "Navimow Robot Mower Roadmap", tags: ["Segway Navimow"] },
    { title: "Mammotion Expands LUBA", tags: ["Mammotion"] },
    { title: "Husqvarna Automower Strategy", tags: ["Husqvarna"] },
    { title: "Sunseekers Robot Mower Review", tags: ["sunseekers"] },
    { title: "RockMow Enters Robotic Mowers", tags: ["RockMow"] },
    { title: "WORX Landroid Product Line", tags: ["WORX"] },
    { title: "MOVA Enters Robotic Mowers", tags: ["MOVA"] },
    { title: "Kress Robotic Mower Channels", tags: ["Kress"] },
    { title: "Greenworks Expands Autonomous Mowers", tags: ["Greenworks"] }
  ]);

  assert.deepEqual(
    available.map((keyword) => keyword.label),
    [
      "Greenworks",
      "Husqvarna",
      "Kress",
      "Mammotion",
      "MOVA",
      "Navimow",
      "RockMow",
      "Sunseeker",
      "WORX"
    ]
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
