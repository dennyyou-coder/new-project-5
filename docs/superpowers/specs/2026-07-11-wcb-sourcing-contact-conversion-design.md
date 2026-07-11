# World Clean Biz Sourcing 与 Contact 转化设计

日期：2026-07-11

状态：设计已确认，等待文档复核

## 目标

本批修复 Sourcing 页面六个无效品类入口，并把 Sourcing 与 Contact 收敛为清晰、可追踪、可回退的询盘路径。

首页、Header、Footer、Blog、文章内容、Reports、World Clean Expo、About、全站架构和已有正式素材不在本批修改范围内。

## 已确认问题

- Sourcing 六个品类卡片指向不存在的 `/sourcing/*` 路由，正式站全部返回 404。
- Sourcing 页面自身渲染 `<main>`，与根布局的 `<main id="main-content">` 嵌套。
- Contact 在同一页面重复提供四类入口、三类路由卡片和最终通用按钮。
- Contact 直接输出多个 Tally 外链，绕过站内弹窗、统一来源参数、状态反馈和事件追踪。
- Sourcing 与 Contact 缺少页面级 canonical 和社交分享图。

## 方案

采用集中配置与页面级组件。Sourcing 和 Contact 使用一套明确的询盘入口定义，页面负责展示，现有 `TallyButton` 继续负责弹窗、回退、来源字段和真实提交回调。

不新建六个 Sourcing 子页面，不保留指向未实现页面的链接。

## Sourcing 页面

保留现有六个品类卡片、文案和图片：

- Pool Robots
- Lawn Robots
- Floor Washers
- Robotic Vacuums
- Commercial Cleaning
- Vacuum Cleaners

每张卡片改为语义正确、可键盘操作的按钮。点击后直接打开 Sourcing Tally 表单，并附带：

- `product_category`
- `source_page=/sourcing`
- 品类专属 `cta_location`
- 当前 UTM 参数
- `language=en`

移除页面内部 `<main>`，改用普通页面容器，使根布局成为唯一 `<main>`。

首屏、中段和页尾三个通用 Sourcing CTA 保留，继续使用清晰且稳定的 `cta_location`。它们不附带具体品类。

## Contact 页面

保留一轮四类入口：

1. Sourcing Inquiry
2. Expo Inquiry
3. Media Inquiry
4. General Inquiry

四个入口均使用站内 Tally 弹窗：

- Sourcing → `sourcing`
- Expo → `expo`
- Media → `contact`
- General → `contact`

每次打开携带：

- `inquiry_type`
- `source_page=/contact`
- 入口专属 `cta_location`
- 当前 UTM 参数
- `language=en`

删除下方重复的三类路由卡片以及依赖查询参数的通用 `Talk With Denny` 按钮。

下方区域改为简洁的提交说明：用户应准备的信息、提交后的处理方式和跟进预期。不得承诺无法保证的具体回复时限。

按钮文案必须与入口一致，不使用同一个通用文案掩盖不同询盘意图。

## 数据与事件

扩展现有归因字段，增加可选字段：

- `product_category`
- `inquiry_type`

字段必须同时进入：

- Tally popup `hiddenFields`
- Tally 独立链接回退 URL
- `cta_click`
- `form_open`
- `form_submit`
- `form_success`
- `form_error`

只有 Tally 的真实提交回调可以触发 `form_submit` 和 `form_success`。按钮点击和弹窗打开不得模拟成功。

追踪不可用时，表单功能必须继续工作。

## 组件边界

- 集中询盘配置：定义类型、表单、按钮文案、追踪值。
- Sourcing 品类入口组件：展示品类卡片并传递 `product_category`。
- Contact 入口组件：展示四类入口并传递 `inquiry_type`。
- 现有 `TallyButton`：只扩展通用可选上下文字段，不加入 Sourcing 或 Contact 页面判断。

不得把本批页面逻辑放入 Header、Footer 或首页组件。

## SEO

Sourcing 与 Contact 分别补充：

- 页面级 canonical
- Open Graph 标题、说明、URL 和正式分享图
- Twitter summary large image

分享图只使用仓库中现有正式行业图片，不新增或下载素材。

Sourcing 不再向爬虫暴露六个 404 品类链接。Sitemap 不增加不存在的子路由。

## 交互、失败与可访问性

- 品类卡片和 Contact 入口使用 `<button>`，不伪装成链接。
- 键盘可到达并激活所有入口。
- 焦点状态清楚，按钮名称说明即将打开的询盘类型。
- Tally 脚本不可用时打开携带相同归因字段的独立链接。
- 弹窗被阻止或配置缺失时显示现有可访问状态信息。
- 390px 宽度不得横向溢出。
- 两页都只允许根布局提供一个 `<main>`。

## 验证

本地验证：

1. 六个 Sourcing 品类不再输出 `/sourcing/*` 链接。
2. 六个品类分别携带正确的 `product_category` 与 `cta_location`。
3. Contact 只保留四个入口，每个入口打开正确表单。
4. Contact 不再输出重复路由卡片或直接 Tally 链接。
5. Sourcing 和 Contact 分别只有一个根布局 `<main>`。
6. canonical、Open Graph 和 Twitter metadata 正确。
7. 归因字段可序列化到 Tally 回退 URL 并进入 GA4 事件。
8. 桌面端和 390px 移动端无横向溢出。
9. 键盘、焦点、弹窗与失败回退通过检查。
10. 首页保护测试、线索测试、第二批专项测试和生产构建通过。

发布验证：

1. 推送功能分支并由 GitHub 触发 Vercel Preview。
2. 在 Preview 验证两页视觉、移动端、四类 Contact 路径、六类 Sourcing 路径、Tally 与 GA4 DebugView。
3. 用户明确确认 Preview 后才通过 GitHub 合并 `main`。
4. 由 Vercel 从 `main` 自动部署正式站。
5. 正式站检查 `/sourcing`、`/contact`、分享图、表单与事件。
6. 禁止使用 `vercel --prod`。

## 验收标准

1. Sourcing 六个 404 入口全部消失。
2. 六个品类进入 Sourcing 表单且可区分品类。
3. Contact 从重复两轮选择收敛为一轮四类入口。
4. 四类 Contact 入口进入正确表单且可区分询盘类型。
5. 两页无嵌套 `<main>`。
6. 两页 canonical 与分享信息正确。
7. 点击、弹窗、提交、成功和错误事件携带正确业务上下文。
8. 首页、Header、Footer 和其他页面内容没有变化。
9. 自动测试、生产构建、桌面端、390px 和键盘验证通过。

## 发布边界

固定流程为：功能分支 → 本地测试与构建 → GitHub → Vercel Preview → 用户确认 → 合并 `main` → Vercel 自动部署 → 正式站验证。

未经用户确认 Preview，不合并 `main`；常规发布不直接执行 `vercel --prod`。
