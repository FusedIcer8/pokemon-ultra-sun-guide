'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

export function FavoriteButton({ id, size = 18 }: { id: string; size?: number }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(id);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(id); }}
      className={`transition-all hover:scale-110 active:scale-95 ${active ? 'text-red-500' : 'text-gray-300 hover:text-red-300'}`}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart size={size} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}
