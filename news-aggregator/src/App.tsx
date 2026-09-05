import { useMemo, useState } from 'react';
import { CategoryNav } from './components/CategoryNav';
import { DateHeader } from './components/DateHeader';
import { EmptyState, ErrorState } from './components/ErrorState';
import { Header } from './components/Header';
import { NewsList } from './components/NewsList';
import { SidePicks } from './components/SidePicks';
import { SideWeather } from './components/SideWeather';
import { SkeletonCard, SkeletonListItem } from './components/SkeletonCard';
import { SourceShowcase } from './components/SourceShowcase';
import type { SourceInfo } from './components/SourceShowcase';
import { TopStories } from './components/TopStories';
import { FollowProvider, useFollow } from './context/FollowContext';
import { useNews } from './hooks/useNews';
import { CATEGORY_MAP } from './services/config';
import type { MainView, NewsCategory, NewsItem } from './types';

function sortByDate(items: NewsItem[]): NewsItem[] {
  return [...items].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}

function AppContent() {
  const [view, setView] = useState<MainView>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const { data, loading, error, refetch } = useNews();
  const { followed } = useFollow();

  const allItems = useMemo<NewsItem[]>(() => {
    if (!data) return [];
    const seen = new Set<string>();
    const out: NewsItem[] = [];
    const push = (item: NewsItem) => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        out.push(item);
      }
    };
    Object.values(data.categories).forEach((list) => list.forEach(push));
    data.topStories.forEach(push);
    data.picksForYou.forEach(push);
    return out;
  }, [data]);

  const sources = useMemo<SourceInfo[]>(() => {
    const map = new Map<string, SourceInfo>();
    allItems.forEach((item) => {
      const entry = map.get(item.sourceUrl) ?? {
        domain: item.sourceUrl,
        name: item.source,
        count: 0,
      };
      entry.count += 1;
      map.set(item.sourceUrl, entry);
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [allItems]);

  const query = searchQuery.trim().toLowerCase();

  const handleSelectView = (next: MainView) => {
    setView(next);
    setSourceFilter(null);
    setSearchQuery('');
  };

  const renderMainContent = () => {
    if (error) {
      return <ErrorState message={error.message} onRetry={refetch} />;
    }

    if (loading || !data) {
      return (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
          <div className="bg-white rounded-xl border border-gn-border p-4 mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
              <div className="lg:col-span-2">
                <SkeletonListItem />
                <SkeletonListItem />
                <SkeletonListItem />
                <SkeletonListItem />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      );
    }

    if (query) {
      const matched = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.source.toLowerCase().includes(query) ||
          item.contentSnippet.toLowerCase().includes(query)
      );
      return (
        <NewsList
          title={`Search results for "${searchQuery.trim()}"`}
          items={sortByDate(matched)}
          emptyMessage={`No stories matched "${searchQuery.trim()}". Try another keyword.`}
        />
      );
    }

    if (sourceFilter) {
      const matched = allItems.filter((item) => item.sourceUrl === sourceFilter);
      const name = matched[0]?.source ?? sourceFilter;
      return (
        <NewsList
          title={`Stories from ${name}`}
          items={sortByDate(matched)}
          emptyMessage={`No stories from ${name} in today's feed.`}
        />
      );
    }

    switch (view) {
      case 'home': {
        // 主页除了 Top stories 外，再展示各分类最近的新闻，提升信息量。
        const topIds = new Set(data.topStories.map((item) => item.id));
        const latest = sortByDate(allItems.filter((item) => !topIds.has(item.id)));
        return (
          <>
            <DateHeader lastUpdated={data.lastUpdated} />
            <TopStories stories={data.topStories} moreStories={data.categories.top.slice(5)} />
            <NewsList title="Latest stories" items={latest} />
            <div className="lg:hidden mt-6">
              <SidePicks items={data.picksForYou} />
            </div>
          </>
        );
      }
      case 'for-you':
        return (
          <NewsList
            title="Picks for you"
            items={data.picksForYou}
            emptyMessage="No personalized picks available yet."
          />
        );
      case 'following': {
        const followedItems = sortByDate(
          allItems.filter((item) => followed.includes(item.sourceUrl))
        );
        return (
          <NewsList
            title="Following"
            items={followedItems}
            emptyMessage="You are not following any sources yet. Hover over a story and use the + button next to its source name to follow it."
          />
        );
      }
      case 'showcase':
        return <SourceShowcase sources={sources} onSelect={setSourceFilter} />;
      case 'local':
        return <EmptyState message="Local news is not available in this feed yet." />;
      default: {
        const category: NewsCategory = view;
        return (
          <NewsList
            title={`${CATEGORY_MAP[category]} news`}
            items={data.categories[category] ?? []}
          />
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header searchValue={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryNav activeCategory={view} onSelect={handleSelectView} />
      <main className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">{renderMainContent()}</div>
          <aside className="hidden lg:block lg:w-1/3">
            {loading || !data ? (
              <div className="bg-white rounded-xl border border-gn-border p-4 mb-6">
                <SkeletonCard />
              </div>
            ) : (
              <>
                <SideWeather />
                <SidePicks items={data.picksForYou} />
              </>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <FollowProvider>
      <AppContent />
    </FollowProvider>
  );
}

export default App;
