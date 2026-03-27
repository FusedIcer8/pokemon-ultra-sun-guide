import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getPokemonBySlug, getAllPokemon } from '@/lib/content/loader';
import { spriteUrl, METHOD_LABELS } from '@/lib/utils';
import { TypeBadge } from '@/components/shared/TypeBadge';
import { PercentBar } from '@/components/shared/PercentBar';

export function generateStaticParams() {
  return getAllPokemon().map((p) => ({ slug: p.slug }));
}

const STAT_CONFIG: Record<string, { label: string; color: string }> = {
  hp: { label: 'HP', color: 'bg-green-500' },
  attack: { label: 'Attack', color: 'bg-red-500' },
  defense: { label: 'Defense', color: 'bg-orange-500' },
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

  const sortedLocations = [...pokemon.locations].sort((a, b) => b.percentage - a.percentage);

  const levelUpMoves = pokemon.learnset
    .filter((m) => typeof m.level === 'number')
    .sort((a, b) => (a.level as number) - (b.level as number));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-[#FAFAF8] min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-400 mb-6">
        <Link href="/pokemon" className="hover:text-red-600 transition-colors">Pokedex</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">{pokemon.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        <div className="flex-shrink-0 w-32 h-32 bg-gray-50 rounded-2xl p-2 flex items-center justify-center">
          <img
            src={spriteUrl(pokemon.id)}
            alt={pokemon.name}
            width={120}
            height={120}
            className="pixelated"
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <span className="text-sm text-gray-400 font-mono">#{String(pokemon.id).padStart(3, '0')}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">{pokemon.name}</h1>
          <div className="flex gap-2 mt-3 justify-center sm:justify-start">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} size="md" />
            ))}
          </div>
          <p className="mt-4 text-gray-600 max-w-lg">{pokemon.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
            {pokemon.abilities.map((a) => (
              <span
                key={a.name}
                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                  a.hidden
                    ? 'bg-gray-100 text-gray-500 border border-gray-200'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {a.name}{a.hidden ? ' (Hidden)' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Base Stats */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Base Stats</h2>
        <div className="space-y-3">
          {Object.entries(pokemon.baseStats).map(([key, value]) => {
            const stat = STAT_CONFIG[key];
            if (!stat) return null;
            const pct = (value / MAX_STAT) * 100;
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="w-24 text-sm text-gray-500 text-right">{stat.label}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stat.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm font-mono text-gray-700 w-10 text-right tabular-nums">{value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Where to Catch */}
      {sortedLocations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Where to Catch</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-900">Location</th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-900">Method</th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-900">Rate</th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-900">Levels</th>
                  <th className="text-left py-2 font-semibold text-gray-900">Notes</th>
                </tr>
              </thead>
              <tbody>
                {sortedLocations.map((loc, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 pr-4">
                      <Link
                        href={`/routes/${loc.routeSlug}`}
                        className="text-red-600 hover:text-red-700 font-medium hover:underline"
                      >
                        {loc.route}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                        {METHOD_LABELS[loc.method] || loc.method}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <PercentBar percent={loc.percentage} />
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-gray-700">
                      Lv. {loc.levelRange[0]}-{loc.levelRange[1]}
                    </td>
                    <td className="py-3 text-xs text-gray-400 capitalize">
                      {loc.timeOfDay || 'Any time'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Evolution Chain */}
      {pokemon.evolution.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Evolution Chain</h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {pokemon.evolution.map((stage, i) => (
              <div key={stage.pokemonSlug} className="flex items-center gap-2">
                {i > 0 && (
                  <div className="flex flex-col items-center px-2 text-center flex-shrink-0">
                    <ChevronRight size={20} className="text-gray-300" />
                    <span className="text-[10px] text-gray-400 max-w-20 leading-tight mt-0.5">
                      {stage.condition}
                    </span>
                  </div>
                )}
                <Link
                  href={`/pokemon/${stage.pokemonSlug}`}
                  className={`flex flex-col items-center p-3 rounded-xl transition-colors flex-shrink-0 ${
                    stage.pokemonSlug === slug
                      ? 'bg-red-50 ring-2 ring-red-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <img
                      src={stage.sprite}
                      alt={stage.pokemon}
                      width={56}
                      height={56}
                      className="pixelated"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-900 mt-1">{stage.pokemon}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learnset */}
      {levelUpMoves.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Learnset (Level Up)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-900 w-16">Level</th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-900">Move</th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-900">Cat.</th>
                  <th className="text-right py-2 pr-4 font-semibold text-gray-900">Power</th>
                  <th className="text-right py-2 font-semibold text-gray-900">Acc.</th>
                </tr>
              </thead>
              <tbody>
                {levelUpMoves.map((move, i) => (
                  <tr key={i} className={`border-b border-gray-100 last:border-0 ${i % 2 === 1 ? 'bg-gray-50' : ''}`}>
                    <td className="py-2 pr-4 font-mono font-semibold text-gray-900">{String(move.level)}</td>
                    <td className="py-2 pr-4 font-medium text-gray-900">{move.move}</td>
                    <td className="py-2 pr-4"><TypeBadge type={move.type} size="xs" /></td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 capitalize">{move.category}</span>
                    </td>
                    <td className="py-2 pr-4 text-right font-mono text-xs text-gray-700">
                      {move.power ?? '-'}
                    </td>
                    <td className="py-2 text-right font-mono text-xs text-gray-700">
                      {move.accuracy != null ? `${move.accuracy}%` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
