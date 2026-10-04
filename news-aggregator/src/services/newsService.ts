import { NEWS_DATA_URL, USE_MOCK } from './config';
import type { NewsData } from '../types';

export async function fetchNewsData(): Promise<NewsData> {
  if (USE_MOCK) {
    // 开发模式才动态加载 mock 数据，生产构建不会打进 bundle。
    const { mockNewsData } = await import('../data/mockNews');
    return mockNewsData;
  }

  const response = await fetch(NEWS_DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to load news: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as NewsData;
}
