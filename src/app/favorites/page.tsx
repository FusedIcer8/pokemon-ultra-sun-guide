'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import pokemonData from '@/content/pokemon/pokemon.json';
import storyData from '@/content/story/story.json';
import itemData from '@/content/items/items.json';
import { useFavorites } from '@/hooks/useFavorites';
import { useChecklist } from '@/hooks/useChecklist';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { TypeBadge } from '@/components/shared/TypeBadge';
import { spriteUrl } from '@/lib/utils';
import type { Pokemon, StoryStep, Item } from '@/types';

const allPokemon = pokemonData as any[] as Pokemon[];
const allStory = storyData as any[] as StoryStep[];
const allItems = itemData as any[] as Item[];

type TabValue = 'favorites' | 'pokemon' | 'story' | 'items';

const TABS: { value: TabValue; label: string }[] = [
  { value: 'favorites', label: 'Favorites' },
  { value: 'pokemon', label: 'Pokemon' },
  { value: 'story', label: 'Story' },
  { value: 'items', label: 'Items' },
];

function ProgressBar({ checked, total, label }: { checked: number; total: number; label: string }) {
  const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-green-600">
          {checked}/{total} ({percent}%)
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="bg-green-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('favorites');
  const { favorites } = useFavorites();
  const { isChecked, toggleCheck, getProgress } = useChecklist();

  const storyProgress = getProgress('story', allStory.length);
  const caughtProgress = getProgress('caught', allPokemon.length);
  const itemsProgress = getProgress('items', allItems.length);

  const favoriteGroups = useMemo(() => {
    const pokemonFavs: Pokemon[] = [];
    const itemFavs: Item[] = [];
    const otherFavs: string[] = [];

    for (const fav of favorites) {
      if (fav.startsWith('pokemon-')) {
        const slug = fav.replace('pokemon-', '');
        const found = allPokemon.find((p) => p.slug === slug);
        if (found) pokemonFavs.push(found);
      } else if (fav.startsWith('item-')) {
        const id = fav.replace('item-', '');
        const found = allItems.find((i) => i.id === id);
        if (found) itemFavs.push(found);
      } else {
        otherFavs.push(fav);
      }
    }

    return { pokemonFavs, itemFavs, otherFavs };
  }, [favorites]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Progress</h1>
        <p className="text-gray-500">
          Track your favorites, caught Pokemon, story progress, and item collection.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.value
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div>
          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4 opacity-30">❤️</p>
              <p className="text-lg font-medium text-gray-400">No favorites yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Tap the heart icon on any Pokemon, item, or tip to save it here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Pokemon favorites */}
              {favoriteGroups.pokemonFavs.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Pokemon
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {favoriteGroups.pokemonFavs.map((p) => (
                      <Link key={p.slug} href={`/pokemon/${p.slug}`}>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer flex items-center gap-3">
                          <Image
                            src={spriteUrl(p.id)}
                            alt={p.name}
                            width={40}
                            height={40}
                            className="pixelated"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-900 text-sm">
                              #{p.id} {p.name}
                            </h4>
                            <div className="flex gap-1 mt-0.5">
                              {p.types.map((t) => (
                                <TypeBadge key={t} type={t} size="xs" />
                              ))}
                            </div>
                          </div>
                          <FavoriteButton id={`pokemon-${p.slug}`} size={16} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Item favorites */}
              {favoriteGroups.itemFavs.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Items
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {favoriteGroups.itemFavs.map((i) => (
                      <Link key={i.slug} href={`/items/${i.slug}`}>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer flex items-center gap-3">
                          <span className="text-2xl">{i.icon}</span>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-900 text-sm">{i.name}</h4>
                            <p className="text-sm text-gray-500">{i.location}</p>
                          </div>
                          <FavoriteButton id={`item-${i.id}`} size={16} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Other favorites */}
              {favoriteGroups.otherFavs.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Other
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {favoriteGroups.otherFavs.map((id) => (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm"
                      >
                        {id}
                        <FavoriteButton id={id} size={12} />
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pokemon Tab */}
      {activeTab === 'pokemon' && (
        <div>
          <ProgressBar checked={caughtProgress.checked} total={caughtProgress.total} label="Caught Pokemon" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
            {allPokemon.map((p) => {
              const caught = isChecked('caught', p.slug);
              return (
                <button
                  key={p.slug}
                  onClick={() => toggleCheck('caught', p.slug)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                    caught
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    caught ? 'border-green-500 bg-green-500' : 'border-gray-300'
                  }`}>
                    {caught && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <Image
                    src={spriteUrl(p.id)}
                    alt={p.name}
                    width={32}
                    height={32}
                    className={`pixelated ${caught ? '' : 'opacity-40 grayscale'}`}
                  />
                  <span className={`text-xs font-medium truncate ${caught ? 'text-gray-900' : 'text-gray-400'}`}>
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Story Tab */}
      {activeTab === 'story' && (
        <div>
          <ProgressBar checked={storyProgress.checked} total={storyProgress.total} label="Story Progress" />
          <div className="flex flex-col gap-2 mt-4">
            {allStory.map((s) => {
              const done = isChecked('story', s.id);
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    done ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => toggleCheck('story', s.id)}
                    className="shrink-0 transition-transform hover:scale-110"
                  >
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      done ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}>
                      {done && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
                        Ch. {s.chapter}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">{s.island}</span>
                    </div>
                    <Link
                      href={`/story/${s.slug}`}
                      className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors"
                    >
                      {s.title}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div>
          <ProgressBar checked={itemsProgress.checked} total={itemsProgress.total} label="Items Collected" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {allItems.map((i) => {
              const collected = isChecked('items', i.id);
              return (
                <div
                  key={i.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    collected ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => toggleCheck('items', i.id)}
                    className="shrink-0 transition-transform hover:scale-110"
                  >
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      collected ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}>
                      {collected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                  </button>
                  <span className="text-xl shrink-0">{i.icon}</span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/items/${i.slug}`}
                      className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors"
                    >
                      {i.name}
                    </Link>
                    <p className="text-sm text-gray-500 truncate">{i.location}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
