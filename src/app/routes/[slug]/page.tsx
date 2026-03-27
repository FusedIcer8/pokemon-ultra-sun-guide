import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRouteBySlug, getAllRoutes } from '@/lib/content/loader';
import { spriteUrl, METHOD_LABELS } from '@/lib/utils';
import { TypeBadge } from '@/components/shared/TypeBadge';
import { IslandBadge } from '@/components/shared/IslandBadge';
import { PercentBar } from '@/components/shared/PercentBar';
import type { RouteEncounter } from '@/types';

export function generateStaticParams() {
  return getAllRoutes().map((r) => ({ slug: r.slug }));
}

const CATEGORY_COLORS: Record<string, string> = {
  route: 'bg-emerald-100 text-emerald-800',
  city: 'bg-blue-100 text-blue-800',
  cave: 'bg-stone-200 text-stone-800',
  mountain: 'bg-amber-100 text-amber-800',
  water: 'bg-cyan-100 text-cyan-800',
  building: 'bg-gray-100 text-gray-800',
  special: 'bg-purple-100 text-purple-800',
};

function groupEncountersByMethod(encounters: RouteEncounter[]): Record<string, RouteEncounter[]> {
  const groups: Record<string, RouteEncounter[]> = {};
  const sorted = [...encounters].sort((a, b) => b.percentage - a.percentage);
  for (const enc of sorted) {
    const key = enc.method;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(enc);
  }
  return groups;
}

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = getRouteBySlug(slug);

  if (!route) {
    notFound();
  }

  const encounterGroups = groupEncountersByMethod(route.encounters);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-400 mb-6">
        <Link href="/routes" className="hover:text-red-600 transition-colors">Routes</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900 font-medium">{route.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold text-gray-900">{route.name}</h1>
          <IslandBadge island={route.island} size="md" />
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold capitalize ${CATEGORY_COLORS[route.category] || ''}`}>
            {route.category}
          </span>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl">{route.description}</p>
      </div>

      {/* Story Callout */}
      {route.storyRelevance && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-semibold text-amber-800 text-sm mb-1">Story Relevance</h3>
          <p className="text-sm text-amber-800">{route.storyRelevance}</p>
          {route.unlockCondition && (
            <p className="text-xs text-amber-700 mt-2">
              <span className="font-semibold">Unlock:</span> {route.unlockCondition}
            </p>
          )}
        </div>
      )}

      {/* Encounter Table */}
      {Object.keys(encounterGroups).length > 0 && (
        <div className="mb-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Encounter Table</h2>
            <span className="text-xs font-mono text-gray-400">{route.encounters.length} total</span>
          </div>

          {Object.entries(encounterGroups).map(([method, encounters]) => (
            <div key={method}>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 px-4 py-2">
                {METHOD_LABELS[method] || method}
              </div>
              {encounters.map((enc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0"
                >
                  <img
                    src={enc.sprite || spriteUrl(0)}
                    alt={enc.pokemon}
                    width={40}
                    height={40}
                    className="w-10 h-10 pixelated flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/pokemon/${enc.pokemonSlug}`}
                      className="font-medium text-gray-900 hover:text-red-600 transition-colors"
                    >
                      {enc.pokemon}
                    </Link>
                    <div className="flex gap-1 mt-0.5">
                      {enc.types.map((t) => (
                        <TypeBadge key={t} type={t} size="xs" />
                      ))}
                    </div>
                  </div>
                  <div className="w-28 flex-shrink-0">
                    <PercentBar percent={enc.percentage} />
                  </div>
                  <span className="text-xs font-mono text-gray-600 whitespace-nowrap w-20 text-right flex-shrink-0">
                    Lv. {enc.levelRange[0]}-{enc.levelRange[1]}
                  </span>
                  {enc.timeOfDay && enc.timeOfDay !== 'any' && (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 flex-shrink-0 capitalize">
                      {enc.timeOfDay}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Items Found Here */}
      {route.items.length > 0 && (
        <div className="mb-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Items Found Here</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {route.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900">{item.name}</span>
                    {item.hidden ? (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
                        Hidden
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">
                        Visible
                      </span>
                    )}
                  </div>
                  {item.location && (
                    <p className="text-xs text-gray-400 mt-0.5">{item.location}</p>
                  )}
                  {item.notes && (
                    <p className="text-xs text-gray-400 mt-0.5 italic">{item.notes}</p>
                  )}
                  {item.requiresAbility && (
                    <p className="text-xs text-red-600 mt-0.5">Requires: {item.requiresAbility}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trainers */}
      {route.trainers.length > 0 && (
        <div className="mb-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Trainers</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {route.trainers.map((trainer, i) => (
              <div key={i} className="px-5 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">{trainer.name}</span>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 capitalize">
                    {trainer.type}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {trainer.pokemon.map((p, j) => (
                    <span
                      key={j}
                      className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600"
                    >
                      {typeof p === 'string' ? p : (p as Record<string, unknown>).name ? `${(p as Record<string, unknown>).name} Lv.${(p as Record<string, unknown>).level}` : JSON.stringify(p)}
                    </span>
                  ))}
                </div>
                {trainer.notes && (
                  <p className="text-xs text-gray-400 mt-1 italic">{trainer.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected Routes */}
      {route.connectedRoutes.length > 0 && (
        <div className="mb-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Connected Routes</h2>
          </div>
          <div className="p-4 flex flex-wrap gap-2">
            {route.connectedRoutes.map((cr) => (
              <Link
                key={cr.slug}
                href={`/routes/${cr.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                {cr.name}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {route.tips && (
        <div className="mb-8 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Tips</h2>
          <p className="text-sm text-gray-600 whitespace-pre-line">{route.tips}</p>
        </div>
      )}
    </div>
  );
}
