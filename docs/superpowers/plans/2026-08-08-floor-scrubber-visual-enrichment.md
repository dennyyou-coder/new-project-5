# Floor Scrubber Visual Enrichment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two source-traceable official photographs and one original component-verification diagram to the floor scrubber technical profile without introducing promotional or unsupported claims.

**Architecture:** Extend the equipment profile contract with typed placement-aware content visuals, validate provenance and local asset boundaries in `lib/equipment.ts`, and render visuals through one reusable figure component. The three visuals remain data-driven in `content/equipment/floor-scrubber.json`; section components only request the visual for their own placement.

**Tech Stack:** Next.js 15 App Router, React, TypeScript, JSON content, CSS, local WebP/SVG assets, Node test runner, Sharp.

## Global Constraints

- Scope is limited to `/equipment/floor-scrubber` and shared equipment-profile primitives required by this page.
- Use exactly two official real-world photographs and one original WCB technical diagram.
- Do not imply product ranking, recommendation, ownership, OEM relationships, or universal component compatibility.
- At 840px and below visuals stack to one column; at 390px there must be no horizontal scrolling.
- Update the existing Vercel Preview only; do not merge to `main` or publish production.

---

### Task 1: Add the visual data contract and validation

**Files:**
- Modify: `lib/equipment.ts`
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Produces: `EquipmentContentVisualPlacement`, `EquipmentContentVisual`, and `EquipmentProfile.contentVisuals`.
- Validation contract: two or three visuals for a valid profile, unique supported placements, local paths inside `/images/equipment/{slug}/`, complete alt/caption fields, official-photo HTTPS provenance, and diagram evidence source IDs.

- [ ] **Step 1: Write failing contract tests**

Add three valid visuals to the `validProfile` fixture and assertions that invalid paths, duplicate placements, absent photo sources, and unknown diagram source IDs fail validation:

```js
contentVisuals: [
  {
    placement: "equipment-types",
    visualType: "official-photo",
    src: "/images/equipment/sample-equipment/types.webp",
    alt: "Sample walk-behind machine",
    caption: "Representative official image.",
    sourceUrl: "https://example.com/types.webp"
  },
  {
    placement: "application-fit",
    visualType: "official-photo",
    src: "/images/equipment/sample-equipment/application.webp",
    alt: "Sample machine in use",
    caption: "Representative application image.",
    sourceUrl: "https://example.com/application.webp"
  },
  {
    placement: "component-stack",
    visualType: "wcb-diagram",
    src: "/images/equipment/sample-equipment/components.svg",
    alt: "Component verification zones",
    caption: "WCB verification diagram.",
    sourceIds: ["source-1"]
  }
]
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npm run test:equipment`  
Expected: FAIL because `contentVisuals` is not yet validated or typed.

- [ ] **Step 3: Add the types and validator**

Add:

```ts
export type EquipmentContentVisualPlacement =
  | "equipment-types"
  | "application-fit"
  | "component-stack";

export type EquipmentContentVisual = {
  placement: EquipmentContentVisualPlacement;
  visualType: "official-photo" | "wcb-diagram";
  src: string;
  alt: string;
  caption: string;
  sourceUrl?: string;
  sourceIds?: string[];
};
```

Add `contentVisuals: EquipmentContentVisual[]` to `EquipmentProfile`. In `validateEquipmentProfile`, require two or three items, reject duplicate/unsupported placements, require photo `.webp` files plus HTTPS `sourceUrl`, and require diagram `.svg` plus declared `sourceIds`.

- [ ] **Step 4: Run tests and confirm pass**

Run: `npm run test:equipment`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/equipment.ts tests/equipmentIntelligence.test.mjs
git commit -m "feat: validate equipment content visuals"
```

---

### Task 2: Add official assets and the original diagram

**Files:**
- Create: `public/images/equipment/floor-scrubber/type-walk-behind-hako.webp`
- Create: `public/images/equipment/floor-scrubber/application-healthcare-taski.webp`
- Create: `public/images/equipment/floor-scrubber/component-verification-map.svg`
- Modify: `content/equipment/floor-scrubber.json`
- Modify: `tests/equipmentIntelligence.test.mjs`

**Interfaces:**
- Consumes: `EquipmentProfile.contentVisuals` from Task 1.
- Produces: exactly three validated pilot visuals, with local paths and provenance ready for rendering.

- [ ] **Step 1: Add failing pilot asset assertions**

Assert that the pilot has exactly three visuals, one of each placement, two `official-photo` records and one `wcb-diagram`; use Sharp metadata for both WebP photos and file existence for the SVG.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npm run test:equipment`  
Expected: FAIL because the pilot data and assets are absent.

- [ ] **Step 3: Copy the two already-approved official photos**

Copy without image alteration:

```text
public/images/brands/hako/hero-scrubmaster-b35-b50.webp
  -> public/images/equipment/floor-scrubber/type-walk-behind-hako.webp

public/images/brands/taski/hero-ultimaxx-healthcare.webp
  -> public/images/equipment/floor-scrubber/application-healthcare-taski.webp
```

- [ ] **Step 4: Create the original SVG**

Create a 1600×1000 responsive SVG with a dark WCB header, a central `Model-specific verification boundary`, and four clearly numbered zones:

```text
01 Deck + consumable interface
02 Squeegee + recovery path
03 Solution + recovery tanks
04 Battery + charger configuration
```

Each zone lists its concrete checks. The footer states: `Family labels do not establish cross-model compatibility.` Use no manufacturer logos or proprietary machine outline.

- [ ] **Step 5: Add the three JSON records**

Add `contentVisuals` after the hero fields. Use the official Hako and TASKI source URLs from the approved spec; give the original diagram relevant `sourceIds` already declared in the profile.

- [ ] **Step 6: Run tests and confirm pass**

Run: `npm run test:equipment`  
Expected: PASS and successful asset decoding.

- [ ] **Step 7: Commit**

```bash
git add content/equipment/floor-scrubber.json public/images/equipment/floor-scrubber tests/equipmentIntelligence.test.mjs
git commit -m "content: add floor scrubber technical visuals"
```

---

### Task 3: Render visuals in the three approved sections

**Files:**
- Create: `components/equipment/EquipmentContentVisual.tsx`
- Modify: `components/equipment/EquipmentTypeComparison.tsx`
- Modify: `components/equipment/EquipmentTechnicalSections.tsx`
- Modify: `tests/equipmentExperience.test.mjs`

**Interfaces:**
- Consumes: `EquipmentContentVisual` and `profile.contentVisuals`.
- Produces: `EquipmentContentVisualFigure({ visual, guidance })`, a reusable accessible figure with optional external source link.

- [ ] **Step 1: Write failing rendering tests**

Require the reusable component to render an image, caption, buyer guidance, and `Official image source` only when `sourceUrl` exists. Require each approved section to select its own placement.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npm run test:equipment`  
Expected: FAIL because the reusable component is absent.

- [ ] **Step 3: Implement the reusable figure**

Implement:

```tsx
export function EquipmentContentVisualFigure({
  visual,
  guidance
}: {
  visual: EquipmentContentVisual;
  guidance: string;
}) {
  return (
    <figure className={`equipment-content-visual equipment-content-visual--${visual.visualType}`}>
      <div className="equipment-content-visual__media">
        <Image src={visual.src} alt={visual.alt} width={1600} height={1000} />
      </div>
      <figcaption>
        <span>{visual.visualType === "official-photo" ? "Official field reference" : "WCB technical diagram"}</span>
        <p>{visual.caption}</p>
        <p className="equipment-content-visual__guidance">{guidance}</p>
        {visual.sourceUrl ? <a href={visual.sourceUrl}>Official image source</a> : null}
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 4: Add placement lookups and buyer guidance**

Render the Hako visual in `equipment-types`, the TASKI visual in `application-fit`, and the WCB diagram in `component-stack`. If a visual is missing, render no empty wrapper.

- [ ] **Step 5: Run tests and confirm pass**

Run: `npm run test:equipment`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/equipment tests/equipmentExperience.test.mjs
git commit -m "feat: render equipment section visuals"
```

---

### Task 4: Add compact responsive styling and verify the release candidate

**Files:**
- Modify: `app/globals.css`
- Modify: `tests/equipmentExperience.test.mjs`

**Interfaces:**
- Consumes: `.equipment-content-visual` markup from Task 3.
- Produces: consistent desktop and mobile visual layout with no blank companion column or horizontal overflow.

- [ ] **Step 1: Add failing CSS contract assertions**

Require the scoped visual selectors, `min-width: 0`, media sizing, caption/source treatment, the 840px stack rule, and overflow-safe wrapping.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npm run test:equipment`  
Expected: FAIL because the visual styles are absent.

- [ ] **Step 3: Implement the visual styles**

Use one compact bordered figure, `grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr)` on desktop, 8:5 media, `object-fit: cover`, consistent radius and caption typography. Stack at `max-width: 840px`; keep image, caption and links within the viewport at 390px.

- [ ] **Step 4: Run automated verification**

Run:

```bash
npm run test:equipment
npm run test:brands
npm run build
```

Expected: 16+ equipment tests pass, 103 brand tests pass, and the production build completes.

- [ ] **Step 5: Run real-browser checks**

Inspect `/equipment/floor-scrubber` at 1440×900 and 390×844. Confirm all three visuals load, captions align, source links work, there are no large empty regions, `scrollWidth === innerWidth`, and the console has no new errors.

- [ ] **Step 6: Commit and update Preview**

```bash
git add app/globals.css tests/equipmentExperience.test.mjs
git commit -m "style: integrate equipment technical visuals"
git push origin codex/floor-scrubber-tech-design
```

Confirm the Vercel Preview deployment succeeds. Do not merge the Draft PR or publish production.
