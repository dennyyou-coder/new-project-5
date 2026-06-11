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

function svg(s) {
  return Buffer.from(s);
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function splitLines(text, size, width) {
  const max = Math.max(10, Math.floor(width / (size * 0.52)));
  const words = String(text).split(" ");
  const lines = [""];
  for (const word of words) {
    const trial = `${lines[lines.length - 1]} ${word}`.trim();
    if (trial.length > max && lines[lines.length - 1]) lines.push(word);
    else lines[lines.length - 1] = trial;
  }
  return lines;
}

function textBlock(text, x, y, opts = {}) {
  const size = opts.size || 56;
  const weight = opts.weight || 900;
  const width = opts.width || 680;
  const color = opts.color || ink;
  const lh = opts.lineHeight || 1.1;
  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${splitLines(text, size, width)
    .map((line, i) => `<tspan x="${x}" dy="${i ? size * lh : 0}">${esc(line)}</tspan>`)
    .join("")}</text>`;
}

function frame(label, mode) {
  return `
    <rect width="${W}" height="${H}" fill="${bg}"/>
    <rect x="52" y="52" width="1496" height="796" fill="#FFFFFF"/>
    <rect x="52" y="52" width="1496" height="92" fill="${navy}"/>
    <text x="84" y="111" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
    <text x="1160" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${gold}" letter-spacing="2">${esc(mode)}</text>
    <rect x="92" y="188" width="${Math.max(156, label.length * 12)}" height="36" fill="${gold}"/>
    <text x="112" y="213" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">${esc(label)}</text>`;
}

function brandChip(x, y, text) {
  return `<rect x="${x}" y="${y}" width="${Math.max(150, text.length * 16)}" height="46" fill="#FFFFFF" stroke="${line}"/><text x="${x + 26}" y="${y + 31}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="${ink}">${esc(text)}</text>`;
}

function metric(x, y, w, label, value, fill = pale) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="84" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
    <text x="${x + 22}" y="${y + 32}" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${fill === gold ? navy : blue}">${esc(label)}</text>
    <text x="${x + 22}" y="${y + 68}" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="900" fill="${ink}">${esc(value)}</text>`;
}

function visualPanel(title, caption) {
  return `
    <rect x="778" y="164" width="720" height="604" fill="${navy}"/>
    <text x="824" y="226" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${gold}" letter-spacing="2">${esc(title)}</text>
    <rect x="822" y="256" width="620" height="390" fill="#F9FBFC"/>
    <rect x="822" y="590" width="620" height="56" fill="${navy}" opacity="0.84"/>
    <text x="850" y="628" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="#FFFFFF">${esc(caption)}</text>`;
}

function pill(x, y, text, fill = pale) {
  return `<rect x="${x}" y="${y}" width="${Math.max(150, text.length * 12)}" height="52" fill="${fill}" stroke="${fill === gold || fill === navy ? fill : line}"/><text x="${x + 24}" y="${y + 34}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="${fill === navy ? "#FFF" : ink}">${esc(text)}</text>`;
}

async function optional(file, opts) {
  if (!fs.existsSync(file)) return null;
  return sharp(file).resize(opts).png().toBuffer();
}

async function render(name, body, composites = []) {
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } })
    .composite([{ input: svg(`<svg width="${W}" height="${H}">${body}</svg>`), left: 0, top: 0 }, ...composites])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, name));
}

async function cover(name, cfg) {
  const img = await optional(cfg.image, { width: 620, height: 390, fit: "cover" });
  const body = `
    ${frame(cfg.label, cfg.mode)}
    ${brandChip(96, 246, cfg.brand)}
    ${textBlock(cfg.title, 92, cfg.titleY || 358, { size: cfg.titleSize || 58, width: cfg.titleWidth || 670 })}
    ${textBlock(cfg.copy, 96, cfg.copyY || 520, { size: 28, weight: 800, color: "#29455F", width: 650, lineHeight: 1.16 })}
    ${metric(96, 680, 170, cfg.m1[0], cfg.m1[1], gold)}
    ${metric(290, 680, 170, cfg.m2[0], cfg.m2[1])}
    ${metric(484, 680, 190, cfg.m3[0], cfg.m3[1])}
    ${visualPanel(cfg.panel, cfg.caption)}
    ${pill(862, 690, cfg.p1, gold)}
    ${pill(1088, 690, cfg.p2)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / ${esc(cfg.brand)} / ${esc(cfg.footer)}</text>`;
  await render(name, body, img ? [{ input: img, left: 822, top: 256 }] : []);
}

async function build() {
  fs.mkdirSync(outDir, { recursive: true });

  await cover("anker-floorcare-strategy-problem-cover.jpg", {
    label: "STRATEGY PROBLEM",
    mode: "BRAND ANALYSIS",
    brand: "ANKER / EUFY",
    title: "Anker's Floorcare Strategy Problem",
    titleSize: 56,
    titleWidth: 690,
    copy: "Overseas channels are real, but floorcare asks for deeper product, supply-chain and after-sales commitment.",
    m1: ["ROBOT VACUUM", "1M+ units"],
    m2: ["C20 PRICE", "$449"],
    m3: ["STEAM WINDOW", "3-5 yrs"],
    panel: "EUFY FLOORCARE SIGNAL",
    caption: "Robot vacuum is stronger than hard floor washer execution.",
    p1: "Robot vacuum",
    p2: "Hard floor washer",
    footer: "FLOORCARE STRATEGY",
    image: "public/images/insights/anker-cleaning-appliance-strategy-analysis-image-01.jpg",
  });

  await cover("anker-cleaning-appliance-strategy-analysis-cover.jpg", {
    label: "CHANNEL TEST",
    mode: "MARKET ANALYSIS",
    brand: "ANKER / EUFY",
    title: "Anker's Cleaning Appliance Strategy Analysis",
    titleSize: 52,
    titleWidth: 690,
    copy: "The challenge is whether Anker can turn overseas brand strength into a durable cleaning appliance system.",
    m1: ["OVERSEAS", "Advantage"],
    m2: ["E SERIES", "Bold"],
    m3: ["PRICE WAR", "Rising"],
    panel: "PRODUCT ROUTE",
    caption: "Anker is searching for a route beyond low-price robot vacuums.",
    p1: "Eufy",
    p2: "Mach",
    footer: "CLEANING APPLIANCE ROUTE",
    image: "public/images/insights/anker-cleaning-appliance-strategy-analysis-image-01.jpg",
  });

  await cover("laifen-hard-floor-washer-chances-cover.jpg", {
    label: "ENTRY WINDOW",
    mode: "MARKET ANALYSIS",
    brand: "LAIFEN",
    title: "Laifen's Hard Floor Washer Chance",
    titleSize: 56,
    titleWidth: 650,
    copy: "A strong traffic brand still needs product definition, channel timing and after-sales capacity in floorcare.",
    m1: ["CATEGORY", "Floorcare"],
    m2: ["POSITION", "Challenger"],
    m3: ["RISK", "Execution"],
    panel: "SHOWROOM SIGNAL",
    caption: "Hard floor washers need more than traffic and industrial design.",
    p1: "Product wall",
    p2: "Entry timing",
    footer: "HARD FLOOR WASHER ENTRY",
    image: "public/images/insights/laifen-hard-floor-washer-chances-image-01.jpg",
  });

  await cover("laifen-hard-floor-washer-entry-strategy-cover.jpg", {
    label: "PRODUCT ENTRY",
    mode: "BRAND ANALYSIS",
    brand: "LAIFEN",
    title: "Laifen's Hard Floor Washer Entry Strategy",
    titleSize: 52,
    titleWidth: 690,
    copy: "The first visible product signal is aggressive, but category leadership depends on repeated product reliability.",
    m1: ["PRICE SIGNAL", "RMB 618"],
    m2: ["CLAIM", "8-in-1"],
    m3: ["TEST", "After-sales"],
    panel: "PRODUCT OFFER",
    caption: "The offer is loud; the category test is operational.",
    p1: "Price",
    p2: "Reliability",
    footer: "PRODUCT ENTRY STRATEGY",
    image: "public/images/insights/laifen-hard-floor-washer-entry-strategy-image-001.jpg",
  });

  await cover("uwant-resilience-in-china-cleaning-appliances-cover.jpg", {
    label: "RESILIENCE",
    mode: "BRAND ANALYSIS",
    brand: "UWANT",
    title: "Uwant's Resilience in China Cleaning Appliances",
    titleSize: 52,
    titleWidth: 690,
    copy: "Uwant is less about one technology hero and more about finding survivable demand pockets through marketing and product rhythm.",
    m1: ["SALES SIGNAL", "RMB 4B"],
    m2: ["START", "Mite remover"],
    m3: ["METHOD", "Marketing"],
    panel: "BRAND SURVIVAL LOGIC",
    caption: "A marketing-led brand survived a capital-heavy category.",
    p1: "Mite remover",
    p2: "Fabric cleaner",
    footer: "RESILIENCE CASE",
    image: "public/images/insights/resilient-uwant-image-01.jpg",
  });

  await cover("resilient-uwant-cover.jpg", {
    label: "BRAND RESILIENCE",
    mode: "INDUSTRY OPINION",
    brand: "UWANT",
    title: "Resilient Uwant",
    titleSize: 62,
    titleWidth: 630,
    copy: "The company matters because it shows another route through floorcare: marketing strength, category timing and survival instincts.",
    m1: ["MARKET", "China"],
    m2: ["CAPABILITY", "Sales"],
    m3: ["RISK", "Giants"],
    panel: "SURVIVAL ROUTE",
    caption: "Not every winner is a technology-first company.",
    p1: "Marketing",
    p2: "Product rhythm",
    footer: "INDUSTRY VIEW",
    image: "public/images/insights/resilient-uwant-image-01.jpg",
  });

  await cover("dji-romo-launch-analysis-cover.jpg", {
    label: "LAUNCH ANALYSIS",
    mode: "BRAND ANALYSIS",
    brand: "DJI ROMO",
    title: "DJI ROMO Launch Analysis",
    titleSize: 60,
    titleWidth: 650,
    copy: "DJI's halo creates attention, but robot vacuums still judge cleaning, docking, reliability and price every day.",
    m1: ["ROMO S", "RMB 4,699"],
    m2: ["ROMO A", "RMB 5,399"],
    m3: ["ROMO P", "RMB 6,799"],
    panel: "WAREHOUSE SIGNAL",
    caption: "The first product enters a category already in arms-race mode.",
    p1: "Obstacle avoidance",
    p2: "Dock cleaning",
    footer: "ROBOT VACUUM LAUNCH",
    image: "public/images/insights/dji-romo-launch-analysis-image-01.jpg",
  });

  await cover("dji-romo-weaknesses-exposed-cover.jpg", {
    label: "WEAKNESS CHECK",
    mode: "MARKET ANALYSIS",
    brand: "DJI ROMO",
    title: "DJI ROMO's Weaknesses Exposed",
    titleSize: 56,
    titleWidth: 660,
    copy: "High visibility makes every weakness larger: transparent design, threshold crossing, mop structure and price gaps.",
    m1: ["TOP MODEL GAP", "RMB 1,000+"],
    m2: ["THRESHOLD", "2.5 cm"],
    m3: ["CORE TEST", "Daily use"],
    panel: "PRODUCT REALITY CHECK",
    caption: "Brand power does not remove repeated-use friction.",
    p1: "Transparent shell",
    p2: "Threshold",
    footer: "PRODUCT RISK CHECK",
    image: "public/images/insights/dji-romo-weaknesses-exposed-image-01.jpg",
  });

  await reviewSheet();
}

async function reviewSheet() {
  const files = [
    "anker-floorcare-strategy-problem-cover.jpg",
    "anker-cleaning-appliance-strategy-analysis-cover.jpg",
    "laifen-hard-floor-washer-chances-cover.jpg",
    "laifen-hard-floor-washer-entry-strategy-cover.jpg",
    "uwant-resilience-in-china-cleaning-appliances-cover.jpg",
    "resilient-uwant-cover.jpg",
    "dji-romo-launch-analysis-cover.jpg",
    "dji-romo-weaknesses-exposed-cover.jpg",
  ];
  const thumbs = [];
  for (const f of files) thumbs.push(await sharp(path.join(outDir, f)).resize(480, 270).jpeg({ quality: 90 }).toBuffer());
  const comps = thumbs.map((input, i) => ({ input, left: 20 + (i % 2) * 500, top: 20 + Math.floor(i / 2) * 290 }));
  await sharp({ create: { width: 1000, height: 1180, channels: 3, background: "#F3F5F7" } })
    .composite(comps)
    .jpeg({ quality: 90 })
    .toFile(path.join(reviewDir, "batch-2026-06-10-floorcare-challengers-review.jpg"));
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
