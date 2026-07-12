# Lawn Robot Landing Page Layout Polish Design

## Goal

Polish the existing `/sourcing/lawn-robots` landing page so its visual hierarchy feels deliberate and every major section follows the same content edges, vertical rhythm and card geometry.

This is a layout-quality pass. It does not change the approved market positioning, product directions, charts, FAQ topics, lead forms or tracking behavior.

## Scope

Only the Lawn Robots page and lawn-scoped styles are in scope.

Allowed changes:

- `components/LawnRobotProductSelector.tsx`
- `components/LawnRobotDecisionVisuals.tsx` when minor structure is required for alignment
- Lawn-scoped rules in `app/globals.css`
- Sourcing SEO/layout verification assertions

Out of scope:

- Pool Robots
- Shared header, navigation and footer
- Global container widths
- Product copy, chart judgments and FAQ answers
- Production deployment

## Product Selector Repair

The current selector has three independently sized columns. The main image ends much earlier than the information card, producing a large empty area and an unstable visual center.

The revised desktop selector will use a two-row product workbench:

1. The first row contains the main image, a compact product summary and the model thumbnail rail.
2. The summary contains the product number, product direction, title, market opportunity, tags and two actions only.
3. `Why it can win` and `Critical proof points` move into a two-column evidence strip below the main image and summary.
4. The evidence strip spans the main image and summary columns.
5. The thumbnail rail spans both rows and has its own bounded scrolling area when all six models do not fit.

This removes the artificial blank area without stretching or heavily cropping the product image.

## Page-Wide Alignment System

All lawn-page sections will use the existing `sourcing-v3-container` as the single horizontal anchor.

Within that anchor:

- Section kickers and headings start on the same left edge.
- Introductory copy uses a consistent right-hand column and baseline.
- Tables, charts, cards and divider rules begin and end on the container edges.
- Repeated section padding follows one desktop rhythm and one mobile rhythm.
- Card borders, radii and internal padding use a consistent scale.
- Multi-column cards align their top and bottom edges where content permits.

The opportunity landscape, channel matrix, success-condition cards, Denny credibility section, evidence flow, FAQ and final CTA will be reviewed against these rules.

## Responsive Behavior

Desktop:

- Product workbench uses the two-row layout.
- Thumbnail rail is vertically bounded and scrollable.
- Titles and supporting copy retain a balanced two-column heading layout.

Tablet:

- Product image and summary remain paired where space permits.
- Thumbnail rail becomes a horizontal strip if the side rail becomes too narrow.

Mobile:

- Main image, compact summary, evidence cards and thumbnail strip stack in that order.
- No fixed heights that create empty space.
- Thumbnail strip scrolls horizontally.
- The channel matrix keeps its existing internal horizontal scroll without causing page overflow.
- Opportunity markers remain fully visible.

## Visual Constraints

- Preserve the existing World Clean Biz navy, blue and pale-blue visual system.
- Do not add decorative effects that weaken the editorial/business tone.
- Do not enlarge body copy or cards merely to fill space.
- Do not crop product imagery in a way that hides the mower form.
- Keep all new selectors scoped under `.sourcing-lawn-page`.

## Validation

Before publishing a new Preview:

- Verify the product selector at desktop, tablet and mobile widths.
- Confirm main image, compact summary and thumbnail rail have intentional alignment.
- Confirm the former blank area is removed.
- Confirm all six models still switch correctly.
- Confirm CTA buttons still carry the selected product ID.
- Confirm ten FAQs remain collapsed initially and expand correctly.
- Confirm no page-level horizontal overflow.
- Confirm Pool Robots receives none of the lawn-specific layout.
- Run the production build and Sourcing SEO verification.
- Publish Preview only; production remains unchanged.
