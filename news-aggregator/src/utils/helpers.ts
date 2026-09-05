export function getFaviconUrl(input: string, size = 64): string {
  // 兼容传入完整 URL 或裸域名；favicon.im 国内可直接访问，替代需 VPN 的 Google favicon 服务。
  let domain = input;
  try {
    domain = new URL(input).hostname;
  } catch {
    // 已是裸域名
  }
  domain = domain.replace(/^www\./, '');
  return `https://favicon.im/${encodeURIComponent(domain)}?size=${size}`;
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
