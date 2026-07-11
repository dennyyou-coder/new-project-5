# World Clean Biz Site Visual Refresh — Phase 1 Design

## Goal

Raise the perceived quality of World Clean Biz by rebuilding the non-article image system around authentic industry access, disciplined art direction, and consistent image treatment.

Phase 1 covers the homepage and About page. It establishes the visual standard that will later be applied to Sourcing, Contact, Reports, and World Clean Expo.

## Scope

### Included

- Homepage non-article imagery
- About page imagery
- Image selection, replacement, crop, grading, compression, and responsive presentation needed for those two pages
- A small number of new generated or licensed visuals where suitable real photography is unavailable
- Image-related CSS adjustments required to preserve composition on desktop and mobile
- Metadata image references for the homepage and About page when their current image is replaced

### Excluded

- Blog article body images
- Blog article cover images and editorial cards sourced from articles
- Page copy, information architecture, navigation, forms, tracking, and business logic
- Sourcing, Contact, Reports, and World Clean Expo image replacement in this phase
- Unrelated redesign or component refactoring

## Approved Visual Direction

The primary direction is **Premium Industrial Editorial**, supported by a restrained amount of **Cinematic Technology**.

The site should look like an industry intelligence and business-access platform with real operating experience. It should not resemble a generic corporate stock-photo site, a consumer electronics advertisement, or an AI-generated concept gallery.

### Visual characteristics

- Authentic factories, exhibitions, products, forums, supplier meetings, and industry professionals
- Strong geometry and uncluttered compositions
- Controlled navy, steel grey, cool white, and neutral material tones
- Natural skin, product, and material texture
- Moderate contrast with clean highlights and readable shadow detail
- Cinematic close product or technology details only where they add polish
- Consistent horizon, perspective, crop logic, and visual density across image groups

### Avoid

- Over-saturated colors and heavy gradients
- Obvious AI artifacts or plastic-looking surfaces
- Generic handshake, call-center, or anonymous office-team imagery
- Low-resolution screenshots or noisy exhibition photos without a clear subject
- Mixed illustration, product-render, documentary, and lifestyle styles within one section
- Reusing one image to represent several unrelated business messages
- Distorted aspect ratios, accidental head crops, or inconsistent subject scale

## Asset Strategy

Use a hybrid sourcing model in this order:

1. **Real World Clean Biz photography** for Denny, forums, exhibitions, supplier meetings, and other trust evidence.
2. **Carefully selected licensed or reusable photography** for product and technology scenes when an authentic owned image is not suitable.
3. **AI-generated imagery only to fill genuine gaps**, mainly controlled product, technology, or abstract commercial scenes. Generated images must be checked for physical plausibility, brand confusion, malformed products, false event claims, and visible AI artifacts.

Every retained real image must earn its place through subject relevance, resolution, composition, and consistency. Existing assets are not preserved by default.

## Homepage Image System

### Hero product categories

Keep the existing six-category concept and layout. Rebuild the six images as one coherent visual family:

- Robot vacuums
- Floor washers
- Pool robots
- Robotic lawn mowers
- Commercial cleaning equipment
- Emerging cleaning categories

All six should share comparable camera height, product scale, lighting quality, background cleanliness, and color treatment. Products must remain believable and category-specific. Avoid visible third-party logos when possible.

### Core category section

The same category family may reuse the approved six master images when the crop and size differ. This is intentional system reuse, not arbitrary repetition.

### Three business pathways

Use three clearly different editorial scenes:

- Market Intelligence: product, market, or analytical observation
- Product & Sourcing: product evaluation, supplier access, or supply-chain work
- World Clean Expo: credible exhibition scale and industry connection

Each scene should communicate its business purpose without relying on the caption.

### Denny and trust section

Use authentic Denny and industry-network photography. Preserve documentary credibility while improving crop, color, clarity, and visual hierarchy. Do not turn Denny into an artificial studio portrait.

The three testimonial portraits are retained unless a replacement set is clearly superior and visually consistent. They must not be mixed with event photography or generated identities.

### Editorial article cards

Article-derived cover images remain unchanged in Phase 1 because article imagery is excluded.

## About Page Image System

### Hero

Use a strong authentic image of Denny in a relevant industry environment. The image must support his role as founder, organizer, entrepreneur, and industry connector. It should allow safe desktop and mobile crops without cutting the head, hands, or primary context.

### Industry proof

Use distinct scenes for:

- Speaking and analysis
- Product and supplier work
- Expo and business connections

Avoid using the same supplier-meeting photograph for multiple claims.

### Network and execution sections

Favor wider compositions with visible context and credible interaction. The image should show the environment and relationships, not just anonymous people standing together.

## Image Production Rules

- Prepare source masters before export; do not stretch images with CSS.
- Export web images at an appropriate pixel size for their maximum rendered width and high-density displays.
- Prefer WebP or AVIF for photographic assets when the project pipeline supports them; retain PNG only when transparency is necessary.
- Use consistent aspect-ratio families per component rather than one crop for every context.
- Preserve focal points through explicit `object-position` rules only when needed.
- Compress files without visible banding, smearing, or loss of facial detail.
- Use descriptive English filenames and alt text.
- Do not introduce external runtime image dependencies; production assets must be stored locally in the project.

## Implementation Boundaries

The first implementation should change only:

- Homepage and About page image references when replacements are needed
- New or replaced assets under a dedicated non-article image location
- Image-specific styles required for crop and responsive behavior
- Tests that verify approved image references, page structure preservation, and absence of old rejected assets

The current copy, conversion flow, components, and page structure remain unchanged unless an image cannot be presented correctly without a small, isolated image-container adjustment.

## Validation

Phase 1 is ready for review when:

- Homepage and About page load without broken images
- All replaced images are local production assets
- No article image or article content has changed
- Existing homepage, About, and identity consistency tests pass
- Full Next.js production build passes
- `git diff --check` passes
- Desktop and mobile browser checks show no stretching, unintended cropping, overflow, or layout regression
- Browser console shows no new errors
- The image family visibly follows the approved industrial-editorial direction
- A Vercel Preview is available for one concentrated visual review before any merge to `main`

## Delivery Sequence

1. Audit all homepage and About image slots and rank existing assets as retain, reprocess, or replace.
2. Assemble a small candidate board for the key visual families.
3. Produce and optimize the approved asset set.
4. Wire assets into the existing pages with minimal image-container adjustments.
5. Run automated and browser validation.
6. Push the feature branch and provide one Vercel Preview for visual approval.
7. Do not merge to `main` until the user explicitly approves publication.

