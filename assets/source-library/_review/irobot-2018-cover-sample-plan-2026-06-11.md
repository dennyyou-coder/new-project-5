# iRobot 2018 Cover Sample Plan - 2026-06-11

Scope: sample-cover planning for `irobot-2018-annual-report-faithful-translation`.

Rule: this plan does not generate images, update article files, or replace the live cover.

## Objective

Create one sample cover to validate the next World Clean Biz cover system before batch cover replacement resumes.

The sample should prove that a weak old cover can be replaced by a cleaner business-analysis visual using:

- article-native data;
- verified brand/product assets;
- a restrained editorial layout;
- no annual-report screenshot as final artwork.

## Article

```text
content/insights/irobot-2018-annual-report-faithful-translation.mdx
```

Current cover:

```text
/images/insights/irobot-2018-annual-report-faithful-translation-image-01.png
```

Current cover problem:

```text
378x172
too small
non-16:9
uses body-image filename
annual-report screenshot style
```

## Recommended Visual Direction

Template:

```text
Template E: Data Visual
Secondary influence: Template B Market Analysis
```

Core message:

```text
2018 was iRobot's strong year before the pressure cycle.
```

Cover title:

```text
iRobot 2018 Annual Report
```

Optional short line:

```text
Roomba-led growth before the competitive reset
```

## Canvas

Output target:

```text
1600x900 JPG
1600x900 PNG source/export
```

Proposed future output paths if approved:

```text
public/images/insights/irobot-2018-annual-report-faithful-translation-cover-v2.jpg
assets/source-library/_review/cover-samples/irobot-2018-cover-sample-v1.png
assets/source-library/_review/cover-samples/irobot-2018-cover-sample-v1.jpg
```

Do not change the article `coverImage` until the sample is approved.

## Layout Structure

Recommended layout:

```text
Left 60%: data card and key numbers
Right 40%: Roomba product layer / product silhouette
Top: small World Clean Biz / Annual Report Reading label
Bottom: source/unit line
```

Composition:

1. Top-left label: `ANNUAL REPORT READING`
2. Main title: `iRobot 2018 Annual Report`
3. Key insight block: `A strong Roomba-led year before competition intensified`
4. Main number: `USD 1.092B`
5. Supporting data row:
   - `+23.6% revenue growth`
   - `USD 105.8M operating income`
   - `USD 88.0M net income`
   - `25M+ consumer robots sold`
6. Right-side product layer: Roomba photo, lightly cropped, not dominant over data.
7. Bottom source line: `Source: iRobot 2018 Annual Report / article translation`

## Data To Use

Use only article-native values:

```text
2018 revenue: USD 1.092B / USD 1,092.6M
2017 revenue: USD 883.9M
Revenue growth: 23.6% / 24%
Operating income: USD 105.8M
Operating income growth: 46%
Net income: USD 88.0M
Net income growth: 73%
Diluted EPS: USD 3.07
Consumer robots sold over 17 years: 25M+
U.S. household penetration estimate: 11%
Global household penetration estimate: single digits
```

Primary numbers for the cover:

```text
USD 1.092B
+23.6%
USD 105.8M
25M+
```

Avoid overcrowding the cover with all values.

## Existing Assets

Approved / usable for sample planning:

```text
assets/source-library/brands/irobot/products/irobot-roomba-max-705-media-kit-black.jpg
assets/source-library/brands/irobot/products/irobot-roomba-max-705-media-kit-white.jpg
assets/source-library/brands/irobot/logos/irobot-media-kit-logo-black-web.jpg
assets/source-library/brands/irobot/logos/irobot-media-kit-logo-black-print.jpg
```

Use notes:

- Product image is modern Roomba Max 705, not a 2018 Roomba i7/i7+.
- It can be used as a generic iRobot/Roomba product layer for sample validation.
- If user later downloads a 2018-era official Roomba i7/i7+ image, replace the product layer before final publication.

## Asset Gaps

Best final version still needs:

```text
official high-resolution iRobot vector logo
official 2018-era Roomba i7 / i7+ product image
optional Braava / Terra visual if a broader portfolio version is needed
```

Do not block the sample on these gaps. The sample's job is to validate cover system direction, not final publication.

## Style Guardrails

Use:

- white / graphite / muted red accent;
- precise financial typography;
- clean data card hierarchy;
- product layer with enough breathing room;
- Bloomberg / CB Insights discipline.

Avoid:

- blue-glow robotics style;
- AI-generated robot illustration;
- annual-report screenshot as the full visual;
- overlaid paragraph text;
- portrait photo of Colin Angle;
- too many product photos.

## Approval Checklist

Before this sample becomes a live cover:

```text
1600x900 output exists
text readable at blog-card size
no article content changed
no unsupported data added
product image source noted
old cover retained until replacement is approved
npm run build passes after any article cover change
```

## Next Step After This Plan

If approved, create only the sample files under:

```text
assets/source-library/_review/cover-samples/
```

Then review visually before touching:

```text
content/insights/irobot-2018-annual-report-faithful-translation.mdx
public/images/insights/
```
