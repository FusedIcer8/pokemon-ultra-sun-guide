'use client';

import { useState } from 'react';
import Link from 'next/link';
import storyData from '@/content/story/story.json';
import { useChecklist } from '@/hooks/useChecklist';
import { IslandBadge } from '@/components/shared/IslandBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, BookOpen, CheckCircle2, Circle } from 'lucide-react';
import type { StoryStep } from '@/types';

const steps = storyData as unknown as StoryStep[];

const ISLANDS = [
  { value: 'all', label: 'All Islands' },
  { value: 'melemele', label: 'Melemele' },
  { value: 'akala', label: 'Akala' },
  { value: 'ula-ula', label: "Ula'ula" },
  { value: 'poni', label: 'Poni' },
  { value: 'aether', label: 'Aether' },
];

export default function StoryPage() {
  const { isChecked, toggleCheck, getProgress } = useChecklist();
  const progress = getProgress('story', steps.length);
  const [activeTab, setActiveTab] = useState('all');

  const filteredSteps =
    activeTab === 'all'
      ? steps
      : steps.filter((s) => s.island === activeTab);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="text-red-500" size={28} />
          <h1 className="text-3xl font-bold">Story Walkthrough</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Follow the main story of Pokemon Ultra Sun step by step.
        </p>

        {/* Progress bar */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Story Progress
            </span>
            <span className="text-sm font-bold text-red-600">
              {progress.checked}/{progress.total} ({progress.percent}%)
            </span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Island Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="flex-wrap">
          {ISLANDS.map((island) => (
            <TabsTrigger key={island.value} value={island.value}>
              {island.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />

        <div className="flex flex-col gap-4">
          {filteredSteps.map((step) => {
            const checked = isChecked('story', step.id);
            return (
              <div key={step.id} className="relative pl-14">
                {/* Timeline node */}
                <button
                  onClick={() => toggleCheck('story', step.id)}
                  className="absolute left-3.5 top-6 z-10 transition-transform hover:scale-110"
                  aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
                >
                  {checked ? (
                    <CheckCircle2
                      size={20}
                      className="text-green-500 fill-green-500"
                    />
                  ) : (
                    <Circle
                      size={20}
                      className="text-gray-300 dark:text-gray-600"
                    />
                  )}
                </button>

                <Card
                  className={`transition-all ${
                    checked
                      ? 'opacity-60 border-green-200 dark:border-green-900'
                      : 'hover:shadow-md'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className="font-mono text-xs">
                        Ch. {step.chapter}
                      </Badge>
                      <IslandBadge island={step.island as any} size="sm" />
                      {checked && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          Complete
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {step.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {step.objectives.length} objective
                        {step.objectives.length !== 1 ? 's' : ''}
                      </span>
                      <Link
                        href={`/story/${step.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                      >
                        Continue
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {filteredSteps.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No story steps for this island</p>
        </div>
      )}
    </div>
  );
}
