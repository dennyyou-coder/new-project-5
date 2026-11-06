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

function tag(category, kicker = "Diagnostic guide") {
  return `<g font-family="${FONT}" font-weight="700">
    <rect x="232" y="78" width="14" height="14" fill="${ACC}"/>
    <text x="258" y="91" font-size="20" letter-spacing="3" fill="${INK}">${kicker.toUpperCase()}</text>
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
  let s = `<g transform="translate(${o.dx ?? 0} ${o.dy ?? 0}) translate(800 470) scale(${o.k ?? 1}) translate(-800 -470) rotate(${o.angle ?? -24} 800 470)${o.flip ? " translate(1600 0) scale(-1 1)" : ""}">`;
  const x = 800;
  if (o.dock) s += `<path d="M ${x - 210} 850 L ${x - 190} 800 L ${x + 170} 800 L ${x + 190} 850 Z" ${hl(true)} stroke-width="5" stroke-linejoin="round"/><path d="M ${x - 160} 814 h 300" stroke="${ACC}" stroke-width="3" stroke-dasharray="8 8"/>`;
  if (!o.handheld) {
  // floor head
  s += `<rect x="${x - 170}" y="760" width="300" height="88" rx="30" fill="${BODY}" stroke="${INK}" stroke-width="5"/>`;
  s += `<rect x="${x - 150}" y="790" width="250" height="44" rx="22" ${hl(o.brushroll)} stroke-width="3"/>`;
  for (let k = 0; k < 9; k++) s += `<line x1="${x - 138 + k * 27}" y1="795" x2="${x - 122 + k * 27}" y2="829" stroke="${o.brushroll ? ACC : INK}" stroke-width="3" opacity=".7"/>`;
  s += `<circle cx="${x + 110}" cy="836" r="16" fill="${SOFT}" stroke="${INK}" stroke-width="3"/>`;
  // neck + wand
  s += `<rect x="${x - 30}" y="715" width="60" height="60" rx="14" fill="${SOFT}" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect x="${x - 17}" y="380" width="34" height="345" rx="10" ${o.wand ? hl(true) : `fill="${BODY}" stroke="${INK}"`} stroke-width="4"/>`;
  } else {
    s += `<path d="M ${x - 20} 395 L ${x - 34} 540 L ${x + 34} 540 L ${x + 20} 395 Z" ${hl(o.nozzle)} stroke-width="5" stroke-linejoin="round"/>`;
  }
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


// ---------- Robot vacuum dock (side elevation) ----------
function dock(o = {}) {
  const x = 930, y = 150, w = 280, h = 600;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="34" fill="${BODY}" stroke="${INK}" stroke-width="5"/>`;
  // dust bag compartment
  s += `<rect x="${x + 40}" y="${y + 50}" width="${w - 80}" height="210" rx="20" ${hl(o.bag)} stroke-width="4"/>`;
  s += `<path d="M ${x + 80} ${y + 90} h ${w - 160} v 130 q ${-(w - 160) / 2} 30 ${-(w - 160)} 0 z" fill="none" stroke="${o.bag ? ACC : LINE}" stroke-width="3"/>`;
  // water tanks
  s += `<rect x="${x + 40}" y="${y + 290}" width="${(w - 100) / 2}" height="150" rx="16" ${hl(o.tank)} stroke-width="4"/><rect x="${x + 60 + (w - 100) / 2}" y="${y + 290}" width="${(w - 100) / 2}" height="150" rx="16" ${hl(o.tank)} stroke-width="4"/>`;
  // IR / beacon window
  s += `<rect x="${x + 90}" y="${y + 470}" width="${w - 180}" height="22" rx="11" ${hl(o.beacon)} stroke-width="3"/>`;
  // ramp + contacts
  s += `<path d="M ${x - 200} ${y + h} L ${x} ${y + h - 46} L ${x} ${y + h} Z" fill="${SOFT}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<rect x="${x - 70}" y="${y + h - 40}" width="44" height="12" rx="4" ${hl(o.contacts)} stroke-width="3" transform="rotate(-13 ${x - 48} ${y + h - 34})"/>`;
  s += `<line x1="200" y1="${y + h + 2}" x2="1400" y2="${y + h + 2}" stroke="${INK}" stroke-width="4"/>`;
  // robot (side) approaching
  const rx = o.robotX ?? 520;
  s += `<rect x="${rx - 170}" y="${y + h - 92}" width="340" height="88" rx="40" fill="${BODY}" stroke="${INK}" stroke-width="5"/><rect x="${rx - 40}" y="${y + h - 120}" width="80" height="30" rx="10" fill="${SOFT}" stroke="${INK}" stroke-width="4"/><circle cx="${rx - 95}" cy="${y + h - 6}" r="16" fill="${SOFT}" stroke="${INK}" stroke-width="4"/><circle cx="${rx + 95}" cy="${y + h - 6}" r="16" fill="${SOFT}" stroke="${INK}" stroke-width="4"/>`;
  if (o.path) s += `<path d="M ${rx + 180} ${y + h - 60} C ${rx + 260} ${y + h - 140}, ${x - 160} ${y + h - 160}, ${x - 40} ${y + h - 90}" fill="none" stroke="${ACC}" stroke-width="4" stroke-dasharray="14 12" marker-end="url(#arrow)"/>`;
  return s;
}

// ---------- Robotic pool cleaner (side) ----------
function pool(o = {}) {
  const wall = o.wall;
  const edge = wall ? 1215 : 1400;
  let s = `<rect x="200" y="${wall ? 200 : 300}" width="${edge - 200}" height="${wall ? 560 : 600}" fill="#EAF2F6"/><line x1="200" y1="${wall ? 200 : 300}" x2="${edge}" y2="${wall ? 200 : 300}" stroke="#9DB7C6" stroke-width="3" stroke-dasharray="18 12"/>`;
  s += `<line x1="200" y1="760" x2="${edge}" y2="760" stroke="${INK}" stroke-width="5"/>`;
  if (wall) s += `<line x1="${edge}" y1="760" x2="${edge}" y2="150" stroke="${INK}" stroke-width="5"/>`;
  const g = wall ? `transform="translate(0 -200) rotate(-90 1040 590)"` : "";
  const x = wall ? 900 : 800, y = wall ? 600 : 600;
  s += `<g ${g}>`;
  s += `<rect x="${x - 230}" y="${y - 120}" width="460" height="190" rx="46" fill="${BODY}" stroke="${INK}" stroke-width="5"/>`;
  s += `<path d="M ${x - 120} ${y - 120} q 120 -90 240 0" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>`;
  s += `<rect x="${x - 100}" y="${y - 90}" width="200" height="90" rx="16" ${hl(o.basket)} stroke-width="4"/>`;
  for (let k = 0; k < 6; k++) s += `<line x1="${x - 80 + k * 32}" y1="${y - 78}" x2="${x - 80 + k * 32}" y2="${y - 14}" stroke="${o.basket ? ACC : LINE}" stroke-width="3"/>`;
  s += `<rect x="${x - 250}" y="${y + 60}" width="500" height="100" rx="50" ${hl(o.tracks)} stroke-width="5"/>`;
  for (let k = 0; k < 14; k++) s += `<line x1="${x - 220 + k * 34}" y1="${y + 64}" x2="${x - 220 + k * 34}" y2="${y + 156}" stroke="${o.tracks ? ACC : INK}" stroke-width="2" opacity=".5"/>`;
  s += `<circle cx="${x - 200}" cy="${y + 110}" r="40" fill="${BODY}" stroke="${o.tracks ? ACC : INK}" stroke-width="4"/><circle cx="${x + 200}" cy="${y + 110}" r="40" fill="${BODY}" stroke="${o.tracks ? ACC : INK}" stroke-width="4"/>`;
  s += `<rect x="${x + 214}" y="${y - 70}" width="36" height="110" rx="14" ${hl(o.brush)} stroke-width="4"/>`;
  s += `<circle cx="${x - 175}" cy="${y - 40}" r="14" ${hl(o.port)} stroke-width="3"/>`;
  s += `</g>`;
  if (o.debris) s += [[260, 720], [300, 740], [350, 712], [420, 742], [1260, 738], [1320, 716]].map(([a, b], i) => `<circle cx="${a}" cy="${b}" r="${7 + (i % 3) * 3}" fill="${MUTED}" opacity=".6"/>`).join("");
  if (o.climb) s += `<path d="M 860 620 L 860 260" stroke="${ACC}" stroke-width="5" stroke-dasharray="16 12" marker-end="url(#arrow)"/>`;
  if (o.charger) s += `<g><rect x="1180" y="140" width="150" height="100" rx="16" fill="${SOFT}" stroke="${INK}" stroke-width="4"/><path d="M 1180 200 C 1060 200, 900 300, 640 548" fill="none" stroke="${ACC}" stroke-width="6" stroke-linecap="round"/></g>`;
  return s;
}

// ---------- Robotic lawn mower (side) ----------
function mower(o = {}) {
  let s = `<path d="M 200 760 Q 600 ${o.slope ? 700 : 750} 1000 ${o.slope ? 690 : 755} T 1400 ${o.slope ? 600 : 750}" fill="none" stroke="${INK}" stroke-width="5"/>`;
  for (let k = 0; k < 40; k++) { const gx = 210 + k * 30; s += `<line x1="${gx}" y1="${760 - (o.slope && gx > 1000 ? (gx - 1000) * 0.35 : 0)}" x2="${gx + 6}" y2="${742 - (o.slope && gx > 1000 ? (gx - 1000) * 0.35 : 0)}" stroke="#7FA37A" stroke-width="3"/>`; }
  const x = 720, y = 560;
  s += `<path d="M ${x - 280} ${y + 120} C ${x - 270} ${y - 30}, ${x - 120} ${y - 110}, ${x + 40} ${y - 110} C ${x + 200} ${y - 110}, ${x + 290} ${y - 20}, ${x + 290} ${y + 120} Z" fill="${BODY}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  s += `<path d="M ${x - 280} ${y + 120} C ${x - 270} ${y - 30}, ${x - 120} ${y - 110}, ${x + 40} ${y - 110}" fill="none" stroke="${o.bumper ? ACC : INK}" stroke-width="${o.bumper ? 14 : 5}" stroke-linecap="round"/>`;
  s += `<rect x="${x - 40}" y="${y - 70}" width="140" height="44" rx="16" fill="${SOFT}" stroke="${INK}" stroke-width="4"/>`;
  s += `<circle cx="${x + 170}" cy="${y + 120}" r="78" ${hl(o.wheels)} stroke-width="6"/><circle cx="${x + 170}" cy="${y + 120}" r="30" fill="${BODY}" stroke="${o.wheels ? ACC : INK}" stroke-width="4"/>`;
  for (let k = 0; k < 12; k++) { const a = (k * 30 * Math.PI) / 180; s += `<line x1="${x + 170 + 62 * Math.cos(a)}" y1="${y + 120 + 62 * Math.sin(a)}" x2="${x + 170 + 78 * Math.cos(a)}" y2="${y + 120 + 78 * Math.sin(a)}" stroke="${o.wheels ? ACC : INK}" stroke-width="4"/>`; }
  s += `<circle cx="${x - 200}" cy="${y + 160}" r="36" fill="${SOFT}" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect x="${x - 270}" y="${y + 50}" width="40" height="22" rx="6" ${hl(o.contacts)} stroke-width="3"/>`;
  if (o.station) s += `<path d="M 200 760 L 200 560 Q 200 520 240 520 L 330 520" fill="none" stroke="${INK}" stroke-width="5"/><rect x="200" y="740" width="230" height="22" fill="${SOFT}" stroke="${INK}" stroke-width="4"/><rect x="300" y="610" width="34" height="60" rx="6" ${hl(true)} stroke-width="4"/>`;
  if (o.obstacle) s += `<path d="M 1080 700 q 40 -50 90 -20 q 40 25 80 -10" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><ellipse cx="1160" cy="730" rx="70" ry="22" fill="#D9D2C3" stroke="${INK}" stroke-width="4"/>`;
  return s;
}

// ---------- Walk-behind floor scrubber (side) ----------
function scrubber(o = {}) {
  let s = `<line x1="200" y1="780" x2="1400" y2="780" stroke="${INK}" stroke-width="5"/>`;
  // handle
  s += `<path d="M 1010 420 L 1150 200 L 1230 200" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="M 1010 420 L 1150 200 L 1230 200" fill="none" stroke="${BODY}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  // body: solution tank (lower) + recovery tank (upper)
  s += `<rect x="470" y="430" width="560" height="270" rx="40" ${hl(o.solution)} stroke-width="5"/>`;
  s += `<rect x="500" y="300" width="500" height="150" rx="34" ${hl(o.recovery)} stroke-width="5"/>`;
  s += `<rect x="560" y="330" width="120" height="30" rx="12" fill="${BODY}" stroke="${o.recovery ? ACC : INK}" stroke-width="3"/>`;
  if (o.solution) s += `<path d="M 560 650 l 0 55 m 30 -55 l 0 55 m 30 -55 l 0 55" stroke="${ACC}" stroke-width="4" stroke-linecap="round" stroke-dasharray="4 10"/>`;
  // brush deck front
  s += `<rect x="380" y="690" width="300" height="70" rx="30" fill="${SOFT}" stroke="${INK}" stroke-width="5"/>`;
  // wheel
  s += `<circle cx="900" cy="730" r="50" fill="${BODY}" stroke="${INK}" stroke-width="5"/><circle cx="900" cy="730" r="16" fill="${INK}"/>`;
  // squeegee rear + hose
  s += `<path d="M 1060 776 q 50 -10 90 -40" fill="none" stroke="${o.squeegee ? ACC : INK}" stroke-width="14" stroke-linecap="round"/>`;
  s += `<path d="M 1110 740 C 1150 640, 1090 520, 1000 400" fill="none" stroke="${o.squeegee ? ACC : INK}" stroke-width="10" stroke-linecap="round"/>`;
  return s;
}

const router = () => `<g><rect x="1170" y="300" width="180" height="70" rx="14" fill="${SOFT}" stroke="${INK}" stroke-width="4"/><line x1="1200" y1="300" x2="1190" y2="240" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><line x1="1320" y1="300" x2="1330" y2="240" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>${[60, 100, 140].map((r) => `<path d="M ${1260 - r} ${290 - r * 0.4} Q 1260 ${250 - r} ${1260 + r} ${290 - r * 0.4}" fill="none" stroke="${ACC}" stroke-width="4" stroke-dasharray="10 10"/>`).join("")}</g><g stroke="${ACC}" stroke-width="7" stroke-linecap="round"><line x1="1060" y1="380" x2="1100" y2="420"/><line x1="1100" y1="380" x2="1060" y2="420"/></g>`;
const drops = (x, y) => [0, 1, 2].map((i) => `<path d="M ${x + i * 46} ${y} q 16 26 0 40 q -16 -14 0 -40 z" fill="${ACC_SOFT}" stroke="${ACC}" stroke-width="3"/>`).join("");


// ---------- Corded canister vacuum (side) ----------
function canister(o = {}) {
  const x = o.x ?? 520, y = 640;
  let s = `<ellipse cx="${x}" cy="${y}" rx="170" ry="110" fill="${BODY}" stroke="${INK}" stroke-width="5"/>`;
  s += `<path d="M ${x - 150} ${y - 30} Q ${x} ${y - 150} ${x + 150} ${y - 30}" fill="none" stroke="${LINE}" stroke-width="3"/>`;
  s += `<circle cx="${x - 90}" cy="${y + 105}" r="34" fill="${SOFT}" stroke="${INK}" stroke-width="4"/><circle cx="${x + 90}" cy="${y + 105}" r="34" fill="${SOFT}" stroke="${INK}" stroke-width="4"/>`;
  s += `<path d="M ${x + 150} ${y - 40} C ${x + 300} ${y - 120}, ${x + 220} ${y - 330}, ${x + 120} ${y - 360}" fill="none" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M ${x + 150} ${y - 40} C ${x + 300} ${y - 120}, ${x + 220} ${y - 330}, ${x + 120} ${y - 360}" fill="none" stroke="${BODY}" stroke-width="9" stroke-linecap="round"/>`;
  s += `<line x1="${x + 120}" y1="${y - 360}" x2="${x + 240}" y2="${y + 160}" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><line x1="${x + 120}" y1="${y - 360}" x2="${x + 240}" y2="${y + 160}" stroke="${BODY}" stroke-width="6" stroke-linecap="round"/>`;
  s += `<rect x="${x + 150}" y="${y + 150}" width="200" height="50" rx="16" fill="${SOFT}" stroke="${INK}" stroke-width="4"/>`;
  s += `<path d="M ${x - 170} ${y} C ${x - 260} ${y + 20}, ${x - 300} ${y + 120}, ${x - 330} ${y + 200}" fill="none" stroke="${o.cord ? ACC : INK}" stroke-width="5"/><rect x="${x - 352}" y="${y + 196}" width="44" height="30" rx="5" ${hl(o.cord)} stroke-width="4"/>`;
  return s;
}

const fig = (x, y, label) => `<text x="${x}" y="${y}" font-family="${FONT}" font-size="24" font-weight="700" letter-spacing="2" fill="${MUTED}" text-anchor="middle">${label}</text>`;
const leaders = (items) => items.map(([x1, y1, x2, y2, n]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="2"/><text x="${x2 + (x2 > x1 ? 10 : -10)}" y="${y2 + 8}" font-family="${FONT}" font-size="24" font-weight="700" fill="${INK}" text-anchor="${x2 > x1 ? "start" : "end"}">${n}</text>`).join("");

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
  "dyson-fights-bosch-again": { kicker: "Company analysis", cat: "Cordless vacuums", draw: () => stick({ dx: -250, dy: 10, k: 0.8, angle: -14, motor: true }) + stick({ dx: 250, dy: 10, k: 0.8, angle: -14, flip: true, bin: true }) + `<text x="800" y="500" font-family="${FONT}" font-size="64" font-weight="800" fill="${ACC}" text-anchor="middle">VS</text>` + fig(540, 870, "FIG. 1") + fig(1060, 870, "FIG. 2"), co: null },
  "german-vacuum-brands-in-the-cordless-wave": { kicker: "Company analysis", cat: "Vacuum cleaners", draw: () => canister({ x: 470, cord: true }) + `<path d="M 860 500 L 980 500" stroke="${ACC}" stroke-width="6" marker-end="url(#arrow)"/>` + stick({ dx: 330, dy: -10, k: 0.88, angle: -10, battery: true }) + fig(560, 880, "FIG. 1  CORDED") + fig(1130, 880, "FIG. 2  CORDLESS"), co: null },
  "lawsuit-that-shaped-the-handheld-vacuum-industry": { kicker: "Patent dispute", cat: "Handheld vacuums", draw: () => stick({ handheld: true, angle: 0, dy: 150, bin: true }) + leaders([[770, 270, 520, 250, "10"], [850, 340, 1120, 280, "12"], [1010, 485, 1150, 470, "14"], [770, 470, 520, 470, "16"], [800, 640, 520, 680, "18"]]) + fig(800, 880, "FIG. 1"), co: null },
  "bissell-vs-tineco-patent-details": { kicker: "Patent dispute", cat: "Floor washers", draw: () => stick({ angle: 0, dy: 20, dock: true, brushroll: true }) + leaders([[800, 860, 1060, 800, "40"], [770, 830, 1060, 740, "32"], [800, 300, 1060, 300, "20"], [800, 200, 540, 180, "22"], [920, 340, 1060, 420, "24"]]) + "", co: null },
  "robot-vacuum-not-charging": { cat: "Robot vacuum", draw: () => dock({ contacts: true, robotX: 700 }), co: [882, 710, 380, 460, "Charging contacts"] },
  "robot-vacuum-not-returning-to-dock": { cat: "Robot vacuum", draw: () => dock({ beacon: true, path: true, robotX: 430 }), co: [1070, 631, 1240, 120, "Dock signal window"] },
  "robot-vacuum-self-empty-dock-not-working": { cat: "Robot vacuum", draw: () => dock({ bag: true, robotX: 560 }), co: [930, 300, 380, 300, "Dust bag and seal"] },
  "robot-vacuum-not-connecting-wifi": { cat: "Robot vacuum", draw: () => robotTop({ cx: 640, cy: 500, k: 0.95, lidar: true }) + router(), co: [690, 381, 380, 160, "Wi-Fi module"] },
  "robot-vacuum-not-dispensing-water": { cat: "Robot vacuum", draw: () => robotTop({ bin: true }) + drops(1000, 560), co: [940, 590, 1240, 720, "Water tank and outlets"] },
  "vacuum-cleaner-losing-suction": { cat: "Vacuum cleaner", draw: () => stick({ wand: true, bin: true }), co: [800, 560, 1180, 640, "Airflow path", true] },
  "robotic-pool-cleaner-not-charging": { cat: "Pool robot", draw: () => pool({ port: true, charger: true }), co: [625, 560, 380, 160, "Charging port"] },
  "robotic-pool-cleaner-not-climbing-walls": { cat: "Pool robot", draw: () => pool({ wall: true, tracks: true, climb: true }), co: [1160, 420, 1260, 120, "Tracks and grip"] },
  "robotic-pool-cleaner-not-moving": { cat: "Pool robot", draw: () => pool({ tracks: true }), co: [1000, 710, 1240, 840, "Drive tracks"] },
  "robotic-pool-cleaner-not-picking-up-debris": { cat: "Pool robot", draw: () => pool({ basket: true, brush: true, debris: true }), co: [800, 555, 1240, 160, "Filter basket and brush"] },
  "robot-lawn-mower-keeps-getting-stuck": { cat: "Robot mower", draw: () => mower({ wheels: true, obstacle: true, slope: true }), co: [890, 680, 1240, 160, "Drive wheels"] },
  "robot-lawn-mower-not-charging": { cat: "Robot mower", draw: () => mower({ contacts: true, station: true }), co: [470, 621, 600, 160, "Charging contacts"] },
  "floor-scrubber-not-dispensing-water": { cat: "Floor scrubber", draw: () => scrubber({ solution: true }), co: [750, 565, 380, 200, "Solution tank and valve"] },
  "floor-scrubber-not-picking-up-water": { cat: "Floor scrubber", draw: () => scrubber({ squeegee: true, recovery: true }), co: [1110, 760, 1240, 860, "Squeegee and hose"] },
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
  ${c.co ? callout(...c.co) : ""}
  ${tag(c.cat, c.kicker)}
</svg>`;
}

const [out, ...only] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
for (const slug of only.length ? only : Object.keys(COVERS)) {
  await sharp(Buffer.from(svgFor(slug))).png().toFile(path.join(out, `${slug}.png`));
  console.log(slug);
}
