# 家电品牌情报扩展实施计划

> **供自动化执行者：** 必须使用 `superpowers:executing-plans` 逐项执行本计划。所有步骤使用复选框（`- [ ]`）追踪；不得使用子代理，因为当前执行环境不允许主动委派。

**目标：** 新增五个经过证据和视觉验证的家电品牌页，更新 Midea，建立“家电与小家电”分类，并通过 GitHub `main` 与 Vercel Git 集成一次性发布生产环境。

**架构：** 保持现有 JSON 驱动的品牌页架构，只扩充品牌资料、分类枚举、真实相关文章关系、品牌资产和发布门测试。集团层事实进入消费品牌页的所有权字段或现有所有权文章，不新增母公司品牌路由。

**技术栈：** Next.js 15、TypeScript、JSON、MDX frontmatter、Node test runner、Sharp、Git/GitHub、Vercel Preview、桌面与 390px 浏览器验证。

## 全局约束

- 所有工作只在 `codex/home-appliance-brand-expansion` 独立工作树进行，不触碰用户原始 `main` 的未提交文件。
- 新增品牌固定为 `samsung-home-appliances`、`lg-home-appliances`、`haier-home-appliances`、`ge-appliances`、`fisher-paykel`。
- 只创建消费品牌或家电运营业务页面，不创建 Samsung Group、LG Corporation、Haier Smart Home、Groupe SEB 等母公司品牌页。
- 每个发布页面至少有三条真实标注文章关系、三条可靠来源、官方 Logo、真实 Hero 和两至三张内容视觉。
- 不根据集团所有权推断具体 SKU 的制造商、工厂或产地。
- Logo 只能来自官网、官方媒体库或官方 Press Kit；Hero 必须是真实产品、工厂、团队、门店或品牌场景。
- 不修改文章正文、标题、slug 或搜索意图；仅允许修改有证据支持的 `primaryBrands` 和 `relatedBrands` frontmatter。
- 不降低测试门槛，不直接使用 `vercel --prod`，不混入无关文件。
- 任一品牌缺少身份、图片或三篇真实关系时保持草稿，并阻止整批生产发布。

---

### 任务 1：建立可审计的证据与关系矩阵

**文件：**

- 创建：`docs/operations/home-appliance-brand-expansion.md`
- 参考：`content/insights/who-makes-samsung-appliances-manufacturing-bespoke-ai.mdx`
- 参考：`content/insights/who-makes-lg-appliances-manufacturing-network.mdx`
- 参考：`content/insights/who-owns-haier-appliances-brand-portfolio.mdx`
- 参考：`content/insights/who-owns-ge-appliances-haier-manufacturing.mdx`
- 参考：`content/insights/who-owns-fisher-paykel-haier-manufacturing.mdx`
- 参考：`content/insights/who-owns-midea-appliances-brand-portfolio.mdx`

**接口：**

- 输入：当前 `origin/main` 的品牌 JSON、18 篇家电 SEO 批次文章和官方来源。
- 输出：每个品牌的法律实体、母公司、商标、运营主体、制造证据、渠道、官方 Logo 来源、Hero 来源及三篇文章关系矩阵。

- [ ] **步骤 1：核对目标 slug 不存在且工作树干净**

```bash
git status --short --branch
for slug in samsung-home-appliances lg-home-appliances haier-home-appliances ge-appliances fisher-paykel; do test ! -e "content/brands/$slug.json"; done
```

预期：分支只包含已提交设计与计划；五个 JSON 均不存在。

- [ ] **步骤 2：逐品牌建立身份边界表**

在操作记录中为五个品牌分别记录：消费品牌、控制母公司、商标所有或许可、主要运营实体、区域销售/进口主体、已披露制造范围、保修主体和不能泛化的事实。

- [ ] **步骤 3：逐品牌建立官方来源和视觉来源表**

每个品牌至少记录三条官方或监管来源，以及 Logo 和 Hero 的准确官方页面 URL。图片下载前检查主体、品牌、页面标题和产品类型一致。

- [ ] **步骤 4：审查文章关系**

```bash
rg -n -i "Samsung|LG Electronics|Haier|GE Appliances|Fisher & Paykel" content/insights
```

只有文章包含实质性品牌、所有权、制造、产品、渠道或竞争内容时，才进入关系矩阵。每个品牌必须记录至少三篇准确 slug；不足则将该品牌标记为阻塞，不制造关系。

- [ ] **步骤 5：提交审计记录**

```bash
git add docs/operations/home-appliance-brand-expansion.md
git commit -m "docs: audit home appliance brand evidence"
```

---

### 任务 2：用测试定义第六分类和首批品牌发布门

**文件：**

- 修改：`tests/brandIntelligence.test.mjs`
- 修改：`tests/brandExperience.test.mjs`
- 测试：`tests/brandIntelligence.test.mjs`

**接口：**

- 输入：任务 1 的六个品牌范围和分类结论。
- 输出：61 个已发布档案、6 个分类、唯一主分类、家电交叉分类和五个新档案资产门槛的失败测试。

- [ ] **步骤 1：更新发布总量和分类预期**

在发布门测试中把品牌总数从 `56` 改为 `61`，把 `home-appliances-small-appliances` 加入分类 slug，并把五个新 slug 加入精确品牌列表。

- [ ] **步骤 2：增加家电分类成员测试**

测试以下规则：

```js
assert.equal(getBrandCategoryForProfile("samsung-home-appliances")?.slug, "home-appliances-small-appliances");
assert.equal(getBrandCategoryForProfile("ge-appliances")?.slug, "home-appliances-small-appliances");
assert.deepEqual(membershipsFor("samsung-home-appliances"), [
  "home-appliances-small-appliances",
  "floorcare-home-cleaning"
]);
assert.deepEqual(membershipsFor("fisher-paykel"), [
  "home-appliances-small-appliances"
]);
```

- [ ] **步骤 3：增加首批五个品牌专用发布门**

对五个新 slug 逐一断言：状态为 `published`；Logo 路径为 `/images/brands/{slug}/logo.webp`；Hero 路径位于自身目录；Hero 为 WebP 且至少 1200×750；内容视觉为两至三张；至少三篇真实文章关系；身份边界文本包含对应母公司或许可关系。

- [ ] **步骤 4：运行测试并确认按预期失败**

```bash
npm run test:brands
```

预期：因第六分类和五个 JSON 尚未实现而失败，不应出现无关基线错误。

- [ ] **步骤 5：提交失败测试**

```bash
git add tests/brandIntelligence.test.mjs tests/brandExperience.test.mjs
git commit -m "test: define appliance brand release gate"
```

---

### 任务 3：实现“家电与小家电”分类

**文件：**

- 修改：`lib/brandCategories.ts`
- 修改：`app/brands/page.tsx`
- 测试：`tests/brandIntelligence.test.mjs`
- 测试：`tests/brandExperience.test.mjs`

**接口：**

- 输入：`BrandCategorySlug`、`BRAND_CATEGORIES` 和现有分类帮助函数。
- 输出：`home-appliances-small-appliances` 分类、唯一主分类及准确目录文案。

- [ ] **步骤 1：增加分类枚举和配置**

新增分类名称 `Home Appliances & Small Appliances`。主成员包含：

```text
aeg
bosch-home-appliances
electrolux
fisher-paykel
ge-appliances
haier-home-appliances
lg-home-appliances
midea
miele
philips-home-appliances
samsung-home-appliances
```

保持上述已有清洁产品品牌在 `floorcare-home-cleaning` 的交叉成员关系；新增 Samsung、LG、Haier 到该分类，但不加入 GE Appliances 或 Fisher & Paykel。

- [ ] **步骤 2：更新品牌总览元数据和首屏文案**

将总览定位更新为清洁与家电品牌情报，明确覆盖所有权、产品组合、制造、渠道与供应链，不增加新组件或重复链接。

- [ ] **步骤 3：运行分类与体验测试**

```bash
npm run test:brands
```

预期：分类相关测试通过；五个档案缺失测试继续失败。

- [ ] **步骤 4：提交分类实现**

```bash
git add lib/brandCategories.ts app/brands/page.tsx
git commit -m "feat: add home appliance brand category"
```

---

### 任务 4：补充真实文章品牌关系

**文件：**

- 修改：任务 1 关系矩阵中批准的 `content/insights/*.mdx`
- 修改：`tests/brandIntelligence.test.mjs`

**接口：**

- 输入：任务 1 已核实的品牌—文章矩阵。
- 输出：`getInsights()` 可读取的准确 `primaryBrands` 和 `relatedBrands` 数组，每个新品牌至少三篇。

- [ ] **步骤 1：先更新测试中的精确文章关系映射**

把每个修改文章的最终 `primaryBrands` 数组加入 `expectedPrimaryBrands`；对只属于背景关系的品牌使用 `relatedBrands`，不得把母公司或姐妹品牌冒充文章主品牌。

- [ ] **步骤 2：运行测试确认关系映射失败**

```bash
npm run test:brands
```

预期：失败信息指向尚未更新的 MDX frontmatter。

- [ ] **步骤 3：只修改已核实文章的 frontmatter**

使用小写 slug；保留现有品牌顺序与文章正文，不修改标题、slug、正文、封面或发布时间。

- [ ] **步骤 4：运行内容和品牌测试**

```bash
npm run verify:content-classification
npm run test:insights
npm run test:brands
```

预期：内容分类和文章测试通过；品牌测试只剩档案和资产缺失。

- [ ] **步骤 5：提交文章关系**

```bash
git add content/insights tests/brandIntelligence.test.mjs
git commit -m "content: link appliance brands to verified analysis"
```

---

### 任务 5：制作 Samsung、LG、Haier 品牌档案与资产

**文件：**

- 创建：`content/brands/samsung-home-appliances.json`
- 创建：`content/brands/lg-home-appliances.json`
- 创建：`content/brands/haier-home-appliances.json`
- 创建：`public/images/brands/samsung-home-appliances/logo.webp`
- 创建：`public/images/brands/samsung-home-appliances/hero-bespoke-ai-jet.webp`
- 创建：`public/images/brands/lg-home-appliances/logo.webp`
- 创建：`public/images/brands/lg-home-appliances/hero-cordzero-cleaning.webp`
- 创建：`public/images/brands/haier-home-appliances/logo.webp`
- 创建：`public/images/brands/haier-home-appliances/hero-smart-cleaning.webp`
- 复用或复制：与三个品牌准确匹配的文章关系视觉到各自品牌目录

**接口：**

- 输入：任务 1 的证据、来源 URL、图片来源和文章关系。
- 输出：三个完整 `BrandProfile` JSON 和各自独立的官方视觉包。

- [ ] **步骤 1：下载并转换官方 Logo 和真实 Hero**

保持 Logo 透明背景，输出宽度至少 600px；Hero 使用统一 1600×1000 画布，不裁掉产品主体，不添加生成文字或伪造场景。

- [ ] **步骤 2：建立三个 JSON**

Samsung 明确 Samsung Electronics 与 Digital Appliances；LG 明确 LG Electronics 与 Home Appliance Solution；Haier 明确 Haier Smart Home、Haier Group和区域实体。制造、渠道表的每行都填写 `evidence`、`scope` 和 `buyerCheck`。

- [ ] **步骤 3：加入两至三张专属内容视觉**

Samsung 使用 appliance business map 和 buyer verification map；LG 使用 Home Appliance Solution map 和 buyer verification map；Haier 使用 Haier Smart Home portfolio map 和区域/责任 map。复制到品牌目录后更新 JSON，避免跨品牌通用图。

- [ ] **步骤 4：运行品牌测试**

```bash
npm run test:brands
```

预期：Samsung、LG、Haier 的档案、文章深度和资产测试通过；GE 与 Fisher & Paykel 仍缺失。

- [ ] **步骤 5：提交第一组档案**

```bash
git add content/brands/samsung-home-appliances.json content/brands/lg-home-appliances.json content/brands/haier-home-appliances.json public/images/brands/samsung-home-appliances public/images/brands/lg-home-appliances public/images/brands/haier-home-appliances
git commit -m "feat: add Samsung LG and Haier appliance profiles"
```

---

### 任务 6：制作 GE Appliances、Fisher & Paykel 品牌档案与资产

**文件：**

- 创建：`content/brands/ge-appliances.json`
- 创建：`content/brands/fisher-paykel.json`
- 创建：`public/images/brands/ge-appliances/logo.webp`
- 创建：`public/images/brands/ge-appliances/hero-ge-appliances-portfolio.webp`
- 创建：`public/images/brands/fisher-paykel/logo.webp`
- 创建：`public/images/brands/fisher-paykel/hero-fisher-paykel-kitchen.webp`
- 复用或复制：对应所有权、商标、制造与品牌组合事实图到各自品牌目录

**接口：**

- 输入：任务 1 的 Haier 集群证据和视觉来源。
- 输出：两个完整 `BrandProfile` JSON 和独立资产包。

- [ ] **步骤 1：下载并转换官方 Logo 和真实 Hero**

GE Appliances Hero 使用官方真实美国家电产品或 Appliance Park 场景；Fisher & Paykel Hero 使用官方真实高端厨房、洗衣或产品场景。不得用所有权文章封面代替。

- [ ] **步骤 2：建立 GE Appliances JSON**

法律实体使用 `Haier US Appliance Solutions, Inc.`，明确 `dba GE Appliances`、Haier Smart Home 所有权、GE 商标长期许可、美国运营与型号级产地边界。

- [ ] **步骤 3：建立 Fisher & Paykel JSON**

明确 Haier 所有权、Fisher & Paykel Appliances 的独立品牌和运营身份、DCS 边界、区域公司、集团或供应商制造与型号级保修责任。

- [ ] **步骤 4：运行品牌测试并提交**

```bash
npm run test:brands
git add content/brands/ge-appliances.json content/brands/fisher-paykel.json public/images/brands/ge-appliances public/images/brands/fisher-paykel
git commit -m "feat: add GE Appliances and Fisher Paykel profiles"
```

预期：61 个品牌和六个分类的测试全部通过。

---

### 任务 7：更新 Midea 和完整发布门

**文件：**

- 修改：`content/brands/midea.json`
- 修改：`tests/brandIntelligence.test.mjs`
- 修改：`docs/operations/home-appliance-brand-expansion.md`

**接口：**

- 输入：新发布的 Midea 所有权文章和第六分类。
- 输出：更新后的 Midea 发展事件、来源/文章关系和全批最终状态。

- [ ] **步骤 1：比较 Midea 现有资料与新文章**

只加入能提高准确性的集团上市、Smart Home、品牌矩阵、全球制造或清洁产品事实；保留 Midea、Eureka、区域公司和型号工厂边界。

- [ ] **步骤 2：更新 Midea 时间和来源**

只有完成当前官方来源人工复核后才更新 `lastVerified`；只有发生实质编辑才更新 `lastModified`。

- [ ] **步骤 3：运行全部内容与品牌测试**

```bash
npm run verify:content-classification
npm run test:insights
npm run test:brands
```

预期：全部通过，61 个档案均发布且分类、关系、资产无错误。

- [ ] **步骤 4：更新操作记录并提交**

```bash
git add content/brands/midea.json tests/brandIntelligence.test.mjs docs/operations/home-appliance-brand-expansion.md
git commit -m "content: complete appliance brand release gate"
```

---

### 任务 8：生产构建和本地视觉验证

**文件：**

- 验证：`app/brands/page.tsx`
- 验证：`app/brands/[slug]/page.tsx`
- 验证：`public/images/brands/{五个新 slug}/`

**接口：**

- 输入：61 个发布档案和六个分类。
- 输出：可部署生产构建与桌面/390px 验证证据。

- [ ] **步骤 1：运行生产构建**

```bash
npm run build
```

预期：构建成功；五个品牌页和 `home-appliances-small-appliances` 分类页生成；sitemap 包含六个新路由。

- [ ] **步骤 2：启动生产模式本地服务**

```bash
npm run start
```

- [ ] **步骤 3：检查桌面端和 390px**

逐页检查 `/brands`、新分类页、五个新品牌页和 Midea：Logo 清晰、Hero 匹配、标题不异常换行、表格不横向溢出、内容视觉可打开、文章链接正确、控制台无新增错误。

- [ ] **步骤 4：保存验证截图和结果**

只在隔离工作树的 `.superpowers/verification/` 保存本批截图，不复制或覆盖原工作区的用户截图；操作记录写明测试命令、构建结果和浏览器发现。

---

### 任务 9：Preview、合并和生产部署

**文件：**

- 更新：`docs/operations/home-appliance-brand-expansion.md`

**接口：**

- 输入：已通过完整本地门槛的功能分支。
- 输出：GitHub PR、Vercel Preview、合并后的 `main` 提交、READY 生产部署和正式站验证结果。

- [ ] **步骤 1：执行提交前最终核验**

```bash
git status --short
npm run verify:content-classification
npm run test:insights
npm run test:brands
npm run build
```

预期：只有本批授权文件；所有命令通过。

- [ ] **步骤 2：推送功能分支并建立 PR**

```bash
git push -u origin codex/home-appliance-brand-expansion
gh pr create --base main --head codex/home-appliance-brand-expansion --title "Expand Brand Intelligence into home appliances" --body-file /tmp/home-appliance-brand-pr.md
```

- [ ] **步骤 3：验证 Vercel Preview**

在 Preview 重复桌面端、390px、图片、链接、sitemap 和控制台检查；记录 Preview URL 与结果。发现问题时只在功能分支修复并重新验证。

- [ ] **步骤 4：合并至 GitHub main**

```bash
gh pr merge --merge --delete-branch
```

用户已经明确授权本批在门槛通过后直接部署，无需重复确认。不得改用本地生产部署。

- [ ] **步骤 5：等待并验证 Git 触发的 Vercel 生产部署**

确认部署状态为 `READY`，检查 `worldcleanbiz.com/brands`、新分类、五个新品牌、Midea、sitemap、桌面端、390px 和控制台。

- [ ] **步骤 6：记录并汇报生产结果**

在操作记录中保存 PR、合并提交、Preview、生产部署、正式 URL 和核验时间，然后提交记录更新并确保该提交同样进入 `main`。

