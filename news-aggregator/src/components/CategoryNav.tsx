import { NAV_CATEGORIES, PERSONAL_NAV } from '../services/config';
import type { MainView } from '../types';

interface CategoryNavProps {
  activeCategory: MainView;
  onSelect: (category: MainView) => void;
}

export function CategoryNav({ activeCategory, onSelect }: CategoryNavProps) {
  return (
    <nav className="bg-white border-b border-gn-border">
      <div className="flex items-center px-4 py-2 gap-6 overflow-x-auto scrollbar-hide">
        {PERSONAL_NAV.map(({ key, label }) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`whitespace-nowrap text-sm font-medium pb-2 border-b-2 transition-colors ${
                isActive
                  ? 'text-gn-blue border-gn-blue'
                  : 'text-gn-gray border-transparent hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center px-4 py-2 gap-5 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => onSelect('home')}
          className={`whitespace-nowrap text-sm font-medium pb-2 border-b-2 transition-colors ${
            activeCategory === 'home'
              ? 'text-gn-blue border-gn-blue'
              : 'text-gn-gray border-transparent hover:text-gray-900'
          }`}
        >
          U.S.
        </button>
        {NAV_CATEGORIES.map(({ key, label }) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`whitespace-nowrap text-sm font-medium pb-2 border-b-2 transition-colors ${
                isActive
                  ? 'text-gn-blue border-gn-blue'
                  : 'text-gn-gray border-transparent hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          );
        })}
        <button
          onClick={() => onSelect('local')}
          className={`whitespace-nowrap text-sm font-medium pb-2 border-b-2 transition-colors ${
            activeCategory === 'local'
              ? 'text-gn-blue border-gn-blue'
              : 'text-gn-gray border-transparent hover:text-gray-900'
          }`}
        >
          Local
        </button>
      </div>
    </nav>
  );
}
