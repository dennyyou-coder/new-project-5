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

function grid(items, x, y, cols = 2) {
  const w = cols === 2 ? 250 : 170;
  return items.map((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const left = x + col * (w + 24);
    const top = y + row * 92;
    const fill = index === 0 ? gold : pale;
    return `
      <rect x="${left}" y="${top}" width="${w}" height="66" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
      <text x="${left + 22}" y="${top + 41}" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="900" fill="${fill === gold ? navy : ink}">${esc(item)}</text>`;
  }).join("");
}

function stack(items, x, y, w) {
  return items.map((item, index) => {
    const top = y + index * 84;
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

async function retail() {
  const body = `
    ${frame("RETAIL PHASE", "B MARKET ANALYSIS")}
    ${textBlock("Robotic Mowers Enter Retail Expansion", 92, 322, { size: 58, width: 720 })}
    ${textBlock("The article's point is that retail creates a different test: setup, returns, service, documentation and seasonal performance.", 96, 488, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 170, "STAGE", "Retail", gold)}
    ${metric(290, 680, 170, "TEST", "Service")}
    ${metric(484, 680, 190, "TIMELINE", "1-2 seasons")}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">RETAIL OPERATING STACK</text>
    ${stack(["Major retail shelf", "Online comparison", "Installation questions", "Returns + warranty", "Dealer and support training", "Seasonal reliability"], 850, 286, 530)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / ROBOTIC MOWERS / RETAIL EXPANSION</text>`;
  await render("robotic-mowers-retail-expansion-phase-image-22.jpg", body);
}

async function poolBattle() {
  const body = `
    ${frame("COMPETITIVE TABLE", "B MARKET ANALYSIS")}
    ${textBlock("Pool Robots Become a Backyard Robotics Battle", 92, 316, { size: 56, width: 720 })}
    ${textBlock("The article maps several player systems: old channel kings, wireless challengers, high-end startups, manufacturers and broader backyard robot companies.", 96, 494, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 170, "WINDOW", "~1 year", gold)}
    ${metric(290, 680, 170, "RESULTS", "2027-28")}
    ${metric(484, 680, 190, "SURVIVORS", "3-4")}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">PLAYER SYSTEMS</text>
    ${grid(["Maytronics", "Fluidra", "Aiper", "Beatbot", "WYBOT", "Dreame", "Roborock", "Mammotion", "Hayward", "BWT"], 850, 286, 2)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / POOL ROBOTS / COMPETITIVE TABLE</text>`;
  await render("pool-robotics-new-competitive-table-image-005.jpg", body);
}

async function selfMaintenance() {
  const body = `
    ${frame("SELF-MAINTENANCE", "B MARKET ANALYSIS")}
    ${textBlock("Pool and Lawn Robots Copy the Dock Playbook", 92, 322, { size: 56, width: 720 })}
    ${textBlock("The article compares outdoor robots with robot vacuums: adoption improves when the machine removes more user maintenance work.", 96, 492, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 170, "FIRST WAVE", "Cordless", gold)}
    ${metric(290, 680, 170, "NEXT WAVE", "Docking")}
    ${metric(484, 680, 190, "REAL TEST", "Reliability")}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">WORK REMOVED FROM USER</text>
    ${stack(["Cable handling", "Charging", "Retrieval", "Filter cleaning", "Debris handling", "Longer forgettable operation"], 850, 286, 530)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / POOL + LAWN / SELF-MAINTENANCE</text>`;
  await render("pool-and-lawn-robots-self-maintenance-image-17.jpg", body);
}

async function review() {
  const files = [
    "robotic-mowers-retail-expansion-phase-image-22.jpg",
    "pool-robotics-new-competitive-table-image-005.jpg",
    "pool-and-lawn-robots-self-maintenance-image-17.jpg",
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
    .toFile(path.join(reviewDir, "batch-2026-06-11-pool-mower-structure-review.jpg"));
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  await retail();
  await poolBattle();
  await selfMaintenance();
  await review();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
