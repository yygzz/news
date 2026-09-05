import { ChevronRight, Newspaper } from 'lucide-react';
import { useState } from 'react';
import type { NewsItem } from '../types';
import { NewsCard } from './NewsCard';

interface TopStoriesProps {
  stories: NewsItem[];
  moreStories?: NewsItem[];
}

export function TopStories({ stories, moreStories = [] }: TopStoriesProps) {
  const [expanded, setExpanded] = useState(false);
  const main = stories[0];
  const side = stories.slice(1, 5);

  return (
    <section className="bg-white rounded-xl border border-gn-border p-4 mb-6">
      <div className="flex items-center gap-1 mb-4">
        <h2 className="text-lg font-bold text-gray-900">Top stories</h2>
        <ChevronRight className="w-5 h-5 text-gn-blue" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[60%]">
          <NewsCard item={main} variant="featured" />
        </div>
        <div className="lg:w-[40%] flex flex-col">
          {side.map((item) => (
            <NewsCard key={item.id} item={item} variant="compact" />
          ))}
        </div>
      </div>

      {expanded && moreStories.length > 0 && (
        <div className="mt-2 flex flex-col divide-y divide-gray-100">
          {moreStories.map((item) => (
            <NewsCard key={item.id} item={item} variant="compact" />
          ))}
        </div>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gn-bg hover:bg-gray-200 rounded-lg text-sm font-medium text-gn-gray transition-colors"
      >
        <Newspaper className="w-4 h-4" />
        {expanded ? 'Show less' : 'See more headlines & perspectives'}
      </button>
    </section>
  );
}
