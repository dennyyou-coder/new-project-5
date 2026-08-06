# 家电品牌情报第三批实施计划

> **执行要求：** 使用 `superpowers:executing-plans` 逐项执行。当前环境不允许主动委派，全部任务由当前代理在隔离工作树中完成。

**目标：** 补齐 Whirlpool、KitchenAid、Beko 三篇批准的 SEO 文章、三个品牌档案和视觉包，完成本地与 Preview 验证后，通过 GitHub `main` 和 Vercel Git 集成一次性发布。

**架构：** 延续现有 JSON 驱动品牌页和 MDX 内容架构。用官方证据矩阵控制品牌、母公司、商标、运营、制造、区域渠道和保修边界；用失败测试先固定发布数量、文章关系、分类和资产门槛，再实现内容。

**技术栈：** Next.js 15、TypeScript、JSON、MDX、Node test runner、Sharp、Git/GitHub、Vercel Preview、桌面与 390 px 浏览器验证。

## 全局约束

- 只在 `codex/home-appliance-brand-batch-3` 和对应隔离工作树工作。
- 不触碰原始 `main` 中用户修改的 `AGENTS.md`、`.superpowers/brainstorm/` 或 `.superpowers/verification/`。
- 固定品牌：`whirlpool`、`kitchenaid`、`beko`；固定文章 slug 见设计文档。
- 不加入 Maytag、Hotpoint、Hisense 或后续批次品牌。
- 不用集团或工厂总量推断具体 SKU 的制造商、工厂或产地。
- Logo 只使用官方来源，Hero 必须是真实品牌场景，视觉关系必须有证据支持。
- 不降低测试门槛，不直接 `vercel --prod`，不混入无关文件。
- 任一品牌缺少三篇真实关系、身份边界或合格视觉时保持草稿并阻止整批生产发布。

### 任务 1：建立证据、文章与视觉矩阵

**文件：**

- 创建：`docs/operations/home-appliance-brand-batch-3.md`
- 参考：批准的 WCB SEO 选题调查
- 参考：Whirlpool、KitchenAid、Beko、Beko Europe 官方资料

- [ ] 核对 `content/brands/whirlpool.json`、`kitchenaid.json`、`beko.json` 和三个批准文章 slug 均不存在；如有冲突立即停止对应对象。
- [ ] 记录三品牌的消费品牌、母公司、商标或许可、运营主体、区域销售、制造范围、保修主体和不能泛化的事实。
- [ ] 每品牌记录至少三条官方或监管来源，以及 Logo 和 Hero 的准确官方来源 URL。
- [ ] 为三篇文章记录主品牌、相关品牌、支撑段落、内部链接和不得声称的关系。
- [ ] 审查官方交易范围；无法证明 KitchenAid 与 Beko Europe 边界时，不把 Beko 强行关联到 KitchenAid 文章。
- [ ] 提交操作记录。

### 任务 2：用失败测试固定第三批发布门

**文件：**

- 修改：`tests/brandIntelligence.test.mjs`
- 如需补充体验门：`tests/brandExperience.test.mjs`

- [ ] 把精确档案总数从 61 更新到 64，并将三个新 slug 加入发布列表。
- [ ] 增加三品牌的主分类、合法交叉分类、文章关系和 sitemap 预期。
- [ ] 增加专用资产测试：透明官方 Logo、1600 x 1000 Hero、自身目录的 2–3 张视觉、至少 3 篇文章关系。
- [ ] 增加身份边界断言：Whirlpool Corporation 与 Beko Europe；KitchenAid 的产品类别和许可边界；Beko 与 Beko Europe/公司实体边界。
- [ ] 运行 `npm run test:brands`，确认只因待实现内容失败。

### 任务 3：撰写三篇批准 SEO 文章及文章视觉

**文件：**

- 创建：`content/insights/who-owns-whirlpool-appliances-beko-europe.mdx`
- 创建：`content/insights/who-makes-kitchenaid-appliances-whirlpool.mdx`
- 创建：`content/insights/who-owns-beko-appliances-beko-europe.mdx`
- 创建：对应 `public/images/blog/*` 封面和关系/区域/核验视觉

- [ ] 保留批准的标题和 slug，补全 date、publishedAt、sortDate、SEO、FAQ、CTA、JSON-LD 和品牌 frontmatter。
- [ ] 每篇以官方来源解释核心实体边界，包含买家核验动作、至少三个内部链接和可审计来源。
- [ ] 每篇制作 1600 x 900 封面及至少一张信息关系图；复杂边界增加区域或制造核验图。
- [ ] 先更新测试中的精确关系，再写 MDX 使关系测试转绿。
- [ ] 运行 `npm run verify:content-classification`、`npm run test:insights` 和 `npm run test:brands`。

### 任务 4：实现三个品牌档案和官方资产

**文件：**

- 创建：`content/brands/whirlpool.json`
- 创建：`content/brands/kitchenaid.json`
- 创建：`content/brands/beko.json`
- 创建：`public/images/brands/{whirlpool,kitchenaid,beko}/logo.webp`
- 创建：每品牌一个 1600 x 1000 Hero 和 2–3 个 1600 x 900 内容视觉

- [ ] 下载并转换官方透明 Logo 与真实 Hero，核对来源页面、主体和品牌一致。
- [ ] 建立 Whirlpool 档案，明确 Whirlpool Corporation、Beko Europe、区域许可和型号级责任边界。
- [ ] 建立 KitchenAid 档案，明确 Whirlpool 所有权及 major/countertop appliances 的制造、许可和售后边界。
- [ ] 建立 Beko 档案，明确公司法律身份、Beko Europe、Whirlpool 交易和区域运营边界。
- [ ] 制造与渠道每行均填写 `evidence`、`scope`、`buyerCheck`；无公开证据不猜测。
- [ ] 运行 `npm run test:brands`，确认三档案结构、来源、关系和资产全部通过。

### 任务 5：分类、站点地图和完整本地验证

**文件：**

- 修改：`lib/brandCategories.ts`
- 修改：`tests/brandIntelligence.test.mjs`
- 修改：`docs/operations/home-appliance-brand-batch-3.md`

- [ ] 将三个品牌加入 `home-appliances-small-appliances` 主分类；只有官方现售清洁产品证据支持时才交叉到 `floorcare-home-cleaning`。
- [ ] 校验品牌目录、分类路由、静态参数和 sitemap 精确包含三页。
- [ ] 运行 `npm run verify:content-classification`、`npm run test:insights`、`npm run test:brands` 和 `npm run build`。
- [ ] 启动生产构建本地服务，检查 `/blog` 排序、三篇文章、`/brands`、分类页和三个品牌页。
- [ ] 在桌面和 390 px 检查标题、Logo、Hero、表格、链接、横向溢出、破图和控制台错误。
- [ ] 更新操作记录并提交所有已验证修改。

### 任务 6：Preview、合并与生产验证

- [ ] 确认分支仅包含第三批文件，没有用户原工作树文件或无关改动。
- [ ] 推送 `codex/home-appliance-brand-batch-3` 并创建 PR。
- [ ] 获取 Vercel Preview，复查桌面、390 px、图片、链接、表单/分析不受影响和控制台。
- [ ] Preview 全部通过后合并到 GitHub `main`，由 Vercel Git 集成自动部署生产。
- [ ] 验证 `worldcleanbiz.com` 的三篇文章、三个品牌页、分类页、站点地图和资源响应。
- [ ] 用中文汇报文件、所有权边界、官方来源、视觉、测试、构建、桌面/移动、待确认项和最终发布状态。
