# Conversion Efficiency Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 World Clean Biz 现有 Tally 询盘入口升级为统一、可归因、可防重、有备用路径的五类业务转化漏斗。

**Architecture:** 以 `lib/leadTracking.ts` 作为唯一事件和业务分组定义层，`components/LeadForms.tsx` 负责 CTA 曝光、点击、Tally 打开、提交、成功和错误。各页面只传入业务意图，Blog CTA 复用同一追踪通道。

**Tech Stack:** Next.js 15 App Router、React、TypeScript、Tally popup/embed、GA4 `gtag`、Node test runner。

## Global Constraints

- 网站文案保持纯英文，设计与交付文档使用中文。
- 不更换 Tally 表单 ID，不修改 Tally 表单内部问题。
- 不改写文章正文或文章内配图。
- 不引入新依赖、CRM、数据库或新后端。
- 不增加未经确认的回复时间、客户数或转化率。
- 只通过 GitHub 分支触发 Vercel Preview，禁止 `vercel --prod`。

---

### Task 1: 统一转化归因模型

**Files:**
- Modify: `lib/leadTracking.ts`
- Test: `tests/leadTracking.test.mjs`

**Interfaces:**
- Produces: `ConversionGroup`、`getConversionGroup(formType)`、`buildContactFallbackUrl(attribution)`。
- Produces: `LeadAttribution.conversion_group` 与 `LeadAttribution.conversion_value`。
- Consumes: 现有 `LeadFormType`、`createLeadAttribution`、`buildTallyUrl`、`trackLeadEvent`。

- [ ] **Step 1: 写入失败测试**

```js
test("lead form types map to stable business conversion groups", () => {
  assert.equal(getConversionGroup("sourcing"), "sourcing");
  assert.equal(getConversionGroup("reports"), "reports");
  assert.equal(getConversionGroup("wce_exhibitor"), "expo");
  assert.equal(getConversionGroup("wce_visitor"), "expo");
  assert.equal(getConversionGroup("contact"), "contact");
  assert.equal(getConversionGroup("newsletter"), "newsletter");
});

test("lead attribution includes conversion reporting fields", () => {
  const result = createLeadAttribution({
    formType: "sourcing",
    sourcePage: "/sourcing",
    ctaLocation: "sourcing_footer"
  });
  assert.equal(result.conversion_group, "sourcing");
  assert.equal(result.conversion_value, 0);
});

test("contact fallback preserves conversion context", () => {
  assert.equal(
    buildContactFallbackUrl({ conversion_group: "reports", cta_location: "reports_footer" }),
    "/contact?intent=reports&source=reports_footer"
  );
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/leadTracking.test.mjs`

Expected: FAIL，提示新函数或字段尚未定义。

- [ ] **Step 3: 实现最小归因模型**

```ts
export type ConversionGroup =
  | "sourcing"
  | "reports"
  | "expo"
  | "contact"
  | "newsletter";

export function getConversionGroup(formType: LeadFormType): ConversionGroup {
  if (formType === "wce_exhibitor" || formType === "wce_visitor") return "expo";
  return formType;
}

export function buildContactFallbackUrl({
  conversion_group,
  cta_location
}: Pick<LeadAttribution, "conversion_group" | "cta_location">) {
  const params = new URLSearchParams({
    intent: conversion_group,
    source: cta_location
  });
  return `/contact?${params.toString()}`;
}
```

`createLeadAttribution` 将 `conversion_group` 设为 `getConversionGroup(formType)`，将 `conversion_value` 设为 `0`。`LeadEventParameters` 允许成功事件覆盖为 `1`。

- [ ] **Step 4: 验证新旧测试**

Run: `node --test tests/leadTracking.test.mjs`

Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add lib/leadTracking.ts tests/leadTracking.test.mjs
git commit -m "feat: unify conversion attribution"
```

### Task 2: 共享 CTA 漏斗与备用路径

**Files:**
- Modify: `components/LeadForms.tsx`
- Modify: `components/BlogConversionCta.tsx`
- Modify: `app/globals.css`
- Test: `tests/conversionEfficiency.test.mjs`

**Interfaces:**
- Consumes: `getConversionGroup`、`buildContactFallbackUrl`、`createLeadAttribution`、`trackLeadEvent`。
- Produces: 所有 `TallyButton` 统一的首次曝光、点击、成功防重和备用链接行为。

- [ ] **Step 1: 创建失败测试**

```js
test("shared Tally buttons own the complete conversion funnel", async () => {
  assert.match(leadFormsSource, /IntersectionObserver/);
  assert.match(leadFormsSource, /"cta_view"/);
  assert.match(leadFormsSource, /"cta_click"/);
  assert.match(leadFormsSource, /conversion_value: 1/);
  assert.match(leadFormsSource, /submittedRef/);
  assert.match(leadFormsSource, /buildContactFallbackUrl/);
  assert.match(leadFormsSource, /Use the Contact page instead/);
});

test("Blog CTA does not send a second click or view event", async () => {
  assert.doesNotMatch(blogCtaSource, /useEffect/);
  assert.doesNotMatch(blogCtaSource, /onClickTrack/);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/conversionEfficiency.test.mjs`

Expected: FAIL，因为共享曝光与备用链接尚未实现。

- [ ] **Step 3: 实现共享漏斗**

`TallyButton` 内部增加：

```ts
const triggerRef = useRef<HTMLSpanElement>(null);
const viewedRef = useRef(false);
const submittedRef = useRef(false);

useEffect(() => {
  const node = triggerRef.current;
  if (!node || viewedRef.current) return;
  const sendView = () => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackLeadEvent("cta_view", buildEventPayload());
  };
  if (!("IntersectionObserver" in window)) {
    sendView();
    return;
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) {
      sendView();
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  observer.observe(node);
  return () => observer.disconnect();
}, [ctaLocation, form, inquiryIntent, inquiryType, productCategory, reportId]);
```

点击时总是记录一次 `cta_click`。Tally `onSubmit` 使用 `submittedRef` 防重，`form_success` 追加 `conversion_value: 1`。异常状态显示：

```tsx
<Link href={fallbackUrl}>Use the Contact page instead</Link>
```

Blog CTA 删除自己的 `useEffect` 和 `onClickTrack`，只通过 `eventContext` 把文章字段交给 `TallyButton`。

- [ ] **Step 4: 增加备用链接样式**

```css
.lead-form-status a {
  color: currentColor;
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

- [ ] **Step 5: 运行相关测试**

Run: `node --test tests/leadTracking.test.mjs tests/blogConversion.test.mjs tests/conversionEfficiency.test.mjs`

Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add components/LeadForms.tsx components/BlogConversionCta.tsx app/globals.css tests/conversionEfficiency.test.mjs
git commit -m "feat: track the complete CTA funnel"
```

### Task 3: 补齐业务意图和表单前预期

**Files:**
- Modify: `lib/blogConversion.ts`
- Modify: `lib/inquiryConversion.ts`
- Modify: `app/page.tsx`
- Modify: `app/reports/page.tsx`
- Modify: `app/world-clean-expo/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `components/LeadForms.tsx`
- Test: `tests/conversionEfficiency.test.mjs`

**Interfaces:**
- Consumes: `TallyButton` 现有 `inquiryType`、`inquiryIntent`、`productCategory`、`reportId` 属性。
- Produces: 五类业务入口可区分的稳定上下文。

- [ ] **Step 1: 扩展失败测试**

```js
test("primary business CTAs preserve specific inquiry context", async () => {
  assert.match(homeSource, /inquiryIntent="exhibitor_interest"/);
  assert.match(homeSource, /inquiryIntent="visitor_interest"/);
  assert.match(expoSource, /inquiryIntent="exhibitor_interest"/);
  assert.match(expoSource, /inquiryIntent="visitor_interest"/);
  assert.match(contactSource, /inquiryType=\{item\.value\}/);
  assert.match(reportsSource, /reportId="next-decade-cleaning-growth"/);
});

test("conversion panels explain audience input and next step", async () => {
  assert.match(leadFormsSource, /For relevant business requests/);
  assert.match(leadFormsSource, /company, market and business objective/);
  assert.match(contactSource, /routes it to the relevant team/);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/conversionEfficiency.test.mjs`

Expected: FAIL，指向尚未补齐的字段或文案。

- [ ] **Step 3: 补齐业务上下文**

- 首页 Expo 两个按钮分别增加 `exhibitor_interest` 和 `visitor_interest`。
- World Clean Expo 页所有展商/观众入口使用与首页相同的意图值。
- Reports 当期报告入口传入 `next-decade-cleaning-growth`。
- Contact 继续使用 `item.value` 区分 sourcing、expo、media 和 general。
- Blog sourcing CTA 增加 `inquiry_intent=article_product_research`；Expo CTA 增加 `visitor_interest`。

- [ ] **Step 4: 补充克制的表单前说明**

Reports、Expo、Newsletter 共享面板增加与其业务匹配的一行说明。Contact 的下一步文案使用：

```text
World Clean Biz reviews each relevant inquiry and routes it to the relevant team based on sourcing, Expo, media, or business intent.
```

- [ ] **Step 5: 运行页面与转化测试**

Run: `node --test tests/conversionEfficiency.test.mjs tests/inquiryConversion.test.mjs tests/expoConversion.test.mjs tests/reportsAcquisition.test.mjs tests/homepageStructure.test.mjs`

Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add lib/blogConversion.ts lib/inquiryConversion.ts app/page.tsx app/reports/page.tsx app/world-clean-expo/page.tsx app/contact/page.tsx components/LeadForms.tsx tests/conversionEfficiency.test.mjs
git commit -m "feat: clarify conversion paths"
```

### Task 4: 全量回归、页面验收与 Preview

**Files:**
- Verify only: all changed files

**Interfaces:**
- Consumes: Tasks 1–3 的完整实现。
- Produces: 可供用户验收的 Vercel Preview。

- [ ] **Step 1: 运行全部自动化测试**

Run: `node --test --test-reporter=dot tests/*.test.mjs`

Expected: 全部 PASS，0 failure。

- [ ] **Step 2: 运行正式构建**

Run: `npm run build`

Expected: Next.js 编译、类型检查和所有静态页面生成通过。

- [ ] **Step 3: 检查代码与工作区**

Run: `git diff --check && git status --short`

Expected: 无空白错误；只存在本批计划内文件和已知未跟踪 `.superpowers/`。

- [ ] **Step 4: 本地真实页面验收**

验证流程：

```text
Home / Sourcing / Reports / World Clean Expo / Contact / Blog article
→ primary CTA visible
→ click opens the correct Tally form or a safe fallback
→ page remains usable without console errors
```

桌面端：1280 × 720。手机端：390 × 844。

- [ ] **Step 5: 提交最终验收修正**

```bash
git add app/globals.css components/LeadForms.tsx
git commit -m "fix: finalize conversion experience"
```

如未产生修正，不创建空提交。

- [ ] **Step 6: 推送功能分支并等待 Preview**

Run: `git push -u origin codex/conversion-efficiency-optimization`

Expected: GitHub 推送成功，Vercel Preview 状态为 Ready。

- [ ] **Step 7: 交付用户验收**

汇报修改效果、文件、测试、构建、桌面/手机验收和 Preview 链接。未获得“可以发布”前不合并 `main`。
