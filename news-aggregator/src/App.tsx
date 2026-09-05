import { useState } from 'react';
import { CategoryNav } from './components/CategoryNav';
import { DateHeader } from './components/DateHeader';
import { ErrorState } from './components/ErrorState';
import { Header } from './components/Header';
import { NewsList } from './components/NewsList';
import { SidePicks } from './components/SidePicks';
import { SideWeather } from './components/SideWeather';
import { SkeletonCard, SkeletonListItem } from './components/SkeletonCard';
import { TopStories } from './components/TopStories';
import { useNews } from './hooks/useNews';
import type { NewsCategory } from './types';

function App() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | 'home'>('home');
  const { data, loading, error, refetch } = useNews();

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

    if (activeCategory === 'home') {
      return (
        <>
          <DateHeader />
          <TopStories stories={data.topStories} />
          <div className="lg:hidden">
            <SidePicks items={data.picksForYou} />
          </div>
        </>
      );
    }

    return <NewsList category={activeCategory} items={data.categories[activeCategory] ?? []} />;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CategoryNav activeCategory={activeCategory} onSelect={setActiveCategory} />
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

export default App;
