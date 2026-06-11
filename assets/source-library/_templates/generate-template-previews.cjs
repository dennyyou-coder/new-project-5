const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..", "..", "..");
const outDir = path.join(__dirname, "previews");
fs.mkdirSync(outDir, { recursive: true });

const maytronicsLogoPath = path.join(root, "assets/source-library/brands/maytronics/logos/maytronics-official-logo.svg");
const maytronicsProductPath = path.join(root, "assets/source-library/brands/maytronics/products/dolphin-liberty-600-official.png");
const maytronicsPersonPath = path.join(root, "assets/source-library/brands/maytronics/people/rafi-benami-official-maytronics.jpg");
const eventPhotoPath = path.join(root, "public/images/industry/about-forum-stage-2025.jpg");

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function svg(input) {
  return Buffer.from(input);
}

function wrappedTextSvg(text, x, y, options = {}) {
  const size = options.size || 54;
  const weight = options.weight || 700;
  const color = options.color || "#123B68";
  const width = options.width || 700;
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

  const tspans = lines
    .map((line, index) => `<tspan x="${x}" dy="${index ? size * lineHeight : 0}">${esc(line)}</tspan>`)
    .join("");

  return svg(`<svg width="1600" height="900"><text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${tspans}</text></svg>`);
}

async function buildMarketAnalysis() {
  const logo = await sharp(maytronicsLogoPath).resize({ width: 205 }).png().toBuffer();

  const brandChips = ["Maytronics", "Aiper", "Beatbot", "WYBOT", "Zodiac", "BWT", "Dolphin", "Intex", "Fairland", "Aqua"];
  const chipSvg = brandChips
    .map((brand, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const x = 92 + col * 174;
      const y = 610 + row * 66;
      return `<rect x="${x}" y="${y}" width="142" height="42" fill="#FFFFFF" stroke="#C8D6E4"/>
        <text x="${x + 16}" y="${y + 28}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#0A2744">${esc(brand)}</text>`;
    })
    .join("");

  await sharp({ create: { width: 1600, height: 900, channels: 3, background: "#071F3A" } })
    .composite([
      {
        input: svg(`<svg width="1600" height="900">
          <rect width="1600" height="900" fill="#071F3A"/>
          <rect x="52" y="52" width="1496" height="796" fill="#FFFFFF"/>
          <rect x="52" y="52" width="1496" height="96" fill="#071F3A"/>
          <text x="84" y="113" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
          <text x="1200" y="113" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#9FD8F5" letter-spacing="2">MARKET REPORT</text>
          <rect x="92" y="184" width="232" height="36" fill="#1C74B7"/>
          <text x="111" y="209" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" letter-spacing="2">CATEGORY REVIEW</text>
          <text x="92" y="294" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="900" fill="#071F3A">Top Pool Cleaner Brands</text>
          <text x="96" y="348" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="700" fill="#415A72">2026 Global Market Landscape</text>
          <rect x="92" y="410" width="216" height="112" fill="#E9F3F8"/>
          <text x="116" y="448" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="900" fill="#1C74B7">MARKET SIZE</text>
          <text x="116" y="498" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="900" fill="#071F3A">$2.1B</text>
          <rect x="332" y="410" width="216" height="112" fill="#F0C84B"/>
          <text x="356" y="448" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="900" fill="#071F3A">CAGR</text>
          <text x="356" y="498" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="900" fill="#071F3A">18.7%</text>
          <rect x="572" y="410" width="216" height="112" fill="#F7FAFC" stroke="#C8D6E4"/>
          <text x="596" y="448" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="900" fill="#1C74B7">TOP BRANDS</text>
          <text x="596" y="498" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="900" fill="#071F3A">20</text>
          <rect x="92" y="540" width="216" height="54" fill="#071F3A"/>
          <text x="114" y="562" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="900" fill="#9FD8F5">TOP 5 SHARE</text>
          <text x="224" y="578" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">32%</text>
          <rect x="332" y="540" width="216" height="54" fill="#EAF2F7" stroke="#C8D6E4"/>
          <text x="354" y="562" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="900" fill="#1C74B7">CONCENTRATION</text>
          <text x="486" y="578" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="900" fill="#071F3A">Medium</text>
          <rect x="900" y="220" width="540" height="520" fill="#F7FAFC" stroke="#C8D6E4"/>
          <text x="930" y="260" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="#071F3A">Competitive Positioning</text>
          <line x1="968" y1="664" x2="1366" y2="664" stroke="#9EB4C6" stroke-width="2"/>
          <line x1="968" y1="664" x2="968" y2="320" stroke="#9EB4C6" stroke-width="2"/>
          <text x="946" y="302" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" fill="#5D7183">Premium</text>
          <text x="1328" y="704" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" fill="#5D7183">Online</text>
          <text x="910" y="704" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" fill="#5D7183">Offline</text>
          <text x="946" y="638" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" fill="#5D7183">Mass</text>
          <circle cx="1078" cy="390" r="62" fill="#EAF2F7" stroke="#1C74B7" stroke-width="4"/>
          <text x="1018" y="398" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#071F3A">Maytronics</text>
          <circle cx="1230" cy="420" r="54" fill="#EAF2F7" stroke="#69A6C9" stroke-width="3"/>
          <text x="1198" y="428" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#071F3A">Aiper</text>
          <circle cx="1308" cy="510" r="48" fill="#FFFFFF" stroke="#69A6C9" stroke-width="3"/>
          <text x="1268" y="518" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#071F3A">Beatbot</text>
          <circle cx="1200" cy="584" r="45" fill="#FFFFFF" stroke="#9EB4C6" stroke-width="3"/>
          <text x="1164" y="592" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#071F3A">WYBOT</text>
          <circle cx="1066" cy="562" r="40" fill="#FFFFFF" stroke="#9EB4C6" stroke-width="3"/>
          <text x="1030" y="570" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#071F3A">Zodiac</text>
          ${chipSvg}
          <text x="92" y="806" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" fill="#6B7C88" letter-spacing="1.1">WCB-2026-007 / MARKET REPORT / CATEGORY REVIEW</text>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: logo, left: 92, top: 548 },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "template-b-market-analysis-preview.jpg"));
}

async function buildFounderProfile() {
  const logo = await sharp(maytronicsLogoPath).resize({ width: 300 }).png().toBuffer();
  const person = await sharp(maytronicsPersonPath)
    .resize({ width: 610, height: 720, fit: "cover", position: "north" })
    .modulate({ saturation: 0.82, brightness: 0.93 })
    .png()
    .toBuffer();

  await sharp({ create: { width: 1600, height: 900, channels: 3, background: "#071F3A" } })
    .composite([
      {
        input: svg(`<svg width="1600" height="900">
          <rect width="1600" height="900" fill="#071F3A"/>
          <rect x="52" y="52" width="1496" height="796" fill="#0B2B4B"/>
          <rect x="52" y="52" width="1496" height="88" fill="#04172B"/>
          <text x="84" y="108" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
          <text x="1234" y="108" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#F0C84B" letter-spacing="2">FOUNDER PROFILE</text>
          <rect x="104" y="184" width="190" height="36" fill="#F0C84B"/>
          <text x="123" y="209" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#071F3A" letter-spacing="2">LEADERSHIP</text>
          <rect x="104" y="246" width="356" height="58" fill="#FFFFFF" opacity="0.95"/>
          <text x="104" y="362" font-family="Arial, Helvetica, sans-serif" font-size="78" font-weight="900" fill="#FFFFFF">Rafi Benami</text>
          <text x="108" y="420" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#B9D5EA">The Operator Behind Dolphin</text>
          <rect x="106" y="486" width="610" height="2" fill="#F0C84B"/>
          <text x="108" y="542" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="750" fill="#FFFFFF">“Category leadership</text>
          <text x="108" y="584" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="750" fill="#FFFFFF">comes from product platforms.”</text>
          <rect x="108" y="638" width="150" height="72" fill="#F0C84B"/>
          <text x="130" y="677" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#071F3A">SIGNAL</text>
          <text x="130" y="705" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="#071F3A">CEO</text>
          <rect x="276" y="638" width="202" height="72" fill="#123D67"/>
          <text x="298" y="667" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#9FD8F5">COMPANY</text>
          <text x="298" y="695" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="#FFFFFF">Maytronics</text>
          <rect x="496" y="638" width="186" height="72" fill="#FFFFFF" opacity="0.94"/>
          <text x="518" y="667" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#1C74B7">ANCHOR</text>
          <text x="518" y="695" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="#071F3A">40+ Years</text>
          <text x="108" y="802" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" fill="#9EB3C7" letter-spacing="1.1">WCB-2026-008 / FOUNDER PROFILE / LEADERSHIP</text>
          <rect x="915" y="164" width="520" height="646" fill="#49BFD1"/>
        </svg>`),
        left: 0,
        top: 0,
      },
      { input: logo, left: 124, top: 258 },
      { input: person, left: 876, top: 138 },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "template-c-founder-profile-preview.jpg"));
}

async function buildIndustryViewpoint() {
  const event = await sharp(eventPhotoPath)
    .resize({ width: 1600, height: 900, fit: "cover" })
    .modulate({ saturation: 0.8, brightness: 0.82 })
    .png()
    .toBuffer();

  await sharp({ create: { width: 1600, height: 900, channels: 3, background: "#071F3A" } })
    .composite([
      { input: event, left: 0, top: 0 },
      {
        input: svg(`<svg width="1600" height="900">
          <rect width="1600" height="900" fill="#06182C" opacity="0.44"/>
          <rect x="0" y="0" width="1600" height="88" fill="#071F3A" opacity="0.95"/>
          <text x="54" y="56" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
          <text x="1225" y="56" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#F0C84B" letter-spacing="2">INDUSTRY OPINION</text>
          <rect x="72" y="150" width="650" height="650" fill="#071F3A" opacity="0.9"/>
          <rect x="112" y="194" width="178" height="36" fill="#F0C84B"/>
          <text x="132" y="219" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#071F3A" letter-spacing="2">VIEWPOINT</text>
          <text x="112" y="305" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="900" fill="#FFFFFF">Why The Cleaning</text>
          <text x="112" y="370" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="900" fill="#FFFFFF">Industry Already</text>
          <text x="112" y="435" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="900" fill="#FFFFFF">Changed</text>
          <text x="116" y="528" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="700" fill="#CFE3F2">From product competition to platform</text>
          <text x="116" y="566" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="700" fill="#CFE3F2">competition, trade shows now reveal</text>
          <text x="116" y="604" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="700" fill="#CFE3F2">the next category map.</text>
          <rect x="116" y="650" width="210" height="72" fill="#FFFFFF" opacity="0.94"/>
          <text x="138" y="679" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#1C74B7">FIELD SIGNAL</text>
          <text x="138" y="708" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="#071F3A">Trade Shows</text>
          <rect x="344" y="650" width="210" height="72" fill="#F0C84B"/>
          <text x="366" y="679" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="#071F3A">LENS</text>
          <text x="366" y="708" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="#071F3A">Category Shift</text>
          <text x="116" y="774" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" fill="#A9BBD0" letter-spacing="1.1">WCB-2026-009 / INDUSTRY OPINION / FIELD NOTES</text>
        </svg>`),
        left: 0,
        top: 0,
      },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "template-d-industry-viewpoint-preview.jpg"));
}

async function build() {
  await buildMarketAnalysis();
  await buildFounderProfile();
  await buildIndustryViewpoint();
  console.log(path.join(outDir, "template-b-market-analysis-preview.jpg"));
  console.log(path.join(outDir, "template-c-founder-profile-preview.jpg"));
  console.log(path.join(outDir, "template-d-industry-viewpoint-preview.jpg"));
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
