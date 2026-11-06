// Diagnostic-guide covers: light paper, one product line drawing, the suspect part in accent orange.
// Usage: node scripts/diagnostic-covers.mjs OUT_DIR [slug ...]  (then copy OUT_DIR/{slug}.png to the
// slug source folder as 01-cover.png and run npm run prepare:article-images -- --slug {slug}).
// Add a new guide by adding an entry to COVERS below. See docs/operations/wcb-cover-style.md.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const W = 1600, H = 900;
const INK = "#1F2B37", MUTED = "#8A96A3", LINE = "#C9D1D9", PAPER = "#F5F3EE", GRID = "#E7E3DA", BODY = "#FFFFFF", SOFT = "#EEF1F4";
const ACC = "#E4572E", ACC_SOFT = "#FBE3DA";
const FONT = "Helvetica Neue, Helvetica, Arial, sans-serif";

const hl = (on) => (on ? `fill="${ACC_SOFT}" stroke="${ACC}"` : `fill="${SOFT}" stroke="${INK}"`);

function grid() {
  let g = "";
  for (let x = 0; x <= W; x += 40) g += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${GRID}" stroke-width="1"/>`;
  for (let y = 0; y <= H; y += 40) g += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${GRID}" stroke-width="1"/>`;
  return g;
}

function tag(category) {
  return `<g font-family="${FONT}" font-weight="700">
    <rect x="232" y="78" width="14" height="14" fill="${ACC}"/>
    <text x="258" y="91" font-size="20" letter-spacing="3" fill="${INK}">DIAGNOSTIC GUIDE</text>
    <text x="258" y="121" font-size="20" letter-spacing="3" fill="${MUTED}">${category.toUpperCase()}</text>
  </g>`;
}

const ROT = (-24 * Math.PI) / 180;
// Map a point drawn in the stick vacuum's upright frame to the tilted canvas.
const rp = (x, y) => [800 + (x - 800) * Math.cos(ROT) - (y - 470) * Math.sin(ROT), 470 + (x - 800) * Math.sin(ROT) + (y - 470) * Math.cos(ROT)];

function callout(x1, y1, x2, y2, label, rotated = false) {
  if (rotated) [x1, y1] = rp(x1, y1);
  const right = x2 >= x1;
  const tw = label.length * 15 + 44;
  const bx = right ? Math.min(x2, 1380 - tw) : Math.max(x2 - tw, 220);
  const lx = right ? bx : bx + tw;
  return `<g font-family="${FONT}">
    <line x1="${x1}" y1="${y1}" x2="${lx}" y2="${y2}" stroke="${ACC}" stroke-width="3"/>
    <circle cx="${x1}" cy="${y1}" r="9" fill="${ACC}"/>
    <rect x="${bx}" y="${y2 - 30}" width="${tw}" height="60" rx="30" fill="${INK}"/>
    <text x="${bx + tw / 2}" y="${y2 + 9}" font-size="26" font-weight="700" fill="#fff" text-anchor="middle">${label}</text>
  </g>`;
}

// ---------- Robot vacuum, underside ----------
function robotUnder(o = {}) {
  const cx = 800, cy = 480;
  let s = `<circle cx="${cx}" cy="${cy}" r="300" fill="${BODY}" stroke="${INK}" stroke-width="5"/>
  <circle cx="${cx}" cy="${cy}" r="282" fill="none" stroke="${LINE}" stroke-width="2"/>`;
  // cliff sensors
  for (const a of [-150, -110, -70, -30, 30, 150]) {
    const r = (a * Math.PI) / 180, x = cx + 255 * Math.cos(r), y = cy + 255 * Math.sin(r);
    s += `<rect x="${x - 12}" y="${y - 7}" width="24" height="14" rx="4" fill="${SOFT}" stroke="${INK}" stroke-width="2" transform="rotate(${a + 90} ${x} ${y})"/>`;
  }
  // caster + charging contacts
  s += `<circle cx="${cx}" cy="${cy - 215}" r="24" fill="${SOFT}" stroke="${INK}" stroke-width="3"/><circle cx="${cx}" cy="${cy - 215}" r="8" fill="${INK}"/>`;
  s += `<rect x="${cx - 95}" y="${cy - 222}" width="40" height="16" rx="4" ${hl(o.contacts)} stroke-width="3"/><rect x="${cx + 55}" y="${cy - 222}" width="40" height="16" rx="4" ${hl(o.contacts)} stroke-width="3"/>`;
  // drive wheels
  for (const sx of [-1, 1]) {
    const x = cx + sx * 205 - 32;
    s += `<rect x="${x}" y="${cy - 85}" width="64" height="160" rx="22" ${hl(o.wheels)} stroke-width="4"/>`;
    for (let k = 0; k < 6; k++) s += `<line x1="${x + 10}" y1="${cy - 62 + k * 23}" x2="${x + 54}" y2="${cy - 62 + k * 23}" stroke="${o.wheels ? ACC : INK}" stroke-width="2" opacity=".55"/>`;
  }
  // battery cover
  s += `<rect x="${cx - 95}" y="${cy - 160}" width="190" height="105" rx="14" ${hl(o.battery)} stroke-width="4"/>`;
  for (const [dx, dy] of [[-75, -142], [75, -142], [-75, -73], [75, -73]]) s += `<circle cx="${cx + dx}" cy="${cy + dy}" r="5" fill="${o.battery ? ACC : INK}"/>`;
  if (o.battery) s += `<rect x="${cx - 40}" y="${cy - 125}" width="70" height="34" rx="5" fill="none" stroke="${ACC}" stroke-width="3"/><rect x="${cx + 30}" y="${cy - 116}" width="8" height="16" fill="${ACC}"/><rect x="${cx - 34}" y="${cy - 119}" width="22" height="22" fill="${ACC}"/>`;
  // main brush
  if (!o.mops) {
    s += `<rect x="${cx - 165}" y="${cy + 70}" width="330" height="86" rx="40" fill="${BODY}" stroke="${INK}" stroke-width="4"/>`;
    s += `<rect x="${cx - 145}" y="${cy + 84}" width="290" height="58" rx="29" ${hl(o.brush)} stroke-width="3"/>`;
    for (let k = 0; k < 11; k++) s += `<line x1="${cx - 130 + k * 26}" y1="${cy + 90}" x2="${cx - 112 + k * 26}" y2="${cy + 136}" stroke="${o.brush ? ACC : INK}" stroke-width="3" opacity=".7"/>`;
  } else {
    for (const sx of [-1, 1]) {
      const mx = cx + sx * 118, my = cy + 150;
      s += `<circle cx="${mx}" cy="${my}" r="98" ${hl(true)} stroke-width="4"/><circle cx="${mx}" cy="${my}" r="70" fill="none" stroke="${ACC}" stroke-width="2" stroke-dasharray="8 8"/><circle cx="${mx}" cy="${my}" r="16" fill="${BODY}" stroke="${ACC}" stroke-width="3"/>`;
      s += `<path d="M ${mx - 60} ${my - 118} A 120 120 0 0 ${sx > 0 ? 1 : 0} ${mx + 60} ${my - 118}" fill="none" stroke="${ACC}" stroke-width="4" marker-end="url(#arrow)"/>`;
    }
  }
  // side brush
  const bx = cx - 205, by = cy - 175;
  const arm = (a) => {
    const r = (a * Math.PI) / 180, ex = bx + 92 * Math.cos(r), ey = by + 92 * Math.sin(r);
    let t = `<line x1="${bx}" y1="${by}" x2="${ex}" y2="${ey}" stroke="${o.side ? ACC : INK}" stroke-width="5" stroke-linecap="round"/>`;
    for (const d of [-14, 0, 14]) { const rr = ((a + d) * Math.PI) / 180; t += `<line x1="${ex}" y1="${ey}" x2="${ex + 26 * Math.cos(rr)}" y2="${ey + 26 * Math.sin(rr)}" stroke="${o.side ? ACC : INK}" stroke-width="2.5"/>`; }
    return t;
  };
  if (o.side === "loose") {
    s += `<circle cx="${bx}" cy="${by}" r="10" fill="${INK}"/>`;
    s += `<g transform="translate(-120 -70) rotate(-18 ${bx} ${by})">${[210, 330, 90].map(arm).join("")}<circle cx="${bx}" cy="${by}" r="24" fill="${ACC_SOFT}" stroke="${ACC}" stroke-width="4"/></g>`;
    s += `<path d="M ${bx - 30} ${by - 30} q -40 -30 -82 -36" fill="none" stroke="${ACC}" stroke-width="3" stroke-dasharray="7 8"/>`;
  } else {
    s += [210, 330, 90].map(arm).join("") + `<circle cx="${bx}" cy="${by}" r="24" ${hl(o.side)} stroke-width="4"/>`;
  }
  return s;
}

// ---------- Robot vacuum, top ----------
function robotTop(o = {}) {
  const cx = o.cx ?? 800, cy = o.cy ?? 480, k = o.k ?? 1;
  let s = `<g transform="translate(${cx} ${cy}) scale(${k})">`;
  s += `<circle cx="0" cy="0" r="300" fill="${BODY}" stroke="${INK}" stroke-width="5"/>`;
  s += `<path d="M -260 -150 A 300 300 0 0 1 260 -150" fill="none" stroke="${o.bumper ? ACC : INK}" stroke-width="${o.bumper ? 16 : 10}" stroke-linecap="round"/>`;
  s += `<circle cx="0" cy="0" r="282" fill="none" stroke="${LINE}" stroke-width="2"/>`;
  s += `<circle cx="0" cy="-125" r="66" ${hl(o.lidar)} stroke-width="4"/><circle cx="0" cy="-125" r="42" fill="${BODY}" stroke="${o.lidar ? ACC : INK}" stroke-width="3"/><rect x="-26" y="-133" width="52" height="16" rx="6" fill="${o.lidar ? ACC : INK}"/>`;
  s += `<rect x="-140" y="25" width="280" height="175" rx="34" ${hl(o.bin)} stroke-width="4"/>`;
  s += `<rect x="-60" y="45" width="120" height="14" rx="7" fill="${o.bin ? ACC : LINE}"/>`;
  for (let i = 0; i < 6; i++) s += `<line x1="${-100 + i * 40}" y1="95" x2="${-100 + i * 40}" y2="175" stroke="${o.bin ? ACC : LINE}" stroke-width="3"/>`;
  s += `<circle cx="-38" cy="-15" r="17" ${hl(o.power)} stroke-width="3"/><circle cx="38" cy="-15" r="17" fill="${SOFT}" stroke="${INK}" stroke-width="3"/>`;
  s += `<path d="M -45 -15 a 7 7 0 1 0 14 0" fill="none" stroke="${o.power ? ACC : INK}" stroke-width="2.5" transform="translate(7 2)"/><line x1="-38" y1="-25" x2="-38" y2="-14" stroke="${o.power ? ACC : INK}" stroke-width="2.5"/>`;
  s += `</g>`;
  return s;
}

// ---------- Cordless stick vacuum, side ----------
function stick(o = {}) {
  // drawn upright then tilted
  let s = `<g transform="rotate(-24 800 470)">`;
  const x = 800;
  // floor head
  s += `<rect x="${x - 170}" y="760" width="300" height="88" rx="30" fill="${BODY}" stroke="${INK}" stroke-width="5"/>`;
  s += `<rect x="${x - 150}" y="790" width="250" height="44" rx="22" ${hl(o.brushroll)} stroke-width="3"/>`;
  for (let k = 0; k < 9; k++) s += `<line x1="${x - 138 + k * 27}" y1="795" x2="${x - 122 + k * 27}" y2="829" stroke="${o.brushroll ? ACC : INK}" stroke-width="3" opacity=".7"/>`;
  s += `<circle cx="${x + 110}" cy="836" r="16" fill="${SOFT}" stroke="${INK}" stroke-width="3"/>`;
  // neck + wand
  s += `<rect x="${x - 30}" y="715" width="60" height="60" rx="14" fill="${SOFT}" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect x="${x - 17}" y="380" width="34" height="345" rx="10" fill="${BODY}" stroke="${INK}" stroke-width="4"/>`;
  // bin (cyclone)
  s += `<rect x="${x - 58}" y="235" width="116" height="160" rx="26" ${hl(o.bin)} stroke-width="5"/>`;
  for (let k = 0; k < 4; k++) s += `<line x1="${x - 40}" y1="${270 + k * 30}" x2="${x + 40}" y2="${270 + k * 30}" stroke="${o.bin ? ACC : LINE}" stroke-width="3"/>`;
  // motor
  s += `<rect x="${x - 50}" y="140" width="100" height="100" rx="20" ${hl(o.motor)} stroke-width="5"/>`;
  s += `<circle cx="${x}" cy="190" r="26" fill="${BODY}" stroke="${o.motor ? ACC : INK}" stroke-width="3"/>`;
  // filter cap (top)
  s += `<rect x="${x - 40}" y="96" width="80" height="48" rx="14" ${hl(o.filter)} stroke-width="5"/>`;
  for (let k = 0; k < 4; k++) s += `<line x1="${x - 24 + k * 16}" y1="106" x2="${x - 24 + k * 16}" y2="134" stroke="${o.filter ? ACC : INK}" stroke-width="2.5"/>`;
  // handle + trigger
  s += `<path d="M ${x + 50} 160 C ${x + 150} 150, ${x + 175} 210, ${x + 175} 270 L ${x + 175} 340" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>`;
  s += `<path d="M ${x + 50} 160 C ${x + 150} 150, ${x + 175} 210, ${x + 175} 270 L ${x + 175} 340" fill="none" stroke="${BODY}" stroke-width="12" stroke-linecap="round"/>`;
  s += `<rect x="${x + 128}" y="200" width="22" height="44" rx="8" ${hl(o.trigger)} stroke-width="4"/>`;
  // battery under handle
  s += `<rect x="${x + 60}" y="300" width="150" height="70" rx="16" ${hl(o.battery)} stroke-width="5"/>`;
  if (o.battery) s += `<rect x="${x + 82}" y="320" width="60" height="30" rx="4" fill="${ACC}"/><rect x="${x + 142}" y="328" width="8" height="14" fill="${ACC}"/>`;
  s += `<circle cx="${x + 185}" cy="335" r="9" ${hl(o.port)} stroke-width="3"/>`;
  s += `</g>`;
  return s;
}

// ---------- extras ----------
const waves = (x, y, n = 3, color = ACC, dir = 1) => Array.from({ length: n }, (_, i) => `<path d="M ${x + dir * i * 26} ${y - 40 - i * 14} q ${dir * 30} ${40 + i * 14} 0 ${80 + i * 28}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" opacity="${1 - i * 0.22}"/>`).join("");
const heat = (x, y) => [0, 1, 2].map((i) => `<path d="M ${x + i * 34} ${y} c -16 -22 16 -38 0 -60 c -16 -22 16 -38 0 -60" fill="none" stroke="${ACC}" stroke-width="4" stroke-linecap="round" opacity="${1 - i * 0.2}"/>`).join("");
const odor = (x, y) => [0, 1, 2].map((i) => `<path d="M ${x + i * 40} ${y} c -20 -20 20 -36 0 -56 c -20 -20 20 -36 0 -56" fill="none" stroke="${MUTED}" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 10" opacity=".9"/>`).join("");
const dust = (x, y) => [[0, 0, 14], [30, -26, 9], [58, 4, 11], [22, 30, 7], [80, -30, 6], [92, 18, 8]].map(([dx, dy, r]) => `<circle cx="${x + dx}" cy="${y + dy}" r="${r}" fill="${MUTED}" opacity=".55"/>`).join("");

function floorplan() {
  let s = `<g stroke="${INK}" stroke-width="6" fill="none" stroke-linejoin="round">
    <rect x="420" y="190" width="760" height="560" fill="${BODY}"/>
    <line x1="760" y1="190" x2="760" y2="430"/><line x1="420" y1="430" x2="690" y2="430"/><line x1="830" y1="430" x2="1180" y2="430"/>
    <line x1="980" y1="430" x2="980" y2="750"/><line x1="760" y1="520" x2="760" y2="750"/>
  </g>`;
  s += `<rect x="986" y="436" width="188" height="308" fill="${ACC_SOFT}"/>`;
  for (let k = 0; k < 12; k++) s += `<line x1="${986}" y1="${450 + k * 26}" x2="${1174}" y2="${430 + k * 26 - 40}" stroke="${ACC}" stroke-width="2" opacity=".5" clip-path="url(#room)"/>`;
  s += `<rect x="986" y="436" width="188" height="308" fill="none" stroke="${ACC}" stroke-width="4" stroke-dasharray="14 10"/>`;
  s += `<text x="1080" y="612" font-family="${FONT}" font-size="96" font-weight="700" fill="${ACC}" text-anchor="middle">?</text>`;
  s += `<path d="M 600 330 L 880 330 L 880 600 L 600 600 Z" fill="none" stroke="${MUTED}" stroke-width="3" stroke-dasharray="4 12"/>`;
  s += robotTop({ cx: 600, cy: 600, k: 0.17 });
  return s;
}

const loop = () => `<ellipse cx="800" cy="480" rx="400" ry="370" fill="none" stroke="${ACC}" stroke-width="4" stroke-dasharray="16 14" marker-end="url(#arrow)"/>`;
const obstacles = () => `<g stroke="${INK}" stroke-width="5"><rect x="1150" y="240" width="54" height="300" rx="12" fill="${SOFT}"/><rect x="380" y="610" width="54" height="230" rx="12" fill="${SOFT}"/></g>
  <path d="M 330 300 C 420 250, 470 360, 560 300 S 700 250, 760 140" fill="none" stroke="${MUTED}" stroke-width="7" stroke-linecap="round"/>`;
const trail = () => [[600, 820], [660, 806], [720, 826], [780, 812], [860, 830], [930, 815], [1000, 828]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${6 + (i % 3) * 3}" fill="${ACC}" opacity=".7"/>`).join("");

const COVERS = {
  "robot-vacuum-battery-drains-fast": { cat: "Robot vacuum", draw: () => robotUnder({ battery: true }), co: [800, 375, 1240, 250, "Battery pack"] },
  "robot-vacuum-brush-not-spinning": { cat: "Robot vacuum", draw: () => robotUnder({ brush: true }) + waves(1015, 593, 2, ACC), co: [940, 593, 1240, 680, "Main brush"] },
  "robot-vacuum-going-in-circles": { cat: "Robot vacuum", draw: () => loop() + robotUnder({ wheels: true }), co: [1005, 475, 1250, 330, "Drive wheels"] },
  "robot-vacuum-keeps-getting-stuck": { cat: "Robot vacuum", draw: () => obstacles() + robotTop({ bumper: true }), co: [990, 250, 1260, 150, "Bumper"] },
  "robot-vacuum-keeps-stopping": { cat: "Robot vacuum", draw: () => robotTop({ lidar: true }), co: [866, 355, 1240, 250, "LiDAR sensor"] },
  "robot-vacuum-leaving-dirt-behind": { cat: "Robot vacuum", draw: () => robotUnder({ brush: true }) + trail(), co: [945, 593, 1240, 690, "Pickup path"] },
  "robot-vacuum-making-loud-noise": { cat: "Robot vacuum", draw: () => robotUnder({ brush: true, wheels: true }) + waves(1130, 480, 3) + waves(470, 480, 3, ACC, -1), co: [940, 593, 1240, 700, "Brush and wheels"] },
  "robot-vacuum-map-wrong-missing-rooms": { cat: "Robot vacuum", draw: () => floorplan(), co: [1100, 470, 1240, 140, "Missing room"] },
  "robot-vacuum-mop-pads-not-spinning": { cat: "Robot vacuum", draw: () => robotUnder({ mops: true }), co: [1016, 630, 1250, 720, "Mop pads"] },
  "robot-vacuum-side-brush-keeps-falling-off": { cat: "Robot vacuum", draw: () => robotUnder({ side: "loose" }), co: [575, 330, 380, 520, "Side brush"] },
  "robot-vacuum-smells-bad": { cat: "Robot vacuum", draw: () => robotTop({ bin: true }) + odor(1000, 600), co: [940, 590, 1250, 700, "Dustbin and filter"] },
  "robot-vacuum-wont-turn-on": { cat: "Robot vacuum", draw: () => robotTop({ power: true }), co: [762, 465, 1240, 330, "Power button"] },
  "cordless-vacuum-battery-drains-fast": { cat: "Cordless vacuum", draw: () => stick({ battery: true }), co: [935, 335, 1180, 420, "Battery", true] },
  "cordless-vacuum-keeps-shutting-off": { cat: "Cordless vacuum", draw: () => stick({ filter: true, bin: true }), co: [800, 120, 1100, 160, "Filter and airflow", true] },
  "cordless-vacuum-not-charging": { cat: "Cordless vacuum", draw: () => { const [px, py] = rp(985, 335); return stick({ port: true }) + `<path d="M ${px + 8} ${py + 4} C ${px + 90} ${py + 40}, ${px + 110} ${py + 160}, ${px + 180} ${py + 200}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><rect x="${px + 170}" y="${py + 185}" width="70" height="40" rx="8" fill="${SOFT}" stroke="${INK}" stroke-width="4"/>`; }, co: [985, 335, 1160, 230, "Charging port", true] },
  "cordless-vacuum-wont-turn-on": { cat: "Cordless vacuum", draw: () => stick({ trigger: true, battery: true }), co: [939, 222, 1120, 170, "Trigger and battery", true] },
  "vacuum-brush-roll-not-spinning": { cat: "Vacuum cleaner", draw: () => stick({ brushroll: true }), co: [775, 812, 1180, 760, "Brush roll", true] },
  "vacuum-cleaner-blowing-out-dust": { cat: "Vacuum cleaner", draw: () => stick({ bin: true, filter: true }) + dust(560, 250), co: [800, 315, 380, 470, "Bin and seals", true] },
  "vacuum-cleaner-making-loud-noise": { cat: "Vacuum cleaner", draw: () => stick({ motor: true }) + waves(600, 230, 3, ACC, -1), co: [800, 190, 380, 400, "Motor", true] },
  "vacuum-cleaner-overheating": { cat: "Vacuum cleaner", draw: () => stick({ motor: true, filter: true }) + heat(520, 260), co: [800, 190, 380, 400, "Motor and filter", true] },
  "vacuum-cleaner-smells-burnt": { cat: "Vacuum cleaner", draw: () => stick({ brushroll: true, motor: true }) + odor(980, 760), co: [775, 812, 1100, 600, "Brush roll and motor", true] }
};

function svgFor(slug) {
  const c = COVERS[slug];
  // stick vacuum drawn larger: scale about centre

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${ACC}"/></marker>
  <clipPath id="room"><rect x="986" y="436" width="188" height="308"/></clipPath></defs>
  <rect width="${W}" height="${H}" fill="${PAPER}"/>${grid()}
  ${c.draw()}
  ${callout(...c.co)}
  ${tag(c.cat)}
</svg>`;
}

const [out, ...only] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
for (const slug of only.length ? only : Object.keys(COVERS)) {
  await sharp(Buffer.from(svgFor(slug))).png().toFile(path.join(out, `${slug}.png`));
  console.log(slug);
}
