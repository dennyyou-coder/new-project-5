# World Clean Biz Sourcing 产品机会获客漏斗实施计划

> **执行要求：** 使用 `superpowers:executing-plans` 按任务执行；每项修改先写失败测试，再完成实现。

**目标：** 将 Sourcing 页面从普通采购介绍页重构为“产品机会发现 -> Free Product Opportunity Shortlist -> B2B Lead 留资”的核心商业漏斗。

**架构：** 页面使用服务端 React 静态内容呈现商业叙事，复用现有 Tally 表单作为唯一留资通道。扩展现有 Lead attribution，记录 `inquiry_intent` 和产品机会品类。弹窗表单继续使用 Tally Popup，底部表单通过 Tally iframe 嵌入同一表单。

**技术栈：** Next.js 15 App Router、React 19、TypeScript、Tally Embed、GA4、Node.js 内置测试器。

## 全局限制

- 不修改首页、Header、Footer、Blog、Contact、Reports、World Clean Expo、About 和文章页。
- 不新建 Product Opportunities 列表页或产品型号页。
- 网站页面保持纯英文；设计和实施文档使用中文。
- 仅使用真实 Denny 图片和真实产品图，不把 AI 生成运营现场当作业绩证据。
- 市场数字明确标注为 World Clean Biz industry estimate。
- 12–15 个月到 6–8 个月的判断仅适用于快速变化的清洁设备品类。
- 不使用无条件全球合规保证、无证据客户数、供应商数或爆品成果。
- 首次表单不上传文件，Email 必填，WhatsApp 选填。
- 询盘、Lead、Blog、首页回归测试和正式构建必须全部通过。
- 不使用 `vercel --prod`；Preview 确认前不合并 `main`。

## 文件映射

- 修改 `docs/superpowers/specs/2026-07-11-wcb-sourcing-opportunity-funnel-design.md`：中文设计规范。
- 修改 `lib/leadTracking.ts`：增加 `inquiry_intent` attribution。
- 修改 `components/LeadForms.tsx`：弹窗意图传递和底部内嵌表单。
- 修改 `lib/inquiryConversion.ts`：六类产品机会定义。
- 重写 `app/sourcing/page.tsx`：新的机会发现漏斗。
- 修改 `app/globals.css`：完全限定在 Sourcing Opportunity 页的响应式样式。
- 修改 `tests/leadTracking.test.mjs`：意图 attribution 和 URL 序列化。
- 修改 `tests/inquiryConversion.test.mjs`：页面结构、文案边界、产品范围和表单路径。
- 修改 `docs/operations/wcb-sourcing-contact-preview-checklist.md`：记录新漏斗验证结果。

---

### 任务 1：扩展 Lead 意图追踪

**修改：** `lib/leadTracking.ts`、`components/LeadForms.tsx`、`tests/leadTracking.test.mjs`

- [ ] 先在 `tests/leadTracking.test.mjs` 增加失败测试：`createLeadAttribution()` 接收 `inquiryIntent: "opportunity_discovery"` 后返回 `inquiry_intent`，`buildTallyUrl()` 需序列化该字段。
- [ ] 运行 `npm run test:lead`，确认因字段缺失而失败。
- [ ] 在 `LeadAttribution`、`AttributionInput` 和 `createLeadAttribution()` 中增加 `inquiry_intent` / `inquiryIntent`，默认为空字符串。
- [ ] 给 `TallyButton` 增加可选 `inquiryIntent` prop，传入弹窗隐藏字段与全部相关事件。
- [ ] 运行 `npm run test:lead`，确认通过。

### 任务 2：定义新的产品机会范围

**修改：** `lib/inquiryConversion.ts`、`tests/inquiryConversion.test.mjs`

- [ ] 先写失败测试，要求六类为 `Robotic Cleaning Products`、`Floor Care Equipment`、`Vacuum Cleaners`、`Commercial Cleaning Equipment`、`Outdoor Cleaning Products`、`New & Emerging Products`。
- [ ] 确认六个 `value` 唯一，`ctaLocation` 以 `sourcing_opportunity_` 开头。
- [ ] 运行 `npm run test:inquiry`，确认旧定义导致失败。
- [ ] 更新定义，复用现有真实产品图片，不创建新路由。
- [ ] 运行 `npm run test:inquiry`，确认通过。

### 任务 3：实现底部 Tally 内嵌表单

**修改：** `components/LeadForms.tsx`、`tests/inquiryConversion.test.mjs`

- [ ] 先写失败源码测试，要求导出 `TallyInlineEmbed`，使用 `buildTallyUrl()` 传递 attribution，并且仅在 Tally 真实提交消息后记录 `form_submit` 与 `form_success`。
- [ ] 运行 `npm run test:inquiry`，确认因组件缺失而失败。
- [ ] 实现 `TallyInlineEmbed`：客户端构建嵌入 URL，接收 `form`、`ctaLocation`、`inquiryIntent`、`productCategory`、`title` 和 `className`。
- [ ] 过滤 `https://tally.so` 的 `message` 事件，仅当表单 ID 匹配时处理 Tally 真实提交。
- [ ] iframe 带有准确 `title`、允许属性和移动端高度，不使用强制提交或伪成功事件。
- [ ] 运行 `npm run test:inquiry` 和 `npm run test:lead`。

### 任务 4：重写 Sourcing 商业叙事与 SEO

**修改：** `app/sourcing/page.tsx`、`tests/inquiryConversion.test.mjs`

- [ ] 先写失败测试，要求以下关键内容：机会导向 Hero、两类访客意图、WCB 市场估算、`Then vs Today`、开发周期压缩、Denny 四类信号、Free Product Opportunity Shortlist、六类机会、完整交付、两种合作、Denny/团队分工、内嵌表单和五个 FAQ。
- [ ] 增加负面断言：不出现旧的 `A Better Brief Creates A Better Search`、不出现无证据绝对化声明、不把市场数字写成第三方统计。
- [ ] 运行 `npm run test:inquiry`，确认旧页面失败。
- [ ] 重写页面，每个 CTA 传入正确 `ctaLocation`、`inquiryIntent`、`trackClick`。
- [ ] 使用真实 Denny 与品类图片；流程使用语义化列表和 CSS 信息图。
- [ ] 更新 title、description、canonical、Open Graph 与 Twitter metadata，核心关键词聚焦 `cleaning product opportunities`、`China cleaning product sourcing`、`OEM/ODM`。
- [ ] 运行 `npm run test:inquiry`。

### 任务 5：建立完全隔离的 Sourcing Opportunity 视觉系统

**修改：** `app/globals.css`

- [ ] 所有新样式使用 `.sourcing-opportunity-page` 命名空间，不复用旧 `sourcing-v3-cta` 等会冲突的区块类。
- [ ] 实现行业情报 + Denny 个人权威的深蓝、白色、高亮蓝系统。
- [ ] 将 `Then vs Today`、供应链变化、信号到执行与九步交付流程做成可线性降级的响应式信息图。
- [ ] 桌面端保持适中页面长度，通过紧凑网格合并相关内容，不把 12 个区块做成 12 个过大满屏。
- [ ] 390px 将所有对比与流程变成单列，表单 iframe 全宽，无水平溢出。
- [ ] 按钮、卡片和 FAQ `details` 具备可见 `:focus-visible`。

### 任务 6：验证表单实际限制并更新清单

**修改：** `docs/operations/wcb-sourcing-contact-preview-checklist.md`

- [ ] 记录当前 Tally Sourcing 表单实际字段与设计差距。
- [ ] 网站代码可以嵌入和传递意图，但 Company/Website/Country/Product/Contact/Email/WhatsApp 的显示字段与必填状态需在 Tally 后台配置。
- [ ] 如当前 Tally 仍包含强制 Role、强制 Product Category 或 Supplier 角色，在 Preview 交付中明确标记该外部配置差距，不假称表单已完成。
- [ ] 不提交真实测试 Lead，除非用户在操作时明确授权。

### 任务 7：完整验证与 Preview

- [ ] 运行：

```bash
npm run test:inquiry && npm run test:lead && npm run test:blog && npm run test:homepage && npm run build && git diff --check
```

- [ ] 检查 `/sourcing` 的 1440×1000 和 390×844 整页：首屏、数字、对比、流程、Denny 图片、产品图片、FAQ、弹窗与内嵌表单。
- [ ] 确认无水平溢出、无文字低对比、无破图、无控制台错误，键盘焦点可见。
- [ ] 检查首页、Contact、Blog 不受新样式影响。
- [ ] 提交并推送 `codex/sourcing-contact-conversion`，等待 Git 触发的 Vercel Preview Ready。
- [ ] 线上验证页面标题、canonical、核心文案与图片。
- [ ] 返回同一 Preview 链接供用户确认，不合并 `main`。
