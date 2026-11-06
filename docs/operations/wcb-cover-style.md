# WCB Cover and Site Image Style

How World Clean Biz chooses and makes images, so the site reads as one publication rather than a set of generated renders. Publishing mechanics (source folders, `prepare:article-images`, verification) stay in `wcb-article-image-publishing.md`; this file covers what goes into the picture.

## Source priority

Use the first source that can carry the message:

1. **Our own photography.** Exhibition, forum and supplier-visit photos under `/images/articles/about-denny-*` and `/images/industry/`. Use these first on commercial pages (sourcing, reports, expo, contact), so those pages never borrow brand imagery.
2. **Official brand or company images.** Use press-kit and newsroom images, archival portraits and product photos, with a visible credit ("Photo: Brand") when they appear outside the article that cites them. Record the source URL in the article's visual manifest.
3. **Charts and diagrams drawn from real data.** Draw these in code, never with an image model.
4. **Code-drawn editorial covers.** For example, the diagnostic-guide line drawings in `scripts/diagnostic-covers.mjs`.
5. **Generated imagery.** Use it only as a last resort, and only as an edit of real source images: crop, juxtapose or extend them, with the provenance written down. Never generate people, products, factories or events that did not exist.

## Never use

- Neon glows, light trails, holograms, floating UI, "AI" lettering, or dark cinematic product renders.
- Unbranded "concept" products presented as if they were real models.
- Generated people. This includes executives, buyers, inspectors and homeowners.
- Article titles or headline text baked into the cover. The page already shows the title, and baked-in text gets cut off in square and 4:3 crops.
- One image reused as the cover of more than one article.

## Cover rules

- The original is `1600 × 900` (16:9).
- Keep the subject and any label inside the central 4:3 safe area (x 200–1400). Category pages and cards crop to 4:3 or 3:2.
- Keep one subject and one message. If the cover needs a caption to make sense, it is the wrong cover.
- Light, neutral backgrounds are preferred. Use one accent colour (`#E4572E`) for the thing the article is about.

## Templates by article type

| Type | Cover |
|---|---|
| News | Official photo of the product, site or person named in the story, credited. |
| Company story / history | Archival or official portrait or product photo. A juxtaposition of two official photos is acceptable when it is labelled. |
| Results / markets | Chart drawn from the reported figures, or an official photo of the company's product or site. |
| Diagnostic / how-to guide | Code-drawn manual style: product line drawing, suspect part in orange, one component label, small "Diagnostic guide · Category" tag. |
| Buyer / sourcing guide | Our own exhibition photo or a set of official product photos. |

## Diagnostic covers

`scripts/diagnostic-covers.mjs` draws the robot vacuum (underside, top and floor plan) and cordless stick vacuum covers.

1. Add an entry to `COVERS` with the category, the part to highlight, and the callout.
2. Render the cover to a scratch folder:

   ```bash
   node scripts/diagnostic-covers.mjs /tmp/covers {slug}
   ```

3. Review the PNG.
4. Back up the old `01-cover` outside the source library.
5. Copy the new PNG in as `01-cover.png`.
6. Remove the published `01-cover.webp` and `01-cover-800.webp` for that slug. This is the "review the existing destination" step that the preparation guard asks for.
7. Run `npm run prepare:article-images -- --slug {slug}`, then `npm run verify:article-images`.

Pool robots, lawn mowers and floor scrubbers do not have drawings yet. Add them in the same style before converting those guides.
