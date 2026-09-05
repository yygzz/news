import crypto from 'crypto';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Direct publisher feeds (RSS 2.0 and Atom), grouped by category.
// `vpn: true` marks sources whose websites are not directly reachable from
// mainland China; the UI shows a blue "VPN need" badge on those stories.
const SOURCE_FEEDS = {
  top: [
    { url: 'https://feeds.bbci.co.uk/news/rss.xml', source: 'BBC News', vpn: true },
    { url: 'https://feeds.npr.org/1001/rss.xml', source: 'NPR' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', source: 'The New York Times', vpn: true },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera', vpn: true },
  ],
  world: [
    { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC News', vpn: true },
    { url: 'https://www.theguardian.com/world/rss', source: 'The Guardian', vpn: true },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', source: 'The New York Times', vpn: true },
    { url: 'https://www.france24.com/en/rss', source: 'France 24', vpn: true },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera', vpn: true },
  ],
  business: [
    { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', source: 'BBC News', vpn: true },
    { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', source: 'CNBC' },
    { url: 'https://www.theguardian.com/uk/business/rss', source: 'The Guardian', vpn: true },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', source: 'The New York Times', vpn: true },
  ],
  technology: [
    { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', source: 'BBC News', vpn: true },
    { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge' },
    { url: 'https://techcrunch.com/feed/', source: 'TechCrunch' },
    { url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', source: 'Ars Technica' },
    { url: 'https://www.wired.com/feed/rss', source: 'Wired' },
  ],
  entertainment: [
    { url: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', source: 'BBC News', vpn: true },
    { url: 'https://variety.com/feed/', source: 'Variety' },
    { url: 'https://www.hollywoodreporter.com/feed/', source: 'The Hollywood Reporter' },
    { url: 'https://www.theguardian.com/culture/rss', source: 'The Guardian', vpn: true },
  ],
  sports: [
    { url: 'https://feeds.bbci.co.uk/sport/rss.xml', source: 'BBC Sport', vpn: true },
    { url: 'https://www.cbssports.com/rss/headlines/', source: 'CBS Sports' },
    { url: 'https://www.skysports.com/rss/12040', source: 'Sky Sports' },
    { url: 'https://www.theguardian.com/sport/rss', source: 'The Guardian', vpn: true },
  ],
  science: [
    { url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', source: 'BBC News', vpn: true },
    { url: 'https://phys.org/rss-feed/', source: 'Phys.org' },
    { url: 'https://www.sciencedaily.com/rss/all.xml', source: 'ScienceDaily' },
    { url: 'https://www.newscientist.com/feed/home/', source: 'New Scientist' },
  ],
  health: [
    { url: 'https://feeds.bbci.co.uk/news/health/rss.xml', source: 'BBC News', vpn: true },
    { url: 'https://www.who.int/rss-feeds/news-english.xml', source: 'WHO' },
    { url: 'https://feeds.npr.org/1007/rss.xml', source: 'NPR' },
    { url: 'https://www.theguardian.com/society/health/rss', source: 'The Guardian', vpn: true },
  ],
  // 国内可直接访问的中文源
  china: [
    { url: 'https://36kr.com/feed', source: '36氪' },
    { url: 'https://sspai.com/feed', source: '少数派' },
    { url: 'https://www.solidot.org/index.rss', source: 'Solidot' },
    { url: 'https://www.ifanr.com/feed', source: '爱范儿' },
    { url: 'https://www.ftchinese.com/rss/news', source: 'FT中文网' },
    { url: 'https://www.chinanews.com.cn/rss/scroll-news.xml', source: '中国新闻网' },
    { url: 'https://feeds.bbci.co.uk/zhongwen/simp/rss.xml', source: 'BBC 中文', vpn: true },
  ],
};

const REQUEST_TIMEOUT_MS = 10000;
const MAX_RETRIES = 3;
const ITEMS_PER_CATEGORY = 20;
const PER_SOURCE_CAP = 8;
const TOP_STORIES_COUNT = 5;
const PICKS_COUNT = 8;
const TRANSLATE_CONCURRENCY = 5;
const TRANSLATE_MAX_CHARS = 800;

function hashId(link) {
  return crypto.createHash('md5').update(link).digest('hex');
}

function extractDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function fetchWithRetry(url, retries = MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    const attempt = (remaining) => {
      const req = https.get(
        url,
        {
          timeout: REQUEST_TIMEOUT_MS,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregatorBot/1.0)',
          },
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            let nextUrl;
            try {
              nextUrl = new URL(res.headers.location, url).toString();
            } catch {
              reject(new Error(`Invalid redirect from ${url}`));
              return;
            }
            fetchWithRetry(nextUrl, remaining)
              .then(resolve)
              .catch(reject);
            return;
          }

          if (res.statusCode !== 200) {
            const error = new Error(`HTTP ${res.statusCode} for ${url}`);
            if (remaining > 0) {
              console.warn(`Retrying ${url} (${remaining} attempts left): ${error.message}`);
              setTimeout(() => attempt(remaining - 1), 1000);
            } else {
              reject(error);
            }
            return;
          }

          let data = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => resolve(data));
        },
      );

      req.on('timeout', () => {
        req.destroy();
        if (remaining > 0) {
          console.warn(`Timeout for ${url}, retrying (${remaining} attempts left)`);
          setTimeout(() => attempt(remaining - 1), 1000);
        } else {
          reject(new Error(`Request timeout for ${url}`));
        }
      });

      req.on('error', (err) => {
        if (remaining > 0) {
          console.warn(`Error fetching ${url}, retrying (${remaining} attempts left)`);
          setTimeout(() => attempt(remaining - 1), 1000);
        } else {
          reject(err);
        }
      });
    };

    attempt(retries);
  });
}

function textOf(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return textOf(value[0]);
  if (typeof value === 'object') {
    if (typeof value['#text'] === 'string') return value['#text'];
    if (typeof value._ === 'string') return value._;
  }
  return String(value);
}

function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const code = parseInt(hex, 16);
      return code >= 32 && code <= 0x10ffff ? String.fromCodePoint(code) : ' ';
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = parseInt(dec, 10);
      return code >= 32 && code <= 0x10ffff ? String.fromCodePoint(code) : ' ';
    })
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripHtml(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function pickLink(item) {
  const link = item.link;
  if (typeof link === 'string') return link.trim();
  if (Array.isArray(link)) {
    const alternate = link.find(
      (entry) => typeof entry === 'object' && entry !== null && (entry['@_rel'] === 'alternate' || !entry['@_rel']),
    );
    const chosen = alternate ?? link[0];
    if (typeof chosen === 'object' && chosen !== null) return String(chosen['@_href'] ?? '').trim();
    return String(chosen ?? '').trim();
  }
  if (link && typeof link === 'object') return String(link['@_href'] ?? textOf(link)).trim();
  return '';
}

function pickThumbnail(item) {
  const mediaContent = item['media:content'];
  const contentList = Array.isArray(mediaContent) ? mediaContent : mediaContent ? [mediaContent] : [];
  for (const media of contentList) {
    if (media && media['@_url'] && (!media['@_medium'] || media['@_medium'] === 'image')) {
      return media['@_url'];
    }
  }

  const mediaThumbnail = item['media:thumbnail'];
  const thumbList = Array.isArray(mediaThumbnail) ? mediaThumbnail : mediaThumbnail ? [mediaThumbnail] : [];
  if (thumbList[0] && thumbList[0]['@_url']) return thumbList[0]['@_url'];

  const enclosure = item.enclosure;
  const enclosures = Array.isArray(enclosure) ? enclosure : enclosure ? [enclosure] : [];
  for (const enc of enclosures) {
    if (enc && enc['@_url'] && typeof enc['@_type'] === 'string' && enc['@_type'].startsWith('image')) {
      return enc['@_url'];
    }
  }

  const html = `${textOf(item.description)} ${textOf(item.content)} ${textOf(item.summary)}`;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function pickAuthors(item) {
  const atomAuthor = item.author?.name ?? item.author;
  const creator = item['dc:creator'];
  const raw = atomAuthor ?? creator;
  const text = textOf(raw).trim();
  return text ? [text] : undefined;
}

function getEntries(xmlText) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });
  const parsed = parser.parse(xmlText);
  const channel = parsed?.rss?.channel;
  if (channel) {
    const items = channel.item;
    return Array.isArray(items) ? items : items ? [items] : [];
  }
  const entries = parsed?.feed?.entry;
  if (entries) {
    return Array.isArray(entries) ? entries : [entries];
  }
  return [];
}

function parseFeed(xmlText, category, source, vpnRequired) {
  return getEntries(xmlText).map((item) => {
    const link = pickLink(item);
    const pubDateRaw = item.pubDate ?? item.published ?? item.updated ?? new Date().toISOString();
    let pubDate;
    try {
      pubDate = new Date(pubDateRaw).toISOString();
    } catch {
      pubDate = new Date().toISOString();
    }

    return {
      id: hashId(link),
      title: stripHtml(textOf(item.title)),
      link,
      source,
      sourceUrl: extractDomain(link),
      pubDate,
      contentSnippet: stripHtml(textOf(item.description) || textOf(item.summary) || textOf(item.content)).substring(0, 150),
      thumbnail: pickThumbnail(item),
      category,
      authors: pickAuthors(item),
      vpnRequired: vpnRequired === true,
    };
  });
}

async function fetchFeed(feed, category) {
  try {
    const xml = await fetchWithRetry(feed.url);
    const items = parseFeed(xml, category, feed.source, feed.vpn).filter((item) => item.link && item.title);
    console.log(`Fetched ${items.length} items from ${feed.source} (${category})`);
    return items;
  } catch (err) {
    console.error(`Failed to fetch ${feed.source} (${category}): ${err.message}`);
    return [];
  }
}

async function fetchCategory(category, feeds) {
  console.log(`Fetching category ${category} from ${feeds.length} sources...`);
  const results = await Promise.all(feeds.map((feed) => fetchFeed(feed, category)));
  const seen = new Set();
  const merged = [];
  for (const items of results) {
    for (const item of items) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    }
  }
  // 优先展示无需 VPN 的内容（vpnRequired=false 在前），同组内按时间降序。
  merged.sort((a, b) => {
    if (a.vpnRequired !== b.vpnRequired) return a.vpnRequired ? 1 : -1;
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  const counts = new Map();
  const capped = [];
  for (const item of merged) {
    const used = counts.get(item.source) ?? 0;
    if (used < PER_SOURCE_CAP) {
      counts.set(item.source, used + 1);
      capped.push(item);
    }
  }

  const selected = capped.slice(0, ITEMS_PER_CATEGORY);
  if (selected.length < ITEMS_PER_CATEGORY) {
    const ids = new Set(selected.map((item) => item.id));
    for (const item of merged) {
      if (selected.length >= ITEMS_PER_CATEGORY) break;
      if (!ids.has(item.id)) {
        ids.add(item.id);
        selected.push(item);
      }
    }
  }
  return selected;
}

function hasCJK(text) {
  return /[一-鿿]/.test(text);
}

function fetchJson(url) {
  return fetchWithRetry(url, 2).then((body) => JSON.parse(body));
}

// Translate a single string to Simplified Chinese via the free Google
// Translate endpoint (no API key required, runs on GitHub Actions runners).
async function translateText(text) {
  if (!text || hasCJK(text)) return text;
  const input = text.length > TRANSLATE_MAX_CHARS ? text.slice(0, TRANSLATE_MAX_CHARS) : text;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(input)}`;
  const data = await fetchJson(url);
  const segments = Array.isArray(data?.[0]) ? data[0] : [];
  const translated = segments.map((seg) => (Array.isArray(seg) ? seg[0] : '')).join('');
  return translated || text;
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

async function translateItems(items) {
  let done = 0;
  await mapWithConcurrency(items, TRANSLATE_CONCURRENCY, async (item) => {
    try {
      const [titleZh, snippetZh] = await Promise.all([
        translateText(item.title),
        translateText(item.contentSnippet),
      ]);
      if (titleZh && titleZh !== item.title) item.titleZh = titleZh;
      if (snippetZh && snippetZh !== item.contentSnippet) item.contentSnippetZh = snippetZh;
    } catch (err) {
      console.warn(`Translation failed for "${item.title.slice(0, 40)}": ${err.message}`);
    }
    done += 1;
    if (done % 25 === 0) console.log(`Translated ${done}/${items.length} items`);
  });
}

async function main() {
  const categories = {};
  const allItems = [];

  for (const [category, feeds] of Object.entries(SOURCE_FEEDS)) {
    const items = await fetchCategory(category, feeds);
    categories[category] = items;
    allItems.push(...items);
  }

  const topStories = categories.top.slice(0, TOP_STORIES_COUNT);

  // 优先挑选无需 VPN 的内容，再随机补充。
  const picksForYou = [];
  const notVpn = allItems.filter((item) => !item.vpnRequired);
  const vpnItems = allItems.filter((item) => item.vpnRequired && !topStories.some((top) => top.id === item.id));
  const notVpnTop = notVpn
    .filter((item) => !topStories.some((top) => top.id === item.id))
    .sort(() => Math.random() - 0.5);
  for (const item of [...notVpnTop, ...vpnItems]) {
    if (picksForYou.length >= PICKS_COUNT) break;
    picksForYou.push(item);
  }

  // Translate every story (top stories, picks and category lists share the
  // same object references, so translating the deduped list covers all).
  const unique = [...new Map(allItems.map((item) => [item.id, item])).values()];
  console.log(`Translating ${unique.length} unique items to Chinese...`);
  await translateItems(unique);

  const output = {
    lastUpdated: new Date().toISOString(),
    categories,
    topStories,
    picksForYou,
  };

  const outputDir = path.join(__dirname, '..', 'public', 'data');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'news.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  const withThumbs = allItems.filter((item) => item.thumbnail).length;
  console.log(`Wrote ${outputPath} with ${allItems.length} total items (${withThumbs} with thumbnails)`);
  for (const [category, items] of Object.entries(categories)) {
    const sources = [...new Set(items.map((item) => item.source))].join(', ');
    console.log(`  ${category}: ${items.length} items [${sources}]`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
