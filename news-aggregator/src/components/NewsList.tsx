import type { NewsItem } from '../types';
import { NewsCard } from './NewsCard';
import { EmptyState } from './ErrorState';
import { SkeletonCard } from './SkeletonCard';

interface NewsListProps {
  title: string;
  items: NewsItem[];
  loading?: boolean;
  emptyMessage?: string;
}

export function NewsList({ title, items, loading, emptyMessage }: NewsListProps) {
  if (loading) {
    return (
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return <EmptyState message={emptyMessage ?? `No stories available in ${title}.`} />;
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
