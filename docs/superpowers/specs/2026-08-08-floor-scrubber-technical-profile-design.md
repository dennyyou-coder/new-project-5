# Floor Scrubber Technical Profile Pilot Design

## Objective

Create one evidence-backed, database-style equipment profile for `Floor Scrubber` that reuses the current brand-profile visual language while introducing a distinct technical content model for buyers and engineering users.

The pilot validates whether World Clean Biz should expand from brand intelligence into linked equipment and component intelligence. It is not an SEO article and must not create or modify ownership-analysis content.

## Confirmed Product Decisions

- Reuse the current brand-page visual shell, spacing, table language, image treatment, and responsive behavior.
- Use separate future data models for equipment and components.
- Serve both buyer/procurement and engineering/component audiences.
- Keep official facts, entity relationships, and WCB analysis visibly separate.
- Link equipment to existing brand profiles and to representative, officially evidenced models.
- Do not add opaque ratings, rankings, or unsupported compatibility claims.
- Build only one pilot page before any batch expansion.
- Pilot slug: `/equipment/floor-scrubber`.
- Keep the pilot in draft until the user reviews its rendered desktop and mobile experience.

## Non-Goals

- No SEO article creation or editing.
- No ownership-analysis article creation.
- No component-detail pages in the pilot.
- No supplier ranking, commercial endorsement, or pay-to-play directory.
- No complete global model catalog.
- No inferred factory, OEM, component supplier, or cross-brand compatibility claims.
- No production release before the pilot is visually reviewed and explicitly accepted.

## Information Architecture

The long-term database has three distinct entity families:

```text
Industry Database
├── Brands       /brands/{slug}
├── Equipment    /equipment/{slug}
└── Components   /components/{slug}
```

The pilot implements only the equipment profile and the minimum equipment-directory support needed to render and test it. Planned component references may be displayed as labelled system nodes, but they must not link to nonexistent routes.

Existing brand pages may be linked from the equipment profile. The pilot must not change unrelated brand records or add unverified product relationships to brand JSON files.

## Page Structure

### 1. Hero and Scope Boundary

The hero establishes the technical entity rather than a company identity:

- equipment name and accepted aliases;
- concise technical definition;
- what is included and excluded;
- primary applications;
- page status and last verification date;
- real, officially sourced floor-scrubber image;
- a short disclaimer separating technical reference information from model-specific purchasing advice.

### 2. Key Facts

Use the existing brand-page fact-table language for:

- cleaning mechanism;
- operator format;
- common power sources;
- solution and recovery arrangement;
- common cleaning-deck types;
- typical operating environments;
- related equipment categories.

Facts must be scoped. Broad statements must not be presented as universal when they apply only to a subtype or model.

### 3. Working-System Map

Present a WCB-created, evidence-based system flow:

```text
Solution delivery
→ mechanical agitation
→ soil suspension
→ squeegee collection
→ vacuum recovery
→ recovery tank
```

Each node identifies the associated component family and its role. The visual must not copy a manufacturer's diagram. It should be an original explanatory graphic based on cited technical documentation.

### 4. Equipment-Type Taxonomy

Compare the main forms without declaring a universal winner:

- compact;
- walk-behind;
- stand-on when supported by reviewed sources;
- ride-on;
- autonomous or robotic.

The comparison includes intended task scale, operator relationship, space constraints, and main limitations. Scope must be clear when terminology differs by manufacturer or region.

### 5. Performance-Metric Dictionary

Explain the purchasing meaning and comparison limits of:

- cleaning path;
- theoretical and practical productivity;
- solution and recovery capacity;
- brush or pad pressure;
- runtime and charging assumptions;
- noise reporting;
- turning radius and maneuverability.

The page may normalize units for readability, but it must retain the original value and source unit. It must not calculate cross-model rankings from incomparable test methods.

### 6. Application-Fit Matrix

Cover representative environments such as retail, warehousing, manufacturing, healthcare, education, and hospitality.

Each row separates:

- `evidence`: what reviewed sources support;
- `scope`: equipment type, model, market, or operating condition;
- `wcbAssessment`: WCB interpretation;
- `limitations`: what the evidence does not establish;
- `buyerAction`: the next verification step.

### 7. Component Stack

Describe the main component families:

- brush or pad system;
- squeegee assembly and blades;
- solution pump and fluid path;
- vacuum motor and recovery path;
- battery and charger;
- traction or drive system;
- sensors and controls where applicable.

Component references remain non-clickable until a verified component profile exists.

### 8. Related Brands and Representative Models

Include 6–8 representative models across at least four existing brand profiles, selected only after current official model pages or manuals are verified.

Each row includes:

- brand link;
- model name;
- equipment subtype;
- officially supported distinguishing specifications;
- market or regional scope;
- verification date;
- source reference;
- an explicit note that the table is representative, not exhaustive.

The implementation may consider brands such as Tennant, Nilfisk or Viper, Kärcher, Hako, Comac, and Fimap, but inclusion is evidence-gated rather than quota-driven.

### 9. WCB Procurement Decision Matrix

Provide buyer-facing analysis without a composite score:

- intended task;
- attribute to verify;
- common comparison trap;
- evidence limitation;
- concrete buyer action.

WCB analysis must be visually labelled and must never be phrased as a manufacturer claim.

### 10. Engineering Validation Checklist

Cover checks such as:

- battery voltage and chemistry;
- charger compatibility;
- cleaning-deck dimensions;
- brush or pad interface;
- squeegee material and geometry;
- part numbers and machine serial ranges;
- market-specific electrical or safety requirements;
- warranty and service entity.

The checklist is a verification framework, not a compatibility guarantee or repair manual.

### 11. Standards, Safety, and Compliance

Include only standards or official safety requirements that directly apply to the stated equipment or market scope. Every entry records jurisdiction, version or publication date when available, applicability, and source.

### 12. Technical Developments

Use a compact timeline for meaningful changes such as battery systems, controls, telematics, or autonomous operation. Do not turn this into a general news feed.

### 13. Sources and Verification Record

Display all cited sources with title, publisher, URL, access or verification date, and source type.

The page requires at least five reliable sources, prioritizing:

1. official equipment manuals and specification sheets;
2. official manufacturer technical pages;
3. applicable standards organizations or regulators;
4. official safety, service, warranty, or compliance documents;
5. credible technical sources only as supplements.

## Evidence and Analysis Model

All claims belong to one of three explicit layers.

### Evidence Layer

- `evidence`
- `scope`
- `sourceIds`
- `verifiedAt`

### Relationship Layer

- `brandSlug`
- `modelName`
- `equipmentSlug` or future `componentSlug`
- `marketScope`
- `relationshipEvidence`
- `sourceIds`
- `verifiedAt`

### WCB Analysis Layer

- `assessment`
- `basis`
- `limitations`
- `buyerAction`
- `engineeringCheck`

Official facts and WCB analysis must never share an unlabeled free-text field.

## Equipment Data Model

Store equipment profiles separately from brand records:

```text
content/equipment/{slug}.json
```

The equipment schema should support:

- identity, status, aliases, definition, and scope boundary;
- official or evidence-based visuals;
- key facts;
- system-flow nodes;
- equipment variants;
- performance metrics and comparison cautions;
- application-fit evidence and WCB assessment;
- component-family references;
- representative model relationships;
- procurement decision rows;
- engineering checks;
- standards and compliance entries;
- technical developments;
- sources, publication date, and verification date.

Component profiles will later use `content/components/{slug}.json` and a separate schema focused on function, variants, specifications, compatibility boundaries, trade-offs, failure modes, and engineering verification.

## Visual Treatment

- Reuse the current brand-profile layout vocabulary rather than introducing a competing design system.
- Use one official real-equipment hero image with recorded source URL.
- Use two WCB-created explanatory visuals: working-system flow and equipment-type comparison.
- Do not use AI-generated product images, third-party logos, copied manual diagrams, or unsupported relationship diagrams.
- Preserve the current table, border, radius, caption, and responsive conventions.
- Ensure long specifications, units, and source text wrap safely at a 390 px viewport.

## Draft and Failure Behavior

- New equipment profiles default to `draft`.
- Draft records must be available for local and Preview review but excluded from the production sitemap and public equipment directory.
- Missing required sources, broken image paths, duplicate slugs, invalid brand links, or unsupported published component links must fail validation.
- Optional undisclosed facts are omitted or explicitly labelled as not publicly disclosed.
- Missing component pages render as labelled component families without hyperlinks.
- Unsupported or ambiguous model relationships are excluded rather than guessed.

## Validation and Acceptance Criteria

The pilot is ready for user review only when:

- the equipment JSON passes schema validation;
- at least five reliable sources are present;
- 6–8 representative models across at least four brands have current official evidence;
- all brand links resolve;
- all images render and have traceable sources;
- evidence, scope, WCB assessment, limitations, and buyer action are visibly distinct;
- no nonexistent component route is linked;
- no horizontal overflow occurs on desktop or at 390 px;
- tables remain readable and headings do not wrap abnormally;
- the browser console has no new errors;
- focused tests and `npm run build` pass;
- the Preview is reviewed before any production publication.

## Pilot Review and Expansion Rule

The pilot remains a single draft page until the user reviews:

- information usefulness for both buyer and engineering audiences;
- visual consistency with brand profiles;
- evidence readability;
- representative-model usefulness;
- mobile density and table behavior;
- maintenance burden.

Only after that review may the project define or batch-build walk-behind, ride-on, brush, squeegee, battery, vacuum, carpet, or robotic-cleaning profiles.

