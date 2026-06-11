const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const outDir = __dirname;
const reviewDir = path.resolve(__dirname, "../../_review");
const W = 1600;
const H = 900;
const navy = "#071F3A";
const ink = "#0A2744";
const blue = "#1B6C8F";
const gold = "#F0C84B";
const pale = "#EAF2F7";
const line = "#C8D6E4";
const bg = "#F6F8FA";

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function svg(input) {
  return Buffer.from(input);
}

function wrap(text, size, width) {
  const max = Math.max(10, Math.floor(width / (size * 0.52)));
  const words = String(text).split(" ");
  const rows = [""];
  for (const word of words) {
    const trial = `${rows[rows.length - 1]} ${word}`.trim();
    if (trial.length > max && rows[rows.length - 1]) rows.push(word);
    else rows[rows.length - 1] = trial;
  }
  return rows;
}

function textBlock(text, x, y, opts = {}) {
  const size = opts.size || 50;
  const weight = opts.weight || 900;
  const width = opts.width || 640;
  const color = opts.color || ink;
  const lineHeight = opts.lineHeight || 1.12;
  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${wrap(text, size, width)
    .map((row, index) => `<tspan x="${x}" dy="${index ? size * lineHeight : 0}">${esc(row)}</tspan>`)
    .join("")}</text>`;
}

function frame(label, mode) {
  return `
    <rect width="${W}" height="${H}" fill="${bg}"/>
    <rect x="52" y="52" width="1496" height="796" fill="#FFFFFF"/>
    <rect x="52" y="52" width="1496" height="92" fill="${navy}"/>
    <text x="84" y="111" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">WORLD CLEAN BIZ</text>
    <text x="1160" y="111" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${gold}" letter-spacing="2">${esc(mode)}</text>
    <rect x="92" y="188" width="${Math.max(172, label.length * 12)}" height="36" fill="${gold}"/>
    <text x="112" y="213" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${navy}" letter-spacing="2">${esc(label)}</text>`;
}

function metric(x, y, w, label, value, fill = pale) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="86" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
    <text x="${x + 22}" y="${y + 32}" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="900" fill="${fill === gold ? navy : blue}">${esc(label)}</text>
    <text x="${x + 22}" y="${y + 68}" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="900" fill="${ink}">${esc(value)}</text>`;
}

function row(x, y, label, detail, active = false) {
  const fill = active ? gold : pale;
  return `
    <rect x="${x}" y="${y}" width="540" height="70" fill="${fill}" stroke="${fill === gold ? gold : line}"/>
    <text x="${x + 24}" y="${y + 30}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${active ? navy : blue}">${esc(label)}</text>
    <text x="${x + 24}" y="${y + 56}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="${ink}">${esc(detail)}</text>`;
}

function stack(rows, x = 850, y = 286) {
  return rows.map((item, index) => row(x, y + index * 78, item[0], item[1], index === 0)).join("");
}

async function render(file, body) {
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } })
    .composite([{ input: svg(`<svg width="${W}" height="${H}">${body}</svg>`), left: 0, top: 0 }])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, file));
}

async function card(file, label, mode, title, subtitle, metrics, panelTitle, rows, footer) {
  const body = `
    ${frame(label, mode)}
    ${textBlock(title, 92, 318, { size: 54, width: 640 })}
    ${textBlock(subtitle, 96, 494, { size: 27, weight: 800, color: "#29455F", width: 650 })}
    ${metric(96, 680, 170, metrics[0][0], metrics[0][1], gold)}
    ${metric(290, 680, 170, metrics[1][0], metrics[1][1])}
    ${metric(484, 680, 190, metrics[2][0], metrics[2][1])}
    <rect x="790" y="184" width="670" height="548" fill="#F9FBFC" stroke="${line}"/>
    <text x="834" y="238" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="${blue}" letter-spacing="2">${esc(panelTitle)}</text>
    ${stack(rows)}
    <text x="92" y="810" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#6B7C88" letter-spacing="0.8">${esc(footer)}</text>`;
  await render(file, body);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  await card("american-factory-and-manufacturing-transfer-image-020.jpg", "FACTORY REALITY", "D INDUSTRY OPINION", "Manufacturing Transfer Is Not Just Moving Machines", "The article uses American Factory to show that labor culture, management systems, cost structure and automation all shape whether reshoring works.", [["CASE", "Fuyao"], ["ISSUE", "Labor"], ["COST", "Higher"]], "TRANSFER FRICTIONS", [["Labor culture", "holidays, unions, work rhythm"], ["Management", "Chinese methods may not travel"], ["Safety", "inspection standards differ"], ["Automation", "robots replace labor pressure"], ["Conclusion", "U.S. production is hard for cost goods"]], "WCB / AMERICAN FACTORY / MANUFACTURING TRANSFER");
  await card("how-to-understand-complete-supply-chain-transfer-image-02.jpg", "TRANSFER DEPTH", "B MARKET ANALYSIS", "Complete Transfer Means More Than Final Assembly", "The article separates tariff response from real supply-chain migration: parts, tooling, engineers and clusters decide the depth of transfer.", [["LAYER", "Assembly"], ["CORE", "Suppliers"], ["TEST", "Cluster"]], "TRANSFER STACK", [["Final assembly", "easiest to move"], ["Key components", "harder to localize"], ["Engineering", "project and R&D capacity"], ["Supplier cluster", "cost and response speed"], ["Policy risk", "tariffs can change quickly"]], "WCB / SUPPLY CHAIN / TRANSFER DEPTH");
  await card("trade-war-scenario-analysis-image-02.jpg", "SCENARIO TREE", "E DATA VISUAL", "Trade War Outcomes Depend on Tariff Path and Team Retention", "The article compares tariff branches and shows why keeping domestic R&D capability can matter more than moving capacity first.", [["PATH", "3 branches"], ["TEAM", "China R&D"], ["RISK", "Delay"]], "DECISION TREE", [["Low tariff", "projects may return to China"], ["25% tariff", "partial overseas transfer"], ["60% tariff", "forced broad transfer"], ["Company A", "all-in overseas, weak new products"], ["Company B", "keeps China team and speed"]], "WCB / TRADE WAR / SCENARIO ANALYSIS");
  await card("impact-of-trump-reciprocal-tariffs-image-02.jpg", "TARIFF SHOCK", "E DATA VISUAL", "Reciprocal Tariffs Turn Planning Into Roulette", "The article's point is not a precise forecast but the uncertainty created for brands, suppliers, consumers and relocated factories.", [["POLICY", "Unclear"], ["ORDERS", "Slow"], ["ACTION", "Wait"]], "IMPACT MAP", [["Brand owners", "raise prices and cut inventory"], ["Manufacturers", "North America orders slow"], ["SEA factories", "risk if tariff logic changes"], ["Consumers", "higher prices and shortages"], ["Industry mood", "short-term caution"]], "WCB / TARIFFS / RECIPROCAL IMPACT");
  await card("china-us-trade-war-pause-image-002.jpg", "PAUSE SIGNAL", "B MARKET ANALYSIS", "A Trade War Pause Does Not Reverse Factory Moves", "The article explains why companies that already built Vietnam capacity would not immediately return just because tariffs paused.", [["PAUSE", "90 days"], ["TARIFF", "10%"], ["MOVE", "Continues"]], "WHY TRANSFER CONTINUES", [["Sunk cost", "overseas work already started"], ["Uncertainty", "policy can swing again"], ["Customer pressure", "globalization becomes ticket"], ["Cost target", "Vietnam must approach China cost"], ["Competition", "who gets the transferred share?"]], "WCB / CHINA-U.S. TRADE WAR / PAUSE");
  await card("trump-return-and-end-of-trade-war-image-003.jpg", "ENDGAME", "B MARKET ANALYSIS", "The Trade War Endgame Depends on Policy and Industrial Reality", "The article argues Southeast Asia has improved, but still lacks China's engineering depth, iteration speed and industrial cluster density.", [["TARIFF", "25%"], ["SEA", "Built"], ["GAP", "R&D"]], "ENDGAME VARIABLES", [["Possible increase", "higher tariffs remain possible"], ["Hold and tax", "tariffs on China plus SEA"], ["Reduce tariffs", "trade-war intensity falls"], ["SEA limits", "engineers and clusters lag"], ["China edge", "new product iteration speed"]], "WCB / TRADE WAR / ENDGAME");
  await card("who-benefits-from-china-us-trade-war-in-vacuums-image-006.jpg", "WINNER MAP", "B MARKET ANALYSIS", "Trade War Rewards Firms With Overseas Bases", "The article maps the vacuum-cleaner transfer logic: brands demand alternatives, OEMs move, and component suppliers with Malaysia or Vietnam assets gain leverage.", [["BENEFIT", "SEA base"], ["PRESSURE", "OEMs"], ["WINDOW", "Transfer"]], "BENEFICIARY LOGIC", [["Brand owners", "seek lower landed cost"], ["OEMs", "build or rent overseas capacity"], ["Suppliers", "follow major customers"], ["Chun Guang", "Malaysia hose base advantage"], ["Risk", "tariff reversal changes payoff"]], "WCB / VACUUMS / TRADE WAR BENEFICIARIES");
  await card("vietnam-development-and-industrial-hollowing-image-004.jpg", "HOLLOWING RISK", "B MARKET ANALYSIS", "Vietnam Threatens Weak Manufacturing Links", "The article argues Vietnam mainly absorbs tariff-driven U.S. projects; the bigger hollowing risk may hit older high-cost manufacturing regions first.", [["REGION", "Vietnam"], ["DRIVER", "Tariff"], ["LIMIT", "Scale"]], "MANUFACTURING MAP", [["China", "Suzhou, Ningbo, Shenzhen, Dongguan"], ["Southeast Asia", "U.S.-driven transfer"], ["Turkey", "Europe quota wildcard"], ["Mexico", "North America proximity"], ["Real risk", "weak low-cost assembly firms"]], "WCB / VIETNAM / INDUSTRIAL HOLLOWING");

  const files = [
    "american-factory-and-manufacturing-transfer-image-020.jpg",
    "how-to-understand-complete-supply-chain-transfer-image-02.jpg",
    "trade-war-scenario-analysis-image-02.jpg",
    "impact-of-trump-reciprocal-tariffs-image-02.jpg",
    "china-us-trade-war-pause-image-002.jpg",
    "trump-return-and-end-of-trade-war-image-003.jpg",
    "who-benefits-from-china-us-trade-war-in-vacuums-image-006.jpg",
    "vietnam-development-and-industrial-hollowing-image-004.jpg",
  ];
  const cards = [];
  for (let i = 0; i < files.length; i++) {
    const thumb = await sharp(path.join(outDir, files[i])).resize(390, 219).toBuffer();
    const x = 28 + (i % 4) * 410;
    const y = 32 + Math.floor(i / 4) * 318;
    cards.push({ input: thumb, left: x, top: y });
    cards.push({ input: svg(`<svg width="395" height="78"><text x="16" y="42" font-family="Arial" font-size="17" font-weight="900" fill="${ink}">${esc(files[i])}</text></svg>`), left: x, top: y + 222 });
  }
  fs.mkdirSync(reviewDir, { recursive: true });
  await sharp({ create: { width: 1680, height: 690, channels: 3, background: bg } })
    .composite(cards)
    .jpeg({ quality: 92 })
    .toFile(path.join(reviewDir, "batch-2026-06-11-supply-chain-trade-review.jpg"));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
