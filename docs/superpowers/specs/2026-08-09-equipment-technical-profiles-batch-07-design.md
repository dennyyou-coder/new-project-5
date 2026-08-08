# Equipment Technical Profiles Batch 07 Design

## Objective

Publish three evidence-backed equipment database pages through the approved World Clean Biz technical-profile system:

- `/equipment/walk-behind-floor-scrubber`
- `/equipment/ride-on-floor-scrubber`
- `/equipment/wide-area-vacuum`

This batch deepens high-intent equipment coverage without creating SEO articles, ownership records, brand records, component profiles, or a new page architecture. The general Floor Scrubber, Commercial Dry Vacuum and Upright Commercial Vacuum pages remain category overviews; these records answer narrower format-specific procurement questions.

## Selection rationale

- Walk-Behind Floor Scrubber isolates operator travel, traction assistance, handle controls, turning space, deck visibility and refill logistics from other scrubber formats.
- Ride-On Floor Scrubber isolates seated driving, transport dimensions, aisle turning, slope limits, operator access, braking and large tank or battery configuration.
- Wide-Area Vacuum isolates machines officially positioned for wider carpet routes, separating brush path, bag capacity, manoeuvrability and operator force from ordinary uprights and tub vacuums.

These are procurement subcategories, not rankings. A manufacturer label, cleaning width or productivity claim does not by itself move a model into another category or establish achieved site output.

## Identity boundaries

### Walk-Behind Floor Scrubber

Include commercial scrubber-dryers whose operator walks behind and steers the machine during normal cleaning. Include traction-assisted and pad-assist designs only when the official source states the operating relationship. Exclude ride-on, stand-on, autonomous and domestic floor washers. Keep working width, tanks, traction, brush pressure, theoretical productivity, battery, charger and recovery performance tied to the exact regional configuration.

Representative models are Tennant T500, Nilfisk SC500, Kärcher B 50 W Bp, Hako Scrubmaster B50, TASKI ULTIMAXX 1900 and Fimap EMx 50.

### Ride-On Floor Scrubber

Include commercial scrubber-dryers with an integrated seated operator position used during normal cleaning. Exclude stand-on machines, autonomous-only operation, sweeper-scrubbers and ordinary walk-behind scrubbers. Separate nominal productivity from achieved route output, and verify steering envelope, gradeability, braking, deck or squeegee overhang, transport mass, batteries, charger and tanks for the exact quoted configuration.

Representative models are Tennant T16, Nilfisk SC6500, Kärcher B 150 R, Hako Scrubmaster B120 R, TASKI ULTIMAXX 900 and Comac C130.

### Wide-Area Vacuum

Include commercial dry vacuums officially described as wide-area, large-area or equivalent higher-width carpet machines, including walk-behind and ride-on formats. Exclude ordinary tub vacuums, backpacks, domestic uprights, carpet extractors and sweepers. Do not establish a universal width threshold. Brush path, bag or container capacity, airflow, vacuum, filtration, sound, cord or battery, transport and turning requirements remain model-specific.

Representative models are Kärcher CV 66/2 and CV 85/1 RS Bp, Nilfisk GU 700 A, NSS Pacer 30, Truvox Valet Wide Area Vac and TASKI jet 50.

## Evidence design

Each record follows `content/equipment/README.md` and contains at least five primary sources, six to eight representative models, at least four published brand links, explicit market scope, engineering checks, procurement decisions and standards boundaries. IEC 60335-2-72:2021 is used only for powered commercial floor-treatment safety scope. IEC 60335-2-69:2021 is used only for commercial dry-vacuum safety scope. ASTM F608-24 may identify a laboratory embedded-dirt test method but cannot support a category-wide ranking or a site productivity claim.

Manufacturer specifications, manuals, official brochures and current product pages remain the factual layer. WCB recommendations are labelled as assessment, state limitations and specify a buyer action. No OEM, factory, component supplier, software provider, cross-model compatibility or achieved productivity relationship is inferred.

## Visual design

Reuse the current equipment layout unchanged. Each profile receives:

- one real official `hero.webp` at 1600 x 1000;
- two official WebP content images at 1500 x 900 or larger;
- desktop `component-verification-map.svg` at 1600 x 1000;
- mobile `component-verification-map-mobile.svg` at 800 x 1600.

Walk-behind diagrams verify deck, traction, solution, recovery and operator route. Ride-on diagrams verify driver envelope, steering, deck, tanks, recovery and power. Wide-area vacuum diagrams verify floor head, brush system, airflow, collection, filtration and route handling. Every diagram states that family labels do not establish cross-model compatibility.

## Publication and validation

Records begin as `draft` and may become `published` only after the focused equipment suite, every project test script, content and SEO verification, production build, 1440 px desktop review, 390 px mobile review, zero broken local assets, no horizontal overflow and no new browser errors pass. Preview must be ready before GitHub merge. Production deploys only from GitHub `main` through the Vercel Git integration, followed by live route, asset and sitemap checks.
