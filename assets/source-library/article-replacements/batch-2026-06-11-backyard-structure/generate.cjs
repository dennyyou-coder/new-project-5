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

function stack(items, x, y, w) {
  return items.map((item, index) => {
    const top = y + index * 82;
    const fill = index === items.length - 1 ? gold : pale;
    return `
      <rect x="${x}" y="${top}" width="${w}" height="58" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
      <text x="${x + 24}" y="${top + 37}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="${fill === gold ? navy : ink}">${esc(item)}</text>`;
  }).join("");
}

async function render(file, body) {
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } })
    .composite([{ input: svg(`<svg width="${W}" height="${H}">${body}</svg>`), left: 0, top: 0 }])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, file));
}

async function battlefield() {
  const body = `
    ${frame("BATTLEFIELD MAP", "B MARKET ANALYSIS")}
    ${textBlock("Backyard Robotics Hardware Battlefield", 92, 326, { size: 58, width: 720 })}
    ${textBlock("The article frames backyard robotics as a system contest across pools, lawns, snow, channels and service, not a single device race.", 96, 492, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 170, "BEATBOT", "RMB 1B", gold)}
    ${metric(290, 680, 170, "TOTAL RAISED", "RMB 1.5B+")}
    ${metric(484, 680, 190, "YARBO SNOW", "30 cm / 12 m")}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">SYSTEM LAYERS</text>
    ${stack(["Pool robots", "Robotic mowers", "Snow-removal robots", "Smart irrigation", "Dealers + service + spare parts", "Multi-season outdoor platform"], 850, 286, 530)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / BACKYARD ROBOTICS / SYSTEM MAP</text>`;
  await render("backyard-robotics-china-next-hardware-battlefield-image-02.jpg", body);
}

async function ope() {
  const body = `
    ${frame("OPE CHANNEL MAP", "B MARKET ANALYSIS")}
    ${textBlock("Chinese Backyard Brands Enter OPE Channels", 92, 318, { size: 56, width: 720 })}
    ${textBlock("The article's core point is channel migration: brands are moving from online product launches into dealer, pool and outdoor power equipment systems.", 96, 490, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 170, "MOVA PRICE", "EUR 470", gold)}
    ${metric(290, 680, 170, "SUNSEEKER", "12k-24k sqm")}
    ${metric(484, 680, 190, "KRESS", "Pro 4WD")}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">CHANNEL SHIFT</text>
    <rect x="850" y="306" width="210" height="72" fill="${navy}"/>
    <text x="894" y="351" font-family="Arial" font-size="24" font-weight="900" fill="#FFFFFF">Online</text>
    <line x1="1060" y1="342" x2="1230" y2="342" stroke="${blue}" stroke-width="6"/>
    <polygon points="1230,342 1208,328 1208,356" fill="${blue}"/>
    <rect x="1230" y="306" width="170" height="72" fill="${gold}"/>
    <text x="1274" y="351" font-family="Arial" font-size="24" font-weight="900" fill="${navy}">OPE</text>
    ${stack(["POOLCORP / pool dealers", "Equip Expo / OPE buyers", "Landscapers / installers", "Training + warranty + compliance"], 850, 430, 550)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / OPE CHANNELS / GLOBAL ARENA</text>`;
  await render("chinese-backyard-robot-brands-global-ope-arena-image-02.jpg", body);
}

async function mower2026() {
  const body = `
    ${frame("2026 BREAKTHROUGH", "E DATA VISUAL")}
    ${textBlock("Robotic Mower Breakthrough Conditions", 92, 326, { size: 58, width: 720 })}
    ${textBlock("The article treats 2026 as a transition year shaped by anti-dumping pressure, pricing, inventory, commercial use and the U.S. market.", 96, 492, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 170, "EUROPE", "Anti-dumping", gold)}
    ${metric(290, 680, 170, "U.S. MARKET", "Several M units")}
    ${metric(484, 680, 190, "TIMING", "2027-28 sales")}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">BREAKTHROUGH FILTER</text>
    ${stack(["Anti-dumping investigation", "Pricing and inventory discipline", "Commercial mower entry", "U.S. market feedback loop", "Potential M&A", "Survivors: product + channel + service"], 850, 286, 530)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / ROBOTIC MOWERS / 2026 FILTER</text>`;
  await render("robotic-mowers-2026-breakthrough-image-01.jpg", body);
}

async function review() {
  const files = [
    "backyard-robotics-china-next-hardware-battlefield-image-02.jpg",
    "chinese-backyard-robot-brands-global-ope-arena-image-02.jpg",
    "robotic-mowers-2026-breakthrough-image-01.jpg",
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
    .toFile(path.join(reviewDir, "batch-2026-06-11-backyard-structure-review.jpg"));
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  await battlefield();
  await ope();
  await mower2026();
  await review();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
