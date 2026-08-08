# Equipment Technical Profiles Batch 06 Design

## Objective

Publish three evidence-backed equipment database pages through the approved World Clean Biz technical-profile system:

- `/equipment/industrial-dust-extractor`
- `/equipment/upright-commercial-vacuum`
- `/equipment/escalator-cleaner`

This batch extends industrial dust control, carpet-focused commercial vacuuming and specialist transport-infrastructure cleaning coverage. It does not create SEO articles, ownership records, brand records, component profiles or a new page architecture.

## Selection rationale

- Industrial Dust Extractor answers tool connection, dust class, filtration, filter cleaning, airflow monitoring and disposal questions that an ordinary commercial vacuum page cannot resolve.
- Upright Commercial Vacuum isolates brush-roll carpet cleaning, nozzle adjustment, filtration, manoeuvrability and operator-effort questions from tub, canister, backpack and robotic vacuums.
- Escalator Cleaner covers dedicated tread, riser and moving-walkway cleaning systems whose fit, positioning, moisture recovery and site procedures differ materially from ordinary floor machines.

## Identity boundaries

### Industrial Dust Extractor

Include commercial or industrial dust extractors documented for connection to dust-generating tools or for controlled collection of task-specific dust. Exclude ordinary housekeeping vacuums and any use for combustible, explosive, asbestos or other hazardous dust unless the exact machine, configuration and jurisdictional controls are approved. Dust class, filter efficiency, airflow, vacuum, tool socket, filter cleaning and disposal method remain model- and market-specific.

Representative models are Festool CTM 36 EI AC, Hilti VC 40M-X, Makita VC4210M, Metabo ASR 35 M ACP, Bosch Professional GAS 35 M AFC and Milwaukee AS 42 MAC.

### Upright Commercial Vacuum

Include corded or battery commercial upright vacuums whose floor head, brush roll and dirt receptacle travel as one operator-guided assembly. Exclude domestic uprights, canisters, backpacks, wide-area machines, robots and wet extraction. Keep brush height, cleaning width, carpet suitability, hard-floor capability, filtration, sound, cord or battery runtime and above-floor tools configuration-specific.

Representative models are Kärcher CV 38/2 Adv, Nilfisk VU500 12 and VU500 15, Lindhaus RX eco FORCE 380e, Tornado CK 14/1 Pro, and Truvox Valet Battery Upright II.

### Escalator Cleaner

Include dedicated machines officially documented for escalator steps, risers or moving walkways. Distinguish dry tread cleaning, wet tread cleaning, riser-only cleaning and machines that progress step-by-step from stationary machines that rely on the conveyance moving. Exclude manual brushes, ordinary scrubber-dryers and any claim of universal fit without model-specific setup and site approval.

Representative models are Kärcher BR 47/35 Esc and BR 52/11 ESC, Columbus Step 110 and Travel 600, Truvox Cimex X46, Eureka EC52 and Eureka ERC45.

## Evidence design

Each record follows `content/equipment/README.md` and contains at least five primary sources, six to eight representative models, at least four published brand links, explicit market scope, engineering checks, procurement decisions and standards boundaries. IEC 60335-2-69:2021 is used for commercial vacuum and dust-extractor safety scope; IEC 60335-2-72:2021 is used only where powered commercial floor-treatment scope applies; ASTM F608-24 is a laboratory carpet embedded-dirt method, not a general performance ranking; OSHA 29 CFR 1926.1153 is limited to United States construction silica tasks; ASME A17.1/CSA B44 is a North American conveyance safety baseline, not a cleaning-machine approval.

Manufacturer specifications, manuals, official brochures and current product pages remain the factual layer. WCB recommendations are labelled as assessment, include limitations and buyer action, and never convert a model claim into a category-wide fact. No OEM, factory, component supplier or cross-model compatibility relationship is inferred.

## Visual design

Reuse the current equipment layout unchanged. Each profile receives one official 1600 x 1000 Hero, two official content photos at 1500 x 900 or larger, and responsive WCB verification diagrams at 1600 x 1000 desktop and 800 x 1600 mobile. Diagrams show verification zones and state that family labels do not establish cross-model compatibility.

## Publication and validation

Records begin as `draft` and may become `published` only after focused and global tests, production build, 1440 px desktop review, 390 px mobile review, zero broken local assets, no horizontal overflow and no new browser errors pass. Preview must be ready before GitHub merge. Production deploys only from GitHub `main` through the Vercel Git integration.
