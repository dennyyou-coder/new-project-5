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

function row(x, y, label, detail, active = false) {
  const fill = active ? gold : pale;
  return `
    <rect x="${x}" y="${y}" width="540" height="70" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
    <text x="${x + 24}" y="${y + 30}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${active ? navy : blue}">${esc(label)}</text>
    <text x="${x + 24}" y="${y + 56}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="${ink}">${esc(detail)}</text>`;
}

function stack(rows, x = 850, y = 286) {
  return rows.map((item, index) => row(x, y + index * 78, item[0], item[1], index === 0)).join("");
}

async function render(file, body) {
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } })
    .composite([{ input: svg(`<svg width="${W}" height="${H}">${body}</svg>`), left: 0, top: 0 }])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, file));
}

async function card(file, label, mode, title, subtitle, metrics, panelTitle, rows, footer) {
  const body = `
    ${frame(label, mode)}
    ${textBlock(title, 92, 318, { size: 54, width: 640 })}
    ${textBlock(subtitle, 96, 494, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 170, metrics[0][0], metrics[0][1], gold)}
    ${metric(290, 680, 170, metrics[1][0], metrics[1][1])}
    ${metric(484, 680, 190, metrics[2][0], metrics[2][1])}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">${esc(panelTitle)}</text>
    ${stack(rows)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">${esc(footer)}</text>`;
  await render(file, body);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  await card(
    "anker-needs-a-hard-battle-image-005.jpg",
    "HARD BATTLE",
    "A BRAND ANALYSIS",
    "Eufy Must Prove Anker Can Fight Hard Hardware",
    "The article treats robot vacuums as Anker's capability test: channels and brand are useful, but product systems and organization decide the battle.",
    [["CATEGORY", "Robot"], ["TEST", "System"], ["GOAL", "Talent"]],
    "CAPABILITY GAP",
    [["Old advantage", "Amazon, brand, reviews"], ["New battlefield", "all-in-one robot systems"], ["Weak link", "smaller product organization"], ["Strategic value", "talent and robotics platform"], ["Real question", "routine SKU or priority battle"]],
    "WCB / ANKER / EUFY ROBOTICS"
  );
  await card(
    "anker-innovation-lacks-methodology-image-007.jpg",
    "METHOD GAP",
    "E DATA VISUAL",
    "Anker's Category Method Gap",
    "The article argues that VOC and Amazon efficiency were no longer enough once cleaning appliances became a high-investment, high-iteration category.",
    [["METHOD", "VOC"], ["LIMIT", "Category"], ["NEED", "Leader"]],
    "WHY THE METHOD FAILED",
    [["Early edge", "review-driven product iteration"], ["Industry shift", "competitors copied pain points"], ["Cleaning reality", "after-sales and dirty work"], ["Brand gap", "Eufy weaker than Anker"], ["New answer", "top category leaders"]],
    "WCB / ANKER / METHODOLOGY"
  );
  await card(
    "dji-is-running-out-of-time-image-02.jpg",
    "TIME WINDOW",
    "B MARKET ANALYSIS",
    "DJI Enters After the Robot Vacuum Curve Has Moved",
    "The article's tension is timing: each delay pushed DJI into a more mature market with stronger docks, lower prices and higher user expectations.",
    [["START", "2020"], ["TEAM", "300"], ["RISK", "Late"]],
    "SHIFTING BENCHMARK",
    [["First window", "self-cleaning mops"], ["Second window", "all-in-one dock"], ["Third window", "price war"], ["Current window", "AI and mechanical arms"], ["Launch risk", "missed sales season"]],
    "WCB / DJI / ROBOT VACUUM TIMING"
  );
  await card(
    "dji-romo-weaknesses-exposed-image-02.jpg",
    "PRODUCT REALITY",
    "A BRAND ANALYSIS",
    "ROMO Faces a Daily Product Test",
    "The article gives DJI credit for attention and refinement, but points to daily cleaning execution as the harder test.",
    [["BRAND", "DJI"], ["TEST", "Daily"], ["RISK", "Details"]],
    "WEAKNESS CHECKLIST",
    [["Highlight gap", "hard to find one selling point"], ["Pricing", "transparent shell premium"], ["Design risk", "visual similarity criticism"], ["Cleaning route", "dual-disc mop follower"], ["Basic function", "threshold crossing concern"]],
    "WCB / DJI ROMO / PRODUCT EXECUTION"
  );
  await card(
    "roborock-at-a-crossroads-image-005.jpg",
    "CROSSROADS",
    "B MARKET ANALYSIS",
    "Roborock's Early Advantages Became Harder to Defend",
    "The article explains Roborock's transition from early LiDAR and Xiaomi-driven advantage to a more crowded, faster, channel-intensive market.",
    [["EARLY EDGE", "LiDAR"], ["SHIFT", "2020"], ["PRESSURE", "Channels"]],
    "ADVANTAGE REVERSAL",
    [["Old environment", "iRobot priced high"], ["Old support", "Xiaomi supply and traffic"], ["Technology gap", "LiDAR became common"], ["New rivals", "Ecovacs, Narwal, Dreame"], ["Strategic risk", "weak marketing and founder distraction"]],
    "WCB / ROBOROCK / CROSSROADS"
  );
  await card(
    "narwal-revival-story-image-02.jpg",
    "REVIVAL CASE",
    "C FOUNDER PROFILE",
    "Narwal's Comeback Is a Product Rhythm Test",
    "The article reads Narwal as a startup that survived a dark period by regaining product rhythm, user trust and funding support.",
    [["PEAK", "2021"], ["TROUGH", "3 years"], ["RETURN", "J4"]],
    "REVIVAL FACTORS",
    [["Original edge", "self-cleaning category pioneer"], ["Mistake", "factory and product overreach"], ["Competitive shock", "all-in-one dock race"], ["Recovery base", "founder, users, funding"], ["Next test", "commercial execution"]],
    "WCB / NARWAL / REVIVAL"
  );
  await card(
    "laifen-hard-floor-washer-entry-strategy-image-002.jpg",
    "ENTRY STRATEGY",
    "B MARKET ANALYSIS",
    "Laifen Needs a Narrow Breakthrough in a Guarded Price Map",
    "The article maps hard floor washers as a crowded price battlefield where Laifen must avoid becoming another generic entrant.",
    [["TARGET", "1800-2000"], ["MOAT", "Base"], ["RISK", "Margin"]],
    "ENTRY LOGIC",
    [["Market leader", "Tineco defends all price bands"], ["Main battlefield", "1500-2000 price range"], ["Low-end risk", "cost and returns"], ["Possible wedge", "water and waste base station"], ["Laifen edge", "marketing and product finish"]],
    "WCB / LAIFEN / FLOOR WASHER ENTRY"
  );
  await card(
    "tineco-lacks-innovation-image-011.jpg",
    "INNOVATION EDGE",
    "A BRAND ANALYSIS",
    "Tineco's Market Judgment Is Stronger Than Its Technology Moat",
    "The article argues that Tineco caught a historic category wave, but its next curve depends on whether it can move beyond marketing-led product following.",
    [["WAVE", "2020"], ["MOAT", "Weak"], ["THREAT", "Dreame"]],
    "INNOVATION QUESTION",
    [["Growth trigger", "pandemic and live-stream commerce"], ["Product base", "hard floor washer wave"], ["Weakness", "limited core technology investment"], ["Follower risk", "Dyson-like and Bissell-like forms"], ["Future question", "next Dyson or next Ecovacs?"]],
    "WCB / TINECO / INNOVATION EDGE"
  );

  const files = [
    "anker-needs-a-hard-battle-image-005.jpg",
    "anker-innovation-lacks-methodology-image-007.jpg",
    "dji-is-running-out-of-time-image-02.jpg",
    "dji-romo-weaknesses-exposed-image-02.jpg",
    "roborock-at-a-crossroads-image-005.jpg",
    "narwal-revival-story-image-02.jpg",
    "laifen-hard-floor-washer-entry-strategy-image-002.jpg",
    "tineco-lacks-innovation-image-011.jpg",
  ];
  const cards = [];
  for (let i = 0; i < files.length; i++) {
    const thumb = await sharp(path.join(outDir, files[i])).resize(390, 219).toBuffer();
    const x = 28 + (i % 4) * 410;
    const y = 32 + Math.floor(i / 4) * 318;
    cards.push({ input: thumb, left: x, top: y });
    cards.push({
      input: svg(`<svg width="395" height="78"><text x="16" y="42" font-family="Arial" font-size="17" font-weight="900" fill="${ink}">${esc(files[i])}</text></svg>`),
      left: x,
      top: y + 222,
    });
  }
  fs.mkdirSync(reviewDir, { recursive: true });
  await sharp({ create: { width: 1680, height: 690, channels: 3, background: bg } })
    .composite(cards)
    .jpeg({ quality: 92 })
    .toFile(path.join(reviewDir, "batch-2026-06-11-challenger-strategy-review.jpg"));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
