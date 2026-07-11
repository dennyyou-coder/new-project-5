# World Clean Biz 转化效率优化设计

## 1. 目标

在不更换 Tally、不改写文章正文、不引入新依赖的前提下，将现有询盘入口统一为可理解、可追踪、可备用的转化漏斗。

核心成果：

- 访客能更快理解按钮适用对象、将获得什么、下一步会发生什么。
- Google Analytics 能完整区分“看到→点击→打开→提交→成功”。
- Sourcing、Reports、World Clean Expo、Contact 和 Newsletter 使用统一归因字段。
- Tally 配置丢失、弹窗被拦截或脚本未加载时，访客仍有明确的 Contact 备用路径。

## 2. 现状判断

现有代码已具备良好基础：

- 统一 Tally 弹窗与内嵌传输。
- UTM、页面、CTA 位置、产品类别、询盘类型与询盘意图隐藏字段。
- `cta_view`、`cta_click`、`form_open`、`form_submit`、`form_success`、`form_error` 事件。
- Blog 文章按分类映射不同业务 CTA。

当前主要缺口不是“没有表单”，而是：

- 只有部分 CTA 记录曝光和点击，全站漏斗无法横向比较。
- 某些按钮没有补足 `inquiry_type` 或 `inquiry_intent`。
- 表单异常时仅显示文字，没有可直接点击的备用入口。
- 按钮附近对“谁适合”和“将获得什么”的预期说明不一致。
- 成功事件没有统一 GA4 转化标记字段，后续报表配置成本较高。

## 3. 方案范围

### 3.1 统一漏斗事件

保留现有六个事件名，不破坏已有 GA4 报表：

1. `cta_view`：主要 CTA 进入视口。
2. `cta_click`：访客点击 CTA。
3. `form_open`：弹窗、新标签或内嵌表单已打开。
4. `form_submit`：Tally 返回提交回调。
5. `form_success`：站内确认本次转化完成。
6. `form_error`：缺失配置、弹窗被拦截等失败。

所有事件使用同一组基础字段：

- `form_type`
- `source_page`
- `cta_location`
- `language`
- `utm_source`、`utm_medium`、`utm_campaign`、`utm_content`、`utm_term`
- `report_id`
- `product_category`
- `inquiry_type`
- `inquiry_intent`

追加两个报表字段：

- `conversion_group`：统一为 `sourcing | reports | expo | contact | newsletter`。
- `conversion_value`：成功时记录为 `1`，其他漏斗阶段为 `0`。

`response_id` 只用于 Tally 提交确认，不在页面上显示。

### 3.2 曝光追踪

新增一个轻量的共享 CTA 曝光包装组件，使用 `IntersectionObserver`：

- 只在 CTA 首次进入视口时记录一次 `cta_view`。
- 不支持 `IntersectionObserver` 的浏览器直接记录一次，不阻塞按钮。
- 同一组件重新渲染时不重复记录。
- Blog 已有的曝光逻辑迁移到共享机制，避免两次上报。

### 3.3 CTA 业务分类

表单与转化分组映射：

| 入口 | `form_type` | `conversion_group` | 必填上下文 |
| --- | --- | --- | --- |
| Sourcing | `sourcing` | `sourcing` | `inquiry_intent` 或 `product_category` |
| Reports | `reports` | `reports` | `report_id` |
| Expo exhibitor | `wce_exhibitor` | `expo` | `inquiry_intent=exhibitor_interest` |
| Expo visitor | `wce_visitor` | `expo` | `inquiry_intent=visitor_interest` |
| Contact media/general | `contact` | `contact` | `inquiry_type` |
| Newsletter | `newsletter` | `newsletter` | 无额外必填字段 |

当同一 Tally Expo 表单承接不同意图时，使用 `inquiry_intent` 区分，不伪造新表单配置。

### 3.4 降低表单前阻力

统一主要 CTA 附近的三类短说明：

- 适用对象：例如 `For relevant B2B requests`。
- 输入内容：例如公司、市场、产品或商业目标。
- 下一步：例如“World Clean Biz reviews the inquiry and routes it to the relevant team.”

不在按钮周围增加未经确认的回复时间、成功率或客户数字。

### 3.5 备用路径

`TallyButton` 的异常状态改为可操作提示：

- 配置不完整：显示 `Use the Contact page instead`链接。
- 弹窗被拦截：显示 Contact 链接，同时保留 `form_error` 事件。
- 新标签成功打开：显示简短状态，不额外跳转。
- Tally 提交成功：显示感谢信息，防止重复上报成功事件。

备用链接使用 `/contact?intent=<conversion_group>&source=<cta_location>`，Contact 页可根据 `intent` 提示对应询盘通道，但不自动打开表单。

## 4. 文件与边界

预计修改：

- `lib/leadTracking.ts`：转化分组、价值和事件参数。
- `components/LeadForms.tsx`：统一曝光、点击、提交防重、可点击备用路径。
- `components/BlogConversionCta.tsx`：使用共享曝光逻辑，不重复上报。
- `lib/blogConversion.ts`、`lib/inquiryConversion.ts`：补足稳定的业务意图映射。
- `app/contact/page.tsx`：保留四类通道，增加来源说明与表单前预期。
- 首页、Sourcing、Reports、World Clean Expo 的现有主 CTA：只补齐追踪字段和短说明，不重构页面。
- `app/globals.css`：转化说明和异常链接的统一样式。
- `tests/leadTracking.test.mjs`及转化相关测试：新增回归覆盖。

明确不修改：

- Tally 表单 ID 和表单内部问题。
- 文章正文和文章内配图。
- 现有页面 URL、导航和业务名称。
- CRM、邮件自动化或后端数据库。
- 未经确认的客户数、询盘数、回复时间和转化率。

## 5. 数据流

1. 页面为 CTA 提供 `form`、`ctaLocation` 和业务上下文。
2. 共享组件根据表单类型计算 `conversion_group`。
3. CTA 进入视口后上报一次 `cta_view`。
4. 访客点击后创建完整归因对象，同时传入 GA4 和 Tally 隐藏字段。
5. Tally 打开、提交和成功回调继续使用同一归因对象。
6. 异常时记录 `form_error`，并向访客显示带来源参数的 Contact 链接。

## 6. 测试与验收

自动化测试：

- 六个现有事件名保持稳定。
- 六类表单正确映射五类 `conversion_group`。
- `form_success` 使用 `conversion_value=1`，其他事件使用 `0`。
- UTM、产品、报告、询盘类型和意图字段均传入 Tally URL。
- CTA 曝光和 Tally 成功回调均防止重复上报。
- 缺失配置和弹窗被拦截时存在 Contact 备用链接。
- 全部现有测试继续通过。

页面验收：

- 首页、Sourcing、Reports、World Clean Expo、Contact、Blog 文章 CTA 都可正常打开对应 Tally 表单。
- 桌面端和 390px 手机端无溢出、遮挡或不可点击状态。
- 异常状态能进入 Contact 备用路径。
- 浏览器控制台无新增错误。
- Next.js 正式构建通过。

## 7. 发布规则

- 功能分支完成实现和验证后推送 GitHub。
- 只通过 Vercel Preview 交付验收。
- 未获得用户“可以发布”之前不合并 `main`。
- 禁止使用 `vercel --prod`。
