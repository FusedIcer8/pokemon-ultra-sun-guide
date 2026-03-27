'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
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
  route: 'bg-emerald-100 text-emerald-800',
  city: 'bg-blue-100 text-blue-800',
  cave: 'bg-stone-200 text-stone-800',
  mountain: 'bg-amber-100 text-amber-800',
  water: 'bg-cyan-100 text-cyan-800',
  building: 'bg-gray-100 text-gray-800',
  special: 'bg-purple-100 text-purple-800',
};

const ISLAND_BADGE_COLORS: Record<string, string> = {
  melemele: 'bg-yellow-100 text-yellow-700',
  akala: 'bg-rose-100 text-rose-700',
  'ula-ula': 'bg-red-100 text-red-700',
  poni: 'bg-purple-100 text-purple-700',
  aether: 'bg-sky-100 text-sky-700',
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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Routes & Locations</h1>
        <p className="text-gray-500 text-sm">
          {filtered.length} locations across Alola
        </p>
      </div>

      {/* Interactive Map */}
      <div className="mb-8">
        <AlolaMap />
      </div>

      {/* Island Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {ISLANDS.map((island) => (
          <button
            key={island.value}
            onClick={() => setSelectedIsland(island.value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedIsland === island.value
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
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
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Routes Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-400">No locations found matching your filters.</p>
          <button
            onClick={() => { setSelectedIsland('all'); setSelectedCategory('all'); }}
            className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {filtered.map((route) => (
            <Link key={route.slug} href={`/routes/${route.slug}`} className="group">
              <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-red-200 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                      {route.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${ISLAND_BADGE_COLORS[route.island] || 'bg-gray-100 text-gray-700'}`}>
                        {route.island.replace('-', "'")}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${CATEGORY_COLORS[route.category] || ''}`}>
                        {route.category}
                      </span>
                    </div>
                  </div>
                  <FavoriteButton id={`route-${route.slug}`} size={16} />
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{route.description}</p>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{route.encounters.length} encounters</span>
                  <span>&middot;</span>
                  <span>{route.items.length} items</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
