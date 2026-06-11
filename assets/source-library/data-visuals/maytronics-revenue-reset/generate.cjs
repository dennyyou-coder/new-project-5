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

function rmbB(value) {
  return `RMB ${value.toFixed(2)}B`;
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

  const points = [
    { year: 2019, value: 2.05 },
    { year: 2021, value: 3.38 },
    { year: 2022, value: 4.32 },
    { year: 2025, value: 3.4 },
  ];
  const target2025 = 6.52;
  const actual2025 = 3.4;
  const gap = target2025 - actual2025;
  const privateRevenueChange = ((2.33 - 2.85) / 2.85) * 100;
  const marginDrop = 36.5 - 23.9;

  const chart = {
    x: 104,
    y: 420,
    w: 650,
    h: 270,
    max: 7,
    minYear: 2019,
    maxYear: 2025,
  };

  function sx(year) {
    return chart.x + ((year - chart.minYear) / (chart.maxYear - chart.minYear)) * chart.w;
  }

  function sy(value) {
    return chart.y + chart.h - (value / chart.max) * chart.h;
  }

  const linePoints = points.map((p) => `${sx(p.year)},${sy(p.value)}`).join(" ");
  const actualPoint = points[points.length - 1];

  function pointLabel(p, dx, dy, align = "middle") {
    return `
      <circle cx="${sx(p.year)}" cy="${sy(p.value)}" r="8" fill="${blue}" stroke="#FFFFFF" stroke-width="4"/>
      <text x="${sx(p.year) + dx}" y="${sy(p.value) + dy}" text-anchor="${align}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="${ink}">${p.year}</text>
      <text x="${sx(p.year) + dx}" y="${sy(p.value) + dy + 28}" text-anchor="${align}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800" fill="${muted}">${rmbB(p.value)}</text>
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

          <rect x="92" y="184" width="178" height="36" fill="${yellow}"/>
          <text x="112" y="209" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">REVENUE RESET</text>

          <text x="92" y="292" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="900" fill="${ink}">Maytronics' Revenue Reset</text>
          <text x="96" y="346" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="${muted}">Actual revenue fell far short of the 2025 target</text>

          <line x1="${chart.x}" y1="${chart.y}" x2="${chart.x}" y2="${chart.y + chart.h}" stroke="#C8D6E4" stroke-width="2"/>
          <line x1="${chart.x}" y1="${chart.y + chart.h}" x2="${chart.x + chart.w}" y2="${chart.y + chart.h}" stroke="#C8D6E4" stroke-width="2"/>
          <line x1="${chart.x}" y1="${sy(3.5)}" x2="${chart.x + chart.w}" y2="${sy(3.5)}" stroke="#DDE8F1" stroke-width="2"/>
          <line x1="${chart.x}" y1="${sy(7)}" x2="${chart.x + chart.w}" y2="${sy(7)}" stroke="#DDE8F1" stroke-width="2"/>
          <text x="${chart.x - 12}" y="${sy(7) + 7}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#6A7C8A">7.0</text>
          <text x="${chart.x - 12}" y="${sy(3.5) + 7}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#6A7C8A">3.5</text>
          <text x="${chart.x - 12}" y="${chart.y + chart.h + 7}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#6A7C8A">0</text>

          <polyline points="${linePoints}" fill="none" stroke="${blue}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
          ${pointLabel(points[0], 58, 56, "middle")}
          ${pointLabel(points[1], 0, -52)}
          ${pointLabel(points[2], 0, -56)}
          ${pointLabel(points[3], -10, 58, "end")}

          <line x1="${sx(2025)}" y1="${sy(target2025)}" x2="${sx(2025)}" y2="${sy(actual2025)}" stroke="${red}" stroke-width="6" stroke-dasharray="12 10"/>
          <circle cx="${sx(2025)}" cy="${sy(target2025)}" r="10" fill="${red}" stroke="#FFFFFF" stroke-width="4"/>
          <text x="${sx(2025) - 18}" y="${sy(target2025) - 16}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="${red}">2025 target</text>
          <text x="${sx(2025) - 18}" y="${sy(target2025) + 12}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800" fill="${muted}">${rmbB(target2025)}</text>
          <rect x="${sx(2025) + 20}" y="${sy(target2025) + 32}" width="112" height="32" fill="${red}"/>
          <text x="${sx(2025) + 36}" y="${sy(target2025) + 55}" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" fill="#FFFFFF">target gap</text>

          <rect x="970" y="218" width="438" height="560" fill="${navy}"/>
          <text x="1010" y="276" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#FFFFFF">MAYTRONICS</text>
          <rect x="1010" y="296" width="134" height="6" fill="${yellow}"/>
          <text x="1010" y="344" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#9FD8F5" letter-spacing="2">KEY INSIGHT</text>
          <text x="1010" y="414" font-family="Arial, Helvetica, sans-serif" font-size="41" font-weight="900" fill="#FFFFFF">2025 revenue</text>
          <text x="1010" y="466" font-family="Arial, Helvetica, sans-serif" font-size="41" font-weight="900" fill="#FFFFFF">missed target by</text>
          <text x="1010" y="518" font-family="Arial, Helvetica, sans-serif" font-size="41" font-weight="900" fill="#FFFFFF">${rmbB(gap)}.</text>

          <rect x="1010" y="574" width="168" height="86" fill="#FFFFFF"/>
          <text x="1032" y="606" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${blue}">ACTUAL 2025</text>
          <text x="1032" y="644" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="900" fill="${ink}">${rmbB(actual2025).replace("RMB ", "")}</text>

          <rect x="1200" y="574" width="168" height="86" fill="${yellow}"/>
          <text x="1222" y="606" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${navy}">TARGET 2025</text>
          <text x="1222" y="644" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="900" fill="${navy}">${rmbB(target2025).replace("RMB ", "")}</text>

          <text x="1010" y="706" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#CFE3F2">Private robot revenue fell ${privateRevenueChange.toFixed(1)}%.</text>
          <text x="1010" y="740" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#CFE3F2">Gross margin dropped ${marginDrop.toFixed(1)} pts.</text>

          <rect x="92" y="816" width="18" height="18" fill="${blue}"/>
          <text x="120" y="832" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#415A72">Actual revenue</text>
          <rect x="284" y="816" width="18" height="18" fill="${red}"/>
          <text x="312" y="832" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#415A72">2025 target gap</text>
          <text x="92" y="858" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#6B7C88" letter-spacing="0.7">WCB DATA VISUAL / MAYTRONICS REINVENTION / UNIT: RMB BILLION / ARTICLE DATA</text>
        </svg>`),
        left: 0,
        top: 0,
      },
    ])
    .png()
    .toFile(path.join(outDir, "maytronics-revenue-reset-v1.png"));

  await sharp(path.join(outDir, "maytronics-revenue-reset-v1.png"))
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "maytronics-revenue-reset-v1.jpg"));

  console.log(path.join(outDir, "maytronics-revenue-reset-v1.png"));
  console.log(path.join(outDir, "maytronics-revenue-reset-v1.jpg"));
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
