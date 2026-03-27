'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin, Users, Package, Swords } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TypeBadge } from '@/components/shared/TypeBadge';
import { PercentBar } from '@/components/shared/PercentBar';
import { spriteUrl } from '@/lib/utils';
import routeData from '@/content/routes/routes.json';

const routes = routeData as any[];

const ISLANDS = [
  { id: 'melemele', name: 'Melemele', color: '#F59E0B', bg: 'from-yellow-500 to-amber-500', light: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-800' },
  { id: 'akala', name: 'Akala', color: '#EC4899', bg: 'from-rose-500 to-pink-500', light: 'bg-rose-50 border-rose-200', badge: 'bg-rose-100 text-rose-800' },
  { id: 'ula-ula', name: "Ula'ula", color: '#EF4444', bg: 'from-red-500 to-orange-500', light: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-800' },
  { id: 'poni', name: 'Poni', color: '#A855F7', bg: 'from-purple-500 to-violet-500', light: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-800' },
];

const CATEGORY_ICONS: Record<string, { icon: string; color: string }> = {
  route: { icon: '🛤️', color: 'border-l-emerald-400' },
  city: { icon: '🏘️', color: 'border-l-blue-400' },
  cave: { icon: '🕳️', color: 'border-l-stone-400' },
  mountain: { icon: '🌋', color: 'border-l-orange-400' },
  water: { icon: '🌊', color: 'border-l-cyan-400' },
  building: { icon: '🏛️', color: 'border-l-gray-400' },
  special: { icon: '⭐', color: 'border-l-yellow-400' },
};

export function AlolaMap() {
  const [activeIsland, setActiveIsland] = useState('melemele');
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);

  const islandConfig = ISLANDS.find(i => i.id === activeIsland)!;
  const islandRoutes = routes.filter((r: any) => r.island === activeIsland);

  return (
    <div className="space-y-4">
      {/* Island selector tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {ISLANDS.map(island => {
          const count = routes.filter((r: any) => r.island === island.id).length;
          return (
            <button
              key={island.id}
              onClick={() => { setActiveIsland(island.id); setExpandedRoute(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeIsland === island.id
                  ? `bg-gradient-to-r ${island.bg} text-white shadow-lg scale-[1.02]`
                  : 'bg-card border border-border text-muted-foreground hover:bg-accent/50'
              }`}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: island.color }} />
              {island.name}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeIsland === island.id ? 'bg-white/20' : 'bg-muted'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Route flow - visual connected list */}
      <div className="relative">
        {/* Connection line running down the left side */}
        <div
          className="absolute left-6 top-6 bottom-6 w-0.5 rounded-full"
          style={{ backgroundColor: islandConfig.color + '30' }}
        />

        <div className="space-y-3">
          {islandRoutes.map((route: any, idx: number) => {
            const catInfo = CATEGORY_ICONS[route.category] || CATEGORY_ICONS.route;
            const encounters = route.encounters || [];
            const items = route.items || [];
            const isExpanded = expandedRoute === route.slug;
            const topEncounters = [...encounters].sort((a: any, b: any) => (b.percentage || 0) - (a.percentage || 0)).slice(0, 5);

            return (
              <div key={route.slug} className="relative pl-12">
                {/* Node dot on the connection line */}
                <div
                  className="absolute left-[18px] top-5 w-5 h-5 rounded-full border-[3px] border-white dark:border-gray-900 z-10 shadow-sm"
                  style={{ backgroundColor: islandConfig.color }}
                />

                {/* Route card */}
                <div
                  className={`rounded-xl border-l-4 ${catInfo.color} bg-card border border-border overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                    isExpanded ? 'shadow-md ring-1 ring-primary/20' : ''
                  }`}
                  onClick={() => setExpandedRoute(isExpanded ? null : route.slug)}
                >
                  {/* Header row - always visible */}
                  <div className="p-4 flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">{catInfo.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-foreground">{route.name}</h3>
                        <Badge variant="outline" className="text-[10px] capitalize">{route.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{route.description}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                      <span className="flex items-center gap-1" title="Pokemon encounters">
                        <Users size={13} /> {encounters.length}
                      </span>
                      <span className="flex items-center gap-1" title="Items">
                        <Package size={13} /> {items.length}
                      </span>
                      <ChevronRight size={16} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-border animate-fadein">
                      {/* Top encounters mini-table */}
                      {topEncounters.length > 0 && (
                        <div className="p-4 pb-2">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Top Encounters
                          </h4>
                          <div className="space-y-2">
                            {topEncounters.map((enc: any, i: number) => (
                              <div key={i} className="flex items-center gap-3">
                                <img
                                  src={enc.sprite || spriteUrl(0)}
                                  alt={enc.pokemon}
                                  width={32}
                                  height={32}
                                  className="pixelated flex-shrink-0"
                                />
                                <span className="text-sm font-medium text-foreground w-28 truncate">{enc.pokemon}</span>
                                <div className="flex gap-1 flex-shrink-0">
                                  {(enc.types || []).map((t: string) => (
                                    <TypeBadge key={t} type={t as any} size="xs" />
                                  ))}
                                </div>
                                <div className="flex-1">
                                  <PercentBar percent={enc.percentage || 0} />
                                </div>
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                  Lv.{enc.levelRange?.[0]}–{enc.levelRange?.[1]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Items preview */}
                      {items.length > 0 && (
                        <div className="px-4 pb-2">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                            Items
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {items.slice(0, 6).map((item: any, i: number) => (
                              <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${
                                item.hidden
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {item.hidden && '🔍 '}{typeof item === 'string' ? item : item.name}
                              </span>
                            ))}
                            {items.length > 6 && (
                              <span className="text-xs text-muted-foreground">+{items.length - 6} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Story relevance */}
                      {route.storyRelevance && (
                        <div className="px-4 pb-2">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            Story
                          </h4>
                          <p className="text-xs text-muted-foreground">{route.storyRelevance}</p>
                        </div>
                      )}

                      {/* Full guide link */}
                      <div className="px-4 py-3 bg-muted/30">
                        <Link
                          href={`/routes/${route.slug}`}
                          className="flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline"
                          onClick={e => e.stopPropagation()}
                        >
                          View Full Route Guide <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* No routes message */}
      {islandRoutes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <MapPin size={32} className="mx-auto mb-2 opacity-40" />
          <p className="font-medium">No routes added for this island yet</p>
          <p className="text-sm mt-1">Route data for {islandConfig.name} Island coming soon</p>
        </div>
      )}
    </div>
  );
}
