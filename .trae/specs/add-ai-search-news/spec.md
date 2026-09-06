# 每日 AI 搜索新闻（AI search 徽章）Spec

## Why
用户希望站点每天由 agent（glm5.3flash）联网搜索新闻并自动写入信息流，像其他新闻内容一样展示；这类 AI 检索条目需用黄色 "AI search" 徽章标注（与蓝色 "VPN need" 同格式），让读者一眼识别内容来源为 AI 检索。

## What Changes
- 新增 `news-aggregator/data/ai-news.json`：提交到仓库的 AI 新闻数据源，由每日定时任务维护（agent 搜索→写入→push）
- `scripts/fetch-news.js`：构建时读取并合并 ai-news.json（72h 内有效、按链接 hash 去重、标记 `aiGenerated: true`、合并进 top 分类参与既有排序、来源域名参与 favicon 下载；文件缺失或 JSON 非法时跳过不中断）
- `src/types/index.ts`：`NewsItem` 新增 `aiGenerated?: boolean`
- `src/components/NewsCard.tsx`：三种变体（default/compact/featured）新增黄色 "AI search" 徽章，格式与 VPN need 完全一致
- `tailwind.config.js`：新增 `gn-yellow: '#f9ab00'`（Google 黄，与站点 gn-blue 设计语言一致）
- 新增 TRAE 每日定时任务（Schedule 工具）：每天 08:30（北京时间）agent 联网搜索当日新闻 → 更新 data/ai-news.json → git push 触发 CI 自动部署
- 初始种子：实施时先用 WebSearch 写入 3-5 条当日真实新闻，验证端到端链路

## Impact
- Affected code: `scripts/fetch-news.js`、`src/types/index.ts`、`src/components/NewsCard.tsx`、`tailwind.config.js`、`data/ai-news.json`（新增）
- 不改动既有 RSS 抓取/翻译/favicon/天气/部署流程，既有功能零回归
- 依赖：TRAE 定时任务会话需可访问 /workspace/news-aggregator 工作区且可 git push（当前沙箱推送凭据可用，已验证）

## AI 新闻数据 schema（data/ai-news.json）
JSON 数组，每项：

```json
{
  "title": "中文标题（≤40 字）",
  "link": "新闻原文真实 URL",
  "source": "来源媒体中文名（如 新华网）",
  "sourceUrl": "来源域名（如 xinhuanet.com，去 www. 小写）",
  "pubDate": "ISO 8601 时间（新闻发布时间，未知则用当前时间）",
  "contentSnippet": "中文摘要（80-150 字，基于搜索结果概括）",
  "vpnRequired": "可选：来源在中国大陆无法直连时 true，否则省略"
}
```

构建时由 fetch-news.js 补全：`id = hashId(link)`、`category: 'top'`、`aiGenerated: true`。

## ADDED Requirements

### Requirement: AI 新闻构建期合并管道
系统 SHALL 在 CI 构建（fetch-news.js）时从 `data/ai-news.json` 读取 AI 检索新闻并合并进 `public/data/news.json` 的 top 分类。

#### Scenario: 构建合并成功
- WHEN CI 运行 fetch-news.js 且 data/ai-news.json 存在且合法
- THEN 其中 pubDate 在 72 小时内的条目被合并：标记 `aiGenerated: true`、按链接 hash 与既有条目去重（RSS 已有同链接时跳过 AI 条目）、按既有排序规则（非 VPN 优先 + 时间降序）进入 top 分类并保持 ITEMS_PER_CATEGORY 上限；AI 条目域名参与 favicon 下载；AI 条目进入 allItems（可参与「为您推荐」）

#### Scenario: 容错
- WHEN data/ai-news.json 不存在或 JSON 非法
- THEN console.warn 并跳过合并，构建不失败

### Requirement: 黄色 AI search 徽章
系统 SHALL 对 aiGenerated 条目显示黄色 "AI search" 徽章，格式与 VPN need 徽章完全一致。

#### Scenario: 徽章渲染
- WHEN NewsCard 渲染 aiGenerated=true 的条目
- THEN 来源行显示 "AI search" 徽章：`text-[10px] font-semibold text-gn-yellow border border-gn-yellow/40 rounded px-1 py-px leading-none flex-shrink-0`（与 VpnBadge 仅颜色不同）；vpnRequired 与 aiGenerated 同时为 true 时两个徽章并列显示

### Requirement: 每日自动化任务
系统 SHALL 每天自动由 agent 联网搜索新闻并写入站点。

#### Scenario: 每日运行
- WHEN 每天北京时间 08:30 定时任务触发
- THEN agent（优先 WebSearch，备选 agent-browser skill）搜索当日 6-10 条重要新闻（优先中国大陆可直连来源），按上述 schema 追加进 data/ai-news.json（按 link 去重、删除 3 天前旧条目、总量 ≤40），以 UTF-8 2 空格缩进写回，随后 `git add data/ai-news.json && git commit && git push origin HEAD:main` 触发 CI 自动部署

#### Scenario: 失败约束
- WHEN 搜索或推送失败
- THEN 记录失败原因，不虚构新闻；禁止编造不存在的新闻或链接

### 定时任务 message 全文（实施时按此创建）
> 每日 AI 新闻自动采集任务，严格按步骤执行：
> 1. 用 WebSearch 工具（不可用则用 agent-browser skill 浏览新闻网站）搜索今日重要新闻（国内外时事/科技/财经等），挑选 6-10 条，优先中国大陆可直连来源（新华网、人民网、澎湃、界面、36氪等）。
> 2. 读取 /workspace/news-aggregator/data/ai-news.json（不存在视为空数组）。
> 3. 每条新闻生成对象：title（中文标题≤40字）、link（真实原文 URL）、source（来源媒体中文名）、sourceUrl（来源域名去 www. 小写）、pubDate（ISO 8601，未知用当前时间）、contentSnippet（中文摘要 80-150 字）、vpnRequired（大陆无法直连才为 true）。按 link 去重追加。
> 4. 删除 pubDate 超过 3 天的条目，总量保持 ≤40。
> 5. 以 UTF-8、2 空格缩进写回该文件（合法 JSON 数组）。
> 6. 在 /workspace/news-aggregator 执行：git add data/ai-news.json && git commit -m "chore: 更新每日 AI 搜索新闻" && git push origin HEAD:main（推送后 GitHub Actions 自动构建部署）。
> 7. 任何步骤失败：记录原因即可，禁止编造新闻或链接，宁缺毋滥。

## MODIFIED Requirements
（无——不修改任何既有需求）

## REMOVED Requirements
（无）
