# World Clean Biz Visual Refinement Phase Two Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修正主要页面的对齐问题，以真实素材为主重建图片组合，并恢复 Denny 在关键信任位置的真实照片。

**Architecture:** 保留现有页面结构和蓝白视觉系统，通过统一图片容器规则、有限的页面级 `object-position` 和素材路径替换完成精修。真实建筑、工厂、产品与商务环境素材进入独立 `site-refresh/real` 目录；Denny 照片继续使用已经确认的本地真实素材。

**Tech Stack:** Next.js 15、React、TypeScript、CSS、Node.js 测试、Vercel Preview。

## Global Constraints

- 不修改文章正文和文章内部图片。
- 不改变导航、路由、业务结构、表单逻辑或英文文案。
- 不直接部署正式站，不使用 `vercel --prod`。
- 继续使用 `codex/site-visual-refresh-phase-1` 功能分支。
- 网站文案保持纯英文，设计文档和沟通使用中文。

---

### Task 1: 建立第二阶段视觉约束测试

**Files:**
- Modify: `tests/siteVisualRefresh.test.mjs`
- Modify: `tests/homepageStructure.test.mjs`
- Modify: `tests/inquiryConversion.test.mjs`

- [ ] 增加真实素材目录、Denny 关键位置和统一对齐类的断言。
- [ ] 运行测试并确认因为新规则尚未实现而失败。

### Task 2: 准备真实素材并建立素材映射

**Files:**
- Create: `public/images/site-refresh/real/*.webp`
- Modify: `app/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/reports/page.tsx`
- Modify: `app/world-clean-expo/page.tsx`

- [ ] 选择可用于商业网站的真实建筑、工厂、办公和产品素材。
- [ ] 转换为统一 WebP 尺寸并保存到本地。
- [ ] 首页、About、Reports 和 Expo 替换明显 AI 场景，保留少量概念视觉。

### Task 3: 恢复 Denny 的信任位置

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `app/sourcing/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/world-clean-expo/page.tsx`

- [ ] About 首屏和执行模块使用 Denny 真实照片。
- [ ] Sourcing 首屏和 Denny Reviews 模块使用 Denny 真实照片。
- [ ] Contact 信任模块使用 Denny 真实照片。
- [ ] Expo Organizer 模块继续使用 Denny 真实照片。

### Task 4: 修正图片、卡片和栏位对齐

**Files:**
- Modify: `app/globals.css`

- [ ] 同组卡片采用等高 Grid/Flex 布局。
- [ ] 统一图片比例、容器高度、`object-fit` 和页面级 `object-position`。
- [ ] 对双栏模块统一顶部或垂直居中关系。
- [ ] 移动端取消不必要的强制等高并检查裁切。

### Task 5: 验证并更新 Preview

**Files:**
- Test: `tests/*.mjs`

- [ ] 运行视觉相关测试并确认通过。
- [ ] 运行全部 67 项测试。
- [ ] 运行 `npm run build` 并确认生成 192 个页面。
- [ ] 运行 `git diff --check`。
- [ ] 提交并推送功能分支，等待 Vercel Preview Ready。
