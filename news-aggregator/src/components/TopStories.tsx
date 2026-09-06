import { ChevronRight } from 'lucide-react';
import type { NewsItem } from '../types';
import { NewsCard } from './NewsCard';

interface TopStoriesProps {
  stories: NewsItem[];
  moreStories?: NewsItem[];
}

export function TopStories({ stories, moreStories = [] }: TopStoriesProps) {
  const main = stories[0];
  const side = stories.slice(1, 5);

  return (
    <section className="bg-white rounded-xl border border-gn-border p-4 mb-6">
      <div className="flex items-center gap-1 mb-4">
        <h2 className="text-lg font-bold text-gray-900">头条要闻</h2>
        <ChevronRight className="w-5 h-5 text-gn-blue" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[60%]">
          <NewsCard item={main} variant="featured" index={0} />
        </div>
        <div className="lg:w-[40%] flex flex-col">
          {side.map((item, i) => (
            <NewsCard key={item.id} item={item} variant="compact" index={i + 1} />
          ))}
        </div>
      </div>

      {moreStories.length > 0 && (
        <div className="mt-2 flex flex-col divide-y divide-gray-100 expand-enter">
          {moreStories.map((item, i) => (
            <NewsCard key={item.id} item={item} variant="compact" index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
