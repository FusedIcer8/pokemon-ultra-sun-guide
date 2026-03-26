'use client';
import { useLocalStorage } from './useLocalStorage';
import { useCallback } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('usum-favorites', []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }, [setFavorites]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite, count: favorites.length };
}
