import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useFollowedSources } from '../hooks/useFollowedSources';
import type { UseFollowedSourcesResult } from '../hooks/useFollowedSources';

const FollowContext = createContext<UseFollowedSourcesResult | null>(null);

export function FollowProvider({ children }: { children: ReactNode }) {
  const value = useFollowedSources();
  return <FollowContext.Provider value={value}>{children}</FollowContext.Provider>;
}

export function useFollow(): UseFollowedSourcesResult {
  const ctx = useContext(FollowContext);
  if (!ctx) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return ctx;
}
