# First Batch Article Data Visual Plan

Review date: 2026-06-10

This plan converts article-used data into WCB-native visuals under Template E: Data Visual.

Do not use annual report / investor deck screenshots as the image itself. Use those sources only to verify numbers and source labels.

Template E rule:

```text
Title + chart + data-specific key insight + key numbers + unit/source label.
```

## Priority Visuals

| Priority | Article | Visual | Type | Status | Notes |
|---:|---|---|---|---|---|
| 1 | `sharkninja-road-to-10-billion-dollars` | 2022 vs 2024 Shark / Ninja sales split | bar-chart | generated-for-review | Generated as `sharkninja-sales-split/sharkninja-sales-split-v1.png` and `.jpg`. |
| 2 | `irobot-financial-crisis` | iRobot debt stack and deadline risk | risk-card / stacked-bar | generated-for-review | Generated as `irobot-debt-risk/irobot-debt-risk-v1.png` and `.jpg`. |
| 3 | `aiper-fluidra-pool-robotics-alliance` | Aiper / Fluidra alliance economics | data-card | generated-for-review | Generated as `aiper-fluidra-alliance/aiper-fluidra-alliance-v1.png` and `.jpg`. |
| 4 | `maytronics-robotic-pool-cleaner-reinvention` | Maytronics revenue peak and reset | line-chart / data-card | generated-for-review | Generated as `maytronics-revenue-reset/maytronics-revenue-reset-v1.png` and `.jpg`. |
| 5 | `maytronics-robotic-pool-cleaner-reinvention` | Pool robot penetration | line-chart | ready-for-design | Robot pool usage 4.4M 2020 -> 5.4M 2021 -> 7.0M 2023; penetration 16% -> 19% -> 23%. |
| 6 | `dyson-new-product-review-2025` | Dyson 2025 product table | comparison-table | ready-for-design | Product specs/prices are article-native and suited to a compact comparison table. |
| 7 | `beatbot-in-leifeng-coverage` | Beatbot financing and strategic allocation | data-card | needs-author-check | Article uses Starlight naming; confirm whether this should be Beatbot / Beatbot Innovation before design. |
| 8 | `roborock-road-to-100-billion-rmb` | Roborock growth path | line-chart / data-card | needs-author-check | Article has possible unit conflicts: title says RMB 100B, text says RMB 10B; several RMB totals appear off by one zero. Do not design until author confirms numbers. |

## Article Notes

### SharkNinja

Recommended visual:

```text
Two-year grouped bar chart:
2022: Shark 2.0, Ninja 1.7, Total 3.7
2024: Shark 2.6, Ninja 2.9, Total 5.5
Unit: USD billion
```

Generated files:

```text
assets/source-library/data-visuals/sharkninja-sales-split/sharkninja-sales-split-v1.png
assets/source-library/data-visuals/sharkninja-sales-split/sharkninja-sales-split-v1.jpg
```

Optional data cards:

```text
International sales: USD 1.7B
Engineers/designers: 1,000+
Patents: 5,200+
Supply-chain countries: China / Thailand / Vietnam / Singapore / Malaysia / others
```

Current key insight:

```text
Ninja contributed 67% of total growth between 2022 and 2024.
```

### iRobot

Recommended visual:

```text
Debt / cash risk card:
Santrum debt: USD 190.7M
Picea payables: USD 161.5M
Overdue portion: USD 90.9M
Cash and equivalents: USD 24.8M
Debt: USD 205.3M
Critical date: Jan 15, 2026
```

Generated files:

```text
assets/source-library/data-visuals/irobot-debt-risk/irobot-debt-risk-v1.png
assets/source-library/data-visuals/irobot-debt-risk/irobot-debt-risk-v1.jpg
```

Current key insight:

```text
Picea exposure was 14.2x the cash balance.
```

### Aiper / Fluidra

Recommended visual:

```text
Alliance data card:
Fluidra investment: about USD 100M
Stake: 27%
Aiper 2024 sales: USD 195M
Aiper 2024 growth: 75%
2027 sales target: > USD 400M
2023-2027 expected CAGR: nearly 40%
Fluidra 2025 revenue: EUR 2.184B
Fluidra Pool & Wellness share: 98%
```

Generated files:

```text
assets/source-library/data-visuals/aiper-fluidra-alliance/aiper-fluidra-alliance-v1.png
assets/source-library/data-visuals/aiper-fluidra-alliance/aiper-fluidra-alliance-v1.jpg
```

Current key insight:

```text
Fluidra bought 27% access to a 2x growth path.
```

### Maytronics

Recommended visuals:

```text
Revenue reset line:
2019: RMB 2.05B
2021: RMB 3.38B
2022: RMB 4.32B
2025 actual: RMB 3.4B
2025 target: RMB 6.52B
```

Generated files:

```text
assets/source-library/data-visuals/maytronics-revenue-reset/maytronics-revenue-reset-v1.png
assets/source-library/data-visuals/maytronics-revenue-reset/maytronics-revenue-reset-v1.jpg
```

Current key insight:

```text
2025 revenue missed target by RMB 3.12B.
```

```text
Private pool robot pressure card:
2024 private pool robot revenue: RMB 2.85B
2025 private pool robot revenue: RMB 2.33B
Revenue change: -17.9%
Gross margin: 36.5% -> 23.9%
```

### Dyson

Recommended visual:

```text
Product comparison table:
V16 Piston Animal: 900W, 315AW, GBP 749
PencilVac: 38mm diameter, 0.08L dust cup, RMB 4,000
V8 Cyclone: +30% suction to 150AW, +50% battery life
Spot+Scrub Ai: estimated GBP 1,500-2,000
HushJet Purifier: 24 dBA, 5-year filter, USD 349.99
Cool CF1: 29 dB, GBP 249.99
AirWrap Co-anda 2X: 30% higher power
```

### Beatbot

Recommended visual after naming check:

```text
Financing / allocation card:
Recent financing: RMB 1B
Original plan: RMB 300-500M
Lawn robot investment plan: RMB 500M over two years
Robot vacuum entry threshold mentioned: RMB 5B excess funds
Future competitive landscape: 4-5 top players
```

Naming risk:

```text
The article still says Starlight Innovation. Confirm whether final visual should say Beatbot, Beatbot Innovation, Starlight, or another legal/entity name.
```

### Roborock

Do not design yet.

Author check needed:

```text
Title says RMB 100B, article first line says RMB 10B by 2030.
2024 sales: USD 1.19B / 12.3% global market.
2025 projected market: USD 19.1B and 14.5% share.
The article says this translates to RMB 193.87B, but 19.1 * 14.5% * 7 is about RMB 19.39B.
Later RMB 202B / 282B / 401B / 552.9B / 738B / 1.03T figures may need unit confirmation.
```

After confirmation, Roborock can become:

```text
market target path chart
share expansion chart
valuation/ambition data card
```
