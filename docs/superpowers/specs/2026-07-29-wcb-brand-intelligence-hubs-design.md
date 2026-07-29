# WCB 品牌情报中心设计

日期：2026-07-29

状态：已确认，待实施计划

项目：World Clean Biz

## 1. 背景

World Clean Biz 已经积累了大量围绕清洁电器品牌的公司归属、创始人、产品组合、制造关系、财务表现、渠道战略和竞争分析文章。这些信息目前分散在不同文章中，缺少能够长期承接单一品牌搜索需求的稳定入口。

本项目建立持续更新的英文品牌情报页面，将稳定的公司事实、WCB 的行业判断和相关文章组织在同一 URL 下。页面服务海外买家、经销商和品牌从业者，首要目标是增强 WCB 在清洁行业的权威性并积累自然搜索流量。

## 2. 目标

- 为每个重点品牌建立一个长期存在、持续更新的权威页面。
- 覆盖品牌归属、公司背景、产品组合、制造与供应链、渠道、经营信号和竞争位置等 B2B 搜索意图。
- 把现有及未来的 WCB 文章汇聚到对应品牌页，形成稳定的主题内链。
- 让品牌页具备独立信息价值，不依赖文章列表填充页面。
- 用首批 10 个品牌验证收录、曝光、排名和站内阅读效果，再决定是否扩展到 50 个品牌。

## 3. 非目标

- 不建设消费者产品评测、优惠券、售后评价或购买推荐页面。
- 不为每个长尾关键词建立单独页面。
- 不批量发布字段不完整的品牌空模板。
- 不把 WCB 页面包装成品牌官方网站或官方账号。
- 第一阶段不以采购询盘转化为主要目标。
- 不修改首页、导航或现有文章正文，除非后续实施计划明确列入并获得批准。

## 4. 受众与页面定位

主要受众：

- 海外买家和进口商
- 经销商和零售渠道从业者
- 清洁行业品牌、产品和战略团队
- 供应链、投资和行业研究人员

页面统一定位：

> Independent brand intelligence for cleaning-industry buyers, distributors and industry professionals.

每个页面应清楚显示第三方身份，例如：

> World Clean Biz is an independent industry publication and is not affiliated with this brand.

品牌商标、Logo 和产品图片仅用于编辑性识别与分析，来源和使用边界应清楚。

## 5. 方案选择

评估过三种方案：

1. 静态品牌百科页：质量可控，但更新成本高，容易过时。
2. 自动品牌聚合页：维护成本低，但缺少独立价值，容易形成薄弱页面。
3. 混合型品牌情报中心：核心事实人工核实，相关文章自动汇聚。

采用第三种方案。它兼顾页面质量、更新效率和长期扩展能力。

## 6. 第一阶段范围

首批品牌：

1. Roborock
2. Dreame
3. Ecovacs
4. Dyson
5. Tineco
6. iRobot
7. Bissell
8. Aiper
9. Maytronics / Dolphin
10. Mammotion

选择依据：

- WCB 已有足够的相关内容和行业判断。
- 覆盖地面清洁、泳池机器人和庭院机器人。
- 对海外买家、经销商及品牌从业者存在明确的查询需求。
- 能够形成公司实体、制造供应链、商业经营和竞争分析四组长期关键词。

Beatbot、Segway Navimow、Narwal、WYBOT 和 SharkNinja 作为优先候选第二批。

Maytronics 与 Dolphin 第一阶段使用一个主页面：`/brands/maytronics`。Maytronics 作为公司主体，Dolphin 作为其主要产品品牌和搜索别名展示。只有未来出现足够独立的 Dolphin 内容和搜索需求时，才评估拆分页面。

## 7. 信息架构

### 7.1 URL

```text
/brands
/brands/roborock
/brands/dreame
/brands/ecovacs
```

`/brands` 是品牌情报总目录，只展示已经达到发布门槛的品牌。

单一品牌使用稳定、简洁的小写 slug。品牌改名或合并时保留原 URL，并通过明确的品牌关系说明或永久重定向处理，不创建重复页面。

### 7.2 品牌页模块

每个品牌页包含以下模块：

1. **Brand Snapshot**

   品牌名、法定公司、总部、成立时间、核心品类和一句话定位。

2. **Ownership**

   母公司、投资关系、旗下品牌及重要关联实体。

3. **Leadership**

   创始人、CEO 和与品牌战略相关的主要管理层。

4. **Product Portfolio**

   主要产品线、价格带、目标用户和市场定位。

5. **Manufacturing & Supply Chain**

   已核实的制造基地、自产或代工关系、关键供应链信息。

6. **Markets & Channels**

   主要国家和地区、线上线下渠道、经销和零售布局。

7. **Competitive Position**

   主要竞争品牌、相对优势、压力和 WCB 的行业判断。

8. **Key Developments**

   按日期排列的融资、产品、管理层、渠道、制造和战略事件。

9. **WCB Analysis**

   自动汇聚直接相关的 WCB 文章，按时间排序并突出代表性深度分析。

10. **Sources & Update Record**

    主要来源、事实核实日期、首次发布和最后实质更新时间。

缺少可靠信息的模块应省略或明确写为未公开，不得用推测填充。

## 8. 内容与数据边界

### 8.1 品牌档案

每个品牌拥有一份独立的结构化档案，与普通 MDX 文章分开管理。档案至少需要支持：

- 名称、别名和 slug
- Logo、图片及其来源信息
- 摘要和 WCB 定位
- 法定公司、母公司、总部和成立时间
- 创始人及主要管理层
- 产品组合
- 制造与供应链信息
- 主要市场和渠道
- 竞争品牌
- 关键事件时间线
- 来源
- 首次发布、核实和最后实质更新时间
- 发布状态

结构化字段用于保证页面一致性；允许各品牌保留少量独有内容，避免模板限制真正有价值的信息。

### 8.2 文章与品牌关系

文章继续保存在现有 `content/insights` 体系中。文章通过明确的品牌标记与品牌档案建立关系。

品牌关系不能只依赖正文中出现品牌名。正文提到竞争对手或历史背景，并不代表文章应成为该品牌的核心分析。实施时需要区分：

- 主要品牌：文章的核心对象，可进入品牌页主要文章列表。
- 相关品牌：文章中的重要比较对象，可进入次要相关内容。

现有 `tags` 可作为迁移依据，但首批文章关系需要人工复核。

## 9. 更新流程

```text
发布或更新文章
→ 标记主要品牌和相关品牌
→ 文章自动进入对应品牌页
→ 判断是否出现新的核心事实
→ 人工核实事实和来源
→ 更新品牌档案或时间线
→ 记录实质更新时间
```

自动更新范围：

- 最新文章
- 相关文章数量
- 文章排序和展示

人工更新范围：

- 所有权和投资关系
- 创始人、CEO 和主要管理层
- 制造基地和代工关系
- 主要市场和渠道
- 融资、营收、市场份额等数据
- 重大产品或战略事件
- WCB 的竞争定位判断

新增一篇文章不会自动改变品牌页的“最后核实”或“最后实质更新”日期。

## 10. 发布门槛

品牌页只有同时满足以下条件才能进入公开目录、sitemap 和搜索引擎索引：

- 核心档案主要字段已经完成。
- 至少引用 3 个可靠来源。
- 至少关联 3 篇相关 WCB 文章。
- 包含一段 WCB 自己的竞争定位或行业判断。
- 显示来源、核实日期和第三方免责声明。
- 所有权、制造关系和市场数据没有未标记的推测。
- 页面在桌面和移动端均可正常阅读。

可靠来源优先顺序：

1. 公司官网、监管文件、财报、招股书和正式新闻稿
2. 管理层正式采访、政府或交易所记录
3. 可信行业媒体和研究机构
4. 其他来源，仅用于线索并需交叉核实

未达标的品牌档案保留为未发布状态，不生成可索引空页面。

## 11. SEO 设计

### 11.1 页面元素

每个品牌拥有独立、具体的 title、H1、description 和开篇摘要。

示例：

```text
Title:
Roborock Company Profile, Ownership, Products & Strategy | WCB

H1:
Roborock: Company, Products, Manufacturing and Market Strategy
```

页面设置：

- 自引用 canonical
- 唯一 title 和 meta description
- Open Graph 基础信息
- 首次发布和最后实质更新日期
- sitemap 收录
- 可抓取的正文和图片

### 11.2 结构化数据

采用保守、准确的结构化数据：

- 品牌总目录：`CollectionPage` 和适用的 `ItemList`
- 品牌页：`WebPage`，通过 `about` 描述对应 `Organization`
- 页面层级：`BreadcrumbList`

不使用暗示品牌与 WCB 有官方关联的 `ProfilePage`。结构化数据中的事实必须与页面可见内容一致。

### 11.3 关键词范围

单一品牌页整合四组搜索意图：

- 公司实体：ownership、founder、headquarters、parent company
- 制造供应链：manufacturer、factory、where made、OEM
- 商业经营：revenue、funding、distribution、market position
- 竞争分析：competitors、product portfolio、strategy

独立深度问题仍由文章承接。品牌页负责提供稳定总览和进入深度内容的路径。

## 12. 内链规则

- `/brands` 链接全部已发布品牌页。
- 相关文章在自然位置链接对应品牌页。
- 品牌页链接主要分析、比较、归属和制造文章。
- 竞争品牌之间只有在页面存在真实比较内容时才互链。
- 品牌页可链接相关品类页和报告页，但不机械堆砌链接。
- 每篇文章通常只需在一个自然位置链接主要品牌页。
- 不把正文中每一次品牌名出现都自动转成链接。

首批实施需要建立文章品牌映射复核清单，避免单纯依赖关键词匹配造成错误聚合。

## 13. 页面体验

页面视觉延续 WCB 现有研究出版物风格，不另建一套设计系统。

阅读顺序：

1. 快速确认品牌身份
2. 了解公司和所有权
3. 判断产品、制造、渠道和竞争位置
4. 查看关键事件
5. 进入 WCB 深度文章
6. 核查来源与更新时间

第一阶段保留轻量订阅入口，例如 “Follow this brand” 或 “Receive WCB intelligence updates”。采购询盘不是主要 CTA，不应压过页面内容。

## 14. 异常与边界处理

- **品牌资料不足：** 保持未发布，不生成可索引页面。
- **来源互相冲突：** 展示差异和来源日期，避免自行选择无法证明的结论。
- **品牌改名：** 更新主名称，保留别名和旧名称搜索信息。
- **品牌被收购或停止经营：** 保留历史页面，更新状态和事件时间线。
- **同一公司多品牌：** 每个品牌可有独立页面，公司关系在 Ownership 中说明；内容高度重复时只保留一个主页面。
- **文章标签错误：** 提供可复核的显式品牌映射，不靠正文关键词自动修正。
- **图片不可用：** 页面继续显示文字档案，不使用无关占位图片。

## 15. 验证与质量保证

实施阶段至少验证：

- 10 个首批品牌的 URL、canonical、metadata 和 sitemap。
- 未发布品牌不能通过公开路由产生薄弱页面。
- 品牌文章映射准确，主要品牌与相关品牌没有混淆。
- 时间线按日期稳定排序。
- 所有内部链接、图片和来源链接正常。
- JSON-LD 可解析，内容与页面一致。
- 品牌页和总目录在桌面与移动端正常显示。
- 无重复 title、description 或页面主体。
- 现有博客、指南和站点构建不受影响。
- `npm run build` 通过。

发布遵循 WCB 现有生产规则：功能分支、测试和构建、GitHub 推送、Vercel Preview 验证、用户明确批准、合并到 `main`，再由 Vercel Git 集成部署生产。

## 16. 成功指标与扩展门槛

上线前记录 WCB 当前品牌相关搜索曝光基线。

观察节奏：

- 30 天：抓取、收录、页面错误和初步查询词
- 60–90 天：曝光、排名、自然访问及品牌页到深度文章的阅读
- 约 6 个月：决定是否扩展到 50 个品牌

第一阶段成功标准：

- 10 个品牌页全部正常收录。
- 6 个月内至少 7 个品牌页获得稳定自然曝光。
- 品牌相关非首页查询数量持续增长。
- 品牌页能够持续把访客带到 WCB 深度文章。
- 没有形成大量“已发现但未收录”、重复页面或薄弱页面。

只有达到上述整体趋势，才启动第二批品牌。若部分页面未被收录，先检查页面独立价值、来源完整性、内链和重复内容，不通过增加更多页面掩盖问题。

## 17. 实施阶段划分

实施计划应拆成四个可独立验证的部分：

1. 品牌数据模型、文章品牌关系和内容校验。
2. 品牌页、品牌总目录及基础样式。
3. SEO、结构化数据、sitemap 和内链。
4. 首批 10 个品牌内容录入、人工复核和 Preview 验证。

第一阶段不自动抓取外部品牌数据。外部事实进入品牌档案前必须经过人工核实。

## 18. 设计依据

- [Google Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google Search AI features optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [ProfilePage structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
