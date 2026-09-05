import type { MainView, NewsCategory } from '../types';

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const RAW_NEWS_DATA_URL = (import.meta.env.VITE_NEWS_DATA_URL as string | undefined) ?? 'data/news.json';
const BASE_URL = (import.meta.env.BASE_URL as string | undefined) ?? '/';
export const NEWS_DATA_URL = RAW_NEWS_DATA_URL.startsWith('http')
  ? RAW_NEWS_DATA_URL
  : `${BASE_URL}${RAW_NEWS_DATA_URL.replace(/^\/+/, '')}`;

export const CATEGORY_MAP: Record<NewsCategory, string> = {
  top: 'Top stories',
  world: 'World',
  business: 'Business',
  technology: 'Technology',
  entertainment: 'Entertainment',
  sports: 'Sports',
  science: 'Science',
  health: 'Health',
  china: '国内',
};

export const NAV_CATEGORIES: { key: NewsCategory; label: string }[] = [
  { key: 'china', label: '国内' },
  { key: 'world', label: 'World' },
  { key: 'business', label: 'Business' },
  { key: 'technology', label: 'Technology' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'sports', label: 'Sports' },
  { key: 'science', label: 'Science' },
  { key: 'health', label: 'Health' },
];

export const PERSONAL_NAV: { key: MainView; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'for-you', label: 'For you' },
  { key: 'following', label: 'Following' },
  { key: 'showcase', label: 'News Showcase' },
];
