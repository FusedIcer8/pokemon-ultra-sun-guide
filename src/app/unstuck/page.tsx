'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import pokemonData from '@/content/pokemon/pokemon.json';
import itemData from '@/content/items/items.json';
import storyData from '@/content/story/story.json';
import tipData from '@/content/tips/tips.json';
import { spriteUrl } from '@/lib/utils';
import type { Pokemon, Item, StoryStep, Tip } from '@/types';

const pokemon = pokemonData as any[] as Pokemon[];
const items = itemData as any[] as Item[];
const story = storyData as any[] as StoryStep[];
const tips = tipData as any[] as Tip[];

type HelpCategory = 'story' | 'pokemon' | 'item' | 'evolve' | 'other';

const HELP_OPTIONS: {
  value: HelpCategory;
  emoji: string;
  label: string;
  description: string;
}[] = [
  { value: 'story', emoji: '📖', label: 'Story Progression', description: "I'm stuck in the story" },
  { value: 'pokemon', emoji: '🔍', label: 'Find a Pokemon', description: "I can't find a specific Pokemon" },
  { value: 'item', emoji: '🎒', label: 'Find an Item', description: 'I need to find a specific item' },
  { value: 'evolve', emoji: '🔄', label: 'Evolve a Pokemon', description: 'I want to evolve my Pokemon' },
  { value: 'other', emoji: '❓', label: 'Something Else', description: 'General questions and tips' },
];

const ISLANDS = ['melemele', 'akala', 'ula-ula', 'poni', 'aether'] as const;

const ISLAND_LABELS: Record<string, string> = {
  melemele: 'Melemele Island',
  akala: 'Akala Island',
  'ula-ula': "Ula'ula Island",
  poni: 'Poni Island',
  aether: 'Aether Paradise',
};

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
      .filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
      .slice(0, 12);
  }, [searchQuery]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return items
      .filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
      .slice(0, 12);
  }, [searchQuery]);

  const filteredEvolvePokemon = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return pokemon
      .filter(
        (p) =>
          p.evolution.length > 1 &&
          (p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Getting Unstuck 🆘</h1>
        <p className="text-gray-500">
          Tell us what you need help with and we'll point you in the right direction.
        </p>
      </div>

      {/* Start Over */}
      {step > 1 && (
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => {
              if (step === 2 && category === 'story' && island) {
                setIsland(null);
              } else {
                resetWizard();
              }
            }}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            &larr; Back
          </button>
          <button
            onClick={resetWizard}
            className="bg-gray-100 text-gray-600 rounded-full px-4 py-2 text-sm ml-auto hover:bg-gray-200 transition-colors"
          >
            Start Over
          </button>
        </div>
      )}

      {/* Step 1: What do you need help with? */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            What do you need help with?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HELP_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => selectCategory(option.value)}
                className="bg-white rounded-xl border-2 border-gray-200 p-5 text-left hover:border-red-300 hover:bg-red-50 transition-all w-full"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.emoji}</span>
                  <div>
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Story - pick island */}
      {step === 2 && category === 'story' && !island && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            Which island are you on?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ISLANDS.map((isl) => (
              <button
                key={isl}
                onClick={() => setIsland(isl)}
                className="bg-white rounded-xl border-2 border-gray-200 p-5 text-center hover:border-red-300 hover:bg-red-50 transition-all"
              >
                <p className="font-medium text-gray-900 capitalize">
                  {ISLAND_LABELS[isl] ?? isl}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Story - show steps for island */}
      {step === 2 && category === 'story' && island && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Story steps on {ISLAND_LABELS[island] ?? island}
          </h2>
          <div className="flex flex-col gap-3">
            {filteredStory.map((s) => (
              <Link key={s.id} href={`/story/${s.slug}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400 border border-gray-200 rounded px-2 py-0.5 shrink-0">
                      Ch. {s.chapter}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm">{s.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{s.summary}</p>
                    </div>
                  </div>
                </div>
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Which Pokemon are you looking for?
          </h2>
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              placeholder="Type a Pokemon name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            {filteredPokemon.map((p) => (
              <Link key={p.slug} href={`/pokemon/${p.slug}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer flex items-center gap-3">
                  <Image
                    src={spriteUrl(p.id)}
                    alt={p.name}
                    width={40}
                    height={40}
                    className="pixelated"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm">
                      #{p.id} {p.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {p.locations.length > 0
                        ? `Found at: ${p.locations.map((l) => l.route).slice(0, 3).join(', ')}`
                        : 'Check details for location info'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            {searchQuery.trim() && filteredPokemon.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No Pokemon found matching &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Find an Item */}
      {step === 2 && category === 'item' && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Which item are you looking for?
          </h2>
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              placeholder="Type an item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            {filteredItems.map((i) => (
              <Link key={i.slug} href={`/items/${i.slug}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer flex items-center gap-3">
                  <span className="text-2xl">{i.icon}</span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm">{i.name}</h3>
                    <p className="text-sm text-gray-500">
                      {i.location} — {i.howToGet}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            {searchQuery.trim() && filteredItems.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No items found matching &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Evolve a Pokemon */}
      {step === 2 && category === 'evolve' && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Which Pokemon do you want to evolve?
          </h2>
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              placeholder="Type a Pokemon name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            {filteredEvolvePokemon.map((p) => (
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
                    <h3 className="font-bold text-gray-900 text-sm">
                      #{p.id} {p.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.evolution.map((evo, idx) => (
                        <span key={idx} className="text-xs text-gray-500">
                          {idx > 0 && ' \u2192 '}
                          {evo.pokemon}
                          {evo.condition && evo.condition !== 'Base' && (
                            <span className="text-gray-400"> ({evo.condition})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {searchQuery.trim() && filteredEvolvePokemon.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No evolving Pokemon found matching &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Other - show top tips */}
      {step === 2 && category === 'other' && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Tips</h2>
          <div className="flex flex-col gap-2">
            {topTips.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3"
              >
                <span className="text-xl shrink-0">{t.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm">{t.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/tips"
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              View all tips &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
