export function getFaviconUrl(input: string): string {
  // 兼容传入完整 URL 或裸域名；favicon 由 CI 构建期下载到同源 icons/ 目录，避免依赖第三方服务。
  let domain = input;
  try {
    domain = new URL(input).hostname;
  } catch {
    // 已是裸域名
  }
  domain = domain.replace(/^www\./, '').toLowerCase();
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}icons/${encodeURIComponent(domain)}.png`;
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
