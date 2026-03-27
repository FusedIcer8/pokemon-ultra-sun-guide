'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSearch } from '@/hooks/useSearch';

const TYPE_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pokemon', label: 'Pokemon' },
  { value: 'route', label: 'Routes' },
  { value: 'item', label: 'Items' },
  { value: 'story', label: 'Story' },
  { value: 'tip', label: 'Tips' },
];

const TYPE_BADGE_COLORS: Record<string, string> = {
  pokemon: 'bg-red-100 text-red-700',
  route: 'bg-green-100 text-green-700',
  item: 'bg-blue-100 text-blue-700',
  story: 'bg-purple-100 text-purple-700',
  tip: 'bg-yellow-100 text-yellow-800',
};

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState('all');
  const { search } = useSearch();

  const results = useMemo(() => {
    const raw = search(query);
    const items = raw.map((r) => r.item);
    if (typeFilter === 'all') return items;
    return items.filter((item) => item.type === typeFilter);
  }, [query, typeFilter, search]);

  const showResults = query.trim().length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Results</h1>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            placeholder="Search Pokemon, routes, items, story, tips..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
            autoFocus
          />
        </div>
      </div>

      {/* Result count */}
      {showResults && (
        <p className="text-gray-500 text-sm mb-4">
          {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
        </p>
      )}

      {/* Type filter pills */}
      {showResults && (
        <div className="flex flex-wrap gap-2 mb-6">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setTypeFilter(filter.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                typeFilter === filter.value
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {showResults && results.length > 0 && (
        <div className="flex flex-col gap-3">
          {results.map((result) => (
            <Link key={`${result.type}-${result.id}`} href={result.link}>
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  {/* Icon / sprite */}
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 text-lg">
                    {result.icon.startsWith('http') ? (
                      <img src={result.icon} alt="" className="w-8 h-8 pixelated" />
                    ) : (
                      <span>{result.icon}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-sm truncate">
                        {result.title}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 capitalize ${
                          TYPE_BADGE_COLORS[result.type] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {result.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {result.description}
                    </p>
                    {result.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {result.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-gray-400 border border-gray-200 rounded-full px-1.5 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty states */}
      {showResults && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4 opacity-30">🔍</p>
          <p className="text-lg font-medium text-gray-400">No results found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try a different search term or remove the type filter
          </p>
        </div>
      )}

      {!showResults && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4 opacity-30">🔍</p>
          <p className="text-lg font-medium text-gray-400">Start typing to search</p>
          <p className="text-sm text-gray-400 mt-1">
            Search across Pokemon, routes, items, story chapters, and tips
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Results</h1>
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
