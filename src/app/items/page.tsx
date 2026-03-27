'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import itemData from '@/content/items/items.json';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import type { Item } from '@/types';

const items = itemData as unknown as Item[];

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'tm', label: 'TM' },
  { value: 'z-crystal', label: 'Z-Crystal' },
  { value: 'key-item', label: 'Key Item' },
  { value: 'evolution-item', label: 'Evolution Item' },
  { value: 'held-item', label: 'Held Item' },
  { value: 'medicine', label: 'Medicine' },
  { value: 'berry', label: 'Berry' },
  { value: 'battle-item', label: 'Battle Item' },
  { value: 'valuable', label: 'Valuable' },
];

const CATEGORY_COLORS: Record<string, string> = {
  tm: 'bg-indigo-100 text-indigo-700',
  'z-crystal': 'bg-yellow-100 text-yellow-800',
  'key-item': 'bg-red-100 text-red-700',
  'evolution-item': 'bg-pink-100 text-pink-700',
  'held-item': 'bg-cyan-100 text-cyan-700',
  medicine: 'bg-green-100 text-green-700',
  berry: 'bg-lime-100 text-lime-700',
  'battle-item': 'bg-orange-100 text-orange-700',
  valuable: 'bg-amber-100 text-amber-700',
};

export default function ItemsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = useMemo(() => {
    let result = items;
    if (activeCategory !== 'all') {
      result = result.filter((item) => item.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, activeCategory]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Items & Resources</h1>
        <p className="text-gray-500 text-sm">
          Find every TM, Z-Crystal, Key Item, and more in Pokemon Ultra Sun.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search items by name, description, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-colors"
        />
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              activeCategory === cat.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-4">
        {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
      </p>

      {/* Item grid */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Link key={item.id} href={`/items/${item.slug}`}>
            <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md hover:border-red-200 transition-all">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
                </div>
                <FavoriteButton id={`item-${item.id}`} size={16} />
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-600'}`}>
                  {item.category.replace('-', ' ')}
                </span>
                {item.missable && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium text-red-600 bg-red-50">
                    Missable
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                {item.description}
              </p>

              <p className="text-xs text-gray-400">
                {item.location}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg font-medium text-gray-400">No items match your search</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term or category</p>
        </div>
      )}
    </div>
  );
}
