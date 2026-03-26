import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, MapPin, Package, Swords, Lightbulb, Info } from 'lucide-react';
import { getRouteBySlug, getAllRoutes } from '@/lib/content/loader';
import { spriteUrl, METHOD_LABELS } from '@/lib/utils';
import { TypeBadge } from '@/components/shared/TypeBadge';
import { IslandBadge } from '@/components/shared/IslandBadge';
import { PercentBar } from '@/components/shared/PercentBar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/routes" className="hover:text-orange-600 transition-colors">Routes</Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium">{route.name}</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{route.name}</h1>
          <IslandBadge island={route.island} size="md" />
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold capitalize ${CATEGORY_COLORS[route.category] || ''}`}>
            {route.category}
          </span>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">{route.description}</p>
      </div>

      {/* Story Relevance */}
      {route.storyRelevance && (
        <div className="mb-8 flex gap-3 items-start rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950 p-4">
          <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 text-sm">Story Relevance</h3>
            <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">{route.storyRelevance}</p>
            {route.unlockCondition && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                <span className="font-semibold">Unlock:</span> {route.unlockCondition}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Encounter Tables */}
      {Object.keys(encounterGroups).length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <MapPin size={20} className="text-orange-500" />
              Encounter Table
              <Badge variant="secondary" className="ml-auto text-xs font-mono">
                {route.encounters.length} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {Object.entries(encounterGroups).map(([method, encounters]) => (
              <div key={method}>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                  {METHOD_LABELS[method] || method}
                  <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 pr-3 font-semibold">Pokemon</th>
                        <th className="text-left py-2 pr-3 font-semibold">Type</th>
                        <th className="text-left py-2 pr-3 font-semibold">Rate</th>
                        <th className="text-left py-2 pr-3 font-semibold">Levels</th>
                        <th className="text-left py-2 pr-3 font-semibold">Time</th>
                        <th className="text-left py-2 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {encounters.map((enc, i) => (
                        <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                          <td className="py-2.5 pr-3">
                            <Link
                              href={`/pokemon/${enc.pokemonSlug}`}
                              className="flex items-center gap-2 group/pokemon"
                            >
                              <img
                                src={enc.sprite || spriteUrl(0)}
                                alt={enc.pokemon}
                                width={32}
                                height={32}
                                className="pixelated"
                              />
                              <span className="font-medium text-orange-600 group-hover/pokemon:text-orange-700 group-hover/pokemon:underline">
                                {enc.pokemon}
                              </span>
                            </Link>
                          </td>
                          <td className="py-2.5 pr-3">
                            <div className="flex gap-1">
                              {enc.types.map((t) => (
                                <TypeBadge key={t} type={t} size="xs" />
                              ))}
                            </div>
                          </td>
                          <td className="py-2.5 pr-3">
                            <PercentBar percent={enc.percentage} />
                          </td>
                          <td className="py-2.5 pr-3 font-mono text-xs whitespace-nowrap">
                            Lv. {enc.levelRange[0]}-{enc.levelRange[1]}
                          </td>
                          <td className="py-2.5 pr-3 capitalize text-xs text-muted-foreground">
                            {enc.timeOfDay || 'Any'}
                          </td>
                          <td className="py-2.5 text-xs text-muted-foreground max-w-[200px]">
                            {enc.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Items Found Here */}
      {route.items.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Package size={20} className="text-amber-500" />
              Items Found Here
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {route.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{item.name}</span>
                      {item.hidden && (
                        <Badge variant="outline" className="text-[10px] bg-yellow-50 text-yellow-700 border-yellow-300">
                          Hidden
                        </Badge>
                      )}
                      {!item.hidden && (
                        <Badge variant="outline" className="text-[10px]">Visible</Badge>
                      )}
                    </div>
                    {item.location && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.location}</p>
                    )}
                    {item.notes && (
                      <p className="text-xs text-muted-foreground mt-0.5 italic">{item.notes}</p>
                    )}
                    {item.requiresAbility && (
                      <p className="text-xs text-orange-600 mt-0.5">Requires: {item.requiresAbility}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trainers */}
      {route.trainers.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Swords size={20} className="text-red-500" />
              Trainers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {route.trainers.map((trainer, i) => (
                <div key={i} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{trainer.name}</span>
                    <Badge variant="outline" className="text-[10px] capitalize">{trainer.type}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.pokemon.map((p, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        {typeof p === 'string' ? p : (p as any).name ? `${(p as any).name} Lv.${(p as any).level}` : JSON.stringify(p)}
                      </span>
                    ))}
                  </div>
                  {trainer.notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic">{trainer.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connected Routes */}
      {route.connectedRoutes.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Connected Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {route.connectedRoutes.map((cr) => (
                <Link
                  key={cr.slug}
                  href={`/routes/${cr.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-orange-200 group"
                >
                  <MapPin size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                  <span className="font-medium text-sm group-hover:text-orange-600 transition-colors">
                    {cr.name}
                  </span>
                  <ChevronRight size={14} className="ml-auto text-gray-300" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      {route.tips && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Lightbulb size={20} className="text-yellow-500" />
              Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{route.tips}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
