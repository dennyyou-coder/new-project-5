# World Clean Biz GA4 内部流量排除设计

## 目标

从修改上线后开始，避免以下访问继续进入 World Clean Biz 的 GA4 数据：

- 本地开发环境访问；
- Vercel Preview 和其他非正式域名访问；
- Codex、Playwright 等自动化验收访问；
- Denny 自己在正式网站上的日常检查访问。

历史 GA4 数据不做修改。GA4 已收集的数据不能通过本方案追溯删除。

## 当前问题

当前 `GoogleAnalytics` 组件会在所有域名加载 GA4：

- 本地环境只是设置 `debug_mode`，并没有停止发送；
- Vercel Preview 会作为正常访问发送；
- 正式网站没有识别内部浏览器的机制；
- 自动化验收正式网站时也可能产生访问记录。

## 方案选择

采用“正式域名白名单 + 自动化排除 + 浏览器持久标记”。

不采用 GA4 公网 IP 过滤，原因是家庭宽带、手机热点、VPN 和动态公网 IP 会导致规则失效或误伤。

不直接启用 GA4 的活动数据过滤器，原因是过滤后的数据不可恢复；本次只需要排除 Denny 自己的浏览器，没有必要承担全局过滤风险。

## 行为设计

### 1. 正式域名白名单

只有以下域名可以加载并配置 GA4：

- `worldcleanbiz.com`
- `www.worldcleanbiz.com`

以下环境不加载 GA4：

- `localhost`
- `127.0.0.1`
- `::1`
- Vercel Preview 域名
- 其他测试域名

### 2. 自动化浏览器排除

当浏览器报告 `navigator.webdriver === true` 时，不加载 GA4。

这用于排除 Playwright、Codex 验收和常规自动化测试访问。

### 3. Denny 浏览器持久排除

提供两个控制参数：

```text
https://worldcleanbiz.com/?wcb_internal=1
https://worldcleanbiz.com/?wcb_internal=0
```

- `wcb_internal=1`：在当前浏览器的 `localStorage` 保存内部访问标记，并停止加载 GA4；
- `wcb_internal=0`：清除内部访问标记，恢复正常统计；
- 处理完成后从地址栏移除控制参数，保留其他查询参数；
- 标记只作用于当前浏览器和当前网站，不影响其他访客。

每个需要排除的浏览器配置文件只需打开一次启用链接。

### 4. GA4 加载顺序

页面先执行内部流量判断，再决定是否加载 Google 的 GA4 脚本。

当访问被排除时：

- 设置 GA4 官方禁用标记；
- 不请求 `googletagmanager.com/gtag/js`；
- 不创建可发送事件的 `gtag`；
- 页面和表单功能保持正常。

当访问允许统计时：

- 初始化 `dataLayer`；
- 异步加载 GA4 脚本；
- 使用现有 Measurement ID；
- 保留当前 CTA、表单和转化事件逻辑。

## 代码范围

允许修改：

- `components/GoogleAnalytics.tsx`
- 新增一个独立的 GA4 流量判断工具文件；
- 对应自动化测试。

不修改：

- 页面内容和视觉样式；
- GA4 Measurement ID；
- Tally 表单；
- Vercel Analytics；
- 路由、导航和其他业务组件；
- GA4 管理后台的数据过滤器。

## 验证标准

自动化测试必须覆盖：

1. 正式主域名允许 GA4；
2. `www` 正式域名允许 GA4；
3. Localhost 和 Preview 域名拒绝 GA4；
4. 自动化浏览器拒绝 GA4；
5. `wcb_internal=1` 保存排除标记；
6. 已保存排除标记的浏览器拒绝 GA4；
7. `wcb_internal=0` 清除标记并恢复 GA4；
8. 控制参数处理后从 URL 移除；
9. 原有 CTA 和表单追踪测试继续通过。

发布前还必须确认：

- `npm run test:lead` 通过；
- 相关专项测试通过；
- `npm run build` 通过；
- Vercel Preview 中不加载 GA4；
- 正式域名普通浏览器仍可加载 GA4；
- 启用内部标记后正式域名不再加载 GA4；
- 浏览器控制台无错误。

## 发布流程

1. 在当前隔离分支实施；
2. 测试并构建；
3. 推送 GitHub 功能分支；
4. 发布并验证 Vercel Preview；
5. 将 Preview 链接交给用户确认；
6. 用户明确批准 Production 后，合并到 GitHub `main`；
7. 由 Vercel Git 集成自动发布正式站；
8. 在 Denny 当前 Chrome 打开内部访问启用链接；
9. 验证正式站 GA4 已在该浏览器中停止加载。

