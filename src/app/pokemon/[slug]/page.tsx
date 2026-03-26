import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, MapPin, Zap } from 'lucide-react';
import { getPokemonBySlug, getAllPokemon } from '@/lib/content/loader';
import { spriteUrl, METHOD_LABELS } from '@/lib/utils';
import { TypeBadge } from '@/components/shared/TypeBadge';
import { PercentBar } from '@/components/shared/PercentBar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function generateStaticParams() {
  return getAllPokemon().map((p) => ({ slug: p.slug }));
}

const STAT_LABELS: Record<string, { label: string; color: string }> = {
  hp: { label: 'HP', color: 'bg-red-500' },
  attack: { label: 'Attack', color: 'bg-orange-500' },
  defense: { label: 'Defense', color: 'bg-yellow-500' },
  spAtk: { label: 'Sp. Atk', color: 'bg-blue-500' },
  spDef: { label: 'Sp. Def', color: 'bg-green-500' },
  speed: { label: 'Speed', color: 'bg-pink-500' },
};

const MAX_STAT = 255;

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pokemon = getPokemonBySlug(slug);

  if (!pokemon) {
    notFound();
  }

  const statTotal = Object.values(pokemon.baseStats).reduce((sum, v) => sum + v, 0);

  const sortedLocations = [...pokemon.locations].sort((a, b) => b.percentage - a.percentage);

  const groupedLearnset = {
    levelUp: pokemon.learnset.filter((m) => typeof m.level === 'number').sort((a, b) => (a.level as number) - (b.level as number)),
    tm: pokemon.learnset.filter((m) => m.level === 'tm'),
    egg: pokemon.learnset.filter((m) => m.level === 'egg'),
    tutor: pokemon.learnset.filter((m) => m.level === 'tutor'),
    evo: pokemon.learnset.filter((m) => m.level === 'evo'),
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/pokemon" className="hover:text-orange-600 transition-colors">Pokedex</Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium">{pokemon.name}</span>
      </nav>

      {/* Hero */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-12">
        <div className="flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-sm">
          <img
            src={spriteUrl(pokemon.id)}
            alt={pokemon.name}
            width={160}
            height={160}
            className="pixelated"
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <span className="text-sm font-mono text-muted-foreground">#{String(pokemon.id).padStart(3, '0')}</span>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{pokemon.name}</h1>
          <div className="flex gap-2 mt-3 justify-center sm:justify-start">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} size="md" />
            ))}
          </div>
          <p className="mt-4 text-muted-foreground max-w-lg">{pokemon.description}</p>

          {/* Abilities */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
            {pokemon.abilities.map((a) => (
              <Badge key={a.name} variant={a.hidden ? 'outline' : 'secondary'} className="text-xs">
                {a.name}{a.hidden ? ' (Hidden)' : ''}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Base Stats */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Base Stats</CardTitle>
            <Badge variant="secondary" className="text-sm font-mono">Total: {statTotal}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(pokemon.baseStats).map(([key, value]) => {
              const stat = STAT_LABELS[key];
              if (!stat) return null;
              const pct = (value / MAX_STAT) * 100;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-16 text-sm font-medium text-right">{stat.label}</span>
                  <span className="w-10 text-sm font-mono font-semibold text-right tabular-nums">{value}</span>
                  <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stat.color} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Where to Catch */}
      {sortedLocations.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <MapPin size={20} className="text-orange-500" />
              Where to Catch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 pr-4 font-semibold">Location</th>
                    <th className="text-left py-2 pr-4 font-semibold">Method</th>
                    <th className="text-left py-2 pr-4 font-semibold">Rate</th>
                    <th className="text-left py-2 pr-4 font-semibold">Levels</th>
                    <th className="text-left py-2 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLocations.map((loc, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <td className="py-2.5 pr-4">
                        <Link
                          href={`/routes/${loc.routeSlug}`}
                          className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
                        >
                          {loc.route}
                        </Link>
                      </td>
                      <td className="py-2.5 pr-4">
                        <Badge variant="outline" className="text-xs">
                          {METHOD_LABELS[loc.method] || loc.method}
                        </Badge>
                      </td>
                      <td className="py-2.5 pr-4">
                        <PercentBar percent={loc.percentage} />
                      </td>
                      <td className="py-2.5 pr-4 font-mono text-xs">
                        Lv. {loc.levelRange[0]}-{loc.levelRange[1]}
                      </td>
                      <td className="py-2.5 capitalize text-xs text-muted-foreground">
                        {loc.timeOfDay || 'Any'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evolution Chain */}
      {pokemon.evolution.length > 1 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Evolution Chain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {pokemon.evolution.map((stage, i) => (
                <div key={stage.pokemonSlug} className="flex items-center gap-2">
                  {i > 0 && (
                    <div className="flex flex-col items-center px-2 text-center flex-shrink-0">
                      <ChevronRight size={20} className="text-gray-400" />
                      <span className="text-[10px] text-muted-foreground max-w-20 leading-tight mt-0.5">
                        {stage.condition}
                      </span>
                    </div>
                  )}
                  <Link
                    href={`/pokemon/${stage.pokemonSlug}`}
                    className={`flex flex-col items-center p-3 rounded-xl transition-colors flex-shrink-0 ${
                      stage.pokemonSlug === slug
                        ? 'bg-orange-50 dark:bg-orange-950 ring-2 ring-orange-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <img
                      src={stage.sprite}
                      alt={stage.pokemon}
                      width={64}
                      height={64}
                      className="pixelated"
                    />
                    <span className="text-xs font-semibold mt-1">{stage.pokemon}</span>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learnset */}
      {groupedLearnset.levelUp.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap size={20} className="text-yellow-500" />
              Learnset (Level Up)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 pr-4 font-semibold w-16">Level</th>
                    <th className="text-left py-2 pr-4 font-semibold">Move</th>
                    <th className="text-left py-2 pr-4 font-semibold">Type</th>
                    <th className="text-left py-2 pr-4 font-semibold">Cat.</th>
                    <th className="text-right py-2 pr-4 font-semibold">Power</th>
                    <th className="text-right py-2 font-semibold">Acc.</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedLearnset.levelUp.map((move, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <td className="py-2 pr-4 font-mono font-semibold">{String(move.level)}</td>
                      <td className="py-2 pr-4 font-medium">{move.move}</td>
                      <td className="py-2 pr-4"><TypeBadge type={move.type} size="xs" /></td>
                      <td className="py-2 pr-4">
                        <Badge variant="outline" className="text-[10px] capitalize">{move.category}</Badge>
                      </td>
                      <td className="py-2 pr-4 text-right font-mono text-xs">
                        {move.power ?? '-'}
                      </td>
                      <td className="py-2 text-right font-mono text-xs">
                        {move.accuracy != null ? `${move.accuracy}%` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TM Moves */}
      {groupedLearnset.tm.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">TM Moves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 pr-4 font-semibold">Move</th>
                    <th className="text-left py-2 pr-4 font-semibold">Type</th>
                    <th className="text-left py-2 pr-4 font-semibold">Cat.</th>
                    <th className="text-right py-2 pr-4 font-semibold">Power</th>
                    <th className="text-right py-2 font-semibold">Acc.</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedLearnset.tm.map((move, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <td className="py-2 pr-4 font-medium">{move.move}</td>
                      <td className="py-2 pr-4"><TypeBadge type={move.type} size="xs" /></td>
                      <td className="py-2 pr-4">
                        <Badge variant="outline" className="text-[10px] capitalize">{move.category}</Badge>
                      </td>
                      <td className="py-2 pr-4 text-right font-mono text-xs">{move.power ?? '-'}</td>
                      <td className="py-2 text-right font-mono text-xs">{move.accuracy != null ? `${move.accuracy}%` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
