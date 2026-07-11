# World Clean Biz 内容体验与全站优化设计方案

## 一、目标

在主要商业页面和视觉系统已经完成升级后，将 Blog、Archive、文章详情模板、移动端、转化链路、SEO 与加载性能统一到同一质量标准。

本批次不重写文章正文、不修改文章事实、不替换文章内部图片，只优化公共页面结构、公共组件、页面样式、元数据、结构化数据和用户路径。

## 二、方案选择

采用“统一内容系统”方案：Blog 首页负责发现内容，Archive 负责快速查找，文章详情负责阅读和自然转化。三者共享卡片、分类、作者和业务入口规则，避免每个页面独立堆叠模块。

不采用以下方案：

- 只调整 CSS：无法解决重复侧栏、内容发现和 SEO 结构问题。
- 全面重写 Blog：风险过大，也会影响已经发布的 175 篇以上文章。

## 三、Blog 首页

- 首屏增加清晰的编辑定位、文章总量和两个主要业务入口。
- Featured Article 保留，但提升图片、标题、摘要和元信息层级。
- 分类入口改为更克制、可横向滚动的筛选条。
- 文章列表保持分页，统一图片比例、标题高度、摘要长度和按钮位置。
- 删除桌面端与移动端重复渲染的整套侧栏，只保留一套响应式侧栏。
- 侧栏顺序为：免费报告、Denny 行业背景、热门品牌、最新文章、Archive。
- Blog 底部保留独立 Newsletter，不与文章类型 CTA 混用。

## 四、Archive

- 增加文章总量与分类概览，帮助用户理解内容覆盖面。
- 提供返回 Blog、Reports 和 Sourcing 的明确入口。
- 列表改为紧凑的编辑档案样式，统一日期、分类、标题、摘要和阅读时间。
- 保持所有文章可访问，不增加客户端搜索依赖。

## 五、文章详情模板

- 增加可见面包屑、发布日期、阅读时间和作者信息。
- 保留文章封面、Key Points、正文、FAQ、视频和标签。
- 改善正文最大宽度、标题节奏、表格、引用、列表和移动端排版。
- 作者区域加入 Denny 的真实身份、行业经验与 About 入口。
- Related Articles 加入缩略图和一致卡片层级。
- 根据文章分类继续自动显示 Sourcing、Reports、Expo 或 Newsletter CTA。
- 不在正文中插入新的销售模块，避免破坏阅读。

## 六、移动端

- Blog 筛选条可横向滚动，不换成多行密集标签。
- Featured、文章列表、侧栏、Archive 和 Related Articles 在 390px 下单列显示。
- 标题不溢出，图片不横向裁切，表格允许局部横向滚动。
- CTA 按钮在移动端使用全宽布局。

## 七、转化链路

- Blog 首页：Reports、Sourcing、Newsletter 三类入口分开。
- 文章详情：由文章分类自动决定唯一主要 CTA。
- Archive：仅提供轻量 Reports 和 Sourcing 入口，不弹出表单。
- 所有表单继续复用现有 Tally 与 GA4 追踪，不更改表单地址和数据传输逻辑。

## 八、SEO 与结构化数据

- Blog 首页增加 `CollectionPage`、`ItemList` 和 `BreadcrumbList`。
- Archive 增加 `CollectionPage`、`ItemList` 和面包屑结构化数据。
- 文章详情补充 author URL、publisher logo、keywords、articleSection、isPartOf。
- 分页和筛选参数保持 `noindex,follow`，Canonical 指向 `/blog`。
- 不改变现有文章 URL。

## 九、性能

- Featured 和文章主封面优先加载。
- Feed、侧栏、Related 图片使用延迟加载和异步解码。
- 移除重复移动端侧栏 DOM。
- 不新增第三方依赖、客户端状态库或大型脚本。

## 十、验证

- 新增内容体验、SEO、移动端和转化结构测试。
- 运行全部 Node 测试。
- 运行 Next.js 正式构建并确认 192 个页面。
- 检查 `git diff --check`。
- 本地验证 Blog、Archive 和至少三篇不同分类文章。
- 检查桌面端 1440px 与移动端 390px。
- 推送新功能分支并等待 Vercel Preview，正式发布仍需用户最终确认。
