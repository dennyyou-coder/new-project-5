# GA4 内部流量排除实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 仅在 World Clean Biz 正式域名的普通外部浏览器中加载 GA4，并让 Denny 可通过一次性链接持久排除或恢复当前浏览器。

**Architecture:** 新增独立的 GA4 流量判断与初始化模块，把域名白名单、自动化识别、浏览器标记、URL 清理和脚本加载放在可测试的边界内。`GoogleAnalytics` 客户端组件只在挂载后调用该模块；原有 CTA 和表单继续通过现有 `window.gtag` 接口发送事件。

**Tech Stack:** Next.js 15、React 19、TypeScript、Node.js 内置测试运行器、Vercel Preview

## Global Constraints

- GA4 Measurement ID 必须保持 `G-6RW65B9CD0`。
- 只有 `worldcleanbiz.com` 和 `www.worldcleanbiz.com` 可以加载 GA4。
- `localhost`、Vercel Preview、其他测试域名和 `navigator.webdriver === true` 的自动化浏览器不得加载 GA4。
- `wcb_internal=1` 必须持久排除当前浏览器；`wcb_internal=0` 必须清除标记并恢复统计。
- 处理控制参数后必须从地址栏移除它，同时保留其他查询参数和 hash。
- 被排除时必须设置 GA4 官方禁用标记，且不得请求 `googletagmanager.com/gtag/js`。
- 不修改页面内容、视觉样式、Tally、Vercel Analytics、路由和 GA4 管理后台过滤器。
- 历史 GA4 数据保持不变，本功能只影响部署后的新访问。

---

### Task 1: 建立可测试的 GA4 流量决策模块

**Files:**
- Create: `lib/googleAnalytics.ts`
- Create: `tests/googleAnalytics.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `isProductionAnalyticsHost(hostname: string): boolean`
- Produces: `getInternalTrafficControl(search: string): "enable" | "disable" | null`
- Produces: `cleanInternalTrafficUrl(pathname: string, search: string, hash: string): string`
- Produces: `shouldLoadGoogleAnalytics(input: { hostname: string; isAutomated: boolean; isInternal: boolean }): boolean`
- Produces constants `GOOGLE_ANALYTICS_MEASUREMENT_ID`, `GOOGLE_ANALYTICS_SCRIPT_ID`, `INTERNAL_TRAFFIC_PARAM`, `INTERNAL_TRAFFIC_STORAGE_KEY`

- [ ] **Step 1: 编写决策函数的失败测试**

在 `tests/googleAnalytics.test.mjs` 中覆盖：

```js
test("only production hostnames can load GA4", () => {
  assert.equal(isProductionAnalyticsHost("worldcleanbiz.com"), true);
  assert.equal(isProductionAnalyticsHost("www.worldcleanbiz.com"), true);
  assert.equal(isProductionAnalyticsHost("localhost"), false);
  assert.equal(isProductionAnalyticsHost("example.vercel.app"), false);
});

test("internal traffic controls are parsed exactly", () => {
  assert.equal(getInternalTrafficControl("?wcb_internal=1"), "enable");
  assert.equal(getInternalTrafficControl("?wcb_internal=0"), "disable");
  assert.equal(getInternalTrafficControl("?wcb_internal=true"), null);
});

test("control parameter is removed without losing other URL state", () => {
  assert.equal(
    cleanInternalTrafficUrl(
      "/sourcing",
      "?utm_source=email&wcb_internal=1",
      "#product-options"
    ),
    "/sourcing?utm_source=email#product-options"
  );
});

test("production traffic policy excludes automation and internal browsers", () => {
  assert.equal(
    shouldLoadGoogleAnalytics({
      hostname: "worldcleanbiz.com",
      isAutomated: false,
      isInternal: false
    }),
    true
  );
  assert.equal(
    shouldLoadGoogleAnalytics({
      hostname: "worldcleanbiz.com",
      isAutomated: true,
      isInternal: false
    }),
    false
  );
  assert.equal(
    shouldLoadGoogleAnalytics({
      hostname: "worldcleanbiz.com",
      isAutomated: false,
      isInternal: true
    }),
    false
  );
});
```

- [ ] **Step 2: 运行专项测试并确认因模块不存在而失败**

Run: `npm run test:analytics`

Expected: FAIL，错误指出 `lib/googleAnalytics.ts` 尚不存在或导出未定义。

- [ ] **Step 3: 实现最小决策模块**

在 `lib/googleAnalytics.ts` 中实现常量和纯函数：

```ts
export const GOOGLE_ANALYTICS_MEASUREMENT_ID = "G-6RW65B9CD0";
export const GOOGLE_ANALYTICS_SCRIPT_ID = "wcb-google-analytics";
export const INTERNAL_TRAFFIC_PARAM = "wcb_internal";
export const INTERNAL_TRAFFIC_STORAGE_KEY = "wcb_internal_traffic";

const PRODUCTION_ANALYTICS_HOSTS = new Set([
  "worldcleanbiz.com",
  "www.worldcleanbiz.com"
]);

export function isProductionAnalyticsHost(hostname: string): boolean {
  return PRODUCTION_ANALYTICS_HOSTS.has(hostname.toLowerCase());
}

export function getInternalTrafficControl(
  search: string
): "enable" | "disable" | null {
  const value = new URLSearchParams(search).get(INTERNAL_TRAFFIC_PARAM);
  if (value === "1") return "enable";
  if (value === "0") return "disable";
  return null;
}

export function cleanInternalTrafficUrl(
  pathname: string,
  search: string,
  hash: string
): string {
  const params = new URLSearchParams(search);
  params.delete(INTERNAL_TRAFFIC_PARAM);
  const nextSearch = params.toString();
  return `${pathname}${nextSearch ? `?${nextSearch}` : ""}${hash}`;
}

export function shouldLoadGoogleAnalytics({
  hostname,
  isAutomated,
  isInternal
}: {
  hostname: string;
  isAutomated: boolean;
  isInternal: boolean;
}): boolean {
  return (
    isProductionAnalyticsHost(hostname) && !isAutomated && !isInternal
  );
}
```

在 `package.json` 的 scripts 中增加：

```json
"test:analytics": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/googleAnalytics.test.mjs"
```

- [ ] **Step 4: 运行专项测试并确认通过**

Run: `npm run test:analytics`

Expected: PASS，所有域名、参数、URL 和决策测试通过。

- [ ] **Step 5: 提交决策模块**

```bash
git add lib/googleAnalytics.ts tests/googleAnalytics.test.mjs package.json
git commit -m "test: define GA4 internal traffic policy"
```

### Task 2: 实现浏览器标记和条件式 GA4 加载

**Files:**
- Modify: `lib/googleAnalytics.ts`
- Modify: `tests/googleAnalytics.test.mjs`
- Modify: `components/GoogleAnalytics.tsx:1-27`

**Interfaces:**
- Consumes: Task 1 导出的所有常量和决策函数。
- Produces: `initializeGoogleAnalytics(windowLike, documentLike): AnalyticsInitializationResult`
- Produces: `AnalyticsInitializationResult`，包含 `loaded: boolean` 与 `reason: "allowed" | "non-production-host" | "automated" | "internal-browser" | "already-initialized"`

- [ ] **Step 1: 编写浏览器初始化的失败测试**

使用轻量 fake window、storage、history 和 document，覆盖以下实际行为：

```js
test("enable link persists exclusion, cleans URL and never injects GA4", () => {
  const runtime = createRuntime({
    href: "https://worldcleanbiz.com/?utm_source=test&wcb_internal=1#top"
  });
  const result = initializeGoogleAnalytics(runtime.window, runtime.document);

  assert.equal(result.loaded, false);
  assert.equal(result.reason, "internal-browser");
  assert.equal(runtime.storage.getItem(INTERNAL_TRAFFIC_STORAGE_KEY), "1");
  assert.equal(runtime.historyCalls[0], "/?utm_source=test#top");
  assert.equal(runtime.appendedScripts.length, 0);
  assert.equal(
    runtime.window[`ga-disable-${GOOGLE_ANALYTICS_MEASUREMENT_ID}`],
    true
  );
});

test("disable link clears exclusion and loads GA4 on production", () => {
  const runtime = createRuntime({
    href: "https://worldcleanbiz.com/?wcb_internal=0",
    storedInternal: true
  });
  const result = initializeGoogleAnalytics(runtime.window, runtime.document);

  assert.equal(result.loaded, true);
  assert.equal(runtime.storage.getItem(INTERNAL_TRAFFIC_STORAGE_KEY), null);
  assert.equal(runtime.appendedScripts.length, 1);
  assert.match(runtime.appendedScripts[0].src, /G-6RW65B9CD0/);
});

test("preview and automated browsers never inject GA4", () => {
  const preview = createRuntime({
    href: "https://example.vercel.app/sourcing"
  });
  const automated = createRuntime({
    href: "https://worldcleanbiz.com/sourcing",
    webdriver: true
  });

  assert.equal(
    initializeGoogleAnalytics(preview.window, preview.document).loaded,
    false
  );
  assert.equal(
    initializeGoogleAnalytics(automated.window, automated.document).loaded,
    false
  );
  assert.equal(preview.appendedScripts.length, 0);
  assert.equal(automated.appendedScripts.length, 0);
});

test("initialization is idempotent", () => {
  const runtime = createRuntime({
    href: "https://worldcleanbiz.com/sourcing"
  });
  initializeGoogleAnalytics(runtime.window, runtime.document);
  const second = initializeGoogleAnalytics(runtime.window, runtime.document);

  assert.equal(second.reason, "already-initialized");
  assert.equal(runtime.appendedScripts.length, 1);
});
```

- [ ] **Step 2: 运行专项测试并确认初始化接口尚未实现**

Run: `npm run test:analytics`

Expected: FAIL，错误指出 `initializeGoogleAnalytics` 未定义。

- [ ] **Step 3: 实现浏览器初始化流程**

在 `lib/googleAnalytics.ts` 中：

1. 读取 `wcb_internal` 控制参数；
2. 对 `localStorage` 执行保存、清除或读取；
3. 即使 storage 不可用，`wcb_internal=1` 当前页面也必须被排除；
4. 通过 `history.replaceState` 清理控制参数；
5. 根据域名、`navigator.webdriver` 和内部标记做最终判断；
6. 被排除时设置 `window["ga-disable-G-6RW65B9CD0"] = true`；
7. 被允许时初始化 `dataLayer` 和 `gtag`，并只追加一次异步 GA4 script；
8. 返回可验证的 `AnalyticsInitializationResult`。

将 `components/GoogleAnalytics.tsx` 改为客户端挂载器：

```tsx
"use client";

import { useEffect } from "react";
import { initializeGoogleAnalytics } from "@/lib/googleAnalytics";

export function GoogleAnalytics() {
  useEffect(() => {
    initializeGoogleAnalytics(window, document);
  }, []);

  return null;
}
```

- [ ] **Step 4: 运行 GA4 和原有线索追踪测试**

Run: `npm run test:analytics`

Expected: PASS。

Run: `npm run test:lead`

Expected: PASS，原有 CTA、表单和文章转化追踪接口不变。

- [ ] **Step 5: 提交加载逻辑**

```bash
git add lib/googleAnalytics.ts tests/googleAnalytics.test.mjs components/GoogleAnalytics.tsx
git commit -m "feat: exclude internal browsers from GA4"
```

### Task 3: 全面验证与 Preview 发布

**Files:**
- Verify: `components/GoogleAnalytics.tsx`
- Verify: `lib/googleAnalytics.ts`
- Verify: `tests/googleAnalytics.test.mjs`
- Verify: `app/layout.tsx`

**Interfaces:**
- Consumes: Task 2 完成的生产域名策略和浏览器初始化接口。
- Produces: 可供用户检查的 Vercel Preview URL，以及 Preview 不加载 GA4 的浏览器证据。

- [ ] **Step 1: 运行全部相关测试**

Run:

```bash
npm run test:analytics
npm run test:lead
npm run test:blog
npm run test:homepage
npm run test:inquiry
```

Expected: 所有测试 PASS。

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: Next.js 构建成功，无 TypeScript 或路由错误。

- [ ] **Step 3: 检查变更边界**

Run:

```bash
git diff origin/main...HEAD --check
git diff --stat origin/main...HEAD
git status --short
```

Expected: 仅设计文档、实施计划、GA4 模块、GA4 组件、专项测试和测试脚本发生变化，工作区干净。

- [ ] **Step 4: 推送功能分支并创建 Vercel Preview**

Run:

```bash
git push -u origin codex/exclude-internal-ga4
vercel deploy
```

Expected: GitHub 功能分支推送成功，Vercel 返回 Ready 的 Preview URL。

- [ ] **Step 5: 验证 Preview**

在桌面和手机尺寸打开 Preview：

- 页面正常渲染；
- Console 无错误；
- Network 中没有 `googletagmanager.com/gtag/js`；
- CTA 和表单仍可打开；
- 正式发布前不在正式站启用内部标记。

- [ ] **Step 6: 向用户交付 Preview**

报告：

- Vercel Preview 链接；
- 功能分支和最新 commit；
- 自动化测试与构建结果；
- Preview 未加载 GA4 的验证结果；
- Production 尚未部署，等待用户明确确认。
