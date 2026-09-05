import { Check, Newspaper, Plus } from 'lucide-react';
import { memo } from 'react';
import { useFollow } from '../context/FollowContext';
import { useRelativeTime } from '../hooks/useRelativeTime';
import type { NewsItem } from '../types';
import { getFaviconUrl } from '../utils/helpers';

interface NewsCardProps {
  item: NewsItem;
  variant?: 'default' | 'compact' | 'featured';
  /** 用于入场动画的阶梯延迟（毫秒基数由 CSS 控制） */
  index?: number;
}

function animStyle(index?: number): React.CSSProperties | undefined {
  return index === undefined ? undefined : { animationDelay: `${Math.min(index, 20) * 40}ms` };
}

function VpnBadge() {
  return (
    <span className="text-[10px] font-semibold text-gn-blue border border-gn-blue/40 rounded px-1 py-px leading-none flex-shrink-0">
      VPN need
    </span>
  );
}

export const NewsCard = memo(function NewsCard({ item, variant = 'default', index }: NewsCardProps) {
  const relativeTime = useRelativeTime(item.pubDate);
  const { isFollowed, toggle } = useFollow();
  const followed = isFollowed(item.sourceUrl);

  const title = item.titleZh ?? item.title;
  const snippet = item.contentSnippetZh ?? item.contentSnippet;

  const openLink = () => {
    window.open(item.link, '_blank', 'noopener,noreferrer');
  };

  const onFollowClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggle(item.sourceUrl);
  };

  const followButton = (iconSize: string) => (
    <button
      onClick={(event) => onFollowClick(event)}
      className={`p-0.5 -m-0.5 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0 ${
        followed ? 'text-gn-blue' : 'text-gn-gray opacity-0 group-hover:opacity-100 focus:opacity-100'
      }`}
      aria-label={followed ? `Unfollow ${item.source}` : `Follow ${item.source}`}
      title={followed ? `Unfollow ${item.source}` : `Follow ${item.source}`}
    >
      {followed ? <Check className={iconSize} /> : <Plus className={iconSize} />}
    </button>
  );

  if (variant === 'compact') {
    return (
      <article
        onClick={openLink}
        style={animStyle(index)}
        className="news-card-enter flex gap-3 py-3 border-b border-gray-100 last:border-0 cursor-pointer group hover:bg-gn-bg rounded-lg px-2 -mx-2 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <img
              src={getFaviconUrl(item.sourceUrl)}
              alt=""
              className="w-3 h-3"
              loading="lazy"
              decoding="async"
            />
            <span className="text-[11px] text-gn-gray uppercase font-medium tracking-wide">
              {item.source}
            </span>
            {item.vpnRequired && <VpnBadge />}
            {followButton('w-3 h-3')}
          </div>
          <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-gn-blue transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gn-gray mt-1">{relativeTime}</p>
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article
        onClick={openLink}
        style={animStyle(index)}
        className="news-card-enter cursor-pointer group hover:bg-gn-bg rounded-lg p-2 -mx-2 transition-colors"
      >
        <div className="aspect-video w-full overflow-hidden rounded-lg mb-3">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gn-bg">
              <Newspaper className="w-12 h-12 text-gray-300" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 mb-2">
          <img
            src={getFaviconUrl(item.sourceUrl)}
            alt=""
            className="w-4 h-4"
            loading="lazy"
            decoding="async"
          />
          <span className="text-xs text-gn-gray">{item.source}</span>
          {item.vpnRequired && <VpnBadge />}
          {followButton('w-3.5 h-3.5')}
        </div>
        <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-gn-blue transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gn-gray mt-2 line-clamp-2">{snippet}</p>
        {item.authors && item.authors.length > 0 && (
          <p className="text-xs text-gn-gray mt-2">{item.authors.join(', ')}</p>
        )}
      </article>
    );
  }

  return (
    <article
      onClick={openLink}
      style={animStyle(index)}
      className="news-card-enter flex gap-3 cursor-pointer group hover:bg-gn-bg hover:-translate-y-0.5 hover:shadow-sm rounded-lg p-2 -mx-2 transition-all duration-200"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <img
            src={getFaviconUrl(item.sourceUrl)}
            alt=""
            className="w-4 h-4"
            loading="lazy"
            decoding="async"
          />
          <span className="text-xs text-gn-gray font-medium">{item.source}</span>
          {item.vpnRequired && <VpnBadge />}
          {followButton('w-3.5 h-3.5')}
        </div>
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-gn-blue transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gn-gray mt-1">{relativeTime}</p>
        {item.authors && item.authors.length > 0 && (
          <p className="text-xs text-gn-gray mt-0.5">{item.authors.join(', ')}</p>
        )}
      </div>
      {item.thumbnail && (
        <div className="w-[60px] h-[60px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={item.thumbnail}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
    </article>
  );
});
