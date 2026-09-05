import { useEffect, useReducer } from 'react';

const TICK_MS = 60_000;

// 全局共享一个 setInterval：所有 useRelativeTime 实例订阅同一个计时器，
// 避免每张新闻卡片各自开一个 interval（内存与定时器开销随列表长度线性增长）。
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (timer === null) {
    timer = setInterval(() => {
      listeners.forEach((fn) => fn());
    }, TICK_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

/** 每分钟触发一次重渲染的共享时钟。 */
export function useNow(): number {
  const [tick, bump] = useReducer((n: number) => n + 1, 0);
  useEffect(() => subscribe(bump), []);
  return tick;
}
