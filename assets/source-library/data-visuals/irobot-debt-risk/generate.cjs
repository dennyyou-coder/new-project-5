const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const outDir = __dirname;

function svg(input) {
  return Buffer.from(input);
}

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function usdM(value) {
  return `$${value.toFixed(1)}M`;
}

async function build() {
  fs.mkdirSync(outDir, { recursive: true });

  const width = 1600;
  const height = 900;
  const navy = "#071F3A";
  const ink = "#0A2744";
  const blue = "#1B6C8F";
  const yellow = "#F0C84B";
  const red = "#C74735";
  const pale = "#EAF2F7";
  const muted = "#526A7E";

  const debt = 190.7;
  const payables = 161.5;
  const overdue = 90.9;
  const cash = 24.8;
  const restrictedCash = 40.0;
  const totalExposure = debt + payables;
  const exposureToCash = totalExposure / cash;
  const max = 380;
  const barMax = 560;

  function bar(label, value, y, color, sublabel) {
    const w = (value / max) * barMax;
    const valueInside = w > 120;
    const labelColor = color === yellow ? navy : "#FFFFFF";
    const valueX = valueInside ? 116 : 92 + w + 18;
    const valueFill = valueInside ? labelColor : ink;
    return `
      <text x="92" y="${y - 18}" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="900" fill="${ink}">${esc(label)}</text>
      <rect x="92" y="${y}" width="${barMax}" height="62" fill="${pale}"/>
      <rect x="92" y="${y}" width="${w}" height="62" fill="${color}"/>
      <text x="${valueX}" y="${y + 41}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="${valueFill}">${usdM(value)}</text>
      <text x="684" y="${y + 39}" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="800" fill="${muted}">${esc(sublabel)}</text>
    `;
  }

  await sharp({
    create: { width, height, channels: 3, background: "#F6F8FA" },
  })
    .composite([
      {
        input: svg(`<svg width="${width}" height="${height}">
          <rect width="${width}" height="${height}" fill="#F6F8FA"/>
          <rect x="52" y="52" width="1496" height="796" fill="#FFFFFF"/>
          <rect x="52" y="52" width="1496" height="92" fill="${navy}"/>
          <text x="84" y="111" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
          <text x="1182" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${yellow}" letter-spacing="2">DATA VISUAL</text>

          <rect x="92" y="184" width="148" height="36" fill="${yellow}"/>
          <text x="112" y="209" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">RISK STACK</text>

          <text x="92" y="292" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="900" fill="${ink}">iRobot's Creditor Trap</text>
          <text x="96" y="346" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="${muted}">Picea-related exposure vs remaining cash</text>

          ${bar("Santrum debt", debt, 430, blue, "Picea subsidiary")}
          ${bar("Picea payables", payables, 550, yellow, "supplier invoices")}
          ${bar("Cash and equivalents", cash, 670, red, "remaining liquidity")}

          <line x1="92" y1="764" x2="652" y2="764" stroke="#C8D6E4" stroke-width="2"/>
          <text x="92" y="800" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#6A7C8A">0</text>
          <text x="354" y="800" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#6A7C8A">USD 190M</text>
          <text x="564" y="800" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#6A7C8A">USD 380M</text>

          <rect x="970" y="218" width="438" height="560" fill="${navy}"/>
          <text x="1010" y="276" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#FFFFFF">iROBOT</text>
          <rect x="1010" y="296" width="134" height="6" fill="${yellow}"/>
          <text x="1010" y="344" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#9FD8F5" letter-spacing="2">KEY INSIGHT</text>
          <text x="1010" y="414" font-family="Arial, Helvetica, sans-serif" font-size="41" font-weight="900" fill="#FFFFFF">Picea exposure</text>
          <text x="1010" y="466" font-family="Arial, Helvetica, sans-serif" font-size="41" font-weight="900" fill="#FFFFFF">was ${exposureToCash.toFixed(1)}x the</text>
          <text x="1010" y="518" font-family="Arial, Helvetica, sans-serif" font-size="41" font-weight="900" fill="#FFFFFF">cash balance.</text>

          <rect x="1010" y="574" width="168" height="86" fill="#FFFFFF"/>
          <text x="1032" y="606" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${blue}">TOTAL EXPOSURE</text>
          <text x="1032" y="644" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${ink}">${usdM(totalExposure)}</text>

          <rect x="1200" y="574" width="168" height="86" fill="${yellow}"/>
          <text x="1222" y="606" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${navy}">OVERDUE</text>
          <text x="1222" y="644" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${navy}">${usdM(overdue)}</text>

          <text x="1010" y="706" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#CFE3F2">Critical relief deadline:</text>
          <text x="1010" y="740" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">January 15, 2026</text>

          <rect x="92" y="818" width="18" height="18" fill="${blue}"/>
          <text x="120" y="834" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#415A72">Santrum debt</text>
          <rect x="272" y="818" width="18" height="18" fill="${yellow}"/>
          <text x="300" y="834" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#415A72">Picea payables</text>
          <rect x="478" y="818" width="18" height="18" fill="${red}"/>
          <text x="506" y="834" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#415A72">Cash</text>
          <text x="92" y="858" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#6B7C88" letter-spacing="0.7">WCB DATA VISUAL / IROBOT FINANCIAL CRISIS / UNIT: USD MILLION / RESTRICTED CASH EXHAUSTED: ${usdM(restrictedCash)}</text>
        </svg>`),
        left: 0,
        top: 0,
      },
    ])
    .png()
    .toFile(path.join(outDir, "irobot-debt-risk-v1.png"));

  await sharp(path.join(outDir, "irobot-debt-risk-v1.png"))
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "irobot-debt-risk-v1.jpg"));

  console.log(path.join(outDir, "irobot-debt-risk-v1.png"));
  console.log(path.join(outDir, "irobot-debt-risk-v1.jpg"));
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
