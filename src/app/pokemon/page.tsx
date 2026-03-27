'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
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
    <div className="mx-auto max-w-6xl px-6 py-10 bg-[#FAFAF8] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pokedex</h1>
        <p className="mt-1 text-gray-600">
          {filtered.length} of {allPokemon.length} Pokemon
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
        />
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedType(null)}
          className={`rounded-full px-3 py-1 text-sm font-medium border transition-colors ${
            selectedType === null
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
          }`}
        >
          All
        </button>
        {ALL_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(selectedType === type ? null : type)}
            className={`rounded-full px-3 py-1 text-sm font-medium border transition-colors capitalize ${
              selectedType === type
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Pokemon Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-400">No Pokemon found matching your filters.</p>
          <button
            onClick={() => { setSearch(''); setSelectedType(null); }}
            className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mon) => (
            <Link key={mon.slug} href={`/pokemon/${mon.slug}`} className="group">
              <div className="relative bg-white rounded-xl border border-gray-200 p-4 h-full transition-all hover:shadow-md hover:border-red-200">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={spriteUrl(mon.id)}
                      alt={mon.name}
                      width={64}
                      height={64}
                      className="pixelated w-16 h-16 group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-gray-400 font-mono">#{String(mon.id).padStart(3, '0')}</span>
                    <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                      {mon.name}
                    </h3>
                    <div className="flex gap-1 mt-1.5">
                      {mon.types.map((t) => (
                        <TypeBadge key={t} type={t} size="xs" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1.5 line-clamp-1">{mon.description}</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <FavoriteButton id={`pokemon-${mon.slug}`} size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
