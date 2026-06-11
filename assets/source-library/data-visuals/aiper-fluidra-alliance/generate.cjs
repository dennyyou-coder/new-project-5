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
  return `$${value.toFixed(0)}M`;
}

async function build() {
  fs.mkdirSync(outDir, { recursive: true });

  const width = 1600;
  const height = 900;
  const navy = "#071F3A";
  const ink = "#0A2744";
  const blue = "#1B6C8F";
  const teal = "#0F8A7A";
  const yellow = "#F0C84B";
  const red = "#C74735";
  const pale = "#EAF2F7";
  const muted = "#526A7E";

  const sales = [
    { year: 2023, value: 111 },
    { year: 2024, value: 195 },
    { year: 2027, value: 400 },
  ];
  const investment = 100;
  const stake = 27;
  const fluidraRevenue = 2.184;
  const poolWellnessShare = 98;
  const growth2024 = 75;
  const cagr = 40;
  const multiple = sales[2].value / sales[1].value;

  const chart = {
    x: 104,
    y: 500,
    w: 640,
    h: 180,
    max: 450,
    minYear: 2023,
    maxYear: 2027,
  };

  function sx(year) {
    return chart.x + ((year - chart.minYear) / (chart.maxYear - chart.minYear)) * chart.w;
  }

  function sy(value) {
    return chart.y + chart.h - (value / chart.max) * chart.h;
  }

  const linePoints = sales.map((p) => `${sx(p.year)},${sy(p.value)}`).join(" ");

  function pointLabel(p, dx, dy, align = "middle", color = ink) {
    return `
      <circle cx="${sx(p.year)}" cy="${sy(p.value)}" r="8" fill="${color}" stroke="#FFFFFF" stroke-width="4"/>
      <text x="${sx(p.year) + dx}" y="${sy(p.value) + dy}" text-anchor="${align}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="${ink}">${p.year}</text>
      <text x="${sx(p.year) + dx}" y="${sy(p.value) + dy + 28}" text-anchor="${align}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800" fill="${muted}">${usdM(p.value)}</text>
    `;
  }

  function metricCard(x, y, w, h, label, value, fill, valueColor = ink) {
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>
      <text x="${x + 22}" y="${y + 32}" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${fill === navy ? "#9FD8F5" : blue}">${esc(label)}</text>
      <text x="${x + 22}" y="${y + 72}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${valueColor}">${esc(value)}</text>
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

          <rect x="92" y="184" width="202" height="36" fill="${yellow}"/>
          <text x="112" y="209" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">ALLIANCE ECONOMICS</text>

          <text x="92" y="292" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="900" fill="${ink}">Aiper / Fluidra Deal Logic</text>
          <text x="96" y="346" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="${muted}">A growth brand meets a global pool channel system</text>

          ${metricCard(92, 382, 174, 86, "INVESTMENT", `~${usdM(investment)}`, pale)}
          ${metricCard(286, 382, 150, 86, "STAKE", `${stake}%`, yellow)}
          ${metricCard(456, 382, 184, 86, "FLUIDRA 2025", `EUR ${fluidraRevenue.toFixed(2)}B`, pale)}
          ${metricCard(660, 382, 150, 86, "POOL SHARE", `${poolWellnessShare}%`, pale)}

          <line x1="${chart.x}" y1="${chart.y}" x2="${chart.x}" y2="${chart.y + chart.h}" stroke="#C8D6E4" stroke-width="2"/>
          <line x1="${chart.x}" y1="${chart.y + chart.h}" x2="${chart.x + chart.w}" y2="${chart.y + chart.h}" stroke="#C8D6E4" stroke-width="2"/>
          <line x1="${chart.x}" y1="${sy(200)}" x2="${chart.x + chart.w}" y2="${sy(200)}" stroke="#DDE8F1" stroke-width="2"/>
          <line x1="${chart.x}" y1="${sy(400)}" x2="${chart.x + chart.w}" y2="${sy(400)}" stroke="#DDE8F1" stroke-width="2"/>
          <text x="${chart.x - 12}" y="${sy(400) + 7}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#6A7C8A">400</text>
          <text x="${chart.x - 12}" y="${sy(200) + 7}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#6A7C8A">200</text>
          <text x="${chart.x - 12}" y="${chart.y + chart.h + 7}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#6A7C8A">0</text>

          <polyline points="${linePoints}" fill="none" stroke="${teal}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
          ${pointLabel(sales[0], 40, 58, "middle", teal)}
          ${pointLabel(sales[1], 0, -56, "middle", teal)}
          <circle cx="${sx(2027)}" cy="${sy(400)}" r="10" fill="${red}" stroke="#FFFFFF" stroke-width="4"/>
          <text x="${sx(2027) - 24}" y="${sy(400) - 28}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="${red}">2027 target</text>
          <text x="${sx(2027) - 24}" y="${sy(400)}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800" fill="${muted}">&gt;${usdM(400)}</text>
          <rect x="${sx(2027) - 116}" y="${sy(400) + 40}" width="112" height="32" fill="${red}"/>
          <text x="${sx(2027) - 100}" y="${sy(400) + 63}" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" fill="#FFFFFF">near 40%</text>

          <rect x="970" y="218" width="438" height="560" fill="${navy}"/>
          <text x="1010" y="276" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#FFFFFF">AIPER / FLUIDRA</text>
          <rect x="1010" y="296" width="134" height="6" fill="${yellow}"/>
          <text x="1010" y="344" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#9FD8F5" letter-spacing="2">KEY INSIGHT</text>
          <text x="1010" y="414" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="900" fill="#FFFFFF">Fluidra bought</text>
          <text x="1010" y="466" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="900" fill="#FFFFFF">27% access to a</text>
          <text x="1010" y="518" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="900" fill="#FFFFFF">2x growth path.</text>

          <rect x="1010" y="574" width="168" height="86" fill="#FFFFFF"/>
          <text x="1032" y="606" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${blue}">2024 SALES</text>
          <text x="1032" y="644" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${ink}">${usdM(195)}</text>

          <rect x="1200" y="574" width="168" height="86" fill="${yellow}"/>
          <text x="1222" y="606" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${navy}">2027 TARGET</text>
          <text x="1222" y="644" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${navy}">&gt;${usdM(400)}</text>

          <text x="1010" y="706" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#CFE3F2">2024 growth: +${growth2024}%.</text>
          <text x="1010" y="740" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#CFE3F2">2027 target is ${multiple.toFixed(1)}x 2024 sales.</text>

          <rect x="92" y="816" width="18" height="18" fill="${teal}"/>
          <text x="120" y="832" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#415A72">Aiper sales path</text>
          <rect x="292" y="816" width="18" height="18" fill="${yellow}"/>
          <text x="320" y="832" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#415A72">Fluidra stake</text>
          <rect x="468" y="816" width="18" height="18" fill="${red}"/>
          <text x="496" y="832" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#415A72">2027 target</text>
          <text x="92" y="858" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#6B7C88" letter-spacing="0.7">WCB DATA VISUAL / AIPER-FLUIDRA ALLIANCE / UNIT: USD MILLION UNLESS NOTED / ARTICLE DATA</text>
        </svg>`),
        left: 0,
        top: 0,
      },
    ])
    .png()
    .toFile(path.join(outDir, "aiper-fluidra-alliance-v1.png"));

  await sharp(path.join(outDir, "aiper-fluidra-alliance-v1.png"))
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "aiper-fluidra-alliance-v1.jpg"));

  console.log(path.join(outDir, "aiper-fluidra-alliance-v1.png"));
  console.log(path.join(outDir, "aiper-fluidra-alliance-v1.jpg"));
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
