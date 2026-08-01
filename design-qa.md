# WCB Expo landing page and homepage entry design QA

## WCB Expo landing page evidence

- Source visual truth: `/Users/youdenny/.codex/generated_images/019fae42-8a7a-79b1-83d5-cf481dd8efa6/exec-3b67c8dc-91e2-4931-9201-cc8e68120bfd.png`
- Browser-rendered desktop implementation: `.superpowers/verification/wcb-expo-desktop-hero.png`
- Browser-rendered mobile implementation: `.superpowers/verification/wcb-expo-mobile-hero.png`
- Full-view section coverage: `.superpowers/verification/wcb-expo-mobile-categories.png` and `.superpowers/verification/wcb-expo-mobile-programs.png`
- Homepage entry evidence: `.superpowers/verification/home-wcb-expo-entry-desktop-v2.png` and `.superpowers/verification/home-wcb-expo-entry-mobile-v2.png`
- Focused visual comparison: `.superpowers/verification/wcb-expo-hero-comparison.png`

### Viewports and normalization

- Source visual: 748 x 2103 px. The source hero crop used for the focused comparison was 748 x 520 px.
- Desktop implementation: CSS viewport 1440 x 1000, screenshot 1440 x 1000 px, device scale factor 1.
- Mobile implementation: CSS viewport 390 x 844, screenshot 390 x 844 px, device scale factor 1.
- Focused comparison: the source hero crop and the browser implementation were each normalized to 720 x 500 px before side-by-side review.

### State

- Canonical route: `/wcb-expo`.
- Legacy `/world-clean-expo` route tested and permanently redirects to `/wcb-expo`.
- Desktop and mobile screenshots were captured after images had loaded.
- Homepage campaign entry was checked in its default state.
- The primary visitor CTA was tested with its Tally modal open.

### Full-view comparison evidence

The page was reviewed from hero through proof, seven product categories, supply-chain explanation, event programs, organizer section and final visitor/exhibitor CTAs. Because the approved in-app browser's stitched full-page capture repeated sections, the QA uses separate browser-rendered region captures rather than treating the faulty stitched image as evidence. The desktop hero, mobile hero, category region and program region together cover the complete visual system and the conversion path.

### Focused region comparison

The hero was the highest-risk fidelity region and received a dedicated side-by-side comparison in `.superpowers/verification/wcb-expo-hero-comparison.png`. It preserves the selected direction's dark exhibition atmosphere, oversized WCB identity, direct event facts and realistic cleaning-appliance lineup. The existing World Clean Biz site header was intentionally retained for product consistency.

### Primary interactions and technical checks

- `Plan Your Visit` opens the visitor-interest Tally modal.
- `Request Exhibitor Information` remains available as the secondary path.
- Homepage campaign CTA links to `/wcb-expo#visitor-interest`.
- Legacy route redirect was verified in the browser.
- Desktop width check: `scrollWidth === clientWidth === 1440`.
- Mobile width check: `scrollWidth === clientWidth === 390`.
- Browser console: no errors or warnings on the Expo page at desktop or mobile widths.
- Production build: passed, including 450 generated static pages.

### Findings

- No actionable P0, P1 or P2 visual, interaction, overflow or console findings remain.
- P3 follow-up: the externally managed Tally form still displays the older wording `World Clean Expo Updates`. The local landing page and tracking use `WCB Expo`; update the external form title before production release when access to that account is available.

### Comparison history

1. P1: the homepage campaign headline inherited a later homepage theme rule and rendered dark on the navy campaign background.
   - Fix: added a final, narrowly scoped `.home-v9-expo-campaign-copy` color override.
   - Post-fix evidence: `.superpowers/verification/home-wcb-expo-entry-desktop-v2.png` and `.superpowers/verification/home-wcb-expo-entry-mobile-v2.png`.
2. No other P0, P1 or P2 mismatch was found after desktop/mobile browser review and the focused hero comparison.

## Homepage Expo color separation addendum

### Evidence

- Source visual truth: `.superpowers/verification/home-wcb-expo-invitation-desktop.png`
  - This previous homepage capture identifies the dark-on-dark section collision.
  - Target changes are defined in `docs/superpowers/specs/2026-08-01-homepage-expo-color-separation-design.md`.
- Desktop implementation: `.superpowers/verification/home-expo-light-desktop.png`
- Mobile implementation: `.superpowers/verification/home-expo-light-mobile.png`
- Desktop viewport and pixels: 1440×1000 CSS px, 1440×1000 screenshot px, device scale factor 1.
- Mobile viewport and pixels: 390×844 CSS px, 390×844 screenshot px, device scale factor 1.
- State: homepage Expo invitation in its default state; no modal or menu open.

### Full-view comparison

The previous source capture and the desktop implementation were opened together. The source shows the dark navy hero flowing directly into another dark navy Expo banner, which weakened hierarchy. The implementation deliberately changes this relationship: the invitation now occupies a pale icy-blue zone with a white two-column card, followed by the white product-category section.

The intended change is visible:

- the dark hero has a clear visual endpoint;
- the Expo invitation reads as a separate campaign;
- copy and event facts remain on the left;
- the Expo visual has a dedicated right-hand media region;
- the category section returns to the normal white page surface.

### Focused region comparison and required fidelity surfaces

- **Fonts and typography:** Existing homepage type is preserved. The desktop heading leads the card without competing with the homepage H1. Mobile wrapping remains readable without clipped or isolated overflow words.
- **Spacing and layout rhythm:** Desktop uses a balanced two-column composition and a 64px pale-blue section frame. Mobile stacks content above the image, preserves facts and CTA, and uses consistent 24px inner padding.
- **Colors and visual tokens:** The final background is `#eef5ff`; the card is white; headings use deep navy; status and CTA use WCB blue; supporting copy uses slate.
- **Image quality and asset fidelity:** The existing WCB Expo raster visual loads at natural resolution and uses `object-fit: cover` without stretching. No placeholder or code-drawn substitute was introduced.
- **Copy and content:** Event status, invitation headline, official event name, date, venue, and `Plan Your Visit` CTA are unchanged.

### Responsive, interaction, and runtime checks

- Desktop grid tracks rendered at approximately 683px / 495px inside the 1180px card.
- Desktop image rendered at approximately 495×578px and loaded successfully.
- Mobile grid rendered as one 348px column; content appears above the image.
- Mobile CTA fills the 300px content area.
- At 390px, `scrollWidth` equals `clientWidth` (390px), so there is no horizontal overflow.
- The homepage CTA was activated and navigated to `/wcb-expo#visitor-interest`.
- The internal Expo page retained its `.wcb-expo-hero` and `#visitor-interest` sections.
- Browser console warnings/errors: none on the homepage or internal Expo page.

### Comparison history

1. P1: adjacent dark regions weakened hierarchy and visually buried the invitation.
   - Fix: replaced the dark banner with a pale-blue section and white two-column card, converted the Expo visual to a semantic image region, moved the CTA into the content column, and added the responsive stacked layout.
   - Post-fix evidence: `.superpowers/verification/home-expo-light-desktop.png` and `.superpowers/verification/home-expo-light-mobile.png`.
2. No actionable P0, P1, or P2 findings remain after the post-fix desktop/mobile review.

### Follow-up polish

A future content iteration could shorten the mobile explanatory paragraph, but the current copy is readable and was intentionally preserved.

final result: passed
