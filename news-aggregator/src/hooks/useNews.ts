import { useEffect, useState } from 'react';
import { fetchNewsData } from '../services/newsService';
import type { NewsData } from '../types';

interface UseNewsResult {
  data: NewsData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useNews(): UseNewsResult {
  const [data, setData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retry, setRetry] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchNewsData()
      .then((news) => {
        if (!cancelled) {
          setData(news);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [retry]);

  const refetch = () => setRetry((r) => r + 1);

  return { data, loading, error, refetch };
}
