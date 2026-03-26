'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import itemData from '@/content/items/items.json';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Backpack, Search, AlertTriangle } from 'lucide-react';
import type { Item, ItemCategory } from '@/types';

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

const PHASE_COLORS: Record<string, string> = {
  early: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  mid: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  late: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  postgame: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
};

const CATEGORY_COLORS: Record<string, string> = {
  tm: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  'z-crystal': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'key-item': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  'evolution-item': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  'held-item': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  medicine: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  berry: 'bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300',
  'battle-item': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  valuable: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Backpack className="text-red-500" size={28} />
          <h1 className="text-3xl font-bold">Items & Resources</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Find every TM, Z-Crystal, Key Item, and more in Pokemon Ultra Sun.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <Input
          placeholder="Search items by name, description, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.value
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
      </p>

      {/* Item grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Link key={item.id} href={`/items/${item.slug}`}>
            <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                  </div>
                  <FavoriteButton id={`item-${item.id}`} size={16} />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge
                    className={`text-[10px] ${
                      CATEGORY_COLORS[item.category] || ''
                    }`}
                  >
                    {item.category.replace('-', ' ')}
                  </Badge>
                  <Badge className={`text-[10px] ${PHASE_COLORS[item.gamePhase]}`}>
                    {item.gamePhase}
                  </Badge>
                  {item.missable && (
                    <Badge className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                      <AlertTriangle size={10} className="mr-0.5" />
                      Missable
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                  {item.description}
                </p>

                <p className="text-xs text-gray-400">
                  <span className="font-medium">Location:</span> {item.location}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Backpack size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No items match your search</p>
          <p className="text-sm mt-1">Try a different search term or category</p>
        </div>
      )}
    </div>
  );
}
