export type NewsCategory =
  | 'top'
  | 'world'
  | 'business'
  | 'technology'
  | 'entertainment'
  | 'sports'
  | 'science'
  | 'health';

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  sourceUrl: string;
  pubDate: string;
  contentSnippet: string;
  thumbnail?: string;
  category: NewsCategory;
  authors?: string[];
}

export interface WeatherData {
  location: string;
  temperature: number;
  weatherCode: number;
  isDay: boolean;
}

export interface NewsData {
  lastUpdated: string;
  categories: Record<NewsCategory, NewsItem[]>;
  topStories: NewsItem[];
  picksForYou: NewsItem[];
}
