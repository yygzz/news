# Tasks

- [x] Task 1: 前端基础（颜色 + 类型 + 徽章）
  - [x] SubTask 1.1: tailwind.config.js 的 colors 增加 `'gn-yellow': '#f9ab00'`
  - [x] SubTask 1.2: src/types/index.ts 的 NewsItem 增加 `aiGenerated?: boolean`（注释：AI 检索生成的新闻）
  - [x] SubTask 1.3: NewsCard.tsx 新增 AiBadge 组件（`AI search`，样式与 VpnBadge 完全一致仅颜色为 text-gn-yellow / border-gn-yellow/40），三种变体（default/compact/featured）来源行在 VpnBadge 之后渲染 `{item.aiGenerated && <AiBadge />}`
- [x] Task 2: fetch-news.js 合并 AI 新闻
  - [x] SubTask 2.1: 新增读取 `data/ai-news.json` 的逻辑（路径 `path.join(__dirname, '..', 'data', 'ai-news.json')`；不存在或 JSON.parse 失败时 console.warn 并返回空数组）
  - [x] SubTask 2.2: 过滤 pubDate 在 72h 内的条目，映射为 NewsItem：`id: hashId(link)`、`category: 'top'`、`aiGenerated: true`、`sourceUrl: extractDomain(link)`（schema 中 sourceUrl 缺失时兜底）、`vpnRequired` 透传、无 thumbnail/authors
  - [x] SubTask 2.3: 与既有条目按 id 去重（allItems 已有同 id 的 RSS 条目时跳过 AI 条目），合并进 categories.top 并按既有排序规则重排（非 VPN 优先 + 时间降序）、保持 ITEMS_PER_CATEGORY 上限；AI 条目纳入 allItems（参与翻译跳过/为您推荐/favicon 域名收集）
- [x] Task 3: 初始种子数据
  - [x] SubTask 3.1: 用 WebSearch 搜索当日 3-5 条真实新闻（优先国内可直连来源），按 spec 中 schema 写入 news-aggregator/data/ai-news.json（真实链接，禁止编造）
- [x] Task 4: 本地构建验证
  - [x] SubTask 4.1: `npm run build` 通过（无 TS 错误）；检查产物 dist/data/news.json 含 aiGenerated 条目且位于 top 分类
- [x] Task 5: 推送部署
  - [x] SubTask 5.1: 提交（中文 conventional commit message）并 push origin HEAD:main；`gh run watch` 等待 CI success
- [x] Task 6: 线上验证
  - [x] SubTask 6.1: 线上 /news/data/news.json 含 aiGenerated 条目；用浏览器（agent-browser / chrome-devtools）打开站点截图验证黄色 AI search 徽章正常渲染
  - [x] SubTask 6.2: 回归：RSS 图标、天气面板、中文界面、VPN need 蓝色徽章均不受影响
- [x] Task 7: 创建每日定时任务（最后执行，依赖基础设施验证通过）
  - [x] SubTask 7.1: 用 Schedule 工具创建任务：name「每日 AI 新闻搜索」、cron `30 8 * * *`、timezone Asia/Shanghai，message 为 spec.md 中「定时任务 message 全文」

# Task Dependencies
- Task 1、2 相互独立可并行；Task 3 依赖 Task 2 的 schema 约定（可先行约定后并行）
- Task 4 依赖 Task 1-3；Task 5 依赖 Task 4；Task 6 依赖 Task 5；Task 7 依赖 Task 6

# 验证证据（线上截图）
- verify/ai-badge-desktop.png：人民网/央视网/光明网条目黄色 AI search 徽章渲染正常，中文界面/天气面板/图标正常
- verify/vpn-badge.png：NYT/BBC 条目蓝色 VPN need 徽章不受影响（与 AI search 同格式仅颜色不同）
- verify/top-viewport.png：页首整体布局回归正常
