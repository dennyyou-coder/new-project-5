const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "../..");
const outDir = __dirname;

const logoPath = path.join(root, "brands/maytronics/logos/maytronics-official-logo.svg");
const productPath = path.join(root, "brands/maytronics/products/dolphin-liberty-600-official.png");
const timelinePath = path.join(root, "brands/maytronics/evidence/maytronics-1983-dolphin-timeline.png");
const dataVisualPath = path.join(root, "data-visuals/maytronics-revenue-reset/maytronics-revenue-reset-v1.png");

function svg(input) {
  return Buffer.from(input);
}

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrappedText(text, x, y, options = {}) {
  const size = options.size || 48;
  const weight = options.weight || 900;
  const color = options.color || "#0A2744";
  const width = options.width || 640;
  const lineHeight = options.lineHeight || 1.08;
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

  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${tspans}</text>`;
}

async function copyDataVisual() {
  await sharp(dataVisualPath)
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "maytronics-robotic-pool-cleaner-reinvention-body-003-data-visual.jpg"));
}

async function build() {
  fs.mkdirSync(outDir, { recursive: true });

  const navy = "#071F3A";
  const ink = "#0A2744";
  const blue = "#1B6C8F";
  const yellow = "#F0C84B";
  const pale = "#EAF2F7";
  const muted = "#526A7E";

  const logo = await sharp(logoPath).resize({ width: 390 }).png().toBuffer();
  const productHero = await sharp(productPath)
    .resize({ width: 820, height: 560, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
  const productCard = await sharp(productPath)
    .resize({ width: 680, height: 470, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
  const timelineCard = await sharp(timelinePath)
    .resize({ width: 720, height: 460, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  await sharp({ create: { width: 1600, height: 900, channels: 3, background: "#F6F8FA" } })
    .composite([
      {
        input: svg(`<svg width="1600" height="900">
          <rect width="1600" height="900" fill="#F6F8FA"/>
          <rect x="52" y="52" width="1496" height="796" fill="#FFFFFF"/>
          <rect x="52" y="52" width="1496" height="92" fill="${navy}"/>
          <text x="84" y="111" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
          <text x="1138" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${yellow}" letter-spacing="2">BRAND ANALYSIS</text>
          <rect x="970" y="144" width="578" height="704" fill="#E8F1F7"/>
          <ellipse cx="1214" cy="788" rx="330" ry="42" fill="#0A2744" opacity="0.16"/>
          <rect x="92" y="184" width="160" height="36" fill="${yellow}"/>
          <text x="112" y="209" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">POOL ROBOTICS</text>
          ${wrappedText("Maytronics: 40 Years of One Pool Robot", 92, 356, { size: 58, width: 760, color: ink })}
          ${wrappedText("From the first Dolphin to cordless challengers, online competition, and a lower-margin reset.", 96, 520, {
            size: 30,
            weight: 800,
            width: 650,
            color: "#29455F",
            lineHeight: 1.16,
          })}
          <rect x="96" y="646" width="166" height="84" fill="${yellow}"/>
          <text x="118" y="678" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${navy}">TARGET GAP</text>
          <text x="118" y="714" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="900" fill="${navy}">RMB 3.12B</text>
          <rect x="286" y="646" width="184" height="84" fill="${pale}" stroke="#C8D6E4"/>
          <text x="308" y="678" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${blue}">PRIVATE ROBOT</text>
          <text x="308" y="714" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="900" fill="${ink}">-18.2%</text>
          <rect x="494" y="646" width="190" height="84" fill="${pale}" stroke="#C8D6E4"/>
          <text x="516" y="678" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${blue}">MARGIN DROP</text>
          <text x="516" y="714" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="900" fill="${ink}">12.6 pts</text>
          <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB-2026-006 / POOL ROBOTICS / BRAND ANALYSIS</text>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: logo, left: 92, top: 236 },
      { input: productHero, left: 774, top: 282 },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "maytronics-robotic-pool-cleaner-reinvention-cover.jpg"));

  await sharp({ create: { width: 1600, height: 900, channels: 3, background: "#F6F8FA" } })
    .composite([
      {
        input: svg(`<svg width="1600" height="900">
          <rect width="1600" height="900" fill="#F6F8FA"/>
          <rect x="52" y="52" width="1496" height="796" fill="#FFFFFF"/>
          <rect x="52" y="52" width="1496" height="92" fill="${navy}"/>
          <text x="84" y="111" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
          <text x="1182" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${yellow}" letter-spacing="2">EVIDENCE IMAGE</text>
          <rect x="92" y="188" width="154" height="36" fill="${yellow}"/>
          <text x="112" y="213" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">PRODUCT SIGNAL</text>
          ${wrappedText("Dolphin LIBERTY 600", 92, 306, { size: 58, width: 650, color: ink })}
          ${wrappedText("Maytronics' cordless move shows how the category is shifting from professional pool equipment toward consumer-style robots.", 96, 410, {
            size: 28,
            weight: 800,
            width: 620,
            color: muted,
            lineHeight: 1.18,
          })}
          <rect x="96" y="604" width="190" height="84" fill="${pale}" stroke="#C8D6E4"/>
          <text x="118" y="636" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${blue}">CATEGORY</text>
          <text x="118" y="672" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="900" fill="${ink}">Cordless</text>
          <rect x="310" y="604" width="198" height="84" fill="${yellow}"/>
          <text x="332" y="636" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${navy}">STRATEGIC USE</text>
          <text x="332" y="672" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="900" fill="${navy}">Reset Signal</text>
          <rect x="865" y="186" width="520" height="520" fill="#F9FBFC" stroke="#D6E1EA"/>
          <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">OFFICIAL PRODUCT ASSET / MAYTRONICS / DOLPHIN LIBERTY 600</text>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: productCard, left: 785, top: 216 },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "maytronics-robotic-pool-cleaner-reinvention-body-001-product.jpg"));

  await sharp(path.join(outDir, "maytronics-robotic-pool-cleaner-reinvention-body-001-product.jpg"))
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "maytronics-robotic-pool-cleaner-reinvention-body-001-product-v2.jpg"));

  await sharp({ create: { width: 1600, height: 900, channels: 3, background: "#F6F8FA" } })
    .composite([
      {
        input: svg(`<svg width="1600" height="900">
          <rect width="1600" height="900" fill="#F6F8FA"/>
          <rect x="52" y="52" width="1496" height="796" fill="#FFFFFF"/>
          <rect x="52" y="52" width="1496" height="92" fill="${navy}"/>
          <text x="84" y="111" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
          <text x="1182" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${yellow}" letter-spacing="2">EVIDENCE IMAGE</text>
          <rect x="92" y="188" width="170" height="36" fill="${yellow}"/>
          <text x="112" y="213" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">CATEGORY ORIGIN</text>
          ${wrappedText("From 1983 Dolphin to the Cordless Era", 92, 306, { size: 58, width: 690, color: ink })}
          ${wrappedText("The story should keep real historical evidence: the old Dolphin image explains why Maytronics is not just another pool robot brand.", 96, 440, {
            size: 28,
            weight: 800,
            width: 610,
            color: muted,
            lineHeight: 1.18,
          })}
          <rect x="96" y="624" width="172" height="84" fill="${yellow}"/>
          <text x="118" y="656" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${navy}">FOUNDED</text>
          <text x="118" y="692" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="900" fill="${navy}">1983</text>
          <rect x="292" y="624" width="208" height="84" fill="${pale}" stroke="#C8D6E4"/>
          <text x="314" y="656" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${blue}">BRAND ASSET</text>
          <text x="314" y="692" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="900" fill="${ink}">Dolphin</text>
          <rect x="812" y="190" width="616" height="476" fill="#F9FBFC" stroke="#D6E1EA"/>
          <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">OFFICIAL TIMELINE EVIDENCE / MAYTRONICS / 1983 DOLPHIN</text>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: timelineCard, left: 760, top: 198 },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "maytronics-robotic-pool-cleaner-reinvention-body-002-history.jpg"));

  await copyDataVisual();
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
