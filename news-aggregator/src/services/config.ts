import type { NewsCategory } from '../types';

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
export const NEWS_DATA_URL = import.meta.env.VITE_NEWS_DATA_URL as string;

export const CATEGORY_MAP: Record<NewsCategory, string> = {
  top: 'Top stories',
  world: 'World',
  business: 'Business',
  technology: 'Technology',
  entertainment: 'Entertainment',
  sports: 'Sports',
  science: 'Science',
  health: 'Health',
};

export const NAV_CATEGORIES: { key: NewsCategory; label: string }[] = [
  { key: 'world', label: 'World' },
  { key: 'business', label: 'Business' },
  { key: 'technology', label: 'Technology' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'sports', label: 'Sports' },
  { key: 'science', label: 'Science' },
  { key: 'health', label: 'Health' },
];

export const PERSONAL_NAV = ['Home', 'For you', 'Following', 'News Showcase'];
