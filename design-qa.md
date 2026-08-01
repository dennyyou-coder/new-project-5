# WCB Expo landing page design QA

## Evidence

- Source visual truth: `/Users/youdenny/.codex/generated_images/019fae42-8a7a-79b1-83d5-cf481dd8efa6/exec-3b67c8dc-91e2-4931-9201-cc8e68120bfd.png`
- Browser-rendered desktop implementation: `.superpowers/verification/wcb-expo-desktop-hero.png`
- Browser-rendered mobile implementation: `.superpowers/verification/wcb-expo-mobile-hero.png`
- Full-view section coverage: `.superpowers/verification/wcb-expo-mobile-categories.png` and `.superpowers/verification/wcb-expo-mobile-programs.png`
- Homepage entry evidence: `.superpowers/verification/home-wcb-expo-entry-desktop-v2.png` and `.superpowers/verification/home-wcb-expo-entry-mobile-v2.png`
- Focused visual comparison: `.superpowers/verification/wcb-expo-hero-comparison.png`

## Viewports and normalization

- Source visual: 748 x 2103 px. The source hero crop used for the focused comparison was 748 x 520 px.
- Desktop implementation: CSS viewport 1440 x 1000, screenshot 1440 x 1000 px, device scale factor 1.
- Mobile implementation: CSS viewport 390 x 844, screenshot 390 x 844 px, device scale factor 1.
- Focused comparison: the source hero crop and the browser implementation were each normalized to 720 x 500 px before side-by-side review.

## State

- Canonical route: `/wcb-expo`.
- Legacy `/world-clean-expo` route tested and permanently redirects to `/wcb-expo`.
- Desktop and mobile screenshots were captured after images had loaded.
- Homepage campaign entry was checked in its default state.
- The primary visitor CTA was tested with its Tally modal open.

## Full-view comparison evidence

The page was reviewed from hero through proof, seven product categories, supply-chain explanation, event programs, organizer section and final visitor/exhibitor CTAs. Because the approved in-app browser's stitched full-page capture repeated sections, the QA uses separate browser-rendered region captures rather than treating the faulty stitched image as evidence. The desktop hero, mobile hero, category region and program region together cover the complete visual system and the conversion path.

## Focused region comparison

The hero was the highest-risk fidelity region and received a dedicated side-by-side comparison in `.superpowers/verification/wcb-expo-hero-comparison.png`. It preserves the selected direction's dark exhibition atmosphere, oversized WCB identity, direct event facts and realistic cleaning-appliance lineup. The existing World Clean Biz site header was intentionally retained for product consistency.

## Primary interactions and technical checks

- `Plan Your Visit` opens the visitor-interest Tally modal.
- `Request Exhibitor Information` remains available as the secondary path.
- Homepage campaign CTA links to `/wcb-expo#visitor-interest`.
- Legacy route redirect was verified in the browser.
- Desktop width check: `scrollWidth === clientWidth === 1440`.
- Mobile width check: `scrollWidth === clientWidth === 390`.
- Browser console: no errors or warnings on the Expo page at desktop or mobile widths.
- Production build: passed, including 450 generated static pages.

## Findings

- No actionable P0, P1 or P2 visual, interaction, overflow or console findings remain.
- P3 follow-up: the externally managed Tally form still displays the older wording `World Clean Expo Updates`. The local landing page and tracking use `WCB Expo`; update the external form title before production release when access to that account is available.

## Comparison history

1. P1: the homepage campaign headline inherited a later homepage theme rule and rendered dark on the navy campaign background.
   - Fix: added a final, narrowly scoped `.home-v9-expo-campaign-copy` color override.
   - Post-fix evidence: `.superpowers/verification/home-wcb-expo-entry-desktop-v2.png` and `.superpowers/verification/home-wcb-expo-entry-mobile-v2.png`.
2. No other P0, P1 or P2 mismatch was found after desktop/mobile browser review and the focused hero comparison.

final result: passed
