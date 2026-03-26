'use client';

import { useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import type { SearchResult } from '@/types';
import pokemonData from '@/content/pokemon/pokemon.json';
import routeData from '@/content/routes/routes.json';
import storyData from '@/content/story/story.json';
import itemData from '@/content/items/items.json';
import tipData from '@/content/tips/tips.json';
import { spriteUrl } from '@/lib/utils';

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const p of pokemonData as any[]) {
    results.push({
      type: 'pokemon',
      id: p.slug,
      title: `#${p.id} ${p.name}`,
      description: p.description,
      icon: spriteUrl(p.id),
      link: `/pokemon/${p.slug}`,
      tags: [...p.types, ...(p.abilities?.map((a: any) => a.name) ?? [])],
    });
  }

  for (const r of routeData as any[]) {
    results.push({
      type: 'route',
      id: r.slug,
      title: r.name,
      description: r.description,
      icon: '🗺️',
      link: `/routes/${r.slug}`,
      tags: [r.island, r.category],
    });
  }

  for (const s of storyData as any[]) {
    results.push({
      type: 'story',
      id: s.slug,
      title: s.title,
      description: s.summary,
      icon: '📖',
      link: `/story/${s.slug}`,
      tags: [s.island],
    });
  }

  for (const i of itemData as any[]) {
    results.push({
      type: 'item',
      id: i.slug,
      title: i.name,
      description: i.description,
      icon: i.icon,
      link: `/items/${i.slug}`,
      tags: [i.category],
    });
  }

  for (const t of tipData as any[]) {
    results.push({
      type: 'tip',
      id: t.id,
      title: t.title,
      description: t.description,
      icon: t.icon,
      link: '/tips',
      tags: t.tags,
    });
  }

  return results;
}

export function useSearch() {
  const { allItems, fuse } = useMemo(() => {
    const allItems = buildSearchIndex();
    const fuse = new Fuse(allItems, {
      threshold: 0.35,
      keys: [
        { name: 'title', weight: 2.5 },
        { name: 'tags', weight: 1.5 },
        { name: 'description', weight: 1 },
      ],
    });
    return { allItems, fuse };
  }, []);

  const search = useCallback((query: string) => {
    if (!query.trim()) return [];
    return fuse.search(query, { limit: 30 });
  }, [fuse]);

  return { search, allItems };
}
