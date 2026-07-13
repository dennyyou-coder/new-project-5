# Lawn FAQ Visual Balance Design

## Goal

Balance the Industry Opportunity Questions section without changing its buyer-focused content or accordion behavior.

## Scope

- Add one existing lawn-robot image beneath the FAQ introduction in the left column.
- Reuse `/images/sourcing/lawn-robots/rm-03-awd-slope.png` to reinforce the section's technical decision-making theme.
- Keep the right-side ten-question accordion unchanged.
- Scope all new markup and styles to the lawn sourcing page.

## Layout

### Desktop

- Keep the existing two-column FAQ layout and aligned top edge.
- Place the image below the introduction copy at the full width of the left column.
- Use a 16:10 visual frame with a 260–300px target height, `object-fit: cover`, a light border and the page's existing small-radius geometry.
- Preserve the current gap between the left introduction and right accordion.

### Mobile

- Maintain the current single-column reading order.
- Place the image after the introduction and before the accordion.
- Keep the image at full container width with the same aspect ratio.

## Constraints

- Do not change FAQ questions or answers.
- Do not change accordion interaction or accessibility.
- Do not change Pool Robots, shared navigation, footer, tracking, or forms.
- Do not generate or introduce a new product claim.

## Validation

- Confirm the FAQ image renders and has meaningful alt text.
- Confirm desktop left and right columns share the same top edge and the left column no longer feels empty.
- Confirm mobile reading order and no horizontal overflow.
- Confirm Pool Robots has no new lawn FAQ image or styling.
- Run the sourcing verifier and production build.
