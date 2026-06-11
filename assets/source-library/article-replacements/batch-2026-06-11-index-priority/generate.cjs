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
const muted = "#526A7E";
const bg = "#F6F8FA";

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function svg(input) {
  return Buffer.from(input);
}

function lines(text, size, width) {
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
  const size = opts.size || 48;
  const weight = opts.weight || 900;
  const width = opts.width || 620;
  const color = opts.color || ink;
  const lh = opts.lineHeight || 1.12;
  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${lines(text, size, width)
    .map((row, index) => `<tspan x="${x}" dy="${index ? size * lh : 0}">${esc(row)}</tspan>`)
    .join("")}</text>`;
}

function frame(label, mode) {
  return `
    <rect width="${W}" height="${H}" fill="${bg}"/>
    <rect x="52" y="52" width="1496" height="796" fill="#FFFFFF"/>
    <rect x="52" y="52" width="1496" height="92" fill="${navy}"/>
    <text x="84" y="111" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
    <text x="1160" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${gold}" letter-spacing="2">${esc(mode)}</text>
    <rect x="92" y="188" width="${Math.max(164, label.length * 12)}" height="36" fill="${gold}"/>
    <text x="112" y="213" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">${esc(label)}</text>`;
}

function metric(x, y, w, label, value, fill = pale) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="86" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
    <text x="${x + 22}" y="${y + 32}" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${fill === gold ? navy : blue}">${esc(label)}</text>
    <text x="${x + 22}" y="${y + 68}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="${ink}">${esc(value)}</text>`;
}

function ladder(items, x, y, w) {
  return items.map((item, index) => {
    const top = y + index * 88;
    const fill = index === items.length - 1 ? gold : pale;
    return `
      <rect x="${x}" y="${top}" width="${w}" height="58" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
      <text x="${x + 26}" y="${top + 37}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="${fill === gold ? navy : ink}">${esc(item)}</text>`;
  }).join("");
}

async function render(name, body) {
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } })
    .composite([{ input: svg(`<svg width="${W}" height="${H}">${body}</svg>`), left: 0, top: 0 }])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, name));
}

async function dreame() {
  const body = `
    ${frame("GROWTH SYSTEM", "E DATA VISUAL")}
    ${textBlock("Dreame's Five-Year Scale-Up", 92, 328, { size: 60, width: 700 })}
    ${textBlock("This visual uses only the article's own milestones: Xiaomi entry, first hit, financing, hard floor washer push, robot vacuum BU and RMB 10B scale.", 96, 488, { size: 27, weight: 800, color: "#29455F", width: 660 })}
    ${metric(96, 680, 170, "FIRST HIT", "RMB 700M", gold)}
    ${metric(290, 680, 170, "CAPITAL", "RMB 3.6B")}
    ${metric(484, 680, 190, "ROBOT VACUUM BU", "~RMB 6B")}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">ARTICLE MILESTONE LADDER</text>
    ${ladder(["Xiaomi ecosystem entry", "RMB 700M first hit", "RMB 3.6B financing", "Hard floor washer + Douyin push", "Robot vacuum BU close to RMB 6B", "RMB 10B scale"], 850, 286, 520)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / DREAME / ARTICLE-NATIVE DATA</text>`;
  await render("dreame-rise-to-10-billion-in-five-years-image-02.jpg", body);
}

async function dyson() {
  const body = `
    ${frame("PRODUCT SCORECARD", "E DATA VISUAL")}
    ${textBlock("Dyson 2025 Product Push", 92, 320, { size: 62, width: 650 })}
    ${textBlock("The article's judgment is about product direction: power stacking, delayed robot vacuum features, a non-mainstream washer route and fast Chinese-brand iteration.", 96, 486, { size: 27, weight: 800, color: "#29455F", width: 660 })}
    ${metric(96, 680, 154, "V16 MOTOR", "900W", gold)}
    ${metric(274, 680, 154, "SUCTION", "315AW")}
    ${metric(452, 680, 190, "ROBOT GAP", "~3 years")}
    <rect x="784" y="184" width="676" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="828" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">WCB PRODUCT READ</text>
    ${ladder(["V16: 900W / 315AW power stack", "PencilVac: 38mm form factor", "V8 Cyclone: old platform refresh", "Spot+Scrub Ai: all-in-one dock catch-up", "Wash G1: no suction-motor route", "Chinese brands: faster feature packing"], 844, 286, 540)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / DYSON / PRODUCT JUDGMENT MAP</text>`;
  await render("dyson-new-product-review-2025-image-02.jpg", body);
}

async function anker() {
  const body = `
    ${frame("CATEGORY ROUTE", "B MARKET ANALYSIS")}
    ${textBlock("Anker's Cleaning Appliance Route", 92, 326, { size: 60, width: 700 })}
    ${textBlock("The article separates Anker's cleaning business into paused handhelds, early hard floor washer timing, and stronger robot vacuum execution.", 96, 494, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 170, "ROBOT VACUUM", "1M+ units", gold)}
    ${metric(290, 680, 170, "C20 DOCK", "USD 449")}
    ${metric(484, 680, 190, "STEAM WINDOW", "3-5 yrs")}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">THREE-LINE STRATEGY MAP</text>
    <rect x="858" y="310" width="520" height="84" fill="${pale}" stroke="${line}"/>
    <text x="888" y="361" font-family="Arial" font-size="24" font-weight="900" fill="${ink}">Handhelds: pause and wait</text>
    <rect x="858" y="424" width="520" height="84" fill="${pale}" stroke="${line}"/>
    <text x="888" y="475" font-family="Arial" font-size="24" font-weight="900" fill="${ink}">Hard floor washer: timing problem</text>
    <rect x="858" y="538" width="520" height="84" fill="${gold}"/>
    <text x="888" y="589" font-family="Arial" font-size="24" font-weight="900" fill="${navy}">Robot vacuum: stronger base</text>
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / ANKER EUFY / CATEGORY ROUTE</text>`;
  await render("anker-cleaning-appliance-strategy-analysis-image-02.jpg", body);
}

async function dji() {
  const body = `
    ${frame("LAUNCH READ", "E DATA VISUAL")}
    ${textBlock("DJI ROMO Launch Anatomy", 92, 322, { size: 62, width: 660 })}
    ${textBlock("This is not a verdict on market share; it maps the article's launch facts: sensors, arms, fan, base station and price ladder.", 96, 494, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 150, "ROMO S", "RMB 4,699", gold)}
    ${metric(270, 680, 150, "ROMO A", "RMB 5,399")}
    ${metric(444, 680, 150, "ROMO P", "RMB 6,799")}
    <rect x="784" y="184" width="676" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="828" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">CONFIGURATION STACK</text>
    ${ladder(["Dual fisheye cameras", "Three wide-angle solid-state LiDARs", "Mechanical side-brush arms", "Two-stage rubber brush", "25KPA suction fan", "Fan-driven base-station wastewater draw"], 844, 286, 540)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / DJI ROMO / LAUNCH CONFIGURATION</text>`;
  await render("dji-romo-launch-analysis-image-01.jpg", body);
}

async function reviewSheet() {
  const files = [
    "dreame-rise-to-10-billion-in-five-years-image-02.jpg",
    "dyson-new-product-review-2025-image-02.jpg",
    "anker-cleaning-appliance-strategy-analysis-image-02.jpg",
    "dji-romo-launch-analysis-image-01.jpg",
  ];
  const thumbs = await Promise.all(files.map((file) => sharp(path.join(outDir, file)).resize(560, 315).toBuffer()));
  const labels = files.map((file) => `<text x="24" y="344" font-family="Arial" font-size="20" font-weight="900" fill="${ink}">${esc(file)}</text>`);
  const cards = [];
  for (let i = 0; i < files.length; i++) {
    const x = 32 + (i % 2) * 610;
    const y = 32 + Math.floor(i / 2) * 400;
    cards.push({ input: thumbs[i], left: x, top: y });
    cards.push({ input: svg(`<svg width="590" height="70">${labels[i]}</svg>`), left: x, top: y + 318 });
  }
  fs.mkdirSync(reviewDir, { recursive: true });
  await sharp({ create: { width: 1250, height: 830, channels: 3, background: "#F6F8FA" } })
    .composite(cards)
    .jpeg({ quality: 92 })
    .toFile(path.join(reviewDir, "batch-2026-06-11-index-priority-review.jpg"));
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  await dreame();
  await dyson();
  await anker();
  await dji();
  await reviewSheet();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
