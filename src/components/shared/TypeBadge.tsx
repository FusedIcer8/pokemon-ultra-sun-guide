import type { PokemonType } from '@/types';

export function TypeBadge({ type, size = 'sm' }: { type: PokemonType; size?: 'xs' | 'sm' | 'md' }) {
  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };
  return (
    <span className={`type-${type} inline-flex items-center rounded-full font-semibold capitalize ${sizes[size]}`}>
      {type}
    </span>
  );
}
