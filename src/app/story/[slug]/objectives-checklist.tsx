'use client';

import { useChecklist } from '@/hooks/useChecklist';
import { SpoilerBlock } from '@/components/shared/SpoilerBlock';
import { CheckCircle2, Circle } from 'lucide-react';

interface Objective {
  task: string;
  hint: string;
  spoiler: string;
}

interface StoryObjectivesChecklistProps {
  stepId: string;
  objectives: Objective[];
}

export function StoryObjectivesChecklist({
  stepId,
  objectives,
}: StoryObjectivesChecklistProps) {
  const { isChecked, toggleCheck } = useChecklist();

  return (
    <div className="flex flex-col gap-4">
      {objectives.map((obj, i) => {
        const objId = `${stepId}-obj-${i}`;
        const checked = isChecked('story-objectives', objId);

        return (
          <div
            key={i}
            className={`rounded-lg border p-4 transition-all ${
              checked
                ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900'
                : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleCheck('story-objectives', objId)}
                className="mt-0.5 shrink-0 transition-transform hover:scale-110"
                aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
              >
                {checked ? (
                  <CheckCircle2
                    size={20}
                    className="text-green-500 fill-green-500"
                  />
                ) : (
                  <Circle size={20} className="text-gray-300 dark:text-gray-600" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium ${
                    checked
                      ? 'line-through text-gray-400'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {obj.task}
                </p>
                {obj.hint && (
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {obj.hint}
                  </p>
                )}
                {obj.spoiler && (
                  <div className="mt-3">
                    <SpoilerBlock label="Reveal solution">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {obj.spoiler}
                      </p>
                    </SpoilerBlock>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
