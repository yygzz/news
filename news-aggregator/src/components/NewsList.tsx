import { useEffect, useState } from 'react';
import type { NewsItem } from '../types';
import { NewsCard } from './NewsCard';
import { EmptyState } from './ErrorState';
import { SkeletonCard } from './SkeletonCard';

const PAGE_SIZE = 12;

interface NewsListProps {
  title: string;
  items: NewsItem[];
  loading?: boolean;
  emptyMessage?: string;
}

export function NewsList({ title, items, loading, emptyMessage }: NewsListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // 列表内容变化时（切换分类/搜索）重置分页，避免停留在过大的窗口。
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [title, items]);

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

  // 只渲染前 visibleCount 条，减少首屏 DOM 节点与 favicon/缩略图请求数。
  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visible.map((item, i) => (
          <NewsCard key={item.id} item={item} index={i} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
          className="mt-5 w-full py-2.5 bg-gn-bg hover:bg-gray-200 rounded-lg text-sm font-medium text-gn-gray transition-colors"
        >
          Show more ({items.length - visibleCount} remaining)
        </button>
      )}
    </section>
  );
}
