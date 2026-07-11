# WCB Sourcing And Contact Preview Verification

Date: 2026-07-11

Status: Local verification passed; Vercel Preview verification pending.

## Automated Checks

- [x] Inquiry tests: 5 passed
- [x] Lead tests: 8 passed
- [x] Blog regression tests: 8 passed
- [x] Homepage regression tests: 9 passed
- [x] Production build: 192 routes generated

## Sourcing

- [x] Six category buttons render
- [x] No `/sourcing/*` links remain
- [x] Each definition has a unique `product_category` and CTA location
- [x] Exactly one root-layout `<main>`
- [x] Canonical is `/sourcing`
- [x] Social metadata uses an existing industry image
- [x] Desktop 1440 × 1000: no overflow, zero broken images
- [x] Mobile 390 × 844: no overflow, zero broken images

### 产品机会漏斗更新

- [x] 主定位为 `Free Product Opportunity Shortlist`，不再是普通供应商搜索。
- [x] 机会发现和明确产品两条路径分别传递 `inquiry_intent`。
- [x] 六类宽口径产品机会传递唯一 `product_category`。
- [x] 底部使用同一 Tally Sourcing 表单的内嵌版本。
- [x] 内嵌表单 URL 包含来源、CTA、UTM、品类与意图 attribution。
- [x] 内嵌表单仅在 Tally 真实 `Tally.FormSubmitted` 消息后记录提交与成功。
- [x] 页面公开区分 8 小时首次联系与通常 1–2 工作日初步推荐。
- [x] 页面明确仅面向 B2B 买家。

### Tally 外部配置差距

- [ ] 当前 Tally Sourcing 表单仍需在 Tally 后台调整为：Company Name 必填、Website 选填、Country / Target Market 必填、Product or Category of Interest 必填、Contact Name 必填、Email 必填、WhatsApp 选填。
- [ ] 当前公开表单仍强制 Role 和 Product Category，且 Role 包含 Supplier；这与低摩擦 B2B 买家表单设计不一致。
- [ ] Tally 后台需新增并验证 `inquiry_intent` 隐藏字段。

## Contact

- [x] Exactly four inquiry buttons render
- [x] Sourcing, Expo, Media and General map to the correct form keys
- [x] No direct Tally links remain in rendered HTML
- [x] Duplicate route list and query-driven ContactForm removed
- [x] Exactly one root-layout `<main>`
- [x] Canonical is `/contact`
- [x] Social metadata uses an existing industry image
- [x] Desktop 1440 × 1000: no overflow, zero broken images
- [x] Card text wraps inside each card without horizontal clipping
- [x] Mobile 390 × 844: no overflow, zero broken images

## Events And Accessibility

- [x] `product_category` and `inquiry_type` serialize into fallback URLs
- [x] New page buttons opt into exactly one `cta_click`
- [x] Existing Tally callbacks remain the only `form_submit` and `form_success` source
- [x] Category and inquiry cards use native buttons
- [x] Scoped `:focus-visible` outline exists
- [ ] Confirm popup hidden fields and GA4 events on Vercel Preview
- [ ] Confirm protected Preview screenshots after deployment

## Scope Regression

- [x] Homepage tests pass unchanged
- [x] Blog tests pass unchanged
- [x] Header and Footer not modified
- [x] No unrelated page or article changed

## Release Gate

Do not merge to `main` until Vercel Preview is READY and the user approves it.
