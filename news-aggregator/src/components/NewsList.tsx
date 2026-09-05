import type { NewsCategory, NewsItem } from '../types';
import { CATEGORY_MAP } from '../services/config';
import { NewsCard } from './NewsCard';
import { EmptyState } from './ErrorState';
import { SkeletonCard } from './SkeletonCard';

interface NewsListProps {
  category: NewsCategory;
  items: NewsItem[];
  loading?: boolean;
}

export function NewsList({ category, items, loading }: NewsListProps) {
  if (loading) {
    return (
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{CATEGORY_MAP[category]} news</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return <EmptyState message={`No stories available in ${CATEGORY_MAP[category]}.`} />;
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{CATEGORY_MAP[category]} news</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
