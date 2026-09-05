import { getFaviconUrl } from '../utils/helpers';

export interface SourceInfo {
  domain: string;
  name: string;
  count: number;
}

interface SourceShowcaseProps {
  sources: SourceInfo[];
  onSelect: (domain: string) => void;
}

export function SourceShowcase({ sources, onSelect }: SourceShowcaseProps) {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">News Showcase</h2>
      <p className="text-sm text-gn-gray mb-4">
        Browse every source in today&apos;s feed. Select one to read its stories.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sources.map((source) => (
          <button
            key={source.domain}
            onClick={() => onSelect(source.domain)}
            className="bg-white rounded-xl border border-gn-border p-4 flex flex-col items-start gap-2 hover:bg-gn-bg transition-colors text-left"
          >
            <img src={getFaviconUrl(source.domain)} alt="" className="w-5 h-5" loading="lazy" />
            <span className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
              {source.name}
            </span>
            <span className="text-xs text-gn-gray">
              {source.count} {source.count === 1 ? 'story' : 'stories'}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
