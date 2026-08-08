# Equipment Technical Profiles Batch 05 Design

## Objective

Publish three evidence-backed equipment database pages through the approved World Clean Biz technical-profile system:

- `/equipment/autonomous-floor-scrubber`
- `/equipment/commercial-robot-vacuum`
- `/equipment/combination-sweeper-scrubber`

This batch adds high-value automation and combination-machine coverage without creating SEO articles, brand ownership records, component profiles, or a new page architecture.

## Selection rationale

The three topics answer different procurement questions and remain distinct from the ten published equipment profiles.

- Autonomous Floor Scrubber isolates navigation, safety, route teaching, intervention, docking and proof-of-work questions that the general Floor Scrubber page can only introduce.
- Commercial Robot Vacuum covers autonomous dry pickup in commercial and light-industrial settings without mixing in household robot vacuums or ordinary commercial vacuums.
- Combination Sweeper-Scrubber covers machines that provide a documented dry sweeping path, debris hopper, wet scrubbing path and liquid recovery system in one platform. A scrubber with only a light pre-sweep accessory is not automatically included.

## Identity boundaries

### Autonomous Floor Scrubber

Include purpose-built and converted commercial scrubber-dryers that can execute mapped or taught wet-cleaning routes automatically and that retain documented supervision, manual-control or recovery procedures. Exclude household floor-washing robots, autonomous dry vacuums, ordinary manually driven scrubbers, and machines for explosive or corrosive environments unless the exact configuration is approved. Separate autonomous route coverage from theoretical manual productivity, safety certification from site approval, and docking capability from the delivered package.

Representative models are Tennant X4 ROVR and T380AMR, Nilfisk Liberty SC50, Kärcher KIRA B 50, Hako Scrubmaster B75 i, and LionsBot R3 Scrub Pro.

### Commercial Robot Vacuum

Include autonomous commercial or light-industrial machines whose documented primary function includes dry vacuum pickup on carpet, hard floor or both. Exclude domestic robot vacuums, manually operated commercial vacuums, wet pickup, hazardous or combustible dust without exact approval, and robots whose only documented function is wet scrubbing. Separate suction pressure, airflow, brush path, dust capacity, mapping, runtime, charging and public-area safety.

Representative models are Kärcher KIRA CV 50, Gausium Vacuum 40, ECOVACS DEEBOT PRO K1 VAC, Makita DRC300 and DRC200, and LionsBot R3 Vac.

### Combination Sweeper-Scrubber

Include ride-on or industrial machines with an official dry sweeping system and debris hopper plus a wet scrubbing and squeegee-recovery system on the same platform. Exclude sequential use of two separate machines, road sweepers, ordinary scrubber-dryers with no documented debris collection system, and pre-sweep tools that do not create a full sweeper-scrubber architecture. Keep sweeping width, scrubbing width, hopper capacity, solution and recovery tanks, powertrain and theoretical output configuration-specific.

Representative models are Tennant M17 and M20, Nilfisk CS7010 and CS7500, Kärcher B 300 R I Bp, and Hako Scrubmaster B400 RH.

## Evidence design

Each record follows `content/equipment/README.md` and contains at least five primary sources, six representative models, four published brand links, explicit market scope, engineering checks, procurement decisions and standards boundaries. IEC 63327:2021 is used only for automatic commercial floor-treatment safety scope; IEC 60335-2-72:2021 is used for powered commercial floor-treatment machines; IEC 60335-2-69:2021 is used where commercial vacuum safety scope is directly relevant.

Manufacturer specifications, manuals, official brochures and current product pages remain the factual layer. WCB recommendations are labelled as assessment, include limitations and buyer action, and never convert a model claim into a category-wide fact. No OEM, factory, component supplier, software-provider or cross-model compatibility relationship is inferred.

## Visual design

Reuse the current equipment layout unchanged. Each profile receives:

- one official `hero.webp` at 1600 x 1000 from a matching product or operating scene;
- two official WebP content images at 1500 x 900 or larger;
- desktop `component-verification-map.svg` at 1600 x 1000;
- mobile `component-verification-map-mobile.svg` at 800 x 1600.

The diagrams emphasize verification zones rather than copied machine anatomy. Autonomous pages show navigation sensors, cleaning or pickup hardware, power/docking boundaries, human intervention and software/reporting dependencies. The combination page shows separate sweeping, debris, solution, agitation and recovery systems. Every diagram states that family labels do not establish cross-model compatibility.

## Publication and validation

Records begin as `draft` and may change to `published` only after the focused equipment suite, every project test script, content-classification verification, production build, desktop 1440 px review, mobile 390 px review, zero broken local assets, no horizontal overflow and no new browser errors pass. Preview must be ready before GitHub merge. Production deployment uses only the GitHub `main` integration, followed by live route, asset and sitemap checks.

