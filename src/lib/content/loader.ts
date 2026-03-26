import type { Pokemon, Route, StoryStep, Item, Tip } from '@/types';

import pokemonData from '@/content/pokemon/pokemon.json';
import routeData from '@/content/routes/routes.json';
import storyData from '@/content/story/story.json';
import itemData from '@/content/items/items.json';
import tipData from '@/content/tips/tips.json';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function getAllPokemon(): Pokemon[] { return pokemonData as any; }
export function getPokemonBySlug(slug: string): Pokemon | undefined { return getAllPokemon().find(p => p.slug === slug); }
export function getAllRoutes(): Route[] { return routeData as any; }
export function getRouteBySlug(slug: string): Route | undefined { return getAllRoutes().find(r => r.slug === slug); }
export function getRoutesByIsland(island: string): Route[] { return getAllRoutes().filter(r => r.island === island); }
export function getAllStorySteps(): StoryStep[] { return storyData as any; }
export function getStoryBySlug(slug: string): StoryStep | undefined { return getAllStorySteps().find(s => s.slug === slug); }
export function getAllItems(): Item[] { return itemData as any; }
export function getItemBySlug(slug: string): Item | undefined { return getAllItems().find(i => i.slug === slug); }
export function getAllTips(): Tip[] { return tipData as any; }
