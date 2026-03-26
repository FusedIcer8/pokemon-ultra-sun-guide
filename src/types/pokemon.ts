export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface Pokemon {
  id: number;
  slug: string;
  name: string;
  types: PokemonType[];
  abilities: { name: string; hidden?: boolean }[];
  baseStats: {
    hp: number; attack: number; defense: number;
    spAtk: number; spDef: number; speed: number;
  };
  locations: PokemonLocation[];
  evolution: EvolutionStage[];
  learnset: LearnsetEntry[];
  description: string;
  sprite: string;
}

export interface PokemonLocation {
  route: string;
  routeSlug: string;
  method: EncounterMethod;
  percentage: number;
  levelRange: [number, number];
  timeOfDay?: 'day' | 'night' | 'any';
  weather?: string;
  notes?: string;
}

export type EncounterMethod =
  | 'walking' | 'surfing' | 'fishing-old' | 'fishing-good' | 'fishing-super'
  | 'gift' | 'trade' | 'sos-only' | 'special' | 'island-scan' | 'ambush';

export interface EvolutionStage {
  pokemon: string;
  pokemonSlug: string;
  sprite: string;
  condition: string;
  stage: number;
}

export interface LearnsetEntry {
  level: number | 'egg' | 'tm' | 'tutor' | 'evo';
  move: string;
  type: PokemonType;
  category: 'physical' | 'special' | 'status';
  power?: number;
  accuracy?: number;
}
