'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TypeBadge } from '@/components/shared/TypeBadge';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { spriteUrl } from '@/lib/utils';
import { getAllPokemon } from '@/lib/content/loader';
import type { PokemonType } from '@/types';

const allPokemon = getAllPokemon();

const ALL_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

export default function PokemonListPage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<PokemonType | null>(null);

  const filtered = useMemo(() => {
    return allPokemon.filter((mon) => {
      const matchesSearch = search === '' || mon.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === null || mon.types.includes(selectedType);
      return matchesSearch && matchesType;
    });
  }, [search, selectedType]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Pokedex</h1>
        <p className="mt-1 text-muted-foreground">
          {filtered.length} of {allPokemon.length} Pokemon
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400 dark:border-gray-700 dark:bg-gray-900"
        />
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedType(null)}
          className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
            selectedType === null
              ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
          }`}
        >
          All
        </button>
        {ALL_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(selectedType === type ? null : type)}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors capitalize ${
              selectedType === type
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Pokemon Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No Pokemon found matching your filters.</p>
          <button
            onClick={() => { setSearch(''); setSelectedType(null); }}
            className="mt-3 text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mon) => (
            <Link key={mon.slug} href={`/pokemon/${mon.slug}`} className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-orange-200">
                <CardContent className="flex items-center gap-4 pt-4 pb-4">
                  <div className="flex-shrink-0">
                    <img
                      src={spriteUrl(mon.id)}
                      alt={mon.name}
                      width={72}
                      height={72}
                      className="pixelated group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">#{String(mon.id).padStart(3, '0')}</span>
                      <FavoriteButton id={`pokemon-${mon.slug}`} size={16} />
                    </div>
                    <h3 className="font-semibold text-base group-hover:text-orange-600 transition-colors truncate">
                      {mon.name}
                    </h3>
                    <div className="flex gap-1 mt-1.5">
                      {mon.types.map((t) => (
                        <TypeBadge key={t} type={t} size="xs" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{mon.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
