'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IslandBadge } from '@/components/shared/IslandBadge';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { AlolaMap } from '@/components/shared/AlolaMap';
import { getAllRoutes } from '@/lib/content/loader';
import type { Island, RouteCategory } from '@/types';

const allRoutes = getAllRoutes();

const ISLANDS: { value: Island | 'all'; label: string }[] = [
  { value: 'all', label: 'All Islands' },
  { value: 'melemele', label: 'Melemele' },
  { value: 'akala', label: 'Akala' },
  { value: 'ula-ula', label: "Ula'ula" },
  { value: 'poni', label: 'Poni' },
];

const CATEGORIES: { value: RouteCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'route', label: 'Route' },
  { value: 'city', label: 'City' },
  { value: 'cave', label: 'Cave' },
  { value: 'mountain', label: 'Mountain' },
  { value: 'water', label: 'Water' },
  { value: 'special', label: 'Special' },
];

const CATEGORY_COLORS: Record<string, string> = {
  route: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  city: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  cave: 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200',
  mountain: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  water: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  building: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  special: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

export default function RoutesListPage() {
  const [selectedIsland, setSelectedIsland] = useState<Island | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<RouteCategory | 'all'>('all');

  const filtered = useMemo(() => {
    return allRoutes.filter((route) => {
      const matchIsland = selectedIsland === 'all' || route.island === selectedIsland;
      const matchCategory = selectedCategory === 'all' || route.category === selectedCategory;
      return matchIsland && matchCategory;
    });
  }, [selectedIsland, selectedCategory]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <MapPin size={28} className="text-orange-500" />
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Routes & Locations</h1>
        </div>
        <p className="text-muted-foreground">
          {filtered.length} locations across Alola
        </p>
      </div>

      {/* Interactive Map */}
      <div className="mb-8">
        <AlolaMap island={selectedIsland === 'all' ? undefined : selectedIsland} />
      </div>

      {/* Island Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {ISLANDS.map((island) => (
          <button
            key={island.value}
            onClick={() => setSelectedIsland(island.value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedIsland === island.value
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {island.label}
          </button>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors capitalize ${
              selectedCategory === cat.value
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Routes Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No locations found matching your filters.</p>
          <button
            onClick={() => { setSelectedIsland('all'); setSelectedCategory('all'); }}
            className="mt-3 text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {filtered.map((route) => (
            <Link key={route.slug} href={`/routes/${route.slug}`} className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-orange-200">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg group-hover:text-orange-600 transition-colors truncate">
                        {route.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <IslandBadge island={route.island} />
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${CATEGORY_COLORS[route.category] || ''}`}>
                          {route.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {route.encounters.length} encounters
                        </span>
                      </div>
                    </div>
                    <FavoriteButton id={`route-${route.slug}`} size={16} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{route.description}</p>
                  {route.connectedRoutes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {route.connectedRoutes.slice(0, 4).map((cr) => (
                        <span
                          key={cr.slug}
                          className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[11px] text-muted-foreground font-medium"
                        >
                          {cr.name}
                        </span>
                      ))}
                      {route.connectedRoutes.length > 4 && (
                        <span className="text-[11px] text-muted-foreground">
                          +{route.connectedRoutes.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
