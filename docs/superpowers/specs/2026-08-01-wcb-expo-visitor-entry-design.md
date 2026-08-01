# WCB Expo Visitor-Focused Homepage Entry and Event Rebrand

## Goal

Give the 2026 event a clear, current identity and make the homepage entry primarily persuade professional visitors to attend. Exhibitor recruitment remains available on the event page, but it must not dominate the homepage campaign message while visitor travel intent is the more realistic conversion.

## Naming Contract

- Navigation label: `WCB Expo`
- English event name: `2026 WCB International Cleaning Appliance Expo`
- Chinese event name: `2026 WCB 国际清洁电器博览会`
- Current public-facing interface copy must not use `World Clean Expo` as the event name.
- Historical article titles, quotations and archive records may retain their original wording when changing it would alter the historical record.
- Organizer identity copy uses `Organizer, WCB Expo` where it describes the current event.

## Route and SEO

- The event's canonical route becomes `/wcb-expo`.
- `/world-clean-expo` becomes a permanent redirect to `/wcb-expo` so existing bookmarks, backlinks and search signals remain useful.
- Header, footer, homepage, current calls to action, contact pathways, sitemap and relevant metadata link to `/wcb-expo` directly.
- The canonical URL, Open Graph URL and social metadata use `/wcb-expo` and the confirmed English event name.
- The event page remains indexable. The redirecting legacy URL is removed from the sitemap.

## Homepage Campaign Entry

Add one compact event strip immediately below the main header and above the homepage hero. It is a homepage-only campaign entry, not a second navigation bar.

The content hierarchy is:

1. Status: `Visitor Registration Opening Soon`
2. Promise: `See the Next Generation of Cleaning Appliances`
3. Event identity: `2026 WCB International Cleaning Appliance Expo`
4. Event details: `18–20 November 2026 · Suzhou, China`
5. Primary action: `Plan Your Visit`
6. Secondary action: `Explore WCB Expo`

Both actions lead to the event page. `Plan Your Visit` targets the visitor-interest section; `Explore WCB Expo` opens the top of the page. The strip does not contain an exhibitor application button.

The existing lower homepage event pathway remains, but its copy and links are updated to the new name and visitor-led purpose. The lower conversion section also changes from a general participation prompt to a visit-planning prompt. Exhibitor recruitment must not be duplicated as a prominent homepage action.

## Event Page Information Hierarchy

The event page leads with visitor value:

- discover new cleaning appliances and emerging categories;
- compare brands, manufacturers and solution providers in one setting;
- understand product, technology and market direction;
- meet suppliers, buyers, distributors and other industry professionals.

The hero uses the confirmed full English name, date and Suzhou location. Its primary action is `Plan Your Visit`, linking to `#visitor-interest`. The visitor section then offers `Register Visitor Interest` through the existing Expo inquiry form. The exhibitor action remains visible as a secondary option for qualified companies.

The page keeps its existing real exhibition-hall photography and useful category visuals. It does not introduce unverified attendance, exhibitor, floor-area or international-reach claims. Existing event details are retained only where the project already treats them as confirmed.

The visitor section receives a stable anchor, `#visitor-interest`, for homepage deep links. Visitor and exhibitor forms retain separate intent values and analytics labels.

## Conversion and Tracking

- Add a distinct homepage campaign location such as `home_wcb_expo_strip_visit` for the visitor-focused primary action.
- Preserve separate `expo_visitor` and `expo_exhibitor` inquiry types.
- Keep the existing Tally form integration and lead-event behavior.
- The homepage campaign must not claim that visitor registration is open until a live registration route exists. Before then, the action records visitor interest or takes readers to visit-planning content.

## Visual Treatment

- Implement the user-selected direction 1: a premium dark-navy expo campaign with realistic exhibition photography, bright blue accents, large event typography and a deliberate light/dark section rhythm.
- Build one production hero asset without embedded text or logos. HTML owns the event name, date, venue and actions so copy remains accessible and maintainable.
- The landing-page hero gives the left side to event information and the right side to realistic cleaning products in a trade-show setting.
- Follow the hero with: prior-event proof, a seven-category visual strip, the complete industry supply-chain story, three event programs and a visitor-focused closing conversion section.
- Use only confirmed proof: the November 2025 and March 2026 supply-chain events each recorded 100+ exhibitors and 1,000+ visitors. Do not add country counts, leadership claims, free-registration claims or unconfirmed show-floor scale.
- Use the existing WCB visual system for typography and controls, while allowing the Expo page to use deeper navy surfaces and more cinematic imagery than editorial pages.
- The homepage entry is a compact but unmistakable campaign module placed directly below the main homepage hero. It names the event, date and city and uses `Plan Your Visit` as the primary action.
- At 390px, content stacks in reading order, the hero image retains the product focal point, buttons remain full-width or safely wrapping, and no horizontal overflow is allowed.

## Current-Copy Migration Boundary

Update current interface and conversion copy in these areas:

- header and footer navigation;
- homepage pathways, campaign entry and event conversion sections;
- event page metadata and body copy;
- contact, inquiry confirmation and lead-form labels;
- about and organizer identity copy that describes the current event;
- site metadata, manifest and sitemap;
- directory or category landing components that show the current organizer title.

Do not perform a blind repository-wide text replacement. Blog article titles, quoted material and historical series records are reviewed individually and changed only when they function as current navigation or current event promotion.

## Accessibility

- The campaign strip uses semantic text and links rather than an image containing essential event information.
- Focus styles and keyboard behavior follow the site's existing button and link patterns.
- Color is not the only indicator of action priority.
- Event images keep useful alternative text.
- Heading order remains valid; the strip must not introduce a competing homepage `h1`.

## Verification

- Add or update regression tests for the `WCB Expo` navigation label, `/wcb-expo` links, confirmed full English name and absence of current `World Clean Expo` interface copy.
- Add a route test for the permanent `/world-clean-expo` redirect and confirm the legacy route is absent from the sitemap.
- Update event conversion tests so visitor intent is primary while exhibitor intent remains available on the event page.
- Run the relevant homepage, identity, conversion, visual-refresh and routing tests.
- Run the production build.
- Verify `/` and `/wcb-expo` at desktop and 390px widths: text hierarchy, image cropping, button order, anchors, forms, analytics events, horizontal overflow and browser-console errors.
- Verify the legacy URL redirects to the new canonical route without a redirect chain.

## Release Boundary

Implementation stays on an isolated feature branch. After tests and build pass, publish a Vercel Preview and validate it. Production requires a separate explicit approval before merging to `main`; no direct local production deployment is used.
