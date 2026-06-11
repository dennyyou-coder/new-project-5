const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const outDir = __dirname;
const reviewDir = path.resolve(__dirname, "../../_review");
const W = 1600;
const H = 900;
const navy = "#071F3A";
const ink = "#0A2744";
const blue = "#1B6C8F";
const gold = "#F0C84B";
const pale = "#EAF2F7";
const line = "#C8D6E4";
const bg = "#F6F8FA";

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function svg(input) {
  return Buffer.from(input);
}

function wrap(text, size, width) {
  const max = Math.max(10, Math.floor(width / (size * 0.52)));
  const words = String(text).split(" ");
  const rows = [""];
  for (const word of words) {
    const trial = `${rows[rows.length - 1]} ${word}`.trim();
    if (trial.length > max && rows[rows.length - 1]) rows.push(word);
    else rows[rows.length - 1] = trial;
  }
  return rows;
}

function textBlock(text, x, y, opts = {}) {
  const size = opts.size || 50;
  const weight = opts.weight || 900;
  const width = opts.width || 650;
  const color = opts.color || ink;
  const lineHeight = opts.lineHeight || 1.12;
  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${wrap(text, size, width)
    .map((row, index) => `<tspan x="${x}" dy="${index ? size * lineHeight : 0}">${esc(row)}</tspan>`)
    .join("")}</text>`;
}

function frame(label, mode) {
  return `
    <rect width="${W}" height="${H}" fill="${bg}"/>
    <rect x="52" y="52" width="1496" height="796" fill="#FFFFFF"/>
    <rect x="52" y="52" width="1496" height="92" fill="${navy}"/>
    <text x="84" y="111" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
    <text x="1160" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${gold}" letter-spacing="2">${esc(mode)}</text>
    <rect x="92" y="188" width="${Math.max(172, label.length * 12)}" height="36" fill="${gold}"/>
    <text x="112" y="213" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">${esc(label)}</text>`;
}

function metric(x, y, w, label, value, fill = pale) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="86" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
    <text x="${x + 22}" y="${y + 32}" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${fill === gold ? navy : blue}">${esc(label)}</text>
    <text x="${x + 22}" y="${y + 68}" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="900" fill="${ink}">${esc(value)}</text>`;
}

function item(x, y, label, detail, active = false) {
  const fill = active ? gold : pale;
  return `
    <rect x="${x}" y="${y}" width="540" height="70" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
    <text x="${x + 24}" y="${y + 30}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${active ? navy : blue}">${esc(label)}</text>
    <text x="${x + 24}" y="${y + 56}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="${ink}">${esc(detail)}</text>`;
}

function stack(rows, x = 850, y = 286) {
  return rows.map((row, index) => item(x, y + index * 78, row[0], row[1], index === 0)).join("");
}

function matrix(rows, x = 820, y = 282) {
  return rows.map((row, index) => {
    const top = y + index * 84;
    return `
      <rect x="${x}" y="${top}" width="600" height="62" fill="${index === 0 ? gold : pale}" stroke="${index === 0 ? gold : line}"/>
      <text x="${x + 24}" y="${top + 39}" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="${ink}">${esc(row)}</text>`;
  }).join("");
}

async function render(file, body) {
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } })
    .composite([{ input: svg(`<svg width="${W}" height="${H}">${body}</svg>`), left: 0, top: 0 }])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, file));
}

async function makeCard(file, label, mode, title, subtitle, metrics, panelTitle, rows, footer, variant = "stack") {
  const body = `
    ${frame(label, mode)}
    ${textBlock(title, 92, 318, { size: 54, width: 710 })}
    ${textBlock(subtitle, 96, 494, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 170, metrics[0][0], metrics[0][1], gold)}
    ${metric(290, 680, 170, metrics[1][0], metrics[1][1])}
    ${metric(484, 680, 190, metrics[2][0], metrics[2][1])}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">${esc(panelTitle)}</text>
    ${variant === "matrix" ? matrix(rows) : stack(rows)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">${esc(footer)}</text>`;
  await render(file, body);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  await makeCard(
    "irobot-at-the-crossroads-image-015.jpg",
    "LEADER PRESSURE",
    "B MARKET ANALYSIS",
    "iRobot's Moat Narrows as Product Cycles Shift",
    "The article frames iRobot's problem as more than revenue pressure: product iteration, patents, channels and brand value are all being tested.",
    [["HOME BASE", "U.S."], ["MOAT", "Patent"], ["ASSET", "Brand"]],
    "PRESSURE MAP",
    [["Product gap", "LiDAR and all-in-one docks"], ["Patent defense", "SharkNinja challenge"], ["Category shift", "mop and full-function robots"], ["Remaining value", "brand and sales channels"], ["Strategic question", "where can iRobot still lead?"]],
    "WCB / IROBOT / CROSSROADS"
  );
  await makeCard(
    "irobot-uncertain-future-image-02.jpg",
    "OWNERSHIP RISK",
    "A BRAND ANALYSIS",
    "iRobot Loses Control of Its Own Destiny",
    "The article's core tension is integration risk: acquisition uncertainty, customer loss, capital pressure and marketing spend all collide.",
    [["WINDOW", "Short"], ["RISK", "Integration"], ["BATTLE", "Marketing"]],
    "DECISION STACK",
    [["Transaction", "regulatory and political risk"], ["Funding", "debt and capital pressure"], ["Integration", "3-5 year cycle"], ["OEM conflict", "top customers may leave"], ["Brand revival", "requires sustained spending"]],
    "WCB / IROBOT / OWNERSHIP RISK"
  );
  await makeCard(
    "ecovacs-at-a-crossroads-image-008.jpg",
    "SUCCESSION TEST",
    "C FOUNDER PROFILE",
    "Ecovacs Faces a Succession and Product Test",
    "The article links Ecovacs' crossroads to product judgment, Tineco's breakout, David Qian Cheng and a tougher robot-vacuum battle.",
    [["SIGNAL", "X1"], ["ENGINE", "Tineco"], ["TEST", "2022"]],
    "LEADERSHIP HANDOFF",
    [["Old question", "trading company or technology firm"], ["Founder vision", "spots new categories early"], ["Breakout", "hard floor washer cycle"], ["Successor", "robot vacuum business driver"], ["Crossroads", "robot + floor washer competition"]],
    "WCB / ECOVACS / SUCCESSION TEST"
  );
  await makeCard(
    "dyson-at-a-crossroads-image-012.jpg",
    "PREMIUM PRESSURE",
    "A BRAND ANALYSIS",
    "Dyson's Engineering Lead Meets Category Fragmentation",
    "The article argues that motor leadership is no longer enough when floor washers, robot vacuums and personal-care rivals change the market.",
    [["CORE", "DDM"], ["LIMIT", "Battery"], ["THREAT", "China"]],
    "PRESSURE POINTS",
    [["EV exit", "cost and category complexity"], ["Supply chain", "Southeast Asia disruption"], ["Motor edge", "limited by battery and cost"], ["Floor washers", "new premium category"], ["Personal care", "patent and rival pressure"]],
    "WCB / DYSON / CROSSROADS"
  );
  await makeCard(
    "dysons-anxiety-image-014.jpg",
    "BRAND ANXIETY",
    "E DATA VISUAL",
    "Premium Brands Start Competing on Specs",
    "The article contrasts experience-led branding with specification comparison, then explains why Dyson's premium position felt more exposed.",
    [["SHIFT", "Specs"], ["PRICE", "Premium"], ["RISK", "Erosion"]],
    "ANXIETY LADDER",
    [["Experience brand", "lifestyle and user feeling"], ["Spec comparison", "opens direct benchmarking"], ["Supply chain shock", "offline and Southeast Asia pressure"], ["EV retreat", "unfamiliar category risk"], ["Fragmentation", "new cleaning formats emerge"]],
    "WCB / DYSON / BRAND ANXIETY"
  );
  await makeCard(
    "dyson-new-product-push-premium-innovation-image-02.jpg",
    "PRODUCT WAVE",
    "B MARKET ANALYSIS",
    "Dyson Still Looks Different, But the Market Moves Faster",
    "The article reads Dyson's new product wave as a test of premium innovation against faster Chinese cleaning-appliance systems.",
    [["WAVE", "Refresh"], ["GAP", "Speed"], ["TEST", "Leadership"]],
    "PORTFOLIO SIGNALS",
    [["Cordless vacuum", "higher power, battery tradeoff"], ["PencilVac", "design statement"], ["Robot vacuum", "functionality catch-up"], ["Wash G1", "differentiated route"], ["Chinese rivals", "faster use-case expansion"]],
    "WCB / DYSON / PREMIUM INNOVATION"
  );

  const files = [
    "irobot-at-the-crossroads-image-015.jpg",
    "irobot-uncertain-future-image-02.jpg",
    "ecovacs-at-a-crossroads-image-008.jpg",
    "dyson-at-a-crossroads-image-012.jpg",
    "dysons-anxiety-image-014.jpg",
    "dyson-new-product-push-premium-innovation-image-02.jpg",
  ];
  const cards = [];
  for (let i = 0; i < files.length; i++) {
    const thumb = await sharp(path.join(outDir, files[i])).resize(390, 219).toBuffer();
    const x = 32 + (i % 3) * 430;
    const y = 32 + Math.floor(i / 3) * 318;
    cards.push({ input: thumb, left: x, top: y });
    cards.push({
      input: svg(`<svg width="410" height="78"><text x="16" y="42" font-family="Arial" font-size="18" font-weight="900" fill="${ink}">${esc(files[i])}</text></svg>`),
      left: x,
      top: y + 222,
    });
  }
  fs.mkdirSync(reviewDir, { recursive: true });
  await sharp({ create: { width: 1320, height: 690, channels: 3, background: bg } })
    .composite(cards)
    .jpeg({ quality: 92 })
    .toFile(path.join(reviewDir, "batch-2026-06-11-brand-pressure-review.jpg"));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
