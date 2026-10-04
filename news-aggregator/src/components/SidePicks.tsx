import type { NewsItem } from '../types';
import { NewsCard } from './NewsCard';

interface SidePicksProps {
  items: NewsItem[];
}

export function SidePicks({ items }: SidePicksProps) {
  return (
    <div className="bg-white rounded-xl border border-gn-border p-4">
      <h2 className="text-lg font-bold text-gray-900 mb-2">为您推荐</h2>
      <div className="flex flex-col divide-y divide-gray-100">
        {items.map((item, i) => (
          <NewsCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
