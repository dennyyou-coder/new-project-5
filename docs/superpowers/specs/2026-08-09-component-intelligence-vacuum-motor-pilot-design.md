# Component Intelligence: Vacuum Cleaner Motor Pilot Design

**Date:** 2026-08-09  
**Status:** Proposed for implementation  
**Pilot slug:** `vacuum-cleaner-motor`

## 1. Goal

Create the first World Clean Biz component-intelligence page as a structured technical database record, not an SEO article, brand page, ownership page, repair manual, or parts catalogue.

The pilot must help procurement, product, engineering, and service teams understand what a vacuum-cleaner motor is, how motor families differ, which specifications are comparable, what commonly fails, and what evidence is required before treating a part as compatible.

The pilot also establishes a reusable framework for later component profiles without changing the existing equipment or brand data contracts.

## 2. Success criteria

The pilot succeeds when:

- `/components/vacuum-cleaner-motor` renders from a validated JSON profile.
- `/components` provides a directory and exposes only published component profiles.
- Draft profiles are visible locally and in Vercel Preview, but are `noindex`, absent from the public directory, and absent from the production sitemap.
- Every technical claim has an evidence statement, scope, source IDs, and verification date.
- WCB analysis is visibly separated from source-backed facts.
- The page never implies exact part compatibility, OEM supply, factory origin, or brand-to-supplier relationships without direct evidence for that exact claim.
- Desktop and 390 px layouts have no blank structural gaps, misaligned cards, clipped text, or horizontal overflow.
- The page includes one official real motor hero image plus four information-bearing body visuals distributed through the page: two official images and two original WCB diagrams with mobile variants where needed.
- Focused component tests and the production build pass before Preview delivery.

## 3. Scope boundaries

### Included

- Vacuum-cleaner motor families and airflow/cooling architectures.
- Electrical, mechanical, thermal, airflow, acoustic, and control specifications used to define or compare motors.
- Application contexts such as upright, canister, stick, wet/dry, central, and commercial vacuums where primary sources support the distinction.
- Failure symptoms and service checks expressed as diagnostic guidance, not repair instructions.
- Procurement and engineering verification actions.
- Directly applicable safety and performance standards.
- Representative official motor product families where the manufacturer publicly documents them.

### Excluded

- Model-specific repair procedures or disassembly instructions.
- Unverified cross-model interchangeability.
- Marketplace listings, aftermarket seller compatibility tables, or visual matching as evidence.
- Claims that a motor manufacturer supplies a named vacuum brand unless an authoritative source directly establishes that relationship.
- Factory, country-of-origin, OEM, ODM, trademark, ownership, or corporate-control analysis unless directly needed to identify the source publisher.
- Rankings, scores, universal recommendations, prices, availability, and product-review language.
- SEO article content or ownership-analysis content.

## 4. Information architecture

### Routes

- `app/components/page.tsx`: public component directory.
- `app/components/[slug]/page.tsx`: reusable component detail route.

The route name is user-facing. React components should live under `components/component-intelligence/` to avoid an ambiguous `components/components/` path.

### Data and loader

- `content/components/{slug}.json`: one record per component profile.
- `content/components/README.md`: evidence, image, compatibility, and publication rules.
- `lib/componentProfiles.ts`: TypeScript types, validation, loaders, draft visibility, sitemap entries, metadata helpers, and JSON-LD helpers.

The component contract must be independent from `EquipmentProfile`. Shared visual primitives may be reused, but component data must not be forced into equipment-only fields such as representative equipment models or equipment variants.

### Assets

- `public/images/components/{slug}/hero.webp`
- `public/images/components/{slug}/architecture-family.webp`
- `public/images/components/{slug}/application-reference.webp`
- `public/images/components/{slug}/performance-boundaries.svg`
- `public/images/components/{slug}/performance-boundaries-mobile.svg`
- `public/images/components/{slug}/compatibility-gate.svg`
- `public/images/components/{slug}/compatibility-gate-mobile.svg`

Exact filenames may change only if the schema and tests use one consistent convention.

## 5. Page structure

### 5.1 Compact hero and identity boundary

The first screen contains:

- Breadcrumbs: Home / Component Intelligence / Vacuum Cleaner Motor.
- One H1: `Vacuum Cleaner Motor`.
- A short purchasing-oriented headline and definition.
- Included and excluded scope.
- Draft-preview label when applicable.
- Publication and verification dates.
- A clear disclaimer that a component family is not proof of part compatibility.
- An official real motor photograph with an exact official source URL and accurate caption.
- A compact key-facts table.
- Section navigation.

The hero should inherit the visual rhythm of the equipment pages but use a distinct component accent treatment so users can recognize the database type. It must not be followed by several uninterrupted text-heavy sections.

### 5.2 Role in the vacuum system

An original semantic UI flow explains, at a family level:

1. electrical input and control;
2. motor conversion of electrical energy;
3. impeller/fan stage;
4. airflow and pressure generation;
5. cooling and exhaust path;
6. protection or feedback where applicable.

This is a synthesized explanation, not a universal architecture or copied manufacturer diagram. Each node carries evidence and scope.

### 5.3 Motor architecture families

Cards compare only documented technical boundaries, including where supported:

- brushed universal motors;
- brushless DC motors;
- bypass versus thru-flow cooling arrangements;
- single-stage versus multi-stage fan arrangements;
- dry-only versus wet-pickup-relevant configurations.

Each family row records operating principle, typical application boundary, benefits, limitations, and the buyer check. No family is presented as a universal winner.

Place an official motor-family or motor-construction photograph beside this section. It must visibly match the architecture being discussed; a generic vacuum-appliance image is not sufficient.

### 5.4 Specification dictionary

A mobile-safe table defines:

- rated voltage and frequency or DC voltage range;
- input power;
- airflow;
- sealed vacuum/static pressure;
- air watts when a source declares the method;
- speed;
- efficiency;
- cooling path;
- insulation class and thermal protection;
- duty or life-test conditions;
- envelope dimensions, mounting, shaft/fan interface, and mass;
- acoustic values only when the measurement boundary is stated;
- control or electronics requirements for brushless designs.

Every row includes purchasing meaning, reporting boundary, comparison caution, evidence, and scope. Values from different test methods or system boundaries must not be normalized into a ranking.

Follow the dictionary with an original WCB visual showing why input power, airflow, sealed vacuum, and air watts are different measurement boundaries rather than interchangeable ranking numbers. Provide a simplified mobile version so labels remain legible at 390 px.

### 5.5 Application matrix

The page maps documented motor characteristics to vacuum categories without claiming automatic fit. Candidate contexts include upright, canister, stick, wet/dry, central, backpack, and commercial vacuums.

Each row contains official application evidence, a labelled WCB assessment, basis, limitations, and a concrete buyer or engineering action.

Use a second official photograph here to show a documented motor application or product-family context. Its caption must state the exact photographed context and must not imply universal applicability.

### 5.6 Compatibility gate

This is the primary differentiator of the page. It consists of an original WCB diagram plus a checklist. A compatibility statement is allowed only after checking the relevant combination of:

- original manufacturer part number and revision;
- appliance model and serial-number range;
- rated voltage, frequency, current, power, and control electronics;
- motor architecture and rotation where relevant;
- mounting pattern, envelope, shaft, fan stage, seals, and duct interface;
- cooling-air path and wet/dry protection boundary;
- thermal protection, insulation, grounding, and approvals;
- performance curve or operating point, not a single headline number;
- connector, wiring, firmware, and sensor requirements where relevant;
- current service bulletin or approved-parts documentation.

The diagram must explicitly state that physical resemblance, group ownership, generic family names, seller claims, and matching wattage alone do not establish compatibility.

The compatibility diagram must appear before the long checklist, not after it, so it creates a visual reading break and gives readers the decision sequence before the detailed fields.

### 5.7 Failure modes and service signals

Structured cards connect observable symptoms to possible causes and required checks. Examples may include brush wear, bearing noise, commutator damage, thermal trips, airflow restriction, impeller imbalance, winding faults, control-board faults, and seal or moisture ingress only where primary sources support them.

The section must avoid remote diagnosis. Each row separates symptom, plausible mechanisms, evidence boundary, safety limitation, and service action. It must tell users to isolate power and use authorized service procedures where applicable.

### 5.8 Representative official motor families

Show six to eight manufacturer product families only if official technical pages or datasheets provide enough data. The table may include manufacturer, product-family name, architecture, declared application scope, selected distinguishing specifications, market or document scope, and official source.

It must not include vacuum-brand links, logos, claimed customer relationships, or a supplier ranking unless direct evidence supports that exact relationship and a later schema explicitly permits it.

### 5.9 Procurement and engineering checklist

Decision cards cover use cases such as new product design, approved service replacement, supplier qualification, and cross-region sourcing. Each card identifies attributes to verify, comparison traps, WCB assessment, basis, limitations, buyer action, and engineering validation.

### 5.10 Standards and safety boundary

List only standards directly relevant to the documented motor or vacuum application scope. Record jurisdiction, edition/version when known, applicability, evidence, and limitations. A standard reference is not a certification claim.

### 5.11 Developments and sources

Technical developments appear only when they materially change component design, regulation, testing, or procurement. Sources are numbered, directly linked, and display publisher, source type, document date when available, access date, and profile verification dates.

## 6. Data contract

The profile should include these top-level groups:

- status, slug, name, aliases;
- definition, included scope, excluded scope, applications;
- headline, description, meta description, disclaimer;
- hero asset and exact official provenance;
- exactly four pilot content visuals with distinct placements and complete provenance;
- key facts;
- system role flow;
- architecture families;
- specification dictionary;
- application matrix;
- compatibility checks;
- failure modes;
- representative manufacturer families;
- procurement decisions;
- engineering checks;
- standards;
- developments;
- sources;
- published, verified, and modified dates.

Every source-backed row requires:

- `evidence`
- `scope`
- `sourceIds`
- `verifiedAt`

Every WCB judgement requires:

- `assessment`
- `basis`
- `limitations`
- `buyerAction`
- optional `engineeringCheck`

The validator must reject empty collections, unknown source IDs, unsupported source types, invalid dates or URLs, missing provenance, images outside the component profile directory, and compatibility language that bypasses the required verification boundary.

Published profiles require at least five reliable sources, three to five content visuals, and six to eight representative official product families from at least three component manufacturers. The pilot specifically requires four body visuals. Draft profiles may remain incomplete only where the loader still reports validation errors during tests; the pilot delivered to Preview should meet the full published contract while retaining `status: "draft"` for review.

## 7. Evidence and editorial rules

Source priority:

1. official motor-manufacturer datasheets and technical pages;
2. official vacuum-manufacturer service or approved-parts documents;
3. standards bodies and regulators;
4. official application, safety, compliance, or service documentation;
5. peer-reviewed or authoritative technical references used only to fill a defined gap.

Search-result snippets, distributors, marketplaces, forums, repair blogs, and third-party compatibility tools are not evidence for publication claims.

Source text and WCB synthesis remain visibly distinct. When a required fact is not disclosed, omit it or state that it was not disclosed in the reviewed public material. Do not turn absence of evidence into a factual conclusion.

## 8. Visual rules

- Hero: real matching motor or official motor-family scene, minimum 1600 x 1000 after conversion to WebP.
- Official content visual: minimum 1500 x 900 after conversion to WebP, with exact official page or asset URL.
- WCB diagram: original SVG and separate mobile SVG, derived from cited technical sources and labelled as WCB explanatory material.
- Pilot visual rhythm: hero plus four body visuals, placed at architecture families, specification boundaries, application context, and compatibility gate. Do not group them into one gallery.
- Reading-density target: avoid more than two consecutive major sections without a visual, table, flow, or compact card system; break long explanations into scannable evidence blocks.
- Every body visual must carry an explanatory caption and either an exact official source link or the source IDs used to create the WCB diagram.
- No AI-generated product imagery, third-party logos, search screenshots, copied manual diagrams, or decorative images without information value.
- Alt text and captions describe only what the image visibly shows; they must not infer application, customer, factory, or compatibility.

## 9. Discovery and structured data

- Draft profile: dynamic Preview route only, `noindex, nofollow`, excluded from `/components`, sitemap, and production static parameters.
- Published profile: included in `/components`, sitemap, static parameters, canonical metadata, Open Graph metadata, and breadcrumbs.
- JSON-LD uses `WebPage` plus a component-appropriate subject such as `Product` with a generic component category. It must not create an `Organization`, `Brand`, offer, rating, manufacturer, or compatibility relationship not present in the evidence.
- Existing equipment component rows remain unlinked during the pilot. Links to `/components/vacuum-cleaner-motor` are added only in a later, separately validated change when the component page is published and the equipment row is truly relevant.

## 10. Responsive layout

- Desktop uses balanced two-column hero and evidence/assessment layouts.
- Tablet collapses the hero and dense comparison areas before text becomes cramped.
- At 390 px, cards and definition lists become single column; tables use the site's mobile card pattern rather than horizontal scrolling.
- Long part numbers, source URLs, units, and standards identifiers must wrap without breaking layout.
- Visual containers preserve useful aspect ratios without leaving large blank areas.
- One H1 only, consistent section spacing, aligned card tops, and no orphaned empty grid cells.

## 11. Testing and validation

This pilot changes shared architecture and therefore uses upgraded validation:

1. Write component contract and experience tests before implementation.
2. Test valid and invalid profiles, source references, draft visibility, sitemap inclusion, metadata, and unsupported compatibility semantics.
3. Test the required four distinct visual placements, image existence, file type, minimum dimensions, official provenance, SVG presence, and mobile SVG variants.
4. Test the detail-page section order, one-H1 rule, evidence labels, compatibility warnings, directory filtering, and responsive CSS safeguards.
5. Run existing brand and equipment focused tests to detect regression.
6. Run the new component test suite.
7. Run `npm run build`.
8. Create a Vercel Preview through the GitHub branch workflow.
9. Inspect the pilot on desktop and at 390 px, verify images and alignment, and check the browser console.

## 12. Release boundary

The first profile remains a validated draft for Preview review. It is not included in production discovery and is not merged to `main` until the page effect is approved.

After approval:

1. change the validated profile to `published`;
2. rerun focused component tests and the production build;
3. verify the published directory and sitemap behavior;
4. merge through GitHub `main`;
5. allow the Vercel Git integration to deploy production;
6. smoke-check the live directory and detail page.

After this framework and pilot are approved, later component-profile batches that change only JSON, profile-local images, tests, and documentation may use the project's routine automated release path. Shared schema, component, route, style, or configuration changes continue to require upgraded validation.

## 13. Initial implementation files

Expected new files:

- `app/components/page.tsx`
- `app/components/[slug]/page.tsx`
- `components/component-intelligence/*`
- `content/components/README.md`
- `content/components/vacuum-cleaner-motor.json`
- `lib/componentProfiles.ts`
- `public/images/components/vacuum-cleaner-motor/*`
- `tests/componentIntelligence.test.mjs`
- `tests/componentExperience.test.mjs`

Expected modified files:

- `app/globals.css`
- `app/sitemap.ts`
- `package.json` only if a focused `test:components` script is added.

No brand JSON, equipment JSON, ownership article, SEO article, homepage, or production deployment configuration is in scope.
