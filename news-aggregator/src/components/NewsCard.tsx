import { Check, Newspaper, Plus } from 'lucide-react';
import { useFollow } from '../context/FollowContext';
import { useRelativeTime } from '../hooks/useRelativeTime';
import type { NewsItem } from '../types';
import { getFaviconUrl } from '../utils/helpers';

interface NewsCardProps {
  item: NewsItem;
  variant?: 'default' | 'compact' | 'featured';
}

export function NewsCard({ item, variant = 'default' }: NewsCardProps) {
  const relativeTime = useRelativeTime(item.pubDate);
  const { isFollowed, toggle } = useFollow();
  const followed = isFollowed(item.sourceUrl);

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
        className="flex gap-3 py-3 border-b border-gray-100 last:border-0 cursor-pointer group hover:bg-gn-bg rounded-lg px-2 -mx-2 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <img
              src={getFaviconUrl(item.sourceUrl)}
              alt=""
              className="w-3 h-3"
              loading="lazy"
            />
            <span className="text-[11px] text-gn-gray uppercase font-medium tracking-wide">
              {item.source}
            </span>
            {followButton('w-3 h-3')}
          </div>
          <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-gn-blue transition-colors">
            {item.title}
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
        className="cursor-pointer group hover:bg-gn-bg rounded-lg p-2 -mx-2 transition-colors"
      >
        <div className="aspect-video w-full overflow-hidden rounded-lg mb-3">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
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
          />
          <span className="text-xs text-gn-gray">{item.source}</span>
          {followButton('w-3.5 h-3.5')}
        </div>
        <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-gn-blue transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-gn-gray mt-2 line-clamp-2">{item.contentSnippet}</p>
        {item.authors && item.authors.length > 0 && (
          <p className="text-xs text-gn-gray mt-2">{item.authors.join(', ')}</p>
        )}
      </article>
    );
  }

  return (
    <article
      onClick={openLink}
      className="flex gap-3 cursor-pointer group hover:bg-gn-bg rounded-lg p-2 -mx-2 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <img
            src={getFaviconUrl(item.sourceUrl)}
            alt=""
            className="w-4 h-4"
            loading="lazy"
          />
          <span className="text-xs text-gn-gray font-medium">{item.source}</span>
          {followButton('w-3.5 h-3.5')}
        </div>
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-gn-blue transition-colors">
          {item.title}
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
          />
        </div>
      )}
    </article>
  );
}
