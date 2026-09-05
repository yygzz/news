import { useEffect, useState } from 'react';

export function useRelativeTime(isoDate: string): string {
  const [relative, setRelative] = useState<string>(() => formatRelative(isoDate));

  useEffect(() => {
    setRelative(formatRelative(isoDate));
    const timer = setInterval(() => {
      setRelative(formatRelative(isoDate));
    }, 60000);
    return () => clearInterval(timer);
  }, [isoDate]);

  return relative;
}

function formatRelative(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
