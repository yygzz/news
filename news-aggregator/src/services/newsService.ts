import { mockNewsData } from '../data/mockNews';
import { NEWS_DATA_URL, USE_MOCK } from './config';
import type { NewsData } from '../types';

export async function fetchNewsData(): Promise<NewsData> {
  if (USE_MOCK) {
    return Promise.resolve(mockNewsData);
  }

  const response = await fetch(NEWS_DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to load news: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as NewsData;
}
