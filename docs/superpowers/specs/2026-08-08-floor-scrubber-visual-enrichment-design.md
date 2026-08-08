# Floor Scrubber Technical Profile Visual Enrichment Design

**Date:** 2026-08-08  
**Status:** Approved direction; awaiting written-spec review  
**Scope:** `/equipment/floor-scrubber` only

## Objective

Add a small number of evidence-bearing visuals to improve comprehension and pacing without turning the technical profile into a brand showcase. The page remains an independent category reference and must not imply product ranking, recommendation, ownership, OEM relationships, or universal compatibility.

## Selected Approach

Use two official real-world product/application photographs and one original WCB technical diagram:

1. **Equipment types:** Hako Scrubmaster B35/B50 official image.
2. **Application fit:** TASKI ULTIMAXX official healthcare-use image.
3. **Component stack:** original WCB component-verification diagram.

This balanced approach is preferred over a photography-heavy gallery, which would feel promotional, and over an all-diagram treatment, which would reduce real-world context.

## Placement and Meaning

### Equipment Types Visual

- Place after the taxonomy introduction and before the type cards.
- Use the official Hako Scrubmaster B35/B50 image already verified in the repository.
- Caption it as an example of a walk-behind format only.
- State that the image does not define the whole category or constitute a product recommendation.
- Official source: `https://www.hako.com/fileadmin/user_upload/Scrubmaster/Scrubmaster_B35_B50/b35_b50_Header4.webp`.

### Application-Fit Visual

- Place after the application-fit introduction and before the assessment cards.
- Use the official TASKI ULTIMAXX healthcare-corridor image already verified in the repository.
- The accompanying copy should direct attention to aisle width, occupied-space operation, noise, recovery quality, floor compatibility, and site trials.
- Do not claim that one photographed model is suitable for every healthcare site.
- Official source: `https://taski.com/wp-content/uploads/2025/02/TASKI-ULTIMAXX-1900-Healthcare-1-1-scaled-1.jpg`.

### Component Verification Diagram

- Place after the component-stack introduction and before the component cards.
- Create an original, evidence-grounded vector diagram using the existing page visual language.
- Show four verification zones: cleaning deck/consumable interface, squeegee and recovery path, solution/recovery tanks, and battery/charger configuration.
- The central message must be: component family names do not establish cross-model compatibility.
- Include practical identifiers to check: model, serial range, part number, dimensions/interface, approved chemistry/material, electrical configuration, and current manual.
- Avoid copied manufacturer diagrams, exact proprietary machine geometry, unsupported internal layouts, and third-party logos.

## Asset Handling and Provenance

- Copy the two approved official photographs into `/public/images/equipment/floor-scrubber/` so the equipment page does not depend on brand-page asset paths.
- Preserve the existing WebP files without generative alteration.
- Store the original diagram in the same equipment asset folder.
- Record source URL, alt text, caption, placement, and visual type in the equipment profile data instead of hard-coding provenance only in JSX.
- Every photograph caption must identify it as a representative official image, not category-wide evidence.

## Layout

- Each visual uses the same border, radius, caption, source-link, and background treatment.
- Desktop: visual and explanation may use a balanced split layout where space permits; neither column may create a large empty area.
- At 840px and below: stack to one column.
- At 390px: images fill the content width, captions wrap naturally, and no horizontal scrolling is allowed.
- Maintain the current compact section spacing; do not add full-bleed galleries or decorative carousels.

## Content and Accessibility

- Alt text describes the visible machine or scenario without marketing adjectives.
- Captions explain why the visual matters to a buyer.
- Source links use descriptive labels such as `Official image source`.
- The original diagram must remain understandable without relying on color alone and must have a concise textual caption.

## Validation

- Extend the equipment data contract and tests for exactly three content visuals on this pilot page.
- Validate local paths, HTTPS source URLs, supported placements, alt text, captions, and image existence.
- Confirm the two official image files decode successfully and the diagram renders.
- Run `npm run test:equipment`, `npm run test:brands`, and `npm run build`.
- Inspect desktop and 390px layouts for broken images, empty layout regions, alignment, overflow, caption wrapping, and console errors.
- Update the existing Vercel Preview only; do not merge to `main` or publish production in this step.

## Out of Scope

- Additional brands, rankings, comparison scores, ownership articles, parts pages, repair instructions, and production deployment.
- New claims about manufacturer, factory, OEM, supplier, or universal component compatibility.
