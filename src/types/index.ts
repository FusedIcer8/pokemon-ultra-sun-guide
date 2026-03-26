export * from './pokemon';
export * from './route';

export interface StoryStep {
  id: string;
  slug: string;
  chapter: number;
  island: string;
  title: string;
  summary: string;
  objectives: { task: string; hint: string; spoiler: string }[];
  blockers: { problem: string; solution: string }[];
  keyItems: string[];
  rewards: string[];
  nextStep: string | null;
}

export interface Item {
  id: string;
  slug: string;
  name: string;
  category: ItemCategory;
  description: string;
  location: string;
  locationSlug: string;
  howToGet: string;
  missable: boolean;
  gamePhase: 'early' | 'mid' | 'late' | 'postgame';
  relatedPokemon?: string[];
  icon: string;
}

export type ItemCategory =
  | 'tm' | 'key-item' | 'z-crystal' | 'evolution-item'
  | 'held-item' | 'medicine' | 'berry' | 'valuable' | 'battle-item';

export interface Tip {
  id: string;
  title: string;
  category: 'beginner' | 'advanced' | 'grinding' | 'money' | 'team' | 'qol' | 'missable';
  description: string;
  detail: string;
  tags: string[];
  gamePhase: 'early' | 'mid' | 'late' | 'all';
  icon: string;
}

export interface SearchResult {
  type: 'pokemon' | 'route' | 'item' | 'story' | 'tip';
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  tags: string[];
}
