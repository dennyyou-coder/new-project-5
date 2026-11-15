"""Render WCB topic cards (1600x900 PNG) with headless Chrome.
Usage: python3 scripts/news-topic-cards/render.py <repo-root> <out-dir> <cards.json>
Each card: slug, kicker, title, detail, icon, logos (brand slugs). Optional layout "logo": large company logo on the left (trimmed logo.webp, or logoFiles paths), text on the right.
Copy each PNG to ~/Desktop/WorldCleanBizAssets/<slug>/01-cover.png with kind "chart", then run prepare:article-images.
See docs/operations/wcb-news-image-rules.md."""

import json, sys, os, subprocess, html
REPO = sys.argv[1]; OUT = sys.argv[2]
LOGO_FULL = {"husqvarna", "groupe-seb", "tennant"}
ICONS = {
 "person": '<circle cx="60" cy="40" r="20"/><path d="M22 104c4-22 20-34 38-34s34 12 38 34"/>',
 "gavel": '<path d="M44 30l28-16 14 24-28 16z"/><path d="M58 46l-36 40"/><path d="M68 96h40"/><path d="M76 86h24"/>',
 "scales": '<path d="M60 16v84"/><path d="M36 100h48"/><path d="M24 34h72"/><path d="M24 34l-14 30h28z"/><path d="M96 34l-14 30h28z"/>',
 "chart": '<path d="M16 104h88"/><rect x="26" y="62" width="14" height="34"/><rect x="53" y="40" width="14" height="56"/><rect x="80" y="24" width="14" height="72"/>',
 "decline": '<path d="M16 104h88"/><path d="M20 30l28 26 18-14 38 40"/><path d="M90 82h14V68"/>',
 "factory": '<path d="M14 104V56l26 16V56l26 16V36h16v-14h12v82z"/><path d="M14 104h90"/>',
 "coins": '<ellipse cx="60" cy="34" rx="34" ry="12"/><path d="M26 34v18c0 7 15 12 34 12s34-5 34-12V34"/><path d="M26 52v18c0 7 15 12 34 12s34-5 34-12V52"/><path d="M26 70v18c0 7 15 12 34 12s34-5 34-12V70"/>',
 "product": '<rect x="20" y="30" width="80" height="60" rx="10"/><circle cx="60" cy="60" r="16"/><path d="M34 90v10M86 90v10"/>',
 "warning": '<path d="M60 16l48 86H12z"/><path d="M60 48v26"/><circle cx="60" cy="86" r="2"/>',
 "deal": '<circle cx="44" cy="60" r="28"/><circle cx="76" cy="60" r="28"/>',
 "event": '<rect x="18" y="24" width="84" height="78" rx="8"/><path d="M18 46h84M40 14v20M80 14v20"/><path d="M48 70l8 8 18-18"/>',
 "listing": '<path d="M14 44l46-28 46 28z"/><path d="M24 50v40M48 50v40M72 50v40M96 50v40"/><path d="M14 98h92"/>',
}
def trimmed_logo(path, out_dir):
  """Trim transparent or white margins so the logo fills its box."""
  from PIL import Image, ImageChops
  if path.endswith(".svg"): return path
  os.makedirs(os.path.join(out_dir, "_logos"), exist_ok=True)
  dest = os.path.join(out_dir, "_logos", os.path.basename(os.path.dirname(path)) + ".png")
  im = Image.open(path).convert("RGBA")
  bg = Image.new("RGBA", im.size, (255, 255, 255, 0)); flat = Image.new("RGB", im.size, (255, 255, 255)); flat.paste(im, mask=im.split()[3])
  mask = ImageChops.difference(flat, Image.new("RGB", im.size, (255, 255, 255))).convert("L").point(lambda v: 255 if v > 14 else 0)
  box = mask.getbbox() or (0, 0) + im.size
  im.crop(box).save(dest); return dest

def logo_page(c):
  files = [f if f.startswith("/") else os.path.join(REPO, f) for f in c.get("logoFiles", [])] or [trimmed_logo(f"{REPO}/public/images/brands/{b}/logo.webp", OUT) for b in c.get("logos", [])]
  stack = len(files) > 1
  imgs = "".join(f'<img src="file://{f}">' for f in files)
  return f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=IBM+Plex+Mono:wght@500&family=Manrope:wght@500&display=block" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0}}
html,body{{width:1600px;height:900px;background:#fff;overflow:hidden}}
.card{{display:grid;grid-template-columns:1000px 600px;width:1600px;height:900px;border-top:14px solid #1F57E0}}
.logo-side{{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:70px;padding:90px 110px;background:#fff}}
.logo-side img{{width:{620 if stack else 760}px;height:{210 if stack else 400}px;object-fit:contain}}
.text-side{{display:flex;flex-direction:column;padding:84px 64px 64px;background:#F3F7FC;border-left:2px solid #DDE5EF}}
.kicker{{font:500 26px "IBM Plex Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:#1F57E0}}
h1{{margin-top:34px;font:800 74px/1.04 Archivo,Arial,sans-serif;letter-spacing:-.025em;color:#0B2140}}
.detail{{margin-top:28px;font:500 30px/1.4 Manrope,Arial,sans-serif;color:#41566E}}
.brand{{margin-top:auto;font:500 22px "IBM Plex Mono",monospace;letter-spacing:.14em;color:#52677D}}
</style></head><body><div class="card">
<div class="logo-side">{imgs}</div>
<div class="text-side"><div class="kicker">{html.escape(c["kicker"])}</div><h1>{html.escape(c["title"])}</h1><div class="detail">{html.escape(c["detail"])}</div><div class="brand">WORLD CLEAN BIZ</div></div>
</div></body></html>'''

cards = json.load(open(sys.argv[3]))
for c in cards:
  logos = "".join(f'<span class="logo"><img src="file://{REPO}/public/images/brands/{b}/{"logo.webp" if b in LOGO_FULL else "logo-tile.webp"}"></span>' for b in c.get("logos", []))
  page = f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=IBM+Plex+Mono:wght@500&family=Manrope:wght@500&display=block" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0}}
html,body{{width:1600px;height:900px;background:#F3F7FC;overflow:hidden}}
.card{{position:relative;width:1600px;height:900px;padding:92px 100px 84px;display:flex;flex-direction:column;border-top:14px solid #1F57E0}}
.kicker{{font:500 30px "IBM Plex Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:#1F57E0}}
h1.long{{font-size:100px}}
h1{{margin-top:44px;max-width:1010px;font:800 124px/1.02 Archivo,Arial,sans-serif;letter-spacing:-.03em;color:#0B2140}}
.detail{{margin-top:34px;max-width:980px;font:500 40px/1.35 Manrope,Arial,sans-serif;color:#41566E}}
.foot{{margin-top:auto;display:flex;align-items:center;justify-content:space-between}}
.logos{{display:flex;gap:18px}}
.logo{{display:grid;place-items:center;width:210px;height:92px;background:#fff;border:2px solid #DDE5EF;border-radius:14px}}
.logo img{{max-width:164px;max-height:56px;width:auto;height:auto;object-fit:contain}}
.brand{{font:500 24px "IBM Plex Mono",monospace;letter-spacing:.14em;color:#52677D}}
.icon{{position:absolute;right:100px;top:200px;width:330px;height:330px;border-radius:50%;background:#fff;border:2px solid #DDE5EF;display:grid;place-items:center}}
.icon svg{{width:190px;height:190px;fill:none;stroke:#1F57E0;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}}
</style></head><body><div class="card">
<div class="kicker">{html.escape(c["kicker"])}</div>
<h1 class="{"long" if len(c["title"])>24 else ""}">{html.escape(c["title"])}</h1>
<div class="detail">{html.escape(c["detail"])}</div>
<div class="foot"><div class="logos">{logos}</div><div class="brand">WORLD CLEAN BIZ</div></div>
<div class="icon"><svg viewBox="0 0 120 120">{ICONS[c["icon"]]}</svg></div>
</div></body></html>'''
  if c.get("layout") == "logo": page = logo_page(c)
  hp = os.path.join(OUT, c["slug"] + ".html"); open(hp, "w").write(page)
  png = os.path.join(OUT, c["slug"] + ".png")
  subprocess.run(["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome","--headless=new","--disable-gpu","--hide-scrollbars","--allow-file-access-from-files","--virtual-time-budget=8000","--window-size=1600,900",f"--screenshot={png}","file://"+hp], capture_output=True)
  print(c["slug"], os.path.exists(png))
