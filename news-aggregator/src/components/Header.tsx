import { HelpCircle, Search, Settings, User, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function Header({ searchValue, onSearchChange }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gn-border">
      <div className="flex items-center justify-between px-4 py-2 gap-4">
        <div className="flex items-center gap-2 min-w-fit">
          <span className="text-xl font-semibold tracking-tight text-gn-blue">News</span>
        </div>

        <div
          className={`flex-1 max-w-2xl transition-all duration-200 ${
            searchOpen ? 'flex' : 'hidden md:flex'
          }`}
        >
          <div className="flex items-center w-full px-4 py-2 bg-gn-bg rounded-full border border-transparent focus-within:border-gn-blue">
            <Search className="w-5 h-5 text-gn-gray flex-shrink-0" />
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search for topics, locations & sources"
              className="w-full ml-3 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 rounded-full hover:bg-gray-200 flex-shrink-0"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gn-gray" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5 text-gn-gray" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Help">
            <HelpCircle className="w-5 h-5 text-gn-gray" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Settings">
            <Settings className="w-5 h-5 text-gn-gray" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium"
            aria-label="User profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
