const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "../../../..");
const outDir = __dirname;

function svg(input) {
  return Buffer.from(input);
}

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function money(value) {
  return `$${value.toFixed(1)}B`;
}

function usd(value) {
  return `USD ${value.toFixed(1)}B`;
}

async function build() {
  fs.mkdirSync(outDir, { recursive: true });

  const width = 1600;
  const height = 900;
  const data = {
    2022: { Shark: 2.0, Ninja: 1.7 },
    2024: { Shark: 2.6, Ninja: 2.9 },
  };
  const totals = {
    2022: data[2022].Shark + data[2022].Ninja,
    2024: data[2024].Shark + data[2024].Ninja,
  };
  const growth = totals[2024] - totals[2022];
  const growthPct = (growth / totals[2022]) * 100;
  const ninjaGrowth = data[2024].Ninja - data[2022].Ninja;
  const sharkGrowth = data[2024].Shark - data[2022].Shark;
  const ninjaContribution = (ninjaGrowth / growth) * 100;

  const maxTotal = 5.8;
  const barMax = 560;
  const barHeight = 80;
  const startX = 190;
  const chartY2022 = 425;
  const chartY2024 = 565;
  const sharkColor = "#1B6C8F";
  const ninjaColor = "#F0C84B";
  const navy = "#071F3A";
  const ink = "#0A2744";

  function segment(year, brand, x, y) {
    const w = (data[year][brand] / maxTotal) * barMax;
    const color = brand === "Shark" ? sharkColor : ninjaColor;
    const textColor = brand === "Shark" ? "#FFFFFF" : "#071F3A";
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${barHeight}" fill="${color}"/>
      <text x="${x + 22}" y="${y + 50}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="${textColor}">${esc(brand)} ${money(data[year][brand])}</text>
    `;
  }

  function row(year, y) {
    const sharkW = (data[year].Shark / maxTotal) * barMax;
    const totalW = (totals[year] / maxTotal) * barMax;
    return `
      <text x="92" y="${y + 52}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${ink}">${year}</text>
      <rect x="${startX}" y="${y}" width="${barMax}" height="${barHeight}" fill="#EAF2F7"/>
      ${segment(year, "Shark", startX, y)}
      ${segment(year, "Ninja", startX + sharkW, y)}
      <text x="${startX + totalW + 26}" y="${y + 51}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${ink}">${money(totals[year])}</text>
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
          <text x="1182" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#F0C84B" letter-spacing="2">DATA VISUAL</text>

          <rect x="92" y="184" width="178" height="36" fill="#F0C84B"/>
          <text x="112" y="209" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">GROWTH SPLIT</text>

          <text x="92" y="292" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="900" fill="${ink}">SharkNinja's Growth Engine</text>
          <text x="96" y="346" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#526A7E">2022 to 2024 sales split by brand</text>

          ${row(2022, chartY2022)}
          ${row(2024, chartY2024)}

          <line x1="190" y1="690" x2="750" y2="690" stroke="#C8D6E4" stroke-width="2"/>
          <text x="190" y="726" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#6A7C8A">0</text>
          <text x="438" y="726" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#6A7C8A">USD 2.5B</text>
          <text x="694" y="726" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#6A7C8A">USD 5.0B</text>

          <rect x="970" y="218" width="438" height="560" fill="#071F3A"/>
          <text x="1010" y="276" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#FFFFFF">SHARKNINJA</text>
          <rect x="1010" y="296" width="134" height="6" fill="#F0C84B"/>
          <text x="1010" y="344" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#9FD8F5" letter-spacing="2">KEY INSIGHT</text>
          <text x="1010" y="414" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="900" fill="#FFFFFF">Ninja contributed</text>
          <text x="1010" y="466" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="900" fill="#FFFFFF">${ninjaContribution.toFixed(0)}% of total</text>
          <text x="1010" y="518" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="900" fill="#FFFFFF">growth.</text>

          <rect x="1010" y="574" width="158" height="86" fill="#FFFFFF"/>
          <text x="1032" y="606" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#1B6C8F">TOTAL GROWTH</text>
          <text x="1032" y="644" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${ink}">${money(growth)}</text>

          <rect x="1190" y="574" width="178" height="86" fill="#F0C84B"/>
          <text x="1212" y="606" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${navy}">GROWTH RATE</text>
          <text x="1212" y="644" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${navy}">+${growthPct.toFixed(1)}%</text>

          <text x="1010" y="714" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#CFE3F2">Ninja added ${usd(ninjaGrowth)}, twice</text>
          <text x="1010" y="746" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#CFE3F2">Shark's ${usd(sharkGrowth)} increase.</text>

          <rect x="92" y="780" width="18" height="18" fill="${sharkColor}"/>
          <text x="120" y="796" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#415A72">Shark</text>
          <rect x="204" y="780" width="18" height="18" fill="${ninjaColor}"/>
          <text x="232" y="796" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#415A72">Ninja</text>
          <text x="92" y="824" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" fill="#6B7C88" letter-spacing="1.1">WCB DATA VISUAL / SHARKNINJA ROAD TO USD 10B / UNIT: USD BILLION</text>
        </svg>`),
        left: 0,
        top: 0,
      },
    ])
    .png()
    .toFile(path.join(outDir, "sharkninja-sales-split-v1.png"));

  await sharp(path.join(outDir, "sharkninja-sales-split-v1.png"))
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "sharkninja-sales-split-v1.jpg"));

  console.log(path.join(outDir, "sharkninja-sales-split-v1.png"));
  console.log(path.join(outDir, "sharkninja-sales-split-v1.jpg"));
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
