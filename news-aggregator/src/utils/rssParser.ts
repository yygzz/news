// Client-side RSS parsing utilities (reserved as fallback).
// Production data is pre-fetched by scripts/fetch-news.js into JSON.

export function parseRSSText(_xmlText: string): never {
  throw new Error('Client-side RSS parsing is not implemented. Use pre-built /data/news.json.');
}
