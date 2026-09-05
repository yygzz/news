export type NewsCategory =
  | 'top'
  | 'world'
  | 'business'
  | 'technology'
  | 'entertainment'
  | 'sports'
  | 'science'
  | 'health'
  | 'china';

export type MainView = NewsCategory | 'home' | 'for-you' | 'following' | 'showcase' | 'local';

export interface NewsItem {
  id: string;
  title: string;
  /** 中文标题（构建时翻译；中文源或翻译失败时缺省，前端回退到 title） */
  titleZh?: string;
  link: string;
  source: string;
  sourceUrl: string;
  pubDate: string;
  contentSnippet: string;
  /** 中文摘要（构建时翻译） */
  contentSnippetZh?: string;
  thumbnail?: string;
  category: NewsCategory;
  authors?: string[];
  /** 来源网站在中国大陆不可直接访问，需要 VPN */
  vpnRequired?: boolean;
}

export interface WeatherData {
  location: string;
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
  tempMax?: number;
  tempMin?: number;
}

export interface NewsData {
  lastUpdated: string;
  categories: Record<NewsCategory, NewsItem[]>;
  topStories: NewsItem[];
  picksForYou: NewsItem[];
}
