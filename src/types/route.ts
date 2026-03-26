import type { PokemonType, EncounterMethod } from './pokemon';

export interface Route {
  slug: string;
  name: string;
  island: Island;
  category: RouteCategory;
  description: string;
  storyRelevance: string;
  unlockCondition: string;
  encounters: RouteEncounter[];
  items: RouteItem[];
  trainers: RouteTrainer[];
  tips: string;
  connectedRoutes: { name: string; slug: string }[];
}

export type Island = 'melemele' | 'akala' | 'ula-ula' | 'poni' | 'aether';
export type RouteCategory = 'route' | 'city' | 'cave' | 'mountain' | 'water' | 'building' | 'special';

export interface RouteEncounter {
  pokemon: string;
  pokemonSlug: string;
  types: PokemonType[];
  method: EncounterMethod;
  percentage: number;
  levelRange: [number, number];
  timeOfDay?: 'day' | 'night' | 'any';
  notes?: string;
  sprite: string;
}

export interface RouteItem {
  name: string;
  itemSlug: string;
  location: string;
  hidden: boolean;
  requiresAbility?: string;
  notes?: string;
}

export interface RouteTrainer {
  name: string;
  type: string;
  pokemon: string[];
  notes?: string;
}
