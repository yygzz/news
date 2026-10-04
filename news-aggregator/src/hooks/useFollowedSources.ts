import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'gn-followed-sources';

export interface UseFollowedSourcesResult {
  followed: string[];
  isFollowed: (domain: string) => boolean;
  toggle: (domain: string) => void;
}

function readStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export function useFollowedSources(): UseFollowedSourcesResult {
  const [followed, setFollowed] = useState<string[]>(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(followed));
    } catch {
      // Storage may be unavailable (private mode); following stays in-memory.
    }
  }, [followed]);

  const isFollowed = useCallback((domain: string) => followed.includes(domain), [followed]);

  const toggle = useCallback((domain: string) => {
    if (!domain) return;
    setFollowed((prev) => (prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]));
  }, []);

  return { followed, isFollowed, toggle };
}
