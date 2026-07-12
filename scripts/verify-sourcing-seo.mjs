import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const failures = [];
const liveRoutes = ["/sourcing/lawn-robots", "/sourcing/pool-robots"];
const forbiddenRoutes = [
  "/sourcing/floor-washers",
  "/sourcing/robotic-vacuums",
  "/sourcing/commercial-cleaning",
  "/sourcing/vacuum-cleaners"
];

function requireValue(condition, message) {
  if (!condition) failures.push(message);
}

async function readPage(route) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "follow" });
  return { response, html: await response.text() };
}

for (const route of liveRoutes) {
  const { response, html } = await readPage(route);
  requireValue(response.status === 200, `${route}: expected 200, received ${response.status}`);
  requireValue((html.match(/<h1\b/g) || []).length === 1, `${route}: expected one h1`);
  requireValue(html.includes(`<link rel="canonical" href="https://worldcleanbiz.com${route}"`), `${route}: missing self canonical`);
  requireValue(/<meta name="description" content="[^"]+"/.test(html), `${route}: missing description`);
  requireValue(html.includes('name="robots" content="index, follow"'), `${route}: missing index, follow`);
  requireValue(html.includes('"@type":"Service"'), `${route}: missing Service schema`);
  requireValue(html.includes('"@type":"BreadcrumbList"'), `${route}: missing BreadcrumbList schema`);
}

const lawn = await readPage("/sourcing/lawn-robots");
const pool = await readPage("/sourcing/pool-robots");
for (const value of [
  "Choose the Market Opportunity Before You Choose the Factory",
  "Explore the Product Opportunities",
  "Test My Product Thesis",
  "Inside the cleaning industry since 2006",
  "Where the Six Product Platforms Compete",
  "Four Decisions Before You Back a Platform"
]) {
  requireValue(lawn.html.includes(value), `/sourcing/lawn-robots: missing ${value}`);
}
requireValue(
  pool.html.includes("Robotic Pool Cleaner Manufacturers &amp; Sourcing in China"),
  "/sourcing/pool-robots: shared page presentation changed"
);
requireValue(
  !pool.html.includes("Choose the Right Robotic Mower Platform"),
  "/sourcing/pool-robots: lawn-only conversion content leaked"
);

const selectorSource = fs.readFileSync(path.join(process.cwd(), "components", "LawnRobotProductSelector.tsx"), "utf8");
for (const value of ["Request Suppliers for", "Use My Own Product Brief", "Product {selectedIndex + 1} of", "productId={selected.id}"]) {
  requireValue(selectorSource.includes(value), `selector: missing ${value}`);
}

const fullLandingSections = [
  "Choose the Market Opportunity Before You Choose the Factory",
  "Built for Buyers Deciding Where to Play in Robotic Mowers",
  "Six Product Platforms. Six Different Market Opportunities.",
  "Where the Six Product Platforms Compete",
  "Which Channels Fit Each Product Platform?",
  "Three Conditions That Decide Whether the Opportunity Can Scale",
  "Industry judgment behind the product decision",
  "Four Decisions Before You Back a Platform",
  "Which robotic mower segment offers the strongest opportunity for new market entrants?",
  "Turn a Market Opportunity Into a Product Brief",
  "Evaluate My Product Opportunity",
  "Related Intelligence"
];
for (const value of fullLandingSections) {
  requireValue(lawn.html.includes(value), `/sourcing/lawn-robots: missing full landing section ${value}`);
}
const sectionPositions = fullLandingSections.map((value) => lawn.html.indexOf(value));
requireValue(
  sectionPositions.every((position, index) => index === 0 || position > sectionPositions[index - 1]),
  "/sourcing/lawn-robots: full landing sections are out of order"
);
requireValue(
  !pool.html.includes("Built for Buyers Deciding Where to Play in Robotic Mowers"),
  "/sourcing/pool-robots: lawn buyer-fit content leaked"
);

for (const value of [
  "Market opportunity",
  "Why it can win",
  "Critical proof points",
  "Is the European market still led by premium products, or is it moving toward value models?",
  "Can vision-based robotic mowers replace boundary-wire products?",
  "When does RTK create real customer value rather than functioning as a marketing feature?",
  "Is there a meaningful market for AWD and slope-capable robotic mowers?",
  "Which product direction is most suitable for ecommerce and mass retail?",
  "Where can Chinese robotic mower suppliers still differentiate from established European brands?",
  "Which technical claims create the greatest sourcing risk?",
  "What separates a scalable robotic mower platform from a one-season product?",
  "What should buyers verify before committing to a product platform?"
]) {
  requireValue(lawn.html.includes(value), `/sourcing/lawn-robots: missing opportunity signal ${value}`);
}
for (const value of [
  "Questions buyers often ask before starting",
  "Do you disclose factory names publicly?",
  "What information should I prepare before contacting you?"
]) {
  requireValue(!lawn.html.includes(value), `/sourcing/lawn-robots: service-oriented FAQ remains ${value}`);
}

for (const value of [
  "World Clean Biz editorial assessment",
  "Accessible entry",
  "Premium product and service value",
  "Strong fit",
  "Conditional fit",
  "Retail",
  "Ecommerce",
  "Specialist dealer",
  "Private label",
  "Professional / project sales"
]) {
  requireValue(lawn.html.includes(value), `/sourcing/lawn-robots: missing hybrid visual content ${value}`);
}
for (const value of [
  "What You Need to Know Before Backing a Product Platform",
  "Turn the Opportunity Into a Testable Product Direction",
  "The Four Decisions Behind a Scalable Robotic Mower Program"
]) {
  requireValue(!lawn.html.includes(value), `/sourcing/lawn-robots: redundant text section remains ${value}`);
}
requireValue((lawn.html.match(/<details>/g) || []).length === 10, "/sourcing/lawn-robots: expected ten collapsed industry FAQs");
requireValue(!/<details open/.test(lawn.html), "/sourcing/lawn-robots: FAQ should be collapsed on initial load");
requireValue(!pool.html.includes("Where the Six Product Platforms Compete"), "/sourcing/pool-robots: lawn opportunity landscape leaked");

const decisionVisualSource = fs.existsSync(path.join(process.cwd(), "components", "LawnRobotDecisionVisuals.tsx"))
  ? fs.readFileSync(path.join(process.cwd(), "components", "LawnRobotDecisionVisuals.tsx"), "utf8")
  : "";
for (const productId of ["RM-01", "RM-02", "RM-03", "RM-04", "RM-05", "RM-06"]) {
  requireValue((decisionVisualSource.match(new RegExp(productId, "g")) || []).length >= 2, `decision visuals: ${productId} must appear in both landscape and matrix`);
}

const sourcingPageSource = fs.readFileSync(path.join(process.cwd(), "components", "SourcingProductPage.tsx"), "utf8");
const sourcingStyles = fs.readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
requireValue(
  sourcingPageSource.includes('isLawnRobotPage ? " sourcing-lawn-page" : ""'),
  "visual system: missing lawn-only page scope"
);
for (const token of ["--lawn-ink:", "--lawn-surface:", "--lawn-accent:", "--lawn-rule:"]) {
  requireValue(sourcingStyles.includes(token), `visual system: missing ${token}`);
}
for (const visualClass of ["sourcing-lawn-landscape", "sourcing-lawn-channel-matrix", "sourcing-lawn-success-grid", "sourcing-lawn-evidence-flow"]) {
  requireValue(
    sourcingStyles.includes(`.sourcing-lawn-page .${visualClass}`),
    `visual system: ${visualClass} is not lawn scoped`
  );
}
for (const className of [
  "sourcing-lawn-selector-workbench",
  "sourcing-lawn-selector-media",
  "sourcing-lawn-selector-summary",
  "sourcing-lawn-selector-evidence",
  "sourcing-lawn-selector-rail"
]) {
  requireValue(selectorSource.includes(className), `lawn selector: missing ${className}`);
  requireValue(sourcingStyles.includes(`.sourcing-lawn-page .${className}`), `lawn selector: ${className} is not lawn scoped`);
  const bareSelector = new RegExp(`(^|[}\\n])\\s*\\.${className}(?:[\\s,:.#>{+~]|\\{)`, "m");
  requireValue(!bareSelector.test(sourcingStyles), `lawn selector: unscoped ${className} rule found`);
}

const hub = await readPage("/sourcing");
for (const route of forbiddenRoutes) {
  requireValue(!hub.html.includes(`href="${route}"`), `/sourcing: broken link remains ${route}`);
}

const sourceFiles = ["lib/leadTracking.ts", "components/LeadForms.tsx"]
  .map((file) => path.join(process.cwd(), file))
  .filter(fs.existsSync);
const trackingSource = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
for (const eventName of ["cta_view", "cta_click", "form_open", "form_submit", "form_success"]) {
  requireValue(trackingSource.includes(eventName), `tracking: missing ${eventName}`);
}
for (const parameter of ["conversion_group", "form_type", "source_page", "cta_location", "inquiry_intent", "product_category", "product_id"]) {
  requireValue(trackingSource.includes(parameter), `tracking: missing ${parameter}`);
}

const insightDirectory = path.join(process.cwd(), "content", "insights");
const insightFiles = fs.readdirSync(insightDirectory).filter((file) => file.endsWith(".mdx"));
for (const route of liveRoutes) {
  const linkSources = insightFiles.filter((file) => fs.readFileSync(path.join(insightDirectory, file), "utf8").includes(`](${route})`));
  requireValue(linkSources.length >= 3, `${route}: expected links from at least 3 articles, received ${linkSources.length}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Sourcing SEO verification passed.");
