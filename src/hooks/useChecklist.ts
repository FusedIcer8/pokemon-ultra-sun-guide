'use client';
import { useLocalStorage } from './useLocalStorage';
import { useCallback } from 'react';

export function useChecklist() {
  const [checklists, setChecklists] = useLocalStorage<Record<string, string[]>>('usum-checklists', {});

  const isChecked = useCallback((list: string, id: string) =>
    (checklists[list] ?? []).includes(id), [checklists]);

  const toggleCheck = useCallback((list: string, id: string) => {
    setChecklists(prev => {
      const current = prev[list] ?? [];
      return {
        ...prev,
        [list]: current.includes(id) ? current.filter(i => i !== id) : [...current, id],
      };
    });
  }, [setChecklists]);

  const getProgress = useCallback((list: string, total: number) => {
    const checked = (checklists[list] ?? []).length;
    return { checked, total, percent: total > 0 ? Math.round((checked / total) * 100) : 0 };
  }, [checklists]);

  return { isChecked, toggleCheck, getProgress };
}
