const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "../..");
const outDir = __dirname;
const reviewDir = path.join(root, "_review");
const publicDir = path.resolve(root, "../../public/images/insights");

const W = 1600;
const H = 900;
const bg = "#F4F6F8";
const paper = "#FFFFFF";
const navy = "#071F3A";
const ink = "#09233D";
const blue = "#1A6F8D";
const green = "#2A7B5F";
const gold = "#F1C84B";
const muted = "#5C7182";
const line = "#C8D6E2";
const pale = "#EAF2F6";

function svg(s) {
  return Buffer.from(s);
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function split(text, size, width) {
  const max = Math.max(9, Math.floor(width / (size * 0.52)));
  const words = String(text).split(" ");
  const lines = [""];
  for (const word of words) {
    const trial = `${lines[lines.length - 1]} ${word}`.trim();
    if (trial.length > max && lines[lines.length - 1]) lines.push(word);
    else lines[lines.length - 1] = trial;
  }
  return lines;
}

function text(text, x, y, opts = {}) {
  const size = opts.size || 54;
  const weight = opts.weight || 900;
  const color = opts.color || ink;
  const width = opts.width || 640;
  const lh = opts.lineHeight || 1.08;
  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${split(text, size, width)
    .map((line, i) => `<tspan x="${x}" dy="${i ? size * lh : 0}">${esc(line)}</tspan>`)
    .join("")}</text>`;
}

function frame(mode, label) {
  return `
    <rect width="${W}" height="${H}" fill="${bg}"/>
    <rect x="52" y="52" width="1496" height="796" fill="${paper}"/>
    <rect x="52" y="52" width="1496" height="92" fill="${navy}"/>
    <text x="84" y="111" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
    <text x="1180" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${gold}" letter-spacing="2">${esc(mode)}</text>
    <rect x="92" y="184" width="${Math.max(170, label.length * 12)}" height="38" fill="${gold}"/>
    <text x="114" y="210" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">${esc(label)}</text>`;
}

function metric(x, y, w, label, value, fill = pale) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="84" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
    <text x="${x + 20}" y="${y + 31}" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="900" fill="${fill === gold ? navy : blue}" letter-spacing="0.5">${esc(label)}</text>
    <text x="${x + 20}" y="${y + 68}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="${ink}">${esc(value)}</text>`;
}

function chip(x, y, t, fill = "#FFFFFF") {
  return `<rect x="${x}" y="${y}" width="${Math.max(128, t.length * 13)}" height="42" fill="${fill}" stroke="${fill === navy ? navy : line}"/>
    <text x="${x + 20}" y="${y + 28}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${fill === navy ? "#FFFFFF" : ink}">${esc(t)}</text>`;
}

function matrix(x, y, items) {
  return items.map((item, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    return chip(x + col * 172, y + row * 54, item, i === 0 ? gold : "#FFFFFF");
  }).join("");
}

function routeMap(x, y, items) {
  return items.map((item, i) => {
    const yy = y + i * 70;
    return `
      <circle cx="${x}" cy="${yy}" r="15" fill="${i === 0 ? gold : green}"/>
      <rect x="${x + 34}" y="${yy - 24}" width="330" height="48" fill="${i === 0 ? navy : "#FFFFFF"}" stroke="${i === 0 ? navy : line}"/>
      <text x="${x + 54}" y="${yy + 7}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="${i === 0 ? "#FFFFFF" : ink}">${esc(item)}</text>
      ${i < items.length - 1 ? `<line x1="${x}" y1="${yy + 15}" x2="${x}" y2="${yy + 55}" stroke="${line}" stroke-width="4"/>` : ""}`;
  }).join("");
}

function barChart(x, y, bars, max = 100) {
  return bars.map((b, i) => {
    const h = Math.round((b.value / max) * 220);
    const bx = x + i * 92;
    return `
      <rect x="${bx}" y="${y + 240 - h}" width="56" height="${h}" fill="${i === 0 ? gold : i === 1 ? green : blue}"/>
      <text x="${bx + 28}" y="${y + 270}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" fill="${ink}">${esc(b.label)}</text>
      <text x="${bx + 28}" y="${y + 240 - h - 12}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${ink}">${esc(b.text)}</text>`;
  }).join("");
}

async function image(file, opts) {
  const full = path.join(publicDir, file);
  if (!fs.existsSync(full)) return null;
  return sharp(full).resize(opts).png().toBuffer();
}

async function render(name, body, comps = []) {
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } })
    .composite([{ input: svg(`<svg width="${W}" height="${H}">${body}</svg>`), left: 0, top: 0 }, ...comps])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, name));
}

async function marketCover(name, cfg) {
  const img = await image(cfg.image, { width: 680, height: 430, fit: "cover" });
  const body = `
    ${frame(cfg.mode, cfg.label)}
    ${text(cfg.title, 92, 298, { size: cfg.titleSize || 58, width: 650 })}
    ${text(cfg.copy, 96, cfg.copyY || 498, { size: 28, weight: 800, color: "#35566D", width: 650, lineHeight: 1.16 })}
    ${metric(96, 690, 174, cfg.m1[0], cfg.m1[1], gold)}
    ${metric(292, 690, 174, cfg.m2[0], cfg.m2[1])}
    ${metric(488, 690, 196, cfg.m3[0], cfg.m3[1])}
    <rect x="778" y="176" width="720" height="520" fill="${navy}"/>
    <rect x="816" y="216" width="644" height="404" fill="#EFF4F7"/>
    <rect x="816" y="610" width="644" height="66" fill="${navy}" opacity="0.86"/>
    <text x="846" y="652" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="900" fill="#FFFFFF">${esc(cfg.caption)}</text>
    ${matrix(820, 716, cfg.brands)}
    <text x="92" y="812" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6D7D88" letter-spacing="0.8">WCB / BACKYARD ROBOTICS / ${esc(cfg.footer)}</text>`;
  await render(name, body, img ? [{ input: img, left: 816, top: 216 }] : []);
}

async function dataCover(name, cfg) {
  const img = await image(cfg.image, { width: 350, height: 250, fit: "cover" });
  const body = `
    ${frame(cfg.mode, cfg.label)}
    ${text(cfg.title, 92, 298, { size: cfg.titleSize || 58, width: 630 })}
    ${text(cfg.copy, 96, cfg.copyY || 500, { size: 28, weight: 800, color: "#35566D", width: 650, lineHeight: 1.16 })}
    ${metric(96, 690, 174, cfg.m1[0], cfg.m1[1], gold)}
    ${metric(292, 690, 174, cfg.m2[0], cfg.m2[1])}
    ${metric(488, 690, 196, cfg.m3[0], cfg.m3[1])}
    <rect x="778" y="176" width="720" height="568" fill="${pale}" stroke="${line}"/>
    <text x="822" y="236" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="900" fill="${blue}" letter-spacing="2">${esc(cfg.panel)}</text>
    ${barChart(852, 312, cfg.bars, cfg.max)}
    <rect x="1126" y="292" width="322" height="252" fill="#FFFFFF" stroke="${line}"/>
    <rect x="1126" y="544" width="322" height="78" fill="${navy}"/>
    <text x="1152" y="590" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="900" fill="#FFFFFF">${esc(cfg.caption)}</text>
    ${routeMap(844, 662, cfg.routes)}
    <text x="92" y="812" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6D7D88" letter-spacing="0.8">WCB / MARKET DATA / ${esc(cfg.footer)}</text>`;
  await render(name, body, img ? [{ input: img, left: 1140, top: 306 }] : []);
}

async function opinionCover(name, cfg) {
  const img = await image(cfg.image, { width: 690, height: 498, fit: "cover" });
  const body = `
    ${frame(cfg.mode, cfg.label)}
    <rect x="778" y="144" width="770" height="704" fill="${navy}"/>
    <rect x="820" y="194" width="690" height="498" fill="#EFF4F7"/>
    <rect x="820" y="642" width="690" height="50" fill="${navy}" opacity="0.72"/>
    <text x="850" y="675" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="#FFFFFF">${esc(cfg.caption)}</text>
    ${text(cfg.title, 92, 302, { size: cfg.titleSize || 58, width: 630 })}
    ${text(cfg.copy, 96, cfg.copyY || 510, { size: 28, weight: 800, color: "#35566D", width: 630, lineHeight: 1.16 })}
    ${routeMap(112, 650, cfg.routes)}
    ${matrix(828, 724, cfg.brands)}
    <text x="92" y="812" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6D7D88" letter-spacing="0.8">WCB / INDUSTRY OPINION / ${esc(cfg.footer)}</text>`;
  await render(name, body, img ? [{ input: img, left: 820, top: 194 }] : []);
}

async function build() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(reviewDir, { recursive: true });

  await marketCover("pool-and-lawn-robots-self-maintenance-cover.jpg", {
    mode: "MARKET ANALYSIS",
    label: "SELF-MAINTENANCE",
    title: "Pool and Lawn Robots Are Moving Toward Self-Maintenance",
    titleSize: 50,
    copy: "The next outdoor robot race is not just cordless. It is docking, charging, retrieval and debris handling.",
    m1: ["NEXT FEATURE", "Dock"],
    m2: ["POOL", "Filter"],
    m3: ["LAWN", "Base station"],
    caption: "Outdoor robots copy the robot-vacuum dock playbook.",
    brands: ["Beatbot", "WYBOT", "Aiper", "Mammotion", "Navimow", "Sunseeker"],
    footer: "SELF-MAINTENANCE SIGNAL",
    image: "backyard-robots-price-and-channel-war-cover.png",
  });

  await dataCover("amazon-first-stop-for-backyard-robotics-cover.jpg", {
    mode: "DATA VISUAL",
    label: "AMAZON SIGNAL",
    title: "Amazon as the First Stop for Backyard Robotics Overseas",
    titleSize: 48,
    copy: "Amazon is not the whole market, but it is a useful first demand signal for robotic mowers.",
    m1: ["U.S. PENETRATION", "1.3%"],
    m2: ["EUROPE", "8.6%"],
    m3: ["TOP 5 SHARE", "82%"],
    panel: "PRICE AND DEMAND SIGNAL",
    bars: [
      { label: "US", value: 13, text: "1.3%" },
      { label: "EU", value: 86, text: "8.6%" },
      { label: "TOP5", value: 82, text: "82%" },
    ],
    max: 100,
    caption: "Early market signal.",
    routes: ["Search", "Price", "Review", "Channel"],
    footer: "AMAZON DATA",
    image: "amazon-first-stop-for-backyard-robotics-image-002.jpg",
  });

  await opinionCover("chinese-backyard-robot-brands-global-ope-arena-cover.jpg", {
    mode: "INDUSTRY OPINION",
    label: "OPE ARENA",
    title: "Chinese Backyard Robot Brands Are Entering the Global OPE Arena",
    titleSize: 48,
    copy: "The new battlefield is no longer only specs. It is dealer access, training, service and seasonal reliability.",
    caption: "Robotic mowers and pool robots move into professional channels.",
    routes: ["Product", "Dealer", "Service"],
    brands: ["Aiper", "Mammotion", "Navimow", "MOVA", "Kress", "Sunseeker"],
    footer: "GLOBAL CHANNEL BATTLE",
    image: "amazon-first-stop-for-backyard-robotics-cover.jpg",
  });

  await dataCover("robotic-mowers-2026-breakthrough-cover.jpg", {
    mode: "DATA VISUAL",
    label: "2026 BREAKTHROUGH",
    title: "How Robotic Mowers Can Break Through in 2026",
    titleSize: 54,
    copy: "Boundary-free navigation, Europe pressure and the U.S. market will decide who can scale.",
    m1: ["EUROPE", "Pressure"],
    m2: ["U.S.", "Upside"],
    m3: ["2027-28", "Volume"],
    panel: "BREAKTHROUGH CONDITIONS",
    bars: [
      { label: "TECH", value: 72, text: "Ready" },
      { label: "PRICE", value: 58, text: "Falling" },
      { label: "SERVICE", value: 42, text: "Gap" },
    ],
    max: 100,
    caption: "Operations become the test.",
    routes: ["Anti-dumping", "Inventory", "U.S. push", "M&A"],
    footer: "2026 MARKET WINDOW",
    image: "robotic-mowers-2026-breakthrough-image-01.jpg",
  });

  await marketCover("robotic-mower-new-king-2026-cover.jpg", {
    mode: "MARKET ANALYSIS",
    label: "NEW KING",
    title: "Who Will Become the New King of Robotic Mowers?",
    titleSize: 52,
    copy: "The old OPE leaders still matter, but the competition basis is shifting toward outdoor robotics.",
    m1: ["OUTPUT", "3M -> 6M"],
    m2: ["LEADERS", "Old + New"],
    m3: ["TEST", "Scale"],
    caption: "Boundary-free mowers are rewriting the ranking logic.",
    brands: ["Husqvarna", "Positec", "Navimow", "Mammotion", "Dreame", "Ecovacs"],
    footer: "ROBOTIC MOWER LEADERSHIP",
    image: "robotic-mower-new-king-2026-image-002.jpg",
  });

  await opinionCover("robotic-mowers-retail-expansion-phase-cover.jpg", {
    mode: "INDUSTRY OPINION",
    label: "RETAIL EXPANSION",
    title: "Robotic Mowers Are Entering the Retail Expansion Phase",
    titleSize: 50,
    copy: "Retail creates volume, but it also creates returns, installation pressure and service questions.",
    caption: "The category is moving from launch videos to shelves.",
    routes: ["Shelf", "Install", "Return"],
    brands: ["Navimow", "Lymow", "TerraMow", "Amazon", "Dealers", "Retail"],
    footer: "CHANNEL EXPANSION",
    image: "robotic-mower-new-king-2026-cover.jpg",
  });

  await dataCover("backyard-robots-price-and-channel-war-cover.jpg", {
    mode: "MARKET ANALYSIS",
    label: "PRICE / CHANNEL",
    title: "Backyard Robots Are Entering the Price and Channel War",
    titleSize: 50,
    copy: "Promotions and lower mower price bands are pushing backyard robots toward mainstream adoption.",
    m1: ["PRICE", "Falling"],
    m2: ["CHANNEL", "Harder"],
    m3: ["SERVICE", "Decisive"],
    panel: "COMPETITION SHIFTS",
    bars: [
      { label: "PRICE", value: 78, text: "Down" },
      { label: "RETAIL", value: 62, text: "Up" },
      { label: "SERVICE", value: 88, text: "Key" },
    ],
    max: 100,
    caption: "Beyond specs.",
    routes: ["Amazon", "Retail", "Dealer", "Service"],
    footer: "PRICE AND CHANNEL WAR",
    image: "backyard-robots-price-and-channel-war-cover.png",
  });

  await dataCover("robotic-mower-category-note-cover.jpg", {
    mode: "DATA VISUAL",
    label: "CATEGORY NOTE",
    title: "A Note on the Robotic Mower Category",
    titleSize: 56,
    copy: "The category is shifting from technical curiosity to outdoor power equipment channel competition.",
    m1: ["2024 MARKET", "$2.529B"],
    m2: ["2030 RANGE", "$4-4.5B"],
    m3: ["CHINA", "RMB 1.859B"],
    panel: "MARKET SIZE SIGNAL",
    bars: [
      { label: "2024", value: 56, text: "$2.5B" },
      { label: "2030", value: 100, text: "$4.5B" },
      { label: "CN", value: 41, text: "1.86B" },
    ],
    max: 100,
    caption: "Channels decide adoption.",
    routes: ["Navigation", "Safety", "Dealer", "Service"],
    footer: "CATEGORY STRUCTURE",
    image: "robotic-mower-category-note-image-01.jpg",
  });

  await reviewSheet();
}

async function reviewSheet() {
  const files = [
    "pool-and-lawn-robots-self-maintenance-cover.jpg",
    "amazon-first-stop-for-backyard-robotics-cover.jpg",
    "chinese-backyard-robot-brands-global-ope-arena-cover.jpg",
    "robotic-mowers-2026-breakthrough-cover.jpg",
    "robotic-mower-new-king-2026-cover.jpg",
    "robotic-mowers-retail-expansion-phase-cover.jpg",
    "backyard-robots-price-and-channel-war-cover.jpg",
    "robotic-mower-category-note-cover.jpg",
  ];
  const thumbs = [];
  for (const f of files) {
    thumbs.push(await sharp(path.join(outDir, f)).resize(480, 270).jpeg({ quality: 90 }).toBuffer());
  }
  const comps = thumbs.map((input, i) => ({ input, left: 20 + (i % 2) * 500, top: 20 + Math.floor(i / 2) * 290 }));
  await sharp({ create: { width: 1000, height: 1180, channels: 3, background: "#F3F5F7" } })
    .composite(comps)
    .jpeg({ quality: 90 })
    .toFile(path.join(reviewDir, "batch-2026-06-10-backyard-mowers-review.jpg"));
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
