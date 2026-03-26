'use client';

import { useState } from 'react';
import tipData from '@/content/tips/tips.json';
import { FavoriteButton } from '@/components/shared/FavoriteButton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import type { Tip } from '@/types';

const tips = tipData as unknown as Tip[];

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
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  grinding: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  money: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  team: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  qol: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  missable: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const PHASE_COLORS: Record<string, string> = {
  early: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  mid: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  late: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  all: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
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
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="text-yellow-500" size={28} />
          <h1 className="text-3xl font-bold">Tips & Tricks</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Helpful tips to make your Pokemon Ultra Sun journey smoother.
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
        <TabsList className="flex-wrap">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        {filteredTips.length} tip{filteredTips.length !== 1 ? 's' : ''}
      </p>

      {/* Tips list */}
      <div className="flex flex-col gap-3">
        {filteredTips.map((tip) => {
          const isExpanded = expandedId === tip.id;

          return (
            <Card
              key={tip.id}
              className="transition-all hover:shadow-sm cursor-pointer"
              onClick={() => toggleExpand(tip.id)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{tip.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-sm">{tip.title}</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <FavoriteButton id={`tip-${tip.id}`} size={16} />
                        {isExpanded ? (
                          <ChevronUp size={16} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <Badge
                        className={`text-[10px] ${
                          CATEGORY_COLORS[tip.category] || ''
                        }`}
                      >
                        {tip.category}
                      </Badge>
                      <Badge
                        className={`text-[10px] ${PHASE_COLORS[tip.gamePhase]}`}
                      >
                        {tip.gamePhase === 'all' ? 'Any Phase' : tip.gamePhase}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tip.description}
                    </p>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {tip.detail}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTips.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Lightbulb size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No tips in this category</p>
          <p className="text-sm mt-1">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}
