import crypto from 'crypto';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RSS_FEEDS = {
  top: 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en',
  world: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
  business: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
  technology: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
  entertainment: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
  sports: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
  science: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
  health: 'https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US:en',
};

const REQUEST_TIMEOUT_MS = 10000;
const MAX_RETRIES = 3;
const ITEMS_PER_CATEGORY = 15;

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
            fetchWithRetry(res.headers.location, remaining)
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
        }
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
          console.warn(`Error fetching ${url}, retrying (${remaining} attempts left): ${err.message}`);
          setTimeout(() => attempt(remaining - 1), 1000);
        } else {
          reject(err);
        }
      });
    };

    attempt(retries);
  });
}

function parseItems(xmlText, category) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });
  const parsed = parser.parse(xmlText);
  const channel = parsed?.rss?.channel ?? parsed?.feed ?? {};
  const items = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : [];

  return items.slice(0, ITEMS_PER_CATEGORY).map((item) => {
    const link = item.link ?? '';
    const sourceText = item.source?.['#text'] ?? item.source?._ ?? '';
    const source = sourceText || extractDomain(link);
    const pubDateRaw = item.pubDate ?? item.published ?? new Date().toISOString();

    return {
      id: hashId(link),
      title: item.title ?? '',
      link,
      source,
      sourceUrl: extractDomain(link),
      pubDate: new Date(pubDateRaw).toISOString(),
      contentSnippet: (item.description ?? '').substring(0, 150),
      thumbnail: null,
      category,
      authors: undefined,
    };
  });
}

async function fetchCategory(category, url) {
  console.log(`Fetching ${category}...`);
  const xml = await fetchWithRetry(url);
  const items = parseItems(xml, category);
  console.log(`Fetched ${items.length} items for ${category}`);
  return items;
}

async function main() {
  const categories = {};
  const allItems = [];

  for (const [category, url] of Object.entries(RSS_FEEDS)) {
    try {
      const items = await fetchCategory(category, url);
      categories[category] = items;
      allItems.push(...items);
    } catch (err) {
      console.error(`Failed to fetch ${category}: ${err.message}`);
      categories[category] = [];
    }
  }

  const topStories = categories.top.slice(0, 5);

  const picksForYou = [];
  const shuffled = allItems
    .filter((item) => !topStories.some((top) => top.id === item.id))
    .sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(5, shuffled.length); i++) {
    picksForYou.push(shuffled[i]);
  }

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

  console.log(`Wrote ${outputPath} with ${allItems.length} total items`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
