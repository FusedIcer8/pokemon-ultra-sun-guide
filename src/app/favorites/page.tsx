'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import pokemonData from '@/content/pokemon/pokemon.json';
import storyData from '@/content/story/story.json';
import itemData from '@/content/items/items.json';
import { useFavorites } from '@/hooks/useFavorites';
import { useChecklist } from '@/hooks/useChecklist';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { IslandBadge } from '@/components/shared/IslandBadge';
import { spriteUrl } from '@/lib/utils';
import {
  Heart,
  Star,
  BookOpen,
  Backpack,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import type { Pokemon, StoryStep, Item } from '@/types';

const allPokemon = pokemonData as unknown as Pokemon[];
const allStory = storyData as unknown as StoryStep[];
const allItems = itemData as unknown as Item[];

function ProgressBar({
  checked,
  total,
  label,
}: {
  checked: number;
  total: number;
  label: string;
}) {
  const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-sm font-bold text-red-600">
          {checked}/{total} ({percent}%)
        </span>
      </div>
      <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function FavoritesPage() {
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
        <div className="flex items-center gap-3 mb-2">
          <Heart className="text-red-500" size={28} />
          <h1 className="text-3xl font-bold">My Progress</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Track your favorites, caught Pokemon, story progress, and item
          collection.
        </p>
      </div>

      {/* Overall progress summary */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-8 border border-gray-200 dark:border-gray-800">
        <ProgressBar
          checked={storyProgress.checked}
          total={storyProgress.total}
          label="Story"
        />
        <ProgressBar
          checked={caughtProgress.checked}
          total={caughtProgress.total}
          label="Caught"
        />
        <ProgressBar
          checked={itemsProgress.checked}
          total={itemsProgress.total}
          label="Items"
        />
      </div>

      <Tabs defaultValue="favorites">
        <TabsList>
          <TabsTrigger value="favorites" className="gap-1.5">
            <Heart size={14} />
            Favorites ({favorites.length})
          </TabsTrigger>
          <TabsTrigger value="caught" className="gap-1.5">
            <Star size={14} />
            Caught
          </TabsTrigger>
          <TabsTrigger value="story" className="gap-1.5">
            <BookOpen size={14} />
            Story
          </TabsTrigger>
          <TabsTrigger value="items" className="gap-1.5">
            <Backpack size={14} />
            Items
          </TabsTrigger>
        </TabsList>

        {/* Favorites tab */}
        <TabsContent value="favorites" className="mt-6">
          {favorites.length === 0 ? (
            <EmptyState
              icon={<Heart size={48} />}
              title="No favorites yet"
              description="Tap the heart icon on any Pokemon, item, or tip to save it here."
            />
          ) : (
            <div className="flex flex-col gap-6">
              {/* Pokemon favorites */}
              {favoriteGroups.pokemonFavs.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Pokemon
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {favoriteGroups.pokemonFavs.map((p) => (
                      <Link key={p.slug} href={`/pokemon/${p.slug}`}>
                        <Card className="hover:shadow-md transition-all cursor-pointer">
                          <CardContent className="pt-3 pb-3 flex items-center gap-3">
                            <Image
                              src={spriteUrl(p.id)}
                              alt={p.name}
                              width={40}
                              height={40}
                              className="pixelated"
                            />
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm">
                                #{p.id} {p.name}
                              </h4>
                              <div className="flex gap-1 mt-0.5">
                                {p.types.map((t) => (
                                  <Badge key={t} variant="secondary" className="text-[10px]">
                                    {t}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <FavoriteButton
                              id={`pokemon-${p.slug}`}
                              size={16}
                            />
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Item favorites */}
              {favoriteGroups.itemFavs.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Items
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {favoriteGroups.itemFavs.map((i) => (
                      <Link key={i.slug} href={`/items/${i.slug}`}>
                        <Card className="hover:shadow-md transition-all cursor-pointer">
                          <CardContent className="pt-3 pb-3 flex items-center gap-3">
                            <span className="text-2xl">{i.icon}</span>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm">
                                {i.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {i.location}
                              </p>
                            </div>
                            <FavoriteButton id={`item-${i.id}`} size={16} />
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Other favorites */}
              {favoriteGroups.otherFavs.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Other
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {favoriteGroups.otherFavs.map((id) => (
                      <Badge key={id} variant="secondary" className="px-3 py-1">
                        {id}
                        <FavoriteButton id={id} size={12} />
                      </Badge>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </TabsContent>

        {/* Caught Pokemon tab */}
        <TabsContent value="caught" className="mt-6">
          <ProgressBar
            checked={caughtProgress.checked}
            total={caughtProgress.total}
            label="Caught Pokemon"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
            {allPokemon.map((p) => {
              const caught = isChecked('caught', p.slug);
              return (
                <button
                  key={p.slug}
                  onClick={() => toggleCheck('caught', p.slug)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                    caught
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900'
                      : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  {caught ? (
                    <CheckCircle2
                      size={16}
                      className="text-green-500 fill-green-500 shrink-0"
                    />
                  ) : (
                    <Circle
                      size={16}
                      className="text-gray-300 dark:text-gray-600 shrink-0"
                    />
                  )}
                  <Image
                    src={spriteUrl(p.id)}
                    alt={p.name}
                    width={32}
                    height={32}
                    className={`pixelated ${caught ? '' : 'opacity-40 grayscale'}`}
                  />
                  <span
                    className={`text-xs font-medium truncate ${
                      caught
                        ? 'text-gray-900 dark:text-gray-100'
                        : 'text-gray-400'
                    }`}
                  >
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
          {allPokemon.length === 0 && (
            <EmptyState
              icon={<Star size={48} />}
              title="No Pokemon data loaded"
              description="Pokemon data will appear here once content is available."
            />
          )}
        </TabsContent>

        {/* Story Progress tab */}
        <TabsContent value="story" className="mt-6">
          <ProgressBar
            checked={storyProgress.checked}
            total={storyProgress.total}
            label="Story Progress"
          />
          <div className="flex flex-col gap-2 mt-4">
            {allStory.map((s) => {
              const done = isChecked('story', s.id);
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    done
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900'
                      : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <button
                    onClick={() => toggleCheck('story', s.id)}
                    className="shrink-0 transition-transform hover:scale-110"
                  >
                    {done ? (
                      <CheckCircle2
                        size={18}
                        className="text-green-500 fill-green-500"
                      />
                    ) : (
                      <Circle
                        size={18}
                        className="text-gray-300 dark:text-gray-600"
                      />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        Ch. {s.chapter}
                      </Badge>
                      <IslandBadge island={s.island as any} size="sm" />
                    </div>
                    <Link
                      href={`/story/${s.slug}`}
                      className="text-sm font-medium hover:text-red-600 transition-colors"
                    >
                      {s.title}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          {allStory.length === 0 && (
            <EmptyState
              icon={<BookOpen size={48} />}
              title="No story data loaded"
              description="Story steps will appear here once content is available."
            />
          )}
        </TabsContent>

        {/* Items Collected tab */}
        <TabsContent value="items" className="mt-6">
          <ProgressBar
            checked={itemsProgress.checked}
            total={itemsProgress.total}
            label="Items Collected"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {allItems.map((i) => {
              const collected = isChecked('items', i.id);
              return (
                <div
                  key={i.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    collected
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900'
                      : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <button
                    onClick={() => toggleCheck('items', i.id)}
                    className="shrink-0 transition-transform hover:scale-110"
                  >
                    {collected ? (
                      <CheckCircle2
                        size={18}
                        className="text-green-500 fill-green-500"
                      />
                    ) : (
                      <Circle
                        size={18}
                        className="text-gray-300 dark:text-gray-600"
                      />
                    )}
                  </button>
                  <span className="text-xl shrink-0">{i.icon}</span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/items/${i.slug}`}
                      className="text-sm font-medium hover:text-red-600 transition-colors"
                    >
                      {i.name}
                    </Link>
                    <p className="text-xs text-gray-500 truncate">
                      {i.location}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {allItems.length === 0 && (
            <EmptyState
              icon={<Backpack size={48} />}
              title="No items data loaded"
              description="Items will appear here once content is available."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center py-16 text-gray-400">
      <div className="mx-auto mb-4 opacity-30 flex justify-center">{icon}</div>
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm mt-1">{description}</p>
    </div>
  );
}
