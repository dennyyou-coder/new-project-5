# 正式站审核问题修复实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 一次性修复正式站表单配置、Canonical、Sourcing 分类卡片追踪、市场估算说明和 Lawn Robots 相关文章卡片一致性问题，并发布可验证的 Preview。

**实现方式：** 沿用现有 `TallyButton`、`leadTracking` 和 Sourcing 独立样式体系。新增一个职责单一的客户端分类卡片组件，复用现有归因函数；其余改动保持在既有页面和配置文件中，不重构共享架构。

**技术栈：** Next.js 15、React、TypeScript、Node Test Runner、Vercel。

## 全局限制

- 保留 `USD 40B+ → USD 140B` 数字不变。
- 不修改共享导航、Footer、路由结构、依赖或无关页面。
- 不虚构第三方市场来源；只明确 World Clean Biz 编辑估算的方法、范围和时间。
- 所有新增 Sourcing 样式必须继续使用现有页面作用域。
- 先发布 Preview 并提供链接，未经用户确认不发布 Production。

---

### 任务 1：建立审核问题回归测试

**文件：**
- 新建：`tests/productionAuditFixes.test.mjs`
- 测试：`tests/productionAuditFixes.test.mjs`

**接口：**
- 读取：`lib/tallyForms.ts`、`app/page.tsx`、`app/reports/page.tsx`、`app/sourcing/page.tsx`、`components/SourcingOpportunityCard.tsx`、`components/SourcingProductPage.tsx`、`app/globals.css`
- 产出：覆盖五项审核问题的静态回归断言。

- [ ] **步骤 1：编写失败测试**

测试必须断言：

```js
assert.match(tallyFormsSource, /newsletter: defineForm\("xX1xZJ"/);
assert.match(tallyFormsSource, /wceExhibitor: defineForm\("XxklMV"/);
assert.match(homeSource, /alternates:\s*\{ canonical: "\/" \}/);
assert.match(reportsSource, /alternates:\s*\{ canonical: "\/reports" \}/);
assert.match(sourcingSource, /SourcingOpportunityCard/);
assert.match(cardSource, /trackLeadEvent\("cta_view"/);
assert.match(cardSource, /trackLeadEvent\("cta_click"/);
assert.match(cardSource, /inquiryIntent: "category_exploration"/);
assert.match(sourcingSource, /Approx\. USD 40B\+/);
assert.match(sourcingSource, /Toward USD 140B/);
assert.match(sourcingSource, /directional editorial estimate/);
assert.match(productPageSource, /article\.coverImage/);
assert.match(productPageSource, /Read the analysis →/);
assert.match(stylesSource, /sourcing-lawn-related-image/);
```

- [ ] **步骤 2：运行测试并确认正确失败**

运行：`node --test tests/productionAuditFixes.test.mjs`

预期：FAIL，失败原因是表单 ID、Canonical、追踪组件、估算说明或 Lawn Robots 图片尚未实现，而不是语法错误。

---

### 任务 2：修复公开表单配置和 Canonical

**文件：**
- 修改：`lib/tallyForms.ts`
- 修改：`app/page.tsx`
- 修改：`app/reports/page.tsx`
- 测试：`tests/productionAuditFixes.test.mjs`

**接口：**
- 保持 `getTallyForm(key)` 返回结构不变。
- Homepage 与 Reports 继续使用根布局的 `metadataBase`，只新增相对 canonical。

- [ ] **步骤 1：写入最小实现**

```ts
newsletter: defineForm("xX1xZJ", "newsletter"),
wceExhibitor: defineForm("XxklMV", "wce_exhibitor"),
```

Homepage 新增 `Metadata` 导入和：

```ts
export const metadata: Metadata = {
  alternates: { canonical: "/" }
};
```

Reports 的现有 metadata 新增：

```ts
alternates: { canonical: "/reports" },
```

- [ ] **步骤 2：运行回归测试**

运行：`node --test tests/productionAuditFixes.test.mjs`

预期：表单和 Canonical 断言通过，其余未实现断言仍失败。

---

### 任务 3：实现 Sourcing 分类卡片归因追踪

**文件：**
- 新建：`components/SourcingOpportunityCard.tsx`
- 修改：`app/sourcing/page.tsx`
- 测试：`tests/productionAuditFixes.test.mjs`

**接口：**
- 输入：单个 `SourcingCategory`。
- 输出：外观不变的 Next.js 内部链接。
- 复用：`createLeadAttribution()` 与 `trackLeadEvent()`。

- [ ] **步骤 1：实现客户端组件**

组件使用 `IntersectionObserver` 的 `threshold: 0.35` 记录一次 `cta_view`，并在链接点击时记录 `cta_click`。归因输入固定为：

```ts
createLeadAttribution({
  formType: "sourcing",
  sourcePage: window.location.pathname,
  ctaLocation: item.ctaLocation,
  language: document.documentElement.lang || "en",
  search: window.location.search,
  productCategory: item.value,
  inquiryIntent: "category_exploration"
});
```

追踪不可阻止链接跳转；`window.gtag` 不存在时沿用 `trackLeadEvent()` 的安全返回。

- [ ] **步骤 2：替换 Sourcing 页面六个直接 Link**

将 `SOURCING_CATEGORIES.map()` 中的卡片 JSX替换为：

```tsx
<SourcingOpportunityCard item={item} key={item.value} />
```

- [ ] **步骤 3：运行回归测试**

运行：`node --test tests/productionAuditFixes.test.mjs`

预期：表单、Canonical、追踪断言通过；内容说明和 Lawn Robots 图片断言仍失败。

---

### 任务 4：补充估算说明并统一 Lawn Robots 相关文章卡片

**文件：**
- 修改：`app/sourcing/page.tsx`
- 修改：`components/SourcingProductPage.tsx`
- 修改：`app/globals.css`
- 测试：`tests/productionAuditFixes.test.mjs`

**接口：**
- 保留显示数字及既有卡片链接。
- 相关文章图片使用 `article.coverImage`，缺失时回退到现有 Lawn Robots 图片。

- [ ] **步骤 1：扩展编辑估算说明**

说明文字采用：

```text
World Clean Biz Industry Estimate. This is a directional editorial estimate, not audited market data. The 2026 reference view frames major global indoor and outdoor cleaning equipment categories at less than RMB 300 billion today and toward RMB 1 trillion over approximately the next decade; USD values are approximate conversions.
```

- [ ] **步骤 2：给 Lawn Robots 相关文章加入图片**

每个 article 内新增：

```tsx
<img
  className="sourcing-lawn-related-image"
  src={article.coverImage || "/images/sourcing/lawn-robots/rm-03-awd-slope.png"}
  alt={article.coverImage ? `Cover image for ${article.title}` : "Robotic lawn mower product platform under industry assessment"}
/>
```

链接文字统一为 `Read the analysis →`。

- [ ] **步骤 3：增加作用域样式**

在 Lawn Robots Related Intelligence 现有作用域附近新增图片比例、`object-fit: cover`、卡片溢出和内容间距规则，保持按钮仍在底部对齐。

- [ ] **步骤 4：运行回归测试并确认全部通过**

运行：`node --test tests/productionAuditFixes.test.mjs`

预期：PASS，全部新增断言通过。

---

### 任务 5：全量验证、提交与 Preview

**文件：**
- 验证所有本批文件。

**接口：**
- 产出：Git 提交、Vercel Preview URL、验证结果。

- [ ] **步骤 1：运行全量测试**

依次运行：

```bash
npm run test:lead
npm run test:blog
npm run test:homepage
npm run test:inquiry
node --test tests/productionAuditFixes.test.mjs
```

预期：全部 PASS，0 failures。

- [ ] **步骤 2：运行生产构建**

运行：`npm run build`

预期：Next.js 编译、类型检查和全部静态页面生成成功。

- [ ] **步骤 3：检查改动范围并提交**

运行：

```bash
git diff --check
git status --short
git diff --stat
git add tests/productionAuditFixes.test.mjs lib/tallyForms.ts app/page.tsx app/reports/page.tsx components/SourcingOpportunityCard.tsx app/sourcing/page.tsx components/SourcingProductPage.tsx app/globals.css docs/superpowers/plans/2026-07-14-production-audit-fixes.md
git commit -m "fix: resolve production audit issues"
```

预期：只提交本计划列出的文件。

- [ ] **步骤 4：推送分支并等待 Vercel Preview Ready**

推送当前 `codex/integrate-july10-12` 分支，获取由 Git 集成生成的 Preview，确认状态为 Ready。

- [ ] **步骤 5：对 Preview 运行专项验证**

运行：

```bash
BASE_URL="$PREVIEW_URL" npm run verify:sourcing-seo
```

并检查首页、Reports、Sourcing、Lawn Robots 的 Canonical、表单 ID、图片状态和内部链接。

- [ ] **步骤 6：向用户交付 Preview**

返回 Preview 链接、修改文件、测试和构建结果；不发布 Production，等待用户确认。
