import type { Island } from '@/types';
import { ISLAND_COLORS } from '@/lib/utils';

const ISLAND_NAMES: Record<string, string> = {
  melemele: "Melemele",
  akala: "Akala",
  'ula-ula': "Ula'ula",
  poni: "Poni",
  aether: "Aether",
};

export function IslandBadge({ island, size = 'sm' }: { island: Island; size?: 'sm' | 'md' }) {
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1' };
  return (
    <span className={`inline-flex items-center rounded-full font-semibold border ${ISLAND_COLORS[island] || ''} ${sizes[size]}`}>
      {ISLAND_NAMES[island] || island}
    </span>
  );
}
