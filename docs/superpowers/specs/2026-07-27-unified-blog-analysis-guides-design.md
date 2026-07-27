# World Clean Biz 统一 Blog 首页设计

日期：2026-07-27  
状态：设计已确认，待实施  
适用站点：worldcleanbiz.com

## 1. 设计结论

主导航继续保留 `Blog`，不再单独显示 `Guides`。`/blog` 同时承担三项任务，但通过独立区域建立明确层级：

1. 顶部固定展示 Denny 的连载文章。
2. 展示 6 篇 World Clean Biz 深度分析。
3. 展示 6 篇实用指南。

三类内容不混排，也不共用一个按发布时间排序的文章流。

本设计更新 `2026-07-26-blog-editorial-guides-separation-design.md` 中关于主导航和 Blog 首页呈现方式的决定；原有 `content_class`、`guide_type`、文章 URL、Guides 分类页与归档规则继续保留。

## 2. 用户目标

- 读者进入 Blog 后，第一眼看到 World Clean Biz 的长期连载和原创行业判断。
- 批量发布的搜索型文章不会覆盖深度文章的展示位置。
- Guide 仍然拥有足够的站内曝光和直接阅读入口。
- 页面结构简单，不要求读者先理解 Blog 与 Guides 的内部分类。
- 已收录文章和 Guides 资料库不因首页合并而改变 URL。

## 3. 页面结构

### 3.1 Blog 页面引导

页面顶部保留简短的 Blog 标题和定位说明，表达两类内容：

- industry intelligence / deep analysis
- practical decision guides

该引导不能占用过多首屏空间，核心视觉位置留给连载。

### 3.2 固定连载专区

连载专区位于所有普通文章之前，视觉优先级最高。

当前固定连载：

- `series`: `building-worlds-no-1-cleaning-show-from-scratch`
- `series_title`: `Building the World’s No.1 Cleaning Show from Scratch`

展示内容：

- 连载名称
- 最新一期编号和标题
- 连载简介或最新一期摘要
- 最新一期封面
- `Read latest episode` 入口
- `View all episodes` 入口

选择最新一期时，优先按数值化后的 `series_episode` 从高到低排序；缺少合法期号时再以 `sortDate` 作为回退。

连载发布新一期后，Blog 首页自动更新，不依赖手动修改页面代码。

为了避免重复展示，该连载的所有期数不进入首页下方 6 篇 Deep Analysis 网格；它们仍保留在文章归档和连载文章页的 All Episodes 导航中。

### 3.3 Deep Analysis

连载专区下方展示 6 篇 `content_class: "editorial"` 的文章：

- 桌面端每排 3 篇，共 2 排。
- 平板端可根据可用宽度变为每排 2 篇。
- 手机端每排 1 篇。
- 按 `sortDate` 倒序展示。
- 排除固定连载的全部期数。
- 不包含任何 `content_class: "search"` 的文章。

每张卡片展示：

- 封面图
- 文章类别
- 标题
- 发布时间或阅读时长
- 可选的简短摘要

封面、标题和卡片主体都应进入同一个文章链接，保证整张卡片可点击，同时保留清晰的键盘焦点状态。

区块右上角设置 `View all analysis`，链接至 `/blog/archive#analysis`。

### 3.4 Practical Guides

Deep Analysis 下方展示 6 篇 `content_class: "search"` 的指南：

- 桌面端每排 3 篇，共 2 排。
- 平板端每排 2 篇。
- 手机端每排 1 篇。
- 优先按现有 `guide_priority` 展示高价值指南。
- 未设置优先级时，以 `sortDate` 倒序补足至 6 篇。
- 不包含任何 editorial 文章。

每张卡片展示：

- 封面图
- 对读者有意义的 Guide 类型
- 标题
- 简短用途说明或阅读时长

封面、标题和卡片主体全部可点击进入现有 `/blog/[slug]` 文章详情页。

区块右上角设置 `Browse all guides`，链接至 `/guides`。

### 3.5 取消 Blog 首页侧边栏

新版 Blog 首页不再保留原有侧边栏，以确保两个 3 列文章网格拥有足够宽度，并避免 Latest Articles、Practical Guides 与首页主内容重复。

原侧边栏能力按以下方式重新安置：

- 分类、品牌筛选和完整文章浏览：保留在 `/blog/archive`。
- Latest Articles：由首页 6 篇 Deep Analysis 取代。
- Practical Guides：由首页 6 篇 Guide 主区块取代。
- Newsletter：放在两个文章区块之后，使用全宽横向模块。
- Reports、Sourcing 等业务入口：使用 Newsletter 后方的简洁全宽业务入口，不恢复侧栏。
- 相关文章：继续保留在文章详情页。

最终首页内容顺序为：

1. Blog 页面引导
2. 固定连载
3. 6 篇 Deep Analysis
4. 6 篇 Practical Guides
5. Newsletter
6. 简洁业务入口

## 4. 导航与现有页面

- 桌面端和移动端主导航移除独立 `Guides` 项。
- 主导航保留 `Blog`，作为分析和指南的统一入口。
- `/guides` 页面继续存在、保持可索引，并承载全部 Guide 和六个 Guide 分类入口。
- `/guides/[type]` 等现有分类页继续保留。
- `/blog/archive` 继续保留完整文章档案。
- 文章详情 URL 全部保持 `/blog/[slug]`，不做迁移或重定向。
- Blog 页、Guide 区块、页脚和相关文章模块继续提供普通链接到 `/guides`，避免该资料库成为孤立页面。

## 5. 内容选择规则

首页内容由现有结构化字段自动选择，不根据标题猜测：

| 区域 | 必要字段 | 排序 | 首页数量 |
|---|---|---|---:|
| 固定连载 | 指定 `series` | `series_episode`，回退 `sortDate` | 1 个最新一期 |
| Deep Analysis | `content_class: editorial` | `sortDate` 倒序 | 6 |
| Practical Guides | `content_class: search` | `guide_priority`，再以 `sortDate` 补足 | 6 |

当某一区域不足 6 篇时，只展示实际可用内容，不用另一类内容补位。

## 6. SEO 与可访问性

- `/blog` canonical 保持不变。
- `/guides` canonical、Sitemap 和分类页保持不变。
- 首页 ItemList 结构化数据顺序必须与可见顺序一致：最新连载、6 篇分析、6 篇指南。
- 不修改文章发布日期制造新鲜度。
- 所有卡片使用服务端输出的普通链接，不依赖点击脚本才能访问。
- 卡片链接具有可见的 hover 和 keyboard focus 状态。
- 标题层级保持单一 H1；连载、Deep Analysis 和 Practical Guides 使用 H2。
- 图片保留合理的尺寸比例和描述性替代文本，避免布局跳动。

## 7. 响应式规则

- 桌面端：3 列卡片，两个区域各 2 排。
- 中等屏幕：2 列卡片，保持内容顺序。
- 手机端：1 列卡片，顺序为连载、Deep Analysis、Practical Guides。
- 移动端不使用横向滑动隐藏文章。
- 连载 Hero 在小屏幕上先显示图片或标题均可，但 CTA 必须在不展开内容的情况下可见。

## 8. 验收标准

1. Blog 顶部固定显示指定连载的最新一期。
2. 新增更高 `series_episode` 后，最新一期自动替换。
3. Deep Analysis 恰好最多展示 6 篇，桌面端为 3×2。
4. Practical Guides 恰好最多展示 6 篇，桌面端为 3×2。
5. 固定连载不在 Deep Analysis 首页网格重复出现。
6. 每张文章卡片的封面、标题和主体均可点击。
7. `View all analysis` 可进入完整分析归档。
8. `Browse all guides` 可进入 `/guides`。
9. 主导航只显示 Blog，不再显示独立 Guides。
10. `/guides`、Guide 分类页和所有文章 URL 仍可正常访问和收录。
11. 桌面、平板、手机均无横向溢出或不可访问的卡片。
12. 构建、分类检查、相关页面测试和预览检查全部通过后，才进入生产部署。
13. Blog 首页不存在 sidebar 或重复的 Latest Articles、Practical Guides 模块。
14. Newsletter 与业务入口以全宽模块出现在两个文章区块之后。

## 9. 风险控制

### 固定连载长期不更新

即使连载更新频率较低，固定区仍作为创始人视角和品牌故事入口存在；页面不使用“最新发布”等容易过时的时间承诺，只表达 `Latest episode`。

### Guide 从主导航移除后内部链接减少

Blog 首页固定展示 6 篇 Guide，并保留 `Browse all guides`；页脚、归档和相关文章继续提供 Guides 入口。

### 首页内容过长

每类内容严格限制为 6 篇，不在首页继续分页；完整内容进入各自归档。摘要长度和图片比例统一，避免卡片高度差异过大。

### 连载与普通分析重复

首页 Deep Analysis 明确排除指定 `series` 的全部期数；连载内容通过自身入口和 Archive 访问。
