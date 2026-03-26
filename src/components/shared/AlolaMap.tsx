'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, MapPin, Compass } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MapHotspot {
  slug: string;
  name: string;
  island: string;
  category: string;
  // Position as % of image dimensions
  x: number;
  y: number;
  encounterCount: number;
}

// Hotspot positions mapped to the official USUM artwork (1280x905)
// Islands roughly: Melemele=bottom-left, Akala=top-center, Ula'ula=top-right area, Poni=bottom-right
const HOTSPOTS: MapHotspot[] = [
  // Melemele Island (bottom-left island)
  { slug: 'route-1', name: 'Route 1', island: 'melemele', category: 'route', x: 22, y: 68, encounterCount: 9 },
  { slug: 'route-2', name: 'Route 2', island: 'melemele', category: 'route', x: 16, y: 58, encounterCount: 9 },
  { slug: 'verdant-cavern', name: 'Verdant Cavern', island: 'melemele', category: 'cave', x: 10, y: 52, encounterCount: 3 },
  { slug: 'hauoli-city', name: "Hau'oli City", island: 'melemele', category: 'city', x: 28, y: 56, encounterCount: 7 },

  // Akala Island (top-center island)
  { slug: 'route-4', name: 'Route 4', island: 'akala', category: 'route', x: 38, y: 22, encounterCount: 7 },
  { slug: 'route-5', name: 'Route 5', island: 'akala', category: 'route', x: 44, y: 16, encounterCount: 7 },
  { slug: 'brooklet-hill', name: 'Brooklet Hill', island: 'akala', category: 'water', x: 50, y: 24, encounterCount: 8 },
  { slug: 'wela-volcano-park', name: 'Wela Volcano', island: 'akala', category: 'mountain', x: 56, y: 18, encounterCount: 5 },
  { slug: 'lush-jungle', name: 'Lush Jungle', island: 'akala', category: 'route', x: 48, y: 30, encounterCount: 11 },
  { slug: 'route-8', name: 'Route 8', island: 'akala', category: 'route', x: 54, y: 32, encounterCount: 6 },
];

const ISLAND_STYLES: Record<string, { dot: string; glow: string; label: string }> = {
  melemele: { dot: 'bg-yellow-400 border-yellow-200', glow: 'shadow-[0_0_12px_rgba(250,204,21,0.7)]', label: 'text-yellow-200' },
  akala: { dot: 'bg-rose-400 border-rose-200', glow: 'shadow-[0_0_12px_rgba(251,113,133,0.7)]', label: 'text-rose-200' },
  'ula-ula': { dot: 'bg-red-500 border-red-200', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.7)]', label: 'text-red-200' },
  poni: { dot: 'bg-purple-400 border-purple-200', glow: 'shadow-[0_0_12px_rgba(192,132,252,0.7)]', label: 'text-purple-200' },
};

const CATEGORY_ICONS: Record<string, string> = {
  route: '🛤️', city: '🏘️', cave: '🕳️', mountain: '🌋', water: '🌊', building: '🏛️', special: '⭐',
};

export function AlolaMap({ activeSlug, island }: { activeSlug?: string; island?: string }) {
  const [selected, setSelected] = useState<string | null>(activeSlug ?? null);
  const [hovered, setHovered] = useState<string | null>(null);

  const visibleHotspots = island ? HOTSPOTS.filter(h => h.island === island) : HOTSPOTS;
  const activeHotspot = HOTSPOTS.find(h => h.slug === (hovered ?? selected));

  return (
    <div className="space-y-3">
      {/* Map with artwork background */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-200/50 dark:border-amber-800/30 shadow-xl">
        {/* The actual illustrated map */}
        <div className="relative w-full aspect-[1280/905]">
          <Image
            src="/maps/alola-full.png"
            alt="Alola Region Map"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            priority
          />

          {/* Subtle dark overlay for contrast with hotspots */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />

          {/* Hotspot markers */}
          {visibleHotspots.map(spot => {
            const styles = ISLAND_STYLES[spot.island] || ISLAND_STYLES.melemele;
            const isActive = spot.slug === activeSlug;
            const isHovered = spot.slug === hovered;
            const isSelected = spot.slug === selected;
            const highlighted = isActive || isHovered || isSelected;

            return (
              <button
                key={spot.slug}
                className="absolute z-10 group"
                style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setHovered(spot.slug)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(spot.slug === selected ? null : spot.slug)}
              >
                {/* Pulse ring on active */}
                {highlighted && (
                  <span className={`absolute inset-[-6px] rounded-full ${styles.dot} opacity-30 animate-ping`} />
                )}

                {/* Dot marker */}
                <span className={`relative flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-all duration-200 ${styles.dot} ${
                  highlighted ? `scale-125 ${styles.glow}` : 'scale-100 shadow-md'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>

                {/* Tooltip label */}
                <span className={`absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-200 ${
                  highlighted
                    ? 'bg-gray-900/90 text-white opacity-100 scale-100'
                    : 'bg-gray-900/70 text-white/90 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
                }`}>
                  {spot.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Map legend (bottom overlay) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-3 md:p-4 pointer-events-none">
          <div className="flex items-center gap-4 text-[10px] md:text-xs font-medium">
            <span className="flex items-center gap-1.5 text-white/80">
              <Compass size={12} /> Alola Region
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-200" />
              <span className="text-yellow-200">Melemele</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-200" />
              <span className="text-rose-200">Akala</span>
            </span>
          </div>
        </div>
      </div>

      {/* Selected location detail card */}
      {activeHotspot && (
        <div className="rounded-xl bg-card border border-border p-4 animate-fadein">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{CATEGORY_ICONS[activeHotspot.category]}</span>
              <div>
                <h3 className="font-bold text-base">{activeHotspot.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-[10px] capitalize">{activeHotspot.island}</Badge>
                  <Badge variant="outline" className="text-[10px] capitalize">{activeHotspot.category}</Badge>
                  <span className="text-xs text-muted-foreground">{activeHotspot.encounterCount} Pokemon</span>
                </div>
              </div>
            </div>
            <Link
              href={`/routes/${activeHotspot.slug}`}
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Open Guide <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
