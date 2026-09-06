# Checklist

## 基线与安全
- [x] 工作区基于 origin/main 的新分支开发；旧快照分支（ca0740a 等）未被删除或重写
- [x] .trae-html-share-packages 的未提交改动未丢失（已恢复或安全保留在 stash）

## 图标（favicon）
- [x] fetch-news.js 在 CI 中为全部唯一来源域名下载图标到 public/icons/{domain}.png，失败域名跳过且不中断构建（CI 日志：Downloaded 22/22 favicons）
- [x] helpers.getFaviconUrl 返回同源路径（BASE_URL + icons/…），与下载文件名规范化一致（去 www、小写）
- [x] index.html 不再 preconnect favicon.im；构建产物中无 favicon.im / google.com/s2 运行时引用（线上 bundle 检查为 0）
- [x] NewsCard 来源图标 img 有 onError 回退，加载失败不出现破图
- [x] 部署后线上抽样 /news/icons/{domain}.png 返回 HTTP 200（22/22 全部 200）

## 图片（缩略图）
- [x] featured 变体缩略图加载失败时显示 Newspaper 灰色占位
- [x] default 变体缩略图加载失败时隐藏容器，不留破图或空白框
- [x] 页面任何情况下不出现浏览器破图图标

## 去按钮、内容直出
- [x] NewsList 无「加载更多」按钮，条目全量渲染（图片 lazy）（线上 bundle「加载更多」出现 0 次）
- [x] TopStories 无「查看全部头条与观点」按钮，moreStories 直接渲染
- [x] Header 无帮助/设置占位按钮（搜索保留）
- [x] fetch-news.js：ITEMS_PER_CATEGORY=25、PER_SOURCE_CAP=8（线上 china 分类 25 条验证）

## 天气面板
- [x] 无 ChevronLeft/ChevronRight 箭头按钮
- [x] 无 °C/°F 切换按钮，温度固定 °C（线上 bundle 无 °F）
- [x] 城市下拉含「自动定位」默认项 + 约 23 个城市（中文名）（「自动定位」、各城市名均在线上 bundle 中）
- [x] 城市选择持久化 localStorage，刷新后保持（gn-weather-city key 在线上 bundle 中）
- [x] 面板展示温度、中文天气描述、体感/湿度/风速/最高最低
- [x] 「查看详细天气」链接指向中国天气网（weather.com.cn 在线上 bundle 中）

## 构建与部署
- [x] npm run build 本地通过（无 TS 错误）
- [x] 推送 main 后 CI 成功（gh run conclusion=success，run 34005423274，1m19s）
- [x] 部署产物包含新逻辑（线上 JS 含 select 城市逻辑、无分页按钮文案）

## 回归（既有功能保持）
- [x] 线上界面为中文（标题「今日简报/头条要闻」、导航中文）
- [x] 中国新闻网内容存在于国内分类（china 分类 25 条，均为中国新闻网）
- [x] VPN need 蓝色标注存在；各分类与「为您推荐」中非 VPN 内容排在 VPN 内容之前（topStories 前 5 条均无 VPN 标记）
- [x] GitHub Actions 定时抓取（北京时间 06:00/12:00/18:00）不受影响（schedule run 33999259197 success）
