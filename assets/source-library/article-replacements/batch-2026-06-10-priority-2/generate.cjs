const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "../..");
const outDir = __dirname;

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

function wrappedLines(text, size, width) {
  const maxChars = Math.max(10, Math.floor(width / (size * 0.52)));
  const words = String(text).split(" ");
  const lines = [""];
  for (const word of words) {
    const trial = `${lines[lines.length - 1]} ${word}`.trim();
    if (trial.length > maxChars && lines[lines.length - 1]) lines.push(word);
    else lines[lines.length - 1] = trial;
  }
  return lines;
}

function textBlock(text, x, y, options = {}) {
  const size = options.size || 48;
  const weight = options.weight || 900;
  const color = options.color || ink;
  const width = options.width || 640;
  const lineHeight = options.lineHeight || 1.1;
  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${wrappedLines(text, size, width)
    .map((lineText, index) => `<tspan x="${x}" dy="${index ? size * lineHeight : 0}">${esc(lineText)}</tspan>`)
    .join("")}</text>`;
}

function frame(label, mode = "BRAND ANALYSIS") {
  return `
    <rect width="${W}" height="${H}" fill="${bg}"/>
    <rect x="52" y="52" width="1496" height="796" fill="#FFFFFF"/>
    <rect x="52" y="52" width="1496" height="92" fill="${navy}"/>
    <text x="84" y="111" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
    <text x="1160" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${gold}" letter-spacing="2">${esc(mode)}</text>
    <rect x="92" y="188" width="${Math.max(156, label.length * 12)}" height="36" fill="${gold}"/>
    <text x="112" y="213" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">${esc(label)}</text>`;
}

function metricBox(x, y, w, label, value, fill = pale, valueColor = ink) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="84" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
    <text x="${x + 22}" y="${y + 32}" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${fill === gold ? navy : blue}">${esc(label)}</text>
    <text x="${x + 22}" y="${y + 68}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="${valueColor}">${esc(value)}</text>`;
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

async function roborock() {
  const body = `
    ${frame("TARGET WATCH", "MARKET ANALYSIS")}
    ${textBlock("Roborock's RMB 100B Ambition", 92, 346, { size: 60, width: 690 })}
    ${textBlock("The safer reading is not a straight revenue forecast, but a test of whether Roborock can expand from robot vacuums into a broader cleaning platform.", 96, 508, { size: 28, weight: 800, color: "#29455F", width: 650, lineHeight: 1.16 })}
    ${metricBox(96, 662, 172, "2024 SALES", "USD 1.19B", gold)}
    ${metricBox(292, 662, 172, "MARKET SHARE", "12.3%")}
    ${metricBox(488, 662, 190, "2025 9M GROWTH", "+72.2%")}
    <rect x="820" y="184" width="620" height="530" fill="#F9FBFC" stroke="${line}"/>
    <text x="864" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">AMBITION LADDER</text>
    <rect x="884" y="306" width="470" height="54" fill="${pale}" stroke="${line}"/>
    <rect x="884" y="398" width="470" height="54" fill="${pale}" stroke="${line}"/>
    <rect x="884" y="490" width="470" height="54" fill="${pale}" stroke="${line}"/>
    <rect x="884" y="582" width="470" height="54" fill="${gold}"/>
    <text x="912" y="340" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="${ink}">Robot vacuum leadership</text>
    <text x="912" y="432" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="${ink}">Hard floor washer + dock systems</text>
    <text x="912" y="524" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="${ink}">Global channel expansion</text>
    <text x="912" y="616" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="${navy}">2030 platform test</text>
    <rect x="1162" y="264" width="166" height="56" fill="#FFFFFF" stroke="${line}"/>
    <text x="1190" y="300" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">ROBOROCK</text>
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / ROBOROCK / UNIT-SENSITIVE TARGET REVIEW</text>`;
  await render("roborock-road-to-100-billion-rmb-cover.jpg", body);
}

async function dreame() {
  const body = `
    ${frame("GROWTH LADDER", "BRAND ANALYSIS")}
    ${textBlock("Dreame's Rise to RMB 10 Billion", 92, 352, { size: 60, width: 720 })}
    ${textBlock("Xiaomi ecosystem entry, aggressive category expansion, and heavy capital gave Dreame enough speed to become unavoidable.", 96, 514, { size: 28, weight: 800, color: "#29455F", width: 650, lineHeight: 1.16 })}
    ${metricBox(96, 662, 170, "FIRST HIT", "RMB 700M", gold)}
    ${metricBox(290, 662, 174, "FINANCING", "RMB 3.6B")}
    ${metricBox(488, 662, 190, "ROBOT VACUUM BU", "~RMB 6B")}
    <rect x="812" y="184" width="640" height="540" fill="#F9FBFC" stroke="${line}"/>
    <rect x="96" y="248" width="194" height="46" fill="#FFFFFF" stroke="${line}"/>
    <text x="122" y="278" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">DREAME</text>
    <text x="856" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">FIVE-YEAR BUILD</text>
    <line x1="930" y1="330" x2="1300" y2="620" stroke="${blue}" stroke-width="5"/>
    <circle cx="930" cy="330" r="34" fill="${navy}"/><text x="901" y="338" font-family="Arial" font-size="20" font-weight="900" fill="#FFF">2019</text>
    <circle cx="1054" cy="427" r="34" fill="${gold}"/><text x="1024" y="435" font-family="Arial" font-size="20" font-weight="900" fill="${navy}">2B</text>
    <circle cx="1178" cy="524" r="34" fill="${blue}"/><text x="1148" y="532" font-family="Arial" font-size="20" font-weight="900" fill="#FFF">3.6B</text>
    <circle cx="1300" cy="620" r="34" fill="${navy}"/><text x="1268" y="628" font-family="Arial" font-size="20" font-weight="900" fill="#FFF">10B</text>
    <text x="916" y="694" font-family="Arial" font-size="23" font-weight="900" fill="${ink}">From Xiaomi entry to multi-category attack.</text>
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / DREAME / GROWTH SYSTEM</text>`;
  await render("dreame-rise-to-10-billion-in-five-years-cover.jpg", body);
}

async function dyson() {
  const product = await optionalImage(path.join(root, "brands/dyson/products/dyson-v16-piston-animal-official.png"), {
    width: 520,
    height: 300,
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  });
  const body = `
    ${frame("PRODUCT REVIEW", "MARKET ANALYSIS")}
    <rect x="96" y="246" width="168" height="46" fill="#FFFFFF" stroke="${line}"/>
    <text x="126" y="277" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">DYSON</text>
    ${textBlock("Dyson New Product Review 2025", 92, 356, { size: 58, width: 700 })}
    ${textBlock("The issue is no longer whether Dyson can launch products, but whether its product judgment still leads the category.", 96, 508, { size: 28, weight: 800, color: "#29455F", width: 620, lineHeight: 1.16 })}
    ${metricBox(96, 662, 160, "V16 MOTOR", "900W", gold)}
    ${metricBox(280, 662, 160, "SUCTION", "315AW")}
    ${metricBox(464, 662, 185, "ROBOT GAP", "~3 years")}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="836" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">WCB SCORECARD</text>
    <rect x="838" y="286" width="560" height="62" fill="${pale}" stroke="${line}"/><text x="864" y="325" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">V16: power stack, limited practical gain</text>
    <rect x="838" y="370" width="560" height="62" fill="${pale}" stroke="${line}"/><text x="864" y="409" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">Robot dock: catches up, not leads</text>
    <rect x="838" y="454" width="560" height="62" fill="${pale}" stroke="${line}"/><text x="864" y="493" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">Wash G1: rejects mainstream route</text>
    <rect x="838" y="538" width="560" height="62" fill="${gold}"/><text x="864" y="577" font-family="Arial" font-size="22" font-weight="900" fill="${navy}">Chinese brands widen feature pace</text>
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / DYSON / PRODUCT JUDGMENT</text>`;
  const composites = [];
  if (product) composites.push({ input: product, left: 960, top: 590 });
  await render("dyson-new-product-review-2025-cover.jpg", body, composites);
}

async function irobotFuture() {
  const body = `
    ${frame("CONTROL RISK", "MARKET ANALYSIS")}
    ${textBlock("iRobot's Uncertain Future", 92, 350, { size: 62, width: 690 })}
    ${textBlock("The question is whether Picea can own the brand, keep customers, fund recovery, and avoid regulatory drag at the same time.", 96, 512, { size: 28, weight: 800, color: "#29455F", width: 640, lineHeight: 1.16 })}
    ${metricBox(96, 662, 178, "EXPOSURE", "RMB 2.5B", gold)}
    ${metricBox(298, 662, 190, "INTEGRATION", "3-5 yrs")}
    ${metricBox(512, 662, 176, "DECISION WINDOW", "<2 mo")}
    <rect x="828" y="190" width="608" height="520" fill="#F9FBFC" stroke="${line}"/>
    <text x="872" y="244" font-family="Arial" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">RISK STACK</text>
    <rect x="914" y="300" width="430" height="58" fill="${navy}"/><text x="946" y="337" font-family="Arial" font-size="22" font-weight="900" fill="#FFF">Regulatory uncertainty</text>
    <rect x="914" y="382" width="430" height="58" fill="${pale}" stroke="${line}"/><text x="946" y="419" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">Funding and debt exposure</text>
    <rect x="914" y="464" width="430" height="58" fill="${pale}" stroke="${line}"/><text x="946" y="501" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">Top-customer order transfer</text>
    <rect x="914" y="546" width="430" height="58" fill="${gold}"/><text x="946" y="583" font-family="Arial" font-size="22" font-weight="900" fill="${navy}">Brand recovery spending gap</text>
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / IROBOT / STRATEGIC CONTROL RISK</text>`;
  await render("irobot-uncertain-future-cover.jpg", body);
}

async function beatbot() {
  const logo = await optionalImage(path.join(root, "brands/beatbot/logos/beatbot-official-logo-prime-banner.webp"), {
    width: 370,
    height: 110,
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  });
  const product = await optionalImage(path.join(root, "brands/beatbot/products/beatbot-aquasense-2-ultra-official.png"), {
    width: 560,
    height: 390,
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  });
  const body = `
    ${frame("FOUNDER SIGNAL", "BRAND ANALYSIS")}
    ${textBlock("Beatbot After the RMB 1B Round", 92, 370, { size: 60, width: 700 })}
    ${textBlock("Leifeng.com's interview frames Beatbot as a high-end pool robotics company trying to buy time before the backyard race consolidates.", 96, 532, { size: 28, weight: 800, color: "#29455F", width: 650, lineHeight: 1.16 })}
    ${metricBox(96, 682, 170, "A+ ROUND", "RMB 1B", gold)}
    ${metricBox(290, 682, 180, "MOWER PLAN", "RMB 500M")}
    ${metricBox(494, 682, 190, "SURVIVORS", "4-5")}
    <rect x="840" y="184" width="600" height="540" fill="#EAF2F7"/>
    <rect x="902" y="246" width="470" height="332" fill="#FFFFFF" stroke="${line}"/>
    <text x="936" y="640" font-family="Arial" font-size="24" font-weight="900" fill="${ink}">High-end pool first, mower next.</text>
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / BEATBOT / POOL ROBOTICS</text>`;
  const composites = [];
  if (logo) composites.push({ input: logo, left: 96, top: 250 });
  if (product) composites.push({ input: product, left: 858, top: 238 });
  await render("beatbot-in-leifeng-coverage-cover.jpg", body, composites);
}

async function chinaBackyard() {
  const body = `
    ${frame("CATEGORY SHIFT", "MARKET ANALYSIS")}
    ${textBlock("China's Cleaning Robot Giants Move Into the Backyard", 92, 330, { size: 54, width: 720 })}
    ${textBlock("The core transition is capability reuse: navigation, motors, batteries, docking and app control are moving from indoor floors to lawns and pools.", 96, 522, { size: 28, weight: 800, color: "#29455F", width: 660, lineHeight: 1.16 })}
    ${metricBox(96, 682, 172, "CAPABILITY", "Reusable", gold)}
    ${metricBox(292, 682, 178, "CHANNEL", "Harder")}
    ${metricBox(494, 682, 184, "SERVICE", "Decisive")}
    <rect x="820" y="188" width="640" height="520" fill="#F9FBFC" stroke="${line}"/>
    <text x="864" y="238" font-family="Arial" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">INDOOR TO OUTDOOR MAP</text>
    <rect x="880" y="296" width="220" height="80" fill="${navy}"/><text x="918" y="344" font-family="Arial" font-size="24" font-weight="900" fill="#FFF">Robot Vacuum</text>
    <line x1="1100" y1="336" x2="1220" y2="336" stroke="${blue}" stroke-width="6"/>
    <polygon points="1220,336 1198,322 1198,350" fill="${blue}"/>
    <rect x="1220" y="268" width="170" height="58" fill="${gold}"/><text x="1247" y="304" font-family="Arial" font-size="22" font-weight="900" fill="${navy}">Pool</text>
    <rect x="1220" y="358" width="170" height="58" fill="${pale}" stroke="${line}"/><text x="1247" y="394" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">Lawn</text>
    <rect x="1220" y="448" width="170" height="58" fill="${pale}" stroke="${line}"/><text x="1247" y="484" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">Yard</text>
    <text x="884" y="594" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">Dreame / Ecovacs / Roborock / Anker-linked brands</text>
    <text x="884" y="642" font-family="Arial" font-size="19" font-weight="800" fill="${muted}">Next test: reliability, dealer support, compliance, after-sales.</text>
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / BACKYARD ROBOTICS / MARKET STRUCTURE</text>`;
  await render("china-cleaning-robot-giants-move-into-backyard-cover.jpg", body);
}

async function poolRobotics() {
  const body = `
    ${frame("COMPETITIVE TABLE", "MARKET ANALYSIS")}
    ${textBlock("Robotic Pool Cleaners Become a Backyard Robotics Battle", 92, 320, { size: 54, width: 740 })}
    ${textBlock("The category is no longer one old king versus one challenger. It is channel empires, wireless brands, high-end startups, manufacturers, and outdoor robot platforms entering the same pool.", 96, 522, { size: 27, weight: 800, color: "#29455F", width: 680, lineHeight: 1.16 })}
    ${metricBox(96, 692, 170, "OLD KING", "Maytronics", gold)}
    ${metricBox(290, 692, 170, "CHANNEL", "Fluidra")}
    ${metricBox(484, 692, 170, "CHINA", "Aiper+")}
    <rect x="780" y="184" width="700" height="560" fill="#F9FBFC" stroke="${line}"/>
    <text x="824" y="238" font-family="Arial" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">PLAYER MAP</text>
    <rect x="826" y="288" width="280" height="84" fill="${navy}"/><text x="856" y="338" font-family="Arial" font-size="24" font-weight="900" fill="#FFF">Old order</text><text x="1140" y="338" font-family="Arial" font-size="23" font-weight="900" fill="${ink}">Maytronics / Dolphin</text>
    <rect x="826" y="392" width="280" height="84" fill="${gold}"/><text x="856" y="442" font-family="Arial" font-size="24" font-weight="900" fill="${navy}">Channel empire</text><text x="1140" y="442" font-family="Arial" font-size="23" font-weight="900" fill="${ink}">Fluidra / Hayward</text>
    <rect x="826" y="496" width="280" height="84" fill="${pale}" stroke="${line}"/><text x="856" y="546" font-family="Arial" font-size="24" font-weight="900" fill="${ink}">New brands</text><text x="1140" y="546" font-family="Arial" font-size="23" font-weight="900" fill="${ink}">Aiper / Beatbot / WYBOT</text>
    <rect x="826" y="600" width="280" height="84" fill="${pale}" stroke="${line}"/><text x="856" y="650" font-family="Arial" font-size="24" font-weight="900" fill="${ink}">Platform entrants</text><text x="1140" y="650" font-family="Arial" font-size="23" font-weight="900" fill="${ink}">Dreame / Roborock / Mammotion</text>
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / POOL ROBOTICS / COMPETITIVE STRUCTURE</text>`;
  await render("pool-robotics-new-competitive-table-cover.jpg", body);
}

async function backyardBattlefield() {
  const body = `
    ${frame("HARDWARE BATTLEFIELD", "INDUSTRY OPINION")}
    ${textBlock("Backyard Robotics Is China's Next Hardware Battlefield", 92, 322, { size: 54, width: 700 })}
    ${textBlock("The fight is moving from isolated devices to capital, channels, service networks, and multi-season outdoor robot systems.", 96, 512, { size: 28, weight: 800, color: "#29455F", width: 640, lineHeight: 1.16 })}
    ${metricBox(96, 672, 170, "BEATBOT ROUND", "RMB 1B", gold)}
    ${metricBox(290, 672, 170, "TOTAL RAISED", ">RMB 1.5B")}
    ${metricBox(484, 672, 190, "CHANNEL TEST", "POOLCORP")}
    <rect x="820" y="184" width="640" height="540" fill="#F9FBFC" stroke="${line}"/>
    <text x="864" y="238" font-family="Arial" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">FROM PRODUCT TO OPERATING SYSTEM</text>
    <rect x="900" y="304" width="180" height="70" fill="${navy}"/><text x="940" y="347" font-family="Arial" font-size="23" font-weight="900" fill="#FFF">Product</text>
    <line x1="1080" y1="339" x2="1170" y2="339" stroke="${blue}" stroke-width="6"/>
    <polygon points="1170,339 1148,325 1148,353" fill="${blue}"/>
    <rect x="1170" y="304" width="180" height="70" fill="${gold}"/><text x="1215" y="347" font-family="Arial" font-size="23" font-weight="900" fill="${navy}">Capital</text>
    <line x1="1260" y1="374" x2="1260" y2="438" stroke="${blue}" stroke-width="6"/>
    <polygon points="1260,438 1246,416 1274,416" fill="${blue}"/>
    <rect x="1170" y="438" width="180" height="70" fill="${pale}" stroke="${line}"/><text x="1214" y="481" font-family="Arial" font-size="23" font-weight="900" fill="${ink}">Channel</text>
    <line x1="1170" y1="473" x2="1080" y2="473" stroke="${blue}" stroke-width="6"/>
    <polygon points="1080,473 1102,459 1102,487" fill="${blue}"/>
    <rect x="900" y="438" width="180" height="70" fill="${pale}" stroke="${line}"/><text x="944" y="481" font-family="Arial" font-size="23" font-weight="900" fill="${ink}">Service</text>
    <rect x="864" y="568" width="170" height="62" fill="${navy}"/><text x="898" y="606" font-family="Arial" font-size="21" font-weight="900" fill="#FFF">Capital</text>
    <rect x="1058" y="568" width="170" height="62" fill="${gold}"/><text x="1092" y="606" font-family="Arial" font-size="21" font-weight="900" fill="${navy}">Dealer</text>
    <rect x="1252" y="568" width="170" height="62" fill="${pale}" stroke="${line}"/><text x="1282" y="606" font-family="Arial" font-size="21" font-weight="900" fill="${ink}">Service</text>
    <text x="864" y="682" font-family="Arial" font-size="22" font-weight="900" fill="${ink}">Winners control the backyard after first failure.</text>
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB / BACKYARD ROBOTICS / CHANNEL + SERVICE</text>`;
  await render("backyard-robotics-china-next-hardware-battlefield-cover.jpg", body);
}

async function reviewSheet() {
  const files = [
    "roborock-road-to-100-billion-rmb-cover.jpg",
    "dreame-rise-to-10-billion-in-five-years-cover.jpg",
    "dyson-new-product-review-2025-cover.jpg",
    "irobot-uncertain-future-cover.jpg",
    "beatbot-in-leifeng-coverage-cover.jpg",
    "china-cleaning-robot-giants-move-into-backyard-cover.jpg",
    "pool-robotics-new-competitive-table-cover.jpg",
    "backyard-robotics-china-next-hardware-battlefield-cover.jpg",
  ];
  const thumbs = [];
  for (const file of files) {
    thumbs.push(await sharp(path.join(outDir, file)).resize(480, 270).jpeg({ quality: 90 }).toBuffer());
  }
  const composites = thumbs.map((input, i) => ({
    input,
    left: 20 + (i % 2) * 500,
    top: 20 + Math.floor(i / 2) * 290,
  }));
  await sharp({ create: { width: 1000, height: 1180, channels: 3, background: "#F3F5F7" } })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toFile(path.join(root, "_review/batch-2026-06-10-priority-2-review.jpg"));
}

async function build() {
  fs.mkdirSync(outDir, { recursive: true });
  await roborock();
  await dreame();
  await dyson();
  await irobotFuture();
  await beatbot();
  await chinaBackyard();
  await poolRobotics();
  await backyardBattlefield();
  await reviewSheet();
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
