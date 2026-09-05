import type { MainView, NewsCategory } from '../types';

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const RAW_NEWS_DATA_URL = (import.meta.env.VITE_NEWS_DATA_URL as string | undefined) ?? 'data/news.json';
const BASE_URL = (import.meta.env.BASE_URL as string | undefined) ?? '/';
export const NEWS_DATA_URL = RAW_NEWS_DATA_URL.startsWith('http')
  ? RAW_NEWS_DATA_URL
  : `${BASE_URL}${RAW_NEWS_DATA_URL.replace(/^\/+/, '')}`;

export const CATEGORY_MAP: Record<NewsCategory, string> = {
  top: '头条',
  world: '国际',
  business: '财经',
  technology: '科技',
  entertainment: '娱乐',
  sports: '体育',
  science: '科学',
  health: '健康',
  china: '国内',
};

export const NAV_CATEGORIES: { key: NewsCategory; label: string }[] = [
  { key: 'china', label: '国内' },
  { key: 'world', label: '国际' },
  { key: 'business', label: '财经' },
  { key: 'technology', label: '科技' },
  { key: 'entertainment', label: '娱乐' },
  { key: 'sports', label: '体育' },
  { key: 'science', label: '科学' },
  { key: 'health', label: '健康' },
];

export const PERSONAL_NAV: { key: MainView; label: string }[] = [
  { key: 'home', label: '首页' },
  { key: 'for-you', label: '为您推荐' },
  { key: 'following', label: '关注' },
  { key: 'showcase', label: '来源一览' },
];
