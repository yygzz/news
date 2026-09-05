export function SkeletonCard() {
  return (
    <div>
      <div className="skeleton-shimmer rounded-lg h-40 w-full mb-3" />
      <div className="skeleton-shimmer h-4 rounded w-3/4 mb-2" />
      <div className="skeleton-shimmer h-3 rounded w-1/2 mb-2" />
      <div className="skeleton-shimmer h-3 rounded w-2/3" />
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="skeleton-shimmer h-3 rounded w-1/3 mb-2" />
      <div className="skeleton-shimmer h-4 rounded w-3/4 mb-2" />
      <div className="skeleton-shimmer h-3 rounded w-1/4" />
    </div>
  );
}
