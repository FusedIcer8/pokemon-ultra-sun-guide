'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MapLocation {
  slug: string;
  name: string;
  island: string;
  category: string;
  x: number; // percentage position
  y: number;
  encounterCount: number;
  connections: string[]; // slugs of connected locations
}

// Alola region map positions — each island is a cluster
const MAP_DATA: MapLocation[] = [
  // Melemele Island (top-left cluster)
  { slug: 'route-1', name: 'Route 1', island: 'melemele', category: 'route', x: 18, y: 28, encounterCount: 9, connections: ['hauoli-city', 'verdant-cavern'] },
  { slug: 'route-2', name: 'Route 2', island: 'melemele', category: 'route', x: 12, y: 42, encounterCount: 9, connections: ['route-1', 'verdant-cavern'] },
  { slug: 'verdant-cavern', name: 'Verdant Cavern', island: 'melemele', category: 'cave', x: 8, y: 32, encounterCount: 3, connections: ['route-2'] },
  { slug: 'hauoli-city', name: "Hau'oli City", island: 'melemele', category: 'city', x: 24, y: 18, encounterCount: 7, connections: ['route-1'] },

  // Akala Island (center cluster)
  { slug: 'route-4', name: 'Route 4', island: 'akala', category: 'route', x: 42, y: 35, encounterCount: 7, connections: ['route-5', 'brooklet-hill'] },
  { slug: 'route-5', name: 'Route 5', island: 'akala', category: 'route', x: 48, y: 48, encounterCount: 7, connections: ['route-4', 'brooklet-hill'] },
  { slug: 'brooklet-hill', name: 'Brooklet Hill', island: 'akala', category: 'water', x: 55, y: 38, encounterCount: 8, connections: ['route-5', 'wela-volcano-park'] },
  { slug: 'wela-volcano-park', name: 'Wela Volcano Park', island: 'akala', category: 'mountain', x: 62, y: 52, encounterCount: 5, connections: ['brooklet-hill', 'lush-jungle'] },
  { slug: 'lush-jungle', name: 'Lush Jungle', island: 'akala', category: 'route', x: 70, y: 42, encounterCount: 11, connections: ['wela-volcano-park', 'route-8'] },
  { slug: 'route-8', name: 'Route 8', island: 'akala', category: 'route', x: 78, y: 55, encounterCount: 6, connections: ['lush-jungle'] },
];

const ISLAND_COLORS: Record<string, { bg: string; ring: string; text: string; gradient: string }> = {
  melemele: { bg: 'bg-yellow-400', ring: 'ring-yellow-300', text: 'text-yellow-800', gradient: 'from-yellow-50 to-amber-50' },
  akala: { bg: 'bg-rose-400', ring: 'ring-rose-300', text: 'text-rose-800', gradient: 'from-rose-50 to-pink-50' },
  'ula-ula': { bg: 'bg-red-500', ring: 'ring-red-300', text: 'text-red-800', gradient: 'from-red-50 to-orange-50' },
  poni: { bg: 'bg-purple-500', ring: 'ring-purple-300', text: 'text-purple-800', gradient: 'from-purple-50 to-violet-50' },
};

const CATEGORY_ICONS: Record<string, string> = {
  route: '🛤️', city: '🏘️', cave: '🕳️', mountain: '🌋', water: '🌊', building: '🏛️', special: '⭐',
};

export function AlolaMap({ activeSlug, island }: { activeSlug?: string; island?: string }) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(activeSlug ?? null);

  const filteredLocations = island ? MAP_DATA.filter(l => l.island === island) : MAP_DATA;
  const selectedLocation = MAP_DATA.find(l => l.slug === (hoveredSlug ?? selectedSlug));

  return (
    <div className="space-y-4">
      {/* Map */}
      <div className="map-container aspect-[16/9] bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100 dark:from-sky-950 dark:via-cyan-950 dark:to-blue-950 relative">
        {/* Ocean background pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="waves" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20 Q 20 10, 40 20 Q 60 30, 80 20" fill="none" stroke="currentColor" strokeWidth="1" className="text-sky-300 dark:text-sky-700" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves)" />
          </svg>
        </div>

        {/* Island land masses */}
        <div className="absolute top-[10%] left-[3%] w-[30%] h-[55%] rounded-[40%] bg-gradient-to-br from-green-200 to-emerald-300 dark:from-green-900 dark:to-emerald-800 opacity-40 blur-sm" />
        <div className="absolute top-[20%] left-[35%] w-[50%] h-[60%] rounded-[35%] bg-gradient-to-br from-green-200 to-lime-300 dark:from-green-900 dark:to-lime-800 opacity-40 blur-sm" />

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {filteredLocations.map(loc =>
            loc.connections
              .map(connSlug => {
                const conn = MAP_DATA.find(l => l.slug === connSlug);
                if (!conn || (island && conn.island !== island)) return null;
                return (
                  <line
                    key={`${loc.slug}-${connSlug}`}
                    x1={`${loc.x}%`} y1={`${loc.y}%`}
                    x2={`${conn.x}%`} y2={`${conn.y}%`}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    className="text-gray-400 dark:text-gray-600"
                    opacity={0.5}
                  />
                );
              })
          )}
        </svg>

        {/* Location nodes */}
        {filteredLocations.map(loc => {
          const colors = ISLAND_COLORS[loc.island] || ISLAND_COLORS.melemele;
          const isActive = loc.slug === activeSlug;
          const isHovered = loc.slug === hoveredSlug;
          const isSelected = loc.slug === selectedSlug;

          return (
            <Link
              key={loc.slug}
              href={`/routes/${loc.slug}`}
              className={`map-node flex flex-col items-center gap-0.5 ${isActive ? 'active' : ''}`}
              style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredSlug(loc.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              onClick={(e) => { e.preventDefault(); setSelectedSlug(loc.slug); }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white dark:border-gray-700 transition-all ${
                isActive || isHovered || isSelected
                  ? `${colors.bg} ring-4 ${colors.ring} scale-110`
                  : `${colors.bg} opacity-90`
              }`}>
                {CATEGORY_ICONS[loc.category] || '📍'}
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm transition-opacity ${
                isHovered || isSelected || isActive
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 opacity-100'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 opacity-70'
              }`}>
                {loc.name}
              </span>
            </Link>
          );
        })}

        {/* Island labels */}
        {!island && (
          <>
            <span className="absolute top-[8%] left-[15%] text-xs font-bold text-yellow-600/60 dark:text-yellow-400/40 tracking-wider uppercase">Melemele</span>
            <span className="absolute top-[15%] left-[52%] text-xs font-bold text-rose-600/60 dark:text-rose-400/40 tracking-wider uppercase">Akala</span>
          </>
        )}
      </div>

      {/* Selected location info panel */}
      {selectedLocation && (
        <div className="p-4 rounded-xl bg-card border border-border animate-fadein">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{CATEGORY_ICONS[selectedLocation.category]}</span>
              <div>
                <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-xs capitalize">{selectedLocation.island}</Badge>
                  <Badge variant="outline" className="text-xs capitalize">{selectedLocation.category}</Badge>
                  <span className="text-xs text-muted-foreground">{selectedLocation.encounterCount} Pokemon</span>
                </div>
              </div>
            </div>
            <Link
              href={`/routes/${selectedLocation.slug}`}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View Details <ChevronRight size={14} />
            </Link>
          </div>

          {/* Connections */}
          {selectedLocation.connections.length > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <MapPin size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Connected to:</span>
              {selectedLocation.connections.map(slug => {
                const conn = MAP_DATA.find(l => l.slug === slug);
                return conn ? (
                  <button
                    key={slug}
                    onClick={() => setSelectedSlug(slug)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {conn.name}
                  </button>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
