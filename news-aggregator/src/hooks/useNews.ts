import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchNewsData } from '../services/newsService';
import type { NewsData } from '../types';

const BACKGROUND_REFRESH_MS = 30 * 60 * 1000;
const VISIBILITY_REFRESH_MS = 10 * 60 * 1000;

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
  const lastFetchRef = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchNewsData()
      .then((news) => {
        if (!cancelled) {
          setData(news);
          setLoading(false);
          lastFetchRef.current = Date.now();
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

  const refreshInBackground = useCallback(() => {
    fetchNewsData()
      .then((news) => {
        setData(news);
        lastFetchRef.current = Date.now();
      })
      .catch(() => {
        // Keep the previously loaded data when a background refresh fails.
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      refreshInBackground();
    }, BACKGROUND_REFRESH_MS);

    const onVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastFetchRef.current > VISIBILITY_REFRESH_MS
      ) {
        refreshInBackground();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [refreshInBackground]);

  const refetch = useCallback(() => setRetry((r) => r + 1), []);

  return { data, loading, error, refetch };
}
