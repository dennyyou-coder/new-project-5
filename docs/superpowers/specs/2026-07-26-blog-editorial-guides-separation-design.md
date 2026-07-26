# World Clean Biz Blog 与 Guides 内容分层设计

日期：2026-07-26
状态：待最终审查
适用站点：worldcleanbiz.com

## 1. 背景

World Clean Biz 目前将深度行业文章与面向搜索需求的常青文章统一展示在 `/blog`，并主要按 `sortDate` 倒序排列。批量 SEO 发布频率提高后，新发布的产品对比、购买指南、Who Owns、OEM 与成本类文章会占据 Blog 前几页，削弱读者进入 Blog 时对 World Clean Biz 原创分析能力和行业影响力的第一印象。

现有 345 篇可见文章中，部分新 SEO 文章带有 `delivery_format: "wcb_search_article"`，但较早的 Who Owns、品牌关系和其他搜索型文章没有统一字段；同时，少数深度文章也使用过搜索文章流程字段。因此，不能继续用发布时间、标题或旧流程字段作为长期分类依据。

## 2. 目标

1. 让 `/blog` 成为 World Clean Biz 的行业观点、原创研究和深度分析入口。
2. 让搜索型文章拥有独立、清晰、可浏览的 `/guides` 入口，而不是被埋在 Blog 后几十页。
3. 保留全部现有文章 URL，避免改变已收录页面、外链和用户书签。
4. 确保每篇重要文章仍可通过普通站内链接和 Sitemap 被发现。
5. 为后续批量 SEO 发布与日常深度文章发布建立强制、可自动检查的分类字段。

## 3. 非目标

- 不移动或重命名现有 `/blog/[slug]` 文章 URL。
- 不删除、合并或 `noindex` 任何已发布文章。
- 不在本次改造中重写文章正文。
- 不以页面设计变化掩盖低质量内容；内容质量仍由各自写作流程负责。
- 不向读者显示“SEO文章”这一内部生产术语。

## 4. 推荐信息架构

### 4.1 Blog：Analysis & Insights

`/blog` 只聚合 `content_class: "editorial"` 的文章，包括：

- 行业趋势与市场判断
- 企业与品牌战略分析
- 原创研究与数据推演
- 人物采访与企业故事
- 展会观察和现场洞察
- 有明确作者观点的深度专题

展示规则：

- Featured Article 必须来自 editorial 文章。
- 主文章流只包含 editorial 文章。
- `Latest Articles` 侧栏只包含 editorial 文章。
- 分类和品牌筛选只在 editorial 集合内生效。
- 分页以 editorial 集合单独计算，每页 10 篇。
- editorial 集合内部按 `sortDate` 倒序；同一时间时以 slug 作为稳定的第二排序键。

### 4.2 Guides：实用研究与采购入口

新增 `/guides`，聚合 `content_class: "search"` 的文章。页面对外使用 `Guides`、`Industry Guides` 或具体栏目名，不出现 SEO 标签。

首期栏目：

1. Buying Guides
2. Brand Ownership
3. Product Comparisons
4. OEM & Sourcing
5. Maintenance & Troubleshooting
6. Technology & Market Explainers

对应 `guide_type`：

- `buying`
- `ownership`
- `comparison`
- `sourcing`
- `maintenance`
- `explainer`

Guides 首页由两层组成：

- 顶部：少量人工精选的高商业价值指南。
- 下方：按栏目浏览的完整指南列表，各栏目内部按 `sortDate` 倒序。

允许使用可选的 `guide_priority` 正整数控制顶部精选顺序。没有该字段的文章不进入精选区，但仍进入相应栏目。

### 4.3 导航与交叉入口

- 网站主导航增加 `Guides`，与 `Blog` 并列。
- Blog 侧栏或文章流末尾增加一个克制的 `Practical Guides` 模块，展示 3–5 篇高价值指南并链接到 `/guides`。
- Guides 页面提供 `Read Industry Analysis` 返回 Blog。
- 文章正文中的相关推荐可以按主题跨越 editorial 与 search，但必须使用对读者有意义的栏目名称和描述性链接文字。

### 4.4 Archive：完整内容档案

`/blog/archive` 保留全部文章，并提供以下浏览入口：

- All Articles
- Analysis & Insights
- Guides & Comparisons

Archive 不改变文章 URL，只改变列表分组和筛选方式。默认列表先显示 Analysis & Insights，再显示 Guides & Comparisons；各组内部按 `sortDate` 倒序。

## 5. 内容数据模型

在每个可见 MDX 文件的 frontmatter 中增加强制字段：

```yaml
content_class: "editorial"
```

或：

```yaml
content_class: "search"
guide_type: "comparison"
guide_priority: 10
```

规则：

- `content_class` 必须是 `editorial` 或 `search`。
- `search` 文章必须具有合法的 `guide_type`。
- `editorial` 文章不得依赖 `guide_type` 参与 Blog 排序。
- `guide_priority` 可选，只用于 Guides 精选模块，不伪造发布日期。
- `delivery_format`、`article_type` 等旧字段继续保留作生产记录，但不再决定公开展示位置。

内容解析层将以上字段暴露为强类型属性。自动检查必须阻止缺少或填写非法分类字段的新文章进入发布构建，避免未来再次靠标题猜测。

## 6. 历史文章迁移规则

对现有 345 篇文章进行一次性分类，采用“规则初分 + 人工复核例外”的方式。

默认归入 search：

- Who Owns、Who Makes、Where Are ... Made 等明确搜索问答
- 产品或品牌 A vs B 对比
- Buying Guide、Cost、How Much、How Long、Best For 等购买决策内容
- OEM、ODM、Supplier Audit、Manufacturing Cost 等采购操作指南
- 故障排查、维护和定义型问答
- What Is、How It Works 等技术或市场解释型内容
- 已确认属于 WCB 批量 SEO 清单的文章

默认归入 editorial：

- 原创行业观点和趋势判断
- 企业战略、财务、竞争格局和市场结构分析
- 人物采访、企业成长故事和历史专题
- 展会现场观察与编辑评论
- 从中文深度文章忠实改编的英文文章

冲突处理：

- 旧 `delivery_format` 只作为线索，不作为最终结论。
- 当标题形式像搜索文章、但正文包含明显原创研究与核心判断时，进入人工复核。
- 任何不能确定身份的文章不得猜测；进入 `unclassified review` 清单，确认后才写入正式字段。
- 迁移完成后输出 editorial、search、待复核数量和完整 slug 清单，作为发布前审计记录。

## 7. URL、SEO 与抓取保护

- 所有文章继续位于 `/blog/[slug]`。
- `/blog` canonical 保持 `/blog`。
- `/guides` 使用独立 canonical `/guides`。
- `/guides` 加入 Sitemap；现有文章 Sitemap 条目保持不变。
- Blog 与 Guides 的分页使用可抓取的普通链接。
- 筛选或替代排序产生的查询参数页面继续 `noindex, follow`，避免重复列表页面。
- Guides 栏目必须通过普通 `<a href>` 链接覆盖所有 search 文章；不能只依赖站内搜索框或点击后才加载的客户端控件。
- 文章页结构化数据继续使用现有 Article 信息；Blog 和 Guides 分别输出与可见列表一致的 ItemList。
- 不通过修改发布日期制造“新鲜度”；分类变化不改变正文发布日期。

## 8. 页面文案原则

对外不使用：

- SEO Articles
- Search Content
- Traffic Articles

建议使用：

- Industry Guides
- Buyer Guides
- Brand Ownership
- Product Comparisons
- Sourcing & OEM
- Maintenance & Troubleshooting

Blog 的主标题继续强调行业分析、市场判断和专业经验；Guides 的主标题强调帮助买家、渠道商、品牌和行业从业者完成具体决策。

## 9. 自动检查与测试

实施采用测试先行，至少覆盖：

1. `getInsights()` 能解析 `content_class`、`guide_type`、`guide_priority`。
2. 所有可见文章均具有合法 `content_class`。
3. 所有 search 文章均具有合法 `guide_type`。
4. Blog 主列表、Featured、Latest Articles 和筛选结果不包含 search 文章。
5. Guides 页面不包含 editorial 文章。
6. Blog 与 Guides 各自分页数量正确，翻页不丢失或重复文章。
7. Archive 同时包含两类文章，并按分组规则展示。
8. 所有原有 `/blog/[slug]` 页面仍可生成。
9. Sitemap 包含 `/guides` 和全部现有文章 URL。
10. Blog、Guides、Archive 的结构化数据顺序与可见列表一致。
11. 桌面和移动端导航均能访问 Blog 与 Guides。
12. 生产构建、现有测试和新增测试全部通过。

## 10. 验收标准

- 打开 Blog 首页及前几页，只看到 editorial 深度文章。
- 新发布 search 文章不会进入 Blog 列表、Featured 或 Latest Articles。
- 新发布 editorial 文章能按时间进入 Blog 首页。
- `/guides` 能按六个栏目找到全部 search 文章。
- 高商业价值指南可以通过明确字段进入精选区。
- Archive 能查看全部文章。
- 任意现有文章 URL 在改造前后保持一致。
- 不存在未分类的可见文章。
- 页面无横向溢出、明显布局跳动或移动端导航问题。
- 部署前提供分类统计、测试结果和预览页面检查结果。

## 11. 发布与回滚

发布顺序：

1. 完成字段迁移和自动检查。
2. 完成 Blog、Guides、Archive 与导航改造。
3. 本地测试和生产构建。
4. 生成预览部署并检查代表性页面。
5. 获得部署授权后再发布生产环境。

回滚方式：

- 代码层可恢复为原 Blog 聚合逻辑。
- 文章新增的 frontmatter 字段可保留，不影响旧模板。
- 因文章 URL 不变，回滚不涉及重定向或索引地址恢复。

## 12. 主要风险与控制

### 风险一：历史文章误分类

控制：规则仅用于初分；冲突文章进入人工复核清单，不让旧流程字段直接决定结果。

### 风险二：SEO文章内部链接减少

控制：新增 Guides 主导航、六个栏目、Blog 实用指南模块、Archive 分组和 Sitemap，确保重要文章仍有清晰入口。

### 风险三：未来发布流程漏填字段

控制：把合法分类作为自动构建检查，缺失字段时发布失败并给出具体文件名。

### 风险四：Blog 深度文章数量不足导致分页变化

控制：分页基于 editorial 集合重新计算；空页请求回落到最后一个有效页，现有文章详情页不受影响。

### 风险五：新 Guides 页面成为低价值文章堆积页

控制：按用户任务分栏目，顶部只展示人工选定的高价值指南，并保留清晰的买家与行业从业者定位。
