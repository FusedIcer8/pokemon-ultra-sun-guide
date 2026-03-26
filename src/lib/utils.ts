import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-stone-400 text-white',
  fire: 'bg-red-500 text-white',
  water: 'bg-blue-500 text-white',
  electric: 'bg-yellow-400 text-black',
  grass: 'bg-green-500 text-white',
  ice: 'bg-cyan-300 text-black',
  fighting: 'bg-orange-700 text-white',
  poison: 'bg-purple-500 text-white',
  ground: 'bg-amber-600 text-white',
  flying: 'bg-indigo-300 text-black',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-white',
  rock: 'bg-amber-800 text-white',
  ghost: 'bg-purple-800 text-white',
  dragon: 'bg-violet-700 text-white',
  dark: 'bg-stone-800 text-white',
  steel: 'bg-slate-400 text-white',
  fairy: 'bg-pink-300 text-black',
};

export const ISLAND_COLORS: Record<string, string> = {
  melemele: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  akala: 'bg-rose-100 text-rose-800 border-rose-300',
  'ula-ula': 'bg-red-100 text-red-800 border-red-300',
  poni: 'bg-purple-100 text-purple-800 border-purple-300',
  aether: 'bg-sky-100 text-sky-800 border-sky-300',
};

export const METHOD_LABELS: Record<string, string> = {
  walking: 'Tall Grass',
  surfing: 'Surfing',
  'fishing-old': 'Old Rod',
  'fishing-good': 'Good Rod',
  'fishing-super': 'Super Rod',
  gift: 'Gift',
  trade: 'In-Game Trade',
  'sos-only': 'SOS Only',
  special: 'Special',
  'island-scan': 'Island Scan',
  ambush: 'Ambush / Rustling',
};

export const RARITY_COLORS: Record<string, string> = {
  common: 'text-green-600',
  uncommon: 'text-blue-600',
  rare: 'text-purple-600',
  'very-rare': 'text-orange-600',
  legendary: 'text-yellow-600',
};

export function getRarityFromPercent(pct: number): string {
  if (pct >= 20) return 'common';
  if (pct >= 10) return 'uncommon';
  if (pct >= 4) return 'rare';
  if (pct >= 1) return 'very-rare';
  return 'legendary';
}

export function formatPercent(pct: number): string {
  return pct % 1 === 0 ? `${pct}%` : `${pct.toFixed(1)}%`;
}

export function spriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
