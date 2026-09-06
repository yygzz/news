# Checklist

## 前端
- [x] tailwind.config.js 含 `gn-yellow: '#f9ab00'`
- [x] NewsItem 类型含 `aiGenerated?: boolean`
- [x] NewsCard 三种变体（default/compact/featured）均渲染黄色 "AI search" 徽章，样式与 VPN need 完全一致（仅颜色为 gn-yellow）
- [x] aiGenerated 与 vpnRequired 同时为 true 时两个徽章并列显示

## 数据管道
- [x] fetch-news.js 读取 data/ai-news.json；文件缺失或 JSON 非法时 console.warn 跳过，构建不失败
- [x] 仅合并 pubDate 在 72h 内的条目；按链接 hash 去重（RSS 已有同链接时跳过 AI 条目）
- [x] AI 条目标记 aiGenerated: true、category 为 top、按既有排序规则（非 VPN 优先 + 时间降序）参与合并并保持 ITEMS_PER_CATEGORY 上限
- [x] AI 条目进入 allItems：参与「为您推荐」、其来源域名参与 favicon 下载
- [x] AI 条目中文内容不触发翻译请求（hasCJK 跳过）

## 种子与自动化
- [x] data/ai-news.json 已提交（3-5 条当日真实新闻，链接真实可访问，无编造）
- [x] data/ 未被 .gitignore 忽略
- [x] 定时任务已创建：每天 08:30（北京时间，cron `30 8 * * *` + Asia/Shanghai）
- [x] 任务 message 含完整步骤、schema 约定、git push 指引及「禁止编造新闻」约束
- [x] 任务频率为每天一次（符合 Schedule 频率限制）

## 构建与部署
- [x] npm run build 本地通过（无 TS 错误）
- [x] push 后 CI conclusion=success
- [x] 线上 /news/data/news.json 含 aiGenerated 条目且位于 top 分类（top 25 条中 4 条 AI）
- [x] 浏览器截图验证黄色 AI search 徽章正常渲染（来源行、与 VPN need 同格式）

## 回归（既有功能保持）
- [x] RSS 抓取/中文翻译/favicon 同源图标不受影响
- [x] 天气面板（select 城市选择器、localStorage 持久化）不受影响
- [x] VPN need 蓝色徽章正常（线上 85 处）、非 VPN 优先排序不变
- [x] 中文界面与中国新闻网内容正常
