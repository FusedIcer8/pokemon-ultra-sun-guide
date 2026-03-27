'use client';

import { useState } from 'react';
import Link from 'next/link';
import storyData from '@/content/story/story.json';
import { useChecklist } from '@/hooks/useChecklist';
import { IslandBadge } from '@/components/shared/IslandBadge';
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
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Story Walkthrough</h1>
        <p className="text-gray-500 text-sm mb-5">
          Follow the main story of Pokemon Ultra Sun step by step.
        </p>

        {/* Progress bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Story Progress</span>
            <span className="text-sm font-bold text-red-600">
              {progress.checked}/{progress.total} ({progress.percent}%)
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Island Filter */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-1">
        {ISLANDS.map((island) => (
          <button
            key={island.value}
            onClick={() => setActiveTab(island.value)}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors whitespace-nowrap ${
              activeTab === island.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            {island.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="flex flex-col gap-4">
          {filteredSteps.map((step) => {
            const checked = isChecked('story', step.id);
            return (
              <div key={step.id} className="relative pl-12">
                {/* Timeline node */}
                <button
                  onClick={() => toggleCheck('story', step.id)}
                  className="absolute left-3 top-6 z-10 w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center"
                  style={{
                    borderColor: checked ? '#22c55e' : '#d1d5db',
                    backgroundColor: checked ? '#22c55e' : '#ffffff',
                  }}
                  aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
                >
                  {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div
                  className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all ${
                    checked ? 'opacity-60' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-sm text-red-500 font-bold">Ch. {step.chapter}</span>
                    <IslandBadge island={step.island as 'melemele' | 'akala' | 'ula-ula' | 'poni' | 'aether'} size="sm" />
                    {checked && (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Complete
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{step.summary}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {step.objectives.length} objective{step.objectives.length !== 1 ? 's' : ''}
                    </span>
                    <Link
                      href={`/story/${step.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      Continue
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredSteps.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg font-medium text-gray-400">No story steps for this island</p>
        </div>
      )}
    </div>
  );
}
