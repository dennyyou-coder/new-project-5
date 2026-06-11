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
const red = "#C4493D";
const green = "#2A7B5F";
const gold = "#F1C84B";
const muted = "#5D7180";
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
    <text x="1184" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${gold}" letter-spacing="2">${esc(mode)}</text>
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

function route(x, y, items) {
  return items.map((item, i) => {
    const yy = y + i * 68;
    return `
      <circle cx="${x}" cy="${yy}" r="14" fill="${i === 0 ? gold : i === items.length - 1 ? red : green}"/>
      <rect x="${x + 34}" y="${yy - 23}" width="332" height="46" fill="${i === 0 ? navy : "#FFFFFF"}" stroke="${i === 0 ? navy : line}"/>
      <text x="${x + 54}" y="${yy + 7}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="900" fill="${i === 0 ? "#FFFFFF" : ink}">${esc(item)}</text>
      ${i < items.length - 1 ? `<line x1="${x}" y1="${yy + 14}" x2="${x}" y2="${yy + 54}" stroke="${line}" stroke-width="4"/>` : ""}`;
  }).join("");
}

function bars(x, y, data, max = 80) {
  return data.map((d, i) => {
    const h = Math.round((d.value / max) * 220);
    const bx = x + i * 86;
    const fill = i === 0 ? gold : i === 1 ? red : i === 2 ? green : blue;
    return `
      <rect x="${bx}" y="${y + 240 - h}" width="54" height="${h}" fill="${fill}"/>
      <text x="${bx + 27}" y="${y + 270}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${ink}">${esc(d.label)}</text>
      <text x="${bx + 27}" y="${y + 240 - h - 12}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${ink}">${esc(d.text)}</text>`;
  }).join("");
}

function brandGrid(x, y, items) {
  return items.map((item, i) => chip(x + (i % 3) * 172, y + Math.floor(i / 3) * 54, item, i === 0 ? gold : "#FFFFFF")).join("");
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

async function dataCover(name, cfg) {
  const image = await img(cfg.image, { width: 310, height: 220, fit: "cover" });
  const body = `
    ${frame("DATA VISUAL", cfg.label)}
    ${textBlock(cfg.title, 92, 296, { size: cfg.titleSize || 56, width: 640 })}
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
    <text x="92" y="812" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6D7D88" letter-spacing="0.8">WCB / TRADE &amp; SUPPLY CHAIN / ${esc(cfg.footer)}</text>`;
  await render(name, body, image ? [{ input: image, left: 1140, top: 302 }] : []);
}

async function opinionCover(name, cfg) {
  const image = await img(cfg.image, { width: 690, height: 498, fit: "cover" });
  const body = `
    ${frame("INDUSTRY OPINION", cfg.label)}
    <rect x="778" y="144" width="770" height="704" fill="${navy}"/>
    <rect x="820" y="194" width="690" height="498" fill="#EFF4F7"/>
    <rect x="820" y="642" width="690" height="50" fill="${navy}" opacity="0.74"/>
    <text x="850" y="675" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="#FFFFFF">${esc(cfg.caption)}</text>
    ${textBlock(cfg.title, 92, 302, { size: cfg.titleSize || 56, width: 630 })}
    ${textBlock(cfg.copy, 96, cfg.copyY || 510, { size: 28, weight: 800, color: "#35566D", width: 630, lineHeight: 1.16 })}
    ${route(112, 650, cfg.routes)}
    ${brandGrid(828, 724, cfg.chips)}
    <text x="92" y="812" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6D7D88" letter-spacing="0.8">WCB / INDUSTRY OPINION / ${esc(cfg.footer)}</text>`;
  await render(name, body, image ? [{ input: image, left: 820, top: 194 }] : []);
}

async function build() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(reviewDir, { recursive: true });

  await dataCover("china-us-trade-war-pause-cover.jpg", {
    label: "TRADE PAUSE",
    title: "The Pause in the China-U.S. Trade War",
    titleSize: 56,
    copy: "A tariff pause gives exporters time, but it does not remove the need for supply-chain flexibility.",
    m1: ["BUFFER", "90 days"],
    m2: ["TARIFF", "10%"],
    m3: ["RISK", "25%"],
    panel: "TARIFF PRESSURE PATH",
    bars: [
      { label: "NOW", value: 10, text: "10%" },
      { label: "RISK", value: 25, text: "25%" },
      { label: "COST", value: 15, text: "+15%" },
    ],
    max: 30,
    caption: "Pause is not reversal.",
    routes: ["Tariff pause", "Vietnam cost", "Customer split"],
    footer: "TRADE WAR PAUSE",
    image: "china-us-trade-war-pause-image-001.jpg",
  });

  await dataCover("trade-war-scenario-analysis-cover.jpg", {
    label: "SCENARIO TREE",
    title: "A Scenario Analysis of the Trade War",
    titleSize: 54,
    copy: "Cleaning appliance exporters need operating plans for low, medium and extreme tariff outcomes.",
    m1: ["LOW CASE", "<15%"],
    m2: ["BASE CASE", "25%"],
    m3: ["STRESS", "60%"],
    panel: "THREE TARIFF SCENARIOS",
    bars: [
      { label: "LOW", value: 15, text: "<15%" },
      { label: "BASE", value: 25, text: "25%" },
      { label: "HIGH", value: 60, text: "60%" },
    ],
    max: 60,
    caption: "Capacity follows tariffs.",
    routes: ["China orders", "SEA transfer", "R&D pressure"],
    footer: "SCENARIO ANALYSIS",
    image: "trade-war-scenario-analysis-image-01.jpg",
  });

  await dataCover("impact-of-trump-reciprocal-tariffs-cover.jpg", {
    label: "RECIPROCAL TARIFFS",
    title: "What Impact Will Trump's Reciprocal Tariffs Have?",
    titleSize: 50,
    copy: "The biggest shock is not one number. It is uncertainty across China, Vietnam, Europe and Southeast Asia.",
    m1: ["CHINA", "34%"],
    m2: ["VIETNAM", "46%"],
    m3: ["EU", "20%"],
    panel: "COUNTRY TARIFF SIGNALS",
    bars: [
      { label: "CN", value: 34, text: "34%" },
      { label: "VN", value: 46, text: "46%" },
      { label: "EU", value: 20, text: "20%" },
      { label: "JP", value: 24, text: "24%" },
    ],
    max: 50,
    caption: "Uncertainty hits orders first.",
    routes: ["Price hike", "Low inventory", "Order delay"],
    footer: "RECIPROCAL TARIFFS",
    image: "impact-of-trump-reciprocal-tariffs-image-01.jpg",
  });

  await opinionCover("american-factory-and-manufacturing-transfer-cover.jpg", {
    label: "FACTORY TRANSFER",
    title: "American Factory and Manufacturing Transfer",
    titleSize: 54,
    copy: "Moving production is not only a cost calculation. It also brings labor, culture and management friction.",
    caption: "Manufacturing transfer is an operating problem.",
    routes: ["Labor", "Culture", "Process"],
    chips: ["Fuyao", "U.S. factory", "China team", "Union", "Cost", "Training"],
    footer: "MANUFACTURING TRANSFER",
    image: "american-factory-and-manufacturing-transfer-image-018.jpg",
  });

  await opinionCover("how-to-understand-complete-supply-chain-transfer-cover.jpg", {
    label: "SUPPLY CHAIN",
    title: "How to Understand Complete Supply Chain Transfer",
    titleSize: 50,
    copy: "Final assembly relocation is easy to say. Full supply-chain migration depends on parts, tooling and engineers.",
    caption: "Assembly transfer is not full transfer.",
    routes: ["Assembly", "Components", "Engineering"],
    chips: ["China", "Vietnam", "Mexico", "Suppliers", "Tooling", "Engineers"],
    footer: "COMPLETE TRANSFER",
    image: "how-to-understand-complete-supply-chain-transfer-image-01.jpg",
  });

  await opinionCover("do-you-still-need-trade-shows-if-you-know-the-suppliers-cover.jpg", {
    label: "TRADE SHOW VALUE",
    title: "Do You Still Need Trade Shows If You Already Know the Suppliers?",
    titleSize: 46,
    copy: "Knowing suppliers is not the same as seeing technology direction, competitor moves and new relationships.",
    caption: "Exhibitions compress industry discovery.",
    routes: ["Technology", "Competitors", "Connections"],
    chips: ["Engineers", "R&D", "Founders", "Suppliers", "Investors", "Forum"],
    footer: "TRADE SHOW INTELLIGENCE",
    image: "do-you-still-need-trade-shows-if-you-know-the-suppliers-image-01.jpg",
  });

  await opinionCover("midea-supplier-summit-review-cover.jpg", {
    label: "SUPPLIER SUMMIT",
    title: "A Review of Midea's Supplier Summit",
    titleSize: 56,
    copy: "Large appliance groups use supplier summits to compress technology discovery, trust-building and project matching.",
    caption: "Supplier coordination becomes a scale advantage.",
    routes: ["Booth", "R&D", "Procurement"],
    chips: ["Midea", "200+ suppliers", "R&D", "Procurement", "Booths", "Projects"],
    footer: "SUPPLIER SYSTEM",
    image: "midea-supplier-summit-review-image-002.jpg",
  });

  await dataCover("china-cleaning-appliance-financial-reality-check-cover.jpg", {
    label: "FINANCIAL CHECK",
    title: "China's Cleaning Appliance Industry Is Entering a Financial Reality Check",
    titleSize: 45,
    copy: "Growth still exists, but profit, cash flow, tariffs and exchange rates are testing every layer of the supply chain.",
    m1: ["ECOVACS Q1", "RMB 4.9B"],
    m2: ["MIDEA Q1", "RMB 131B"],
    m3: ["PUDU FUNDING", "~RMB 1B"],
    panel: "GROWTH VS OPERATING TEST",
    bars: [
      { label: "ECO", value: 27, text: "+27%" },
      { label: "ANKER", value: 27, text: "+27%" },
      { label: "PUDU", value: 15, text: "1B" },
    ],
    max: 32,
    caption: "Margins decide maturity.",
    routes: ["Revenue", "Profit", "Cash flow"],
    footer: "FINANCIAL REALITY",
    image: "china-cleaning-appliance-financial-reality-check-image-01.jpg",
  });

  await reviewSheet();
}

async function reviewSheet() {
  const files = [
    "china-us-trade-war-pause-cover.jpg",
    "trade-war-scenario-analysis-cover.jpg",
    "impact-of-trump-reciprocal-tariffs-cover.jpg",
    "american-factory-and-manufacturing-transfer-cover.jpg",
    "how-to-understand-complete-supply-chain-transfer-cover.jpg",
    "do-you-still-need-trade-shows-if-you-know-the-suppliers-cover.jpg",
    "midea-supplier-summit-review-cover.jpg",
    "china-cleaning-appliance-financial-reality-check-cover.jpg",
  ];
  const thumbs = [];
  for (const file of files) {
    thumbs.push(await sharp(path.join(outDir, file)).resize(480, 270).jpeg({ quality: 90 }).toBuffer());
  }
  const comps = thumbs.map((input, i) => ({ input, left: 20 + (i % 2) * 500, top: 20 + Math.floor(i / 2) * 290 }));
  await sharp({ create: { width: 1000, height: 1180, channels: 3, background: "#F3F5F7" } })
    .composite(comps)
    .jpeg({ quality: 90 })
    .toFile(path.join(reviewDir, "batch-2026-06-10-supply-trade-review.jpg"));
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
