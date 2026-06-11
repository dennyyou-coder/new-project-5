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
const teal = "#23858F";
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

function row(x, y, label, detail, fill = pale) {
  return `
    <rect x="${x}" y="${y}" width="540" height="68" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
    <text x="${x + 24}" y="${y + 30}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${fill === gold ? navy : blue}">${esc(label)}</text>
    <text x="${x + 24}" y="${y + 55}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="${ink}">${esc(detail)}</text>`;
}

function chip(x, y, label, active = false) {
  const fill = active ? gold : pale;
  return `
    <rect x="${x}" y="${y}" width="172" height="56" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
    <text x="${x + 22}" y="${y + 36}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="900" fill="${active ? navy : ink}">${esc(label)}</text>`;
}

function stack(items, x, y) {
  return items.map((item, index) => {
    const top = y + index * 78;
    return row(x, top, item[0], item[1], index === 0 ? gold : pale);
  }).join("");
}

async function render(file, body) {
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } })
    .composite([{ input: svg(`<svg width="${W}" height="${H}">${body}</svg>`), left: 0, top: 0 }])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, file));
}

async function portfolio() {
  const body = `
    ${frame("PORTFOLIO RESET", "B MARKET ANALYSIS")}
    ${textBlock("Power Tool Brands Reshape Around Platforms", 92, 318, { size: 55, width: 720 })}
    ${textBlock("The article tracks a portfolio cycle: acquire related assets, exit non-core businesses, deepen battery OPE and rebalance manufacturing footprints.", 96, 492, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 170, "SIGNAL", "Reshape", gold)}
    ${metric(290, 680, 170, "CORE", "Platforms")}
    ${metric(484, 680, 190, "RISK", "Footprint")}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">STRATEGIC MOVES</text>
    ${stack([
      ["Makita", "adds Panasonic power-tool assets"],
      ["Stanley B+D", "sells non-core aerospace asset"],
      ["Chervon / EGO", "battery OPE growth with pressure"],
      ["TTI", "Milwaukee + Ryobi platform split"],
      ["Suppliers", "tariff-resilient manufacturing"]
    ], 850, 286)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / POWER TOOLS / PORTFOLIO STRATEGY</text>`;
  await render("global-power-tool-brands-reshaping-portfolios-image-02.jpg", body);
}

async function specialization() {
  const body = `
    ${frame("CORDLESS CYCLE", "B MARKET ANALYSIS")}
    ${textBlock("Cordless Moves From Tool Replacement to Workflow Control", 92, 318, { size: 53, width: 720 })}
    ${textBlock("The article's core point is that the next power-tool cycle is trade-specific: HVACR, concrete, demolition, dust control and service workflows.", 96, 500, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 170, "FIRST STAGE", "General tools", gold)}
    ${metric(290, 680, 170, "NEXT STAGE", "Trades")}
    ${metric(484, 680, 190, "LOCK-IN", "Battery")}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">JOB-SITE CONTROL MAP</text>
    ${chip(850, 296, "Battery", true)}
    ${chip(1042, 296, "Charger")}
    ${chip(1234, 296, "Storage")}
    ${chip(850, 382, "HVACR")}
    ${chip(1042, 382, "Concrete")}
    ${chip(1234, 382, "Dust")}
    ${chip(850, 468, "Service")}
    ${chip(1042, 468, "Safety")}
    ${chip(1234, 468, "Warranty")}
    <path d="M936 352 L936 382 M1128 352 L1128 382 M1320 352 L1320 382 M936 438 L936 468 M1128 438 L1128 468 M1320 438 L1320 468" stroke="${teal}" stroke-width="5"/>
    <rect x="850" y="574" width="556" height="76" fill="${navy}"/>
    <text x="880" y="622" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="900" fill="#FFFFFF">The platform owns the workflow.</text>
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / POWER TOOLS / CORDLESS SPECIALIZATION</text>`;
  await render("power-tools-new-cycle-cordless-specialization-image-02.jpg", body);
}

async function lithium() {
  const body = `
    ${frame("BATTERY PLATFORM", "E DATA VISUAL")}
    ${textBlock("Lithium Batteries Turn Tools Into Platforms", 92, 318, { size: 55, width: 720 })}
    ${textBlock("The article connects vacuum cleaners and power tools through the same battery logic: cells, BMS, interchangeable packs and platform lock-in.", 96, 500, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 170, "CELL", "18650", gold)}
    ${metric(290, 680, 170, "SYSTEM", "BMS")}
    ${metric(484, 680, 190, "PLATFORM", "12V / 18V")}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">VALUE CHAIN LOGIC</text>
    ${stack([
      ["Cells", "energy density and safety"],
      ["BMS", "monitoring and protection"],
      ["Pack", "shared battery economics"],
      ["Tool", "vacuum or power-tool use case"],
      ["User", "repeat purchase within platform"]
    ], 850, 286)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / LITHIUM BATTERY / VACUUMS + POWER TOOLS</text>`;
  await render("lithium-batteries-in-vacuums-and-power-tools-image-021.jpg", body);
}

async function review() {
  const files = [
    "global-power-tool-brands-reshaping-portfolios-image-02.jpg",
    "power-tools-new-cycle-cordless-specialization-image-02.jpg",
    "lithium-batteries-in-vacuums-and-power-tools-image-021.jpg",
  ];
  const cards = [];
  for (let i = 0; i < files.length; i++) {
    const thumb = await sharp(path.join(outDir, files[i])).resize(560, 315).toBuffer();
    const x = 32 + (i % 2) * 610;
    const y = 32 + Math.floor(i / 2) * 400;
    cards.push({ input: thumb, left: x, top: y });
    cards.push({
      input: svg(`<svg width="590" height="70"><text x="24" y="44" font-family="Arial" font-size="20" font-weight="900" fill="${ink}">${esc(files[i])}</text></svg>`),
      left: x,
      top: y + 318,
    });
  }
  fs.mkdirSync(reviewDir, { recursive: true });
  await sharp({ create: { width: 1250, height: 830, channels: 3, background: bg } })
    .composite(cards)
    .jpeg({ quality: 92 })
    .toFile(path.join(reviewDir, "batch-2026-06-11-power-tool-platform-review.jpg"));
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  await portfolio();
  await specialization();
  await lithium();
  await review();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
