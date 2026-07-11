# World Clean Biz Content Experience Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Blog、Archive、文章详情、移动端、转化、SEO 和加载性能统一到当前正式站的商业与视觉标准。

**Architecture:** 保持现有内容读取与 MDX/Markdown 转换逻辑，通过页面级结构调整、共享转换规则、结构化数据和集中 CSS 完成升级。文章正文和内部图片保持不变。

**Tech Stack:** Next.js 15、React、TypeScript、CSS、Node.js test、Tally、GA4、Vercel。

## Global Constraints

- 不修改文章正文、文章事实和文章内部图片。
- 不改变文章 slug 和 URL。
- 不新增第三方依赖。
- 网站文案保持英文，设计和实施文档使用中文。
- 使用功能分支和 Vercel Preview，不直接发布正式站。

---

### Task 1: 内容体验回归测试

**Files:**
- Create: `tests/contentExperience.test.mjs`
- Modify: `tests/blogConversion.test.mjs`

- [ ] 增加 Blog 单侧栏、Archive 元信息、文章作者信任、Related 图片、SEO Schema 和移动端类名断言。
- [ ] 运行新测试并确认因为页面尚未实现而失败。

### Task 2: Blog 首页结构优化

**Files:**
- Modify: `app/blog/page.tsx`
- Modify: `app/globals.css`

- [ ] 增加 Blog 编辑定位、文章数量和 Reports/Sourcing 入口。
- [ ] 优化 Featured、筛选条和文章 Feed 的图片加载与结构。
- [ ] 合并桌面与移动侧栏为一套响应式 DOM。
- [ ] 保留分页、筛选、Newsletter 和现有追踪。

### Task 3: Archive 编辑档案优化

**Files:**
- Modify: `app/blog/archive/page.tsx`
- Modify: `app/globals.css`

- [ ] 增加文章总量、分类概览和业务入口。
- [ ] 为每篇文章补充阅读时间和一致档案结构。
- [ ] 增加 CollectionPage、ItemList 与 Breadcrumb Schema。

### Task 4: 文章详情公共模板优化

**Files:**
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/globals.css`

- [ ] 增加可见面包屑、发布日期和更完整作者信息。
- [ ] Related Articles 增加图片、日期与阅读时间。
- [ ] 增强 BlogPosting Schema，不改变正文输出。
- [ ] 改善正文、表格、引用、标签和移动端排版。

### Task 5: 转化、SEO 与性能复核

**Files:**
- Modify: `lib/blogConversion.ts`（仅在映射缺口存在时）
- Modify: `app/sitemap.ts`（仅在入口缺失时）
- Test: `tests/contentExperience.test.mjs`
- Test: `tests/blogConversion.test.mjs`

- [ ] 确认四类文章 CTA 映射唯一且追踪字段稳定。
- [ ] 确认 Blog、Archive 和文章页面的 Canonical、robots 与 Schema。
- [ ] 确认非首屏图片延迟加载且没有重复侧栏。

### Task 6: 全量验证与 Preview

**Files:**
- Test: `tests/*.mjs`

- [ ] 运行全部自动测试。
- [ ] 运行 `npm run build` 并确认生成 192 个页面。
- [ ] 运行 `git diff --check`。
- [ ] 浏览器检查 `/blog`、`/blog/archive` 和三篇不同 CTA 类型文章的桌面与移动布局。
- [ ] 提交并推送 `codex/content-experience-optimization`，等待 Preview Ready。
