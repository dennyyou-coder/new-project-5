const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "../..");
const outDir = __dirname;
const reviewDir = path.join(root, "_review");

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

function svg(input) {
  return Buffer.from(input);
}

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function lines(text, size, width) {
  const max = Math.max(10, Math.floor(width / (size * 0.52)));
  const words = String(text).split(" ");
  const out = [""];
  for (const word of words) {
    const trial = `${out[out.length - 1]} ${word}`.trim();
    if (trial.length > max && out[out.length - 1]) out.push(word);
    else out[out.length - 1] = trial;
  }
  return out;
}

function textBlock(text, x, y, options = {}) {
  const size = options.size || 54;
  const weight = options.weight || 900;
  const width = options.width || 680;
  const color = options.color || ink;
  const lh = options.lineHeight || 1.1;
  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${lines(text, size, width)
    .map((lineText, i) => `<tspan x="${x}" dy="${i ? size * lh : 0}">${esc(lineText)}</tspan>`)
    .join("")}</text>`;
}

function frame(label, mode = "BRAND ANALYSIS") {
  return `
    <rect width="${W}" height="${H}" fill="${bg}"/>
    <rect x="52" y="52" width="1496" height="796" fill="#FFFFFF"/>
    <rect x="52" y="52" width="1496" height="92" fill="${navy}"/>
    <text x="84" y="111" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
    <text x="1160" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${gold}" letter-spacing="2">${esc(mode)}</text>
    <rect x="92" y="188" width="${Math.max(150, label.length * 12)}" height="36" fill="${gold}"/>
    <text x="112" y="213" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">${esc(label)}</text>`;
}

function metric(x, y, w, label, value, fill = pale) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="84" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
    <text x="${x + 22}" y="${y + 32}" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${fill === gold ? navy : blue}">${esc(label)}</text>
    <text x="${x + 22}" y="${y + 68}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="${ink}">${esc(value)}</text>`;
}

function tag(x, y, text, fill = pale) {
  return `<rect x="${x}" y="${y}" width="250" height="58" fill="${fill}" stroke="${fill === gold || fill === navy ? fill : line}"/><text x="${x + 24}" y="${y + 37}" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="900" fill="${fill === navy ? "#FFF" : ink}">${esc(text)}</text>`;
}

function brandChip(x, y, text) {
  return `<rect x="${x}" y="${y}" width="${Math.max(150, text.length * 15)}" height="46" fill="#FFFFFF" stroke="${line}"/><text x="${x + 26}" y="${y + 31}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="${ink}">${esc(text)}</text>`;
}

function imageFrame(x, y, w, h, caption) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#F9FBFC" stroke="${line}"/>
    <text x="${x + 28}" y="${y + h + 42}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${muted}">${esc(caption)}</text>`;
}

async function optionalImage(file, options) {
  if (!fs.existsSync(file)) return null;
  return sharp(file).resize(options).png().toBuffer();
}

async function render(name, body, composites = []) {
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } })
    .composite([{ input: svg(`<svg width="${W}" height="${H}">${body}</svg>`), left: 0, top: 0 }, ...composites])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, name));
}

function rightPanel(title, rows) {
  return `
    <rect x="805" y="184" width="650" height="540" fill="#F9FBFC" stroke="${line}"/>
    <text x="850" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">${esc(title)}</text>
    ${rows.map((row, i) => tag(860, 300 + i * 82, row, i === 0 ? navy : i === rows.length - 1 ? gold : pale)).join("")}`;
}

async function dysonCrossroads() {
  const logo = await optionalImage(path.join(root, "brands/dyson/logos/dyson-official-logo.svg"), {
    width: 260,
    height: 90,
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  });
  const product = await optionalImage("public/images/insights/dyson-at-a-crossroads-image-006.jpg", {
    width: 620,
    height: 410,
    fit: "cover",
  });
  const body = `
    ${frame("STRATEGY RESET")}
    ${textBlock("Dyson at a Crossroads", 92, 360, { size: 62, width: 650 })}
    ${textBlock("The EV cancellation, supply-chain pressure, and floorcare competition turned Dyson's premium logic into a strategic test.", 96, 510, { size: 28, weight: 800, color: "#29455F", width: 650, lineHeight: 1.16 })}
    ${metric(96, 662, 170, "EV PROJECT", "GBP 500M", gold)}
    ${metric(290, 662, 170, "RANGE CLAIM", "965 km")}
    ${metric(484, 662, 180, "SHARK UK SHARE", "36%")}
    <rect x="778" y="164" width="720" height="604" fill="${navy}"/>
    <text x="824" y="226" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${gold}" letter-spacing="2">DYSON PRODUCT SIGNAL</text>
    <rect x="822" y="256" width="620" height="410" fill="#F9FBFC"/>
    <rect x="822" y="610" width="620" height="56" fill="${navy}" opacity="0.84"/>
    <text x="850" y="648" font-family="Arial" font-size="24" font-weight="900" fill="#FFFFFF">Product edge no longer guarantees category control.</text>
    ${tag(828, 690, "EV withdrawal", gold)}
    ${tag(1104, 690, "Shark pressure", pale)}
    <text x="92" y="810" font-family="Arial" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / DYSON / STRATEGIC CROSSROADS</text>`;
  const composites = [];
  if (logo) composites.push({ input: logo, left: 96, top: 245 });
  if (product) composites.push({ input: product, left: 822, top: 256 });
  await render("dyson-at-a-crossroads-cover.jpg", body, composites);
}

async function dysonsAnxiety() {
  const product = await optionalImage("public/images/insights/dysons-anxiety-image-007.jpg", {
    width: 620,
    height: 390,
    fit: "cover",
  });
  const body = `
    ${frame("PREMIUM PRESSURE", "INDUSTRY OPINION")}
    ${textBlock("Dyson's Anxiety", 92, 360, { size: 64, width: 610 })}
    ${textBlock("When a premium leader starts competing on specifications, it risks accepting the challenger's rules.", 96, 500, { size: 29, weight: 800, color: "#29455F", width: 610, lineHeight: 1.16 })}
    ${metric(96, 652, 170, "GLOBAL LAYOFFS", "900", gold)}
    ${metric(290, 652, 170, "UK LAYOFFS", "600")}
    ${metric(484, 652, 170, "EV COST", "$606M")}
    ${brandChip(96, 246, "DYSON")}
    <rect x="778" y="164" width="720" height="604" fill="${navy}"/>
    <text x="824" y="226" font-family="Arial" font-size="18" font-weight="900" fill="${gold}" letter-spacing="2">PREMIUM BRAND ANXIETY</text>
    <rect x="822" y="256" width="620" height="390" fill="#F9FBFC"/>
    <rect x="822" y="590" width="620" height="56" fill="${navy}" opacity="0.84"/>
    <text x="850" y="628" font-family="Arial" font-size="24" font-weight="900" fill="#FFFFFF">EV ambition became a cautionary signal.</text>
    <circle cx="942" cy="704" r="42" fill="${gold}"/><text x="904" y="711" font-family="Arial" font-size="18" font-weight="900" fill="${navy}">Premium</text>
    <line x1="988" y1="704" x2="1122" y2="704" stroke="#FFFFFF" stroke-width="6"/><polygon points="1122,704 1100,690 1100,718" fill="#FFFFFF"/>
    <circle cx="1188" cy="704" r="42" fill="${pale}"/><text x="1160" y="711" font-family="Arial" font-size="18" font-weight="900" fill="${ink}">Specs</text>
    <text x="92" y="810" font-family="Arial" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / DYSON / PREMIUM BRAND RISK</text>`;
  await render("dysons-anxiety-cover.jpg", body, product ? [{ input: product, left: 822, top: 256 }] : []);
}

async function dysonPremium() {
  const product = await optionalImage("public/images/insights/dyson-at-a-crossroads-image-008.jpg", {
    width: 620,
    height: 390,
    fit: "cover",
  });
  const body = `
    ${frame("INNOVATION LIMIT", "MARKET ANALYSIS")}
    ${brandChip(96, 246, "DYSON")}
    ${textBlock("Dyson's New Product Push and the Limits of Premium Innovation", 92, 320, { size: 52, width: 710 })}
    ${textBlock("The new wave is broad, but differentiation is not the same as category leadership.", 96, 538, { size: 29, weight: 800, color: "#29455F", width: 650, lineHeight: 1.16 })}
    ${metric(96, 678, 160, "V16", "900W", gold)}
    ${metric(280, 678, 170, "PRICE LOGIC", "Premium")}
    ${metric(474, 678, 190, "CHINA PACE", "Faster")}
    <rect x="778" y="164" width="720" height="604" fill="${navy}"/>
    <text x="824" y="226" font-family="Arial" font-size="18" font-weight="900" fill="${gold}" letter-spacing="2">PRODUCT WAVE</text>
    <rect x="822" y="256" width="620" height="390" fill="#F9FBFC"/>
    <rect x="822" y="590" width="620" height="56" fill="${navy}" opacity="0.84"/>
    <text x="850" y="628" font-family="Arial" font-size="24" font-weight="900" fill="#FFFFFF">Broad portfolio. Unclear leadership.</text>
    <rect x="846" y="690" width="160" height="52" fill="${gold}"/><text x="874" y="724" font-family="Arial" font-size="20" font-weight="900" fill="${navy}">V16</text>
    <rect x="1024" y="690" width="180" height="52" fill="${pale}"/><text x="1052" y="724" font-family="Arial" font-size="20" font-weight="900" fill="${ink}">Robot dock</text>
    <rect x="1222" y="690" width="180" height="52" fill="${pale}"/><text x="1250" y="724" font-family="Arial" font-size="20" font-weight="900" fill="${ink}">Wash G1</text>
    <text x="92" y="810" font-family="Arial" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / DYSON / PREMIUM INNOVATION</text>`;
  await render("dyson-new-product-push-premium-innovation-cover.jpg", body, product ? [{ input: product, left: 822, top: 256 }] : []);
}

async function irobotExitsDjiEnters() {
  const product = await optionalImage("public/images/insights/irobot-exits-and-dji-enters-image-01.jpg", {
    width: 620,
    height: 390,
    fit: "cover",
  });
  const body = `
    ${frame("ORDER SHIFT", "MARKET ANALYSIS")}
    ${textBlock("iRobot Exits and DJI Enters", 92, 360, { size: 60, width: 660 })}
    ${textBlock("Robot vacuums are moving from pioneer-led categories to platform battles defined by supply chains, algorithms, and capital patience.", 96, 520, { size: 28, weight: 800, color: "#29455F", width: 650, lineHeight: 1.16 })}
    ${metric(96, 672, 170, "OLD KING", "iRobot", gold)}
    ${metric(290, 672, 170, "NEW SIGNAL", "DJI")}
    ${metric(484, 672, 190, "CATEGORY", "Robot vacuum")}
    ${brandChip(96, 246, "iROBOT / DJI")}
    <rect x="778" y="164" width="720" height="604" fill="${navy}"/>
    <text x="850" y="238" font-family="Arial" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">CATEGORY ORDER</text>
    <rect x="822" y="256" width="620" height="390" fill="#F9FBFC"/>
    <rect x="822" y="590" width="620" height="56" fill="${navy}" opacity="0.84"/>
    <text x="850" y="628" font-family="Arial" font-size="24" font-weight="900" fill="#FFFFFF">Category order is shifting from pioneers to platforms.</text>
    <rect x="862" y="690" width="190" height="52" fill="${gold}"/><text x="912" y="724" font-family="Arial" font-size="22" font-weight="900" fill="${navy}">iRobot</text>
    <line x1="1052" y1="716" x2="1200" y2="716" stroke="#FFFFFF" stroke-width="6"/><polygon points="1200,716 1178,702 1178,730" fill="#FFFFFF"/>
    <rect x="1200" y="690" width="160" height="52" fill="${pale}"/><text x="1250" y="724" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">DJI</text>
    <text x="92" y="810" font-family="Arial" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / IROBOT + DJI / CATEGORY TRANSITION</text>`;
  await render("irobot-exits-and-dji-enters-cover.jpg", body, product ? [{ input: product, left: 822, top: 256 }] : []);
}

async function irobotDecline() {
  const product = await optionalImage("public/images/insights/irobot-exits-and-dji-enters-image-01.jpg", {
    width: 620,
    height: 390,
    fit: "cover",
  });
  const body = `
    ${frame("NEW ORDER", "MARKET ANALYSIS")}
    ${textBlock("iRobot's Decline and the New Robot Vacuum Order", 92, 330, { size: 56, width: 700 })}
    ${textBlock("The market no longer rewards being first. It rewards dock systems, iteration speed, cost control, and global channel execution.", 96, 535, { size: 28, weight: 800, color: "#29455F", width: 650, lineHeight: 1.16 })}
    ${metric(96, 680, 180, "PIONEER", "iRobot", gold)}
    ${metric(300, 680, 170, "ORDER", "Changed")}
    ${metric(494, 680, 190, "WINNERS", "China-led")}
    ${brandChip(96, 246, "iROBOT")}
    <rect x="778" y="164" width="720" height="604" fill="${navy}"/>
    <text x="850" y="238" font-family="Arial" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">COMPETITIVE STACK</text>
    <rect x="822" y="256" width="620" height="390" fill="#F9FBFC"/>
    <rect x="822" y="590" width="620" height="56" fill="${navy}" opacity="0.84"/>
    <text x="850" y="628" font-family="Arial" font-size="24" font-weight="900" fill="#FFFFFF">Dock systems changed the order of competition.</text>
    <rect x="862" y="690" width="190" height="52" fill="${gold}"/><text x="888" y="724" font-family="Arial" font-size="22" font-weight="900" fill="${navy}">Roborock</text>
    <rect x="1078" y="690" width="170" height="52" fill="${pale}"/><text x="1110" y="724" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">Dreame</text>
    <rect x="1274" y="690" width="140" height="52" fill="${pale}"/><text x="1302" y="724" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">Narwal</text>
    <text x="92" y="810" font-family="Arial" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / IROBOT / ROBOT VACUUM ORDER</text>`;
  await render("irobot-decline-and-the-new-robot-vacuum-order-cover.jpg", body, product ? [{ input: product, left: 822, top: 256 }] : []);
}

async function ecovacsCrossroads() {
  const product = await optionalImage("public/images/insights/ecovacs-at-a-crossroads-image-003.jpg", {
    width: 620,
    height: 390,
    fit: "cover",
  });
  const body = `
    ${frame("CROSSROADS", "BRAND ANALYSIS")}
    ${textBlock("Ecovacs at a Crossroads", 92, 360, { size: 62, width: 680 })}
    ${textBlock("Ecovacs had the robot base, Tineco's floor washer breakout, and full-function dock momentum. The question became whether it could turn category hits into durable leadership.", 96, 512, { size: 27, weight: 800, color: "#29455F", width: 650, lineHeight: 1.16 })}
    ${metric(96, 672, 170, "TINECO", "Breakout", gold)}
    ${metric(290, 672, 170, "X1", "Arms race")}
    ${metric(484, 672, 190, "2022", "Crossroads")}
    ${brandChip(96, 246, "ECOVACS")}
    <rect x="778" y="164" width="720" height="604" fill="${navy}"/>
    <text x="850" y="238" font-family="Arial" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">TWO-ENGINE TEST</text>
    <rect x="822" y="256" width="620" height="390" fill="#F9FBFC"/>
    <rect x="822" y="590" width="620" height="56" fill="${navy}" opacity="0.84"/>
    <text x="850" y="628" font-family="Arial" font-size="24" font-weight="900" fill="#FFFFFF">Robot vacuum and Tineco created a two-engine test.</text>
    <rect x="862" y="690" width="210" height="52" fill="${gold}"/><text x="888" y="724" font-family="Arial" font-size="22" font-weight="900" fill="${navy}">Robot vacuum</text>
    <rect x="1100" y="690" width="170" height="52" fill="${pale}"/><text x="1136" y="724" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">Tineco</text>
    <text x="92" y="810" font-family="Arial" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / ECOVACS / TWO-ENGINE STRATEGY</text>`;
  await render("ecovacs-at-a-crossroads-cover.jpg", body, product ? [{ input: product, left: 822, top: 256 }] : []);
}

async function roborockCrossroads() {
  const product = await optionalImage(path.join(root, "brands/roborock/products/roborock-saros-z70-official.png"), {
    width: 520,
    height: 390,
    fit: "contain",
    background: { r: 7, g: 31, b: 58, alpha: 1 },
  });
  const body = `
    ${frame("CROSSROADS", "BRAND ANALYSIS")}
    ${textBlock("Roborock at the Crossroads", 92, 350, { size: 60, width: 680 })}
    ${textBlock("Early strength came from Xiaomi, LiDAR, quality, and timing. The later test was whether Roborock could lead after those advantages normalized.", 96, 512, { size: 28, weight: 800, color: "#29455F", width: 650, lineHeight: 1.16 })}
    ${metric(96, 672, 170, "2017 SALES", "RMB 1.1B", gold)}
    ${metric(290, 672, 170, "2019 SALES", "RMB 4.2B")}
    ${metric(484, 672, 190, "2021 9M", "RMB 3.8B")}
    ${brandChip(96, 246, "ROBOROCK")}
    <rect x="778" y="164" width="720" height="604" fill="${navy}"/>
    <text x="850" y="238" font-family="Arial" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">ADVANTAGE NORMALIZATION</text>
    <rect x="872" y="256" width="520" height="390" fill="${navy}"/>
    <rect x="822" y="590" width="620" height="56" fill="${navy}" opacity="0.84"/>
    <text x="850" y="628" font-family="Arial" font-size="24" font-weight="900" fill="#FFFFFF">Product capability became table stakes.</text>
    <rect x="862" y="690" width="190" height="52" fill="${gold}"/><text x="900" y="724" font-family="Arial" font-size="22" font-weight="900" fill="${navy}">LiDAR lead</text>
    <rect x="1080" y="690" width="210" height="52" fill="${pale}"/><text x="1110" y="724" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">Marketing gap</text>
    <text x="92" y="810" font-family="Arial" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / ROBOROCK / EARLY ADVANTAGE TEST</text>`;
  await render("roborock-at-the-crossroads-cover.jpg", body, product ? [{ input: product, left: 872, top: 256 }] : []);
}

async function narwalRevival() {
  const product = await optionalImage("public/images/insights/narwal-revival-story-image-01.jpg", {
    width: 620,
    height: 390,
    fit: "cover",
  });
  const body = `
    ${frame("REVIVAL STORY", "BRAND ANALYSIS")}
    ${textBlock("The Revival of Narwal", 92, 360, { size: 64, width: 660 })}
    ${textBlock("Narwal's story is not a straight growth story. It is a founder, user base, funding, and product rhythm recovering after a deep trough.", 96, 512, { size: 28, weight: 800, color: "#29455F", width: 650, lineHeight: 1.16 })}
    ${metric(96, 672, 170, "VALUATION", "RMB 30B", gold)}
    ${metric(290, 672, 170, "2024 SALES", "RMB 3.4B")}
    ${metric(484, 672, 190, "KICKSTARTER", "$800K")}
    ${brandChip(96, 246, "NARWAL")}
    <rect x="778" y="164" width="720" height="604" fill="${navy}"/>
    <text x="850" y="238" font-family="Arial" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">REVIVAL ARC</text>
    <rect x="822" y="256" width="620" height="390" fill="#F9FBFC"/>
    <rect x="822" y="590" width="620" height="56" fill="${navy}" opacity="0.84"/>
    <text x="850" y="628" font-family="Arial" font-size="24" font-weight="900" fill="#FFFFFF">Product focus returned after the trough.</text>
    <polyline points="860,716 990,690 1120,716 1260,672 1380,690" fill="none" stroke="${gold}" stroke-width="6"/>
    <circle cx="860" cy="716" r="14" fill="${pale}"/><circle cx="990" cy="690" r="14" fill="${gold}"/><circle cx="1120" cy="716" r="14" fill="${pale}"/><circle cx="1260" cy="672" r="14" fill="${gold}"/><circle cx="1380" cy="690" r="14" fill="${pale}"/>
    <text x="92" y="810" font-family="Arial" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / NARWAL / REVIVAL ARC</text>`;
  await render("narwal-revival-story-cover.jpg", body, product ? [{ input: product, left: 822, top: 256 }] : []);
}

async function reviewSheet() {
  const files = [
    "dyson-at-a-crossroads-cover.jpg",
    "dysons-anxiety-cover.jpg",
    "dyson-new-product-push-premium-innovation-cover.jpg",
    "irobot-exits-and-dji-enters-cover.jpg",
    "irobot-decline-and-the-new-robot-vacuum-order-cover.jpg",
    "ecovacs-at-a-crossroads-cover.jpg",
    "roborock-at-the-crossroads-cover.jpg",
    "narwal-revival-story-cover.jpg",
  ];
  const thumbs = [];
  for (const file of files) {
    thumbs.push(await sharp(path.join(outDir, file)).resize(480, 270).jpeg({ quality: 90 }).toBuffer());
  }
  const composites = thumbs.map((input, i) => ({ input, left: 20 + (i % 2) * 500, top: 20 + Math.floor(i / 2) * 290 }));
  await sharp({ create: { width: 1000, height: 1180, channels: 3, background: "#F3F5F7" } })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toFile(path.join(reviewDir, "batch-2026-06-10-brand-strategy-review.jpg"));
}

async function build() {
  fs.mkdirSync(outDir, { recursive: true });
  await dysonCrossroads();
  await dysonsAnxiety();
  await dysonPremium();
  await irobotExitsDjiEnters();
  await irobotDecline();
  await ecovacsCrossroads();
  await roborockCrossroads();
  await narwalRevival();
  await reviewSheet();
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
