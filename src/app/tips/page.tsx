'use client';

import { useState } from 'react';
import tipData from '@/content/tips/tips.json';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import type { Tip } from '@/types';

const tips = tipData as any[] as Tip[];

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'grinding', label: 'Grinding' },
  { value: 'money', label: 'Money' },
  { value: 'team', label: 'Team Building' },
  { value: 'qol', label: 'QoL' },
  { value: 'missable', label: 'Missable' },
];

const CATEGORY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  advanced: 'bg-purple-100 text-purple-700',
  grinding: 'bg-orange-100 text-orange-700',
  money: 'bg-yellow-100 text-yellow-800',
  team: 'bg-blue-100 text-blue-700',
  qol: 'bg-cyan-100 text-cyan-700',
  missable: 'bg-red-100 text-red-700',
};

const PHASE_COLORS: Record<string, string> = {
  early: 'bg-green-100 text-green-700',
  mid: 'bg-blue-100 text-blue-700',
  late: 'bg-purple-100 text-purple-700',
  all: 'bg-gray-100 text-gray-700',
};

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTips =
    activeCategory === 'all'
      ? tips
      : tips.filter((t) => t.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tips & Tricks</h1>
        <p className="text-gray-500">
          Helpful tips to make your Pokemon Ultra Sun journey smoother.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat.value
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-400 mb-4">
        {filteredTips.length} tip{filteredTips.length !== 1 ? 's' : ''}
      </p>

      {/* Tips list */}
      <div className="flex flex-col gap-3">
        {filteredTips.map((tip) => {
          const isExpanded = expandedId === tip.id;

          return (
            <div
              key={tip.id}
              className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-all"
              onClick={() => toggleExpand(tip.id)}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{tip.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">{tip.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <FavoriteButton id={`tip-${tip.id}`} size={16} />
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span
                      className={`text-xs rounded-full px-2 py-0.5 font-medium capitalize ${
                        CATEGORY_COLORS[tip.category] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tip.category}
                    </span>
                    <span
                      className={`text-xs rounded-full px-2 py-0.5 font-medium capitalize ${
                        PHASE_COLORS[tip.gamePhase] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tip.gamePhase === 'all' ? 'Any Phase' : tip.gamePhase}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">{tip.description}</p>

                  {isExpanded && (
                    <div className="bg-gray-50 rounded-lg p-4 mt-3">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {tip.detail}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTips.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4 opacity-30">💡</p>
          <p className="text-lg font-medium text-gray-400">No tips in this category</p>
          <p className="text-sm text-gray-400 mt-1">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}
