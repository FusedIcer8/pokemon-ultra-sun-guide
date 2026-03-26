'use client';

import { Suspense } from 'react';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSearch } from '@/hooks/useSearch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import type { SearchResult } from '@/types';

const TYPE_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pokemon', label: 'Pokemon' },
  { value: 'route', label: 'Routes' },
  { value: 'item', label: 'Items' },
  { value: 'story', label: 'Story' },
  { value: 'tip', label: 'Tips' },
];

const TYPE_BADGE_COLORS: Record<string, string> = {
  pokemon: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  route: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  item: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  story: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  tip: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
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
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <div className="relative">
          <SearchIcon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search Pokemon, routes, items, story, tips..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-base"
            autoFocus
          />
        </div>
      </div>

      {/* Result count */}
      {showResults && (
        <p className="text-sm text-gray-500 mb-4">
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
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                typeFilter === filter.value
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
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
              <Card className="hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5">
                <CardContent className="pt-4 flex items-start gap-3">
                  {/* Icon / sprite */}
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-lg">
                    {result.icon.startsWith('http') ? (
                      <img
                        src={result.icon}
                        alt=""
                        className="w-8 h-8 pixelated"
                      />
                    ) : (
                      <span>{result.icon}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">
                        {result.title}
                      </h3>
                      <Badge
                        className={`text-[10px] shrink-0 ${
                          TYPE_BADGE_COLORS[result.type] || ''
                        }`}
                      >
                        {result.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {result.description}
                    </p>
                    {result.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {result.tags.slice(0, 4).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px] px-1.5"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Empty states */}
      {showResults && results.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <SearchIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm mt-1">
            Try a different search term or remove the type filter
          </p>
        </div>
      )}

      {!showResults && (
        <div className="text-center py-16 text-gray-400">
          <SearchIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Start typing to search</p>
          <p className="text-sm mt-1">
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
          <h1 className="text-3xl font-bold mb-4">Search</h1>
          <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
