# 修复来源图标与文章图片、去除操作按钮、重构天气面板 Spec

## Why
线上部署版本（origin/main = 148e939）存在四类问题：来源 favicon 依赖 favicon.im（大陆访问不稳定，图标仍显示不出来）；文章缩略图直接热链出版商 CDN（多数被防盗链或需 VPN，图片加载失败出现破图）；内容被「加载更多」「查看全部头条与观点」等按钮拦截；天气面板仅 8 个城市、左右箭头循环切换导致换城市后找不到原城市，且 °C/°F 切换等冗余按钮体验差。

## 现状基线
- 开发基线为 `origin/main`（148e939，当前已部署版本，包含中文界面、中国新闻网等国内源、VPN need 标注与优先排序、中文翻译、缩略图提取等全部既有功能，是本地遗留快照的超集）。
- 本地 `/workspace` 工作区当前检出的旧快照（ca0740a，无关历史）**不作为开发基线，但必须保留不被回滚**。
- CI 已在运行（最近一次 schedule 于北京时间成功执行），推送 main 即可触发部署。

## What Changes
- **图标构建期同源化**：fetch-news.js 在 CI 内（ runner 网络可访问 Google）为每个唯一来源域名下载 favicon 至 `public/icons/{domain}.png`，随 vite 构建部署为同源资源；运行时不再请求任何第三方 favicon 服务；加载失败时优雅回退。
- **缩略图优雅降级**：缩略图 `<img>` 增加 onError 回退（featured 显示报刊占位、default 隐藏），杜绝破图图标。
- **去除操作按钮、内容直出**：移除 NewsList 分页（「加载更多」）、TopStories 展开按钮（「查看全部头条与观点」）、Header 帮助/设置占位按钮；内容全量直接渲染，并提升抓取量（每类 15→25 条、单源上限 6→8 条）。
- **天气面板重构**：城市扩容至约 23 个（国内主要城市 + 国际城市，中文名）；用原生 `<select>` 城市选择器替代左右箭头（所有城市始终可选、换城市后不丢失）；选择持久化到 localStorage；移除 °C/°F 切换（默认 °C）；保留天气详情（体感/湿度/风速/最高最低）与中文天气描述。
- **部署**：基于 origin/main 建分支提交，推送 main 触发既有 CI 部署，并完成线上验证。

## Impact
- Affected code:
  - `news-aggregator/scripts/fetch-news.js`（图标下载 + 抓取量提升）
  - `news-aggregator/src/utils/helpers.ts`（favicon 同源路径）
  - `news-aggregator/src/components/NewsCard.tsx`（img onError 回退）
  - `news-aggregator/src/components/NewsList.tsx`（去分页）
  - `news-aggregator/src/components/TopStories.tsx`（去展开按钮）
  - `news-aggregator/src/components/Header.tsx`（去帮助/设置按钮）
  - `news-aggregator/src/components/SideWeather.tsx`（重构为 select）
  - `news-aggregator/src/services/weatherService.ts`（城市扩容）
  - `news-aggregator/src/hooks/useWeather.ts`（如需配合选择器）
  - `news-aggregator/index.html`（移除 favicon.im preconnect）
- 不变：GitHub Actions 工作流、vite 配置、中文界面、中国新闻网等国内源、VPN 标注与优先排序、翻译管线（全部在基线中保留）。

## ADDED Requirements

### Requirement: 构建期来源图标下载
fetch-news.js SHALL 在抓取完成后收集全部唯一来源域名（sourceUrl 规范化：去 `www.`、小写），从 `https://www.google.com/s2/favicons?domain={domain}&sz=64` 下载图标保存至 `news-aggregator/public/icons/{domain}.png`（目录不存在则创建）。

#### Scenario: 图标随站点部署
- **WHEN** CI 构建部署完成
- **THEN** 部署站点 `/news/icons/{domain}.png` 对每个成功下载的域名返回 HTTP 200
- **AND** 前端 `<img>` 指向同源路径，运行时无任何第三方 favicon 请求

#### Scenario: 单个域名下载失败
- **WHEN** 某域名图标下载失败（404/超时）
- **THEN** 脚本记录并跳过该域名，构建不中断，运行时该来源显示回退样式

### Requirement: 图标与图片优雅回退
NewsCard SHALL 为来源图标与缩略图 `<img>` 提供 onError 回退：图标失败时显示灰色占位或隐藏；featured 缩略图失败时显示 Newspaper 图标占位；default 缩略图失败时隐藏缩略图容器。

#### Scenario: VPN 来源图片加载失败
- **WHEN** 大陆用户浏览需 VPN 来源的文章且缩略图 CDN 不可达
- **THEN** 卡片显示本地占位样式，页面不出现破图图标（broken image glyph）

### Requirement: 内容直接全量展示
NewsList SHALL 移除分页状态与「加载更多」按钮并渲染全部条目；TopStories SHALL 移除展开状态与按钮、直接渲染全部 moreStories；Header SHALL 移除帮助、设置两个无功能占位按钮（保留搜索与用户头像）。

#### Scenario: 首页无内容拦截按钮
- **WHEN** 用户打开首页或任一分类页
- **THEN** 页面不存在「加载更多」「查看全部头条与观点」按钮
- **AND** 头条区直接展示 top 分类全部条目

### Requirement: 抓取量提升
fetch-news.js SHALL 将 `ITEMS_PER_CATEGORY` 由 15 提升至 25，`PER_SOURCE_CAP` 由 6 提升至 8。

#### Scenario: 内容更丰富
- **WHEN** CI 抓取完成且各源条目充足
- **THEN** 单分类可含至多 25 条，单源至多 8 条

### Requirement: 天气面板城市选择器
SideWeather SHALL 用原生 `<select>` 替代左右箭头切换：首项「自动定位」（默认，geolocation，失败回退默认城市），其余为约 23 个城市的中文名；当前选择持久化到 localStorage；所有城市始终出现在下拉中。

#### Scenario: 换城市不丢失
- **WHEN** 用户选择另一城市后想切回原城市
- **THEN** 原城市仍在下拉列表中可直接选中，无需逐个循环翻找

#### Scenario: 箭头与单位切换移除
- **WHEN** 渲染天气面板
- **THEN** 不存在 ChevronLeft/ChevronRight 按钮，不存在 °C/°F 切换按钮，温度默认 °C

### Requirement: 天气详情展示
天气面板 SHALL 展示昼夜感知天气图标、当前温度、中文天气描述（weatherLabel），以及体感温度、湿度、风速、今日最高/最低至少四项指标。

#### Scenario: 详情完整
- **WHEN** 天气数据加载成功
- **THEN** 面板显示温度、描述与至少四项指标，链接「查看详细天气」指向中国天气网

### Requirement: 部署与线上验证
改动 SHALL 以 origin/main 为父提交推送至 main 触发既有 CI；CI 成功后线上验证：同源图标可访问、无内容拦截按钮、天气选择器含全部城市、中文界面与国内源（含中国新闻网）正常、VPN 优先排序保持。

#### Scenario: 部署成功
- **WHEN** push 到 main
- **THEN** `gh run watch` 结论为 success，部署产物包含本次改动

## MODIFIED Requirements

### Requirement: 来源图标获取方式
原为运行时请求 favicon.im（大陆不稳定）。修改为：构建期下载至 `public/icons/` 同源部署 + 运行时 onError 回退；移除 index.html 中对 favicon.im 的 preconnect。

## REMOVED Requirements

### Requirement: NewsList 分页加载
**Reason**: 用户要求「不需要操作按钮，直接显示更多的内容」。
**Migration**: 全量渲染 + `<img loading="lazy">` 控制图片请求量。

### Requirement: 天气左右箭头切换与 °C/°F 单位切换
**Reason**: 用户明确指出箭头设计最差、按钮冗余，且换城市后原城市难找回。
**Migration**: `<select>` 城市选择器（全部城市常驻）+ 默认 °C + localStorage 持久化。
