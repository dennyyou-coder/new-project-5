# Lawn Robot Landing Page Conversion Design

日期：2026-07-12

状态：用户已确认视觉审核方向，等待书面规格复核

## 目标

将 `/sourcing/lawn-robots` 从以SEO介绍为主的页面，优化为以产品选择和Sourcing询盘为主的Landing Page。页面继续保留 `Robotic Lawn Mower Manufacturers & Sourcing in China` 的SEO主题，但访客进入页面后应更快理解产品选择价值、World Clean Biz的判断能力和提交询盘后的下一步。

本轮只修改草坪机器人页面。共享的泳池机器人页面不得出现文案、布局或CTA变化。

## 核心转化路径

1. 买家在首屏理解：应先选择适合市场和渠道的产品路线，再匹配供应商。
2. 买家在首屏或首屏下沿看到六个产品方向入口。
3. 选择产品后，在同一桌面视野内看到产品图、定位、市场、主要风险和产品专属CTA。
4. 点击产品CTA时，将对应 `product_id` 带入现有Sourcing表单和GA4事件。
5. 没有合适产品或已有规格书的买家，可以通过独立入口提交自己的Product Brief。
6. CTA附近展示Denny和World Clean Biz的真实行业身份，降低首次联系阻力。

## 首屏设计与英文文案

SEO metadata继续使用现有关键词标题。页面可见H1改为：

```text
Choose the Right Robotic Mower Platform Before You Choose a Supplier
```

首屏说明改为：

```text
Compare six robotic mower product directions from China, then request supplier matching for the platform closest to your market, channel and price position.
```

主CTA为锚点按钮，滚动到产品选择器：

```text
Explore Product Options
```

次要入口打开现有Sourcing表单：

```text
I Already Have a Product Brief
```

桌面端首屏应减少垂直高度，让产品选择器标题或首个产品入口出现在首屏下沿。移动端首屏的H1控制在约3至4行，并避免单张首屏图片占用额外一整屏。

## 产品选择器布局

桌面端保留主图与缩略图的主次关系，但将产品信息移到与主图相邻的位置：

- 主图保持3:2素材比例，显示高度控制在约480至520px以内。
- 主图和产品决策信息在同一个桌面视野内出现。
- 缩略图栏约占20%，默认可见至少四个产品。
- 产品说明必须显示：编号、技术方向、名称、定位、市场和渠道、机会、验证风险。
- 产品CTA改为 `Request Suppliers for RM-XX`。
- 第二CTA为 `Use My Own Product Brief`，不传虚构的产品编号。
- 显示 `Product X of 6`，帮助用户理解还有更多型号。

移动端结构保持主图、横向缩略图、产品说明的顺序，但压缩图片和段落之间的空白。缩略图横向区域应露出后续卡片或显示明确的滑动提示。CTA应在产品核心定位与验证信息之后直接出现。

## 概念产品透明度

概念产品声明保留，但表达应透明且不削弱信任：

```text
Illustrative product directions. Final supplier models and specifications are verified against your brief.
```

页面不展示工厂名称，不声称概念图对应现货，不加入未经验证的价格、面积、坡度、续航、认证或交付承诺。

## 信任模块

在产品选择器CTA附近增加真实信任信息：

- Founder, World Clean Biz
- Organizer, World Clean Expo
- Inside the cleaning industry since 2006
- Product and supplier decisions reviewed by Denny

使用项目中已经批准的Denny真实照片；不使用AI人物、不增加未经确认的客户数量、融资机构或具体融资币种。

## 具体服务内容

删除或大幅压缩占据大面积空间的通用Buyer Challenges卡片。将重复的How We Help说明替换为四项具体交付：

1. `Product Direction Review`：确认导航路线、目标草坪、市场、渠道和产品定位。
2. `Manufacturer Screening`：寻找具有相关平台、测试能力和出口准备度的制造商类型。
3. `Sample Comparison`：比较导航、割草表现、App稳定性、安全和地形能力。
4. `Pre-production Risk Review`：检查模具、认证、备件、质量控制和售后准备度。

保留供应商验证重点和市场差异，但合并为更紧凑的采购检查区。相关文章移动到最终询盘CTA之后，避免在主转化完成前把用户带离页面。

## 提交后说明

在主CTA附近加入三步说明：

1. Share your market, channel and target product direction.
2. World Clean Biz reviews the product route and relevant supplier types.
3. We identify the next supplier, sample and verification steps for discussion.

不承诺未经确认的回复时间、供应商数量或一定匹配成功。

## 追踪要求

继续使用现有事件：

- `cta_view`
- `cta_click`
- `form_open`
- `form_submit`
- `form_success`

产品CTA必须继续传递 `product_id=RM-01` 至 `RM-06`。自定义Brief入口不传产品编号，并使用独立的 `cta_location`，方便后续比较产品选择型询盘与自定义需求询盘。

## 验收标准

1. 桌面端首屏能清楚表达产品路线优先于供应商名单的价值。
2. 桌面端一个视野内能同时看见选中产品、关键判断和产品专属CTA。
3. 主图与缩略图继续使用3:2素材且产品主体不被错误裁切。
4. 390px移动端没有横向页面溢出，缩略图可横向浏览并有更多产品提示。
5. 六个产品切换后，图、文案、序号、选中状态和CTA编号同步更新。
6. `Request Suppliers for RM-XX`继续传递正确的 `product_id`。
7. `I Already Have a Product Brief`和`Use My Own Product Brief`使用独立追踪位置，不传产品编号。
8. Denny信任信息使用已批准的真实身份表达和真实照片。
9. 泳池机器人页面的首屏、服务区和CTA没有视觉或文案变化。
10. 自动测试、SEO检查、生产构建和桌面/移动端浏览器验证全部通过。
11. 只推送功能分支和Vercel Preview；不合并 `main`，不执行 `vercel --prod`。

## 范围外事项

- 不修改其他Sourcing品类页面。
- 不修改全站导航、全站设计系统或文章内容。
- 不新增工厂名单、真实型号参数、客户案例或价格区间。
- 不发布正式站。
