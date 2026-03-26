'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, BookOpen, Map, HelpCircle, ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TypeBadge } from '@/components/shared/TypeBadge';
import { IslandBadge } from '@/components/shared/IslandBadge';
import { spriteUrl } from '@/lib/utils';
import { getAllPokemon, getAllRoutes, getAllTips } from '@/lib/content/loader';

const pokemon = getAllPokemon();
const routes = getAllRoutes();
const tips = getAllTips();

const featuredRoutes = routes.slice(0, 4);
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
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 text-white">
        <div className="absolute inset-0 bg-[url('/pokeball-pattern.svg')] opacity-5" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Pokemon Ultra Sun Guide
          </h1>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto sm:text-xl">
            Your interactive companion for every route, Pokemon, and challenge in Alola
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex items-center mx-auto max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Pokemon, routes, items..."
                className="w-full rounded-l-lg border-0 bg-white/95 py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button
              type="submit"
              className="rounded-r-lg bg-gray-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Search
            </button>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm">
              {pokemon.length}+ Pokemon
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm">
              {routes.length}+ Routes
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm">
              Full Walkthrough
            </Badge>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mx-auto max-w-5xl w-full px-6 -mt-8 relative z-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/story" className="group">
            <Card className="h-full transition-shadow hover:shadow-lg border-2 hover:border-orange-200">
              <CardContent className="flex items-start gap-4 pt-6">
                <span className="text-3xl">📖</span>
                <div>
                  <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">Story Guide</CardTitle>
                  <CardDescription className="mt-1">Step-by-step walkthrough with spoiler controls</CardDescription>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/routes" className="group">
            <Card className="h-full transition-shadow hover:shadow-lg border-2 hover:border-blue-200">
              <CardContent className="flex items-start gap-4 pt-6">
                <span className="text-3xl">🗺️</span>
                <div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">Routes & Pokemon</CardTitle>
                  <CardDescription className="mt-1">Encounter tables, items, and maps for every location</CardDescription>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/unstuck" className="group">
            <Card className="h-full transition-shadow hover:shadow-lg border-2 hover:border-green-200">
              <CardContent className="flex items-start gap-4 pt-6">
                <span className="text-3xl">🆘</span>
                <div>
                  <CardTitle className="text-lg group-hover:text-green-600 transition-colors">Getting Unstuck?</CardTitle>
                  <CardDescription className="mt-1">Tell us where you are and we&apos;ll help</CardDescription>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Featured Routes */}
      <section className="mx-auto max-w-5xl w-full px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Routes</h2>
          <Link href="/routes" className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredRoutes.map((route) => (
            <Link key={route.slug} href={`/routes/${route.slug}`} className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-orange-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">
                      {route.name}
                    </CardTitle>
                    <IslandBadge island={route.island} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs capitalize">{route.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {route.encounters.length} encounters
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{route.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Pokemon */}
      <section className="mx-auto max-w-5xl w-full px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pokemon</h2>
          <Link href="/pokemon" className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin">
          {recentPokemon.map((mon) => (
            <Link
              key={mon.slug}
              href={`/pokemon/${mon.slug}`}
              className="group flex-shrink-0 w-36"
            >
              <Card className="h-full transition-all hover:shadow-lg hover:border-orange-200 text-center">
                <CardContent className="flex flex-col items-center pt-4 pb-3 px-3">
                  <img
                    src={spriteUrl(mon.id)}
                    alt={mon.name}
                    width={80}
                    height={80}
                    className="pixelated group-hover:scale-110 transition-transform"
                  />
                  <span className="text-xs text-muted-foreground font-mono mt-1">#{String(mon.id).padStart(3, '0')}</span>
                  <span className="font-semibold text-sm mt-0.5 group-hover:text-orange-600 transition-colors">{mon.name}</span>
                  <div className="flex gap-1 mt-2 flex-wrap justify-center">
                    {mon.types.map((t) => (
                      <TypeBadge key={t} type={t} size="xs" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Tips Preview */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-12">
        <div className="mx-auto max-w-5xl w-full px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Tips</h2>
            </div>
            <Link href="/tips" className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {previewTips.map((tip) => (
              <Card key={tip.id} className="h-full">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <div>
                      <CardTitle className="text-base">{tip.title}</CardTitle>
                      <Badge variant="outline" className="mt-1.5 text-xs capitalize">{tip.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
