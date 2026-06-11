const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = __dirname;
const outDir = path.join(root, "previews");
fs.mkdirSync(outDir, { recursive: true });

const logoPath = path.join(root, "logos", "maytronics-official-logo.svg");
const personPath = path.join(root, "people", "rafi-benami-official-maytronics.jpg");
const productPath = path.join(root, "products", "dolphin-liberty-600-official.png");
const historyPath = path.join(root, "evidence", "maytronics-1983-dolphin-timeline.png");

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrappedTextSvg(text, x, y, options = {}) {
  const size = options.size || 54;
  const weight = options.weight || 700;
  const color = options.color || "#123B68";
  const width = options.width || 700;
  const lineHeight = options.lineHeight || 1.1;
  const canvasHeight = options.canvasHeight || 900;
  const maxChars = Math.max(10, Math.floor(width / (size * 0.52)));
  const words = text.split(" ");
  const lines = [""];

  for (const word of words) {
    const trial = `${lines[lines.length - 1]} ${word}`.trim();
    if (trial.length > maxChars && lines[lines.length - 1]) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = trial;
    }
  }

  const tspans = lines
    .map((line, index) => `<tspan x="${x}" dy="${index ? size * lineHeight : 0}">${esc(line)}</tspan>`)
    .join("");

  return Buffer.from(
    `<svg width="1600" height="${canvasHeight}"><text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${tspans}</text></svg>`,
  );
}

function svg(input) {
  return Buffer.from(input);
}

async function build() {
  const logo = await sharp(logoPath).resize({ width: 360 }).png().toBuffer();
  const logoLarge = await sharp(logoPath).resize({ width: 470 }).png().toBuffer();
  const person = await sharp(personPath)
    .resize({ width: 520, height: 620, fit: "cover", position: "north" })
    .png()
    .toBuffer();
  const personCard = await sharp(personPath)
    .resize({ width: 380, height: 250, fit: "cover", position: "north" })
    .png()
    .toBuffer();
  const product = await sharp(productPath)
    .resize({ width: 530, height: 420, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
  const productCard = await sharp(productPath)
    .resize({ width: 520, height: 245, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
  const history = await sharp(historyPath)
    .resize({ width: 520, height: 310, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
  const historyCard = await sharp(historyPath)
    .resize({ width: 520, height: 245, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  await sharp({
    create: { width: 1600, height: 900, channels: 3, background: "#FFFFFF" },
  })
    .composite([
      {
        input: svg(`<svg width="1600" height="900">
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop stop-color="#FFFFFF"/>
              <stop offset="1" stop-color="#EAF4FB"/>
            </linearGradient>
          </defs>
          <rect width="1600" height="900" fill="url(#g)"/>
          <circle cx="1320" cy="180" r="420" fill="#D6F2F7" opacity="0.8"/>
          <path d="M0 760 C360 690 560 790 890 710 C1160 645 1370 695 1600 630 L1600 900 L0 900 Z" fill="#DDEFF8"/>
          <rect x="1290" y="24" width="238" height="48" fill="#0B4C8C" opacity="0.95"/>
          <text x="1322" y="56" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#FFFFFF" font-weight="700">Brand Analysis</text>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: logo, left: 72, top: 74 },
      { input: wrappedTextSvg("The Next iRobot of Pool Cleaning?", 72, 235, { size: 72, width: 680, color: "#0B315D" }), left: 0, top: 0 },
      {
        input: wrappedTextSvg("How Maytronics is facing cordless pool robots, Chinese challengers, and a new channel war.", 78, 470, {
          size: 30,
          width: 640,
          color: "#365A78",
          weight: 500,
          lineHeight: 1.22,
        }),
        left: 0,
        top: 0,
      },
      { input: person, left: 900, top: 145 },
      { input: product, left: 640, top: 430 },
      {
        input: svg(`<svg width="1600" height="900">
          <rect x="1092" y="604" width="350" height="92" rx="18" fill="#0B315D" opacity="0.92"/>
          <text x="1124" y="646" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#FFFFFF" font-weight="700">Rafi Benami</text>
          <text x="1124" y="678" font-family="Arial, Helvetica, sans-serif" font-size="21" fill="#D9EBF7">CEO, Maytronics</text>
          <text x="78" y="820" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#0B315D" font-weight="700">WORLD CLEAN BIZ</text>
        </svg>`),
        left: 0,
        top: 0,
      },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "maytronics-cover-preview-v1.jpg"));

  const personEditorial = await sharp(personPath)
    .resize({ width: 560, height: 670, fit: "cover", position: "north" })
    .modulate({ saturation: 0.92, brightness: 1.02 })
    .png()
    .toBuffer();
  const productEditorial = await sharp(productPath)
    .resize({ width: 640, height: 420, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
  const productHero = await sharp(productPath)
    .resize({ width: 860, height: 560, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: { width: 1600, height: 900, channels: 3, background: "#F7F6F2" },
  })
    .composite([
      {
        input: svg(`<svg width="1600" height="900">
          <rect width="1600" height="900" fill="#F7F6F2"/>
          <rect x="0" y="0" width="1600" height="82" fill="#081F3A"/>
          <text x="54" y="54" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF">WORLD CLEAN BIZ</text>
          <text x="1302" y="54" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#9FD8F5">BRAND ANALYSIS</text>
          <rect x="54" y="118" width="1492" height="716" fill="#FFFFFF" stroke="#D6DEE8" stroke-width="2"/>
          <rect x="54" y="118" width="18" height="716" fill="#1D75B9"/>
          <rect x="1000" y="118" width="546" height="716" fill="#E9F3F8"/>
          <path d="M1000 700 C1130 635 1300 675 1546 610 L1546 834 L1000 834 Z" fill="#D5EAF4"/>
          <text x="112" y="186" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#1D75B9" letter-spacing="2">POOL ROBOTICS</text>
          <text x="112" y="805" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#6D8194">ISSUE NOTE 2026 / INDUSTRY INTELLIGENCE</text>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: logo, left: 112, top: 216 },
      {
        input: wrappedTextSvg("The Next iRobot?", 112, 370, {
          size: 96,
          width: 720,
          color: "#081F3A",
          weight: 900,
          lineHeight: 0.98,
        }),
        left: 0,
        top: 0,
      },
      {
        input: wrappedTextSvg("How Maytronics is facing Chinese challengers, cordless innovation, and a new channel war.", 116, 585, {
          size: 31,
          width: 680,
          color: "#263F57",
          weight: 600,
          lineHeight: 1.18,
        }),
        left: 0,
        top: 0,
      },
      {
        input: svg(`<svg width="1600" height="900">
          <rect x="112" y="676" width="330" height="82" fill="#F0C84B"/>
          <text x="132" y="707" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="800" fill="#081F3A">KEY DATA</text>
          <text x="132" y="742" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="900" fill="#081F3A">Global Pool Cleaning Leader</text>
          <rect x="466" y="676" width="470" height="82" fill="#E9F3F8" stroke="#C8D9E6"/>
          <text x="490" y="709" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="800" fill="#1D75B9">STRATEGIC SIGNAL</text>
          <text x="490" y="742" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800" fill="#081F3A">Cordless pool robots changed the race</text>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: personEditorial, left: 1008, top: 160 },
      { input: productEditorial, left: 746, top: 485 },
      {
        input: svg(`<svg width="1600" height="900">
          <rect x="1074" y="685" width="340" height="88" fill="#081F3A" opacity="0.94"/>
          <text x="1102" y="724" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="900" fill="#FFFFFF">Rafi Benami</text>
          <text x="1102" y="754" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#C9DFEF">CEO, Maytronics</text>
          <line x1="54" y1="858" x2="1546" y2="858" stroke="#081F3A" stroke-width="3"/>
        </svg>`),
        left: 0,
        top: 0,
      },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "maytronics-cover-preview-v2.jpg"));

  await sharp({
    create: { width: 1600, height: 900, channels: 3, background: "#F6F4EF" },
  })
    .composite([
      {
        input: svg(`<svg width="1600" height="900">
          <rect width="1600" height="900" fill="#F6F4EF"/>
          <rect x="0" y="0" width="1600" height="86" fill="#071F3A"/>
          <text x="54" y="55" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
          <text x="1110" y="55" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="800" fill="#A7D8F0" letter-spacing="2">INDUSTRY INTELLIGENCE</text>
          <rect x="54" y="120" width="1492" height="716" fill="#FFFFFF" stroke="#D0DAE5" stroke-width="2"/>
          <rect x="54" y="120" width="16" height="716" fill="#1C74B7"/>
          <rect x="1010" y="120" width="536" height="716" fill="#E6F0F5"/>
          <rect x="111" y="160" width="168" height="34" fill="#071F3A"/>
          <text x="128" y="184" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" letter-spacing="2">POOL ROBOTICS</text>
          <rect x="294" y="160" width="150" height="34" fill="#E9C64A"/>
          <text x="312" y="184" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#071F3A" letter-spacing="1.5">SPECIAL REPORT</text>
          <text x="112" y="802" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#6C7B88">ISSUE NOTE 2026 / CATEGORY STRATEGY</text>
          <ellipse cx="1036" cy="778" rx="310" ry="42" fill="#0B1E33" opacity="0.18"/>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: logoLarge, left: 112, top: 218 },
      {
        input: wrappedTextSvg("The Next iRobot?", 112, 386, {
          size: 72,
          width: 650,
          color: "#071F3A",
          weight: 900,
          lineHeight: 0.98,
        }),
        left: 0,
        top: 0,
      },
      {
        input: wrappedTextSvg("How Maytronics is facing Chinese challengers, cordless innovation, and a new channel war.", 116, 532, {
          size: 29,
          width: 650,
          color: "#263F57",
          weight: 650,
          lineHeight: 1.16,
        }),
        left: 0,
        top: 0,
      },
      {
        input: svg(`<svg width="1600" height="900">
          <rect x="112" y="648" width="270" height="86" fill="#E9C64A"/>
          <text x="132" y="679" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" fill="#071F3A">EVIDENCE</text>
          <text x="132" y="714" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="900" fill="#071F3A">Since 1983</text>
          <rect x="402" y="648" width="335" height="86" fill="#EAF2F7" stroke="#C4D8E7"/>
          <text x="424" y="679" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" fill="#1C74B7">CATEGORY SIGNAL</text>
          <text x="424" y="714" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="#071F3A">40+ Years In Pool Robotics</text>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: personEditorial, left: 1065, top: 168 },
      { input: productHero, left: 660, top: 398 },
      {
        input: svg(`<svg width="1600" height="900">
          <rect x="1110" y="654" width="328" height="86" fill="#071F3A" opacity="0.94"/>
          <text x="1136" y="692" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">Rafi Benami</text>
          <text x="1136" y="723" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#CFE3F2">CEO, Maytronics</text>
          <line x1="54" y1="858" x2="1546" y2="858" stroke="#071F3A" stroke-width="3"/>
        </svg>`),
        left: 0,
        top: 0,
      },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "maytronics-cover-preview-v3.jpg"));

  const personV4 = await sharp(personPath)
    .resize({ width: 500, height: 600, fit: "cover", position: "north" })
    .modulate({ saturation: 0.9, brightness: 1.02 })
    .png()
    .toBuffer();
  const productV4 = await sharp(productPath)
    .resize({ width: 980, height: 650, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
  const productV5 = await sharp(productPath)
    .resize({ width: 1080, height: 710, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: { width: 1600, height: 900, channels: 3, background: "#F5F3EE" },
  })
    .composite([
      {
        input: svg(`<svg width="1600" height="900">
          <rect width="1600" height="900" fill="#F5F3EE"/>
          <rect x="0" y="0" width="1600" height="88" fill="#071F3A"/>
          <text x="54" y="56" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
          <text x="1116" y="56" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#A7D8F0" letter-spacing="2.6">INDUSTRY INTELLIGENCE</text>
          <rect x="54" y="120" width="1492" height="716" fill="#FFFFFF" stroke="#CEDAE6" stroke-width="2"/>
          <rect x="54" y="120" width="16" height="716" fill="#1C74B7"/>
          <rect x="982" y="120" width="564" height="716" fill="#E6F0F5"/>
          <rect x="110" y="154" width="166" height="34" fill="#071F3A"/>
          <text x="127" y="178" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" letter-spacing="2">POOL ROBOTICS</text>
          <rect x="292" y="154" width="154" height="34" fill="#E9C64A"/>
          <text x="311" y="178" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#071F3A" letter-spacing="1.4">BRAND ANALYSIS</text>
          <text x="112" y="790" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" fill="#6B7C88" letter-spacing="1.2">WCB-2026-006 / POOL ROBOTICS / BRAND ANALYSIS</text>
          <ellipse cx="1058" cy="790" rx="390" ry="50" fill="#0B1E33" opacity="0.17"/>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: logoLarge, left: 110, top: 212 },
      {
        input: svg(`<svg width="1600" height="900">
          <text x="112" y="356" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="900" fill="#1C74B7" letter-spacing="3">MAYTRONICS</text>
        </svg>`),
        left: 0,
        top: 0,
      },
      {
        input: wrappedTextSvg("The Next iRobot?", 112, 430, {
          size: 56,
          width: 610,
          color: "#071F3A",
          weight: 900,
          lineHeight: 1,
        }),
        left: 0,
        top: 0,
      },
      {
        input: wrappedTextSvg("How Maytronics is facing Chinese challengers, cordless innovation, and a new channel war.", 116, 552, {
          size: 27,
          width: 615,
          color: "#263F57",
          weight: 650,
          lineHeight: 1.15,
        }),
        left: 0,
        top: 0,
      },
      {
        input: svg(`<svg width="1600" height="900">
          <rect x="112" y="665" width="166" height="74" fill="#E9C64A"/>
          <text x="132" y="693" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#071F3A">DATA</text>
          <text x="132" y="723" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="900" fill="#071F3A">40+ Years</text>
          <rect x="292" y="665" width="184" height="74" fill="#EAF2F7" stroke="#C4D8E7"/>
          <text x="314" y="693" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#1C74B7">POSITION</text>
          <text x="314" y="723" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="#071F3A">Global Leader</text>
          <rect x="490" y="665" width="170" height="74" fill="#F7FAFC" stroke="#C4D8E7"/>
          <text x="512" y="693" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#1C74B7">EVIDENCE</text>
          <text x="512" y="723" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="#071F3A">Since 1983</text>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: personV4, left: 1088, top: 158 },
      { input: productV4, left: 585, top: 330 },
      {
        input: svg(`<svg width="1600" height="900">
          <rect x="1162" y="664" width="260" height="68" fill="#071F3A" opacity="0.9"/>
          <text x="1184" y="694" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="#FFFFFF">Rafi Benami</text>
          <text x="1184" y="720" font-family="Arial, Helvetica, sans-serif" font-size="17" fill="#CFE3F2">CEO, Maytronics</text>
          <line x1="54" y1="858" x2="1546" y2="858" stroke="#071F3A" stroke-width="3"/>
        </svg>`),
        left: 0,
        top: 0,
      },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "maytronics-cover-preview-v4.jpg"));

  await sharp({
    create: { width: 1600, height: 900, channels: 3, background: "#F5F3EE" },
  })
    .composite([
      {
        input: svg(`<svg width="1600" height="900">
          <rect width="1600" height="900" fill="#F5F3EE"/>
          <rect x="0" y="0" width="1600" height="88" fill="#071F3A"/>
          <text x="54" y="56" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
          <text x="1116" y="56" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#A7D8F0" letter-spacing="2.6">INDUSTRY INTELLIGENCE</text>
          <rect x="54" y="120" width="1492" height="716" fill="#FFFFFF" stroke="#CEDAE6" stroke-width="2"/>
          <rect x="54" y="120" width="16" height="716" fill="#1C74B7"/>
          <rect x="982" y="120" width="564" height="716" fill="#E6F0F5"/>
          <rect x="110" y="154" width="166" height="34" fill="#071F3A"/>
          <text x="127" y="178" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" letter-spacing="2">POOL ROBOTICS</text>
          <rect x="292" y="154" width="154" height="34" fill="#E9C64A"/>
          <text x="311" y="178" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#071F3A" letter-spacing="1.4">BRAND ANALYSIS</text>
          <text x="112" y="790" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" fill="#6B7C88" letter-spacing="1.2">WCB-2026-006 / POOL ROBOTICS / BRAND ANALYSIS</text>
          <ellipse cx="1020" cy="794" rx="438" ry="54" fill="#0B1E33" opacity="0.17"/>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: logoLarge, left: 110, top: 212 },
      {
        input: svg(`<svg width="1600" height="900">
          <text x="112" y="356" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="900" fill="#1C74B7" letter-spacing="3">MAYTRONICS</text>
        </svg>`),
        left: 0,
        top: 0,
      },
      {
        input: wrappedTextSvg("The Next iRobot?", 112, 430, {
          size: 56,
          width: 610,
          color: "#071F3A",
          weight: 900,
          lineHeight: 1,
        }),
        left: 0,
        top: 0,
      },
      {
        input: wrappedTextSvg("How Maytronics is facing Chinese challengers, cordless innovation, and a new channel war.", 116, 552, {
          size: 27,
          width: 615,
          color: "#263F57",
          weight: 650,
          lineHeight: 1.15,
        }),
        left: 0,
        top: 0,
      },
      {
        input: svg(`<svg width="1600" height="900">
          <rect x="112" y="665" width="166" height="74" fill="#E9C64A"/>
          <text x="132" y="693" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#071F3A">DATA</text>
          <text x="132" y="723" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="900" fill="#071F3A">40+ Years</text>
          <rect x="292" y="665" width="184" height="74" fill="#EAF2F7" stroke="#C4D8E7"/>
          <text x="314" y="693" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#1C74B7">POSITION</text>
          <text x="314" y="723" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="#071F3A">Global Leader</text>
          <rect x="490" y="665" width="170" height="74" fill="#F7FAFC" stroke="#C4D8E7"/>
          <text x="512" y="693" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#1C74B7">EVIDENCE</text>
          <text x="512" y="723" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="#071F3A">Since 1983</text>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: personV4, left: 1105, top: 158 },
      { input: productV5, left: 520, top: 300 },
      {
        input: svg(`<svg width="1600" height="900">
          <rect x="1180" y="674" width="218" height="56" fill="#071F3A" opacity="0.82"/>
          <text x="1202" y="700" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="850" fill="#FFFFFF">Rafi Benami</text>
          <text x="1202" y="722" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#CFE3F2">CEO</text>
          <line x1="54" y1="858" x2="1546" y2="858" stroke="#071F3A" stroke-width="3"/>
        </svg>`),
        left: 0,
        top: 0,
      },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "maytronics-cover-template-v1.jpg"));

  const cards = [
    ["Person Evidence", "Rafi Benami", "CEO, Maytronics", personCard, 60, 170],
    ["Product Evidence", "Dolphin LIBERTY 600", "Official product image", productCard, 835, 170],
    ["History Evidence", "First-generation Dolphin", "Maytronics timeline, 1983", historyCard, 60, 665],
  ];
  const bodyComps = [
    {
      input: svg(`<svg width="1600" height="1200">
        <rect width="1600" height="1200" fill="#FFFFFF"/>
        <text x="60" y="72" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700" fill="#0B315D">Maytronics Body Image System Preview</text>
        <text x="60" y="115" font-family="Arial, Helvetica, sans-serif" font-size="23" fill="#52708B">Real-source evidence blocks for article body layout</text>
      </svg>`),
      left: 0,
      top: 0,
    },
  ];

  for (const [title, line1, line2, img, x, y] of cards) {
    bodyComps.push({
      input: svg(`<svg width="1600" height="1200">
        <rect x="${x}" y="${y}" width="705" height="430" rx="24" fill="#F7F9FC" stroke="#D8E3F1" stroke-width="2"/>
        <text x="${x + 30}" y="${y + 48}" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#1E64A0">${title}</text>
        <text x="${x + 30}" y="${y + 378}" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#0B315D">${line1}</text>
        <text x="${x + 30}" y="${y + 410}" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#55718C">${line2}</text>
      </svg>`),
      left: 0,
      top: 0,
    });
    bodyComps.push({ input: img, left: x + 92, top: y + 86 });
  }

  bodyComps.push({
    input: svg(`<svg width="1600" height="1200">
      <rect x="835" y="665" width="705" height="430" rx="24" fill="#F7F9FC" stroke="#D8E3F1" stroke-width="2"/>
      <text x="865" y="713" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#1E64A0">Landscape Infographic</text>
      <text x="900" y="820" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#0B315D">Robotic Pool Cleaner Competition</text>
      <circle cx="1000" cy="935" r="62" fill="#D9EEF8" stroke="#2C80B8" stroke-width="3"/>
      <circle cx="1182" cy="890" r="62" fill="#ECF6FA" stroke="#6FA8C9" stroke-width="3"/>
      <circle cx="1328" cy="980" r="62" fill="#ECF6FA" stroke="#6FA8C9" stroke-width="3"/>
      <circle cx="1140" cy="1035" r="62" fill="#ECF6FA" stroke="#6FA8C9" stroke-width="3"/>
      <text x="938" y="943" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#0B315D">Maytronics</text>
      <text x="1147" y="898" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#0B315D">Aiper</text>
      <text x="1283" y="988" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#0B315D">Beatbot</text>
      <text x="1100" y="1043" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#0B315D">WYBOT</text>
      <text x="865" y="1102" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#55718C">Self-made structure chart, real logos can be added in final version</text>
    </svg>`),
    left: 0,
    top: 0,
  });

  await sharp({ create: { width: 1600, height: 1200, channels: 3, background: "#FFFFFF" } })
    .composite(bodyComps)
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "maytronics-body-preview-v1.jpg"));

  console.log(path.join(outDir, "maytronics-cover-preview-v1.jpg"));
  console.log(path.join(outDir, "maytronics-cover-preview-v2.jpg"));
  console.log(path.join(outDir, "maytronics-cover-preview-v3.jpg"));
  console.log(path.join(outDir, "maytronics-cover-preview-v4.jpg"));
  console.log(path.join(outDir, "maytronics-cover-template-v1.jpg"));
  console.log(path.join(outDir, "maytronics-body-preview-v1.jpg"));
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
