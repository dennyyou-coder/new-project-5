# Lawn CTA Hierarchy Design

## Goal

Make every actionable element on the Lawn Robots landing page visibly interactive while preserving a clear conversion hierarchy.

## Hierarchy

1. Primary inquiry actions remain solid blue.
2. Secondary business actions remain outlined.
3. Editorial article links become compact light-blue buttons with a directional arrow.

## Related Intelligence

- Keep the existing article titles, excerpts and destinations.
- Make each article card a vertical flex layout so the action aligns to the bottom.
- Present `Read the analysis` as a light-blue tertiary button with a right arrow.
- Keep the full card non-clickable so the link remains explicit and accessible.

## Interaction States

- Add consistent hover movement and shadow to primary actions.
- Add visible hover background changes to secondary and editorial actions.
- Add a clear `:focus-visible` outline to all Lawn page CTA links and buttons.
- Respect mobile width and prevent overflow.

## Scope

- Scope new rules beneath `.sourcing-lawn-page`.
- Do not change CTA copy, URLs, Tally tracking attributes, forms, Pool Robots, shared navigation or production configuration.

## Validation

- Confirm three article actions have button styling and aligned baselines.
- Confirm primary, secondary and editorial actions remain visually distinct.
- Confirm keyboard focus is visible.
- Confirm desktop/mobile layouts have no horizontal overflow.
- Confirm Pool Robots is unchanged.
- Run sourcing verification and production build.

