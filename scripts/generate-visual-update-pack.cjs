const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = process.cwd();
const outRoot = path.join(root, "public/images/articles");
const W = 1536;
const H = 1024;

const palette = {
  navy: "#06172b",
  deep: "#0a2744",
  blue: "#2f80ed",
  cyan: "#2fe6f2",
  teal: "#28d7c4",
  gold: "#f4c84a",
  red: "#ff5a5f",
  green: "#3ddc97",
  white: "#f7fbff",
  muted: "#a9bed0",
  line: "#25506f",
  panel: "#0d2a46"
};

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function wrap(text, size, width) {
  const max = Math.max(8, Math.floor(width / (size * 0.54)));
  const words = String(text).split(/\s+/);
  const rows = [""];
  for (const word of words) {
    const trial = `${rows[rows.length - 1]} ${word}`.trim();
    if (trial.length > max && rows[rows.length - 1]) rows.push(word);
    else rows[rows.length - 1] = trial;
  }
  return rows;
}

function textBlock(text, x, y, opts = {}) {
  const size = opts.size || 52;
  const width = opts.width || 650;
  const color = opts.color || palette.white;
  const weight = opts.weight || 900;
  const lineHeight = opts.lineHeight || 1.14;
  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${wrap(text, size, width)
    .map((row, index) => `<tspan x="${x}" dy="${index ? size * lineHeight : 0}">${esc(row)}</tspan>`)
    .join("")}</text>`;
}

function shell(title, subtitle, label) {
  return `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#031020"/>
        <stop offset="48%" stop-color="#08213a"/>
        <stop offset="100%" stop-color="#071a2f"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${palette.cyan}"/>
        <stop offset="100%" stop-color="${palette.blue}"/>
      </linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <path d="M0,822 C320,742 520,876 816,790 C1088,710 1220,592 1536,640 L1536,1024 L0,1024 Z" fill="#071326" opacity="0.92"/>
    <path d="M0,850 C360,766 552,914 850,814 C1138,718 1248,610 1536,670" fill="none" stroke="${palette.cyan}" stroke-width="3" opacity="0.42"/>
    <rect x="56" y="56" width="10" height="86" fill="${palette.cyan}"/>
    <text x="84" y="92" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="900" fill="${palette.white}">WORLD CLEAN BIZ</text>
    <text x="84" y="125" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="${palette.cyan}">Industry Intelligence</text>
    <rect x="56" y="180" width="${Math.max(220, label.length * 20)}" height="42" fill="none" stroke="${palette.cyan}" stroke-width="2"/>
    <text x="78" y="208" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="900" fill="${palette.cyan}" letter-spacing="2">${esc(label)}</text>
    ${textBlock(title, 56, 318, { size: 70, width: 760 })}
    ${textBlock(subtitle, 60, 514, { size: 30, width: 690, color: palette.muted, weight: 700, lineHeight: 1.25 })}
  `;
}

function card(x, y, w, h, title, body, accent = palette.cyan) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${palette.panel}" stroke="${accent}" stroke-width="2" opacity="0.96"/>
    <rect x="${x}" y="${y}" width="${w}" height="8" rx="4" fill="${accent}"/>
    <text x="${x + 28}" y="${y + 58}" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="900" fill="${palette.white}">${esc(title)}</text>
    ${textBlock(body, x + 28, y + 102, { size: 22, width: w - 56, color: palette.muted, weight: 750, lineHeight: 1.2 })}
  `;
}

function metric(x, y, label, value, accent = palette.cyan) {
  return `
    <circle cx="${x}" cy="${y}" r="72" fill="#08243e" stroke="${accent}" stroke-width="3" filter="url(#glow)"/>
    <text x="${x}" y="${y - 8}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="900" fill="${palette.white}">${esc(value)}</text>
    <text x="${x}" y="${y + 28}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="${accent}" letter-spacing="1">${esc(label)}</text>
  `;
}

function arrow(x1, y1, x2, y2, color = palette.cyan) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const ax = x2 - Math.cos(angle) * 16;
  const ay = y2 - Math.sin(angle) * 16;
  const left = `${ax - Math.cos(angle - Math.PI / 2) * 9},${ay - Math.sin(angle - Math.PI / 2) * 9}`;
  const right = `${ax - Math.cos(angle + Math.PI / 2) * 9},${ay - Math.sin(angle + Math.PI / 2) * 9}`;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="5" stroke-linecap="round"/><polygon points="${x2},${y2} ${left} ${right}" fill="${color}"/>`;
}

function bars(items, x, y, w, h, max, accent = palette.cyan) {
  const gap = 22;
  const bw = (w - gap * (items.length - 1)) / items.length;
  return items.map((item, i) => {
    const bh = (item.value / max) * h;
    const left = x + i * (bw + gap);
    const top = y + h - bh;
    return `
      <rect x="${left}" y="${top}" width="${bw}" height="${bh}" fill="${i === items.length - 1 ? palette.gold : accent}" opacity="${0.68 + i * 0.06}"/>
      <text x="${left + bw / 2}" y="${top - 20}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="900" fill="${palette.white}">${esc(item.label)}</text>
      <text x="${left + bw / 2}" y="${y + h + 42}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="${palette.muted}">${esc(item.year)}</text>
    `;
  }).join("");
}

async function render(slug, file, body) {
  const dir = path.join(outRoot, slug);
  fs.mkdirSync(dir, { recursive: true });
  const svg = Buffer.from(`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`);
  await sharp(svg).png().toFile(path.join(dir, file));
}

async function pool() {
  const slug = "pool-robotics-new-competitive-table";
  await render(slug, "01-cover.png", `
    ${shell("Pool Robots Become a Backyard Robotics Battle", "The quiet pool equipment category is being rearranged by wireless products, retail channels, startups and backyard robotics platforms.", "POOL ROBOTICS")}
    ${metric(920, 330, "WINDOW", "~1 YEAR", palette.gold)}
    ${metric(1120, 500, "RESULTS", "2027-28", palette.cyan)}
    ${metric(1320, 330, "SURVIVORS", "3-4", palette.green)}
    ${card(860, 650, 560, 210, "The table is crowded", "Old kings, channel empires, wireless challengers, high-end startups and broader robot companies are now competing in the same backyard.", palette.cyan)}
  `);
  await render(slug, "02-player-systems.png", `
    ${shell("Different Systems, Same Pool", "The players do not come from one industry. Each group is betting on a different source of advantage.", "PLAYER MAP")}
    ${card(760, 188, 300, 170, "Old Order", "Maytronics, Hayward and BWT defend channels, service networks and professional trust.", palette.gold)}
    ${card(1090, 188, 300, 170, "New Brands", "Aiper, Beatbot and WYBOT push wireless, brand volume, financing and manufacturing speed.", palette.cyan)}
    ${card(760, 402, 300, 170, "Robot Giants", "Dreame, Roborock, Ecovacs, Nine and Mammotion bring capital, algorithms and category expansion.", palette.green)}
    ${card(1090, 402, 300, 170, "Channel Empire", "Fluidra turns pool relationships into a platform for new robotic products.", palette.blue)}
    <circle cx="1076" cy="760" r="116" fill="#071b31" stroke="${palette.cyan}" stroke-width="5" filter="url(#glow)"/>
    <text x="1076" y="742" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="900" fill="${palette.white}">BACKYARD</text>
    <text x="1076" y="790" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="900" fill="${palette.cyan}">ROBOTICS</text>
  `);
  await render(slug, "03-chinese-challenger-paths.png", `
    ${shell("Three Chinese Challenger Paths", "Aiper, Beatbot and WYBOT are all attacking the old order, but each has a different missing lesson.", "CHALLENGER PATHS")}
    ${card(770, 220, 250, 390, "Aiper", "Brand volume, wireless products, retail expansion and Fluidra channel support. The next test is professional trust.", palette.cyan)}
    ${card(1045, 220, 250, 390, "Beatbot", "High-end intelligence, financing and product ambition. The next test is turning buzz into scale.", palette.gold)}
    ${card(1320, 220, 160, 390, "WYBOT", "Manufacturing and cost capability moving toward a global brand.", palette.green)}
    ${arrow(895, 680, 1045, 760, palette.cyan)}
    ${arrow(1170, 680, 1045, 760, palette.gold)}
    ${arrow(1400, 680, 1110, 760, palette.green)}
    <text x="1076" y="830" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${palette.white}">From product race to channel, service and capital race</text>
  `);
  await render(slug, "04-backyard-convergence.png", `
    ${shell("Pool Robots Will Merge Into Backyard Automation", "The long-term battle is not only pool cleaning. It is pool, lawn and yard maintenance under one household automation system.", "CONVERGENCE")}
    ${card(790, 230, 230, 170, "Pool", "Wireless robots and professional pool service.", palette.cyan)}
    ${card(1060, 230, 230, 170, "Lawn", "Robotic mowers become the second backyard anchor.", palette.green)}
    ${card(1330, 230, 150, 170, "Yard", "Broader outdoor maintenance.", palette.gold)}
    ${arrow(900, 470, 1040, 640, palette.cyan)}
    ${arrow(1170, 470, 1100, 640, palette.green)}
    ${arrow(1400, 470, 1160, 640, palette.gold)}
    <rect x="850" y="640" width="520" height="130" rx="18" fill="#08243e" stroke="${palette.cyan}" stroke-width="3"/>
    <text x="1110" y="695" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="35" font-weight="900" fill="${palette.white}">Backyard Robot Platform</text>
    <text x="1110" y="740" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="800" fill="${palette.muted}">Only a few brands may stay at the end</text>
  `);
}

async function irobot() {
  const slug = "irobot-decline-and-the-new-robot-vacuum-order";
  await render(slug, "01-cover.png", `
    ${shell("iRobot's Decline and the New Robot Vacuum Order", "The company that defined the category is now being tested by product speed, cost structure, Chinese competitors and financial pressure.", "ROBOT VACUUMS")}
    ${metric(900, 330, "2012 SHARE", ">80%", palette.gold)}
    ${metric(1130, 500, "2021 PEAK", "$1.565B", palette.cyan)}
    ${metric(1340, 330, "2025 Q2", "OUT TOP 5", palette.red)}
    ${card(850, 660, 560, 190, "Category leadership is not permanent", "Once navigation, docks, cost and iteration shift to competitors, the old leader must rebuild almost every advantage.", palette.red)}
  `);
  await render(slug, "02-decline-timeline.png", `
    ${shell("From Category Creator to Turnaround Case", "iRobot's problem is not one bad product cycle. It is a long chain of slowing innovation, failed sale, restructuring and competitive compression.", "DECLINE TIMELINE")}
    ${card(735, 225, 175, 160, "2002", "Roomba creates the modern robot vacuum category.", palette.gold)}
    ${card(940, 225, 175, 160, "2012", "Market share above 80% at the category peak.", palette.cyan)}
    ${card(1145, 225, 175, 160, "2021", "Revenue peaks around $1.565B.", palette.green)}
    ${card(735, 455, 175, 160, "2022-24", "Amazon deal fails; losses and layoffs follow.", palette.red)}
    ${card(940, 455, 175, 160, "2025", "New Roomba launch meets market doubts.", palette.red)}
    ${card(1145, 455, 175, 160, "Now", "Former leader falls out of top five in Q2 data.", palette.red)}
    ${arrow(910, 300, 940, 300, palette.cyan)}${arrow(1115, 300, 1145, 300, palette.cyan)}
    ${arrow(1230, 385, 820, 455, palette.red)}${arrow(910, 530, 940, 530, palette.red)}${arrow(1115, 530, 1145, 530, palette.red)}
  `);
  await render(slug, "03-new-order-pressure.png", `
    ${shell("The New Order Is Built on Faster Loops", "Chinese brands gained ground through navigation, all-in-one docks, channel execution, cost pressure and faster product iteration.", "NEW ORDER")}
    ${card(750, 210, 270, 180, "Navigation", "Lidar, mapping and obstacle handling moved the user benchmark upward.", palette.cyan)}
    ${card(1050, 210, 270, 180, "All-in-one docks", "Self-empty, mop washing and drying changed the premium definition.", palette.green)}
    ${card(750, 450, 270, 180, "Cost structure", "Supply chain speed and OEM leverage compressed prices.", palette.gold)}
    ${card(1050, 450, 270, 180, "Channel execution", "Online reviews, retail launches and faster SKU refresh cycles changed demand.", palette.red)}
    <text x="1035" y="765" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="900" fill="${palette.white}">iRobot must compete with a different industry clock.</text>
  `);
  await render(slug, "04-turnaround-gap.png", `
    ${shell("Turnaround Requires More Than Cost Cuts", "Layoffs and supplier shifts can buy time, but product relevance and market trust decide whether recovery is real.", "TURNAROUND GAP")}
    ${card(760, 255, 230, 220, "Cost cuts", "Lower headcount and manufacturing transfer improve survival runway.", palette.gold)}
    ${card(1030, 255, 230, 220, "Product reset", "Eight new Roombas and Max 705 need to rebuild user confidence.", palette.cyan)}
    ${card(1300, 255, 150, 220, "Liquidity", "Losses and weak market value limit room for error.", palette.red)}
    ${arrow(880, 560, 1040, 700, palette.gold)}
    ${arrow(1145, 560, 1080, 700, palette.cyan)}
    ${arrow(1370, 560, 1140, 700, palette.red)}
    <rect x="825" y="700" width="500" height="110" rx="16" fill="#08243e" stroke="${palette.red}" stroke-width="3"/>
    <text x="1075" y="768" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${palette.white}">Independent recovery is the real test</text>
  `);
}

async function anker() {
  const slug = "anker-innovation-lacks-methodology";
  await render(slug, "01-cover.png", `
    ${shell("Anker Innovation Has No Methodology", "A strong cross-border brand and VOC system do not automatically become category innovation in cleaning appliances.", "ANKER / EUFY")}
    ${metric(910, 330, "LISTED", "2020", palette.gold)}
    ${metric(1130, 500, "TEAM", "4000+", palette.cyan)}
    ${metric(1340, 330, "CUT", "10 LINES", palette.red)}
    ${card(850, 660, 560, 190, "The issue is category depth", "Cleaning appliances punish shallow product judgment, weak supply-chain depth and underbuilt after-sales systems.", palette.red)}
  `);
  await render(slug, "02-methodology-gap.png", `
    ${shell("VOC Was Not Enough", "Customer review mining worked when competition was weak. In cleaning appliances, every competitor learned the same playbook.", "METHOD GAP")}
    ${card(760, 225, 250, 190, "Old edge", "Amazon reviews, product feedback loops and cross-border channel speed.", palette.cyan)}
    ${card(1060, 225, 250, 190, "New baseline", "By 2021-22, pain-point mining had become common practice.", palette.gold)}
    ${card(910, 515, 300, 210, "Missing layer", "Category leaders with deep product judgment, engineering reality and service economics.", palette.red)}
    ${arrow(1010, 320, 1060, 320, palette.cyan)}
    ${arrow(1190, 415, 1080, 515, palette.red)}
    ${arrow(885, 415, 1010, 515, palette.red)}
  `);
  await render(slug, "03-cleaning-appliance-pressure.png", `
    ${shell("Cleaning Appliances Expose the Weakness", "Unlike 3C accessories, floorcare products are wet, mechanical, heavy, service-intensive and brutally price competitive.", "CATEGORY TEST")}
    ${card(760, 190, 250, 180, "Product definition", "Small mistakes become poor cleaning, poor usability and poor reviews.", palette.cyan)}
    ${card(1040, 190, 250, 180, "Supply chain", "Motors, pumps, tanks, sealing and batteries require real manufacturing depth.", palette.green)}
    ${card(760, 430, 250, 180, "After-sales", "Returns, leakage, odor and repair pressure damage brand trust.", palette.red)}
    ${card(1040, 430, 250, 180, "Price war", "Amazon channel advantages shrink when competitors know the same playbook.", palette.gold)}
    <text x="1030" y="770" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="35" font-weight="900" fill="${palette.white}">Platform capability must meet category reality.</text>
  `);
  await render(slug, "04-talent-platform-reset.png", `
    ${shell("The Reset Is Talent, Incentives and Category Leadership", "The article argues that Anker still has opportunities, but the next phase requires stronger leaders and better reward distribution.", "RESET LOGIC")}
    ${card(760, 230, 220, 200, "Top talent", "Category success depends on the person leading the category.", palette.cyan)}
    ${card(1010, 230, 220, 200, "Reward design", "People who create more value need stronger upside.", palette.gold)}
    ${card(1260, 230, 180, 200, "Platform", "Anker can still provide brand, capital and global channels.", palette.green)}
    ${arrow(870, 520, 1010, 680, palette.cyan)}
    ${arrow(1120, 520, 1080, 680, palette.gold)}
    ${arrow(1350, 520, 1160, 680, palette.green)}
    <rect x="830" y="680" width="500" height="116" rx="16" fill="#08243e" stroke="${palette.cyan}" stroke-width="3"/>
    <text x="1080" y="752" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${palette.white}">From methodology to people system</text>
  `);
}

async function roborock() {
  const slug = "roborock-road-to-100-billion-rmb";
  await render(slug, "01-cover.png", `
    ${shell("Witnessing Roborock's Road to RMB 100 Billion", "The target is not just a sales number. It tests whether a robot vacuum leader can become a broader cleaning platform.", "ROBOROCK GROWTH")}
    ${metric(910, 330, "2024", "¥11.9B", palette.cyan)}
    ${metric(1130, 500, "2025E", "~¥20B", palette.gold)}
    ${metric(1340, 330, "2030", "¥100B", palette.green)}
    ${card(850, 660, 560, 190, "Growth is a platform test", "Sustained expansion depends on product breadth, global channels and whether Roborock can keep outgrowing the category.", palette.green)}
  `);
  await render(slug, "02-growth-path.png", `
    ${shell("The Growth Path Requires Compounding", "The article's logic depends on 2025 acceleration and then sustained high growth through 2030.", "GROWTH PATH")}
    <rect x="770" y="235" width="620" height="390" fill="#071b31" stroke="${palette.line}" stroke-width="2"/>
    ${bars([
      { year: "2024", value: 12, label: "¥11.9B" },
      { year: "2025E", value: 20, label: "~¥20B" },
      { year: "2026E", value: 28, label: "~¥28B" },
      { year: "2030T", value: 100, label: "¥100B" }
    ], 825, 300, 500, 250, 100, palette.cyan)}
    <text x="1080" y="705" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="900" fill="${palette.white}">The hard part is not one fast year. It is keeping the curve steep.</text>
  `);
  await render(slug, "03-prerequisites.png", `
    ${shell("Three Prerequisites Behind the Target", "Roborock needs the category to expand, its own share to rise and its product system to move beyond one hero category.", "PREREQUISITES")}
    ${card(760, 230, 230, 220, "Market growth", "Global cleaning appliances must continue to expand faster than mature appliance categories.", palette.cyan)}
    ${card(1030, 230, 230, 220, "Share gain", "Roborock must keep outgrowing competitors after a very strong 2025.", palette.gold)}
    ${card(1300, 230, 160, 220, "Platform", "Robot vacuum alone is not enough for a ¥100B story.", palette.green)}
    ${arrow(880, 550, 1045, 690, palette.cyan)}
    ${arrow(1145, 550, 1090, 690, palette.gold)}
    ${arrow(1370, 550, 1160, 690, palette.green)}
    <rect x="835" y="690" width="500" height="115" rx="16" fill="#08243e" stroke="${palette.green}" stroke-width="3"/>
    <text x="1085" y="762" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${palette.white}">A company-size question, not a product question</text>
  `);
  await render(slug, "04-platform-expansion.png", `
    ${shell("From Robot Vacuum Leader to Cleaning Platform", "To reach the target, Roborock has to extend from a strong core into a wider set of household and outdoor cleaning categories.", "PLATFORM EXPANSION")}
    ${card(760, 210, 240, 170, "Core", "Robot vacuums and all-in-one docks remain the profit and brand anchor.", palette.cyan)}
    ${card(1030, 210, 240, 170, "Adjacent", "Hard floor washers, vacuums and broader floorcare widen the market.", palette.gold)}
    ${card(895, 500, 300, 190, "Next platform", "Global channels, product breadth and smart home system capability decide the ceiling.", palette.green)}
    ${arrow(1000, 295, 1030, 295, palette.cyan)}
    ${arrow(1120, 380, 1045, 500, palette.gold)}
    ${arrow(880, 380, 990, 500, palette.cyan)}
  `);
}

async function main() {
  await pool();
  await irobot();
  await anker();
  await roborock();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
