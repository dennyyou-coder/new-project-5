# World Clean Biz Blog 转化与 SEO 第一批设计

日期：2026-07-11

状态：设计已确认，等待文档复核

## 目标

本批优化 Blog 栏目页和文章详情页，把自然搜索与内容阅读流量导向更符合用户当前意图的下一步，同时建立可验证的页面级转化数据。

首页、共享导航、Footer、文章正文、文章标题、slug 和已批准图片均不在本批修改范围内。

## 页面范围

- `/blog`
- `/blog/[slug]`
- 仅服务上述页面的 CTA 配置、事件追踪和样式
- 与上述页面直接相关的 metadata、canonical、Open Graph、结构化数据和移动端表现

不修改 `/`、`/sourcing`、`/reports`、`/world-clean-expo`、`/about`、`/contact` 的页面内容或布局。

## CTA 分流

文章详情页根据现有 `category` 集中映射 CTA，不向每篇文章 frontmatter 增加配置，避免批量改动已批准内容。

| 文章类型 | 主 CTA | 目标意图 |
| --- | --- | --- |
| Buyer Guide、Sourcing Guide、Sourcing | Start A Sourcing Inquiry | 采购与供应商需求 |
| Market Signals、Industry、Supply Chain、Supply Chain Analysis、Commercial Cleaning | Get The Report | 市场情报与报告 |
| Trade Shows | Get Expo Updates | 展会更新 |
| 其他未匹配类型 | Subscribe To Blog Updates | 内容订阅 |

映射必须集中维护，并提供稳定的默认分支。文章页只消费映射结果，不在 JSX 中散落类别判断。

文章末尾只保留一个视觉主 CTA。CTA 包含与意图一致的短标题、说明和按钮，不再统一显示 `Get Free Reports` 与 `Talk With Denny` 两个竞争动作。

## Blog 栏目页

Blog 栏目页继续承担内容发现与筛选，不改现有文章、分页和分类数据。

主转化定位为订阅 Blog 更新，报告入口降为次级内容入口。`Subscribe To Blog Updates` 不再复用报告下载文案；如果本批无法在不修改共享首页行为的前提下建立独立表单，则使用独立的 Blog 专用调用层和明确的回退链接，不修改首页表单。

现有分类与品牌筛选继续工作。移动端重点验证筛选区域是否横向溢出、是否容易返回全部文章，以及 CTA 是否在合理滚动范围内出现。

## 追踪设计

只为 Blog 和文章页面增加页面级事件，不修改首页共享 CTA 行为。

事件包括：

- `cta_view`
- `cta_click`
- `form_open`

参数至少包括：

- `cta_type`
- `cta_location`
- `source_page`
- `article_slug`（仅文章页）
- `article_category`（仅文章页）
- `language`，当前固定为 `en`

只有当 Tally 在 Preview 中提供可验证的父页面成功回调时才记录 `form_success`。不得用按钮点击或弹窗打开模拟提交成功。

追踪失败不得阻止 CTA 打开表单或导航。GA4 不可用时页面功能仍需正常工作。

## SEO

- 修正 Blog 页标题的重复品牌后缀。
- 保持 `/blog` canonical。
- 保持筛选和分页查询参数页面 `noindex, follow` 的现有策略。
- 为 Blog 补充明确的 Open Graph 与 Twitter 分享信息；只使用仓库内已有、适合作为分享图的正式资源。
- 保持文章标题、描述、canonical、BlogPosting、Breadcrumb 和可用 FAQ 结构化数据。
- 检查文章分享图为绝对 URL 且资源可访问。
- 不在本批建立中文路由或 `hreflang`；当前页面继续声明英文。

## 组件边界

新增或调整的逻辑应保持三类清晰职责：

1. CTA 映射：由文章类别得到 CTA 类型和文案。
2. Blog 专用 CTA：负责显示和触发对应动作。
3. Blog 页面追踪：负责安全发送事件，不承担 UI 或内容判断。

不把新逻辑写入共享 Header 或 Footer。若必须调整现有共享 `LeadForms` 才能实现 Tally 事件，则改为建立向后兼容的可选接口，并验证首页渲染与行为没有变化；实施前需再次说明共享组件风险。

## 交互、失败与可访问性

- CTA 必须使用准确的按钮或链接语义。
- 键盘可以到达筛选、分页和 CTA，焦点状态清楚。
- 弹窗脚本不可用时打开对应 Tally 独立链接。
- 追踪脚本失败不影响用户操作。
- 390px 宽度下不得出现页面级横向溢出。
- 文章图片、表格、长链接和 CTA 不得超出正文容器。
- 不根据截图声称完整 WCAG 合规；需要实际键盘、语义和对比度检查。

## 验证

本地验证：

1. 生产构建通过。
2. Blog 列表、筛选、品牌筛选、分页和空状态正常。
3. 至少为四种 CTA 类型各选择一篇文章验证映射。
4. Blog 与文章 metadata、canonical、分享信息和结构化数据正确。
5. GA4 调试环境能看到 `cta_view`、`cta_click` 和 `form_open` 及规定参数。
6. Tally 加载失败回退可用。
7. 桌面端和 390px 移动端无横向溢出，图片与 CTA 正常显示。
8. 键盘操作和焦点状态通过检查。
9. 首页做只读回归验证，确认本批未改变其内容、布局和 CTA 行为。

发布验证：

1. 推送功能分支并生成 Vercel Preview。
2. 在 Preview 检查桌面端、移动端、表单和 GA4 DebugView。
3. 用户确认 Preview 后才合并到 `main`。
4. 由 Vercel 从 `main` 自动部署正式站，禁止使用 `vercel --prod`。
5. 正式站复核页面、事件、表单与无错误链接。

## 验收标准

1. Blog 与文章页之外的页面没有内容或布局变化。
2. 四类文章展示正确且唯一的主 CTA。
3. Newsletter 与报告下载的文案和意图不再混用。
4. 页面级 CTA 事件在 GA4 中可区分文章、类别、位置和 CTA 类型。
5. 不把点击或弹窗打开误报为表单成功。
6. Blog 重复品牌标题被修复，canonical 与分享信息正确。
7. Blog 的筛选、分页、文章结构化数据和现有内容保持正常。
8. 构建、桌面端、390px 移动端、键盘操作和首页回归检查通过。

## 发布边界

固定流程为：功能分支 → 本地测试与构建 → GitHub → Vercel Preview → 用户确认 → 合并 `main` → Vercel 自动部署 → 正式站验证。

未经用户确认 Preview，不合并 `main`；常规发布不直接执行 `vercel --prod`。
