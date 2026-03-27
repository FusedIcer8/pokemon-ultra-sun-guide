'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { TypeBadge } from '@/components/shared/TypeBadge';
import { AlolaMap } from '@/components/shared/AlolaMap';
import { spriteUrl } from '@/lib/utils';
import { getAllPokemon, getAllRoutes, getAllTips } from '@/lib/content/loader';

const pokemon = getAllPokemon();
const routes = getAllRoutes();
const tips = getAllTips();

const recentPokemon = pokemon.slice(0, 8);
const previewTips = tips.slice(0, 3);

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 text-white">
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Pokemon Ultra Sun Guide
          </h1>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto sm:text-xl">
            Your interactive companion for Alola
          </p>

          <form onSubmit={handleSearch} className="mt-8 mx-auto max-w-lg">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Pokemon, routes, items..."
                className="w-full rounded-full bg-white py-3 pl-5 pr-14 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-red-600 px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-white/80 text-sm font-medium">
            <span>{pokemon.length}+ Pokemon</span>
            <span aria-hidden="true">&middot;</span>
            <span>{routes.length} Routes</span>
            <span aria-hidden="true">&middot;</span>
            <span>Full Walkthrough</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mx-auto max-w-5xl w-full px-6 -mt-8 relative z-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/story" className="group">
            <div className="bg-white rounded-xl border border-gray-200 p-5 h-full transition-shadow hover:shadow-md">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📖</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">Story Guide</h3>
                  <p className="text-sm text-gray-500 mt-1">Step-by-step walkthrough with spoiler controls</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-red-400 transition-colors mt-1" />
              </div>
            </div>
          </Link>
          <Link href="/routes" className="group">
            <div className="bg-white rounded-xl border border-gray-200 p-5 h-full transition-shadow hover:shadow-md">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🗺️</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">Routes &amp; Pokemon</h3>
                  <p className="text-sm text-gray-500 mt-1">Encounter tables, items, and maps for every location</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-red-400 transition-colors mt-1" />
              </div>
            </div>
          </Link>
          <Link href="/unstuck" className="group">
            <div className="bg-white rounded-xl border border-gray-200 p-5 h-full transition-shadow hover:shadow-md">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🆘</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">Getting Unstuck</h3>
                  <p className="text-sm text-gray-500 mt-1">Tell us where you are and we&apos;ll help</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-red-400 transition-colors mt-1" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Interactive Alola Map */}
      <section className="mx-auto max-w-5xl w-full px-6 py-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Explore Alola</h2>
          <Link href="/routes" className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1">
            All Routes <ChevronRight size={14} />
          </Link>
        </div>
        <AlolaMap />
      </section>

      {/* Pokemon Preview */}
      <section className="mx-auto max-w-5xl w-full px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Pokemon</h2>
          <Link href="/pokemon" className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700">
            See All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin">
          {recentPokemon.map((mon) => (
            <Link
              key={mon.slug}
              href={`/pokemon/${mon.slug}`}
              className="group flex-shrink-0 w-36"
            >
              <div className="bg-white rounded-xl border border-gray-200 p-3 h-full text-center transition-shadow hover:shadow-md">
                <img
                  src={spriteUrl(mon.id)}
                  alt={mon.name}
                  width={80}
                  height={80}
                  className="pixelated mx-auto group-hover:scale-110 transition-transform"
                />
                <span className="block text-xs text-gray-400 font-mono mt-1">#{String(mon.id).padStart(3, '0')}</span>
                <span className="block font-bold text-sm text-gray-900 mt-0.5 group-hover:text-red-600 transition-colors">{mon.name}</span>
                <div className="flex gap-1 mt-2 flex-wrap justify-center">
                  {mon.types.map((t) => (
                    <TypeBadge key={t} type={t} size="xs" />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="bg-white border-t border-gray-200 py-12">
        <div className="mx-auto max-w-5xl w-full px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Tips</h2>
            <Link href="/tips" className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {previewTips.map((tip) => (
              <div key={tip.id} className="bg-white rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{tip.title}</h3>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 mt-1.5 capitalize">{tip.category}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3 line-clamp-3">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
