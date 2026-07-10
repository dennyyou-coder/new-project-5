# World Clean Biz 全站精简与线索链路设计

日期：2026-07-10

状态：设计已确认，等待最终文档复核

依据：2026-07-10 全站审计与逐项方案确认

## 目标

World Clean Biz 继续承担行业内容、SEO、商业合作、采购服务和 World Clean Expo 导流。全站第一转化目标是商业合作与采购线索，第二转化目标是邮箱沉淀及后续培育。

本轮设计解决四件事：缩短首页、减少重复选择、区分不同线索意图、建立可追踪的转化链路。现有品牌视觉、主要栏目、文章体系和页面 URL 保持稳定。

## 不在本轮扩大处理的事项

- 不重写文章正文。
- 不重构项目架构或更换内容系统。
- 不一次性翻译全站。
- 不删除现有栏目或更改主要 URL。
- 不在缺少真实资料时编造客户案例、展会数据或市场数字。

## 导航

导航保持当前名称与顺序：

`Home | Blog | Sourcing | Market Reports | World Clean Expo | About | Contact`

Logo 与 Home 都返回首页。Contact 保留为完整联系与需求分流入口。

移除页头右侧全站固定的 `Get Free Reports`。不新增 `Discuss a Project` 或 `Discuss Your Opportunity`。不同页面展示与当前意图匹配的 CTA，避免报告下载在 Sourcing、WCE 和 Contact 页面分流用户。

## 首页结构

首页从多个完整专题的堆叠页，收敛为六个连续模块。

### 1. 首屏价值主张

保留当前深蓝色品牌视觉和清洁产品类别画面。标题缩短，直接表达 WCB 能帮助用户更早看到行业变化，并连接市场判断、产品供应链与行业机会。

首屏主 CTA 为 `Start A Sourcing Inquiry`，次 CTA 为 `Get Industry Updates`。主 CTA 进入 Sourcing 路径，次 CTA 进入独立邮箱订阅，不再打开报告表单。

当前六类产品视觉可保留在首屏，但首页后续不再重复展示同一组六类产品卡片。

### 2. 三条需求路径

首页第二屏回答“用户来 WCB 做什么”：

1. `Market Intelligence`：进入 Blog 或 Market Reports。
2. `Product & Sourcing`：进入 Sourcing。
3. `World Clean Expo`：进入参展、合作或观众路径。

每张入口卡只包含一句价值说明和一个动作，不在首页展开完整服务流程。

### 3. 一屏信任证据

当前 Denny 个人介绍、现场图库和经历时间线压缩为一屏：

- 20 年行业经验；
- 产品与供应链一线经历；
- 论坛、展会与行业网络；
- 2 至 3 张真实现场照片；
- 一个 About 链接。

完整人物经历、时间线和更多现场图片保留在 About。

### 4. 两个商业入口

首页并列呈现：

- `Sourcing & Product Support`：适合谁、能解决什么问题、进入采购询盘。
- `World Clean Expo`：进入参展/合作或观众登记。

首页只负责说明和导流。资格条件、案例、详细流程和表单放在对应落地页。

### 5. 内容与报告证明

首页展示 3 篇最新或最重要的行业文章和 1 份当前重点报告。保留进入 Blog 与 Market Reports 的入口，不在首页展示分类筛选、大量文章或多组报告封面。

### 6. 邮箱沉淀

首页末段使用真实邮箱输入框。用户可选择兴趣：

- Market Intelligence
- Sourcing
- World Clean Expo

模块清楚说明发送内容和频率。Newsletter 与报告下载在后台分别标记，不能继续共用同一个含义不清的报告表单。

## 页面 CTA 规则

- Home：`Start A Sourcing Inquiry`；次 CTA 为 `Get Industry Updates`。
- Blog 与文章：阅读相关内容；次 CTA 为 Newsletter 或相关报告。
- Market Reports：`Get The Report`。
- Sourcing：`Start A Sourcing Inquiry`。
- World Clean Expo：`Exhibit / Partner` 与 `Visit / Get Updates` 分开。
- About：进入 Contact 或一般联系。
- Contact：先选择需求类型，再进入对应表单。

同一页面只有一个视觉主 CTA。次 CTA 降低视觉权重，不与主 CTA 并列争夺注意力。

## 五类线索

### Sourcing

表单收集身份、产品类别、目标市场、项目阶段、供应商要求、时间计划和联系方式。提交后标记 `sourcing`、来源页面和 CTA 位置，进入人工商业跟进。

### WCE Exhibit / Partner

表单收集公司、产品类别、角色、参展/赞助/论坛/媒体合作意向、目标和联系方式。提交后标记 `wce_exhibitor` 或 `wce_partner`，进入 WCE 招商名单。

### WCE Visit / Updates

表单收集邮箱、公司、身份、感兴趣品类、所在国家或地区，以及计划到场情况。提交后标记 `wce_visitor`，进入观众登记与更新培育。

### Reports / Newsletter

报告下载与 Newsletter 使用轻量邮箱表单，但保留不同意图字段：报告提交包含 `report_id`，Newsletter 提交包含 `newsletter=true`。两者都记录身份和兴趣，进入相应邮件培育路径。

### General / Media

表单收集联系类型、公司、需求说明和联系方式。提交后按 `general`、`media` 或 `partnership` 分派。

## 数据流

用户从首页、搜索、文章、报告或 WCE 页面进入。页面 CTA 打开对应 Tally 表单。提交成功后，数据写入 Airtable，并带上线索类型、来源页面、CTA 位置、UTM、用户身份和兴趣。

高价值商业线索进入人工跟进。报告、Newsletter 和 WCE 观众线索进入分群培育；后续邮件通过 Sourcing、合作、参展或观众 CTA 转化为商业线索。

## 分析事件

每类表单统一记录：

- `form_open`
- `form_submit`
- `form_success`
- `form_error`

事件参数至少包含 `form_type`、`source_page`、`cta_location`、`language` 和可用的 UTM。只有 `form_success` 计为有效转化。

GA4 用于经营漏斗分析，Vercel Analytics 继续用于基础访问观察。上线前在 GA4 调试模式确认事件名称与参数，正式环境建立按线索类型和来源页面拆分的转化报表。

## 成功、失败与恢复

表单加载失败时显示独立 Tally 链接，不能让 CTA 无响应。字段错误显示在对应字段旁，并保留用户已经填写的内容。

提交成功页说明：已收到的需求类型、预计回复时间和下一步。报告与 Newsletter 成功页说明资料发送方式和邮件内容预期。重复提交按邮箱与表单类型识别，不能误删不同意图的线索。

## 可访问性与移动端

每页只保留一个 `main`。表单标签必须关联真实输入控件。按钮与链接使用准确名称，键盘可操作并有清楚焦点状态。移动端菜单保留完整原导航，不增加固定商业 CTA。

首页在 390px 宽度下不得横向溢出。首页、Contact、Sourcing、Reports 和 WCE 的主 CTA 在移动端首屏或合理滚动范围内可见。

## SEO 与内容边界

首页精简不能减少核心行业语义。产品类别、市场情报、采购与 WCE 仍在标题、说明和内部链接中出现。移出首页的详细内容进入现有落地页，而不是删除。

实施时同时修正重复品牌标题、核心静态页 canonical、社交分享图和 sitemap 更新时间。文章正文、标题、slug 和已批准 SEO 内容不在本轮重写。

首页 URL、导航 URL 和 canonical 保持不变。首页只保留一个明确 H1；H1 或紧邻的首屏说明必须包含 `Global Cleaning Industry Intelligence`，并保留 robot vacuums、floor washers、pool robots、robotic lawn mowers 和 commercial cleaning 等核心品类语义。

六类产品的大卡片可以删除或压缩，但首页仍保留简洁的品类说明和可抓取文字链接。Blog、Market Reports、Sourcing、World Clean Expo、About 和 Contact 均通过普通 HTML 链接从首页或全站导航进入。

改版前从 Google Search Console 记录首页最近三个月的查询词、展示量、点击量、平均排名和索引状态。上线后检查标题、H1、canonical、内部链接、结构化数据和移动端体验，并在第 14 天和第 28 天比较首页搜索表现。

## 分批上线

网站不逐页零散上线，也不采用全站一次性大改。实施按完整业务链路分四批进行。

### 第一批：线索基础设施

先在预览环境完成五类 Tally 表单、Airtable 字段与标签、GA4 转化事件、成功与失败反馈，以及 Newsletter 和报告表单分离。完成真实链路验证后再进入页面改版。

### 第二批：核心商业链路

Header、Home、Contact、Sourcing 和 World Clean Expo 一起上线。首页的新入口不能提前指向仍使用旧分流逻辑的落地页。页头固定 `Get Free Reports` 只有在页面级 CTA 和对应表单已经可用后才移除。

### 第三批：内容与邮箱培育

Blog 首页、文章页 CTA、Market Reports、Newsletter 和报告下载后的培育路径一起上线。该批次负责把 SEO 内容流量转为邮箱联系人和后续商业线索。

### 第四批：技术与全站收尾

处理标题重复、canonical、社交分享图、sitemap 更新时间、图片性能、移动端细节、无障碍和 GA4 正式报表。

每一批都在独立预览中完成桌面端、移动端、表单、事件和构建验证。正式上线前单独取得确认；上线后观察数据，再决定下一批是否需要调整。

## 验收

1. 原导航名称、顺序和 URL 保持不变。
2. 页头固定 `Get Free Reports` 消失。
3. 首页按六个模块呈现，不再重复六类产品、完整人物时间线、长篇 Sourcing 与 WCE 内容。
4. 五类线索进入正确表单与 Airtable 标签。
5. Newsletter 不再打开报告表单。
6. WCE 展商/合作与观众入口分开。
7. GA4 可看到五类表单的 open、submit、success 和 error。
8. 提交成功、字段错误和表单加载失败均有明确反馈。
9. 桌面端、390px 移动端和键盘操作通过检查。
10. 生产构建通过，主要页面和图片无错误链接。

## 实施前提

网站代码可在当前项目内完成。Tally、Airtable、GA4 的外部配置需要对应账户权限或已登录浏览器会话。实施阶段由 Codex 协助设置字段、标签、事件和验证；涉及真实表单提交、外部数据写入或账户设置时，按实际操作范围确认。
