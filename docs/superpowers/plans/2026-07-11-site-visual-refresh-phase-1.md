# World Clean Biz 全站视觉配图重制第一阶段实施计划

> **供执行人员使用：** 必须逐项执行本计划。默认在当前会话内使用 `superpowers:executing-plans`；每个任务都要完成测试、检查和独立提交。

**目标：** 在不改变页面文案、结构和业务逻辑的前提下，把首页和 About 页面的非文章配图统一为高端工业纪实视觉，并用少量电影感科技画面提升产品表现。

**实现方式：** 新图片全部存放在独立的 `public/images/site-refresh/` 目录，通过明确的首页与 About 子目录隔离职责。先用测试锁定图片清单和页面引用，再制作图片、替换引用、调整必要的局部裁切样式，最后进行完整构建和真实浏览器验收。

**技术栈：** Next.js 15、React、TypeScript、CSS、Node.js 原生测试、WebP/PNG 图片资源、Playwright CLI、Vercel Git Preview。

## 全局限制

- 第一阶段只修改首页和 About 页面中的非文章图片。
- 不修改博客文章正文图片、文章封面和文章内容。
- 不修改页面英文文案、信息结构、导航、表单、数据追踪和业务逻辑。
- 高端工业纪实为主，少量使用电影感科技视觉。
- Denny、论坛、展会和供应商会议优先使用真实照片。
- AI 只用于真实素材无法满足的产品或技术场景，不得生成虚假的 Denny、客户或展会纪实。
- 正式页面不得引用外部图片地址。
- 最终图片必须保存在项目本地，并使用准确的英文文件名和替代文字。
- 未经用户明确确认发布，不得合并到 `main`，不得使用 `vercel --prod`。

## 文件结构

### 新建文件

- `public/images/site-refresh/home/category-robot-vacuums.webp`：首页机器人吸尘器品类主图
- `public/images/site-refresh/home/category-floor-washers.webp`：首页洗地机品类主图
- `public/images/site-refresh/home/category-pool-robots.webp`：首页泳池机器人品类主图
- `public/images/site-refresh/home/category-robotic-lawn-mowers.webp`：首页割草机器人品类主图
- `public/images/site-refresh/home/category-commercial-cleaning.webp`：首页商用清洁设备品类主图
- `public/images/site-refresh/home/category-emerging-cleaning.webp`：首页新兴清洁品类主图
- `public/images/site-refresh/home/path-market-intelligence.webp`：首页市场情报业务入口图
- `public/images/site-refresh/home/path-product-sourcing.webp`：首页产品与采购业务入口图
- `public/images/site-refresh/home/path-world-clean-expo.webp`：首页展会业务入口图
- `public/images/site-refresh/home/trust-denny-industry.webp`：首页 Denny 行业经历图
- `public/images/site-refresh/home/trust-supplier-network.webp`：首页供应商网络图
- `public/images/site-refresh/home/trust-expo-access.webp`：首页展会与行业连接图
- `public/images/site-refresh/about/about-hero-denny.webp`：About 首屏 Denny 真实行业场景图
- `public/images/site-refresh/about/about-industry-analysis.webp`：About 行业分析与演讲图
- `public/images/site-refresh/about/about-product-supplier-work.webp`：About 产品与供应商工作图
- `public/images/site-refresh/about/about-expo-connections.webp`：About 展会与商务连接图
- `public/images/site-refresh/about/about-network-forum.webp`：About 行业网络场景图
- `public/images/site-refresh/about/about-team-execution.webp`：About 团队执行场景图
- `tests/siteVisualRefresh.test.mjs`：第一阶段图片清单、引用和范围保护测试

### 修改文件

- `app/page.tsx`：替换首页非文章图片引用，保持文章卡片引用逻辑不变
- `app/about/page.tsx`：替换 About 图片引用和元数据图片路径
- `app/globals.css`：仅添加或修改首页与 About 图片容器所需的局部裁切规则

---

### 任务 1：用测试锁定第一阶段图片清单和修改边界

**文件：**

- 新建：`tests/siteVisualRefresh.test.mjs`
- 测试：`tests/siteVisualRefresh.test.mjs`

**接口：**

- 输入：`app/page.tsx`、`app/about/page.tsx` 和 `public/images/site-refresh/` 中的文件
- 输出：一组 Node.js 测试，验证 18 张正式图片存在、页面使用新路径、文章卡片逻辑仍保留、页面没有外部图片地址

- [ ] **步骤 1：编写预期失败的测试**

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const expectedAssets = [
  "public/images/site-refresh/home/category-robot-vacuums.webp",
  "public/images/site-refresh/home/category-floor-washers.webp",
  "public/images/site-refresh/home/category-pool-robots.webp",
  "public/images/site-refresh/home/category-robotic-lawn-mowers.webp",
  "public/images/site-refresh/home/category-commercial-cleaning.webp",
  "public/images/site-refresh/home/category-emerging-cleaning.webp",
  "public/images/site-refresh/home/path-market-intelligence.webp",
  "public/images/site-refresh/home/path-product-sourcing.webp",
  "public/images/site-refresh/home/path-world-clean-expo.webp",
  "public/images/site-refresh/home/trust-denny-industry.webp",
  "public/images/site-refresh/home/trust-supplier-network.webp",
  "public/images/site-refresh/home/trust-expo-access.webp",
  "public/images/site-refresh/about/about-hero-denny.webp",
  "public/images/site-refresh/about/about-industry-analysis.webp",
  "public/images/site-refresh/about/about-product-supplier-work.webp",
  "public/images/site-refresh/about/about-expo-connections.webp",
  "public/images/site-refresh/about/about-network-forum.webp",
  "public/images/site-refresh/about/about-team-execution.webp"
];

test("第一阶段 18 张正式图片全部存在", () => {
  for (const asset of expectedAssets) {
    assert.equal(fs.existsSync(path.join(root, asset)), true, asset);
  }
});

test("首页使用新的本地视觉系统并保留文章封面逻辑", () => {
  const source = read("app/page.tsx");
  assert.match(source, /\/images\/site-refresh\/home\/category-robot-vacuums\.webp/);
  assert.match(source, /\/images\/site-refresh\/home\/path-market-intelligence\.webp/);
  assert.match(source, /\/images\/site-refresh\/home\/trust-denny-industry\.webp/);
  assert.match(source, /imageFor\(article, index\)/);
  assert.doesNotMatch(source, /https?:\/\//);
});

test("About 使用新的本地视觉系统", () => {
  const source = read("app/about/page.tsx");
  assert.match(source, /\/images\/site-refresh\/about\/about-hero-denny\.webp/);
  assert.match(source, /\/images\/site-refresh\/about\/about-team-execution\.webp/);
  assert.doesNotMatch(source, /https?:\/\//);
});
```

- [ ] **步骤 2：运行测试并确认失败原因正确**

运行：

```bash
node --test tests/siteVisualRefresh.test.mjs
```

预期：图片不存在、页面尚未引用新路径，因此测试失败。

- [ ] **步骤 3：提交测试基线**

```bash
git add tests/siteVisualRefresh.test.mjs
git commit -m "test: define phase one visual refresh assets"
```

---

### 任务 2：制作首页统一图片系列

**文件：**

- 新建：`public/images/site-refresh/home/*.webp`
- 测试：`tests/siteVisualRefresh.test.mjs`

**接口：**

- 输入：现有 `public/images/sourcing/` 与 `public/images/industry/` 真实素材、经过筛选的合法素材、必要时生成的无品牌产品场景
- 输出：12 张首页 WebP 图片，供 `app/page.tsx` 使用

- [ ] **步骤 1：建立首页图片目录**

运行：

```bash
mkdir -p public/images/site-refresh/home
```

预期：目录创建成功，不修改其他资源目录。

- [ ] **步骤 2：制作六张品类主图**

按以下固定要求完成并导出：

- 文件比例：`4:3`
- 建议源文件尺寸：不低于 `1600 × 1200`
- 网页导出尺寸：`1200 × 900`
- 单文件目标大小：不超过 `260 KB`，不能以明显失真换取体积
- 产品主体占画面宽度约 `45%–70%`
- 统一冷白或中性空间，避免强烈品牌色
- 不出现可识别第三方品牌标志
- 六张图采用相近视角、光线和产品比例

导出到：

```text
public/images/site-refresh/home/category-robot-vacuums.webp
public/images/site-refresh/home/category-floor-washers.webp
public/images/site-refresh/home/category-pool-robots.webp
public/images/site-refresh/home/category-robotic-lawn-mowers.webp
public/images/site-refresh/home/category-commercial-cleaning.webp
public/images/site-refresh/home/category-emerging-cleaning.webp
```

- [ ] **步骤 3：制作三个业务入口图**

按以下固定要求完成并导出：

- 文件比例：`16:10`
- 网页导出尺寸：`1440 × 900`
- 单文件目标大小：不超过 `320 KB`
- 三张图片分别表达市场观察、产品与供应链、展会连接
- 三张图片场景不得重复，且不依赖文字才能区分

导出到：

```text
public/images/site-refresh/home/path-market-intelligence.webp
public/images/site-refresh/home/path-product-sourcing.webp
public/images/site-refresh/home/path-world-clean-expo.webp
```

- [ ] **步骤 4：制作三张 Denny 与行业信任图**

按以下固定要求完成并导出：

- 只使用真实照片
- 文件比例：`4:3`
- 网页导出尺寸：`1400 × 1050`
- 单文件目标大小：不超过 `350 KB`
- 保留人物和现场环境，不使用强磨皮或虚假背景替换
- Denny 主图能够安全适配横向和移动端居中裁切

导出到：

```text
public/images/site-refresh/home/trust-denny-industry.webp
public/images/site-refresh/home/trust-supplier-network.webp
public/images/site-refresh/home/trust-expo-access.webp
```

- [ ] **步骤 5：检查文件格式、尺寸与体积**

运行：

```bash
file public/images/site-refresh/home/*.webp
du -h public/images/site-refresh/home/*.webp
```

预期：12 个文件均识别为 WebP，文件体积符合上述目标，没有空文件。

- [ ] **步骤 6：提交首页图片资源**

```bash
git add public/images/site-refresh/home
git commit -m "assets: add premium homepage visual system"
```

---

### 任务 3：把首页接入新的图片系统

**文件：**

- 修改：`app/page.tsx`
- 修改：`app/globals.css`
- 测试：`tests/siteVisualRefresh.test.mjs`
- 测试：`tests/homepageStructure.test.mjs`

**接口：**

- 输入：任务 2 生成的 `/images/site-refresh/home/*.webp`
- 输出：首页所有非文章图片使用新系统，文章封面仍通过 `imageFor(article, index)` 获取

- [ ] **步骤 1：替换首页数组中的图片路径**

在 `app/page.tsx` 中把六个 `productCategories` 图片路径替换为：

```ts
"/images/site-refresh/home/category-robot-vacuums.webp"
"/images/site-refresh/home/category-floor-washers.webp"
"/images/site-refresh/home/category-pool-robots.webp"
"/images/site-refresh/home/category-robotic-lawn-mowers.webp"
"/images/site-refresh/home/category-commercial-cleaning.webp"
"/images/site-refresh/home/category-emerging-cleaning.webp"
```

把三个业务入口图片路径替换为：

```ts
"/images/site-refresh/home/path-market-intelligence.webp"
"/images/site-refresh/home/path-product-sourcing.webp"
"/images/site-refresh/home/path-world-clean-expo.webp"
```

把 Denny 与行业信任区三张图片替换为：

```ts
"/images/site-refresh/home/trust-denny-industry.webp"
"/images/site-refresh/home/trust-supplier-network.webp"
"/images/site-refresh/home/trust-expo-access.webp"
```

- [ ] **步骤 2：只在必要时调整首页图片裁切样式**

在 `app/globals.css` 的首页对应选择器中保持：

```css
object-fit: cover;
```

只有当真实主体在移动端被错误裁切时，才为具体图片类增加明确的 `object-position`。不得修改页面宽度、模块顺序、字体或按钮样式。

- [ ] **步骤 3：运行首页与视觉系统测试**

运行：

```bash
node --test tests/siteVisualRefresh.test.mjs tests/homepageStructure.test.mjs
```

预期：全部通过，首页文章封面逻辑仍被保留。

- [ ] **步骤 4：提交首页接入修改**

```bash
git add app/page.tsx app/globals.css tests/siteVisualRefresh.test.mjs
git commit -m "feat: apply premium visuals to homepage"
```

---

### 任务 4：制作并接入 About 图片系统

**文件：**

- 新建：`public/images/site-refresh/about/*.webp`
- 修改：`app/about/page.tsx`
- 修改：`app/globals.css`
- 测试：`tests/siteVisualRefresh.test.mjs`
- 测试：`tests/aboutConversion.test.mjs`
- 测试：`tests/dennyIdentityConsistency.test.mjs`

**接口：**

- 输入：真实 Denny、论坛、供应商和展会照片
- 输出：6 张 About WebP 图片，以及使用这些图片的 About 页面

- [ ] **步骤 1：建立 About 图片目录**

运行：

```bash
mkdir -p public/images/site-refresh/about
```

- [ ] **步骤 2：制作六张 About 正式图片**

固定要求：

- 只使用真实人物和真实行业照片，不生成 Denny 或虚假行业活动
- 首屏图导出为 `1600 × 1200`，其他图片导出为 `1400 × 1050`
- 全部使用 `4:3` 比例，保留能够解释行业环境的背景
- 单文件目标大小不超过 `420 KB`
- 统一深蓝、钢灰、冷白和自然肤色
- 不使用会改变人物身份特征的生成式修复

导出到：

```text
public/images/site-refresh/about/about-hero-denny.webp
public/images/site-refresh/about/about-industry-analysis.webp
public/images/site-refresh/about/about-product-supplier-work.webp
public/images/site-refresh/about/about-expo-connections.webp
public/images/site-refresh/about/about-network-forum.webp
public/images/site-refresh/about/about-team-execution.webp
```

- [ ] **步骤 3：替换 About 页面与元数据图片路径**

在 `app/about/page.tsx` 中使用以下路径：

```ts
"/images/site-refresh/about/about-hero-denny.webp"
"/images/site-refresh/about/about-industry-analysis.webp"
"/images/site-refresh/about/about-product-supplier-work.webp"
"/images/site-refresh/about/about-expo-connections.webp"
"/images/site-refresh/about/about-network-forum.webp"
"/images/site-refresh/about/about-team-execution.webp"
```

Open Graph 和 Twitter 图片统一使用：

```ts
"/images/site-refresh/about/about-hero-denny.webp"
```

- [ ] **步骤 4：只在必要时调整 About 图片裁切样式**

在 `app/globals.css` 中仅修改 About 图片容器的 `object-fit`、`object-position` 或宽高比例。不得改变页面模块顺序、文案、按钮或整体栅格。

- [ ] **步骤 5：运行 About 与身份一致性测试**

运行：

```bash
node --test tests/siteVisualRefresh.test.mjs tests/aboutConversion.test.mjs tests/dennyIdentityConsistency.test.mjs
```

预期：全部通过。

- [ ] **步骤 6：提交 About 图片与页面修改**

```bash
git add public/images/site-refresh/about app/about/page.tsx app/globals.css tests/siteVisualRefresh.test.mjs
git commit -m "feat: apply premium visuals to about page"
```

---

### 任务 5：完整验证并交付 Preview

**文件：**

- 验证：`app/page.tsx`
- 验证：`app/about/page.tsx`
- 验证：`app/globals.css`
- 验证：`public/images/site-refresh/`
- 验证：`tests/*.test.mjs`

**接口：**

- 输入：任务 1–4 的全部提交
- 输出：测试与构建通过的功能分支、GitHub 推送结果和 Vercel Preview

- [ ] **步骤 1：运行完整测试**

运行：

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/*.test.mjs
```

预期：0 项失败。

- [ ] **步骤 2：运行正式构建和差异检查**

运行：

```bash
npm run build
git diff --check
git status --short --branch
```

预期：Next.js 构建成功，差异检查无输出，只保留预期修改，功能分支没有未提交文件。

- [ ] **步骤 3：使用真实浏览器检查本地页面**

检查以下地址的电脑端和移动端：

```text
http://127.0.0.1:3000/
http://127.0.0.1:3000/about
```

验收内容：

- 图片全部加载
- 无拉伸和错误裁切
- 产品主体比例统一
- Denny 人物构图自然
- 页面结构和文字没有变化
- 移动端没有横向溢出
- 浏览器控制台没有新增错误

- [ ] **步骤 4：推送功能分支**

```bash
git push -u origin codex/site-visual-refresh-phase-1
```

预期：GitHub 功能分支更新成功，Vercel Git 集成开始生成 Preview。

- [ ] **步骤 5：检查 Vercel Preview**

在 Preview 中重复检查首页和 About 的电脑端、移动端、控制台错误和图片加载。只有 Preview 状态为 Ready，才向用户提供链接。

- [ ] **步骤 6：等待用户集中视觉确认**

向用户提供：

- Vercel Preview 链接
- 本批更换图片数量
- 首页和 About 的主要变化
- 测试、构建与浏览器检查结果

未经用户明确说“可以发布”，不得合并 `main`。

