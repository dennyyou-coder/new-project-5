const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "../..");
const outDir = __dirname;

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
  const lineHeight = options.lineHeight || 1.1;
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

  return lines
    .map((line, index) => `<tspan x="${x}" dy="${index ? size * lineHeight : 0}">${esc(line)}</tspan>`)
    .join("");
}

async function buildSharkNinjaCover() {
  const sharkLogo = await sharp(path.join(root, "brands/sharkninja/logos/shark-official-logo.svg"))
    .resize({ width: 280 })
    .png()
    .toBuffer();
  const ninjaLogo = await sharp(path.join(root, "brands/sharkninja/logos/ninja-official-logo.svg"))
    .resize({ width: 250 })
    .png()
    .toBuffer();
  await sharp({ create: { width: 1600, height: 900, channels: 3, background: "#F6F8FA" } })
    .composite([
      {
        input: svg(`<svg width="1600" height="900">
          <rect width="1600" height="900" fill="#F6F8FA"/>
          <rect x="52" y="52" width="1496" height="796" fill="#FFFFFF"/>
          <rect x="52" y="52" width="1496" height="92" fill="#071F3A"/>
          <text x="84" y="111" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
          <text x="1168" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#F0C84B" letter-spacing="2">BRAND ANALYSIS</text>
          <rect x="828" y="168" width="620" height="540" fill="#F9FBFC" stroke="#D6E1EA"/>
          <text x="872" y="228" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#1B6C8F" letter-spacing="2">2022-2024 SALES SPLIT</text>
          <rect x="878" y="292" width="150" height="232" fill="#0A2744"/>
          <rect x="1058" y="251" width="150" height="273" fill="#F0C84B"/>
          <rect x="1238" y="197" width="150" height="327" fill="#1B6C8F"/>
          <text x="887" y="559" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#0A2744">2022</text>
          <text x="1067" y="559" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#0A2744">2023</text>
          <text x="1247" y="559" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#0A2744">2024</text>
          <text x="878" y="618" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="#0A2744">Ninja became the larger growth contributor.</text>
          <line x1="878" y1="648" x2="1388" y2="648" stroke="#C8D6E4" stroke-width="2"/>
          <text x="878" y="682" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88">Shark: USD 2.0B -> 2.6B / Ninja: USD 1.7B -> 2.9B</text>
          <rect x="92" y="188" width="184" height="36" fill="#F0C84B"/>
          <text x="112" y="213" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#071F3A" letter-spacing="2">GROWTH ENGINE</text>
          <text x="92" y="410" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="900" fill="#0A2744">${wrappedText("SharkNinja's Road to USD 10 Billion", 92, 410, { size: 58, width: 750 })}</text>
          <text x="96" y="574" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" fill="#29455F">${wrappedText("Ninja's category expansion became the main force behind the 2022-2024 growth curve.", 96, 574, { size: 30, weight: 800, width: 650, lineHeight: 1.16 })}</text>
          <rect x="96" y="646" width="166" height="84" fill="#F0C84B"/>
          <text x="118" y="678" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#071F3A">2024 SALES</text>
          <text x="118" y="714" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="900" fill="#071F3A">USD 5.5B</text>
          <rect x="286" y="646" width="174" height="84" fill="#EAF2F7" stroke="#C8D6E4"/>
          <text x="308" y="678" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#1B6C8F">NINJA GROWTH</text>
          <text x="308" y="714" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="900" fill="#0A2744">+USD 1.2B</text>
          <rect x="484" y="646" width="184" height="84" fill="#EAF2F7" stroke="#C8D6E4"/>
          <text x="506" y="678" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#1B6C8F">TARGET</text>
          <text x="506" y="714" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="900" fill="#0A2744">USD 10B</text>
          <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB-2026-007 / SMALL APPLIANCES / BRAND ANALYSIS</text>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: sharkLogo, left: 96, top: 242 },
      { input: ninjaLogo, left: 410, top: 247 },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "sharkninja-road-to-10-billion-dollars-cover.jpg"));
}

async function buildIRobotCover() {
  await sharp({ create: { width: 1600, height: 900, channels: 3, background: "#F6F8FA" } })
    .composite([
      {
        input: svg(`<svg width="1600" height="900">
          <rect width="1600" height="900" fill="#F6F8FA"/>
          <rect x="52" y="52" width="1496" height="796" fill="#FFFFFF"/>
          <rect x="52" y="52" width="1496" height="92" fill="#071F3A"/>
          <text x="84" y="111" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
          <text x="1170" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#F0C84B" letter-spacing="2">DATA VISUAL</text>
          <rect x="92" y="188" width="168" height="36" fill="#F0C84B"/>
          <text x="112" y="213" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#071F3A" letter-spacing="2">DEBT WATCH</text>
          <text x="92" y="346" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="900" fill="#0A2744">${wrappedText("iRobot's Financial Crisis", 92, 346, { size: 62, width: 720 })}</text>
          <text x="96" y="500" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" fill="#29455F">${wrappedText("A category pioneer is now defined by creditor deadlines, supplier exposure, and narrowing room to maneuver.", 96, 500, { size: 30, weight: 800, width: 650, lineHeight: 1.16 })}</text>
          <rect x="96" y="638" width="210" height="92" fill="#F0C84B"/>
          <text x="120" y="673" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#071F3A">TOTAL EXPOSURE</text>
          <text x="120" y="714" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="900" fill="#071F3A">USD 352.2M</text>
          <rect x="330" y="638" width="178" height="92" fill="#EAF2F7" stroke="#C8D6E4"/>
          <text x="354" y="673" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#1B6C8F">CASH</text>
          <text x="354" y="714" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="900" fill="#0A2744">USD 24.8M</text>
          <rect x="532" y="638" width="190" height="92" fill="#EAF2F7" stroke="#C8D6E4"/>
          <text x="556" y="673" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#1B6C8F">DEADLINE</text>
          <text x="556" y="714" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="900" fill="#0A2744">Jan 15</text>
          <rect x="856" y="188" width="536" height="512" fill="#F9FBFC" stroke="#D6E1EA"/>
          <rect x="944" y="272" width="360" height="54" fill="#0A2744"/>
          <text x="974" y="307" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="#FFFFFF">PI CEA / SANTRUM</text>
          <line x1="1124" y1="326" x2="1124" y2="412" stroke="#1B6C8F" stroke-width="5"/>
          <rect x="914" y="412" width="420" height="74" fill="#EAF2F7" stroke="#C8D6E4"/>
          <text x="944" y="459" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="900" fill="#0A2744">iRobot debt + invoices</text>
          <line x1="1124" y1="486" x2="1124" y2="566" stroke="#1B6C8F" stroke-width="5"/>
          <rect x="974" y="566" width="300" height="66" fill="#F0C84B"/>
          <text x="1006" y="608" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="900" fill="#071F3A">Bankruptcy risk</text>
          <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">WCB-2026-008 / ROBOT VACUUMS / FINANCIAL RISK</text>
        </svg>`),
        left: 0,
        top: 0,
      },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "irobot-financial-crisis-cover.jpg"));
}

async function copyDataVisuals() {
  const copies = [
    ["data-visuals/sharkninja-sales-split/sharkninja-sales-split-v1.jpg", "sharkninja-road-to-10-billion-dollars-image-02.jpg"],
    ["data-visuals/irobot-debt-risk/irobot-debt-risk-v1.jpg", "irobot-financial-crisis-image-002.jpg"],
    ["data-visuals/aiper-fluidra-alliance/aiper-fluidra-alliance-v1.jpg", "aiper-fluidra-pool-robotics-alliance-image-003.jpg"],
  ];

  for (const [source, target] of copies) {
    await sharp(path.join(root, source)).jpeg({ quality: 92 }).toFile(path.join(outDir, target));
  }
}

async function build() {
  fs.mkdirSync(outDir, { recursive: true });
  await buildSharkNinjaCover();
  await buildIRobotCover();
  await copyDataVisuals();
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
