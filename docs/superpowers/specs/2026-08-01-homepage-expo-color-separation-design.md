# Homepage Expo Color Separation Design

## Goal

Make the homepage WCB Expo invitation visually distinct from the dark homepage hero, while keeping the invitation direct, premium, and easy to scan. The internal `/wcb-expo` landing page is outside this change.

## Scope

- Update only the homepage Expo invitation section in `app/page.tsx` and its related styles.
- Preserve the approved event name, date, venue, invitation message, destination link, and existing Expo visual asset.
- Do not change the `/wcb-expo` page, global navigation, or other homepage sections.

## Visual Direction

The page rhythm becomes:

1. dark navy homepage hero;
2. pale icy-blue Expo invitation zone;
3. white product-category content.

The Expo section uses a pale blue outer background (`#eef5ff`) and a white two-column surface with a thin blue-grey border and restrained shadow. This creates clear separation without introducing a new visual language.

### Desktop layout

- Use a two-column card with an approximately 58/42 content-to-image ratio.
- Left column order:
  1. compact `WCB 2026` event mark;
  2. preparation-status label;
  3. invitation headline;
  4. one short explanatory paragraph;
  5. date and venue facts;
  6. `Plan Your Visit` primary action.
- Right column uses the existing `/images/expo/wcb-expo-2026-hero.png` as a real image element rather than a full-section background.
- The image fills its media area with `object-fit: cover`, rounded only on the outer side of the card.

### Color and typography

- Section background: `#eef5ff`.
- Card background: `#ffffff`.
- Heading and event mark: deep navy (`#082a52`).
- Status and action accent: WCB blue (`#2f6bff`).
- Supporting copy: muted slate (`#52677d`).
- Border: `#d6e3f3`.
- Keep the existing homepage type family and button treatment.

## Responsive behavior

- At tablet/mobile widths, stack the content above the image.
- Keep the full invitation copy visible; do not hide event facts.
- Make the primary action full width on narrow screens.
- Use a mobile headline size around 32–36px and avoid awkward single-word lines.
- The image spans the card width below the content and retains a useful landscape crop.
- No horizontal overflow at 390px.

## Accessibility and semantics

- Keep the section heading as an `h2` and preserve `aria-labelledby`.
- Render the Expo visual with descriptive alt text that identifies it as a WCB Expo visual, not documentary photography of the future 2026 event.
- Keep the CTA as a normal link to `/wcb-expo#visitor-interest`.
- Maintain readable contrast for all text and controls.

## Verification

- Update the focused homepage structure test to cover the content/media wrapper and image asset.
- Run the focused test and `npm run build`.
- Inspect the homepage at desktop and 390px mobile widths.
- Confirm section separation, image crop, CTA visibility, no horizontal overflow, and no browser console errors.
- Confirm the `/wcb-expo` page is unchanged.

## Non-goals

- No production deployment in this design step.
- No redesign of the homepage hero or category section.
- No edits to the internal WCB Expo landing page.
- No new event claims, statistics, sponsors, or exhibitor information.
