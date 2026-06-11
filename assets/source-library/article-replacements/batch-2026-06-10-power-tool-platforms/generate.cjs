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
const red = "#C4493D";
const gold = "#F1C84B";
const pale = "#EAF2F6";
const line = "#C8D6E2";

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

function textBlock(text, x, y, opts = {}) {
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
    <text x="1170" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${gold}" letter-spacing="2">${esc(mode)}</text>
    <rect x="92" y="184" width="${Math.max(166, label.length * 12)}" height="38" fill="${gold}"/>
    <text x="114" y="210" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">${esc(label)}</text>`;
}

function metric(x, y, w, label, value, fill = pale) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="84" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
    <text x="${x + 20}" y="${y + 31}" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="900" fill="${fill === gold ? navy : blue}" letter-spacing="0.5">${esc(label)}</text>
    <text x="${x + 20}" y="${y + 68}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="${ink}">${esc(value)}</text>`;
}

function chip(x, y, label, fill = "#FFFFFF") {
  return `
    <rect x="${x}" y="${y}" width="${Math.max(132, label.length * 13)}" height="42" fill="${fill}" stroke="${fill === navy || fill === gold ? fill : line}"/>
    <text x="${x + 18}" y="${y + 28}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${fill === navy ? "#FFFFFF" : ink}">${esc(label)}</text>`;
}

function grid(x, y, items) {
  return items.map((item, i) => chip(x + (i % 3) * 172, y + Math.floor(i / 3) * 54, item, i === 0 ? gold : "#FFFFFF")).join("");
}

function bars(x, y, data, max = 100) {
  return data.map((d, i) => {
    const h = Math.round((d.value / max) * 216);
    const bx = x + i * 86;
    const fill = i === 0 ? gold : i === 1 ? green : i === 2 ? red : blue;
    return `
      <rect x="${bx}" y="${y + 236 - h}" width="54" height="${h}" fill="${fill}"/>
      <text x="${bx + 27}" y="${y + 267}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${ink}">${esc(d.label)}</text>
      <text x="${bx + 27}" y="${y + 236 - h - 12}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${ink}">${esc(d.text)}</text>`;
  }).join("");
}

function route(x, y, items) {
  return items.map((item, i) => {
    const yy = y + i * 66;
    return `
      <circle cx="${x}" cy="${yy}" r="14" fill="${i === 0 ? gold : i === items.length - 1 ? red : green}"/>
      <rect x="${x + 34}" y="${yy - 23}" width="330" height="46" fill="${i === 0 ? navy : "#FFFFFF"}" stroke="${i === 0 ? navy : line}"/>
      <text x="${x + 54}" y="${yy + 7}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="900" fill="${i === 0 ? "#FFFFFF" : ink}">${esc(item)}</text>
      ${i < items.length - 1 ? `<line x1="${x}" y1="${yy + 14}" x2="${x}" y2="${yy + 52}" stroke="${line}" stroke-width="4"/>` : ""}`;
  }).join("");
}

async function img(file, opts) {
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

async function brandCover(name, cfg) {
  const image = await img(cfg.image, { width: 680, height: 430, fit: "cover" });
  const body = `
    ${frame(cfg.mode || "BRAND ANALYSIS", cfg.label)}
    ${chip(96, 246, cfg.brand, "#FFFFFF")}
    ${textBlock(cfg.title, 92, cfg.titleY || 352, { size: cfg.titleSize || 56, width: 650 })}
    ${textBlock(cfg.copy, 96, cfg.copyY || 520, { size: 28, weight: 800, color: "#35566D", width: 650, lineHeight: 1.16 })}
    ${metric(96, 690, 174, cfg.m1[0], cfg.m1[1], gold)}
    ${metric(292, 690, 174, cfg.m2[0], cfg.m2[1])}
    ${metric(488, 690, 196, cfg.m3[0], cfg.m3[1])}
    <rect x="778" y="176" width="720" height="520" fill="${navy}"/>
    <rect x="816" y="216" width="644" height="404" fill="#EFF4F7"/>
    <rect x="816" y="610" width="644" height="66" fill="${navy}" opacity="0.86"/>
    <text x="846" y="652" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="#FFFFFF">${esc(cfg.caption)}</text>
    ${grid(820, 716, cfg.chips)}
    <text x="92" y="812" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6D7D88" letter-spacing="0.8">WCB / POWER TOOL PLATFORM / ${esc(cfg.footer)}</text>`;
  await render(name, body, image ? [{ input: image, left: 816, top: 216 }] : []);
}

async function dataCover(name, cfg) {
  const image = await img(cfg.image, { width: 310, height: 220, fit: "cover" });
  const body = `
    ${frame("DATA VISUAL", cfg.label)}
    ${textBlock(cfg.title, 92, 296, { size: cfg.titleSize || 54, width: 640 })}
    ${textBlock(cfg.copy, 96, cfg.copyY || 506, { size: 28, weight: 800, color: "#35566D", width: 640, lineHeight: 1.16 })}
    ${metric(96, 690, 174, cfg.m1[0], cfg.m1[1], gold)}
    ${metric(292, 690, 174, cfg.m2[0], cfg.m2[1])}
    ${metric(488, 690, 196, cfg.m3[0], cfg.m3[1])}
    <rect x="770" y="176" width="728" height="568" fill="${pale}" stroke="${line}"/>
    <text x="816" y="236" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="900" fill="${blue}" letter-spacing="2">${esc(cfg.panel)}</text>
    ${bars(826, 314, cfg.bars, cfg.max)}
    <rect x="1140" y="302" width="310" height="220" fill="#FFFFFF" stroke="${line}"/>
    <rect x="1140" y="522" width="310" height="72" fill="${navy}"/>
    <text x="1162" y="566" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="900" fill="#FFFFFF">${esc(cfg.caption)}</text>
    ${route(834, 642, cfg.routes)}
    <text x="92" y="812" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6D7D88" letter-spacing="0.8">WCB / POWER TOOL DATA / ${esc(cfg.footer)}</text>`;
  await render(name, body, image ? [{ input: image, left: 1140, top: 302 }] : []);
}

async function build() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(reviewDir, { recursive: true });

  await brandCover("bosch-cordless-dust-collector-cover.jpg", {
    label: "SYSTEM ACCESSORY",
    brand: "BOSCH PROFESSIONAL",
    title: "Bosch's Cordless Dust Collector and the Power Tool Logic",
    titleSize: 48,
    copy: "Dust collection becomes more valuable when it lives inside a power-tool battery and accessory ecosystem.",
    m1: ["PLATFORM", "18V"],
    m2: ["CATEGORY", "Dust"],
    m3: ["LOGIC", "Accessory"],
    caption: "Cleaning enters through jobsite dust control.",
    chips: ["Bosch", "Battery", "Dust", "Accessory", "Jobsite", "System"],
    footer: "BOSCH DUST CONTROL",
    image: "bosch-cordless-dust-collector-image-003.jpg",
  });

  await dataCover("dewalts-rise-harvard-case-cover.jpg", {
    label: "BRAND REPOSITIONING",
    title: "The Rise of DEWALT: A Classic Harvard Case",
    copy: "DEWALT changed the game by repositioning around professional tradesmen and channel focus.",
    m1: ["MAKITA", "50%"],
    m2: ["CORDLESS", "80%"],
    m3: ["B&D", "9%"],
    panel: "PRO TRADESMAN SHARE",
    bars: [
      { label: "Makita", value: 50, text: "50%" },
      { label: "Cordless", value: 80, text: "80%" },
      { label: "B&D", value: 9, text: "9%" },
    ],
    max: 80,
    caption: "Brand architecture matters.",
    routes: ["Segment", "Channel", "Reposition"],
    footer: "DEWALT CASE",
    image: "dewalts-rise-harvard-case-image-002.jpg",
  });

  await brandCover("global-power-tool-brands-reshaping-portfolios-cover.jpg", {
    mode: "MARKET ANALYSIS",
    label: "PORTFOLIO RESET",
    brand: "GLOBAL TOOL BRANDS",
    title: "Global Power Tool Brands Are Reshaping Their Portfolios",
    titleSize: 47,
    copy: "Makita, Stanley Black & Decker, Chervon and TTI are reallocating assets, channels and manufacturing footprints.",
    m1: ["FOCUS", "Core"],
    m2: ["OPE", "Battery"],
    m3: ["RISK", "Tariffs"],
    caption: "Tool groups are tightening around platform value.",
    chips: ["Makita", "SBD", "Chervon", "TTI", "EGO", "OPE"],
    footer: "PORTFOLIO STRATEGY",
    image: "tti-product-direction-image-01.jpg",
  });

  await dataCover("lithium-batteries-in-vacuums-and-power-tools-cover.jpg", {
    label: "BATTERY PLATFORM",
    title: "Lithium Batteries in Vacuums and Power Tools",
    copy: "Battery systems shape runtime, safety, user experience and platform lock-in across cordless categories.",
    m1: ["DYSON", "$90M"],
    m2: ["RUNTIME", "60 min"],
    m3: ["POWER", "BMS"],
    panel: "CORDLESS CORE TECHNOLOGY",
    bars: [
      { label: "Cyclone", value: 70, text: "Core" },
      { label: "Motor", value: 82, text: "High" },
      { label: "Battery", value: 92, text: "System" },
    ],
    max: 100,
    caption: "Battery is the platform.",
    routes: ["Cells", "BMS", "Runtime"],
    footer: "LITHIUM BATTERY LOGIC",
    image: "lithium-batteries-in-vacuums-and-power-tools-image-010.jpg",
  });

  await brandCover("one-power-strategy-in-small-appliances-cover.jpg", {
    mode: "MARKET ANALYSIS",
    label: "ONE POWER",
    brand: "BATTERY ECOSYSTEM",
    title: "The One Power Strategy in Small Appliances",
    titleSize: 54,
    copy: "Shared battery systems can turn separate appliances into a more defensible hardware ecosystem.",
    m1: ["SAVING", "30-50%"],
    m2: ["ELECTRIFIED", "15%"],
    m3: ["WINDOW", "3-5 yrs"],
    caption: "The power-tool model is hard to copy at home.",
    chips: ["Battery", "Vacuum", "Washer", "Tools", "Lock-in", "Cost"],
    footer: "ONE POWER STRATEGY",
    image: "one-power-strategy-in-small-appliances-image-01.jpg",
  });

  await brandCover("power-tools-new-cycle-cordless-specialization-cover.jpg", {
    mode: "INDUSTRY OPINION",
    label: "CORDLESS CYCLE",
    brand: "POWER TOOLS",
    title: "Power Tools Are Entering a New Cycle of Cordless Specialization",
    titleSize: 49,
    copy: "The next cycle is less about one cordless tool and more about making entire workflows cordless.",
    m1: ["SHIFT", "Workflow"],
    m2: ["PLATFORM", "Battery"],
    m3: ["TEST", "Trade"],
    caption: "Cordless moves from products to jobsite systems.",
    chips: ["Milwaukee", "DEWALT", "Makita", "Chervon", "OPE", "Tools"],
    footer: "CORDLESS SPECIALIZATION",
    image: "lithium-batteries-in-vacuums-and-power-tools-image-018.jpg",
  });

  await brandCover("tti-cleaning-appliance-strategy-cover.jpg", {
    label: "PLATFORM STRATEGY",
    brand: "TTI / HOOVER / VAX",
    title: "TTI's Cleaning Appliance Strategy",
    titleSize: 54,
    copy: "TTI's cleaning bet is best understood through power-tool batteries, brand portfolio and channel logic.",
    m1: ["UPRIGHTS", "10M units"],
    m2: ["BATTERY", "18V"],
    m3: ["PACK", "10 cells"],
    caption: "Cleaning appliances become a platform extension.",
    chips: ["TTI", "Hoover", "VAX", "Ryobi", "One Power", "Floorcare"],
    footer: "TTI CLEANING STRATEGY",
    image: "tti-cleaning-appliance-strategy-image-01.jpg",
  });

  await dataCover("tti-product-direction-cover.jpg", {
    label: "PRODUCT DIRECTION",
    title: "TTI's Product Direction",
    titleSize: 58,
    copy: "TTI's direction is anchored by Milwaukee's professional platform and Hoover/VAX cleaning expansion.",
    m1: ["2024 SALES", "$14.6B"],
    m2: ["GROWTH", "+6.5%"],
    m3: ["MILWAUKEE", "70%"],
    panel: "TTI PLATFORM STRUCTURE",
    bars: [
      { label: "Sales", value: 73, text: "$14.6B" },
      { label: "Growth", value: 33, text: "+6.5%" },
      { label: "MWK", value: 70, text: "70%" },
    ],
    max: 100,
    caption: "Milwaukee defines the group.",
    routes: ["M12", "M18", "Cleaning"],
    footer: "TTI PRODUCT DIRECTION",
    image: "tti-product-direction-image-01.jpg",
  });

  await reviewSheet();
}

async function reviewSheet() {
  const files = [
    "bosch-cordless-dust-collector-cover.jpg",
    "dewalts-rise-harvard-case-cover.jpg",
    "global-power-tool-brands-reshaping-portfolios-cover.jpg",
    "lithium-batteries-in-vacuums-and-power-tools-cover.jpg",
    "one-power-strategy-in-small-appliances-cover.jpg",
    "power-tools-new-cycle-cordless-specialization-cover.jpg",
    "tti-cleaning-appliance-strategy-cover.jpg",
    "tti-product-direction-cover.jpg",
  ];
  const thumbs = [];
  for (const file of files) {
    thumbs.push(await sharp(path.join(outDir, file)).resize(480, 270).jpeg({ quality: 90 }).toBuffer());
  }
  const comps = thumbs.map((input, i) => ({ input, left: 20 + (i % 2) * 500, top: 20 + Math.floor(i / 2) * 290 }));
  await sharp({ create: { width: 1000, height: 1180, channels: 3, background: "#F3F5F7" } })
    .composite(comps)
    .jpeg({ quality: 90 })
    .toFile(path.join(reviewDir, "batch-2026-06-10-power-tool-platforms-review.jpg"));
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
