'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import pokemonData from '@/content/pokemon/pokemon.json';
import itemData from '@/content/items/items.json';
import storyData from '@/content/story/story.json';
import tipData from '@/content/tips/tips.json';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IslandBadge } from '@/components/shared/IslandBadge';
import { spriteUrl } from '@/lib/utils';
import {
  HelpCircle,
  BookOpen,
  Search,
  Backpack,
  Sparkles,
  MessageCircleQuestion,
  ArrowLeft,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import type { Pokemon, Item, StoryStep, Tip } from '@/types';

const pokemon = pokemonData as unknown as Pokemon[];
const items = itemData as unknown as Item[];
const story = storyData as unknown as StoryStep[];
const tips = tipData as unknown as Tip[];

type HelpCategory = 'story' | 'pokemon' | 'item' | 'evolve' | 'other';

const HELP_OPTIONS: {
  value: HelpCategory;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    value: 'story',
    label: 'Story Progression',
    icon: <BookOpen size={24} />,
    description: "I'm stuck in the story",
  },
  {
    value: 'pokemon',
    label: 'Find a Pokemon',
    icon: <Search size={24} />,
    description: "I can't find a specific Pokemon",
  },
  {
    value: 'item',
    label: 'Find an Item',
    icon: <Backpack size={24} />,
    description: "I need to find a specific item",
  },
  {
    value: 'evolve',
    label: 'Evolve a Pokemon',
    icon: <Sparkles size={24} />,
    description: "I want to evolve my Pokemon",
  },
  {
    value: 'other',
    label: 'Something Else',
    icon: <MessageCircleQuestion size={24} />,
    description: 'General questions and tips',
  },
];

const ISLANDS = ['melemele', 'akala', 'ula-ula', 'poni', 'aether'] as const;

export default function UnstuckPage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<HelpCategory | null>(null);
  const [island, setIsland] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStory = useMemo(() => {
    if (!island) return [];
    return story.filter((s) => s.island === island);
  }, [island]);

  const filteredPokemon = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return pokemon
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [searchQuery]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return items
      .filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [searchQuery]);

  const filteredEvolvePokemon = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return pokemon
      .filter(
        (p) =>
          p.evolution.length > 1 &&
          (p.name.toLowerCase().includes(q) ||
            p.slug.toLowerCase().includes(q))
      )
      .slice(0, 12);
  }, [searchQuery]);

  const topTips = tips.slice(0, 10);

  const resetWizard = () => {
    setStep(1);
    setCategory(null);
    setIsland(null);
    setSearchQuery('');
  };

  const selectCategory = (cat: HelpCategory) => {
    setCategory(cat);
    setStep(2);
    setSearchQuery('');
    setIsland(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <HelpCircle size={48} className="mx-auto mb-4 text-red-500" />
        <h1 className="text-3xl font-bold mb-2">Getting Unstuck</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Tell us what you need help with and we'll point you in the right
          direction.
        </p>
      </div>

      {/* Start Over */}
      {step > 1 && (
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (step === 2 && (category === 'story' && island)) {
                setIsland(null);
              } else {
                resetWizard();
              }
            }}
            className="gap-1.5"
          >
            <ArrowLeft size={14} />
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetWizard}
            className="gap-1.5 ml-auto"
          >
            <RotateCcw size={14} />
            Start Over
          </Button>
        </div>
      )}

      {/* Step 1: What do you need help with? */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            What do you need help with?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HELP_OPTIONS.map((option) => (
              <Card
                key={option.value}
                className="cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
                onClick={() => selectCategory(option.value)}
              >
                <CardContent className="pt-4 flex items-center gap-4">
                  <div className="text-red-500 shrink-0">{option.icon}</div>
                  <div>
                    <h3 className="font-semibold text-sm">{option.label}</h3>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-300 ml-auto shrink-0"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Story - pick island */}
      {step === 2 && category === 'story' && !island && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Which island are you on?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ISLANDS.map((isl) => (
              <Card
                key={isl}
                className="cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
                onClick={() => setIsland(isl)}
              >
                <CardContent className="pt-4 text-center">
                  <IslandBadge island={isl} size="md" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Story - show steps for island */}
      {step === 2 && category === 'story' && island && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Story steps on <IslandBadge island={island as any} size="sm" />
          </h2>
          <div className="flex flex-col gap-3">
            {filteredStory.map((s) => (
              <Link key={s.id} href={`/story/${s.slug}`}>
                <Card className="hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono text-xs shrink-0">
                        Ch. {s.chapter}
                      </Badge>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm">{s.title}</h3>
                        <p className="text-xs text-gray-500 truncate">
                          {s.summary}
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-300 ml-auto shrink-0"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {filteredStory.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No story steps found for this island.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Find a Pokemon */}
      {step === 2 && category === 'pokemon' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Which Pokemon are you looking for?
          </h2>
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Type a Pokemon name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            {filteredPokemon.map((p) => (
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
                      <h3 className="font-semibold text-sm">
                        #{p.id} {p.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {p.locations.length > 0
                          ? `Found at: ${p.locations
                              .map((l) => l.route)
                              .slice(0, 3)
                              .join(', ')}`
                          : 'Check details for location info'}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-300 ml-auto shrink-0"
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
            {searchQuery.trim() && filteredPokemon.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No Pokemon found matching "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Find an Item */}
      {step === 2 && category === 'item' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Which item are you looking for?
          </h2>
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Type an item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            {filteredItems.map((i) => (
              <Link key={i.slug} href={`/items/${i.slug}`}>
                <Card className="hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="pt-3 pb-3 flex items-center gap-3">
                    <span className="text-2xl">{i.icon}</span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm">{i.name}</h3>
                      <p className="text-xs text-gray-500">
                        {i.location} — {i.howToGet}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-300 ml-auto shrink-0"
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
            {searchQuery.trim() && filteredItems.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No items found matching "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Evolve a Pokemon */}
      {step === 2 && category === 'evolve' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Which Pokemon do you want to evolve?
          </h2>
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Type a Pokemon name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            {filteredEvolvePokemon.map((p) => (
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
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm">
                        #{p.id} {p.name}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.evolution.map((evo, idx) => (
                          <span key={idx} className="text-xs text-gray-500">
                            {idx > 0 && ' → '}
                            {evo.pokemon}
                            {evo.condition && evo.condition !== 'Base' && (
                              <span className="text-gray-400">
                                {' '}
                                ({evo.condition})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-300 ml-auto shrink-0"
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
            {searchQuery.trim() && filteredEvolvePokemon.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No evolving Pokemon found matching "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Other - show top tips */}
      {step === 2 && category === 'other' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Top Tips</h2>
          <div className="flex flex-col gap-2">
            {topTips.map((t) => (
              <Card key={t.id}>
                <CardContent className="pt-3 pb-3 flex items-center gap-3">
                  <span className="text-xl shrink-0">{t.icon}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm">{t.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {t.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/tips"
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              View all tips →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
